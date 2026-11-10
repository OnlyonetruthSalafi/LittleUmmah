# KUFIC-2 — Chart 4: the forms of alif (alif that looks like ya)
**model `gpt-6-astra` (medium) · timeout 3600 · working folder `D:/Littleummah/output/kufic` only**

Write the report in Thai. Not website work. This continues KUFIC-1 in the same folder.
- Reuse its `source/` build, `fonts/`, design and footer exactly, so that the new sheet matches sheets 01–03.
- Do not change sheets 01–03.

## Owner's request (9 Nov 2026, verbatim)
"เพิ่ม ภาพที่ 4 การเปลี่ยน รูป ของอลิฟ ที่คล้ายยา"

In short: a fourth sheet showing the forms of alif, focusing on the alif that looks like ya.

## Content of `chart-alif.png` / `chart-alif.pdf` (A4 landscape, sheet "04")
Theme as before: **รูปต่าง เสียงเดิม** (different look, same sound). The long "อา" sound can be written in more than one way.

1. **Main comparison, in large type:**
   - ا (alif, U+0627): long "อา"
   - ى (alif maqsura, U+0649, Thai "อะลิฟมักศูเราะฮ์"): looks like ya **without dots**, also long "อา", only at the end of a word
   - ي (ya, U+064A) with its two dots: "ยาอ์", sound ย / อี, which is a **different letter**
   - Make the dots difference very visible, e.g. a small gold ring around ي's dots and a note that ى has none.
   - Show each in Naskh (Amiri), Kufic (Reem Kufi, Noto Kufi Arabic) and Ruq'ah (Aref Ruqaa).
   - If a font has no proper glyph for U+0649, leave that cell out with a note. Never fake it.
2. **Everyday word examples with ى.** Use no Quran or dua text. Show each in Naskh + one Kufic:
   - `على`: อะลา, "บน"
   - `مستشفى`: มุสตัชฟา, "โรงพยาบาล"
   - `مصطفى`: มุศฏอฟา, a man's name
   - Pair each with a word ending in ا that has the same final "อา" sound, e.g. `دنيا`: ดุนยา, "โลก". Point out that both endings sound "อา".
3. **Small alif (dagger alif, U+0670, Thai "อะลิฟเล็ก")**, written above a letter. It also gives long "อา":
   - `هٰذا`: ฮาซา, "นี่"
   - `لٰكن`: ลากิน, "แต่"
   - Show the same word also without it (`هذا`, `لكن`), and note that everyday print usually leaves it out but the sound is the same.
   - Use only fonts that support U+0670 correctly (check with HarfBuzz). Amiri does; skip Kufic if its mark sits wrongly.
4. **Short notes on the sheet** (Thai):
   - ى is not ي: no dots, and the sound is "อา", not "อี".
   - It appears only at the end of a word. When a suffix follows, it usually changes to ا, e.g. `على` + `ه` → `عليه`. Show this example **only** if you can render it correctly and cite a grammar source. Otherwise leave it out.

## Also update
- `explanation-th.md`: add a "ภาพที่ 4" section in the same style, 1–2 short paragraphs, plus sources (Unicode chart or FAQ for U+0649/U+0670, and a standard grammar reference).
  - Do not invent claims. Keep regional spelling habits out unless sourced.
- `kufic-comparison-print.pdf`: rebuild as 4 pages.
- Thai transliterations: keep them as given above, and flag in the report any you think are wrong instead of silently changing them.

## Checks
- Render the sheet with real fonts only. No AI-drawn letters.
- Zoom crops of every glyph and word go to `checks/alif-*.png`.
- Verify the codepoints: ى U+0649, ي U+064A, ٰ U+0670.
- Confirm there are no tofu boxes and that marks sit in the right place.

## Report (Thai)
Include:
- the new files
- what was left out and why
- any transliteration doubts
