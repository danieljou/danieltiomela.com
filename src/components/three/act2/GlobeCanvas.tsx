"use client";

import { Canvas } from "@react-three/fiber";
import { Globe } from "./Globe";
import { MissionArcs } from "./MissionArcs";

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
      <ambientLight intensity={1} />
      <Globe active={active}>
        <MissionArcs onHover={onHover} missionLabels={missionLabels} />
      </Globe>
    </Canvas>
  );
}
