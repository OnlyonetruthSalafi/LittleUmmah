# HAD-3: artwork for hadith batch 2 (6 books, third shelf)
**model `gpt-6-astra` (medium) · timeout 14400 · worktree `D:/Littleummah-had3art` · no server needed**
**Status: brief ready, NOT launched. Claude waits for the owner's OK first (big image batch, 10 Nov 2026).**

Read `AGENTS.md` fully first. Sections 1.1, 1.4, 1.5 and 3 apply. Write the report in Thai.

## Background
The third shelf "เรื่องจริงจากหะดีษ ชุดที่ 2" has 6 books. Their text is in `src/features/stories/data/hadith/*.ts`.
- Claude wrote all the text and checked every hadith against Shamela.
- Every book is `ready: false`, so the shelf shows it as "เร็วๆ นี้".

The first 10 hadith books already have approved art (HAD-1 and HAD-2).
**Look at them first (`public/stories/{water-dog,thorn-branch,cloud-garden,talking-cow,gold-jar}/*.webp`) and match their style and quality exactly.**

**This job: art only, for these 6 books.** Each book needs a cover, a deluxe cover and its pages:

| Book | Pages |
|---|---|
| `little-bird` | p01–p06 |
| `palm-riddle` | p01–p06 |
| `mother-bird` | p01–p06 |
| `camel-complaint` | p01–p07 |
| `sea-plank` | p01–p11 |
| `visit-brother` | p01–p06 |

That is 42 pages and 12 covers, 54 images in total.
- Work book by book in this order.
- If time runs short, finish whole books rather than leaving several half-done, and list what is missing.

## ⚠️ Text is approved. Do not change it.
- Do not change `th`, `en`, `title`, or the hadith comments.
- You may only adjust `alt` / `coverAlt` so that they describe the image you actually made, keeping the same meaning.
  - Alt describes what is in the picture. It does not repeat rules such as "no people".
  - List every alt change in the report.
- Do not change `ready`. Do not record voice. Claude will wire and voice the books after checking the art.

## Art
- **Each page has a `// PROMPT:` comment above it in the data file.** Follow it, plus the shared rules in the file header and in `data/hadith/common.ts`.
- **Style:** premium 3D cartoon, palette blue / turquoise / white / gold, soft warm light. It must match the existing hadith books.
- **Sizes:**
  - Pages: 1536×1024 double spreads. Keep the centre column calm, because the book spine sits there. Use `scripts/check-story-center-seams.mjs` if useful.
  - `cover.png`: portrait, 1024×1536, matching the other books' `cover.webp`.
  - `cover-deluxe.png`: portrait, 1024×1536. A leather hard cover in the same teal series as the other deluxe covers, with a small object emblem:

    | Book | Emblem |
    |---|---|
    | little-bird | small clay water bowl with a feather |
    | palm-riddle | palm leaf |
    | mother-bird | empty nest |
    | camel-complaint | feeding trough |
    | sea-plank | wooden plank with a coin |
    | visit-brother | two open doors |
- **Hard rules:**
  - **No people at all:** no hands, feet, shadows of people, footprints or silhouettes. This includes the sailors on ships, people at the harbour and people on the roads.
  - **Never draw the Prophet ﷺ, Companions or angels.** This includes light shaped like a person.
    - visit-brother: the hadith has an angel waiting on the road. Show it **only** as soft light on the path (p02) and a bright sky (p05).
  - **Animals** (birds, chicks, the camel) must have **completely blank faces**: no eyes, nose, mouth, beak markings that read as a face, eyebrows, blush or tears.
  - **camel-complaint:** sadness is shown by posture only, never tears.
  - **camel-complaint and mother-bird:** never show who took the chicks or who owns the camel. There are no hands and no figures.
  - **mother-bird p06 is an empty nest in warm light.** Do not draw the chicks being returned.
  - **sea-plank:** the log is hollowed and sealed with no tool or hand shown.
    - Ships are empty: no crew and no silhouettes on deck.
    - Coins and the letter have no text, symbols or numbers.
  - **palm-riddle p02:** the "question mark made of leaves" must not become a letter or symbol that reads as text. If it can't be done without looking like text, use scattered leaves instead and say so in the report.
  - No text, letters, Arabic script, numbers, logos or music symbols anywhere.
- **After generating each image, check it:**
  - Zoom in on every animal's head and on anything in the distance. Image models often add tiny eyes or faces, and also tiny people far away (harbours, villages, decks). Regenerate or fix any you find.
  - Save head crops to `output/had-3/head-crops/`.

## Files
- Put the PNGs in `public/stories/<slug>/` (`cover.png`, `cover-deluxe.png`, `p01.png` …). The PNGs are git-ignored.
- Add a JOBS entry `{ dir: "public/stories/<slug>", width: 1200, quality: 82 }` for each book in `scripts/optimize-images.mjs`.
- Run `node scripts/optimize-images.mjs` so that `.webp` files and their sha256 entries in `scripts/source-images.json` are created.
  - Revert any unrelated image the optimizer re-creates by accident.
- Copy every PNG original to `D:/Littleummah/output/had-3/originals/<slug>/` too, because removing the worktree deletes ignored files.
- Alpha: page and cover images are opaque. Confirm there is no transparency, since Codex PNGs can be semi-transparent.
- Make one montage per book (all pages in order) at `output/had-3/montage-<slug>.png`. Copy the montages to `D:/Littleummah/output/had-3/` as well.

## Scope
**May edit:**
- `public/stories/{little-bird,palm-riddle,mother-bird,camel-complaint,sea-plank,visit-brother}/**`
- `scripts/optimize-images.mjs` (JOBS only)
- `scripts/source-images.json`
- `alt` / `coverAlt` in those 6 data files
- `output/had-3/**`

**Do not touch anything else.** No commit.

## Checks before reporting
`npx tsc --noEmit` and `npm test` pass.

## Report (Thai)
Include:
- the image list with the prompt used for each
- head-crop results
- alpha results
- montage paths
- alt changes
