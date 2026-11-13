/* Real fruits, drawn as vectors (SVG), animated in a 3D-feeling stage: float, squash, pointer tilt, scroll spin, flip on flavour change.
   Keeps the same small API as the earlier WebGL version (window.Jelly) so main.js needs no change. No libraries. */
(function () {
  'use strict';
  var FLAVOURS = []; /* filled with the six brands by brands.js */
  var API = { FLAVOURS: FLAVOURS, fruitInner: function (i, p) { return BUILD[i](p); }, supported: false, init: function () { return false; }, setFlavour: function () { }, kick: function () { }, setPointer: function () { }, setScroll: function () { }, setActive: function () { } };
  window.Jelly = API;

  /* ---------- little shared pieces ---------- */
  function leaf(fill) { return '<path d="M0 0 C 30 -34 84 -40 112 -8 C 84 18 30 24 0 0Z" fill="' + fill + '"/><path d="M6 -2 C 40 -14 76 -14 104 -8" stroke="#D5F5B0" stroke-width="3" fill="none" opacity=".75" stroke-linecap="round"/>'; }
  function shine(cx, cy, rx, ry, rot, op) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')" fill="#fff" opacity="' + (op || 0.4) + '"/>'; }

  /* each builder returns the inside of an <svg viewBox="0 -20 400 420"> ; p = unique id prefix */
  var BUILD = [
    /* 0 MANGO */
    function (p) {
      var body = 'M236 70 C 306 58 368 112 366 200 C 364 288 312 366 232 378 C 148 392 66 350 50 276 C 40 224 78 188 118 150 C 150 118 186 78 236 70Z';
      return '<defs><radialGradient id="' + p + 'g" cx="36%" cy="34%" r="80%"><stop offset="0" stop-color="#FFE45C"/><stop offset=".42" stop-color="#FFB02E"/><stop offset=".8" stop-color="#FF7A1F"/><stop offset="1" stop-color="#E5421F"/></radialGradient>' +
        '<radialGradient id="' + p + 'b" cx="88%" cy="28%" r="55%"><stop offset="0" stop-color="#E02B2B" stop-opacity=".8"/><stop offset="1" stop-color="#E02B2B" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="' + p + 'l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7BD44A"/><stop offset="1" stop-color="#2E8B2A"/></linearGradient></defs>' +
        '<path d="' + body + '" fill="url(#' + p + 'g)"/><path d="' + body + '" fill="url(#' + p + 'b)"/>' +
        '<path d="M150 300 C 200 350 290 350 340 280" stroke="#C2410C" stroke-width="10" fill="none" opacity=".18" stroke-linecap="round"/>' + shine(140, 170, 26, 58, 38, 0.42) + shine(112, 250, 8, 16, 20, 0.3) +
        '<path d="M232 74 C 226 54 232 40 250 32" stroke="#6B3E1E" stroke-width="11" fill="none" stroke-linecap="round"/><g transform="translate(250 34) rotate(-14) scale(1.05)"><g fill="url(#' + p + 'l)">' + leaf('url(#' + p + 'l)') + '</g></g>';
    },
    /* 1 LEMON */
    function (p) {
      var pores = ''; for (var i = 0; i < 46; i++) { var a = i * 2.399, r = 20 + (i * 53 % 100) * 1.0, x = 200 + Math.cos(a) * r * 1.45, y = 210 + Math.sin(a) * r * 0.98; pores += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (1.6 + (i % 3) * .6) + '" fill="#E0A800" opacity=".28"/>'; }
      return '<defs><radialGradient id="' + p + 'g" cx="36%" cy="32%" r="80%"><stop offset="0" stop-color="#FFF9A8"/><stop offset=".45" stop-color="#FFE23A"/><stop offset=".85" stop-color="#F5B800"/><stop offset="1" stop-color="#D99A00"/></radialGradient><linearGradient id="' + p + 'l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8BDC52"/><stop offset="1" stop-color="#2F8E2C"/></linearGradient></defs>' +
        '<g transform="rotate(-22 200 220)"><ellipse cx="44" cy="222" rx="22" ry="16" fill="#F2B600"/><ellipse cx="356" cy="222" rx="22" ry="16" fill="#F2B600"/><path d="M52 222 C 52 148 120 100 200 100 C 280 100 348 148 348 222 C 348 296 280 344 200 344 C 120 344 52 296 52 222Z" fill="url(#' + p + 'g)"/>' + pores +
        shine(150, 170, 62, 20, -16, 0.45) + '<path d="M120 318 C 190 346 290 340 336 276" stroke="#C98A00" stroke-width="10" fill="none" opacity=".16" stroke-linecap="round"/></g>' +
        '<g transform="translate(262 96) rotate(-35)"><path d="M0 0 C 6 -16 4 -30 -2 -44" stroke="#6B4A1E" stroke-width="7" fill="none" stroke-linecap="round"/><g transform="translate(-2 -40) rotate(-20)">' + leaf('url(#' + p + 'l)') + '</g></g>';
    },
    /* 2 BLACKCURRANT */
    function (p) {
      var B = [[130, 250, 62], [255, 262, 58], [190, 170, 60], [112, 150, 46], [286, 160, 46], [195, 330, 46]], s = '', i;
      var stem = '<path d="M200 -6 C 200 40 196 100 190 170" stroke="#4E7D2E" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M200 -6 C 190 60 130 90 112 150" stroke="#4E7D2E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M200 -6 C 220 60 276 100 286 160" stroke="#4E7D2E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M190 200 C 150 220 140 230 130 250" stroke="#4E7D2E" stroke-width="5" fill="none"/><path d="M190 200 C 230 230 250 240 255 262" stroke="#4E7D2E" stroke-width="5" fill="none"/>';
      for (i = 0; i < B.length; i++) { var b = B[i]; s += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="url(#' + p + 'g)"/>' + shine(b[0] - b[2] * .32, b[1] - b[2] * .36, b[2] * .24, b[2] * .14, -35, 0.55) + '<g transform="translate(' + (b[0] + b[2] * .2) + ' ' + (b[1] + b[2] * .58) + ')" opacity=".85"><circle r="5" fill="#2A1038"/><path d="M0 0 L-9 -4 M0 0 L9 -4 M0 0 L-6 8 M0 0 L6 8 M0 0 L0 -10" stroke="#2A1038" stroke-width="2.4" stroke-linecap="round"/></g>'; }
      return '<defs><radialGradient id="' + p + 'g" cx="34%" cy="30%" r="80%"><stop offset="0" stop-color="#A66BDB"/><stop offset=".5" stop-color="#5C2A8C"/><stop offset="1" stop-color="#1E0B34"/></radialGradient><linearGradient id="' + p + 'l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7BD44A"/><stop offset="1" stop-color="#2E8B2A"/></linearGradient></defs>' + stem +
        '<g transform="translate(204 6) rotate(-35) scale(.9)">' + leaf('url(#' + p + 'l)') + '</g><g transform="translate(196 10) rotate(-150) scale(.8)">' + leaf('url(#' + p + 'l)') + '</g>' + s;
    },
    /* 3 STRAWBERRY */
    function (p) {
      var heart = 'M200 388 C 92 340 38 248 54 166 C 68 100 126 74 200 90 C 274 74 332 100 346 166 C 362 248 308 340 200 388Z', seeds = '', x, y, k = 0;
      for (y = 112; y < 380; y += 30) { for (x = 60 + ((k % 2) * 17); x < 350; x += 34) { seeds += '<g transform="translate(' + x + ' ' + y + ') rotate(' + (((x * 7 + y * 3) % 40) - 20) + ')"><ellipse cx="0" cy="4" rx="5" ry="3.4" fill="#8A0F25" opacity=".35"/><path d="M0 -8 C 5 -4 5 4 0 8 C -5 4 -5 -4 0 -8Z" fill="#FFE08A" stroke="#E0A800" stroke-width="1"/></g>'; } k++; }
      var calyx = ''; for (var a = -75; a <= 75; a += 30) calyx += '<g transform="translate(200 98) rotate(' + (a - 180) + ')"><path d="M0 0 C -16 -10 -22 -30 -4 -50 C 10 -34 16 -14 0 0Z" fill="url(#' + p + 'l)"/></g>';
      return '<defs><radialGradient id="' + p + 'g" cx="36%" cy="30%" r="85%"><stop offset="0" stop-color="#FF7A86"/><stop offset=".5" stop-color="#F0364D"/><stop offset="1" stop-color="#B8142E"/></radialGradient><linearGradient id="' + p + 'l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8BDC52"/><stop offset="1" stop-color="#2F8E2C"/></linearGradient><clipPath id="' + p + 'c"><path d="' + heart + '"/></clipPath></defs>' +
        '<path d="' + heart + '" fill="url(#' + p + 'g)"/><g clip-path="url(#' + p + 'c)">' + seeds + '<ellipse cx="300" cy="300" rx="120" ry="140" fill="#7A0A1C" opacity=".16"/></g>' + shine(130, 170, 22, 52, 28, 0.42) +
        '<g transform="translate(0 -4)">' + calyx + '<path d="M196 96 C 194 70 200 50 208 40" stroke="#4E7D2E" stroke-width="10" fill="none" stroke-linecap="round"/></g>';
    },
    /* 4 LYCHEE */
    function (p) {
      var cells = '', r = 148, cx = 200, cy = 224, dx = 34, dy = 29, row = 0, x, y;
      for (y = cy - r; y <= cy + r; y += dy) { for (x = cx - r - (row % 2 ? 0 : dx / 2); x <= cx + r; x += dx) { var dd = Math.hypot(x - cx, y - cy); if (dd < r - 6) cells += '<polygon points="' + hex(x, y, 15.5) + '" fill="rgba(255,255,255,' + (0.05 + 0.12 * (1 - dd / r)).toFixed(2) + ')" stroke="rgba(120,0,30,.4)" stroke-width="1.6"/><circle cx="' + x + '" cy="' + y + '" r="2.4" fill="rgba(110,0,30,.35)"/>'; } row++; }
      function hex(x, y, rr) { var s = ''; for (var i = 0; i < 6; i++) { var an = Math.PI / 3 * i + Math.PI / 6; s += (x + Math.cos(an) * rr).toFixed(1) + ',' + (y + Math.sin(an) * rr).toFixed(1) + ' '; } return s; }
      return '<defs><radialGradient id="' + p + 'g" cx="36%" cy="32%" r="80%"><stop offset="0" stop-color="#FF7A8E"/><stop offset=".5" stop-color="#E93A57"/><stop offset="1" stop-color="#A8153A"/></radialGradient><radialGradient id="' + p + 'f" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#FBEFE6"/><stop offset="1" stop-color="#EBD3C6"/></radialGradient><linearGradient id="' + p + 'l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7BD44A"/><stop offset="1" stop-color="#2E8B2A"/></linearGradient><clipPath id="' + p + 'c"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/></clipPath></defs>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + p + 'g)"/><g clip-path="url(#' + p + 'c)">' + cells + '</g>' + shine(150, 170, 26, 52, 36, 0.4) +
        '<circle cx="290" cy="160" r="62" fill="#9B1233"/><circle cx="290" cy="160" r="54" fill="url(#' + p + 'f)"/><ellipse cx="274" cy="142" rx="14" ry="22" transform="rotate(30 274 142)" fill="#fff" opacity=".75"/><ellipse cx="300" cy="174" rx="16" ry="12" fill="#6B3E1E" opacity=".0"/>' +
        '<path d="M196 82 C 192 60 198 44 210 34" stroke="#6B4A1E" stroke-width="10" fill="none" stroke-linecap="round"/><g transform="translate(210 36) rotate(-18)">' + leaf('url(#' + p + 'l)') + '</g>';
    },
    /* 5 SOURSOP */
    function (p) {
      var body = 'M200 376 C 108 354 50 272 64 190 C 76 110 142 52 222 62 C 304 72 356 150 342 238 C 328 320 270 384 200 376Z', spines = '', scales = '', i, a, x, y, ex = 200, ey = 220;
      for (i = 0; i < 30; i++) { a = i / 30 * Math.PI * 2; var rx = 138, ry = 152; x = ex + Math.cos(a) * (rx - 4); y = ey + Math.sin(a) * (ry - 4); var deg = a * 180 / Math.PI + 90; spines += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + deg.toFixed(1) + ')"><path d="M-9 4 Q -2 -20 8 -34 Q 5 -12 9 4Z" fill="#2E6B1E"/><path d="M-3 2 Q 0 -14 6 -26" stroke="#B5E07C" stroke-width="2" fill="none" opacity=".7"/></g>'; }
      for (y = 90; y < 360; y += 30) for (x = 80 + (y % 60 ? 15 : 0); x < 330; x += 30) { scales += '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="6" fill="#D7F2A8" opacity=".28"/>'; }
      return '<defs><radialGradient id="' + p + 'g" cx="36%" cy="30%" r="85%"><stop offset="0" stop-color="#B9E27A"/><stop offset=".5" stop-color="#6FAE3A"/><stop offset="1" stop-color="#3C7A25"/></radialGradient><linearGradient id="' + p + 'l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7BD44A"/><stop offset="1" stop-color="#2E8B2A"/></linearGradient><clipPath id="' + p + 'c"><path d="' + body + '"/></clipPath></defs>' + spines +
        '<path d="' + body + '" fill="url(#' + p + 'g)"/><g clip-path="url(#' + p + 'c)">' + scales + '</g>' + shine(142, 160, 24, 56, 30, 0.38) +
        '<path d="M214 66 C 212 46 218 32 230 24" stroke="#5A3A1A" stroke-width="10" fill="none" stroke-linecap="round"/><g transform="translate(230 26) rotate(-16)">' + leaf('url(#' + p + 'l)') + '</g>';
    }
  ];

  var uid = 0;
  function fruitSVG(i) { var p = 'f' + (++uid) + '_'; return '<svg viewBox="-10 -20 420 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + BUILD[i](p) + '</svg>'; }
  function leafSVG() { var p = 'f' + (++uid) + '_'; return '<svg viewBox="-10 -50 130 80" aria-hidden="true"><defs><linearGradient id="' + p + 'l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7BD44A"/><stop offset="1" stop-color="#2E8B2A"/></linearGradient></defs>' + leaf('url(#' + p + 'l)') + '</svg>'; }
  function dropSVG(col) { var p = 'f' + (++uid) + '_'; return '<svg viewBox="0 0 60 80" aria-hidden="true"><defs><radialGradient id="' + p + 'd" cx="35%" cy="35%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="' + col + '"/><stop offset="1" stop-color="' + col + '"/></radialGradient></defs><path d="M30 4 C 44 26 56 40 56 54 A 26 26 0 0 1 4 54 C 4 40 16 26 30 4Z" fill="url(#' + p + 'd)" opacity=".92"/><ellipse cx="20" cy="50" rx="5" ry="9" fill="#fff" opacity=".7" transform="rotate(20 20 50)"/></svg>'; }
  function sparkSVG() { return '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 0 L36 24 L60 30 L36 36 L30 60 L24 36 L0 30 L24 24Z" fill="#fff" opacity=".9"/></svg>'; }

  API.fruitSVG = fruitSVG; API.leafSVG = leafSVG; API.dropSVG = dropSVG; API.sparkSVG = sparkSVG;

  /* ---------- real 3D ----------
     The fruit icons, the decor pieces and the six product scenes are modelled and rendered in Blender (assets/3d/).
     Each product scene is a 65-frame turntable (-36 to +36 degrees), so the pointer and the scroll really turn the products.
     The vector art above is kept as the instant fallback while the renders load, and for the poster pages. */
  var D3 = 'assets/3d/', NF = 65, SPAN = 36, FR = {}, HDQ = (window.devicePixelRatio || 1) * Math.min(innerWidth * .4, innerHeight * .62) * 1.18 > 900;   /* big or high-density screens also get the 1280 px frames */
  API.use3d = true;
  function img3(kind) {
    var k = kind.split(':'), c = (k[1] || '').toUpperCase(), n = null;
    switch (k[0]) {
      case 'fruit': n = 'fruit-' + (+k[1]); break;
      case 'leaf': n = 'decor-leaf'; break;
      case 'drop': n = 'decor-drop-' + (/FFC83A|FFB52E/.test(c) ? 'honey' : /FFD1E3|FFC2DA/.test(c) ? 'pink' : 'clear'); break;
      case 'heart': n = 'decor-heart-' + (/FFE14A|FFD21F/.test(c) ? 'yellow' : /FF8FB8/.test(c) ? 'pink' : 'red'); break;
      case 'star': n = 'decor-star-' + (/7FE0FF|5CCBFF/.test(c) ? 'blue' : 'yellow'); break;
      case 'cube': n = 'decor-cube'; break;
      case 'bubble': n = 'decor-bubble-' + (/FF7A3C/.test(c) ? 'orange' : 'yellow'); break;
      case 'hex': n = 'decor-hex-' + (/E58A12/.test(c) ? 'amber' : 'gold'); break;
      case 'bee': n = 'decor-bee'; break;
      case 'rose': n = 'decor-rose'; break;
    }
    return n ? '<img class="f3" src="' + D3 + n + '.webp" alt="" draggable="false">' : null;
  }
  function frames(key) {
    if (FR[key]) return FR[key];
    var o = { imgs: [], hd: [] }, k, nm;
    for (k = 0; k < NF; k++) { nm = (k < 10 ? '0' : '') + k; var im = new Image(); im.decoding = 'async'; im.src = D3 + 'scene-' + key + '-sd-' + nm + '.webp'; o.imgs.push(im); }
    if (HDQ) setTimeout(function () { for (k = 0; k < NF; k++) { var h = new Image(); h.decoding = 'async'; h.src = D3 + 'scene-' + key + '-hd-' + (k < 10 ? '0' : '') + k + '.webp'; o.hd.push(h); } }, 300);   /* sharp set loads after the light one */
    return (FR[key] = o);
  }
  API.init = function (stage, opts) {
    opts = opts || {}; if (!stage) return false;
    var reduce = !!opts.reduce, W = 1, H = 1, size = 300, cx = 0, cy = 0, portrait = false;
    stage.innerHTML = '';
    var shadow = document.createElement('div'); shadow.className = 'fshadow'; stage.appendChild(shadow);
    var sats = [], satLayer = document.createElement('div'); satLayer.className = 'fsats'; stage.appendChild(satLayer);
    var main = document.createElement('div'); main.className = 'fmain'; stage.appendChild(main);
    var inner = document.createElement('div'); inner.className = 'finner'; main.appendChild(inner);
    var st = { flav: 0, shown: -1, px: 0, py: 0, tpx: 0, tpy: 0, scroll: 0, wob: 0.15, pop: 0, flip: 0, flipTo: -1, active: true, t: 0, last: 0, fin: 0, finT: 0, mix: false };

    function buildSats(i, mix) {
      satLayer.innerHTML = ''; sats = [];
      var defs = [
        { k: 'fruit', s: .26, R: 1.05, a: .6, sp: .10, z: .9, rot: 18 }, { k: 'fruit', s: .17, R: 1.25, a: 2.2, sp: -.08, z: -.5, rot: -24 }, { k: 'fruit', s: .21, R: .95, a: 3.9, sp: .07, z: .5, rot: 30 }, { k: 'fruit', s: .23, R: 1.1, a: 5.2, sp: .09, z: .7, rot: -12, x: 1 }, { k: 'fruit', s: .19, R: 1.2, a: 1.5, sp: -.07, z: .4, rot: 22, x: 1 }, { k: 'fruit', s: .2, R: 1.0, a: 2.9, sp: .08, z: -.3, rot: -30, x: 1 },
        { k: 'leaf', s: .20, R: 1.15, a: 1.4, sp: -.12, z: .3, rot: 20 }, { k: 'leaf', s: .16, R: 1.3, a: 4.9, sp: .09, z: -.7, rot: -40 },
        { k: 'drop', s: .10, R: .98, a: 5.5, sp: .14, z: .8, rot: 0 }, { k: 'drop', s: .08, R: 1.2, a: 3.1, sp: -.10, z: -.3, rot: 0 }, { k: 'spark', s: .08, R: 1.05, a: 2.9, sp: .2, z: .2, rot: 0 }, { k: 'spark', s: .06, R: 1.3, a: 0.2, sp: -.16, z: -.4, rot: 0 }
      ];
      var fi = 0, br = (!mix && window.BrandArt && window.BrandArt.LIST[i]) ? window.BrandArt.LIST[i].sats : null, bi = 0; defs.forEach(function (d, n) {
        if (d.x && !mix) return;
        if (br) { var kind = br[bi++] || 'spark', kn = kind.split(':')[0], odd = (d.k === 'drop' || d.k === 'spark') && kn !== 'drop' && kn !== 'spark', el0 = document.createElement('div'); el0.className = 'fsat'; el0.innerHTML = (API.use3d && img3(kind)) || window.BrandArt.sat(kind); d = Object.assign({}, d, { k: kn, s: d.s * (odd ? 1.8 : 1) * (kn === 'bee' ? 1.2 : 1) }); satLayer.appendChild(el0); sats.push({ el: el0, d: d, ph: n * 1.7 }); return; }
        var el = document.createElement('div'); el.className = 'fsat'; var fx = (mix && d.k === 'fruit') ? (fi++ * 5 + 1) % 6 : i; if (mix && d.k === 'fruit') { d = Object.assign({}, d, { s: [.34, .26, .17, .19, .19, .22][fx] }); } var k3 = d.k === 'fruit' ? 'fruit:' + fx : d.k === 'leaf' ? 'leaf' : d.k === 'drop' ? 'drop:#FFFFFF' : null;
        el.innerHTML = (API.use3d && k3 && img3(k3)) || (d.k === 'fruit' ? fruitSVG(fx) : d.k === 'leaf' ? leafSVG() : d.k === 'drop' ? dropSVG(n % 2 ? '#BFE9FF' : '#FFFFFF') : sparkSVG());
        satLayer.appendChild(el); sats.push({ el: el, d: d, ph: n * 1.7 });
      });
    }
    function showFruit(i) {
      st.burst = 0; var key = API.FLAVOURS[i] && API.FLAVOURS[i].key, c3 = API.use3d && key;
      inner.classList.remove('has3d');
      inner.innerHTML = (window.BrandArt ? window.BrandArt.scene(i) : fruitSVG(i)) + (c3 ? '<canvas class="f3c" width="760" height="760"></canvas>' : '');
      if (c3) sizeCanvas(inner.querySelector('canvas'));
      st.cv = c3 ? inner.querySelector('canvas') : null; st.c2 = st.cv ? st.cv.getContext('2d') : null; st.fr = st.cv ? frames(key) : null; st.fri = -1; st.a3 = null; st.av = 0; dropBm();
      if (st.fr && API.FLAVOURS[i + 1]) frames(API.FLAVOURS[i + 1].key);   /* warm the next brand */
      buildSats(i, st.mix); st.shown = i; document.documentElement.style.setProperty('--fruit', 'rgb(' + API.FLAVOURS[i].c1.map(function (v) { return Math.round(v * 255); }).join(',') + ')'); }
    /* the canvas is drawn at the size it shows on screen (device pixels, up to 1600) with high-quality smoothing, so the browser never stretches a small bitmap */
    function sizeCanvas(cv) { if (!cv) return; var b = Math.round(Math.max(760, Math.min(1600, size * 1.18 * (window.devicePixelRatio || 1)))); if (cv.width !== b) { cv.width = cv.height = b; st.fri = -1; } }
    function layout() { var r = stage.getBoundingClientRect(); W = r.width || 1; H = r.height || 1; portrait = W / H < 0.95; size = portrait ? Math.min(W * 0.62, H * 0.34) : Math.min(H * 0.62, W * 0.40); cx = portrait ? W * 0.5 : W * 0.70; cy = portrait ? H * 0.70 : H * 0.54; main.style.width = main.style.height = size + 'px'; shadow.style.width = size * 0.9 + 'px'; shadow.style.height = size * 0.16 + 'px'; if (st.cv) sizeCanvas(st.cv); }
    layout(); addEventListener('resize', layout); showFruit(0);

    /* decoded-frame cache: the frames around the current angle are decoded ahead of time, off the main thread, at the canvas size,
       so each screen refresh is a cheap copy. Without it the browser kept re-decoding big frames mid-turn and the motion hitched. */
    var BM = {}, BMR = 9;
    function dropBm() { for (var k in BM) { if (BM[k].b && BM[k].b.close) BM[k].b.close(); } BM = {}; }
    function srcOf(i) { var h = st.fr.hd[i]; if (h && h.complete && h.naturalWidth) return { im: h, hd: 1 }; var m = st.fr.imgs[i]; if (m && m.complete && m.naturalWidth) return { im: m, hd: 0 }; return null; }
    function want(i, cb) {
      if (i < 0 || i >= NF || !window.createImageBitmap) return;
      var c = BM[i], src = srcOf(i); if (!src) return;
      if (c && (c.busy || (c.w === cb && c.hd >= src.hd))) return;
      var fr = st.fr, ent = { busy: 1, w: cb, hd: src.hd, b: c && c.b, fr: fr }; BM[i] = ent;
      createImageBitmap(src.im, { resizeWidth: cb, resizeHeight: cb, resizeQuality: 'high' }).then(function (b) {
        if (BM[i] !== ent || st.fr !== fr) { b.close && b.close(); return; }
        if (c && c.b && c.b.close) c.b.close(); ent.b = b; ent.busy = 0; st.fri = -1;
      }, function () { ent.busy = 0; });
    }
    function bmAt(i, cb) { var c = BM[i]; return c && c.b && c.b.width === cb ? c.b : null; }
    function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function frame(now) {
      requestAnimationFrame(frame); if (!st.active || document.hidden) { st.last = now; return; }
      var raw = (now - (st.last || now)) / 1000, dt = Math.min(.05, raw); st.last = now; st.t += dt;
      st.px += (st.tpx - st.px) * (1 - Math.exp(-dt * 4)); st.py += (st.tpy - st.py) * (1 - Math.exp(-dt * 4));
      st.wob = Math.max(reduce ? 0.02 : 0.12, st.wob * Math.exp(-dt * 1.6)); st.pop *= Math.exp(-dt * 4);
      st.burst = reduce ? 1 : st.burst + (1 - st.burst) * (1 - Math.exp(-dt * 3.6)); var bu = st.burst, bo = 1 - Math.pow(1 - bu, 3);
      /* flavour flip: 0..1 over 0.8 s */
      var flipAng = 0, flipScale = 1;
      if (st.flipTo >= 0) { st.flip += dt / 0.55; var f = Math.min(1, st.flip); if (f < .5) { flipAng = ease(f * 2) * 90; flipScale = 1 - ease(f * 2) * 0.25; } else { if (st.shown !== st.flipTo) showFruit(st.flipTo); flipAng = -90 + ease((f - .5) * 2) * 90; flipScale = 0.75 + ease((f - .5) * 2) * 0.25; } if (f >= 1) { st.flipTo = -1; st.flip = 0; } }
      st.fin += (st.finT - st.fin) * (1 - Math.exp(-dt * 4)); if (Math.abs(st.finT - st.fin) < .002) st.fin = st.finT; var fin = st.fin, ccx = cx + (W / 2 - cx) * fin, ccy = cy + (H * .5 - cy) * fin;
      var bob = Math.sin(st.t * 1.5) * size * 0.025, sq = Math.sin(st.t * 2.6) * st.wob * 0.12, pop = 1 + st.pop * 0.1;
      var ry = st.px * 22 + flipAng + Math.sin(st.t * 0.7) * 6 + st.scroll * 40, rx = -st.py * 14, rz = Math.sin(st.t * 1.1) * 3 * (0.6 + st.wob) + st.px * 4;
      if (st.fr && st.c2) {
        /* 3D turn, smoothed:
           1. a target angle from the pointer, a slow two-speed sway and how far you have scrolled through this brand;
           2. a damped spring eases the shown angle toward it, so it starts softly, glides and settles with no snapping;
           3. the canvas blends the two nearest turntable frames by the fractional position, so there are no visible steps. */
        var seg = (st.scroll * (API.FLAVOURS.length + 1)) % 1;
        var tgt = Math.max(-SPAN + .5, Math.min(SPAN - .5, st.px * 30 + Math.sin(st.t * 0.42) * 20 + Math.sin(st.t * 0.97 + 1) * 5 + Math.sin(seg * Math.PI * 2) * 12));   /* a wider, livelier idle sway across the whole turntable */
        if (st.a3 == null) { st.a3 = tgt; st.av = 0; }
        st.av += ((tgt - st.a3) * 30 - st.av * 6.5) * dt; st.a3 += st.av * dt;   /* a softer spring: it eases in, swings slightly past and settles, like a real object */
        var ff = Math.max(0, Math.min(NF - 1, (st.a3 + SPAN) / (2 * SPAN) * (NF - 1))), i0 = Math.floor(ff), i1 = Math.min(NF - 1, i0 + 1), w3 = ff - i0;
        var A3 = st.fr.imgs[i0], B3 = st.fr.imgs[i1], okA = A3.complete && A3.naturalWidth, okB = B3.complete && B3.naturalWidth;
        if (!okA) { var M3 = st.fr.imgs[(NF - 1) / 2]; if (M3.complete && M3.naturalWidth) { A3 = M3; okA = true; okB = false; } }
        /* show the single nearest turntable frame: blending two angles made a soft double image while it turned */
        /* frames are only ~1 degree apart now, so a cross-fade between the two nearest gives a continuous turn with no visible ghosting */
        var cb = st.cv.width, ic = Math.round(ff), q;
        /* keep the frames around the current angle decoded (nearest first, a little further in the direction it is turning) and let go of far ones */
        want(i0, cb); want(i1, cb);
        for (q = 1; q <= BMR; q++) { want(ic + (st.av >= 0 ? q : -q), cb); if (q <= 4) want(ic + (st.av >= 0 ? -q : q), cb); }
        for (q in BM) { if (Math.abs(q - ic) > BMR + 3) { if (BM[q].b && BM[q].b.close) BM[q].b.close(); delete BM[q]; } }
        var bA = bmAt(i0, cb), bB = bmAt(i1, cb), wq = Math.round(w3 * 24) / 24, k3;
        if (bA && bB) { A3 = bA; B3 = bB; k3 = 'b' + i0 + ':' + wq + ':' + cb; }
        else { var near = null; for (q = 0; q <= 3 && !near; q++) near = bmAt(ic + q, cb) || bmAt(ic - q, cb); if (near) { A3 = B3 = near; wq = 0; k3 = 'n' + ic + ':' + cb; } else { wq = okB ? wq : 0; k3 = okA ? 'i' + i0 + ':' + wq + ':' + cb : null; } }
        if (okA && k3 && k3 !== st.fri) {
          var c2 = st.c2; c2.clearRect(0, 0, cb, cb);
          c2.imageSmoothingEnabled = true; c2.imageSmoothingQuality = 'high';
          c2.globalAlpha = 1; c2.drawImage(wq >= 1 ? B3 : A3, 0, 0, cb, cb);
          if (wq > 0 && wq < 1) { c2.globalAlpha = wq; c2.drawImage(B3, 0, 0, cb, cb); c2.globalAlpha = 1; }
          st.fri = k3; inner.classList.add('has3d');
        }
        /* the render does the turning; the product also leans into its own motion and the pointer, so it feels alive rather than rigid */
        if (inner.classList.contains('has3d')) { var lean = Math.max(-7, Math.min(7, st.av * 0.2)); ry = flipAng + st.px * 5; rx = -st.py * 5 + Math.sin(st.t * 0.8) * 1.5; rz = rz * 0.5 + lean; }
      }
      main.style.transform = 'translate3d(' + (cx - size / 2 + st.px * -14) + 'px,' + (cy - size / 2 + bob + st.py * -8) + 'px,0) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg) scale(' + ((1 + sq) * pop * flipScale * (1 - fin)) + ',' + ((1 - sq) * pop * flipScale * (1 - fin)) + ')'; main.style.opacity = 1 - fin;
      shadow.style.transform = 'translate3d(' + (cx - size * 0.45 + st.px * -10) + 'px,' + (cy + size * 0.5 + bob * -0.4) + 'px,0) scale(' + (1 - bob / size * 1.5) + ',1)'; shadow.style.opacity = flipScale * 0.9 * (1 - fin);
      sats.forEach(function (s) {
        var d = s.d, a = d.a + st.t * d.sp + st.scroll * 2.4 - (1 - bo) * 1.6, R = size * d.R * (1 + Math.sin(st.t * .6 + s.ph) * .04) * (0.12 + 0.88 * bo), Rx0 = R * (portrait ? 0.9 : 1.25), Ry0 = R * 0.62, Rx = Rx0 + (W * .44 * d.R / 1.1 - Rx0) * fin, Ry = Ry0 + (Math.min(H * .34, W * .6) * d.R / 1.1 - Ry0) * fin, fb = 1 - fin * (1 - (0.12 + 0.88 * bo)), x = ccx + Math.cos(a) * Rx * fb + st.px * 46 * d.z, y = ccy + Math.sin(a * 1.2 + s.ph) * Ry * fb +Math.sin(st.t + s.ph) * 8 * (1 - fin) + st.py * 30 * d.z;
        var sz = size * d.s * ((0.85 + 0.3 * d.z) * (1 - fin) + fin) * (1 + st.pop * 0.25) * (1 + fin * .3);
        s.el.style.width = sz + 'px'; s.el.style.height = sz + 'px'; s.el.style.opacity = (d.z < 0 ? 0.8 : 1) * flipScale * Math.min(1, bu * 2.2);
        s.el.style.transform = 'translate3d(' + (x - sz / 2) + 'px,' + (y - sz / 2) + 'px,0) rotate(' + (d.rot + Math.sin(st.t * .8 + s.ph) * 14 + st.t * (d.k === 'spark' ? 40 : 6)) + 'deg)';
        s.el.style.zIndex = d.z > 0 ? 3 : 0; s.el.style.filter = (d.z < 0 && fin < .5) ? 'blur(1.2px)' : 'none';
      });
    }
    requestAnimationFrame(frame);
    API.supported = true;
    API.setFlavour = function (i) { i = Math.max(0, Math.min(API.FLAVOURS.length - 1, i)); if (reduce) { showFruit(i); st.flav = i; return; } if (i === st.flav && i === st.shown && st.flipTo < 0) return; st.flav = i; if (st.flipTo >= 0 && st.flip < 0.5) { st.flipTo = i; } else { st.flipTo = i; st.flip = 0; } };
    API.setFinale = function (v) { v = !!v; if (v === st.mix) return; st.mix = v; st.finT = v ? 1 : 0; if (st.t < 0.2) st.fin = st.finT; if (st.shown >= 0) { buildSats(st.shown, v); st.burst = 0; } };
    API.kick = function () { st.wob = 1; st.pop = 1; };
    API.setPointer = function (x, y) { st.tpx = x; st.tpy = y; };
    API.setScroll = function (p, vel) { st.scroll = p; if (vel) st.wob = Math.min(1, st.wob + Math.abs(vel) * 0.5); };
    API.setActive = function (v) { st.active = v; };
    return true;
  };
})();
