import {BEAD_TEXT,BEADS,BEAD_LEVELS,beadHint} from '../src/features/games/data/beadLacing.ts';
import {games} from '../src/features/games/data/catalog.ts';
import {gamePresentation} from '../src/features/games/data/presentation.ts';
import {writeFile} from 'node:fs/promises';
const game=games.find(g=>g.slug==='bead-lacing'),theme=gamePresentation[game.slug];
const text=[['ชื่อเกม',game.title],['คำสั่ง',game.instruction],['โลก',theme.world],['คำอธิบาย',theme.description],...theme.levels.map((x,i)=>[`ด่าน ${i+1}`,x]),...Object.entries(BEAD_TEXT),...BEADS.map(b=>[b.id,b.label]),...BEADS.map(b=>[`hint-${b.id}`,beadHint(b.id)])];
await writeFile('output/g-2/content.md','# ข้อความใหม่ทั้งหมด\n\n| จุดใช้ | ไทย | English |\n|---|---|---|\n'+text.map(([key,t])=>`| ${key} | ${t.th} | ${t.en} |`).join('\n')+'\n\n## ลำดับลูกปัด\n\n'+BEAD_LEVELS.map((rs,l)=>rs.map((r,i)=>`- ด่าน ${l+1} รอบ ${i+1}: ${r.pattern.join(' → ')}; ร้อยให้ก่อน ${r.prefilled} เม็ด`).join('\n')).join('\n'));
