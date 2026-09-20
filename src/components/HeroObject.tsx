import { useState } from 'react';
import SceneIsland from './SceneIsland';
import type { SceneFinish } from './ImmersiveScene';

const options: Array<{ id: SceneFinish; label: string; code: string; swatch: string }> = [
  { id: 'graphite', label: 'Graphite', code: '01', swatch: '#737b7e' },
  { id: 'bone', label: 'Bone', code: '02', swatch: '#d8d0c2' },
  { id: 'champagne', label: 'Champagne', code: '03', swatch: '#c7a875' },
];

export default function HeroObject() {
  const [finish, setFinish] = useState<SceneFinish>('graphite');

  return (
    <div className="hero-object">
      <div className="hero-object__viewport">
        <SceneIsland mode="hero" finish={finish} />
      </div>
      <div className="hero-object__controls" aria-label="Sculpture finish selector">
        <span className="hero-object__label">Finish / select</span>
        <div className="finish-selector">
          {options.map((option) => (
            <button
              key={option.id}
              className={`finish-button ${finish === option.id ? 'is-selected' : ''}`}
              type="button"
              aria-pressed={finish === option.id}
              onClick={() => setFinish(option.id)}
            >
              <i className="finish-swatch" style={{ backgroundColor: option.swatch }} />
              <span>{option.label}</span>
              <small>{option.code}</small>
            </button>
          ))}
        </div>
      </div>
      <p className="hero-object__hint">Drag / touch to inspect</p>
    </div>
  );
}
