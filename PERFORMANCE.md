# Performance changes — November 26, 2026

These changes apply to the local preview and its paired standalone café pages. They preserve the existing design, menu names, prices, event details, navigation and video sources.

## Asset reductions

Sizes are decimal bytes from the actual files, not estimates of page speed.

| Asset group | Original referenced files | New 320px variants |
| --- | ---: | ---: |
| Four oversized coffee images | 19,465,082 | 50,230 |
| All 35 full-size menu photos | 23,474,969 | 376,200 |

Menu photos now have 160/320/480px WebP variants, `srcset`, `sizes`, lazy loading and asynchronous decoding. Browsers choose a variant for the display size and pixel density. The totals above compare one 320px variant per image; they do not imply that the entire menu downloads at entry. Original source images remain for provenance and future editing but are no longer referenced by these pages.

The events hero has 640/960/1440/1920px variants (56,088 / 105,940 / 208,792 / 380,484 bytes). Event cards have appropriately sized WebP sources too. Only the selected event category receives image sources; switching categories and hash links hydrate the relevant images. Native lazy-loaded images inside `noscript` retain access without JavaScript. Seven decorative menu assets were also recompressed without changing dimensions or tiling scale.

## Fonts

All application font references are local WOFF2, with `font-display: swap`:

- Markazi Text: 73,360 bytes, original variable 400–700 weight range.
- Rakkas: 47,644 bytes, original regular face.
- Noto Nastaliq Urdu: 241,076 bytes, down from 690,304 bytes.

Persian/Arabic shaping features, Arabic-script ranges, Latin labels, numbers and punctuation are retained. The café and shop share the same Markazi font, allowing browser cache reuse across routes. SIL Open Font License notices and source attribution are in `cafe-menu-events-main/assets/fonts/`.

No application stylesheet or HTML entry requests Google Fonts. The testing browser's extension injects its own Inter stylesheet; that is outside the site source and is not an application dependency.

## Hero rendering

Scene dimensions, title base sizes and hero position are measured together on resize. Scroll frames use cached geometry and update transform/opacity instead of repeatedly measuring after writes or changing text width, height and font size. Unchanged scroll progress skips mutations. A ResizeObserver handles viewport/scene size changes. Existing intro handoff, video lifecycle, native scrolling and reduced-motion behavior remain.

## Verification

- All seven production/standalone HTML entries retain the same visible copy as the pre-change local files.
- 86 unique default assets returned HTTP 200; 350 responsive-source references resolved to existing files.
- JavaScript syntax and the shop Tailwind build passed.
- Browser checks covered the home intro/hero, menu at 320/390/1440px viewport widths, mobile/desktop events, and mobile shop.
- Menu filtering returned 12 coffee items; the complete menu retained all 54 items. Site search and shop category search worked.
- Inactive event categories had no image `src` and no decoded image before selection; switching categories loaded their images.
- No application JavaScript errors or horizontal page overflow were observed in these checks. Browser extension warnings are excluded.
- A focused Impeccable detector pass was run. Its unrelated existing decorative-spacing and small-wordmark findings were not used to redesign the site.

These are local asset measurements and browser smoke checks, not fresh Lighthouse scores, physical-device testing, field Core Web Vitals or a production deployment.
