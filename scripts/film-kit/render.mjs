import { chromium, chromePath } from './lib/playwright.mjs';
import { filmRoot } from './lib/common.mjs';
import { readFileSync, mkdirSync, createWriteStream, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { once } from 'node:events';
const root = filmRoot(), timing = JSON.parse(readFileSync(`${root}/timing.json`));
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : process.argv[i + 1]; };
const browser = await chromium.launch({ executablePath: chromePath, headless: true, args: ['--allow-file-access-from-files'] });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } }), errors = [];
  page.on('pageerror', (e) => errors.push(e.message)); page.on('requestfailed', (r) => errors.push('failed ' + r.url())); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(pathToFileURL(`${root}/${arg('page', 'stage.html')}`).href);
  await page.evaluate(() => window.ready).catch((e) => { throw Error(e.message + '\n' + errors.join('\n')); });
  const total = await page.evaluate(() => window.TOTAL ?? null) ?? timing.total;
  const shot = async (t, file, w = 960) => { const b = await page.evaluate(([t, w, format]) => { renderAt(t); const c = document.querySelector('canvas'), o = document.createElement('canvas'); o.width = w; o.height = w * 9 / 16; o.getContext('2d').drawImage(c, 0, 0, o.width, o.height); return o.toDataURL(format==='png'?'image/png':'image/jpeg', .88).split(',')[1]; }, [t, w, arg('format','jpeg')]); writeFileSync(file, Buffer.from(b, 'base64')); };
  const dest=path.resolve(arg('dest', `${root}/qa`)); mkdirSync(`${dest}/sheet`, { recursive: true });
  if (!arg('dest') && arg('page', 'stage.html') === 'stage.html') writeFileSync(`${root}/sfx.json`, JSON.stringify(await page.evaluate(() => window.SFX), null, 1));
  if (arg('stills')) {
    for (const t of arg('stills').split(',').map(Number)) await shot(t, `${dest}/still-${t.toFixed(2).padStart(6, '0')}.${arg('format')==='png'?'png':'jpg'}`, +arg('w', 960));
  } else if (arg('sheet')) {
    const step = +arg('sheet'), a = +arg('from', 0), b = +arg('to', total);
    let i = 0; for (let t = a; t <= b; t += step) await shot(t, `${dest}/sheet/${String(i++).padStart(4, '0')}.jpg`, 640);
  } else {
    const fps = 24, a = +arg('from', 0), b = +arg('to', total), frames = Math.ceil((b - a) * fps), out = `${root}/${arg('out', 'render.mp4')}`;
    const proc = spawn(process.env.FFMPEG ?? 'ffmpeg', ['-y', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(fps), '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'pipe'] });
    proc.stderr.pipe(createWriteStream(`${root}/qa/render.log`)); let fail; proc.stdin.on('error', (e) => fail = e);
    for (let i = 0; i < frames; i++) {
      if (fail) throw fail;
      const jpeg = await page.evaluate((t) => { renderAt(t); return document.querySelector('canvas').toDataURL('image/jpeg', .93).split(',')[1]; }, a + i / fps);
      if (!proc.stdin.write(Buffer.from(jpeg, 'base64'))) await once(proc.stdin, 'drain');
      if (i % 480 === 0) console.log(`${Math.round(i / frames * 100)}%`);
    }
    proc.stdin.end(); const [code] = await once(proc, 'exit'); if (code) throw Error(`ffmpeg exit ${code}`); console.log('rendered', out);
  }
  if (errors.length) throw Error(errors.join('\n'));
} finally { await browser.close(); }
