import { writeFile } from 'node:fs/promises';
import { balanceText, balanceObjects, balanceVoice } from '../src/features/games/data/balanceScale.ts';
import { games } from '../src/features/games/data/catalog.ts';
import { gamePresentation } from '../src/features/games/data/presentation.ts';
const game=games.find(g=>g.slug==='balance-scale'),theme=gamePresentation['balance-scale'];
const rows=[['catalog.title',game.title],['catalog.instruction',game.instruction],['presentation.world',theme.world],['presentation.description',theme.description],...theme.levels.map((v,i)=>[`level.${i+1}`,v]),['presentation.destinations',theme.destinations],['presentation.pieces',theme.pieces],...Object.entries(balanceText).map(([k,v])=>[`text.${k}`,v]),...balanceObjects.map(v=>[`object.${v.id}`,v.label]),...Object.entries(balanceVoice).map(([k,v])=>[`voice.${k}`,v])];
await writeFile('output/g-3/content-inventory.md','# ข้อความใหม่ทั้งหมด — ไทย / อังกฤษ\n\n| key | ไทย | English |\n|---|---|---|\n'+rows.map(([key,t])=>`| ${key} | ${t.th} | ${t.en} |`).join('\n')+'\n');
console.log(`Wrote ${rows.length} bilingual entries (including shared voice/UI lines).`);
