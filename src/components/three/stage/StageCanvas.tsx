"use client";

import { useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Env, Smooth, StageProvider, StageState, useDragTurn } from "./context";
import { Carousel, Prism, Rail, Screens, Tower, type ScreenData } from "./scenes";

export type StageVariant = "carousel" | "rail" | "tower" | "prism" | "screens";

const CAMERA: Record<StageVariant, { position: [number, number, number]; look: [number, number, number]; fov: number }> = {
  carousel: { position: [0, 1.9, 7.4], look: [0, 0.8, 0], fov: 40 },
  rail: { position: [0, 1.7, 7.6], look: [0, 0.9, 0], fov: 40 },
  tower: { position: [0, 1.7, 8.4], look: [0, 1.0, 0], fov: 40 },
  prism: { position: [0, 1.2, 7.2], look: [0, 1.1, 0], fov: 40 },
  screens: { position: [0, 0.6, 8.2], look: [0, 0.2, 0], fov: 42 },
};

function DragTurn({ s, active }: { s: StageState; active: boolean }) {
  useDragTurn(s, active);
  return null;
}

export default function StageCanvas({
  variant,
  progress,
  count,
  titles,
  data,
  active,
  onHover,
  onSelect,
}: {
  variant: StageVariant;
  progress: RefObject<number>;
  count: number;
  titles: string[];
  data?: ScreenData[];
  active: boolean;
  onHover: (label: string | null) => void;
  onSelect: (i: number) => void;
}) {
  const [s] = useState(() => new StageState());
  const cam = CAMERA[variant];

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: cam.position, fov: cam.fov }}
      onCreated={({ camera }) => camera.lookAt(...cam.look)}
      style={{ cursor: "grab" }}
    >
      <StageProvider value={{ s, count, titles, onHover, onSelect }}>
        <Smooth progress={progress} s={s} count={count} active={active} />
        <DragTurn s={s} active={active} />
        <Env />
        {variant === "carousel" && <Carousel />}
        {variant === "rail" && <Rail />}
        {variant === "tower" && <Tower />}
        {variant === "prism" && <Prism />}
        {variant === "screens" && data && <Screens data={data} progress={progress} />}
      </StageProvider>
    </Canvas>
  );
}
