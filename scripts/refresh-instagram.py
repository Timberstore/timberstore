"""Validate or import reviewed Instagram gallery snapshots without network access.

Legacy HTML fetching is opt-in for local diagnostics only, never scheduled.
Imports retain the frontend contract and replace data atomically after validation.
"""
import argparse
import json
import secrets
import socket
import time
import os
import tempfile
import re
from http.client import HTTPException
from urllib.error import HTTPError, URLError
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


class FeedParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.posts = []
        self.link = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'a':
            url = attrs.get('href', '')
            parts = urlsplit(url)
            self.link = url if parts.scheme == 'https' and parts.hostname == 'www.instagram.com' and parts.path.startswith(('/p/', '/reel/')) else None
        if tag == 'img' and self.link:
            image = attrs.get('data-thumbnail-medium') or attrs.get('data-src', '')
            parts = urlsplit(image)
            if parts.scheme == 'https' and parts.hostname == 'cdn.myshoptet.com' and parts.path.startswith('/usr/www.timberstore.sk/user/system/instagram/'):
                self.posts.append({'url': self.link, 'image': image, 'alt': attrs.get('alt', '')})

    def handle_endtag(self, tag):
        if tag == 'a':
            self.link = None


class RefreshError(Exception):
    """Safe diagnostic message, without response bodies, headers or cookies."""


def fetch_html():
    preference = json.dumps({'consent': 'analytics,personalisation', 'cookieId': secrets.token_hex(16)}, separators=(',', ':'))
    request = Request('https://www.timberstore.sk/?ts_feed=1', headers={'Cookie': f'CookiesConsent={preference}', 'User-Agent': 'TimberStore-gallery-refresh/1.0'})
    for attempt in range(1, 4):
        delay = 2 ** attempt
        try:
            with urlopen(request, timeout=30) as response:
                print(f'Source attempt={attempt} HTTP status={response.status}')
                return response.read().decode('utf-8')
        except HTTPError as error:
            status = error.code
            retry_after = error.headers.get('Retry-After', '') if error.headers else ''
            error.close()
            print(f'Source attempt={attempt} HTTP status={status}')
            if status not in (408, 429, 500, 502, 503, 504):
                raise RefreshError(f'HTTP {status}; request refused; no retry') from None
            reason = f'HTTP {status}'
            if retry_after:
                try:
                    wait = int(retry_after) if retry_after.isdigit() else (parsedate_to_datetime(retry_after) - datetime.now(timezone.utc)).total_seconds()
                    delay = max(delay, wait)
                except (TypeError, ValueError, OverflowError):
                    pass
                if delay > 60:
                    raise RefreshError(f'HTTP {status}; Retry-After exceeds retry window') from None
        except (TimeoutError, socket.timeout):
            reason = 'timeout'
        except (URLError, ConnectionError, HTTPException):
            reason = 'network failure'
        except UnicodeError:
            raise RefreshError('invalid UTF-8 response') from None
        print(f'Source attempt={attempt} failure={reason}')
        if attempt == 3:
            raise RefreshError(f'{reason}; exhausted 3 attempts')
        print(f'Retrying in {delay}s')
        time.sleep(delay)


def validate_posts(posts):
    if not isinstance(posts, list) or not 6 <= len(posts) <= 40:
        raise RefreshError('snapshot must contain 6 to 40 posts')
    seen = set()
    for post in posts:
        if not isinstance(post, dict) or set(post) != {'url', 'image', 'alt'}:
            raise RefreshError('invalid post fields')
        if not all(isinstance(post[key], str) for key in post):
            raise RefreshError('post fields must be strings')
        for key, host, pattern in (
            ('url', 'www.instagram.com', r'/(p|reel)/[A-Za-z0-9_-]+/'),
            ('image', 'cdn.myshoptet.com', r'/usr/www\.timberstore\.sk/user/system/instagram/[A-Za-z0-9_.-]+\.(jpg|jpeg|png|webp)'),
        ):
            parts = urlsplit(post[key])
            if (parts.scheme != 'https' or parts.netloc != host or parts.query
                    or parts.fragment or not re.fullmatch(pattern, parts.path)):
                raise RefreshError(f'invalid {key} URL')
        if post['url'] in seen:
            raise RefreshError('duplicate Instagram permalink')
        seen.add(post['url'])
    return posts


def validate_snapshot(data):
    if not isinstance(data, dict) or set(data) != {'updatedAt', 'posts'}:
        raise RefreshError('invalid snapshot fields')
    if not isinstance(data['updatedAt'], str):
        raise RefreshError('invalid updatedAt timestamp')
    try:
        stamp = datetime.fromisoformat(data['updatedAt'])
    except ValueError:
        raise RefreshError('invalid updatedAt timestamp') from None
    if stamp.tzinfo is None or stamp > datetime.now(timezone.utc):
        raise RefreshError('updatedAt must have timezone and not be in the future')
    validate_posts(data['posts'])
    return stamp


def check_snapshot(output):
    data = json.loads(output.read_text(encoding='utf-8'))
    stamp = validate_snapshot(data)
    age = (datetime.now(timezone.utc) - stamp).days
    message = f'Validated {len(data["posts"])} posts; snapshot last changed {age} days ago. No upstream refresh was attempted.'
    if age >= 30:
        message += ' Review the gallery for new posts; this age measures content changes, not last source verification.'
        print(f'::warning title=Instagram snapshot review due::{message}')
    else:
        print(message)
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if summary:
        with open(summary, 'a', encoding='utf-8') as handle:
            handle.write('## Instagram gallery: reviewed snapshot mode\n\n' + message + '\n\n'
                         'Automatic upstream refresh is disabled until a supported source is configured. '
                         'Update via a reviewed data PR; see docs/instagram-refresh-2026-11-12.md.\n')


def refresh(html, output):
    feed = FeedParser()
    feed.feed(html)
    posts = list({post['url']: post for post in feed.posts}.values())
    print(f'Found {len(posts)} valid native posts')
    write_posts(posts, output)


def write_posts(posts, output):
    validate_posts(posts)
    previous = json.loads(output.read_text(encoding='utf-8')) if output.exists() else {}
    if not isinstance(previous, dict):
        raise RefreshError('existing snapshot is not an object')
    if previous.get('posts') == posts:
        print('Feed unchanged')
        return
    payload = json.dumps({'updatedAt': datetime.now(timezone.utc).isoformat(), 'posts': posts}, ensure_ascii=False, indent=2) + '\n'
    # Replace only after parsing, validation and the complete write succeed.
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=output.parent, delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(payload)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, output)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    print(f'Updated {len(posts)} verified native posts')


def main():
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--check', action='store_true', help='Validate committed data; no network or writes')
    mode.add_argument('--input', type=Path, help='Import a reviewed local HTML snapshot')
    mode.add_argument('--input-json', type=Path, help='Import a reviewed local JSON snapshot')
    mode.add_argument('--fetch', action='store_true', help='Legacy network diagnostic; use a scratch --output')
    parser.add_argument('--output', type=Path, default=Path('data/instagram.json'))
    args = parser.parse_args()
    try:
        if args.check:
            check_snapshot(args.output)
        elif args.input_json:
            data = json.loads(args.input_json.read_text(encoding='utf-8'))
            validate_snapshot(data)
            write_posts(data['posts'], args.output)
        elif args.input:
            refresh(args.input.read_text(encoding='utf-8'), args.output)
        else:
            if args.output.resolve() == Path('data/instagram.json').resolve():
                raise RefreshError('legacy fetch requires a scratch --output; publish only through review')
            refresh(fetch_html(), args.output)
    except RefreshError as error:
        raise SystemExit(f'Refresh failed: {error}; keeping previous data.') from None
    except (OSError, ValueError):
        raise SystemExit('Refresh failed: file, parsing or encoding error; keeping previous data.') from None


if __name__ == '__main__':
    main()
