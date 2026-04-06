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
    if (window.scrollY > landingHeight * 0.85) {
      nav.classList.add('visible');
      if (themeToggleFixed) {
        themeToggleFixed.style.opacity = '0';
        themeToggleFixed.style.pointerEvents = 'none';
      }
    } else {
      nav.classList.remove('visible');
      if (themeToggleFixed) {
        themeToggleFixed.style.opacity = '0.85';
        themeToggleFixed.style.pointerEvents = 'auto';
      }
    }
  }

  // ── Active section detection ──────────────────────────────
  var sectionIds = ['about', 'drives', 'gallery', 'tools', 'projects', 'notes', 'contact'];
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
      if (link.dataset.section === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
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
  window.addEventListener('scroll', function () {
    handleNavVisibility();
    updateActiveSection();
  }, { passive: true });

  // Update landing height on resize
  window.addEventListener('resize', function () {
    landingHeight = window.innerHeight;
  });

  // Initial call
  handleNavVisibility();
  updateActiveSection();

}());
