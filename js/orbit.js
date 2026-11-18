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

  /* The same alpha that reads as a starfield on near-black reads as specks of
     dust on cream, so light mode gets a much softer field. */
  function alphaScale() {
    return getTheme() === 'light' ? 0.4 : 1;
  }

  function spawnDust(canvas) {
    const palette = COLORS[getTheme()];
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     0.6 + Math.random() * 1.6,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      alpha: 0.18 + Math.random() * 0.30,
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

  /* Cursor light. Particles inside GLOW_RADIUS brighten and drift gently
     toward the pointer, so the field feels responsive without ever becoming
     a focal point. Honours the OS reduce-motion setting. */
  const GLOW_RADIUS = 190;
  const reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  let pointer = { x: -9999, y: -9999, active: false };

  window.addEventListener('pointermove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  }, { passive: true });

  window.addEventListener('pointerleave', function () {
    pointer.active = false;
  }, { passive: true });

  /* Fixed 25 particles read as empty space on a large display. Scale with
     viewport area instead, clamped so it stays texture rather than noise. */
  function particleCount() {
    var area = window.innerWidth * window.innerHeight;
    return Math.max(40, Math.min(110, Math.round(area / 14000)));
  }

  function init() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    dustParticles = Array.from({ length: particleCount() }, function () {
      return spawnDust(bgCanvas);
    });
  }

  function animate() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    const lit = pointer.active && !reduceMotion.matches;

    dustParticles.forEach(function (d) {
      d.x += d.vx;
      d.y += d.vy;

      let alpha = d.alpha * alphaScale();
      let radius = d.r;
      let blur = 6;

      if (lit) {
        const dx = pointer.x - d.x;
        const dy = pointer.y - d.y;
        const dist = Math.hypot(dx, dy);
        if (dist < GLOW_RADIUS) {
          /* 1 at the pointer, easing to 0 at the edge of the radius */
          const pull = 1 - dist / GLOW_RADIUS;
          const ease = pull * pull;
          alpha  = Math.min(0.85, (d.alpha + ease * 0.55) * alphaScale());
          radius = d.r + ease * 1.1;
          blur   = 6 + ease * 10;
          /* a nudge toward the cursor, not a snap */
          d.x += (dx / (dist || 1)) * ease * 0.45;
          d.y += (dy / (dist || 1)) * ease * 0.45;
        }
      }

      if (d.x < 0) d.x = bgCanvas.width;
      if (d.x > bgCanvas.width)  d.x = 0;
      if (d.y < 0) d.y = bgCanvas.height;
      if (d.y > bgCanvas.height) d.y = 0;

      bgCtx.save();
      bgCtx.globalAlpha = alpha;
      bgCtx.shadowColor = d.color;
      bgCtx.shadowBlur  = blur;
      bgCtx.beginPath();
      bgCtx.arc(d.x, d.y, radius, 0, Math.PI * 2);
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

  /* theme.js calls this after a theme switch. Without it the particles kept
     the palette they were spawned with, so the light colours stayed on screen
     after switching to dark. */
  window.orbitUpdateTheme = function () {
    const palette = COLORS[getTheme()];
    dustParticles.forEach(function (d) {
      d.color = palette[Math.floor(Math.random() * palette.length)];
    });
  };

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
