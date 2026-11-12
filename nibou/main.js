(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var F = window.Jelly ? Jelly.FLAVOURS : [];
  function css(c) { return 'rgb(' + c.map(function (v) { return Math.round(v * 255); }).join(',') + ')'; }

  /* ---------- nav ---------- */
  var nav = $('#nav'); function navState() { nav.classList.toggle('solid', scrollY > 40); } navState(); addEventListener('scroll', navState, { passive: true });

  /* ---------- jelly hero ---------- */
  var track = $('#track'), hero = $('#hero'), canvas = $('#gl'), outline = $('#outline'), flabName = $('#flabName'), dotsBox = $('#dots'), hint = $('#hint');
  var ok = window.Jelly && Jelly.init(canvas, { reduce: reduce, maxDpr: innerWidth < 760 ? 1.5 : 2 });
  if (!ok) document.documentElement.classList.add('nogl');
  var bExplore = $('#bExplore'), bNum = $('#bNum'), bDesc = $('#bDesc'), blogos = $$('#blogos .bl');
  var cur = -1, dots = [];
  F.forEach(function (f, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'dot'; b.style.setProperty('--c', css(f.c1)); b.setAttribute('aria-label', f.n); b.title = f.n;
    var lg = document.createElement('img'); lg.src = 'assets/brands/' + f.key + '-logo.svg'; lg.alt = ''; lg.setAttribute('aria-hidden', 'true'); b.appendChild(lg);
    b.addEventListener('click', function () { goTo(i); }); dotsBox.appendChild(b); dots.push(b);
  });
  function setFlavour(i, animate) {
    if (i === cur) return; cur = i; var f = F[i];
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.setAttribute('aria-pressed', k === i); });
    document.documentElement.style.setProperty('--jc', css(f.c1));
    hero.style.setProperty('--b2', f.bg[0]); hero.style.setProperty('--b1', f.bg[1]); hero.style.setProperty('--b0', f.bg[2]);
    blogos.forEach(function (l, k) { l.classList.toggle('on', k === i); }); hero.setAttribute('data-hl', f.hl || 'gold');
    var M = window.NMotion;
    bNum.textContent = 'Brand ' + (i + 1) + ' of ' + F.length; bExplore.href = 'concept/' + f.key + '/';
    if (M) { M.label(bExplore, 'Explore ' + f.n); M.tick(bNum); } else bExplore.textContent = 'Explore ' + f.n;
    if (ok) { Jelly.setFlavour(i); if (animate !== false) Jelly.kick(); }
    outline.classList.add('swap'); bDesc.classList.add('swap');
    setTimeout(function () {
      flabName.textContent = f.n;
      if (M) { M.letters(outline, f.n.toUpperCase()); M.words(bDesc, f.desc); } else { outline.textContent = f.n.toUpperCase(); bDesc.textContent = f.desc.replace(/\*/g, ''); }
      outline.classList.remove('swap'); bDesc.classList.remove('swap');
    }, reduce ? 0 : 220);
    document.dispatchEvent(new CustomEvent('brandchange', { detail: { i: i, brand: f } }));
  }
  function span() { return Math.max(1, track.offsetHeight - innerHeight); }
  function goTo(i) { var y = track.offsetTop + (i + 1.5) / (F.length + 1) * span(); scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); setFlavour(i); }
  var lastP = 0, firstRun = true;
  function onScroll() {
    var p = Math.max(0, Math.min(0.9999, (scrollY - track.offsetTop) / span())); if (scrollY < track.offsetTop) p = 0;
    var vel = p - lastP; lastP = p; if (ok) Jelly.setScroll(p, vel * 40);
    var idx = Math.floor(p * (F.length + 1)), fin = idx === 0; if (firstRun) { firstRun = false; if (fin && !reduce) setTimeout(function () { hero.classList.add('fin'); }, 150); else hero.classList.toggle('fin', fin); } else hero.classList.toggle('fin', fin); if (ok) Jelly.setFinale(fin); if (!fin) setFlavour(idx - 1, true);
    var bg = fin ? ['#c23a82', '#AC266B', '#96215E'] : F[Math.max(0, idx - 1)].bg; hero.style.setProperty('--b2', bg[0]); hero.style.setProperty('--b1', bg[1]); hero.style.setProperty('--b0', bg[2]); if (p > 0.04) hint.style.opacity = 0; else hint.style.opacity = .85;
    document.dispatchEvent(new CustomEvent('heroscroll', { detail: { p: p, idx: idx, fin: fin, frac: p * (F.length + 1) - idx, bg: bg } }));
  }
  addEventListener('scroll', onScroll, { passive: true }); setFlavour(0, false); onScroll();
  if (ok && 'IntersectionObserver' in window) new IntersectionObserver(function (e) { Jelly.setActive(e[0].isIntersecting); }, { threshold: 0 }).observe(track);
  addEventListener('pointermove', function (e) { if (ok && !reduce) Jelly.setPointer(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5); }, { passive: true });

  /* ---------- reveal ---------- */
  var rv = $$('.reveal'); rv.forEach(function (el, i) { el.style.setProperty('--rd', ((i % 3) * 0.08) + 's'); });
  if ('IntersectionObserver' in window && !reduce) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' }); rv.forEach(function (el) { io.observe(el); }); } else rv.forEach(function (el) { el.classList.add('in'); });
  /* safety net: anything already above the fold line is shown even if the observer missed it (fast anchor jumps) */
  function sweep() { rv.forEach(function (el) { if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight * 0.92) el.classList.add('in'); }); } addEventListener('scroll', sweep, { passive: true }); sweep();

  /* ---------- 3D tilt on cards and tiles ---------- */
  if (!reduce && matchMedia('(hover:hover)').matches) $$('.tilt').forEach(function (el) {
    el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = 'perspective(900px) rotateX(' + (-y * 12) + 'deg) rotateY(' + (x * 12) + 'deg) translateY(-6px)'; });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  });

  /* ---------- number count-up ---------- */
  var nums = $$('.nums b');
  function featCount(el) {
    var feat = el.closest('.feat'), to = +el.dataset.n, final = to.toLocaleString('en-US'), box = $('.ftype', feat), txt = box.dataset.text;
    function typeIt() { var i = 0; box.textContent = ''; var cur = document.createElement('span'); cur.className = 'fcur'; cur.setAttribute('aria-hidden', 'true'); box.appendChild(cur); var tn = document.createTextNode(''); box.insertBefore(tn, cur); (function t() { if (i <= txt.length) { tn.nodeValue = txt.slice(0, i++); setTimeout(t, 26); } else feat.classList.add('typed'); })(); }
    if (reduce) { el.textContent = final; return; }
    el.setAttribute('aria-label', final); box.setAttribute('aria-label', txt);
    el.style.minWidth = el.getBoundingClientRect().width + 'px'; el.textContent = '0'; feat.classList.add('counting'); box.textContent = '';
    var t0 = performance.now(), D = 2800;
    (function step(now) {
      var t = Math.min(1, (now - t0) / D), e = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t), v = Math.round(to * e);
      el.textContent = v.toLocaleString('en-US'); var bl = (1 - e) * (1 - e) * 7; el.style.filter = 'blur(' + bl.toFixed(2) + 'px)'; el.style.transform = 'scale(' + (0.92 + 0.08 * e).toFixed(4) + ')';
      if (t < 1) requestAnimationFrame(step); else { el.textContent = final; el.style.filter = ''; el.style.transform = ''; el.parentNode.classList.add('landed'); feat.classList.add('counted'); setTimeout(typeIt, 250); }
    })(t0);
  }
  function count(el) {
    if (el.closest('.feat')) return featCount(el);
    var final = (+el.dataset.n).toLocaleString('en-US') + (el.dataset.suf ? ' ' + el.dataset.suf : '');
    if (reduce) { el.textContent = final; return; }
    el.setAttribute('aria-label', final); el.textContent = '';
    var odo = document.createElement('span'); odo.className = 'odo'; odo.setAttribute('aria-hidden', 'true'); el.appendChild(odo);
    var cols = [], k = 0;
    final.split('').forEach(function (ch) {
      if (!/\d/.test(ch)) { var sep = document.createElement('span'); sep.className = 'odsep'; sep.textContent = ch === ' ' ? '\u00a0' : ch; odo.appendChild(sep); return; }
      var col = document.createElement('span'), strip = document.createElement('span'), s = ''; col.className = 'odc'; strip.className = 'ods';
      for (var c = 0; c < 4; c++) for (var d = 0; d < 10; d++) s += '<i>' + d + '</i>';
      strip.innerHTML = s; col.appendChild(strip); odo.appendChild(col); cols.push({ strip: strip, d: +ch, k: k++ });
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      cols.forEach(function (c) { c.strip.style.transitionDuration = (1.5 + c.k * 0.22) + 's'; c.strip.style.transitionDelay = (c.k * 0.07) + 's'; c.strip.style.transform = 'translateY(' + (-(30 + c.d) * 2.5) + '%)'; });
      el.classList.add('go'); if (el.parentElement) el.parentElement.classList.add('counted');
    }); });
  }  if ('IntersectionObserver' in window) { var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); io2.unobserve(e.target); } }); }, { threshold: .6 }); nums.forEach(function (n) { io2.observe(n); }); }
})();
