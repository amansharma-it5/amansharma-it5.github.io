import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import ProjectVisual from './ProjectVisual';
import type { Project, ProjectStoryBeat } from '../data/projects';

export default function ScrollStory({ project, beats }: { project: Project; beats?: ProjectStoryBeat[] }) {
  const storyBeats = beats?.length ? beats : project.story;
  const [active, setActive] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const currentBeat = storyBeats[active] ?? storyBeats[0];

  const selectBeat = (index: number) => {
    setActive(index);
    const target = root.current?.querySelector<HTMLElement>(`[data-story-beat="${index}"]`);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'center' });
  };

  useEffect(() => {
    setHydrated(true);
    const elements = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-story-beat]') ?? []);
    if (!elements.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const index = Number(visible?.target.getAttribute('data-story-beat'));
      if (Number.isInteger(index) && index >= 0) setActive(index);
    }, { rootMargin: '-42% 0px -42% 0px', threshold: [0.1, 0.6] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [project.slug, storyBeats.length]);

  if (!currentBeat) return null;

  return (
    <div ref={root} className="scroll-story" data-hydrated={hydrated} style={{ '--story-count': storyBeats.length, '--story-accent': project.accent } as CSSProperties}>
      <div className="scroll-story__media">
        <div className="scroll-story__sticky">
          <ProjectVisual project={project} large storyIndex={active} interactive onStorySelect={selectBeat} />
        </div>
      </div>
      <div className="scroll-story__beats">
        {storyBeats.map((beat, index) => (
          <article key={`${project.slug}-${beat.label}`} data-story-beat={index} className={index === active ? 'is-active' : ''}>
            <p className="eyebrow"><span>{String(index + 1).padStart(2, '0')}</span> {beat.label}</p>
            <h3>{beat.title}</h3>
            <p>{beat.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
