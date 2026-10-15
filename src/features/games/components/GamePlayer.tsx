'use client';
import { useDict } from '@/i18n/LocaleProvider';

import dynamic from 'next/dynamic';
import type { GameDefinition } from '../data/catalog';
import { GameShell } from './GameShell';
function Loading() { const { t, sub } = useDict(); return <p role="status">{t.games.player.loading} {sub && <span lang="en">{sub.games.player.loading}</span>}</p>; }
const MatchingBoard = dynamic(() => import('../games/MatchingBoard'), { loading: Loading });
const MemoryBoard = dynamic(() => import('../games/MemoryBoard'), { loading: Loading });
const ShapeBoard = dynamic(() => import('../games/ShapeBoard'), { loading: Loading });
const FindBoard = dynamic(() => import('../games/FindBoard'), { loading: Loading });
const SequenceBoard = dynamic(() => import('../games/SequenceBoard'), { loading: Loading });
const PuzzleBoard = dynamic(() => import('../games/PuzzleBoard'), { loading: Loading });
const LightMazeBoard = dynamic(() => import('../games/LightMazeBoard'), { loading: Loading });
export function GamePlayer({ game }: { game: GameDefinition }) { return <GameShell key={game.slug} game={game} Board={game.slug === 'memory' ? MemoryBoard : game.slug === 'sequence' ? SequenceBoard : game.slug === 'puzzle' ? PuzzleBoard : game.slug === 'shape-match' ? ShapeBoard : game.slug === 'find-object' ? FindBoard : game.slug === 'light-maze' ? LightMazeBoard : MatchingBoard} />; }
