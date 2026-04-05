/* ============================================================
   ORBIT.JS — Full orbit simulation
   Physics, trails, auto-launch, click-to-launch, resize, theme
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('orbit-canvas');
  if (!canvas) return;

  // Disable on mobile
  if (window.innerWidth < 768) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');

  // ── Constants ──────────────────────────────────────────────
  const G = 5000;
  const MAX_VELOCITY = 12;
  const BODY_RADIUS = 4;
  const BLACKHOLE_RADIUS = 8;
  const ABSORPTION_DISTANCE = 10;
  const ESCAPE_MARGIN = 200;

  let TRAIL_LENGTH = 80;

  const COLORS = {
    dark: ['#8B5CF6', '#FACC15', '#F5F5F5'],
    light: ['#7C3AED', '#F97316', '#111111']
  };

  const AUTO_LAUNCHES = [
    { x: 0.2,  y: 0.3,  vx: 2.5,  vy: 1.5  },
    { x: 0.8,  y: 0.6,  vx: -2.0, vy: -1.8 },
    { x: 0.5,  y: 0.1,  vx: 1.0,  vy: 3.0  },
    { x: 0.15, y: 0.7,  vx: 3.0,  vy: -1.0 },
  ];

  // ── State ──────────────────────────────────────────────────
  let blackHoles = [];
  let bodies = [];
  let animFrameId = null;
  let currentTheme = 'light';
  let colorIndex = 0;

  // ── Init canvas size ───────────────────────────────────────
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    placeBlackHoles();
    // Clear bodies on resize — acceptable per spec
    bodies = [];
    autoLaunch();
  }

  // ── Black hole placement ───────────────────────────────────
  function placeBlackHoles() {
    blackHoles = [
      { x: canvas.width * 0.38, y: canvas.height * 0.45 },
      { x: canvas.width * 0.65, y: canvas.height * 0.52 }
    ];
  }

  // ── Theme helpers ──────────────────────────────────────────
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  function getBgColor() {
    return getTheme() === 'dark' ? '31, 31, 31' : '245, 242, 235';
  }

  function getTextColor() {
    return getTheme() === 'dark' ? '#F5F5F5' : '#2C2C2C';
  }

  function getRandomColor() {
    const theme = getTheme();
    const palette = COLORS[theme];
    const color = palette[colorIndex % palette.length];
    colorIndex++;
    return color;
  }

  // ── Body factory ───────────────────────────────────────────
  function createBody(x, y, vx, vy) {
    return {
      x,
      y,
      vx,
      vy,
      color: getRandomColor(),
      trail: []
    };
  }

  // ── Auto-launch ────────────────────────────────────────────
  function autoLaunch() {
    AUTO_LAUNCHES.forEach(function (cfg) {
      bodies.push(createBody(
        cfg.x * canvas.width,
        cfg.y * canvas.height,
        cfg.vx,
        cfg.vy
      ));
    });
  }

  // ── Click / touch to launch ────────────────────────────────
  function launchFromEvent(clientX, clientY) {
    const x = clientX;
    const y = clientY;

    // Find nearest black hole
    let nearest = blackHoles[0];
    let minDist = Infinity;
    blackHoles.forEach(function (bh) {
      const d = Math.hypot(bh.x - x, bh.y - y);
      if (d < minDist) {
        minDist = d;
        nearest = bh;
      }
    });

    // Direction toward nearest black hole + 0.6 radian offset
    const angle = Math.atan2(nearest.y - y, nearest.x - x) + 0.6;
    const speed = 3.5;
    bodies.push(createBody(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed));
  }

  canvas.addEventListener('click', function (e) {
    if (bodies.length < MAX_BODIES) {
      launchFromEvent(e.clientX, e.clientY);
    }
  });

  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (bodies.length < MAX_BODIES) {
      const touch = e.touches[0];
      launchFromEvent(touch.clientX, touch.clientY);
    }
  }, { passive: false });

  // ── Game Mode ──────────────────────────────────────────────
  const MAX_BODIES = 14;
  let blackHoleCount = 2;

  function placeBlackHolesForCount(count) {
    const w = canvas.width;
    const h = canvas.height;
    if (count === 1) {
      blackHoles = [{ x: w * 0.5, y: h * 0.5 }];
    } else if (count === 2) {
      blackHoles = [
        { x: w * 0.38, y: h * 0.45 },
        { x: w * 0.65, y: h * 0.52 }
      ];
    } else if (count === 3) {
      blackHoles = [
        { x: w * 0.5,  y: h * 0.28 },
        { x: w * 0.3,  y: h * 0.62 },
        { x: w * 0.7,  y: h * 0.62 }
      ];
    } else {
      blackHoles = [
        { x: w * 0.35, y: h * 0.35 },
        { x: w * 0.65, y: h * 0.35 },
        { x: w * 0.35, y: h * 0.65 },
        { x: w * 0.65, y: h * 0.65 }
      ];
    }
  }

  const gameBtn = document.getElementById('game-btn');
  const gamePanel = document.getElementById('game-panel');
  const gamePanelClose = document.getElementById('game-panel-close');
  const bhMinus = document.getElementById('bh-minus');
  const bhPlus = document.getElementById('bh-plus');
  const bhCountEl = document.getElementById('bh-count');
  const bodyCountEl = document.getElementById('body-count');
  const gameClearBtn = document.getElementById('game-clear-btn');

  function updateBodyCountDisplay() {
    if (bodyCountEl) bodyCountEl.textContent = bodies.length;
  }

  function updateBhCountDisplay() {
    if (bhCountEl) bhCountEl.textContent = blackHoleCount;
    if (bhMinus) bhMinus.disabled = blackHoleCount <= 1;
    if (bhPlus) bhPlus.disabled = blackHoleCount >= 4;
  }

  if (gameBtn) {
    gameBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = gamePanel.classList.contains('open');
      if (isOpen) {
        gamePanel.classList.remove('open');
        gamePanel.setAttribute('aria-hidden', 'true');
      } else {
        gamePanel.classList.add('open');
        gamePanel.setAttribute('aria-hidden', 'false');
        updateBhCountDisplay();
        updateBodyCountDisplay();
      }
    });
  }

  if (gamePanelClose) {
    gamePanelClose.addEventListener('click', function () {
      gamePanel.classList.remove('open');
      gamePanel.setAttribute('aria-hidden', 'true');
    });
  }

  if (bhMinus) {
    bhMinus.addEventListener('click', function () {
      if (blackHoleCount > 1) {
        blackHoleCount--;
        placeBlackHolesForCount(blackHoleCount);
        updateBhCountDisplay();
      }
    });
  }

  if (bhPlus) {
    bhPlus.addEventListener('click', function () {
      if (blackHoleCount < 4) {
        blackHoleCount++;
        placeBlackHolesForCount(blackHoleCount);
        updateBhCountDisplay();
      }
    });
  }

  if (gameClearBtn) {
    gameClearBtn.addEventListener('click', function () {
      bodies = [];
      autoLaunch();
      updateBodyCountDisplay();
    });
  }

  // Hide game button when scrolled past landing
  window.addEventListener('scroll', function () {
    if (gameBtn) {
      const scrollY = window.scrollY;
      gameBtn.style.opacity = Math.max(0, 1 - scrollY / 200);
      gameBtn.style.pointerEvents = scrollY > 200 ? 'none' : 'auto';
    }
    if (gamePanel && window.scrollY > 200) {
      gamePanel.classList.remove('open');
      gamePanel.setAttribute('aria-hidden', 'true');
    }
  });

  // ── Physics update ─────────────────────────────────────────
  function updateBodies() {
    bodies = bodies.filter(function (body) {
      // Update trail
      body.trail.push({ x: body.x, y: body.y });
      if (body.trail.length > TRAIL_LENGTH) {
        body.trail.shift();
      }

      // Apply gravity from each black hole
      let ax = 0;
      let ay = 0;
      let absorbed = false;

      blackHoles.forEach(function (bh) {
        const dx = bh.x - body.x;
        const dy = bh.y - body.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ABSORPTION_DISTANCE) {
          absorbed = true;
          return;
        }

        const force = G / (distance * distance);
        ax += force * (dx / distance);
        ay += force * (dy / distance);
      });

      if (absorbed) return false;

      body.vx += ax;
      body.vy += ay;

      // Clamp velocity
      body.vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, body.vx));
      body.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, body.vy));

      body.x += body.vx;
      body.y += body.vy;

      // Remove if escaped canvas
      if (
        body.x < -ESCAPE_MARGIN || body.x > canvas.width + ESCAPE_MARGIN ||
        body.y < -ESCAPE_MARGIN || body.y > canvas.height + ESCAPE_MARGIN
      ) {
        return false;
      }

      return true;
    });
  }

  // ── Draw ───────────────────────────────────────────────────
  function draw() {
    // Partial clear for trail effect
    ctx.fillStyle = 'rgba(' + getBgColor() + ', 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw black holes
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

    // Draw bodies and trails
    bodies.forEach(function (body) {
      if (body.trail.length < 2) return;

      // Draw trail
      for (let i = 1; i < body.trail.length; i++) {
        const opacity = i / body.trail.length;
        ctx.beginPath();
        ctx.moveTo(body.trail[i - 1].x, body.trail[i - 1].y);
        ctx.lineTo(body.trail[i].x, body.trail[i].y);
        ctx.strokeStyle = hexToRgba(body.color, opacity * 0.9);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw body
      ctx.beginPath();
      ctx.arc(body.x, body.y, BODY_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();
    });
  }

  // ── Animation loop ─────────────────────────────────────────
  function animate() {
    updateBodies();
    draw();
    updateBodyCountDisplay();
    animFrameId = requestAnimationFrame(animate);
  }

  // ── Utility: hex to rgba ───────────────────────────────────
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  // ── Scroll: fade canvas ────────────────────────────────────
  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    const opacity = Math.max(0, 1 - scrollY / 200);
    canvas.style.opacity = opacity;
    canvas.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
  });

  // ── Resize ─────────────────────────────────────────────────
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth < 768) {
        canvas.style.display = 'none';
        if (animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      } else {
        canvas.style.display = '';
        resizeCanvas();
        if (!animFrameId) {
          animate();
        }
      }
    }, 150);
  });

  // ── Theme update hook ──────────────────────────────────────
  // Called from theme.js after toggle
  window.orbitUpdateTheme = function () {
    currentTheme = getTheme();
    // Existing bodies keep color, new bodies will pick from updated palette
  };

  // ── Start ──────────────────────────────────────────────────
  resizeCanvas();
  animate();

}());
