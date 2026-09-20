import { useEffect, useState } from 'react';
import ProjectVisual from './ProjectVisual';
import type { Project } from '../data/projects';

export default function Highlights({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const current = projects[active];
  const move = (direction: number) => setActive((index) => (index + direction + projects.length) % projects.length);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [projects.length]);

  if (!current) return null;
  return (
    <div className="highlights-viewer" role="region" aria-roledescription="carousel" aria-label="Selected project highlights">
      <div className="highlights-stage">
        <div className="highlights-stage__visual"><ProjectVisual project={current} large /><span className="highlights-stage__index">{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></div>
        <div className="highlights-stage__copy">
          <p className="eyebrow"><span>{String(active + 1).padStart(2, '0')}</span> {current.eyebrow}</p>
          <h3>{current.name}<br /><em>{current.category}</em></h3>
          <p>{current.summary}</p>
          <div className="highlights-stage__actions"><a className="button button--primary" href={`/projects/${current.slug}/`}>Open case study <span>↗</span></a>{current.live && <a className="text-link" href={current.live} target="_blank" rel="noreferrer">Live surface <span>↗</span></a>}</div>
        </div>
      </div>
      <div className="highlights-controls">
        <div className="highlights-dots" aria-label="Select highlight">
          {projects.map((project, index) => <button key={project.slug} type="button" className={index === active ? 'is-active' : ''} aria-label={`Show ${project.name}`} aria-pressed={index === active} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span><i /></button>)}
        </div>
        <div className="highlights-arrows"><button type="button" aria-label="Previous highlight" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next highlight" onClick={() => move(1)}>→</button></div>
      </div>
    </div>
  );
}
