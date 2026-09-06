"use client";

import { useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import {
  BufferGeometry,
  Line as ThreeLine,
  LineBasicMaterial,
  QuadraticBezierCurve3,
  Vector3,
} from "three";
import { GLOBE_RADIUS, MISSION_POINTS, YAOUNDE, latLongToVector3 } from "./constants";

function Arc({ from, to }: { from: Vector3; to: Vector3 }) {
  const line = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS * 1.35);
    const curve = new QuadraticBezierCurve3(from, mid, to);
    const geometry = new BufferGeometry().setFromPoints(curve.getPoints(32));
    const material = new LineBasicMaterial({ color: "#22D3EE", transparent: true, opacity: 0.7 });
    return new ThreeLine(geometry, material);
  }, [from, to]);

  return <primitive object={line} />;
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
}: {
  position: Vector3;
  color: string;
  onHover?: (label: string | null) => void;
  label?: string;
}) {
  function handleOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (label) onHover?.(label);
  }
  function handleOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (label) onHover?.(null);
  }

  return (
    <mesh position={position} onPointerOver={handleOver} onPointerOut={handleOut}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
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
      <Marker position={origin} color="#67E8F9" />
      {destinations.map((d, i) => (
        <group key={i}>
          <Arc from={origin} to={d} />
          <Marker position={d} color="#2F6BFF" onHover={onHover} label={missionLabels[i]} />
        </group>
      ))}
    </group>
  );
}
