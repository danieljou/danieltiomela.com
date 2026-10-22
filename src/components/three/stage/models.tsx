"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, EdgesGeometry, Quaternion, Vector3, type Group, type Mesh } from "three";
import { Glow } from "../shared/Glow";
import { Edge } from "../shared/Edge";
import { latLongToVector3 } from "../act2/constants";

const BLUE = "#2F6BFF";
const CYAN = "#22D3EE";
const CYAN_L = "#67E8F9";
const VIOLET = "#7C5CFF";
const SURFACE = "#13203f";
const Y = new Vector3(0, 1, 0);

const edgeCache = new Map<string, EdgesGeometry>();
function edgesFor(w: number, h: number, d: number) {
  const key = `${w}|${h}|${d}`;
  let g = edgeCache.get(key);
  if (!g) {
    g = new EdgesGeometry(new BoxGeometry(w, h, d));
    edgeCache.set(key, g);
  }
  return g;
}

/** A lit box with glowing edges  the building block of every model here. */
export function EBox({
  size,
  position = [0, 0, 0],
  color = SURFACE,
  emissive = BLUE,
  ei = 0.3,
  edge = CYAN_L,
  edgeOpacity = 0.8,
  opacity = 1,
}: {
  size: [number, number, number];
  position?: [number, number, number];
  color?: string;
  emissive?: string;
  ei?: number;
  edge?: string;
  edgeOpacity?: number;
  opacity?: number;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={ei}
          roughness={0.4}
          metalness={0.5}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      <lineSegments geometry={edgesFor(...size)}>
        <lineBasicMaterial color={edge} transparent opacity={edgeOpacity} />
      </lineSegments>
    </group>
  );
}

/** A circular plinth with a glowing rim, so each object stands on something. */
export function Plinth({ radius = 1.15 }: { radius?: number }) {
  return (
    <group>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[radius, radius, 0.08, 48]} />
        <meshStandardMaterial color="#0c1530" emissive={BLUE} emissiveIntensity={0.12} roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.03, radius, 64]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.8} />
      </mesh>
      <Glow color={BLUE} scale={radius * 3} opacity={0.22} position={[0, 0.1, 0]} />
    </group>
  );
}

/* ── Backend: a rack of servers with status lights ─────────────────────── */
export function Rack() {
  const leds = useRef<(Mesh | null)[]>([]);
  useFrame((s) => {
    leds.current.forEach((m, i) => {
      if (!m) return;
      const on = Math.sin(s.clock.elapsedTime * 3 + i * 1.7) > -0.3;
      m.scale.setScalar(on ? 1 : 0.35);
    });
  });
  return (
    <group>
      <Plinth />
      {Array.from({ length: 6 }, (_, i) => (
        <group key={i} position={[0, 0.16 + i * 0.25, 0]}>
          <EBox size={[1.25, 0.21, 0.8]} ei={0.2 + (i % 2) * 0.1} />
          {[0, 1, 2].map((j) => (
            <mesh
              key={j}
              position={[-0.45 + j * 0.13, 0, 0.41]}
              ref={(el) => {
                leds.current[i * 3 + j] = el;
              }}
            >
              <boxGeometry args={[0.06, 0.06, 0.02]} />
              <meshBasicMaterial color={j === 0 ? "#34d399" : CYAN_L} />
            </mesh>
          ))}
          <EBox size={[0.5, 0.07, 0.02]} position={[0.3, 0, 0.41]} color="#0a1122" ei={0} edgeOpacity={0.35} />
        </group>
      ))}
      <Glow color={CYAN} scale={2.4} opacity={0.25} position={[0, 0.9, 0.6]} />
    </group>
  );
}

/* ── Geospatial: a wire globe with pins ────────────────────────────────── */
const PINS: [number, number][] = [
  [3.8, 11.5],
  [6.4, 2.4],
  [48.8, 2.3],
  [-23.5, -46.6],
  [40.7, -74],
  [35.7, 139.7],
];
export function GeoGlobe() {
  const spin = useRef<Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.35;
  });
  const pins = useMemo(
    () =>
      PINS.map(([lat, lon]) => {
        const p = latLongToVector3(lat, lon, 0.64);
        const q = new Quaternion().setFromUnitVectors(Y, p.clone().normalize());
        return { p, q };
      }),
    [],
  );
  return (
    <group>
      <Plinth />
      <group position={[0, 0.95, 0]}>
        <group ref={spin}>
          <mesh>
            <sphereGeometry args={[0.62, 32, 24]} />
            <meshStandardMaterial color="#0c1a3a" emissive={BLUE} emissiveIntensity={0.3} roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.645, 20, 14]} />
            <meshBasicMaterial color={CYAN_L} wireframe transparent opacity={0.3} />
          </mesh>
          {pins.map(({ p, q }, i) => (
            <group key={i} position={p} quaternion={q}>
              <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.035, 0.2, 10]} />
                <meshBasicMaterial color={i < 2 ? "#ffffff" : CYAN_L} />
              </mesh>
              <Glow color={CYAN} scale={0.3} opacity={0.9} position={[0, 0.22, 0]} />
            </group>
          ))}
        </group>
        <mesh rotation={[1.25, 0.2, 0]}>
          <torusGeometry args={[0.92, 0.008, 8, 120]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.6} />
        </mesh>
        <Glow color={BLUE} scale={2.6} opacity={0.35} />
      </group>
    </group>
  );
}

/* ── Infrastructure: containers and a crane lifting one ────────────────── */
const BOX_COLORS = [BLUE, CYAN, VIOLET];
export function Containers() {
  const hook = useRef<Group>(null);
  useFrame((s) => {
    if (hook.current) hook.current.position.y = 1.45 + Math.sin(s.clock.elapsedTime * 0.9) * 0.22;
  });
  const grid: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) for (let z = 0; z <= 1; z++) grid.push([x * 0.52, 0.16, z * 0.36 - 0.18]);
  const top: [number, number, number][] = [
    [-0.52, 0.48, -0.18],
    [0.52, 0.48, 0.18],
  ];
  return (
    <group>
      <Plinth />
      {[...grid, ...top].map((p, i) => (
        <EBox
          key={i}
          size={[0.48, 0.3, 0.32]}
          position={p}
          emissive={BOX_COLORS[i % 3]}
          ei={0.55}
          edge={CYAN_L}
          edgeOpacity={0.6}
        />
      ))}
      <EBox size={[0.04, 1.5, 0.04]} position={[-0.95, 0.75, 0]} edgeOpacity={0.5} />
      <EBox size={[0.04, 1.5, 0.04]} position={[0.95, 0.75, 0]} edgeOpacity={0.5} />
      <EBox size={[2, 0.05, 0.05]} position={[0, 1.52, 0]} edgeOpacity={0.5} />
      <group ref={hook} position={[0.2, 1.45, 0]}>
        <EBox size={[0.48, 0.3, 0.32]} position={[0, -0.4, 0]} emissive={CYAN} ei={0.9} />
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.44, 6]} />
          <meshBasicMaterial color={CYAN_L} />
        </mesh>
        <Glow color={CYAN} scale={0.9} opacity={0.5} position={[0, -0.4, 0]} />
      </group>
    </group>
  );
}

/* ── Web apps: a window whose parts float at different depths ──────────── */
export function WebApp() {
  const bars = useRef<(Mesh | null)[]>([]);
  useFrame((s) => {
    bars.current.forEach((m, i) => {
      if (m) m.scale.y = 0.65 + Math.sin(s.clock.elapsedTime * 1.4 + i * 0.9) * 0.3;
    });
  });
  const heights = [0.3, 0.5, 0.38, 0.62, 0.45];
  return (
    <group position={[0, 0.2, 0]}>
      <Plinth radius={1.25} />
      <group position={[0, 0.9, 0]}>
        <EBox size={[1.8, 1.1, 0.05]} ei={0.15} />
        <EBox size={[1.8, 0.14, 0.08]} position={[0, 0.48, 0.02]} emissive={CYAN} ei={0.4} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.8 + i * 0.1, 0.48, 0.07]}>
            <sphereGeometry args={[0.025, 10, 10]} />
            <meshBasicMaterial color={["#ff6b6b", "#f2b84b", "#34d399"][i]} />
          </mesh>
        ))}
        <EBox size={[0.36, 0.84, 0.07]} position={[-0.7, -0.05, 0.1]} ei={0.4} />
        <EBox size={[0.7, 0.34, 0.06]} position={[0.05, 0.22, 0.26]} ei={0.5} emissive={CYAN} />
        <EBox size={[0.45, 0.3, 0.06]} position={[0.62, -0.25, 0.4]} ei={0.5} emissive={VIOLET} />
        <group position={[-0.1, -0.35, 0.18]}>
          {heights.map((h, i) => (
            <mesh
              key={i}
              position={[i * 0.12, h / 2, 0]}
              ref={(el) => {
                bars.current[i] = el;
              }}
            >
              <boxGeometry args={[0.08, h, 0.06]} />
              <meshStandardMaterial color={BLUE} emissive={i % 2 ? CYAN : BLUE} emissiveIntensity={0.7} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/* ── API: a service graph with traffic ─────────────────────────────────── */
const API_NODES: [number, number, number][] = [
  [0, 0, 0],
  [-0.8, 0.55, 0.2],
  [0.75, 0.6, -0.2],
  [-0.65, -0.5, -0.35],
  [0.7, -0.45, 0.3],
  [0, 0.95, -0.5],
  [0, -0.95, 0.4],
];
const API_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [2, 4], [3, 6],
];
function ApiPacket({ a, b, offset }: { a: number; b: number; offset: number }) {
  const m = useRef<Group>(null);
  useFrame((s) => {
    if (!m.current) return;
    const t = (s.clock.elapsedTime * 0.35 + offset) % 1;
    m.current.position.lerpVectors(
      new Vector3(...API_NODES[a]),
      new Vector3(...API_NODES[b]),
      t,
    );
  });
  return (
    <group ref={m}>
      <mesh>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Glow color={CYAN_L} scale={0.4} opacity={0.9} />
    </group>
  );
}
export function ApiGraph() {
  const spin = useRef<Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.25;
  });
  return (
    <group>
      <Plinth />
      <group position={[0, 1.05, 0]}>
        <group ref={spin}>
          {API_EDGES.map(([a, b], i) => (
            <Edge key={i} from={API_NODES[a]} to={API_NODES[b]} color="#4C86FF" opacity={0.8} />
          ))}
          {API_EDGES.map(([a, b], i) => (
            <ApiPacket key={`p${i}`} a={a} b={b} offset={i * 0.13} />
          ))}
          {API_NODES.map((p, i) => (
            <group key={i} position={p}>
              <mesh>
                <icosahedronGeometry args={[i === 0 ? 0.2 : 0.1, 1]} />
                <meshStandardMaterial
                  color={i === 0 ? CYAN : BLUE}
                  emissive={i === 0 ? CYAN : BLUE}
                  emissiveIntensity={0.9}
                  roughness={0.3}
                />
              </mesh>
              <Glow color={i === 0 ? CYAN : BLUE} scale={i === 0 ? 1 : 0.5} opacity={0.5} />
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

/* ── Architecture: layers held apart by pillars ────────────────────────── */
export function Layers() {
  const pulse = useRef<Group>(null);
  useFrame((s) => {
    if (pulse.current) pulse.current.position.y = ((s.clock.elapsedTime * 0.4) % 1) * 1.3 + 0.2;
  });
  return (
    <group>
      <Plinth radius={1.3} />
      {[0, 1, 2, 3].map((i) => (
        <EBox
          key={i}
          size={[1.7, 0.07, 1.15]}
          position={[0, 0.2 + i * 0.4, 0]}
          emissive={i === 2 ? CYAN : BLUE}
          ei={0.3 + i * 0.1}
          opacity={0.7}
        />
      ))}
      {[[-0.78, -0.5], [0.78, -0.5], [-0.78, 0.5], [0.78, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.8, z]}>
          <cylinderGeometry args={[0.025, 0.025, 1.3, 8]} />
          <meshBasicMaterial color={CYAN_L} transparent opacity={0.6} />
        </mesh>
      ))}
      <group ref={pulse}>
        <mesh>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Glow color={CYAN_L} scale={0.7} opacity={0.9} />
      </group>
    </group>
  );
}

/* ── DevOps: a pipeline of stages with a package moving through ────────── */
export function Pipeline() {
  const pkg = useRef<Group>(null);
  const gear = useRef<Mesh>(null);
  useFrame((s, dt) => {
    if (pkg.current) pkg.current.position.x = -1.05 + ((s.clock.elapsedTime * 0.3) % 1) * 2.1;
    if (gear.current) gear.current.rotation.z += dt * 1.2;
  });
  return (
    <group>
      <Plinth radius={1.3} />
      {[-1.05, -0.35, 0.35, 1.05].map((x, i) => (
        <EBox
          key={i}
          size={[0.4, 0.4, 0.4]}
          position={[x, 0.5, 0]}
          emissive={BOX_COLORS[i % 3]}
          ei={0.6}
        />
      ))}
      {[-0.7, 0, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.18, 10]} />
          <meshBasicMaterial color={CYAN_L} />
        </mesh>
      ))}
      <mesh ref={gear} position={[0, 1.15, 0]}>
        <torusGeometry args={[0.24, 0.07, 8, 6]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.8} />
      </mesh>
      <group ref={pkg} position={[-1.05, 0.5, 0.34]}>
        <mesh>
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Glow color={CYAN_L} scale={0.7} opacity={0.9} />
      </group>
    </group>
  );
}

/* ── Mobile: a phone with cards floating above its screen ──────────────── */
export function Phone() {
  const cards = useRef<(Group | null)[]>([]);
  useFrame((s) => {
    cards.current.forEach((g, i) => {
      if (g) g.position.z = 0.22 + i * 0.13 + Math.sin(s.clock.elapsedTime * 1.2 + i) * 0.03;
    });
  });
  return (
    <group>
      <Plinth />
      <group position={[0, 0.85, 0]} rotation={[0, -0.3, 0]}>
        <EBox size={[0.72, 1.3, 0.09]} ei={0.15} />
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[0.62, 1.18]} />
          <meshStandardMaterial color="#0f2a6a" emissive={BLUE} emissiveIntensity={0.8} />
        </mesh>
        {[0.38, 0.05, -0.28].map((y, i) => (
          <group
            key={i}
            position={[i % 2 ? 0.05 : -0.05, y, 0.22]}
            ref={(el) => {
              cards.current[i] = el;
            }}
          >
            <EBox size={[0.5, 0.22, 0.03]} emissive={i === 1 ? CYAN : VIOLET} ei={0.7} />
          </group>
        ))}
      </group>
    </group>
  );
}

/* ── Tower layers: one decoration per layer of the system ─────────────── */
function Decoration({ index }: { index: number }) {
  switch (index % 5) {
    case 0: // users
      return (
        <group>
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.75, 0.17, Math.sin(a) * 0.45]}>
                <capsuleGeometry args={[0.055, 0.15, 4, 10]} />
                <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} />
              </mesh>
            );
          })}
        </group>
      );
    case 1: // web + mobile
      return (
        <group>
          <EBox size={[0.9, 0.55, 0.04]} position={[-0.3, 0.38, 0]} ei={0.5} emissive={CYAN} />
          <EBox size={[0.3, 0.5, 0.04]} position={[0.55, 0.36, 0.1]} ei={0.5} emissive={BLUE} />
        </group>
      );
    case 2: // API
      return (
        <group position={[0, 0.3, 0]}>
          {([[-0.6, 0, 0], [0, 0.1, 0.1], [0.6, 0, -0.1]] as [number, number, number][]).map((p, i) => (
            <mesh key={i} position={p}>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial color={BLUE} emissive={CYAN} emissiveIntensity={0.8} />
            </mesh>
          ))}
          <Edge from={[-0.6, 0, 0]} to={[0, 0.1, 0.1]} color={CYAN_L} opacity={0.9} />
          <Edge from={[0, 0.1, 0.1]} to={[0.6, 0, -0.1]} color={CYAN_L} opacity={0.9} />
          <Glow color={CYAN} scale={1.4} opacity={0.4} position={[0, 0.1, 0]} />
        </group>
      );
    case 3: // data
      return (
        <group>
          {[-0.45, 0.45].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              {[0.1, 0.26, 0.42].map((y) => (
                <mesh key={y} position={[0, y, 0]}>
                  <cylinderGeometry args={[0.28, 0.28, 0.13, 28]} />
                  <meshStandardMaterial color="#13306a" emissive={VIOLET} emissiveIntensity={0.55} roughness={0.35} metalness={0.5} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      );
    default: // infrastructure
      return (
        <group>
          {[-0.6, 0, 0.6].map((x, i) =>
            [-0.22, 0.22].map((z, j) => (
              <EBox
                key={`${i}${j}`}
                size={[0.5, 0.26, 0.34]}
                position={[x, 0.17, z]}
                emissive={BOX_COLORS[(i + j) % 3]}
                ei={0.55}
                edgeOpacity={0.6}
              />
            )),
          )}
        </group>
      );
  }
}
export function TowerLayer({ index }: { index: number }) {
  return (
    <group>
      <EBox size={[2.7, 0.09, 1.75]} ei={0.35} opacity={0.82} />
      <group position={[0, 0.045, 0]}>
        <Decoration index={index} />
      </group>
    </group>
  );
}

/* ── Websites: a landing page on a monitor, with a cursor pressing its button ── */
export function Site() {
  const cursor = useRef<Group>(null);
  useFrame((s) => {
    if (!cursor.current) return;
    const t = s.clock.elapsedTime;
    cursor.current.position.x = 0.55 + Math.sin(t * 0.9) * 0.16;
    cursor.current.position.y = -0.12 + Math.cos(t * 0.9) * 0.08;
  });
  return (
    <group>
      <Plinth radius={1.3} />
      {/* stand */}
      <EBox size={[0.12, 0.45, 0.1]} position={[0, 0.25, 0]} edgeOpacity={0.4} />
      <EBox size={[0.7, 0.05, 0.4]} position={[0, 0.03, 0]} edgeOpacity={0.4} />
      <group position={[0, 1.2, 0]}>
        <EBox size={[2.1, 1.3, 0.07]} ei={0.12} />
        {/* the page */}
        <EBox size={[1.9, 0.5, 0.05]} position={[0, 0.3, 0.07]} emissive={BLUE} ei={0.6} edgeOpacity={0.4} />
        <EBox size={[0.9, 0.09, 0.05]} position={[-0.35, 0.38, 0.14]} emissive={CYAN_L} ei={0.9} edge={CYAN_L} />
        <EBox size={[0.6, 0.06, 0.05]} position={[-0.5, 0.24, 0.14]} emissive={CYAN} ei={0.5} />
        <EBox size={[0.36, 0.14, 0.06]} position={[0.55, -0.12, 0.2]} emissive={CYAN} ei={1.1} />
        {[-0.62, 0, 0.62].map((x, i) => (
          <EBox
            key={i}
            size={[0.5, 0.36, 0.05]}
            position={[x, -0.4, 0.1 + i * 0.04]}
            emissive={BOX_COLORS[i]}
            ei={0.5}
          />
        ))}
        <group ref={cursor} position={[0.55, -0.12, 0.34]}>
          <mesh rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.06, 0.16, 3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Glow color={CYAN_L} scale={0.5} opacity={0.8} />
        </group>
      </group>
    </group>
  );
}
