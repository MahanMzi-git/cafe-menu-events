# Khane Cinadia

A Persian RTL cafe website for Khane Cinadia, a warm neighborhood space for coffee, conversation, reading, and intimate cultural events.

## Features

- RTL Persian interface with a nostalgic Iranian visual direction
- Coffee shop menu with coffee, drinks, cakes, and pastries
- Featured menu with 14 popular items; the full menu will have its own page
- Upcoming live music, poetry, and coffee workshop events
- Cafe story section and image-led editorial layout
- Reservation request form for tables and events
- Responsive layout for desktop and mobile screens
- Accessible navigation, labels, focus states, and reduced-motion support

## Cinematic Build

The production `index.html` and the standalone page in `cafe-menu-events-main/` both serve the cinematic experience. They share the CSS, JavaScript, and supplied video in `cafe-menu-events-main/`. One muted video element is reused for the intro and hero, with menu, home, and store actions; Escape remains the keyboard exit. The hero hides the Pause button during playback and retains a Play action only when needed. The optional poster is not currently present, so a cafe-toned visual fallback appears if the video cannot load.

Scrolling expands the darkened hero video across the entire viewport behind the header, logo, and navigation. The Persian sentence “سینا و نادیا / یک زوج هنری” is centered independently over it. Reduced motion keeps this composition static with manual playback available.

## Tech Stack

This lightweight static website uses HTML5, CSS3, and vanilla JavaScript. Images are loaded from Unsplash. No build step or package installation is required.

## Run Locally

From the repository root, serve the cinematic build:

```powershell
python -m http.server 8000
```

Then open http://localhost:8000. The root entry uses the same tested cinematic build as the standalone folder. See `cafe-menu-events-main/README.md` for the video lifecycle, fallback, accessibility, and asset details.

## Project Structure

- `index.html` - production entry for GitHub Pages, referencing the shared cinematic assets
- `cafe-menu-events-main/index.html` - standalone entry with folder-relative asset paths
- `cafe-menu-events-main/styles.css` - shared visual system, layout, and responsive styles
- `cafe-menu-events-main/script.js` - shared video, hero, navigation, menu, and reservation interactions
- `cafe-menu-events-main/assets/media/cinadia-hero.mp4` - supplied cinematic video
- Root-level `styles.css` and `script.js` - earlier files retained for reference; not loaded by the production entry

The two HTML entries contain the same page content. When updating the standalone entry, keep the root entry synchronized and prefix its three local asset paths with `cafe-menu-events-main/`.

## Live Demo

https://mahanmzi-git.github.io/cafe-menu-events/

## Reservation Note

The reservation form is currently a front-end demo. It shows local confirmation feedback and does not send or store real reservations.

## License

This project is provided for the Khane Cinadia website concept.
