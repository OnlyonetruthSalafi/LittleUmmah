# Kids Mini Game Center

## Repository findings
- Existing Next.js 16.3.4 App Router, React 19.2.8, TypeScript and Tailwind v4.
- Baloo 2 / Noto Sans Thai Looped via next/font; reuse global color and focus tokens.
- No animation or global state dependencies. Existing node:test memory/speech tests.
- Existing `/learn/games` island and memory routes remain compatible. New canonical hub: `/games`.
- Approved robot poses in `public/Character/*.webp`; use play, idea and fighting unchanged.
- Existing SoundProvider supplies persisted sound preference and cancellable Thai speech.
- Existing uncommitted AGENTS.md and GAME_SYSTEM_PLAN.md belong to the user; preserve them.

## Implementation
1. Add typed catalog and educational content separate from generic matching, sequence, shuffle and progress logic.
2. Add server-rendered hub, game-specific lazy client entry, shared GameShell, instructions, results and controls.
3. Prove pointer drag and keyboard/tap matching with colors and shapes; reuse for Arabic, sequence, sorting and puzzle.
4. Add memory engine with 3/6/8 pairs and object-finding scenes. Three levels per game; puzzle 4/6/9 pieces.
5. Integrate original puzzle raster art, approved robot poses, CSS toy thumbnails and existing SVG symbols.
6. Validate logic, lint, TypeScript, production build and browser interactions where tools permit.

## Routes and integration
`/games`, `/games/color-match`, `/games/shape-match`, `/games/memory`, `/games/puzzle`, `/games/arabic-match`, `/games/sequence`, `/games/find-object`, `/games/sort`.
The existing island entry `/learn/games` redirects to the canonical hub. Existing memory deep links remain available.

## Architecture
`src/features/games/data`: typed catalog, bilingual labels, level content, asset manifest.
`engine`: pure generic validation/randomization and a versioned injectable progress repository.
`components`: hub, shell, game artwork, pointer/tap board, reusable controls.
`games`: lazy matching, memory and find-object presentations. Game mechanics use IDs, not religious concepts.
Local state owns active level and transient interactions. The repository owns best stars per completed level, highest level and last-played timestamp; blocked storage falls back to memory.

## Audio and motion
Reuse existing SoundProvider for voice instructions and friendly feedback. Optional licensed SFX hooks may be registered later; missing clips are silent. No background music category or musical tones. No unapproved sound files.
Motion only under prefers-reduced-motion: no-preference. Card labels stay still; only illustration frames lift. Shadows remain as non-motion feedback.

## Assets and responsive strategy
Reuse approved robot files and icon vocabulary, create a distinct original architectural puzzle image using imagegen, optimize through the existing image pipeline with SHA-256 provenance. Public game raster assets live under public/games. Simple toy diagrams use SVG/CSS and real Unicode Arabic text.
Hub grid: 2 columns mobile, 3 tablet, 4 desktop. Child targets >=64px. Game pages omit unrelated site navigation. Pointer events plus tap/keyboard selection; no HTML drag-only interactions. Avoid fixed viewport height and horizontal overflow.

## September 2026 world-art upgrade
- Preserve the existing eight playable routes and reusable engines; audit their behavior and tests.
- Replace CSS hub thumbnails with eight original generated toy-island WebP illustrations.
- Generate a panoramic sky-world background; reuse the approved robot and courtyard puzzle artwork.
- Present islands without white card frames, with stationary bilingual labels, 2/3/4 responsive columns and reduced-motion-safe feedback.
- Keep Unicode learning content as DOM text; use new environment art behind the find-object board.
- Retain PNG intermediates locally, optimize using scripts/optimize-images.mjs and record source SHA-256 hashes.
- Run tests, lint, typecheck, production build and route/browser checks; document exact assets and results.

## Final status
Implemented world-art upgrade and preserved all eight playable games. Nine generated PNG sources converted to WebP, transparency and sizes verified. All 34 tests, lint, typecheck, build and production route/asset smoke checks pass. Browser runtime has no connected browser; device playthrough and responsive screenshot QA remain outstanding. See GAME_IMPLEMENTATION_REPORT.md and GAME_ASSETS.md.

## Game interiors follow-up
Owner reviewed and accepted the hub. Improve all eight game introductions and active boards: large island preview, illustrated guide, game-specific themed workbenches, meaningful level descriptions, tactile shape pieces and Arabic blocks, puzzle frame, sequence path, sorting bins and discovery garden. Generate reusable transparent 3D object art for memory/find; preserve gameplay IDs, accessibility, robot and approved hub. Optimize WebP and verify tests/lint/typecheck/build.

Interior follow-up complete: all eight game introductions and boards restyled; nine new assets generated/optimized/integrated. Tests 34/34, lint, typecheck, build and production route/asset checks pass. Owner may visually review the latest interiors. Claude handoff notes are in CLAUDE_HANDOFF.md; no automatic quota monitoring or dispatch capability is available.
