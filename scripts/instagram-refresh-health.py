"""Classify refresh health using source outcomes, never overall workflow success.

Step marker names are a small persisted protocol in the GitHub Jobs API. They
survive a tolerated single source outage without adding data commits or secrets.
"""
import argparse
from datetime import datetime, timezone
import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


VERIFIED = 'Instagram source verified'
UNAVAILABLE = 'Instagram source unavailable'
LEGACY = 'Run python scripts/refresh-instagram.py'


def source_result(jobs):
    steps = [step for job in jobs for step in job.get('steps', [])]
    for name, result in ((VERIFIED, 'success'), (UNAVAILABLE, 'failure')):
        if any(s.get('name') == name and s.get('conclusion') == 'success' for s in steps):
            return result
    # Before this change the refresh step did not use continue-on-error.
    for step in steps:
        if step.get('name') == LEGACY and step.get('conclusion') in ('success', 'failure'):
            return step['conclusion']
    return None


def api_get(path):
    request = Request('https://api.github.com' + path, headers={
        'Authorization': 'Bearer ' + os.environ['GITHUB_TOKEN'],
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'TimberStore-instagram-health/1.0',
    })
    try:
        with urlopen(request, timeout=20) as response:
            return json.load(response)
    except HTTPError as error:
        status = error.code
        error.close()
        raise RuntimeError(f'GitHub history unavailable (HTTP {status})') from None
    except (URLError, OSError, ValueError):
        raise RuntimeError('GitHub history unavailable (network or invalid JSON)') from None


def previous_source_run(repo, current_run, get=api_get):
    # Only actual acquisitions on main count; PR tests and branch diagnostics do not.
    params = urlencode({'branch': 'main', 'status': 'completed', 'per_page': 30})
    history = get(f'/repos/{repo}/actions/workflows/refresh-instagram.yml/runs?{params}')
    for run in history['workflow_runs']:
        if str(run['id']) == str(current_run) or run.get('event') not in ('schedule', 'workflow_dispatch'):
            continue
        if run.get('head_branch') != 'main':
            continue
        jobs = get(f'/repos/{repo}/actions/runs/{run["id"]}/jobs?per_page=100')['jobs']
        outcome = source_result(jobs)
        if outcome is not None:
            return outcome, run
    raise RuntimeError('No prior source outcome found in the last 30 completed main runs')


def assess(outcome, source_unavailable, repo, current_run, get=api_get, now=None):
    now = now or datetime.now(timezone.utc)
    if outcome == 'success':
        return 'notice', 'Source verified successfully; repeated-failure counter reset.', False
    if not source_unavailable:
        return 'error', 'Refresh failed outside a tolerated upstream outage; inspect the refresh step. Previous data retained.', True
    previous, run = previous_source_run(repo, current_run, get)
    stamp = datetime.fromisoformat(run['created_at'].replace('Z', '+00:00'))
    age = (now - stamp).total_seconds()
    if previous == 'failure':
        return 'error', f'Repeated upstream acquisition failure (at least 2 consecutive attempts; previous run {run["id"]}). Previous gallery retained; investigate Shoptet access.', True
    if age < 0 or age > 48 * 3600:
        return 'error', f'Upstream unavailable and no verified source run within 48 hours (previous run {run["id"]}). Previous gallery retained.', True
    return 'warning', f'One upstream acquisition failed after verified run {run["id"]}; previous gallery retained. Next daily attempt remains enabled.', False


def report(level, message):
    print(f'::{level} title=Instagram refresh health::{message}')
    target = os.environ.get('GITHUB_STEP_SUMMARY')
    if target:
        with open(target, 'a', encoding='utf-8') as handle:
            handle.write('## Instagram refresh health\n\n' + message + '\n\n'
                         'Schedule: daily 03:00 Europe/Bratislava (GitHub may delay execution). '
                         'Content updatedAt is not the last source verification time.\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--outcome', choices=('success', 'failure'), required=True)
    parser.add_argument('--source-unavailable', choices=('true', 'false'), default='false')
    args = parser.parse_args()
    try:
        level, message, failed = assess(args.outcome, args.source_unavailable == 'true',
                                        os.environ['GITHUB_REPOSITORY'], os.environ['GITHUB_RUN_ID'])
    except (RuntimeError, KeyError, TypeError, ValueError):
        # Do not silently suppress a failure if we cannot establish recent health.
        report('error', 'Cannot verify Instagram refresh history; monitoring failed. Inspect this run; previous gallery retained.')
        raise SystemExit(1) from None
    report(level, message)
    if failed:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
