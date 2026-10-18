"""Refresh public Shoptet-hosted images and native Instagram permalinks.

The reader preference applies only to this server request. It never runs
analytics/embed scripts or changes visitor consent. Failed/empty responses keep
last known-good data. No account token or visitor identifier is used.
"""
import argparse
import json
import secrets
from datetime import datetime, timezone
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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path)
    args = parser.parse_args()
    if args.input:
        html = args.input.read_text()
    else:
        preference = json.dumps({'consent': 'analytics,personalisation', 'cookieId': secrets.token_hex(16)}, separators=(',', ':'))
        request = Request('https://www.timberstore.sk/?ts_feed=1', headers={'Cookie': f'CookiesConsent={preference}', 'User-Agent': 'TimberStore-gallery-refresh/1.0'})
        with urlopen(request, timeout=30) as response:
            html = response.read().decode('utf-8')
    feed = FeedParser()
    feed.feed(html)
    posts = list({post['url']: post for post in feed.posts}.values())[:40]
    if len(posts) < 6:
        raise SystemExit('Native feed supplied fewer than six valid posts; keeping previous data.')
    output = Path('data/instagram.json')
    previous = json.loads(output.read_text()) if output.exists() else {}
    if previous.get('posts') == posts:
        print('Feed unchanged')
        return
    output.write_text(json.dumps({'updatedAt': datetime.now(timezone.utc).isoformat(), 'posts': posts}, ensure_ascii=False, indent=2) + '\n')
    print(f'Updated {len(posts)} verified native posts')


if __name__ == '__main__':
    main()
