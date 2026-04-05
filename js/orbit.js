/* ============================================================
   ORBIT.JS — Black hole + orbiting planets animation
   Landing page canvas background
   ============================================================ */

(function () {
  'use strict';

  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  // ── Theme-aware colors ─────────────────────────────────────
  var THEMES = {
    dark: {
      bg: '31, 31, 31',
      glowInner: 'rgba(255, 140, 0, ',
      glowOuter: 'rgba(255, 80, 0, ',
      diskHighlight: 'rgba(255, 240, 180, ',
      orbitRing: 'rgba(245, 245, 245, ',
      starFill: 'rgba(245, 245, 245, ',
      planets: ['#FB7185', '#38BDF8', '#8B5CF6', '#2DD4BF']
    },
    light: {
      bg: '245, 242, 235',
      glowInner: 'rgba(180, 83, 9, ',
      glowOuter: 'rgba(146, 64, 14, ',
      diskHighlight: 'rgba(255, 210, 120, ',
      orbitRing: 'rgba(44, 44, 44, ',
      starFill: 'rgba(44, 44, 44, ',
      planets: ['#E11D48', '#0284C7', '#7C3AED', '#0D9488']
    }
  };

  // ── Planet definitions ─────────────────────────────────────
  var PLANETS = [
    { orbitR: 115, size: 5,  speed: 0.028,  angle: 0.0,  tilt: 0.28 },
    { orbitR: 180, size: 9,  speed: 0.016,  angle: 1.8,  tilt: 0.18 },
    { orbitR: 255, size: 13, speed: 0.009,  angle: 4.2,  tilt: 0.30 },
    { orbitR: 320, size: 4,  speed: 0.022,  angle: 2.7,  tilt: 0.12 }
  ];

  var BH_RADIUS = 38;
  var DISK_OUTER = 92;

  var bgCanvas = document.getElementById('orbit-canvas');
  if (!bgCanvas) return;

  if (window.innerWidth < 768) {
    bgCanvas.style.display = 'none';
    return;
  }

  var ctx = bgCanvas.getContext('2d');
  var animId = null;
  var stars = [];
  var time = 0;
  var cx, cy;

  // ── Stars ──────────────────────────────────────────────────
  function initStars() {
    stars = [];
    var count = 90;
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        r: Math.random() * 1.4 + 0.2,
        base: Math.random() * 0.55 + 0.05,
        speed: Math.random() * 0.018 + 0.004,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStars(theme) {
    var t = THEMES[theme];
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = s.base + Math.sin(time * s.speed + s.offset) * 0.12;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = t.starFill + Math.max(0, alpha) + ')';
      ctx.fill();
    }
  }

  // ── Black hole + accretion disk ───────────────────────────
  function drawBlackHole(theme) {
    var t = THEMES[theme];

    // Soft outer gravitational glow
    var glowGrad = ctx.createRadialGradient(cx, cy, BH_RADIUS, cx, cy, BH_RADIUS + 70);
    glowGrad.addColorStop(0, t.glowInner + '0.18)');
    glowGrad.addColorStop(0.5, t.glowOuter + '0.06)');
    glowGrad.addColorStop(1, t.glowOuter + '0)');
    ctx.beginPath();
    ctx.arc(cx, cy, BH_RADIUS + 70, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Accretion disk — drawn as a flattened ellipse
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.22);

    var diskRotation = time * 0.004;

    // Use linear sweep approximation for disk brightness
    for (var r = DISK_OUTER; r > BH_RADIUS - 4; r -= 3) {
      var frac = 1 - (r - BH_RADIUS) / (DISK_OUTER - BH_RADIUS);
      var a;
      if (frac < 0.5) {
        a = frac * 2 * 0.75;
      } else {
        a = (1 - (frac - 0.5) * 2) * 0.75;
      }
      // Brighter front half to simulate rotation
      var angle = ((r * 0.3 + diskRotation) % (Math.PI * 2));
      var brightMod = 0.5 + 0.5 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      var c;
      if (frac > 0.75) {
        c = t.diskHighlight + (a * (0.4 + brightMod * 0.6)) + ')';
      } else {
        c = t.glowInner + (a * (0.3 + brightMod * 0.5)) + ')';
      }
      ctx.strokeStyle = c;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }
    ctx.restore();

    // The black hole itself
    var bhGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, BH_RADIUS + 6);
    bhGrad.addColorStop(0.0, '#000000');
    bhGrad.addColorStop(0.82, '#000000');
    bhGrad.addColorStop(1.0, t.glowInner + '0.35)');
    ctx.beginPath();
    ctx.arc(cx, cy, BH_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = bhGrad;
    ctx.fill();

    // Photon ring edge glow
    ctx.beginPath();
    ctx.arc(cx, cy, BH_RADIUS + 2, 0, Math.PI * 2);
    ctx.strokeStyle = t.glowInner + '0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // ── Orbit ring ────────────────────────────────────────────
  function drawOrbitRing(orbitR, tilt, theme) {
    var t = THEMES[theme];
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, Math.sin(tilt));
    ctx.beginPath();
    ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = t.orbitRing + '0.10)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  // ── Planet ────────────────────────────────────────────────
  function drawPlanet(planet, colorHex, drawBehind) {
    var normAngle = ((planet.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    var isBehind = normAngle > Math.PI;
    if (isBehind !== drawBehind) return;

    var px = cx + Math.cos(planet.angle) * planet.orbitR;
    var py = cy + Math.sin(planet.angle) * planet.orbitR * Math.sin(planet.tilt);

    // Planet body with simple 3-D shading
    var grad = ctx.createRadialGradient(
      px - planet.size * 0.3, py - planet.size * 0.3, planet.size * 0.1,
      px, py, planet.size
    );
    grad.addColorStop(0, colorHex);
    grad.addColorStop(1, 'rgba(0,0,0,0.75)');

    ctx.beginPath();
    ctx.arc(px, py, planet.size, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ── Main animation loop ───────────────────────────────────
  function animate() {
    time++;
    var theme = getTheme();
    var t = THEMES[theme];

    // Clear frame
    ctx.fillStyle = 'rgb(' + t.bg + ')';
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Stars
    drawStars(theme);

    // Advance planet angles
    for (var i = 0; i < PLANETS.length; i++) {
      PLANETS[i].angle += PLANETS[i].speed;
    }

    // Orbit rings
    for (var j = 0; j < PLANETS.length; j++) {
      drawOrbitRing(PLANETS[j].orbitR, PLANETS[j].tilt, theme);
    }

    // Planets behind black hole
    for (var k = 0; k < PLANETS.length; k++) {
      drawPlanet(PLANETS[k], t.planets[k], true);
    }

    // Black hole (on top of back-planets, below front-planets)
    drawBlackHole(theme);

    // Planets in front of black hole
    for (var m = 0; m < PLANETS.length; m++) {
      drawPlanet(PLANETS[m], t.planets[m], false);
    }

    animId = requestAnimationFrame(animate);
  }

  // ── Canvas sizing ─────────────────────────────────────────
  function resize() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    cx = bgCanvas.width  * 0.54;
    cy = bgCanvas.height * 0.48;
    initStars();
  }

  // ── Scroll fade ───────────────────────────────────────────
  window.addEventListener('scroll', function () {
    var opacity = Math.max(0, 1 - window.scrollY / 300);
    bgCanvas.style.opacity = opacity;
    bgCanvas.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
  });

  // ── Responsive ────────────────────────────────────────────
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth < 768) {
        bgCanvas.style.display = 'none';
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      } else {
        bgCanvas.style.display = '';
        resize();
        if (!animId) animate();
      }
    }, 150);
  });

  // ── Theme update hook (called by theme.js when switching modes) ──
  window.orbitUpdateTheme = function () {
    // Colors are read directly from getTheme() on each frame —
    // no explicit action needed here; the hook exists so theme.js
    // can call it without a guard check.
  };

  resize();
  animate();
}());

