# Sequence island artwork

Original assets generated with the built-in imagegen tool on 2026-09-14 for Little Ummah. No third-party artwork or new mascot is used. The existing robot and approved game sounds remain in use.

- `island.webp`: transparent 2.5D board, 1100 × 1100. Playable ivory area approximately x 8–92%, y 25–61%; the destination row is x 8–92%, y 33–57%. At 320px viewport the row widens to x 5–95% to retain 64px buttons.
- `block.webp`: transparent toy cube, 320 × 320. Reused at consistent scale for countable groups and stacked towers; only the size lesson changes cube scale.
- Text, position numbers, hints and completion checks are real HTML.
- Original PNG files are local, ignored by Git, with SHA-256 recorded in `scripts/source-images.json`.
- Rebuild optimized assets: `node scripts/optimize-images.mjs public/games/sequence`.

## Generation prompts

### Island

Use case: stylized-concept. Create a production game asset, a premium colorful 2.5D children's educational game floating island, transparent background actual alpha. Orthographic camera looking down 45 degrees, centered symmetrical composition, square 1024 canvas. Island has a very broad empty warm ivory rounded rectangular top occupying x 8-92%, y 15-72% of canvas, suitable to overlay interactive toys. Turquoise chunky beveled rim, fine gold edging, short faceted blue rocky floating underside occupying bottom 22%. Two SMALL architectural toy towers at far back corners, white and turquoise with gold finials, tiny geometric shrubs only at extreme corners. Plenty of absolutely empty flat play space. Beautiful polished tactile clay/plastic materials, soft shadows, crisp bevels, cheerful premium 3D render. All visible silhouette within canvas, no ground plane. No text, numbers, letters, symbols of music, humans, animals, faces, characters, watermark. This is an original standalone island game board asset.

### Block

Use case stylized-concept. Production isolated game object: ONE beautiful chunky turquoise toy building block, rounded cube with shiny gold thin bevel accents, ivory top, turquoise front and blue right side. Orthographic 3/4 camera slightly above matching a 2.5D floating island educational toy game. Premium colorful 3D clay/plastic render, soft studio lighting, crisp clean silhouette. Centered object occupies 85% of square canvas. Genuine transparent alpha background. No ground plane, no shadow outside object, no text, numbers, letters, faces, creatures, symbols, music, watermark. Single cube only. This block will be reused to make countable stacks in an educational ordering game.
