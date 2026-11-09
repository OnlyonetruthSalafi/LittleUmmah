# HAD-2 — Hadith shelf: artwork for the remaining 7 books
**model `gpt-6-astra` (medium) · timeout 14400 · worktree `D:/Littleummah-had2` · no server needed**

Read `AGENTS.md` fully first. Sections 1.1, 1.4, 1.5 and 3 apply. Write the report in Thai.

## Background
On 9 Nov 2026 the owner split the stories island into two shelves: "เรื่องจริงจากอัลกุรอาน" and "เรื่องจริงจากหะดีษ".
Claude wrote and checked the text of 10 hadith books against Shamela. They are in `src/features/stories/data/hadith/*.ts`.
The shelf shows them as "เร็วๆ นี้" until the art is ready (`ready: false` in `data/hadith/index.ts`).

HAD-1 already made art for `water-dog`, `thorn-branch` and `cloud-garden`, and Claude approved it.
**Look at those 3 books first (`public/stories/<slug>/*.webp` and `D:/Littleummah/output/had-1/montage-*.png`), and match their style and quality exactly.**

**This job: art only, for these 7 books.** Each book needs a cover, a deluxe cover and its pages:
1. `crying-trunk`: p01–p06
2. `water-fingers`: p01–p06
3. `talking-cow`: p01–p05
4. `three-men`: p01–p09
5. `gold-jar`: p01–p06
6. `kind-merchant`: p01–p05
7. `sulayman-judgment`: p01–p07

That is 44 pages and 14 covers, 58 images in total. Work book by book in this order.
If time runs short, finish whole books rather than leaving several half-done, and list what is missing.

## ⚠️ Text is approved. Do not change it.
- Do not change `th`, `en`, `title`, or the hadith comments.
- You may only adjust `alt` / `coverAlt` so that they match the image you actually made, keeping the same meaning. List every alt change in the report.
- Do not change `ready`. Do not record voice. Claude will wire and voice the books after checking the art.

## Art
- **Each page has a `// PROMPT:` comment above it in the data file.** Follow it, plus the shared rules in the header of `data/hadith/common.ts`.
- **Style:** match the existing storybooks exactly. Use them as references: `public/stories/garden-owners/*.webp`, `public/stories/ants/*.webp`, `public/stories/kaaba/*.webp`.
  - Premium 3D cartoon, palette blue / turquoise / white / gold, soft warm light.
- **Sizes:**
  - Pages: 1536×1024 double spreads. Keep the centre column calm, because the book spine sits there. Use `scripts/check-story-center-seams.mjs` if useful.
  - `cover.png`: portrait, 1024×1536, matching the other books' `cover.webp`.
  - `cover-deluxe.png`: portrait, 1024×1536. A leather hard cover in the same teal series as the other deluxe covers (for example `public/stories/garden-owners/cover-deluxe.webp`), with a small emblem drawn from the story (palm trunk, water vessel, plough, three valleys, clay jar, balance scale, cradle).
- **Hard rules:**
  - **No people at all**: no hands, feet, shadows of people, footprints or silhouettes.
  - Never draw the Prophet ﷺ, Companions or angels, not even as light shaped like a person.
  - Animals (camels, cows and goats in three-men; the cow in talking-cow) must have **completely blank faces**: no eyes, nose, mouth, eyebrows or blush. Draw them gentle, never scary.
  - **water-fingers:** never draw hands. The Prophet ﷺ is never shown, not even his hand. Show only the vessel and the water rising from it.
  - **crying-trunk:** no face on the trunk. "Crying" is shown with light and atmosphere only.
  - **sulayman-judgment:** no women, babies, wolf or knife. Use empty cradles, the hall, the scale and light, and keep it gentle.
  - **three-men:** no angel, and no light shaped like a person. The "poor traveller" is shown only by an old walking stick and a torn bag.
  - No text, letters, Arabic script, numbers, logos or music symbols.
- **After generating each image, check it:**
  - Zoom in on every animal's head and on anything in the distance. Image models often add tiny eyes or faces, and also tiny people far away. Regenerate or fix any you find.
  - Save head crops to `output/had-2/head-crops/`.

## Files
- Put the PNGs in `public/stories/<slug>/` (`cover.png`, `cover-deluxe.png`, `p01.png` …). The PNGs are git-ignored.
- Add a JOBS entry `{ dir: "public/stories/<slug>", width: 1200, quality: 82 }` for each book in `scripts/optimize-images.mjs`.
- Run `node scripts/optimize-images.mjs` so that `.webp` files and their sha256 entries in `scripts/source-images.json` are created.
  - Revert any unrelated image the optimizer re-creates by accident.
- Copy every PNG original to `D:/Littleummah/output/had-2/originals/<slug>/` too, because removing the worktree deletes ignored files.
- Alpha: page and cover images are opaque. Confirm there is no transparency, since Codex PNGs can be semi-transparent.
- Make one montage per book (all pages in order) at `output/had-2/montage-<slug>.png`. Copy the montages to `D:/Littleummah/output/had-2/` as well.

## Scope
**May edit:**
- `public/stories/{crying-trunk,water-fingers,talking-cow,three-men,gold-jar,kind-merchant,sulayman-judgment}/**`
- `scripts/optimize-images.mjs` (JOBS only)
- `scripts/source-images.json`
- `alt` / `coverAlt` in those 7 data files
- `output/had-2/**`

**Do not touch anything else.** No commit.

## Checks before reporting
- `npx tsc --noEmit` and `npm test` pass.

## Report (Thai)
Include:
- the image list with the prompt used for each
- head-crop results
- alpha results
- montage paths
- alt changes
- anything you could not follow, labelled `REVIEW-RELIGIOUS` if it touches section 1
