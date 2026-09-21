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
  return (
    <div className="visual-phone" style={{ '--visual-accent': project.accent } as CSSProperties}>
      <div className="visual-phone__notch" />
      <div className="visual-phone__screen" role="img" aria-label={`${project.name} decorative product map; no approved app screenshot is available`}>
        <div className="phone-brand"><span>PRIVATE PROJECT / PRODUCT MAP</span><b>{project.name}</b></div>
        <div className="phone-orb" />
        <div className="phone-lines" aria-hidden="true"><i /><i /><i /></div>
        <div className="phone-list" aria-hidden="true"><span /><span /><span /></div>
        <small className="phone-disclaimer">DECORATIVE · NOT A SCREENSHOT</small>
      </div>
      <div className="visual-phone__reflection" />
    </div>
  );
}

function CodeSurface({ project }: { project: Project }) {
  return <div className="visual-code" style={{ '--visual-accent': project.accent } as CSSProperties}><div className="code-window__top"><i /><i /><i /><b>{project.name.toLowerCase().replaceAll(' ', '-')}.cpp</b></div><div className="code-window__body"><span>01</span><i>int <b>main</b>() {'{'}</i><span>02</span><i className="dim">  // practice log</i><span>03</span><i>  <b>return</b> 0;</i><span>04</span><i>{'}'}</i></div></div>;
}

export default function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  const provenance = project.image
    ? 'AUTHENTIC LIVE DEPLOYMENT CAPTURE'
    : project.kind === 'phone'
      ? 'DECORATIVE MAP · PRIVATE SOURCE'
      : 'DOCUMENTED SURFACE';
  return <div className={`project-visual project-visual--${project.kind} ${large ? 'project-visual--large' : ''}`}><div className="project-visual__ambient" />{project.kind === 'browser' || project.kind === 'catalogue' ? <BrowserSurface project={project} /> : project.kind === 'phone' ? <PhoneSurface project={project} /> : <CodeSurface project={project} />}<span className="project-visual__stamp">{provenance}</span></div>;
}
