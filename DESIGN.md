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

## Typography

The intro identity and main hero title use Rakkas for its warm, poster-like voice. Markazi Text carries the other headings, navigation, body copy, controls, and menu details with generous line height. Latin labels keep a restrained, letter-spaced treatment.

## Signature

High-contrast red-and-cream print blocks, thin double rules, small geometric rosettes, and asymmetric editorial compositions drawn from Iranian cafe ephemera.

## Cinematic Media

The cinematic build lives in `cafe-menu-events-main/` and uses the supplied `assets/media/cinadia-hero.mp4` as its primary visual. The video begins in a full-screen intro with the cafe identity, introductory brand message, a clear Enter action, and visible Skip Intro and Play/Pause controls. Escape also exits. After dismissal, the same video and playback control move into the hero without changing the source or resetting playback.

The hero has a reserved-height sticky scene. Native scrolling expands its central frame to fill the viewport, then progressively reveals the introductory copy. A single scheduled `requestAnimationFrame` updates transforms and opacity; scrolling itself is never intercepted. The video uses `object-fit: cover`, a centered desktop focal point, and a 58% horizontal focal point on mobile.

Audio remains muted. Autoplay is best-effort and a visible Play action remains available if it is blocked. `prefers-reduced-motion` starts with a paused video and a static, readable hero, while allowing deliberate manual playback. Playback pauses outside the viewport or in a hidden browser tab. A dark cafe-toned fallback is always under the video; the optional poster is absent and is not requested. Intro, video, hero, and responsive rules are consolidated with the existing CSS rather than appended as competing hero overrides.
