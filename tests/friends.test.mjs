import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import test from 'node:test';
import { FRIENDS } from '../src/lib/friends.ts';
import { CARTOONS } from '../src/features/moral/cartoon.ts';
import { CARD_ART } from '../src/features/moral/data.ts';
import { FRIEND_CLIPS, LINES } from '../scripts/make-moral-cartoon-voice.mjs';

/* ผองเพื่อนนูรี: ภาพทุกท่าต้องมีจริง และบท "รู้จักเพื่อนใหม่" ต้องมีเสียงครบ บทพูดตรงกับบทอัดเสียง */
test('เพื่อนทุกตัวมีภาพท่ายืนและท่าทั้ง 4 (IMG-9) และมีเสียงของตัวเอง', () => {
  for (const friend of Object.values(FRIENDS)) {
    assert.ok(existsSync(`public/Character/friends/${friend.id}.webp`), `${friend.id}.webp`);
    for (const pose of ['cheer', 'point', 'think', 'action']) assert.ok(existsSync(`public/Character/friends/${friend.id}-${pose}.webp`), `${friend.id}-${pose}.webp`);
    assert.match(friend.voiceId, /^[A-Za-z0-9]{20}$/);
  }
  assert.equal(new Set(Object.values(FRIENDS).map((f) => f.voiceId)).size, 5, 'เพื่อนแต่ละตัวเสียงไม่ซ้ำกัน');
});

test('บท meet-friends: เพื่อนแนะนำตัวครบ 5 ตัว ด้วยเสียงของตัวเอง ภาพ เสียง และบทครบ', () => {
  const cartoon = CARTOONS['meet-friends'];
  assert.ok(existsSync(`public${CARD_ART['meet-friends']}`));
  const speakers = cartoon.scenes.filter((s) => s.speaker).map((s) => s.speaker);
  assert.deepEqual([...speakers].sort(), Object.keys(FRIENDS).sort());
  for (const scene of cartoon.scenes) {
    const spoken = LINES[scene.clip];
    assert.ok(spoken, `ไม่มีบทอัดเสียง ${scene.clip}`);
    assert.ok(spoken === scene.th || spoken === `${scene.th} พูดตามครู อัสสะลามุอะลัยกุม`, `บทบนจอไม่ตรงเสียง ${scene.clip}`);
    const file = `public/audio/th/${scene.clip}.mp3`;
    assert.ok(existsSync(file) && statSync(file).size > 2000, file);
    assert.equal(FRIEND_CLIPS[scene.clip], scene.speaker, `${scene.clip}: อัดด้วยเสียงของผู้พูด`);
    if (scene.speaker) {
      assert.ok(scene.cast?.some((m) => m.id === scene.speaker), `${scene.clip}: ผู้พูดต้องอยู่ในฉาก`);
      // หุ่นยนต์ไม่ระบุเพศ ใช้ "เรา" · เสียงเพื่อนยังไม่ได้ทดสอบอ่านอาหรับ จึงไม่ให้เพื่อนพูดสลาม
      assert.ok(!/สลาม|ครับ|ค่ะ/.test(scene.th), `${scene.clip}`);
    }
    for (const m of scene.cast ?? []) assert.ok(existsSync(`public/Character/friends/${m.pose === 'stand' ? m.id : `${m.id}-${m.pose}`}.webp`));
  }
});
