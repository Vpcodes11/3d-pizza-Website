# FORNO

A complete pizza restaurant demo built with Next.js App Router, React, TypeScript, GSAP, CSS, and SVG. Includes the animated hero, filterable pizza menu, story, philosophy, sample location, FAQ, footer, and a demo pickup basket.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production check, run `npm run typecheck` and `npm run build`.

## Assets

The supplied `download/` folder contains 14 JPEGs, including ingredient images with baked-in checkerboards. No transparent PNGs or reference video were present. Original JPEGs are copied byte-for-byte into `public/assets/`. `FoodImage` uses SVG clipping paths to hide their backgrounds without editing or redrawing the food pixels. The display masks are stored in `lib/asset-masks.json`. The mask preparation script requires Python, OpenCV, and NumPy; these are not runtime website dependencies.

Replace the display masks and sources with original transparent PNGs if they become available. The initial hero displays Margherita, with Pepperoni, Four Cheese, and Veggie available in the footer selector. The four original pizza images are used without redrawing or generating any food artwork.

## Motion

`lib/useHeroMotion.ts` manages the entrance, ingredient float, and orbit parallax. `lib/usePizzaDepth.ts` adds a base perspective tilt, damped cursor tilt (up to 14 degrees), a 3.5% proximity lift, and continuous floating motion. A layered crust edge, highlight, cursor-following light and breathing ground shadow strengthen the depth. Touch devices receive automatic orientation changes. Perspective is preserved through the pizza wrappers.

`lib/useFlavorTransition.ts` moves all four pizza image planes along a continuous curved track in CSS 3D space. One GSAP progress value controls the pizza translation, depth, rotation, sliding headlines, ingredient movement, and interpolated background, text and lighting colors. Each flavor has a palette, eyebrow, tagline, ingredients, note and sample price. Drag the pizza or headline to scrub the same track; release to settle to the nearest flavour. Buttons and mobile horizontal swipes also work. Vertical scrolling is preserved. Rapid selection interrupts motion at its current position rather than resetting it.

`lib/useHeroPlayback.ts` cycles flavors every 6.5 seconds with an explicit play/pause control. Playback stops while the hero is mostly off-screen, the tab is hidden, an order dialog is open, the carousel is being dragged, or another hero control has focus. Reduced motion disables automatic cycling. `DepthCard` adds subtle pointer tilt and layered food images to menu and location cards; the story artwork also has perspective.

This is an image-based perspective experience, not a mesh with reconstructed crust or toppings. No GLB, Three.js, WebGL, or additional 3D runtime is used, as requested.

GSAP matchMedia respects reduced motion: selections become instant, cursor tilt and idle motion stop, and the image remains visible. Ambient animation pauses when the tab is hidden or the hero is off-screen. All animation listeners, observers, and GSAP state are cleaned up on unmount. The sections below the hero use ordinary document scrolling.

For future scroll choreography, `pizzaTransform` in `PizzaHero` is a stable GSAP target with `rotationX`, `rotationY`, `rotationZ` (degrees), `positionX`, `positionY`, `positionZ` (CSS pixels), and `scale`. Animate those values; pointer/idle offsets are composed independently. `carousel` exposes continuous flavour `progress` for later scroll control; call `carousel.current.draw()` from a GSAP `onUpdate` if controlling it outside the selection hook.

The page is fully visible without JavaScript. Mobile has a separately composed layout below 760px.

## Navigation

Navigation links scroll to the menu, story and location sections. They are available on mobile too. The menu supports a vegetarian filter and adding pizzas to a shared basket. The native order dialog supports quantity changes, totals, an empty state, Escape dismissal and a sample pickup confirmation. Completing a demo order clears the basket and preserves the receipt until the dialog closes.

Sample INR prices, ingredients, hours and the fictional location are maintained in `lib/menu.ts`. They are labelled as sample data on the page. No payment, personal details or real orders are collected or sent. Basket state lasts for the current page session. Replace the sample data and connect a real ordering service before accepting restaurant orders.

The hero pizza is centred on the page on desktop and mobile, with a large flavor name behind it. Details and ordering sit to either side on desktop and below the scene on mobile. `app/hero.css` contains the scene and depth styles, loaded after the base stylesheet. The larger pizza enters from above, settles at full size, and rolls down into depth on exit. Opacity stays solid through the main movement and fades only near the end of the retreat. The path adapts to the screen width, and the caption fades out while pizzas pass through its space. The initial page entrance follows the same roll-in idea.

Typography: Cormorant Garamond and Manrope, self-hosted at build time by `next/font`. References used for implementation: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/), [GSAP quickTo](https://gsap.com/docs/v3/GSAP/gsap.quickTo/).
