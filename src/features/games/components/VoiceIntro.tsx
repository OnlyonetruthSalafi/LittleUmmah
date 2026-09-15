'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GameImage as Image } from './GameImage';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';
import { Thumbnail } from './Artwork';
import { PlayDemo } from './PlayDemo';
import { gameAssets, type GameDefinition } from '../data/catalog';
import { playNarration, stopAllSpeech } from '@/lib/speech';

/*
  หน้าแนะนำเกมแบบ "หุ่นยนต์สอนด้วยเสียง"

  เหตุผล: หน้าแนะนำเดิมมีข้อความหกก้อน (คำโปรย + คำสั่ง + คำอธิบาย + วิธีเล่น + ป้ายชื่อโลก)
  แต่ละก้อนมีภาษาอังกฤษกำกับอีกบรรทัด กลายเป็นกำแพงตัวอักษรที่เด็กวัย 3–6 ปีอ่านไม่ออกอยู่ดี
  เจ้าของโปรเจกต์จึงให้ตัดตัวหนังสือออกจากจอทั้งหมด เหลือสามอย่าง:
  หุ่นยนต์พูดสอน · มือขาวลากให้ดูเป็นตัวอย่าง · ปุ่มเริ่มเล่น

  คำสั่งยังอยู่ในหน้าเว็บในฐานะหัวข้อของ screen reader (sr-only)
  ไม่ได้แสดงบนจอ แต่ผู้ใช้ที่ฟังหน้าเว็บด้วยเครื่องอ่านยังรู้ว่าเกมนี้ให้ทำอะไร
  และหน้าเล่นจริงยังมีคำสั่งเป็นตัวหนังสือเหมือนเดิม

  **ปุ่มเริ่มเล่นแสดงตลอดเวลาและกดได้ตั้งแต่วินาทีแรก** รวมถึงระหว่างที่หุ่นยนต์กำลังพูด
  เด็กที่เล่นเกมนี้เป็นแล้วจะได้ไม่ต้องยืนรอฟังคำอธิบายซ้ำทุกครั้ง (เจ้าของโปรเจกต์กำหนด)
  พอกดปุ่ม component ถูกถอดออก cleanup จะหยุดเสียงที่ค้างอยู่ให้เอง
  ตัวแปร ready จึงมีไว้แค่ "เน้นปุ่มตอนพูดจบ" ไม่ได้กั้นการกดอีกต่อไป
*/

/** เพดานเวลา เผื่อ event 'ended' ไม่มาเลย ปุ่มจะได้ไม่หายไปตลอดกาล */
const VOICE_CEILING_MS = 45000;

export function VoiceIntro({ game, soundOn, speechBroken, onStart }: {
  game: GameDefinition; soundOn: boolean; speechBroken: boolean; onStart: () => void;
}) {
  const voiceReady = soundOn && !speechBroken;
  /** พูดอยู่ไหม ใช้แค่โชว์คลื่นเสียง ไม่มีผลกับการกดปุ่ม */
  const [talking, setTalking] = useState(voiceReady);
  /** หุ่นยนต์พูดจบหรือยัง ใช้แค่เน้นปุ่มตอนพูดจบ ไม่ได้กั้นการกด */
  const [ready, setReady] = useState(!voiceReady);
  /** เพิ่มขึ้นทุกครั้งที่กดฟังซ้ำ เพื่อให้ effect เริ่มเสียงรอบใหม่ */
  const [replay, setReplay] = useState(0);
  const cancel = useRef<(() => void) | undefined>(undefined);
  const ceiling = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const finish = useCallback(() => {
    setTalking(false);
    setReady(true);
    clearTimeout(ceiling.current);
  }, []);

  useEffect(() => {
    if (!voiceReady) return;
    clearTimeout(ceiling.current);
    ceiling.current = setTimeout(finish, VOICE_CEILING_MS);
    cancel.current = playNarration(`/audio/th/howto-${game.slug}.mp3`, {
      onEnded: finish,
      // เด็กกดปิดเสียงกลางคัน หรือมีเสียงอื่นแทรก — ให้ปุ่มโผล่เลย จะได้ไม่ค้างรอเสียงที่ไม่มีวันจบ
      onStopped: finish,
      onFail: finish,
    });
    return () => {
      cancel.current?.();
      clearTimeout(ceiling.current);
      stopAllSpeech();
    };
  }, [game.slug, voiceReady, replay, finish]);

  const listenAgain = () => {
    if (!voiceReady) return;
    setTalking(true);
    setReplay(r => r + 1);
  };

  return <section className="gc-voice-intro" aria-labelledby="gc-voice-title">
    {/* คำสั่งไม่แสดงบนจอตามที่เจ้าของโปรเจกต์กำหนด แต่ยังเป็นหัวข้อของส่วนนี้ให้เครื่องอ่านหน้าจอ */}
    <h2 id="gc-voice-title" className="sr-only">{game.title.th} — {game.instruction.th}<span lang="en"> ({game.instruction.en})</span></h2>

    <div className="gc-voice-scene">
      <div className="gc-adventure-aura" aria-hidden="true" />
      <div className="gc-adventure-island">
        <Thumbnail slug={game.slug} large />
        {/* มือขาวลากรูปทรงลงหลุมให้ดูเป็นตัวอย่าง แทนคำอธิบายที่เป็นตัวหนังสือ
            ต้องอยู่ข้างในกรอบภาพเกาะ เพราะพิกัดทั้งหมดเป็นเปอร์เซ็นต์ของภาพ ไม่ใช่ของฉาก */}
        <PlayDemo />
      </div>
      <Image src={gameAssets.guide} width={200} height={240} alt="" className="gc-voice-robot" />
      {/* คลื่นเสียงตอนหุ่นยนต์พูด — เป็นภาพประกอบเสียงพูด ไม่ใช่สัญลักษณ์ดนตรี (ข้อ 1.3) */}
      {talking && <span className="gc-voice-wave" aria-hidden="true"><i /><i /><i /></span>}
    </div>

    <div className="gc-voice-actions">
      <button type="button" className="gc-start-3d" onClick={onStart} data-ready={ready}>
        เริ่มเล่น<small lang="en">Start</small>
      </button>
      {/* ปุ่มกดได้ตลอด เด็กที่เล่นเป็นแล้วข้ามคำอธิบายได้เลย บรรทัดนี้บอกเครื่องอ่านหน้าจอว่าตอนนี้เป็นช่วงไหน */}
      <p className="sr-only" role="status">{ready ? 'หุ่นยนต์บอกวิธีเล่นจบแล้ว' : 'หุ่นยนต์กำลังบอกวิธีเล่น กดเริ่มเล่นข้ามได้'}</p>

      <button type="button" className="gc-voice-replay" onClick={listenAgain} aria-label="ฟังวิธีเล่นอีกครั้ง / Listen again">
        <SpeakerIcon className="h-7 w-7" />
      </button>
    </div>
  </section>;
}
