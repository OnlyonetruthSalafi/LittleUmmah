# LANG-1 — Language island: choose a classroom (English, Thai, Arabic + locked Bengali, Indonesian)

Read `AGENTS.md` in full first. Sections 1, 2, 2.1, 3 and 1.5 apply. Reply/report in Thai.

## Owner's request (9 Nov 2026, verbatim)

"เมื่อกด เข้าไปเกาะภาษาให้มี เลือกห้องเรียนภาษาอังกฤษ ไทย อาหรับ และ ล้อกห้องเรียน บังกาลี อินโด ไว้ครับ ดีไซน์ให้สวยไม่เอา Ai slop ง่ายๆ"

The owner also said to build the English and Thai rooms in full.

## Current state

- The island "เรียนภาษาเบื้องต้น" is category slug `arabic`, at `/learn/languages`: `src/app/[lang]/learn/languages/page.tsx`.
- That route renders the Arabic robot classroom directly: `src/features/arabic/components/Classroom.tsx`, `data/classroom.ts`, `classroom.css`.
- **Content for the new rooms is already written by Claude.** Do not change any wording.
  - `src/features/languages/data/english.ts`: `ENGLISH_UNITS`, `ENGLISH_COURSE_DONE`.
  - `src/features/languages/data/thai.ts`: `THAI_UNITS`, `THAI_COURSE_DONE`.
  - Each uses the existing `ClassStep` / `ClassUnit` types.
  - Kids get one letter path: A–Z (26) and ก–ฮ (44). Juniors get units.
  - If you need a type or import change in these files, keep it minimal and list it in the report.
- **Voice for the new rooms** comes from `scripts/make-language-class-voice.mjs`. Do NOT run it; it costs the owner's ElevenLabs quota. Claude runs it.
  - New rooms: `/audio/th/class/en/<key>.mp3` and `/audio/th/class/th/<key>.mp3`.
  - Keys: `teach-<step.id>`, `say-<step.id>`, `course-done`.
  - Cheer and done clips are shared from the Arabic room: `/audio/th/class/cheer-1..3.mp3` and `/audio/th/class/done.mp3`.
  - Only a few pilot files exist now. The existing fallback in `Classroom` (timer / speech synth when a file is missing) must keep the lesson running.

## What to build

### 1. Routes

- `/learn/languages` becomes the **room picker**. LANG-2 moves this picker to the URL shown here; the internal category id remains `arabic`.
- Rooms live at `/learn/languages/arabic`, `/learn/languages/english` and `/learn/languages/thai`.
  - Use a literal `[room]` segment with `generateStaticParams` for both locales. Unknown rooms → `notFound()`.
  - Make sure `learn/[slug]` does not claim them.
- `/kids` and `/juniors` link to `/learn/languages#kids` and `#juniors`. The picker must forward the hash to the room links, because `getHashGroup` reads it.
- `BackLink` on a room page goes back to the picker.
- Each room page keeps `OtherIslands`.
- Add metadata for each room, and add the new URLs to the sitemap if the sitemap lists island URLs.

### 2. Generalise `Classroom` without breaking Arabic

Give it a course config. Suggested home: `src/features/languages/courses.ts`. It holds:

- `id`
- `lang` / `dir` for the board text and unit previews. These are hard-coded `lang="ar" dir="rtl"` today.
- board font class:
  - Arabic: existing Naskh setup.
  - English: Baloo 2 via `font-display`.
  - Thai: Noto Sans Thai Looped.
- units for each age group
- audio folder for teach/say/course-done, plus the shared folder for cheer/done
- localStorage progress key
- room-specific dictionary strings: title, course-done text/speech, path label, "learned X of Y", goal hint/reached

Hard rules for the Arabic room:

- **Arabic must behave exactly as now**: same audio keys and paths, same `lu-arabic-learned-v1`, same 28-letter path.
- New keys: `lu-english-learned-v1`, `lu-thai-learned-v1`.

Dictionary and text:

- Strings go in `src/i18n/dict/th.ts` and `en.ts`. Use the `Text` type and no `xxxTh`/`xxxEn` fields.
- Thai leads; English is the sub-line (AGENTS intro "ไทยนำ อังกฤษรอง", §3).

Board fit:

- The Thai glyph board must not clip tails or ascenders: ญ ฐ ฎ ฏ ฤ-style descenders, ป ฝ ฟ ascenders.
- English "Aa" must fit too.
- Juniors phrases ("one two three four five", "กา ก่า ก้า ก๊า ก๋า") must fit at 360px.

### 3. Picker design — "beautiful, not AI slop"

Build on the site's existing art language, not generic UI. Look at these first:

- `public/games/classroom/room-wide.webp`
- the classroom chalkboard CSS in `classroom.css`
- the gold plaques of the 28-letter path
- `public/Character/teach.webp` (Nuri pointing)
- island cards in `OtherIslands`
- `src/components/layout/site-footer.css`

Direction:

- Each room reads as a **real classroom**: a door or chalkboard, with the room's own script written as **live text** on its board (e.g. `ا ب ت` / `A b c` / `ก ข ค`), and a gold nameplate with the Thai name first and the English sub-line.
- Nuri can welcome the child (existing poses only).
- Each room gets its own accent from the palette (blue, turquoise, white, gold; §1.5), not a rainbow.
- Optional: one tiny supporting detail per room drawn in CSS/SVG.
- Banned:
  - emoji flags or any emoji
  - generic gradient cards with a centred icon
  - glassmorphism
  - stock "language app" look
  - text baked into images
  - new generated images: none needed for this task

Locked rooms:

- Names:
  - Bengali: Thai "ภาษาเบงกาลี", English "Bengali", native "বাংলা".
  - Indonesian: Thai "ภาษาอินโดนีเซีย", English "Indonesian", native "Bahasa Indonesia".
- Visibly closed: a padlock SVG icon plus the text "เร็วๆ นี้" / "Coming soon". Not grey alone (§2).
- **Not links and not focusable as destinations.** Expose the name and "coming soon" to screen readers.
- Still ≥64px tall.
- "বাংলা" needs a Bengali font. Load `Noto Sans Bengali` through `next/font/google` with only the `bengali` subset, scoped to the picker if possible, and say how in the report.
  - If that is not possible, drop the native name and keep Thai + English. Do not leave tofu boxes.

Open rooms:

- One `<Link>` covering the whole card; one card = one focus stop (§2.1).
- Hover moves the image/board only, not the text (§2.1).
- `motion-safe:`, shadow increases on hover, `active:scale-[0.98]`, no `transition-all`, no looping motion.
- Tap target ≥64px; visible focus.
- Thai pages show Thai first with an English sub-line; `/en` is English only.

Layout:

- Responsive first.
- 360px portrait: 3 open rooms clearly first, locked rooms after, no horizontal scroll.
- 768 tablet and 1280 desktop should look composed, not a stretched list.

### 4. Tests and checks

- Update `scripts/check-classroom-browser.mjs` to the Arabic room's new URL, including its `#juniors` case. It must pass unchanged otherwise.
- New `scripts/check-language-rooms-browser.mjs`, same style as the other `check-*-browser.mjs`. Base `http://localhost:<port>`.
  - At 360×780, 390×844, 768×1024 and 1280×800:
    - picker has no horizontal overflow
    - open rooms are links ≥64px
    - locked rooms are not links/buttons and contain the "เร็วๆ นี้" text
    - `#juniors` is forwarded
  - Each of the 3 rooms loads with no page errors.
  - Board text is not clipped (compare scroll vs client size) for every kids letter in Thai and English, with juniors phrases checked at 360px.
  - A lesson starts with sound off, advances to step 2 and shows the right board text.
  - Save screenshots to `output/lang-1/`.
- Add a node test, `tests/language-rooms.test.mjs`:
  - step ids unique per course
  - every course exposes kids + juniors units
  - English 26 letters, Thai 44
  - the Arabic room config still points at `lu-arabic-learned-v1` and `/audio/th/class`

### 5. Before reporting

- `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build` all pass.
- Run both browser checks against `npx next start -p 3300` from your worktree, then stop that server.
- Don't commit.
- Report in Thai:
  - files changed
  - the design idea in 3–4 lines
  - screenshot paths
  - any wording you had to touch

## Scope

- **May edit:**
  - `src/app/[lang]/learn/languages/**`
  - `src/features/arabic/**`
  - `src/features/languages/**` (types/imports only in the two data files)
  - `src/i18n/dict/*`
  - `src/app/sitemap*` if needed
  - the BackLink usage
  - new icon components in `src/components/icons/`
  - the two check scripts and the new test
- **Do not touch:**
  - `src/lib/lessons.ts`
  - other islands
  - homepage, footer, `friends.ts`
  - audio files, voice scripts
  - `AGENTS.md`
