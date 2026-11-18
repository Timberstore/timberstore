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
    headers = {}

    def __init__(self, body=None):
        super().__init__((html() if body is None else body).encode())


class RefreshTests(unittest.TestCase):
    def setUp(self):
        isolated = patch.dict(feed.os.environ, {'GITHUB_OUTPUT': '', 'GITHUB_STEP_SUMMARY': ''})
        isolated.start()
        self.addCleanup(isolated.stop)
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
            with self.subTest(error=type(error)), patch.object(feed, 'urlopen', side_effect=error) as request, patch.object(feed.time, 'sleep'), contextlib.redirect_stdout(log), patch('sys.argv', ['refresh', '--output', str(self.output)]):
                with self.assertRaises(SystemExit) as result:
                    feed.main()
                self.assertIn('keeping previous data', str(result.exception))
                self.assertNotIn('secret-cookie', str(result.exception) + log.getvalue())
                self.assertNotIn('CookiesConsent=', log.getvalue())
                self.assertEqual(request.call_count, attempts)
                self.assertEqual(self.output.read_bytes(), self.original)

    def test_empty_http_200_preserves_json(self):
        with patch.object(feed, 'urlopen', return_value=Response('')), patch('sys.argv', ['refresh', '--output', str(self.output)]), self.assertRaises(SystemExit):
            feed.main()
        self.assertEqual(self.output.read_bytes(), self.original)

    def valid_saved_data(self):
        feed.refresh(html(), self.output)

    def test_403_marks_unavailability_but_does_not_retry_or_modify_data(self):
        self.valid_saved_data()
        before = self.output.read_bytes()
        outputs = self.output.parent / 'outputs'
        error = HTTPError('https://example.test', 403, 'secret', {'x-request-id': 'trace-123', 'Set-Cookie': 'secret'}, None)
        with patch.dict(feed.os.environ, {'GITHUB_OUTPUT': str(outputs)}), patch.object(feed, 'urlopen', side_effect=error) as request, patch.object(feed.time, 'sleep') as sleep, patch('sys.argv', ['refresh', '--output', str(self.output)]), contextlib.redirect_stdout(io.StringIO()) as log:
            with self.assertRaises(SystemExit): feed.main()
        request.assert_called_once()
        sleep.assert_not_called()
        self.assertIn('source_unavailable=true', outputs.read_text())
        self.assertIn('HTTP status=403', log.getvalue())
        self.assertIn('checkedAt=', log.getvalue())
        self.assertIn('trace-123', log.getvalue())
        self.assertNotIn('secret', log.getvalue())
        self.assertEqual(self.output.read_bytes(), before)

    def test_invalid_data_and_404_do_not_mark_tolerated_outage(self):
        outputs = self.output.parent / 'outputs'
        for response in (Response(''), HTTPError('https://example.test', 404, 'secret', {}, None)):
            with self.subTest(response=type(response)), patch.dict(feed.os.environ, {'GITHUB_OUTPUT': str(outputs)}), patch.object(feed, 'urlopen', side_effect=response if isinstance(response, Exception) else None, return_value=response), patch('sys.argv', ['refresh', '--output', str(self.output)]):
                with self.assertRaises(SystemExit): feed.main()
                self.assertFalse(outputs.exists())
                self.assertEqual(self.output.read_bytes(), self.original)

    def test_saved_data_check_is_read_only_and_offline(self):
        self.valid_saved_data()
        before = self.output.read_bytes()
        with patch.object(feed, 'urlopen') as request:
            feed.check_saved_data(self.output)
        request.assert_not_called()
        self.assertEqual(self.output.read_bytes(), before)
        for payload in ([], {}, {'updatedAt': None, 'posts': [None] * 6}):
            self.output.write_text(json.dumps(payload))
            with self.assertRaises(feed.RefreshError): feed.check_saved_data(self.output)

    def test_request_diagnostics_reject_arbitrary_values(self):
        with contextlib.redirect_stdout(io.StringIO()) as log:
            feed.record_http_diagnostic(403, {'x-request-id': 'secret;cookie=value', 'cf-ray': 'bad\nheader'}, 1)
        self.assertNotIn('secret', log.getvalue())
        self.assertNotIn('bad', log.getvalue())

    def test_recently_unchanged_source_is_still_a_success(self):
        self.valid_saved_data()
        before = self.output.read_bytes()
        outputs = self.output.parent / 'outputs'
        with patch.dict(feed.os.environ, {'GITHUB_OUTPUT': str(outputs)}), patch.object(feed, 'urlopen', return_value=Response()), patch('sys.argv', ['refresh', '--output', str(self.output)]):
            feed.main()
        self.assertFalse(outputs.exists())
        self.assertEqual(self.output.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
