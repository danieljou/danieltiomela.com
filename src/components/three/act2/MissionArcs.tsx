"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  AdditiveBlending,
  Quaternion,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { Glow } from "../shared/Glow";
import { Label, useHoverCursor } from "../shared/interact";
import { useGlobeControl } from "./Globe";
import { GLOBE_RADIUS, MISSION_POINTS, YAOUNDE, latLongToVector3 } from "./constants";

const Z = new Vector3(0, 0, 1);

function Arc({ from, to, offset }: { from: Vector3; to: Vector3; offset: number }) {
  const curve = useMemo(() => {
    const mid = from
      .clone()
      .add(to)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(GLOBE_RADIUS * 1.4);
    return new QuadraticBezierCurve3(from, mid, to);
  }, [from, to]);
  const tube = useMemo(() => new TubeGeometry(curve, 48, 0.007, 6, false), [curve]);
  const packet = useRef<Group>(null);

  useFrame((state) => {
    const g = packet.current;
    if (!g) return;
    const t = (state.clock.elapsedTime * 0.28 + offset) % 1;
    curve.getPoint(t, g.position);
    g.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.7);
  });

  return (
    <>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.75} />
      </mesh>
      <group ref={packet}>
        <mesh>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Glow color="#67E8F9" scale={0.3} opacity={0.9} />
      </group>
    </>
  );
}

/** An expanding ring on the surface  "a place that is live", not decoration. */
function Pulse({ position, color, phase }: { position: Vector3; color: string; phase: number }) {
  const mesh = useRef<Mesh>(null);
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(Z, position.clone().normalize()),
    [position],
  );

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = (state.clock.elapsedTime * 0.5 + phase) % 1;
    m.scale.setScalar(1 + t * 3.2);
    (m.material as MeshBasicMaterial).opacity = (1 - t) * 0.7;
  });

  return (
    <mesh ref={mesh} position={position} quaternion={quaternion}>
      <ringGeometry args={[0.04, 0.05, 40]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Hover targets are markers, not the arcs themselves: raycasting a 1px-wide
 * line is unreliable (three.js's default line hit-threshold is small and
 * inconsistent across zoom levels), while a small sphere at the destination
 * is both the visual landmark and a dependable hit target.
 */
function Marker({
  position,
  color,
  onHover,
  label,
  name,
  anchor,
  phase,
}: {
  position: Vector3;
  color: string;
  onHover?: (label: string | null) => void;
  label?: string;
  /** Shown beside the marker in the scene itself. */
  name?: string;
  /** Where the label sits relative to the marker, so neighbours never overlap. */
  anchor?: [number, number];
  phase: number;
}) {
  const control = useGlobeControl();
  const cursor = useHoverCursor();
  function handleOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    cursor.over();
    if (label) onHover?.(label);
  }
  function handleOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    cursor.out();
    if (label) onHover?.(null);
  }
  function handleClick(e: ThreeEvent<MouseEvent>) {
    // Turn the globe to face this place instead of rippling the surface.
    e.stopPropagation();
    control.focusOn(position);
  }

  return (
    <group>
      <mesh
        position={position}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Glow position={position.toArray()} color={color} scale={0.4} opacity={0.8} />
      <Pulse position={position} color={color} phase={phase} />
      {name && (
        <Label
          text={name}
          scale={0.13}
          anchor={anchor}
          position={[position.x * 1.04, position.y * 1.04, position.z * 1.04]}
        />
      )}
    </group>
  );
}

export function MissionArcs({
  onHover,
  missionLabels,
}: {
  onHover: (label: string | null) => void;
  missionLabels: string[];
}) {
  const origin = useMemo(() => latLongToVector3(YAOUNDE.lat, YAOUNDE.lon), []);
  const destinations = useMemo(
    () => MISSION_POINTS.map((p) => latLongToVector3(p.lat, p.lon)),
    [],
  );

  return (
    <group>
      <Marker position={origin} color="#67E8F9" phase={0} name="Yaoundé" anchor={[-0.08, 0.5]} />
      {destinations.map((d, i) => (
        <group key={i}>
          <Arc from={origin} to={d} offset={i * 0.45} />
          <Marker
            position={d}
            color="#4C86FF"
            onHover={onHover}
            label={missionLabels[i]}
            name={missionLabels[i]}
            anchor={i === 0 ? [1.08, 0.5] : [0.5, 1.4]}
            phase={0.3 + i * 0.25}
          />
        </group>
      ))}
    </group>
  );
}
