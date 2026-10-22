"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type Mesh, type MeshBasicMaterial } from "three";
import { Dust } from "./shared/Dust";
import { Glow } from "./shared/Glow";

export type SceneVariant = "tunnel";

/** Window-level pointer in -1..1, for parallax. */
function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    function onMove(e: PointerEvent) {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return p;
}

/* ── tunnel: rings rushing toward the viewer, a light at the far end ───── */

const RINGS = 18;
const SPAN = 18;

/**
 * The closing scene. The cursor steers the view down the tunnel; press
 * anywhere in it and the rings surge past  a warp  then settle again.
 */
function Tunnel({ active }: { active: boolean }) {
  const rings = useRef<(Mesh | null)[]>([]);
  const pointer = usePointer();
  const travel = useRef(0);
  const boost = useRef(0);
  const gl = useThree((s) => s.gl);
  const { invalidate } = useThree();

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  useEffect(() => {
    const el = gl.domElement;
    const onDown = () => {
      boost.current = 1;
    };
    el.addEventListener("pointerdown", onDown);
    return () => el.removeEventListener("pointerdown", onDown);
  }, [gl]);

  useFrame((state, dt) => {
    if (!active) return;
    boost.current = Math.max(0, boost.current - dt * 0.7);
    travel.current += dt * 0.9 * (1 + boost.current * 9);
    const t = state.clock.elapsedTime;
    for (let i = 0; i < RINGS; i++) {
      const m = rings.current[i];
      if (!m) continue;
      const z = -((i * (SPAN / RINGS) + travel.current) % SPAN);
      m.position.z = z;
      m.rotation.z = t * 0.15 * (i % 2 ? 1 : -1) + i;
      // Fade in from the far end, out as a ring passes the camera.
      const depth = -z / SPAN;
      (m.material as MeshBasicMaterial).opacity =
        Math.min(depth * 4, 1) * Math.min((1 - depth) * 3, 1) * (0.42 + boost.current * 0.5);
    }
    const camera = state.camera;
    camera.position.x += (pointer.current.x * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (pointer.current.y * -0.3 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, -SPAN);
    invalidate();
  });

  return (
    <group>
      {Array.from({ length: RINGS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
        >
          <torusGeometry args={[2.6 + (i % 3) * 0.18, 0.014, 8, 6 + (i % 3) * 2]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#22D3EE" : "#4C86FF"} transparent opacity={0} />
        </mesh>
      ))}
      <Glow color="#22D3EE" scale={9} opacity={0.5} position={[0, 0, -SPAN]} />
      <Glow color="#7C5CFF" scale={16} opacity={0.3} position={[0, 0, -SPAN]} />
    </group>
  );
}

const TUNNEL_DUST: [number, number, number] = [9, 6, SPAN];
const TUNNEL_CENTER: [number, number, number] = [0, 0, -SPAN / 2];

export default function SectionSceneCanvas({
  active,
}: {
  variant?: SceneVariant;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 2], fov: 60 }}
      style={{ pointerEvents: "auto", cursor: "pointer" }}
    >
      <fogExp2 attach="fog" args={["#0a1122", 0.045]} />
      <Tunnel active={active} />
      <Dust count={420} size={TUNNEL_DUST} center={TUNNEL_CENTER} px={0.05} drift={0.008} seed={23} />
    </Canvas>
  );
}
