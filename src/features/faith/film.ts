import type { Film } from "@/features/moral/film";

// Source: https://shamela.ws/book/239/9 (Quran 41:37); verified via official Shamela MCP.
// Script: docs/films/faith-rabbi-script.txt. Educational explanation, not a verbatim Quran translation.
export const FILMS: Record<string, Film> = {
  "faith-rabbi": {
  "name": "faith-rabbi-v1",
  "dir": "faith/film",
  "duration": 217.16666666666666,
  "turns": [
    {
      "at": 175.59224500000002,
      "resumeAt": 185,
      "word": {
        "instruction": { "th": "ลองตอบออกเสียงว่า ใครคือพระเจ้าของหนู? ครูจะรอจนหนูกดปุ่ม", "en": "Answer aloud: Who is your Lord? Nuri will wait until you press the button." },
        "ar": "",
        "th": "ใครคือพระเจ้าของหนู?",
        "prompt": {
          "th": "ใครคือพระเจ้าของหนู?",
          "en": "Who is your Lord?"
        }
      }
    }
  ],
  "words": [
    {
      "ar": "",
      "th": "พระเจ้าของหนูคืออัลลอฮ์",
      "prompt": {
        "th": "พระเจ้าของหนูคืออัลลอฮ์",
        "en": "My Lord is Allah."
      }
    }
  ],
  "captions": [
    "th"
  ],
  "resolutions": [
    720
  ],
  "captionCrop": {
    "width": 1280,
    "height": 636
  },
  "label": {
    "th": "ครูนูรีพาชมกลางวัน กลางคืน ดวงดาว และภาพจำลองโลก ก่อนหยุดให้เด็กตอบว่าใครคือพระเจ้าของหนู",
    "en": "Nuri explores day, night, stars and a model of Earth, then pauses for children to answer: Who is your Lord?"
  }
}
};
