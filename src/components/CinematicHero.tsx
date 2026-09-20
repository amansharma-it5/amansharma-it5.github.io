import { useEffect, useRef, useState } from 'react';
import type { ComponentType, CSSProperties } from 'react';
import type { Project } from '../data/projects';

function clamp(value: number) { return Math.max(0, Math.min(1, value)); }

function ProjectSurface({ project, className, progress, start, end }: { project: Project; className: string; progress: number; start: number; end: number }) {
  const local = clamp((progress - start) / (end - start));
  const style = { opacity: 0.08 + local * 0.92, transform: `translate3d(${(1 - local) * 6}vw, ${(1 - local) * 8}vh, 0) scale(${0.84 + local * 0.16}) rotate(${(1 - local) * -7}deg)` } as CSSProperties;
  return (
    <article className={`hero-surface ${className}`} style={style} aria-hidden="true">
      <div className="hero-surface__chrome"><span /><span /><span /><b>{project.name.toLowerCase().replaceAll(' ', '-')}</b></div>
      {project.image ? <img src={project.image} alt="" width="960" height="620" decoding="async" /> : <div className="hero-surface__mock"><span>{project.eyebrow.split(' / ')[0]}</span><strong>{project.name}</strong><i /><small>{project.status}</small></div>}
      <div className="hero-surface__caption"><span>{project.category}</span><b>{project.status}</b></div>
    </article>
  );
}

export default function CinematicHero({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [HeroScene, setHeroScene] = useState<ComponentType<{ mode: 'hero' }> | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    let active = true;
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    let sceneTimer: number | undefined;
    if (!reduced.current && !connection?.saveData && !(memory && memory <= 2)) {
      sceneTimer = window.setTimeout(() => {
        import('./SceneIsland').then(({ default: SceneIsland }) => { if (active) setHeroScene(() => SceneIsland); }).catch(() => undefined);
      }, 180);
    }
    if (reduced.current) { setProgress(1); return () => { active = false; if (sceneTimer) window.clearTimeout(sceneTimer); }; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(clamp(-section.getBoundingClientRect().top / range));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { active = false; if (sceneTimer) window.clearTimeout(sceneTimer); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  const [first, second, third] = [projects[0], projects[1], projects[3]].filter(Boolean);
  return (
    <section ref={sectionRef} id="overview" className="cinematic-hero" aria-labelledby="hero-title" style={{ '--hero-progress': progress } as CSSProperties}>
      <div className="cinematic-hero__sticky">
        <div className="cinematic-hero__stage" aria-hidden="true">
          <div className="cinematic-hero__light" style={{ opacity: Math.min(0.7, progress * 1.5) }} />
          <div className="cinematic-hero__three">{HeroScene && <HeroScene mode="hero" />}</div>
          {first && <ProjectSurface project={first} className="hero-surface--one" progress={progress} start={0.04} end={0.34} />}
          {second && <ProjectSurface project={second} className="hero-surface--two" progress={progress} start={0.22} end={0.56} />}
          {third && <ProjectSurface project={third} className="hero-surface--three" progress={progress} start={0.46} end={0.78} />}
          <div className="hero-composition" style={{ opacity: clamp((progress - 0.68) / 0.25), transform: `translateY(${(1 - clamp((progress - 0.68) / 0.25)) * 30}px) scale(${0.9 + clamp((progress - 0.68) / 0.25) * 0.1})` }}>
            <span>AM / 2026</span><b>PRODUCT<br />UNIVERSE</b><i /><small>{projects.length.toString().padStart(2, '0')} verified builds</small>
          </div>
        </div>
        <div className="shell cinematic-hero__copy">
          <p className="eyebrow"><span>01</span> Aman Sharma / independent product builder</p>
          <h1 id="hero-title">I turn ideas<br /><em>into products.</em></h1>
          <p className="cinematic-hero__lede">Useful digital products, shaped with restraint — from mobile foundations to public web tools.</p>
          <div className="cinematic-hero__progress"><span>Scroll to explore</span><i><b style={{ transform: `scaleX(${Math.max(progress, 0.08)})` }} /></i><strong>{String(Math.round(progress * 100)).padStart(2, '0')}</strong></div>
        </div>
        <div className="cinematic-hero__footer shell"><span>Independent / India</span><span>Scroll story / 01—04</span><a href="#highlights">Enter the work ↓</a></div>
      </div>
    </section>
  );
}
