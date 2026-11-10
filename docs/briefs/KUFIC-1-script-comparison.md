# KUFIC-1 — Arabic script comparison charts: Kufic vs other styles (same sound, different look)
**model `gpt-6-astra` (medium) · timeout 5400 · working folder `D:/Littleummah/output/kufic` only**

Write the report in Thai. This is **not** website work. The owner will use these charts elsewhere.
Do not touch any repository or worktree.

## Owner's request (9 Nov 2026, verbatim)
"ช่วยสั่ง Codex ทำภาพ อักษร อาหรับ คูฟิก โบราณ เทียบ การเขียนต่างๆ ที่ ไม่ทำ ให้การออกเสียงต่างกัน ให้ผมที พร้อมคำอธิบายไทย"

In short: charts that compare old Kufic Arabic letters with other ways of writing them, where only the look changes and the sound stays the same, plus Thai explanations.

## ⚠️ Letters must be real font glyphs, never AI-drawn
Image models cannot draw correct Arabic. They invent wrong or broken letter shapes.

- **Every Arabic letter in the charts must come from a real font**, laid out in HTML/SVG and rendered to PNG with a headless browser (Playwright is available).
- You may use your image tool **only** for a decorative background or frame, with **no** letters, text or numbers in it.
- Use OFL fonts from Google Fonts only, and record the name and licence of each one. Suggested:
  - **Kufic** (old angular style): `Reem Kufi`, plus `Kufam` or `Noto Kufi Arabic` as a second Kufic look
  - **Naskh** (everyday book and Quran-print style): `Amiri` or `Noto Naskh Arabic`
  - **Ruq'ah** (handwriting): `Aref Ruqaa`
  - If a style has no OFL font, leave it out. Do not fake it.
- Every letter must keep its normal dots. Do **not** show undotted early-Kufic forms as letters, because without dots ب ت ث look the same and that **does** change how a word is read. That is the opposite of what the owner asked for. Mention it only as a short note in the Thai text.

## Deliverables (PNG at 2× resolution, plus print-size PDF, in `output/kufic/`)
1. **`chart-28-letters.png`**: all 28 letters in alphabet order, ا to ي.
   - Each cell shows the same letter in Naskh, Kufic (two Kufic fonts if they differ clearly) and Ruq'ah.
   - Each cell also has the Thai letter name, e.g. "บาอ์", with a small label "ออกเสียงเหมือนกัน".
2. **`chart-positions.png`**: positional forms (isolated, initial, middle, final) for about 6 letters that change shape a lot: ع ه ك ب م ي.
   - Show Naskh and Kufic side by side.
   - Thai heading: "ตำแหน่งในคำเปลี่ยนรูป แต่เสียงเหมือนเดิม".
3. **`chart-one-word.png`**: one everyday word written in every style. Use `كتاب` (book). Do not use Quran or dua text.
   - Show the Thai reading "กิตาบ" and the meaning "หนังสือ".
4. **`explanation-th.md`**: short Thai explanation for adults, 1–2 paragraphs per chart, simple language.
   - What Kufic is: an early angular style named after the city of Kufa, used in early manuscripts and decoration.
   - That the style changes the look, not the sound.
   - The note about dots.
   - **Do not invent historical dates, names or claims you cannot source.** Keep history general. If you add a historical fact, give its source in the file so Claude can check it.

## Design
- Clean, premium and readable.
- Palette: blue, turquoise, white and gold. Subtle Islamic geometric frame allowed.
- Large glyphs, good contrast, Thai text in `Noto Sans Thai Looped`.
- No people, animals, faces, emoji or music symbols.

## Self-check before reporting
- Zoom into the rendered PNGs and confirm every glyph is correct and complete: right letter, dots present, no tofu boxes, Arabic shaping and joining correct.
- Compare against the Unicode letter list.
- Save zoomed crops to `output/kufic/checks/`.

## Report (Thai)
Include:
- file list
- fonts with their licences
- anything left out and why
