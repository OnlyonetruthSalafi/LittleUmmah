# Game Center assets

## Exact production folder
```text
public/games/
├── hub/
│   ├── game-hub-bg.webp
│   ├── color-match.webp
│   ├── shape-match.webp
│   ├── memory.webp
│   ├── puzzle.webp
│   ├── arabic-match.webp
│   ├── sequence.webp
│   ├── find-object.webp
│   └── sort.webp
└── puzzle/
    └── courtyard.webp
```
Every WebP has a same-name PNG source retained locally and ignored by Git. No empty folders or duplicate mascot files. Nine images generated this turn with the built-in imagegen tool; courtyard and the approved play/idea/fighting robot WebPs reused unchanged.

## Optimization
Eight island images: 640 × 640, alpha preserved, quality 85, 67–114 KiB each.
Background: 1536 × 1024, quality 85, 126,156 bytes.
Existing courtyard: 900 × 900, quality 86, 136,788 bytes.
All nine originals visually inspected: no people, animals, faces, music symbols, embedded text or third-party characters.
Run `node scripts/optimize-images.mjs`; source SHA-256 hashes are in `scripts/source-images.json`.
Arabic thumbnail letters are actual Unicode text positioned over blank blocks; learning pieces and icons remain SVG/DOM.
The background is reused behind game pages and the finding scene; interactive objects remain separate accessible buttons.

## Exact prompt set
Built-in generation, one call per image.

Background:
> Generate a wide landscape 1536x1024 website background illustration. Premium colorful 3D toy diorama for a Muslim children's educational game universe. An expansive luminous turquoise blue sky, soft white clouds, floating miniature white and gold Islamic geometric architecture islands at far left and far right, a tiny arched library and toy books, gold stars and crescent ornaments. Center 65 percent is open clean light blue sky for separately rendered UI islands. Bottom fluffy clouds fade into pale turquoise. Polished rounded tactile toys, bright daylight, soft global illumination, magical high-end game environment. No text, letters, numbers, robots, humans, animals, faces, music symbols, logos or watermarks. Save image for project integration.

Island template (SUBJECT replaced with each entry below):
> Use case: stylized-concept. Create ONE square 1024x1024 premium 3D toy game selection island illustration. Subject: SUBJECT. Isolated complete diorama centered with generous 8 percent margin on all sides, genuinely transparent background, no rectangular backdrop. Polished colorful rounded toy materials, blue turquoise white gold identity with appropriate colorful educational pieces, soft global illumination, bright daylight, soft shadow, subtle Islamic geometric accents. Viewed slightly from above, large readable objects, high-end children's game art. No text, numbers, letters, humans, animals, living creatures, faces, robots, music symbols, copyrighted characters, logos or watermark. This asset will be integrated into an existing website.

- **color-match:** Four glossy red yellow blue green sorting buckets with matching balls and cubes, spilling playfully onto a floating turquoise island
- **shape-match:** A chunky turquoise shape-fitting toy board with clearly visible circle square triangle rectangle and gold star slots, matching glossy pieces standing beside it, floating island
- **memory:** A floating lavender and turquoise island with six chunky rounded memory tiles, some face down with geometric embossing and three face up with gold star crescent and lantern symbols
- **puzzle:** A floating turquoise island with a large chunky jigsaw puzzle partly assembled showing a miniature white and gold domed building, two oversized jigsaw pieces nearby
- **arabic-match:** A floating turquoise library island with three large blank ivory toy letter blocks framed in gold and blue and a small open book. Block faces must remain completely blank; actual Arabic letters will be rendered separately in the website
- **sequence:** A floating turquoise island with three glossy toy blocks increasing distinctly from small to medium to large along a curved golden stepping stone path. No numbers or letters
- **find-object:** A floating turquoise treasure garden island with a large blue magnifying glass framing a gold star, a toy book, gold lantern and crescent ornament, bold simple composition
- **sort:** A floating turquoise toy sorting factory island with three open round containers, glossy cubes in one, balls in another, gold stars in third, playful short toy chutes

## Audio
Existing SoundProvider persists preference and provides speech with safe fallbacks. No audio files or background music added. Future SFX require verified licenses and owner listening approval under AGENTS.md.


## Game interiors follow-up: additional generated assets

All generated through built-in imagegen and visually reviewed. Eight isolated objects retain real transparency at 320 × 320, quality 86, about 15–30 KiB each. Garden background is 1280 pixels wide, quality 83, about 112 KiB. All final production assets are WebP; same-name PNGs are local ignored originals. Original SHA-256 values are recorded by the existing optimization pipeline.

```text
public/games/common/
├── objects/
│   ├── moon.webp
│   ├── sparkle.webp
│   ├── mushaf.webp
│   ├── lantern.webp
│   ├── jug.webp
│   ├── mat.webp
│   ├── letters.webp
│   └── maze.webp
└── backgrounds/
    └── garden.webp
```

The object set is used for memory and finding games. Letter block artwork is intentionally blank and receives a real Unicode alif in the UI. The Quran is represented by an open mushaf. The background has no baked-in target objects. Simple matching shapes remain SVG with deterministic outlines and dimensional shading.

### Exact prompts

**moon**
> Generate ONE isolated game object asset, square 1024x1024. A single thick smooth polished golden crescent moon toy, upright, simple unmistakable crescent silhouette, no other objects. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**sparkle**
> Generate ONE isolated game object asset, square 1024x1024. A single chunky rounded five-point golden star toy with beveled edges, no other objects. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**mushaf**
> Generate ONE isolated game object asset, square 1024x1024. A single beautiful OPEN Quran book (mushaf), ivory pages without any writing, turquoise hardcover with subtle gold geometric border, seen from above at a gentle angle, both open pages clearly visible, no stand or building. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**lantern**
> Generate ONE isolated game object asset, square 1024x1024. A single chunky gold and turquoise Islamic lantern toy, broad arched glass panels with warm ivory center, small ring handle, no flame or extra objects. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**jug**
> Generate ONE isolated game object asset, square 1024x1024. A single rounded turquoise ceramic water jug toy with gold rim, large obvious handle and pouring spout, no extra objects. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**mat**
> Generate ONE isolated game object asset, square 1024x1024. A single rectangular turquoise prayer mat with gold border and simple arched geometric motif, short ivory fringe at both ends, viewed mostly from above, no writing or extra objects. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**letters**
> Generate ONE isolated game object asset, square 1024x1024. A single chunky royal blue and gold toy alphabet cube, front face ivory and completely blank to add Unicode text later, viewed almost straight on with slight top and right side visible, no writing. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**maze**
> Generate ONE isolated game object asset, square 1024x1024. A single chunky square turquoise toy maze board viewed nearly from above, raised ivory maze walls and one small gold ball, simple bold paths, no text or other objects. Premium colorful polished 3D toy rendering for a Muslim children's game universe, blue turquoise ivory white and gold, tactile soft rounded edges, soft bright studio illumination and dimensional shading. Object fills central 80 percent, completely visible with safe margin. Genuinely transparent background, no scene, no pedestal, no ground plane. No humans, animals, living creatures, faces, robots, music symbols, logos, text, letters, numbers or watermark. Must remain instantly recognizable at 80 pixels.

**garden**
> Generate one landscape 1536x1024 original premium colorful 3D toy garden environment for a children's find-object game. A bright turquoise and ivory Islamic-inspired garden terrace with two broad clear ivory stone shelves/ledges across the middle and lower foreground, rounded bushes at far edges, arched turquoise alcoves at far left and right, luminous sky visible behind, gold geometric tile border. Large central 75 percent is uncluttered empty pale turquoise and cream space for interactive object buttons added by the website. Polished rounded toy materials, daylight, soft shadows, blue turquoise white gold. No books, stars, crescents, lanterns, jugs, rugs, alphabet blocks or mazes in this background, because they are separately added interactive targets. No humans, animals, faces, robots, text, music symbols, logos or watermark.
