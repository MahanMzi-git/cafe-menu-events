# Design

<!-- impeccable:design-schema 1 -->

## Visual World

Khane Cinadia uses a 1960s Tehran neighbourhood-cafe ephemera world: cream paper, saffron red, pistachio green, dark tea brown, and crisp old-print typography. Printed menu cards and event notices feel collected rather than digitally generic.

## Palette

- Paper: #F4EAD7
- White: #FFFDF7
- Tea brown: #2A1912
- Saffron red: #A83A28
- Pistachio: #667344
- Ink: #4A3A30
- Events blue: #365A8C (muted event CTA); event section uses the supplied blue Persian rug image

## Typography

The intro identity and main hero title use Rakkas for its warm, poster-like voice. Markazi Text carries the other headings, navigation, body copy, controls, and menu details with generous line height. Latin labels keep a restrained, letter-spaced treatment.

## Signature

High-contrast red-and-cream print blocks, thin double rules, small geometric rosettes, and asymmetric editorial compositions drawn from Iranian cafe ephemera. The home menu showcases the supplied popular items and prices; the full menu belongs on its own page.

## Cinematic Media

The cinematic build lives in `cafe-menu-events-main/` and uses the supplied `assets/media/cinadia-hero.mp4` as its primary visual. The video begins in a full-screen intro with the cafe identity and three destination actions for the menu, home, and store. Escape exits. The intro has no subtitle or Skip Intro button. After dismissal, the same video and its playback control are shown in the hero without changing the source or resetting playback.

The hero has a reserved-height sticky scene on a dark tea-brown ground. Native scrolling expands its central frame to cover the entire dynamic viewport, including behind the transparent cream-colored header, logo, and navigation. Expansion finishes at 72% of the scroll runway, leaving a short full-bleed hold before the scene exits. The header follows that exit and does not float over the later page sections. Fractional frame measurements and a one-pixel overscan prevent edge seams.

The sentence “سینا و نادیا / یک زوج هنری” stays independently centered over the darkened video while its opacity progressively reveals. Supporting copy and the existing menu/event actions sit below it. The dark scrim covers only the media, preserving the cream text and navigation contrast. A single scheduled `requestAnimationFrame` updates transforms and opacity; scrolling itself is never intercepted. The video uses `object-fit: cover`, a centered desktop focal point, and a 58% horizontal focal point on mobile.

Audio remains muted. Autoplay is best-effort and a visible Play action remains available if it is blocked. `prefers-reduced-motion` starts with a paused video and a static full-viewport hero with the same centered sentence, while allowing deliberate manual playback. Playback pauses outside the viewport or in a hidden browser tab. A dark cafe-toned fallback is always under the video; the optional poster is absent and is not requested. Intro, video, hero, and responsive rules are consolidated with the existing CSS rather than appended as competing hero overrides.

## Requested spacing refinements

The initial hero frame is 63% of its previous width and height (37% smaller in each dimension), centered in the viewport. Its measured expansion still covers the entire viewport. The hero headline has an explicit line break between “سینا و نادیا” and “یک زوج هنری”. The header has no bottom divider. Featured menu rows now use 142px desktop, 106px tablet, and 86px narrow-mobile minimum heights; content may grow naturally. The hero has no visible Pause button during playback; a conditional Play action remains for blocked autoplay and reduced motion.

## Hero message sequence and header

The cafe identity is right-aligned at every breakpoint, inset 44px on desktop and 20px on mobile. The initial centered message is “Where flowers bloom and memories live.” in an English-language LTR paragraph using the existing body font. It fades out through the first 28% of the native scroll runway, then the centered two-line Persian title fades in from 28% to 68%. Scrolling back reverses the sequence. There is no scroll cue. Reduced motion and no-JavaScript presentations show the Persian title directly without the English overlay or animated text transition.

## Compact navigation and dedicated menu

Mobile navigation opens as a 190px list below the hamburger, with Escape and outside-click dismissal. Both hero messages fit the measured video bounds during expansion. Featured rows are 142px on desktop, 106px on tablet, and 86px on narrow mobile, growing when copy requires it. The menu action navigates to menu.html; the dedicated page lists the 14 confirmed items and prices until additional menu content is supplied.

Event cards use white surfaces over the supplied rug, compact 108–144px minimum heights, local traditional Persian artwork, dark copy, left-pointing reservation arrows, and a Rakkas weekly heading. The all-events action uses #C94840 with white text.

## Featured printed menu
Home favorites use three accessible RTL category tabs, compact name/price lists, and a cinnamon latte feature. All 14 confirmed prices remain intact. The supplied red Persian textile is restricted to a decorative left gutter, keeping the cream reading surface clear. Full-menu navigation remains available.
