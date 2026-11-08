# Codex art brief — realistic storybook (pilot: Prophet Yunus)

**Read `AGENTS.md` first** with `Get-Content -Encoding utf8 AGENTS.md` (UTF-8 Thai). §1.1–1.5 bind every pixel.

The story page `/learn/stories/yunus` shows an open hardcover book. The owner wants the **book itself to look real**:
attached `output/storybook-art/ref-book-sample.jpg` is the owner's reference. Copy only the **physical book qualities**:
- a thick block of many stacked paper edges visible along the outer left and right edges,
- pages that bow gently and **dip into the spine** with a soft shadow in the gutter,
- warm cream paper with fine fiber texture, soft lighting across the paper,
- a hardcover visible just around the page block, a small headband at the spine.

**Do NOT copy its people, birds, flags, waves or any artwork.** There is **no desk / table / background scene** —
the owner removed the wooden desk because it did not fit the website (the website's own sky background shows behind the book).
`output/storybook-art/ref-current-book.png` shows the current flat CSS book, for layout only.

Claude writes all code. **You only make images.** Do not edit `src/`. Do not commit. Do not run `scripts/optimize-images.mjs`.

## How Claude will use the images (so geometry matters)

The story illustrations (3:2 double-page spreads, the right half/left half split exactly at the spine) are printed by code
onto the blank pages of `book-spread.png` using a multiply blend, so the paper texture, gutter shadow and page curvature
of your image show through the illustration. Then the page curl effect uses `paper.png` on the turning leaf.
So: **pages must be completely blank** (no art, no text, no lines), the view must be **straight from above**
(orthographic, no perspective tilt, no rotation), and the spine must be **exactly at the horizontal center**.

## Hard content rules

- No humans, hands, robots, animals, birds, fish, insects. No religious figures, no mosque.
- No text, letters, numerals, Arabic script, logos or calligraphy-like marks anywhere.
- No music symbols or instruments.

## Images — save to `output/storybook-art/`

1. `book-spread.png` — **2400 × 1700**, **transparent background (PNG alpha)**.
   An open hardcover picture book seen straight from above, centered, filling the frame with ~2% transparent margin.
   - The two pages together (the paper area) form a rectangle of about **3:2** (width:height) — about 2200 × 1467 px,
     each page about 1100 × 1467. Spine exactly at x = 1200.
   - Pages: blank warm cream paper (#f7efdc–#fbf5e6), fine subtle fibers, gentle bowing, a soft gutter shadow
     that darkens toward the spine (darkest ~25% at the very center, fading out within ~8% of the page width each side),
     very slight light falloff toward the outer edges. Paper must stay light everywhere else (the illustration is multiplied on it).
   - Along the outer left and outer right edges: a visible stack of thin paper edges (8–15 visible layers, slightly uneven).
   - Hardcover: deep teal leather (#0c5563) visible 1–1.5% beyond the paper on all sides, a hint of gold edge line,
     small cream-and-teal headbands at the top and bottom of the spine. Soft shadow of the book on the transparent
     background is OK only if it is semi-transparent black (it will sit on a light sky-blue page).
   - The hardcover and page block must be **fully opaque**. Only the area outside the book may be transparent.

2. `paper.png` — **1024 × 1024**, opaque, **seamless tileable** cream paper texture matching the pages in `book-spread.png`
   (same color and fibers, no gutter shadow, no vignette). Verify tiling 2×2 for seams.

3. `cover-yunus.png` — **1024 × 1536** portrait, opaque. The **front face of the closed hardcover seen straight on**,
   filling the frame edge to edge (no perspective, no background). Deep teal leather (#0c5563) with fine grain,
   an embossed gold border line ~5% in from the edge, gold Islamic geometric 8-point-star corner ornaments.
   Lower ~62%: an arched (rounded-top) inset window with a thin gold frame containing a painting based on the attached
   `public/stories/yunus/cover.webp`: a small wooden sailing boat on a turquoise sea at sunrise, golden light glowing
   up from under the water with tiny bubbles. No fish or creature. **Upper ~30%: plain leather only** (code adds the title).

4. `endpaper.png` — **1024 × 1024**, opaque, seamless tileable, calm low-contrast Islamic geometric / marbled endpaper,
   teal and soft gold on deep teal.

## Verify before finishing (use sharp in node)

- Exact dimensions. `paper.png`, `cover-yunus.png`, `endpaper.png`: every pixel alpha = 255.
- `book-spread.png`: book area alpha = 255 (count pixels with 0 < alpha < 250 inside the book bounding box — only
  antialiased outline pixels allowed); outside area alpha = 0 or a soft shadow.
- Report in the README the **pixel rectangle of the paper area** (left, top, right, bottom of the blank pages,
  excluding the paper-edge stack) and the spine x, measured from the image (not guessed).
- Zoom every part: no faces, no creatures, no text.
- Write `output/storybook-art/README.md` listing each file, size, the measurements and your checks.
