/* ============================================================
   THEME.JS — Dark/light mode toggle
   localStorage persistence + system preference detection
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-theme';
  var html = document.documentElement;

  // ── Detect initial theme ───────────────────────────────────
  function getInitialTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // System preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // ── Apply theme ────────────────────────────────────────────
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    updateToggleIcons(theme);

    // Notify orbit simulation
    if (typeof window.orbitUpdateTheme === 'function') {
      window.orbitUpdateTheme();
    }
  }

  // ── Update toggle icons ────────────────────────────────────
  function updateToggleIcons(theme) {
    var toggles = document.querySelectorAll('.theme-toggle, .nav-theme-toggle');
    toggles.forEach(function (btn) {
      btn.textContent = theme === 'dark' ? '☀' : '☾';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // ── Toggle ─────────────────────────────────────────────────
  function toggleTheme() {
    var current = html.classList.contains('dark') ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // ── Attach listeners ──────────────────────────────────────
  function attachListeners() {
    var toggles = document.querySelectorAll('.theme-toggle, .nav-theme-toggle');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    var theme = getInitialTheme();
    applyTheme(theme);
    attachListeners();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
