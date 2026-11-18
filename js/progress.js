/* ============================================================
   PROGRESS.JS — scroll progress hairline
   ============================================================ */

(function () {
  'use strict';

  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  var ticking = false;

  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = 'scaleX(' + pct + ')';
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', update);
  update();
}());
