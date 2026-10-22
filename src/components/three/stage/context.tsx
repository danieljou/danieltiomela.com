"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";
import { Dust } from "../shared/Dust";
import { Glow } from "../shared/Glow";
import { Floor } from "../shared/Floor";
import { useHoverCursor } from "../shared/interact";

/**
 * The stage's moving numbers, kept in one object with methods rather than
 * loose refs: it is mutated every frame from inside render loops, which the
 * compiler lint would (rightly) refuse for refs handed down as props.
 */
export class StageState {
  /** Smoothed, continuous step index: 1.0 is exactly on step 1. */
  c = 0;
  /** Extra turn from the user dragging the scene; springs back to 0. */
  drag = 0;
  /** Pixels moved in the current/last press  a drag must not count as a click. */
  moved = 0;
  ease(target: number, dt: number) {
    this.c += (target - this.c) * (1 - Math.exp(-dt * 5));
  }
  push(dx: number) {
    this.drag += dx * 0.008;
    this.moved += Math.abs(dx);
  }
  press() {
    this.moved = 0;
  }
  relax(dt: number) {
    this.drag *= Math.exp(-dt * 2.4);
  }
}

export interface StageContextValue {
  s: StageState;
  count: number;
  titles: string[];
  onHover: (label: string | null) => void;
  /** Bring step `i` into focus (scrolls the page there). */
  onSelect: (i: number) => void;
}

const Ctx = createContext<StageContextValue | null>(null);
export const StageProvider = Ctx.Provider;
export function useStage() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStage outside a stage");
  return v;
}

/**
 * Eases the continuous index toward where the scroll says it should be, and
 * keeps the demand-driven render loop alive while the stage is on screen.
 * Mounted before the scene so everything below reads this frame's value.
 */
export function Smooth({
  progress,
  s,
  count,
  active,
}: {
  progress: RefObject<number>;
  s: StageState;
  count: number;
  active: boolean;
}) {
  const { invalidate } = useThree();
  // A demand-driven loop that went idle needs one nudge to start again.
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  useFrame((_, dt) => {
    if (!active) return;
    s.ease(progress.current * (count - 1), dt);
    invalidate();
  });
  return null;
}

/**
 * Drag anywhere on the canvas to turn the scene; let go and it eases back to
 * the step the scroll position asks for. The scroll stays the source of truth,
 * the drag is a push you can give it.
 */
export function useDragTurn(s: StageState, active: boolean) {
  const gl = useThree((s) => s.gl);
  const down = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const el = gl.domElement;
    function onDown(e: PointerEvent) {
      down.current = true;
      lastX.current = e.clientX;
      s.press();
    }
    function onMove(e: PointerEvent) {
      if (!down.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      s.push(dx);
    }
    function onUp() {
      down.current = false;
    }
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl, s]);

  useFrame((_, dt) => {
    if (!active || down.current) return;
    s.relax(dt);
  });
}

/**
 * Wraps one step's object: it swells as the scroll reaches it, rises to meet
 * the pointer, names itself on hover, and  clicked while in focus  takes a
 * spin that decays. Clicked while out of focus, it brings itself into focus.
 */
export function Interactive({
  index,
  children,
  spin = true,
}: {
  index: number;
  children: React.ReactNode;
  spin?: boolean;
}) {
  const ctx = useStage();
  const ref = useRef<Group>(null);
  const hover = useRef(0);
  const hovered = useRef(false);
  const angle = useRef(0);
  const vel = useRef(0);
  const wobble = useRef({ x: 0, v: 0 });
  const cursor = useHoverCursor();

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const emph = Math.max(0, 1 - Math.abs(ctx.s.c - index));
    hover.current += ((hovered.current ? 1 : 0) - hover.current) * 0.15;
    g.scale.setScalar(0.78 + emph * 0.26 + hover.current * 0.1);
    angle.current += vel.current * d;
    vel.current *= Math.exp(-d * 1.6);
    const w = wobble.current;
    w.v += (-w.x * 60 - w.v * 5) * d;
    w.x += w.v * d;
    g.rotation.y = spin ? angle.current : 0;
    g.rotation.z = spin ? 0 : w.x;
  });

  function over(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    hovered.current = true;
    cursor.over();
    ctx.onHover(ctx.titles[index] ?? null);
  }
  function out() {
    hovered.current = false;
    cursor.out();
    ctx.onHover(null);
  }
  function click(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    if (ctx.s.moved > 6) return; // that was a drag, not a click
    const focused = Math.abs(ctx.s.c - index) < 0.5;
    if (!focused) return ctx.onSelect(index);
    if (spin) vel.current += 9;
    else wobble.current.v += 3;
  }

  return (
    <group ref={ref} onPointerOver={over} onPointerOut={out} onClick={click}>
      {children}
    </group>
  );
}

const DUST: [number, number, number] = [14, 7, 12];

/** Lights, haze, ground and dust shared by every stage. */
export function Env({ floorY = -0.1 }: { floorY?: number }) {
  return (
    <>
      <fogExp2 attach="fog" args={["#0a1122", 0.045]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 5]} intensity={1.7} color="#d6e6ff" />
      <directionalLight position={[-5, 2, -3]} intensity={1.3} color="#4C86FF" />
      <pointLight position={[0, 2.5, 3]} intensity={1.6} distance={10} color="#22D3EE" />
      <Floor y={floorY} x={[-9, 9]} z={[-8, 8]} step={0.8} opacity={0.2} />
      <Dust count={300} size={DUST} center={[0, 2, 0]} px={0.05} seed={61} />
      <Glow color="#2F6BFF" scale={12} opacity={0.18} position={[0, 1.2, -4]} />
      <Glow color="#7C5CFF" scale={9} opacity={0.12} position={[4, 2, -3]} />
    </>
  );
}
