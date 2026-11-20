# Dedicated menu

Mode: Operate. This page extends the existing Cinadia visual system.

The request provides Iranian rug, musician, cypress, and cloud references and explicitly requires preserving the cafe item cards. The menu therefore inherits the home page's `.popular-row` card with an arch photograph, paper surface, fine warm border, centered item name, and red price. All 14 existing names, descriptions, and prices are preserved. The three browsing categories are presentation groupings, not added products.

The route uses the supplied illustrations as decorative transparent cutouts, a real linen crop as the reading surface, and the original textile's organic contours at the top and bottom. The artwork remains clear of interactive controls and item text. No new claims, availability, price units, or purchase flow are invented.

Palette: paper `#f4ead7`, linen `#f6f0e4`, cream `#fffdf7`, ruby `#8b3023`, tea `#2a1912`, secondary ink `#624c43`. Typography inherits Rakkas and Markazi Text. Per the user's follow-up, card grids use five columns at 768px and wider, and three below 768px. Cards grow for long names and ingredients; photos scale within their column.

Implementation is scoped to `menu.css` and `menu.js`, preserving shared styles and scripts. Root and nested `menu.html` routes use the appropriate relative asset paths. The page works as a complete browsable menu without JavaScript; JavaScript adds filtering, normalized Persian/Arabic search, result announcements, and an empty-state reset.

Browser-comment refinements: removed the welcome browse link, coffee and tea category captions, and footer home text link. A home icon now sits next to the mobile hamburger, matching the supplied reference. The 44px search magnifier is inside the header next to Home. Its field expands below the header without displacing the brand or icons, focuses after opening, and clears/collapses on Escape or a second activation. Empty outside clicks collapse it; active queries stay visible. Reduced-motion users receive immediate expansion. The cold-category caption is retained as it was not selected for removal.

QA: screenshots and browser checks are in `.impeccable/review/`. Tested widths: 1440, 768, 390, 320px; no document overflow. Checked all 14 products, category selection, ingredient search, no-result state, reset, mobile navigation, Escape, and nested route. Detector warnings: inherited/supplied cream palette is intentional; events text-shadow warning is an unrelated shared-sheet rule and is not rendered on this page.
