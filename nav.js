// Visavera — Premium Navbar (flat, no dropdowns)
(function () {
  'use strict';

  const path   = location.pathname.split('/').pop() || 'index.html';
  const pageMap = {
    'index.html':              'home',
    '':                        'home',
    'about.html':              'about',
    'student-visa.html':       'student-visa',
    'work-visa.html':          'work-visa',
    'visitor-visa.html':       'visitor-visa',
    'tours.html':              'international-tours',
    'TourDetails.html':        'international-tours',
    'domestic-tours.html':     'domestic-tours',
    'testimonials.html':       'testimonials',
    'contact.html':            'contact',
  };
  const active    = pageMap[path] || 'home';
  const isContact = active === 'contact';

  const links = [
    { id:'home',                href:'index.html',               label:'Home',                delay:'0.08s' },
    { id:'about',               href:'about.html',               label:'About',               delay:'0.13s' },
    { id:'testimonials',        href:'testimonials.html',        label:'Testimonials',        delay:'0.18s' },
    { id:'SEP1', sep:true },
    { id:'student-visa',        href:'student-visa.html',        label:'Student Visa',        delay:'0.23s' },
    { id:'work-visa',           href:'work-visa.html',           label:'Work Visa',           delay:'0.27s' },
    { id:'visitor-visa',        href:'visitor-visa.html',        label:'Visitor Visa',        delay:'0.31s' },
    { id:'SEP2', sep:true },
    { id:'international-tours', href:'tours.html',               label:'International',       delay:'0.35s' },
    { id:'domestic-tours',      href:'domestic-tours.html',      label:'Domestic Tours',      delay:'0.39s' },
  ];

  const desktopHTML = links.map(l => {
    if (l.sep) return `<li class="nav-sep" aria-hidden="true"></li>`;
    const a = l.id === active;
    return `<li><a href="${l.href}" class="nav-link${a?' active':''}" data-page="${l.id}" style="animation-delay:${l.delay}">${l.label}</a></li>`;
  }).join('');

  const flat = links.filter(l => !l.sep);
  const mobileHTML = [
    flat.slice(0,3).map(l => `<a href="${l.href}" class="mob-link${l.id===active?' active':''}" data-page="${l.id}">${l.label}</a>`).join(''),
    '<div class="mob-divider"></div>',
    `<span class="mob-label">Visa Services</span>`,
    flat.slice(3,6).map(l => `<a href="${l.href}" class="mob-link${l.id===active?' active':''}" data-page="${l.id}">${l.label}</a>`).join(''),
    '<div class="mob-divider"></div>',
    `<span class="mob-label">Tours</span>`,
    flat.slice(6,8).map(l => `<a href="${l.href}" class="mob-link${l.id===active?' active':''}" data-page="${l.id}">${l.label}</a>`).join(''),
    '<div class="mob-divider"></div>',
    `<a href="contact.html" class="mob-link mob-cta${isContact?' active':''}" data-page="contact">Contact us →</a>`,
  ].join('');

  const navHTML = `
<nav id="main-nav" role="navigation" aria-label="Main">
  <a class="nav-logo" href="index.html" data-page="home" aria-label="Visavera home">
    Visa<span class="red">vera</span><span class="nav-dot" aria-hidden="true"></span>
  </a>
  <ul class="nav-links" role="list">${desktopHTML}</ul>
  <div class="nav-right">
    <a href="contact.html" class="nav-cta${isContact?' nav-cta-active':''}" data-page="contact">
      Contact <span class="nav-cta-arrow" aria-hidden="true">→</span>
    </a>
    <button class="nav-hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobileMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div id="nav-progress" aria-hidden="true"><div id="nav-progress-fill"></div></div>
</nav>
<div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Navigation" aria-hidden="true">${mobileHTML}</div>`;

  const wrap = document.createElement('div');
  wrap.innerHTML = navHTML;
  Array.from(wrap.children).forEach(el => document.body.prepend(el));

  const nav    = document.getElementById('main-nav');
  const btn    = document.getElementById('hamburger');
  const menu   = document.getElementById('mobileMenu');
  const bar    = document.getElementById('nav-progress');
  const fill   = document.getElementById('nav-progress-fill');

  /* Scroll */
  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 16);
    if (y > 60) {
      bar.classList.add('visible');
      fill.style.width = Math.min(100,(y/h)*100) + '%';
    } else {
      bar.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* Mobile menu */
  function setOpen(open) {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  /* Mobile menu — fire on touchend so first tap opens/closes instantly.
     preventDefault() stops the 300 ms ghost-click that would follow. */
  function toggleMenu() { setOpen(!menu.classList.contains('open')); }
  btn.addEventListener('click',    toggleMenu);
  btn.addEventListener('touchend', function(e) { e.preventDefault(); toggleMenu(); }, { passive: false });

  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); btn.focus(); }
  });

  /* Page transitions
     ─────────────────────────────────────────────────────────────
     Problem: touch browsers fire :hover on tap-1, click on tap-2.
     Fix: intercept touchend directly so navigation fires on the
     first tap. We mark the anchor with a flag so the subsequent
     synthetic click event (which browsers fire ~300 ms later) is
     ignored rather than triggering a second navigation.
     ─────────────────────────────────────────────────────────────*/
  function navigate(href) {
    document.documentElement.classList.add('page-leaving');
    setTimeout(() => { location.href = href; }, 280);
  }

  function handleAnchor(e, anchor) {
    const href = anchor.getAttribute('href');
    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return;
    const cur = location.pathname.split('/').pop() || 'index.html';
    if (href === cur) return;
    e.preventDefault();
    setOpen(false);
    navigate(href);
  }

  // touchend — fires on first tap, marks the anchor so click is skipped
  document.addEventListener('touchend', function(e) {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    anchor._touchNavigated = true;
    handleAnchor(e, anchor);
  }, { passive: false });

  // click — used by mouse users; skipped if touchend already handled it
  document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    if (anchor._touchNavigated) { anchor._touchNavigated = false; return; }
    handleAnchor(e, anchor);
  });

  /* Page enter */
  document.documentElement.classList.add('page-entering');
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('page-entering')));
})();
