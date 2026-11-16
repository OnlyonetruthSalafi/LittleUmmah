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
 return {config,story};
}
