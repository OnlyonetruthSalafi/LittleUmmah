import { writeFile } from 'node:fs/promises';
import { buildText, blockKinds, buildVoice, buildPlans } from '../src/features/games/data/blockBuilders.ts';
import { games } from '../src/features/games/data/catalog.ts';
import { gamePresentation } from '../src/features/games/data/presentation.ts';
const game=games.find(g=>g.slug==='block-builders'),theme=gamePresentation['block-builders'];
const rows=[['catalog.title',game.title],['catalog.instruction',game.instruction],['presentation.world',theme.world],['presentation.description',theme.description],...theme.levels.map((v,i)=>[`level.${i+1}`,v]),['presentation.destinations',theme.destinations],['presentation.pieces',theme.pieces],...Object.entries(buildText).map(([k,v])=>[`text.${k}`,v]),...Object.entries(blockKinds).flatMap(([k,v])=>[[`shape.${k}`,v.label],[`color.${k}`,v.colorLabel]]),...buildPlans.map(p=>[`plan.${p.id}`,p.title]),...Object.entries(buildVoice).map(([k,v])=>[`voice.${k}`,v])];
await writeFile('output/g-4/content-inventory.md','# ข้อความใหม่ทั้งหมด — ไทย / อังกฤษ\n\n| key | ไทย | English |\n|---|---|---|\n'+rows.map(([key,t])=>`| ${key} | ${t.th} | ${t.en} |`).join('\n')+'\n');
console.log(`Wrote ${rows.length} bilingual entries.`);
