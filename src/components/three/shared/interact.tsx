"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  SRGBColorSpace,
  type Mesh,
  type MeshBasicMaterial,
} from "three";

/** Pointer cursor while hovering something 3D that reacts  the only hint a
    canvas gives that an object is not just scenery. */
function setCursor(el: HTMLElement, value: string) {
  el.style.cursor = value;
}

export function useHoverCursor() {
  const gl = useThree((s) => s.gl);
  return useMemo(
    () => ({
      over: () => setCursor(gl.domElement, "pointer"),
      out: () => setCursor(gl.domElement, ""),
    }),
    [gl],
  );
}

/**
 * A damped spring on a 2D offset: `kick` it and it overshoots, wobbles and
 * settles home. The same few lines give every object its "I was pushed" feel.
 */
export function createSpring() {
  return { x: 0, y: 0, vx: 0, vy: 0 };
}
export function stepSpring(
  s: { x: number; y: number; vx: number; vy: number },
  dt: number,
  stiffness = 40,
  damping = 5,
) {
  const d = Math.min(dt, 0.05);
  s.vx += (-s.x * stiffness - s.vx * damping) * d;
  s.vy += (-s.y * stiffness - s.vy * damping) * d;
  s.x += s.vx * d;
  s.y += s.vy * d;
}

/** A ring that expands and fades where something was clicked. */
export function Shockwave({
  position,
  color = "#67E8F9",
  max = 2.4,
  onDone,
}: {
  position: [number, number, number];
  color?: string;
  max?: number;
  onDone: () => void;
}) {
  const mesh = useRef<Mesh>(null);
  const age = useRef(0);
  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    age.current += delta;
    const t = age.current / 1.1;
    m.scale.setScalar(0.05 + t * max);
    (m.material as MeshBasicMaterial).opacity = Math.max(0, 1 - t) * 0.9;
    // Always faces the camera so the ring reads as a ring from any angle.
    m.quaternion.copy(state.camera.quaternion);
    if (t >= 1) onDone();
  });
  return (
    <mesh ref={mesh} position={position}>
      <ringGeometry args={[0.9, 1, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Text as a camera-facing sprite, for places an HTML label can't follow. */
export function Label({
  text,
  position,
  scale = 0.5,
  color = "#e8edf7",
  anchor = [0.5, 0.5],
}: {
  text: string;
  position: [number, number, number];
  scale?: number;
  color?: string;
  /** Which point of the label sits on `position`: [1, 0.5] puts it to the left. */
  anchor?: [number, number];
}) {
  const { texture, aspect } = useMemo(() => {
    const font = 56;
    const pad = 24;
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = `600 ${font}px Inter, sans-serif`;
    const w = Math.ceil(probe.measureText(text).width) + pad * 2;
    const h = font + pad * 2;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.font = `600 ${font}px Inter, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(10,17,34,0.78)";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, h / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(103,232,249,0.55)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillText(text, pad, h / 2 + 2);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return { texture: t, aspect: w / h };
  }, [text, color]);

  return (
    <sprite position={position} scale={[scale * aspect, scale, 1]} center={anchor}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}
