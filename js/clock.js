/* ============================================================
   CLOCK.JS — Minimal live clock + weather temperature
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

  // ── Weather temperature ──────────────────────────────────
  var tempEl = document.getElementById('temp-nav');
  if (tempEl) {
    function getWeatherByCoords(lat, lon) {
      fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=' + lat +
        '&longitude=' + lon + '&current_weather=true'
      )
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.current_weather) {
            var temp = Math.round(data.current_weather.temperature);
            tempEl.textContent = '🌡 ' + temp + '°C';
          }
        })
        .catch(function () {});
    }

    function fetchWeatherByIP() {
      fetch('https://ipapi.co/json/')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.latitude && data.longitude) {
            getWeatherByCoords(data.latitude, data.longitude);
          }
        })
        .catch(function () {});
    }

    function fetchWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          },
          fetchWeatherByIP,
          { timeout: 5000 }
        );
      } else {
        fetchWeatherByIP();
      }
    }

    fetchWeather();
    // Refresh every 30 minutes
    setInterval(fetchWeather, 30 * 60 * 1000);
  }
}());
