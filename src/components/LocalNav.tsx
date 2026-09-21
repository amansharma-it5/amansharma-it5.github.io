import { useEffect, useRef, useState } from 'react';

const sectionLinks = [
  ['overview', 'Overview'],
  ['highlights', 'Highlights'],
  ['projects', 'Projects'],
  ['apps', 'Apps'],
  ['web', 'Web'],
  ['ai', 'AI / Automation'],
  ['about', 'About'],
  ['comparison', 'Archive'],
  ['contact', 'Contact'],
] as const;

export default function LocalNav() {
  const [active, setActive] = useState('overview');
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHydrated(true);
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = Math.max(120, window.innerHeight * 0.34);
      let current: (typeof sectionLinks)[number][0] = sectionLinks[0][0];
      for (const [id] of sectionLinks) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className={`local-nav ${open ? 'is-open' : ''}`} aria-label="Portfolio sections" data-hydrated={hydrated} onKeyDown={(event) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus(); }
    }}>
      <div className="shell local-nav__inner">
        <a className="local-nav__identity" href="#overview">Aman Sharma <span>Portfolio / 2026</span></a>
        <button ref={toggleRef} className="local-nav__toggle" type="button" aria-controls="local-nav-links" aria-expanded={open} onClick={() => setOpen(!open)}><span>Sections</span><i /></button>
        <div className="local-nav__links" id="local-nav-links">
          {sectionLinks.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => { setActive(id); setOpen(false); }}>{label}</a>)}
          <a className="local-nav__archive" href="/projects/" onClick={() => setOpen(false)}>Full archive</a>
        </div>
      </div>
    </nav>
  );
}
