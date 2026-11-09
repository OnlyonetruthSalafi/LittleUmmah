// ตรวจหน้าเว็บบนโปรไฟล์ iPad ด้วย WebKit (เครื่องยนต์ตระกูลเดียวกับ Safari) — เจ้าของโปรเจกต์ขอ 9 พ.ย. 2026
//
// ใช้ได้บน Windows ไม่ต้องมี Mac แต่ไม่ใช่ Safari บน iOS 100%:
// แถบที่อยู่ที่หดขยาย, safe area, กฎเล่นเสียงของ iOS และความลื่นบนเครื่องเก่า ยังต้องลองบน iPad จริง
//
// เปิด server ก่อน แล้ว:
//   PLAYWRIGHT_MODULE=<path ของ playwright-core/index.mjs> node scripts/check-ipad-webkit.mjs [baseUrl]
//     --device=<ชื่อบางส่วน>   เช่น --device=mini (ไม่ใส่ = ทุกรุ่นในรายการ DEVICES)
//     --path=<ขึ้นต้นด้วย>     เช่น --path=learn/stories (ไม่ใส่ = ทุกหน้าใน sitemap ภาษาไทย)
//     --portrait / --landscape  เลือกแนวเดียว
// ครั้งแรกต้องดาวน์โหลด WebKit: node <playwright-core>/cli.js install webkit
//
// ตรวจ: error ใน JS, console error, หน้าเลื่อนแนวนอน (ล้นจอ), ปุ่ม/ลิงก์ที่เล็กกว่า 64px (แจ้งเตือน ไม่นับเป็น fail
// เพราะมีข้อยกเว้นที่เจ้าของโปรเจกต์อนุมัติแล้วใน AGENTS.md ข้อ 2) แล้วถ่ายภาพทุกหน้าไว้ที่ output/ipad/

import fs from "node:fs";
import path from "node:path";

const { webkit, devices } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const base = (args.find((a) => !a.startsWith("--")) ?? process.env.BASE_URL ?? "http://localhost:3200").replace(/\/+$/, "");
const out = process.env.IPAD_CHECK_OUT ?? "output/ipad";

/* iPad ที่เด็กใช้บ่อย: จอเล็กสุด (Mini), รุ่นธรรมดา และรุ่น Pro — โปรไฟล์ของ Playwright มีขนาดจอ, DPR, user agent และการแตะ */
const DEVICES = ["iPad Mini", "iPad (gen 7)", "iPad (gen 11)", "iPad Pro 11"];

const orientations = args.includes("--portrait") ? ["portrait"] : args.includes("--landscape") ? ["landscape"] : ["portrait", "landscape"];
const deviceFilter = flag("device")?.toLowerCase();
// ใส่ได้ทั้ง "/learn/stories" และ "learn/stories" (Git Bash แปลงอาร์กิวเมนต์ที่ขึ้นต้นด้วย / เป็น path ของ Windows จึงควรใช้แบบไม่มี /)
const rawPath = flag("path");
const pathFilter = rawPath && "/" + rawPath.replace(/^.*?\/?(?=learn|games|kids|juniors|parents)/, "").replace(/^\//, "");

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p) => !p.startsWith("/en"))
  .filter((p) => !pathFilter || p.startsWith(pathFilter));
if (!routes.length) throw new Error(`ไม่พบหน้าใน ${base}/sitemap.xml`);

const chosen = DEVICES.filter((d) => !deviceFilter || d.toLowerCase().includes(deviceFilter));
if (!chosen.length) throw new Error(`--device=${deviceFilter} ไม่ตรงรุ่นใดใน ${DEVICES.join(", ")}`);

const browser = await webkit.launch();
const results = [];

for (const name of chosen) {
  for (const orient of orientations) {
    const profile = devices[orient === "landscape" ? `${name} landscape` : name];
    if (!profile) throw new Error(`ไม่มีโปรไฟล์ ${name} ${orient}`);
    const folder = path.join(out, `${name.replace(/[^\w]+/g, "-").replace(/-+$/, "").toLowerCase()}-${orient}`);
    fs.mkdirSync(folder, { recursive: true });
    const context = await browser.newContext({ ...profile });

    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
      try {
        await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });
      } catch (e) {
        errors.push(`goto: ${e.message.split("\n")[0]}`);
      }
      await page.waitForTimeout(700);
      const m = await page.evaluate(() => {
        const vw = window.innerWidth;
        const overflowX = document.documentElement.scrollWidth - vw;
        const small = [];
        for (const el of document.querySelectorAll("a[href], button:not([disabled]), [role=button]")) {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (!r.width || !r.height || cs.visibility === "hidden" || el.closest("[aria-hidden=true], footer, .sr-only")) continue;
          if (r.width < 64 || r.height < 64) small.push(`${(el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 30)} ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
        return { vw, vh: window.innerHeight, overflowX, small };
      });
      const file = `${route === "/" ? "home" : route.slice(1).replace(/\//g, "_")}.png`;
      await page.screenshot({ path: path.join(folder, file) });
      const fail = errors.length > 0 || m.overflowX > 1;
      results.push({ device: `${name} ${orient}`, route, size: `${m.vw}×${m.vh}`, overflowX: m.overflowX, errors, small: m.small, fail });
      console.log(`${fail ? "FAIL" : "ok  "} ${name} ${orient} ${m.vw}×${m.vh} ${route}${m.overflowX > 1 ? ` ล้นแนวนอน ${m.overflowX}px` : ""}${errors.length ? ` ${errors.length} error` : ""}${m.small.length ? ` (ปุ่มเล็กกว่า 64px ${m.small.length})` : ""}`);
      await page.close();
    }
    await context.close();
  }
}
await browser.close();

fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(results, null, 2));
const failed = results.filter((r) => r.fail);
console.log(`\nตรวจ ${results.length} หน้าจอ ผ่าน ${results.length - failed.length} ไม่ผ่าน ${failed.length} — ภาพและ report.json อยู่ที่ ${out}/`);
for (const f of failed) console.log(`- ${f.device} ${f.route}: ${[f.overflowX > 1 ? `ล้นแนวนอน ${f.overflowX}px` : "", ...f.errors].filter(Boolean).join(" | ")}`);
if (!results.length) console.log("ไม่ได้ตรวจสักหน้าจอ — นับเป็นไม่ผ่าน");
process.exit(failed.length || !results.length ? 1 : 0);
