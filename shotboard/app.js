/* Shotboard: prompt library + shot planner. No backend: boards are saved in the browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- seeded random ---------- */
  function hash(s) { var h = 1779033703 ^ s.length; for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; }; }
  function rng(seed) { var a = hash(seed)(); return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var pick = function (r, arr) { return arr[Math.floor(r() * arr.length)]; };

  /* ---------- state ---------- */
  var S = store.get('sb_state', null) || { brief: SAMPLES[0], genre: 'Cinematic story', mood: 'epic', model: 'Seedance', ratio: '9:16', dur: 5, count: 6, salt: 1, shots: [], look: null, light: null };
  var boards = store.get('sb_boards', []);
  var selected = null;
  var byCat = function (c) { return LIB.filter(function (x) { return x.c === c; }); };

  /* ---------- generator ---------- */
  function idea() { return (S.brief || '').trim().replace(/[.!\s]+$/, '').replace(/^./, function (c) { return c.toLowerCase(); }) || 'your scene'; }
  function forKind(cat, kind) { var l = byCat(cat).filter(function (x) { return x.k && x.k.indexOf(kind) > -1; }); return l.length ? l : byCat(cat); }
  function moodPool(cat) { var l = byCat(cat).filter(function (x) { return x.m && x.m.indexOf(S.mood) > -1 && !(S.real && /IMAX|glossy|Hyperreal|Dreamy|Neon rim/.test(x.n)); }); return l.length ? l : byCat(cat); }
  function generate(keepLocked) {
    var r = rng(S.brief + S.genre + S.mood + S.salt);
    var arc = GENRES[S.genre], n = Math.max(1, Math.min(8, +S.count));
    S.look = pick(r, moodPool('Look')); S.light = pick(r, moodPool('Light'));
    var old = S.shots;
    var shots = [];
    for (var i = 0; i < n; i++) {
      var st = arc[n === 1 ? 0 : Math.round(i * (arc.length - 1) / (n - 1))];
      if (keepLocked && old[i] && old[i].locked) { shots.push(old[i]); continue; }
      var mot = forKind('Motion', st[1]);
      shots.push({
        id: 's' + Date.now().toString(36) + i, name: st[0], kind: st[1],
        action: st[2].replace('{i}', idea()),
        camera: pick(r, forKind('Camera', st[1])).n, lens: pick(r, forKind('Lens', st[1])).n,
        motion: r() > 0.35 ? pick(r, mot).n : '', trans: pick(r, TRANSITIONS), extra: [], locked: false
      });
    }
    S.shots = shots; save(); render();
  }
  function item(cat, name) { return byCat(cat).filter(function (x) { return x.n === name; })[0]; }
  function buildPrompt(s0, i) {
    var s = S.real ? Object.assign({}, s0, { action: deslop(s0.action), extra: s0.extra.map(deslop) }) : s0;
    var cam = item('Camera', s.camera), len = item('Lens', s.lens), li = S.light, lk = S.look, mo = s.motion && item('Motion', s.motion);
    if (S.real) { li = { t: deslop(li.t) }; lk = { t: deslop(lk.t) }; }
    var cont = i > 0 ? 'Continuity: same character, wardrobe and location as the previous shot.' : '';
    var avoid = 'Avoid: text, watermarks, morphing, flicker.';
    var ex = s.extra.length ? ' ' + s.extra.join('; ') + '.' : '';
    var tail = S.dur + 's, ' + S.ratio + '.';
    var p;
    if (S.model === 'Higgsfield') p = cam.n.toUpperCase() + ' — ' + s.action + '. ' + len.t + '. ' + li.t + '. ' + lk.t + (mo ? '. ' + mo.t : '') + '.' + ex + ' ' + tail;
    else if (S.model === 'Flow / Veo') p = s.action + '. ' + cam.t + '. ' + len.t + '. ' + li.t + '. ' + lk.t + '.' + (mo ? ' ' + mo.t + '.' : '') + ex + ' Audio: ' + AUDIO[S.mood] + '. ' + tail;
    else if (S.model === 'Generic') p = '- Subject/action: ' + s.action + '\n- Camera: ' + cam.t + '\n- Lens: ' + len.t + '\n- Lighting: ' + li.t + '\n- Look: ' + lk.t + (mo ? '\n- Motion: ' + mo.t : '') + (ex ? '\n- Notes:' + ex : '') + '\n- Format: ' + tail + (cont ? '\n- ' + cont : '') + '\n- ' + avoid;
    else p = s.action + '. Camera: ' + cam.t + '. Lens: ' + len.t + '. Lighting: ' + li.t + '. Look: ' + lk.t + '.' + (mo ? ' ' + mo.t + '.' : '') + ex + ' ' + tail + (cont ? ' ' + cont : '') + ' ' + avoid;
    if (S.real) p += (p.indexOf('\n') > -1 ? '\n- Realism: ' : ' Realism: ') + realClause(i) + '. Avoid: ' + REAL_AVOID + '.';
    return p;
  }
  /* realism helpers */
  function reEsc(w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function slopFound(txt) { return SLOP_WORDS.filter(function (w) { return new RegExp('\\b' + reEsc(w) + '\\b', 'i').test(txt); }); }
  function deslop(txt) {
    SLOP_WORDS.forEach(function (w) { txt = txt.replace(new RegExp('\\b' + reEsc(w) + '\\b', 'gi'), ''); });
    return txt.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').replace(/(,\s*){2,}/g, ', ').replace(/^[,\s]+|[,\s]+$/g, '');
  }
  function realClause(i) {
    var r = rng((S.brief || '') + 'real' + i);
    return ['light', 'skin', 'wear', 'comp', 'colour'].map(function (k) { return pick(r, REAL_CLAUSES[k]); }).join('; ');
  }
  function updateSlop() {
    var h = $('#slopHint'); if (!h) return;
    var f = slopFound(S.brief || '');
    h.className = 'slop' + (f.length ? ' on' : '');
    h.innerHTML = f.length ? '<b>Slop words:</b> ' + f.map(function (w) { return '<i>' + esc(w) + '</i>'; }).join('') + '<button type="button" id="cleanBrief" class="btn mini">Clean it</button>' : '';
  }
  function save() { store.set('sb_state', S); }

  /* ---------- render planner ---------- */
  function setChips(host, vals, cur, key) {
    host.innerHTML = vals.map(function (v) { return '<button type="button" class="chip' + (v === cur ? ' on' : '') + '" data-k="' + key + '" data-v="' + esc(v) + '">' + esc(v) + '</button>'; }).join('');
  }
  var KCOL = { wide: '#19e3ff', medium: '#7c5cff', insert: '#ffb020', close: '#ff4d6d', action: '#ff7a2f', climax: '#ff2f92', hero: '#c6ff3d', tag: '#9aa4ff' };
  function render() {
    $('#brief').value = S.brief;
    setChips($('#genreChips'), Object.keys(GENRES), S.genre, 'genre');
    setChips($('#moodChips'), MOODS, S.mood, 'mood');
    setChips($('#modelChips'), ['Seedance', 'Higgsfield', 'Flow / Veo', 'Generic'], S.model, 'model');
    setChips($('#ratioChips'), ['9:16', '16:9', '1:1', '4:5'], S.ratio, 'ratio');
    setChips($('#realChips'), ['Off', 'On'], S.real ? 'On' : 'Off', 'real');
    updateSlop();
    $('#dur').value = S.dur; $('#durOut').textContent = S.dur + 's';
    $('#count').value = S.count; $('#countOut').textContent = S.count;
    var out = $('#shots');
    if (!S.shots.length) { out.innerHTML = '<div class="empty"><b>No shots yet</b><span>Describe a scene, then press Plan my shots.</span></div>'; $('#summary').textContent = ''; renderStrip(); return; }
    $('#summary').innerHTML = '<span><i style="background:' + '#c6ff3d' + '"></i>Look: <b>' + esc(S.look.n) + '</b></span><span><i style="background:#ffb020"></i>Light: <b>' + esc(S.light.n) + '</b></span><span><i style="background:#19e3ff"></i>' + S.shots.length + ' shots · ' + (S.shots.length * S.dur) + 's total</span>';
    out.innerHTML = S.shots.map(function (s, i) {
      var col = KCOL[s.kind] || '#7c5cff';
      return '<article class="shot' + (selected === s.id ? ' sel' : '') + (s.locked ? ' locked' : '') + '" data-id="' + s.id + '" style="--c:' + col + ';--d:' + (i * 70) + 'ms">' +
        '<div class="sh-top"><span class="sh-n">' + String(i + 1).padStart(2, '0') + '</span><div><b>' + esc(s.name) + '</b><small>' + esc(s.kind) + ' · ' + S.dur + 's · ' + S.ratio + '</small></div>' +
        '<div class="sh-tools"><button data-a="up" title="Move up">↑</button><button data-a="down" title="Move down">↓</button><button data-a="lock" title="Lock shot" class="' + (s.locked ? 'on' : '') + '">' + (s.locked ? '🔒' : '🔓') + '</button><button data-a="del" title="Delete">✕</button></div></div>' +
        '<textarea class="sh-act" data-a="act" rows="2" aria-label="Shot action">' + esc(s.action) + '</textarea>' +
        '<div class="sh-meta"><button class="tag" data-a="roll-camera"><em>Camera</em>' + esc(s.camera) + ' ↻</button><button class="tag" data-a="roll-lens"><em>Lens</em>' + esc(s.lens) + ' ↻</button><button class="tag" data-a="roll-motion"><em>Motion</em>' + esc(s.motion || 'none') + ' ↻</button></div>' +
        '<pre class="sh-prompt">' + esc(buildPrompt(s, i)) + '</pre>' +
        '<div class="sh-foot"><span class="trans">→ ' + esc(s.trans) + '</span><button class="btn mini" data-a="add">+ Library</button><button class="btn mini hot" data-a="copy">Copy prompt</button></div></article>';
    }).join('');
    renderStrip();
  }
  function renderStrip() {
    $('#strip').innerHTML = S.shots.map(function (s, i) { return '<div class="frame" style="--c:' + (KCOL[s.kind] || '#7c5cff') + '"><b>' + (i + 1) + '</b><span>' + esc(s.name) + '</span><small>' + esc(s.camera) + '</small></div>'; }).join('');
  }

  /* ---------- planner events ---------- */
  var toastT;
  function toast(msg) { var t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 1800); }
  function copy(text, msg) {
    var done = function () { toast(msg || 'Copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() { var a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed'); } a.remove(); }
  }
  function allPrompts() { return S.shots.map(function (s, i) { return 'SHOT ' + (i + 1) + ' — ' + s.name + '\n' + buildPrompt(s, i) + '\nTransition: ' + s.trans; }).join('\n\n'); }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip[data-k]');
    if (chip) { if (chip.dataset.k === 'real') S.real = chip.dataset.v === 'On'; else S[chip.dataset.k] = chip.dataset.v; save(); if (chip.dataset.k === 'genre' || chip.dataset.k === 'mood') { render(); } else { render(); } return; }
    var a = e.target.closest('[data-a]'); if (!a) return;
    var card = a.closest('.shot'); var act = a.dataset.a;
    if (!card) return;
    var idx = S.shots.findIndex(function (s) { return s.id === card.dataset.id; }), s = S.shots[idx];
    if (!s) return;
    var r = rng(S.brief + s.id + Date.now());
    if (act === 'copy') copy(buildPrompt(s, idx), 'Prompt copied');
    else if (act === 'up' && idx > 0) { S.shots.splice(idx - 1, 0, S.shots.splice(idx, 1)[0]); }
    else if (act === 'down' && idx < S.shots.length - 1) { S.shots.splice(idx + 1, 0, S.shots.splice(idx, 1)[0]); }
    else if (act === 'lock') s.locked = !s.locked;
    else if (act === 'del') S.shots.splice(idx, 1);
    else if (act === 'roll-camera') s.camera = pick(r, forKind('Camera', s.kind)).n;
    else if (act === 'roll-lens') s.lens = pick(r, forKind('Lens', s.kind)).n;
    else if (act === 'roll-motion') s.motion = pick(r, forKind('Motion', s.kind)).n;
    else if (act === 'add') { selected = s.id; $('#library').scrollIntoView({ behavior: 'smooth' }); toast('Pick a snippet to add to shot ' + (idx + 1)); }
    else return;
    save(); render();
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'brief') { S.brief = e.target.value; save(); updateSlop(); }
    else if (e.target.id === 'dur') { S.dur = +e.target.value; $('#durOut').textContent = S.dur + 's'; save(); render(); }
    else if (e.target.id === 'count') { S.count = +e.target.value; $('#countOut').textContent = S.count; save(); }
    else if (e.target.dataset && e.target.dataset.a === 'act') {
      var id = e.target.closest('.shot').dataset.id, sh = S.shots.filter(function (x) { return x.id === id; })[0];
      if (sh) { sh.action = e.target.value; save(); e.target.closest('.shot').querySelector('.sh-prompt').textContent = buildPrompt(sh, S.shots.indexOf(sh)); }
    }
  });
  $('#plan').onclick = function () { S.salt = 1; generate(false); $('#shots').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  $('#reroll').onclick = function () { S.salt = (S.salt || 1) + 1; generate(true); toast('Re-rolled, locked shots kept'); };
  $('#sample').onclick = function () { S.brief = pick(rng(String(Date.now())), SAMPLES); S.salt = 1; generate(false); };
  $('#copyAll').onclick = function () { if (S.shots.length) copy(allPrompts(), 'All prompts copied'); };
  $('#dlTxt').onclick = function () { if (!S.shots.length) return; download('shotboard-' + slug() + '.md', '# ' + S.brief + '\n\nGenre: ' + S.genre + ' · Mood: ' + S.mood + ' · Model: ' + S.model + ' · ' + S.ratio + '\n\n' + allPrompts().replace(/^SHOT/gm, '## SHOT')); };
  $('#print').onclick = function () { window.print(); };
  $('#saveBoard').onclick = function () {
    if (!S.shots.length) { toast('Plan some shots first'); return; }
    boards.unshift({ id: Date.now(), name: S.brief.slice(0, 48), at: new Date().toISOString().slice(0, 10), state: JSON.parse(JSON.stringify(S)) });
    store.set('sb_boards', boards); renderBoards(); toast('Board saved');
  };
  function slug() { return (S.brief || 'board').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30); }
  function download(name, text) { var b = new Blob([text], { type: 'text/plain' }), u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 500); }

  /* ---------- boards ---------- */
  function renderBoards() {
    var h = $('#boardList');
    h.innerHTML = boards.length ? boards.map(function (b) {
      return '<div class="bcard"><div><b>' + esc(b.name) + '</b><small>' + b.at + ' · ' + b.state.genre + ' · ' + b.state.shots.length + ' shots · ' + esc(b.state.model) + '</small></div><div><button class="btn mini" data-b="load" data-id="' + b.id + '">Open</button><button class="btn mini" data-b="del" data-id="' + b.id + '">Delete</button></div></div>';
    }).join('') : '<div class="empty"><b>No saved boards</b><span>Plan a scene, then press Save board.</span></div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-b]'); if (!b) return;
    var i = boards.findIndex(function (x) { return String(x.id) === b.dataset.id; }); if (i < 0) return;
    if (b.dataset.b === 'del') { boards.splice(i, 1); store.set('sb_boards', boards); renderBoards(); }
    else { S = JSON.parse(JSON.stringify(boards[i].state)); save(); render(); $('#planner').scrollIntoView({ behavior: 'smooth' }); toast('Board opened'); }
  });
  $('#exportAll').onclick = function () { download('shotboard-boards.json', JSON.stringify(boards, null, 1)); };
  $('#importFile').onchange = function (e) {
    var f = e.target.files[0]; if (!f) return; var fr = new FileReader();
    fr.onload = function () { try { var j = JSON.parse(fr.result); if (Array.isArray(j)) { boards = j.concat(boards); store.set('sb_boards', boards); renderBoards(); toast('Imported ' + j.length + ' boards'); } } catch (x) { toast('Not a Shotboard file'); } };
    fr.readAsText(f); e.target.value = '';
  };

  /* ---------- library ---------- */
  var lib = { cat: 'All', q: '' };
  function renderLib() {
    var cats = ['All'].concat(['Camera', 'Lens', 'Light', 'Look', 'Motion', 'Continuity', 'Avoid', 'Realism']);
    $('#libCats').innerHTML = cats.map(function (c) { return '<button type="button" class="chip' + (lib.cat === c ? ' on' : '') + '" data-lc="' + c + '">' + c + '</button>'; }).join('');
    var q = lib.q.toLowerCase();
    var list = LIB.filter(function (x) { return (lib.cat === 'All' || x.c === lib.cat) && (!q || (x.n + ' ' + x.t + ' ' + x.c).toLowerCase().indexOf(q) > -1); });
    $('#libCount').textContent = list.length + ' snippets';
    $('#libGrid').innerHTML = list.map(function (x, i) {
      return '<article class="lcard" data-i="' + LIB.indexOf(x) + '" data-cat="' + x.c + '"><span class="lc">' + x.c + '</span><b>' + esc(x.n) + '</b><p>' + esc(x.t) + '</p><div><button class="btn mini hot" data-l="copy">Copy</button><button class="btn mini" data-l="add">+ Add to shot</button></div></article>';
    }).join('') || '<div class="empty"><b>Nothing found</b><span>Try another word.</span></div>';
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-lc]'); if (c) { lib.cat = c.dataset.lc; renderLib(); return; }
    var l = e.target.closest('[data-l]'); if (!l) return;
    var x = LIB[+l.closest('.lcard').dataset.i];
    if (l.dataset.l === 'copy') copy(x.t, 'Snippet copied');
    else {
      var s = S.shots.filter(function (z) { return z.id === selected; })[0] || S.shots[0];
      if (!s) { toast('Plan some shots first'); return; }
      if (x.c === 'Camera') s.camera = x.n; else if (x.c === 'Lens') s.lens = x.n; else if (x.c === 'Motion') s.motion = x.n;
      else if (x.c === 'Light') S.light = x; else if (x.c === 'Look') S.look = x; else s.extra.push(x.t);
      save(); render(); toast('Added "' + x.n + '" to shot ' + (S.shots.indexOf(s) + 1));
    }
  });
  $('#libQ').oninput = function (e) { lib.q = e.target.value; renderLib(); };

  /* ---------- hero: live prompt typing ---------- */
  (function hero() {
    var el = $('#heroPrompt'), tag = $('#heroTag'); if (!el) return;
    var i = 0, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    function next() {
      var brief = SAMPLES[i % SAMPLES.length], save0 = S, tmp = { brief: brief, genre: 'Cinematic story', mood: MOODS[i % MOODS.length], model: 'Seedance', ratio: '9:16', dur: 5, count: 3, salt: 1, shots: [] };
      var r = rng(brief + i);
      var look = pick(r, byCat('Look').filter(function (x) { return x.m.indexOf(tmp.mood) > -1; }).concat(byCat('Look')).slice(0, 1)), light = byCat('Light').filter(function (x) { return x.m.indexOf(tmp.mood) > -1; })[0] || byCat('Light')[0];
      var cam = pick(r, forKind('Camera', 'wide')), len = pick(r, forKind('Lens', 'wide'));
      var text = brief + '. Camera: ' + cam.t + '. Lens: ' + len.t + '. Lighting: ' + light.t + '. Look: ' + look.t + '. 5s, 9:16.';
      tag.textContent = 'Seedance · ' + tmp.mood;
      if (reduce) { el.textContent = text; } else { var k = 0; el.textContent = ''; var t = setInterval(function () { k += 3; el.textContent = text.slice(0, k); if (k >= text.length) clearInterval(t); }, 24); }
      i++;
    }
    next(); setInterval(next, 7500);
  })();

  /* ---------- motion: reveal, tilt, marquee, cursor glow ---------- */
  (function motion() {
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: .12 }) : null;
    $$('.reveal').forEach(function (n) { io ? io.observe(n) : n.classList.add('in'); });
    document.addEventListener('pointermove', function (e) {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px'); document.documentElement.style.setProperty('--my', e.clientY + 'px');
      var t = e.target.closest && e.target.closest('.tilt'); $$('.tilt').forEach(function (n) { if (n !== t) n.style.transform = ''; });
      if (t && !(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches)) { var b = t.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; t.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateZ(0)'; }
    });
    var m = $('#marq'); if (m) { var w = LIB.filter(function (x) { return x.c === 'Camera'; }).map(function (x) { return x.n; }).join('  ✦  ') + '  ✦  '; m.innerHTML = '<span>' + w + '</span><span>' + w + '</span>'; }
  })();

  /* media slots: hide when the file is missing so the CSS art shows instead */
  $$('img[data-slot],video[data-slot]').forEach(function (n) { n.addEventListener('error', function () { n.style.display = 'none'; }, true); $$('source', n).forEach(function (s) { s.addEventListener('error', function () { n.style.display = 'none'; }); }); });


  /* ---------- realism section ---------- */
  function renderRealism() {
    var cg = $('#cmpGrid'); if (!cg) return;
    cg.innerHTML = PAIRS.map(function (p, i) {
      return '<article class="cmp reveal in"><div class="cmp-img" data-i="' + i + '"><img src="' + p.real + '" alt="Realistic version: ' + esc(p.title) + '"><img class="top" src="' + p.slop + '" alt="Slop version: ' + esc(p.title) + '"><span class="badge b1">AI slop</span><span class="badge b2">Real</span><div class="bar"></div><input type="range" min="2" max="98" value="50" aria-label="Compare slop and real"></div>' +
        '<div class="cmp-meta"><h3>' + esc(p.title) + '</h3><div class="pbox s"><em>Slop prompt</em>' + esc(p.slopPrompt) + '</div><div class="pbox r"><em>Realistic prompt</em>' + esc(p.realPrompt) + '<br><button class="btn mini hot" data-cp="' + i + '" type="button">Copy realistic prompt</button></div><ul class="tells">' + p.tells.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div></article>';
    }).join('') || '<div class="empty"><b>Examples loading</b></div>';
    $('#rules').innerHTML = PRINCIPLES.map(function (r, i) { return '<div class="rule"><span>' + (i + 1) + '</span><b>' + esc(r[0]) + '</b><p>' + esc(r[1]) + '</p></div>'; }).join('');
    $('#fixGrid').innerHTML = SLOP_FIX.map(function (f) { return '<div class="fx"><s>' + esc(f[0]) + '</s><span>' + esc(f[1]) + '</span></div>'; }).join('');
  }
  document.addEventListener('input', function (e) {
    if (e.target.matches && e.target.matches('.cmp-img input')) e.target.closest('.cmp-img').style.setProperty('--p', e.target.value + '%');
  });
  document.addEventListener('click', function (e) {
    var cp = e.target.closest('[data-cp]'); if (cp) { copy(PAIRS[+cp.dataset.cp].realPrompt, 'Realistic prompt copied'); return; }
    if (e.target.closest('#cleanBrief')) { S.brief = deslop(S.brief); save(); render(); toast('Slop words removed'); return; }
    if (e.target.closest('#turnReal')) { S.real = true; save(); render(); $('#planner').scrollIntoView({ behavior: 'smooth' }); toast('Realism mode on'); }
  });
  renderRealism();
  render(); renderLib(); renderBoards();
  if (!S.shots.length) generate(false);
})();
