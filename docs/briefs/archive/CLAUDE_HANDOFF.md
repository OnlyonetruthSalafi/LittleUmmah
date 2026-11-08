# Claude handoff — game interiors

The owner asked Codex to hand work to Claude if the 5-hour usage limit reaches 95%. Codex cannot read that quota or directly dispatch Claude from this session. This file preserves a concrete handoff if the owner switches agents.

## Authorized scope
Improve all eight game introductions and playable boards to match the accepted 3D /games hub. Reuse the exact existing robot. No faces on living creatures, no music, Thai first, English second, 64px child targets, reduced-motion guards. Work autonomously; do not commit without owner approval.

## Implemented
- New GameIntro.tsx: large existing island art, unchanged robot, bilingual descriptions, level stepping stones and play button.
- New data/presentation.ts: per-game world names, descriptions, level summaries, destination and tray labels.
- New interiors.css imported only by games/layout.tsx: eight themed play surfaces, guide, progress, treasure cards, bins, shape slots, Arabic arches, sequence stones, framed puzzle and discovery garden.
- GameShape.tsx has SVG dimensional shading and recessed outlines.
- Artwork.tsx uses eight generated 3D object images for memory/find and true Unicode on a blank letter block.
- MatchingBoard.tsx adds section labels, themed bin colors and shape silhouettes. Game rules and persistence unchanged.
- Nine new generated sources under public/games/common/{objects,backgrounds}, converted through existing optimizer; source hashes recorded.

## Verification status
COMPLETE: Typecheck, all 34 tests, lint, production build, image optimization, alpha/dimension validation and HTTP route/asset checks all passed. No implementation work remains for the current scope; consult GAME_IMPLEMENTATION_REPORT.md for details. Optional next step is owner visual review. Fresh production preview runs at http://localhost:3001/games.
Browser runtime had no available connected browser. Owner reviewed and accepted the earlier hub manually; latest interiors still need owner visual review.

## Preserve
There were substantial existing uncommitted files before this work. Do not reset or overwrite unrelated changes. Hub appearance is accepted; avoid changing it. No commit has been made.
