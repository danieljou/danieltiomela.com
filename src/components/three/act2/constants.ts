import { Vector3 } from "three";

export const GLOBE_RADIUS = 1.5;

/** Real geographic coordinates  a decorative globe still shouldn't lie about geography. */
export function latLongToVector3(lat: number, lon: number, radius = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export const YAOUNDE = { lat: 3.848, lon: 11.502 };

/**
 * Real delivery locations, matching `immersive.act2.missions` in the
 * dictionary (index-aligned: 0 = Benin, 1 = Douala). Hover shows the city
 * name only  the full mission text already lives in the HTML list beside
 * the globe.
 */
export const MISSION_POINTS = [
  { lat: 6.3703, lon: 2.3912 }, // Benin (Cotonou)
  { lat: 4.0511, lon: 9.7679 }, // Douala
];
