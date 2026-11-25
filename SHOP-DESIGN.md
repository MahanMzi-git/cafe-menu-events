# Sinadia jewelry store

## Scope and visual authority

New route: `shop.html`. The user's approved Sapphire Elegance reference and explicit category-card requirements govern this route. The existing café world and its `DESIGN.md` are preserved. This is a static HTML/CSS/JavaScript extension, with no framework or dependency additions.

Mode: browse / discover jewelry categories. Exactly four categories: necklaces, rings, bracelets, earrings. No catalog, prices, delivery promises, cart, or checkout data was supplied; none is invented. Category deep links reveal the selected collection and direct visitors to the existing Sinadia gallery Instagram for current models and availability.

## Direction contract

- Deep navy #102B4C, warm cream #F8F0E5, antique gold #C69A54, champagne #D9C4A7.
- Existing Markazi Text for Persian, a restrained serif wordmark, and the existing Sinadia brand mark.
- Floating house header matching the café/events navigation, sapphire editorial hero, then four architectural arches. Category cards keep their restrained treatment without shadows, glow, or decorative movement.
- Hero and card frames share one SVG path, `#shop-arch-curve`: a symmetric classical curve reaching its spring points at 48% of frame height, then two vertical walls and a flat base. An object-bounding-box clip and five `<use>` outlines reference that exact geometry. The antique-gold outline is a non-scaling 1.2px stroke; no border-radius defines the arches. Cards keep a fine cream inset, about 85% photo and 15% navy label.
- Desktop: four columns from 1024px; tablet and mobile: two columns. The card aspect ratio remains 1.24 at every width. The label reserves at least 20px on small phones for legibility. The approved visual order is necklace, ring, bracelet, earring from left to right, with DOM and focus order following RTL.
- Object-fit cover with individual focal points. Whole-card links, explicit accessible names, visible focus, 300ms hover to 1.05 image scale, unchanged navy labels, and reduced-motion support.
- Images are extracted directly from the approved reference, not replacement stock. See `assets/jewelry/PROVENANCE.md` for dimensions and source limitations.

## Implementation

`cafe-menu-events-main/shop-data.js` contains category data independently of the reusable native-link renderer in `shop.js`. The renderer clones `#jewelry-category-template`; presentation and Tailwind classes live in that one native HTML template. Root and standalone café intro links reach the same store. Query strings and hashes make categories bookmarkable; unknown category IDs fall back to the store overview. Without JavaScript, named category links and the gallery contact remain available.

## Tailwind refactor

There was no existing package, framework, Tailwind installation, or build command. The minimal root `package.json` adds only `tailwindcss` and `@tailwindcss/cli`, both pinned to 4.3.5 as development dependencies. `npm run build` / `npm run build:shop` compile `shop.tailwind.css` to the committed `shop.css`; `npm run watch:shop` is the optional authoring watcher. Serving the site still requires no runtime dependencies or build server.

All Shop layout, spacing, typography, palette, responsive behavior, focus, selection, hover and motion states use `shop:` prefixed utilities. Source scanning is limited to `shop.html`, `shop.js`, and `shop-header.js`. Global Tailwind Preflight is deliberately excluded. Remaining authored CSS is limited to the existing local `@font-face` declarations, a minimal `.shop-page` normalization, and the shared SVG `clip-path` reference. Café and Events do not load this stylesheet.

The hero keeps Persian copy at the left and imagery at the right on split layouts, then stacks as before on mobile. Its wrapper is explicitly width-constrained to its grid column. At narrow split widths it uses a 1.55 aspect and vertical centering so the original pendant and ring can fit; desktop and mobile preserve the previous 551/251 frame ratio where minimum heights allow it. Category proportions remain 1.24 throughout.

All five original image files remain byte-for-byte unchanged. Because they were supplied as crops of a design comp with painted edges, the hero uses non-destructive CSS framing (1.34 scale, bottom-origin and responsive object position) to keep those old corners outside the new SVG viewport. The operative arch and outline are frontend geometry, demonstrated by `arch-geometry-proof.png` with all jewelry rasters hidden. This is not a claim that the source rasters contain no painted framing; original high-resolution photographs are still preferable for production.

## Refactor verification

`npm run build` succeeds. Browser checks cover eight widths from 320 to 1440px, including 601/768/900/1024 split-layout bounds, category routes, intro routes, focus, reduced motion, image loading, unchanged navy hover bars, and shared SVG geometry. The hero is checked for internal overlap as well as document overflow.

Nineteen protected café/menu/events sources and original jewelry images match their pre-refactor SHA-256 hashes. Eight root/standalone menu/events captures at 390/1440px pass visual regression comparison: seven PNGs match exactly; one has only tiny Chrome photograph-decoding variation (at most 5/255 per channel, mean under 0.001), not content or layout drift. Evidence and repeatable local checks are under `.impeccable/review/tailwind-refactor/`.
