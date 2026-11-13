/* Golden-hour theme extras: preview tilt and glare, live numbers in the hero, a slow drift on the hero picture. No libraries. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stats = document.getElementById('lxStats');
  if (stats && typeof STYLES !== 'undefined') {
    var val = { styles: STYLES.length, types: TYPES.filter(function (t) { return !t.hidden; }).length, decks: typeof DECK_LOOKS !== 'undefined' ? DECK_LOOKS.length : 101 };
    Array.prototype.forEach.call(stats.querySelectorAll('b[data-k]'), function (b) {
      var to = val[b.dataset.k] || +b.textContent || 0; if (reduce) { b.textContent = to; return; }
      var t0 = null, step = function (ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1100), e = 1 - Math.pow(1 - p, 3); b.textContent = Math.round(to * e); if (p < 1) requestAnimationFrame(step); };
      b.textContent = '0'; requestAnimationFrame(step);
    });
  }
  var stage = document.getElementById('stage'), cv = document.getElementById('canvas');
  if (stage && cv && !reduce && window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      x = Math.max(-.7, Math.min(.7, x)); y = Math.max(-.7, Math.min(.7, y));
      cv.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg'); cv.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      cv.style.setProperty('--gx', ((x + .5) * 100).toFixed(1) + '%'); cv.style.setProperty('--gy', ((y + .5) * 100).toFixed(1) + '%');
    });
    stage.addEventListener('pointerleave', function () { cv.style.setProperty('--ry', '0deg'); cv.style.setProperty('--rx', '0deg'); cv.style.setProperty('--gx', '30%'); cv.style.setProperty('--gy', '0%'); });
  }
  /* light glass theme switch (remembered in this browser) */
  var sw = document.getElementById('themeSw'), root = document.documentElement, tc = document.querySelector('meta[name="theme-color"]');
  var setTheme = function (light) { if (light) root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme'); if (sw) sw.setAttribute('aria-checked', light ? 'true' : 'false'); if (tc) tc.content = light ? '#eef0f8' : '#0b0806'; try { localStorage.setItem('zas_theme', light ? 'light' : 'dark'); } catch (e) {} };
  if (sw) { sw.setAttribute('aria-checked', root.getAttribute('data-theme') === 'light' ? 'true' : 'false'); sw.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') !== 'light'); }); }
  /* show "Log out" only when the studio login is switched on and you are signed in */
  var lo = document.getElementById('logoutBtn');
  if (lo && window.fetch && location.protocol === 'https:') fetch('/art-studio/__auth/', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.signedIn) lo.hidden = false; }).catch(function () {});
  var art = document.getElementById('lxArt');
  if (art && !reduce) { var tick = false; window.addEventListener('scroll', function () { if (tick) return; tick = true; requestAnimationFrame(function () { art.style.transform = 'scale(1.06) translate3d(0,' + Math.min(40, window.scrollY * .06).toFixed(1) + 'px,0)'; tick = false; }); }, { passive: true }); }
})();
