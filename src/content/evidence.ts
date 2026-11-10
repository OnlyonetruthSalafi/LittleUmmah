/** Collected from existing data comments only. verified = what Claude checked, how, and when; null = not yet verified. */
export type Evidence = {
  id: string;
  kind: "quran" | "hadith" | "athar" | "scholar";
  ref: string;
  grade?: string;
  url?: string;
  translation?: string;
  note?: string;
  verified: null | { by: "claude"; date: string; how: string };
};

export const EVIDENCE: Evidence[] = [
  {
    "id": "bukhari-4563",
    "kind": "hadith",
    "ref": "บุคอรี 4563",
    "url": "https://shamela.ws/book/1681/6669",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 4563 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-3364",
    "kind": "hadith",
    "ref": "บุคอรี 3364",
    "url": "https://shamela.ws/book/1681/5226",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 3364 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-4920",
    "kind": "athar",
    "ref": "ศ่อฮีห์อัลบุคอรี 4920",
    "verified": null
  },
  {
    "id": "bukhari-3340",
    "kind": "hadith",
    "ref": "อัลบุคอรี 3340",
    "verified": null
  },
  {
    "id": "muslim-194",
    "kind": "hadith",
    "ref": "มุสลิม 194",
    "verified": null
  },
  {
    "id": "ahmad-6583",
    "kind": "hadith",
    "ref": "อะหมัด 6583",
    "verified": null,
    "grade": "อัลอัลบานีย์ว่าเศาะฮีห์"
  },
  {
    "id": "al-adab-al-mufrad-548",
    "kind": "hadith",
    "ref": "อัลอะดับอัลมุฟร็อด 548",
    "verified": null,
    "grade": "อัลอัลบานีย์ว่าเศาะฮีห์"
  },
  {
    "id": "abu-dawud-2549",
    "kind": "hadith",
    "ref": "อบูดาวูด 2549",
    "url": "https://shamela.ws/book/1726/3457",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب سنن أبي داود ت محيي الدين عبد الحميد» และหน้านั้นมีเลข 2549 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    },
    "grade": "صحيح م بجملة الهدف والحائش فقط",
    "note": "เก็บคำตัดสินทั้งสองตาม comment; อีกคำตัดสินอยู่ al-silsilah-al-sahihah-20 ไม่ตัดสินแทน"
  },
  {
    "id": "muslim-2984",
    "kind": "hadith",
    "ref": "มุสลิม 2984",
    "url": "https://shamela.ws/book/1727/7405",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح مسلم ت عبد الباقي» และหน้านั้นมีเลข 2984 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-3584",
    "kind": "hadith",
    "ref": "บุคอรี 3584",
    "url": "https://shamela.ws/book/1681/5507",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 3584 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-3472",
    "kind": "hadith",
    "ref": "บุคอรี 3472",
    "url": "https://shamela.ws/book/1681/5372",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 3472 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "muslim-1721",
    "kind": "hadith",
    "ref": "มุสลิม 1721",
    "verified": null
  },
  {
    "id": "bukhari-2078",
    "kind": "hadith",
    "ref": "บุคอรี 2078",
    "url": "https://shamela.ws/book/1681/3307",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 2078 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-6129",
    "kind": "hadith",
    "ref": "บุคอรี 6129",
    "url": "https://shamela.ws/book/1681/9176",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 6129 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "abu-dawud-2675",
    "kind": "hadith",
    "ref": "อบูดาวูด 2675",
    "url": "https://shamela.ws/book/1726/3658",
    "grade": "อัลบานีย์ตัดสินว่าเศาะฮีห์",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب سنن أبي داود ت محيي الدين عبد الحميد» และหน้านั้นมีเลข 2675 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-61",
    "kind": "hadith",
    "ref": "บุคอรี 61",
    "url": "https://shamela.ws/book/1681/116",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 61 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-72",
    "kind": "hadith",
    "ref": "บุคอรี 72",
    "url": "https://shamela.ws/book/1681/137",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 72 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-2291",
    "kind": "hadith",
    "ref": "บุคอรี 2291",
    "url": "https://shamela.ws/book/1681/3637",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 2291 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "ahmad-8587",
    "kind": "hadith",
    "ref": "มุสนัดอะห์มัด 8587",
    "url": "https://shamela.ws/book/25794/6881",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب مسند أحمد ط الرسالة» และหน้านั้นมีเลข 8587 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    },
    "grade": "حديث صحيح، وهذا إسناد حسن"
  },
  {
    "id": "bukhari-3427",
    "kind": "hadith",
    "ref": "บุคอรี 3427",
    "url": "https://shamela.ws/book/1681/5315",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 3427 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-3471",
    "kind": "hadith",
    "ref": "บุคอรี 3471",
    "url": "https://shamela.ws/book/1681/5370",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 3471 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-652",
    "kind": "hadith",
    "ref": "บุคอรี 652",
    "url": "https://shamela.ws/book/1681/1077",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 652 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "muslim-35",
    "kind": "hadith",
    "ref": "มุสลิม 35",
    "url": "https://shamela.ws/book/1727/119",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح مسلم ت عبد الباقي» และหน้านั้นมีเลข 35 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-3464",
    "kind": "hadith",
    "ref": "บุคอรี 3464",
    "url": "https://shamela.ws/book/1681/5361",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 3464 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "muslim-2567",
    "kind": "hadith",
    "ref": "มุสลิม 2567",
    "url": "https://shamela.ws/book/1727/6484",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح مسلم ت عبد الباقي» และหน้านั้นมีเลข 2567 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-2363",
    "kind": "hadith",
    "ref": "บุคอรี 2363",
    "url": "https://shamela.ws/book/1681/3751",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 2363 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-3576",
    "kind": "hadith",
    "ref": "บุคอรี 3576",
    "url": "https://shamela.ws/book/1681/5499",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 3576 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "muslim-537",
    "kind": "hadith",
    "ref": "มุสลิม 537",
    "url": "https://shamela.ws/book/1727/1146",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح مسلم ت عبد الباقي» และหน้านั้นมีเลข 537 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "muslim-8",
    "kind": "hadith",
    "ref": "มุสลิม 8",
    "url": "https://shamela.ws/book/1727/62",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح مسلم ت عبد الباقي» และหน้านั้นมีเลข 8 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-8",
    "kind": "hadith",
    "ref": "บุคอรี 8",
    "url": "https://shamela.ws/book/1681/19",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 8 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-46",
    "kind": "hadith",
    "ref": "บุคอรี 46",
    "url": "https://shamela.ws/book/1681/89",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 46 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "muslim-2996",
    "kind": "hadith",
    "ref": "มุสลิม 2996",
    "url": "https://shamela.ws/book/1727/7427",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح مسلم ت عبد الباقي» และหน้านั้นมีเลข 2996 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "muslim-2653",
    "kind": "hadith",
    "ref": "มุสลิม 2653",
    "verified": null
  },
  {
    "id": "bukhari-6324",
    "kind": "hadith",
    "ref": "บุคอรี 6324",
    "url": "https://shamela.ws/book/1681/9484",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب صحيح البخاري ط السلطانية» และหน้านั้นมีเลข 6324 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "tirmidhi-2035",
    "kind": "hadith",
    "ref": "ติรมิซีย์ 2035",
    "grade": "อัลบานีย์ตัดสินเศาะฮีห์",
    "verified": null
  },
  {
    "id": "abu-dawud-5095",
    "kind": "hadith",
    "ref": "อบูดาวูด 5095",
    "url": "https://shamela.ws/book/1726/6957",
    "grade": "อัลบานีย์: เศาะฮีห์",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب سنن أبي داود ت محيي الدين عبد الحميد» และหน้านั้นมีเลข 5095 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "tirmidhi-3426",
    "kind": "hadith",
    "ref": "ติรมิซีย์ 3426",
    "url": "https://shamela.ws/book/1435/5650",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب سنن الترمذي ت شاكر» และหน้านั้นมีเลข 3426 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "abu-dawud-4023",
    "kind": "hadith",
    "ref": "อบูดาวูด 4023",
    "url": "https://shamela.ws/book/1726/5556",
    "grade": "อัลบานีย์: หะซัน",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب سنن أبي داود ت محيي الدين عبد الحميد» และหน้านั้นมีเลข 4023 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-6224",
    "kind": "hadith",
    "ref": "บุคอรี 6224",
    "verified": null
  },
  {
    "id": "bukhari-6245",
    "kind": "hadith",
    "ref": "บุคอรี 6245",
    "verified": null
  },
  {
    "id": "bukhari-6116",
    "kind": "hadith",
    "ref": "บุคอรี 6116, 6115",
    "verified": null
  },
  {
    "id": "bukhari-6115",
    "kind": "hadith",
    "ref": "บุคอรี 6116, 6115",
    "verified": null
  },
  {
    "id": "abu-dawud-4782",
    "kind": "hadith",
    "ref": "อบูดาวูด 4782",
    "grade": "อัลบานีย์: เศาะฮีห์",
    "verified": null
  },
  {
    "id": "al-silsilah-al-sahihah-20",
    "kind": "hadith",
    "ref": "อัสสิลสิละฮ์ อัศเศาะฮีหะฮ์ ข้อ 20",
    "url": "https://shamela.ws/book/9442/58",
    "grade": "صحيح على شرط مسلم",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «كتاب سلسلة الأحاديث الصحيحة وشيء من فقهها وفوائدها» และหน้านั้นมีเลข 20 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "bukhari-1498",
    "kind": "hadith",
    "ref": "รายงานแบบสั้นอยู่ใน 1498 ด้วย",
    "note": "comment ต่อจากบุคอรี 2291; ไม่มีลิงก์แยก",
    "verified": null
  },
  {
    "id": "al-silsilah-al-sahihah-134",
    "kind": "hadith",
    "ref": "อัสสิลสิละฮ์อัศเศาะฮีหะฮ์ 134",
    "grade": "อัลอัลบานีย์ว่าเศาะฮีห์",
    "note": "comment ให้เจ้าของโปรเจกต์ตรวจเลขอ้างอิงก่อน commit",
    "verified": null
  },
  {
    "id": "quran-an-naml-15",
    "kind": "quran",
    "ref": "อันนัมล์ 15",
    "url": "https://shamela.ws/book/8473/3086",
    "verified": null
  },
  {
    "id": "quran-an-naml-16",
    "kind": "quran",
    "ref": "อันนัมล์ 16",
    "url": "https://shamela.ws/book/8473/3086",
    "verified": null
  },
  {
    "id": "quran-an-naml-17",
    "kind": "quran",
    "ref": "อันนัมล์ 17",
    "url": "https://shamela.ws/book/8473/3086",
    "verified": null
  },
  {
    "id": "quran-an-naml-18",
    "kind": "quran",
    "ref": "อันนัมล์ 18",
    "url": "https://shamela.ws/book/8473/3086",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-an-naml-19",
    "kind": "quran",
    "ref": "อันนัมล์ 19",
    "url": "https://shamela.ws/book/8473/3086",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ต่างเฉพาะคำพิมพ์ผิดในต้นฉบับที่แก้แล้ว (ข้อ 1.6) หรือ ฮฺ/ฮ์ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-al-kahf-9-26",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟ์ 9-26",
    "url": "https://shamela.ws/book/8473/2548",
    "note": "comment ระบุช่วงหน้า ถึง /2560; ไม่ขยายลิงก์ย่อ",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-68-17-33",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:17–33",
    "url": "https://shamela.ws/book/8473/4241",
    "translation": "Quran.com Thai 51 / Saheeh International 20",
    "verified": null
  },
  {
    "id": "quran-18-32-44",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:32–44",
    "url": "https://shamela.ws/book/8473/2567",
    "translation": "Quran.com Thai 51 / Saheeh International 20",
    "note": "comment ระบุ /2568 (37–41), /2570 (42–44); ไม่ขยายลิงก์ย่อ",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-52-53",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 52-53",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-56",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 56",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-57-58",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 57-58",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-59-65",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 59-65",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-66",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 66",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-68",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 68",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-69",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 69",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-as-saffat-97",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 97",
    "url": "https://shamela.ws/book/8473/2757",
    "note": "comment รวมลิงก์ตัฟซีร ถึง /2760, /3522; ไม่จัดหน้าให้แต่ละอายะฮ์เอง",
    "verified": null
  },
  {
    "id": "quran-ibrahim-37",
    "kind": "quran",
    "ref": "อิบรอฮีม 37",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    },
    "url": "https://shamela.ws/book/8473/2312"
  },
  {
    "id": "quran-al-baqarah-127",
    "kind": "quran",
    "ref": "อัลบะเกาะเราะฮ์ 127",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-al-baqarah-144",
    "kind": "quran",
    "ref": "อัลบะเกาะเราะฮ์ 144",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-70",
    "kind": "quran",
    "ref": "(70)",
    "note": "เลขในวงเล็บต่อจาก อัลอัมบิยาอ์ 69 ใน comment บรรทัดเดียวกัน; ไม่เติมเลขซูเราะฮ์",
    "verified": null
  },
  {
    "id": "quran-al-qasas-4",
    "kind": "quran",
    "ref": "อัลเกาะศ็อศ 4",
    "verified": null
  },
  {
    "id": "quran-an-naziat-24",
    "kind": "quran",
    "ref": "อันนาซิอาต 24",
    "verified": null
  },
  {
    "id": "quran-ta-ha-29-30-47",
    "kind": "quran",
    "ref": "ฏอฮา 29-30, 47",
    "verified": null
  },
  {
    "id": "quran-ash-shuara-52",
    "kind": "quran",
    "ref": "อัชชุอะรออ์ 52",
    "verified": null
  },
  {
    "id": "quran-ash-shuara-53-56",
    "kind": "quran",
    "ref": "อัชชุอะรออ์ 53-56",
    "verified": null
  },
  {
    "id": "quran-ash-shuara-60-62",
    "kind": "quran",
    "ref": "อัชชุอะรออ์ 60-62",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ต่างเฉพาะคำพิมพ์ผิดในต้นฉบับที่แก้แล้ว (ข้อ 1.6) หรือ ฮฺ/ฮ์ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-ash-shuara-63",
    "kind": "quran",
    "ref": "อัชชุอะรออ์ 63",
    "verified": null
  },
  {
    "id": "quran-ash-shuara-64-66",
    "kind": "quran",
    "ref": "อัชชุอะรออ์ 64-66",
    "verified": null
  },
  {
    "id": "quran-ta-ha-77",
    "kind": "quran",
    "ref": "ฏอฮา 77",
    "verified": null
  },
  {
    "id": "quran-ta-ha-78",
    "kind": "quran",
    "ref": "ฏอฮา 78",
    "verified": null
  },
  {
    "id": "quran-yunus-90-92",
    "kind": "quran",
    "ref": "ยูนุส 90-92",
    "verified": null
  },
  {
    "id": "quran-at-talaq-2",
    "kind": "quran",
    "ref": "อัฏฏอลาก 2",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ต่างเฉพาะคำพิมพ์ผิดในต้นฉบับที่แก้แล้ว (ข้อ 1.6) หรือ ฮฺ/ฮ์ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-as-saffat-139",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 139",
    "verified": null
  },
  {
    "id": "quran-as-saffat-140",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 140",
    "verified": null
  },
  {
    "id": "quran-as-saffat-141",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 141",
    "verified": null
  },
  {
    "id": "quran-as-saffat-142",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 142",
    "verified": null
  },
  {
    "id": "quran-as-saffat-143-144",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 143-144",
    "verified": null
  },
  {
    "id": "quran-as-saffat-145-146",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 145-146",
    "verified": null
  },
  {
    "id": "quran-as-saffat-147-148",
    "kind": "quran",
    "ref": "อัศศ็อฟฟาต 147-148",
    "verified": null
  },
  {
    "id": "quran-yunus-98",
    "kind": "quran",
    "ref": "ยูนุส 98",
    "verified": null
  },
  {
    "id": "quran-al-anbiya-87",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 87",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ต่างเฉพาะคำพิมพ์ผิดในต้นฉบับที่แก้แล้ว (ข้อ 1.6) หรือ ฮฺ/ฮ์ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-al-anbiya-88",
    "kind": "quran",
    "ref": "อัลอัมบิยาอ์ 88",
    "verified": null
  },
  {
    "id": "quran-yusuf",
    "kind": "quran",
    "ref": "ซูเราะฮ์ยูซุฟ",
    "url": "https://shamela.ws/book/8473/2168",
    "note": "เนื้อหามาจากอัลกุรอานเท่านั้น (ซูเราะฮ์ยูซุฟ ตรวจกับ Shamela 7 ต.ค. 2026 ตัฟซีรอิบนุ กะษีร https://shamela.ws/book/8473/2168 ถึง /2210)\n  - ความฝัน ดาว 11 ดวง ดวงอาทิตย์ ดวงจันทร์ กราบท่าน (4) / พ่อบอกอย่าเล่าให้พี่ๆ ฟัง (5)\n  - พี่ๆ อิจฉาเพราะพ่อรักท่าน (8) พาออกไปแล้วตกลงกันโยนลงก้นบ่อ อัลลอฮ์ทรงบอกท่านว่าสักวันจะได้บอกพวกเขาถึงสิ่งนี้ (15)\n  - ค่ำนั้นกลับมาร้องไห้ บอกว่าหมาป่ากินเขา พ่อกล่าว «فصبر جميل» (16-18)\n  - คาราวานหย่อนถังพบท่าน แล้วท่านถูกขายในราคาถูก (19-20) ไปอยู่อียิปต์ (21)\n  - ถูกขังในคุกหลายปี (42 «بضع سنين») ทั้งที่ไม่ได้ทำผิด (51 «ما علمنا عليه من سوء»)\n  - ความฝันของกษัตริย์ วัวอ้วน 7 วัวผอม 7 รวงเขียว 7 รวงแห้ง 7 (43) ท่านตีความ ปลูก 7 ปีเก็บไว้ในรวง แล้วแห้งแล้ง 7 ปี (46-49)\n  - กษัตริย์ให้ดูแลคลังของแผ่นดิน \"ฉันรักษาได้ดีและมีความรู้\" (54-55)\n  - พี่ๆ มา ท่านจำได้ พวกเขาจำไม่ได้ (58) / \"ฉันคือยูซุฟ\" ... \"ผู้ใดยำเกรงและอดทน อัลลอฮ์ไม่ทำให้รางวัลของผู้ทำดีสูญเปล่า\" (90)\n  - พี่ๆ ยอมรับผิด (91) «لا تثريب عليكم اليوم يغفر الله لكم» (92)\n  - ครอบครัวมาอียิปต์ ความฝันเป็นจริง \"พระเจ้าของฉันทรงดีต่อฉัน\" (99-100)",
    "verified": null
  },
  {
    "id": "quran-68-17-18",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:17–18",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-68-19-20",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:19–20",
    "verified": null
  },
  {
    "id": "quran-68-21-25",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:21–25",
    "verified": null
  },
  {
    "id": "quran-68-26-27",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:26–27",
    "verified": null
  },
  {
    "id": "quran-68-28-29",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:28–29",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-68-30-31",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:30–31",
    "verified": null
  },
  {
    "id": "quran-68-32",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:32",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-68-33",
    "kind": "quran",
    "ref": "อัลก็อลัม 68:33",
    "verified": null
  },
  {
    "id": "quran-18-32-33",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:32–33",
    "verified": null
  },
  {
    "id": "quran-18-34",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:34",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-18-35-36",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:35–36",
    "verified": null
  },
  {
    "id": "quran-18-37",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:37",
    "verified": null
  },
  {
    "id": "quran-18-38",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:38",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-18-39",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:39",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-18-40-41",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:40–41",
    "verified": null
  },
  {
    "id": "quran-18-42",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:42",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-18-43-44",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:43–44",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-18-34-38-39-42-44",
    "kind": "quran",
    "ref": "อัลกะฮ์ฟิ 18:34,38–39,42–44",
    "verified": null
  },
  {
    "id": "scholar-thalathat-al-usul-9",
    "kind": "scholar",
    "ref": "ثلاثة الأصول หน้า 9",
    "url": "https://shamela.ws/book/239/9",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «الأصل الأول معرفة الرب» และหน้านั้นมีเลข 9 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "scholar-thalathat-al-usul-14",
    "kind": "scholar",
    "ref": "ثلاثة الأصول หน้า 14",
    "url": "https://shamela.ws/book/239/14",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «الأصل الثاني معرفة دين الإسلام بالأدلة» และหน้านั้นมีเลข 14 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "scholar-thalathat-al-usul-10",
    "kind": "scholar",
    "ref": "ثلاثة الأصول หน้า 10",
    "url": "https://shamela.ws/book/239/10",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "ลิงก์ Shamela เปิดได้ เป็นหนังสือ «أنواع العبادة التي أمر الله بها» และหน้านั้นมีเลข 10 ตรงกับที่อ้าง — ตรวจการอ้างอิง ไม่ใช่การตรวจถ้อยคำในนิทานซ้ำ"
    }
  },
  {
    "id": "quran-20-5",
    "kind": "quran",
    "ref": "20:5",
    "verified": null,
    "translation": "quran.com id 51"
  },
  {
    "id": "quran-42-11",
    "kind": "quran",
    "ref": "42:11",
    "verified": null,
    "translation": "quran.com id 51"
  },
  {
    "id": "quran-39-62",
    "kind": "quran",
    "ref": "39:62",
    "verified": null
  },
  {
    "id": "quran-41-37",
    "kind": "quran",
    "ref": "41:37",
    "verified": null
  },
  {
    "id": "quran-40-60",
    "kind": "quran",
    "ref": "40:60",
    "verified": null
  },
  {
    "id": "quran-20-46",
    "kind": "quran",
    "ref": "20:46",
    "verified": null
  },
  {
    "id": "quran-48-29",
    "kind": "quran",
    "ref": "48:29",
    "verified": null
  },
  {
    "id": "quran-67-16",
    "kind": "quran",
    "ref": "67:16",
    "verified": null
  },
  {
    "id": "quran-16-50",
    "kind": "quran",
    "ref": "16:50",
    "verified": null
  },
  {
    "id": "quran-81-29",
    "kind": "quran",
    "ref": "81:29",
    "verified": null
  },
  {
    "id": "quran-39-7",
    "kind": "quran",
    "ref": "39:7",
    "verified": null
  },
  {
    "id": "quran-24-27",
    "kind": "quran",
    "ref": "อันนูร 24:27",
    "verified": null
  },
  {
    "id": "quran-88-17",
    "kind": "quran",
    "ref": "อัลฆอชิยะฮ์ 88:17",
    "url": "https://shamela.ws/book/8473/4432",
    "verified": null
  },
  {
    "id": "quran-6-38",
    "kind": "quran",
    "ref": "อัลอันอาม 6:38",
    "url": "https://shamela.ws/book/8473/1518",
    "verified": null
  },
  {
    "id": "quran-24-45",
    "kind": "quran",
    "ref": "อันนูร 24:45",
    "url": "https://shamela.ws/book/8473/2979",
    "verified": null
  },
  {
    "id": "quran-11-41",
    "kind": "quran",
    "ref": "ฮูด 11:41",
    "translation": "quran.com id 51",
    "note": "Claude เพิ่มเลขอายะฮ์ (comment เดิมระบุแค่ชื่อซูเราะฮ์) ใช้ที่ nuh.ts p06",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-12-18",
    "kind": "quran",
    "ref": "ยูซุฟ 12:18",
    "translation": "quran.com id 51",
    "note": "Claude เพิ่มเลขอายะฮ์ (comment เดิมระบุแค่ชื่อซูเราะฮ์) ใช้ที่ yusuf.ts p05",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-12-92",
    "kind": "quran",
    "ref": "ยูซุฟ 12:92",
    "translation": "quran.com id 51",
    "note": "Claude เพิ่มเลขอายะฮ์ (comment เดิมระบุแค่ชื่อซูเราะฮ์) ใช้ที่ yusuf.ts p12",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  },
  {
    "id": "quran-3-173",
    "kind": "quran",
    "ref": "อาลิอิมรอน 3:173",
    "translation": "quran.com id 51",
    "note": "Claude เพิ่ม: คำแปล «حسبنا الله ونعم الوكيل» ที่ ibrahim-fire p07 มาจากอายะฮ์นี้; บุคอรี 4563 รายงานว่าท่านนบีอิบรอฮีมกล่าวประโยคนี้",
    "verified": {
      "by": "claude",
      "date": "2026-11-11",
      "how": "meaning ภาษาไทยในหน้าที่อ้างรายการนี้ตรงกับคำแปล quran.com id 51 — ตรงทุกคำ (ตรวจด้วย output/evid-1/claude-verify-quran.json)"
    }
  }
];
