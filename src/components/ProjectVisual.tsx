import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Project } from '../data/projects';

function responsiveWebp(image: string) {
  const stem = image.replace(/\.jpg$/i, '');
  return [480, 768, 1440].map((width) => `${stem}-${width}.webp ${width}w`).join(', ');
}

function ProductFlow({
  project,
  activeStep = 0,
  interactive = false,
  onSelect,
}: {
  project: Project;
  activeStep?: number;
  interactive?: boolean;
  onSelect?: (index: number) => void;
}) {
  const beat = project.story[activeStep] ?? project.story[0];
  const total = project.story.length;

  if (!beat) return null;

  return (
    <div
      className={`flow-map ${interactive ? 'flow-map--interactive' : ''}`}
      style={{ '--visual-accent': project.accent } as CSSProperties}
      aria-label={`${project.name} documented product-flow diagram. This is not an app screenshot.`}
    >
      <div className="flow-map__header">
        <span>{project.category} / documented flow</span>
        <span>{String(activeStep + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
      <div key={beat.title} className="flow-map__focus" aria-live={interactive ? 'polite' : undefined}>
        <span>{beat.label} / {String(activeStep + 1).padStart(2, '0')}</span>
        <h3>{beat.title}</h3>
        <p>{beat.description}</p>
      </div>
      <div className="flow-map__rail" role={interactive ? 'group' : undefined} aria-label={interactive ? `${project.name} flow steps` : undefined}>
        {project.story.map((step, index) => {
          const label = `${String(index + 1).padStart(2, '0')} ${step.label}`;
          return interactive ? (
            <button
              key={`${project.slug}-${step.label}`}
              type="button"
              aria-pressed={activeStep === index}
              aria-label={`Show ${project.name} flow step ${label}`}
              className={activeStep === index ? 'is-active' : ''}
              onClick={() => onSelect?.(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span><b>{step.label}</b>
            </button>
          ) : (
            <div key={`${project.slug}-${step.label}`} className={activeStep === index ? 'is-active' : ''} aria-current={activeStep === index ? 'step' : undefined}>
              <span>{String(index + 1).padStart(2, '0')}</span><b>{step.label}</b>
            </div>
          );
        })}
      </div>
      <p className="flow-map__provenance">Documented product flow · not a screen capture</p>
      <div className="flow-map__geometry" aria-hidden="true"><i /><i /><i /></div>
    </div>
  );
}

function ScreenshotDialog({ project }: { project: Project }) {
  const dialog = useRef<HTMLDialogElement>(null);

  if (!project.image) return null;

  return (
    <>
      <button
        className="visual-browser__open"
        type="button"
        aria-label={`View full-size authentic ${project.name} website screenshot`}
        onClick={() => dialog.current?.showModal()}
      >
        View capture <span aria-hidden="true">↗</span>
      </button>
      <dialog
        ref={dialog}
        className="screenshot-dialog"
        aria-label={`${project.name} authentic live website capture`}
        onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}
      >
        <div className="screenshot-dialog__bar">
          <div><span>LIVE WEBSITE / VERIFIED CAPTURE</span><strong>{project.name}</strong></div>
          <button type="button" aria-label="Close full-size screenshot" onClick={() => dialog.current?.close()}>Close <span aria-hidden="true">×</span></button>
        </div>
        <picture><source type="image/webp" srcSet={responsiveWebp(project.image)} sizes="100vw" /><img src={project.image} width="1440" height="900" alt={project.imageAlt ?? `Authentic capture of ${project.name}.`} loading="lazy" decoding="async" /></picture>
      </dialog>
    </>
  );
}

function BrowserSurface({ project, interactive = false }: { project: Project; interactive?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hostname = project.live ? new URL(project.live).hostname : 'documented-project.local';
  return (
    <div className="visual-browser" style={{ '--visual-accent': project.accent } as CSSProperties}>
      <div className="visual-browser__bar"><i /><i /><i /><span>{hostname}</span></div>
      <div className="visual-browser__content">
        {project.image && !imageFailed
          ? <picture><source type="image/webp" srcSet={responsiveWebp(project.image)} sizes="(max-width: 620px) 94vw, (max-width: 900px) 74vw, 55vw" /><img src={project.image} width="1440" height="900" alt={project.imageAlt ?? ''} loading="lazy" decoding="async" onError={() => setImageFailed(true)} /></picture>
          : <div className="visual-browser__missing" role="img" aria-label={`${project.name} capture unavailable. Open the case study for its documented product flow.`}><span>CAPTURE UNAVAILABLE</span><b>{project.name}</b><small>Documented flow remains available in the case study.</small></div>}
      </div>
      {interactive && project.image && !imageFailed && <ScreenshotDialog project={project} />}
    </div>
  );
}

export default function ProjectVisual({
  project,
  large = false,
  storyIndex,
  interactive = false,
  onStorySelect,
}: {
  project: Project;
  large?: boolean;
  storyIndex?: number;
  interactive?: boolean;
  onStorySelect?: (index: number) => void;
}) {
  const isFlow = storyIndex !== undefined || !project.image;
  const provenance = storyIndex !== undefined
    ? 'VERIFIED BUILD FLOW / NOT A SCREENSHOT'
      : project.image
        ? 'AUTHENTIC LIVE DEPLOYMENT CAPTURE'
          : 'DOCUMENTED PRODUCT FLOW / NOT A SCREENSHOT';

  return (
    <div className={`project-visual project-visual--${project.kind} ${large ? 'project-visual--large' : ''} ${isFlow ? 'project-visual--flow' : ''}`}>
      {!isFlow && <div className="project-visual__ambient" aria-hidden="true" />}
      {isFlow
        ? <ProductFlow project={project} activeStep={storyIndex ?? 0} interactive={interactive} onSelect={onStorySelect} />
        : project.kind === 'browser' || project.kind === 'catalogue'
          ? <BrowserSurface project={project} interactive={interactive} />
          : <BrowserSurface project={project} interactive={interactive} />}
      {!isFlow && <span className="project-visual__stamp">{provenance}</span>}
    </div>
  );
}
