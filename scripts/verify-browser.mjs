/*
 * ตรวจเบราว์เซอร์ทุกชุดตามลำดับ ต้องเปิด server ก่อน:
 *   npm run build && npm run start -- -p 3104
 *   npm run verify:browser
 *   npm run verify:browser -- http://localhost:3104
 * หรือ BASE_URL=http://localhost:3104 npm run verify:browser
 * PLAYWRIGHT_MODULE ระบุ package/path ของ Playwright ที่ติดตั้งแล้วได้
 * ถ้าไม่ระบุ จะหาใน node_modules แล้วใน npm cache (ไม่ติดตั้งเพิ่ม)
 * PLAYWRIGHT_EXECUTABLE ระบุ Chrome ที่รองรับ MP3 (โดยเฉพาะ classroom)
 * ภาพและ log อยู่ใน output/p0-3/verify-browser/<ชื่อสคริปต์>/
 * BROWSER_CHECK_OUT เปลี่ยนโฟลเดอร์ผลลัพธ์รวมได้
 * ชุด landscape ต้องมี baseline server (:3102 หรือ LANDSCAPE_BASELINE_URL)
 * adapter ต้องรักษา URL ของ baseline เพื่อไม่ให้เทียบแอปกับตัวเอง
 * สคริปต์เกมบางตัวผูก localhost:3001 ไว้: adapter เปลี่ยนเฉพาะ page.goto
 * ไป base URL ที่เลือก และย้าย screenshot เท่านั้น ไม่เปลี่ยน assertions/DOM
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

async function playwrightPath() {
  if (process.env.PLAYWRIGHT_MODULE) {
    const value = process.env.PLAYWRIGHT_MODULE;
    return require.resolve(value.startsWith('file:') ? fileURLToPath(value) : value);
  }
  for (const name of ['playwright', 'playwright-core']) {
    try { return require.resolve(name); } catch { /* ลอง installation ถัดไป */ }
  }
  const cache = process.env.npm_config_cache ?? (process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, 'npm-cache') : join(process.env.HOME ?? '', '.npm'));
  const npx = join(cache, '_npx');
  for (const entry of (await readdir(npx).catch(() => [])).sort()) {
    for (const name of ['playwright', 'playwright-core']) {
      try { return require.resolve(join(npx, entry, 'node_modules', name)); } catch { /* ลอง package ถัดไป */ }
    }
  }
  throw new Error('ไม่พบ Playwright: ตั้ง PLAYWRIGHT_MODULE ให้ชี้ installation ที่มีอยู่ก่อนรัน');
}

async function preferSystemChrome() {
  if (process.env.PLAYWRIGHT_EXECUTABLE) return;
  const candidates = process.platform === 'win32'
    ? [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
      .filter(Boolean).map(dir => join(dir, 'Google', 'Chrome', 'Application', 'chrome.exe'))
    : ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'];
  for (const candidate of candidates) {
    try { await access(candidate); process.env.PLAYWRIGHT_EXECUTABLE = candidate; return; } catch { /* ลอง browser ถัดไป */ }
  }
}

async function runScript(script, base, out) {
  const browsers = [];
  // ใช้ installation เดียวกันทั้ง import และ require ในสคริปต์รุ่นเก่า
  if (script !== 'check-game-routes.mjs') {
    const modulePath = await playwrightPath();
    await preferSystemChrome();
    const api = await import(pathToFileURL(modulePath).href);
    const chromium = api.chromium ?? api.default?.chromium;
    const launch = chromium.launch.bind(chromium);
    chromium.launch = async (options) => {
      const browser = await launch(options);
      browsers.push(browser);
      const newContext = browser.newContext.bind(browser);
      browser.newContext = async (...args) => {
        const context = await newContext(...args);
        const newPage = context.newPage.bind(context);
        context.newPage = async (...args) => {
          const page = await newPage(...args);
          const goto = page.goto.bind(page);
          page.goto = (url, ...args) => {
            const target = new URL(url);
            const baselineOrigin = process.env.LANDSCAPE_BASELINE_URL
              ? new URL(process.env.LANDSCAPE_BASELINE_URL).origin : 'http://localhost:3102';
            if (target.origin !== new URL(base).origin && target.origin !== baselineOrigin && ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname)) {
              url = `${base}${target.pathname}${target.search}${target.hash}`;
            }
            return goto(url, ...args);
          };
          // ครอบ prototype เพื่อรวม Locator ที่สร้างจาก getByRole/locator/... ทุกแบบ
          for (const proto of [Object.getPrototypeOf(page), Object.getPrototypeOf(page.locator('body'))]) {
            if (Object.hasOwn(proto, '__verifyBrowserScreenshot')) continue;
            Object.defineProperty(proto, '__verifyBrowserScreenshot', { value: true });
            const screenshot = proto.screenshot;
            proto.screenshot = async function (options = {}) {
              if (!options.path) return screenshot.call(this, options);
              const original = resolve(root, options.path);
              const withinOut = relative(out, original);
              const suffix = relative(join(root, 'output'), original);
              const dest = !withinOut.startsWith(`..${sep}`) && withinOut !== '..' && !isAbsolute(withinOut)
                ? original
                : join(out, suffix.startsWith('..') || isAbsolute(suffix) ? join('screenshots', basename(original)) : suffix);
              await mkdir(dirname(dest), { recursive: true });
              return screenshot.call(this, { ...options, path: dest });
            };
          }
          return page;
        };
        return context;
      };
      return browser;
    };
    // บางชุด require() บางชุด import(): เปลี่ยน env ให้ตรง entry point ของแต่ละชุด
    const source = await readFile(join(root, 'scripts', script), 'utf8');
    process.env.PLAYWRIGHT_MODULE = source.includes('require(process.env.PLAYWRIGHT_MODULE') || source.includes('const require = createRequire')
      ? modulePath : `data:text/javascript,${encodeURIComponent(`import * as api from ${JSON.stringify(pathToFileURL(modulePath).href)}; export const chromium = api.chromium ?? api.default?.chromium;`)}`;
  }
  process.argv = [process.execPath, join(root, 'scripts', script), base, out];
  try {
    await import(pathToFileURL(join(root, 'scripts', script)).href);
  } catch (error) {
    let i = 0;
    for (const browser of browsers) for (const context of browser.contexts()) for (const page of context.pages()) {
      await page.screenshot({ path: join(out, `failure-${++i}.png`), fullPage: true, timeout: 5000 }).catch(() => {});
    }
    throw error;
  } finally {
    await Promise.allSettled(browsers.map(browser => browser.close()));
  }
}

if (process.argv[2] === '--run-script') {
  await runScript(process.argv[3], process.env.BASE_URL, process.env.BROWSER_CHECK_OUT);
} else {
  const base = (process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3104').replace(/\/+$/, '');
  const url = new URL(base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('base URL ต้องเป็น http(s)');
  const scripts = (await readdir(join(root, 'scripts')))
    .filter(name => /^check-.*-browser\.mjs$/.test(name)).sort();
  scripts.push('check-game-routes.mjs');
  const results = [];
  const outputRoot = resolve(process.env.BROWSER_CHECK_OUT ?? join(root, 'output', 'p0-3', 'verify-browser'));
  for (const script of scripts) {
    const out = join(outputRoot, script.replace(/\.mjs$/, ''));
    await mkdir(out, { recursive: true });
    console.log(`\n=== ${script} (${base}) ===`);
    let log = '';
    const result = await new Promise(resolveResult => {
      const child = spawn(process.execPath, [fileURLToPath(import.meta.url), '--run-script', script], {
        cwd: root,
        env: { ...process.env, BASE_URL: base, GAME_TEST_URL: base, PORT: url.port || (url.protocol === 'https:' ? '443' : '80'), BROWSER_CHECK_OUT: out },
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      child.stdout.on('data', chunk => { log += chunk; process.stdout.write(chunk); });
      child.stderr.on('data', chunk => { log += chunk; process.stderr.write(chunk); });
      child.on('error', error => { log += `${error.stack}\n`; resolveResult({ script, exitCode: 1, error: error.message }); });
      child.on('close', (code, signal) => resolveResult({ script, exitCode: code ?? 1, signal }));
    });
    results.push(result);
    await writeFile(join(out, 'run.log'), log);
    console.log(`${result.exitCode === 0 ? 'ผ่าน' : 'ตก'}: ${script} (exit ${result.exitCode})`);
  }
  console.log('\nผล verify:browser');
  for (const result of results) console.log(`${result.exitCode === 0 ? 'ผ่าน' : 'ตก'}  ${result.script} (exit ${result.exitCode})`);
  await writeFile(join(outputRoot, 'results.json'), JSON.stringify({ base, results }, null, 2));
  process.exitCode = results.some(result => result.exitCode !== 0) ? 1 : 0;
}
