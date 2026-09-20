import { Html, Sparkles } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Project } from '../data/projects';

type SceneMode = 'hero' | 'showroom';

interface ImmersiveSceneProps {
  mode?: SceneMode;
  projects?: Project[];
  selectedProject?: string | null;
  onSelect?: (slug: string) => void;
}

function FallbackVisual({ mode }: { mode: SceneMode }) {
  return (
    <div className={`scene-fallback scene-fallback--${mode}`} role="img" aria-label="Aman Labs architectural visual fallback">
      <div className="fallback-orbit fallback-orbit--a" />
      <div className="fallback-orbit fallback-orbit--b" />
      <div className="fallback-core"><span>AS</span><i /></div>
      <div className="fallback-label">{mode === 'hero' ? '3D / FALLBACK' : 'SHOWROOM / FALLBACK'}</div>
    </div>
  );
}

function Sculpture({ mode }: { mode: SceneMode }) {
  const root = useRef<THREE.Group>(null);
  const shard = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const t = clock.getElapsedTime();
    root.current.rotation.y += delta * (mode === 'hero' ? 0.16 : 0.1);
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, pointer.current.y * -0.12, 0.025);
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, pointer.current.x * 0.18, 0.025);
    root.current.position.y = Math.sin(t * 0.72) * 0.08;
    if (shard.current) {
      shard.current.rotation.x -= delta * 0.35;
      shard.current.rotation.z += delta * 0.48;
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * (mode === 'hero' ? 0.35 : 0.18), 0.018);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.current.y * -0.18 + (mode === 'hero' ? 0.05 : 0.4), 0.018);
    camera.lookAt(0, mode === 'hero' ? 0.05 : 0.5, 0);
  });

  return (
    <group ref={root} scale={mode === 'hero' ? 1.05 : 0.78}>
      <mesh castShadow>
        <icosahedronGeometry args={[1.02, 3]} />
        <meshStandardMaterial color="#c6f4ff" emissive="#1a6b84" emissiveIntensity={0.55} metalness={0.78} roughness={0.2} wireframe={false} />
      </mesh>
      <mesh ref={shard} rotation={[0.8, 0.2, 0.4]} castShadow>
        <torusKnotGeometry args={[0.78, 0.075, 160, 18, 2, 3]} />
        <meshStandardMaterial color="#789aff" emissive="#3147ad" emissiveIntensity={0.75} metalness={0.86} roughness={0.16} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.012, 12, 96]} />
        <meshBasicMaterial color="#79eaff" transparent opacity={0.65} />
      </mesh>
      <mesh rotation={[0.2, 0.4, Math.PI / 3]}>
        <torusGeometry args={[1.67, 0.009, 10, 96]} />
        <meshBasicMaterial color="#aa8fff" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.1, -1.12, 0]} rotation={[0.2, 0.2, 0]}>
        <cylinderGeometry args={[0.62, 0.82, 0.12, 8]} />
        <meshStandardMaterial color="#132d48" emissive="#0a3045" emissiveIntensity={0.4} metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <torusGeometry args={[0.55, 0.025, 8, 48]} />
        <meshBasicMaterial color="#79eaff" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function ShowroomModule({ project, index, selected, onSelect }: { project: Project; index: number; selected: boolean; onSelect?: (slug: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const targetY = selected ? 0.18 : 0;
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (selected ? 0.22 : 0.06);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY + Math.sin(index * 1.4) * 0.04, 0.06);
  });
  const position: [number, number, number] = [(index - 1.5) * 2.35, 0, Math.abs(index - 1.5) * 0.42 - 0.2];
  return (
    <group ref={group} position={position} onClick={(event) => { event.stopPropagation(); onSelect?.(project.slug); }}>
      <mesh castShadow>
        <boxGeometry args={[1.35, 0.16, 0.9]} />
        <meshStandardMaterial color="#142b43" emissive={project.accent} emissiveIntensity={selected ? 0.22 : 0.06} metalness={0.7} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.86, 1.12, 0.07]} />
        <meshStandardMaterial color={project.accent} emissive={project.accent} emissiveIntensity={selected ? 0.7 : 0.18} metalness={0.35} roughness={0.26} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 1.26, 0]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.11, 0]} />
        <meshBasicMaterial color={project.accent} />
      </mesh>
      <Html position={[0, -0.38, 0.1]} center distanceFactor={7}>
        <button className={`showroom-label ${selected ? 'is-selected' : ''}`} type="button" onClick={() => onSelect?.(project.slug)}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <b>{project.name}</b>
          <em>{project.status}</em>
        </button>
      </Html>
    </group>
  );
}

function Scene({ mode = 'hero', projects = [], selectedProject, onSelect }: ImmersiveSceneProps) {
  return (
    <>
      <color attach="background" args={['#06101d']} />
      <fog attach="fog" args={['#06101d', 5, 15]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={3.2} color="#b9f0ff" castShadow />
      <pointLight position={[-4, 2, 2]} intensity={12} distance={8} color="#4769ff" />
      <pointLight position={[4, 1, -1]} intensity={9} distance={7} color="#c18cff" />
      <Sparkles count={mode === 'hero' ? 180 : 115} scale={mode === 'hero' ? 7 : 10} size={1.8} speed={0.18} color="#a6eaff" noise={0.6} />
      <Sculpture mode={mode} />
      {mode === 'showroom' && (
        <>
          {projects.map((project, index) => <ShowroomModule key={project.slug} project={project} index={index} selected={selectedProject === project.slug} onSelect={onSelect} />)}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
            <planeGeometry args={[12, 8]} />
            <meshStandardMaterial color="#081727" metalness={0.6} roughness={0.32} />
          </mesh>
          <gridHelper args={[12, 24, '#1e5368', '#10253b']} position={[0, -0.1, 0]} />
        </>
      )}
    </>
  );
}

export default function ImmersiveScene({ mode = 'hero', projects = [], selectedProject, onSelect }: ImmersiveSceneProps) {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = 'connection' in navigator && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    setEnabled(!reduce && !saveData && !(memory && memory <= 2));
    setReady(true);
  }, []);
  const dpr = useMemo(() => {
    const pixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio;
    return (pixelRatio > 1.5 ? [1, 1.35] : [1, 1.5]) as [number, number];
  }, []);
  if (!ready || !enabled) return <FallbackVisual mode={mode} />;
  return (
    <Canvas className={`immersive-canvas immersive-canvas--${mode}`} dpr={dpr} camera={{ position: [0, mode === 'hero' ? 0.15 : 1.6, mode === 'hero' ? 5.1 : 6.6], fov: mode === 'hero' ? 38 : 42 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} shadows fallback={<FallbackVisual mode={mode} />}>
      <Scene mode={mode} projects={projects} selectedProject={selectedProject} onSelect={onSelect} />
    </Canvas>
  );
}
