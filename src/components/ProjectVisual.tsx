import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';

function BrowserSurface({ project }: { project: Project }) {
  return (
    <div className="visual-browser" style={{ '--visual-accent': project.accent } as CSSProperties}>
      <div className="visual-browser__bar"><i /><i /><i /><span>{project.live ? new URL(project.live).hostname : 'private-build.local'}</span></div>
      <div className="visual-browser__content">
        {project.image ? <img src={project.image} alt={project.imageAlt} loading="lazy" /> : <div className="visual-browser__screen"><b>{project.name}</b><span>DOCUMENTED BUILD SURFACE</span><i /></div>}
      </div>
    </div>
  );
}

function PhoneSurface({ project }: { project: Project }) {
  const isCivic = project.slug === 'civicproof';
  return (
    <div className="visual-phone" style={{ '--visual-accent': project.accent } as CSSProperties}>
      <div className="visual-phone__notch" />
      <div className="visual-phone__screen">
        <div className="phone-status"><span>9:41</span><span>▰ ◔</span></div>
        <div className="phone-brand"><span>{isCivic ? 'CIVIC' : project.slug === 'watchroom' ? 'WATCHROOM' : 'DIVYADHUN'}</span><b>{isCivic ? 'Case 014' : project.slug === 'watchroom' ? 'Room 07' : 'Daily Bhakti'}</b></div>
        <div className="phone-orb" />
        <div className="phone-lines"><i /><i /><i /></div>
        <div className="phone-list"><span /><span /><span /></div>
      </div>
      <div className="visual-phone__reflection" />
    </div>
  );
}

function CodeSurface({ project }: { project: Project }) {
  return <div className="visual-code" style={{ '--visual-accent': project.accent } as CSSProperties}><div className="code-window__top"><i /><i /><i /><b>{project.name.toLowerCase().replaceAll(' ', '-')}.cpp</b></div><div className="code-window__body"><span>01</span><i>int <b>main</b>() {'{'}</i><span>02</span><i className="dim">  // practice log</i><span>03</span><i>  <b>return</b> 0;</i><span>04</span><i>{'}'}</i></div></div>;
}

export default function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  return <div className={`project-visual project-visual--${project.kind} ${large ? 'project-visual--large' : ''}`}><div className="project-visual__ambient" />{project.kind === 'browser' || project.kind === 'catalogue' ? <BrowserSurface project={project} /> : project.kind === 'phone' ? <PhoneSurface project={project} /> : <CodeSurface project={project} />}<span className="project-visual__stamp">{project.kind === 'phone' ? '3D DEVICE STUDY' : project.image ? 'VERIFIED ASSET' : 'DOCUMENTED SURFACE'}</span></div>;
}
