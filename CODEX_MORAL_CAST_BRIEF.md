# Codex art brief — Robot cast sheet for the Manners-island cartoons

**Read `AGENTS.md` first** with `Get-Content -Encoding utf8 AGENTS.md` (UTF-8 Thai). §1.1–1.5 bind every pixel.

The owner decided (2 Oct 2026): the Manners-island cartoon lessons are acted **only by robot characters**.
No children, no people at all — not even seen from behind. The teacher is the existing robot **Nuri**
(attached `public/moral/guide/stand.webp`, `public/Character/welcome.png`) — **do not redesign Nuri and do not draw Nuri on this sheet**.

Your job now: **one cast reference sheet** for the new supporting robots. The owner approves it before any scene is drawn,
and every later scene will copy these designs exactly. Do not edit `src/`. Do not commit.

## The cast (4 robots)

All four in the same premium polished 3D children's-game style as Nuri (glossy white shell, gold trim, soft upper-left light,
rounded toy-like forms), but clearly **different from Nuri**: no gold crescent on the head, no turquoise cape, no mosque emblem.

1. **Robot student "A"** — small (about 70% of Nuri's height), chubby round body, black visor screen face with glowing
   happy eyes and small mouth (robots may have faces), one short antenna with a round **orange-gold** light,
   **orange/coral** accent panels, two small rubber wheels. Short silver bendy arms, white mitten-like claw hands
   that can hold a spoon or a door handle.
2. **Robot student "B"** — same size and family as A, but **lime-green** accents, a little square-ish head, two tiny
   antenna bolts instead of one antenna, single round wheel / ball base. Friend of A (needed for greeting and sneezing scenes).
3. **Robot parent 1** — taller (about 120% of Nuri), calm rounded shell, **navy-blue** accents, kind glowing screen face.
4. **Robot parent 2** — same height as parent 1, **lavender/rose** accents, softer egg-shaped head, kind glowing screen face.

## Hard rules (§1.2 — robots must read as machines)

- Visible machine parts on every robot: shell seams, bolts, joints, wheels or treads, screen-face visors.
- **No hair, no skin, no human ears or noses, no clothes, no hijab/cap, no animal shapes** (no cat ears, no dog snouts, no tails).
  They must NOT look like a human child or an animal in a robot costume.
- No text, letters, numerals, Arabic script or logos anywhere. No music symbols.

## Format

- `output/moral-cast/cast-sheet.png` — **1600 × 1000, opaque**, plain soft light-cream background, the four robots standing
  side by side left→right: A, B, parent 1, parent 2, front view, same ground line, correct relative sizes.
- Also separate transparent turnarounds for later reference (true alpha, 1024 × 1024 each, ~85% height, centered):
  `robot-a.png`, `robot-b.png`, `robot-parent1.png`, `robot-parent2.png`.
- Contact sheet `output/moral-cast/preview.png` showing Nuri (from the attached file) beside the four, for scale comparison.

## Self-check

- Look at every robot: does any read as a human child or an animal? Regenerate if so.
- Alpha scan with a script: cast-sheet fully opaque (no alpha < 250); transparent PNGs have corner alpha 0, interior 255.
- Write `output/moral-cast/README.md`: files, sizes, alpha results, prompts used.
