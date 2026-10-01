'use client';
import { BackLink } from '@/components/ui/BackLink';
export default function GameError({ reset }: { reset: () => void }) { return <main className="gc-world gc-focus"><section className="gc-panel gc-intro"><h1>พักสักนิด แล้วลองใหม่</h1><p lang="en">Let’s try again.</p><button className="gc-button gc-primary" onClick={reset}>ลองใหม่ <small lang="en">Retry</small></button><BackLink href="/games" labelTh="รวมเกม" labelEn="Game Hub" /></section></main>; }
