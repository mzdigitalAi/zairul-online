(function () {
  'use strict';
  var W = 1080, H = 1350, INK = '#3b0d12', SC = 1, BL = 0, DY = 0;
  var $ = function (s) { return document.querySelector(s); };
  function load(src) { return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { rej(new Error('load ' + src)); }; i.src = src; }); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* products and fruit used by each poster */
  var PRODUCTS = ['cups80', 'cups110', 'pinkbag', 'natabag', 'powder'];
  var FRUIT = ['mango-tl', 'mango-bl', 'mango-br', 'mango-right', 'lemonade-tophalf', 'lemonade-brhalf', 'lemonade-left', 'lemonade-tr', 'mixberry-straw-br', 'mixberry-straw-left', 'mixberry-blue1', 'mixberry-blue2'];
  var POSTERS = [
    { key: 'sticks', name: 'Iced Stick', photo: true, bg: '#14804F', bg2: '#0A5A37', ray: 'rgba(255,255,255,.06)', head: ['COOL DOWN.', 'SOYA UP!'], sub: 'Iced Stick Soya Pudding, 40gm x 10', dots: ['#FFE020', '#ffffff', '#7CF0A8'] },
    { key: 'scoop', name: 'Soya Pudding Cups', bg: '#FFC820', bg2: '#FF9F0E', ray: 'rgba(255,255,255,.22)', prod: 'cups80', pd: { x: 540, y: 760, w: 840, r: -6 }, fruit: [{ k: 'mango-tl', r180: 1, x: -30, y: 900, w: 420 }, { k: 'mixberry-straw-br', x: 700, y: 900, w: 420 }, { k: 'lemonade-brhalf', flip: 1, x: 880, y: 360, w: 240 }], head: ['SCOOP OF', 'HAPPY!'], sub: 'Soya Fruits Flavour Pudding with Nata de Coco', dots: ['#ffffff', '#E2272E', '#2EC4D6'] },
    { key: 'triple', name: 'Triple Treat', bg: '#FF7A3D', bg2: '#E4491A', ray: 'rgba(255,230,160,.25)', prod: 'cups110', pd: { x: 540, y: 740, w: 940, r: -4 }, fruit: [{ k: 'mango-tl', r180: 1, x: 680, y: 880, w: 420 }, { k: 'lemonade-tophalf', r180: 1, x: -40, y: 890, w: 440 }, { k: 'mango-right', x: 800, y: 330, w: 300 }], head: ['MANGO. LEMON.', 'HONEYDEW!'], sub: 'Soya pudding with nata de coco, 110gm x 3', dots: ['#FFE020', '#ffffff', '#FFEBC4'] },
    { key: 'smile', name: 'Soya Fruits Pudding', bg: '#FF5FA2', bg2: '#E0307F', ray: 'rgba(255,255,255,.2)', prod: 'pinkbag', pd: { x: 540, y: 740, w: 560, r: 5 }, fruit: [{ k: 'mixberry-straw-left', x: -20, y: 520, w: 300 }, { k: 'mixberry-straw-br', x: 660, y: 850, w: 460 }, { k: 'mixberry-blue2', x: 830, y: 420, w: 190 }], head: ['PUDDING', 'TIME! :)'], sub: 'Soya Fruits Pudding, 16gm x 20', dots: ['#FFE020', '#ffffff', '#FFD0E4'] },
    { key: 'nata', name: 'Nata Pudding', bg: '#7CC22A', bg2: '#4A9A15', ray: 'rgba(255,255,160,.28)', prod: 'natabag', pd: { x: 540, y: 740, w: 560, r: -4 }, fruit: [{ k: 'lemonade-left', x: -30, y: 520, w: 270 }, { k: 'lemonade-brhalf', flip: 1, x: 0, y: 900, w: 330 }, { k: 'mango-bl', x: 700, y: 900, w: 420 }], head: ['SNACK', 'ATTACK!'], sub: 'Soya pudding with nata, 35gm x 16', dots: ['#FFE020', '#ffffff', '#DFFFA0'] },
    { key: 'make', name: 'Instant Powder', bg: '#B4602A', bg2: '#7B3A12', ray: 'rgba(255,214,150,.2)', prod: 'powder', pd: { x: 540, y: 740, w: 620, r: 0 }, fruit: [{ k: 'mixberry-straw-left', x: -20, y: 560, w: 300 }, { k: 'mango-br', flip: 1, x: 40, y: 960, w: 280 }, { k: 'mixberry-straw-br', x: 700, y: 900, w: 420 }], head: ['MIX IT.', 'CHILL IT.'], sub: 'Dadih Instant Soya Pudding Powder, 90gm', dots: ['#FFE020', '#ffffff', '#FFC890'] }
  ];

  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function fit(c, t, font, maxW, size) { c.font = size + 'px ' + font; var w = c.measureText(t).width; return w > maxW ? Math.floor(size * maxW / w) : size; }
  function bubble(c, lines, x, y, size, maxW, rot) {
    c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.textBaseline = 'alphabetic'; c.lineJoin = 'round'; c.textAlign = 'left';
    var fs = size; lines.forEach(function (l) { fs = Math.min(fs, fit(c, l, '"Lilita One"', maxW, size)); }); c.font = fs + 'px "Lilita One"';
    lines.forEach(function (t, n) { var ty = n * fs * 0.98;
      c.lineWidth = fs * 0.30; c.strokeStyle = '#fff'; c.shadowColor = 'rgba(60,10,15,.35)'; c.shadowBlur = 22 * SC; c.shadowOffsetY = 12 * SC; c.strokeText(t, 0, ty); c.shadowColor = 'transparent';
      c.lineWidth = fs * 0.19; c.strokeStyle = '#D4202A'; c.strokeText(t, 0, ty);
      var g = c.createLinearGradient(0, ty - fs * .8, 0, ty); g.addColorStop(0, '#FFF27A'); g.addColorStop(.55, '#FFE020'); g.addColorStop(1, '#FFB400'); c.fillStyle = g; c.fillText(t, 0, ty); });
    c.restore(); return fs;
  }
  function placeFruit(c, im, o, blur) { var w = o.w, h = im.height * w / im.width; c.save(); if (blur) c.filter = 'blur(' + (blur * SC) + 'px)'; c.shadowColor = 'rgba(40,5,10,.35)'; c.shadowBlur = blur ? 0 : 26 * SC; c.shadowOffsetX = -8 * SC; c.shadowOffsetY = 16 * SC; c.translate(o.x + w / 2, o.y + h / 2); if (o.r180) c.rotate(Math.PI); if (o.r) c.rotate(o.r * Math.PI / 180); if (o.flip) c.scale(-1, 1); c.drawImage(im, -w / 2, -h / 2, w, h); c.restore(); }
  function sparkle(c, x, y, s, rot, col) { c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.scale(s / 100, s / 100); c.lineJoin = 'round'; c.lineWidth = 6; c.strokeStyle = INK; c.fillStyle = col || '#fff'; c.beginPath(); c.moveTo(0, -48); c.quadraticCurveTo(4, -6, 48, 0); c.quadraticCurveTo(4, 6, 0, 48); c.quadraticCurveTo(-4, 6, -48, 0); c.quadraticCurveTo(-4, -6, 0, -48); c.closePath(); c.fill(); c.stroke(); c.restore(); }

  function footer(c, I, cy) {
    c.save(); c.fillStyle = '#9B1D6E'; c.beginPath(); c.ellipse(170, cy, 140, 54, -.03, 0, 7); c.fill(); c.beginPath(); c.arc(38, cy - 30, 8, 0, 7); c.fill(); c.beginPath(); c.arc(292, cy - 42, 7, 0, 7); c.fill(); c.restore();
    var nb = I.nibou, nw = 214, nh = nb.height * nw / nb.width; c.drawImage(nb, 170 - nw / 2, cy - nh / 2, nw, nh);
    c.save(); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 14 * SC; c.shadowOffsetY = 6 * SC; rrect(c, 330, cy - 40, 700, 80, 40); c.fillStyle = '#fff'; c.fill(); c.restore();
    c.fillStyle = '#3b0d12'; c.font = '24px "Lilita One"'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('FIND IT AT', 362, cy + 2);
    var hs = [28, 22, 32, 28], gap = 30, tot = 0; I.stores.forEach(function (s, i) { tot += s.width * hs[i] / s.height; }); tot += gap * 3; var k = Math.min(1, 440 / tot), x = 1008 - tot * k;
    I.stores.forEach(function (s, i) { var hh = hs[i] * k, ww = s.width * hh / s.height; c.drawImage(s, x, cy + 2 - hh / 2, ww, hh); x += ww + gap * k; });
    c.textBaseline = 'alphabetic';
  }

  function paint(cv, P, I, F) {
    F = F || { h: 1350, bleed: 0, scale: 1 }; SC = F.scale; BL = F.bleed; DY = F.h - 1350; var HH = F.h, M2 = DY / 2, TOP = F.story ? 120 : 0, FOOT = F.story ? -150 : 0;
    var c = cv.getContext('2d'), R = rng(P.key.length * 313 + 7); cv.width = Math.round((W + 2 * BL) * SC); cv.height = Math.round((HH + 2 * BL) * SC); c.setTransform(SC, 0, 0, SC, BL * SC, BL * SC); c.imageSmoothingQuality = 'high';
    var g = c.createRadialGradient(W / 2, 760 + M2, 60, W / 2, 760 + M2, 1000); g.addColorStop(0, P.bg); g.addColorStop(1, P.bg2); c.fillStyle = g; c.fillRect(-BL, -BL, W + 2 * BL, HH + 2 * BL);
    /* sunburst rays */
    c.save(); c.translate(W / 2, 760 + M2); c.fillStyle = P.ray; var n = 22; for (var i = 0; i < n; i += 2) { var a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a0) * 1700, Math.sin(a0) * 1700); c.lineTo(Math.cos(a1) * 1700, Math.sin(a1) * 1700); c.closePath(); c.fill(); } c.restore();
    /* confetti */
    for (var j = 0; j < 70; j++) { var x = R() * W, y = R() * HH; if (y < 340 && P.photo) continue; c.beginPath(); c.arc(x, y, 3 + R() * 9, 0, 7); c.fillStyle = P.dots[Math.floor(R() * P.dots.length)]; c.globalAlpha = .85; c.fill(); c.globalAlpha = 1; }
    if (P.photo) {
      /* photo block, cropped to hide the corner logos baked into the original */
      c.save(); c.translate(0, M2); c.drawImage(I.photo, 0, 190, 1024, 834, -BL, 330, W + 2 * BL, 880);
      var fd = c.createLinearGradient(0, 330, 0, 430); fd.addColorStop(0, P.bg); fd.addColorStop(1, 'rgba(10,90,55,0)'); c.fillStyle = fd; c.fillRect(0, 330, W, 110);
      var b = c.createLinearGradient(0, 1130, 0, 1215); b.addColorStop(0, 'rgba(10,90,55,0)'); b.addColorStop(1, P.bg2); c.fillStyle = b; c.fillRect(0, 1130, W, 90);
      c.fillStyle = P.bg2; c.fillRect(-BL, 1210, W + 2 * BL, 140 + M2 + BL); c.restore();
    } else {
      c.save(); c.translate(0, M2); var im = I.prod[P.prod], pw = P.pd.w, ph = im.height * pw / im.width;
      /* soft floor shadow and spotlight */
      var sp = c.createRadialGradient(W / 2, 760, 20, W / 2, 760, 560); sp.addColorStop(0, 'rgba(255,255,255,.35)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sp; c.fillRect(-BL, 200, W + 2 * BL, 1100);
      (P.fruit || []).slice(0, 1).forEach(function (o) { });
      /* back fruit */
      (P.fruit || []).forEach(function (o, i) { if (i === 2) placeFruit(c, I.fruit[o.k], o, 5); });
      c.save(); c.translate(P.pd.x + 24, P.pd.y + ph / 2 + 30); c.scale(1, .12); c.beginPath(); c.arc(0, 0, pw * .5, 0, 7); c.fillStyle = 'rgba(30,0,10,.35)'; c.filter = 'blur(' + (24 * SC) + 'px)'; c.fill(); c.restore();
      c.save(); c.translate(P.pd.x, P.pd.y); c.rotate(P.pd.r * Math.PI / 180); c.shadowColor = 'rgba(30,0,10,.4)'; c.shadowBlur = 36 * SC; c.shadowOffsetX = -18 * SC; c.shadowOffsetY = 30 * SC; c.drawImage(im, -pw / 2, -ph / 2, pw, ph); c.restore();
      (P.fruit || []).forEach(function (o, i) { if (i !== 2) placeFruit(c, I.fruit[o.k], o, 0); });
      c.restore();
    }
    /* sparkles */
    sparkle(c, 960, 420, 56, 8); sparkle(c, 110, 560, 50, -10, '#FFE020'); sparkle(c, 1000, 990, 46, 12);
    /* headline + sub */
    var fs = bubble(c, P.head, 62, 70 + 112 + TOP, 132, 930, -3);
    c.save(); c.font = '600 28px "Fredoka"'; c.fillStyle = '#fff'; c.shadowColor = 'rgba(40,5,10,.55)'; c.shadowBlur = 12 * SC; c.fillText(P.sub, 70, 70 + 112 + TOP + fs * 0.98 + 58); c.restore();
    /* Dadih logo sticker */
    var lw = 300, lh = I.logo.height * lw / I.logo.width; c.save(); c.translate(870, 1136 + DY + FOOT); c.rotate(-6 * Math.PI / 180); c.shadowColor = 'rgba(30,0,10,.35)'; c.shadowBlur = 16 * SC; c.shadowOffsetY = 8 * SC; c.drawImage(I.logo, -lw / 2, -lh / 2, lw, lh); c.restore();
    footer(c, I, (P.photo ? 1280 : 1288) + DY + FOOT);
  }

  /* ---------- pop-art campaign grid, 1:1 ---------- */
  function squiggle(c, x, y, w, amp, col, lw) { c.save(); c.lineWidth = lw || 12; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x, y); for (var i = 0; i < 6; i++) { c.quadraticCurveTo(x + (i + .5) * w / 6, y + (i % 2 ? amp : -amp), x + (i + 1) * w / 6, y); } c.stroke(); c.restore(); }
  function zig(c, x, y, w, h, col, lw) { c.save(); c.lineWidth = lw || 10; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x, y); for (var i = 1; i <= 6; i++) c.lineTo(x + i * w / 6, y + (i % 2 ? -h : 0)); c.stroke(); c.restore(); }
  function tri(c, x, y, s, rot, col) { c.save(); c.translate(x, y); c.rotate(rot * Math.PI / 180); c.beginPath(); c.moveTo(0, -s); c.lineTo(s * .9, s * .6); c.lineTo(-s * .9, s * .6); c.closePath(); c.fillStyle = col; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.lineJoin = 'round'; c.stroke(); c.restore(); }
  function ring(c, x, y, r, col, lw) { c.save(); c.lineWidth = lw || 10; c.strokeStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); c.restore(); }
  function dotsGrid(c, x, y, cols, rows, gap, r, col) { c.save(); c.fillStyle = col; for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) { c.beginPath(); c.arc(x + i * gap, y + j * gap, r, 0, 7); c.fill(); } c.restore(); }
  function maze(c, x, y, w, h, col) { c.save(); c.strokeStyle = col; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); var s = 36; c.moveTo(x, y); for (var i = 0; i < w / s; i++) { c.lineTo(x + i * s, y + h * ((i % 3) / 3)); c.lineTo(x + (i + 1) * s, y + h * ((i % 3) / 3)); c.lineTo(x + (i + 1) * s, y + h * (((i + 1) % 3) / 3 + .1)); } c.stroke(); c.restore(); }
  function condensed(c, t, x, y, size, fill, stroke, rot, align) { c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.font = size + 'px "Anton"'; c.textAlign = align || 'left'; c.lineJoin = 'round'; c.lineWidth = size * .14; c.strokeStyle = stroke || INK; c.strokeText(t, 0, 0); c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
  function hand(c, t, x, y, size, col, rot, align) { c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.font = size + 'px "Caveat Brush"'; c.textAlign = align || 'left'; c.lineJoin = 'round'; c.lineWidth = size * .16; c.strokeStyle = INK; c.strokeText(t, 0, 0); c.fillStyle = col; c.fillText(t, 0, 0); c.restore(); }
  function tag(c, t, x, y, bg, fg, rot) { c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.font = '24px "Lilita One"'; var w = c.measureText(t).width + 40; c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 10; c.shadowOffsetY = 5; rrect(c, -w / 2, -24, w, 48, 24); c.fillStyle = bg; c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 4; c.strokeStyle = INK; c.stroke(); c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, 0, 2); c.restore(); }
  function prodAt(c, im, cx, cy, w, rot) { var h = im.height * w / im.width; c.save(); c.translate(cx, cy); c.rotate(rot * Math.PI / 180); c.shadowColor = 'rgba(30,0,10,.4)'; c.shadowBlur = 24; c.shadowOffsetX = -10; c.shadowOffsetY = 18; c.drawImage(im, -w / 2, -h / 2, w, h); c.restore(); }
  function paintGrid(cv, I) {
    SC = 1; BL = 0; DY = 0;
    var S = 1080, h = 540, c = cv.getContext('2d'); cv.width = S; cv.height = S; c.imageSmoothingQuality = 'high';
    var P = [{ x: 0, y: 0, bg: '#FFE020' }, { x: h, y: 0, bg: '#FF5FA2' }, { x: 0, y: h, bg: '#2EC4D6' }, { x: h, y: h, bg: '#FF7A3D' }];
    P.forEach(function (q, i) { c.save(); c.beginPath(); c.rect(q.x, q.y, h, h); c.clip(); c.fillStyle = q.bg; c.fillRect(q.x, q.y, h, h);
      var sp = c.createRadialGradient(q.x + h / 2, q.y + h / 2, 10, q.x + h / 2, q.y + h / 2, 400); sp.addColorStop(0, 'rgba(255,255,255,.35)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sp; c.fillRect(q.x, q.y, h, h);
      if (i === 0) { squiggle(c, 40, 470, 300, 26, '#FF5FA2', 12); zig(c, 330, 70, 180, 30, '#2EC4D6', 10); dotsGrid(c, 400, 400, 4, 4, 30, 5, '#D4202A'); ring(c, 90, 90, 40, '#FF7A3D', 10); tri(c, 470, 470, 22, 20, '#2EC4D6'); }
      if (i === 1) { maze(c, h + 30, 60, 260, 70, '#FFE020'); ring(c, h + 460, 440, 50, '#fff', 10); tri(c, h + 60, 460, 24, -15, '#FFE020'); squiggle(c, h + 240, 500, 260, 22, '#2EC4D6', 12); dotsGrid(c, h + 40, 300, 3, 5, 30, 5, '#fff'); }
      if (i === 2) { zig(c, 30, 500, 220, 30, '#FFE020', 10); ring(c, 480, 90, 44, '#FF5FA2', 10); squiggle(c, 40, 70, 240, 22, '#fff', 12); tri(c, 60, h + 0, 0, 0, '#2EC4D6'); dotsGrid(c, 420, 420, 4, 3, 30, 5, '#fff'); }
      if (i === 3) { squiggle(c, h + 260, 70, 260, 24, '#FFE020', 12); maze(c, h + 30, 480, 220, 50, '#fff'); ring(c, h + 60, 90, 38, '#2EC4D6', 10); tri(c, h + 480, 430, 26, 15, '#FFE020'); dotsGrid(c, h + 400, 150, 3, 4, 30, 5, '#fff'); }
      c.restore(); });
    /* panel 1: logo + big type */
    var lw = 400, lh = I.logo.height * lw / I.logo.width; c.save(); c.translate(270, 190); c.rotate(-6 * Math.PI / 180); c.drawImage(I.logo, -lw / 2, -lh / 2, lw, lh); c.restore();
    condensed(c, 'SOYA', 36, 392, 118, '#fff', INK, -4); condensed(c, 'PUDDING', 36, 504, 118, '#D4202A', '#fff', -4);
    hand(c, 'soya goodness', 270, 292, 38, '#FF5FA2', -8);
    /* panel 2: pink bag + strawberry */
    placeFruit(c, I.fruit['mixberry-straw-br'], { x: h + 290, y: 330, w: 250, r: 8 }, 0);
    prodAt(c, I.prod.pinkbag, h + 335, 320, 300, 6);
    condensed(c, 'PUDDING', h + 24, 96, 74, '#FFE020', INK, -5); condensed(c, 'TIME!', h + 24, 170, 74, '#fff', INK, -5);
    tag(c, 'FRESH DROP', h + 400, 40, '#fff', '#D4202A', 6);
    /* panel 3: nata bag + lemon */
    placeFruit(c, I.fruit['lemonade-brhalf'], { x: 20, y: h + 270, w: 240, flip: 1 }, 0);
    prodAt(c, I.prod.natabag, 290, h + 345, 300, -6);
    condensed(c, 'SNACK', 30, h + 92, 78, '#fff', INK, -4); condensed(c, 'ATTACK!', 30, h + 168, 78, '#FFE020', INK, -4);
    tag(c, 'NATA-RAL FUN', 170, h + 232, '#FFE020', INK, 6);
    /* panel 4: cups + mango */
    placeFruit(c, I.fruit['mango-tl'], { x: h + 300, y: h + 330, w: 240, r180: 1 }, 0);
    prodAt(c, I.prod.cups80, h + 290, h + 350, 380, -5);
    condensed(c, 'SCOOP OF', h + 112, h + 132, 70, '#fff', INK, -4); condensed(c, 'HAPPY!', h + 112, h + 210, 82, '#FFE020', INK, -4);
    hand(c, 'trending now', h + 330, h + 470, 38, '#fff', -6);
    /* centre badge */
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.beginPath(); c.arc(540, 540, 104, 0, 7); c.fillStyle = '#fff'; c.fill(); c.restore();
    c.beginPath(); c.arc(540, 540, 92, 0, 7); c.fillStyle = '#9B1D6E'; c.fill(); var nb = I.nibou, nw = 150, nh = nb.height * nw / nb.width; c.drawImage(nb, 540 - nw / 2, 540 - nh / 2, nw, nh);
    /* stockist pill */
    c.save(); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 14; c.shadowOffsetY = 6; rrect(c, 250, 1010, 580, 56, 28); c.fillStyle = '#fff'; c.fill(); c.restore();
    c.fillStyle = INK; c.font = '19px "Lilita One"'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('FIND IT AT', 276, 1040);
    var hs = [22, 18, 26, 22], gap = 22, tot = 0; I.stores.forEach(function (s, i) { tot += s.width * hs[i] / s.height; }); tot += gap * 3; var k = Math.min(1, 380 / tot), x = 812 - tot * k;
    I.stores.forEach(function (s, i) { var hh = hs[i] * k, ww = s.width * hh / s.height; c.drawImage(s, x, 1040 - hh / 2, ww, hh); x += ww + gap * k; });
    c.textBaseline = 'alphabetic';
  }
  var grid = $('#grid'), cvs = [], gridCv = null;
  function toast(m) { var e = $('#msg'); e.textContent = m; e.classList.add('on'); setTimeout(function () { e.classList.remove('on'); }, 1600); }
  function dl(canvas, name) { canvas.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 800); }, 'image/png'); }
  Promise.all([document.fonts.load('100px "Lilita One"'), document.fonts.load('600 28px "Fredoka"'),
    load('assets/dadih-logo.svg'), load('assets/nibou-logo-white.svg'), load('assets/stores/aeon.svg'), load('assets/stores/mydin.svg'), load('assets/stores/shopee.svg'), load('assets/stores/lazada.svg'), load('assets/photos/sticks.jpg')
  ].concat(PRODUCTS.map(function (k) { return load('assets/products/' + k + '.png'); })).concat(FRUIT.map(function (k) { return load('assets/fruit/' + k + '.png'); })).concat([document.fonts.load('100px "Anton"'), document.fonts.load('100px "Caveat Brush"')])).then(function (r) {
    var I = { logo: r[2], nibou: r[3], stores: [r[4], r[5], r[6], r[7]], photo: r[8], prod: {}, fruit: {} };
    PRODUCTS.forEach(function (k, n) { I.prod[k] = r[9 + n]; }); FRUIT.forEach(function (k, n) { I.fruit[k] = r[9 + PRODUCTS.length + n]; });
    POSTERS.forEach(function (P) {
      var fg = document.createElement('figure'), cv = document.createElement('canvas'), cap = document.createElement('figcaption');
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Dadih ' + P.name + ' poster: ' + P.head.join(' '));
      cap.innerHTML = '<b>' + P.name + '</b>'; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.textContent = 'Download PNG'; cap.appendChild(b);
      fg.appendChild(cv); fg.appendChild(cap); grid.appendChild(fg); cvs.push(cv); paint(cv, P, I);
      b.addEventListener('click', function () { dl(cv, 'dadih-' + P.key + '-poster-1080x1350.png'); toast('Saving ' + P.name); });
    });
    var SF = { h: 1920, bleed: 0, scale: 1, story: 1 }, storyCvs = [];
    POSTERS.forEach(function (P) {
      var fg = document.createElement('figure'), cv = document.createElement('canvas'), cap = document.createElement('figcaption');
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Dadih ' + P.name + ' story poster 9:16: ' + P.head.join(' '));
      cap.innerHTML = '<b>' + P.name + ' · Story</b>'; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.textContent = 'Download PNG'; cap.appendChild(b);
      fg.appendChild(cv); fg.appendChild(cap); grid.appendChild(fg); storyCvs.push(cv); paint(cv, P, I, SF);
      b.addEventListener('click', function () { dl(cv, 'dadih-' + P.key + '-story-1080x1920.png'); toast('Saving story ' + P.name); });
    });
    var sb = document.createElement('button'); sb.type = 'button'; sb.className = 'btn'; sb.textContent = 'Download all 6 stories'; sb.style.marginLeft = '12px'; $('#all').after(sb);
    sb.addEventListener('click', function () { POSTERS.forEach(function (P, i) { setTimeout(function () { dl(storyCvs[i], 'dadih-' + P.key + '-story-1080x1920.png'); }, i * 900); }); toast('Saving all stories'); });
    var PF = { h: 1527, bleed: 11, scale: 3.25 }, printCvs = [];
    POSTERS.forEach(function (P) {
      var fg = document.createElement('figure'), cv = document.createElement('canvas'), cap = document.createElement('figcaption');
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Dadih ' + P.name + ' A3 print poster');
      cap.innerHTML = '<b>' + P.name + ' · A3</b>'; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.textContent = 'Download PNG'; cap.appendChild(b);
      fg.appendChild(cv); fg.appendChild(cap); grid.appendChild(fg); printCvs.push(cv); paint(cv, P, I, PF);
      b.addEventListener('click', function () { dl(cv, 'dadih-' + P.key + '-print-A3-bleed-' + cv.width + 'x' + cv.height + '.png'); toast('Saving A3 ' + P.name); });
    });
    var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'btn'; pb.textContent = 'Download all 6 A3 prints'; pb.style.marginLeft = '12px'; $('#all').after(pb);
    pb.addEventListener('click', function () { POSTERS.forEach(function (P, i) { setTimeout(function () { dl(printCvs[i], 'dadih-' + P.key + '-print-A3-bleed-' + printCvs[i].width + 'x' + printCvs[i].height + '.png'); }, i * 1200); }); toast('Saving all A3 prints'); });    (function () { var fg = document.createElement('figure'), cv = document.createElement('canvas'), cap = document.createElement('figcaption'); cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Dadih pop-art campaign grid'); cap.innerHTML = '<b>Pop-art grid · 1:1</b>'; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.textContent = 'Download PNG'; cap.appendChild(b); fg.appendChild(cv); fg.appendChild(cap); grid.appendChild(fg); paintGrid(cv, I); b.addEventListener('click', function () { dl(cv, 'dadih-popgrid-1080x1080.png'); toast('Saving pop-art grid'); }); gridCv = cv; })();
    $('#all').addEventListener('click', function () { if (gridCv) setTimeout(function () { dl(gridCv, 'dadih-popgrid-1080x1080.png'); }, POSTERS.length * 700); POSTERS.forEach(function (P, i) { setTimeout(function () { dl(cvs[i], 'dadih-' + P.key + '-poster-1080x1350.png'); }, i * 700); }); toast('Saving all ' + (POSTERS.length + 1) + ' posters'); });
  }).catch(function (e) { grid.textContent = 'Could not load assets: ' + e.message; });
})();
