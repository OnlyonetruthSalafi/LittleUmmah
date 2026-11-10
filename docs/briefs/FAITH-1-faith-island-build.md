# FAITH-1: build the "เรียนรู้อิสลามพื้นฐานสำหรับเด็ก" island (faith-basics)
**model `gpt-6-astra` (medium) · timeout 14400 · worktree `D:/Littleummah-faith` (branch `feature/faith-island`) · port 3170**

Read these fully first:
- `AGENTS.md`, especially §1 (all of it), 1.4, 1.5, 1.6, 2, 2.1 and 3.
- `docs/handoff/2026-11-10-handoff-opus.md` §2.3–2.4.

Write the report in Thai. No commit, reset or unstage.

## What the owner asked for (10 Nov 2026)
- Teach Salafi aqidah as questions and answers ("Where is Allah?", "Who is your Lord?" …).
- Nuri the robot teaches it like the Explore island.
- First round: 6 lessons for ages 3–6 and 6 lessons for 7+.

## ⚠️ The text is final
`src/features/faith/data.ts` was written and religiously checked by Claude.
- **Do not change** any `th`, `en`, `title`, `body`, `Word` (`ar`/`th`), or the evidence comments.
- You may fix TypeScript-only issues, such as types or imports. If a text change seems needed, list it under `REVIEW-RELIGIOUS` in the report and leave the text unchanged.
- `src/app/[lang]/parents/content.ts` already has a new Freemium paragraph written by Claude. Keep it.

## 1. Page and wiring (copy the Explore island)
- Templates:
  - `src/app/[lang]/learn/explore/page.tsx`
  - `src/features/explore/data.ts`
  - `src/features/moral/components/{MoralHero,MoralLessons,CartoonLesson}.tsx`
- New page: `src/app/[lang]/learn/faith-basics/page.tsx`. Use MoralHero with `GUIDE_STEPS`, then MoralSection per age with `LESSONS`, `CARD_ART` and `CARTOONS`.
  - Robot: `/Character/faith.webp`, or `teach.webp` if that fits better.
  - `progressKey="lu-faith-progress"`.
- Add `faith-basics` to `OWN_PAGE` in `src/app/[lang]/learn/[slug]/page.tsx`.
- `src/lib/categories.ts`: faith-basics is no longer coming soon. It becomes a real island with `href: "/learn/faith-basics"` and keeps its place in `HOME_ISLANDS.learn`.
  - Check every user of `CATEGORIES` / `HOME_ISLANDS`: sitemap, footer "ไปเกาะไหนดี", `OtherIslands`, IslandOrbit, seo `categoryMetadata`, and the dict keys for th and en.
  - Nothing may break, and no other island may change.
- Learning Stars:
  - In `MoralLessons.tsx`, `markPractised` currently maps `progressKey` to the prefix `moral`/`explore`. Generalise it so faith gives `faith:<id>`. Keep moral and explore keys exactly as they are.
  - Add `faith` to the learn-island chooser `LEARN_ISLANDS` in `src/features/learning-stars/components.tsx`, with the short name `{ th: "อิสลาม", en: "Islam" }`. The grid must still fit at 360 px, with tiles ≥64 px and no Thai word breaking mid-word. Check the screenshots.
- Storage: add `lu-faith-progress` to `src/app/[lang]/parents/ClearProgress.tsx` and to the privacy list in `parents/content.ts`, in both th and en.
- The parents page's first section counts the islands. Update it so it is true.

## 2. Art (you generate it)
The style must match the existing approved scenes and cards exactly. Look at `public/explore/scenes/*.webp`, `public/moral/scenes/class.webp` and `public/explore/card-*.webp` first.
- **5 new scene backgrounds** (1536×1024, opaque) in `public/faith/scenes/`. Nuri is placed by code, so leave room the way the existing scenes do:

  | File | Content |
  |---|---|
  | `sky` | wide open daytime sky above a floating island, soft clouds |
  | `quran` | an open mushaf on a wooden rehal in a calm, bright room |
  | `prayer` | a prayer mat and a wudu water jug, no person |
  | `dua` | a prayer mat and a lantern at dusk, soft orange sky |
  | `pillars` | a white building on an island with **five** golden columns; not a mosque, no dome, no minaret |

- **12 cards** in `public/faith/`, named as in `CARD_ART` in data.ts. Objects only, same style as the explore cards:

  | Card | Content |
  |---|---|
  | rabbi | the earth and a growing plant |
  | dini | a prayer mat |
  | nabiyyi | an open mushaf |
  | aina | a high bright sky over clouds |
  | khaliq | a mountain, sea and trees |
  | dua | a lantern and a mat |
  | usul | three books stacked |
  | aina-j | a starry sky over a mountain |
  | shahada | a gold geometric star |
  | islam | the Kaaba with **no people** |
  | iman | a crescent and stars |
  | ihsan | a heart made of leaves |

- **Hard rules:**
  - No people, hands, silhouettes or animals.
  - **Never** depict Allah, the Throne (عرش), "seven heavens" diagrams, angels, beams or rays of light that read as a being, or any glow suggesting "Allah is here".
  - No prophet. No one bowing or prostrating.
  - No domes or minarets on the pillars scene.
  - No text, letters, Arabic script, numbers or logos.
  - No music symbols. No sun with a face.
- Zoom-check every image for hidden faces or figures. Scan alpha, because Codex PNGs can be semi-transparent (see memory `codex-imagegen-alpha-check`).
- Put PNGs in the same folders. They are git-ignored.
- Add JOBS entries in `scripts/optimize-images.mjs` and run it, so the webp files and their sha256 entries in `scripts/source-images.json` are created. Revert anything unrelated the optimizer re-creates.
- Copy every PNG original to `D:/Littleummah/output/faith-1/originals/`.
- Make a contact sheet at `output/faith-1/contact.png`.

## 3. Voice
- New script `scripts/make-faith-voice.mjs`, copied from `scripts/make-explore-voice.mjs`. It imports `src/features/faith/data.ts` directly and covers GUIDE_STEPS and every CARTOONS scene. sayAlong scenes follow the existing explore and moral behaviour.
- Output goes to `public/audio/th/faith/`, following the clip-path convention the explore island uses.
- Arabic sayAlong words go through the existing Arabic-script approach: no language lock, as in memory `arabic-tts-transliteration` and `scripts/make-story-voice.mjs --arabic`.
  - Check every Arabic word with `D:/tools/thai-asr/ar_check.py`. Re-take a word if its score is clearly worse than the other take.
- Every line containing "ท่านนบี ﷺ" must be spliced with the standard clip:

  ```
  D:/tools/thai-asr/.venv/Scripts/python D:/tools/thai-asr/nabi_splice.py <root> <out> <rel>
  ```

  `renderRobotLines` prints the exact command.
  - "ท่านนบีมุฮัมมัด ﷺ" lines use `scripts/voice-assets/salawat.wav` for the ﷺ part only, the same way `stories/kaaba/p05` was done.
  - Check the Thai ASR of every clip with `from check import transcribe` in `D:/tools/thai-asr`, and put a table in the report.
- Copy `.env.local` from `D:/Littleummah/.env.local` if it is missing.

## 4. Checks
- `npm ci` first, since the worktree has no node_modules.
- `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build` must all pass.
- New `scripts/check-faith-browser.mjs`, copied from the explore browser check:
  - open every lesson and play every cartoon to the end, with sound off and a fake clock
  - check the star award `faith:<id>` once a day
  - check tap targets ≥64 px and no horizontal overflow
  - viewports 360×780, 390×844, 844×390 (touch), 768×1024, 1280×720
  - save screenshots to `output/faith-1/shots/`
- Re-run `scripts/check-learning-stars-browser.mjs`, `scripts/check-home-browser.mjs` and `scripts/check-games-hub-browser.mjs`. They must still pass. Fix them only where they rely on the old coming-soon state.
- Run `node scripts/check-ipad-webkit.mjs`. Set `PLAYWRIGHT_MODULE` if the import fails.

## Scope
**May edit:**
- `src/app/[lang]/learn/faith-basics/**` (new)
- `src/app/[lang]/learn/[slug]/page.tsx` (OWN_PAGE only)
- `src/lib/categories.ts`
- `src/features/moral/components/MoralLessons.tsx` (prefix mapping only)
- `src/features/learning-stars/components.tsx` (chooser only)
- `src/app/[lang]/parents/{ClearProgress.tsx,content.ts}` (keys and the island count only)
- `src/i18n/dict/*`
- `scripts/make-faith-voice.mjs`, `scripts/check-faith-browser.mjs`
- the regression scripts above (only as noted)
- `scripts/optimize-images.mjs` (JOBS), `scripts/source-images.json`
- `public/faith/**`, `public/audio/th/faith/**`
- new tests
- `output/faith-1/**`

**Do not touch:** the texts in `src/features/faith/data.ts`, `AGENTS.md`, other islands' content, art or audio.

## Report `output/faith-1/report.md` (Thai)
- files changed
- image list with prompts, contact sheet, alpha results
- voice ASR table and Arabic `ar_check` scores
- splice commands run
- browser and check results
- `REVIEW-RELIGIOUS` items, if any
- known limits
