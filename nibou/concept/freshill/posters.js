(function () {
  'use strict';
  var W = 1080, H = 1350, SC = 1, BL = 0;
  var FORMATS = [{ id: 'feed', title: 'Feed poster · 4:5', w: 1080, h: 1350, tag: '1080x1350', file: 'poster', photoY: 40, ext: 0, bt: 1002, headY: 64, hs: 168, rowCy: 1288, subGap: 56 }, { id: 'story', title: 'Story · 9:16', w: 1080, h: 1920, tag: '1080x1920', file: 'story', photoY: 400, ext: 1, bt: 1352, headY: 250, hs: 196, rowCy: 1632, subGap: 62 }, { id: 'print', title: 'Print poster · A3 + 3 mm bleed', w: 1080, h: 1527, bleed: 11, scale: 3.25, tag: 'A3-bleed', file: 'print', photoY: 230, ext: 1, bt: 1170, headY: 110, hs: 176, rowCy: 1452, subGap: 62 }];
  var $ = function (s) { return document.querySelector(s); };
  function load(src) { return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { rej(new Error('load ' + src)); }; i.src = src; }); }

  var FL = [
    { key: 'lemon', name: 'Lemon', band: '#0E6B50', band2: '#07412F', accent: '#FFE14A', head: ['SQUEEZE', 'THE DAY.'], sub: 'Zesty lemon concentrate. Just add water.', glow: 'rgba(255,240,150,.45)' },
    { key: 'mango', name: 'Mango', band: '#B5380B', band2: '#7A2205', accent: '#FFC21A', head: ['MANGO', 'MORNINGS.'], sub: 'Golden, ripe and ready in seconds.', glow: 'rgba(255,214,120,.45)' },
    { key: 'strawberry', name: 'Strawberry', band: '#B0123A', band2: '#740824', accent: '#FFD0DA', head: ['BERRY', 'GOOD START.'], sub: 'Sweet strawberry, ready to pour.', glow: 'rgba(255,200,210,.45)' },
    { key: 'blackcurrant', name: 'Blackcurrant', band: '#3A1B52', band2: '#220D34', accent: '#D8B8FF', head: ['BOLD', 'BLACKCURRANT.'], sub: 'Rich, tangy and full of colour.', glow: 'rgba(210,190,255,.4)' },
    { key: 'lychee', name: 'Lychee', band: '#C93B63', band2: '#8C2142', accent: '#FFF0E0', head: ['LYCHEE', 'LOVE.'], sub: 'Light, floral and cooling.', glow: 'rgba(255,230,220,.45)' }
  ];

  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function fit(c, t, font, maxW, size) { c.font = size + 'px ' + font; var w = c.measureText(t).width; return w > maxW ? Math.floor(size * maxW / w) : size; }

  function paint(cv, F, img, I, M) {
    H = M.h; SC = M.scale || 1; BL = M.bleed || 0;
    var c = cv.getContext('2d'); cv.width = Math.round((W + 2 * BL) * SC); cv.height = Math.round((H + 2 * BL) * SC); c.setTransform(SC, 0, 0, SC, BL * SC, BL * SC);
    c.imageSmoothingQuality = 'high';
    /* photo: top strip stretched and blurred to extend, then the photo */
    if (M.ext) {
      /* story: extend the pool upward with a mirrored, heavily blurred copy of the photo top, then fade the real photo in */
      c.fillStyle = F.band2; c.fillRect(-BL, -BL, W + 2 * BL, H + 2 * BL);
      c.save(); c.filter = 'blur(' + (26 * SC) + 'px)'; c.drawImage(img, -40, M.photoY - 40, W + 80, 1160); c.restore();
      c.save(); c.filter = 'blur(' + (26 * SC) + 'px)'; c.translate(0, M.photoY + 8); c.scale(1, -1); c.drawImage(img, 0, 0, 1024, 380, -40, 0, W + 80, 400); c.restore();
      var tc = document.createElement('canvas'); tc.width = W; tc.height = 1080; var t = tc.getContext('2d'); t.drawImage(img, 0, 0, 1080, 1080); t.globalCompositeOperation = 'destination-in'; var mk = t.createLinearGradient(0, 0, 0, 120); mk.addColorStop(0, 'rgba(0,0,0,0)'); mk.addColorStop(1, 'rgba(0,0,0,1)'); t.fillStyle = mk; t.fillRect(0, 0, W, 1080); t.fillStyle = '#000'; t.fillRect(0, 120, W, 1000); c.drawImage(tc, -BL, M.photoY, W + 2 * BL, 1080);
    } else { c.save(); c.filter = 'blur(10px)'; c.drawImage(img, 0, 0, 1024, 14, -20, -20, W + 40, 90); c.restore(); c.drawImage(img, 0, M.photoY, 1080, 1080); }
    /* light: soft top-left shade for the headline, sun glow top-right */
    var sh = c.createLinearGradient(0, 0, 0, M.headY + 420); sh.addColorStop(0, 'rgba(0,30,45,.55)'); sh.addColorStop(1, 'rgba(0,30,45,0)'); c.fillStyle = sh; c.fillRect(-BL, -BL, W + 2 * BL, M.headY + 420 + BL);
    var sg = c.createRadialGradient(1000, M.photoY, 10, 1000, M.photoY, 520); sg.addColorStop(0, F.glow); sg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sg; c.fillRect(0, 0, W, 700);
    /* headline */
    c.save(); c.textBaseline = 'alphabetic'; c.fillStyle = '#fff'; c.shadowColor = 'rgba(0,25,40,.45)'; c.shadowBlur = 22 * SC; c.shadowOffsetY = 6 * SC;
    var fs = M.hs; F.head.forEach(function (l) { fs = Math.min(fs, fit(c, l, '"Anton"', M.ext ? 760 : 640, M.hs)); }); c.font = fs + 'px "Anton"';
    c.fillText(F.head[0], 64, M.headY + fs * 0.92); c.fillStyle = F.accent; c.fillText(F.head[1], 64, M.headY + fs * 1.82); c.restore();
    c.save(); c.font = '800 28px "Nunito"'; c.fillStyle = '#fff'; c.shadowColor = 'rgba(0,25,40,.55)'; c.shadowBlur = 14 * SC; c.fillText(F.sub, 68, M.headY + fs * 1.82 + M.subGap); c.restore();
    /* band with a soft wave edge */
    var bt = M.bt;
    var g = c.createLinearGradient(0, bt, 0, H + BL); g.addColorStop(0, F.band); g.addColorStop(1, F.band2);
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 30 * SC; c.shadowOffsetY = -6 * SC;
    c.beginPath(); c.moveTo(-BL, bt + 26); c.bezierCurveTo(240, bt - 40, 520, bt + 60, 780, bt + 4); c.bezierCurveTo(900, bt - 16, 1000, bt - 20, W + BL, bt + 8); c.lineTo(W + BL, H + BL); c.lineTo(-BL, H + BL); c.closePath(); c.fillStyle = g; c.fill(); c.restore();
    /* leaf shapes, tone on tone */
    c.save(); c.globalAlpha = .10; c.fillStyle = '#fff';
    function leaf(x, y, s, r) { c.save(); c.translate(x, y); c.rotate(r * Math.PI / 180); c.scale(s, s); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(40, -70, 130, -60, 160, 0); c.bezierCurveTo(130, 60, 40, 70, 0, 0); c.fill(); c.restore(); }
    leaf(640, bt + 248, 1.3, -24); leaf(930, bt + 138, 1.0, 20); leaf(540, bt + 318, .8, 8); c.restore();
    /* logo */
    var lw = 330, lh = I.logo.height * lw / I.logo.width; c.drawImage(I.logo, 56, bt + 50, lw, lh);
    /* tagline block */
    c.save(); c.fillStyle = '#fff'; c.font = 'italic 700 42px "Playfair Display"'; c.fillText('A Fresh Start', 430, bt + 100); c.fillText('To Your Day.', 430, bt + 150); c.restore();
    c.save(); c.fillStyle = F.accent; c.font = '900 20px "Nunito"'; if ('letterSpacing' in c) c.letterSpacing = '4px'; c.fillText('FRUIT DRINK CONCENTRATE  ·  1000ML', 430, bt + 200); c.restore();
    /* 50 glasses seal */
    var sx = 930, sy = bt - 6, sr = 92;
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 18 * SC; c.shadowOffsetY = 8 * SC; c.beginPath(); c.arc(sx, sy, sr, 0, 7); c.fillStyle = F.accent; c.fill(); c.restore();
    c.save(); c.beginPath(); c.arc(sx, sy, sr - 8, 0, 7); c.lineWidth = 3; c.strokeStyle = F.band; c.setLineDash([2, 8]); c.lineCap = 'round'; c.stroke(); c.restore();
    c.save(); c.textAlign = 'center'; c.fillStyle = F.band2; c.font = '900 14px "Nunito"'; if ('letterSpacing' in c) c.letterSpacing = '2px'; c.fillText('ONE 1L BOTTLE', sx, sy - 38); c.letterSpacing = '0px'; c.font = '86px "Anton"'; c.fillText('50', sx, sy + 38); c.font = '900 17px "Nunito"'; c.fillText('GLASSES', sx, sy + 62); c.restore();
    /* footer row: Nibou badge + stockists */
    var cy = M.rowCy;
    c.save(); c.fillStyle = '#9B1D6E'; c.beginPath(); c.ellipse(170, cy, 140, 54, -.03, 0, 7); c.fill(); c.beginPath(); c.arc(38, cy - 30, 8, 0, 7); c.fill(); c.beginPath(); c.arc(292, cy - 42, 7, 0, 7); c.fill(); c.restore();
    var nb = I.nibou, nw = 214, nh = nb.height * nw / nb.width; c.drawImage(nb, 170 - nw / 2, cy - nh / 2, nw, nh);
    c.save(); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 14 * SC; c.shadowOffsetY = 6 * SC; rrect(c, 330, cy - 40, 700, 80, 40); c.fillStyle = '#fff'; c.fill(); c.restore();
    c.fillStyle = '#1B1033'; c.font = '22px "Anton"'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.save(); if ('letterSpacing' in c) c.letterSpacing = '2px'; c.fillText('FIND IT AT', 360, cy + 2); c.restore();
    var hs = [28, 22, 32, 28], gap = 30, tot = 0; I.stores.forEach(function (s, i) { tot += s.width * hs[i] / s.height; }); tot += gap * 3; var k = Math.min(1, 440 / tot), x = 1008 - tot * k;
    I.stores.forEach(function (s, i) { var hh = hs[i] * k, ww = s.width * hh / s.height; c.drawImage(s, x, cy + 2 - hh / 2, ww, hh); x += ww + gap * k; });
    c.textBaseline = 'alphabetic';
  }

  var grid = $('#grid'), all = [];
  function toast(m) { var e = $('#msg'); e.textContent = m; e.classList.add('on'); setTimeout(function () { e.classList.remove('on'); }, 1600); }
  function dl(canvas, name) { canvas.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 800); }, 'image/png'); }
  Promise.all([
    document.fonts.load('100px "Anton"'), document.fonts.load('italic 700 42px "Playfair Display"'), document.fonts.load('900 28px "Nunito"'), document.fonts.load('800 28px "Nunito"'),
    load('assets/freshill-logo.svg'), load('assets/nibou-logo-white.svg'), load('assets/stores/aeon.svg'), load('assets/stores/mydin.svg'), load('assets/stores/shopee.svg'), load('assets/stores/lazada.svg')
  ].concat(FL.map(function (f) { return load('assets/photos/' + f.key + '.jpg'); }))).then(function (r) {
    var I = { logo: r[4], nibou: r[5], stores: [r[6], r[7], r[8], r[9]] };
    FORMATS.forEach(function (M) {
      var sec = document.createElement('section'); sec.className = 'fmt';
      var h = document.createElement('div'); h.className = 'fh'; h.innerHTML = '<h2>' + M.title + ' <small>' + M.w + ' × ' + M.h + ' px</small></h2>';
      var a5 = document.createElement('button'); a5.type = 'button'; a5.className = 'btn sm'; a5.textContent = 'Download all ' + FL.length; h.appendChild(a5); sec.appendChild(h);
      var row = document.createElement('div'); row.className = 'row ' + M.id; sec.appendChild(row); grid.appendChild(sec); var cvs = [];
      FL.forEach(function (F, i) {
        var fg = document.createElement('figure'), cv = document.createElement('canvas'), cap = document.createElement('figcaption');
        cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Freshill ' + F.name + ' ' + M.id + ': ' + F.head.join(' '));
        cap.innerHTML = '<b>' + F.name + '</b>'; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.textContent = 'Download PNG'; cap.appendChild(b);
        fg.appendChild(cv); fg.appendChild(cap); row.appendChild(fg); cvs.push(cv);
        paint(cv, F, r[10 + i], I, M);
        b.addEventListener('click', function () { dl(cv, 'freshill-' + F.key + '-' + M.file + '-' + M.tag + (M.scale ? '-' + cv.width + 'x' + cv.height : '') + '.png'); toast('Saving ' + F.name + ' ' + M.id); });
      });
      a5.addEventListener('click', function () { FL.forEach(function (F, i) { setTimeout(function () { dl(cvs[i], 'freshill-' + F.key + '-' + M.file + '-' + M.tag + (M.scale ? '-' + cvs[i].width + 'x' + cvs[i].height : '') + '.png'); }, i * 700); }); toast('Saving all ' + M.id + ' files'); });
      all.push(cvs);
    });
    $('#all').addEventListener('click', function () { var n = 0; FORMATS.forEach(function (M, mi) { FL.forEach(function (F, i) { setTimeout(function () { dl(all[mi][i], 'freshill-' + F.key + '-' + M.file + '-' + M.tag + (M.scale ? '-' + all[mi][i].width + 'x' + all[mi][i].height : '') + '.png'); }, (n++) * 700); }); }); toast('Saving all ' + n + ' files'); });
  }).catch(function (e) { grid.textContent = 'Could not load assets: ' + e.message; });
})();