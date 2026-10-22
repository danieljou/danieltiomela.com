"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Glow } from "./shared/Glow";
import { Shockwave, useHoverCursor } from "./shared/interact";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Line as ThreeLine,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  Vector3,
  type Group,
  type Mesh,
} from "three";

/**
 * A plain segment, not `@react-three/drei`'s `<Line>`  drei alone added
 * ~90KB gzip to this route for one helper, blowing the 150KB budget. Raw
 * three/fiber primitives (already paid for) do the same job for free.
 *
 * Built as a real `THREE.Line` and mounted via `<primitive>`, not the
 * `<threeLine>` JSX tag: that tag exists in fiber's TypeScript types but
 * fiber's runtime element registry doesn't resolve it to `THREE.Line`,
 * so it throws at render time despite type-checking cleanly.
 */
function Edge({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const line = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(...from),
      new Vector3(...to),
    ]);
    const material = new LineBasicMaterial({
      color: "#3a5288",
      transparent: true,
      opacity: 0.75,
    });
    return new ThreeLine(geometry, material);
  }, [from, to]);

  return <primitive object={line} />;
}

/** A loose service-mesh cluster  nodes and the edges between them, nothing more. */
const NODES: [number, number, number][] = [
  [-1.1, 0.6, 0],
  [0.3, 1.0, -0.4],
  [1.2, 0.4, 0.3],
  [-0.6, -0.3, 0.5],
  [0.6, -0.6, -0.2],
  [1.4, -0.5, 0.4],
  [-1.3, -1.0, -0.3],
  [0, 0.05, 0],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [1, 7],
  [7, 3],
  [7, 4],
  [2, 5],
  [0, 6],
  [6, 3],
  [7, 2],
];

/** Deterministic scatter  no Math.random in render, so SSR/HMR stay stable. */
function dust(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = i * 2.399963; // golden angle
    const r = 1.6 + ((i * 37) % 100) / 100 * 1.8;
    const y = (((i * 61) % 100) / 100 - 0.5) * 3.6;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.6 - 0.8;
  }
  return pos;
}

function Dust() {
  const points = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(dust(260), 3));
    const m = new PointsMaterial({
      color: "#67e8f9",
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    return new Points(g, m);
  }, []);
  return <primitive object={points} />;
}

/** A bright packet travelling an edge  the graph reads as live traffic. */
function Pulse({
  from,
  to,
  offset,
  speed,
}: {
  from: [number, number, number];
  to: [number, number, number];
  offset: number;
  speed: number;
}) {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = (clock.elapsedTime * speed + offset) % 1;
    m.position.set(
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
      from[2] + (to[2] - from[2]) * t,
    );
    m.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.8);
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

/** A tilted ring with one satellite riding it  the armillary around the portrait. */
function Orbit({
  radius,
  tilt,
  speed,
  color,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
}) {
  const spin = useRef<Group>(null);
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.z += delta * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <group ref={spin}>
        <group position={[radius, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Glow color={color} scale={0.7} opacity={0.9} />
        </group>
      </group>
    </group>
  );
}

/**
 * One node of the graph. It swells under the cursor and, clicked, sends a
 * ring out from where it sits  the graph answers being touched.
 */
function GraphNode({
  position,
  color,
  onWave,
}: {
  position: [number, number, number];
  color: string;
  onWave: (at: Vector3, color: string) => void;
}) {
  const ref = useRef<Group>(null);
  const hover = useRef(0);
  const hovered = useRef(false);
  const cursor = useHoverCursor();

  useFrame(() => {
    hover.current += ((hovered.current ? 1 : 0) - hover.current) * 0.15;
    ref.current?.scale.setScalar(1 + hover.current * 1.1);
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        hovered.current = true;
        cursor.over();
      }}
      onPointerOut={() => {
        hovered.current = false;
        cursor.out();
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onWave(e.object.getWorldPosition(new Vector3()), color);
      }}
    >
      <mesh>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.14}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const MAX_TILT = 0.9;

function Graph({ active }: { active: boolean }) {
  const group = useRef<Group>(null);
  const core = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });
  const auto = useRef(0);
  // What the visitor has added by dragging; it coasts, then keeps its angle.
  const user = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const nextId = useRef(0);
  const [waves, setWaves] = useState<{ id: number; at: Vector3; color: string }[]>([]);
  const { invalidate, gl } = useThree();

  // Tracked independently of R3F's own pointer state: the cursor tilt works
  // anywhere on the page, not just over the canvas.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      user.current.y += dx * 0.008;
      user.current.x = Math.max(-MAX_TILT, Math.min(MAX_TILT, user.current.x + dy * 0.006));
      user.current.vy = dx * 0.008;
      user.current.vx = dy * 0.006;
    }
    function onUp() {
      dragging.current = false;
    }
    function onDown(e: PointerEvent) {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      user.current.vx = user.current.vy = 0;
    }
    const el = gl.domElement;
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!active || !group.current) return;
    auto.current += delta * 0.08;
    if (!dragging.current) {
      user.current.y += user.current.vy;
      user.current.x = Math.max(-MAX_TILT, Math.min(MAX_TILT, user.current.x + user.current.vx));
      user.current.vy *= 0.94;
      user.current.vx *= 0.94;
    }
    tilt.current.y += (pointer.current.x * 0.3 - tilt.current.y) * 0.05;
    tilt.current.x += (pointer.current.y * -0.2 - tilt.current.x) * 0.05;
    group.current.rotation.y = auto.current + user.current.y;
    group.current.rotation.x = tilt.current.x + user.current.x;
    group.current.position.x = tilt.current.y * 0.4;
    if (core.current) {
      core.current.rotation.y -= delta * 0.18;
      core.current.rotation.x += delta * 0.07;
    }
    // Re-arms the next frame under frameloop="demand"  the moment `active`
    // goes false (hero scrolled out of view) this stops getting called and
    // the render loop goes idle on its own.
    invalidate();
  });

  return (
    <>
      <group ref={group}>
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[1.05, 1]} />
            <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.14} />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[1.7, 1]} />
            <meshBasicMaterial color="#4C86FF" wireframe transparent opacity={0.07} />
          </mesh>
        </group>
        <Orbit radius={1.9} tilt={[1.1, 0, 0.3]} speed={0.45} color="#22D3EE" />
        <Orbit radius={2.35} tilt={[-0.7, 0.4, -0.6]} speed={-0.3} color="#4C86FF" />
        <Orbit radius={2.8} tilt={[0.3, 0, 1.2]} speed={0.2} color="#7C5CFF" />
        {EDGES.map(([a, b], i) => (
          <Edge key={i} from={NODES[a]} to={NODES[b]} />
        ))}
        {EDGES.filter((_, i) => i % 2 === 0).map(([a, b], i) => (
          <Pulse
            key={i}
            from={NODES[a]}
            to={NODES[b]}
            offset={i * 0.17}
            speed={0.22 + (i % 3) * 0.06}
          />
        ))}
        {NODES.map((p, i) => (
          <GraphNode
            key={i}
            position={p}
            color={i % 3 === 0 ? "#22D3EE" : "#4C86FF"}
            onWave={(at, color) =>
              setWaves((w) => [...w.slice(-5), { id: nextId.current++, at, color }])
            }
          />
        ))}
        <Dust />
      </group>
      {waves.map((w) => (
        <Shockwave
          key={w.id}
          position={[w.at.x, w.at.y, w.at.z]}
          color={w.color}
          max={1.6}
          onDone={() => setWaves((all) => all.filter((x) => x.id !== w.id))}
        />
      ))}
    </>
  );
}

export default function HeroSceneCanvas({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      style={{ cursor: "grab" }}
    >
      <Graph active={active} />
    </Canvas>
  );
}
