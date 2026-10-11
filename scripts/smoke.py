"""Exercise page navigation, accessibility, and downloads in Chromium."""
import argparse
import hashlib
import re
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:5173')
parser.add_argument('--offline-preview', type=Path, help='Test an exported self-contained HTML preview')
parser.add_argument('--screenshots', type=Path, help='Optional directory for desktop/mobile screenshots')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
base_url = 'http://portfolio-preview.test/' if args.offline_preview else args.url.rstrip('/') + '/'
project_pages = [
    ('adaptable-morphology', 'Task-Adaptive Humanoid', 'August 2026 — Present'),
    ('pneumatic-actuators', 'Smart Pneumatic Valve', 'September 2025 — May 2026'),
    ('nan-011', 'Nan-011', 'June 2026 — Present'),
    ('cnc-plotter', 'Multicolor CNC Plotter', 'September 2025 — May 2026'),
    ('variable-contact-sole', 'Variable Contact-Area Humanoid Sole', None),
    ('rbe-2001', 'RBE 2001 — Parallel Manipulator', None),
    ('rbe-3002', 'RBE 3002 — Autonomous Navigation', None),
    ('rbe-3001', 'RBE 3001 — Vision-Guided Ball Sorting', None),
]
project_gallery_counts = {
    'adaptable-morphology': 4,
    'pneumatic-actuators': 3,
    'variable-contact-sole': 1,
    'nan-011': 1,
    'rbe-2001': 2,
    'rbe-3001': 2,
    'rbe-3002': 2,
}


def expect_route(page, route):
    expect(page).to_have_url(base_url + '#' + route)
    expect(page.locator('h1')).to_have_count(1)
    expect(page.locator('h1')).to_be_visible()


def expect_featured(page, title=None):
    expect(page).to_have_url(base_url + '#/')
    carousel = page.get_by_role('region', name='Featured projects', exact=True)
    expect(carousel).to_be_visible()
    expect(carousel).to_have_attribute('aria-roledescription', 'carousel')
    expect(carousel.locator('.carousel-slide')).to_have_count(4)
    active_slide = carousel.locator('.carousel-slide[data-active="true"]')
    expect(active_slide).to_have_count(1)
    expect(active_slide).not_to_have_attribute('aria-hidden', 'true')
    assert active_slide.evaluate('element => !element.inert')
    inactive = carousel.locator('.carousel-slide:not([data-active="true"])')
    expect(inactive).to_have_count(3)
    assert inactive.evaluate_all('slides => slides.every(slide => slide.inert && slide.getAttribute("aria-hidden") === "true")')
    # Inactive originals and wraparound clones cannot be reached with assistive technology.
    expect(carousel.get_by_role('link', name=re.compile(r'^Explore '))).to_have_count(1)
    active = active_slide.locator('.project-card')
    expect(active).to_have_count(1)
    if title:
        expect(active).to_contain_text(title)
    expect(carousel.get_by_role('button', name='Previous featured project', exact=True)).to_be_visible()
    expect(carousel.get_by_role('button', name='Next featured project', exact=True)).to_be_visible()
    return carousel


def expect_home(page):
    expect_route(page, '/')
    expect(page.locator('h1')).to_have_text(re.compile(r'^Alejandro\s*Matilla\s*Calvo\.?$'))
    expect(page.locator('#about')).to_contain_text('Worcester Polytechnic Institute')
    expect(page.locator('#about')).to_contain_text('2028')
    expect_featured(page, 'Task-Adaptive Humanoid')
    expect(page.locator('#featured')).to_contain_text('Task-Adaptive Humanoid')
    expect(page.locator('#featured')).to_contain_text('Smart Pneumatic Valve')
    expect(page.locator('#documents')).to_have_count(1)
    expect(page.get_by_role('link', name='Download resume', exact=True)).to_have_count(1)
    expect(page.locator('#projects, #experience')).to_have_count(0)
    expect(page.locator('#home').get_by_role('link', name='Get in touch', exact=True)).to_have_count(0)
    expect(page.locator('footer').get_by_role('link', name='Get in touch', exact=True)).to_be_visible()
    expect(page.locator('body')).not_to_contain_text('Build it. Understand it. Pass it on.')
    # All resume actions stay together at the bottom of the main page.
    for link in page.get_by_role('link', name=re.compile('resume', re.I)).all():
        assert link.evaluate("element => Boolean(element.closest('#documents'))")
    assert page.locator('#featured').evaluate(
        "element => Boolean(element.compareDocumentPosition(document.querySelector('#documents')) & Node.DOCUMENT_POSITION_FOLLOWING)"
    )


def expect_projects(page):
    expect_route(page, '/projects')
    sections = page.locator('main [data-category]')
    expect(sections).to_have_count(3)
    assert sections.evaluate_all('items => items.map(item => item.dataset.category)') == [
        'research', 'personal', 'coursework'
    ]
    for category, count in [('research', 3), ('personal', 2), ('coursework', 3)]:
        section = page.locator(f'main [data-category="{category}"]')
        expect(section).to_be_visible()
        expect(section.locator('.project-card')).to_have_count(count)
    expect(page.locator('main')).not_to_contain_text('Autonomous Fruit Harvester')
    expect(page.locator('#documents')).to_have_count(0)
    expect(page.get_by_role('link', name=re.compile('resume', re.I))).to_have_count(0)


def expect_project(page, slug, title, period):
    expect_route(page, '/projects/' + slug)
    expect(page.locator('h1')).to_have_text(re.compile(r'^' + re.escape(title) + r'\.?$'))
    if period is not None:
        expect(page.locator('main')).to_contain_text(period)
    if slug not in ['variable-contact-sole', 'rbe-2001']:
        expect(page.get_by_role('heading', name='My contributions')).to_be_visible()
        expect(page.locator('main li')).not_to_have_count(0)
    content = page.locator('main')
    if slug == 'nan-011':
        expect(page.locator('.detail-summary')).to_contain_text(re.compile(r'quadruped', re.I))
        expect(page.locator('.detail-summary')).not_to_contain_text(re.compile(r'humanoid', re.I))
        expect(page.locator('.contributions')).to_contain_text(re.compile(r'quadruped', re.I))
    elif slug == 'variable-contact-sole':
        expect(content).to_contain_text(re.compile(r'humanoid', re.I))
        expect(content).to_contain_text(re.compile(r'(effective|contact)[ -]area', re.I))
        expect(content).to_contain_text(re.compile(r'roll', re.I))
    elif slug == 'rbe-2001':
        for phrase in ['Romi', 'parallel manipulator', 'inverse kinematics']:
            expect(content).to_contain_text(re.compile(re.escape(phrase), re.I))
        expect(content).to_contain_text(re.compile(r'(two|2) servos', re.I))
        expect(content).to_contain_text(re.compile(r'(three|3) (shelf )?positions', re.I))
        expect(content).to_contain_text(re.compile(r'cubes', re.I))
    elif slug == 'rbe-3002':
        for phrase in ['SLAM', 'TurtleBot', 'ROS', 'Git', 'A*', 'pure pursuit']:
            expect(content).to_contain_text(re.compile(re.escape(phrase), re.I))
        expect(content).to_contain_text(re.compile(r'(no collisions|without collisions|collision.free)', re.I))
        expect(content).to_contain_text(re.compile(r'drop.off', re.I))
    elif slug == 'rbe-3001':
        for phrase in ['computer vision', 'forward', 'inverse kinematics', 'trajectory planning']:
            expect(content).to_contain_text(re.compile(re.escape(phrase), re.I))
        expect(content).to_contain_text(re.compile(r'colored balls', re.I))
        expect(content).to_contain_text(re.compile(r'checkered', re.I))
        expect(content).to_contain_text(re.compile(r'demo video', re.I))
    expect(page.get_by_role('dialog')).to_have_count(0)
    expect(page.locator('#documents')).to_have_count(0)


def expect_menu(page):
    toggle = page.get_by_role('button', name='Open navigation', exact=True)
    expect(toggle).to_be_visible()
    dialog = page.get_by_role('dialog', name='Site navigation')
    expect(dialog).not_to_be_visible()
    toggle.click()
    expect(dialog).to_be_visible()
    for label in ['Home', 'Projects', 'Research publications']:
        expect(dialog.get_by_role('link', name=label, exact=True)).to_be_visible()
    expect(dialog.get_by_role('button', name='Close navigation', exact=True)).to_be_visible()
    # The native dialog keeps keyboard focus inside the menu in both directions.
    for key in ['Tab'] * 6 + ['Shift+Tab'] * 6:
        page.keyboard.press(key)
        assert dialog.evaluate('element => element.contains(document.activeElement)')
    page.keyboard.press('Escape')
    expect(dialog).not_to_be_visible()
    expect(toggle).to_be_focused()
    toggle.click()
    dialog.get_by_role('button', name='Close navigation', exact=True).click()
    expect(dialog).not_to_be_visible()
    expect(toggle).to_be_focused()


def menu_navigate(page, label, route):
    page.get_by_role('button', name='Open navigation', exact=True).click()
    dialog = page.get_by_role('dialog', name='Site navigation')
    dialog.get_by_role('link', name=label, exact=True).click()
    expect(dialog).not_to_be_visible()
    expect_route(page, route)


def expect_assets_and_layout(page):
    page.locator('img').evaluate_all('images => images.forEach(image => image.loading = "eager")')
    page.wait_for_function('Array.from(document.images).every(image => image.complete && image.naturalWidth > 0)')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal page overflow'


def expect_gallery(page, slug, open_full_size=False):
    links = page.locator('.project-gallery .gallery-image')
    count = project_gallery_counts.get(slug, 0)
    expect(links).to_have_count(count)
    for link in links.all():
        expect(link).to_have_attribute('target', '_blank')
        assert link.evaluate('element => element.href === element.querySelector("img").currentSrc')
    if open_full_size:
        assert count > 0
        link = links.first
        image = link.locator('img')
        dimensions = image.evaluate('element => [element.naturalWidth, element.naturalHeight]')
        expected_url = link.evaluate('element => element.href')
        route = page.url
        with page.expect_popup() as popup_info:
            link.click()
        popup = popup_info.value
        popup.wait_for_load_state('domcontentloaded')
        expect(popup).to_have_url(expected_url)
        popup.wait_for_function(
            'document.images.length === 1 && document.images[0].complete && document.images[0].naturalWidth > 0')
        assert popup.locator('img').evaluate(
            'element => [element.naturalWidth, element.naturalHeight]') == dimensions
        popup.close()
        expect(page).to_have_url(route)
    return count


def screenshot(page, filename):
    if args.screenshots:
        args.screenshots.mkdir(parents=True, exist_ok=True)
        page.evaluate("document.activeElement?.blur(); window.scrollTo({top: 0, behavior: 'instant'})")
        page.wait_for_function('window.scrollY === 0')
        page.screenshot(path=str(args.screenshots / filename), full_page=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    if args.offline_preview:
        preview_html = args.offline_preview.read_text()
        # A local intercepted origin also exercises refresh and history without file:// policy limitations.
        context.route(base_url + '**', lambda route: route.fulfill(status=200, content_type='text/html', body=preview_html))
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('response', lambda response: errors.append(f'HTTP {response.status}: {response.url}')
            if response.status >= 400 and response.url.startswith(base_url) else None)
    page.goto(base_url + '#/', wait_until='networkidle')
    expect_home(page)
    carousel = expect_featured(page)
    expect(carousel.get_by_role('button', name='Play slideshow', exact=True)).to_be_visible()
    expect(page.get_by_role('link', name='amc. — Alejandro Matilla Calvo, home', exact=True)).to_contain_text('amc')
    expect_menu(page)
    expect_assets_and_layout(page)
    screenshot(page, 'desktop.png')

    # Featured cards navigate to full pages, and browser back/forward restores each route.
    carousel.get_by_role('button', name='Next featured project', exact=True).click()
    expect_featured(page, 'Smart Pneumatic Valve')
    expect(carousel.locator('.carousel-track.is-animated')).to_have_count(0)
    page.locator('#featured').get_by_role('link', name=re.compile(r'^Explore Smart Pneumatic Valve,')).click()
    expect_project(page, *project_pages[1])
    expect(page.locator('main')).to_contain_text('Collaborated with a mechanical engineering PhD student')
    page.go_back()
    expect_home(page)
    page.go_forward()
    expect_project(page, *project_pages[1])
    page.reload(wait_until='networkidle')
    expect_project(page, *project_pages[1])
    expect_assets_and_layout(page)
    screenshot(page, 'desktop-project.png')
    page.get_by_role('link', name='amc. — Alejandro Matilla Calvo, home', exact=True).click()
    expect_home(page)
    page.locator('#featured').get_by_role('link', name=re.compile(r'^Explore Task-Adaptive Humanoid,')).click()
    expect_project(page, *project_pages[0])

    menu_navigate(page, 'Projects', '/projects')
    expect_projects(page)
    expect_assets_and_layout(page)
    screenshot(page, 'desktop-projects.png')
    gallery_total = 0
    gallery_project_total = 0
    for slug, title, period in project_pages:
        page.get_by_role('link', name=re.compile(r'^Explore ' + re.escape(title) + ',')).click()
        expect_project(page, slug, title, period)
        expect_assets_and_layout(page)
        count = expect_gallery(page, slug, open_full_size=slug == 'adaptable-morphology')
        gallery_total += count
        gallery_project_total += bool(count)
        # Pasting the detail URL and refreshing both preserve the project page.
        page.goto(base_url + '#/projects/' + slug, wait_until='networkidle')
        expect_project(page, slug, title, period)
        page.reload(wait_until='networkidle')
        expect_project(page, slug, title, period)
        menu_navigate(page, 'Projects', '/projects')
        expect_projects(page)
    assert (gallery_project_total, gallery_total) == (7, 15)

    menu_navigate(page, 'Research publications', '/publications')
    expect(page.locator('main')).to_contain_text(re.compile(r'(first publication|no publications|nothing published)', re.I))
    expect(page.locator('#documents')).to_have_count(0)
    page.reload(wait_until='networkidle')
    expect_route(page, '/publications')
    expect_assets_and_layout(page)
    screenshot(page, 'desktop-publications.png')
    menu_navigate(page, 'Home', '/')
    expect_home(page)

    # The resume download remains the original uploaded PDF, including in the offline export.
    with page.expect_download() as download_info:
        page.locator('#documents').get_by_role('link', name='Download resume', exact=True).click()
    download = download_info.value
    assert download.suggested_filename == 'Alejandro-Matilla-Resume.pdf'
    pdf = Path(download.path()).read_bytes()
    assert pdf.startswith(b'%PDF-')
    assert hashlib.sha256(pdf).digest() == hashlib.sha256(
        (root / 'public/documents/Alejandro-Matilla-Resume.pdf').read_bytes()
    ).digest()
    print('PASS: desktop pages, project categories, featured/detail routing, browser history/refresh, original PDF download')

    page.set_viewport_size({'width': 375, 'height': 812})
    page.goto(base_url + '#/', wait_until='networkidle')
    expect_home(page)
    carousel = expect_featured(page)
    expect(carousel.get_by_role('button', name='Play slideshow', exact=True)).to_be_visible()
    carousel.get_by_role('button', name='Previous featured project', exact=True).click()
    expect_featured(page, 'Smart Pneumatic Valve')
    carousel.get_by_role('button', name='Next featured project', exact=True).click()
    expect_featured(page, 'Task-Adaptive Humanoid')
    expect_menu(page)
    expect_assets_and_layout(page)
    screenshot(page, 'mobile.png')
    menu_navigate(page, 'Projects', '/projects')
    expect_projects(page)
    expect_assets_and_layout(page)
    screenshot(page, 'mobile-projects.png')
    page.get_by_role('link', name=re.compile(r'^Explore Multicolor CNC Plotter,')).click()
    expect_project(page, *project_pages[3])
    expect_assets_and_layout(page)
    screenshot(page, 'mobile-project.png')
    menu_navigate(page, 'Projects', '/projects')
    page.get_by_role('link', name=re.compile(r'^Explore Nan-011,')).click()
    expect_project(page, *project_pages[2])
    expect_assets_and_layout(page)
    expect_gallery(page, 'nan-011', open_full_size=True)
    menu_navigate(page, 'Research publications', '/publications')
    expect_assets_and_layout(page)
    menu_navigate(page, 'Home', '/')
    expect_home(page)
    assert not errors, errors
    print('PASS: mobile navigation, menu focus/dismissal, full-size galleries, publication empty state, assets, no overflow or runtime/HTTP errors')

    # A separate media context verifies timed looping without slowing the smoke test.
    motion_context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='no-preference')
    if args.offline_preview:
        motion_context.route(base_url + '**', lambda route: route.fulfill(
            status=200, content_type='text/html', body=preview_html))
    motion_page = motion_context.new_page()
    motion_page.on('pageerror', lambda error: errors.append(str(error)))
    virtual_clock = hasattr(motion_page, 'clock')
    if virtual_clock:
        motion_page.clock.install()

    def advance_slideshow(milliseconds):
        if virtual_clock:
            motion_page.clock.fast_forward(milliseconds)
        else:
            motion_page.wait_for_timeout(milliseconds)

    def advance_rotation(title):
        advance_slideshow(3000)
        expect(carousel.locator('.carousel-track')).to_have_class(re.compile(r'\bis-animated\b'))
        # Timer-controlled transition settlement also resets invisible wraparound clones.
        advance_slideshow(700)
        expect_featured(motion_page, title)

    motion_page.goto(base_url + '#/', wait_until='networkidle')
    carousel = expect_featured(motion_page, 'Task-Adaptive Humanoid')
    expect(carousel.get_by_role('button', name='Pause slideshow', exact=True)).to_be_visible()
    advance_rotation('Smart Pneumatic Valve')
    advance_rotation('Task-Adaptive Humanoid')

    # Explicit pause remains in effect after keyboard focus and pointer leave.
    carousel.get_by_role('button', name='Pause slideshow', exact=True).click()
    expect(carousel.get_by_role('button', name='Play slideshow', exact=True)).to_be_visible()
    motion_page.evaluate('document.activeElement?.blur()')
    motion_page.mouse.move(0, 0)
    advance_slideshow(6000)
    expect_featured(motion_page, 'Task-Adaptive Humanoid')
    carousel.get_by_role('button', name='Next featured project', exact=True).click()
    advance_slideshow(700)
    expect_featured(motion_page, 'Smart Pneumatic Valve')
    carousel.get_by_role('button', name='Previous featured project', exact=True).click()
    advance_slideshow(700)
    expect_featured(motion_page, 'Task-Adaptive Humanoid')
    carousel.get_by_role('button', name='Play slideshow', exact=True).click()
    expect(carousel.get_by_role('button', name='Pause slideshow', exact=True)).to_be_visible()
    motion_page.evaluate('document.activeElement?.blur()')
    motion_page.mouse.move(0, 0)
    advance_rotation('Smart Pneumatic Valve')

    # Keyboard focus and hover prevent an automatic change while reading or operating a slide.
    carousel.get_by_role('button', name='Next featured project', exact=True).focus()
    advance_slideshow(6000)
    expect_featured(motion_page, 'Smart Pneumatic Valve')
    motion_page.evaluate('document.activeElement?.blur()')
    motion_page.mouse.move(0, 0)
    advance_rotation('Task-Adaptive Humanoid')
    carousel.locator('.carousel-slide[data-active="true"] .project-card').hover()
    advance_slideshow(6000)
    expect_featured(motion_page, 'Task-Adaptive Humanoid')
    motion_page.mouse.move(0, 0)
    advance_rotation('Smart Pneumatic Valve')
    assert not errors, errors
    print('PASS: featured carousel 3-second looping, manual arrows, explicit pause/resume, keyboard focus and hover pause')
    motion_context.close()

    # CSS transitions use the browser's animation timeline, so sample real positions separately.
    smooth_context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='no-preference')
    if args.offline_preview:
        smooth_context.route(base_url + '**', lambda route: route.fulfill(
            status=200, content_type='text/html', body=preview_html))
    smooth_page = smooth_context.new_page()
    smooth_page.on('pageerror', lambda error: errors.append(str(error)))
    smooth_page.goto(base_url + '#/', wait_until='networkidle')
    smooth_carousel = expect_featured(smooth_page, 'Task-Adaptive Humanoid')
    smooth_carousel.get_by_role('button', name='Pause slideshow', exact=True).click()
    track = smooth_carousel.locator('.carousel-track')
    width = smooth_carousel.locator('.carousel-slides').evaluate('element => element.getBoundingClientRect().width')

    def track_x():
        return track.evaluate('element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41')

    def smooth_move(button_name, direction, title, end_position):
        start = track_x()
        smooth_carousel.get_by_role('button', name=button_name, exact=True).click()
        expect(track).to_have_class(re.compile(r'\bis-animated\b'))
        smooth_page.wait_for_timeout(150)
        middle = track_x()
        progress = (middle - start) * direction
        assert 0 < progress < width, f'Expected an intermediate sliding position; moved {progress} of {width}'
        smooth_page.wait_for_timeout(150)
        later = track_x()
        assert (later - middle) * direction > 0, 'Slide reversed or jumped before reaching its neighbor'
        smooth_page.wait_for_function(
            '!document.querySelector(".carousel-track").classList.contains("is-animated")')
        expect_featured(smooth_page, title)
        assert abs(track_x() - end_position * width) < 2, 'Track did not settle at the expected real slide'

    smooth_move('Next featured project', -1, 'Smart Pneumatic Valve', -2)
    # Both wrap directions travel to their neighboring clone before resetting to the real slide.
    smooth_move('Next featured project', -1, 'Task-Adaptive Humanoid', -1)
    smooth_move('Previous featured project', 1, 'Smart Pneumatic Valve', -2)
    smooth_move('Previous featured project', 1, 'Task-Adaptive Humanoid', -1)
    assert not errors, errors
    print('PASS: smooth horizontal next/previous transitions and seamless forward/backward wraparound')
    smooth_context.close()
    browser.close()
