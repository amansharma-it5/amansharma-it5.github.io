import { useEffect, useRef, useState } from 'react';
import type { ComponentType, CSSProperties } from 'react';
import type { Project } from '../data/projects';

function clamp(value: number) { return Math.max(0, Math.min(1, value)); }

function responsiveWebp(image: string) {
  const stem = image.replace(/\.jpg$/i, '');
  return [480, 768, 1440].map((width) => `${stem}-${width}.webp ${width}w`).join(', ');
}

function ProjectSurface({ project, className, progress, start, peak, fadeStart, end, initial = 0 }: { project: Project; className: string; progress: number; start: number; peak: number; fadeStart: number; end: number; initial?: number }) {
  if (!project.image) return null;
  const enter = start === 0 && progress <= peak ? 1 : clamp((progress - start) / (peak - start));
  const leave = 1 - clamp((progress - fadeStart) / (end - fadeStart));
  const visible = Math.max(initial, enter) * leave;
  const imageReady = start === 0 || progress >= start - 0.1;
  const style = { opacity: visible, transform: `translate3d(${(1 - enter) * 8}vw, ${(1 - enter) * 3}vh, 0) scale(${0.92 + enter * 0.08})` } as CSSProperties;
  return (
    <article className={`hero-surface ${className}`} style={style} aria-hidden="true">
      <div className="hero-surface__chrome"><span /><span /><span /><b>{project.live ? new URL(project.live).hostname : project.name}</b></div>
      {imageReady && <picture><source type="image/webp" srcSet={responsiveWebp(project.image)} sizes="(max-width: 620px) calc(100vw - 28px), (max-width: 900px) 78vw, 680px" /><img src={project.image} alt="" width="1440" height="900" decoding="async" loading={start === 0 ? 'eager' : 'lazy'} fetchPriority={start === 0 ? 'high' : 'auto'} /></picture>}
      <div className="hero-surface__caption"><span>{project.category}</span><b>{project.status}</b></div>
    </article>
  );
}

export default function CinematicHero({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [HeroScene, setHeroScene] = useState<ComponentType<{ mode: 'hero'; progress?: number }> | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    let active = true;
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    let sceneTimer: number | undefined;
    let sceneIntentCleanup: (() => void) | undefined;
    const compact = window.matchMedia('(max-width: 620px)').matches;
    if (!reduced.current && !compact && !connection?.saveData && !(memory && memory <= 2)) {
      let sceneStarted = false;
      const startScene = () => {
        if (sceneStarted) return;
        sceneStarted = true;
        sceneIntentCleanup?.();
        sceneTimer = window.setTimeout(() => {
          import('./SceneIsland').then(({ default: SceneIsland }) => { if (active) setHeroScene(() => SceneIsland); }).catch(() => undefined);
        }, 120);
      };
      const requestStoryScene = () => {
        const section = sectionRef.current;
        if (!section) return;
        const range = Math.max(1, section.offsetHeight - window.innerHeight);
        const storyProgress = clamp(-section.getBoundingClientRect().top / range);
        if (storyProgress >= 0.14) startScene();
      };
      window.addEventListener('scroll', requestStoryScene, { passive: true });
      window.addEventListener('resize', requestStoryScene, { passive: true });
      sectionRef.current?.addEventListener('pointerdown', startScene, { passive: true });
      const stopWaiting = () => {
        window.removeEventListener('scroll', requestStoryScene);
        window.removeEventListener('resize', requestStoryScene);
        sectionRef.current?.removeEventListener('pointerdown', startScene);
        if (sceneTimer) window.clearTimeout(sceneTimer);
      };
      sceneIntentCleanup = stopWaiting;
    }
    if (reduced.current || compact) {
      if (reduced.current) setProgress(1);
      return () => { active = false; sceneIntentCleanup?.(); if (sceneTimer) window.clearTimeout(sceneTimer); };
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia('(max-width: 620px)').matches) { setProgress(0); return; }
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(clamp(-section.getBoundingClientRect().top / range));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { active = false; sceneIntentCleanup?.(); if (sceneTimer) window.clearTimeout(sceneTimer); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  const [first, second, third] = projects.filter((project) => Boolean(project.image)).slice(0, 3);
  return (
    <section ref={sectionRef} id="overview" className="cinematic-hero" aria-labelledby="hero-title" style={{ '--hero-progress': progress } as CSSProperties}>
      <div className="cinematic-hero__sticky">
        <div className="cinematic-hero__stage" aria-hidden="true">
          <div className="cinematic-hero__light" style={{ opacity: Math.min(0.7, progress * 1.5) }} />
          <div className={`cinematic-hero__mark${HeroScene ? ' is-webgl' : ''}`}><span>AS</span><i /></div>
          <div className="cinematic-hero__three">{HeroScene && <HeroScene mode="hero" progress={progress} />}</div>
          {first && <ProjectSurface project={first} className="hero-surface--one" progress={progress} start={0} peak={0.05} fadeStart={0.24} end={0.40} initial={0.92} />}
          {second && <ProjectSurface project={second} className="hero-surface--two" progress={progress} start={0.25} peak={0.38} fadeStart={0.50} end={0.64} />}
          {third && <ProjectSurface project={third} className="hero-surface--three" progress={progress} start={0.52} peak={0.66} fadeStart={0.78} end={0.90} />}
          <div className="hero-composition" style={{ opacity: clamp((progress - 0.68) / 0.25), transform: `translateY(${(1 - clamp((progress - 0.68) / 0.25)) * 30}px) scale(${0.9 + clamp((progress - 0.68) / 0.25) * 0.1})` }}>
            <span>AM / 2026</span><b>PRODUCT<br />UNIVERSE</b><i /><small>{projects.length.toString().padStart(2, '0')} verified builds</small>
          </div>
        </div>
        <div className="shell cinematic-hero__copy" style={{ opacity: 1 - clamp((progress - 0.14) / 0.18) * 0.96, transform: `translateY(${-clamp((progress - 0.14) / 0.18) * 22}px)` }}>
          <p className="eyebrow"><span>01</span> Aman Sharma / product builder & technical talent partner</p>
          <h1 id="hero-title">I turn ideas<br /><em>into products.</em></h1>
          <p className="cinematic-hero__lede">Useful digital products, shaped with restraint — from mobile foundations to public web tools.</p>
          <div className="cinematic-hero__progress"><span>Scroll to explore</span><i><b style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} /></i><strong>{String(Math.round(progress * 100)).padStart(2, '0')}</strong></div>
        </div>
        <div className="cinematic-hero__footer shell"><span>Independent / India</span><span>Scroll story / 01—04</span><a href="#highlights">Enter the work ↓</a></div>
      </div>
    </section>
  );
}
