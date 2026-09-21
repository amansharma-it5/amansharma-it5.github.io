import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Project } from '../data/projects';

export type SceneMode = 'hero' | 'showroom';
export type SceneFinish = 'graphite' | 'bone' | 'champagne';

export interface ImmersiveSceneProps {
  mode?: SceneMode;
  projects?: Project[];
  selectedProject?: string | null;
  onSelect?: (slug: string) => void;
  finish?: SceneFinish;
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

const finishPalette: Record<SceneFinish, { body: string; accent: string; base: string }> = {
  graphite: { body: '#8e9698', accent: '#d5b27b', base: '#1c2023' },
  bone: { body: '#d8d0c2', accent: '#b5a079', base: '#2c2924' },
  champagne: { body: '#c7a875', accent: '#f4e3bd', base: '#2b2116' },
};

function Sculpture({ mode, finish }: { mode: SceneMode; finish: SceneFinish }) {
  const root = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const palette = finishPalette[finish];

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame(() => {
    if (!root.current) return;
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.current.x * (mode === 'hero' ? 0.38 : 0.2), 0.045);
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, pointer.current.y * -0.16, 0.045);
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, pointer.current.x * 0.16, 0.045);
    root.current.position.y = THREE.MathUtils.lerp(root.current.position.y, 0, 0.045);
    if (orbit.current) orbit.current.rotation.y = THREE.MathUtils.lerp(orbit.current.rotation.y, pointer.current.x * 0.16, 0.035);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * (mode === 'hero' ? 0.32 : 0.16), 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.current.y * -0.12 + (mode === 'hero' ? 0.05 : 0.4), 0.025);
    camera.lookAt(0, mode === 'hero' ? 0.05 : 0.5, 0);
  });

  return (
    <group ref={root} scale={mode === 'hero' ? 1.05 : 0.78}>
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[1.22, 1.72, 0.34]} />
        <meshPhysicalMaterial color={palette.body} metalness={0.76} roughness={0.25} clearcoat={0.62} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[0, 0.04, 0.18]}>
        <boxGeometry args={[1.02, 1.5, 0.035]} />
        <meshStandardMaterial color={palette.base} metalness={0.58} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.57, 0.205]}>
        <boxGeometry args={[0.68, 0.035, 0.018]} />
        <meshBasicMaterial color={palette.accent} />
      </mesh>
      <mesh position={[0, 0.36, 0.207]}>
        <boxGeometry args={[0.68, 0.018, 0.018]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.43, 0.208]}>
        <boxGeometry args={[0.68, 0.018, 0.018]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.36} />
      </mesh>
      <group ref={orbit}>
        <mesh position={[-0.86, 0.68, 0]} rotation={[0.18, 0.28, 0.2]}>
          <octahedronGeometry args={[0.17, 0]} />
          <meshPhysicalMaterial color={palette.accent} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0.84, 0.04, 0.1]} rotation={[0.1, 0.3, 0.5]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshPhysicalMaterial color="#d6d1c5" metalness={0.65} roughness={0.25} />
        </mesh>
        <mesh position={[-0.67, -0.82, 0.12]} rotation={[0.4, 0.2, 0.3]}>
          <octahedronGeometry args={[0.1, 0]} />
          <meshPhysicalMaterial color={palette.accent} metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.1, -0.24]} scale={[1.14, 0.88, 0.62]}>
          <torusGeometry args={[1.18, 0.012, 8, 96]} />
          <meshBasicMaterial color={palette.accent} transparent opacity={0.28} />
        </mesh>
        <mesh rotation={[0.3, 0.55, Math.PI / 2.5]} scale={[0.94, 1.16, 0.72]}>
          <torusGeometry args={[1.42, 0.008, 8, 96]} />
          <meshBasicMaterial color="#e8e3d8" transparent opacity={0.14} />
        </mesh>
      </group>
      <mesh position={[0, -1.02, 0]} rotation={[0.12, 0.18, 0]}>
        <cylinderGeometry args={[0.58, 0.72, 0.12, 48]} />
        <meshStandardMaterial color={palette.base} metalness={0.88} roughness={0.28} />
      </mesh>
      <mesh position={[0, -1.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.49, 0.018, 8, 48]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.58} />
      </mesh>
    </group>
  );
}

function ShowroomModule({ project, index, selected, onSelect }: { project: Project; index: number; selected: boolean; onSelect?: (slug: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const targetY = selected ? 0.18 : 0;
  useFrame(() => {
    if (!group.current) return;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.08);
  });
  const position: [number, number, number] = [(index - 1.5) * 2.35, 0, Math.abs(index - 1.5) * 0.42 - 0.2];
  return (
    <group ref={group} position={position} onClick={(event) => { event.stopPropagation(); onSelect?.(project.slug); }}>
      <mesh castShadow>
        <boxGeometry args={[1.35, 0.16, 0.9]} />
        <meshStandardMaterial color="#272b2d" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.86, 1.12, 0.07]} />
        <meshStandardMaterial color={selected ? '#d8b47a' : '#7d8588'} metalness={0.58} roughness={0.3} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 1.26, 0]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.11, 0]} />
        <meshBasicMaterial color={project.accent} />
      </mesh>
    </group>
  );
}

function Scene({ mode = 'hero', projects = [], selectedProject, onSelect, finish = 'graphite' }: ImmersiveSceneProps) {
  return (
    <>
      <color attach="background" args={['#151515']} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff4e4" castShadow />
      <directionalLight position={[-4, 2, 2]} intensity={1.1} color="#9aa9b6" />
      <pointLight position={[1, 2, 3]} intensity={2} distance={8} color="#d6b27a" />
      <Sculpture mode={mode} finish={finish} />
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

export default function ImmersiveScene({ mode = 'hero', projects = [], selectedProject, onSelect, finish = 'graphite' }: ImmersiveSceneProps) {
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
      <Scene mode={mode} projects={projects} selectedProject={selectedProject} onSelect={onSelect} finish={finish} />
    </Canvas>
  );
}
