import { Vector3 } from "three";

/** One control point per Act I stage  shared by every piece of the scene. */
export const POINTS: [number, number, number][] = [
  [0, 0, 4],
  [1.3, 0.4, 2],
  [0, -0.3, 0],
  [-1.3, 0.5, -2],
  [0, 0, -4],
];

export const STAGE_COUNT = POINTS.length;

export function stageT(i: number) {
  return i / (STAGE_COUNT - 1);
}

/** Chase-cam offset from the node curve  see SystemJourney for why. */
export const CAMERA_OFFSET = new Vector3(0, 0.9, 2.4);
