import { useMemo, useState } from 'react';
import { filters, type Project, projects } from '../data/projects';
import ProjectVisual from './ProjectVisual';

function Status({ project }: { project: Project }) {
  return <span className={`status status--${project.statusTone}`}><i />{project.status}</span>;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card reveal-on-scroll" data-project-card>
      <a className="project-card__visual-link" href={`/projects/${project.slug}/`} aria-label={`Open ${project.name} case study`}><ProjectVisual project={project} /></a>
      <div className="project-card__body">
        <div className="project-card__meta"><span>{project.eyebrow}</span><Status project={project} /></div>
        <h3><a href={`/projects/${project.slug}/`}>{project.name}</a></h3>
        <p>{project.summary}</p>
        <div className="tag-row">{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-card__actions"><a className="arrow-link" href={`/projects/${project.slug}/`}>Case study <span>↗</span></a><div className="project-card__external">{project.live && <a href={project.live} target="_blank" rel="noreferrer" aria-label={`${project.name} live demo`}>Live ↗</a>}{project.repo && <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`${project.name} GitHub repository`}>GitHub ↗</a>}</div></div>
      </div>
    </article>
  );
}

export default function ProjectExplorer({ compact = false, initialFilter = 'all' }: { compact?: boolean; initialFilter?: string }) {
  const [active, setActive] = useState(initialFilter);
  const [query, setQuery] = useState('');
  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesFilter = active === 'all' || project.filters.includes(active);
    const haystack = `${project.name} ${project.eyebrow} ${project.summary} ${project.stack.join(' ')}`.toLowerCase();
    return matchesFilter && (!query.trim() || haystack.includes(query.toLowerCase().trim()));
  }), [active, query]);
  const displayed = compact ? visibleProjects.slice(0, 3) : visibleProjects;
  return (
    <div className="explorer" data-project-explorer>
      {!compact && <div className="explorer-toolbar"><div className="filter-list" role="group" aria-label="Filter projects">{filters.map((filter) => <button key={filter.id} type="button" className={`filter-button ${active === filter.id ? 'is-active' : ''}`} aria-pressed={active === filter.id} onClick={() => setActive(filter.id)}>{filter.label}</button>)}</div><label className="search-field"><span className="sr-only">Search projects</span><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" type="search" /></label></div>}
      {!compact && <p className="result-count" aria-live="polite">{visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'} in the archive</p>}
      <div className={`project-grid ${compact ? 'project-grid--compact' : ''}`}>{displayed.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      {visibleProjects.length === 0 && <div className="empty-state"><strong>No signal found.</strong><p>Try a different term or reset the filters.</p><button type="button" className="arrow-link" onClick={() => { setActive('all'); setQuery(''); }}>Reset archive ↗</button></div>}
    </div>
  );
}
