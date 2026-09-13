'use client';
import dynamic from 'next/dynamic';
import type { GameDefinition } from '../data/catalog';
import { GameShell } from './GameShell';
const loading = () => <p role="status">กำลังเตรียมเกม… <span lang="en">Getting ready…</span></p>;
const MatchingBoard = dynamic(() => import('../games/MatchingBoard'), { loading });
const MemoryBoard = dynamic(() => import('../games/MemoryBoard'), { loading });
const FindBoard = dynamic(() => import('../games/FindBoard'), { loading });
export function GamePlayer({ game }: { game: GameDefinition }) { return <GameShell key={game.slug} game={game} Board={game.slug === 'memory' ? MemoryBoard : game.slug === 'find-object' ? FindBoard : MatchingBoard} />; }
