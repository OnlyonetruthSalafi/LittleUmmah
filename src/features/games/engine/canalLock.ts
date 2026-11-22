export type Berth = 'approach' | 'chamber' | 'harbour';
export type LockAction = 'fill' | 'drain' | 'open';
export type LockState = { water: number; berth: Berth };
type Mission = { left: number; right: number; start: LockState };

const missions: readonly Mission[] = [
  { left: 0, right: 2, start: { water: 1, berth: 'chamber' } },
  { left: 2, right: 0, start: { water: 2, berth: 'approach' } },
  { left: 0, right: 2, start: { water: 1, berth: 'approach' } },
];
export function canalMission(level: number) { return missions[level - 1] ?? missions[0]; }

export function lockTarget(mission: Mission, berth: Berth) {
  return berth === 'approach' ? mission.left : mission.right;
}
export function nextLockAction(mission: Mission, state: LockState): LockAction {
  const target = lockTarget(mission, state.berth);
  if (state.water === target) return 'open';
  return state.water < target ? 'fill' : 'drain';
}

// A crossing can start only when the water surfaces on both sides of that gate meet.
export function operateLock(mission: Mission, state: LockState, action: LockAction): LockState {
  if (state.berth === 'harbour') return state;
  if (action === 'open') {
    if (state.water !== lockTarget(mission, state.berth)) return state;
    return { ...state, berth: state.berth === 'approach' ? 'chamber' : 'harbour' };
  }
  const water = Math.min(2, Math.max(0, state.water + (action === 'fill' ? 1 : -1)));
  return water === state.water ? state : { ...state, water };
}
