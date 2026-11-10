# OPS-1: trust fixes from the Fable review (roadmap items 4, 5 and 6)
**model `gpt-6.1-sol` (medium) · timeout 7200 · worktree `D:/Littleummah-ops1` (branch `feature/ops-1`, from main) · port 3180**

Read `AGENTS.md` (§2, 2.1, 3, 5) and `docs/meetings/2026-11-10-fable-hub-review.md` §5, §8 and §10.1.

Write the report in Thai. No commit.

## 1. canonical / OG must never point at localhost
The reviewed build had canonical and og:url set to `http://localhost:3000`. Find how `siteUrl` is resolved: `src/lib/site-url.ts` and the memory note "real-domain-pending" (it falls back to the Vercel production host).
- Make sure a production build on Vercel resolves to the Vercel production URL from env (`VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`). It must never be localhost.
- A local build may still use localhost.
- Add a unit test for the resolution order.
- Add a post-deploy smoke step to the existing GitHub Actions CI (`.github/workflows/ci.yml`), or a separate workflow triggered on `deployment_status` success. It should:
  - `curl` five URLs: `/`, `/learn/moral`, `/learn/stories`, `/parents`, `/en`
  - expect HTTP 200
  - expect the Thai pages to contain `lang="th"`, which checks that `src/proxy.ts` works
  - expect no `localhost` in canonical
- Document the step in the report. The owner may need to set a repo secret or variable; say exactly which.

## 2. Security headers
Add them via `headers()` in `next.config.ts`. Read `node_modules/next/dist/docs/` for this Next version first.
- `Content-Security-Policy-Report-Only`. Start strict: self, plus what the site really uses (next/font is self-hosted; check images, media and inline styles). Report-only first.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Keep fullscreen and screen orientation working, because games use them.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`.
- Verify on a production build: every main page loads with no CSP report violations in the console. Check `/`, `/learn/*`, one game in fullscreen, one story book with audio, and `/parents/settings`.

## 3. Phone landscape: show an island on the first screen
At 844×390 the homepage's first screen shows only the logo and the buttons; the IslandOrbit is below the fold.
- Make the header compact in short landscape viewports (`max-height: 500px`), for example a smaller logo and inline buttons, so that at least one orbit island is visible in the first screen at 844×390 and 932×430.
- Don't change portrait, tablet or desktop.
- The `.ui-pill` Home button on `/en` measured 42×48. Children's buttons must be ≥64 px (§2). Fix it.
- Run `scripts/check-home-browser.mjs` and the iPad WebKit check (`node scripts/check-ipad-webkit.mjs`). Add before/after screenshots at 844×390, 932×430, 390×844 and 1280×800 to `output/ops-1/`.

## Checks
`npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build` must all pass.

## Scope
**May edit:** `next.config.ts`, `src/lib/site-url.ts` (+ test), `.github/workflows/*`, header/landing CSS and components needed for item 3, `src/components/ui/*` (the pill size), and `output/ops-1/**`.

**Don't touch** content, art or audio.

## Report `output/ops-1/report.md`
- what changed
- the exact CSP
- the console results per page
- screenshots
- what the owner must configure on GitHub/Vercel
