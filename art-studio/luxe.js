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
  var art = document.getElementById('lxArt');
  if (art && !reduce) { var tick = false; window.addEventListener('scroll', function () { if (tick) return; tick = true; requestAnimationFrame(function () { art.style.transform = 'scale(1.06) translate3d(0,' + Math.min(40, window.scrollY * .06).toFixed(1) + 'px,0)'; tick = false; }); }, { passive: true }); }
})();
