/* =============================================
   ЭКОҚАРАҒАНДЫ — MAIN SCRIPT
   Smooth scroll · Navbar · Fade-in · Burger
   ============================================= */

(function () {
  'use strict';

  /* ── Helpers ───────────────────────────────── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


  /* ── Navbar scroll effect ──────────────────── */
  const navbar = qs('.navbar');

  function onScroll () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ── Smooth scroll for nav links ───────────── */
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = qs(id);
      if (!target) return;

      e.preventDefault();

      const navbarH = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 10;

      window.scrollTo({ top, behavior: 'smooth' });

      /* Close mobile menu */
      const navLinks = qs('#nav-links');
      const burger   = qs('#burger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });


  /* ── Active nav link highlight ─────────────── */
  const sections  = qsa('section[id], footer[id]');
  const navLinks  = qsa('.nav-link');

  function highlightActiveNav () {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    let currentId = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollMid) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }


  /* ── Burger menu (mobile) ──────────────────── */
  const burger  = qs('#burger');
  const navMenu = qs('#nav-links');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }


  /* ── Fade-in on scroll (IntersectionObserver) ── */
  const fadeItems = qsa('.fade-section');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    fadeItems.forEach(el => observer.observe(el));
  } else {
    /* Fallback for older browsers */
    fadeItems.forEach(el => el.classList.add('visible'));
  }


  /* ── Staggered stat counters ────────────────── */
  const statNums = qsa('.stat-num');

  function animateCounter (el) {
    const rawText = el.textContent.trim();
    /* Extract numeric portion and suffix */
    const match = rawText.match(/^([\d\s]+)(.*?)$/);
    if (!match) return;

    const numStr   = match[1].replace(/\s/g, '');
    const suffix   = match[2];
    const target   = parseInt(numStr, 10);
    const duration = 1600;
    const start    = performance.now();

    function step (now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease-out cubic */
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(target * eased);
      /* Format with spaces for thousands */
      el.textContent = current.toLocaleString('ru-RU') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => statObserver.observe(el));


  /* ── Keyboard: close menu on Escape ─────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ── Passive touch scroll optimisation ──────── */
  document.addEventListener('touchstart', () => {}, { passive: true });


  /* ── Init ───────────────────────────────────── */
  onScroll();

})();
