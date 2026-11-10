// Two takes per approved line. Select using output/ls-2/select-voice.py + Thai ASR.
import { renderRobotLines } from './lib/robot-voice.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
export const lines = {
  'ls-earned': 'เก่งมากจ้ะ ได้ดาวเรียนรู้เพิ่มหนึ่งดวงแล้ว',
  'ls-empty': 'ดาวเรียนรู้หมดแล้วจ้ะ ไปเรียนที่เกาะเรียนรู้กับครู เก็บดาวแล้วกลับมาเล่นกันนะ',
  'ls-free': 'วันนี้เล่นฟรีได้หนึ่งด่านนะจ๊ะ',
  'time-warn': 'อีกสองนาทีจะหมดเวลาเล่นแล้วนะจ๊ะ เล่นด่านนี้ให้จบก่อนนะ',
  'time-up': 'หมดเวลาเล่นแล้วจ้ะ ไปบอกคุณพ่อคุณแม่ให้ช่วยปลดล็อก หรือไปเรียนที่เกาะเรียนรู้กับครูกันนะ',
  'unlocked': 'คุณพ่อคุณแม่ปลดล็อกให้แล้ว เล่นต่อได้เลยจ้ะ',
  'ls-last': 'ดาวดวงสุดท้ายแล้วนะจ๊ะ เล่นด่านนี้จบแล้ว ไปเรียนเก็บดาวที่เกาะเรียนรู้ก่อนนะ',
};
mkdirSync('output/ls-2/voice', { recursive: true });
writeFileSync('output/ls-2/voice/lines.json', JSON.stringify(lines, null, 2));
for (const take of [1,2]) await renderRobotLines(lines, `output/ls-2/voice/take-${take}`);
// Keep the ASR trace and both takes for the owner's listening review.
writeFileSync('output/ls-2/select-voice.py', `import sys,json,shutil
from pathlib import Path
sys.path.insert(0,'D:/tools/thai-asr')
from check import transcribe,norm,cer
root=Path.cwd()
lines=json.loads((root/'output/ls-2/voice/lines.json').read_text('utf8'))
files=[str((root/f'output/ls-2/voice/take-{t}/{key}.mp3').resolve()) for key in lines for t in [1,2]]
transcripts=transcribe(files)
result=[]
out=root/'public/audio/th/stars';out.mkdir(parents=True,exist_ok=True)
for key,text in lines.items():
 takes=[]
 for t in [1,2]:
  f=str((root/f'output/ls-2/voice/take-{t}/{key}.mp3').resolve())
  takes.append({'take':t,'text':transcripts[f],'cer':cer(norm(text),norm(transcripts[f])),'file':f})
 best=min(takes,key=lambda x:x['cer'])
 shutil.copyfile(best['file'],out/f'{key}.mp3')
 result.append({'id':key,'script':text,'selected':best['take'],'takes':takes})
(root/'output/ls-2/asr.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),'utf8')
`);
execFileSync(process.env.THAI_ASR_PYTHON || 'D:/tools/thai-asr/.venv/Scripts/python.exe', ['output/ls-2/select-voice.py'], {stdio:'inherit'});
