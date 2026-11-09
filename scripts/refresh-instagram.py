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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path)
    parser.add_argument('--output', type=Path, default=Path('data/instagram.json'))
    args = parser.parse_args()
    try:
        html = args.input.read_text(encoding='utf-8') if args.input else fetch_html()
        refresh(html, args.output)
    except RefreshError as error:
        raise SystemExit(f'Refresh failed: {error}; keeping previous data.') from None
    except (OSError, ValueError):
        raise SystemExit('Refresh failed: file, parsing or encoding error; keeping previous data.') from None


if __name__ == '__main__':
    main()
