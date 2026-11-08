# Codex art brief — Explore island (สำรวจโลก), round 1: Desert habitat + lesson cards + hero

**Read `AGENTS.md` first** with `Get-Content -Encoding utf8 AGENTS.md` (UTF-8 Thai). §1.1–1.5 bind every pixel.

The Explore page copies the layout of the Manners island (`/learn/moral`). The robot teacher **Nuri** tells each lesson as a
cartoon, scene by scene. Code places Nuri on the right of every scene, so **never draw Nuri** (crescent on head, turquoise cape),
and draw no other robots in round 1 either.

Claude writes all code. Do not edit `src/`. Do not commit. Do not run `scripts/optimize-images.mjs`.

## Hard content rules (check every image before saving)

- **Animals: completely blank head.** No eyes, no nose, no nostrils, no mouth, no tongue, no eyebrows, no eyelashes, no blush,
  no eye-shaped shading. The head is a smooth rounded shape. Ears are fine (camel ears, the big fennec ears).
  Show animals **side-on** (profile) or three-quarter from behind. Same toy-like blank-head style as the attached
  `public/moral/scenes/animals-well.png` (the dog) and `public/islands/explore.png` (giraffe, deer, elephant).
- **Zoom into every head after generating.** Image models like to add a tiny eye or a smile line. If you see one, regenerate.
- No humans, no human hands, no robots, no religious figures, no mosque used as a Quran symbol.
- No text, letters, numerals, Arabic script, logos, signs with writing. Signposts must be blank.
- No music symbols, no instruments.
- No predation, no blood, no animal eating another animal.

## Style (every image)

Premium polished colorful 3D children's-game style, the same as the attached `public/moral/scenes/animals-well.png`
and `public/moral/card-animals.png`: soft upper-left sunlight, rounded toy-like forms, palette blue / turquoise / white / gold
with warm sand tones.

---

## A. Cartoon scenes — **1600 × 1000 PNG (16:10), fully opaque, full-bleed**

- **Keep the RIGHT 32% calm and empty with visible ground** (Nuri stands there). Action in the LEFT/CENTER 65%.
- **Keep the TOP-CENTER calm** (a label may be laid over it).
- Animals at a readable size: the main animal ≈ 35–50% of the image height.
- Save to `output/explore-scenes/<file>.png`. Resample to exactly 1600 × 1000 with sharp if needed (no cropping that cuts animals).
- Use `desert-arrive.png` as the reference for the others so the desert, light and palette match.

1. `desert-arrive.png` — wide sunny desert: soft golden sand dunes rolling to the horizon, clear blue sky, a small green oasis
   with two date palms and a little turquoise pool at the far left, a few desert rocks. No animals. Wind ripples on the sand.
2. `desert-camel.png` — the same desert. A one-hump **dromedary camel** walks side-on from left toward center across the dunes,
   long legs, wide round padded feet, a clear single hump. Soft footprints trail behind it. Blank head (ears only).
3. `desert-oasis.png` — the oasis from scene 1, close up: the camel stands at the edge of the turquoise pool, head lowered to the
   water as if drinking (blank head, no mouth drawn — the head simply touches the water surface). Date palms with date clusters.
4. `desert-fox.png` — midday desert under strong sun. A small sand-colored **fennec fox** with very large upright ears rests in
   the shade at the entrance of its burrow (a round hole under a dune / rock). Side-on, blank head, big ears, bushy tail with a darker tip.
5. `desert-night.png` — the same dune at night: deep blue sky, big bright stars, a crescent moon, cool blue sand.
   The fennec fox has come out of its burrow and walks side-on across the sand, ears up. Blank head.

## B. Lesson cards — **1024 × 768 PNG (4:3), opaque, full-bleed**

Single clear focal subject, soft blurred background, same set style as the attached `public/moral/card-animals.png`.
**No animals on cards except card-desert.** Save to `output/explore-cards/<file>.png`.

1. `card-desert.png` — golden dunes, one date palm, and the blank-headed dromedary camel side-on on the crest of a dune.
2. `card-sun.png` — a big warm glowing sun in a blue sky over a green hill (no face on the sun).
3. `card-moon.png` — a thin bright crescent moon and stars over a calm night landscape (no face on the moon).
4. `card-water.png` — a clear water drop splashing into a turquoise pool with ripples; a silver tap may appear at the side.
5. `card-tree.png` — a young date palm growing on sand with a cluster of dates, a small seed sprout beside it.
6. `card-honey.png` — a golden honeycomb dripping honey into a small glass jar. **No bees.**
7. `card-rain.png` — a soft rain cloud with rain drops falling on green leaves, a puddle below.
8. `card-mountain.png` — tall rounded mountains with snow caps and a green valley.
9. `card-daynight.png` — a small Earth globe lit half by a golden sun on the left, the other half in night with stars (no faces).

## C. Hero island — `output/explore-hero/hero-island.png`

Same size, framing and floating-island style as the attached `public/moral/hero-island.png` (1063 × 923, **real alpha transparency**
around the island — no magenta, no white background). An Explore-themed floating island with four small zones: golden desert
dunes with a date palm (left), a turquoise sea corner with a coral reef edge (front), a green forest (back), a white snowy ice
corner (right). A big friendly globe and a brass telescope in the middle. **A blank wooden signpost on the right** like the moral island.
Keep the right third of the island a little open (Nuri stands there). No animals on the hero island.

## Output checklist

- Each scene/card: correct size, **fully opaque** (scan alpha with sharp: zero pixels below 250). Hero: real transparent margins.
- Every animal head zoomed and confirmed blank.
- Write `output/explore-scenes/README.md` listing every file, its size, the prompt used, and the head check result.
