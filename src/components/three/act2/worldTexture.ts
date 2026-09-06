import { CanvasTexture } from "three";

/**
 * Very rough continent silhouettes  [lon, lat] point lists, not real
 * coastline data. Recognizable at globe scale, not survey-accurate; there's
 * no licensed geometry or downloaded asset involved, per the brief's rule
 * that only recognizable *objects* get downloaded models, not the scene's
 * own skeleton.
 */
const CONTINENTS: [number, number][][] = [
  // Africa
  [
    [-17, 35], [10, 37], [33, 31], [42, 12], [51, 12], [42, -1], [40, -15],
    [35, -25], [20, -35], [12, -25], [10, -5], [-5, 5], [-17, 15], [-17, 35],
  ],
  // Europe
  [
    [-10, 36], [-10, 45], [0, 51], [10, 55], [20, 55], [30, 50], [40, 45],
    [30, 42], [20, 40], [10, 38], [-10, 36],
  ],
  // Asia
  [
    [40, 45], [60, 50], [90, 55], [120, 55], [140, 50], [150, 45], [140, 35],
    [120, 20], [100, 10], [90, 10], [70, 20], [60, 30], [50, 35], [40, 45],
  ],
  // North America
  [
    [-160, 65], [-140, 60], [-100, 60], [-80, 50], [-70, 45], [-75, 25],
    [-90, 20], [-105, 20], [-115, 30], [-125, 45], [-140, 55], [-160, 65],
  ],
  // South America
  [
    [-80, 10], [-60, 10], [-50, 0], [-40, -10], [-45, -25], [-55, -40],
    [-65, -55], [-70, -40], [-75, -20], [-80, -5], [-80, 10],
  ],
  // Australia
  [
    [113, -12], [130, -12], [145, -15], [150, -25], [145, -38], [130, -33],
    [115, -35], [113, -25], [113, -12],
  ],
];

/** Equirectangular projection  matches `SphereGeometry`'s default UV layout. */
function project(lon: number, lat: number, width: number, height: number) {
  return [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
}

export function createEarthTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#0a1122";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#2f6bff";
  ctx.strokeStyle = "#4c86ff";
  ctx.lineWidth = 1.5;
  for (const poly of CONTINENTS) {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const [x, y] = project(lon, lat, width, height);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Graticule  the tech/brand touch on top of the geography.
  ctx.strokeStyle = "rgba(34, 211, 238, 0.12)";
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const [x] = project(lon, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project(0, lat, width, height);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
