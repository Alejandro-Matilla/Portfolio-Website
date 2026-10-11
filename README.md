# Alejandro Matilla Calvo — Engineering Portfolio

A responsive React portfolio for a Robotics Engineering and Mechanical Engineering student at Worcester Polytechnic Institute, expected to graduate in May 2028. The `amc.` brand, charcoal home section, warm light project pages, and orange accents carry across the site.

## Pages and navigation

The burger menu is available in the top-right corner on desktop and mobile. Each view is an independent page with a shareable hash URL, supported by browser Back, Forward, and refresh. Hash URLs also keep every page working in the downloadable offline preview.

- `#/`: name and introduction, education, a centered carousel of two featured research projects, and one resume card at the bottom.
- `#/projects`: distinct **Research**, **Personal projects**, and **Coursework** sections, in that order. There are three research projects, two personal projects, and three coursework projects (RBE 2001, 3001, and 3002).
- `#/projects/<project-id>`: an individual project page with overview, supplied contributions and case-study sections, status, and timeline when provided.
- `#/publications`: a dedicated research publications page. No publications are listed yet; the team is working toward its first.

Featured cards link directly to the same individual project pages used by the projects collection. The fruit harvester and teaching/experience section are not shown. Experience and skills data are retained for future use. The original uploaded resume remains unchanged.

The featured carousel slides horizontally every three seconds, with a seamless loop, previous/next arrows embedded in the pictures, touch swipes, and a pause/play control. Its frame stays stable as captions vary, and the slide count follows the featured projects. It pauses during hover or keyboard interaction and starts paused for viewers who prefer reduced motion. The burger options use compact rows, and the home hero has one “Explore my work” action; contact remains in the footer. Nan-011 is a quadruped robot and now uses the supplied quadruped CAD image. The research section includes the task-adaptive humanoid, pneumatic valve, and variable contact-area humanoid sole.

## Develop

Use the existing checkout at `/workspace/Portfolio-Website`; cloud tasks already have isolated environments, so no extra Git worktree is needed.

Node 24 is installed in this environment. Vite 7 requires Node 20.19+ or 22.12+.

```bash
cd /workspace/Portfolio-Website
npm ci --cache /workspace/.cache/npm --no-fund --no-audit
npm run dev -- --port 5173 --strictPort
```

The server binds to `0.0.0.0`. No API credentials, database, or external font service is required. Fonts and images are served locally. Installation uses the npm registry, allowed by the environment's package-manager preset.

## Download and open the website

The cloud onboarding view does not provide a live website preview. Generate the downloadable copy:

```bash
npm run export:preview
```

This writes `/workspace/portfolio-preview.html` and `/workspace/alejandro-portfolio-preview.zip`. Download the ZIP, extract it, and double-click `portfolio-preview.html` to open the website in a browser. Fonts, illustrations, and the original resume are embedded. All pages, the burger menu, project navigation, and downloads work without a server. Email links use your device's email app. Exporting the preview requires the environment's Node and Python 3 installations; opening it needs only a browser.

This is a local preview, separate from publicly deploying the website.

## Validate

```bash
npm run build
# With the development server running:
npm run test:smoke
# To test the production build:
npm run preview -- --port 4173 --strictPort
npm run test:smoke -- --url http://127.0.0.1:4173
# Test the exported preview:
npm run test:smoke -- --offline-preview /workspace/portfolio-preview.html
```

The browser smoke test uses Python Playwright and Chromium at `/usr/bin/chromium`. It exercises all eight project pages, ordered categories, featured/project links, three-second carousel looping and controls, intermediate horizontal movement and smooth loop boundaries, direct navigation and refresh, Back/Forward, desktop/mobile menu focus and dismissal, original resume download, image loading, overflow, and browser errors. Optional screenshots: `npm run test:smoke -- --screenshots /tmp/portfolio-checks`.

## Add photographs and deeper project explanations

Edit `src/data.js` for profile copy, project descriptions, categories, featured work, and publication entries.

The supplied project PDF provides 22 authentic photographs, CAD views, analyses, and sketches for seven projects. These appear as seven primary images and 15 supplementary gallery frames. Gallery links open the original image at full size in a new tab, including in the offline preview. Photos preserve the complete hardware view in contained frames. The CNC plotter still uses a labeled concept illustration, and the home portrait remains a placeholder.

- Put a portrait in `public/images/portrait.jpg` and set `profile.portrait` to `'/images/portrait.jpg'`. It appears in the home and about sections.
- Put project photos in `public/images/`. Add `image: '/images/your-project.jpg'` and a descriptive `imageAlt` to its project object. Photos replace conceptual artwork in both cards and project pages; the concept caption disappears automatically.
- Add an `imageCaption` for the primary image and optional `gallery: [{ src: '/images/detail.jpg', alt: 'Describe the image.', caption: 'Explain the design detail.' }]` entries for additional figures. Keep the primary image out of `gallery` to avoid repeating it.
- Add projects to the `projects` array, with a stable URL-safe `id` and `category: 'research'`, `'personal'`, or `'coursework'`. Category sections and counts update automatically. Set `featured: true` to include any project in the home-page carousel; it adapts to additional featured entries.
- Add optional `sections: [{ heading: 'Design process', body: ['First paragraph.', 'Second paragraph.'] }]` to a project for longer explanations. Only supplied text is rendered; no case-study results are invented.
- Add real publications to `publications` using `{ id, title, authors, venue, year, href }`. The page switches from its empty state to the publication list automatically. `href` is optional; supply a real paper URL when available.
- The original resume is at `public/documents/Alejandro-Matilla-Resume.pdf`. Replace it with an updated PDF under the same name when ready; update the displayed file size in `src/App.jsx` if it changes.
- Regenerate the offline preview after content changes with `npm run export:preview`.

## Structure

- `src/App.jsx`: page routes, shared header/menu/footer, home, project index, individual project pages, publications
- `src/styles.css`: original visual design and responsive sections
- `src/pages.css`: page layouts, menu drawer, full-name branding, details
- `src/carousel.css`: centered featured carousel and responsive controls
- `src/photos.css`: complete photo frames, primary captions, and project galleries
- `src/data.js`: editable resume-grounded content and publication list
- `src/assets.js`: shared asset resolution for hosted and offline versions
- `public/images/`: concept illustrations and future photos
- `public/documents/`: downloadable original resume
- `scripts/export-preview.mjs`: single-file HTML and ZIP exporter
- `scripts/smoke.py`: functional browser verification

## Publish

`npm run build` generates `dist/`, suitable for static hosting. Hash navigation works without custom server rewrite rules. Review and save the cloud setup draft in environment settings, then publish the environment snapshot when ready. Publishing the environment is separate from publicly hosting the website. Running servers must restart in later tasks.
