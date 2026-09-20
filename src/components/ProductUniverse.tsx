import { useState } from 'react';
import ProjectVisual from './ProjectVisual';
import type { Project } from '../data/projects';

const categories = [
  { id: 'apps', label: 'Apps', filter: 'android' },
  { id: 'web', label: 'Web', filter: 'websites' },
  { id: 'ai', label: 'AI / Automation', filter: 'ai' },
  { id: 'experiments', label: 'Experiments', filter: 'experiments' },
] as const;

export default function ProductUniverse({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('apps');
  const activeCategory = categories.find((item) => item.id === category) ?? categories[0];
  const matches = projects.filter((project) => project.filters.includes(activeCategory.filter));
  const [activeSlug, setActiveSlug] = useState(matches[0]?.slug ?? projects[0]?.slug);
  const active = matches.find((project) => project.slug === activeSlug) ?? matches[0] ?? projects[0];

  const changeCategory = (next: typeof category) => {
    setCategory(next);
    const nextFilter = categories.find((item) => item.id === next)?.filter;
    setActiveSlug(projects.find((project) => nextFilter && project.filters.includes(nextFilter))?.slug ?? projects[0]?.slug);
  };

  if (!active) return null;
  return (
    <div className="universe-viewer">
      <div className="universe-tabs" role="tablist" aria-label="Product categories">
        {categories.map((item) => <button key={item.id} type="button" role="tab" aria-selected={category === item.id} className={category === item.id ? 'is-active' : ''} onClick={() => changeCategory(item.id)}>{item.label}</button>)}
      </div>
      <div className="universe-stage">
        <div className="universe-stage__visual"><ProjectVisual project={active} large /><span className="universe-stage__stamp">{active.status} / {active.category}</span></div>
        <div className="universe-stage__copy"><p className="eyebrow"><span>UNIVERSE / {String(matches.length).padStart(2, '0')}</span> {activeCategory.label}</p><h3>{active.name}<br /><em>{active.category}</em></h3><p>{active.summary}</p><div className="tag-row">{active.stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div><a className="arrow-link" href={`/projects/${active.slug}/`}>Study this build <span>↗</span></a></div>
      </div>
      <div className="universe-projects" aria-label={`${activeCategory.label} projects`}>{matches.map((project) => <button key={project.slug} type="button" className={project.slug === active.slug ? 'is-active' : ''} onClick={() => setActiveSlug(project.slug)}><span>{project.name}</span><small>{project.status}</small></button>)}</div>
    </div>
  );
}
