"""Publish a complete gallery from authorized Meta media or owner-supplied files."""
import argparse
from datetime import datetime, timezone
from hashlib import sha256
from http.client import HTTPException
from io import BytesIO
import json
import os
from pathlib import Path
import re
import tempfile
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

from PIL import Image, ImageOps

MIN_POSTS = 6
MAX_POSTS = 16
MAX_IMAGE_BYTES = 12 * 1024 * 1024
MAX_IMAGE_PIXELS = 25_000_000
USERNAME = 'timberstore.sk'
POST_PATH = re.compile(r'/(p|reel)/([\w-]+)/?', re.ASCII)


class RefreshError(Exception):
    """Diagnostic safe to display in Actions logs."""


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        return None


def download(url, kind, limit, token=None):
    headers = {'Accept': 'application/json' if token else 'image/*'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    try:
        with build_opener(NoRedirect()).open(Request(url, headers=headers), timeout=15) as response:
            content = response.read(limit + 1)
            if len(content) > limit:
                raise RefreshError(f'{kind}: response exceeds size limit')
            return content
    except HTTPError as error:
        error.close()
        raise RefreshError(f'{kind}: HTTP {error.code}') from None
    except (OSError, URLError, HTTPException, ValueError):
        raise RefreshError(f'{kind}: network or invalid response') from None


def graph(token, version, route, **params):
    query = urlencode(params)
    url = f'https://graph.instagram.com/{version}/{route}?{query}'
    return json.loads(download(url, 'Meta API', 1024 * 1024, token))


def meta_posts(token, version):
    if not token or not re.fullmatch(r'v[0-9]+\.0', version):
        raise RefreshError('configure META_INSTAGRAM_TOKEN and META_INSTAGRAM_API_VERSION')
    account = graph(token, version, 'me', fields='user_id,username')
    username = account.get('username') if isinstance(account, dict) else None
    if not isinstance(username, str) or username.lower() != USERNAME:
        raise RefreshError('Meta token did not resolve to the Timber Store account')
    account_id = str(account.get('user_id', ''))
    if not re.fullmatch(r'[0-9]+', account_id):
        raise RefreshError('Meta API did not return the account ID')
    result = graph(
        token, version, f'{account_id}/media', limit=40,
        fields='caption,media_type,media_url,thumbnail_url,permalink',
    )
    items = result.get('data') if isinstance(result, dict) else None
    if not isinstance(items, list):
        raise RefreshError('Meta API did not return a media list')
    for item in items:
        if not isinstance(item, dict):
            continue
        media_type = item.get('media_type')
        if media_type in ('IMAGE', 'CAROUSEL_ALBUM', 'VIDEO'):
            yield {
                'url': item.get('permalink'),
                'image': item.get('thumbnail_url' if media_type == 'VIDEO' else 'media_url'),
                'alt': item.get('caption'),
            }


def read_meta_image(url):
    if not isinstance(url, str):
        raise RefreshError('Meta media URL missing')
    parts = urlsplit(url)
    host = parts.hostname or ''
    if parts.scheme != 'https' or parts.netloc != host or not host.endswith(('.cdninstagram.com', '.fbcdn.net')):
        raise RefreshError('Meta media URL outside supported Meta CDN hosts')
    return download(url, 'Meta media', MAX_IMAGE_BYTES)


def read_local_image(directory, name):
    if not isinstance(name, str) or Path(name).name != name or name in ('', '.', '..'):
        raise RefreshError('use a local image filename beside the import manifest')
    path = directory / name
    if path.is_symlink() or not path.is_file():
        raise RefreshError('local image must be a regular file')
    with path.open('rb') as source:
        return source.read(MAX_IMAGE_BYTES + 1)


def encode_image(content):
    if len(content) > MAX_IMAGE_BYTES:
        raise RefreshError('image exceeds size limit')
    with Image.open(BytesIO(content), formats=('JPEG', 'PNG', 'WEBP')) as image:
        if image.width * image.height > MAX_IMAGE_PIXELS:
            raise RefreshError('image exceeds pixel limit')
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((640, 640), Image.Resampling.LANCZOS)
        result = BytesIO()
        image.save(result, format='JPEG', quality=85, optimize=True)
        return result.getvalue()


def prepare(posts, read_image):
    records = {}
    assets = {}
    for post in posts:
        if not isinstance(post, dict) or not isinstance(post.get('url'), str):
            continue
        url = urlsplit(post['url'])
        match = POST_PATH.fullmatch(url.path)
        if url.scheme != 'https' or url.netloc != 'www.instagram.com' or not match:
            continue
        kind, shortcode = match.groups()
        if shortcode in records:
            continue
        try:
            data = encode_image(read_image(post.get('image')))
        except RefreshError as error:
            print(f'Skipped image for {shortcode}: {error}')
            continue
        except (OSError, ValueError, Image.DecompressionBombError):
            print(f'Skipped image for {shortcode}: unreadable image')
            continue
        filename = f'instagram-media/{sha256(data).hexdigest()}.jpg'
        assets[filename] = data
        caption = post.get('alt')
        records[shortcode] = {
            'url': f'https://www.instagram.com/{kind}/{shortcode}/',
            'image': filename,
            'alt': ' '.join(caption.split())[:160] if isinstance(caption, str) else '',
        }
        if len(records) == MAX_POSTS:
            break
    if len(records) < MIN_POSTS:
        raise RefreshError(f'only {len(records)} posts with verified images, need at least {MIN_POSTS}')
    return list(records.values()), assets


def atomic_write(path, content):
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary:
            temporary.unlink(missing_ok=True)


def refresh(posts, read_image, output):
    records, assets = prepare(posts, read_image)
    previous = json.loads(output.read_text(encoding='utf-8')) if output.exists() else {}
    for filename, data in assets.items():
        path = output.parent / filename
        path.parent.mkdir(exist_ok=True)
        if not path.exists() or path.read_bytes() != data:
            atomic_write(path, data)
    if previous.get('posts') == records:
        print(f'Feed unchanged ({len(records)} verified images)')
        return
    payload = {'updatedAt': datetime.now(timezone.utc).isoformat(), 'posts': records}
    atomic_write(output, (json.dumps(payload, ensure_ascii=False, indent=2) + '\n').encode())
    print(f'Prepared {len(records)} posts with verified local images')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--import-manifest', type=Path, help='JSON with posts and adjacent local image files')
    parser.add_argument('--output', type=Path, default=Path('data/instagram.json'))
    args = parser.parse_args()
    try:
        if args.import_manifest:
            posts = json.loads(args.import_manifest.read_text(encoding='utf-8'))['posts']
            refresh(posts, lambda name: read_local_image(args.import_manifest.parent, name), args.output)
        else:
            posts = meta_posts(os.getenv('META_INSTAGRAM_TOKEN'), os.getenv('META_INSTAGRAM_API_VERSION', ''))
            refresh(posts, read_meta_image, args.output)
    except RefreshError as error:
        raise SystemExit(f'Refresh failed: {error}; keeping previous data.') from None
    except (OSError, ValueError, TypeError, KeyError):
        raise SystemExit('Refresh failed: file or response format error; keeping previous data.') from None


if __name__ == '__main__':
    main()
