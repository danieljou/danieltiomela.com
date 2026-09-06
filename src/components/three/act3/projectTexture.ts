import { CanvasTexture } from "three";
import type { ObjectKind } from "./constants";

const WIDTH = 768;
const HEIGHT = 480;
const CHROME_H = 40;

const INK = "#0a1122";
const PANEL = "#0f1729";
const PANEL_LIGHT = "#131f38";
const BLUE = "#2f6bff";
const BLUE_SOFT = "#4c86ff";
const CYAN = "#22d3ee";
const MUTED = "#7f92b8";
const TEXT = "#e7ecf7";

/**
 * Deterministic pseudo-random stream seeded from the project slug, not
 * `Math.random`  the render-purity lint rule (React Compiler compatibility)
 * flags impure calls made during render, and a texture that reshuffled on
 * every remount would also be a distracting regression in its own right.
 */
function seededRng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Browser-style chrome bar, shared by every kind so each screen still reads
    as "a real app", not a bespoke diagram. */
function drawChrome(ctx: CanvasRenderingContext2D, label: string) {
  ctx.fillStyle = "#0d1420";
  ctx.fillRect(0, 0, WIDTH, CHROME_H);
  const dots = [BLUE, CYAN, MUTED];
  dots.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(22 + i * 20, CHROME_H / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  roundRect(ctx, 100, 10, 280, 20, 10);
  ctx.fillStyle = "#0a1122";
  ctx.fill();
  ctx.fillStyle = MUTED;
  ctx.font = "13px 'JetBrains Mono', 'Courier New', monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 114, CHROME_H / 2 + 1);
}

function drawWeb(ctx: CanvasRenderingContext2D, rng: () => number, name: string, stack: string[]) {
  ctx.fillStyle = INK;
  ctx.fillRect(0, CHROME_H, WIDTH, HEIGHT - CHROME_H);

  // Sidebar
  const sideW = 130;
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, CHROME_H, sideW, HEIGHT - CHROME_H);
  for (let i = 0; i < 5; i++) {
    const y = CHROME_H + 28 + i * 34;
    ctx.fillStyle = i === 1 ? BLUE : "#24314f";
    roundRect(ctx, 16, y, sideW - 32, 10, 5);
    ctx.fill();
  }

  // KPI cards
  const cardY = CHROME_H + 20;
  const cardW = 175;
  const cardGap = 14;
  const labels = stack.length ? stack : ["Requests", "Uptime", "Latency"];
  for (let i = 0; i < 3; i++) {
    const x = sideW + 20 + i * (cardW + cardGap);
    roundRect(ctx, x, cardY, cardW, 78, 10);
    ctx.fillStyle = PANEL_LIGHT;
    ctx.fill();
    ctx.fillStyle = TEXT;
    ctx.font = "bold 26px 'Inter', sans-serif";
    ctx.fillText(`${Math.floor(rng() * 900 + 100)}${i === 1 ? "%" : ""}`, x + 16, cardY + 34);
    ctx.fillStyle = MUTED;
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText((labels[i % labels.length] ?? "Metric").slice(0, 18), x + 16, cardY + 58);
  }

  // Chart panel
  const chartX = sideW + 20;
  const chartY = cardY + 96;
  const chartW = WIDTH - chartX - 20;
  const chartH = HEIGHT - chartY - 20;
  roundRect(ctx, chartX, chartY, chartW, chartH, 10);
  ctx.fillStyle = PANEL_LIGHT;
  ctx.fill();
  const bars = 10;
  const barW = (chartW - 32) / bars - 6;
  for (let i = 0; i < bars; i++) {
    const h = 14 + rng() * (chartH - 40);
    const x = chartX + 16 + i * ((chartW - 32) / bars);
    const y = chartY + chartH - 16 - h;
    ctx.fillStyle = i % 3 === 0 ? CYAN : BLUE_SOFT;
    roundRect(ctx, x, y, barW, h, 3);
    ctx.fill();
  }

  ctx.fillStyle = TEXT;
  ctx.font = "bold 15px 'Inter', sans-serif";
  ctx.fillText(name, sideW + 20, CHROME_H + 14);
}

function drawGeo(ctx: CanvasRenderingContext2D, rng: () => number, name: string, stack: string[]) {
  ctx.fillStyle = "#081020";
  ctx.fillRect(0, CHROME_H, WIDTH, HEIGHT - CHROME_H);

  const mapW = WIDTH - 210;
  const mapH = HEIGHT - CHROME_H;

  // Graticule
  ctx.strokeStyle = "rgba(34, 211, 238, 0.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= mapW; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, CHROME_H);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = CHROME_H; y <= HEIGHT; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(mapW, y);
    ctx.stroke();
  }

  // A handful of administrative-boundary-looking blobs.
  for (let i = 0; i < 4; i++) {
    const cx = 60 + rng() * (mapW - 120);
    const cy = CHROME_H + 40 + rng() * (mapH - 100);
    const points = 6 + Math.floor(rng() * 3);
    ctx.beginPath();
    for (let p = 0; p < points; p++) {
      const angle = (p / points) * Math.PI * 2;
      const radius = 26 + rng() * 30;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.7;
      if (p === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "rgba(47,107,255,0.35)" : "rgba(34,211,238,0.22)";
    ctx.fill();
    ctx.strokeStyle = BLUE_SOFT;
    ctx.stroke();
  }

  // Pins
  for (let i = 0; i < 5; i++) {
    const x = 40 + rng() * (mapW - 80);
    const y = CHROME_H + 30 + rng() * (mapH - 70);
    ctx.fillStyle = CYAN;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(34,211,238,0.4)";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Side data panel
  ctx.fillStyle = PANEL;
  ctx.fillRect(mapW, CHROME_H, 210, mapH);
  ctx.fillStyle = TEXT;
  ctx.font = "bold 15px 'Inter', sans-serif";
  ctx.fillText(name.slice(0, 22), mapW + 16, CHROME_H + 26);
  const rows = stack.length ? stack : ["Layer A", "Layer B", "Layer C", "Layer D"];
  rows.slice(0, 5).forEach((row, i) => {
    const y = CHROME_H + 54 + i * 30;
    ctx.fillStyle = i % 2 === 0 ? BLUE : CYAN;
    roundRect(ctx, mapW + 16, y, 10, 10, 2);
    ctx.fill();
    ctx.fillStyle = MUTED;
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(row.slice(0, 20), mapW + 34, y + 9);
  });
}

function drawInfra(ctx: CanvasRenderingContext2D, rng: () => number, name: string, stack: string[]) {
  ctx.fillStyle = "#070c16";
  ctx.fillRect(0, CHROME_H, WIDTH, HEIGHT - CHROME_H);

  // Service topology graph.
  const nodeLabels = stack.length ? stack : ["api", "db", "cache", "worker"];
  const nodeCount = Math.min(5, Math.max(3, nodeLabels.length));
  const nodeW = 118;
  const nodeH = 46;
  const graphY = CHROME_H + 30;
  const gap = (WIDTH - 40 - nodeCount * nodeW) / (nodeCount - 1 || 1);
  const centers: [number, number][] = [];
  for (let i = 0; i < nodeCount; i++) {
    const x = 20 + i * (nodeW + gap);
    const y = graphY + (i % 2 === 0 ? 0 : 40);
    centers.push([x + nodeW / 2, y + nodeH / 2]);
  }
  ctx.strokeStyle = "rgba(76,134,255,0.5)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < centers.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(centers[i][0], centers[i][1]);
    ctx.lineTo(centers[i + 1][0], centers[i + 1][1]);
    ctx.stroke();
  }
  centers.forEach(([cx, cy], i) => {
    const x = cx - nodeW / 2;
    const y = cy - nodeH / 2;
    roundRect(ctx, x, y, nodeW, nodeH, 8);
    ctx.fillStyle = PANEL_LIGHT;
    ctx.fill();
    ctx.strokeStyle = "#24314f";
    ctx.stroke();
    ctx.fillStyle = rng() > 0.15 ? CYAN : "#f2b84b";
    ctx.beginPath();
    ctx.arc(x + 12, y + 12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = TEXT;
    ctx.font = "12px 'JetBrains Mono', 'Courier New', monospace";
    ctx.fillText((nodeLabels[i % nodeLabels.length] ?? "svc").slice(0, 12), x + 22, y + nodeH / 2 + 4);
  });

  // Terminal / log panel.
  const logY = graphY + 130;
  roundRect(ctx, 20, logY, WIDTH - 40, HEIGHT - logY - 20, 10);
  ctx.fillStyle = "#050a12";
  ctx.fill();
  ctx.strokeStyle = "#182236";
  ctx.stroke();
  const statuses = ["deployed", "healthy", "scaled", "synced", "OK"];
  ctx.font = "12px 'JetBrains Mono', 'Courier New', monospace";
  for (let i = 0; i < 5; i++) {
    const y = logY + 24 + i * 22;
    ctx.fillStyle = MUTED;
    ctx.fillText(`[${(10 + i).toString().padStart(2, "0")}:0${i}:12]`, 34, y);
    ctx.fillStyle = TEXT;
    ctx.fillText(name.slice(0, 16).toLowerCase().replace(/\s+/g, "-"), 150, y);
    ctx.fillStyle = i % 3 === 0 ? "#f2b84b" : CYAN;
    ctx.fillText(statuses[Math.floor(rng() * statuses.length)], 340, y);
  }
}

/**
 * A per-project "screen" texture  a plausible dashboard, map view, or
 * ops console rendered from the project's own kind, name and stack, not a
 * real screenshot: several projects here are confidentiality-anonymised, so
 * nothing genuinely reproduces a client's actual interface. It reads as a
 * real product screen where the earlier abstract boxes/wireframe read as a
 * diagram.
 */
export function createProjectTexture({
  slug,
  name,
  kind,
  stack,
}: {
  slug: string;
  name: string;
  kind: ObjectKind;
  stack: string[];
}) {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const rng = seededRng(slug);
  const chromeLabel = kind === "infra" ? `$ kubectl get pods -n ${slug.split("-")[0]}` : `${slug}.app`;
  drawChrome(ctx, chromeLabel);

  if (kind === "geo") drawGeo(ctx, rng, name, stack);
  else if (kind === "infra") drawInfra(ctx, rng, name, stack);
  else drawWeb(ctx, rng, name, stack);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.anisotropy = 4;
  return texture;
}
