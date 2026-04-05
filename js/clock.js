/* ============================================================
   CLOCK.JS — 8-bit live clock and temperature widget
   ============================================================ */

(function () {
  'use strict';

  var clockTimeEl = document.getElementById('clock-time');
  var clockTempEl = document.getElementById('clock-temp');

  if (!clockTimeEl) return;

  // ── Clock ──────────────────────────────────────────────────
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateClock() {
    var now = new Date();
    var h = pad(now.getHours());
    var m = pad(now.getMinutes());
    var s = pad(now.getSeconds());
    clockTimeEl.textContent = h + ':' + m + ':' + s;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ── Temperature ────────────────────────────────────────────
  function fetchTemperature(lat, lng) {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + '&current_weather=true';
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.current_weather && typeof data.current_weather.temperature === 'number') {
          var temp = Math.round(data.current_weather.temperature);
          if (clockTempEl) clockTempEl.textContent = '🌡 ' + temp + '°C';
        }
      })
      .catch(function () {
        /* keep showing --°C on error */
      });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        fetchTemperature(pos.coords.latitude, pos.coords.longitude);
      },
      function () {
        /* geolocation denied — keep --°C */
      },
      { timeout: 8000 }
    );
  }

}());
