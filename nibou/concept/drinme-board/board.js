(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- data ---------- */
  var FL = {
    mango: { name: 'Mango', lines: ['Mango'], sub: 'MANGGA', passion: 'Music', badge: '#F7931E', vc: '#F7931E', top: '#FFB02E', bot: '#3FB34F', bg: '#FF9D1C', docs: ['d-guitar', 'd-boom', 'd-note'], fruit: 'd-mango' },
    lemon: { name: 'Lemon-ade', lines: ['Lemon', '-ade'], sub: 'LIMAU', passion: 'Art', badge: '#2E9FA8', vc: '#2E9FA8', top: '#35C6D6', bot: '#FFE957', bg: '#2EC4D6', docs: ['d-palette', 'd-spray', 'd-brush'], fruit: 'd-lemon' },
    passion: { name: 'Passion Fruit', lines: ['Passion', 'Fruit'], sub: 'MARKISA', passion: 'Gaming', badge: '#6C2BD9', vc: '#6C2BD9', top: '#7B2FF7', bot: '#FFB300', bg: '#7B2FF7', docs: ['d-pad', 'd-joy', 'd-bolt'], fruit: 'd-passion' },
    berry: { name: 'Mix Berry', lines: ['Mix', 'Berry'], sub: 'BERI CAMPUR', passion: 'Sport', badge: '#D8223A', vc: '#D8223A', top: '#2E2B96', bot: '#D8223A', bg: '#2E2B96', docs: ['d-ball', 'd-glove', 'd-berry'], fruit: 'd-berry' }
  };
  var CORE = [
    ['Drinme Red', '#E2272E', '#fff'], ['Sun Dot', '#F5A31A', '#1B1033'], ['Pop Pink', '#F0186F', '#fff'], ['Ink', '#1B1033', '#fff'], ['Cream', '#FFF5E6', '#1B1033']
  ];
  var WORLDS = {
    mango: [['Mango', '#FF9D1C', '#1B1033'], ['Leaf', '#3FB34F', '#fff'], ['Sticker Yellow', '#FFEE4A', '#1B1033'], ['Glow', '#FFE0AC', '#1B1033']],
    lemon: [['Lemon-ade', '#2EC4D6', '#1B1033'], ['Lemon', '#FFE957', '#1B1033'], ['Splash', '#9BE7F2', '#1B1033'], ['Mint', '#C9F2F7', '#1B1033']],
    berry: [['Mix Berry', '#2E2B96', '#fff'], ['Berry Red', '#D8223A', '#fff'], ['Hot Pink', '#F0186F', '#fff'], ['Haze', '#CFCDFB', '#1B1033']]
  };
  var DOODLES = [['d-guitar', 'Guitar'], ['d-boom', 'Boom box'], ['d-palette', 'Palette'], ['d-spray', 'Spray'], ['d-brush', 'Brush'], ['d-ball', 'Football'], ['d-glove', 'Glove'], ['d-phones', 'Headphones'], ['d-mic', 'Mic'], ['d-piano', 'Piano'], ['d-camera', 'Camera'], ['d-skate', 'Skate'], ['d-mango', 'Mango'], ['d-lemon', 'Lemon'], ['d-berry', 'Strawberry'], ['d-blue', 'Blueberry'], ['d-note', 'Notes'], ['d-drop', 'Splash'], ['d-keys', 'Keys'], ['d-pencil', 'Pencil'], ['d-broom', 'Broom'], ['d-tube', 'Paint'], ['d-wave', 'Wave'], ['d-board', 'Surfboard'], ['d-burst', 'Burst'], ['d-cube', 'Jelly cube'], ['d-pad', 'Controller'], ['d-joy', 'Joystick'], ['d-pheart', 'Pixel heart'], ['d-invader', 'Invader']];

  function use(id, extra) { return '<svg viewBox="0 0 100 100"' + (extra || '') + '><use href="#' + id + '"/></svg>'; }
  var toastT; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 1600); }

  /* ---------- pouch generator: redrawn from the campaign artwork, with clear lettering ---------- */
  var uid = 0;
  var BODY = 'M40 64 C70 56 130 56 160 64 L170 288 C140 310 60 310 30 288 Z';
  function U(id, x, y, w, h, rot, st) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ' ' + w / 2 + ' ' + h / 2 + ')"><use href="#' + id + '" width="' + w + '" height="' + h + '"' + (st ? ' style="' + st + '"' : '') + '/></g>'; }
  var VIT = { mango: 'M10 24C8 8 26 0 42 6c14 6 18 22 12 34C48 50 30 54 18 46 12 42 10 34 10 24z', lemon: 'M4 28C4 14 16 6 30 6c4-4 9-5 13-3-1 3-2 6-4 8 11 4 19 10 19 18 0 13-14 21-28 21S4 41 4 28z', berry: 'M30 54C12 44 2 32 4 20 6 10 16 8 24 10c3 1 4 1 6 1s3 0 6-1c8-2 18 0 20 10 2 12-8 24-26 34z', passion: 'M30 4a25 25 0 1 0 .01 0z' };
  function lettering(lines, size, cx, y0, step) {
    var out = '';
    for (var i = 7; i >= 1; i--) lines.forEach(function (ln, n) { out += '<text x="' + (cx + i * 0.9) + '" y="' + (y0 + n * step + i * 1.15) + '" text-anchor="middle" font-family="Bowlby One, Arial Black, sans-serif" font-size="' + Math.min(size, Math.floor(134 / (ln.length * 0.9))) + '" fill="#1B1033" stroke="#1B1033" stroke-width="5" stroke-linejoin="round">' + ln + '</text>'; });
    lines.forEach(function (ln, n) { var fs = Math.min(size, Math.floor(134 / (ln.length * 0.9))); out += '<text x="' + cx + '" y="' + (y0 + n * step) + '" text-anchor="middle" font-family="Bowlby One, Arial Black, sans-serif" font-size="' + fs + '" fill="#FFEE4A" stroke="#1B1033" stroke-width="5.5" stroke-linejoin="round" paint-order="stroke fill">' + ln + '</text><text x="' + (cx - 1) + '" y="' + (y0 + n * step - 1) + '" text-anchor="middle" font-family="Bowlby One, Arial Black, sans-serif" font-size="' + fs + '" fill="none" stroke="#fff" stroke-width=".8" stroke-opacity=".85">' + ln + '</text>'; });
    return out;
  }
  function art(k, id) {
    var s = '';
    if (k === 'mango') {
      s += '<rect y="56" width="200" height="260" fill="#F7931E"/><path d="M0 238 C50 216 100 252 200 222 L200 320 L0 320z" fill="#2F9E3F"/><path d="M0 262 C60 244 110 276 200 250" stroke="#52C25D" stroke-width="5" fill="none"/>';
      s += U('d-keys', 22, 206, 162, 32, -9) + U('d-boom', 82, 70, 56, 56, 0) + U('d-phones', 30, 116, 46, 46, -10) + U('d-cube', 128, 98, 20, 20, 0, '--c:#FFE14D') + U('d-note', 44, 262, 22, 22, 0) + U('d-cube', 70, 262, 22, 22, 0, '--c:#FFE14D');
    } else if (k === 'lemon') {
      s += '<rect y="56" width="200" height="260" fill="url(#g' + id + ')"/><path d="M32 150 C30 224 80 272 168 286 L178 304 L38 304 C16 262 14 200 28 148z" fill="#4FAE5A"/><path d="M58 184 C62 224 92 252 142 268" stroke="#2F7F3A" stroke-width="3" fill="none"/><path d="M46 170 C48 210 70 240 100 256" stroke="#83CF8B" stroke-width="3" fill="none"/>';
      s += U('d-palette', 34, 108, 40, 40, -8) + U('d-spray2', 114, 70, 52, 52, 10) + U('d-drop', 100, 74, 18, 18, 0) + U('d-broom', 80, 256, 38, 38, -10) + U('d-tube', 30, 206, 42, 42, 0) + U('d-cube', 88, 100, 20, 20, 0, '--c:#C9ECB8') + U('d-cube', 142, 154, 20, 20, 0, '--c:#C9ECB8') + U('d-drop', 40, 128, 16, 16, 0);
    } else if (k === 'berry') {
      s += '<rect y="56" width="200" height="260" fill="#2B2A7A"/><path d="M0 220 C40 240 72 208 112 232 C150 254 180 238 200 228 L200 320 L0 320z" fill="#C8202F"/>';
      s += U('d-wave', 24, 198, 96, 96, 0) + U('d-board', 96, 238, 80, 80, 0) + U('d-ball', 34, 72, 42, 42, 0) + U('d-berry', 92, 74, 30, 30, 0) + U('d-glove', 108, 92, 42, 42, -12) + U('d-glove', 132, 96, 42, 42, 12) + U('d-burst', 148, 148, 30, 30, 0) + U('d-blue', 32, 252, 32, 32, 0) + U('d-cube', 142, 176, 22, 22, 0, '--c:#F78FB3') + U('d-cube', 60, 130, 18, 18, 0, '--c:#F78FB3');
    } else {
      s += '<rect y="56" width="200" height="260" fill="#6C2BD9"/><path d="M0 56L60 56 0 116zM200 130L200 190 140 190z" fill="#fff" fill-opacity=".07"/><path d="M0 236 C44 214 96 250 200 220 L200 320 L0 320z" fill="#FFB300"/><path d="M0 260 C60 242 112 274 200 248" stroke="#FFD54A" stroke-width="5" fill="none"/>';
      s += U('d-keys', 22, 206, 162, 32, -9, '') + U('d-pad', 28, 108, 66, 66, -10) + U('d-joy', 118, 96, 44, 44, 8) + U('d-invader', 92, 72, 26, 26, 0) + U('d-pheart', 34, 250, 26, 26, 0) + U('d-pheart', 62, 262, 18, 18, 0) + U('d-passion', 76, 246, 40, 40, 0) + U('d-cube', 130, 98, 20, 20, 0, '--c:#C7A8FF');
    }
    return s;
  }
  function front(k) {
    if (k === 'mango') return U('d-guitar2', 126, 170, 52, 52, 10) + U('d-bolt', 112, 178, 18, 18, 15) + U('d-bolt', 166, 176, 16, 16, -10);
    if (k === 'lemon') return U('d-pencil', 28, 188, 56, 56, -6) + U('d-brush', 130, 168, 54, 54, 8);
    if (k === 'passion') return U('d-bolt', 150, 176, 18, 18, 15) + U('d-bolt', 112, 176, 16, 16, -10);
    return '';
  }
  function pouch(k) {
    var F = FL[k], id = 'p' + (++uid), lines = F.lines, two = lines.length > 1;
    var s = '<svg class="pz" viewBox="0 0 200 340" role="img" aria-label="Drinme ' + F.name + ' jelly drink pouch">';
    s += '<defs><linearGradient id="g' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FCFD6"/><stop offset=".62" stop-color="#9ADAC9"/><stop offset="1" stop-color="#EFEBA4"/></linearGradient><clipPath id="c' + id + '"><path d="' + BODY + '"/></clipPath></defs>';
    s += '<g class="pj"><rect x="82" y="8" width="36" height="26" rx="5" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><path d="' + BODY + '" fill="#fff" stroke="#fff" stroke-width="16" stroke-linejoin="round"/>';
    s += '<rect x="86" y="30" width="28" height="36" fill="#EDEDF4"/><rect x="82" y="8" width="36" height="26" rx="5" fill="#fff"/><path d="M88 14v14M96 14v14M104 14v14M112 14v14" stroke="#D5D5E2" stroke-width="2"/>';
    s += '<g clip-path="url(#c' + id + ')">' + art(k, id);
    s += '<g transform="rotate(-8 100 190)">' + lettering(lines, two ? 36 : 40, 100, two ? 158 : 176, 36) + '<text x="100" y="' + (two ? 230 : 202) + '" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="11" letter-spacing="2.6" fill="#fff" stroke="#1B1033" stroke-width="3.4" paint-order="stroke fill">' + F.sub + '</text>' + front(k) + '</g>';
    s += '<path d="M44 70c-4 60-6 110-2 180" stroke="#fff" stroke-opacity=".22" stroke-width="7" stroke-linecap="round" fill="none"/></g>';
    /* hex badge */
    s += '<g transform="translate(42 68)"><polygon points="20,0 40,11 40,33 20,44 0,33 0,11" fill="#fff" stroke="#1B1033" stroke-width="2.6"/><text x="20" y="18" text-anchor="middle" font-family="Bowlby One, sans-serif" font-size="9" fill="' + (F.badge || '#F0186F') + '">JELLY</text><text x="20" y="29" text-anchor="middle" font-family="Bowlby One, sans-serif" font-size="9" fill="' + (F.badge || '#F0186F') + '">DRINK</text><text x="20" y="36" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="3.1" fill="#1B1033">MINUMAN JELLY</text></g>';
    /* logo */
    s += '<svg x="108" y="66" width="46" height="20" viewBox="0 0 1417 627" style="--logo:' + (k === 'berry' ? '#FF4B57' : k === 'passion' ? '#fff' : '#E2272E') + ';--dot:#F5A31A;--dot2:' + (k === 'passion' ? '#fff' : '#E2272E') + '"><use href="#logo"/></svg>';
    /* vitamin C */
    s += '<g transform="translate(104 240) scale(1.06)"><path d="' + VIT[k] + '" fill="#fff" stroke="#1B1033" stroke-width="2.6" stroke-linejoin="round"/><text x="22" y="17" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="4.4" fill="#1B1033">RICH IN/</text><text x="22" y="22" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="4.4" fill="#1B1033">KAYA DENGAN</text><text x="20" y="32" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="6.8" fill="#1B1033">VITAMIN</text><text x="41" y="37" text-anchor="middle" font-family="Bowlby One, sans-serif" font-size="16" fill="' + (F.vc || '#F0186F') + '" stroke="#1B1033" stroke-width="1.6" paint-order="stroke fill">C</text></g>';
    /* legal micro */
    s += '<g fill="#fff" fill-opacity=".85" font-family="Nunito, sans-serif" font-weight="800" font-size="4.2"><text x="40" y="287">NET WEIGHT/</text><text x="40" y="293">BERAT BERSIH 150GM</text></g>';
    s += '</g></svg>';
    return s;
  }  function fillPouches() { $$('.pw[data-k]').forEach(function (el) { el.innerHTML = pouch(el.dataset.k); el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-label', 'Squeeze the ' + FL[el.dataset.k].name + ' pouch'); }); }

  /* splash particles */
  var COLS = ['#FFEE4A', '#F0186F', '#2EC4D6', '#fff', '#FF9D1C'];
  function splash(host, x, y, n) {
    if (reduce) return; n = n || 14;
    for (var i = 0; i < n; i++) {
      var d = document.createElement('i'); d.className = 'dot'; var sz = 6 + Math.random() * 10; d.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;left:' + x + 'px;top:' + y + 'px;background:' + COLS[i % COLS.length] + ';border:2px solid #1B1033';
      host.appendChild(d); var a = Math.random() * Math.PI * 2, r = 50 + Math.random() * 80;
      d.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + Math.cos(a) * r + 'px),calc(-50% + ' + (Math.sin(a) * r - 20) + 'px)) scale(1)', opacity: 1, offset: .6 }, { transform: 'translate(calc(-50% + ' + Math.cos(a) * r * 1.1 + 'px),calc(-50% + ' + (Math.sin(a) * r + 30) + 'px)) scale(.6)', opacity: 0 }], { duration: 700 + Math.random() * 200, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(d);
    }
  }
  function squeeze(el) { el.classList.remove('sq'); void el.offsetWidth; el.classList.add('sq'); var r = el.getBoundingClientRect(); var h = el.closest('.post, .pstage, .mbox') || el; h.style.position = h.style.position || 'relative'; var hr = h.getBoundingClientRect(); splash(h, r.left - hr.left + r.width / 2, r.top - hr.top + r.height * .18, 14); }
  document.addEventListener('click', function (e) { var p = e.target.closest('.pw'); if (p) squeeze(p); });
  document.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pw')) { e.preventDefault(); squeeze(e.target); } });
  /* tilt on pstage pouches */
  if (!reduce) $$('#pstage .pw').forEach(function (p) {
    p.addEventListener('pointermove', function (e) { var r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; p.style.transform = 'rotateY(' + x * 26 + 'deg) rotateX(' + -y * 14 + 'deg) translateY(-8px)'; });
    p.addEventListener('pointerleave', function () { p.style.transform = ''; });
  });

  /* ---------- swatches ---------- */
  function swatch(arr, host, cls) {
    arr.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.style.background = c[1]; b.style.color = c[2]; b.innerHTML = '<b>' + c[0] + '</b><small>' + c[1] + '</small>'; b.setAttribute('aria-label', c[0] + ' ' + c[1] + ', copy');
      b.addEventListener('click', function () { try { navigator.clipboard.writeText(c[1]); } catch (e) { } toast('Copied ' + c[1]); });
      host.appendChild(b);
    });
  }
  swatch(CORE, $('#core')); Object.keys(WORLDS).forEach(function (k) { swatch(WORLDS[k], $('#sw-' + k)); });

  /* ---------- doodle grid + patterns ---------- */
  var dg = $('#dgrid');
  DOODLES.forEach(function (d) { var t = document.createElement('button'); t.type = 'button'; t.className = 'dtile reveal'; t.innerHTML = use(d[0]) + '<small>' + d[1] + '</small>'; t.addEventListener('click', function () { var r = t.getBoundingClientRect(); t.style.position = 'relative'; splash(t, r.width / 2, r.height / 2, 10); }); dg.appendChild(t); });
  function pattern(el, list, bg) {
    el.style.background = bg; var w = el.clientWidth || 360, h = 200, i = 0;
    for (var y = 0; y < 5; y++) for (var x = 0; x < 8; x++) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 100 100'); s.innerHTML = '<use href="#' + list[i % list.length] + '"/>'; var off = (y % 2) * 24; s.style.left = (x * 62 + off - 10) + 'px'; s.style.top = (y * 52 - 8) + 'px'; s.style.transform = 'rotate(' + ((i * 37) % 40 - 20) + 'deg)'; s.style.width = s.style.height = (38 + (i * 7) % 16) + 'px'; el.insertBefore(s, el.firstChild); i++; }
  }
  pattern($('.mangoP'), ['d-guitar', 'd-note', 'd-mango', 'd-boom', 'd-phones', 'd-spark'], '#FF9D1C');
  pattern($('.lemP'), ['d-palette', 'd-lemon', 'd-brush', 'd-spray', 'd-drop', 'd-spark'], '#2EC4D6');
  pattern($('.berryP'), ['d-ball', 'd-glove', 'd-berry', 'd-blue', 'd-skate', 'd-spark'], '#2E2B96');

  /* ---------- hero floaters ---------- */
  var hf = $('.hfloat'), hl = ['d-guitar', 'd-ball', 'd-palette', 'd-mango', 'd-glove', 'd-boom', 'd-lemon', 'd-berry', 'd-spray', 'd-note', 'd-phones', 'd-camera'];
  var pos = [[6, 14], [86, 12], [14, 70], [80, 68], [3, 42], [92, 40], [28, 8], [66, 6], [34, 80], [60, 82], [20, 30], [74, 28]];
  hl.forEach(function (id, i) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 100 100'); s.innerHTML = '<use href="#' + id + '"/>'; s.style.cssText = '--x:' + pos[i][0] + '%;--y:' + pos[i][1] + '%;--s:' + (54 + (i * 11) % 44) + 'px;--r:' + ((i * 23) % 50 - 25) + 'deg;--d:' + (3 + (i % 4)) + 's'; hf.appendChild(s); });

  /* ---------- ring pop ---------- */
  var rd = $('#ringdemo'); rd.addEventListener('click', function () { rd.classList.remove('pop'); void rd.offsetWidth; rd.classList.add('pop'); splash(rd, rd.clientWidth / 2, rd.clientHeight / 2, 12); });

  /* ---------- sticker lettering generator ---------- */
  var gw = $('#gworld'), gst = $('#gstage'), gout = $('#gout'), gin = $('#gtext'), gdd = $('#gdoodles'), cur = 'mango';
  Object.keys(FL).forEach(function (k) { var b = document.createElement('button'); b.type = 'button'; b.className = 'gb' + (k === 'mango' ? ' on' : ''); b.style.background = FL[k].bg; b.setAttribute('aria-label', FL[k].name + ' world'); b.addEventListener('click', function () { cur = k; $$('.gb', gw).forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); gst.style.background = FL[k].bg; scatter(); }); gw.appendChild(b); });
  function scatter() {
    gdd.innerHTML = ''; var F = FL[cur], list = F.docs.concat([F.fruit, 'd-spark', 'd-drop']), slots = [[4, 8], [78, 6], [8, 60], [80, 58], [42, 2], [44, 74], [66, 36], [20, 30]];
    slots.forEach(function (p, i) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 100 100'); s.innerHTML = '<use href="#' + list[(i + Math.floor(Math.random() * 3)) % list.length] + '"/>'; s.style.cssText = '--x:' + p[0] + '%;--y:' + p[1] + '%;--s:' + (52 + Math.random() * 40) + 'px;--r:' + (Math.random() * 50 - 25) + 'deg'; gdd.appendChild(s); });
  }
  gst.style.background = FL.mango.bg; scatter();
  gin.addEventListener('input', function () { gout.textContent = gin.value.trim() || 'Drinme'; gout.classList.remove('bump'); void gout.offsetWidth; gout.classList.add('bump'); });
  gout.addEventListener('click', scatter);

  /* ---------- poll ---------- */
  var PK = { Gaming: 'Passion Fruit. Fuel for the next level.', Music: 'Mango. Fuel for the playlist.', Art: 'Lemon-ade. Fuel for the sketchbook.', Sport: 'Mix Berry. Fuel for the final whistle.' };
  $$('.po').forEach(function (b) { b.addEventListener('click', function () { $('#sres').textContent = PK[b.dataset.v]; splash(b.closest('.story'), b.offsetLeft + b.offsetWidth / 2, b.offsetTop + b.offsetHeight / 2, 12); }); });

  /* ---------- motion demos ---------- */
  $$('.mbox').forEach(function (m) {
    $('.mb', m).addEventListener('click', function () {
      var t = m.dataset.m;
      if (t === 'squish') { var p = $('.mpouch', m); p.classList.remove('sq'); void p.offsetWidth; p.classList.add('sq'); }
      if (t === 'splash') { var s = $('#msplash'); splash(s, s.clientWidth / 2, s.clientHeight / 2, 22); }
      if (t === 'wobble') { var w = $('.mwob', m); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go'); }
    });
  });


  /* ---------- new flavour showcase ---------- */
  var NF = { mango: { line: 'Turn it up. Slurp it down.' }, lemon: { line: 'Draw outside the lines.' }, berry: { line: 'Game on. Squeeze harder.' }, passion: { line: 'Press start. Squeeze.' } };
  var NFSW = { passion: [['Violet', '#7B2FF7'], ['Pulp', '#FFB300'], ['Pop Pink', '#F0186F'], ['Rind', '#F8EAF9']] };
  Object.keys(WORLDS).forEach(function (k) { NFSW[k] = WORLDS[k].map(function (c) { return [c[0], c[1]]; }); });
  var nfs = $('#nfshow'), nfTabs = $('#nftabs'), nfOrbit = $('#nforbit'), nfCur = '';
  function showNF(k) {
    nfCur = k; var F = FL[k]; nfs.dataset.k = k; nfs.style.setProperty('--fc', F.bg);
    var pw = $('#nfpouch'); pw.dataset.k = k; pw.innerHTML = pouch(k); pw.setAttribute('aria-label', 'Squeeze the ' + F.name + ' pouch'); pw.classList.remove('sq'); void pw.offsetWidth; if (!reduce) pw.classList.add('sq');
    $('#nfname').textContent = F.name; $('#nfp').textContent = F.passion; $('#nfline').textContent = NF[k].line; $('#nfnew').style.display = k === 'passion' ? '' : 'none';
    $('#nfsw').innerHTML = NFSW[k].map(function (c) { return '<span><i style="background:' + c[1] + '"></i>' + c[0] + ' ' + c[1] + '</span>'; }).join('');
    $$('.nftab', nfTabs).forEach(function (t) { t.setAttribute('aria-selected', t.dataset.k === k ? 'true' : 'false'); });
    nfOrbit.innerHTML = ''; var list = F.docs.concat([F.fruit, 'd-spark', 'd-drop', F.docs[0]]), slots = [[4, 10], [40, 4], [4, 62], [44, 76], [30, 38], [12, 36], [48, 52]];
    slots.forEach(function (p, i) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 100 100'); s.innerHTML = '<use href="#' + list[i % list.length] + '"/>'; s.style.cssText = '--x:' + p[0] + '%;--y:' + p[1] + '%;--s:' + (56 + (i * 13) % 44) + 'px;--r:' + ((i * 29) % 50 - 25) + 'deg;--d:' + (3 + i % 3) + 's'; nfOrbit.appendChild(s); });
  }
  ['mango', 'lemon', 'berry', 'passion'].forEach(function (k) { var b = document.createElement('button'); b.type = 'button'; b.className = 'nftab'; b.dataset.k = k; b.setAttribute('role', 'tab'); b.innerHTML = FL[k].name + (k === 'passion' ? '<em>NEW</em>' : ''); b.addEventListener('click', function () { showNF(k); }); nfTabs.appendChild(b); });
  showNF('passion');
  /* ---------- reveal ---------- */
  fillPouches();
  var rv = $$('.reveal'); rv.forEach(function (el, i) { el.style.setProperty('--rd', ((i % 4) * 0.07) + 's'); });
  if ('IntersectionObserver' in window && !reduce) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .1, rootMargin: '0px 0px -5% 0px' }); rv.forEach(function (el) { io.observe(el); }); } else rv.forEach(function (el) { el.classList.add('in'); });
  function sweep() { rv.forEach(function (el) { if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add('in'); }); } addEventListener('scroll', sweep, { passive: true }); sweep();
})();
