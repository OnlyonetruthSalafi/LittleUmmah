'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';
import { SoundToggle } from '@/components/sound/SoundToggle';
import type { Text } from '@/i18n/config';
import { useLocale } from '@/i18n/LocaleProvider';
import { Label } from '../vip/Labels';
import { vip } from '../vip/content';
import conversation from './conversation.json';
import styles from './conversation.module.css';

export type Exchange = 'greeting' | 'reply' | 'replyLong' | 'ordering';
export type Reply = 'reply' | 'replyLong';

type Props = {
  phase: Exchange;
  speaker: Text;
  line: Text;
  ticket: ReactNode;
  enabled: boolean;
  /** False while the customer is still saying salam. */
  greeted: boolean;
  /** The browser blocked the salam until a tap; offer a big button to hear it. */
  needsTap: boolean;
  onHear: () => void;
  onListen: () => void;
  onReply: (reply: Reply) => void;
  onAccept: () => void;
  onDefer: () => void;
};

export function CounterConversation({phase, speaker, line, ticket, enabled, greeted, needsTap, onHear, onListen, onReply, onAccept, onDefer}: Props) {
  const lang = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  useEffect(() => { heading.current?.focus({preventScroll:true}); }, [phase]);
  const answering = phase === 'reply' || phase === 'replyLong';
  const title = phase === 'greeting' ? vip.returnSalam : answering ? vip.yourReply : vip.ticket;
  return <dialog ref={dialog} className={styles.popup} aria-labelledby="shop-talk-title" aria-describedby="shop-talk-line"
    onCancel={e => { e.preventDefault(); onDefer(); }}>
    <div className={styles.content}>
      <header><h2 id="shop-talk-title" ref={heading} tabIndex={-1}><Label text={title} /></h2><SoundToggle /></header>
      <div className={styles.bubble}>
        <strong><Label text={speaker} /></strong>
        <p id="shop-talk-line"><Label text={line} /></p>
        {!answering && <button className={styles.listen} type="button" aria-label={(phase === 'greeting' ? vip.replayGreeting : vip.replay)[lang]}
          disabled={!enabled} onClick={onListen}><SpeakerIcon on={enabled}/></button>}
      </div>
      {phase === 'ordering' && ticket}
      <div className={styles.choices}>
        {phase === 'greeting' && needsTap && <button type="button" className={styles.hear} onClick={onHear}>
          <SpeakerIcon on /><Label text={vip.hearSalam} /></button>}
        {phase === 'greeting' && greeted && (['reply','replyLong'] as const).map(option =>
          <button type="button" key={option} onClick={()=>onReply(option)}><Label text={conversation[option]} /></button>)}
        {phase === 'ordering' && <button type="button" onClick={onAccept}><Label text={vip.take} /></button>}
      </div>
      <button type="button" className={styles.later} onClick={onDefer}><Label text={vip.later} /></button>
    </div>
  </dialog>;
}
