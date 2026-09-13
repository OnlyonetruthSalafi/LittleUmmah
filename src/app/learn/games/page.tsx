import { redirect } from 'next/navigation';
// Preserve existing island links. Focus mode lives outside the /learn layout.
export default function GamesIslandPage() { redirect('/games'); }
