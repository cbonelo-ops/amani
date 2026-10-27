/* Amani Yangu — load & scroll animations */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Slowly turning sun icons
  document.querySelectorAll('img[src*="icon-sun"]').forEach(function (img) { img.classList.add('ay-sun'); });

  // Header drops in
  var header = document.querySelector('header');
  if (header) header.classList.add('ay-header');

  // Hero: first section on the page
  var hero = document.querySelector('header + section');
  var heroEls = [];
  if (hero) {
    hero.querySelectorAll(':scope > img').forEach(function (img) { img.classList.add('ay-hero-bg'); });
    var h1 = hero.querySelector('h1');
    if (h1) {
      var col = h1.parentElement;
      heroEls = Array.prototype.slice.call(col.children);
      // other columns next to the text (e.g. a photo)
      if (col !== hero && hero.contains(col.parentElement)) {
        Array.prototype.forEach.call(col.parentElement.children, function (sib) { if (sib !== col) heroEls.push(sib); });
      }
    }
    heroEls.forEach(function (el, i) { el.classList.add('ay-hero'); el.style.setProperty('--d', (200 + i * 120) + 'ms'); });
  }

  // Scroll reveal targets (everything after the hero)
  var selector = 'h2, h3, p, article, li, figure, img, details, form, dl, blockquote, nav[aria-label="Services on this page"], aside > div, footer > div > div';
  var targets = [];
  document.querySelectorAll(selector).forEach(function (el) {
    if (header && header.contains(el)) return;
    if (hero && hero.contains(el)) return;
    if (el.getAttribute('aria-hidden') === 'true') return;           // decorative
    if (el.closest('[hidden]')) return;                               // shown later (e.g. booking thank-you)
    if (getComputedStyle(el).position === 'absolute') return;         // backgrounds / overlays
    if (el.parentElement && el.parentElement.closest('.ay-reveal')) return; // parent already animates
    el.classList.add('ay-reveal');
    targets.push(el);
  });

  // Stagger siblings that appear together
  var groups = new Map();
  targets.forEach(function (el) {
    var p = el.parentElement, n = groups.get(p) || 0;
    el.style.setProperty('--d', Math.min(n, 6) * 90 + 'ms');
    groups.set(p, n + 1);
  });

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('ay-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('ay-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach(function (el) { io.observe(el); });

  // Safety net: never leave content hidden (e.g. print, odd browsers)
  window.addEventListener('beforeprint', function () { targets.forEach(function (el) { el.classList.add('ay-in'); }); });
})();
