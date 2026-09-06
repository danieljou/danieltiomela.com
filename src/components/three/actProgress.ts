/**
 * The three acts share one continuous scroll range, weighted 500/300/400vh
 * per the brief (desktop)  Act I is the longest journey, Act II is a
 * shorter contemplative beat, Act III is the exploratory close.
 */
export const ACT_VH = { act1: 500, act2: 300, act3: 400 };
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
