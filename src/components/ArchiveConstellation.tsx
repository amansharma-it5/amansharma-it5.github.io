import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';

type ArchiveConstellationProps = {
  projects: Project[];
  activeSlug?: string;
  onSelect: (slug: string) => void;
};

const positions: ReadonlyArray<readonly [number, number]> = [
  [14, 48], [34, 17], [54, 53], [75, 25], [87, 66], [27, 79], [62, 84], [44, 34]
];

function sharesEvidence(a: Project, b: Project) {
  return a.filters.some((filter) => b.filters.includes(filter)) || a.stack.some((technology) => b.stack.includes(technology));
}

export default function ArchiveConstellation({ projects, activeSlug, onSelect }: ArchiveConstellationProps) {
  const visibleProjects = projects.slice(0, 8);
  const links = visibleProjects.flatMap((project, index) => visibleProjects.slice(index + 1).map((other, otherIndex) => {
    if (!sharesEvidence(project, other)) return null;
    const from = positions[index] ?? positions[0];
    const to = positions[index + otherIndex + 1] ?? positions[(index + otherIndex + 1) % positions.length];
    return { key: `${project.slug}-${other.slug}`, from, to };
  }).filter((link): link is { key: string; from: readonly [number, number]; to: readonly [number, number] } => Boolean(link)));

  return (
    <section className="archive-constellation" data-constellation aria-labelledby="constellation-title">
      <div className="archive-constellation__header">
        <div>
          <p className="eyebrow"><span>FIELD / 01</span> Evidence topology</p>
          <h3 id="constellation-title">A body of work,<br /><em>seen as a system.</em></h3>
        </div>
        <p>Lines appear only when two documented projects share a category or technology. Select a node to move the archive into focus.</p>
      </div>
      <div className="archive-constellation__field">
        <svg className="archive-constellation__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(({ key, from, to }) => <line key={key} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />)}
        </svg>
        <ul className="archive-constellation__nodes" aria-label="Projects in the evidence topology">
          {visibleProjects.map((project, index) => {
            const [x, y] = positions[index] ?? positions[0];
            return (
              <li key={project.slug} style={{ '--node-x': `${x}%`, '--node-y': `${y}%`, '--node-accent': project.accent } as CSSProperties}>
                <button type="button" className={activeSlug === project.slug ? 'is-active' : ''} aria-label={`Focus archive node ${index + 1}: ${project.name.replace(/Android/gi, 'mobile build').replace(/app/gi, 'product')}`} aria-pressed={activeSlug === project.slug} onClick={() => onSelect(project.slug)}>
                  <span className="archive-constellation__orb" aria-hidden="true" />
                  <span className="archive-constellation__name">{project.name}</span>
                  <small>{project.category}</small>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="archive-constellation__axis archive-constellation__axis--x" aria-hidden="true"><span>shared constraints</span><i /></div>
        <div className="archive-constellation__axis archive-constellation__axis--y" aria-hidden="true"><span>documented surface</span><i /></div>
      </div>
      <p className="archive-constellation__note">Keyboard equivalent: the project selectors below expose the same archive as a linear, focusable list.</p>
    </section>
  );
}
