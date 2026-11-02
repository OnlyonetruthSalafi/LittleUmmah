import assert from 'node:assert/strict';
import test from 'node:test';
import { ART_COLORS, ART_PICTURES } from '../src/features/art/data.ts';
import { BRUSH_WIDTH, PAINT_WIDTH, PAINT_HEIGHT, UNDO_LIMIT, brushBristles, interpolate, picturePoint, pushHistory, seededRandom, keyboardRows } from '../src/features/art/paint.ts';
import { PAINT_WELLS } from '../src/features/art/paint-assets.ts';

// กันการเติมรูปสิ่งมีชีวิตเข้ามาโดยไม่ตั้งใจ รูประบายต้องเป็นสิ่งของหรือพืช (เจ้าของโปรเจกต์ย้ำ 1 พ.ย. 2026)
const LIVING = /คน|เด็ก|ใบหน้า|ตา$|ปาก|แมว|หมา|นก|ปลา|อูฐ|ม้า|แพะ|แกะ|ผึ้ง|ผีเสื้อ|person|child|face|\beye|mouth|\bcat\b|\bdog\b|bird|fish|camel|horse|goat|sheep|bee\b|butterfly/i;

test('รูประบายมี 8 รูป id ไม่ซ้ำ และเป็นสิ่งของหรือพืชเท่านั้น', () => {
  assert.equal(ART_PICTURES.length, 8);
  assert.equal(new Set(ART_PICTURES.map(picture => picture.id)).size, 8);
  for (const picture of ART_PICTURES) {
    assert.doesNotMatch(`${picture.title.th} ${picture.title.en}`, LIVING, picture.id);
    for (const region of picture.regions) assert.doesNotMatch(`${region.label.th} ${region.label.en}`, LIVING, `${picture.id}/${region.id}`);
  }
});

test('ทุกชิ้นมี id ไม่ซ้ำในรูป path ปิด และชิ้นแรกคือพื้นหลังเต็มภาพ', () => {
  for (const picture of ART_PICTURES) {
    assert.equal(new Set(picture.regions.map(region => region.id)).size, picture.regions.length, picture.id);
    assert.equal(picture.regions[0].d, 'M0 0H400V300H0Z', picture.id);
    for (const region of picture.regions) assert.match(region.d, /Z$/, `${picture.id}/${region.id}`);
  }
});

test('แต่ละสีมีรูปทรงของตัวเอง ไม่สื่อด้วยสีอย่างเดียว', () => {
  assert.equal(new Set(ART_COLORS.map(color => color.shape)).size, ART_COLORS.length);
  for (const color of ART_COLORS) assert.ok(color.label.th && color.label.en, color.id);
});

test('สีและตำแหน่งหลุมมาจากการวัดภาพจริง', () => {
  for (const [i,color] of ART_COLORS.entries()) {
    assert.equal(color.id,PAINT_WELLS[i].id); assert.equal(color.value,PAINT_WELLS[i].value);
    assert.ok(PAINT_WELLS[i].sampleCount>1000);assert.ok(PAINT_WELLS[i].xPercent>0&&PAINT_WELLS[i].xPercent<100);
  }
});
test('พิกัดนิ้วตรงกันเมื่อ CSS ย่อขยาย', () => {
  assert.equal(PAINT_WIDTH/PAINT_HEIGHT,4/3);
  for (const scale of [.4,1,2.5]) assert.deepEqual(picturePoint({x:10+150*scale,y:20+94*scale},{left:10,top:20,width:400*scale,height:300*scale}),{x:150,y:94});
});
test('ลากเร็วมีจุดเชื่อมต่อเนื่อง รวมจุดสุดท้าย', () => {
  const start={x:10,y:20},end={x:380,y:280},points=interpolate(start,end);assert.deepEqual(points.at(-1),end);
  let previous=start;for(const p of points){assert.ok(Math.hypot(p.x-previous.x,p.y-previous.y)<=2.00001);previous=p;}
  assert.deepEqual(interpolate(start,start),[]);
});
test('ขนแปรงหลายริ้วมี seed ทำให้วาดใหม่เหมือนเดิม', () => {
  assert.deepEqual(brushBristles(42),brushBristles(42));assert.notDeepEqual(brushBristles(42),brushBristles(43));
  assert.ok(brushBristles(42).length>=26);assert.ok(new Set(brushBristles(42).map(b=>b.alpha)).size>10);
  assert.equal(BRUSH_WIDTH,26);const r=seededRandom(99);for(let i=0;i<100;i++){const n=r();assert.ok(n>=0&&n<1);}
});
test('ประวัติอย่างน้อย 8 เส้น คืนเส้นเก่าให้ bake โดยงานไม่สูญหาย', () => {
  assert.ok(UNDO_LIMIT>=8);let history=[],baked=[];
  for(let i=0;i<40;i++){const result=pushHistory(history,i);history=result.history;if(result.baked!==undefined)baked.push(result.baked);}
  assert.equal(history.length,UNDO_LIMIT);assert.deepEqual([...baked,...history],Array.from({length:40},(_,i)=>i));
});
test('แถวคีย์บอร์ดครอบคลุมภาพรวมขอบ', () => {
  const rows=keyboardRows();assert.ok(rows[0][0].y<0&&rows.at(-1)[0].y>300);
  for(const row of rows){assert.ok(Math.min(row[0].x,row[1].x)<0);assert.ok(Math.max(row[0].x,row[1].x)>400);}
});
test('ภาพตัวอย่างใช้สีในถาดและชี้ชิ้นที่มีจริงทุกรูป', () => {
  const colors = new Set(ART_COLORS.map(color => color.id));
  for (const picture of ART_PICTURES) {
    const regions = new Set(picture.regions.map(region => region.id));
    assert.ok(Object.keys(picture.example).length >= regions.size - 2, picture.id);
    for (const [region, color] of Object.entries(picture.example)) {
      assert.ok(regions.has(region), `${picture.id}/${region}`);
      assert.ok(colors.has(color), `${picture.id}/${region}`);
    }
  }
});
