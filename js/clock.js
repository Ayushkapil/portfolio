/* ============================================================
   CLOCK.JS — Minimal live clock
   Updates both fixed and nav clock elements
   ============================================================ */

(function () {
  'use strict';

  var fixedEl = document.getElementById('clock-fixed');
  var navEl = document.getElementById('clock-nav');

  if (!fixedEl && !navEl) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateClock() {
    var now = new Date();
    var time = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    if (fixedEl) fixedEl.textContent = time;
    if (navEl) navEl.textContent = time;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // Hide fixed clock when sticky nav is visible
  var nav = document.getElementById('sticky-nav');
  if (nav && fixedEl) {
    var observer = new MutationObserver(function () {
      if (nav.classList.contains('visible')) {
        fixedEl.classList.add('hidden');
      } else {
        fixedEl.classList.remove('hidden');
      }
    });
    observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
  }
}());
