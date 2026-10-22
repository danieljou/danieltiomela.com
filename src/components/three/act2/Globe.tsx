"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  Quaternion,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { GLOBE_RADIUS, YAOUNDE, latLongToVector3 } from "./constants";
import { createEarthTexture } from "./worldTexture";

const ATMOSPHERE = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float rim = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
      gl_FragColor = vec4(0.13, 0.7, 0.93, 1.0) * clamp(rim, 0.0, 1.0) * 1.1;
    }`,
};

const MAX_TILT = 1.1; // radians, ~63  clamped so a vertical drag can't flip the globe upside down
const Z = new Vector3(0, 0, 1);

function setCursor(el: HTMLElement, value: string) {
  el.style.cursor = value;
}

/** Lets a marker ask the globe to turn until that marker faces the viewer. */
const GlobeControl = createContext<{ focusOn: (local: Vector3) => void }>({
  focusOn: () => {},
});
export const useGlobeControl = () => useContext(GlobeControl);

/** Rotation that brings a point on the sphere to face the camera. */
function facing(local: Vector3) {
  return {
    y: -Math.atan2(local.x, local.z),
    x: Math.max(-MAX_TILT, Math.min(MAX_TILT, Math.asin(local.y / local.length()))),
  };
}

/** A ring on the surface where the globe was clicked. */
function SurfacePing({ at, onDone }: { at: Vector3; onDone: () => void }) {
  const mesh = useRef<Mesh>(null);
  const age = useRef(0);
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(Z, at.clone().normalize()),
    [at],
  );
  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    age.current += delta;
    const t = age.current / 1.3;
    m.scale.setScalar(0.3 + t * 3.4);
    (m.material as MeshBasicMaterial).opacity = Math.max(0, 1 - t) * 0.85;
    if (t >= 1) onDone();
  });
  return (
    <mesh ref={mesh} position={at.clone().multiplyScalar(1.004)} quaternion={quaternion}>
      <ringGeometry args={[0.1, 0.115, 48]} />
      <meshBasicMaterial
        color="#67E8F9"
        transparent
        opacity={0.85}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Full trackball: drag horizontally to spin, vertically to tilt. Tilt is
 * clamped (not a free X rotation) so a fast vertical drag can't flip the
 * globe past its pole and read as broken. It opens facing Yaoundé, turns
 * slowly on its own, turns to face any marker you click, and sends a ripple
 * out from wherever you click the surface.
 */
export function Globe({
  active,
  children,
}: {
  active: boolean;
  children?: React.ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const dragging = useRef(false);
  const moved = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const tilt = useRef(0.25);
  const target = useRef<{ y: number; x: number } | null>(null);
  // Zoomed on a place until the visitor takes hold of the globe.
  const focused = useRef(true);
  const ringsRef = useRef<Group>(null);
  const nextId = useRef(0);
  const [pings, setPings] = useState<{ id: number; at: Vector3 }[]>([]);
  const { invalidate, gl } = useThree();
  const texture = useMemo(() => createEarthTexture(), []);

  // Open on the author's own city.
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    const f = facing(latLongToVector3(YAOUNDE.lat, YAOUNDE.lon));
    g.rotation.y = f.y;
    tilt.current = f.x;
    g.rotation.x = f.x;
  }, []);

  const control = useMemo(
    () => ({
      focusOn: (local: Vector3) => {
        target.current = facing(local);
        focused.current = true;
        velocity.current = { x: 0, y: 0 };
      },
    }),
    [],
  );

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    dragging.current = true;
    moved.current = 0;
    target.current = null;
    focused.current = false;
    last.current = { x: e.clientX, y: e.clientY };
    setCursor(gl.domElement, "grabbing");
  }
  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging.current || !groupRef.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    moved.current += Math.abs(dx) + Math.abs(dy);
    last.current = { x: e.clientX, y: e.clientY };
    const rotY = dx * 0.006;
    const rotX = dy * 0.006;
    groupRef.current.rotation.y += rotY;
    tilt.current = Math.max(-MAX_TILT, Math.min(MAX_TILT, tilt.current + rotX));
    groupRef.current.rotation.x = tilt.current;
    velocity.current = { x: rotX, y: rotY };
    invalidate();
  }
  function endDrag() {
    if (dragging.current) setCursor(gl.domElement, "grab");
    dragging.current = false;
  }
  function onClick(e: ThreeEvent<MouseEvent>) {
    // A drag ends in a click too; only a real tap sends a ripple.
    if (moved.current > 6 || !groupRef.current) return;
    e.stopPropagation();
    const at = groupRef.current.worldToLocal(e.point.clone());
    setPings((p) => [...p.slice(-4), { id: nextId.current++, at }]);
  }

  // Safety net: release the drag even if pointerup fires outside the canvas.
  useEffect(() => {
    window.addEventListener("pointerup", endDrag);
    return () => window.removeEventListener("pointerup", endDrag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!active || !g) return;
    if (ringsRef.current) ringsRef.current.rotation.z += delta * 0.12;
    g.scale.setScalar(g.scale.x + ((focused.current ? 1.35 : 1) - g.scale.x) * 0.06);
    if (!dragging.current) {
      if (target.current) {
        // Ease toward the requested face along the shortest way round.
        const t = target.current;
        let dy = t.y - g.rotation.y;
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        g.rotation.y += dy * 0.08;
        tilt.current += (t.x - tilt.current) * 0.08;
        g.rotation.x = tilt.current;
        if (Math.abs(dy) < 0.003 && Math.abs(t.x - tilt.current) < 0.003) target.current = null;
      } else {
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;
        if (Math.abs(velocity.current.y) < 0.0006 && !focused.current) {
          velocity.current.y = 0.0006; // ambient auto-rotation, Y only
        }
        g.rotation.y += velocity.current.y;
        tilt.current = Math.max(-MAX_TILT, Math.min(MAX_TILT, tilt.current + velocity.current.x));
        g.rotation.x = tilt.current;
      }
    }
    invalidate();
  });

  return (
    <GlobeControl.Provider value={control}>
      <group
        ref={groupRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onClick={onClick}
        onPointerOver={() => {
          if (!dragging.current) setCursor(gl.domElement, "grab");
        }}
        onPointerOut={() => {
          if (!dragging.current) setCursor(gl.domElement, "");
        }}
      >
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 96, 64]} />
          {texture ? (
            <meshStandardMaterial
              map={texture}
              emissiveMap={texture}
              emissive="#ffffff"
              emissiveIntensity={0.55}
              roughness={0.7}
              metalness={0.2}
            />
          ) : (
            <meshBasicMaterial color="#2F6BFF" wireframe transparent opacity={0.35} />
          )}
        </mesh>

        {/* Atmosphere: a fresnel falloff on a larger backside shell, so the rim
            glows and the centre stays clear. */}
        <mesh scale={1.16}>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 48]} />
          <shaderMaterial
            args={[ATMOSPHERE]}
            transparent
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Two tilted orbit rings  scale and motion reference for the eye. */}
        <group ref={ringsRef} rotation={[1.2, 0.3, 0]}>
          <mesh>
            <torusGeometry args={[GLOBE_RADIUS * 1.45, 0.004, 8, 160]} />
            <meshBasicMaterial color="#4C86FF" transparent opacity={0.5} />
          </mesh>
          <mesh scale={1.14} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[GLOBE_RADIUS * 1.45, 0.003, 8, 160]} />
            <meshBasicMaterial color="#22D3EE" transparent opacity={0.3} />
          </mesh>
        </group>

        {pings.map((p) => (
          <SurfacePing
            key={p.id}
            at={p.at}
            onDone={() => setPings((all) => all.filter((x) => x.id !== p.id))}
          />
        ))}

        {children}
      </group>
    </GlobeControl.Provider>
  );
}
