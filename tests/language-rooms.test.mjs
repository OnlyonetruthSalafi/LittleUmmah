import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSES, courseAudio, isRoom } from '../src/features/languages/courses.ts';

test('each course exposes both ages and unique step ids', () => {
  for (const course of Object.values(COURSES)) {
    const ids = [];
    for (const group of ['kids', 'juniors']) {
      assert.ok(course.units[group].length > 0, `${course.id}: ${group}`);
      for (const unit of course.units[group]) {
        assert.ok(unit.steps.length > 0);
        ids.push(...unit.steps.map(step => step.id));
      }
    }
    assert.equal(new Set(ids).size, ids.length, `${course.id}: unique ids`);
  }
});
test('letter paths and progress stores stay separate', () => {
  for (const [id, count] of [['english', 26], ['thai', 44], ['arabic', 28]]) {
    assert.equal(COURSES[id].units.kids.length, 1);
    assert.equal(COURSES[id].units.kids[0].steps.length, count);
    assert.equal(COURSES[id].progressKey, `lu-${id}-learned-v1`);
  }
});
test('Arabic audio is unchanged; new rooms share cheer/done only', () => {
  assert.equal(COURSES.arabic.audioFolder, '/audio/th/class');
  assert.equal(COURSES.arabic.progressKey, 'lu-arabic-learned-v1');
  for (const locale of ['th', 'en']) {
    for (const key of ['teach-alif', 'say-alif', 'course-done', 'cheer-1', 'done']) {
      assert.equal(courseAudio(COURSES.arabic, locale, key), `/audio/${locale}/class/${key}.mp3`);
    }
  }
  for (const [id, folder] of [['english', 'en'], ['thai', 'th']]) {
    for (const key of ['teach-example', 'say-example', 'course-done']) {
      assert.equal(courseAudio(COURSES[id], 'th', key), `/audio/th/class/${folder}/${key}.mp3`);
    }
    for (const key of ['cheer-1', 'cheer-2', 'cheer-3', 'done']) {
      assert.equal(courseAudio(COURSES[id], 'th', key), `/audio/th/class/${key}.mp3`);
    }
  }
  for (const room of ['bengali', 'indonesian', 'unknown', 'toString']) assert.equal(isRoom(room), false);
});
