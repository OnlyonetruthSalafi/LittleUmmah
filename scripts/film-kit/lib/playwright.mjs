import {existsSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const fallback=fileURLToPath(new URL('../../../output/kufic/.tools/node_modules/playwright-core/index.mjs',import.meta.url));
let source=process.env.PLAYWRIGHT_CORE??fallback;
if(existsSync(path.join(source,'index.mjs')))source=path.join(source,'index.mjs');
if(!existsSync(source))throw Error('playwright-core not found. Install: npm install --prefix output/kufic/.tools playwright-core ; or set PLAYWRIGHT_CORE to its package directory / index.mjs');
export const {chromium}=await import(pathToFileURL(path.resolve(source)));
export const chromePath=process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe';
