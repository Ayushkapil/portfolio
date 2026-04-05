/* ============================================================
   ORBIT.JS — Full orbit simulation
   Two modes: background (landing page) + game (full-screen overlay)
   ============================================================ */

(function () {
  'use strict';

  // ── Shared Constants ───────────────────────────────────────
  const G = 5000;
  const MAX_VELOCITY = 12;
  const ABSORPTION_DISTANCE = 10;
  const ESCAPE_MARGIN = 200;
  const BLACKHOLE_RADIUS = 8;

  // ── Background simulation colors ──────────────────────────
  const BG_COLORS = {
    dark: ['#8B5CF6', '#FACC15', '#F5F5F5'],
    light: ['#7C3AED', '#F97316', '#111111']
  };

  // ── Game mode expanded color palette ──────────────────────
  const GAME_COLORS = [
    '#8B5CF6', '#FACC15', '#F97316', '#EC4899', '#14B8A6',
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1',
    '#84CC16', '#F472B6', '#22D3EE', '#A855F7'
  ];

  // ── Utility helpers ────────────────────────────────────────
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  function getBgColorRgb() {
    return getTheme() === 'dark' ? '31, 31, 31' : '245, 242, 235';
  }

  function getTextColor() {
    return getTheme() === 'dark' ? '#F5F5F5' : '#2C2C2C';
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  function placeBlackHolesForCount(count, w, h) {
    if (count === 1) {
      return [{ x: w * 0.5, y: h * 0.5 }];
    } else if (count === 2) {
      return [
        { x: w * 0.38, y: h * 0.45 },
        { x: w * 0.65, y: h * 0.52 }
      ];
    } else if (count === 3) {
      return [
        { x: w * 0.5,  y: h * 0.28 },
        { x: w * 0.3,  y: h * 0.62 },
        { x: w * 0.7,  y: h * 0.62 }
      ];
    } else {
      return [
        { x: w * 0.35, y: h * 0.35 },
        { x: w * 0.65, y: h * 0.35 },
        { x: w * 0.35, y: h * 0.65 },
        { x: w * 0.65, y: h * 0.65 }
      ];
    }
  }

  function launchBody(x, y, blackHoles, speed) {
    let nearest = blackHoles[0];
    let minDist = Infinity;
    blackHoles.forEach(function (bh) {
      const d = Math.hypot(bh.x - x, bh.y - y);
      if (d < minDist) { minDist = d; nearest = bh; }
    });
    const angle = Math.atan2(nearest.y - y, nearest.x - x) + 0.6;
    return {
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      trail: []
    };
  }

  function stepBodies(bodies, blackHoles, canvas, trailLength) {
    return bodies.filter(function (body) {
      body.trail.push({ x: body.x, y: body.y });
      if (body.trail.length > trailLength) body.trail.shift();

      let ax = 0, ay = 0, absorbed = false;
      blackHoles.forEach(function (bh) {
        const dx = bh.x - body.x;
        const dy = bh.y - body.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ABSORPTION_DISTANCE) { absorbed = true; return; }
        const force = G / (distance * distance);
        ax += force * (dx / distance);
        ay += force * (dy / distance);
      });

      if (absorbed) return false;

      body.vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, body.vx + ax));
      body.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, body.vy + ay));
      body.x += body.vx;
      body.y += body.vy;

      if (
        body.x < -ESCAPE_MARGIN || body.x > canvas.width + ESCAPE_MARGIN ||
        body.y < -ESCAPE_MARGIN || body.y > canvas.height + ESCAPE_MARGIN
      ) {
        return false;
      }
      return true;
    });
  }

  function drawScene(ctx, canvas, bodies, blackHoles, clearAlpha, bodyRadius) {
    ctx.fillStyle = 'rgba(' + getBgColorRgb() + ', ' + clearAlpha + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const textColor = getTextColor();
    blackHoles.forEach(function (bh) {
      ctx.save();
      ctx.shadowColor = textColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(bh.x, bh.y, BLACKHOLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = textColor;
      ctx.fill();
      ctx.restore();
    });

    bodies.forEach(function (body) {
      if (body.trail.length < 2) return;
      for (let i = 1; i < body.trail.length; i++) {
        const opacity = i / body.trail.length;
        ctx.beginPath();
        ctx.moveTo(body.trail[i - 1].x, body.trail[i - 1].y);
        ctx.lineTo(body.trail[i].x, body.trail[i].y);
        ctx.strokeStyle = hexToRgba(body.color, opacity * 0.9);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(body.x, body.y, bodyRadius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();
    });
  }

  // ══════════════════════════════════════════════════════════
  // BACKGROUND SIMULATION (landing page canvas)
  // ══════════════════════════════════════════════════════════

  const bgCanvas = document.getElementById('orbit-canvas');
  if (bgCanvas && window.innerWidth >= 768) {
    const bgCtx = bgCanvas.getContext('2d');
    const BG_MAX_BODIES = 14;
    const BG_TRAIL_LENGTH = 80;
    const BG_BODY_RADIUS = 4;
    const BG_CLEAR_ALPHA = 0.15;

    const AUTO_LAUNCHES = [
      { x: 0.2,  y: 0.3,  vx: 2.5,  vy: 1.5  },
      { x: 0.8,  y: 0.6,  vx: -2.0, vy: -1.8 },
      { x: 0.5,  y: 0.1,  vx: 1.0,  vy: 3.0  },
      { x: 0.15, y: 0.7,  vx: 3.0,  vy: -1.0 },
    ];

    let bgBodies = [];
    let bgBlackHoles = [];
    let bgColorIndex = 0;
    let bgAnimId = null;

    function bgGetColor() {
      const palette = BG_COLORS[getTheme()];
      const c = palette[bgColorIndex % palette.length];
      bgColorIndex++;
      return c;
    }

    function bgResize() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
      bgBlackHoles = placeBlackHolesForCount(2, bgCanvas.width, bgCanvas.height);
      bgBodies = [];
      bgAutoLaunch();
    }

    function bgAutoLaunch() {
      AUTO_LAUNCHES.forEach(function (cfg) {
        const body = launchBody(
          cfg.x * bgCanvas.width,
          cfg.y * bgCanvas.height,
          bgBlackHoles, 0
        );
        body.vx = cfg.vx;
        body.vy = cfg.vy;
        body.color = bgGetColor();
        bgBodies.push(body);
      });
    }

    bgCanvas.addEventListener('click', function (e) {
      if (bgBodies.length < BG_MAX_BODIES) {
        const body = launchBody(e.clientX, e.clientY, bgBlackHoles, 3.5);
        body.color = bgGetColor();
        bgBodies.push(body);
      }
    });

    bgCanvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (bgBodies.length < BG_MAX_BODIES) {
        const touch = e.touches[0];
        const body = launchBody(touch.clientX, touch.clientY, bgBlackHoles, 3.5);
        body.color = bgGetColor();
        bgBodies.push(body);
      }
    }, { passive: false });

    function bgAnimate() {
      bgBodies = stepBodies(bgBodies, bgBlackHoles, bgCanvas, BG_TRAIL_LENGTH);
      drawScene(bgCtx, bgCanvas, bgBodies, bgBlackHoles, BG_CLEAR_ALPHA, BG_BODY_RADIUS);
      bgAnimId = requestAnimationFrame(bgAnimate);
    }

    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 200);
      bgCanvas.style.opacity = opacity;
      bgCanvas.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
    });

    let bgResizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(bgResizeTimer);
      bgResizeTimer = setTimeout(function () {
        if (window.innerWidth < 768) {
          bgCanvas.style.display = 'none';
          if (bgAnimId) { cancelAnimationFrame(bgAnimId); bgAnimId = null; }
        } else {
          bgCanvas.style.display = '';
          bgResize();
          if (!bgAnimId) bgAnimate();
        }
      }, 150);
    });

    window.orbitUpdateTheme = function () { /* existing bodies keep color */ };

    bgResize();
    bgAnimate();
  } else if (bgCanvas) {
    bgCanvas.style.display = 'none';
  }

  // ══════════════════════════════════════════════════════════
  // GAME MODE (full-screen overlay canvas)
  // ══════════════════════════════════════════════════════════

  const gameOverlay = document.getElementById('game-overlay');
  const gameCanvas  = document.getElementById('game-canvas');
  const gameBtn     = document.getElementById('game-btn');
  const gameCloseBtn = document.getElementById('game-close-btn');
  const gameClearBtn = document.getElementById('game-clear-btn');
  const bhMinusBtn  = document.getElementById('bh-minus');
  const bhPlusBtn   = document.getElementById('bh-plus');
  const bhCountEl   = document.getElementById('bh-count');
  const bodyCountEl = document.getElementById('body-count');

  if (!gameOverlay || !gameCanvas || !gameBtn) return;

  const gameCtx = gameCanvas.getContext('2d');
  const GAME_MAX_BODIES = 100;
  const GAME_TRAIL_LENGTH = 200;
  const GAME_BODY_RADIUS = 3;
  const GAME_CLEAR_ALPHA = 0.03;

  let gameBodies = [];
  let gameBlackHoles = [];
  let gameBlackHoleCount = 2;
  let gameColorIndex = 0;
  let gameAnimId = null;
  let gameActive = false;

  function gameGetColor() {
    const c = GAME_COLORS[gameColorIndex % GAME_COLORS.length];
    gameColorIndex++;
    return c;
  }

  function gameResizeCanvas() {
    gameCanvas.width = gameOverlay.clientWidth;
    gameCanvas.height = gameOverlay.clientHeight;
    gameBlackHoles = placeBlackHolesForCount(gameBlackHoleCount, gameCanvas.width, gameCanvas.height);
  }

  function updateHud() {
    if (bhCountEl) bhCountEl.textContent = gameBlackHoleCount;
    if (bhMinusBtn) bhMinusBtn.disabled = gameBlackHoleCount <= 1;
    if (bhPlusBtn) bhPlusBtn.disabled = gameBlackHoleCount >= 4;
    if (bodyCountEl) bodyCountEl.textContent = gameBodies.length;
  }

  function gameAnimate() {
    if (!gameActive) return;
    gameBodies = stepBodies(gameBodies, gameBlackHoles, gameCanvas, GAME_TRAIL_LENGTH);
    drawScene(gameCtx, gameCanvas, gameBodies, gameBlackHoles, GAME_CLEAR_ALPHA, GAME_BODY_RADIUS);
    if (bodyCountEl) bodyCountEl.textContent = gameBodies.length;
    gameAnimId = requestAnimationFrame(gameAnimate);
  }

  function openGame() {
    gameActive = true;
    gameOverlay.classList.add('active');
    gameOverlay.setAttribute('aria-hidden', 'false');
    gameResizeCanvas();
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameBodies = [];
    updateHud();
    if (!gameAnimId) gameAnimate();
  }

  function closeGame() {
    gameActive = false;
    gameOverlay.classList.remove('active');
    gameOverlay.setAttribute('aria-hidden', 'true');
    if (gameAnimId) { cancelAnimationFrame(gameAnimId); gameAnimId = null; }
  }

  gameBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    openGame();
  });

  gameCloseBtn.addEventListener('click', closeGame);

  gameClearBtn.addEventListener('click', function () {
    gameBodies = [];
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    updateHud();
  });

  if (bhMinusBtn) {
    bhMinusBtn.addEventListener('click', function () {
      if (gameBlackHoleCount > 1) {
        gameBlackHoleCount--;
        gameBlackHoles = placeBlackHolesForCount(gameBlackHoleCount, gameCanvas.width, gameCanvas.height);
        updateHud();
      }
    });
  }

  if (bhPlusBtn) {
    bhPlusBtn.addEventListener('click', function () {
      if (gameBlackHoleCount < 4) {
        gameBlackHoleCount++;
        gameBlackHoles = placeBlackHolesForCount(gameBlackHoleCount, gameCanvas.width, gameCanvas.height);
        updateHud();
      }
    });
  }

  gameCanvas.addEventListener('click', function (e) {
    if (!gameActive || gameBodies.length >= GAME_MAX_BODIES) return;
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const body = launchBody(x, y, gameBlackHoles, 3.5);
    body.color = gameGetColor();
    gameBodies.push(body);
  });

  gameCanvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (!gameActive || gameBodies.length >= GAME_MAX_BODIES) return;
    const rect = gameCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const body = launchBody(x, y, gameBlackHoles, 3.5);
    body.color = gameGetColor();
    gameBodies.push(body);
  }, { passive: false });

  window.addEventListener('resize', function () {
    if (gameActive) {
      gameResizeCanvas();
    }
  });

  // Hide game button when scrolled past landing
  window.addEventListener('scroll', function () {
    if (gameBtn) {
      const scrollY = window.scrollY;
      gameBtn.style.opacity = Math.max(0, 1 - scrollY / 200);
      gameBtn.style.pointerEvents = scrollY > 200 ? 'none' : 'auto';
    }
  });

}());
