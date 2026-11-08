import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readdir,writeFile } from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/User/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 const page=await browser.newPage();await page.goto(process.env.BASE_URL?`${process.env.BASE_URL}/games/bead-lacing`:'http://localhost:3132/games/bead-lacing');
 const keys=(await readdir('public/audio/th')).filter(f=>f.includes('bead')&&f.endsWith('.mp3'));assert.equal(keys.length,18);
 const clips=await page.evaluate(async keys=>{const ctx=new AudioContext();const results=[];for(const file of keys){const r=await fetch('/audio/th/'+file);if(!r.ok)throw Error(file);let buffer;try{buffer=await ctx.decodeAudioData(await r.arrayBuffer());}catch{throw Error('Undecodable MP3: '+file);}let peak=0;for(const v of buffer.getChannelData(0))peak=Math.max(peak,Math.abs(v));if(buffer.duration<.3||peak<.001)throw Error('Empty/silent clip: '+file);results.push({file,duration:buffer.duration,channels:buffer.numberOfChannels,peak});}await ctx.close();return results;},keys);
 await page.locator('.gc-start-3d').click();
 const playback=await page.evaluate(async()=>{const a=new Audio('/audio/th/bead-hint-turquoise-square.mp3');await a.play();await new Promise(r=>setTimeout(r,900));const v={currentTime:a.currentTime,error:a.error?.message??null,paused:a.paused};a.pause();return v;});
 assert.ok(playback.currentTime>.2&&!playback.paused&&!playback.error);
 await writeFile('output/g-2/audio-audit.json',JSON.stringify({clips,playback},null,2));console.log(`PASS ${clips.length} MP3s decode with nonzero signal; hint playback advances`);
} finally {await browser.close();}
