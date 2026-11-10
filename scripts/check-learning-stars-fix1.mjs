// LS-2-fix1 (Claude): จุดที่ Codex review ทัก — ป้ายดาวดวงสุดท้ายไม่ค้างข้ามรอบ, เกมความจำเส้นทางเก่า (/learn/games/memory/easy)
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const base = process.argv[2] || 'http://localhost:3160';
const out = 'output/ls-2/shots/fix1'; await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
let n = 0; const check = (label, ok) => { assert.ok(ok, label); n++; console.log('PASS', label); };
const today = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; })();
const seed = (page, balance) => page.evaluate(([balance, today]) => {
  localStorage.setItem('little-ummah:sound', 'off');
  localStorage.setItem('lu-settings', JSON.stringify({ starsEnabled: true, timeEnabled: false, minutes: 30, seeded: true }));
  localStorage.setItem('lu-ls-stars', JSON.stringify({ balance, earnedDay: today, earned: [], activeRound: false, freeDay: today }));
}, [balance, today]);
try {
  for (const [w, h] of [[390, 844], [1280, 720]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 1000, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(base + '/parents'); await seed(page, 1);
    // GameShell: ใช้ดาวดวงสุดท้าย → ป้าย; กลับหน้าเลือกด่านแล้วเริ่มใหม่ด้วยเครดิตเดิม → ป้ายยังอยู่
    await page.goto(base + '/games/memory'); await page.locator('.gc-adventure-start').click(); await page.waitForTimeout(4500);
    check(`${w}: last-star badge shows`, await page.locator('[data-ls-last]').isVisible());
    await page.locator('.gc-bottom-controls button').first().click(); await page.locator('.gc-adventure-start').click(); await page.waitForTimeout(4500);
    check(`${w}: badge stays when restarting on the same credit`, await page.locator('[data-ls-last]').isVisible());
    // ให้ดาวเพิ่มจากแท็บอื่น (storage event) แล้วเริ่มด่านใหม่ด้วยดาวที่ไม่ใช่ดวงสุดท้าย → ป้ายต้องหาย
    await page.evaluate(today => { localStorage.setItem('lu-ls-stars', JSON.stringify({ balance: 3, earnedDay: today, earned: [], activeRound: false, freeDay: today })); window.dispatchEvent(new StorageEvent('storage', { key: 'lu-ls-stars' })); }, today);
    await page.locator('.gc-bottom-controls button').last().click(); await page.waitForTimeout(4500);
    check(`${w}: badge cleared after a non-last star round`, await page.locator('[data-ls-last]').count() === 0);
    // เส้นทางเก่า: ป้ายระหว่างเล่น + หน้าชนะเมื่อดาวหมด
    await seed(page, 1); await page.goto(base + '/learn/games/memory/easy');
    await page.getByRole('button', { name: /เริ่ม/ }).first().click(); await page.waitForTimeout(300);
    check(`${w}: legacy memory shows last-star badge`, await page.locator('[data-ls-last]').isVisible());
    await page.screenshot({ path: `${out}/legacy-last-${w}x${h}.png` });
    // เปิดทีละใบเทียบกับใบอื่นจนเจอคู่ (ไม่รู้ภาพล่วงหน้า) ทำซ้ำจนชนะ
    for (let guard = 0; guard < 60 && !(await page.locator('[data-ls-out]').count()); guard++) {
      const labels = await page.locator('section [aria-pressed]').evaluateAll(els => els.map(e => e.getAttribute('aria-label')));
      const open = labels.map((l, i) => /จับคู่แล้ว|matched/i.test(l) ? -1 : i).filter(i => i >= 0);
      if (open.length < 2) { await page.waitForTimeout(500); continue; }
      const cards = page.locator('section [aria-pressed]');
      await cards.nth(open[0]).click(); await page.waitForTimeout(150);
      const name = (await cards.nth(open[0]).getAttribute('aria-label')).split(',')[1];
      let done = false;
      for (const j of open.slice(1)) {
        await cards.nth(j).click(); await page.waitForTimeout(150);
        if ((await cards.nth(j).getAttribute('aria-label')).split(',')[1] === name) { await page.waitForTimeout(1100); done = true; break; }
        await page.waitForTimeout(1100); await cards.nth(open[0]).click(); await page.waitForTimeout(150);
      }
      if (!done) await page.waitForTimeout(1100);
    }
    await page.locator('[data-ls-out]').waitFor({ timeout: 8000 });
    check(`${w}: legacy memory win without stars shows go-learn panel, no play-again`, await page.locator('[data-ls-out] .ls-learn-tile').count() === 4 && await page.getByText('มาเล่นกันอีกนะ').count() === 0 && await page.getByRole('button', { name: /เล่นอีกครั้ง/ }).count() === 0);
    await page.screenshot({ path: `${out}/legacy-out-${w}x${h}.png`, fullPage: true });
    await ctx.close();
  }
  console.log('ALL PASS', n);
} finally { await browser.close(); }
