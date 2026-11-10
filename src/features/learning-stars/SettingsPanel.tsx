'use client';
import { useState, useSyncExternalStore } from 'react';
import { GatedAction, ParentGate } from '@/components/parents/ParentGate';
import { ClearProgress } from '@/app/[lang]/parents/ClearProgress';
import { getSoundSnapshot, getSoundServerSnapshot, subscribeSound, setSoundEnabled } from '@/lib/soundStore';
import { Copy, LearningBalance } from './components';
import { change, giveStars, useLearningState } from './store';
import { LS } from './content';
import type { Text } from '@/i18n/config';
import './learning-stars.css';

function Switch({ label, checked, action }: { label: Text; checked: boolean; action: () => void }) {
  const [gate, setGate] = useState(false);
  return <><button className="ls-button" role="switch" aria-checked={checked} onClick={() => setGate(true)}><Copy text={label} /><Copy text={checked ? LS.on : LS.off} /></button>{gate && <ParentGate onClose={() => setGate(false)} onPass={() => { setGate(false); action(); }} />}</>;
}
export function SettingsPanel() {
  const state = useLearningState();
  const sound = useSyncExternalStore(subscribeSound, getSoundSnapshot, getSoundServerSnapshot);
  const [minutes, setMinutes] = useState<number | null>(null);
  return <div className="ls-settings ls-parent">
    {!state.available && <p role="status"><Copy text={LS.storage} /></p>}
    <section><h2><Copy text={LS.name} /></h2><LearningBalance />
      <p><Copy text={LS.rules} /></p>
      <div className="ls-actions"><Switch label={LS.name} checked={state.settings.starsEnabled} action={() => change(s => ({ ...s, settings: { ...s.settings, starsEnabled: !s.settings.starsEnabled } }))} />
      <GatedAction action={() => giveStars(1)}><Copy text={LS.addOne} /></GatedAction><GatedAction action={() => giveStars(3)}><Copy text={LS.addThree} /></GatedAction></div>
    </section>
    <section><h2><Copy text={LS.timeSettings} /></h2><p><Copy text={LS.timeRules} /></p>
      <Switch label={LS.timeSettings} checked={state.settings.timeEnabled} action={() => change(s => ({ ...s, settings: { ...s.settings, timeEnabled: !s.settings.timeEnabled } }))} />
      <p><label htmlFor="ls-minutes"><Copy text={LS.minutes} /></label> <select id="ls-minutes" value={state.settings.minutes} onChange={e => setMinutes(Number(e.target.value))}>{[15,20,30,45,60,90].map(n => <option key={n} value={n}>{n}</option>)}</select></p>
      <p className="ls-used"><Copy text={LS.used} /><strong>{Math.floor(state.time.used / 60000)}</strong></p>
      <GatedAction action={() => change(s => ({ ...s, time: { ...s.time, used: 0, extra: 0, unlimited: false, warned: false } }))}><Copy text={LS.resetTime} /></GatedAction>
      <p><Copy text={LS.device} /></p>
    </section>
    <section><h2><Copy text={LS.sound} /></h2><Switch label={LS.sound} checked={sound} action={() => setSoundEnabled(!sound)} /></section>
    <section><ClearProgress /></section>
    {minutes !== null && <ParentGate onClose={() => setMinutes(null)} onPass={() => { change(s => ({ ...s, settings: { ...s.settings, minutes }, time: { ...s.time, warned: false } })); setMinutes(null); }} />}
  </div>;
}
