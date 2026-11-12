import contextlib
from datetime import datetime, timezone
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location('instagram_health', Path(__file__).resolve().parents[1] / 'scripts/instagram-refresh-health.py')
health = importlib.util.module_from_spec(spec)
spec.loader.exec_module(health)
NOW = datetime(2026, 11, 12, 4, tzinfo=timezone.utc)


def run(run_id=10, event='schedule', branch='main', date='2026-11-11T02:00:00Z'):
    return {'id': run_id, 'event': event, 'head_branch': branch, 'created_at': date}


def jobs(marker, conclusion='success'):
    return [{'steps': [{'name': marker, 'conclusion': conclusion}]}]


class HealthTests(unittest.TestCase):
    def setUp(self):
        isolated = patch.dict(os.environ, {'GITHUB_OUTPUT': '', 'GITHUB_STEP_SUMMARY': ''})
        isolated.start()
        self.addCleanup(isolated.stop)

    def history(self, marker, date='2026-11-11T02:00:00Z'):
        def get(path):
            if '/workflows/' in path:
                return {'workflow_runs': [run(date=date)]}
            return {'jobs': jobs(marker)}
        return get

    def test_single_failure_warns_and_does_not_fail(self):
        level, message, failed = health.assess('failure', True, 'o/r', 20, self.history(health.VERIFIED), NOW)
        self.assertEqual(level, 'warning')
        self.assertFalse(failed)
        self.assertIn('run 10', message)

    def test_two_failures_alert_even_if_previous_job_was_green(self):
        result = health.assess('failure', True, 'o/r', 20, self.history(health.UNAVAILABLE), NOW)
        self.assertEqual((result[0], result[2]), ('error', True))
        self.assertIn('at least 2 consecutive', result[1])

    def test_success_resets_without_api_call(self):
        with patch.object(health, 'api_get') as get:
            result = health.assess('success', False, 'o/r', 20, get, NOW)
        get.assert_not_called()
        self.assertFalse(result[2])

    def test_old_success_is_not_silently_accepted(self):
        result = health.assess('failure', True, 'o/r', 20, self.history(health.VERIFIED, '2026-11-09T02:00:00Z'), NOW)
        self.assertTrue(result[2])
        self.assertIn('48 hours', result[1])

    def test_non_source_error_fails_immediately(self):
        with patch.object(health, 'api_get') as get:
            result = health.assess('failure', False, 'o/r', 20, get, NOW)
        get.assert_not_called()
        self.assertTrue(result[2])

    def test_skip_pr_branch_current_and_non_acquisition_runs(self):
        fetched = []
        def get(path):
            fetched.append(path)
            if '/workflows/' in path:
                return {'workflow_runs': [run(20), run(19, 'pull_request'), run(18, branch='feature'), run(17), run(16)]}
            if '/17/' in path:
                return {'jobs': jobs(health.VERIFIED, 'skipped')}
            return {'jobs': jobs(health.VERIFIED)}
        result, previous = health.previous_source_run('o/r', 20, get)
        self.assertEqual((result, previous['id']), ('success', 16))
        self.assertEqual(len(fetched), 3)

    def test_no_history_and_api_errors_fail_monitoring(self):
        with self.assertRaises(RuntimeError):
            health.previous_source_run('o/r', 20, lambda _: {'workflow_runs': []})
        with patch.dict(os.environ, {'GITHUB_REPOSITORY': 'o/r', 'GITHUB_RUN_ID': '20'}), patch.object(health, 'previous_source_run', side_effect=RuntimeError('private')), patch('sys.argv', ['health', '--outcome', 'failure', '--source-unavailable', 'true']), contextlib.redirect_stdout(io.StringIO()) as log:
            with self.assertRaises(SystemExit) as result:
                health.main()
            self.assertEqual(result.exception.code, 1)
            self.assertNotIn('private', log.getvalue())

    def test_legacy_real_source_step_outcomes(self):
        self.assertEqual(health.source_result(jobs(health.LEGACY)), 'success')
        self.assertEqual(health.source_result(jobs(health.LEGACY, 'failure')), 'failure')
        self.assertIsNone(health.source_result(jobs('Run tests', 'failure')))

    def test_summary_explains_schedule_and_acquisition_health(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'summary.md'
            with patch.dict(os.environ, {'GITHUB_STEP_SUMMARY': str(path)}), contextlib.redirect_stdout(io.StringIO()):
                health.report('warning', 'Single source outage')
            self.assertIn('03:00 Europe/Bratislava', path.read_text())
            self.assertIn('not the last source verification', path.read_text())

    def test_history_http_error_does_not_expose_token_or_body(self):
        error = HTTPError('https://api.github.com', 403, 'private', {}, io.BytesIO(b'private'))
        with patch.dict(os.environ, {'GITHUB_TOKEN': 'private'}), patch.object(health, 'urlopen', side_effect=error):
            with self.assertRaisesRegex(RuntimeError, 'HTTP 403') as caught:
                health.api_get('/repos/o/r/actions/runs')
            self.assertNotIn('private', str(caught.exception))

    def test_workflow_protocol_publish_guard_and_schedule(self):
        workflow = (Path(__file__).resolve().parents[1] / '.github/workflows/refresh-instagram.yml').read_text()
        self.assertIn("cron: '0 3 * * *'", workflow)
        self.assertIn('timezone: Europe/Bratislava', workflow)
        self.assertIn('name: ' + health.VERIFIED, workflow)
        self.assertIn('name: ' + health.UNAVAILABLE, workflow)
        self.assertIn("github.ref == 'refs/heads/main' && steps.source.outcome == 'success'", workflow)
        self.assertIn("if: github.event_name != 'pull_request'", workflow)
        self.assertIn('actions: read', workflow)

    def test_bratislava_0300_is_unique_across_dst_transitions(self):
        from zoneinfo import ZoneInfo
        zone = ZoneInfo('Europe/Bratislava')
        for month, day, expected_utc in [(1, 15, 2), (7, 15, 1), (3, 29, 1), (10, 25, 2)]:
            with self.subTest(month=month):
                local = datetime(2026, month, day, 3, tzinfo=zone)
                self.assertEqual(local.astimezone(timezone.utc).hour, expected_utc)
                self.assertEqual(local.replace(fold=0).utcoffset(), local.replace(fold=1).utcoffset())


if __name__ == '__main__':
    unittest.main()
