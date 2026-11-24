import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch
from urllib.error import HTTPError, URLError

from PIL import Image

spec = importlib.util.spec_from_file_location(
    'refresh_instagram', Path(__file__).resolve().parents[1] / 'scripts/refresh-instagram.py'
)
feed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feed)


def posts(count=7):
    return [
        {'url': f'https://www.instagram.com/p/post{i}/?igsh=tracking', 'image': f'{i}.jpg', 'alt': f'Photo {i}'}
        for i in range(count)
    ]


def jpeg():
    data = io.BytesIO()
    Image.new('RGB', (100, 100), 'green').save(data, 'JPEG')
    return data.getvalue()


class RefreshTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.output = Path(directory.name) / 'instagram.json'
        self.original = b'{"updatedAt":"original","posts":[]}\n'
        self.output.write_bytes(self.original)

    def test_publishes_decoded_images_and_canonical_links_in_order(self):
        feed.refresh(posts(), lambda _: jpeg(), self.output)
        manifest = json.loads(self.output.read_text())
        self.assertEqual([post['url'] for post in manifest['posts']], [
            f'https://www.instagram.com/p/post{i}/' for i in range(7)
        ])
        for post in manifest['posts']:
            path = self.output.parent / post['image']
            self.assertEqual(path.stem, feed.sha256(path.read_bytes()).hexdigest())
            with Image.open(path) as stored:
                stored.load()
                self.assertEqual(stored.format, 'JPEG')
        self.assertEqual(manifest['posts'][0]['alt'], 'Photo 0')
        self.assertEqual(len(list((self.output.parent / 'instagram-media').iterdir())), 1)

    def test_empty_or_short_feed_preserves_previous_bytes(self):
        for count in (0, 1, 5):
            with self.subTest(count=count), self.assertRaises(feed.RefreshError):
                feed.refresh(posts(count), lambda _: jpeg(), self.output)
            self.assertEqual(self.output.read_bytes(), self.original)
            self.assertFalse((self.output.parent / 'instagram-media').exists())

    def test_invalid_and_unavailable_images_preserve_previous_gallery(self):
        feed.refresh(posts(), lambda _: jpeg(), self.output)
        manifest = self.output.read_bytes()
        files = set(self.output.parent.rglob('*.jpg'))

        def failed_image(name):
            if name == '0.jpg':
                raise feed.RefreshError('Meta media: HTTP 404')
            return b'<html>HTTP 200 but no image</html>'

        with self.assertRaises(feed.RefreshError):
            feed.refresh(posts(), failed_image, self.output)
        self.assertEqual(self.output.read_bytes(), manifest)
        self.assertEqual(set(self.output.parent.rglob('*.jpg')), files)

    def test_skips_broken_images_when_six_still_work(self):
        feed.refresh(posts(), lambda name: b'broken' if name == '1.jpg' else jpeg(), self.output)
        records = json.loads(self.output.read_text())['posts']
        self.assertEqual([post['alt'] for post in records], ['Photo 0', 'Photo 2', 'Photo 3', 'Photo 4', 'Photo 5', 'Photo 6'])

    def test_unchanged_feed_preserves_timestamp_and_bytes(self):
        feed.refresh(posts(), lambda _: jpeg(), self.output)
        before = self.output.read_bytes()
        with patch.object(feed, 'atomic_write') as write:
            feed.refresh(posts(), lambda _: jpeg(), self.output)
        write.assert_not_called()
        self.assertEqual(self.output.read_bytes(), before)

    def test_duplicate_and_non_instagram_links_are_rejected(self):
        invalid = [{'url': 'https://www.instagram.com.example.test/p/fake/', 'image': 'x.jpg'}]
        reader = Mock(return_value=jpeg())
        feed.refresh(invalid + posts(6) + posts(6), reader, self.output)
        self.assertEqual(reader.call_count, 6)

    def test_failed_manifest_replace_leaves_previous_snapshot(self):
        feed.refresh(posts(), lambda _: jpeg(), self.output)
        previous = self.output.read_bytes()
        changed = posts()
        changed[0]['alt'] = 'Updated caption'
        with patch.object(feed.os, 'replace', side_effect=OSError), self.assertRaises(OSError):
            feed.refresh(changed, lambda _: jpeg(), self.output)
        self.assertEqual(self.output.read_bytes(), previous)

    def test_meta_network_and_http_errors_are_sanitized_and_keep_data(self):
        for error in (URLError('secret-url'), HTTPError('https://example.com/secret-url', 403, 'secret', {}, None)):
            with self.subTest(error=type(error)), patch.object(feed, 'build_opener') as opener:
                opener.return_value.open.side_effect = error
                with patch.dict(feed.os.environ, {'META_INSTAGRAM_TOKEN': 'secret-token', 'META_INSTAGRAM_API_VERSION': 'v27.0'}):
                    with patch('sys.argv', ['refresh', '--output', str(self.output)]), self.assertRaises(SystemExit) as result:
                        feed.main()
                self.assertIn('keeping previous data', str(result.exception))
                self.assertNotIn('secret', str(result.exception))
                self.assertEqual(self.output.read_bytes(), self.original)
                opener.return_value.open.assert_called_once()

    def test_wrong_account_is_rejected_before_loading_media(self):
        with patch.object(feed, 'graph', return_value={'username': 'other', 'user_id': '123'}) as graph:
            with self.assertRaises(feed.RefreshError):
                list(feed.meta_posts('token', 'v27.0'))
        graph.assert_called_once()

    def test_meta_maps_carousel_and_reel_preview_to_real_permalink(self):
        response = {'data': [
            {'media_type': 'CAROUSEL_ALBUM', 'permalink': 'album', 'media_url': 'cover', 'caption': 'Album'},
            {'media_type': 'VIDEO', 'permalink': 'reel', 'media_url': 'video', 'thumbnail_url': 'preview'},
        ]}
        with patch.object(feed, 'graph', side_effect=[{'username': 'timberstore.sk', 'user_id': '123'}, response]):
            items = list(feed.meta_posts('token', 'v27.0'))
        self.assertEqual([(post['url'], post['image']) for post in items], [('album', 'cover'), ('reel', 'preview')])

    def test_local_import_rejects_path_traversal(self):
        with self.assertRaises(feed.RefreshError):
            feed.read_local_image(self.output.parent, '../private.jpg')
