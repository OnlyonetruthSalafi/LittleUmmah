# แม่แบบการ์ตูน Film Kit

แม่แบบ cut-out 2.5D บน canvas พิกัดโลก 1920×1080 เวลาเป็นวินาที เรนเดอร์ภาพเงียบ 24 fps แยกเสียงพูด/เสียงประกอบ/บรรยากาศออกจากภาพ ไม่มีข้อความในวิดีโอ คำบรรยายอยู่ใน `<id>.th.vtt` และจุดหยุดอยู่ใน `turns.json` เพื่อพากย์ภาษาอื่นทับภาพเดิมได้

## เริ่มเรื่องใหม่

**หางเสียงตัวละคร** ฮาดีลงท้าย “ครับ” ทั้งตอนถามและตอบ ครูนูรีแทนตัวเองว่า “ครู” ใช้ “จ๊ะ” เมื่อถาม เช่น “เห็นใบใหม่ไหมจ๊ะ?” และ “จ้ะ” เมื่อบอก เช่น “ต้นไม้จริงต้องใช้เวลาจ้ะ” คำชวนใช้ “สิจ๊ะ” หรือ “นะจ๊ะ” เขียนหนึ่งประโยคต่อคิวเมื่อทำได้ แล้วฟังท้ายคลิปจริงอีกครั้งตอนตรวจเสียง

เรื่องที่สร้างด้วย `new-film` เปิด `checkThaiEndings` ให้ตรวจทุกคิวก่อนสร้างเสียงหรือเตรียมภาพ หากมีคิวที่ยกคำอ่านตรงตัว เช่น `['nuri','บิสมิลลาฮ์',{verbatim:true}]` ให้คงคำอ่านเดิม แยกคำชวนพูดตามไว้อีกคิว

รันคำสั่งจาก root ของ repo ใช้ Node 24+, ffmpeg และ Chrome บนเครื่อง:

```powershell
$env:FFMPEG = 'C:/path/to/ffmpeg.exe' # ถ้า ffmpeg ไม่อยู่ใน PATH
# ตัวเลือกเพิ่มเติม ถ้าติดตั้งต่างจากค่าเดิม:
# $env:PLAYWRIGHT_CORE = 'C:/path/to/node_modules/playwright-core'
# $env:CHROME_PATH = 'C:/path/to/chrome.exe'
node scripts/film-kit/new-film.mjs my-film
node scripts/film-kit/prepare.mjs output/my-film
node scripts/film-kit/render.mjs output/my-film --stills 1
node scripts/film-kit/check-motion.mjs output/my-film
```

`new-film` สร้างเรื่องตัวอย่างเงียบ 8 วินาที มีนูรีและ `props/` ว่าง รันได้ทันทีโดยไม่ต้องคัดลอก engine ไม่เขียนทับโฟลเดอร์ที่มีอยู่ การหา Playwright ใช้ `PLAYWRIGHT_CORE` ก่อน แล้วจึงใช้ `output/kufic/.tools/node_modules/playwright-core` หากไม่มีจะแจ้งคำสั่งติดตั้ง `npm install --prefix output/kufic/.tools playwright-core` ไม่ติดตั้งให้อัตโนมัติ

1. แก้ `film.config.mjs`: `id`, `title`, `background`, `cast`, `turnAfter`, `ambience: {file,gain}` ชื่อ background เช่น `park.jpg` อ้างคลังกลาง หรือใช้ path ภาพในโฟลเดอร์เรื่องเอง (ตรวจไฟล์ในเรื่องก่อน) `cast` เป็น `{nuri:['front','q','side'], ...}` เลือกเฉพาะชุดที่มีจริง
2. แก้ `story.mjs` ให้ export แค่ `names`, `lines`, `scenes` เช่น `lines={a01:['nuri','ข้อความ']}` และ `scenes=[{id:'intro',lead:1,tail:2,items:[['a01',0]]}]` ตัวเลขท้าย item คือช่องว่างก่อนบรรทัดนั้น บทเปล่าใช้ `lines={}` กับฉาก `items:[]` ได้
3. ใช้เสียงที่อนุมัติแล้วเป็น `voice/<key>.mp3` หนึ่งบรรทัดต่อไฟล์ วางภาพประกอบ PNG/WebP ที่มีสิทธิ์ใช้งานใน `props/` แล้วรัน `prepare` ใหม่ทุกครั้งที่แก้บท/เสียง/config/kit การเตรียมข้อมูลไม่เรียกบริการเสียง
4. กำกับการแสดงใน `film.js` ด้วย API ด้านล่าง อ้าง `T(key)` / `TE(key)` / `S(scene)` เพื่อให้ภาพขยับตาม timing จบไฟล์ด้วย `window.ready=loadAll().then(()=>renderAt(0));`
5. ตรวจ stills และ `check-motion` ก่อนเรนเดอร์ทั้งเรื่อง แล้วค่อยผสมเสียง:

```powershell
node scripts/film-kit/render.mjs output/my-film --stills 0,1,4,7 --w 1280
node scripts/film-kit/render.mjs output/my-film --sheet 2
node scripts/film-kit/render.mjs output/my-film
node scripts/film-kit/mix.mjs output/my-film
```

ผลคือ `render.mp4` ภาพเงียบ, `master.mp4` ภาพพร้อมเสียง และ `stems/dialogue.th.wav`, `effects.wav`, `ambience.wav` แยกกัน `mix` ใช้เสียงเดิมในเรื่องและ `ambience` ตาม config ไม่มีเพลง รองรับบท/คิวเสียงว่าง ค่าบรรยากาศ `gain:0` ใช้ปิดเสียงบรรยากาศได้

`render` รองรับ `--from`, `--to`, `--out`, `--page`, `--stills`, `--sheet`, `--w` และ `--format png` สำหรับ stills ใช้ `--dest <โฟลเดอร์>` เพื่อเก็บภาพตรวจนอกต้นทาง โดยโหมดนี้ไม่เขียน `sfx.json` หรือ qa ของต้นทาง

## API การแสดง

API เป็น classic scripts ในลำดับ `data.js → engine.js → cast-base.js → characters.js → film.js → film.checks.js` โดย `prepare` คัดลอก runtime กลางให้เรื่อง ไม่ต้องแก้ runtime ภายในเรื่อง

| API | ความหมาย / ตัวเลือก |
|---|---|
| `place(id,x,y,view='q',flip=false)` | วางสถานะเริ่มต้นก่อนเวลา 0 |
| `turn(id,t,view,flip=false,step=.13)` | ไล่ชุดมุมที่มีจริงตามวง front/q/side/back คืนเวลาที่หมุนเสร็จ |
| `drive(id,t0,t1,x,y,options)` | เคลื่อนตัวพร้อมเอน/เบรกและเสียง ตัวเลือก `end`, `endFlip`, `s`, `via`, `brake`, `soundGain`, `brakeGain` |
| `joints(id,view,t0,t1,angles,e='io')` | เปลี่ยนข้อต่อ เช่น `{'arm-r-upper':-45}` องศาบวกจาก restPose |
| `gesture(id,view,t0,t1,angles,{up=.4,down=.45})` | ยกท่า ค้าง แล้วคืนศูนย์ ใช้ท่าร่วม `OPEN`, `FWD`, `BOTH` ได้ |
| `head(id,a,b,deg)` | เอียงข้อต่อ head ของมุมที่ใช้อยู่ตอนเวลา a |
| `prop(name,img,x,y,s,ax,ay,depth=951)` | ประกาศพร็อพ `img` คือชื่อไฟล์ไม่รวมนามสกุล จุด anchor `ax,ay` เป็นพิกเซลในภาพ |
| `grip(id,propName,p,a,b,options)` | จุด p บนภาพพร็อพ → เป้าโลก IK สองข้อ ช่วง a–b จับเต็มน้ำหนัก คืน descriptor ที่เพิ่มใน `iks` |
| `frontGrip(id,a,b,arms=['r'])` | วาดมือทับพร็อพ โดยเลือก `['l']` หรือ `['l','r']` ได้ |
| `cut(t,x,y,z)` | ตัดกล้องไปจุดกึ่งกลาง x,y และซูม z |
| `camTo(a,b,x,y,z)` | แพน/ซูมกล้องอย่างนุ่ม กล้อง clamp อยู่ในภาพฉาก |
| `set(id,property,t,value)` | สถานะแบบ step เช่น `eyes`, `mouth`, `view`, `flip`, `on`, `attach` |
| `to(id,property,a,b,value,e='io')` | ค้างค่าปัจจุบันถึง a แล้ว interpolate ไปถึงค่าใหม่ที่ b |
| `key(id,property,t,value,e='io')` | เพิ่ม keyframe โดยตรง |
| `T(key)`, `TE(key)`, `S(scene)` | เวลาเริ่มบรรทัด จบบรรทัด เริ่มฉาก |
| `propWorld(name,t,p)` | จุดภาพพร็อพในพิกัดโลก รวม scale/rotation/attachment |
| `fx(name,t,gain=1,dur=null)` | คิวเสียงเดิมใน `sfx/` จับเวลาแยกจากภาพ |
| `shadow(x,y,rx,ry,alpha)` | วาดเงาพร็อพ ใช้ใน `extras` ของเรื่อง |

`grip` มีตัวเลือก `{arm:'l'|'r',view:'front'|'q'|'side'|'back',tin:.6,tout:.5,hand:0,elbow:-1,follow,gripPoint}` โดย `hand` เป็นองศาสัมบูรณ์ของมือในพิกัด rig และ `elbow` เป็น ±1 เลือกด้านพับศอก `follow` เป็น offset `{x,y}` จากเป้าไปหาลำตัว หรือ `false` เพื่อใช้ตำแหน่งลำตัวที่กำกับเอง ถ้าไม่ได้ระบุจะใช้ profile ของ CAST และ flip ระยะ x ให้อัตโนมัติ หลายมือที่เปิด follow จะเฉลี่ยตำแหน่งลำตัวตามน้ำหนักพร้อมกัน ไม่ใช้ลำดับคำสั่งกำหนดตำแหน่งสุดท้าย

สองมือใช้ `grip` สองครั้งกับพร็อพเดียวกัน แต่ละมือมีจุดบนภาพของตนเอง พร็อพยังใช้พิกัดโลกเดิม ไม่มีการเปลี่ยน parent ตอนจับ/ปล่อย:

```js
grip('sabir','truck',[350,420],1,7,{arm:'l',view:'q',follow:false,elbow:1});
grip('sabir','truck',[1000,420],1,7,{arm:'r',view:'q',follow:false});
frontGrip('sabir',.4,7.5,['l','r']);
```

ต้องจัดลำตัวให้ทั้งสองเป้าอยู่ในระยะเอื้อมร่วมกัน โดยวาง path เองหรือใช้ follow ที่เข้ากัน คำสั่งจะ error ถ้าไม่มี profile หรือข้อต่อครบสามชิ้น ไม่สร้างข้อต่อปลอมเพื่อให้จับได้

## ชุดคำสั่งกำกับจากต้นแบบ "พูดความจริง" (`directing.js`)

แม่แบบนี้สืบสาย engine จากการ์ตูน "ฮาดีพูดความจริง" (truth-v2, ต้นแบบที่ Fable ทำ) แล้ว "แบ่งของเล่น" เพิ่มตัวตามมือและเงาสัมผัสล้อ
`directing.js` ยกเทคนิคการกำกับของเรื่องพูดความจริงมาเป็นคำสั่งใช้ซ้ำ (ไม่เรียก = ไม่มีผลกับเรื่องเก่า) ตัวอย่างใช้ทุกคำสั่ง: `output/truth-demo/film.js`

| คำสั่ง | ใช้ทำ |
|---|---|
| `impact(at, mover, [{name,amp,rot}], {back,lean,hop,dir})` | ชน: ของหนักสั่นแบบหน่วง ผู้ชนผงะ เอนหลัง กระเด้ง ตาเบิก + เสียงชน |
| `topple(name, at, {wobble,to,delay,dur})` | ของเบาโยก ค้าง แล้วล้มเร่ง กระดอน · คืนเวลาล้มถึง |
| `debris(name, at, from, to, {dur,bounce,depth})` | เศษชิ้นตก หมุน กระดอนหนึ่งครั้ง แล้วอยู่ที่เดิมต่อ |
| `swapState(name, at, img)` | เปลี่ยนสภาพ ปกติ/หัก/ซ่อมแล้ว (ภาพทุกสภาพขนาดและจุดยึดเดียวกัน) |
| `spinner(name)` → `.spin(t1,deg/s,e)` `.snap(t,a)` `.settle(t0,t1)` | หมุนสะสม ไม่ย้อน |
| `holdProp(name, at, actor, part, p)` / `releaseProp(name, at, {floorY,drop})` | ผูกของกับมือ / ปล่อยโดยเก็บตำแหน่งโลกก่อน ไม่วาร์ป |
| `airTarget(name,x,y)` + `handover(name, at, actor, part, p)` | ส่งของมือต่อมือ: มือผู้รับเล็ง **เป้ากลางอากาศ** ไม่เล็งตัวของ (เล็งของที่จะผูกกับมือตัวเอง = วนไม่จบ) |
| `propShadow(name, {floorY,feet})` | เงาสัมผัสใต้โต๊ะ/ของบนพื้น จางเมื่อลอย |
| `lookAround(id, at)` · `turnAway(id, at, decide)` | มองซ้ายขวา (ลังเล) · หันหลังก้มหน้าแล้วหันกลับตอนตัดสินใจ |
| `wave(id, view, arm, t0, {n})` · `listen(id, view, a, b)` | โบกมือ · ฟังเด็กตอบ (เอียงหัว ป้องหู) |

ข้อควรรู้: `grip` ของตัวที่อยู่บนพื้นแล้วเป้าสูง ให้ใส่ `follow:false` แล้วเอนตัวเอง (follow ยกตัวลอย) และเลือกจุดจับที่เอื้อมถึงตลอดช่วง
`check-motion` ตรวจเพิ่ม: ของที่ส่งต่อ/ปล่อยต้องกระโดดไม่เกิน 1.5px ที่ 720p (`handoffs` ในรายงาน)

## CAST และชุดมุม

ปรับต่อเรื่องใน `film.js` ได้ เช่น `CAST.sabir.scale=.55` ค่ามาตรฐานทั้งหมดอยู่ใน `characters.js`:

| ค่า | ความหมาย |
|---|---|
| `scale` / `viewScale[view]` | ขนาดตัวคูณกับ `rig.scaleToFront` |
| `shadow` / `shadowMode` | รัศมีเงาวงรี หรือ `'contact'` วัด alpha ใต้แต่ละล้อ/สายพาน; `'ellipse'` ใช้เงาวงรี |
| `blink` / `blinkEvery` | phase / คาบกระพริบตา หน่วยวินาที |
| `hover:{alt,amp,phase}` | ความสูงและการลอยเบา ๆ; ไม่มีค่านี้คืออยู่บนพื้น |
| `wheels[view][part]` | รัศมีล้อสำหรับหมุนตามระยะ x |
| `skip` | มุมที่ข้ามระหว่าง turn แต่ยังใช้เป็นมุมปลายทางได้ |
| `group` | รับ envelope เสียง `who:'all'` |
| `arms[view][l/r].grip` | จุดสัมผัสมือในพิกเซล rig |
| `arms[view][l/r].follow` | ระยะ x จากฐานลำตัวไปเป้า และระยะ y จากเป้าไปฐานลำตัว (สำหรับตัวลอยปรับ alt) |

ชุดที่มี: นูรี front/q/side, ฮาดี front/q/side/back, ซาบิร front/q/side, ซาฟี front/q รวม 12 ชุด Side มีเฉพาะแขนขวา และซาบิรมุม front มีเฉพาะแขนขวา ไม่มีชุด back ของตัวอื่น ค่ามือขวา q ของฮาดี/ซาบิร/ซาฟีและค่าเดิมอื่นคงตัวเลขต้นฉบับทั้งหมด ส่วน profile ที่เพิ่มใช้ศูนย์กลาง sprite มือและระยะ 65% ของความยาวแขนสองท่อนเป็นค่าเริ่มต้น จึงต้องตรวจ stills และปรับเมื่อเปลี่ยนขนาด/ท่าถือของ

## Motion gates และหลักฐาน

`check-motion` ตรวจทุกเฟรม 24fps ในช่วงจับเต็ม: ทุก grip ต้องมี sample และคลาดไม่เกิน 2px เมื่อฉายที่ 720p; ตรวจทุกมุมของกรอบ sprite head/dome ของทุกตัวที่กำลังจับ รวมช่วงเข้า/ออก ให้ไม่พ้นขอบกล้องทั้งสี่ด้าน ค่า head margin ในรายงานใช้พิกัดภาพ 1080p

Gate เฉพาะเรื่องเขียน `film.checks.js`: กำหนด `window.filmChecks=()=>({passed:true,...ตัวเลข})` ฟังก์ชันเข้าถึง tracks/pose/propWorld ได้ ผลจะอยู่ใต้ `story` ใน `qa/motion-report.json` หากไม่มี prepare สร้างไฟล์ว่างให้ ไม่ฝังชื่อของ/เหตุการณ์ของเรื่องไว้ใน gate กลาง

ตรวจ regression ด้วย `node scripts/film-kit/verify-port.mjs <ต้นฉบับ> <เรื่องที่ port>` คำสั่งเทียบ timing ทุกค่า เรนเดอร์ PNG แบบ lossless 19 เวลาที่กำหนดใน brief ที่ 1920×1080 และเทียบพิกเซล RGB พร้อมรายงานผลรายภาพในโฟลเดอร์เรื่องที่ port เท่านั้น

Asset เดิม 12 kits, park และเสียง 7 ไฟล์มี sha256/ขนาด/ต้นทางใน `assets/kits/MANIFEST.json` ไม่มีการเปลี่ยนภาพ อ่านข้อจำกัดหลักฐานสิทธิ์เสียงใน `assets/sfx/PROVENANCE.md` ก่อนนำไปเผยแพร่

`make-voice.mjs` รับโฟลเดอร์เรื่องเหมือนกัน และใช้ robot-voice / FRIENDS เดิม แต่ค่าเริ่มต้นปฏิเสธการสร้างเสียง ต้องมี `--generate` จึงทำงาน งาน FILM-KIT-1 ไม่ใช้ flag นี้และไม่เรียก ElevenLabs การนำแม่แบบไปใช้ต้องรักษากฎ AGENTS.md เรื่องภาพใบหน้าว่าง ศาสนา ลิขสิทธิ์ และไม่มีดนตรีด้วย
