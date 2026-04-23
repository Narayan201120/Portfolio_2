(function () {
  'use strict';

  // --- CROSSHAIR CURSOR ---
  const ch = document.getElementById('crosshair');
  const coordsEl = ch?.querySelector('.coords');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouch) {
    if (ch) ch.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('a,button').forEach(e => e.style.cursor = 'auto');
  } else {
    document.addEventListener('mousemove', e => {
      if (ch) {
        ch.style.left = e.clientX + 'px';
        ch.style.top = e.clientY + 'px';
      }
      if (coordsEl) {
        coordsEl.textContent = `x:${e.clientX} y:${e.clientY + window.scrollY}`;
      }
    });
    document.querySelectorAll('a,button,.bp-card,.skill-tag,.cert-card,.exp-item').forEach(el => {
      el.addEventListener('mouseenter', () => ch?.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ch?.classList.remove('hovering'));
    });
  }

  // --- SCROLL REVEAL ---
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // --- ACTIVE NAV ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.topbar-nav a');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-38px 0px -50% 0px' });
  sections.forEach(s => navObs.observe(s));

  // --- TYPING ROLE ---
  const roleEl = document.getElementById('role-val');
  if (roleEl) {
    const roles = ['Backend Developer', 'AI/ML Engineer', 'RAG Architect', 'Full-Stack Builder', 'LLM Engineer'];
    let idx = 0, charI = 0, deleting = false, text = '';
    function typeRole() {
      const target = roles[idx];
      if (!deleting) { text = target.substring(0, ++charI); }
      else { text = target.substring(0, --charI); }
      roleEl.textContent = '"' + text + '"';
      let delay = deleting ? 30 : 55;
      if (!deleting && charI === target.length) { delay = 2200; deleting = true; }
      else if (deleting && charI === 0) { deleting = false; idx = (idx + 1) % roles.length; delay = 300; }
      setTimeout(typeRole, delay);
    }
    setTimeout(typeRole, 1500);
  }

  // --- PROJECT CARD GLOW ---
  document.querySelectorAll('.bp-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // --- SMOOTH SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();
