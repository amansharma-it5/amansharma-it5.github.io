import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import ProjectVisual from './ProjectVisual';
import type { Project } from '../data/projects';
import type { ImmersiveSceneProps } from './ImmersiveScene';

const categories = [
  { id: 'apps', label: 'Apps', filter: 'android' },
  { id: 'web', label: 'Web', filter: 'websites' },
  { id: 'ai', label: 'AI / Automation', filter: 'ai' },
  { id: 'experiments', label: 'Experiments', filter: 'experiments' },
] as const;

export default function ProductUniverse({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('apps');
  const [activeStep, setActiveStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const showroomRef = useRef<HTMLElement>(null);
  const [ShowroomScene, setShowroomScene] = useState<ComponentType<ImmersiveSceneProps> | null>(null);
  const activeCategory = categories.find((item) => item.id === category) ?? categories[0];
  const matches = projects.filter((project) => project.filters.includes(activeCategory.filter));
  const [activeSlug, setActiveSlug] = useState(matches[0]?.slug ?? projects[0]?.slug);
  const active = matches.find((project) => project.slug === activeSlug) ?? matches[0] ?? projects[0];

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (window.matchMedia('(max-width: 900px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches || connection?.saveData || (memory && memory <= 2)) return;
    const section = showroomRef.current;
    if (!section || !('IntersectionObserver' in window)) return;
    let requested = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || requested) return;
      requested = true;
      observer.disconnect();
      import('./SceneIsland').then(({ default: SceneIsland }) => setShowroomScene(() => SceneIsland)).catch(() => undefined);
    }, { rootMargin: '180px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const changeCategory = (next: typeof category) => {
    setCategory(next);
    setActiveStep(0);
    const nextFilter = categories.find((item) => item.id === next)?.filter;
    setActiveSlug(projects.find((project) => nextFilter && project.filters.includes(nextFilter))?.slug ?? projects[0]?.slug);
  };

  if (!active) return null;
  return (
    <div className="universe-viewer">
      <div className="universe-tabs" role="tablist" aria-label="Product categories" data-hydrated={hydrated}>
        {categories.map((item, index) => <button key={item.id} id={`universe-tab-${item.id}`} type="button" role="tab" aria-controls="universe-panel" aria-selected={category === item.id} tabIndex={category === item.id ? 0 : -1} className={category === item.id ? 'is-active' : ''} onClick={() => changeCategory(item.id)} onKeyDown={(event) => {
          const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
          const targetIndex = event.key === 'Home' ? 0 : event.key === 'End' ? categories.length - 1 : (index + direction + categories.length) % categories.length;
          if (!direction && event.key !== 'Home' && event.key !== 'End') return;
          event.preventDefault();
          const next = categories[targetIndex];
          changeCategory(next.id);
          window.requestAnimationFrame(() => document.getElementById(`universe-tab-${next.id}`)?.focus());
        }}>{item.label}</button>)}
      </div>
      <div className="universe-stage" id="universe-panel" role="tabpanel" aria-labelledby={`universe-tab-${category}`}>
        <div className="universe-stage__visual"><ProjectVisual project={active} large interactive storyIndex={!active.image ? activeStep : undefined} onStorySelect={setActiveStep} /></div>
        <div className="universe-stage__copy"><p className="eyebrow"><span>UNIVERSE / {String(matches.length).padStart(2, '0')}</span> {activeCategory.label}</p><p className="universe-stage__status">{active.status}</p><h3>{active.name}<br /><em>{active.category}</em></h3><p>{active.summary}</p><div className="tag-row">{active.stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div><a className="arrow-link" href={`/projects/${active.slug}/`}>Study this build <span>↗</span></a></div>
      </div>
      <section ref={showroomRef} className="universe-showroom" aria-label={`${activeCategory.label} interactive 3D project showroom`}>
        <div className="universe-showroom__header">
          <div><p className="eyebrow"><span>OBJECT STUDY / 03D</span> Interactive showroom</p><p>Solid models only — no simulated app screens. Choose a project below or select its 3D object.</p></div>
          <span className="universe-showroom__active" aria-live="polite">{active.name} / SELECTED</span>
        </div>
        <div className="universe-showroom__stage" aria-hidden="true">
          {ShowroomScene
            ? <ShowroomScene mode="showroom" finish="graphite" projects={matches.slice(0, 4)} selectedProject={active.slug} onSelect={(slug) => { setActiveSlug(slug); setActiveStep(0); }} />
            : <div className="universe-showroom__fallback"><span>AMAN / OBJECT STUDY</span><b>AS</b><i /></div>}
        </div>
      </section>
      <div className="universe-projects" role="group" aria-label={`${activeCategory.label} projects`}>{matches.map((project) => <button key={project.slug} type="button" aria-pressed={project.slug === active.slug} className={project.slug === active.slug ? 'is-active' : ''} onClick={() => { setActiveSlug(project.slug); setActiveStep(0); }}><span>{project.name}</span><small>{project.status}</small></button>)}</div>
    </div>
  );
}
