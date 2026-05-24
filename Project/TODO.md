# TODO - Wonder Makers Replica Refactor

## Step 1
- [x] Inject Tailwind CDN + Lenis + GSAP/ScrollTrigger into `index.html`
- [x] Force dark mode (remove theme toggle UI)


## Step 2
- [ ] Update `index.html` markup to use Tailwind utility classes for the required layout blocks (header/hero/work grid/footer)
- [ ] Add `data-reveal="up"` hooks to elements for GSAP scroll reveals

## Step 3
- [ ] Replace `src/main.js` IntersectionObserver reveal logic with GSAP ScrollTrigger reveal animations
- [ ] Integrate Lenis smooth scrolling and wire it to GSAP ScrollTrigger
- [ ] Remove themeChanged handler and theme toggle logic from JS (dark forced)

## Step 4
- [ ] Update `src/nav.js` to remove theme toggle behavior (keep only mobile nav)

## Step 5
- [ ] Prune/keep `src/styles.css` to only what Tailwind does not cover (3D canvas + any essential non-utility rules)

## Step 6
- [ ] Test locally: load `http://localhost:8000` and verify:
  - [ ] Header blur + hairline border
  - [ ] Hero typography and spacing
  - [ ] Work grid hover scale timing (~500ms)
  - [ ] Scroll reveal animations trigger
  - [ ] Smooth scrolling feels correct
  - [ ] No theme toggle visible; page always dark

