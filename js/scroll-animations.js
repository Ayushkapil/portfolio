/* ============================================================
   SCROLL-ANIMATIONS.JS — IntersectionObserver reveals
   ============================================================ */

(function () {
  'use strict';

  // ── Standard reveal elements ──────────────────────────────
  var revealEls = document.querySelectorAll('.reveal, .photo-reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, no need to keep observing
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Pillar divider expansion ──────────────────────────────
  var dividers = document.querySelectorAll('.pillar-divider');

  if ('IntersectionObserver' in window) {
    var dividerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('expanded');
          dividerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    dividers.forEach(function (el) {
      dividerObserver.observe(el);
    });
  } else {
    dividers.forEach(function (el) {
      el.classList.add('expanded');
    });
  }

  // ── Card reveals ──────────────────────────────────────────
  var cardEls = document.querySelectorAll('.reveal-card');

  if ('IntersectionObserver' in window && cardEls.length) {
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cardEls.forEach(function (el) {
      cardObserver.observe(el);
    });
  } else {
    cardEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

}());
