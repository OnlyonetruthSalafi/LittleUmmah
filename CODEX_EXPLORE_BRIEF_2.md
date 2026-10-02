# Codex art brief — Explore island, round 2: Forest, Sea and Polar habitats

**Read `AGENTS.md` first** with `Get-Content -Encoding utf8 AGENTS.md` (UTF-8 Thai). §1.1–1.5 bind every pixel.
Round 1 (desert) is approved and live: read `CODEX_EXPLORE_BRIEF.md`. **Every rule, format and style in that brief applies
here unchanged** (hard content rules, 1600×1000 opaque scenes with the right 32% empty for Nuri, 1024×768 cards,
blank animal heads, no text, no humans, no robots, no predation). Match the attached round-1 images exactly in style,
lighting and finish (`public/explore/scenes/desert-camel.png`, `desert-fox.png`, `public/explore/card-desert.png`).

Claude writes all code. Do not edit `src/`. Do not commit. Do not run `scripts/optimize-images.mjs`.

## Blank heads — extra notes for these animals

- **Elephant:** smooth blank head and ears; the **trunk is allowed** (same as the owner-approved elephant on
  `public/islands/explore.png`), but no eyes, no mouth, no tusks-with-smile, no eyebrows.
- **Sea turtle, dolphin, seal, polar bear, squirrel:** the head is a smooth rounded shape. No eyes, no nostrils, no mouth line,
  no smile, no whiskers dots. A dolphin's head is a smooth rounded dome with a smooth beak-like snout but **no mouth line**.
- Animals side-on or three-quarter from behind. Zoom into every head after generating; regenerate if any eye/mouth appears.

## A. Scenes — save to `output/explore-scenes/` (1600 × 1000, opaque, right 32% calm with visible ground/floor)

Forest (bright tropical forest of Southeast Asia, green and gold light):
1. `forest-arrive.png` — lush rainforest clearing, tall trees with hanging vines, ferns, a clear stream with smooth stones,
   sunbeams through the canopy. No animals.
2. `forest-elephant.png` — the same forest. An **Asian elephant** walks side-on from left to center along the stream bank,
   small rounded ears, trunk hanging down. Blank head.
3. `forest-river.png` — the elephant stands knee-deep in the stream, trunk raised spraying a gentle arc of water droplets over
   its own back. Blank head. Sparkling water.
4. `forest-squirrel.png` — close view of a thick tree branch; a reddish-brown **squirrel** with a big bushy tail sits side-on
   holding a round nut in its front paws. Blank head (small ears allowed). Leaves and a few nuts on the branch.
5. `forest-canopy.png` — view looking along the forest layers: tall emergent trees above the canopy, thick green canopy,
   shady understory and the forest floor with leaves and mushrooms. Soft light shafts. The squirrel leaps between two
   branches in the canopy (small, side-on, blank head).

Sea (bright turquoise tropical sea):
6. `sea-arrive.png` — underwater coral reef: colorful corals, sea grass, sandy floor, light rays from the surface. Small
   simple fish shapes in the distance are fine but **with no eyes or mouths** (plain colored shapes). No large animals.
7. `sea-turtle.png` — the reef. A **green sea turtle** glides side-on from left to center, flippers spread, patterned shell. Blank head.
8. `sea-beach.png` — a quiet sandy beach at sunrise; a row of tiny baby sea turtles crawls from the sand toward the gentle
   waves (side-on / from behind, blank heads). A few small round eggshell pieces in a sand hollow. Palm trees at left.
9. `sea-dolphin.png` — open sea surface, sunny sky; two **dolphins** leap in a curved arc out of the water side-on. Blank heads, no mouth line.

Polar (white, ice-blue and soft gold sunlight):
10. `polar-arrive.png` — wide Arctic landscape: snow fields, ice floes on dark blue water, a soft pastel sky with a pale sun
    low on the horizon. No animals.
11. `polar-bear.png` — a white **polar bear** walks side-on across the snow from left to center, big furry paws, small round ears. Blank head.
12. `polar-den.png` — a cosy snow den dug into a snow bank (rounded entrance); a mother polar bear lies curled inside and one small
    cub stands near the entrance, both blank heads. Gentle snowfall.
13. `polar-seal.png` — a grey spotted **seal** rests side-on on an ice floe beside the water, flippers tucked. Blank head.
14. `polar-swim.png` — split view at the waterline: the seal swims gracefully under the ice in clear blue water (side-on, blank head),
    ice floe above.

## B. Cards — save to `output/explore-cards/` (1024 × 768, opaque, full-bleed, single focal subject)

15. `card-forest.png` — the blank-headed Asian elephant side-on beside a stream in a bright green forest.
16. `card-sea.png` — the blank-headed green sea turtle side-on above a colorful coral reef.
17. `card-polar.png` — the blank-headed polar bear side-on on snow with ice floes behind.

## Output checklist

- Exact sizes, **fully opaque** (sharp alpha scan: zero pixels below 250).
- Every animal head zoomed and confirmed blank (also the tiny fish and baby turtles).
- Append the new files, prompts and head-check results to `output/explore-scenes/README.md` under a "Round 2" heading.
