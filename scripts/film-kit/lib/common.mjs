import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
export const kitRoot=fileURLToPath(new URL('..',import.meta.url));
export function filmRoot(){
 const arg=process.argv[2];
 if(!arg||arg.startsWith('--'))throw Error('Usage: node scripts/film-kit/<command>.mjs output/<id>');
 return path.resolve(arg);
}
export async function loadFilm(root){
 const config=(await import(pathToFileURL(path.join(root,'film.config.mjs')))).default;
 const story=await import(pathToFileURL(path.join(root,'story.mjs')));
 if(config.checkThaiEndings) checkThaiEndings(story.lines);
 return {config,story};
}

// Check the script before recording or preparing the film. Names, Arabic
// recitation and other verbatim teaching examples can occupy a separate cue.
export function checkThaiEndings(lines) {
 const problems = [];
 for (const [key, [who, text, options = {}]] of Object.entries(lines)) {
  if (!['hadi', 'nuri'].includes(who) || options.verbatim || !/[ก-ฮ]/u.test(text)) continue;
  for (const sentence of text.match(/[^.!?。！？]+[.!?。！？]*/gu) ?? []) {
   const words = sentence.trim().replace(/[.!?。！？…"'”’»]+$/gu, '').trimEnd();
   if (!words) continue;
   const question = /[?？]["'”’»]*$/u.test(sentence.trim());
   const endings = who === 'hadi' ? /ครับ$/u : question ? /จ๊ะ$/u : /(?:จ้ะ|จ๊ะ)$/u;
   if (!endings.test(words)) problems.push(`${key} (${who}): ${sentence.trim()}`);
  }
 }
 if (problems.length) throw Error('ตรวจหางเสียงก่อนพากย์ — ฮาดีใช้ “ครับ” ครูนูรีใช้ “จ้ะ/จ๊ะ” ตามบริบท\n' + problems.join('\n'));
}
