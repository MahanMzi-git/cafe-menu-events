# Khane Cinadia

A Persian RTL coffee shop website for coffee, conversation, reading, and cultural events.

## Features

- Cinematic intro using the supplied `assets/media/cinadia-hero.mp4` video
- Separate menu, home, and store actions, with Escape as another way out
- One video element reused from the intro in the scroll-driven hero to avoid a second download
- Native scrolling with a lightweight `requestAnimationFrame` expansion effect
- Featured menu with 14 popular items and a separate menu.html page with the confirmed menu
- Live music, poetry, and coffee workshop events
- Cafe story section and reservation request form
- Responsive desktop and mobile layout
- The hero only shows Play when playback needs a manual start
- Reduced-motion support, a static layout without scroll effects, and a visual fallback when the video fails

## Tech Stack

Static HTML5, CSS3, and vanilla JavaScript. No build step is required.

## Run Locally

```powershell
python -m http.server 8000
```

Open <http://localhost:8000>.

Run this command from this `cafe-menu-events-main` folder, which contains the cinematic build and the supplied video. Serving the repository root also works: its production entry loads the same shared CSS, JavaScript, and video with folder-qualified paths.

## Video Behavior

- The optimized H.264 intro video is approximately 488 KB at 1280 × 542 and has a 45 KB WebP poster. Its MP4 metadata is near the beginning of the file, so playback can start before the full video downloads. Visitors who prefer reduced motion see the intro video paused.
- A single video element keeps its source and playback position when it moves from the intro to the hero. It is never cloned and its source is never reloaded by the intro code.
- The video uses `object-fit: cover`, centered on desktop and positioned at 58% horizontally on narrow screens. Frame dimensions are reserved in CSS so media loading does not move the page layout.
- The menu and home actions dismiss the intro and focus their destination. Escape dismisses the intro to the site identity. The store action explains that its page is not yet available.
- Native scrolling expands the darkened frame across the full dynamic viewport, including behind the transparent header, logo, and navigation. Expansion completes at 72% of the scroll runway with a brief full-bleed hold. The sentence “سینا و نادیا / یک زوج هنری” stays centered independently from the supporting copy and menu/event actions. The header follows the scene out of view. A single scheduled `requestAnimationFrame` handles these effects; there are no wheel/touch interception handlers or scroll locks after entry.
- Reduced motion disables automatic playback and expansion, presenting the centered sentence over a static full-viewport frame. Visitors can still choose Play. The intro video pauses while it is off-screen or the browser tab is hidden.
- The 357 KB portrait story video has a static poster, loads shortly before it approaches the viewport, plays while visible, and pauses out of view. Reduced-motion visitors can opt in using its native controls.
- A failed download leaves the cafe-toned fallback and navigation available. Blocked autoplay leaves a first frame and a visible Play control; playback is never required to enter.

## Project Structure

- `index.html` - page structure, intro, hero, and Persian content
- `styles.css` - design tokens, responsive layout, and cinematic media styles
- `script.js` - intro lifecycle, video handoff, scroll effect, featured menu display, navigation, and reservation feedback
- `assets/media/cinadia-hero.mp4` - optimized 488 KB cinematic hero video
- `assets/media/cinadia-poster.webp` - 45 KB intro poster
- `assets/media/landingpage-video.mp4` - optimized 357 KB on-demand story video
- `assets/media/cinadia-story-poster.webp` - story-video poster

Both clips are silent H.264 MP4 files to reduce transfer and decoding work. The intro still shares one video element with the scroll-driven hero.

## Live Demo

<https://mahanmzi-git.github.io/cafe-menu-events/>

## Reservation Note

The reservation form is a front-end demo. It does not send or store real reservations.

## Validation and Known Limitations

Both video clips were compared in Chrome before and after compression. The intro now streams its 488 KB MP4 on the constrained mobile-network test and starts playing after the poster and metadata load; the 357 KB story video is absent from the initial request list and is requested when its section approaches the viewport. The cinematic entry, hero handoff, reduced-motion behavior, story playback, and menu/navigation remain in the local preview. The font host could not be reached by the isolated test browser.

The full-viewport hero refinement was checked at 320×568, 360×640, 390×844, 667×375, 768×1024, 844×390, 1440×900, and 1920×1080. Checks confirmed edge coverage behind the header, exact horizontal and vertical sentence centering, a usable expanded mobile menu, one video request during handoff, and no overlap between status messages, the sentence, and hero actions in blocked/missing-video states. Reduced-motion manual playback, no-JavaScript presentation, and direct menu-anchor entry were also checked. Normal playback runs reported no console errors or failed resources.

The optional poster is absent. An inherited layout issue in the story and reservation grids produces approximately 26 pixels of document overflow at a 1280-pixel desktop width; those existing sections were not redesigned in this media integration. Safari and physical iOS/Android devices have not been verified.

The latest compact-navigation, dedicated-menu, hero-text-fit, and blue-event updates were checked in Chromium at 320, 390, 563, and 1440 CSS pixels. All 14 prices, menu navigation, return links, video text bounds across four scroll positions, and menu-page overflow passed; no JavaScript errors were reported. External stock images may fail when their host is unavailable.
