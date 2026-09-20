(function () {
  const config = window.PORTFOLIO_CONFIG;
  const projects = window.PROJECTS;
  const bySlug = window.PROJECT_BY_SLUG;
  const icons = {
    arrow: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5"/></svg>',
    external: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 4h5v5M16 4l-7 7"/><path d="M15 11v4H5V5h4"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.48.09.65-.21.65-.46v-1.7c-2.65.58-3.2-1.12-3.2-1.12-.44-1.1-1.08-1.4-1.08-1.4-.88-.6.07-.59.07-.59.97.07 1.48 1 1.48 1 .86 1.47 2.27 1.04 2.83.8.09-.62.34-1.04.61-1.28-2.12-.24-4.35-1.06-4.35-4.7 0-1.04.37-1.88.98-2.54-.1-.24-.43-1.2.09-2.5 0 0 .8-.25 2.62.97a9.1 9.1 0 0 1 4.77 0c1.82-1.22 2.62-.97 2.62-.97.52 1.3.19 2.26.09 2.5.61.66.98 1.5.98 2.54 0 3.65-2.24 4.46-4.37 4.7.35.3.66.88.66 1.78v2.51c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>'
  };

  function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function link(url, label, kind) {
    if (!url) return '';
    const icon = kind === 'github' ? icons.github : icons.external;
    return `<a class="button button--ghost button--small" href="${esc(url)}" target="_blank" rel="noreferrer">${icon}<span>${esc(label)}</span></a>`;
  }

  function visual(project, large) {
    if (project.image) {
      const imageSrc = document.querySelector('[data-project-page]') ? `../../${project.image}` : project.image;
      return `<div class="project-visual project-visual--image ${large ? 'project-visual--large' : ''}"><img src="${esc(imageSrc)}" alt="${esc(project.imageAlt)}" loading="${large ? 'eager' : 'lazy'}"><span class="visual-chip">Verified asset</span></div>`;
    }
    const type = project.visualType || 'code';
    const details = {
      evidence: '<div class="mini-row"><span class="mini-dot mini-dot--cyan"></span><b>Photo + location</b><em>Today</em></div><div class="mini-row"><span class="mini-dot mini-dot--green"></span><b>Follow-up added</b><em>+07d</em></div><div class="mini-row"><span class="mini-dot mini-dot--amber"></span><b>Resolution note</b><em>Open</em></div>',
      player: '<div class="player-disc"><span>ॐ</span></div><div class="player-copy"><span>Daily Bhakti</span><b>Om Namah Shivaya</b><i>00:42 <small>/ 03:18</small></i></div>',
      watch: '<div class="watch-screen"><div class="watch-glow"></div><span>ROOM 07</span></div><div class="watch-rail"><span></span><span></span><span></span><span></span></div>',
      download: '<div class="download-line"><span>instagram.com/reel/…</span><b>Public</b></div><div class="download-progress"><i></i></div><div class="download-meta"><span>Preview ready</span><span>Short-lived link</span></div>',
      ats: '<div class="ats-score"><strong>94</strong><span>ATS fit</span></div><div class="ats-bars"><i></i><i></i><i></i><i></i></div>',
      commerce: '<div class="commerce-photo"></div><div class="commerce-caption"><span>Curated catalogue</span><b>Orders gated</b></div>',
      code: '<div class="code-lines"><i></i><i></i><i></i><i></i><i></i></div><div class="code-badge">{ } archive</div>'
    }[type];
    return `<div class="project-visual project-visual--art project-visual--${esc(type)} ${large ? 'project-visual--large' : ''}"><div class="art-grid"></div><div class="art-window"><div class="art-window__top"><span></span><span></span><span></span><b>${esc(project.visualLabel)}</b></div><div class="art-window__body">${details}</div></div><span class="visual-chip">${esc(project.visualStat)}</span></div>`;
  }

  function projectCard(project, compact) {
    const caseBase = document.querySelector('[data-project-grid]') ? '' : 'projects/';
    const action = `<a class="text-link" href="${caseBase}${esc(project.slug)}/">View case study ${icons.arrow}</a>`;
    const links = `${project.live ? link(project.live, 'Live demo', 'external') : ''}${project.repo ? link(project.repo, 'GitHub', 'github') : ''}`;
    return `<article class="project-card reveal ${compact ? 'project-card--compact' : ''}" data-project-card data-name="${esc((project.name + ' ' + project.summary + ' ' + project.stack.join(' ')).toLowerCase())}" data-filters="${esc(project.filters.join(' '))}">${visual(project, false)}<div class="project-card__body"><div class="card-meta"><span>${esc(project.eyebrow)}</span><span class="status ${esc(project.statusClass)}"><i></i>${esc(project.status)}</span></div><h3>${esc(project.name)}</h3><p>${esc(project.summary)}</p><div class="tag-row">${project.stack.slice(0, 4).map((tag) => `<span>${esc(tag)}</span>`).join('')}</div><div class="card-actions">${action}<div class="card-links">${links}</div></div></div></article>`;
  }

  function renderProjects(target, list, compact) {
    if (!target) return;
    target.innerHTML = list.map((project) => projectCard(project, compact)).join('');
    requestAnimationFrame(() => observeReveals(target));
  }

  function setupFilters() {
    const grid = document.querySelector('[data-project-grid]');
    const search = document.querySelector('[data-project-search]');
    const empty = document.querySelector('[data-empty-state]');
    const count = document.querySelector('[data-result-count]');
    if (!grid) return;
    let active = 'all';
    const buttons = [...document.querySelectorAll('[data-filter]')];
    function update() {
      const query = (search?.value || '').trim().toLowerCase();
      const filtered = projects.filter((project) => {
        const matchesFilter = active === 'all' || project.filters.includes(active);
        const haystack = `${project.name} ${project.eyebrow} ${project.summary} ${project.stack.join(' ')}`.toLowerCase();
        return matchesFilter && (!query || haystack.includes(query));
      });
      renderProjects(grid, filtered, true);
      if (empty) empty.hidden = filtered.length !== 0;
      if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'}`;
    }
    buttons.forEach((button) => button.addEventListener('click', () => {
      active = button.dataset.filter;
      buttons.forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
      update();
    }));
    search?.addEventListener('input', update);
    update();
  }

  function setupNav() {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-nav]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.innerHTML = open ? icons.close : icons.menu;
    });
    menu.querySelectorAll('a').forEach((anchor) => anchor.addEventListener('click', () => {
      header.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.innerHTML = icons.menu;
    }));
    window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 12), { passive: true });
  }

  function observeReveals(scope) {
    const items = (scope || document).querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
  }

  function renderHome() {
    renderProjects(document.querySelector('[data-featured-grid]'), projects.filter((project) => project.featured), false);
    renderProjects(document.querySelector('[data-lab-grid]'), projects.filter((project) => project.filters.includes('experiments')), false);
  }

  function renderProjectPage() {
    const mount = document.querySelector('[data-project-page]');
    if (!mount) return;
    const project = bySlug[mount.dataset.project];
    if (!project) { mount.innerHTML = '<div class="empty-state"><p>That project could not be found.</p><a class="text-link" href="../../projects/">Back to all projects</a></div>'; return; }
    document.title = `${project.name} — Aman Sharma`;
    const sourceNote = project.repo ? 'Public repository and deployment evidence' : project.source;
    mount.innerHTML = `<div class="case-study"><div class="case-crumb"><a href="../../">Home</a><span>/</span><a href="../../projects/">All projects</a><span>/</span><strong>${esc(project.name)}</strong></div><div class="case-hero"><div class="case-hero__copy"><p class="eyebrow">${esc(project.eyebrow)}</p><h1>${esc(project.name)}</h1><p class="case-lede">${esc(project.summary)}</p><div class="hero-actions"><a class="button button--primary" href="#overview">Explore the build ${icons.arrow}</a>${project.live ? link(project.live, 'Open live demo', 'external') : ''}${project.repo ? link(project.repo, 'View on GitHub', 'github') : ''}</div><div class="case-badges"><span class="status ${esc(project.statusClass)}"><i></i>${esc(project.status)}</span><span>Evidence: ${esc(project.confidence.split(' — ')[0])}</span></div></div><div class="case-hero__visual">${visual(project, true)}</div></div><div class="case-layout" id="overview"><aside class="case-sidebar"><div><span class="label">Category</span><strong>${esc(project.category)}</strong></div><div><span class="label">Current status</span><strong>${esc(project.status)}</strong></div><div><span class="label">Source</span><strong>${esc(sourceNote)}</strong></div><div><span class="label">Stack</span><div class="tag-row tag-row--vertical">${project.stack.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div></div></aside><article class="case-content"><section><p class="section-kicker">01 / The problem</p><h2>What this project is solving</h2><p>${esc(project.problem)}</p><p class="muted">Intended audience: ${esc(project.audience)}</p></section><section><p class="section-kicker">02 / Verified surface</p><h2>What is documented today</h2><ul class="check-list">${project.features.map((feature) => `<li>${icons.check}<span>${esc(feature)}</span></li>`).join('')}</ul></section><section><p class="section-kicker">03 / How it is built</p><h2>Engineering notes</h2><p>${esc(project.engineering)}</p></section><section><p class="section-kicker">04 / Status & evidence</p><h2>A clear boundary around the work</h2><p>${esc(project.journey)}</p><div class="evidence-note"><span class="evidence-note__icon">◎</span><div><strong>Evidence note</strong><p>${esc(project.confidence)}. ${esc(project.source)}</p></div></div></section></article></div><div class="case-next"><div><p class="section-kicker">Keep exploring</p><h2>More documented work</h2></div><a class="button button--ghost" href="../../projects/">Browse all projects ${icons.arrow}</a></div></div>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    renderHome();
    setupFilters();
    renderProjectPage();
    observeReveals(document);
  });
})();
