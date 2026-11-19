# Khane Cinadia

A Persian RTL coffee shop website for coffee, conversation, reading, and cultural events.

## Features

- Cinematic intro using the supplied `assets/media/cinadia-hero.mp4` video
- Enter and Skip Intro actions, with Escape as another way out
- One video element reused from the intro in the scroll-driven hero to avoid a second download
- Native scrolling with a lightweight `requestAnimationFrame` expansion effect
- Filterable coffee, drinks, cake, and pastry menu
- Live music, poetry, and coffee workshop events
- Cafe story section and reservation request form
- Responsive desktop and mobile layout
- Play/Pause controls in the intro; the hero only shows Play when playback needs a manual start
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

- The supplied video uses `autoplay`, `muted`, `playsinline`, `loop`, and `preload="metadata"`. Audio stays muted when playback is started or resumed.
- A single video element keeps its source and playback position when it moves from the intro to the hero. It is never cloned and its source is never reloaded by the intro code.
- The video uses `object-fit: cover`, centered on desktop and positioned at 58% horizontally on narrow screens. Frame dimensions are reserved in CSS so media loading does not move the page layout.
- Enter, Skip Intro, or Escape dismiss the intro. Keyboard focus moves to the site identity, and the main page becomes available immediately after the short transition.
- Native scrolling expands the darkened frame across the full dynamic viewport, including behind the transparent header, logo, and navigation. Expansion completes at 72% of the scroll runway with a brief full-bleed hold. The sentence “سینا و نادیا / یک زوج هنری” stays centered independently from the supporting copy and menu/event actions. The header follows the scene out of view. A single scheduled `requestAnimationFrame` handles these effects; there are no wheel/touch interception handlers or scroll locks after entry.
- Reduced motion disables automatic playback and expansion, presenting the centered sentence over a static full-viewport frame. Visitors can still choose Play. The video also pauses while it is off-screen or the browser tab is hidden.
- A failed download leaves the cafe-toned fallback and navigation available. Blocked autoplay leaves a first frame and a visible Play control; playback is never required to enter.

## Project Structure

- `index.html` - page structure, intro, hero, and Persian content
- `styles.css` - design tokens, responsive layout, and cinematic media styles
- `script.js` - intro lifecycle, video handoff, scroll effect, menu filters, navigation, and reservation feedback
- `assets/media/cinadia-hero.mp4` - the supplied cinematic hero video

The optional `assets/media/cinadia-poster.webp` is not included, so no missing poster URL is requested. The page keeps its dark cafe-toned fallback behind the video. If that exact poster file is added later, set `poster="assets/media/cinadia-poster.webp"` on the existing video element.

## Live Demo

<https://mahanmzi-git.github.io/cafe-menu-events/>

## Reservation Note

The reservation form is a front-end demo. It does not send or store real reservations.

## Validation and Known Limitations

The cinematic integration was checked in Chrome at desktop and mobile sizes, including 360, 390, 768, 1280, 1440, and 1920 CSS pixels. Checks covered loading/playback, Enter/Skip/Escape, Play/Pause, simulated autoplay rejection and failed video loading, reduced motion, no JavaScript, menu filters, mobile navigation, event selection, and reservation demo submission. A synthesized touch swipe advanced the hero, and tap-to-pause worked. The final normal playback run reported no console or JavaScript errors.

The full-viewport hero refinement was checked at 320×568, 360×640, 390×844, 667×375, 768×1024, 844×390, 1440×900, and 1920×1080. Checks confirmed edge coverage behind the header, exact horizontal and vertical sentence centering, a usable expanded mobile menu, one video request during handoff, and no overlap between status messages, the sentence, and hero actions in blocked/missing-video states. Reduced-motion manual playback, no-JavaScript presentation, and direct menu-anchor entry were also checked. Normal playback runs reported no console errors or failed resources.

The optional poster is absent. An inherited layout issue in the story and reservation grids produces approximately 26 pixels of document overflow at a 1280-pixel desktop width; those existing sections were not redesigned in this media integration. Safari and physical iOS/Android devices have not been verified.

The hero opens with “Where flowers bloom and memories live.” centered over the small video frame. Native scrolling fades it out, then reveals the two-line Persian title. The cafe identity stays right-aligned at all breakpoints. The scroll cue is removed, and reduced motion presents the Persian title directly.
