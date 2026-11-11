/* PREMIER Database dashboard: vanilla JS, SVG + CSS motion. Aggregated data only (data.js, map.js). */
(function () {
  'use strict';
  var D = window.PREMIER, M = window.MYMAP;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var NS = 'http://www.w3.org/2000/svg';
  var el = function (tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var rows = D.rows, N = rows.length;
  var C = { state: 0, region: 1, city: 2, fam: 3, rm: 4, tier: 5, band: 6, ten: 7, arpu: 8, cust: 15 };
  var F = { state: null, region: null, fam: null, rm: null, tier: null, band: null, ten: null };
  var FCOL = { state: 0, region: 1, fam: 3, rm: 4, tier: 5, band: 6, ten: 7 };
  var FLABEL = { state: 'State', region: 'Region', fam: 'Plan', rm: 'RM', tier: 'Tier', band: 'ARPU band', ten: 'Tenure' };
  var metric = 'cust';
  var QS = location.search, MASK = /[?&]mask\b/.test(QS);   // ?mask hides staff names (used for portfolio screenshots)
  var rmLabel = function (i) { return MASK ? 'Manager ' + ('0' + (i + 1)).slice(-2) : D.rms[i]; };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var rm = function (n) { return 'RM ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var rmShort = function (n) { return n >= 1e6 ? 'RM ' + (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? 'RM ' + (n / 1e3).toFixed(0) + 'k' : 'RM ' + Math.round(n); };
  var pct = function (n) { return (n * 100).toFixed(1) + '%'; };
  var short = function (s) { return s.replace(/RM\s?/g, '').replace(' to ', '–').replace('Under ', '<').replace(' and above', '+').replace('No ARPU recorded', 'n/a').replace('Unknown', 'n/a').replace(/\s*-\s*/g, '–').replace(/(\d),000/g, '$1k').replace('2,499', '2.5k').replace(' years', 'y').replace(' year', 'y'); };
  var stName = function (s) { return s.replace('W.P. ', ''); };

  /* ---------- aggregation ---------- */
  function filt(excl) {
    var keys = Object.keys(F).filter(function (k) { return F[k] !== null && (!excl || excl.indexOf(k) < 0); });
    if (!keys.length) return rows;
    return rows.filter(function (r) { for (var i = 0; i < keys.length; i++) if (r[FCOL[keys[i]]] !== F[keys[i]]) return false; return true; });
  }
  function agg(rs, col, size) {
    var out = []; for (var i = 0; i < size; i++) out.push({ n: 0, c: 0, s: 0, an: 0, hi: 0, b: [0, 0, 0, 0, 0, 0], k: i });
    for (var j = 0; j < rs.length; j++) {
      var r = rs[j], o = out[r[col]];
      o.n++; o.c += r[15];
      if (r[8] >= 0) { o.s += r[8]; o.an++; if (r[8] >= 1000) o.hi++; }
      for (var m = 0; m < 6; m++) o.b[m] += r[9 + m];
    }
    out.forEach(function (o) { o.avg = o.an ? o.s / o.an : 0; });
    return out;
  }
  var ALL = { cust: rows.reduce(function (a, r) { return a + r[15]; }, 0) };
  var allArpu = rows.filter(function (r) { return r[8] >= 0; });
  ALL.avg = allArpu.reduce(function (a, r) { return a + r[8]; }, 0) / allArpu.length;

  /* ---------- tweening ---------- */
  var tw = new WeakMap();
  function tween(node, to, f, dur) {
    var from = tw.has(node) ? tw.get(node).v : 0;
    if (tw.has(node)) cancelAnimationFrame(tw.get(node).raf);
    if (reduce) { node.textContent = f(to); tw.set(node, { v: to }); return; }
    var t0 = performance.now(); dur = dur || 1100;
    var st = { v: from, raf: 0 }; tw.set(node, st);
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      st.v = from + (to - from) * e; node.textContent = f(st.v);
      if (p < 1) st.raf = requestAnimationFrame(step); else { st.v = to; node.textContent = f(to); }
    })(t0);
  }

  /* ---------- palette ---------- */
  var PAL = ['#27d3ff', '#0a8fe8', '#8a4dff', '#ff2d8a', '#ffa21f', '#2de2a6', '#ffd23f', '#6aa8ff', '#ff7ab8'];
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function ramp(stops, t) {
    t = Math.max(0, Math.min(1, t)); var seg = t * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(seg)), f = seg - i, a = hex(stops[i]), b = hex(stops[i + 1]);
    return 'rgb(' + [0, 1, 2].map(function (k) { return Math.round(lerp(a[k], b[k], f)); }).join(',') + ')';
  }
  var RAMPS = { cust: ['#123f8c', '#1f86e6', '#27d3ff', '#d6fbff'], arpu: ['#3b1d8f', '#c2278f', '#ff6a4d', '#ffd23f'] };

  /* ---------- map ---------- */
  var svg = $('#map'), paths = {}, labels = {}, pinG, mapw = 900;
  var STATES = D.states;
  (function buildMap() {
    var sh = el('g', { transform: 'translate(0 14)' }, svg), sl = el('g', { transform: 'translate(0 7)' }, svg);
    STATES.forEach(function (s) { if (M.shapes[s]) { el('path', { d: M.shapes[s], class: 'shadow' }, sh); el('path', { d: M.shapes[s], class: 'slab' }, sl); } });
    var g = el('g', {}, svg);
    STATES.forEach(function (s, i) {
      if (!M.shapes[s]) return;
      var p = el('path', { d: M.shapes[s], class: 'st', 'data-i': i, tabindex: 0, role: 'button', 'aria-label': s }, g);
      paths[i] = p;
      p.addEventListener('click', function () { toggle('state', i); });
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle('state', i); } });
      p.addEventListener('mousemove', function (e) { showTip(i, e); });
      p.addEventListener('mouseleave', hideTip);
      p.addEventListener('focus', function () { var b = p.getBoundingClientRect(); showTip(i, { clientX: b.left + b.width / 2, clientY: b.top }); });
      p.addEventListener('blur', hideTip);
    });
    var big = ['Sabah', 'Sarawak', 'Johor', 'Pahang', 'Perak', 'Kelantan', 'Terengganu', 'Kedah', 'Selangor'];
    var tg = el('g', {}, svg);
    big.forEach(function (s) { var i = STATES.indexOf(s); if (i < 0 || !M.cent[s]) return; var t = el('text', { x: M.cent[s][0], y: M.cent[s][1] + 20 }, tg); t.textContent = s; labels[i] = t; });
    pinG = el('g', {}, svg);
  })();

  var stAgg = [], hotIdx = -1;
  function renderMap() {
    stAgg = agg(filt(['state']), 0, STATES.length);
    var vals = stAgg.map(function (a) { return metric === 'cust' ? a.c : a.avg; });
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals.filter(function (v) { return v > 0; }));
    var pos = vals.map(function (v, i) { return i; }).filter(function (i) { return vals[i] > 0; }).sort(function (a, b) { return vals[a] - vals[b]; }), rankOf = {}, nPos = pos.length; pos.forEach(function (i, k) { rankOf[i] = k; });
    if (!isFinite(min)) min = 0;
    Object.keys(paths).forEach(function (k) {
      var i = +k, v = vals[i], p = paths[i];
      var t = v > 0 ? 0.45 * (metric === 'cust' ? Math.sqrt(v / max) : (v - min) / ((max - min) || 1)) + 0.55 * (rankOf[i] / Math.max(1, nPos - 1)) : -1;
      p.style.fill = t < 0 ? '#12294f' : ramp(RAMPS[metric], t);
      p.classList.toggle('sel', F.state === i);
      p.classList.toggle('dim', F.state !== null && F.state !== i);
    });
    var r = RAMPS[metric];
    var lg = $('.legend'); lg.style.setProperty('--c0', r[0]); lg.style.setProperty('--c1', r[r.length - 1]);
    $('#lgMin').textContent = metric === 'cust' ? '0' : rm(min).replace('.00', '');
    $('#lgMax').textContent = metric === 'cust' ? fmt(max) : rm(max).replace('.00', '');
    $('#lgTitle').textContent = metric === 'cust' ? 'Customers per state' : 'Average ARPU per state';
    renderCallouts(vals);
  }

  var SLOTS = [[33, 7], [1, 62], [57, 5], [80, 58]];
  function renderCallouts(vals) {
    var wrap = $('#callouts'), ls = $('#leaders');
    var order = STATES.map(function (s, i) { return i; }).filter(function (i) { return vals[i] > 0 && paths[i]; }).sort(function (a, b) { return vals[b] - vals[a]; }).slice(0, 4);
    pinG.innerHTML = ''; ls.innerHTML = '';
    var free = SLOTS.slice(), fr = wrap.getBoundingClientRect(), W = 1000, H = 429;
    var have = {};
    order.forEach(function (i) {
      var c = M.cent[STATES[i]]; if (!c) return;
      var bi = 0, bd = 1e9; free.forEach(function (s, k) { var d = Math.hypot(s[0] * 10 + 80 - c[0], s[1] * 4.29 + 30 - c[1]); if (d < bd) { bd = d; bi = k; } });
      var slot = free.splice(bi, 1)[0]; have[i] = slot;
      var pin = el('circle', { cx: c[0], cy: c[1], r: 5, fill: '#fff' }, pinG); el('circle', { cx: c[0], cy: c[1], r: 9, class: 'pulse' }, pinG);
      pin.style.filter = 'drop-shadow(0 0 8px #fff)';
      var sx = slot[0] * 10 + 75, sy = slot[1] * 4.29 + 34;
      el('path', { d: 'M' + c[0] + ' ' + c[1] + 'L' + sx + ' ' + sy }, ls);
      var id = 'co' + i, node = document.getElementById(id), a = stAgg[i];
      if (!node) { node = document.createElement('div'); node.className = 'co'; node.id = id; node.innerHTML = '<span></span><b></b><small></small>'; node.addEventListener('click', function () { toggle('state', i); }); wrap.appendChild(node); }
      node.style.left = slot[0] + '%'; node.style.top = slot[1] + '%';
      node.querySelector('span').textContent = stName(STATES[i]);
      tween(node.querySelector('b'), metric === 'cust' ? a.c : a.avg, metric === 'cust' ? fmt : rm, 900);
      node.querySelector('small').textContent = metric === 'cust' ? 'avg ARPU ' + rm(a.avg).replace('.00', '') : fmt(a.c) + ' customers';
      node.dataset.live = '1';
    });
    Array.prototype.forEach.call(wrap.children, function (n) { if (!have[+n.id.slice(2)]) n.remove(); });
  }

  /* ---------- tooltip ---------- */
  var tip = $('#tip');
  function showTip(i, e) {
    var a = stAgg[i] || { c: 0, n: 0, avg: 0, s: 0, hi: 0, an: 0 };
    var rs = filt(['state']).filter(function (r) { return r[0] === i; });
    var fam = agg(rs, 3, D.fams.length).sort(function (x, y) { return y.c - x.c; })[0], top = agg(rs, 4, D.rms.length).sort(function (x, y) { return y.c - x.c; })[0];
    var tot = agg(filt(['state']), 0, 1); var all = filt(['state']).reduce(function (s, r) { return s + r[15]; }, 0);
    tip.innerHTML = '<h3>' + D.states[i] + '</h3><div>Customers <b>' + fmt(a.c) + '</b></div><div>Share of base <b>' + pct(all ? a.c / all : 0) + '</b></div><div>Average ARPU <b>' + rm(a.avg).replace('.00', '') + '</b></div><div>Monthly ARPU <b>' + rmShort(a.s) + '</b></div><div>High-value lines <b>' + pct(a.an ? a.hi / a.an : 0) + '</b></div>' + (fam && fam.n ? '<div>Top plan <b>' + D.fams[fam.k] + '</b></div>' : '') + (top && top.n ? '<div>Top RM <b>' + rmLabel(top.k) + '</b></div>' : '') + '<div style="color:#27d3ff;margin-top:4px">Click to filter everything</div>';
    var x = Math.min(innerWidth - 260, e.clientX + 18), y = Math.min(innerHeight - 250, e.clientY + 16);
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.add('on');
  }
  function hideTip() { tip.classList.remove('on'); }

  /* ---------- KPI ---------- */
  function renderKPIs() {
    var rs = filt();
    var cust = 0, s = 0, an = 0, hi = 0, lines = rs.length;
    for (var i = 0; i < rs.length; i++) { var r = rs[i]; cust += r[15]; if (r[8] >= 0) { s += r[8]; an++; if (r[8] >= 1000) hi++; } }
    var avg = an ? s / an : 0;
    tween($('#kCust'), cust, fmt); tween($('#kArpu'), avg, rm); tween($('#kRev'), s, rmShort); tween($('#kHigh'), an ? hi / an * 100 : 0, function (v) { return v.toFixed(1) + '%'; });
    $('#kCustSub').textContent = fmt(lines) + ' lines · ' + pct(cust / ALL.cust) + ' of the base';
    var d = avg - ALL.avg; $('#kArpuSub').textContent = (F.state === null && F.region === null && F.fam === null && F.rm === null && F.tier === null && F.band === null && F.ten === null) ? 'median line RM 377.14' : (d >= 0 ? '▲ ' : '▼ ') + rm(Math.abs(d)).replace('.00', '') + ' vs all customers';
    $('#kRevSub').textContent = 'total of line ARPU, per month';
  }

  /* ---------- donut (region) ---------- */
  var donut = { built: false };
  function buildDonut() {
    var host = $('#pRegion'); host.innerHTML = '<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="72" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="26"/><g id="dsegs"></g><text class="mid" x="100" y="104"></text><text class="mid2" x="100" y="126">customers</text></svg><div class="dl" id="dl"></div>';
    donut.segs = D.regions.map(function (r, i) {
      var c = el('circle', { cx: 100, cy: 100, r: 72, class: 'seg', stroke: PAL[i % PAL.length], 'stroke-dasharray': '0 452.4', 'stroke-dashoffset': 0 }, $('#dsegs'));
      c.addEventListener('click', function () { toggle('region', i); }); return c;
    });
    donut.btns = D.regions.map(function (r, i) {
      var b = document.createElement('button'); b.type = 'button'; b.innerHTML = '<i style="background:' + PAL[i % PAL.length] + '"></i><span>' + r + '</span><b></b>'; b.addEventListener('click', function () { toggle('region', i); }); $('#dl').appendChild(b); return b;
    });
    donut.mid = $('.mid', host); donut.built = true;
  }
  function renderDonut() {
    if (!donut.built) buildDonut();
    var a = agg(filt(['region']), 1, D.regions.length), tot = a.reduce(function (s, o) { return s + o.c; }, 0), C0 = 2 * Math.PI * 72, off = 0;
    a.forEach(function (o, i) {
      var len = tot ? o.c / tot * C0 : 0, gap = len > 6 ? 2.5 : 0;
      donut.segs[i].setAttribute('stroke-dasharray', Math.max(0, len - gap) + ' ' + (C0 - Math.max(0, len - gap)));
      donut.segs[i].setAttribute('stroke-dashoffset', -off); off += len;
      donut.segs[i].style.opacity = F.region !== null && F.region !== i ? .3 : 1;
      var b = donut.btns[i]; b.classList.toggle('sel', F.region === i); b.classList.toggle('dim', F.region !== null && F.region !== i);
      b.querySelector('b').textContent = fmt(o.c) + ' · ' + (tot ? (o.c / tot * 100).toFixed(0) : 0) + '%';
    });
    tween(donut.mid, tot, fmt);
  }

  /* ---------- ranked lists ---------- */
  function makeRank(host, labels, key, colIdx, opt) {
    host.style.setProperty('--h', (opt.h || 26) + 'px'); host.style.setProperty('--n', Math.min(labels.length, opt.top || 99));
    var items = labels.map(function (l, i) {
      var r = document.createElement('div'); r.className = 'rk'; r.style.setProperty('--r', i);
      r.innerHTML = '<span class="n"></span><span class="l" title="' + l + '">' + l + '</span><span class="t"><i></i></span><span class="v"></span>';
      r.style.setProperty('--c1', PAL[(i + (opt.off || 0)) % PAL.length]); r.style.setProperty('--c2', PAL[(i + 1 + (opt.off || 0)) % PAL.length]);
      if (key) r.addEventListener('click', function () { toggle(key, i); });
      host.appendChild(r); return r;
    });
    return { items: items, host: host, key: key, col: colIdx, labels: labels, opt: opt };
  }
  function updRank(R, rs) {
    var a = agg(rs, R.col, R.labels.length), valOf = function (o) { return R.opt.by === 'avg' ? o.avg : o.c; };
    var order = a.map(function (o, i) { return i; }).filter(function (i) { return a[i].n > 0 || (R.key && F[R.key] === i); }).sort(function (x, y) { return valOf(a[y]) - valOf(a[x]); });
    if (R.opt.top) order = order.slice(0, R.opt.top);
    var max = Math.max.apply(null, order.map(function (i) { return valOf(a[i]); }).concat([1]));
    R.items.forEach(function (r, i) {
      var k = order.indexOf(i), on = k >= 0;
      r.style.opacity = on ? 1 : 0; r.style.pointerEvents = on ? 'auto' : 'none';
      if (on) { r.style.setProperty('--r', k); r.querySelector('.n').textContent = k + 1; r.style.setProperty('--w', valOf(a[i]) / max); tween(r.querySelector('.v'), valOf(a[i]), R.opt.by === 'avg' ? function (v) { return Math.round(v).toLocaleString('en-US'); } : fmt, 800); }
      else r.style.setProperty('--r', R.items.length);
      if (R.key) { r.classList.toggle('sel', F[R.key] === i); r.classList.toggle('dim', F[R.key] !== null && F[R.key] !== i); }
    });
  }

  /* ---------- column charts ---------- */
  function makeCols(host, labels, key, colIdx, opts) {
    var W = opts.w || 420, H = opts.h || 190, pad = 26, n = labels.length, bw = (W - 20) / n;
    var s = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'none' }); host.appendChild(s);
    for (var g = 0; g < 4; g++) el('line', { x1: 0, x2: W, y1: pad + (H - pad * 2 - 6) * g / 3, y2: pad + (H - pad * 2 - 6) * g / 3, class: 'grid' }, s);
    var bars = labels.map(function (l, i) {
      var x = 10 + i * bw + bw * .14, w = bw * .72, hh = H - pad * 2 - 6;
      var r = el('rect', { x: x, y: pad, width: w, height: hh, rx: Math.min(8, w / 3), class: 'bar', fill: 'url(#g' + opts.id + ')' }, s);
      r.style.setProperty('--s', 0); if (key) r.addEventListener('click', function () { toggle(key, i); });
      var t = el('text', { x: x + w / 2, y: H - 6 }, s); t.textContent = short(l);
      var v = el('text', { x: x + w / 2, y: pad - 6, class: 'val' }, s);
      return { r: r, v: v, x: x + w / 2 };
    });
    var defs = el('defs', {}, s), lg = el('linearGradient', { id: 'g' + opts.id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: '0', 'stop-color': opts.c1 || '#27d3ff' }, lg); el('stop', { offset: '1', 'stop-color': opts.c2 || '#0a6fe0' }, lg);
    var line = null, dots = [];
    if (opts.line) { line = el('path', { class: 'line', d: '' }, s); dots = labels.map(function () { return el('circle', { r: 5, class: 'dot', cx: 0, cy: 0 }, s); }); }
    return { s: s, bars: bars, key: key, col: colIdx, labels: labels, opts: opts, W: W, H: H, pad: pad, line: line, dots: dots };
  }
  function updCols(Ch, vals, fmtv, sel) {
    var max = Math.max.apply(null, vals.concat([1]));
    Ch.bars.forEach(function (b, i) {
      b.r.style.setProperty('--s', vals[i] / max); b.v.textContent = fmtv(vals[i]);
      b.v.setAttribute('y', Ch.pad + (Ch.H - Ch.pad * 2 - 6) * (1 - vals[i] / max) - 6);
      if (Ch.key) { b.r.classList.toggle('sel', F[Ch.key] === i); b.r.classList.toggle('dim', F[Ch.key] !== null && F[Ch.key] !== i); }
    });
  }

  /* ---------- build panels ---------- */
  var regionChart, plans = makeRank($('#pPlans'), D.fams, 'fam', 3, { h: 23, off: 0 }), rmR = makeRank($('#pRM'), D.rms.map(function (n, i) { return rmLabel(i); }), 'rm', 4, { h: 22, off: 3 });
  var cityLabels = D.cities.map(function (c, i) { return c; });
  // cities: only the top 6 rows are built (697 cities in the data)
  var cityHost = $('#pCities'); cityHost.style.setProperty('--h', '25px'); cityHost.style.setProperty('--n', 6);
  var cityNodes = [];
  for (var ci = 0; ci < 6; ci++) { var rr = document.createElement('div'); rr.className = 'rk'; rr.style.setProperty('--r', ci); rr.style.setProperty('--c1', PAL[(ci + 5) % PAL.length]); rr.style.setProperty('--c2', PAL[(ci + 6) % PAL.length]); rr.innerHTML = '<span class="n">' + (ci + 1) + '</span><span class="l"></span><span class="t"><i></i></span><span class="v"></span>'; cityHost.appendChild(rr); cityNodes.push(rr); }
  var bandsC = makeCols($('#pBands'), D.arpuBands, 'band', 6, { id: 'b', w: 440, h: 186, c1: '#ff7ab8', c2: '#8a4dff' });
  var tenC = makeCols($('#pTenure'), D.tenureBands, 'ten', 7, { id: 't', w: 440, h: 170, c1: '#2de2a6', c2: '#0a8fe8' });
  var monC = makeCols($('#pMonthly'), D.months.map(function (m) { return ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][+m.slice(5, 7) - 4] + ' 2013'; }), null, -1, { id: 'm', w: 900, h: 190, line: true, c1: '#27d3ff', c2: '#0a6fe0' });

  function renderCities() {
    var rs = filt(), a = agg(rs, 2, D.cities.length);
    var order = a.map(function (o, i) { return i; }).filter(function (i) { return a[i].c > 0; }).sort(function (x, y) { return a[y].c - a[x].c; }).slice(0, 6);
    var max = order.length ? a[order[0]].c : 1;
    cityNodes.forEach(function (n, k) {
      var i = order[k]; if (i === undefined) { n.style.opacity = 0; return; }
      n.style.opacity = 1; n.querySelector('.l').textContent = D.cities[i];
      n.querySelector('.t i').style.setProperty('--w', a[i].c / max); tween(n.querySelector('.v'), a[i].c, fmt, 800);
    });
  }
  function renderMonthly() {
    var b = [0, 0, 0, 0, 0, 0], n = 0;
    filt().forEach(function (r) { n++; for (var m = 0; m < 6; m++) b[m] += r[9 + m]; });
    updCols(monC, b, rmShort);
    var perLine = b.map(function (v) { return n ? v / n : 0; }), mx = Math.max.apply(null, perLine.concat([1])), mn = Math.min.apply(null, perLine);
    var pts = perLine.map(function (v, i) { var x = monC.bars[i].x, y = monC.pad + 8 + (monC.H - monC.pad * 2 - 22) * (1 - (v - mn * .9) / ((mx - mn * .9) || 1)); return [x, y]; });
    monC.line.style.d = "path('" + pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join('') + "')";
    monC.line.setAttribute('d', pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(''));
    monC.dots.forEach(function (d, i) { d.setAttribute('cx', pts[i][0]); d.setAttribute('cy', pts[i][1]); d.style.cx = pts[i][0] + 'px'; d.style.cy = pts[i][1] + 'px'; });
  }

  /* ---------- filters and orchestration ---------- */
  function toggle(k, i) { F[k] = F[k] === i ? null : i; idleReset(); renderAll(); }
  $('#reset').addEventListener('click', function () { Object.keys(F).forEach(function (k) { F[k] = null; }); renderAll(); });
  function labelOf(k, v) { return k === 'state' ? D.states[v] : k === 'region' ? D.regions[v] : k === 'fam' ? D.fams[v] : k === 'rm' ? rmLabel(v) : k === 'tier' ? D.tiers[v] : k === 'band' ? D.arpuBands[v] : D.tenureBands[v]; }
  function renderChips() {
    var host = $('#chips'); host.innerHTML = '';
    var parts = [];
    Object.keys(F).forEach(function (k) {
      if (F[k] === null) return; parts.push(labelOf(k, F[k]));
      var c = document.createElement('span'); c.className = 'chip'; c.innerHTML = '<b>' + FLABEL[k] + '</b>' + labelOf(k, F[k]) + '<button type="button" aria-label="Remove filter">×</button>';
      c.querySelector('button').addEventListener('click', function () { F[k] = null; renderAll(); }); host.appendChild(c);
    });
    $('#scopeLabel').textContent = parts.length ? parts.join(' · ') : 'All Malaysia';
  }
  function renderAll() {
    renderChips(); renderKPIs(); renderMap(); renderDonut();
    updRank(plans, filt(['fam'])); updRank(rmR, filt(['rm']));
    var ab = agg(filt(['band']), 6, D.arpuBands.length); updCols(bandsC, ab.map(function (o) { return o.c; }), fmt);
    var tb = agg(filt(['ten']), 7, D.tenureBands.length); updCols(tenC, tb.map(function (o) { return o.c; }), fmt);
    renderCities(); renderMonthly();
  }

  /* metric toggle with sliding knob */
  var seg = $('.seg'), knob = $('.knob');
  function placeKnob() { var b = seg.querySelector('button.on'); knob.style.setProperty('--x', (b.offsetLeft - 5) + 'px'); knob.style.setProperty('--w', b.offsetWidth + 'px'); }
  seg.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { metric = b.dataset.m; seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); placeKnob(); renderMap(); idleReset(); }); });

  /* fit to screen */
  var stage = $('#stage');
  function fit() {
    var small = innerWidth < 1000;
    document.body.classList.toggle('stack', small);
    stage.style.transform = small ? 'none' : 'scale(' + Math.min(innerWidth / 1920, innerHeight / 1080) + ')';
    placeKnob();
  }
  addEventListener('resize', fit); fit();

  /* map parallax tilt */
  var mz = $('#mapzone'), mf = $('#mapframe');
  mz.addEventListener('pointermove', function (e) { if (reduce) return; var b = mz.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; mf.style.setProperty('--ry', (x * 9) + 'deg'); mf.style.setProperty('--rx', (14 - y * 7) + 'deg'); });
  mz.addEventListener('pointerleave', function () { mf.style.setProperty('--ry', '0deg'); mf.style.setProperty('--rx', '14deg'); });

  /* idle spotlight (big-screen behaviour) */
  var idleT = 0, spotI = 0, spotTimer = 0;
  function idleReset() { idleT = performance.now(); if (hotIdx >= 0 && paths[hotIdx]) paths[hotIdx].classList.remove('hot'); hotIdx = -1; $('#spot').innerHTML = ''; }
  ['pointermove', 'keydown', 'click'].forEach(function (ev) { addEventListener(ev, function () { if (hotIdx >= 0) idleReset(); else idleT = performance.now(); }, { passive: true }); });
  if (!reduce) spotTimer = setInterval(function () {
    if (performance.now() - idleT < 7000 || document.hidden) return;
    var order = stAgg.map(function (a, i) { return i; }).filter(function (i) { return stAgg[i].c > 0 && paths[i]; }).sort(function (a, b) { return stAgg[b].c - stAgg[a].c; }).slice(0, 8);
    if (hotIdx >= 0 && paths[hotIdx]) paths[hotIdx].classList.remove('hot');
    hotIdx = order[spotI++ % order.length]; paths[hotIdx].classList.add('hot');
    var a = stAgg[hotIdx]; $('#spot').innerHTML = 'Spotlight · <b>' + D.states[hotIdx] + '</b><br>' + fmt(a.c) + ' customers · avg ' + rm(a.avg).replace('.00', '');
  }, 3200);

  idleT = performance.now();
  (function fromURL() {
    var m = /[?&]m=arpu/.test(QS), s = (/[?&]state=([^&]+)/.exec(QS) || [])[1];
    if (m) { metric = 'arpu'; seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x.dataset.m === 'arpu'); }); placeKnob(); }
    if (s) { var si = STATES.indexOf(decodeURIComponent(s)); if (si >= 0) F.state = si; }
    if (/[?&]still\b/.test(QS)) { clearInterval(spotTimer); }
  })();
  renderAll();
})();
