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
  if (!['hadi', 'sabir', 'qalam', 'nuri', 'safi'].includes(who) || options.verbatim || !/[ก-ฮ]/u.test(text)) continue;
  for (const sentence of text.match(/[^.!?。！？]+[.!?。！？]*/gu) ?? []) {
   const words = sentence.trim().replace(/[.!?。！？…"'”’»]+$/gu, '').trimEnd();
   if (!words) continue;
   const question = /[?？]["'”’»]*$/u.test(sentence.trim());
   const endings = {
    hadi: /ครับ$/u,
    sabir: /ครับ$/u,
    qalam: /ครับ$/u,
    nuri: question ? /จ๊ะ$/u : /(?:จ้ะ|จ๊ะ)$/u,
    // Thai questions may omit a question mark; keep existing spoken scripts valid.
    safi: question ? /คะ$/u : /(?:ค่ะ|คะ)$/u,
   }[who];
   if (!endings.test(words)) problems.push(`${key} (${who}): ${sentence.trim()}`);
  }
 }
 if (problems.length) throw Error('ตรวจหางเสียงก่อนพากย์ — ฮาดี ซาบิร และฟาฮีมใช้ “ครับ” ครูนูรีใช้ “จ้ะ/จ๊ะ” ซาฟีใช้ “ค่ะ/คะ” ตามบริบท\n' + problems.join('\n'));
}
