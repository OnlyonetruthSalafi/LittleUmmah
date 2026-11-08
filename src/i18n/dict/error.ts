import type { Text } from "../config";

export const errorText = {
  title: { th: "อุ๊ย หน้านี้ยังเปิดไม่ได้", en: "Oops, this page cannot open yet" },
  body: { th: "ไม่เป็นไรนะ ลองอีกครั้ง หรือกลับหน้าหลักกัน", en: "It’s okay. Try again, or let’s go home." },
  retry: { th: "ลองอีกครั้ง", en: "Try again" },
  home: { th: "กลับหน้าหลัก", en: "Go home" },
  reference: { th: "รหัสสำหรับผู้ปกครองแจ้งปัญหา", en: "Reference for parents" },
} satisfies Record<string, Text>;
