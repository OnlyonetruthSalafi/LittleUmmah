# Codex art brief — Manners & Morals island page (`/learn/moral`)

**Read `AGENTS.md` first** (it is UTF-8 Thai — read it with `Get-Content -Encoding utf8 AGENTS.md`).
Sections 1.1, 1.2, 1.3, 1.4, 1.5 are binding for every pixel.

Claude writes all page code. **Your job is images only** (plus small scripts to check/crop them).
Do not edit anything in `src/`. Do not commit.

Attached images:
1. `tests/MoralPage.png` — the owner's mock of the new page. Match its look: premium colorful 3D
   children's game, soft upper-left light, palette blue / turquoise / white / gold, rounded toy-like forms.
2. `public/Character/welcome.png` — the existing robot mascot (identity reference).
3. `public/Character/greet/stand.png` — the same robot facing front (pose/framing reference).
4. `public/islands/moral.png` — the current Manners island (style reference for the hero island).

Save every raw output to `output/moral-art/` (PNG). Claude converts to WebP and wires them in.

---

## Hard rules (check every image against these)

- **No human or animal faces anywhere** — people and animals may appear only with a completely blank face (AGENTS.md §1.1): no eyes, nose, mouth, eyebrows, blush or anything that works as a face.
  A hand (no face) is allowed. Robots may have faces.
- **No emoji-like characters.** This set of cards uses objects only (a hand is fine).
- **No music symbols** (notes ♪ ♫, instruments). Sound waves "((( " arcs are fine.
- **No text, letters, numerals, Arabic script or logos inside any artwork.** Signs and speech
  bubbles must be **blank** — the page puts real text on top.
- Do not depict prophets or religious persons. No mosque pictured as "the Quran".
- Do not copy BabyBus or any third-party artwork.
- **The robot must be the existing mascot — do not redesign it.** Adding new poses is allowed.

---

## 1. Hero island — `output/moral-art/hero-island.png`

- 1536 × 1024, **true transparent background (real alpha)**, the whole island inside the canvas
  with ≥ 3% transparent margin on all sides.
- Recreate the island at the top-right of the mock: floating island, white mosque with **gold dome**
  and gold crescent on top, small minarets, palm trees, flowers, glowing gold lanterns along a
  curving **stone staircase that leads down to a little stone arch bridge**, marble/stone cliffs,
  lush green grass.
- The wooden signpost from the mock **may stay but must be completely blank** (no letters).
- No water plane or sky backdrop — island only (the page already has a sky scene behind it).

## 2. Age badges (transparent, 512 × 512, object centered, ~85% of canvas)

- `age-kids.png` — a small colorful **toy building-block castle** (yellow/red/blue/green blocks,
  little red cone roof with a small gold crescent finial), like the icon on the yellow "วัย 3-6 ปี" button.
- `age-juniors.png` — a neat **stack of 3–4 hardback books** (pink, yellow, blue, turquoise covers,
  gold edges), like the icon on the green "วัย 7 ปีขึ้นไป" button. Blank covers, no titles.

## 3. Lesson card pictures (opaque, full-bleed, **1024 × 768**, 4:3, no border, no text)

All eight in one consistent set, same lighting and render quality, a single clear focal object
readable by a 3-year-old, soft blurred background in the card's own color mood (see mock).

Ages 3–6 row:
1. `card-bismillah.png` — a plate of rice with a few dates, a glass of water, an arched window behind,
   and **a child's RIGHT hand** (hand and sleeve only, no body, no face) reaching to eat.
   It must clearly be the right hand (the lesson says "eat with the right hand").
2. `card-salam.png` — an arched wooden door with a glowing brass lantern beside it and soft white
   **sound-wave arcs** coming from the doorway (a greeting being said). No music notes.
3. `card-smile.png` — a big glossy gold **star** with two red glossy hearts and small sparkles on a
   soft pink-and-sunny glow background.
4. `card-clean.png` — a shiny silver tap pouring clear water into a basin, soap bubbles, a folded
   white towel, a leafy plant.

Ages 7+ row:
5. `card-parents.png` — a cosy little house with a warm roof and two big glossy red hearts in front, trees around.
6. `card-truth.png` — a green **shield with a white check mark** standing on a small grassy plinth
   with a closed book beside it.
7. `card-sneeze.png` — a blue patterned **tissue box** with a tissue popping out and a **blank
   white speech bubble** floating at the upper right (the page writes الحمد لله on it as real text —
   leave the bubble completely empty and fairly large, upper-right area).
8. `card-animals.png` — a stone **water bowl** full of clear water with a small brown **paw-print**
   mark on its side, leafy plants around. No animal.

## 4. Robot guide poses — `output/moral-art/guide/` (transparent, 1024 × 1024)

The same robot as `welcome.png` / `stand.png`: white glossy body with gold trim, gold crescent on top
of the head, turquoise headband with gold geometric pattern, black visor screen face with glowing
blue happy eyes and small pink mouth, round blue/gold ear discs, silver flexible arms with white
claw hands and glowing blue wrist rings, turquoise cape with gold Islamic geometric border,
glowing blue mosque emblem on the chest, white tank treads with blue glowing wheels.
**Empty hands — no game controller, no globe, no book.**

Make `stand.png` first, then derive the others from it so body, scale and position stay identical:
1. `stand.png` — front view, symmetric, arms relaxed at the sides, happy face. Resting pose.
2. `wave-1.png` — same; the robot's right hand (viewer's left) raised beside the head waving, claw open.
3. `wave-2.png` — identical to wave-1 but the waving arm tilted to the other side (second wave position).
4. `point.png` — body turned slightly to the viewer's LEFT, one arm stretched out pointing to the
   viewer's LEFT (the page's buttons are to the robot's left), other hand on the chest, happy face.

Technical (all four): same scale, robot height ≈ 85% of canvas, body's vertical axis at x = 512,
tread bottoms on the same baseline (≈ y = 960). True alpha: corners alpha 0, robot interior alpha 255,
no ground shadow, no dust, no checkerboard.

---

## Self-check before finishing

- Look at every image yourself against the hard rules (faces, text, music, animals).
- Script-check alpha for every transparent PNG: has alpha channel, corners alpha 0, count pixels with
  0 < alpha < 250 (should be edges only). For the card pictures check they are **fully opaque**
  (no pixel below alpha 250) — imagegen sometimes returns faded semi-transparent images.
- If transparency fails, regenerate; if it still fails, use a flat pure magenta (#FF00FF) background and say so.
- Write `output/moral-art/README.md` listing each file, its size, the alpha-check result and the prompt used.
