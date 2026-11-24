import io
import os
from pathlib import Path
import unittest

from PIL import Image
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PRIMARY = 'https://raw.githubusercontent.com/Timberstore/timberstore/main/data/'
MIRROR = 'https://cdn.jsdelivr.net/gh/Timberstore/timberstore@main/data/'
BLOCK = '.instagram-block:visible'


def manifest(count=8):
    return {'posts': [
        {'url': f'https://www.instagram.com/p/post{i}/', 'image': f'instagram-media/{i:064x}.jpg', 'alt': f'Photo {i}'}
        for i in range(count)
    ]}


class InstagramBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.addClassCleanup(cls.playwright.stop)
        cls.browser = cls.playwright.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH'))
        cls.addClassCleanup(cls.browser.close)
        fixture = io.BytesIO()
        Image.new('RGB', (120, 120), 'green').save(fixture, 'JPEG')
        cls.photo = fixture.getvalue()

    def open_gallery(self, primary, mirror=None, missing=(), width=1440, delay=False):
        page = self.browser.new_page(viewport={'width': width, 'height': 800})
        self.addCleanup(page.close)
        self.errors = []
        page.on('pageerror', lambda error: self.errors.append(str(error)))
        page.route('https://shop.example/', lambda route: route.fulfill(
            content_type='text/html', body='<!doctype html><body class="type-index"><div class="overall-wrapper"></div></body>',
        ))

        def serve(route):
            url = route.request.url
            headers = {'Access-Control-Allow-Origin': '*'}
            if url.endswith('instagram.json'):
                response = primary if url.startswith(PRIMARY) else mirror
                if delay and url.startswith(PRIMARY):
                    page.evaluate("""() => {
                      document.querySelector('.ts-instagram--fallback').remove();
                      const block = document.createElement('div');
                      block.className = 'instagram-block';
                      block.innerHTML = '<div class="instagram-widget"></div>';
                      document.querySelector('.overall-wrapper').append(block);
                    }""")
                if response is None:
                    route.fulfill(status=503, headers=headers)
                else:
                    route.fulfill(json=response, headers=headers)
            elif int(url.rsplit('/', 1)[1][:-4], 16) in missing:
                route.fulfill(status=404)
            else:
                route.fulfill(content_type='image/jpeg', body=self.photo)

        page.route(f'{PRIMARY}**', serve)
        page.route(f'{MIRROR}**', serve)
        page.goto('https://shop.example/')
        page.add_style_tag(path=ROOT / 'dist/timber.min.css')
        page.add_script_tag(path=ROOT / 'dist/timber.min.js')
        return page

    def expect_photos(self, page, count):
        gallery = page.locator(BLOCK)
        expect(gallery).to_have_count(1)
        expect(gallery.locator('img')).to_have_count(count)
        self.assertEqual(gallery.locator('img').evaluate_all('(images) => images.filter(i => i.naturalWidth > 0).length'), count)
        self.assertEqual(self.errors, [])
        return gallery

    def test_unavailable_primary_uses_last_published_mirror(self):
        page = self.open_gallery(None, manifest())
        gallery = self.expect_photos(page, 8)
        expect(gallery.locator('.instagram-widget-item a').first).to_have_attribute('href', 'https://www.instagram.com/p/post0/')
        visible = gallery.locator('.instagram-widget').evaluate("""widget => [...widget.children].filter(
            item => item.getBoundingClientRect().right <= widget.getBoundingClientRect().right + 1 &&
            item.getBoundingClientRect().left >= widget.getBoundingClientRect().left - 1).length""")
        self.assertEqual(visible, 6)
        next_button = gallery.get_by_role('button').last
        expect(next_button).to_be_enabled()
        next_button.click()
        expect(gallery.get_by_role('button').first).to_be_enabled()
        self.assertEqual(page.context.cookies(), [])

    def test_empty_primary_uses_mirror_on_mobile(self):
        page = self.open_gallery(manifest(0), manifest(), width=390)
        gallery = self.expect_photos(page, 8)
        self.assertTrue(gallery.locator('.instagram-widget').evaluate('(rail) => rail.scrollWidth > rail.clientWidth'))

    def test_broken_photos_are_excluded_and_mirror_is_used_below_six(self):
        self.expect_photos(self.open_gallery(manifest(), missing=(0, 2)), 6)
        self.expect_photos(self.open_gallery(manifest(6), manifest(8), missing=(0, 1)), 6)

    def test_delayed_native_widget_and_replaced_fallback_do_not_cancel_public_data(self):
        page = self.open_gallery(manifest(), delay=True)
        self.expect_photos(page, 8)
        page.locator('.instagram-block:not(.ts-instagram--fallback) .instagram-widget').evaluate(
            """widget => widget.innerHTML = '<div class="instagram-widget-item"><img src="/native.jpg"></div>'"""
        )
        self.expect_photos(page, 8)

    def test_empty_and_unavailable_feeds_leave_profile_without_broken_tiles(self):
        page = self.open_gallery(manifest(0))
        gallery = self.expect_photos(page, 0)
        expect(gallery.locator('.ts-instagram__empty')).to_be_visible()
        expect(gallery.locator('.ts-instagram__profile')).to_have_attribute('href', 'https://www.instagram.com/timberstore.sk/')
