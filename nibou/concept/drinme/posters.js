(function () {
  'use strict';
  var W = 1080, H = 1350, INK = '#1B1033', SC = 1, BL = 0;
  var $ = function (s) { return document.querySelector(s); };
  function load(src) { return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { rej(new Error('load ' + src)); }; i.src = src; }); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  var POSTERS = [
    { key: 'mango', name: 'Mango', pouch: 'assets/pouch-mango.png', bg: '#3BB54A', bg2: '#2FA03F', script: "Let's jam", scriptCol: '#86E52B', ghost: ['MANGO'], ghostFill: 'rgba(255,255,255,.10)', ghostLine: 'rgba(255,255,255,.22)', head: ['TURN IT UP.', 'SLURP IT DOWN.'], fill: '#FFEE4A', sub: 'MANGGA  ·  RICH IN VITAMIN C', lab: '#ffffff', dots: ['#FFEE4A', '#86E52B', '#ffffff'], px: 600, sx: 64, sa: 'left', decor: 'mango', back: [{ k: 'mango-br', flip: 1, x: 0, y: 470, w: 300, b: 5 }, { k: 'mango-right', x: 750, y: 380, w: 330, b: 4 }], front: [{ k: 'mango-tl', r180: 1, x: 700, y: 950, w: 380 }, { k: 'mango-bl', x: 0, y: 1090, w: 450 }], pback: [{ k: 'mango-br', flip: 1, x: 0, y: 520, w: 300, b: 5 }, { k: 'mango-right', x: 750, y: 420, w: 330, b: 4 }], pfront: [{ k: 'mango-tl', r180: 1, x: 700, y: 1120, w: 380 }, { k: 'mango-bl', x: 0, y: 1262, w: 450 }], sback: [{ k: 'mango-br', flip: 1, x: 0, y: 780, w: 340, b: 5 }, { k: 'mango-right', x: 730, y: 620, w: 360, b: 4 }], sfront: [{ k: 'mango-tl', r180: 1, x: 640, y: 1480, w: 440 }, { k: 'mango-bl', x: 0, y: 1345, w: 520 }] },
    { key: 'lemonade', name: 'Lemon-ade', pouch: 'assets/pouch-lemonade.png', bg: '#FFF200', bg2: '#FFE600', script: "Let's create", scriptCol: '#17EDA0', ghost: ['LEMON', '-ADE'], ghostFill: 'rgba(255,255,255,.28)', ghostLine: 'rgba(23,237,160,.55)', head: ['DRAW OUTSIDE', 'THE LINES.'], fill: '#ffffff', sub: 'LIMAU  ·  RICH IN VITAMIN C', lab: '#1B1033', dots: ['#17EDA0', '#2EC4D6', '#ffffff'], px: 520, sx: 1030, sa: 'right', decor: 'lemon', back: [{ k: 'lemonade-left', x: 0, y: 500, w: 230, b: 5 }, { k: 'lemonade-tr', x: 840, y: 340, w: 240, b: 4 }], front: [{ k: 'lemonade-brhalf', flip: 1, x: 0, y: 860, w: 300 }, { k: 'lemonade-tophalf', r180: 1, x: 620, y: 1060, w: 460 }], pback: [{ k: 'lemonade-left', x: 0, y: 540, w: 230, b: 5 }, { k: 'lemonade-tr', x: 840, y: 380, w: 240, b: 4 }], pfront: [{ k: 'lemonade-brhalf', flip: 1, x: 0, y: 1040, w: 300 }, { k: 'lemonade-tophalf', r180: 1, x: 620, y: 1237, w: 460 }], sback: [{ k: 'lemonade-left', x: 0, y: 780, w: 260, b: 5 }, { k: 'lemonade-tr', x: 810, y: 600, w: 270, b: 4 }], sfront: [{ k: 'lemonade-brhalf', flip: 1, x: 0, y: 1230, w: 340 }, { k: 'lemonade-tophalf', r180: 1, x: 560, y: 1500, w: 520 }] },
    { key: 'mixberry', name: 'Mix Berry', pouch: 'assets/pouch-mixberry.png', bg: '#D81B60', bg2: '#C4155A', script: "Let's win", scriptCol: '#F0501E', ghost: ['MIX', 'BERRY'], ghostFill: 'rgba(255,255,255,.10)', ghostLine: 'rgba(255,255,255,.24)', head: ['GAME ON.', 'SQUEEZE HARDER.'], fill: '#FFEE4A', sub: 'MIX BERRY  ·  RICH IN VITAMIN C', lab: '#ffffff', dots: ['#FF7CB4', '#FFEE4A', '#ffffff'], px: 520, sx: 1030, sa: 'right', decor: 'berry', back: [{ k: 'mixberry-blue1', x: -40, y: 470, w: 230, b: 6 }, { k: 'mixberry-blue2', x: 900, y: 430, w: 190, b: 6 }], front: [{ k: 'mixberry-straw-left', x: 0, y: 590, w: 240 }, { k: 'mixberry-straw-br', x: 590, y: 930, w: 520 }, { k: 'mixberry-blue2', x: 930, y: 900, w: 150 }], pback: [{ k: 'mixberry-blue1', x: -40, y: 510, w: 230, b: 6 }, { k: 'mixberry-blue2', x: 900, y: 470, w: 190, b: 6 }], pfront: [{ k: 'mixberry-straw-left', x: 0, y: 640, w: 240 }, { k: 'mixberry-straw-br', x: 590, y: 1110, w: 520 }, { k: 'mixberry-blue2', x: 930, y: 1060, w: 150 }], sback: [{ k: 'mixberry-blue1', x: -50, y: 760, w: 260, b: 6 }, { k: 'mixberry-blue2', x: 890, y: 660, w: 220, b: 6 }], sfront: [{ k: 'mixberry-straw-left', x: 0, y: 940, w: 270 }, { k: 'mixberry-straw-br', x: 520, y: 1400, w: 600 }, { k: 'mixberry-blue2', x: 925, y: 1240, w: 170 }] }
  ];

  var FRUIT_KEYS = ['mango-tl', 'mango-right', 'mango-bl', 'mango-br', 'lemonade-tophalf', 'lemonade-tr', 'lemonade-left', 'lemonade-brhalf', 'mixberry-blue1', 'mixberry-blue2', 'mixberry-straw-br', 'mixberry-straw-left'];
  /* ---------- drawing helpers ---------- */
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function fitFont(c, text, font, maxW, size) { c.font = size + 'px ' + font; var w = c.measureText(text).width; return w > maxW ? Math.floor(size * maxW / w) : size; }
  function sticker(c, lines, x, y, size, fill, maxW, rot) {
    c.save(); c.translate(x, y); c.rotate((rot || -3) * Math.PI / 180); c.textBaseline = 'alphabetic'; c.lineJoin = 'round'; c.textAlign = 'left';
    var fs = size; lines.forEach(function (l) { fs = Math.min(fs, fitFont(c, l, '"Bowlby One"', maxW, size)); });
    c.font = fs + 'px "Bowlby One"'; var lh = fs * 1.02;
    lines.forEach(function (t, n) {
      var ty = n * lh;
      for (var i = 14; i >= 1; i--) { c.fillStyle = INK; c.strokeStyle = INK; c.lineWidth = fs * 0.15; c.strokeText(t, i * 0.9, ty + i * 1.1); c.fillText(t, i * 0.9, ty + i * 1.1); }
      c.strokeStyle = INK; c.lineWidth = fs * 0.15; c.strokeText(t, 0, ty); c.fillStyle = fill; c.fillText(t, 0, ty);
      c.save(); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = Math.max(2, fs * 0.02); c.translate(-fs * 0.012, -fs * 0.012); c.strokeText(t, 0, ty); c.restore();
    });
    c.restore(); return fs;
  }
  function outlinedText(c, text, x, y, size, fill, align) { c.save(); c.font = '900 ' + size + 'px "Nunito"'; c.textAlign = align || 'left'; c.lineJoin = 'round'; c.lineWidth = size * 0.28; c.strokeStyle = INK; c.strokeText(text, x, y); c.fillStyle = fill; c.fillText(text, x, y); c.restore(); }
  function cube(c, x, y, s, col, rot) {
    c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.scale(s / 100, s / 100); c.lineJoin = 'round'; c.lineWidth = 6; c.strokeStyle = INK;
    function poly(p, f, a) { c.beginPath(); p.forEach(function (q, i) { i ? c.lineTo(q[0] - 50, q[1] - 50) : c.moveTo(q[0] - 50, q[1] - 50); }); c.closePath(); c.fillStyle = f; c.fill(); if (a) { c.fillStyle = a; c.fill(); } c.stroke(); }
    poly([[10, 28], [50, 48], [50, 92], [10, 72]], col, 'rgba(0,0,0,.16)'); poly([[90, 28], [50, 48], [50, 92], [90, 72]], col, 'rgba(0,0,0,.32)'); poly([[50, 8], [90, 28], [50, 48], [10, 28]], col, 'rgba(255,255,255,.35)');
    c.restore();
  }
  function drop(c, x, y, s, col, rot) {
    c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.scale(s / 100, s / 100); c.lineJoin = 'round'; c.lineWidth = 6; c.strokeStyle = INK;
    c.beginPath(); c.moveTo(0, -46); c.bezierCurveTo(-16, -18, -34, -2, -34, 18); c.arc(0, 18, 34, Math.PI, 0, true); c.bezierCurveTo(34, -2, 16, -18, 0, -46); c.closePath(); c.fillStyle = col; c.fill(); c.stroke();
    c.beginPath(); c.arc(0, 18, 20, Math.PI * .6, Math.PI * .95); c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 6; c.stroke(); c.restore();
  }
  function spark(c, x, y, s, rot) {
    c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.scale(s / 100, s / 100); c.lineJoin = 'round'; c.lineWidth = 6; c.strokeStyle = INK; c.fillStyle = '#fff';
    c.beginPath(); c.moveTo(0, -48); c.quadraticCurveTo(4, -6, 48, 0); c.quadraticCurveTo(4, 6, 0, 48); c.quadraticCurveTo(-4, 6, -48, 0); c.quadraticCurveTo(-4, -6, 0, -48); c.closePath(); c.fill(); c.stroke(); c.restore();
  }
  function lemonSlice(c, x, y, s, rot) {
    c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.scale(s / 100, s / 100); c.lineWidth = 6; c.strokeStyle = INK;
    c.beginPath(); c.arc(0, 0, 46, 0, 7); c.fillStyle = '#FFF7A8'; c.fill(); c.stroke(); c.beginPath(); c.arc(0, 0, 38, 0, 7); c.fillStyle = '#FFE23A'; c.fill();
    c.lineWidth = 4; c.beginPath(); for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3; c.moveTo(Math.cos(a) * 6, Math.sin(a) * 6); c.lineTo(Math.cos(a) * 36, Math.sin(a) * 36); } c.stroke(); c.restore();
  }
  function blueberry(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s / 100, s / 100); c.lineWidth = 6; c.strokeStyle = INK; c.beginPath(); c.arc(0, 0, 44, 0, 7); c.fillStyle = '#4B48C8'; c.fill(); c.stroke();
    c.beginPath(); c.arc(-14, -16, 14, Math.PI, Math.PI * 1.6); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 6; c.lineCap = 'round'; c.stroke();
    c.fillStyle = INK; c.beginPath(); for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; c.lineTo(Math.cos(a) * 12, 8 + Math.sin(a) * 12); c.lineTo(Math.cos(a + .63) * 5, 8 + Math.sin(a + .63) * 5); } c.closePath(); c.fill(); c.restore();
  }
  function mangoCube(c, x, y, s, rot) { cube(c, x, y, s, '#FFB52E', rot); }

  /* ---------- poster painter ---------- */
  function fruit(c, im, o) { var w = o.w, h = im.height * w / im.width, x = o.x, y = o.y; if (BL) { if (x <= 0) x -= BL + 1; else if (x + w >= W - 2) x += BL + 1; if (y + h >= H - 2) y += BL + 1; } c.save(); if (o.b) c.filter = 'blur(' + (o.b * SC) + 'px)'; c.shadowColor = 'rgba(25,0,20,.35)'; c.shadowBlur = o.b ? 0 : 26 * SC; c.shadowOffsetX = -10 * SC; c.shadowOffsetY = 18 * SC; c.translate(x + w / 2, y + h / 2); if (o.r180) c.rotate(Math.PI); if (o.flip) c.scale(-1, 1); c.drawImage(im, -w / 2, -h / 2, w, h); c.restore(); }
  function blurred(c, px, fn) { c.save(); c.filter = 'blur(' + px + 'px)'; fn(); c.restore(); }
  var FORMATS = [
    { id: 'feed', title: 'Feed poster · 4:5', w: 1080, h: 1350, tag: '1080x1350', file: 'poster', fk: 'front', bk: 'back', L: { glowY: 760, ghostY: 640, pouchH: 960, pouchY: 305, floorY: 1250, labelY: 78, headY: 196, headSize: 116, subGap: 86, scriptY: 1168, hashY: 760, barCy: 1278, sparks: [[960, 380], [220, 700]], drop: [900, 640] } },
    { id: 'story', title: 'Story · 9:16', w: 1080, h: 1920, tag: '1080x1920', file: 'story', fk: 'sfront', bk: 'sback', L: { glowY: 1120, ghostY: 1040, pouchH: 1090, pouchY: 640, floorY: 1700, labelY: 290, headY: 430, headSize: 124, subGap: 96, scriptY: 1500, hashY: 1120, barCy: 1620, sparks: [[960, 700], [210, 1020]], drop: [900, 1080] } }
  ];
  FORMATS.push({ id: 'print', title: 'Print poster · A3 + 3 mm bleed', w: 1080, h: 1527, bleed: 11, scale: 3.25, tag: 'A3-bleed', file: 'print', fk: 'pfront', bk: 'pback', L: { glowY: 800, ghostY: 720, pouchH: 1020, pouchY: 330, floorY: 1330, labelY: 84, headY: 206, headSize: 116, subGap: 86, scriptY: 1255, hashY: 800, barCy: 1452, sparks: [[960, 400], [220, 760]], drop: [900, 690] } });
  function paint(canvas, P, imgs, F) {
    W = F.w; H = F.h; SC = F.scale || 1; BL = F.bleed || 0; var L = F.L, c = canvas.getContext('2d'), R = rng(P.key.length * 977 + 13);
    canvas.width = Math.round((W + 2 * BL) * SC); canvas.height = Math.round((H + 2 * BL) * SC); c.setTransform(SC, 0, 0, SC, BL * SC, BL * SC);
    /* tonal background with spotlight */
    var g = c.createRadialGradient(W * .5, H * .52, 60, W * .5, H * .55, 980); g.addColorStop(0, P.bg); g.addColorStop(1, P.bg2); c.fillStyle = g; c.fillRect(-BL, -BL, W + 2 * BL, H + 2 * BL);
    var gl = c.createRadialGradient(P.px, L.glowY, 20, P.px, L.glowY, 520); gl.addColorStop(0, 'rgba(255,255,255,.38)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(-BL, -BL, W + 2 * BL, H + 2 * BL);
    /* ghost word, big and tonal */
    c.save(); c.translate(W * .5, L.ghostY); c.rotate(-7 * Math.PI / 180); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    var lines = P.ghost, gs = 400; lines.forEach(function (l) { gs = Math.min(gs, fitFont(c, l, '"Bowlby One"', 1100, 400)); });
    c.font = gs + 'px "Bowlby One"'; lines.forEach(function (l, n) { var yy = (n - (lines.length - 1) / 2) * gs * 0.95; c.fillStyle = P.ghostFill; c.fillText(l, 0, yy); c.lineWidth = 5; c.strokeStyle = P.ghostLine; c.strokeText(l, 0, yy); }); c.restore();
    /* paint specks */
    for (var i = 0; i < 80 * H / 1350; i++) { var x = R() * W, y = R() * H; if (Math.pow((x - P.px) / 400, 2) + Math.pow((y - (L.pouchY + L.pouchH / 2)) / (L.pouchH / 2 + 30), 2) < 1) continue; c.beginPath(); c.arc(x, y, 3 + R() * 8, 0, 7); c.fillStyle = P.dots[Math.floor(R() * P.dots.length)]; c.globalAlpha = .9; c.fill(); c.globalAlpha = 1; }
    /* back fruit: out of focus for depth */
    (P[F.bk] || []).forEach(function (o) { fruit(c, imgs.fruit[o.k], o); });
    /* floor shadow + pouch */
    var im = imgs.pouch, ph = L.pouchH, pw = im.width * ph / im.height, px = P.px - pw / 2, py = L.pouchY;
    c.save(); c.translate(P.px + 20, L.floorY); c.scale(1, .16); c.beginPath(); c.arc(0, 0, 340, 0, 7); c.fillStyle = 'rgba(20,0,15,.35)'; c.filter = 'blur(' + (26 * SC) + 'px)'; c.fill(); c.restore();
    c.save(); c.shadowColor = 'rgba(30,0,20,.4)'; c.shadowBlur = 40 * SC; c.shadowOffsetX = -24 * SC; c.shadowOffsetY = 36 * SC; c.imageSmoothingQuality = 'high'; c.drawImage(im, px, py, pw, ph); c.restore();
    c.drawImage(im, px, py, pw, ph);
    /* front fruit + sparkles */
    (P[F.fk] || []).forEach(function (o) { fruit(c, imgs.fruit[o.k], o); });
    spark(c, L.sparks[0][0], L.sparks[0][1], 56, 8); spark(c, L.sparks[1][0], L.sparks[1][1], 54, -8); drop(c, L.drop[0], L.drop[1], 76, P.decor === 'lemon' ? '#9BE7F2' : '#FFEE4A', 14);
    /* script accent, on top of decor */
    c.save(); c.translate(P.sx, L.scriptY); c.rotate(-9 * Math.PI / 180); c.font = '118px "Caveat Brush"'; c.textAlign = P.sa; c.lineJoin = 'round'; c.lineWidth = 16; c.strokeStyle = INK; c.strokeText(P.script, 0, 0); c.fillStyle = '#fff'; c.fillText(P.script, 0, 0); c.restore();
    /* label + headline */
    c.save(); c.font = '900 24px "Nunito"'; c.fillStyle = P.lab; c.textAlign = 'left'; if ('letterSpacing' in c) c.letterSpacing = '12px'; c.fillText('JELLY DRINK  ·  MINUMAN JELLY', 72, L.labelY); c.restore();
    var hs = sticker(c, P.head, 66, L.headY, L.headSize, P.fill, 950, -3);
    outlinedText(c, P.sub, 72, L.headY + hs * 1.02 + L.subGap, 26, '#ffffff', 'left');
    /* hashtag, vertical */
    c.save(); c.translate(1048, L.hashY); c.rotate(-Math.PI / 2); c.font = '900 26px "Nunito"'; var tw = c.measureText('#DrinkYourPassion').width; rrect(c, -tw / 2 - 18, -26, tw + 36, 44, 22); c.fillStyle = INK; c.fill(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText('#DrinkYourPassion', 0, 6); c.restore();
    /* footer: badge + stockists */
    var cy = L.barCy;
    c.save(); c.fillStyle = '#9B1D6E'; c.beginPath(); c.ellipse(190, cy, 160, 62, -.03, 0, 7); c.fill(); c.beginPath(); c.arc(40, cy - 36, 9, 0, 7); c.fill(); c.beginPath(); c.arc(330, cy - 48, 8, 0, 7); c.fill(); c.beginPath(); c.arc(138, cy + 62, 12, 0, 7); c.fill(); c.restore();
    var nb = imgs.nibou, nw = 250, nh = nb.height * nw / nb.width; c.drawImage(nb, 190 - nw / 2, cy - nh / 2, nw, nh);
    c.save(); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 16 * SC; c.shadowOffsetY = 8 * SC; rrect(c, 350, cy - 42, 690, 86, 43); c.fillStyle = '#fff'; c.fill(); c.restore();
    c.fillStyle = INK; c.font = '24px "Bowlby One"'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('FIND IT AT', 380, cy + 2);
    var hs2 = [30, 24, 34, 30], gap = 30, tot = 0; imgs.stores.forEach(function (s, i) { tot += s.width * hs2[i] / s.height; }); tot += gap * 3; var k = Math.min(1, 440 / tot), x = 1022 - tot * k;
    imgs.stores.forEach(function (s, i) { var hh = hs2[i] * k, ww = s.width * hh / s.height; c.drawImage(s, x, cy + 2 - hh / 2, ww, hh); x += ww + gap * k; });
    c.textBaseline = 'alphabetic';
  }

  /* ---------- build page ---------- */
  var grid = $('#grid'), all = [];
  function toast(m) { var e = $('#msg'); e.textContent = m; e.classList.add('on'); setTimeout(function () { e.classList.remove('on'); }, 1600); }
  function dl(canvas, name) { canvas.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 800); }, 'image/png'); }
  Promise.all([
    document.fonts.load('124px "Bowlby One"'), document.fonts.load('600px "Caveat Brush"'), document.fonts.load('900 28px "Nunito"'),
    load('assets/nibou-logo-white.svg'), load('assets/stores/aeon.svg'), load('assets/stores/mydin.svg'), load('assets/stores/shopee.svg'), load('assets/stores/lazada.svg')
  ].concat(POSTERS.map(function (p) { return load(p.pouch); })).concat(FRUIT_KEYS.map(function (k) { return load('assets/fruit/' + k + '.png'); }))).then(function (r) {
    var nibou = r[3], stores = [r[4], r[5], r[6], r[7]], pouches = r.slice(8, 11), fr = {}; FRUIT_KEYS.forEach(function (k, n) { fr[k] = r[11 + n]; });
    FORMATS.forEach(function (F) {
      var sec = document.createElement('section'); sec.className = 'fmt'; sec.id = F.id;
      var h = document.createElement('div'); h.className = 'fh'; h.innerHTML = '<h2>' + F.title + ' <small>' + F.w + ' × ' + F.h + ' px</small></h2>';
      var all3 = document.createElement('button'); all3.type = 'button'; all3.className = 'btn sm'; all3.textContent = 'Download all 3'; h.appendChild(all3); sec.appendChild(h);
      var row = document.createElement('div'); row.className = 'row ' + F.id; sec.appendChild(row); grid.appendChild(sec); var cvs = [];
      POSTERS.forEach(function (P, i) {
        var fg = document.createElement('figure'), cv = document.createElement('canvas'), cap = document.createElement('figcaption');
        cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Drinme ' + P.name + ' ' + F.id + ': ' + P.head.join(' '));
        cap.innerHTML = '<b>' + P.name + '</b>'; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.textContent = 'Download PNG'; cap.appendChild(b);
        fg.appendChild(cv); fg.appendChild(cap); row.appendChild(fg); cvs.push(cv);
        paint(cv, P, { pouch: pouches[i], nibou: nibou, stores: stores, fruit: fr }, F);
        b.addEventListener('click', function () { dl(cv, 'drinme-' + P.key + '-' + F.file + '-' + F.tag + (F.scale ? '-' + cv.width + 'x' + cv.height : '') + '.png'); toast('Saving ' + P.name + ' ' + F.id); });
      });
      all3.addEventListener('click', function () { POSTERS.forEach(function (P, i) { setTimeout(function () { dl(cvs[i], 'drinme-' + P.key + '-' + F.file + '-' + F.tag + (F.scale ? '-' + cvs[i].width + 'x' + cvs[i].height : '') + '.png'); }, i * 700); }); toast('Saving all 3 ' + F.id + ' files'); });
      all.push(cvs);
    });
    $('#all').addEventListener('click', function () { var n = 0; FORMATS.forEach(function (F, fi) { POSTERS.forEach(function (P, i) { setTimeout(function () { dl(all[fi][i], 'drinme-' + P.key + '-' + F.file + '-' + F.tag + '.png'); }, (n++) * 700); }); }); toast('Saving all 6 files'); });
  }).catch(function (e) { grid.textContent = 'Could not load assets: ' + e.message; });
})();