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
- Visible Play/Pause controls in both the intro and hero, including a retry when autoplay is blocked
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
- Native scrolling expands the frame with `requestAnimationFrame`; there are no wheel/touch interception handlers or scroll locks after entry.
- Reduced motion disables automatic playback and the animated hero layout. Visitors can still choose Play. The video also pauses while it is off-screen or the browser tab is hidden.
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

The optional poster is absent. An inherited layout issue in the story and reservation grids produces approximately 26 pixels of document overflow at a 1280-pixel desktop width; those existing sections were not redesigned in this media integration. Safari and physical iOS/Android devices have not been verified.
