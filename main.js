(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- theme toggle --- */
  var themeBtn = document.getElementById('theme-toggle');

  function effectiveTheme() {
    if (root.dataset.theme === 'dark' || root.dataset.theme === 'light') {
      return root.dataset.theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function renderThemeBtn() {
    if (!themeBtn) return;
    var target = effectiveTheme() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', 'Switch to ' + target + ' theme');
  }

  if (themeBtn) {
    renderThemeBtn();
    themeBtn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      renderThemeBtn();
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderThemeBtn);
  }

  /* --- mobile menu --- */
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
        setMenu(false);
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  /* --- scroll reveal --- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    } else {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      revealEls.forEach(function (el) { revealObs.observe(el); });
    }
  }

  /* --- active nav --- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* --- typed role (progressive enhancement; static text stays without JS) --- */
  var roleEl = document.getElementById('role-val');
  if (roleEl && !reduceMotion.matches) {
    var roles = [
      'Full-Stack & AI Engineer',
      'Backend Developer',
      'AI/ML Engineer',
      'RAG Engineer',
      'LLM Engineer'
    ];
    var idx = 0, charI = roles[0].length, deleting = false;

    function typeRole() {
      var target = roles[idx];
      charI += deleting ? -1 : 1;
      roleEl.textContent = target.substring(0, charI);
      var delay = deleting ? 26 : 48;
      if (!deleting && charI === target.length) {
        delay = 2400; deleting = true;
      } else if (deleting && charI === 0) {
        deleting = false;
        idx = (idx + 1) % roles.length;
        delay = 400;
      }
      setTimeout(typeRole, delay);
    }
    setTimeout(typeRole, 3000);
  }
})();
