"use client";

import { Canvas } from "@react-three/fiber";
import type { Locale } from "@/lib/i18n";
import { ProjectOrbit } from "./ProjectOrbit";

export default function OrbitCanvas({
  active,
  locale,
  onHover,
}: {
  active: boolean;
  locale: Locale;
  onHover: (label: string | null) => void;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0.4, 3.2], fov: 48 }}
    >
      <ambientLight intensity={1.1} />
      <ProjectOrbit active={active} locale={locale} onHover={onHover} />
    </Canvas>
  );
}
