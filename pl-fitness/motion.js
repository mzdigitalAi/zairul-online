/* PL Fitness motion layer: decorates each screen after app.js renders it (stagger order, direction, counters, nav indicator, ripple). */
(function () {
  'use strict';
  const app = document.getElementById('app'); if (!app) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastScreen = null, lastRoute = '', prevIdx = -1; const stack = [];

  function direction(route) {
    const i = stack.lastIndexOf(route);
    if (i >= 0 && i === stack.length - 2) { stack.pop(); return 'back'; }
    if (stack[stack.length - 1] !== route) stack.push(route);
    return 'fwd';
  }

  function countUp(el) {   // animates a leading number such as 6,420 or 445 while keeping any unit markup
    const n = el.firstChild; if (!n || n.nodeType !== 3) return;
    const m = n.nodeValue.match(/^(\s*)(\d[\d,]*)(\D.*|)$/s); if (!m || /^[-–]/.test(m[3])) return;
    const to = parseInt(m[2].replace(/,/g, ''), 10); if (!to || to < 2) return;
    const comma = m[2].indexOf(',') > -1, t0 = performance.now(), d = 1300;
    (function tick(t) {
      const k = Math.min(1, (t - t0) / d), v = Math.round(to * (1 - Math.pow(1 - k, 4)));
      n.nodeValue = m[1] + (comma ? v.toLocaleString('en-US') : v) + m[3];
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function decorate(scr) {
    const route = location.hash || '#splash', same = route === lastRoute;
    lastRoute = route;
    if (same) { scr.classList.add('static'); }   // state change on the same screen (tab, chip, stepper): no replay
    else { scr.classList.add(direction(route) === 'back' ? 'go-back' : 'go-fwd'); }
    // stagger order for direct children and for list-like items
    let i = 0; Array.prototype.forEach.call(scr.children, c => { c.style.setProperty('--i', Math.min(i++, 12)); });
    let k = 0; scr.querySelectorAll('.list-item,.menu,.price,.opt,.card').forEach(c => { if (c.parentNode !== scr) c.style.setProperty('--i', Math.min(4 + k++, 14)); });
    if (!same && !reduce) scr.querySelectorAll('.stat b').forEach(countUp);
    // splash extras: halo rings + loader
    const ctr = scr.querySelector('.center');
    if (ctr && /^#splash$|^$/.test(route) && ctr.querySelector('.logo.xl')) {
      ctr.classList.add('splash');
      ['a', 'b', 'c'].forEach(c => { const h = document.createElement('span'); h.className = 'halo ' + c; ctr.insertBefore(h, ctr.firstChild); });
      const l = document.createElement('div'); l.className = 'load'; l.innerHTML = '<i></i>'; ctr.appendChild(l);
    }
    // timer glow while running
    const tb = app.querySelector('#tbtn'), ring = app.querySelector('#ring');
    if (tb && ring) new MutationObserver(() => ring.classList.toggle('running', /Pause/.test(tb.textContent))).observe(tb, { childList: true, characterData: true, subtree: true });
  }

  let faceTimer = 0;
  function faces(scr) {   // cross-fade trainer close-ups (assets/trainers/*); gym photo stays if none exist
    clearInterval(faceTimer);
    const box = scr && scr.querySelector('.faces'); if (!box) return;
    const tag = box.querySelector('.ftag'); let i = 0;
    const show = () => {
      const imgs = Array.prototype.slice.call(box.querySelectorAll('img'));
      const list = imgs.length > 1 ? imgs.slice(1) : imgs; if (!list.length) return;
      imgs.forEach(im => im.classList.remove('on'));
      const cur = list[i++ % list.length]; cur.classList.add('on');
      if (cur.dataset.name) { tag.textContent = cur.dataset.name; box.classList.add('tagged'); } else box.classList.remove('tagged');
    };
    setTimeout(show, 500);
    if (!reduce) faceTimer = setInterval(() => { if (document.body.contains(box)) show(); else clearInterval(faceTimer); }, 4200);
  }

  function navIndicator() {
    const nav = app.querySelector('.nav'); if (!nav || nav.querySelector('.ind')) return;
    const idx = Array.prototype.findIndex.call(nav.querySelectorAll('button'), b => b.classList.contains('on'));
    const ind = document.createElement('span'); ind.className = 'ind'; ind.setAttribute('aria-hidden', 'true'); nav.insertBefore(ind, nav.firstChild);
    nav.style.setProperty('--idx', prevIdx < 0 ? Math.max(idx, 0) : prevIdx);
    requestAnimationFrame(() => requestAnimationFrame(() => nav.style.setProperty('--idx', Math.max(idx, 0))));
    if (idx >= 0) prevIdx = idx;
  }

  if (!reduce) {
    new MutationObserver(() => {
      const scr = app.querySelector('.screen');
      navIndicator();
      if (!scr || scr === lastScreen) return;
      lastScreen = scr; decorate(scr); faces(scr);
    }).observe(app, { childList: true });
    { const first = app.querySelector('.screen'); if (first && !lastScreen) { lastScreen = first; navIndicator(); decorate(first); faces(first); } }   // screen rendered before this script loaded

    // tactile ripple on press
    app.addEventListener('pointerdown', e => {
      const t = e.target.closest('.btn,.list-item,.menu,.opt,.chip,.price,.icon-btn,.seg button'); if (!t) return;
      const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, rp = document.createElement('span');
      rp.className = 'ripple'; rp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      t.appendChild(rp); setTimeout(() => rp.remove(), 800);
    }, { passive: true });

    // slider value pulse
    app.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.range) { const v = app.querySelector('#v'); if (v) { v.classList.remove('tick'); void v.offsetWidth; v.classList.add('tick'); } } });
  }
})();
