# LANG-2 — Language island: rename the URL to /learn/languages + redesign the picker

Read `AGENTS.md` fully first: sections 1, 1.5, 2, 2.1 and 3 apply. Report in Thai.

Follows LANG-1 (`docs/briefs/LANG-1-language-rooms.md`), which is already merged into this tree and uncommitted. Also read its report: `D:/Littleummah/output/codex/LANG-1-report.md`.

## Owner's request (9 Nov 2026, verbatim)

"1. แก้ลิงค์ Learn/arabic ไม่ตรงกับหน้าเลือกห้อง ที่เลือกหลายภาษา 2. แก้ดีไซน์หน้านี้ใหม่ให้ codex ออกแบบให้ ให้สวยงามไม่เป็น Ai slop ทำได้เลยครับ ผมอนุมัติ ไม่ต้องรอถาม แบบจากผม"

The owner pre-approved your design. Do not stop to ask; make strong choices yourself.

## 1. URL

- The picker moves to **`/learn/languages`**.
- The rooms move to **`/learn/languages/english`**, **`/learn/languages/thai`** and **`/learn/languages/arabic`**.
- Keep the category slug `arabic` as the internal id. Lesson content, `cat-arabic` audio, `OtherIslands current="arabic"` and progress keys all depend on it.
  - Change only `href` in `src/lib/categories.ts`, plus every link, the sitemap, BackLink targets, SEO canonical/metadata paths, comments and the check scripts.
- Old URLs must keep working through a **permanent redirect**:
  - `/learn/arabic` → `/learn/languages`
  - `/learn/arabic/<room>` → `/learn/languages/<room>`
  - This applies to both Thai (unprefixed) and `/en`.
  - The `#kids` / `#juniors` hash must survive. Browsers keep the fragment on a redirect when the Location has none; verify it in the check script.
  - Put the redirects in `src/proxy.ts` or in `next.config` `redirects()`. Pick whichever fits how `proxy.ts` rewrites Thai URLs, and make sure the Thai rewrite and the redirect do not loop.
- Make sure `learn/[slug]` does not claim `languages`.
- Grep the whole repo (`src`, `scripts`, `tests`, `public/islands/README.md`, docs, comments) for `learn/arabic` and update every hit.

## 2. Redesign the picker — beautiful, not AI slop

The owner did not like the current picker. Read `src/features/languages/RoomPicker.tsx` and `picker.css`, and look at `output/lang-1/picker-*.png`: flat CSS doors in white cards look generic.

Make it feel like the rest of the site: a **premium colourful 3D children's game** (§1.5).

Study before designing:

- the homepage island orbit (`src/components/home/*`, `public/islands/*.webp`)
- the classroom scene `public/games/classroom/room-wide.webp` / `room-tall.webp`
- the Arabic room's gold-plaque letter path (`classroom.css` `.cls-plaque`)
- `public/Character/*` (Nuri poses)
- the footer night sky with friends
- the games hub cards

**You may generate new artwork with your image tool.** That is the expected route to a real look. For example: a 2.5D scene of a little language school or hallway on a floating island, in the same angle and lighting as the island art, with doors or arches for each room.

Art rules:

- No text, letters or numbers baked into images. Room names and the sample scripts (`A b c`, `ก ข ค`, `ا ب ت`, `বাংলা`, `Bahasa Indonesia`) stay **live text** placed over the art (§1.5).
- No humans or animals with faces. Robots may have faces; only reuse Nuri and the friend poses from `public/Character/` (§1.1, §1.2). No musical symbols (§1.3). No emoji.
- Zoom in and check every generated image for tiny eyes or faces.
- Transparent PNG art: scan alpha for semi-transparent holes, as Read hides them. Interior alpha must be ≥250 where the art is solid.
- Large rasters go through `scripts/optimize-images.mjs` with sha256 in `scripts/source-images.json` → WebP. Keep the PNG originals under `output/lang-2/originals/` (git-ignored) and copy them to `D:/Littleummah/output/lang-2/originals/` too, because worktree removal deletes ignored files.
- If you place live text on painted surfaces, measure the coordinates from the real image with a script. Do not eyeball percentages. Text must stay on its surface at every breakpoint.

Interaction and accessibility (same as LANG-1, still required):

- 3 open rooms: English, Thai, Arabic, in that order. Each has one `<Link>` covering the whole room (one focus stop), ≥64px, visible focus.
- Hover moves the art only, never the text. `motion-safe:` on transforms, shadow grows on hover, `active:scale-[0.98]`, no `transition-all`, no looping, bobbing or flashing.
- Bengali and Indonesian are locked:
  - visibly closed, with a padlock icon plus the text "เร็วๆ นี้" / "Coming soon"
  - not links and not focusable as destinations
  - readable by screen readers
  - keep the Noto Sans Bengali subset font scoped to the picker
- Thai leads with an English sub-line on Thai pages; `/en` is English only.
- Contrast ≥4.5:1 for text (measure on the real backgrounds); 3:1 for large text.
- The `#kids` / `#juniors` hash still forwards to the room links.
- Layout:
  - 360/390 portrait: rooms large and tappable, no horizontal scroll, the 3 open rooms before the locked ones.
  - 768 tablet and 1280/1536 desktop: composed like a game scene, not a stretched list.
  - 844×390 landscape phone must not break.

Do not redesign the rooms' classroom page. Only the picker changes, plus links.

## 3. Checks

- Update `scripts/check-language-rooms-browser.mjs` and `scripts/check-classroom-browser.mjs` to the new URLs.
- Add redirect assertions: old → new, the hash is kept, the `/en` variants work, and there are no loops.
- Keep all existing assertions, and add:
  - every live label stays inside its painted surface (if any)
  - locked rooms are not focusable
  - screenshots at 360×780, 390×844, 844×390, 768×1024, 1280×800 and 1536×864 → `output/lang-2/`
- Also run `scripts/check-home-browser.mjs` because the categories href changes. The home check loads `playwright-core` via `require` with the plain path in `PLAYWRIGHT_MODULE`.
- Before reporting:
  - `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build` all pass
  - browser checks pass against `npx next start -p 3300` from your worktree, then stop that server
  - no commit

## Scope

**May edit:**

- `src/app/[lang]/learn/languages/**` (moved from the legacy route)
- `src/features/languages/**` (UI only; do not change the wording in `data/english.ts` / `data/thai.ts`)
- `src/features/arabic/components/Classroom.tsx` (links and comments only)
- `src/lib/categories.ts` (href only)
- `src/proxy.ts` or `next.config.*` (redirects only)
- `src/app/sitemap.ts`
- `src/i18n/dict/*` (languages section)
- new icons
- new images under `public/languages/`
- `scripts/source-images.json`
- the check scripts
- tests that mention the URL
- docs/README mentions of the URL

**Do not touch:**

- `src/lib/lessons.ts`
- other islands' pages
- the footer
- `friends.ts`
- audio and voice scripts
- `AGENTS.md`

## Report

In Thai:

- the design idea (3–5 lines)
- files changed
- new images and the prompts used
- screenshot paths
- check results
