/**
 * The three acts share one continuous scroll range. Act III got a
 * significant bump over the brief's original 400vh: once it plays through
 * its seven projects one at a time (matching Act I's paced stages) rather
 * than presenting them all at once, it needs roughly as much room per
 * "stage" as Act I does (500vh / 5 stages = 100vh each  seven projects
 * at that pace is ~700vh). Act II grew a little too, since a shaded,
 * textured globe with an atmosphere and a starfield deserves more than a
 * rushed pass-through.
 */
export const ACT_VH = { act1: 500, act2: 400, act3: 700 };
const TOTAL_VH = ACT_VH.act1 + ACT_VH.act2 + ACT_VH.act3;

export const ACT_BOUNDARIES = [
  0,
  ACT_VH.act1 / TOTAL_VH,
  (ACT_VH.act1 + ACT_VH.act2) / TOTAL_VH,
  1,
];

export interface ActState {
  actIndex: 0 | 1 | 2;
  /** 0 to 1 within the active act only. */
  subProgress: number;
}

export function getActState(progress: number): ActState {
  for (let i = 0; i < 3; i++) {
    const start = ACT_BOUNDARIES[i];
    const end = ACT_BOUNDARIES[i + 1];
    if (progress < end || i === 2) {
      const sub = (progress - start) / (end - start);
      return { actIndex: i as 0 | 1 | 2, subProgress: Math.min(1, Math.max(0, sub)) };
    }
  }
  return { actIndex: 2, subProgress: 1 };
}
