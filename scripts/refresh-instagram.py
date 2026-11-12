"""Refresh public Shoptet-hosted images and native Instagram permalinks.

The reader preference applies only to this server request. It never runs
analytics/embed scripts or changes visitor consent. Failed/empty responses keep
last known-good data. No account token or visitor identifier is used.
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


class SourceUnavailable(RefreshError):
    """Temporary source refusal/outage; the workflow may retain validated data."""


def record_http_diagnostic(status, headers, attempt):
    # Do not log bodies, cookies, arbitrary headers or exception messages.
    print(f'Source attempt={attempt} HTTP status={status} checkedAt={datetime.now(timezone.utc).isoformat()}')
    for name in ('x-request-id', 'cf-ray'):
        value = headers.get(name, '') if headers else ''
        if re.fullmatch(r'[A-Za-z0-9_:.-]{1,100}', value):
            print(f'Source {name}={value}')


def fetch_html():
    preference = json.dumps({'consent': 'analytics,personalisation', 'cookieId': secrets.token_hex(16)}, separators=(',', ':'))
    request = Request('https://www.timberstore.sk/?ts_feed=1', headers={'Cookie': f'CookiesConsent={preference}', 'User-Agent': 'TimberStore-gallery-refresh/1.0'})
    for attempt in range(1, 4):
        delay = 2 ** attempt
        try:
            with urlopen(request, timeout=30) as response:
                record_http_diagnostic(response.status, response.headers, attempt)
                return response.read().decode('utf-8')
        except HTTPError as error:
            status = error.code
            retry_after = error.headers.get('Retry-After', '') if error.headers else ''
            record_http_diagnostic(status, error.headers, attempt)
            error.close()
            if status == 403:
                raise SourceUnavailable('HTTP 403; request refused; no retry') from None
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
                    raise SourceUnavailable(f'HTTP {status}; Retry-After exceeds retry window') from None
        except (TimeoutError, socket.timeout):
            reason = 'timeout'
        except (URLError, ConnectionError, HTTPException):
            reason = 'network failure'
        except UnicodeError:
            raise RefreshError('invalid UTF-8 response') from None
        print(f'Source attempt={attempt} failure={reason}')
        if attempt == 3:
            raise SourceUnavailable(f'{reason}; exhausted 3 attempts')
        print(f'Retrying in {delay}s')
        time.sleep(delay)


def refresh(html, output):
    feed = FeedParser()
    feed.feed(html)
    posts = list({post['url']: post for post in feed.posts}.values())[:40]
    print(f'Found {len(posts)} valid native posts')
    if len(posts) < 6:
        raise RefreshError('native feed supplied fewer than six valid posts')
    previous = json.loads(output.read_text()) if output.exists() else {}
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


def check_saved_data(output):
    data = json.loads(output.read_text(encoding='utf-8'))
    if not isinstance(data, dict) or not isinstance(data.get('posts'), list) or not 6 <= len(data['posts']) <= 40:
        raise RefreshError('saved gallery must contain 6 to 40 posts')
    if not isinstance(data.get('updatedAt'), str):
        raise RefreshError('invalid saved gallery timestamp')
    stamp = datetime.fromisoformat(data['updatedAt'])
    if stamp.tzinfo is None or stamp > datetime.now(timezone.utc):
        raise RefreshError('invalid saved gallery timestamp')
    seen = set()
    for post in data['posts']:
        if not isinstance(post, dict) or not all(isinstance(post.get(k), str) for k in ('url', 'image', 'alt')):
            raise RefreshError('invalid saved post')
        url, image = urlsplit(post['url']), urlsplit(post['image'])
        if (url.scheme != 'https' or url.netloc != 'www.instagram.com'
                or not re.fullmatch(r'/(p|reel)/[A-Za-z0-9_-]+/', url.path)
                or url.query or url.fragment or post['url'] in seen
                or image.scheme != 'https' or image.netloc != 'cdn.myshoptet.com'
                or not image.path.startswith('/usr/www.timberstore.sk/user/system/instagram/')
                or image.query or image.fragment):
            raise RefreshError('invalid saved gallery URL or duplicate post')
        seen.add(post['url'])
    print(f'Validated {len(seen)} saved posts (content timestamp is not source health)')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path)
    parser.add_argument('--check', action='store_true', help='Validate saved fallback without contacting source')
    parser.add_argument('--output', type=Path, default=Path('data/instagram.json'))
    args = parser.parse_args()
    try:
        if args.check:
            check_saved_data(args.output)
            return
        html = args.input.read_text(encoding='utf-8') if args.input else fetch_html()
        refresh(html, args.output)
    except SourceUnavailable as error:
        # Mark only expected upstream unavailability, never parser/filesystem bugs.
        target = os.environ.get('GITHUB_OUTPUT')
        if target:
            with open(target, 'a', encoding='utf-8') as handle:
                handle.write('source_unavailable=true\n')
        raise SystemExit(f'Refresh failed: {error}; keeping previous data.') from None
    except RefreshError as error:
        raise SystemExit(f'Refresh failed: {error}; keeping previous data.') from None
    except (OSError, ValueError):
        raise SystemExit('Refresh failed: file, parsing or encoding error; keeping previous data.') from None


if __name__ == '__main__':
    main()
