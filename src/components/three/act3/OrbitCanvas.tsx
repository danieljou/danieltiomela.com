"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import type { Locale } from "@/lib/i18n";
import { ProjectOrbit } from "./ProjectOrbit";
import { Dust } from "../shared/Dust";

const DUST_SIZE: [number, number, number] = [12, 9, 12];
const DUST_CENTER: [number, number, number] = [0, 2.4, 0];

export default function OrbitCanvas({
  active,
  locale,
  progress,
  onHover,
  onSelect,
}: {
  active: boolean;
  locale: Locale;
  progress: RefObject<number>;
  onHover: (label: string | null) => void;
  onSelect: (index: number) => void;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [5.1, 0.35, 1.9], fov: 46 }}
    >
      <fogExp2 attach="fog" args={["#0a1122", 0.055]} />
      <ambientLight intensity={1.1} />
      <Dust count={420} size={DUST_SIZE} center={DUST_CENTER} px={0.05} seed={41} drift={0.01} />
      <Dust
        count={110}
        size={DUST_SIZE}
        center={DUST_CENTER}
        px={0.1}
        opacity={0.3}
        color="#4C86FF"
        seed={43}
        drift={-0.012}
      />
      <ProjectOrbit
        active={active}
        locale={locale}
        progress={progress}
        onHover={onHover}
        onSelect={onSelect}
      />
    </Canvas>
  );
}
