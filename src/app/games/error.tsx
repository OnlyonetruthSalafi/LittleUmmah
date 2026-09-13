'use client';
import Link from 'next/link';
export default function GameError({ reset }: { reset: () => void }) { return <main className="gc-world gc-focus"><section className="gc-panel gc-intro"><h1>พักสักนิด แล้วลองใหม่</h1><p lang="en">Let’s try again.</p><button className="gc-button" onClick={reset}>ลองใหม่ <small lang="en">Retry</small></button><Link className="gc-button" href="/games">รวมเกม <small lang="en">Game Hub</small></Link></section></main>; }
