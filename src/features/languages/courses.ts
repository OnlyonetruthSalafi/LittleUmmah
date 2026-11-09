import type { Locale } from "@/i18n/config";
import { CLASS_UNITS, type AgeGroupId, type ClassUnit } from "../arabic/data/classroom.ts";
import { ENGLISH_UNITS } from "./data/english.ts";
import { THAI_UNITS } from "./data/thai.ts";

export type RoomId = "arabic" | "english" | "thai";
export type Course = {
  id: RoomId;
  lang: "ar" | "en" | "th";
  dir: "rtl" | "ltr";
  fontClass: string;
  units: Record<AgeGroupId, ClassUnit[]>;
  audioFolder: string;
  sharedAudioFolder: string;
  progressKey: string;
  /** Selects room strings in both locale dictionaries. */
  dictionaryKey: RoomId;
};

export const COURSES: Record<RoomId, Course> = {
  arabic: { id: "arabic", lang: "ar", dir: "rtl", fontClass: "language-naskh", units: CLASS_UNITS, audioFolder: "/audio/th/class", sharedAudioFolder: "/audio/th/class", progressKey: "lu-arabic-learned-v1", dictionaryKey: "arabic" },
  english: { id: "english", lang: "en", dir: "ltr", fontClass: "font-display", units: ENGLISH_UNITS, audioFolder: "/audio/th/class/en", sharedAudioFolder: "/audio/th/class", progressKey: "lu-english-learned-v1", dictionaryKey: "english" },
  thai: { id: "thai", lang: "th", dir: "ltr", fontClass: "font-body", units: THAI_UNITS, audioFolder: "/audio/th/class/th", sharedAudioFolder: "/audio/th/class", progressKey: "lu-thai-learned-v1", dictionaryKey: "thai" },
};

export function isRoom(room: string): room is RoomId {
  return Object.hasOwn(COURSES, room);
}

export function courseAudio(course: Course, locale: Locale, key: string) {
  const folder = key === "done" || /^cheer-\d+$/.test(key) ? course.sharedAudioFolder : course.audioFolder;
  // Preserve the Arabic room's locale-dependent paths, including /en.
  return `${folder.replace("/audio/th/", `/audio/${locale}/`)}/${key}.mp3`;
}
