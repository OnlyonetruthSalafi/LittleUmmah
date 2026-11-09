import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE || 'C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const results=[];
try {
 for(const scenario of ['slow-images','missing-assets','voice']) {
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  await context.addInitScript(s=>{localStorage.setItem('little-ummah:sound',s==='voice'?'on':'off');let seed=42;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};},scenario);
  const page=await context.newPage();page.on('pageerror',e=>console.log(e.message));
  if(scenario!=='voice') await page.route('**/games/coin-box/*.webp',async route=>{if(scenario==='missing-assets')await route.abort();else {await new Promise(r=>setTimeout(r,3500));await route.continue();}});
  const clips=[];page.on('request',req=>{if(req.url().includes('/audio/th/coin-'))clips.push(req.url().split('/').pop());});
  await page.goto(`${(process.argv[2] || process.env.BASE_URL || 'http://localhost:3131').replace(/\/+$/, '')}/games/coin-box`);await page.locator('.gc-start-3d').click();
  await page.waitForFunction(()=>document.querySelector('.cb-scene')?.dataset.phase==='ready',null,{timeout:30000}).catch(async e=>{await page.screenshot({path:'output/g-1/shots/resilience-failure.png'});console.log(await page.locator('body').innerText());throw e;});
  const ready=()=>page.waitForFunction(()=>document.querySelector('.cb-scene')?.dataset.phase==='ready',null,{timeout:30000});
  const put=async()=>{await ready();await page.locator('[data-item-id="coin"]').click();await page.locator('[data-drop-id="coin-slot"]').click();};
  await put();await ready();assert.equal(await page.locator('.cb-scene').getAttribute('data-count'),'1');
  await page.locator('.cb-actions button').first().click();await ready();assert.equal(await page.locator('.cb-scene').getAttribute('data-count'),'0');
  await put();await ready();await page.locator('.cb-actions button').last().click();await ready();assert.equal(await page.locator('.cb-scene').getAttribute('data-count'),'0');
  // Invalid drop and pointer cancellation never count a coin.
  const coin=page.locator('[data-item-id="coin"]');const box=await coin.boundingBox();
  await page.mouse.move(box.x+36,box.y+36);await page.mouse.down();await page.mouse.move(4,4);await page.mouse.up();assert.equal(await page.locator('.cb-scene').getAttribute('data-count'),'0');
  await put();await ready();await put();
  await page.waitForFunction(()=>document.querySelector('.cb-scene')?.dataset.round==='2',null,{timeout:30000});
  if(scenario==='voice') {assert.ok(clips.includes('coin-count-1.mp3'));assert.ok(clips.includes('coin-count-2.mp3'));assert.ok(clips.includes('coin-praise.mp3'));}
  if(scenario==='slow-images') assert.equal(await page.locator('.cb-fallback').count(),0,'loaded art must not be replaced by timeout fallback');
  await page.screenshot({path:`output/g-1/shots/${scenario}.png`});results.push({scenario,passed:true,clips});await context.close();console.log('PASS '+scenario);
 }
}finally{await browser.close();await writeFile('output/g-1/resilience-results.json',JSON.stringify(results,null,2));}
