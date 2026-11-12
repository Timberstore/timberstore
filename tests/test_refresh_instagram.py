import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError

spec = importlib.util.spec_from_file_location('refresh_instagram', Path(__file__).resolve().parents[1] / 'scripts/refresh-instagram.py')
feed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feed)


def html(count=6):
    return ''.join(f'<a href="https://www.instagram.com/p/post{i}/"><img data-src="https://cdn.myshoptet.com/usr/www.timberstore.sk/user/system/instagram/{i}.jpg" alt="Photo {i}"></a>' for i in range(count))


class Response(io.BytesIO):
    status = 200

    def __init__(self, body=None):
        super().__init__((html() if body is None else body).encode())


class RefreshTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.output = Path(self.tmp.name) / 'instagram.json'
        self.original = b'{"updatedAt":"original", "posts": []}\n'
        self.output.write_bytes(self.original)

    def test_success_order_links_images_and_alt(self):
        feed.refresh(html(), self.output)
        posts = json.loads(self.output.read_text())['posts']
        self.assertEqual(len(posts), 6)
        self.assertEqual([p['url'] for p in posts], [f'https://www.instagram.com/p/post{i}/' for i in range(6)])
        self.assertTrue(posts[0]['image'].endswith('/0.jpg'))
        self.assertEqual(posts[0]['alt'], 'Photo 0')

    def test_empty_and_short_preserve_bytes(self):
        for count in (0, 1, 5):
            with self.subTest(count=count), self.assertRaises(feed.RefreshError):
                feed.refresh(html(count), self.output)
            self.assertEqual(self.output.read_bytes(), self.original)

    def test_unchanged_preserves_bytes_and_timestamp(self):
        feed.refresh(html(), self.output)
        before = self.output.read_bytes()
        with patch.object(feed.os, 'replace') as replace:
            feed.refresh(html(), self.output)
        replace.assert_not_called()
        self.assertEqual(self.output.read_bytes(), before)

    def test_only_native_cdn_and_post_links(self):
        invalid = html().replace('cdn.myshoptet.com', 'cdn.myshoptet.com.evil.test')
        invalid += html().replace('/p/post', '/profile/post')
        parser = feed.FeedParser()
        parser.feed(invalid)
        self.assertEqual(parser.posts, [])

    def test_duplicate_posts(self):
        feed.refresh(html() + html(), self.output)
        self.assertEqual(len(json.loads(self.output.read_text())['posts']), 6)

    def test_failed_atomic_replace_preserves_bytes(self):
        with patch.object(feed.os, 'replace', side_effect=OSError), self.assertRaises(OSError):
            feed.refresh(html(), self.output)
        self.assertEqual(self.output.read_bytes(), self.original)
        self.assertEqual(list(self.output.parent.iterdir()), [self.output])

    def test_retry_transient_http_timeout_and_network(self):
        for error in [HTTPError('https://example.test', 503, 'secret', {}, None), HTTPError('https://example.test', 429, 'secret', {'Retry-After': '7'}, None), TimeoutError('secret'), URLError('secret')]:
            with self.subTest(error=type(error)), patch.object(feed, 'urlopen', side_effect=[error, Response()]) as request, patch.object(feed.time, 'sleep') as sleep:
                self.assertEqual(feed.fetch_html(), html())
                self.assertEqual(request.call_count, 2)
                sleep.assert_called_once()

    def test_failures_preserve_json_and_do_not_log_secrets(self):
        for error, attempts in [(HTTPError('https://example.test', 403, 'secret-cookie', {}, None), 1), (HTTPError('https://example.test', 404, 'secret-cookie', {}, None), 1), (HTTPError('https://example.test', 500, 'secret-cookie', {}, None), 3), (TimeoutError('secret-cookie'), 3), (URLError('secret-cookie'), 3)]:
            log = io.StringIO()
            with self.subTest(error=type(error)), patch.object(feed, 'urlopen', side_effect=error) as request, patch.object(feed.time, 'sleep'), contextlib.redirect_stdout(log), patch('sys.argv', ['refresh', '--fetch', '--output', str(self.output)]):
                with self.assertRaises(SystemExit) as result:
                    feed.main()
                self.assertIn('keeping previous data', str(result.exception))
                self.assertNotIn('secret-cookie', str(result.exception) + log.getvalue())
                self.assertNotIn('CookiesConsent=', log.getvalue())
                self.assertEqual(request.call_count, attempts)
                self.assertEqual(self.output.read_bytes(), self.original)

    def test_empty_http_200_preserves_json(self):
        with patch.object(feed, 'urlopen', return_value=Response('')), patch('sys.argv', ['refresh', '--fetch', '--output', str(self.output)]), self.assertRaises(SystemExit):
            feed.main()
        self.assertEqual(self.output.read_bytes(), self.original)

    def run_cli(self, *args):
        with patch('sys.argv', ['refresh', *args, '--output', str(self.output)]):
            feed.main()

    def snapshot(self):
        return {'updatedAt': '2026-01-01T00:00:00+00:00', 'posts': [
            {'url': f'https://www.instagram.com/p/post{i}/',
             'image': f'https://cdn.myshoptet.com/usr/www.timberstore.sk/user/system/instagram/{i}.jpg',
             'alt': f'Photo {i}'} for i in range(6)]}

    def test_check_and_import_never_request_even_if_source_is_down(self):
        source = self.output.parent / 'source.json'
        source.write_text(json.dumps(self.snapshot()))
        for error in (HTTPError('https://example.test', 403, 'refused', {}, None),
                      HTTPError('https://example.test', 503, 'unavailable', {}, None),
                      TimeoutError(), URLError('offline')):
            with self.subTest(error=type(error)), patch.object(feed, 'urlopen', side_effect=error) as request:
                self.run_cli('--input-json', str(source))
                before = self.output.read_bytes()
                self.run_cli('--check')
                self.assertEqual(self.output.read_bytes(), before)
                request.assert_not_called()

    def test_no_implicit_fetch_or_production_fetch(self):
        for args in ([], ['--fetch']):
            with self.subTest(args=args), patch('sys.argv', ['refresh', *args]), patch.object(feed, 'urlopen') as request:
                with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
                    feed.main()
                request.assert_not_called()

    def test_malformed_imports_preserve_saved_bytes(self):
        source = self.output.parent / 'source.json'
        variants = [None, [], {}, {'updatedAt': 'bad', 'posts': []}]
        for change in ('duplicate', 'short', 'long', 'wrong-host', 'credentials', 'port', 'query',
                       'path', 'alt-type', 'extra-field', 'naive-time', 'future-time'):
            data = self.snapshot()
            if change == 'duplicate': data['posts'][1] = data['posts'][0]
            elif change == 'short': data['posts'] = data['posts'][:5]
            elif change == 'long': data['posts'] *= 7
            elif change == 'wrong-host': data['posts'][0]['image'] = data['posts'][0]['image'].replace('cdn.myshoptet.com', 'cdn.myshoptet.com.evil.test')
            elif change == 'credentials': data['posts'][0]['url'] = 'https://user@www.instagram.com/p/post0/'
            elif change == 'port': data['posts'][0]['url'] = 'https://www.instagram.com:443/p/post0/'
            elif change == 'query': data['posts'][0]['url'] += '?token=private'
            elif change == 'path': data['posts'][0]['url'] = 'https://www.instagram.com/p/'
            elif change == 'alt-type': data['posts'][0]['alt'] = []
            elif change == 'extra-field': data['posts'][0]['token'] = 'private'
            elif change == 'naive-time': data['updatedAt'] = '2026-01-01'
            elif change == 'future-time': data['updatedAt'] = '2999-01-01T00:00:00+00:00'
            variants.append(data)
        for data in variants:
            with self.subTest(data=data):
                source.write_text(json.dumps(data))
                with self.assertRaises(SystemExit): self.run_cli('--input-json', str(source))
                self.assertEqual(self.output.read_bytes(), self.original)
        source.write_text('{broken')
        with self.assertRaises(SystemExit): self.run_cli('--input-json', str(source))
        self.assertEqual(self.output.read_bytes(), self.original)

    def test_invalid_saved_data_fails_check(self):
        with self.assertRaises(SystemExit): self.run_cli('--check')
        self.assertEqual(self.output.read_bytes(), self.original)

    def test_stale_snapshot_warning_summary_without_failure_or_timestamp_change(self):
        self.output.write_text(json.dumps(self.snapshot()))
        before = self.output.read_bytes()
        summary = self.output.parent / 'summary.md'
        log = io.StringIO()
        with patch.dict(feed.os.environ, {'GITHUB_STEP_SUMMARY': str(summary)}), contextlib.redirect_stdout(log):
            self.run_cli('--check')
        self.assertIn('::warning', log.getvalue())
        self.assertIn('Automatic upstream refresh is disabled', summary.read_text())
        self.assertEqual(self.output.read_bytes(), before)

    def test_json_import_order_content_and_unchanged_bytes(self):
        source = self.output.parent / 'source.json'
        data = self.snapshot()
        data['posts'].reverse()
        source.write_text(json.dumps(data))
        self.run_cli('--input-json', str(source))
        self.assertEqual(json.loads(self.output.read_text())['posts'], data['posts'])
        before = self.output.read_bytes()
        self.run_cli('--input-json', str(source))
        self.assertEqual(self.output.read_bytes(), before)

    def test_failed_write_preserves_bytes_and_cleans_temporary_file(self):
        with patch.object(feed.os, 'fsync', side_effect=OSError), self.assertRaises(OSError):
            feed.write_posts(self.snapshot()['posts'], self.output)
        self.assertEqual(self.output.read_bytes(), self.original)
        self.assertEqual(list(self.output.parent.iterdir()), [self.output])


if __name__ == '__main__':
    unittest.main()
