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
  progress?: number;
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

const monogramA = new THREE.Shape();
monogramA.moveTo(-0.78, -0.82);
monogramA.lineTo(-0.18, 0.82);
monogramA.lineTo(0.14, 0.82);
monogramA.lineTo(0.78, -0.82);
monogramA.lineTo(0.44, -0.82);
monogramA.lineTo(0.26, -0.34);
monogramA.lineTo(-0.28, -0.34);
monogramA.lineTo(-0.44, -0.82);
monogramA.closePath();
const monogramAHole = new THREE.Path();
monogramAHole.moveTo(-0.2, -0.08);
monogramAHole.lineTo(0.18, -0.08);
monogramAHole.lineTo(0.04, 0.43);
monogramAHole.lineTo(-0.06, 0.43);
monogramAHole.closePath();
monogramA.holes.push(monogramAHole);

const monogramS = new THREE.Shape();
[
  [-0.24, 0.76], [0.18, 0.82], [0.5, 0.62], [0.55, 0.33], [0.34, 0.1],
  [-0.1, -0.02], [-0.3, -0.18], [-0.26, -0.4], [-0.06, -0.5], [0.24, -0.44],
  [0.46, -0.66], [0.2, -0.84], [-0.22, -0.82], [-0.56, -0.6], [-0.6, -0.3],
  [-0.38, -0.06], [0.08, 0.1], [0.25, 0.24], [0.21, 0.43], [0.02, 0.51],
  [-0.26, 0.45], [-0.46, 0.6]
].forEach(([x, y], index) => index === 0 ? monogramS.moveTo(x, y) : monogramS.lineTo(x, y));
monogramS.closePath();

const bevel = { depth: 0.16, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.04, bevelSegments: 3, curveSegments: 8 };

function Sculpture({ mode, finish, progress = 0 }: { mode: SceneMode; finish: SceneFinish; progress?: number }) {
  const root = useRef<THREE.Group>(null);
  const { camera, invalidate } = useThree();
  const target = useRef({ x: 0, y: 0, progress });
  const palette = finishPalette[finish];

  useEffect(() => {
    const move = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
      invalidate();
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [invalidate]);

  useEffect(() => {
    target.current.progress = progress;
    invalidate();
  }, [progress, invalidate]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const scrollTurn = mode === 'hero' ? target.current.progress * 0.92 : 0;
    const desiredY = target.current.x * 0.17 + scrollTurn;
    const desiredX = target.current.y * -0.09;
    const desiredXPosition = target.current.x * 0.07;
    const desiredYPosition = mode === 'hero' ? Math.sin(target.current.progress * Math.PI) * 0.12 : 0.4;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, desiredY, 3.4, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, desiredX, 3.4, delta);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, desiredXPosition, 3.4, delta);
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, desiredYPosition, 3.4, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x * 0.13, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.current.y * -0.1 + (mode === 'hero' ? 0.02 : 0.4), 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, mode === 'hero' ? 5.1 - target.current.progress * 0.3 : 5.2, 3, delta);
    camera.lookAt(0, mode === 'hero' ? 0.05 : 0.5, 0);
    const moving = Math.abs(root.current.rotation.y - desiredY) > 0.001 || Math.abs(root.current.rotation.x - desiredX) > 0.001 || Math.abs(root.current.position.x - desiredXPosition) > 0.001 || Math.abs(root.current.position.y - desiredYPosition) > 0.001 || Math.abs(camera.position.x - target.current.x * 0.13) > 0.001 || Math.abs(camera.position.y - (target.current.y * -0.1 + (mode === 'hero' ? 0.02 : 0.4))) > 0.001 || Math.abs(camera.position.z - (mode === 'hero' ? 5.1 - target.current.progress * 0.3 : 5.2)) > 0.001;
    if (moving) invalidate();
  });

  return (
    <group ref={root} scale={mode === 'hero' ? 0.92 : 1.12}>
      <group position={[-0.43, 0.12, 0.02]} rotation={[0, -0.05, 0]}>
        <mesh castShadow><extrudeGeometry args={[monogramA, bevel]} /><meshPhysicalMaterial color={palette.body} metalness={0.78} roughness={0.23} clearcoat={0.8} clearcoatRoughness={0.17} /></mesh>
      </group>
      <group position={[0.47, 0.12, 0.1]} rotation={[0, 0.08, 0]}>
        <mesh castShadow><extrudeGeometry args={[monogramS, bevel]} /><meshPhysicalMaterial color={palette.body} metalness={0.8} roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.16} /></mesh>
      </group>
      <mesh position={[0, -0.98, 0]} rotation={[0.03, 0, 0]}><cylinderGeometry args={[0.8, 0.88, 0.1, 64]} /><meshStandardMaterial color={palette.base} metalness={0.86} roughness={0.27} /></mesh>
      <mesh position={[0, -0.93, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.72, 0.012, 8, 80]} /><meshBasicMaterial color={palette.accent} transparent opacity={0.68} /></mesh>
      <mesh position={[0, -0.54, -0.15]}><boxGeometry args={[1.9, 0.012, 0.012]} /><meshBasicMaterial color={palette.accent} transparent opacity={0.42} /></mesh>
    </group>
  );
}

function ShowroomModule({ project, index, projectCount, selected, onSelect }: { project: Project; index: number; projectCount: number; selected: boolean; onSelect?: (slug: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const targetY = selected ? 0.18 : 0;
  const targetRotation = selected ? -0.14 : 0.08;
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotation, 4, delta);
    if (Math.abs(group.current.position.y - targetY) > 0.001 || Math.abs(group.current.rotation.y - targetRotation) > 0.001) invalidate();
  });
  const position: [number, number, number] = [(index - (projectCount - 1) / 2) * 1.85, 0, Math.abs(index - (projectCount - 1) / 2) * 0.24];
  return (
    <group ref={group} position={position} onClick={(event) => { event.stopPropagation(); onSelect?.(project.slug); }}>
      <mesh position={[0, -0.04, 0]} castShadow>
        <boxGeometry args={[1.35, 0.12, 0.9]} />
        <meshStandardMaterial color="#202426" metalness={0.76} roughness={0.26} />
      </mesh>
      {project.kind === 'phone' ? (
        <group>
          <mesh position={[0, 0.73, 0]} castShadow>
            <boxGeometry args={[0.76, 1.32, 0.12]} />
            <meshStandardMaterial color={selected ? '#9a835f' : '#596166'} metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.73, 0.064]}>
            <boxGeometry args={[0.68, 1.21, 0.012]} />
            <meshBasicMaterial color="#0a0c0e" />
          </mesh>
          <mesh position={[0, 1.27, 0.073]}>
            <circleGeometry args={[0.027, 16]} />
            <meshBasicMaterial color={project.accent} />
          </mesh>
          <mesh position={[0, 0.18, 0.073]}>
            <boxGeometry args={[0.19, 0.012, 0.006]} />
            <meshBasicMaterial color={selected ? project.accent : '#6d7478'} />
          </mesh>
        </group>
      ) : (
        <group>
          <mesh position={[0, 0.82, 0]} castShadow>
            <boxGeometry args={[1.48, 0.96, 0.1]} />
            <meshStandardMaterial color={selected ? '#9a835f' : '#596166'} metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.82, 0.054]}>
            <boxGeometry args={[1.38, 0.84, 0.012]} />
            <meshBasicMaterial color="#0a0c0e" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.16, 0.3, 0.1]} />
            <meshStandardMaterial color="#545b5f" metalness={0.78} roughness={0.26} />
          </mesh>
        </group>
      )}
      <mesh position={[0, -0.037, 0.455]}>
        <boxGeometry args={[0.92, 0.012, 0.012]} />
        <meshBasicMaterial color={project.accent} transparent opacity={selected ? 0.92 : 0.34} />
      </mesh>
    </group>
  );
}

function Scene({ mode = 'hero', projects = [], selectedProject, onSelect, finish = 'graphite', progress = 0, inView = false }: ImmersiveSceneProps & { inView?: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => { if (inView) invalidate(); }, [inView, invalidate]);
  return (
    <>
      <color attach="background" args={['#151515']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={2.1} color="#fff4e4" />
      <directionalLight position={[-4, 2, 2]} intensity={1.15} color="#9aa9b6" />
      <pointLight position={[1, 2, 3]} intensity={1.4} distance={8} color="#d6b27a" />
      {mode === 'hero' && <Sculpture mode={mode} finish={finish} progress={progress} />}
      {mode === 'showroom' && (
        <>
          {projects.map((project, index) => <ShowroomModule key={project.slug} project={project} index={index} projectCount={projects.length} selected={selectedProject === project.slug} onSelect={onSelect} />)}
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

export default function ImmersiveScene({ mode = 'hero', projects = [], selectedProject, onSelect, finish = 'graphite', progress = 0 }: ImmersiveSceneProps) {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = 'connection' in navigator && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    setEnabled(!reduce && !saveData && !(memory && memory <= 2));
    setReady(true);
  }, []);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { rootMargin: '160px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const dpr = useMemo(() => {
    const pixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio;
    return (pixelRatio > 1.5 ? [1, 1.35] : [1, 1.5]) as [number, number];
  }, []);
  return (
    <div ref={host} className={`scene-runtime scene-runtime--${mode}`} data-render-mode={inView ? 'on-demand' : 'paused-offscreen'}>
      {!ready || !enabled
        ? <FallbackVisual mode={mode} />
        : <Canvas className={`immersive-canvas immersive-canvas--${mode}`} frameloop={inView ? 'demand' : 'never'} dpr={dpr} camera={{ position: [0, mode === 'hero' ? 0.15 : 0.4, mode === 'hero' ? 5.1 : 5.2], fov: mode === 'hero' ? 38 : 40 }} gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }} fallback={<FallbackVisual mode={mode} />}>
          <Scene mode={mode} projects={projects} selectedProject={selectedProject} onSelect={onSelect} finish={finish} progress={progress} inView={inView} />
        </Canvas>}
    </div>
  );
}
