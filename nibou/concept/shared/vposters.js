/* Shared poster maker for the Yourgurt, Kid's Joy and Bebee concept pages.
   Everything is vector: the brand logo (assets/brands/*.svg) and the product scene (brands.js) are drawn as SVG images,
   so feed (1080x1350), story (1080x1920) and A3 print (297x420 mm + 3 mm bleed, 3582x5034 px) all stay sharp. */
(function () {
  'use strict';
  var W = 1080, SC = 1, BL = 0, DY = 0, TOP = 0, FOOT = 0, INK = '#3b0d12';
  var $ = function (s) { return document.querySelector(s); };
  function load(src) { return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { rej(new Error('load ' + src.slice(0, 60))); }; i.src = src; }); }
  function svgImg(s) { return load('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s)); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function fontOf(B, px) { return B.head.font.replace('%s', px); }
  function fitSize(c, B, t, maxW, size) { c.font = fontOf(B, size); var w = c.measureText(t).width; return w > maxW ? Math.floor(size * maxW / w) : size; }

  function headline(c, B, P, x, y, size, maxW, rot, align) {
    c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.textBaseline = 'alphabetic'; c.lineJoin = 'round'; c.textAlign = align || 'left';
    var fs = size; P.head.forEach(function (l) { fs = Math.min(fs, fitSize(c, B, l, maxW, size)); }); c.font = fontOf(B, fs);
    P.head.forEach(function (t, n) {
      var ty = n * fs * (B.head.lead || 0.98);
      c.lineWidth = fs * 0.30; c.strokeStyle = '#fff'; c.shadowColor = 'rgba(30,10,30,.35)'; c.shadowBlur = 22 * SC; c.shadowOffsetY = 12 * SC; c.strokeText(t, 0, ty); c.shadowColor = 'transparent';
      c.lineWidth = fs * 0.18; c.strokeStyle = P.stroke; c.strokeText(t, 0, ty);
      var g = c.createLinearGradient(0, ty - fs * .8, 0, ty); g.addColorStop(0, P.fill[0]); g.addColorStop(1, P.fill[1]); c.fillStyle = g; c.fillText(t, 0, ty);
    });
    c.restore(); return fs;
  }
  function subline(c, B, P, t, x, y, align, size) {
    c.save(); c.font = B.sub.font.replace('%s', size || 30); c.fillStyle = P.subCol || '#fff'; c.textAlign = align || 'left'; c.shadowColor = 'rgba(30,10,30,.5)'; c.shadowBlur = 12 * SC; c.fillText(t, x, y); c.restore();
  }
  function sparkle(c, x, y, s, rot, col, ink) { c.save(); c.translate(x, y); c.rotate((rot || 0) * Math.PI / 180); c.scale(s / 100, s / 100); c.lineJoin = 'round'; c.lineWidth = 6; c.strokeStyle = ink; c.fillStyle = col || '#fff'; c.beginPath(); c.moveTo(0, -48); c.quadraticCurveTo(4, -6, 48, 0); c.quadraticCurveTo(4, 6, 0, 48); c.quadraticCurveTo(-4, 6, -48, 0); c.quadraticCurveTo(-4, -6, 0, -48); c.closePath(); c.fill(); c.stroke(); c.restore(); }
  function decor(c, I, P, slots) {
    (P.decor || []).forEach(function (k, n) { var s = slots[n % slots.length], im = I.sat[k]; if (!im) return; c.save(); c.translate(s[0], s[1]); c.rotate((s[3] || 0) * Math.PI / 180); c.shadowColor = 'rgba(30,10,30,.3)'; c.shadowBlur = 14 * SC; c.shadowOffsetY = 8 * SC; c.drawImage(im, -s[2] / 2, -s[2] / 2, s[2], s[2]); c.restore(); });
  }

  function footer(c, B, I, cy) {
    c.save(); c.fillStyle = B.footBg; c.beginPath(); c.ellipse(170, cy, 140, 54, -.03, 0, 7); c.fill(); c.beginPath(); c.arc(38, cy - 30, 8, 0, 7); c.fill(); c.beginPath(); c.arc(292, cy - 42, 7, 0, 7); c.fill(); c.restore();
    var nb = I.nibou, nw = 214, nh = nb.height * nw / nb.width; c.drawImage(nb, 170 - nw / 2, cy - nh / 2, nw, nh);
    c.save(); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 14 * SC; c.shadowOffsetY = 6 * SC; rrect(c, 330, cy - 40, 700, 80, 40); c.fillStyle = '#fff'; c.fill(); c.restore();
    c.fillStyle = B.ink; c.font = '900 24px ' + B.sub.family; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('FIND IT AT', 362, cy + 2);
    var hs = [28, 22, 32, 28], gap = 30, tot = 0; I.stores.forEach(function (s, i) { tot += s.width * hs[i] / s.height; }); tot += gap * 3; var k = Math.min(1, 440 / tot), x = 1008 - tot * k;
    I.stores.forEach(function (s, i) { var hh = hs[i] * k, ww = s.width * hh / s.height; c.drawImage(s, x, cy + 2 - hh / 2, ww, hh); x += ww + gap * k; });
    c.textBaseline = 'alphabetic';
  }
  function stickerLogo(c, I, cx, cy, w, rot) { var im = I.logo; if (!im) return; var h = im.height * w / im.width; c.save(); c.translate(cx, cy); c.rotate((rot || 0) * Math.PI / 180); c.shadowColor = 'rgba(30,10,30,.35)'; c.shadowBlur = 16 * SC; c.shadowOffsetY = 8 * SC; c.drawImage(im, -w / 2, -h / 2, w, h); c.restore(); }
  function product(c, im, cx, cy, w, rot) {
    var h = w * im.height / im.width;
    c.save(); c.translate(cx + 24, cy + (h === w ? w * .36 : h * .5)); c.scale(1, .1); c.beginPath(); c.arc(0, 0, w * .36, 0, 7); c.fillStyle = 'rgba(30,0,20,.32)'; c.filter = 'blur(' + (22 * SC) + 'px)'; c.fill(); c.restore();
    c.save(); c.translate(cx, cy); c.rotate((rot || 0) * Math.PI / 180); c.shadowColor = 'rgba(30,0,20,.38)'; c.shadowBlur = 36 * SC; c.shadowOffsetX = -14 * SC; c.shadowOffsetY = 26 * SC; c.drawImage(im, -w / 2, -h / 2, w, h); c.restore();
  }

  var SLOTS = {
    1: [[110, 600, 120, -12], [975, 520, 130, 14], [90, 1010, 110, 10], [990, 1000, 118, -10], [930, 330, 96, 8]],
    2: [[100, 470, 112, -10], [985, 500, 120, 12], [100, 1060, 112, 8], [985, 1070, 112, -8], [540, 410, 90, 0]],
    3: [[90, 560, 118, -12], [990, 540, 126, 12], [96, 1010, 110, 10], [992, 1000, 116, -10], [540, 470, 90, 6]]
  };

  function paint(cv, B, P, I, F) {
    SC = F.scale; BL = F.bleed; DY = F.h - 1350; var HH = F.h, M2 = DY / 2; TOP = F.type === 'story' ? 120 : 0; FOOT = F.type === 'story' ? -150 : 0;
    var c = cv.getContext('2d'), R = rng(P.key.length * 313 + B.key.length * 17), L = P.layout || 1;
    cv.width = Math.round((W + 2 * BL) * SC); cv.height = Math.round((HH + 2 * BL) * SC); c.setTransform(SC, 0, 0, SC, BL * SC, BL * SC); c.imageSmoothingQuality = 'high';
    var g = c.createRadialGradient(W / 2, 760 + M2, 60, W / 2, 760 + M2, 1000); var bgc = P.bg || ['#3A1A80', '#2B1060']; g.addColorStop(0, bgc[0]); g.addColorStop(1, bgc[1]); c.fillStyle = g; c.fillRect(-BL, -BL, W + 2 * BL, HH + 2 * BL);
    if (L !== 3 && !P.photo) { c.save(); c.translate(W / 2, 780 + M2); c.fillStyle = P.ray; var n = 22; for (var i = 0; i < n; i += 2) { var a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a0) * 1900, Math.sin(a0) * 1900); c.lineTo(Math.cos(a1) * 1900, Math.sin(a1) * 1900); c.closePath(); c.fill(); } c.restore(); }
    for (var j = 0; j < (P.photo ? 0 : 64); j++) { var x = R() * W, y = R() * HH; c.beginPath(); c.arc(x, y, 3 + R() * 9, 0, 7); c.fillStyle = P.dots[Math.floor(R() * P.dots.length)]; c.globalAlpha = .8; c.fill(); c.globalAlpha = 1; }
    var prod = P.img ? I.img[P.img] : I.scene[P.variant];
    if (P.photo) {
      /* a real Nibou product photo, cropped to hide the logos baked into the original, faded into flat colour above and below */
      var im = I.img[P.photo.src], cr = P.photo.crop, bw = W + 2 * BL, bh = bw * cr[3] / cr[2], y0 = (P.photo.y0 || 330) + M2, y1 = y0 + bh;
      c.fillStyle = P.bgTop; c.fillRect(-BL, -BL, bw, y0 + BL + 2); c.fillStyle = P.bgBot; c.fillRect(-BL, y1 - 2, bw, HH + BL - y1 + 4);
      c.drawImage(im, cr[0], cr[1], cr[2], cr[3], -BL, y0, bw, bh);
      var fh = P.photo.fadeTop == null ? 130 : P.photo.fadeTop, ft = c.createLinearGradient(0, y0, 0, y0 + fh); ft.addColorStop(0, P.bgTop); ft.addColorStop(1, P.bgTopA); c.fillStyle = ft; c.fillRect(-BL, y0, bw, fh + 1);
      var fb = c.createLinearGradient(0, y1 - 110, 0, y1); fb.addColorStop(0, P.bgBotA); fb.addColorStop(1, P.bgBot); c.fillStyle = fb; c.fillRect(-BL, y1 - 111, bw, 111);
      var fsp = headline(c, B, P, 62, 170 + TOP, 132, 930, -3);
      var sy2 = 170 + TOP + fsp * (B.head.lead || .98) * (P.head.length - 1) + 64; c.save(); c.font = B.sub.font.replace('%s', 30); var sw2 = c.measureText(P.sub).width + 52; rrect(c, 62, sy2 - 36, sw2, 54, 27); c.fillStyle = B.pill || 'rgba(43,16,96,.78)'; c.fill(); c.restore();
      subline(c, B, P, P.sub, 88, sy2, 'left');
      if (B.logoPos === 'br') stickerLogo(c, I, 850, 1118 + DY + FOOT, (B.logoW1 || 300) * .9, -5); else stickerLogo(c, I, 868, 205 + TOP, (B.logoW1 || 300) * .95, 6);
      sparkle(c, 110, y1 - 160, 50, -10, '#fff', B.ink);
    } else if (L === 1) {
      var sp = c.createRadialGradient(W / 2, 800 + M2, 20, W / 2, 800 + M2, 560); sp.addColorStop(0, 'rgba(255,255,255,.35)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sp; c.fillRect(-BL, 200, W + 2 * BL, 1200 + DY);
      decor(c, I, P, SLOTS[1].map(function (s) { return [s[0], s[1] + M2, s[2], s[3]]; }));
      product(c, prod, 540, 810 + M2, P.pw || 1020, P.rot || -3);
      var fs = headline(c, B, P, 62, 170 + TOP, 132, 930, -3);
      subline(c, B, P, P.sub, 70, 170 + TOP + fs * (B.head.lead || .98) * (P.head.length - 1) + 64, 'left');
      sparkle(c, 960, 410 + TOP, 56, 8, '#fff', B.ink); sparkle(c, 110, 700 + M2, 48, -10, B.sparkle, B.ink);
      stickerLogo(c, I, 868, 1130 + DY + FOOT, B.logoW1 || 300, -6);
    } else if (L === 2) {
      c.save(); c.shadowColor = 'rgba(30,10,30,.3)'; c.shadowBlur = 30 * SC; c.shadowOffsetY = 16 * SC; c.beginPath(); c.arc(540, 790 + M2, 450, 0, 7); c.fillStyle = P.disc || 'rgba(255,255,255,.28)'; c.fill(); c.restore();
      c.save(); c.setLineDash([4, 26]); c.lineCap = 'round'; c.lineWidth = 10; c.strokeStyle = '#fff'; c.beginPath(); c.arc(540, 790 + M2, 478, 0, 7); c.stroke(); c.restore();
      decor(c, I, P, SLOTS[2].map(function (s) { return [s[0], s[1] + M2, s[2], s[3]]; }));
      product(c, prod, 540, 800 + M2, P.pw || 940, P.rot || 3);
      var fs2 = headline(c, B, P, 540, 190 + TOP, 128, 940, 0, 'center');
      c.save(); c.translate(P.tapeX || 410, 1100 + M2 + 36); c.rotate(-3 * Math.PI / 180); c.font = B.sub.font.replace('%s', 30); var tw = c.measureText(P.sub).width + 80; c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 14 * SC; c.shadowOffsetY = 7 * SC; rrect(c, -tw / 2, -34, tw, 68, 34); c.fillStyle = P.tape || '#fff'; c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 5; c.strokeStyle = P.stroke; c.stroke(); c.fillStyle = P.tapeInk || B.ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(P.sub, 0, 3); c.restore();
      sparkle(c, 960, 380 + TOP, 54, 8, '#fff', B.ink); sparkle(c, 120, 700 + M2, 46, -10, B.sparkle, B.ink);
      stickerLogo(c, I, 868, 1150 + DY + FOOT - 0, (B.logoW1 || 300) * .8, 6);
    } else {
      /* logo-led */
      c.save(); c.fillStyle = 'rgba(255,255,255,.16)'; c.beginPath(); c.moveTo(-BL, 1010 + M2); c.bezierCurveTo(260, 930 + M2, 560, 1100 + M2, 1100, 960 + M2); c.lineTo(1100, HH + BL); c.lineTo(-BL, HH + BL); c.closePath(); c.fill(); c.restore();
      decor(c, I, P, SLOTS[3].map(function (s) { return [s[0], s[1] + M2, s[2], s[3]]; }));
      product(c, prod, 540, 850 + M2, P.pw || 880, P.rot || -2);
      stickerLogo(c, I, 540, 250 + TOP, B.logoW3 || 640, -4);
      var fs3 = headline(c, B, P, 540, 560 + TOP, 96, 900, -2, 'center');
      var sy = 560 + TOP + fs3 * (B.head.lead || .98) * (P.head.length - 1) + 54; c.save(); c.font = B.sub.font.replace('%s', 28); var sw = c.measureText(P.sub).width + 56; rrect(c, 540 - sw / 2, sy - 34, sw, 50, 25); var sc = (P.subCol || '#ffffff').replace('#', ''), lum = parseInt(sc.substr(0, 2), 16) * .3 + parseInt(sc.substr(2, 2), 16) * .6 + parseInt(sc.substr(4, 2), 16) * .1; c.fillStyle = P.subBg || (lum < 110 ? 'rgba(255,255,255,.72)' : 'rgba(40,10,30,.55)'); c.fill(); c.restore(); subline(c, B, P, P.sub, 540, sy, 'center', 28);
      sparkle(c, 950, 700 + M2, 52, 8, '#fff', B.ink);
    }
    if (B.tag) { c.save(); c.translate(940, 60 + (F.type === 'story' ? 150 : 0)); c.rotate(6 * Math.PI / 180); c.font = '900 22px ' + B.sub.family; var w = c.measureText(B.tag).width + 44; rrect(c, -w / 2, -24, w, 48, 24); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 4; c.strokeStyle = B.ink; c.stroke(); c.fillStyle = B.ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(B.tag, 0, 2); c.restore(); }
    footer(c, B, I, 1288 + DY + FOOT);
  }

  function toast(m) { var e = $('#msg'); e.textContent = m; e.classList.add('on'); setTimeout(function () { e.classList.remove('on'); }, 1600); }
  function dl(canvas, name) { canvas.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 800); }, 'image/png'); }

  function run(B) {
    var base = B.base || '../../', grid = $('#grid'), BA = window.BrandArt;
    function dataUri(txt) { return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(txt))); }
    var logoFiles = B.noLogo ? [] : [B.key + '-logo.svg', B.key + '-sticker.svg'];
    Promise.all(logoFiles.map(function (f) { return fetch(base + 'assets/brands/' + f).then(function (r) { return r.text(); }); }).concat(B.fonts.map(function (f) { return document.fonts.load(f); }))).then(function (res) {
      var map = {}; logoFiles.forEach(function (f, i) { map['assets/brands/' + f] = dataUri(res[i]); });
      var variants = []; B.posters.forEach(function (P) { if (P.variant && variants.indexOf(P.variant) < 0) variants.push(P.variant); });
      var imgs = []; B.posters.forEach(function (P) { [P.img, P.photo && P.photo.src].forEach(function (s) { if (s && imgs.indexOf(s) < 0) imgs.push(s); }); });
      var kinds = []; B.posters.forEach(function (P) { (P.decor || []).forEach(function (k) { if (kinds.indexOf(k) < 0) kinds.push(k); }); });
      var jobs = [B.noLogo ? Promise.resolve(null) : load(base + 'assets/brands/' + B.key + '-sticker.svg'), load(base + 'assets/nibou-logo-white.svg')]
        .concat(['aeon', 'mydin', 'shopee', 'lazada'].map(function (s) { return load(base + 'assets/stores/' + s + '.svg'); }))
        .concat(variants.map(function (v) { var d = BA.doc(B.key, v, 1400); Object.keys(map).forEach(function (k) { d = d.split('href="' + k + '"').join('href="' + map[k] + '"'); }); return svgImg(d); }))
        .concat(kinds.map(function (k) { return svgImg(BA.satDoc(k, 400)); }))
        .concat(imgs.map(function (s) { return load(s); }));
      return Promise.all(jobs).then(function (r) {
        var I = { logo: r[0], nibou: r[1], stores: r.slice(2, 6), scene: {}, sat: {}, img: {} };
        variants.forEach(function (v, n) { I.scene[v] = r[6 + n]; }); kinds.forEach(function (k, n) { I.sat[k] = r[6 + variants.length + n]; }); imgs.forEach(function (s, n) { I.img[s] = r[6 + variants.length + kinds.length + n]; });
        /* colour of the photo's top and bottom edge, so the flat colour above and below blends in */
        function edge(im, cr, bottom) { var k = document.createElement('canvas'); k.width = k.height = 8; var x = k.getContext('2d'); x.drawImage(im, cr[0], bottom ? cr[1] + cr[3] - 8 : cr[1], cr[2], 8, 0, 0, 8, 8); var d = x.getImageData(0, 0, 8, 8).data, a = [0, 0, 0], i; for (i = 0; i < 64; i++) { a[0] += d[i * 4]; a[1] += d[i * 4 + 1]; a[2] += d[i * 4 + 2]; } return a.map(function (v) { return Math.round(v / 64); }); }
        B.posters.forEach(function (P) { if (!P.photo) return; var im = I.img[P.photo.src], t = edge(im, P.photo.crop, 0), b = edge(im, P.photo.crop, 1); P.bgTop = P.bgTop || 'rgb(' + t.join(',') + ')'; P.bgTopA = 'rgba(' + t.join(',') + ',0)'; P.bgBot = P.bgBot || 'rgb(' + b.join(',') + ')'; P.bgBotA = 'rgba(' + b.join(',') + ',0)'; });
        var FM = [
          { id: 'feed', title: 'Feed 4:5', small: '1080 × 1350 px', F: { h: 1350, bleed: 0, scale: 1, type: 'feed' }, file: function (P, cv) { return B.key + '-' + P.key + '-feed-1080x1350.png'; } },
          { id: 'story', title: 'Story 9:16', small: '1080 × 1920 px', F: { h: 1920, bleed: 0, scale: 1, type: 'story' }, file: function (P, cv) { return B.key + '-' + P.key + '-story-1080x1920.png'; } },
          { id: 'print', title: 'Print A3', small: '297 × 420 mm + 3 mm bleed, 3582 × 5034 px', F: { h: 1527, bleed: 11, scale: 3.25, type: 'print' }, file: function (P, cv) { return B.key + '-' + P.key + '-print-A3-bleed-' + cv.width + 'x' + cv.height + '.png'; } }
        ], all = [];
        FM.forEach(function (fm) {
          var sec = document.createElement('section'); sec.className = 'fmt'; sec.innerHTML = '<div class="fh"><h2>' + fm.title + '<small>' + fm.small + '</small></h2></div>'; var row = document.createElement('div'); row.className = 'row ' + fm.id; sec.appendChild(row); grid.appendChild(sec);
          fm.cvs = [];
          B.posters.forEach(function (P) {
            var fg = document.createElement('figure'), cv = document.createElement('canvas'), cap = document.createElement('figcaption');
            cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', B.name + ' ' + P.name + ' poster, ' + fm.title + ': ' + P.head.join(' '));
            cap.innerHTML = '<b>' + P.name + '</b>'; var b = document.createElement('button'); b.type = 'button'; b.className = 'btn sm'; b.textContent = 'Download PNG'; cap.appendChild(b);
            fg.appendChild(cv); fg.appendChild(cap); row.appendChild(fg); fm.cvs.push(cv); paint(cv, B, P, I, fm.F);
            b.addEventListener('click', function () { dl(cv, fm.file(P, cv)); toast('Saving ' + fm.title + ' ' + P.name); });
            all.push({ cv: cv, name: function () { return fm.file(P, cv); } });
          });
        });
        function bulk(list, label) { list.forEach(function (o, i) { setTimeout(function () { dl(o.cv, o.name()); }, i * 1100); }); toast('Saving ' + label); }
        $('#all').addEventListener('click', function () { bulk(all.filter(function (o, i) { return i < B.posters.length * 2; }), 'all feed and story posters'); });
        var pb = $('#allprint'); if (pb) pb.addEventListener('click', function () { bulk(all.slice(B.posters.length * 2), 'all A3 prints'); });
      });
    }).catch(function (e) { grid.textContent = 'Could not build the posters: ' + e.message; });
  }
  window.VPosters = { run: run };
})();
