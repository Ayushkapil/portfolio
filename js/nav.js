/* ============================================================
   NAV.JS — Sticky nav, smooth scroll, active section
   ============================================================ */

(function () {
  'use strict';

  var nav = document.getElementById('sticky-nav');
  if (!nav) return;

  var landingHeight = window.innerHeight;
  var themeToggleFixed = document.querySelector('.theme-toggle');

  // ── Show/hide nav after landing ──────────────────────────
  function handleNavVisibility() {
    var showNav = window.scrollY > landingHeight * 0.85;
    nav.classList.toggle('visible', showNav);
    // Class rather than inline opacity, so the hidden toggle also leaves the
    // tab order instead of sitting there invisible but focusable.
    if (themeToggleFixed) {
      themeToggleFixed.classList.toggle('is-hidden', showNav);
    }
  }

  // ── Active section detection ──────────────────────────────
  // In document order, and including every section the nav links to —
  // 'resume' was missing, so its pill never lit up.
  var sectionIds = ['about', 'drives', 'tools', 'projects', 'notes', 'resume', 'gallery', 'contact'];
  var navLinks = nav.querySelectorAll('.nav-links a[data-section]');

  function updateActiveSection() {
    var scrollY = window.scrollY;
    var windowH = window.innerHeight;
    var activeId = null;

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      var rect = section.getBoundingClientRect();
      if (rect.top <= windowH * 0.4 && rect.bottom > 0) {
        activeId = id;
      }
    });

    navLinks.forEach(function (link) {
      var isActive = link.dataset.section === activeId;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // ── Smooth scroll ─────────────────────────────────────────
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = link.dataset.section;
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Nav name link smooth scrolls to top
  var navName = nav.querySelector('.nav-name');
  if (navName) {
    navName.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Scroll listener ───────────────────────────────────────
  // Both handlers read layout, so coalesce them into one frame.
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      handleNavVisibility();
      updateActiveSection();
      ticking = false;
    });
  }, { passive: true });

  // Update landing height on resize
  window.addEventListener('resize', function () {
    landingHeight = window.innerHeight;
  });

  // Initial call
  handleNavVisibility();
  updateActiveSection();

}());
