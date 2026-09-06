"use client";

import { Canvas } from "@react-three/fiber";
import { Globe } from "./Globe";
import { MissionArcs } from "./MissionArcs";
import { Starfield } from "./Starfield";

export default function GlobeCanvas({
  active,
  onHover,
  missionLabels,
}: {
  active: boolean;
  onHover: (label: string | null) => void;
  missionLabels: string[];
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0.3, 4], fov: 45 }}
    >
      {/* A "sun" for the textured sphere to actually shade against  the
          previous `meshBasicMaterial` self-illuminated and ignored lights
          entirely, which is part of why it read as flat/abstract. */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 2, 3]} intensity={1.6} />
      <Starfield />
      <Globe active={active}>
        <MissionArcs onHover={onHover} missionLabels={missionLabels} />
      </Globe>
    </Canvas>
  );
}
