import test from 'node:test';
import assert from 'node:assert/strict';
import { landscapeProblems } from '../scripts/game-landscape-stage1.mjs';
import { gamePresentation } from '../src/features/games/data/presentation.ts';
import { SHOW_REWARD_STARS } from '../src/lib/rewardStars.ts';
const button={w:64,h:64,x:8,y:8,label:'control',classes:'gc-button',inside:true,centerHit:true};
const row={slug:'color-match',width:568,height:320,scrollWidth:568,scrollHeight:320,buttons:[button],brokenImages:[],fallbacks:0};

test('landscape audit requires both viewport fit and usable child controls',()=>{
  assert.deepEqual(landscapeProblems(row),[]);
  assert.match(landscapeProblems({...row,scrollHeight:321}).join(),/overflow/);
  assert.match(landscapeProblems({...row,scrollWidth:569}).join(),/overflow/);
  // overflow:hidden alone cannot make the audit pass.
  assert.match(landscapeProblems({...row,buttons:[{...button,inside:false}]}).join(),/outside/);
  assert.match(landscapeProblems({...row,buttons:[{...button,w:63}]}).join(),/small/);
  assert.match(landscapeProblems({...row,buttons:[{...button,centerHit:false}]}).join(),/covered/);
  assert.match(landscapeProblems({...row,buttons:[{...button,contentOverflow:true}]}).join(),/text overflow/);
  assert.match(landscapeProblems({...row,brokenImages:['missing.webp']}).join(),/artwork missing/);
});

test('island exceptions never exempt rail controls or waiting sequence toys',()=>{
  const small={...button,w:42,h:42};
  assert.deepEqual(landscapeProblems({...row,slug:'shape-match',buttons:[{...small,item:'circle'}]}),[]);
  assert.deepEqual(landscapeProblems({...row,slug:'sequence',buttons:[{...small,drop:'sequence-slot-0'}]}),[]);
  for(const slug of ['shape-match','sequence']) assert.match(landscapeProblems({...row,slug,buttons:[small]}).join(),/small/);
  assert.match(landscapeProblems({...row,slug:'sequence',buttons:[{...small,item:'size-0'}]}).join(),/small/);
});

test('only stage-one games opt in, and legacy reward stars stay hidden',()=>{
  assert.deepEqual(Object.entries(gamePresentation).filter(([,v])=>v.landscapeBoard).map(([k])=>k).sort(),['arabic-match','color-match','find-object','sequence','shape-match','sort']);
  assert.equal(gamePresentation.memory.fullscreen,undefined);
  assert.equal(gamePresentation.puzzle.fullscreen,undefined);
  assert.equal(gamePresentation['light-maze'].fullscreen,true);
  assert.equal(SHOW_REWARD_STARS,false);
});

const luminance=hex=>hex.match(/[a-f\d]{2}/gi).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((a,n,i)=>a+n*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (values[0]+.05)/(values[1]+.05);};
test('landscape labels and control palettes exceed 4.5:1',()=>{
  for(const [ink,paper] of [['#1f2937','#ffffff'],['#1f2937','#fff7d5'],['#1f2937','#eaf6ff'],['#1e5fbf','#ffffff'],['#1e5fbf','#fff7d5'],['#4a2600','#eb8f10']]) assert.ok(contrast(ink,paper)>=4.5,`${ink} on ${paper}`);
});
