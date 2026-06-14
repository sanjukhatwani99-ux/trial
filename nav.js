// Visavera — Shared Navbar Script
// Injects a consistent navbar + handles smooth page transitions

(function () {
  /* ── 1. Which page are we on? ── */
  const path = location.pathname.split('/').pop() || 'index.html';
  const pageMap = {
    'index.html': 'home',
    '': 'home',
    'about.html': 'about',
    'tours.html': 'tours',
    'TourDetails.html': 'tours',
    'success.html': 'success',
    'contact.html': 'contact',
  };
  const active = pageMap[path] || 'home';

  /* ── 2. Build the navbar HTML ── */
  const links = [
    { id: 'home',    href: 'index.html',   label: 'Home' },
    { id: 'about',   href: 'about.html',   label: 'About' },
    { id: 'tours',   href: 'tours.html',   label: 'Tours & Packages' },
    { id: 'success', href: 'success.html', label: 'Success Stories' },
  ];

  function navLink(l) {
    const isActive = l.id === active;
    return `<li><a href="${l.href}" class="nav-link${isActive ? ' active' : ''}" data-page="${l.id}">${l.label}</a></li>`;
  }

  function mobileLink(l) {
    const isActive = l.id === active;
    return `<a href="${l.href}" class="mob-link${isActive ? ' active' : ''}" data-page="${l.id}">${l.label}</a>`;
  }

  const isContact = active === 'contact';

  const navHTML = `
<nav id="main-nav">
  <a class="nav-logo" href="index.html" data-page="home">Visa<span>vera</span><span class="nav-dot"></span></a>
  <ul class="nav-links">
    ${links.map(navLink).join('')}
    <li><a href="contact.html" class="nav-link nav-cta${isContact ? ' nav-cta-active' : ''}" data-page="contact">Contact Us</a></li>
  </ul>
  <button class="nav-hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  ${links.map(mobileLink).join('')}
  <a href="contact.html" class="mob-link mob-cta${isContact ? ' active' : ''}" data-page="contact">Contact Us</a>
</div>`;

  /* ── 3. Inject into DOM ── */
  const container = document.createElement('div');
  container.innerHTML = navHTML;
  Array.from(container.children).forEach(el => document.body.prepend(el));

  /* ── 4. Hamburger toggle ── */
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });

  /* ── 5. Smooth page transitions ── */
  function navigate(href) {
    document.documentElement.classList.add('page-leaving');
    setTimeout(() => { location.href = href; }, 220);
  }

  // Intercept nav link clicks — skip links pointing to the current page
  // (tours.html is a SPA; reloading it would kill the map)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    // Only intercept internal .html links
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#')) return;
    // Don't intercept links to the current page — let the page's own router handle it
    const currentFile = location.pathname.split('/').pop() || 'index.html';
    if (href === currentFile) return;
    e.preventDefault();
    // Close mobile menu if open
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
    menu.setAttribute('aria-hidden', true);
    navigate(href);
  });

  /* ── 6. Fade in on load ── */
  document.documentElement.classList.add('page-entering');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('page-entering');
    });
  });

})();
