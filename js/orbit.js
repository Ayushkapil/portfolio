/* ============================================================
   ORBIT.JS — Stardust particle effect for landing page
   ============================================================ */

(function () {
  'use strict';

  const COLORS = {
    dark:  ['#8B5CF6', '#FACC15', '#2DD4BF', '#FB7185', '#38BDF8', '#A3E635'],
    light: ['#7C3AED', '#F97316', '#0D9488', '#E11D48', '#0284C7', '#65A30D']
  };

  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  function spawnDust(canvas) {
    const palette = COLORS[getTheme()];
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     0.5 + Math.random() * 1.5,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      alpha: 0.06 + Math.random() * 0.12,
      color: palette[Math.floor(Math.random() * palette.length)]
    };
  }

  const bgCanvas = document.getElementById('orbit-canvas');
  if (!bgCanvas) return;

  if (window.innerWidth < 768) {
    bgCanvas.style.display = 'none';
    return;
  }

  const bgCtx = bgCanvas.getContext('2d');
  let dustParticles = [];
  let animId = null;

  function init() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    dustParticles = Array.from({ length: 25 }, function () { return spawnDust(bgCanvas); });
  }

  function animate() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    dustParticles.forEach(function (d) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = bgCanvas.width;
      if (d.x > bgCanvas.width)  d.x = 0;
      if (d.y < 0) d.y = bgCanvas.height;
      if (d.y > bgCanvas.height) d.y = 0;

      bgCtx.save();
      bgCtx.globalAlpha = d.alpha;
      bgCtx.shadowColor = d.color;
      bgCtx.shadowBlur  = 6;
      bgCtx.beginPath();
      bgCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      bgCtx.fillStyle = d.color;
      bgCtx.fill();
      bgCtx.restore();
    });

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('scroll', function () {
    const opacity = Math.max(0, 1 - window.scrollY / 250);
    bgCanvas.style.opacity       = opacity;
    bgCanvas.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
  });

  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth < 768) {
        bgCanvas.style.display = 'none';
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      } else {
        bgCanvas.style.display = '';
        init();
        if (!animId) animate();
      }
    }, 150);
  });

  init();
  animate();

}());
