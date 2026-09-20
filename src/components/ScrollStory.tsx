import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import ProjectVisual from './ProjectVisual';
import type { Project } from '../data/projects';

export default function ScrollStory({ project, beats }: { project: Project; beats?: string[] }) {
  const storyBeats = beats?.length ? beats : project.features.slice(0, 4);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-story-beat]'));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const index = visible?.target.getAttribute('data-story-beat');
      if (index) setActive(Number(index));
    }, { rootMargin: '-42% 0px -42% 0px', threshold: [0.1, 0.6] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [project.slug, storyBeats.length]);

  return (
    <div className="scroll-story" style={{ '--story-count': storyBeats.length } as CSSProperties}>
      <div className="scroll-story__media"><div className="scroll-story__sticky"><ProjectVisual project={project} large /><span>{String(active + 1).padStart(2, '0')} / {String(storyBeats.length).padStart(2, '0')}</span></div></div>
      <div className="scroll-story__beats">{storyBeats.map((beat, index) => <article key={beat} data-story-beat={index} className={index === active ? 'is-active' : ''}><p className="eyebrow"><span>{String(index + 1).padStart(2, '0')}</span> Verified building block</p><h3>{beat}</h3><p>{project.engineering}</p></article>)}</div>
    </div>
  );
}
