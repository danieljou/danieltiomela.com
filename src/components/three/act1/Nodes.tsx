"use client";

import { useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { createSpring, stepSpring, useHoverCursor } from "../shared/interact";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  EdgesGeometry,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type SpriteMaterial,
} from "three";
import type { RefObject } from "react";
import { Glow } from "../shared/Glow";
import { POINTS, stageT } from "./constants";

const ACTIVE = new Color("#22D3EE");
const IDLE = new Color("#2F6BFF");
const PANEL_EDGES = new EdgesGeometry(new BoxGeometry(0.7, 0.44, 0.04));

type Kind = "screen" | "gate" | "core" | "lattice" | "cluster";
const KINDS: Kind[] = ["screen", "gate", "core", "lattice", "cluster"];

/** Each stage is its own object  a request passes through different things. */
function Body({ kind, color }: { kind: Kind; color: Color }) {
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.7}
      roughness={0.35}
      metalness={0.4}
    />
  );
  switch (kind) {
    case "screen":
      return (
        <group>
          <mesh>
            <boxGeometry args={[0.7, 0.44, 0.04]} />
            {mat}
          </mesh>
          <lineSegments geometry={PANEL_EDGES}>
            <lineBasicMaterial color="#67E8F9" />
          </lineSegments>
        </group>
      );
    case "gate":
      return (
        <group>
          <mesh>
            <torusGeometry args={[0.34, 0.035, 12, 48]} />
            {mat}
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.72}>
            <torusGeometry args={[0.34, 0.025, 12, 48]} />
            {mat}
          </mesh>
          <mesh scale={0.28}>
            <sphereGeometry args={[0.5, 20, 20]} />
            {mat}
          </mesh>
        </group>
      );
    case "core":
      return (
        <group>
          <mesh>
            <icosahedronGeometry args={[0.26, 1]} />
            {mat}
          </mesh>
          <mesh scale={1.7}>
            <icosahedronGeometry args={[0.26, 1]} />
            <meshBasicMaterial color="#67E8F9" wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      );
    case "lattice":
      return (
        <group>
          <mesh>
            <octahedronGeometry args={[0.3, 0]} />
            {mat}
          </mesh>
          <mesh scale={1.5} rotation={[0.5, 0.5, 0]}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshBasicMaterial color="#67E8F9" wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      );
    default:
      return (
        <group>
          <mesh>
            <dodecahedronGeometry args={[0.3, 0]} />
            {mat}
          </mesh>
          <mesh scale={1.55}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshBasicMaterial color="#67E8F9" wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      );
  }
}

function Node({
  position,
  target,
  kind,
  progressRef,
  label,
  onHover,
  onSelect,
}: {
  position: [number, number, number];
  target: number;
  kind: Kind;
  progressRef: RefObject<number>;
  label: string;
  onHover: (label: string | null) => void;
  onSelect: () => void;
}) {
  const group = useRef<Group>(null);
  const body = useRef<Group>(null);
  const halo = useRef<Group>(null);
  const amount = useRef(0);
  const hover = useRef(0);
  const hovered = useRef(false);
  const kick = useRef(createSpring()).current;
  const cursor = useHoverCursor();
  const [color] = useState(() => new Color(IDLE));

  useFrame((state, delta) => {
    const dist = Math.abs(progressRef.current - target);
    const goal = dist < 0.12 ? 1 : 0;
    amount.current += (goal - amount.current) * 0.08;
    const a = amount.current;
    hover.current += ((hovered.current ? 1 : 0) - hover.current) * 0.15;
    stepSpring(kick, delta, 30, 4);

    color.copy(IDLE).lerp(ACTIVE, a);
    if (group.current) group.current.scale.setScalar(1 + a * 0.4 + hover.current * 0.35);
    if (body.current) {
      body.current.rotation.y += delta * (0.3 + a * 0.9) + kick.vx * delta * 2;
      body.current.rotation.x += delta * 0.12;
      body.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + target * 9) * 0.05;
      body.current.traverse((o) => {
        const m = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (m && "emissiveIntensity" in m) m.emissiveIntensity = 0.55 + a * 1.3;
      });
    }
    if (halo.current) {
      halo.current.traverse((o) => {
        const m = (o as unknown as { material?: SpriteMaterial }).material;
        if (m && m.blending === AdditiveBlending) m.opacity = 0.3 + a * 0.5 + hover.current * 0.3;
      });
    }
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        hovered.current = true;
        cursor.over();
        onHover(label);
      }}
      onPointerOut={() => {
        hovered.current = false;
        cursor.out();
        onHover(null);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        kick.vx += 9; // a shove: it spins up and settles
        onSelect();
      }}
    >
      <group ref={body}>
        <Body kind={kind} color={color} />
      </group>
      <group ref={halo}>
        <Glow color="#2F6BFF" scale={2.4} opacity={0.4} />
        <Glow color="#22D3EE" scale={1.1} opacity={0.4} />
      </group>
    </group>
  );
}

export function Nodes({
  progressRef,
  labels,
  onHover,
  onSelect,
}: {
  progressRef: RefObject<number>;
  labels: string[];
  onHover: (label: string | null) => void;
  onSelect: (index: number) => void;
}) {
  return (
    <group>
      {POINTS.map((p, i) => (
        <Node
          key={i}
          position={p}
          target={stageT(i)}
          kind={KINDS[i % KINDS.length]}
          progressRef={progressRef}
          label={labels[i] ?? ""}
          onHover={onHover}
          onSelect={() => onSelect(i)}
        />
      ))}
    </group>
  );
}
