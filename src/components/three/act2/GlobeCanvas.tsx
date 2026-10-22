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
      camera={{ position: [0, 0.2, 6.2], fov: 45 }}
    >
      {/* A "sun" for the textured sphere to actually shade against  the
          previous `meshBasicMaterial` self-illuminated and ignored lights
          entirely, which is part of why it read as flat/abstract. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 2, 3]} intensity={1.8} color="#e6f1ff" />
      <directionalLight position={[-5, 1, -3]} intensity={1.6} color="#4C86FF" />
      <Starfield />
      <group position={[0, 0.35, 0]}>
        <Globe active={active}>
          <MissionArcs onHover={onHover} missionLabels={missionLabels} />
        </Globe>
      </group>
    </Canvas>
  );
}
