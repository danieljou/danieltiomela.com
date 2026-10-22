"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace, type Group } from "three";
import { Glow } from "../shared/Glow";
import { Interactive, useStage } from "./context";
import {
  ApiGraph,
  Containers,
  GeoGlobe,
  Layers,
  Phone,
  Pipeline,
  Rack,
  Site,
  TowerLayer,
  WebApp,
} from "./models";
import { ProjectObject } from "../act3/ProjectObject";
import type { ObjectKind } from "../act3/constants";

/** The page's words sit on the left; the scene is shifted right to clear them. */
const SHIFT = 1.7;
const TAU = Math.PI * 2;

export interface ScreenData {
  slug: string;
  name: string;
  stack: string[];
  kind: ObjectKind;
  href: string;
  label: string;
}

/* ── carousel: objects on a turntable, the current one turned to face you ─ */
const CAROUSEL = [Rack, GeoGlobe, Containers, WebApp, Site, Phone];
export function Carousel() {
  const { s, count } = useStage();
  const turn = useRef<Group>(null);
  // Wide enough that neighbours never overlap, whatever the count.
  const R = Math.max(2.6, count * 0.58);
  useFrame(() => {
    if (turn.current) turn.current.rotation.y = s.c * (TAU / count) + s.drag;
  });
  return (
    // Pushed back by R so the focused object stands at the middle of the stage.
    <group position={[SHIFT, 0, -R]}>
      <group ref={turn}>
        {Array.from({ length: count }, (_, i) => {
          const Model = CAROUSEL[i % CAROUSEL.length];
          const a = Math.PI / 2 + i * (TAU / count);
          return (
            <group key={i} position={[Math.cos(a) * R, 0, Math.sin(a) * R]} rotation={[0, -i * (TAU / count), 0]}>
              <Interactive index={i}>
                <Model />
              </Interactive>
            </group>
          );
        })}
      </group>
      {/* The turntable itself: a wide ring under everything. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.09, 0]}>
        <ringGeometry args={[R - 0.02, R + 0.02, 120]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ── rail: objects in a row, the camera sliding along it ───────────────── */
const RAIL = [WebApp, ApiGraph, Layers, Pipeline, Phone];
const RAIL_STEP = 3.7;
function RailSlot({ index, children }: { index: number; children: React.ReactNode }) {
  const { s } = useStage();
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const off = index - s.c;
    // Turn toward the middle as it leaves it  the row bends around the viewer.
    ref.current.rotation.y = Math.max(-0.7, Math.min(0.7, off * -0.35)) + s.drag * 0.4;
  });
  return (
    <group ref={ref} position={[index * RAIL_STEP, 0, Math.abs(index) * 0]}>
      {children}
    </group>
  );
}
export function Rail() {
  const { s, count } = useStage();
  const row = useRef<Group>(null);
  useFrame(() => {
    if (row.current) row.current.position.x = SHIFT - s.c * RAIL_STEP;
  });
  return (
    <group ref={row}>
      {Array.from({ length: count }, (_, i) => {
        const Model = RAIL[i % RAIL.length];
        return (
          <RailSlot key={i} index={i}>
            <Interactive index={i}>
              <Model />
            </Interactive>
          </RailSlot>
        );
      })}
    </group>
  );
}

/* ── tower: the layers of a system pulled apart, climbed one by one ────── */
const LAYER_GAP = 1.2;
export function Tower() {
  const { s, count } = useStage();
  const tower = useRef<Group>(null);
  useFrame(() => {
    const g = tower.current;
    if (!g) return;
    g.position.y = 0.7 - s.c * LAYER_GAP;
    g.rotation.y = -0.5 + s.c * 0.45 + s.drag;
  });
  return (
    <group position={[SHIFT, 0, 0]}>
      <group ref={tower}>
        <mesh position={[0, ((count - 1) * LAYER_GAP) / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, (count + 1) * LAYER_GAP, 8]} />
          <meshBasicMaterial color="#67E8F9" transparent opacity={0.5} />
        </mesh>
        {Array.from({ length: count }, (_, i) => (
          <group key={i} position={[0, i * LAYER_GAP, 0]}>
            <Interactive index={i}>
              <TowerLayer index={i} />
            </Interactive>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ── prism: one face per idea; a turn of the prism is a turn of the page ─ */
function faceTexture(index: number, title: string) {
  const W = 512;
  const H = 700;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const x = cv.getContext("2d")!;
  const font =
    getComputedStyle(document.documentElement).getPropertyValue("--font-space-grotesk").trim() ||
    "Space Grotesk, Inter, sans-serif";

  const bg = x.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#16264a");
  bg.addColorStop(1, "#0b1430");
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);

  x.strokeStyle = "rgba(34,211,238,0.85)";
  x.lineWidth = 5;
  x.strokeRect(14, 14, W - 28, H - 28);
  x.strokeStyle = "rgba(76,134,255,0.25)";
  x.lineWidth = 1;
  for (let g = 40; g < W; g += 48) {
    x.beginPath();
    x.moveTo(g, 20);
    x.lineTo(g, H - 20);
    x.stroke();
  }
  for (let g = 60; g < H; g += 48) {
    x.beginPath();
    x.moveTo(20, g);
    x.lineTo(W - 20, g);
    x.stroke();
  }

  const num = x.createLinearGradient(0, 0, 220, 0);
  num.addColorStop(0, "#4C86FF");
  num.addColorStop(1, "#22D3EE");
  x.fillStyle = num;
  x.font = `700 170px ${font}`;
  x.textBaseline = "alphabetic";
  x.fillText(String(index + 1).padStart(2, "0"), 44, 230);

  x.fillStyle = "#ffffff";
  x.font = `700 44px ${font}`;
  const words = title.split(" ");
  let line = "";
  let y = 340;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (x.measureText(test).width > W - 90 && line) {
      x.fillText(line, 44, y);
      line = w;
      y += 56;
    } else line = test;
  }
  x.fillText(line, 44, y);

  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const APOTHEM = 1.5;
function Face({ index, title, count }: { index: number; title: string; count: number }) {
  const map = useMemo(() => faceTexture(index, title), [index, title]);
  const a = (index / count) * TAU;
  return (
    <group position={[Math.sin(a) * APOTHEM, 0, Math.cos(a) * APOTHEM]} rotation={[0, a, 0]}>
      <Interactive index={index} spin={false}>
        <mesh>
          <planeGeometry args={[1.72, 2.35]} />
          <meshBasicMaterial map={map} toneMapped={false} />
        </mesh>
      </Interactive>
    </group>
  );
}
export function Prism() {
  const { s, count, titles } = useStage();
  const prism = useRef<Group>(null);
  useFrame(() => {
    if (prism.current) prism.current.rotation.y = -s.c * (TAU / count) + s.drag;
  });
  return (
    <group position={[SHIFT, 1.15, 0]}>
      <group ref={prism}>
        {/* A dark core so the far faces read as the inside of a solid, not as
            see-through glass. Its hexagon is turned to sit behind the faces. */}
        <mesh rotation={[0, Math.PI / 6, 0]}>
          <cylinderGeometry args={[(APOTHEM / Math.cos(Math.PI / count)) * 0.985, (APOTHEM / Math.cos(Math.PI / count)) * 0.985, 2.3, count]} />
          <meshStandardMaterial color="#0a1430" emissive="#2F6BFF" emissiveIntensity={0.1} />
        </mesh>
        {Array.from({ length: count }, (_, i) => (
          <Face key={i} index={i} title={titles[i] ?? ""} count={count} />
        ))}
        {[-1.3, 1.3].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[APOTHEM / Math.cos(Math.PI / count), 0.02, 8, count]} />
            <meshBasicMaterial color="#67E8F9" />
          </mesh>
        ))}
      </group>
      <Glow color="#2F6BFF" scale={7} opacity={0.25} position={[0, 0, -1]} />
    </group>
  );
}

/* ── screens: the real projects, as the same mockups the helix uses ────── */
export function Screens({
  data,
  progress,
}: {
  data: ScreenData[];
  progress: RefObject<number>;
}) {
  const { s, count } = useStage();
  const arc = useRef<Group>(null);
  const S = 0.9;
  const R = 2.5;
  useFrame(() => {
    if (arc.current) arc.current.rotation.y = s.c * S + s.drag;
  });
  const { onHover, onSelect } = useStage();
  return (
    <group position={[SHIFT, 0.2, 0]} scale={1.55}>
      <group ref={arc}>
        {data.slice(0, count).map((d, i) => {
          const a = Math.PI / 2 + i * S;
          return (
            <ProjectObject
              key={d.slug}
              position={[Math.cos(a) * R, 0, Math.sin(a) * R]}
              angle={a}
              kind={d.kind}
              slug={d.slug}
              name={d.name}
              stack={d.stack}
              href={d.href}
              onHover={onHover}
              onSelect={onSelect}
              label={d.label}
              active
              bobOffset={i * 1.7}
              progress={progress}
              orderIndex={i}
              total={count}
            />
          );
        })}
      </group>
    </group>
  );
}
