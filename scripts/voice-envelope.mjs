/*
  ดูจังหวะพยางค์ในไฟล์เสียงพูด เพื่อหาจุดตัดต่อ

  ใช้ตอนต้องสลับคำในเสียงพากย์ที่อัดไว้แล้ว เช่นคำที่ ElevenLabs อ่านผิด
  คนตัดสินว่าได้ยินอะไรคือเจ้าของโปรเจกต์เสมอ สคริปต์นี้แค่ช่วยจำกัดจุดที่ต้องลองฟัง
  ให้เหลือไม่กี่จุด แทนที่จะไล่ทีละ 10 มิลลิวินาที

  วิธีอ่านผล
    พิมพ์ความดัง (RMS) ทุก 10 มิลลิวินาที เป็นแถบ
    ช่วงที่ความดังตกลงต่ำคือรอยต่อระหว่างพยางค์ — จุดตัดที่ดีอยู่ตรงนั้น
    ท้ายผลสรุป "จุดตัดที่น่าลอง" ให้อัตโนมัติ เรียงจากรอยต่อที่ลึกที่สุด

  วิธีใช้
    FFMPEG=<path ของ ffmpeg.exe> node scripts/voice-envelope.mjs <ไฟล์.mp3> [วินาทีที่ดูถึง]
*/

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { decodeWav } from "./lib/wav.mjs";

const WINDOW_SEC = 0.01;

/** ถอดเป็น PCM โมโน 16k แล้วคืนความดังทุก 10 มิลลิวินาที */
export function envelope(file, seconds) {
  const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
  const dir = mkdtempSync(path.join(tmpdir(), "voice-env-"));
  const wav = path.join(dir, "probe.wav");
  try {
    const args = ["-y", "-i", file];
    if (seconds) args.push("-t", String(seconds));
    execFileSync(ffmpeg, [...args, "-ac", "1", "-ar", "16000", "-f", "wav", wav], { stdio: "ignore" });
    const { rate, samples } = decodeWav(readFileSync(wav));
    const win = Math.round(rate * WINDOW_SEC);
    const rms = [];
    for (let i = 0; i + win <= samples.length; i += win) {
      let sum = 0;
      for (let j = i; j < i + win; j++) sum += samples[j] * samples[j];
      rms.push(Math.sqrt(sum / win));
    }
    const peak = Math.max(...rms, 1e-9);
    return rms.map(v => v / peak);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/*
  รอยต่อพยางค์ = จุดต่ำสุดเฉพาะถิ่นที่ความดังตกลงต่ำกว่าเพื่อนบ้านทั้งสองข้างชัดเจน
  คืนเวลาเป็นวินาที เรียงจากรอยที่ลึกที่สุด (ตัดตรงนั้นแล้วเสียงสะดุดน้อยที่สุด)
*/
export function syllableBreaks(levels, { minGapSec = 0.06, maxResults = 12 } = {}) {
  const found = [];
  for (let i = 1; i < levels.length - 1; i++) {
    if (levels[i] > levels[i - 1] || levels[i] > levels[i + 1]) continue;
    // ความชัดของรอย = ยอดที่สูงที่สุดรอบๆ เทียบกับก้นรอย
    const from = Math.max(0, i - 12), to = Math.min(levels.length, i + 13);
    const around = Math.max(...levels.slice(from, to));
    found.push({ time: i * WINDOW_SEC, level: levels[i], depth: around - levels[i] });
  }
  found.sort((a, b) => b.depth - a.depth);
  const picked = [];
  for (const point of found) {
    if (picked.some(other => Math.abs(other.time - point.time) < minGapSec)) continue;
    picked.push(point);
    if (picked.length >= maxResults) break;
  }
  return picked;
}

if (import.meta.filename === process.argv[1]) {
  const [file, seconds] = process.argv.slice(2);
  if (!file) throw new Error("ใส่ชื่อไฟล์เสียงด้วย");
  const levels = envelope(file, seconds ? Number(seconds) : undefined);
  levels.forEach((value, i) => {
    const bar = "#".repeat(Math.round(value * 60));
    console.log(`${(i * WINDOW_SEC).toFixed(2)}  ${(value * 100).toFixed(0).padStart(3)}  ${bar}`);
  });
  console.log(`\nยาว ${(levels.length * WINDOW_SEC).toFixed(2)} วินาที`);
  console.log("\nจุดตัดที่น่าลอง (ลึกที่สุดก่อน):");
  for (const point of syllableBreaks(levels)) {
    console.log(`  ${point.time.toFixed(3)} วิ   ความดัง ${(point.level * 100).toFixed(0)}%   ความชัดของรอย ${(point.depth * 100).toFixed(0)}`);
  }
}
