import { CanvasTexture, SRGBColorSpace } from "three";

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

const WIDTH = 2048;
const HEIGHT = 1024;

/** Equirectangular projection  matches `SphereGeometry`'s default UV layout. */
function project(lon: number, lat: number) {
  return [((lon + 180) / 360) * WIDTH, ((90 - lat) / 180) * HEIGHT];
}

/**
 * A halftone globe: land is a field of dots, sea is near-black. Because the
 * silhouettes above are approximate, dots hide that better than a solid fill
 * would  it reads as a deliberate data-globe style, not a coarse map. Dot
 * spacing is corrected by cos(latitude) so density stays even on the sphere.
 */
export function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Land mask, offscreen.
  const mask = document.createElement("canvas");
  mask.width = WIDTH;
  mask.height = HEIGHT;
  const mctx = mask.getContext("2d", { willReadFrequently: true });
  if (!mctx) return null;
  mctx.fillStyle = "#fff";
  for (const poly of CONTINENTS) {
    mctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      if (i === 0) mctx.moveTo(x, y);
      else mctx.lineTo(x, y);
    });
    mctx.closePath();
    mctx.fill();
  }
  const data = mctx.getImageData(0, 0, WIDTH, HEIGHT).data;
  const isLand = (x: number, y: number) => {
    const ix = Math.min(WIDTH - 1, Math.max(0, Math.round(x)));
    const iy = Math.min(HEIGHT - 1, Math.max(0, Math.round(y)));
    return data[(iy * WIDTH + ix) * 4] > 128;
  };

  // Sea: a deep blue with a faint vertical falloff toward the poles.
  const sea = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sea.addColorStop(0, "#0b1a38");
  sea.addColorStop(0.5, "#0d2148");
  sea.addColorStop(1, "#0b1a38");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Graticule.
  ctx.strokeStyle = "rgba(76, 134, 255, 0.16)";
  ctx.lineWidth = 1.2;
  for (let lon = -180; lon <= 180; lon += 15) {
    const [x] = project(lon, 0);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = project(0, lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  // Land dots.
  const rowStep = 1.7; // degrees of latitude between rows
  for (let lat = -80; lat <= 80; lat += rowStep) {
    const colStep = rowStep / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += colStep) {
      const [x, y] = project(lon, lat);
      if (!isLand(x, y)) continue;
      const shade = 0.55 + 0.45 * Math.abs(Math.sin(lon * 0.37 + lat * 0.21));
      ctx.fillStyle = `rgba(103, 232, 249, ${shade.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
