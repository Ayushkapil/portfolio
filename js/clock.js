/* CLOCK.JS — Minimal 8-bit clock */
(function () {
  'use strict';
  var el = document.getElementById('clock-time');
  if (!el) return;
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var now = new Date();
    el.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }
  tick();
  setInterval(tick, 1000);
}());
