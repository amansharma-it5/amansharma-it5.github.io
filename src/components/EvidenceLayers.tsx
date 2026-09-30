import type { Project } from '../data/projects';

export default function EvidenceLayers({ project }: { project: Project }) {
  const layers = [
    { label: 'Surface', value: project.category, detail: project.summary },
    { label: 'Constraint', value: 'The problem', detail: project.problem },
    { label: 'Implementation', value: project.stack.slice(0, 3).join(' · '), detail: project.engineering },
    { label: 'State', value: project.status, detail: project.journey },
  ];

  return (
    <section className="evidence-layers" aria-labelledby="evidence-layers-title">
      <div className="evidence-layers__intro">
        <p className="eyebrow"><span>BOUNDARY / 01</span> Evidence layers</p>
        <h3 id="evidence-layers-title">The system<br /><em>without the fiction.</em></h3>
        <p>Each layer is assembled from the reviewed project record. The visual relationship is an index into the evidence, not a claim about undocumented internals.</p>
      </div>
      <ol className="evidence-layers__list">
        {layers.map((layer, index) => <li key={layer.label}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div><p>{layer.label}</p><strong>{layer.value}</strong><small>{layer.detail}</small></div>
        </li>)}
      </ol>
    </section>
  );
}
