import type { ReactNode } from 'react';
import { ClosedIsland } from '@/features/games/vip/ClosedIsland';

export default function VipLayout({ children }: { children: ReactNode }) {
  // The island is a development preview until a paid entitlement provider is connected.
  return process.env.NODE_ENV === 'development' ? children : <ClosedIsland />;
}
