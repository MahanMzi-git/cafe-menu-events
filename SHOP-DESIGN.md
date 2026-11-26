# Sinadia jewelry store

## Scope and visual authority

New route: `shop.html`. The user's approved Sapphire Elegance reference and explicit category-card requirements govern this route. The existing café world and its `DESIGN.md` are preserved. This is a static HTML/CSS/JavaScript extension, with no framework or dependency additions.

Mode: browse / discover jewelry categories. Women's categories: necklaces, rings, bracelets, earrings. Men's categories, confirmed by the user: rings, bracelets, necklaces. No catalog, prices, delivery promises, cart, or checkout data was supplied; none is invented. Category deep links reveal the selected collection and direct visitors to the existing Sinadia gallery Instagram for current models and availability.

## Women's and men's collections

An RTL pill tab selector below the category heading switches the existing arch grid in place. Navy/cream selected states, gold outline, 44px targets, roving keyboard focus, arrow/Home/End keys, and reduced-motion support follow the shop system. Women is the default; `audience=men` selects the men's set. Category links, collection return links, reload, and browser history preserve the selected audience. Legacy category URLs still open women's categories. Switching audience clears the previous category to avoid stale collection details. Desktop shows four women's or three centered men's cards; smaller screens retain two columns.

Men's category and collection images now use the three user-supplied Gemini-generated jewelry images (November 26, 2026), resized proportionally to a maximum dimension of 1000px and encoded as WebP. Per-category object positions preserve the jewelry within the existing arch crops. These are supplied illustrative assets, not evidence of product stock or materials. The renderer retains a typography fallback for categories without an image.

## Direction contract

- Deep navy #102B4C, warm cream #F8F0E5, antique gold #C69A54, champagne #D9C4A7.
- Existing Markazi Text for Persian, a restrained serif wordmark, and the existing Sinadia brand mark.
- Floating house header matching the café/events navigation, sapphire editorial hero, then four architectural arches. Category cards keep their restrained treatment without shadows, glow, or decorative movement.
- The four category frames share `#shop-arch-curve`: a symmetric classical curve reaching its spring points at 48% of frame height, then two vertical walls and a flat base. Their object-bounding-box clip and four outlines reference that exact geometry. The hero now follows the user's second hero reference with its own `#shop-hero-curve`: a curved top-left corner and opposing bottom-right corner, with a navy lower corner. Its clip and fine gold outline share that path. Cards retain their 1.2px non-scaling gold stroke, cream inset, and approximately 85% photo / 15% navy label.
- Desktop: four columns from 1024px; tablet and mobile: two columns. The card aspect ratio remains 1.24 at every width. The label reserves at least 20px on small phones for legibility. The approved visual order is necklace, ring, bracelet, earring from left to right, with DOM and focus order following RTL.
- Object-fit cover with individual focal points. Whole-card links, explicit accessible names, visible focus, 300ms hover to 1.05 image scale, unchanged navy labels, and reduced-motion support.
- Images are extracted directly from the approved reference, not replacement stock. See `assets/jewelry/PROVENANCE.md` for dimensions and source limitations.

## Implementation

`cafe-menu-events-main/shop-data.js` contains category data independently of the reusable native-link renderer in `shop.js`. The renderer clones `#jewelry-category-template`; presentation and Tailwind classes live in that one native HTML template. Root and standalone café intro links reach the same store. Query strings and hashes make categories bookmarkable; unknown category IDs fall back to the store overview. Without JavaScript, named category links and the gallery contact remain available.

## Tailwind refactor

There was no existing package, framework, Tailwind installation, or build command. The minimal root `package.json` adds only `tailwindcss` and `@tailwindcss/cli`, both pinned to 4.3.5 as development dependencies. `npm run build` / `npm run build:shop` compile `shop.tailwind.css` to the committed `shop.css`; `npm run watch:shop` is the optional authoring watcher. Serving the site still requires no runtime dependencies or build server.

All Shop layout, spacing, typography, palette, responsive behavior, focus, selection, hover and motion states use `shop:` prefixed utilities. Source scanning is limited to `shop.html`, `shop.js`, and `shop-header.js`. Global Tailwind Preflight is deliberately excluded. Remaining authored CSS is limited to the existing local `@font-face` declarations, a minimal `.shop-page` normalization, and the shared SVG `clip-path` reference. Café and Events do not load this stylesheet.

The hero keeps Persian copy at the left and imagery at the right from 768px upward, then stacks image-first on smaller screens. The desktop split is 54% imagery / 46% copy. Its media wrapper has a fluid 260–348px minimum height on split layouts; stacked media uses the original 551/251 ratio. The unscaled photograph uses centered object-fit cover. The reference's gold introductory line, two-line heading, compact pill-shaped action, and left botanical ornament are scoped to the hero. The action retains a 44px touch target even though its visual pill is smaller. Category proportions remain 1.24 throughout.

All five original image files remain byte-for-byte unchanged. The earlier symmetric hero zoom was removed to match the opposing curved corners and wider jewelry view in the user's new reference. Native clipping and outline geometry are separate from the rectangular source photograph, which still includes painted framing. The new transparent botanical extraction is 5,112 bytes and is documented in `assets/jewelry/PROVENANCE.md`. No new script, font, or external request was added. Original high-resolution photographs are still preferable for production.

## Refactor verification

`npm run build` succeeds. Browser checks cover eight widths from 320 to 1440px, including 601/768/900/1024 split-layout bounds, category routes, intro routes, focus, reduced motion, image loading, unchanged navy hover bars, and shared SVG geometry. The hero is checked for internal overlap as well as document overflow.

Nineteen protected café/menu/events sources and original jewelry images match their pre-refactor SHA-256 hashes. Eight root/standalone menu/events captures at 390/1440px pass visual regression comparison: seven PNGs match exactly; one has only tiny Chrome photograph-decoding variation (at most 5/255 per channel, mean under 0.001), not content or layout drift. Evidence and repeatable local checks are under `.impeccable/review/tailwind-refactor/`.

## Approved mobile hero

On November 26, 2026 the user approved the separate `shop-mobile-test.html` experiment for the main shop. Below 768px, the hero keeps the photo on the right and copy on the left in equal columns. Typography and spacing scale for the viewport, with 16px descriptive text and a 44px button target. The photo uses a 43% horizontal focal point and the existing asymmetric clip. Four fine non-scaling gold contours at 1/5/9/13px insets follow that geometry; the additional contours are hidden above the mobile breakpoint. Styles live in the existing shop Tailwind source and compiled stylesheet. Desktop composition, wording, category data, and navigation remain unchanged. The test page remains available for reference.

## Gallery editorial extension

The shop now continues with an asymmetric gallery edit, a navy typographic story called “آبیِ ماندگار”, and a visit invitation using the existing gallery contact and address. These are editorial entrances to the four existing categories, not invented product listings or claims of stock, material, price, or manufacturing. The original hero, four category arches, and two-column footer remain the visual anchors.

The edit uses a landscape lead and two smaller, staggered images; mobile places the lead first and keeps the smaller pair side by side. The story and visit sections stack below 601px. Styling remains entirely in the locally compiled `shop:` Tailwind utilities. A native `details` provides optional styling advice without new JavaScript. New images reuse the original local WebP URLs with lazy loading, asynchronous decoding, and reserved aspect ratios. No additional media, font, runtime dependency, third-party request, or scroll animation is introduced. Original image resolution remains a known limitation until photography is available.
