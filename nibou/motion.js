/* Motion layer v2 for the Nibou concept homepage (pairs with motion.css). No libraries.
   main.js and fruits.js keep doing the hero engine; this file adds the extra polish and listens to two events
   main.js sends: "heroscroll" (every scroll) and "brandchange" (when the brand in the hero changes). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  function el(tag, cls, parent, first) { var e = document.createElement(tag); if (cls) e.className = cls; e.setAttribute('aria-hidden', 'true'); if (parent) { if (first) parent.insertBefore(e, parent.firstChild); else parent.appendChild(e); } return e; }
  function restart(e, cls) { e.classList.remove(cls); void e.offsetWidth; e.classList.add(cls); }

  /* text helpers used by main.js when the brand changes */
  var API = window.NMotion = {
    letters: function (node, text) { if (reduce) { node.textContent = text; return; } node.textContent = ''; text.split('').forEach(function (ch, i) { var s = document.createElement('span'); s.className = 'ol'; s.style.setProperty('--i', i); s.textContent = ch === ' ' ? ' ' : ch; node.appendChild(s); }); },
    /* words rise in one by one; *marked* words or phrases get a highlighter stroke drawn behind them */
    words: function (node, text) {
      if (reduce) { node.textContent = text.replace(/\*/g, ''); return; }
      node.textContent = ''; node.setAttribute('aria-label', text.replace(/\*/g, ''));
      (text.match(/\*[^*]+\*[.,;!?]*|\S+/g) || []).forEach(function (w, i) {
        var s = document.createElement('span'); s.className = 'wd'; s.setAttribute('aria-hidden', 'true'); s.style.setProperty('--i', i);
        var m = /^\*([^*]+)\*(.*)$/.exec(w);
        if (m) { var h = document.createElement('span'); h.className = 'hl'; h.textContent = m[1]; s.appendChild(h); if (m[2]) s.appendChild(document.createTextNode(m[2])); } else s.textContent = w;
        node.appendChild(s); node.appendChild(document.createTextNode(' '));
      });
    },
    label: function (node, text) { node.textContent = ''; var s = document.createElement('span'); s.className = 'tk'; s.textContent = text; node.appendChild(s); if (!reduce) restart(node, 'tick'); },
    tick: function (node) { if (!reduce) restart(node, 'tick'); }
  };
  if (reduce) return;
  document.documentElement.classList.add('mo');

  /* ---------- page progress bar + nav scroll-spy ---------- */
  var sprog = el('div', 'sprog', document.body);
  function prog() { var h = document.documentElement.scrollHeight - innerHeight; sprog.style.setProperty('--sp', h > 0 ? Math.min(1, scrollY / h) : 0); }
  addEventListener('scroll', prog, { passive: true }); prog();
  var links = $$('.nav nav a'), map = {};
  links.forEach(function (a) { var id = (a.getAttribute('href') || '').slice(1); if (id) map[id] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove('cur'); }); if (map[e.target.id]) map[e.target.id].classList.add('cur'); } }); }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    var tr = $('#track'); if (tr) new IntersectionObserver(function (es) { if (es[0].isIntersecting) links.forEach(function (a) { a.classList.remove('cur'); }); }, { rootMargin: '-45% 0px -50% 0px' }).observe(tr);
  }

  /* ---------- hero extras ---------- */
  var hero = $('#hero'), outline = $('#outline'), dotsBox = $('#dots');
  if (hero) {
    var wipe = el('div', 'hwipe', hero, true), burst = el('div', 'hburst', hero, true); el('div', 'hspot', hero, true);
    var ringA = el('div', 'hring', hero), ringB = el('div', 'hring b', hero);
    wipe.addEventListener('animationend', function () { wipe.classList.remove('go'); });
    [ringA, ringB].forEach(function (r) { r.addEventListener('animationend', function () { r.classList.remove('go'); }); });
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var t = 0; t < 16; t++) { var s = el('i', 'tw', hero); s.style.setProperty('--x', (4 + rnd() * 92) + '%'); s.style.setProperty('--y', (10 + rnd() * 76) + '%'); s.style.setProperty('--s', (8 + rnd() * 16) + 'px'); s.style.setProperty('--d', (2.6 + rnd() * 3) + 's'); s.style.setProperty('--dl', (-rnd() * 5) + 's'); }
    var lastBg = '', first = true;
    document.addEventListener('heroscroll', function (e) {
      var d = e.detail, key = d.bg.join('');
      if (outline) outline.style.setProperty('--ox', ((d.frac - .5) * -150).toFixed(1) + 'px');
      if (dotsBox) dotsBox.style.setProperty('--dp', d.fin ? 0 : d.frac.toFixed(3));
      if (key !== lastBg) {
        lastBg = key;
        if (!first) { wipe.style.setProperty('--w2', d.bg[0]); wipe.style.setProperty('--w1', d.bg[1]); wipe.style.setProperty('--w0', d.bg[2]); restart(wipe, 'go'); if (!d.fin) { restart(ringA, 'go'); restart(ringB, 'go'); } }
        first = false;
      }
    });
    if (fine) { var mx = 0, my = 0, q = false; hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; if (!q) { q = true; requestAnimationFrame(function () { q = false; hero.style.setProperty('--mx', mx + 'px'); hero.style.setProperty('--my', my + 'px'); }); } }, { passive: true }); }
  }

  /* ---------- brand-name marquee (speeds up while you scroll) ---------- */
  var brands = $('#brands'), F = (window.Jelly && Jelly.FLAVOURS) || [];
  if (brands && F.length) {
    var mq = el('div', 'mq', brands, true), mqt = el('div', 'mqt', mq), star = '<svg viewBox="0 0 60 60"><path d="M30 0 L37 23 L60 30 L37 37 L30 60 L23 37 L0 30 L23 23Z"/></svg>', html = '';
    for (var rep = 0; rep < 4; rep++) F.forEach(function (f, i) { html += '<span' + (i % 2 ? ' class="o"' : '') + '>' + f.n + '</span>' + star; });
    mqt.innerHTML = html;
    if (mqt.animate) {
      var an = mqt.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 38000, iterations: Infinity }), rate = 1, target = 1, lastY = scrollY, run = false;
      var loop = function () { rate += (target - rate) * .12; target += (1 - target) * .08; an.playbackRate = rate; if (Math.abs(rate - 1) > .01 || Math.abs(target - 1) > .01) requestAnimationFrame(loop); else { run = false; an.playbackRate = 1; } };
      addEventListener('scroll', function () { var dy = Math.abs(scrollY - lastY); lastY = scrollY; target = Math.min(7, 1 + dy / 10); if (!run) { run = true; requestAnimationFrame(loop); } }, { passive: true });
    }
  }

  /* ---------- headings: split into words that rise out of a mask ---------- */
  var heads = $$('main h2').filter(function (h) { return !h.closest('.hero') && !h.children.length; });
  heads.forEach(function (h) { var words = h.textContent.trim().split(/\s+/); h.setAttribute('aria-label', h.textContent.trim()); h.textContent = ''; words.forEach(function (w, i) { var o = document.createElement('span'), n = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true'); n.className = 'wi'; n.style.setProperty('--i', i); n.textContent = w; o.appendChild(n); h.appendChild(o); h.appendChild(document.createTextNode(' ')); }); h.classList.add('split'); });

  /* ---------- reveal bookkeeping: once an element has arrived, give it back its quick hover transitions ---------- */
  var rail = $('#rail'); if (rail) $$('.tile', rail).forEach(function (tl, i) { tl.style.setProperty('--i', i); });
  $$('.bcard.reveal').forEach(function (c, i) { c.style.setProperty('--rd', ((i % 3) * 0.12) + 's'); });
  $$('.vfig.reveal').forEach(function (c, i) { c.style.setProperty('--rd', ((i % 3) * 0.14) + 's'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; var n = e.target; n.classList.add('in'); io.unobserve(n); setTimeout(function () { n.classList.add('done'); }, 1900); }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').concat(heads).concat(rail ? [rail] : []).forEach(function (n) { io.observe(n); });
  } else $$('.reveal').concat(heads).concat(rail ? [rail] : []).forEach(function (n) { n.classList.add('in', 'done'); });
  /* safety net for fast anchor jumps */
  addEventListener('scroll', function () { heads.concat(rail ? [rail] : []).forEach(function (n) { if (!n.classList.contains('in') && n.getBoundingClientRect().top < innerHeight * .92) { n.classList.add('in'); setTimeout(function () { n.classList.add('done'); }, 1900); } }); }, { passive: true });

  /* ---------- product rail: drag to scroll with a little glide ---------- */
  if (rail && fine) {
    var down = false, sx = 0, sl = 0, v = 0, lx = 0, raf = 0;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button) return; down = true; sx = lx = e.clientX; sl = rail.scrollLeft; v = 0; cancelAnimationFrame(raf); rail.classList.add('drag'); });
    addEventListener('pointermove', function (e) { if (!down) return; rail.scrollLeft = sl - (e.clientX - sx); v = e.clientX - lx; lx = e.clientX; });
    addEventListener('pointerup', function () { if (!down) return; down = false; var glide = function () { v *= .93; rail.scrollLeft -= v; if (Math.abs(v) > .4) raf = requestAnimationFrame(glide); else rail.classList.remove('drag'); }; glide(); });
  }

  /* ---------- magnetic buttons ---------- */
  if (fine) $$('.btn').forEach(function (b) {
    b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; b.style.transform = 'translate(' + (x * .22).toFixed(1) + 'px,' + (y * .32 - 3).toFixed(1) + 'px)'; });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });

  /* ---------- joy band: confetti and mascots that drift with the scroll ---------- */
  var joy = $('.joy');
  if (joy) {
    var conf = el('div', 'conf', joy, true), cols = ['#FFE14A', '#FF8FB8', '#7FE0FF', '#ffffff', '#B4E66E', '#FFB86B'], sd = 11, r2 = function () { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
    for (var k = 0; k < 18; k++) { var c = el('i', '', conf); c.style.setProperty('--x', (r2() * 100) + '%'); c.style.setProperty('--s', (10 + r2() * 22) + 'px'); c.style.setProperty('--c', cols[k % cols.length]); c.style.setProperty('--r', k % 3 === 0 ? '6px' : '50%'); c.style.setProperty('--d', (14 + r2() * 16) + 's'); c.style.setProperty('--dl', (-r2() * 30) + 's'); }
    var ml = $('.mwrap.l', joy), mr = $('.mwrap.r', joy), pq = false;
    var par = function () { pq = false; var r = joy.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; var p = (innerHeight - r.top) / (innerHeight + r.height) - .5; if (ml) ml.style.translate = '0 ' + (-p * 90).toFixed(1) + 'px'; if (mr) mr.style.translate = '0 ' + (p * 70).toFixed(1) + 'px'; };
    addEventListener('scroll', function () { if (!pq) { pq = true; requestAnimationFrame(par); } }, { passive: true });
  }
})();
