/* Flip-style PDF reader for the Magazine page.
   Reads magazine/publications.json, shows each cover, and opens PDFs in a page-turning reader.
   Uses PDF.js (Mozilla) from cdnjs. */
(function () {
  'use strict';
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var grid = $('#pubs'), chips = $('#chips');
  var pubs = [], docs = {};

  function slug(p) { return (p.pdf || '').split('/').pop().replace(/\.pdf$/i, ''); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  var libP;
  function lib() {
    if (libP) return libP;
    libP = new Promise(function (res, rej) {
      if (window.pdfjsLib) return res(window.pdfjsLib);
      var s = document.createElement('script');
      s.src = PDFJS + 'pdf.min.js';
      s.onload = function () { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; res(window.pdfjsLib); };
      s.onerror = function () { libP = null; rej(new Error('PDF viewer could not load')); };
      document.head.appendChild(s);
    });
    return libP;
  }
  function openDoc(p) {
    if (!docs[p.pdf]) docs[p.pdf] = lib().then(function (L) { return L.getDocument({ url: p.pdf, rangeChunkSize: 262144 }).promise; })
      .catch(function (e) { delete docs[p.pdf]; throw e; });
    return docs[p.pdf];
  }
  function renderPage(doc, n, cssH) {
    return doc.getPage(n).then(function (page) {
      var v1 = page.getViewport({ scale: 1 });
      var scale = (cssH * Math.min(window.devicePixelRatio || 1, 2)) / v1.height;
      var vp = page.getViewport({ scale: scale });
      var c = document.createElement('canvas');
      c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
        return new Promise(function (res) { c.toBlob(function (b) { res(URL.createObjectURL(b)); }, 'image/jpeg', 0.88); });
      });
    });
  }

  /* ---------------- cards ---------------- */
  fetch('/magazine/publications.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (list) {
    pubs = list;
    var groups = [];
    list.forEach(function (p) { if (groups.indexOf(p.group) < 0) groups.push(p.group); });
    chips.innerHTML = '<button class="chip on" data-g="">All</button>' + groups.map(function (g) { return '<button class="chip" data-g="' + esc(g) + '">' + esc(g) + '</button>'; }).join('');
    grid.innerHTML = list.map(function (p, i) {
      return '<button class="pub soon" data-i="' + i + '" data-g="' + esc(p.group) + '" id="' + esc(slug(p)) + '" aria-label="' + esc(p.title + ', ' + p.issue) + '">' +
        '<span class="cover"><span class="ph"><b>' + esc(p.title) + '</b><em>' + esc(p.issue) + '</em></span><span class="badge">Coming soon</span></span>' +
        '<span class="meta"><span class="grp">' + esc(p.group) + '</span><strong>' + esc(p.title) + '</strong><span class="iss">' + esc(p.issue) + '</span>' + (p.note ? '<span class="note">' + esc(p.note) + '</span>' : '') + '</span>' +
      '</button>';
    }).join('');

    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); cover(e.target); } });
    }, { rootMargin: '300px' }) : null;

    list.forEach(function (p, i) {
      var el = grid.children[i];
      fetch(p.pdf, { method: 'HEAD' }).then(function (r) {
        var ct = r.headers.get('content-type') || '';
        if (!r.ok || /text\/html/.test(ct)) return;
        el.classList.remove('soon'); el.classList.add('ready');
        el.querySelector('.badge').textContent = 'Read';
        if (io) io.observe(el); else cover(el);
        if (location.hash.slice(1) === slug(p)) open(i);
      }).catch(function () {});
    });
  }).catch(function () { grid.innerHTML = '<p class="err">Publications could not be loaded. Please refresh.</p>'; });

  function cover(el) {
    var p = pubs[+el.getAttribute('data-i')];
    openDoc(p).then(function (doc) {
      el.querySelector('.iss').textContent = p.issue + ' · ' + doc.numPages + ' pages';
      return renderPage(doc, 1, 420);
    }).then(function (url) {
      var c = el.querySelector('.cover'), img = new Image();
      img.alt = ''; img.src = url; img.onload = function () { c.querySelector('.ph').replaceWith(img); };
    }).catch(function () {});
  }

  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    [].forEach.call(chips.children, function (c) { c.classList.toggle('on', c === b); });
    var g = b.getAttribute('data-g');
    [].forEach.call(grid.children, function (c) { c.hidden = !!g && c.getAttribute('data-g') !== g; });
  });
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.pub'); if (!b) return;
    if (b.classList.contains('soon')) { b.classList.add('nudge'); setTimeout(function () { b.classList.remove('nudge'); }, 600); return; }
    open(+b.getAttribute('data-i'));
  });

  /* ---------------- reader ---------------- */
  var R = $('#reader'), book = $('#book'), L = $('#pageL'), Rt = $('#pageR'), counter = $('#counter'), thumbs = $('#thumbs');
  var state = null, busy = false, lastFocus = null;

  function spreadMode() { return innerWidth >= 900 && innerWidth / innerHeight > 1.05; }
  function views(n, spread) {   // spread: [ [null,1], [2,3], [4,5] ... ]   single: [[1],[2]...]
    var v = [];
    if (!spread) { for (var i = 1; i <= n; i++) v.push([i]); return v; }
    v.push([null, 1]);
    for (var p = 2; p <= n; p += 2) v.push([p, p + 1 <= n ? p + 1 : null]);
    return v;
  }
  function layout() {
    if (!state) return;
    var spread = spreadMode();
    var availW = R.clientWidth - (innerWidth < 640 ? 24 : 150), availH = R.clientHeight - $('.r-top').offsetHeight - (thumbs.hidden ? 0 : thumbs.offsetHeight) - 40;
    var ph = availH, pw = ph * state.aspect;
    var cols = spread ? 2 : 1;
    if (pw * cols > availW) { pw = availW / cols; ph = pw / state.aspect; }
    state.pw = Math.floor(pw); state.ph = Math.floor(ph);
    book.style.width = (state.pw * cols) + 'px'; book.style.height = state.ph + 'px';
    book.classList.toggle('single', !spread);
    if (state.spread !== spread) {
      var page = state.v ? (state.v[state.at][0] || state.v[state.at][1]) : (state.startPage || 1);
      state.spread = spread; state.v = views(state.n, spread);
      state.at = indexOfPage(page);
      state.cache = {};
    }
    show();
  }
  function indexOfPage(p) { for (var i = 0; i < state.v.length; i++) if (state.v[i].indexOf(p) >= 0) return i; return 0; }
  function img(n) {
    if (!n) return Promise.resolve('');
    var key = n + '@' + state.ph;
    if (!state.cache[key]) state.cache[key] = renderPage(state.doc, n, state.ph);
    return state.cache[key];
  }
  function setImg(el, url) { el.style.backgroundImage = url ? 'url("' + url + '")' : 'none'; el.classList.toggle('blank', !url); }
  function label() {
    var v = state.v[state.at];
    var t = v.filter(Boolean).join('–');
    counter.textContent = 'Page ' + t + ' of ' + state.n;
    $('#prev').disabled = state.at === 0; $('#next').disabled = state.at === state.v.length - 1;
    [].forEach.call(thumbs.children, function (c) { var on = v.indexOf(+c.getAttribute('data-p')) >= 0; c.classList.toggle('on', on); if (on && c.scrollIntoView && !thumbs.hidden) c.scrollIntoView({ block: 'nearest', inline: 'center' }); });
  }
  function show() {
    var v = state.v[state.at];
    if (state.spread) { Promise.all([img(v[0]), img(v[1])]).then(function (u) { setImg(L, u[0]); setImg(Rt, u[1]); }); }
    else img(v[0]).then(function (u) { setImg(Rt, u); setImg(L, ''); });
    label(); preload();
  }
  function preload() { [state.at - 1, state.at + 1, state.at + 2].forEach(function (i) { if (state.v[i]) state.v[i].forEach(function (p) { if (p) img(p); }); }); }

  function leaf(side, frontUrl, backUrl) {
    var lf = document.createElement('div');
    lf.className = 'leaf ' + side;
    lf.innerHTML = '<div class="face front"></div><div class="face back"></div><i class="shade"></i>';
    setImg(lf.children[0], frontUrl); setImg(lf.children[1], backUrl);
    book.appendChild(lf);
    return lf;
  }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function turn(dir) {
    if (!state || busy) return;
    var to = state.at + dir;
    if (to < 0 || to >= state.v.length) return;
    var cur = state.v[state.at], nxt = state.v[to];
    busy = true;
    var done = function () { state.at = to; busy = false; show(); };
    if (reduce) { done(); return; }
    if (state.spread) {
      if (dir > 0) {
        Promise.all([img(cur[1]), img(nxt[0]), img(nxt[1])]).then(function (u) {
          var lf = leaf('right', u[0], u[1]);
          setImg(Rt, u[2]);
          requestAnimationFrame(function () { requestAnimationFrame(function () { lf.classList.add('go'); }); });
          setTimeout(function () { setImg(L, u[1]); lf.remove(); done(); }, 760);
        });
      } else {
        Promise.all([img(cur[0]), img(nxt[1]), img(nxt[0])]).then(function (u) {
          var lf = leaf('left', u[0], u[1]);
          setImg(L, u[2]);
          requestAnimationFrame(function () { requestAnimationFrame(function () { lf.classList.add('go'); }); });
          setTimeout(function () { setImg(Rt, u[1]); lf.remove(); done(); }, 760);
        });
      }
    } else {
      if (dir > 0) {
        Promise.all([img(cur[0]), img(nxt[0])]).then(function (u) {
          var lf = leaf('right', u[0], ''); setImg(Rt, u[1]);
          requestAnimationFrame(function () { requestAnimationFrame(function () { lf.classList.add('go'); }); });
          setTimeout(function () { lf.remove(); done(); }, 760);
        });
      } else {
        img(nxt[0]).then(function (u) {
          var lf = leaf('right back-in', u, '');
          requestAnimationFrame(function () { requestAnimationFrame(function () { lf.classList.add('go'); }); });
          setTimeout(function () { setImg(Rt, u); lf.remove(); done(); }, 760);
        });
      }
    }
  }
  function jump(page) { if (!state || busy) return; state.at = indexOfPage(page); show(); }

  function open(i) {
    var p = pubs[i];
    lastFocus = document.activeElement;
    $('#rTitle').textContent = p.title + ' · ' + p.issue;
    $('#download').href = p.pdf;
    $('#download').setAttribute('download', slug(p) + '.pdf');
    R.hidden = false; document.documentElement.classList.add('reading');
    R.classList.add('loading'); setImg(L, ''); setImg(Rt, ''); counter.textContent = 'Opening…';
    thumbs.innerHTML = '';
    history.replaceState(null, '', '#' + slug(p));
    $('#close').focus();
    openDoc(p).then(function (doc) {
      return doc.getPage(1).then(function (pg) {
        var vp = pg.getViewport({ scale: 1 });
        state = { doc: doc, n: doc.numPages, aspect: vp.width / vp.height, at: 0, cache: {}, spread: null, v: null, startPage: 1 };
        R.classList.remove('loading');
        layout();
        buildThumbs();
      });
    }).catch(function () { R.classList.remove('loading'); counter.textContent = 'This PDF could not be opened.'; });
  }
  function buildThumbs() {
    var n = state.n, doc = state.doc, html = '';
    for (var p = 1; p <= n; p++) html += '<button data-p="' + p + '" aria-label="Go to page ' + p + '"><span>' + p + '</span></button>';
    thumbs.innerHTML = html;
    var q = 1;
    (function next() {          // render small thumbnails one after another
      if (!state || state.doc !== doc || q > n) return;
      var b = thumbs.children[q - 1], pn = q++;
      renderPage(doc, pn, 110).then(function (u) { if (b) b.style.backgroundImage = 'url("' + u + '")'; next(); }).catch(next);
    })();
    label(); layout();
  }
  function close() {
    R.hidden = true; document.documentElement.classList.remove('reading');
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    state = null; busy = false;
    history.replaceState(null, '', location.pathname);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $('#prev').addEventListener('click', function () { turn(-1); });
  $('#next').addEventListener('click', function () { turn(1); });
  $('#close').addEventListener('click', close);
  $('#toggleThumbs').addEventListener('click', function () { thumbs.hidden = !thumbs.hidden; this.setAttribute('aria-pressed', !thumbs.hidden); layout(); });
  $('#full').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen(); else if (R.requestFullscreen) R.requestFullscreen().catch(function () {});
  });
  thumbs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) jump(+b.getAttribute('data-p')); });
  book.addEventListener('click', function (e) {
    if (!state || busy) return;
    var r = book.getBoundingClientRect();
    turn(e.clientX - r.left > r.width / 2 ? 1 : -1);
  });
  addEventListener('keydown', function (e) {
    if (R.hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); turn(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); turn(-1); }
    else if (e.key === 'Escape' && !document.fullscreenElement) close();
    else if (e.key === 'Home') jump(1);
    else if (e.key === 'End' && state) jump(state.n);
  });
  var sx = null, sy = null;
  R.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  R.addEventListener('touchend', function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) turn(dx < 0 ? 1 : -1);
  }, { passive: true });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
  document.addEventListener('fullscreenchange', function () { setTimeout(layout, 100); });
})();
