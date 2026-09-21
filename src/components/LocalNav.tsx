import { useEffect, useState } from 'react';

const sectionLinks = [
  ['overview', 'Overview'],
  ['highlights', 'Highlights'],
  ['projects', 'Projects'],
  ['apps', 'Apps'],
  ['web', 'Web'],
  ['ai', 'AI / Automation'],
  ['about', 'About'],
  ['contact', 'Contact'],
] as const;

export default function LocalNav() {
  const [active, setActive] = useState('overview');
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const observed = sectionLinks.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target instanceof HTMLElement) setActive(visible.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.25, 0.6] });
    observed.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`local-nav ${open ? 'is-open' : ''}`} aria-label="Portfolio sections" data-hydrated={hydrated}>
      <div className="shell local-nav__inner">
        <a className="local-nav__identity" href="#overview">Aman Sharma <span>Portfolio / 2026</span></a>
        <button className="local-nav__toggle" type="button" aria-expanded={open} onClick={() => setOpen(!open)}><span>Sections</span><i /></button>
        <div className="local-nav__links">
          {sectionLinks.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="local-nav__archive" href="/projects/" onClick={() => setOpen(false)}>Full archive</a>
        </div>
      </div>
    </nav>
  );
}
