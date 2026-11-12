/* Six Nibou brands, drawn as vector (SVG) scenes for the hero: Dadih, Yourgurt, Freshill, Drinme, Kid's Joy, Bebee.
   The logos are traced SVG files in assets/brands/. The packs are simplified illustrations in each brand's style (not exact packaging).
   Needs fruits.js first (it provides Jelly.fruitInner for the fruit pieces). */
(function () {
  'use strict';
  var J = window.Jelly, uid = 0, A = 'assets/brands/';
  function nid() { return 'b' + (++uid) + '_'; }
  function stops(a) { return a.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join(''); }
  function LG(i, x1, y1, x2, y2, a) { return '<linearGradient id="' + i + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' + stops(a) + '</linearGradient>'; }
  function RG(i, cx, cy, r, a) { return '<radialGradient id="' + i + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">' + stops(a) + '</radialGradient>'; }
  var RF = { dadih: 2.8614, freshill: 1.9261, drinme: 2.26, yourgurt: 0.7209, kidsjoy: 1.5912, bebee: 2.8092 };
  var RS = { dadih: 2.6077, freshill: 1.837, drinme: 2.1206, yourgurt: 0.7329, kidsjoy: 1.5431, bebee: 2.5662 };
  function logo(key, x, y, w, sticker) { var r = (sticker ? RS : RF)[key]; return '<image href="' + A + key + (sticker ? '-sticker' : '-logo') + '.svg" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (w / r).toFixed(1) + '"/>'; }
  function fruit(i, x, y, s, rot) { return '<g transform="rotate(' + (rot || 0) + ' ' + (x + s / 2) + ' ' + (y + s / 2) + ')"><svg x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" viewBox="-10 -20 420 420" overflow="visible">' + J.fruitInner(i, nid()) + '</svg></g>'; }
  function wrap(inner) { return inner; }

  /* ---------- small drawn things ---------- */
  function bee(x, y, s, rot) {
    var p = nid();
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + s + ')"><defs><clipPath id="' + p + 'c"><ellipse cx="0" cy="6" rx="27" ry="20"/></clipPath></defs>' +
      '<ellipse cx="-10" cy="-18" rx="13" ry="22" transform="rotate(-22 -10 -18)" fill="#fff" fill-opacity=".9" stroke="#BFE3F5" stroke-width="2"/><ellipse cx="14" cy="-20" rx="12" ry="21" transform="rotate(24 14 -20)" fill="#fff" fill-opacity=".8" stroke="#BFE3F5" stroke-width="2"/>' +
      '<path d="M-26 6 L-40 2 L-34 12Z" fill="#2b1a0a"/><ellipse cx="0" cy="6" rx="27" ry="20" fill="#FFD21F"/><g clip-path="url(#' + p + 'c)"><rect x="-16" y="-20" width="9" height="60" fill="#2b1a0a"/><rect x="2" y="-20" width="9" height="60" fill="#2b1a0a"/></g>' +
      '<ellipse cx="-8" cy="-2" rx="10" ry="4" fill="#fff" opacity=".5" transform="rotate(-18 -8 -2)"/><circle cx="28" cy="2" r="13" fill="#2b1a0a"/><circle cx="32" cy="-1" r="3.2" fill="#fff"/><path d="M30 -8 C 34 -22 40 -24 44 -22 M26 -9 C 26 -22 30 -28 34 -28" stroke="#2b1a0a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M26 8 Q31 12 36 8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  }
  function hexes(cx, cy, r, rows, cols, stroke, fill) {
    var s = '', dx = r * 1.732, dy = r * 1.5, i, j;
    for (i = 0; i < rows; i++) for (j = 0; j < cols; j++) {
      var x = cx + (j - (cols - 1) / 2) * dx + (i % 2 ? dx / 2 : 0), y = cy + (i - (rows - 1) / 2) * dy, pts = '';
      for (var k = 0; k < 6; k++) { var a = Math.PI / 3 * k + Math.PI / 6; pts += (x + Math.cos(a) * r).toFixed(1) + ',' + (y + Math.sin(a) * r).toFixed(1) + ' '; }
      s += '<polygon points="' + pts + '" fill="' + (fill || 'none') + '" stroke="' + stroke + '" stroke-width="2.4" stroke-linejoin="round"/>';
    }
    return s;
  }
  function heart(col) { return '<svg viewBox="0 0 60 56" aria-hidden="true"><path d="M30 54 C 8 38 2 26 2 17 C 2 7 10 2 18 2 C 24 2 28 6 30 10 C 32 6 36 2 42 2 C 50 2 58 7 58 17 C 58 26 52 38 30 54Z" fill="' + col + '"/><ellipse cx="17" cy="15" rx="6" ry="4" transform="rotate(-30 17 15)" fill="#fff" opacity=".55"/></svg>'; }
  function star(col) { return '<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 3 L37 22 L57 23 L41 36 L47 56 L30 44 L13 56 L19 36 L3 23 L23 22Z" fill="' + col + '" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>'; }
  function bubble(col) { var p = nid(); return '<svg viewBox="0 0 60 60" aria-hidden="true"><defs>' + RG(p + 'g', '35%', '30%', '75%', [[0, '#fff', .95], [.5, col, .85], [1, col, 1]]) + '</defs><circle cx="30" cy="30" r="26" fill="url(#' + p + 'g)"/><ellipse cx="21" cy="19" rx="7" ry="4.5" transform="rotate(-35 21 19)" fill="#fff" opacity=".8"/></svg>'; }
  function cube(col) { return '<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="8" y="8" width="44" height="44" rx="11" transform="rotate(14 30 30)" fill="' + col + '" fill-opacity=".72" stroke="#fff" stroke-opacity=".9" stroke-width="3"/><rect x="16" y="15" width="14" height="8" rx="4" transform="rotate(14 30 30)" fill="#fff" opacity=".7"/></svg>'; }
  function hex(col) { return '<svg viewBox="-34 -34 68 68" aria-hidden="true"><polygon points="' + [0, 1, 2, 3, 4, 5].map(function (k) { var a = Math.PI / 3 * k + Math.PI / 6; return (Math.cos(a) * 30).toFixed(1) + ',' + (Math.sin(a) * 30).toFixed(1); }).join(' ') + '" fill="' + col + '" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><polygon points="' + [0, 1, 2, 3, 4, 5].map(function (k) { var a = Math.PI / 3 * k + Math.PI / 6; return (Math.cos(a) * 17).toFixed(1) + ',' + (Math.sin(a) * 17).toFixed(1); }).join(' ') + '" fill="#fff" fill-opacity=".35"/></svg>'; }
  function beeSat() { return '<svg viewBox="-46 -46 96 96" aria-hidden="true">' + bee(0, 0, 1, 0) + '</svg>'; }

  /* ---------- 1 DADIH: soya pudding cups ---------- */
  function cup(o) {
    var p = nid(), body = 'M-90 0 L90 0 L72 158 Q70 172 56 172 L-56 172 Q-70 172 -72 158 Z', s = '';
    s += '<g transform="translate(' + o.x + ' ' + o.y + ') rotate(' + (o.rot || 0) + ') scale(' + o.s + ')"><defs>' + LG(p + 'b', 0, 0, 1, 0, [[0, o.b[0]], [1, o.b[1]]]) + LG(p + 'p', 0, 0, 0, 1, [[0, '#FFF8DC'], [1, '#FFD98C']]) + LG(p + 's', 0, 0, 0, 1, [[0, '#FF8FB0'], [1, '#E5336F']]) + LG(p + 'l', 0, 0, 0, 1, [[0, '#FFF3A0'], [1, '#F2AE00']]) + LG(p + 'd', 0, 0, 1, 0, [[0, '#000', 0], [.6, '#000', 0], [1, '#000', .26]]) + '<clipPath id="' + p + 'c"><path d="' + body + '"/></clipPath></defs>';
    if (o.open) s += '<path d="M-84 3 C-88 -92 88 -92 84 3Z" fill="url(#' + p + 'p)"/><path d="M-66 -34 C-34 -66 34 -66 66 -34 C 72 -18 62 -10 56 -24 C 52 -6 40 -6 38 -22 C 32 -4 16 -4 14 -22 C 8 -6 -8 -6 -12 -22 C -18 -4 -34 -4 -38 -22 C -44 -6 -58 -8 -60 -22 C -66 -12 -74 -22 -66 -34Z" fill="url(#' + p + 's)"/><ellipse cx="-34" cy="-52" rx="16" ry="6" transform="rotate(-24 -34 -52)" fill="#fff" opacity=".6"/>';
    s += '<path d="' + body + '" fill="url(#' + p + 'b)"/><g clip-path="url(#' + p + 'c)"><path d="M-100 44 Q-50 30 0 44 T100 44 L100 118 Q50 132 0 118 T-100 118Z" fill="#fff" fill-opacity=".97"/>' + logo('dadih', -62, 59, 124) + '<rect x="-100" y="0" width="200" height="180" fill="url(#' + p + 'd)"/></g>';
    s += '<path d="M-70 22 Q-77 92 -63 150" stroke="#fff" stroke-opacity=".4" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="-97" y="-9" width="194" height="19" rx="9.5" fill="#FFFDF4"/><rect x="-97" y="3" width="194" height="7" rx="3.5" fill="#000" opacity=".08"/>';
    if (!o.open) s += '<ellipse cx="0" cy="-3" rx="88" ry="15" fill="url(#' + p + 'l)"/><ellipse cx="-26" cy="-8" rx="30" ry="4.4" fill="#fff" opacity=".6"/>';
    return s + '</g>';
  }
  function sceneDadih() {
    return cup({ x: 74, y: 248, s: .6, rot: -9, b: ['#FFC93C', '#F59A1B'] }) + cup({ x: 326, y: 248, s: .6, rot: 9, b: ['#8ED16B', '#4CA64A'] }) +
      cup({ x: 200, y: 196, s: 1, open: true, b: ['#FF6FA0', '#E03A74'] }) + fruit(3, 160, 56, 80, -10);
  }

  /* ---------- 2 YOURGURT: fruity pudding cups ---------- */
  function zig(x0, x1, y, a, n) { var s = '', dx = (x1 - x0) / n, i; for (i = 1; i <= n; i++) s += ' L' + (x0 + dx * i).toFixed(1) + ' ' + (y + (i % 2 ? a : 0)); return s; }
  /* the real Yourgurt pack is a small pudding cup with a square peel-off lid: fruit print, the YOURGURT wordmark, "Fruity & Tasty", the NBI mark and two kids */
  function grapes(x, y, s) { var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">', c = [[0, 0], [14, -4], [26, 4], [8, 12], [20, 16], [13, 28]], i; for (i = 0; i < c.length; i++) g += '<circle cx="' + c[i][0] + '" cy="' + c[i][1] + '" r="9" fill="#A6D94A" stroke="#6FA82A" stroke-width="1.4"/><circle cx="' + (c[i][0] - 3) + '" cy="' + (c[i][1] - 3) + '" r="2.4" fill="#fff" opacity=".7"/>'; return g + '<path d="M10 -12 C12 -24 20 -28 28 -26" stroke="#5E8C22" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>'; }
  function ylid(p) {
    return '<rect x="-84" y="-84" width="168" height="168" rx="26" fill="#DED6DF"/><rect x="-84" y="-88" width="168" height="168" rx="26" fill="#fff" stroke="#E6DFE8" stroke-width="2"/>' +
      '<rect x="-73" y="-77" width="146" height="146" rx="19" fill="none" stroke="#EFE9F0" stroke-width="2.5"/>' +
      '<path d="M-70 -30 C-30 -56 20 -14 70 -40 L70 -70 Q70 -77 62 -77 L-62 -77 Q-70 -77 -70 -70Z" fill="#F9E9F2" opacity=".8"/>' +
      fruit(0, -72, -74, 52, -8) + fruit(3, -40, -80, 50, 6) + grapes(4, -66, .95) + fruit(4, -18, -46, 42, 4) +
      '<circle cx="50" cy="-54" r="15" fill="#fff" stroke="#6A3FB0" stroke-width="3.5"/><text x="50" y="-50" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="10" fill="#C0277A">NBI</text>' +
      '<g transform="translate(36 -10) scale(.7)">' + kid(0, 0, false) + '</g><g transform="translate(60 -8) scale(.7)">' + kid(0, 0, true) + '</g>' +
      '<rect x="-70" y="6" width="46" height="17" rx="5" fill="#8E2A94"/><text x="-47" y="19" text-anchor="middle" font-family="\'Malgun Gothic\',\'Apple SD Gothic Neo\',\'Noto Sans KR\',Arial,sans-serif" font-weight="700" font-size="11.5" fill="#fff">\uC694\uAC70\uD2B8</text>' +
      '<text x="-70" y="50" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="29" textLength="140" lengthAdjust="spacingAndGlyphs"><tspan fill="#EDB5D6">YOUR</tspan><tspan fill="#C5489C">GURT</tspan></text>' +
      '<text x="-70" y="66" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="10.5" letter-spacing="1.2" fill="#F0A21C">FRUITY &amp; TASTY</text>';
  }
  function ycup(o) {
    var p = nid(), s = '<g transform="translate(' + o.x + ' ' + o.y + ') rotate(' + (o.rot || 0) + ') scale(' + o.s + ')"><defs>' + LG(p + 'b', 0, 0, 1, 0, [[0, o.c[1]], [.3, o.c[0]], [.75, o.c[0]], [1, o.c[1]]]) + LG(p + 'h', 0, 0, 0, 1, [[0, o.c[0]], [1, o.c[1]]]) + '</defs>';
    if (o.side) {
      /* lying on its side: the lid faces us, the cup runs back to the right */
      s += '<path d="M10 -70 L150 -52 Q176 -46 176 -20 L176 24 Q176 50 150 54 L10 76Z" fill="url(#' + p + 'h)"/><path d="M40 -56 Q110 -50 158 -36" stroke="#fff" stroke-opacity=".5" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<g transform="skewY(7) scale(.74 1)">' + ylid(p) + '</g>';
    } else {
      s += '<path d="M-66 16 L66 16 L52 138 Q50 152 36 152 L-36 152 Q-50 152 -52 138Z" fill="url(#' + p + 'b)"/><path d="M-52 34 Q-58 90 -44 138" stroke="#fff" stroke-opacity=".55" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="26" rx="70" ry="14" fill="#000" opacity=".1"/>' +
        '<g transform="scale(1 .5) rotate(' + (o.lr || -10) + ')">' + ylid(p) + '</g>';
    }
    return s + '</g>';
  }
  function sceneYourgurt() {
    return '<g transform="translate(200 205) scale(1.14) translate(-200 -205)">' + ycup({ x: 168, y: 128, s: 1.14, c: ['#B8E08A', '#86C45A'], lr: -10 }) +
      ycup({ x: 222, y: 292, s: 1.04, rot: -12, c: ['#FFC27A', '#F59A3A'], side: true }) + '</g>';
  }
  /* ---------- 3 FRESHILL: concentrate bottles ---------- */
  function bottle(o) {
    var p = nid(), body = 'M-15 84 C -15 112 -62 118 -62 152 L -62 300 Q -62 326 -36 326 L 36 326 Q 62 326 62 300 L 62 152 C 62 118 15 112 15 84Z';
    return '<g transform="translate(' + o.x + ' ' + o.y + ') rotate(' + (o.rot || 0) + ') scale(' + o.s + ')"><defs>' + LG(p + 'l', 0, 0, 1, 0, [[0, o.c[0]], [.5, o.c[1]], [1, o.c[0]]]) + LG(p + 'k', 0, 0, 0, 1, [[0, '#5FBE4A'], [1, '#2F7D2A']]) + '<clipPath id="' + p + 'c"><path d="' + body + '"/></clipPath></defs>' +
      '<rect x="-22" y="0" width="44" height="40" rx="7" fill="url(#' + p + 'k)"/><g stroke="#1d5a1b" stroke-opacity=".35" stroke-width="2.4">' + [-14, -7, 0, 7, 14].map(function (x) { return '<line x1="' + x + '" y1="6" x2="' + x + '" y2="36"/>'; }).join('') + '</g><rect x="-17" y="40" width="34" height="48" fill="' + o.c[1] + '"/>' +
      '<path d="' + body + '" fill="url(#' + p + 'l)"/><g clip-path="url(#' + p + 'c)"><rect x="-70" y="128" width="140" height="10" fill="#fff" opacity=".2"/><path d="M-70 150 Q0 134 70 150" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>' + logo('freshill', -52, 166, 104) +
      '<g transform="translate(0 266)"><rect x="-52" y="-12" width="104" height="24" rx="12" fill="#fff" fill-opacity=".92"/><text x="0" y="4" text-anchor="middle" font-family="inherit" font-weight="900" font-size="10" fill="#10322a" letter-spacing=".02em">' + o.n + '</text></g></g>' +
      '<path d="M-48 160 Q-56 230 -46 296" stroke="#fff" stroke-opacity=".5" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M40 160 Q46 200 42 250" stroke="#fff" stroke-opacity=".25" stroke-width="5" fill="none" stroke-linecap="round"/></g>';
  }
  function sceneFreshill() {
    return bottle({ x: 74, y: 76, s: .8, rot: -6, c: ['#E5334E', '#FF6B7F'], n: 'STRAWBERRY' }) + bottle({ x: 326, y: 76, s: .8, rot: 6, c: ['#4D1B73', '#8A4BBB'], n: 'BLACKCURRANT' }) +
      bottle({ x: 200, y: 22, s: 1.02, c: ['#F5780F', '#FFB52E'], n: 'MANGO' }) + fruit(0, 14, 292, 96, -10) + fruit(1, 296, 296, 98, 14) + fruit(3, 150, 318, 76, 4);
  }

  /* ---------- 4 DRINME: spout pouches (also used for Bebee) ---------- */
  function pouch(o) {
    var p = nid(), body = 'M-85 16 Q-85 0 -69 0 L69 0 Q85 0 85 16 L85 212 Q85 250 47 250 L-47 250 Q-85 250 -85 212Z', s;
    s = '<g transform="translate(' + o.x + ' ' + o.y + ') rotate(' + (o.rot || 0) + ') scale(' + o.s + ')"><defs>' + LG(p + 'g', 0, 0, 0, 1, [[0, o.c[0]], [1, o.c[1]]]) + LG(p + 'd', 0, 0, 1, 0, [[0, '#000', .14], [.25, '#000', 0], [.75, '#000', 0], [1, '#000', .22]]) + '<clipPath id="' + p + 'c"><path d="' + body + '"/></clipPath></defs>';
    s += '<rect x="-22" y="-14" width="44" height="18" fill="#fff"/><rect x="-26" y="-42" width="52" height="30" rx="8" fill="#fff"/><g stroke="#9aa" stroke-opacity=".5" stroke-width="2.2">' + [-16, -8, 0, 8, 16].map(function (x) { return '<line x1="' + x + '" y1="-38" x2="' + x + '" y2="-16"/>'; }).join('') + '</g>';
    s += '<path d="' + body + '" fill="url(#' + p + 'g)"/><g clip-path="url(#' + p + 'c)">' + (o.pat || '') + '<rect x="-90" y="0" width="180" height="24" fill="#000" opacity=".09"/>' + [6, 12, 18].map(function (y) { return '<line x1="-90" y1="' + y + '" x2="90" y2="' + y + '" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/>'; }).join('') + '<rect x="-90" y="0" width="180" height="252" fill="url(#' + p + 'd)"/></g>';
    s += logo(o.logo, -72, 38, 144, true) + (o.extra || '');
    s += '<path d="M-66 40 Q-76 130 -64 214" stroke="#fff" stroke-opacity=".38" stroke-width="9" fill="none" stroke-linecap="round"/>';
    return s + '</g>';
  }
  function beads(cols, pts) { return pts.map(function (q, i) { var p = nid(), c = cols[i % cols.length]; return '<defs>' + RG(p + 'g', '35%', '30%', '75%', [[0, '#fff', .95], [.45, c, .9], [1, c, 1]]) + '</defs><circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + q[2] + '" fill="url(#' + p + 'g)"/>'; }).join(''); }
  function sceneDrinme() {
    var vit = '<g transform="translate(-46 214) rotate(-10)"><circle r="25" fill="#FFE14A" stroke="#fff" stroke-width="3.5"/><text y="-2" text-anchor="middle" font-family="inherit" font-weight="900" font-size="10.5" fill="#C23318">+ VITAMIN</text><text y="12" text-anchor="middle" font-family="inherit" font-weight="900" font-size="15" fill="#C23318">C</text></g>';
    return pouch({ x: 82, y: 118, s: .76, rot: -11, c: ['#FFEE5A', '#F5C200'], logo: 'drinme' }) + pouch({ x: 318, y: 118, s: .76, rot: 11, c: ['#B650D6', '#6A1E9B'], logo: 'drinme' }) +
      fruit(1, 28, 268, 96, -12) + fruit(2, 292, 270, 96, 12) +
      pouch({ x: 200, y: 84, s: 1.02, c: ['#FFA928', '#F26512'], logo: 'drinme', extra: vit }) + fruit(0, 186, 200, 140, 8) +
      beads(['#FFD25A', '#FF7A3C', '#FFE9A0', '#FF5A2E'], [[116, 260, 11], [100, 296, 8], [292, 252, 10], [304, 300, 12], [250, 340, 9]]);
  }

  /* ---------- 5 KID'S JOY: drinking jelly cups ---------- */
  /* the printed lid: splash colour, kid characters, fruit slices, logo, foil gloss (vector, drawn to echo the real Kid's Joy lid) */
  function kid(x, y, girl) {
    var skin = '#FFD9B3';
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      (girl ? '<path d="M-14 2 C-18 -14 -8 -20 0 -20 C8 -20 18 -14 14 2 C12 12 14 16 14 16 L-14 16 C-14 16 -12 12 -14 2Z" fill="#7A4220"/><circle cx="-13" cy="-12" r="4.5" fill="#FF6FA0"/><circle cx="13" cy="-12" r="4.5" fill="#FF6FA0"/>' : '') +
      '<circle r="13" cy="1" fill="' + skin + '" stroke="#E8B88A" stroke-width="1.2"/>' +
      (girl ? '<path d="M-12 -4 C-6 -14 6 -14 12 -4 C6 -8 -6 -8 -12 -4Z" fill="#7A4220"/>' : '<path d="M-13 -4 C-12 -16 12 -16 13 -4Z" fill="#2F8FE0"/><path d="M-3 -4 L18 -2 L16 1 L-3 -1Z" fill="#1F6FC0"/>') +
      '<circle cx="-4.5" cy="1" r="1.7" fill="#3a2418"/><circle cx="4.5" cy="1" r="1.7" fill="#3a2418"/><path d="M-4 6 Q0 10 4 6" stroke="#C0453A" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="-8" cy="5" r="2.4" fill="#FF8FA0" opacity=".6"/><circle cx="8" cy="5" r="2.4" fill="#FF8FA0" opacity=".6"/></g>';
  }
  function orangeSlice(x, y, r) {
    var s = '<g transform="translate(' + x + ' ' + y + ')"><circle r="' + r + '" fill="#FFF3D6"/><circle r="' + (r - 2.2) + '" fill="#FFA21F"/>', i;
    for (i = 0; i < 8; i++) { var an = i * Math.PI / 4; s += '<path d="M0 0 L' + (Math.cos(an) * (r - 3)).toFixed(1) + ' ' + (Math.sin(an) * (r - 3)).toFixed(1) + '" stroke="#FFD27A" stroke-width="1.6"/>'; }
    return s + '<circle r="' + (r - 2.2) + '" fill="none" stroke="#FF8A00" stroke-width="1"/><ellipse cx="' + (-r * .35) + '" cy="' + (-r * .4) + '" rx="' + (r * .3) + '" ry="' + (r * .15) + '" fill="#fff" opacity=".55"/></g>';
  }
  function lidArt(p, o) {
    return '<path d="M-100 -12 C-60 -44 -30 8 10 -14 S70 -42 100 -10 L100 -50 L-100 -50Z" fill="#fff" opacity=".28"/>' +
      '<path d="M-100 20 C-60 -2 -20 40 20 18 S72 4 100 22 L100 50 L-100 50Z" fill="' + o.l[1] + '" opacity=".55"/>' +
      '<path d="M-100 30 C-50 14 -10 46 40 28 S80 22 100 30 L100 50 L-100 50Z" fill="#FFE14A" opacity=".5"/>' +
      '<circle cx="-84" cy="-8" r="3" fill="#fff" opacity=".8"/><circle cx="82" cy="-18" r="2.6" fill="#fff" opacity=".8"/><circle cx="-70" cy="22" r="2.2" fill="#FF6FA0" opacity=".9"/><circle cx="76" cy="26" r="2.4" fill="#2F8FE0" opacity=".8"/>' +
      kid(-62, 4, false) + kid(62, 2, true) +
      '<g transform="translate(-39 -30)"><image href="' + A + 'kidsjoy-sticker.svg" x="0" y="0" width="78" height="' + (78 / RS.kidsjoy).toFixed(1) + '"/></g>' +
      fruit(3, -52, 14, 34, -10) + orangeSlice(30, 27, 12.5) + '<circle cx="-84" cy="-26" r="9" fill="#fff"/><circle cx="-84" cy="-26" r="7" fill="#6A3FB0"/><text x="-84" y="-23.4" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="6.4" fill="#fff">NBI</text>';
  }
  function jcup(o) {
    var p = nid(), pts = '', i, n = 90;
    for (i = 0; i < n; i++) { var a = i / n * Math.PI * 2, r = 1 + .055 * Math.cos(a * 10); pts += (i ? 'L' : 'M') + (Math.cos(a) * 94 * r).toFixed(1) + ' ' + (Math.sin(a) * 40 * r).toFixed(1); }
    var body = 'M-72 16 L72 16 L55 150 Q53 164 39 164 L-39 164 Q-53 164 -55 150Z', facets = [-40, -20, 0, 20, 40].map(function (x) { return '<path d="M' + (x * 1.45) + ' 22 L' + (x * 1.0) + ' 160" stroke="#fff" stroke-opacity=".22" stroke-width="2.2"/>'; }).join('');
    return '<g transform="translate(' + o.x + ' ' + o.y + ') rotate(' + (o.rot || 0) + ') scale(' + o.s + ')"><defs>' + LG(p + 'j', 0, 0, 1, 0, [[0, o.c[1]], [.35, o.c[0]], [1, o.c[1]]]) + LG(p + 'l', 0, 0, 0, 1, [[0, o.l[0]], [1, o.l[1]]]) + '<clipPath id="' + p + 'k"><path d="' + pts + 'Z"/></clipPath></defs>' +
      '<path d="' + body + '" fill="url(#' + p + 'j)" stroke="#fff" stroke-opacity=".65" stroke-width="3"/>' + facets + '<path d="M-58 34 Q-64 96 -48 142" stroke="#fff" stroke-opacity=".6" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M30 40 Q38 90 32 136" stroke="#fff" stroke-opacity=".26" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="0" cy="150" rx="40" ry="8" fill="#000" opacity=".1"/>' +
      '<g transform="translate(0 4)"><path d="' + pts + 'Z" fill="url(#' + p + 'l)"/><g clip-path="url(#' + p + 'k)">' + lidArt(p, o) + '<ellipse cx="-34" cy="-20" rx="40" ry="8" transform="rotate(-10 -34 -20)" fill="#fff" opacity=".55"/><path d="M-90 -6 Q0 -52 90 -6" stroke="#fff" stroke-opacity=".35" stroke-width="5" fill="none"/></g>' +
      '<path d="' + pts + 'Z" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="3.2"/><ellipse cx="0" cy="0" rx="86" ry="33" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/></g></g>';
  }
  function sceneKidsJoy() {
    return jcup({ x: 92, y: 100, s: 1, rot: -8, c: ['#FF8FB8', '#E8457E'], l: ['#FFB6D1', '#F0558A'] }) + jcup({ x: 308, y: 100, s: 1, rot: 8, c: ['#FFD84A', '#F5A800'], l: ['#FFE98A', '#F7B500'] }) +
      jcup({ x: 200, y: 168, s: 1.22, c: ['#A8E84F', '#5FB82B'], l: ['#E3FA9E', '#8AD13A'] }) + fruit(3, 16, 266, 92, -14) + fruit(4, 298, 270, 92, 12) +
      '<g transform="translate(38 72) rotate(-14)"><path d="M0 -26 L8 -8 L28 -6 L12 6 L18 26 L0 14 L-18 26 L-12 6 L-28 -6 L-8 -8Z" fill="#FFE14A" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/></g>';
  }

  /* ---------- 6 BEBEE: honey squeeze bottles ---------- */
  /* squeeze honey bottle, drawn to echo the real Bebee Honey bottles (Original, Lemongrass, Lemon) */
  function honey(o) {
    var p = nid(), body = 'M-30 92 C-70 108 -80 160 -80 212 L-80 298 Q-80 330 -48 330 L48 330 Q80 330 80 298 L80 212 C80 160 70 108 30 92Z';
    return '<g transform="translate(' + o.x + ' ' + o.y + ') rotate(' + (o.rot || 0) + ') scale(' + o.s + ')"><defs>' + LG(p + 'h', 0, 0, 1, 0, [[0, '#B8500E'], [.3, '#F08A1C'], [.62, '#E0700F'], [1, '#9A3F08']]) + LG(p + 'c', 0, 0, 1, 0, [[0, '#F5B400'], [.45, '#FFD84A'], [1, '#E79A00']]) + LG(p + 'l', 0, 0, 1, 1, [[0, o.l[0]], [1, o.l[1]]]) + '<clipPath id="' + p + 'k"><path d="' + body + '"/></clipPath></defs>' +
      '<path d="M-9 0 Q0 -5 9 0 L22 58 L-22 58Z" fill="url(#' + p + 'c)"/><rect x="-36" y="56" width="72" height="38" rx="9" fill="url(#' + p + 'c)"/><g stroke="#C98200" stroke-opacity=".5" stroke-width="2">' + [-24, -12, 0, 12, 24].map(function (x) { return '<line x1="' + x + '" y1="62" x2="' + x + '" y2="90"/>'; }).join('') + '</g>' +
      '<path d="' + body + '" fill="url(#' + p + 'h)"/><g clip-path="url(#' + p + 'k)"><path d="M-80 150 Q0 128 80 150 L80 120 L-80 120Z" fill="#fff" opacity=".12"/>' +
      '<rect x="-66" y="176" width="132" height="132" rx="20" fill="url(#' + p + 'l)"/><path d="M0 196 C16 222 26 238 26 254 A26 26 0 0 1 -26 254 C-26 238 -16 222 0 196Z" fill="#F08A1C" opacity=".55"/>' + logo('bebee', -50, 188, 100) +
      '<text x="0" y="246" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="11" letter-spacing="1.5" fill="#4A2308">HONEY</text><text x="0" y="270" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="' + (o.n.length > 8 ? 17 : 21) + '" fill="#4A2308">' + o.n + '</text></g>' +
      '<path d="M-62 130 Q-72 210 -62 300" stroke="#fff" stroke-opacity=".45" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M56 150 Q64 200 58 250" stroke="#fff" stroke-opacity=".22" stroke-width="5" fill="none" stroke-linecap="round"/></g>';
  }
  function sceneBebee() {
    return '<g transform="translate(44 318) rotate(-12)">' + hexes(0, 0, 20, 2, 2, '#fff', 'rgba(255,200,58,.9)') + '</g><g transform="translate(352 322) rotate(10)">' + hexes(0, 0, 20, 2, 2, '#fff', 'rgba(229,138,18,.9)') + '</g>' +
      honey({ x: 92, y: 74, s: .8, rot: -7, l: ['#B9E27A', '#F4B63A'], n: 'Lemongrass' }) + honey({ x: 308, y: 74, s: .8, rot: 7, l: ['#FFE86A', '#F7B500'], n: 'Lemon' }) +
      honey({ x: 200, y: 34, s: 1.04, l: ['#FFB74A', '#F07F1C'], n: 'Original' }) +
      '<path d="M312 30 C340 48 328 80 300 78" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round" fill="none"/>' + bee(330, 28, 1.25, 16);
  }
  /* ---------- extra compositions, used by the poster pages (concept/<brand>/) ---------- */
  function nest(svg, x, y, w) { return svg.replace('<svg viewBox', '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" viewBox'); }
  var VARIANTS = {
    yourgurt: {
      bag: sceneYourgurt,
      tilt: function () { return '<g transform="translate(200 215) rotate(-9) scale(1.12) translate(-200 -215)">' + sceneYourgurt() + '</g>'; },
      fruity: function () {
        return fruit(3, 4, 96, 200, -12) + fruit(0, 56, 226, 172, 8) + fruit(4, 150, 40, 150, 14) +
          '<g transform="translate(176 150) scale(.62)">' + sceneYourgurt() + '</g>' +
          nest(cube('#FFFFFF'), 300, 70, 64) + nest(cube('#FFF3C4'), 20, 40, 56) + nest(cube('#FFFFFF'), 330, 230, 52);
      }
    },
    kidsjoy: {
      trio: sceneKidsJoy,
      solo: function () { return jcup({ x: 200, y: 100, s: 1.9, rot: -4, c: ['#FF8FB8', '#E8457E'], l: ['#FFB6D1', '#F0558A'] }) + fruit(3, 8, 270, 112, -14) + fruit(4, 288, 280, 104, 12) + nest(star('#FFE14A'), 300, 40, 70) + nest(heart('#FF4D6D'), 20, 70, 64); },
      duo: function () { return jcup({ x: 118, y: 140, s: 1.4, rot: -8, c: ['#FFD84A', '#F5A800'], l: ['#FFE98A', '#F7B500'] }) + jcup({ x: 288, y: 170, s: 1.4, rot: 8, c: ['#A8E84F', '#5FB82B'], l: ['#D6F58C', '#8AD13A'] }) + fruit(3, 150, 296, 92, 4) + nest(heart('#FF4D6D'), 310, 40, 66) + nest(star('#7FE0FF'), 14, 60, 64); }
    },
    bebee: {
      bottles: sceneBebee,
      bee: function () { return '<g opacity=".95">' + hexes(200, 205, 38, 5, 5, '#fff', 'rgba(255,255,255,.16)') + '</g>' + bee(196, 205, 4.3, 10); }
    }
  };
  function raw(key, variant) { var v = VARIANTS[key]; if (v) return (v[variant] || v[Object.keys(v)[0]])(); return LIST.filter(function (b) { return b.key === key; })[0].scene(); }
  /* a standalone SVG document string (for drawing on a canvas): logos are passed in as data URIs by the caller */
  function doc(key, variant, px) { return '<svg xmlns="http://www.w3.org/2000/svg" width="' + px + '" height="' + px + '" viewBox="-10 -20 420 420">' + raw(key, variant).replace(/font-family="inherit"/g, 'font-family="Arial,Helvetica,sans-serif"') + '</svg>'; }
  function satDoc(kind, px) { return sat(kind).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="' + px + '" height="' + px + '" '); }

  /* ---------- the list ---------- */
  var LIST = [
    { key: 'dadih', n: 'Dadih', c1: [0.85, 0.11, 0.38], c2: [1.0, 0.45, 0.62], bg: ['#FF5C93', '#D81B60', '#7A0A35'], hl: 'gold', desc: 'Soya and fruit *puddings*, instant *powders* and iced *sticks*.', scene: sceneDadih, sats: ['fruit:3', 'fruit:0', 'fruit:4', 'heart:#FFE14A', 'leaf', 'drop:#FFD1E3', 'drop:#FFFFFF', 'spark', 'spark'] },
    { key: 'yourgurt', n: 'Yourgurt', c1: [0.43, 0.73, 0.23], c2: [0.8, 0.95, 0.6], bg: ['#B4E66E', '#6DBB3A', '#2E7D2B'], hl: 'black', desc: 'Fruity *puddings* with *nata de coco*.', scene: sceneYourgurt, sats: ['fruit:3', 'fruit:4', 'fruit:0', 'cube:#FFFFFF', 'leaf', 'cube:#FFF3C4', 'cube:#FFFFFF', 'spark', 'spark'] },
    { key: 'freshill', n: 'Freshill', c1: [0.04, 0.58, 0.59], c2: [0.5, 0.9, 0.85], bg: ['#3FD0C6', '#0A9396', '#05505A'], hl: 'gold', desc: 'Fruit drink *concentrates* in lemon, blackcurrant, mango, strawberry, lychee and soursop.', scene: sceneFreshill, sats: ['fruit:1', 'fruit:5', 'fruit:2', 'leaf', 'leaf', 'drop:#BFE9FF', 'drop:#FFFFFF', 'spark', 'spark'] },
    { key: 'drinme', n: 'Drinme', c1: [0.17, 0.5, 0.88], c2: [0.55, 0.78, 1.0], bg: ['#5DB4FF', '#2B7FE0', '#12378F'], hl: 'gold', desc: 'Fruit drinks with *jelly* and *Vitamin C*.', scene: sceneDrinme, sats: ['fruit:0', 'fruit:1', 'fruit:2', 'bubble:#FFD25A', 'bubble:#FF7A3C', 'drop:#FFFFFF', 'bubble:#FFE9A0', 'spark', 'spark'] },
    { key: 'kidsjoy', n: "Kid’s Joy", c1: [0.54, 0.31, 0.85], c2: [0.8, 0.65, 1.0], bg: ['#B58BFF', '#8A4FD8', '#41208A'], hl: 'gold', desc: '*Drinking jelly* and *yogurt-flavour* drinks.', scene: sceneKidsJoy, sats: ['heart:#FF4D6D', 'fruit:3', 'star:#FFE14A', 'heart:#FF8FB8', 'fruit:4', 'star:#7FE0FF', 'drop:#FFFFFF', 'spark', 'spark'] },
    { key: 'bebee', n: 'Bebee', c1: [0.96, 0.64, 0.1], c2: [1.0, 0.86, 0.45], bg: ['#FFD25A', '#F5A31A', '#9A4A07'], hl: 'black', desc: '*Honey* in original, lemongrass and lemon.', scene: sceneBebee, sats: ['bee', 'hex:#FFC83A', 'hex:#E58A12', 'bee', 'hex:#FFE08A', 'drop:#FFC83A', 'bee', 'spark', 'spark'] }
  ];
  function sat(kind) {
    var k = kind.split(':'), a = k[1];
    switch (k[0]) {
      case 'fruit': return J.fruitSVG(+a);
      case 'leaf': return J.leafSVG();
      case 'drop': return J.dropSVG(a || '#fff');
      case 'heart': return heart(a);
      case 'star': return star(a);
      case 'bubble': return bubble(a);
      case 'cube': return cube(a);
      case 'hex': return hex(a);
      case 'bee': return beeSat();
      default: return J.sparkSVG();
    }
  }
  Array.prototype.push.apply(J.FLAVOURS, LIST);
  window.BrandArt = { LIST: LIST, doc: doc, satDoc: satDoc, variants: function (k) { return Object.keys(VARIANTS[k] || {}); }, scene: function (i) { return '<svg viewBox="-10 -20 420 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + LIST[i].scene() + '</svg>'; }, sat: sat };
})();

