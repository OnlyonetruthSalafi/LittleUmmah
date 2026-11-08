import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { balanceVoice } from '../src/features/games/data/balanceScale.ts';
import { hasRecordedClip } from '../src/lib/speech.ts';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
  for(const key of Object.keys(balanceVoice))assert.ok(hasRecordedClip(key),`${key}: speech registry`);
  const page=await browser.newPage();await page.goto((process.argv[2]||process.env.BASE_URL||'http://localhost:3133')+'/games/balance-scale');
  const clips=await page.evaluate(async keys=>{
    const context=new AudioContext(),results=[];
    for(const key of keys){const r=await fetch(`/audio/th/${key}.mp3`);if(!r.ok)throw Error(key);const audio=await context.decodeAudioData(await r.arrayBuffer());let peak=0;for(const n of audio.getChannelData(0))peak=Math.max(peak,Math.abs(n));if(audio.duration<.3||peak<.001)throw Error('Empty clip: '+key);results.push({key,duration:audio.duration,channels:audio.numberOfChannels,peak});}
    await context.close();return results;
  },Object.keys(balanceVoice));
  await page.locator('.gc-start-3d').click();
  const playback=await page.evaluate(async()=>{const a=new Audio('/audio/th/balance-equal.mp3');await a.play();await new Promise(r=>setTimeout(r,700));const result={time:a.currentTime,paused:a.paused,error:a.error?.message??null};a.pause();return result;});
  assert.ok(playback.time>.2&&!playback.paused&&!playback.error);
  await writeFile('output/g-3/audio-audit.json',JSON.stringify({clips,playback},null,2));console.log('PASS 9 registered MP3 files decode; non-silent signal and real playback advances');
}finally{await browser.close();}
