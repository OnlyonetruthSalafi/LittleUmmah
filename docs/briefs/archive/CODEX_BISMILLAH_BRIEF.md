# Codex art brief — "Bismillah with Nuri" cartoon lesson (Manners island)

**Read `AGENTS.md` first** with `Get-Content -Encoding utf8 AGENTS.md` (UTF-8 Thai). §1.1–1.5 bind every pixel.
Note the updated §1.1: people may appear in children's cartoons ONLY with a completely blank face
(no eyes, nose, mouth, eyebrows, blush, nothing that works as a face). Back views are preferred.

Claude writes all code and places the robot. **Your job: scene backgrounds only.** Do not edit `src/`. Do not commit.

Attached: `tests/MoralPage.png` (style mock), `public/moral/card-bismillah.png` (the lesson's card art — match it),
`public/Character/welcome.png` (the robot, for scale/style reference only — **do NOT draw the robot in the scenes**).

## Format (all scenes)

- **1600 × 1000 PNG (16:10), fully opaque, full-bleed**, no border, no text, no letters, no numerals, no Arabic script, no logos.
- Same premium colorful polished 3D children's-game style as the mock and card art: soft upper-left light,
  rounded toy-like forms, palette blue / turquoise / white / gold with warm accents.
- **Keep the RIGHT 32% of every scene calm and uncluttered with visible floor/ground** — the robot guide
  "Nuri" (added by code) stands there, pointing left at the action. Put the action in the LEFT/CENTER.
- Keep the TOP-CENTER area fairly calm too: the page shows a gold label with the Arabic phrase there.
- One cartoon child may appear in scenes 2–5: **about 6 years old, seen from BEHIND or 3/4 back**, simple modest
  clothes (long sleeves, turquoise/blue), short dark hair or a simple cap. **The face must not be visible at all.**
  If any part of the face shows, it must be a completely blank smooth surface. Same child design in every scene.
- No animals, no birds, no other people, no music symbols, no mosque-as-Quran, no religious figures.

## Scenes — save to `output/bismillah-art/`

1. `scene-class.png` — a bright, cosy open-air classroom on a floating sky island: low white-and-gold arches,
   a few small turquoise floor cushions facing the viewer's left, a small low table with a closed book,
   palm leaves, sky and distant floating islands. No people. (Intro / outro scene.)
2. `scene-eat.png` — a family dining mat (sufrah) on the floor of a warm home: plates of rice, dates, a water glass.
   The child sits at the left-center seen from behind/3-4 back, **reaching to the food with the RIGHT hand**.
3. `scene-door.png` — the front door of a cosy home (arched wooden door, lantern, potted plants, doormat).
   The child stands at the open door seen from behind, one hand on the door, as if stepping in / out.
4. `scene-car.png` — a friendly rounded family car parked in a sunny street with palms; the rear door open.
   The child, seen from behind, is climbing into the back seat (child seat visible).
5. `scene-bed.png` — a calm bedroom at night (moonlight through an arched window, stars outside, soft lamp).
   The child lies in bed on the RIGHT side, turned away from the viewer under a blanket — only the back of
   the head/hair visible. Bed on the left-center of the image.

## Self-check before finishing

- Inspect every image: zoom on the child's head in each — no eyes/nose/mouth/eyebrows/blush. Regenerate if any appear.
- No text or letters anywhere (imagegen sometimes adds them on books, signs, plates, the car).
- Verify **fully opaque** with a script (no pixel alpha < 250) and the right ~32% is calm.
- Write `output/bismillah-art/README.md`: file list, size, alpha check, face check, prompts used. Also save a contact sheet `preview.png`.
