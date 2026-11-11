/* MECA-3D: dependency-free. Raw WebGL scene driven by scroll + progressive enhancement UI. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = mqReduce.matches;
  mqReduce.addEventListener && mqReduce.addEventListener('change', function (e) { reduce = e.matches; renderOnce(); });
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- scroll progress ---------- */
  var prog = 0, cur = 0, mx = 0, my = 0, cmx = 0, cmy = 0;
  function readScroll() {
    var h = Math.max(1, doc.documentElement.scrollHeight - innerHeight);
    prog = Math.min(1, Math.max(0, scrollY / h));
    root.style.setProperty('--p', prog.toFixed(4));
  }

  /* ---------- hero kinetic type ---------- */
  var h1 = $('.kin');
  if (h1 && !reduce) {
    var i = 0;
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(doc.createTextNode(' ')); return; }
            var w = doc.createElement('span'); w.className = 'w';
            var wi = doc.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--i', i++); wi.textContent = t;
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) split(n);
      });
    })(h1);
  }

  /* ---------- reveal on scroll ---------- */
  var revs = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revs.forEach(function (el, k) { el.style.setProperty('--d', (k % 4) * 70 + 'ms'); io.observe(el); });
  } else revs.forEach(function (el) { el.classList.add('in'); });

  /* ---------- counters ---------- */
  var counters = $$('[data-to]');
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, to = +el.dataset.to, t0 = performance.now(), d = 1600;
        (function tick(t) {
          var k = Math.min(1, (t - t0) / d), ease = 1 - Math.pow(1 - k, 4);
          el.textContent = fmt(to * ease);
          if (k < 1) requestAnimationFrame(tick); else { el.textContent = fmt(to); el.classList.add('done'); }
        })(t0);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- 3D tilt on hover (fine pointers only) ---------- */
  if (!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $$('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- nav ---------- */
  var burger = $('#burger'), nav = $('#nav');
  function closeNav() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false');
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', closeNav); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- course ring ---------- */
  var ringIn = $('#ringIn'), cards = $$('.course', ringIn), ring = $('#ring');
  var n = cards.length, idx = 0, step = 360 / n;
  var flatMq = window.matchMedia('(max-width:760px), (prefers-reduced-motion: reduce)');
  function isFlat() { return flatMq.matches; }
  function layoutRing() {
    var r = Math.round(170 / Math.tan(Math.PI / n)) + 190;
    ringIn.style.setProperty('--r', r + 'px');
    ringIn.style.setProperty('--step', step + 'deg');
    cards.forEach(function (c, k) { c.style.setProperty('--i', k); });
    updateRing();
  }
  function updateRing() {
    var hint = $('#ringHint');
    if (hint) hint.textContent = isFlat() ? 'Swipe sideways to see all five courses.' : 'Drag, swipe or use the arrows to turn the ring.';
    if (isFlat()) {
      ringIn.style.removeProperty('--rot');
      cards.forEach(function (c) { c.style.opacity = ''; c.removeAttribute('inert'); });
      return;
    }
    ringIn.style.setProperty('--rot', (-idx * step) + 'deg');
    var act = ((idx % n) + n) % n;
    cards.forEach(function (c, k) {
      var rel = ((k - act) % n + n) % n; if (rel > n / 2) rel -= n;
      var a = Math.abs(rel * step);
      c.style.opacity = a < 1 ? 1 : a < 100 ? 0.55 : 0.12;
      if (a > 100) c.setAttribute('inert', ''); else c.removeAttribute('inert');
    });
  }
  function turn(d) {
    if (isFlat()) {
      var w = (cards[0].offsetWidth + 14) * d;
      ring.scrollBy({ left: w, behavior: reduce ? 'auto' : 'smooth' });
    } else { idx += d; updateRing(); }
  }
  $('#prev').addEventListener('click', function () { turn(-1); });
  $('#next').addEventListener('click', function () { turn(1); });
  ring.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { turn(-1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { turn(1); e.preventDefault(); }
  });
  ring.tabIndex = 0;
  var dragX = null, moved = false;
  ring.addEventListener('pointerdown', function (e) { dragX = e.clientX; moved = false; });
  ring.addEventListener('pointerup', function (e) {
    if (dragX === null || isFlat()) { dragX = null; return; }
    var dx = e.clientX - dragX; dragX = null;
    if (Math.abs(dx) > 40) { moved = true; turn(dx < 0 ? 1 : -1); }
  });
  ring.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  cards.forEach(function (c, k) {
    c.addEventListener('click', function (e) {
      if (isFlat() || e.target.closest('a')) return;
      var act = ((idx % n) + n) % n, rel = ((k - act) % n + n) % n; if (rel > n / 2) rel -= n;
      if (rel) { idx += rel; updateRing(); }
    });
  });
  flatMq.addEventListener && flatMq.addEventListener('change', updateRing);
  layoutRing();

  /* ---------- WebGL scene ---------- */
  var canvas = $('#gl'), gl = null;
  try { gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'low-power' }) || canvas.getContext('experimental-webgl'); } catch (e) { gl = null; }
  var scene = null;

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function prog2(vs, fs) {
    var p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  var VS = 'attribute vec3 aPos;attribute vec3 aNor;uniform mat4 uProj,uView,uModel;varying vec3 vN;varying vec3 vV;varying float vD;' +
    'void main(){vec4 w=uModel*vec4(aPos,1.);vec4 v=uView*w;vN=mat3(uModel)*aNor;vV=-v.xyz;vD=-v.z;gl_Position=uProj*v;}';
  var FS = 'precision mediump float;uniform vec3 uCol;uniform vec3 uFog;uniform float uAlpha;uniform float uLine;varying vec3 vN;varying vec3 vV;varying float vD;' +
    'void main(){float fog=smoothstep(10.,58.,vD);float near=smoothstep(2.,9.,vD);' +
    'if(uLine>.5){gl_FragColor=vec4(mix(vec3(1.,.82,.82),uFog,fog),.55*(1.-fog)*near*uAlpha);return;}' +
    'vec3 n=normalize(vN);vec3 v=normalize(vV);float rim=pow(1.-abs(dot(n,v)),2.);' +
    'float d=.35+.65*max(dot(n,normalize(vec3(.4,.8,.5))),0.);vec3 c=uCol*d+rim*vec3(.99,.16,.2)*1.1;' +
    'c=mix(c,uFog,fog);gl_FragColor=vec4(c,(.14+rim*.42)*uAlpha*(1.-fog*.8)*near);}';
  var PVS = 'attribute vec3 aPos;uniform mat4 uProj,uView;uniform float uSize;varying float vF;' +
    'void main(){vec4 v=uView*vec4(aPos,1.);gl_Position=uProj*v;float d=max(-v.z,.5);gl_PointSize=clamp(uSize*14./d,1.,uSize*3.);vF=1.-smoothstep(12.,60.,d);}';
  var PFS = 'precision mediump float;varying float vF;void main(){vec2 p=gl_PointCoord-.5;float a=smoothstep(.5,.1,length(p));gl_FragColor=vec4(1.,.8,.8,a*vF*.8);}';

  function m4mul(a, b) { var o = new Float32Array(16); for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) { var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; }
  function persp(fov, asp, nr, fr) { var f = 1 / Math.tan(fov / 2), o = new Float32Array(16); o[0] = f / asp; o[5] = f; o[10] = (fr + nr) / (nr - fr); o[11] = -1; o[14] = 2 * fr * nr / (nr - fr); return o; }
  function trans(x, y, z) { var o = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]); return o; }
  function modelM(x, y, z, a, b, s) {
    var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    // R = Ry(b) * Rx(a), scaled; column-major
    return new Float32Array([
      cb * s, 0, -sb * s, 0,
      sb * sa * s, ca * s, cb * sa * s, 0,
      sb * ca * s, -sa * s, cb * ca * s, 0,
      x, y, z, 1]);
  }

  // geometry from polygon faces
  function mk(faces) {
    var pos = [], nor = [], li = [], tri = 0;
    faces.forEach(function (f) {
      var a = f[0], b = f[1], c = f[2];
      var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      var base = pos.length / 3;
      f.forEach(function (p) { pos.push(p[0], p[1], p[2]); nor.push(nx, ny, nz); });
      for (var k = 1; k < f.length - 1; k++) tri++ , li.push([base, base + k, base + k + 1]);
      for (var q = 0; q < f.length; q++) li.push(['L', base + q, base + (q + 1) % f.length]);
    });
    var tris = [], lines = [];
    li.forEach(function (e) { if (e[0] === 'L') lines.push(e[1], e[2]); else tris.push(e[0], e[1], e[2]); });
    return { pos: new Float32Array(pos), nor: new Float32Array(nor), tris: new Uint16Array(tris), lines: new Uint16Array(lines) };
  }
  function octa() {
    var t = [1, 0, 0], T = [-1, 0, 0], u = [0, 1, 0], U = [0, -1, 0], f = [0, 0, 1], F = [0, 0, -1];
    return mk([[t, u, f], [u, T, f], [T, U, f], [U, t, f], [u, t, F], [T, u, F], [U, T, F], [t, U, F]]);
  }
  function box() {
    var s = .8, v = function (x, y, z) { return [x * s, y * s, z * s]; };
    return mk([[v(-1, -1, 1), v(1, -1, 1), v(1, 1, 1), v(-1, 1, 1)], [v(1, -1, -1), v(-1, -1, -1), v(-1, 1, -1), v(1, 1, -1)],
      [v(-1, 1, 1), v(1, 1, 1), v(1, 1, -1), v(-1, 1, -1)], [v(-1, -1, -1), v(1, -1, -1), v(1, -1, 1), v(-1, -1, 1)],
      [v(1, -1, 1), v(1, -1, -1), v(1, 1, -1), v(1, 1, 1)], [v(-1, -1, -1), v(-1, -1, 1), v(-1, 1, 1), v(-1, 1, -1)]]);
  }
  function tetra() {
    var a = [1, 1, 1], b = [-1, -1, 1], c = [-1, 1, -1], d = [1, -1, -1];
    return mk([[a, b, c], [a, c, d], [a, d, b], [b, d, c]]);
  }

  function initGL() {
    var mesh = prog2(VS, FS), pts = prog2(PVS, PFS);
    var geos = [octa(), box(), tetra()].map(function (g) {
      var o = { n: g.tris.length, nl: g.lines.length };
      o.p = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, o.p); gl.bufferData(gl.ARRAY_BUFFER, g.pos, gl.STATIC_DRAW);
      o.nb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, o.nb); gl.bufferData(gl.ARRAY_BUFFER, g.nor, gl.STATIC_DRAW);
      o.t = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.t); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.tris, gl.STATIC_DRAW);
      o.l = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.l); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.lines, gl.STATIC_DRAW);
      return o;
    });
    // deterministic pseudo-random
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var small = innerWidth < 760, N = small ? 60 : 130, Z = 74, objs = [];
    var pn = small ? 260 : 520, pa = new Float32Array(pn * 3);
    for (var p = 0; p < pn; p++) { pa[p * 3] = (rnd() - .5) * 30; pa[p * 3 + 1] = (rnd() - .5) * 18; pa[p * 3 + 2] = 8 - rnd() * (Z + 10); }
    var pb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pb); gl.bufferData(gl.ARRAY_BUFFER, pa, gl.STATIC_DRAW);
    scene = { mesh: mesh, pts: pts, geos: geos, objs: objs, pb: pb, pn: pn, Z: Z,
      u: { proj: gl.getUniformLocation(mesh, 'uProj'), view: gl.getUniformLocation(mesh, 'uView'), model: gl.getUniformLocation(mesh, 'uModel'), col: gl.getUniformLocation(mesh, 'uCol'), fog: gl.getUniformLocation(mesh, 'uFog'), alpha: gl.getUniformLocation(mesh, 'uAlpha'), line: gl.getUniformLocation(mesh, 'uLine') },
      a: { pos: gl.getAttribLocation(mesh, 'aPos'), nor: gl.getAttribLocation(mesh, 'aNor') },
      pu: { proj: gl.getUniformLocation(pts, 'uProj'), view: gl.getUniformLocation(pts, 'uView'), size: gl.getUniformLocation(pts, 'uSize') }, pa: gl.getAttribLocation(pts, 'aPos') };
    buildProps();
    try { buildDocs(); } catch (e) { QD = null; if (window.console) console.warn('Documents disabled:', e.message); }
    if (/[?&]debug\b/.test(location.search)) window.__scene = function () { return { F: F, cur: cur, PS: PS }; }; // test hook
    if (/[?&]debug\b/.test(location.search)) window.__drawAt = function (p, ms) { cur = prog = p; draw(ms || 1000); }; // test hook (pane may be hidden, so rAF can be paused)
    try { initFigures(); } catch (e) { F = null; if (window.console) console.warn('Figures disabled:', e.message); }
    layoutFigures();
  }

  /* ---------- scratch matrices (no per-frame allocation) ---------- */
  var P_ = new Float32Array(16), V_ = new Float32Array(16), MM = new Float32Array(16);
  function perspInto(o, fov, asp, nr, fr) { var f = 1 / Math.tan(fov / 2); o.fill(0); o[0] = f / asp; o[5] = f; o[10] = (fr + nr) / (nr - fr); o[11] = -1; o[14] = 2 * fr * nr / (nr - fr); }
  function transInto(o, x, y, z) { o.fill(0); o[0] = o[5] = o[10] = o[15] = 1; o[12] = x; o[13] = y; o[14] = z; }
  var PITCH = .2;
  function viewInto(o, cx, cy, cz, p) { // translate by -cam, then look down by p
    var c = Math.cos(p), s = Math.sin(p); o.fill(0);
    o[0] = 1; o[5] = c; o[6] = s; o[9] = -s; o[10] = c; o[15] = 1;
    o[12] = -cx; o[13] = -cy * c + cz * s; o[14] = -cy * s - cz * c;
  }
  function modelInto(o, x, y, z, a, b, sx, sy, sz) {
    var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    o[0] = cb * sx; o[1] = 0; o[2] = -sb * sx; o[3] = 0;
    o[4] = sb * sa * sy; o[5] = ca * sy; o[6] = cb * sa * sy; o[7] = 0;
    o[8] = sb * ca * sz; o[9] = -sa * sz; o[10] = cb * ca * sz; o[11] = 0;
    o[12] = x; o[13] = y; o[14] = z; o[15] = 1;
  }

  /* ---------- glass people: instanced faceless figures ---------- */
  var FVS = 'attribute vec3 aPos;attribute vec3 aNor;attribute vec4 aI0;attribute vec4 aI1;uniform mat4 uProj,uView;uniform float uRing;' +
    'varying vec3 vN;varying vec3 vV;varying float vD;varying float vK;varying float vA;' +
    'void main(){vA=aI1.z;float c=cos(aI1.x),s=sin(aI1.x),lc=cos(aI1.w),ls=sin(aI1.w);float k=aI1.y;bool cull=false;' +
    'if(uRing>.5){if(k<.5)cull=true;k=2.;}' +
    'vec3 p=aPos*aI0.w;vec3 n=aNor;' +
    'p=vec3(p.x,p.y*lc-p.z*ls,p.y*ls+p.z*lc);n=vec3(n.x,n.y*lc-n.z*ls,n.y*ls+n.z*lc);' +
    'p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);n=vec3(c*n.x+s*n.z,n.y,-s*n.x+c*n.z);' +
    'vec4 v=uView*vec4(p+aI0.xyz,1.);vN=n;vV=-v.xyz;vD=-v.z;vK=k;gl_Position=cull?vec4(2.,2.,2.,1.):uProj*v;}';
  var FFS = 'precision mediump float;uniform vec3 uFog;uniform float uA;varying vec3 vN;varying vec3 vV;varying float vD;varying float vK;varying float vA;' +
    'void main(){float fog=smoothstep(10.,58.,vD);float near=smoothstep(2.,9.,vD);' +
    'if(vK>1.5){gl_FragColor=vec4(mix(vec3(1.,.3,.33),uFog,fog),.95*(1.-fog)*near);return;}' +
    'vec3 n=normalize(vN),v=normalize(vV);float rim=pow(1.-abs(dot(n,v)),2.);' +
    'float d=.4+.6*max(dot(n,normalize(vec3(.4,.8,.5))),0.);' +
    'vec3 base=vK>.5?vec3(.9,.16,.2):vec3(.82,.85,.9);vec3 c=base*d+rim*vec3(1.,.2,.25)*(vK>.5?.9:.7);' +
    'c=mix(c,uFog,fog);gl_FragColor=vec4(c,(.3+rim*.5)*(1.-fog*.8)*near*uA*vA);}';

  function pushTri(P, N, a, b, c, ox, oy, oz) {
    var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (l < 1e-7) return; nx /= l; ny /= l; nz /= l;
    var mx = (a[0] + b[0] + c[0]) / 3 - ox, my = (a[1] + b[1] + c[1]) / 3 - oy, mz = (a[2] + b[2] + c[2]) / 3 - oz;
    if (nx * mx + ny * my + nz * mz < 0) { nx = -nx; ny = -ny; nz = -nz; }
    P.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]); N.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
  }
  function lathe(profile, seg, cy, P, N) {
    for (var i = 0; i < profile.length - 1; i++) for (var j = 0; j < seg; j++) {
      var t0 = j / seg * 6.2831853, t1 = (j + 1) / seg * 6.2831853, p0 = profile[i], p1 = profile[i + 1];
      var a = [p0[0] * Math.cos(t0), p0[1], p0[0] * Math.sin(t0)], b = [p0[0] * Math.cos(t1), p0[1], p0[0] * Math.sin(t1)],
        c = [p1[0] * Math.cos(t1), p1[1], p1[0] * Math.sin(t1)], d = [p1[0] * Math.cos(t0), p1[1], p1[0] * Math.sin(t0)];
      pushTri(P, N, a, b, c, 0, cy, 0); pushTri(P, N, a, c, d, 0, cy, 0);
    }
  }
  function figureGeo() {
    var P = [], N = [], R = .22, prof = [], k, a;
    for (k = 0; k <= 3; k++) { a = (-90 + k * 30) * Math.PI / 180; prof.push([R * Math.cos(a), .25 + R * Math.sin(a)]); }
    prof.push([R * .92, .95]);
    for (k = 1; k <= 3; k++) { a = k * 30 * Math.PI / 180; prof.push([R * .92 * Math.cos(a), .95 + R * .92 * Math.sin(a)]); }
    lathe(prof, 8, .6, P, N);
    var hp = []; for (k = 0; k <= 6; k++) { a = (-90 + k * 30) * Math.PI / 180; hp.push([.26 * Math.cos(a), 1.55 + .26 * Math.sin(a)]); }
    lathe(hp, 8, 1.55, P, N);
    return { p: new Float32Array(P), n: new Float32Array(N), c: P.length / 3 };
  }
  function ringGeo() {
    var P = [], N = [], R = .2, r = .035, y = 2.03, U = 12, V = 5, u, v;
    function pt(uu, vv) { var A = uu / U * 6.2831853, B = vv / V * 6.2831853; return [(R + r * Math.cos(B)) * Math.cos(A), y + r * Math.sin(B), (R + r * Math.cos(B)) * Math.sin(A)]; }
    for (u = 0; u < U; u++) for (v = 0; v < V; v++) {
      var mA = (u + .5) / U * 6.2831853, cx = R * Math.cos(mA), cz = R * Math.sin(mA);
      var a = pt(u, v), b = pt(u + 1, v), c = pt(u + 1, v + 1), d = pt(u, v + 1);
      pushTri(P, N, a, b, c, cx, y, cz); pushTri(P, N, a, c, d, cx, y, cz);
    }
    return { p: new Float32Array(P), n: new Float32Array(N), c: P.length / 3 };
  }

  var F = null, FLOOR = -5.8;
  function initFigures() {
    var ext = gl.getExtension('ANGLE_instanced_arrays'); if (!ext) return;
    var fp = prog2(FVS, FFS), small = innerWidth < 760, NF = small ? 60 : 88;
    function buf(g) { var o = { c: g.c, p: gl.createBuffer(), n: gl.createBuffer() }; gl.bindBuffer(gl.ARRAY_BUFFER, o.p); gl.bufferData(gl.ARRAY_BUFFER, g.p, gl.STATIC_DRAW); gl.bindBuffer(gl.ARRAY_BUFFER, o.n); gl.bufferData(gl.ARRAY_BUFFER, g.n, gl.STATIC_DRAW); return o; }
    F = { ext: ext, prog: fp, body: buf(figureGeo()), ring: buf(ringGeo()), N: NF, inst: new Float32Array(NF * 8), ibuf: gl.createBuffer(),
      ph: new Float32Array(NF), tgt: [], w: new Float32Array(5), pS: PS, A: AN, tabs: new Float32Array(64 * 3), nt: 0, pf: { x: 0, y: 0, z: 0 }, orb: { x: 0, y: 0, z: 0 },
      u: { proj: gl.getUniformLocation(fp, 'uProj'), view: gl.getUniformLocation(fp, 'uView'), fog: gl.getUniformLocation(fp, 'uFog'), ring: gl.getUniformLocation(fp, 'uRing'), alpha: gl.getUniformLocation(fp, 'uA') },
      a: { pos: gl.getAttribLocation(fp, 'aPos'), nor: gl.getAttribLocation(fp, 'aNor'), i0: gl.getAttribLocation(fp, 'aI0'), i1: gl.getAttribLocation(fp, 'aI1') } };
    for (var s = 0; s < 5; s++) { F.tgt.push(new Float32Array(NF * 5)); }
    var sd = 91; function r() { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; }
    for (var i = 0; i < NF; i++) { F.ph[i] = r() * 6.28; F.inst[i * 8 + 5] = i % 11 === 0 ? 1 : 0; }
    F.rseed = []; for (i = 0; i < NF * 4; i++) F.rseed.push(r());
    gl.bindBuffer(gl.ARRAY_BUFFER, F.ibuf); gl.bufferData(gl.ARRAY_BUFFER, F.inst, gl.DYNAMIC_DRAW);
    layoutFigures();
  }
  function isMgr(i) { return i % 11 === 0; }
  var PS = new Float32Array(5), AN = [{ x: 0, z: 0 }, { x: 0, z: 0 }, { x: 0, z: 0 }, { x: 0, z: 0 }, { x: 0, z: 0 }];
  function isNarrow() { return innerWidth / innerHeight < 1.1 || innerWidth < 760; }
  function computeAnchors() {
    var D = isNarrow() ? 17 : 15, k;
    var els = [$('#hero')].concat($$('.beat')), docH = doc.documentElement.scrollHeight, mx_ = Math.max(1, docH - innerHeight);
    for (k = 0; k < 5; k++) {
      var p = 0, el = els[k];
      if (k > 0 && el) { var rc = el.getBoundingClientRect(); p = rc.height > 0 ? (rc.top + scrollY + rc.height / 2 - innerHeight / 2) / mx_ : PS[k - 1] + .02; }
      p = Math.min(1, Math.max(0, p)); if (k > 0 && p < PS[k - 1] + .005) p = PS[k - 1] + .005;
      PS[k] = p; AN[k].x = Math.sin(p * 7) * 1.1; AN[k].z = 8 - p * 74 * .97 - D;
    }
  }
  function layoutFigures() {
    computeAnchors(); layoutProps();
    if (!F) return;
    var NF = F.N, narrow = isNarrow(), k, i, r;
    function set(s, i, lx, y, lz, rot, sc) { var b = i * 5, t = F.tgt[s]; t[b] = F.A[s].x + lx; t[b + 1] = y; t[b + 2] = F.A[s].z + lz; t[b + 3] = rot; t[b + 4] = 1.5 * sc * (isMgr(i) ? 1.15 : 1); }
    var rs = F.rseed;
    // 0 hero: loose
    // (only management is shown here; ordinary figures wait invisibly at their line-up spots)
    for (i = 0; i < NF; i++) if (isMgr(i)) set(0, i, (narrow ? -4 : -9) + rs[i * 4] * (narrow ? 8 : 18), FLOOR, -6 + rs[i * 4 + 2] * 12, rs[i * 4 + 3] > .5 ? Math.PI / 2 : -Math.PI / 2, narrow ? .8 : 1);
    // 1 line up in tidy rows facing us
    var cols = narrow ? 6 : 14, rows = Math.ceil(NF / cols);
    for (i = 0; i < NF; i++) { var c1 = i % cols; r = Math.floor(i / cols); set(1, i, (c1 - (cols - 1) / 2) * (narrow ? 1.3 : 1.35), FLOOR, (r - (rows - 1) / 2) * 1.6, 0, 1); }
    for (i = 0; i < NF; i++) if (!isMgr(i)) for (var q = 0; q < 5; q++) F.tgt[0][i * 5 + q] = F.tgt[1][i * 5 + q];
    // 2 training: rows facing a lit stage, trainer larger
    var tc = narrow ? 6 : 12, tn = NF - 1; rows = Math.ceil(tn / tc);
    for (i = 0; i < tn; i++) { var c2 = i % tc; r = Math.floor(i / tc); set(2, i, (c2 - (tc - 1) / 2) * (narrow ? 1.3 : 1.45), FLOOR, -4.5 + r * 1.4, Math.PI, 1); }
    set(2, NF - 1, 0, FLOOR + .3, -6.6, 0, 1.7);
    F.pf.x = F.A[2].x; F.pf.y = FLOOR + .15; F.pf.z = F.A[2].z - 7.4;
    // 3 pairs facing across tables
    var nt = Math.floor(NF / 4), tcl = narrow ? 3 : 6, trw = Math.ceil(nt / tcl), txs = narrow ? 3.2 : 3.4, tzs = 3.4; F.nt = nt;
    for (k = 0; k < nt; k++) {
      var cx = ((k % tcl) - (tcl - 1) / 2) * txs, cz = (Math.floor(k / tcl) - (trw - 1) / 2) * tzs;
      F.tabs[k * 3] = F.A[3].x + cx; F.tabs[k * 3 + 1] = FLOOR + 1.15; F.tabs[k * 3 + 2] = F.A[3].z + cz;
      for (var j = 0; j < 4; j++) { var side = j < 2 ? -1 : 1; set(3, k * 4 + j, cx + (j % 2 ? .5 : -.5), FLOOR, cz + side * 1.05, side < 0 ? 0 : Math.PI, 1); }
    }
    // 4 handshake in front, everyone else settled behind
    var cc = narrow ? 6 : 12;
    for (i = 2; i < NF; i++) { var c4 = (i - 2) % cc; r = Math.floor((i - 2) / cc); set(4, i, (c4 - (cc - 1) / 2) * (narrow ? 1.3 : 1.5), FLOOR, -9 - r * 1.6, 0, 1); }
    set(4, 0, -1.1, FLOOR, 2.5, Math.PI / 2, 1.7); set(4, 1, 1.1, FLOOR, 2.5, -Math.PI / 2, 1.7);
    F.orb.x = F.A[4].x; F.orb.y = FLOOR + 2.4; F.orb.z = F.A[4].z + 2.5;
  }
  function sm(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function angLerp(a, b, t) { var d = b - a; d -= 6.2831853 * Math.floor((d + 3.1415927) / 6.2831853); return a + d * t; }

  function updateFigures(tt) {
    var s = 0, t = 0, k, i, pS = F.pS, w = F.w, inst = F.inst, NF = F.N;
    if (cur >= pS[4]) { s = 3; t = 1; } else {
      for (k = 0; k < 4; k++) if (cur < pS[k + 1]) { s = k; break; }
      t = sm(((cur - pS[s]) / (pS[s + 1] - pS[s]) - .2) / .6);
    }
    w[0] = w[1] = w[2] = w[3] = w[4] = 0; w[s] = 1 - t; w[s + 1] = t;
    // Only monotonic smoothstep blending between formations. No bobbing, hopping, lean or spring anywhere:
    // y, scale and rotation are pure blends of fixed targets; the only autonomous motion is the hero's
    // constant-speed horizontal drift of the management figures.
    var loose = s === 0 ? 1 - t : 0, g0 = F.tgt[s], g1 = F.tgt[s + 1], vis = sm((1 - w[0] - .25) / .5);
    for (i = 0; i < NF; i++) {
      var b = i * 5, o = i * 8, mg = isMgr(i);
      var x = g0[b] + (g1[b] - g0[b]) * t, y = g0[b + 1] + (g1[b + 1] - g0[b + 1]) * t, z = g0[b + 2] + (g1[b + 2] - g0[b + 2]) * t;
      var sc = g0[b + 4] + (g1[b + 4] - g0[b + 4]) * t, rot = angLerp(g0[b + 3], g1[b + 3], t);
      if (loose > 0 && mg) {
        var v = (g0[b + 3] > 0 ? 1 : -1) * (.3 + (F.ph[i] % 1) * .25), ax = AN[0].x, xs = (((g0[b] - ax + v * tt + 14) % 28) + 28) % 28 - 14;
        x += (ax + xs - g0[b]) * loose;
      }
      inst[o] = x; inst[o + 1] = y; inst[o + 2] = z; inst[o + 3] = sc; inst[o + 4] = rot; inst[o + 6] = mg ? 1 : vis;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, F.ibuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, inst);
  }

  /* ---------- meaningful props: scales, contracts, shield, gavel, paper, org chart, calendar ---------- */
  // Tiny procedural modeller: primitives are merged into one flat-shaded mesh (+ edge lines) per colour group.
  function MB() { return { P: [], N: [], T: [], L: [] }; }
  function mrot(rx, ry, rz) { // 3x3 row-major, R = Rz*Ry*Rx
    var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
    return [cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx, sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx, -sy, cy * sx, cy * cx];
  }
  function xf(p, m) { var x = p[0] * m.s[0], y = p[1] * m.s[1], z = p[2] * m.s[2], R = m.R; return [R[0] * x + R[1] * y + R[2] * z + m.t[0], R[3] * x + R[4] * y + R[5] * z + m.t[1], R[6] * x + R[7] * y + R[8] * z + m.t[2]]; }
  function M(t, s, r) { return { t: t, s: s || [1, 1, 1], R: mrot(r ? r[0] : 0, r ? r[1] : 0, r ? r[2] : 0) }; }
  function poly(mb, pts, m, edges) {
    var q = pts.map(function (p) { return xf(p, m); }), a = q[0], b = q[1], c = q[2];
    var ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    var base = mb.P.length / 3, i;
    for (i = 0; i < q.length; i++) { mb.P.push(q[i][0], q[i][1], q[i][2]); mb.N.push(nx / l, ny / l, nz / l); }
    for (i = 1; i < q.length - 1; i++) mb.T.push(base, base + i, base + i + 1);
    if (edges !== false) for (i = 0; i < q.length; i++) mb.L.push(base + i, base + (i + 1) % q.length);
  }
  function bx(mb, m) {
    var v = function (x, y, z) { return [x * .5, y * .5, z * .5]; };
    [[v(-1, -1, 1), v(1, -1, 1), v(1, 1, 1), v(-1, 1, 1)], [v(1, -1, -1), v(-1, -1, -1), v(-1, 1, -1), v(1, 1, -1)], [v(-1, 1, 1), v(1, 1, 1), v(1, 1, -1), v(-1, 1, -1)],
      [v(-1, -1, -1), v(1, -1, -1), v(1, -1, 1), v(-1, -1, 1)], [v(1, -1, 1), v(1, -1, -1), v(1, 1, -1), v(1, 1, 1)], [v(-1, -1, -1), v(-1, -1, 1), v(-1, 1, 1), v(-1, 1, -1)]]
      .forEach(function (f) { poly(mb, f, m); });
  }
  function cyl(mb, m, seg) { // axis Y, radius .5, height 1
    var i, top = [], bot = [];
    for (i = 0; i < seg; i++) { var a = i / seg * 6.2831853, c = Math.cos(a) * .5, s = Math.sin(a) * .5; top.push([c, .5, s]); bot.push([c, -.5, s]); }
    poly(mb, top, m); poly(mb, bot.slice().reverse(), m);
    for (i = 0; i < seg; i++) { var j = (i + 1) % seg; poly(mb, [bot[i], bot[j], top[j], top[i]], m, false); }
  }
  function sph(mb, m, seg, rings) {
    var i, j, pt = function (u, v) { var a = u / seg * 6.2831853, b = -1.5707963 + v / rings * 3.1415927; return [.5 * Math.cos(b) * Math.cos(a), .5 * Math.sin(b), .5 * Math.cos(b) * Math.sin(a)]; };
    for (j = 0; j < rings; j++) for (i = 0; i < seg; i++) {
      var a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1);
      if (j === 0) poly(mb, [a, c, d], m, false); else if (j === rings - 1) poly(mb, [a, b, c], m, false); else poly(mb, [a, b, c, d], m, false);
    }
  }
  function tor(mb, m, R, r, U, V) {
    var i, j, pt = function (u, v) { var A = u / U * 6.2831853, B = v / V * 6.2831853; return [(R + r * Math.cos(B)) * Math.cos(A), r * Math.sin(B), (R + r * Math.cos(B)) * Math.sin(A)]; };
    for (i = 0; i < U; i++) for (j = 0; j < V; j++) poly(mb, [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)], m, false);
  }
  function prism(mb, m, outline, th) { // outline in XY, extruded along Z (+-th/2)
    var f = outline.map(function (p) { return [p[0], p[1], th / 2]; }), b = outline.map(function (p) { return [p[0], p[1], -th / 2]; }), n = outline.length, i;
    poly(mb, f, m); poly(mb, b.slice().reverse(), m);
    for (i = 0; i < n; i++) { var j = (i + 1) % n; poly(mb, [f[i], b[i], b[j], f[j]], m, false); }
  }
  function bar(mb, a, b, th) { // box between two points
    var dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    var wy = [dx / len, dy / len, dz / len], ref = Math.abs(wy[2]) > .9 ? [1, 0, 0] : [0, 0, 1];
    var ux = wy[1] * ref[2] - wy[2] * ref[1], uy = wy[2] * ref[0] - wy[0] * ref[2], uz = wy[0] * ref[1] - wy[1] * ref[0], ul = Math.sqrt(ux * ux + uy * uy + uz * uz);
    var u = [ux / ul, uy / ul, uz / ul], v = [wy[1] * u[2] - wy[2] * u[1], wy[2] * u[0] - wy[0] * u[2], wy[0] * u[1] - wy[1] * u[0]];
    var m = { t: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], s: [th, len, th], R: [u[0], wy[0], v[0], u[1], wy[1], v[1], u[2], wy[2], v[2]] };
    bx(mb, m);
  }
  function fin(mb) {
    var o = { n: mb.T.length, nl: mb.L.length, p: gl.createBuffer(), nb: gl.createBuffer(), t: gl.createBuffer(), l: gl.createBuffer() };
    gl.bindBuffer(gl.ARRAY_BUFFER, o.p); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mb.P), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.nb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mb.N), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.t); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mb.T), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.l); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mb.L), gl.STATIC_DRAW);
    return o;
  }
  var PROPS = null, PR = [];
  function buildProps() {
    var k, w, r, P = {};
    // employment contract page: text lines, signature line, red stamp
    w = MB(); r = MB();
    bx(w, M([0, 0, 0], [1.0, 1.4, .03]));
    [.5, .36, .22, .08, -.06].forEach(function (y, i) { bx(w, M([i === 4 ? -.1 : 0, y, .03], [i === 4 ? .6 : .72, .035, .02])); });
    bx(w, M([-.15, -.5, .03], [.5, .02, .02]));
    tor(r, M([.27, -.4, .035], [1, 1, 1], [1.5707963, 0, 0]), .13, .022, 14, 5);
    bar(r, [-.38, -.43, .04], [-.28, -.36, .04], .03); bar(r, [-.28, -.36, .04], [-.2, -.46, .04], .03); bar(r, [-.2, -.46, .04], [-.08, -.38, .04], .03);
    P.contract = [fin(w), fin(r)];
    // folder
    w = MB(); r = MB();
    bx(w, M([0, 0, -.03], [1.5, 1.1, .04])); bx(w, M([0, -.06, 0], [1.3, .9, .02])); bx(w, M([0, -.1, .06], [1.5, .94, .04]));
    bx(r, M([-.4, .58, -.03], [.55, .14, .04]));
    P.folder = [fin(w), fin(r)];
    // ring binder
    w = MB(); r = MB();
    bx(w, M([.05, 0, 0], [1.1, 1.6, .3])); bx(w, M([-.5, 0, .17], [.07, .6, .02]));
    bx(r, M([-.55, 0, 0], [.14, 1.6, .32])); bx(r, M([.05, .35, .16], [.7, .05, .02])); bx(r, M([.05, .2, .16], [.5, .035, .02]));
    P.binder = [fin(w), fin(r)];
    // rubber stamp
    w = MB(); r = MB();
    cyl(w, M([0, .55, 0], [.26, .95, .26]), 8); sph(w, M([0, 1.12, 0], [.5, .5, .5]), 8, 5);
    cyl(r, M([0, 0, 0], [1.0, .12, 1.0]), 10); cyl(r, M([0, -.12, 0], [.8, .1, .8]), 10);
    P.stamp = [fin(w), fin(r)];
    // bound employee handbook (cover texture is a quad drawn on top)
    w = MB(); r = MB();
    bx(w, M([0, 0, 0], [1.15, 1.5, .3])); bx(w, M([.58, 0, 0], [.02, 1.4, .26]));
    bx(r, M([-.5, 0, .0], [.14, 1.52, .32]));
    P.handbook = [fin(w), fin(r)];
    // gavel on sound block
    w = MB(); r = MB();
    cyl(w, M([0, -1.2, 0], [2.2, .28, 2.2]), 12); cyl(w, M([0, -.95, 0], [1.4, .22, 1.4]), 12);
    cyl(w, M([-.15, .9, 0], [.62, 1.6, .62], [0, 0, 1.5707963]), 10);
    bar(w, [-.15, .9, 0], [1.0, -.7, 0], .16);
    cyl(r, M([-.85, .9, 0], [.7, .12, .7], [0, 0, 1.5707963]), 10); cyl(r, M([.55, .9, 0], [.7, .12, .7], [0, 0, 1.5707963]), 10);
    P.gavel = [fin(w), fin(r)];
    // paper stack with red clip
    w = MB(); r = MB();
    for (k = 0; k < 6; k++) bx(w, M([0, k * .075, 0], [1.5, .06, 2.0], [0, k * .09 - .22, 0]));
    bx(r, M([-.78, .24, -.9], [.1, .55, .28])); bx(r, M([-.78, .2, -.9], [.18, .1, .28]));
    P.stack = [fin(w), fin(r)];
    // org chart network
    w = MB(); r = MB();
    var top = [0, 1.6, 0], mid = [[-2.2, .2, 0], [0, .2, 0], [2.2, .2, 0]], bot = [];
    mid.forEach(function (m, i) { bot.push([m[0] - .65, -1.3, 0], [m[0] + .65, -1.3, 0]); bar(w, top, [m[0], m[1] + .2, 0], .045); });
    bot.forEach(function (b, i) { var m = mid[Math.floor(i / 2)]; bar(w, [m[0], m[1] - .2, 0], [b[0], b[1] + .2, 0], .045); bx(w, M(b, [1.0, .42, .1])); });
    mid.forEach(function (m) { bx(w, M(m, [1.3, .5, .12])); });
    bx(r, M(top, [1.6, .6, .14])); sph(r, M([0, 1.6, .12], [.22, .22, .22]), 8, 4);
    P.org = [fin(w), fin(r)];
    // calendar (training)
    w = MB(); r = MB();
    bx(w, M([0, 0, 0], [1.6, 1.8, .07]));
    for (var rr = 0; rr < 4; rr++) for (var cc = 0; cc < 5; cc++) if (!(rr === 1 && cc === 3)) bx(w, M([-.56 + cc * .28, .38 - rr * .3, .05], [.18, .18, .04]));
    bx(r, M([0, .75, .02], [1.6, .3, .09])); bx(r, M([.28, .08, .06], [.2, .2, .06]));
    [-.45, .45].forEach(function (x) { cyl(w, M([x, .95, 0], [.08, .3, .08]), 6); });
    P.calendar = [fin(w), fin(r)];
    PROPS = P;
  }
  // placements relative to each scene's anchor: [prop, x, y, z, scale, rotY, spin(rad/s), alpha]
  // placements relative to each scene's anchor: [kind, x, y, z, scale, rotY, spin(rad/s, constant), alpha]; 'page:*' = textured document
  var PLACE = [
    [['contract', 7, 1.1, -14, 3.4, -.5, 0, .3], ['page:policy', 12, 6.6, -22, 3.0, .3, 0, .26], ['binder', 9.5, 3.1, -30, 3.2, .4, .02, .3]],
    [['page:offer', -7, 1.8, -9, 2.5, .25, 0, 1], ['page:showcause', 7, 1.8, -9, 2.5, -.25, 0, 1], ['folder', 0, 5.4, -17, 2.3, .1, .03, .6], ['page:nda', -12, 6.1, -17, 2.0, .3, 0, .5]],
    [['handbook', -7.5, 2.1, -9, 2.5, .45, .03, 1], ['page:policy', 7.5, 2.1, -9, 2.5, -.2, 0, 1], ['calendar', 0, 5.1, -15, 2.4, 0, .04, .85], ['page:offer', 12, 6.6, -17, 2.0, -.3, 0, .5]],
    [['gavel', -7, 2.1, -9, 2.3, .2, .05, 1], ['stack', 7, 0.8, -9, 2.4, .3, .04, 1], ['page:inquiry', 0, 5.4, -16, 2.2, 0, 0, .7], ['stamp', 11, 4.6, -14, 2.0, .2, .03, .8]],
    [['org', 0, 2.6, -15, 2.7, 0, .02, 1], ['page:termination', -9, 1.6, -10, 2.4, .35, 0, .85], ['binder', 9, 1.6, -10, 2.2, -.3, .02, .85], ['page:nda', 12, 6.6, -14, 1.9, -.3, 0, .5]]
  ];
  var DOCS = ['offer', 'showcause', 'inquiry', 'termination', 'nda', 'policy', 'cover'];
  function layoutProps() {
    if (!PROPS) return;
    var narrow = isNarrow(), xs = narrow ? .5 : 1, ss = narrow ? .8 : 1; PR.length = 0;
    for (var s = 0; s < 5; s++) PLACE[s].forEach(function (d) {
      var isPage = d[0].indexOf('page:') === 0, it = { g: isPage ? null : PROPS[d[0]], q: isPage ? DOCS.indexOf(d[0].slice(5)) : (d[0] === 'handbook' ? 6 : -1), x: AN[s].x + d[1] * xs, y: d[2], z: AN[s].z + d[3], s: d[4] * ss, ry: d[5], sp: d[6], al: d[7], st: s };
      PR.push(it);
    });
  }
  function drawProps(S, camZ, tt) {
    for (var i = 0; i < PR.length; i++) {
      var o = PR[i], dz = camZ - o.z; if (dz < 0.5 || dz > 62 || !o.g) continue;
      modelInto(MM, o.x, o.y, o.z, 0, o.ry + o.sp * tt, o.s, o.s, o.s); gl.uniformMatrix4fv(S.u.model, false, MM);
      for (var k = 0; k < 2; k++) {
        var g = o.g[k]; gl.uniform3fv(S.u.col, k ? COL_R : COL_W); gl.uniform1f(S.u.alpha, o.al * (F ? .3 + .7 * F.w[o.st] : 1) * (k ? 1.3 : 1.5));
        gl.bindBuffer(gl.ARRAY_BUFFER, g.p); gl.vertexAttribPointer(S.a.pos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, g.nb); gl.vertexAttribPointer(S.a.nor, 3, gl.FLOAT, false, 0, 0);
        gl.uniform1f(S.u.line, 0); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g.t); gl.drawElements(gl.TRIANGLES, g.n, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(S.u.line, 1); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g.l); gl.drawElements(gl.LINES, g.nl, gl.UNSIGNED_SHORT, 0);
      }
    }
  }

  /* ---------- document mockups: one shared canvas texture atlas, drawn as quads ---------- */
  function drawDoc(c, ox, oy, w, h, sp) {
    c.save(); c.translate(ox, oy); c.beginPath(); c.rect(0, 0, w, h); c.clip();
    function ls(px) { if ('letterSpacing' in c) c.letterSpacing = px + 'px'; }
    c.textBaseline = 'alphabetic';
    if (sp.cover) {
      c.fillStyle = 'rgba(34,34,36,.62)'; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(223,19,29,.9)'; c.fillRect(0, 0, 38, h);
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.strokeRect(50, 14, w - 64, h - 28);
      c.fillStyle = '#fff'; c.font = 'bold 26px system-ui, sans-serif'; ls(3); c.textAlign = 'center';
      c.fillText('EMPLOYEE', 150, 120); c.fillText('HANDBOOK', 150, 154);
      c.fillStyle = 'rgba(223,19,29,.95)'; c.fillRect(110, 170, 80, 4);
      c.fillStyle = 'rgba(255,255,255,.6)'; c.font = '13px system-ui, sans-serif'; ls(1); c.fillText('[COMPANY NAME]', 150, 205);
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; c.beginPath(); c.arc(150, 280, 28, 0, 6.2832); c.stroke(); c.beginPath(); c.arc(150, 280, 20, 0, 6.2832); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '9px system-ui, sans-serif'; c.fillText('SAMPLE LAYOUT', 150, 330);
      c.restore(); return;
    }
    c.fillStyle = 'rgba(255,255,255,.17)'; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(255,255,255,.65)'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4);
    // header block (placeholder logo + reference lines)
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.5; c.strokeRect(18, 18, 74, 34);
    c.fillStyle = 'rgba(223,19,29,.9)'; c.fillRect(24, 24, 16, 22); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(46, 26, 40, 5); c.fillRect(46, 36, 30, 5);
    c.fillStyle = 'rgba(255,255,255,.6)'; c.font = '9px system-ui, sans-serif'; ls(.5); c.textAlign = 'right';
    c.fillText('REF: [ ]', w - 18, 30); c.fillText('DATE: [ ]', w - 18, 44);
    // title in small caps, wrapped
    c.fillStyle = 'rgba(255,255,255,.96)'; c.font = 'bold 15px system-ui, sans-serif'; ls(1.4); c.textAlign = 'center';
    var words = sp.t.split(' '), line = '', ly = 94, i;
    for (i = 0; i < words.length; i++) { var test = line ? line + ' ' + words[i] : words[i]; if (c.measureText(test).width > w - 40 && line) { c.fillText(line, w / 2, ly); line = words[i]; ly += 20; } else line = test; }
    c.fillText(line, w / 2, ly);
    c.fillStyle = 'rgba(223,19,29,.95)'; c.fillRect(w / 2 - 36, ly + 10, 72, 3);
    // salutation + grey text lines
    c.textAlign = 'left'; c.fillStyle = 'rgba(255,255,255,.6)'; c.font = '10px system-ui, sans-serif'; ls(0); c.fillText('Dear [Name],', 20, ly + 38);
    var ws = [212, 206, 214, 190, 210, 202, 214, 160, 208, 196, 120];
    c.fillStyle = 'rgba(255,255,255,.38)';
    for (i = 0; i < ws.length; i++) c.fillRect(20, ly + 50 + i * 13, ws[i], 5);
    // signature line + seal / stamp
    c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(20, h - 40); c.lineTo(118, h - 40); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '8px system-ui, sans-serif'; c.fillText('[Signature]', 20, h - 28);
    c.strokeStyle = 'rgba(223,19,29,.95)'; c.fillStyle = 'rgba(223,19,29,.95)';
    if (sp.s === 'seal') { c.lineWidth = 3; c.beginPath(); c.arc(w - 52, h - 52, 25, 0, 6.2832); c.stroke(); c.lineWidth = 1.5; c.beginPath(); c.arc(w - 52, h - 52, 18, 0, 6.2832); c.stroke(); c.font = 'bold 7px system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('SAMPLE', w - 52, h - 50); }
    else { c.save(); c.translate(w - 62, h - 52); c.rotate(-.2); c.lineWidth = 3; c.strokeRect(-36, -14, 72, 28); c.font = 'bold 12px system-ui, sans-serif'; c.textAlign = 'center'; ls(1.5); c.fillText('SAMPLE', 0, 4); c.restore(); }
    c.restore();
  }
  var QD = null;
  function buildDocs() {
    var cv = doc.createElement('canvas'); cv.width = 1024; cv.height = 704; var c = cv.getContext('2d'); if (!c) return;
    var specs = [{ t: 'OFFER OF EMPLOYMENT', s: 'seal' }, { t: 'SHOW CAUSE LETTER', s: 'rect' }, { t: 'NOTICE OF DOMESTIC INQUIRY', s: 'seal' }, { t: 'NOTICE OF TERMINATION', s: 'rect' },
      { t: 'CONFIDENTIALITY AGREEMENT', s: 'seal' }, { t: 'POLICY DOCUMENT', s: 'rect' }, { cover: true }];
    specs.forEach(function (sp, i) { drawDoc(c, (i % 4) * 256, Math.floor(i / 4) * 352, 256, 352, sp); });
    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var prog = prog2('attribute vec3 aPos;attribute vec2 aUV;uniform mat4 uProj,uView,uModel;varying vec2 vUV;varying float vD;void main(){vec4 v=uView*uModel*vec4(aPos,1.);vUV=aUV;vD=-v.z;gl_Position=uProj*v;}',
      'precision mediump float;uniform sampler2D uTex;uniform float uAlpha;varying vec2 vUV;varying float vD;void main(){vec4 c=texture2D(uTex,vUV);float fog=smoothstep(10.,58.,vD);float near=smoothstep(2.,9.,vD);gl_FragColor=vec4(mix(c.rgb,vec3(.078),fog),c.a*uAlpha*(1.-fog*.8)*near);}');
    var quads = DOCS.map(function (n, i) {
      var u0 = (i % 4) / 4, u1 = u0 + .25, v0 = Math.floor(i / 4) / 2, v1 = v0 + .5, z = i === 6 ? .152 : 0, cx = i === 6 ? .04 : 0, hw = i === 6 ? .5 : .5, hh = .7;
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([cx - hw, hh, z, u0, v0, cx + hw, hh, z, u1, v0, cx + hw, -hh, z, u1, v1, cx - hw, -hh, z, u0, v1]), gl.STATIC_DRAW);
      return b;
    });
    QD = { prog: prog, tex: tex, quads: quads, u: { proj: gl.getUniformLocation(prog, 'uProj'), view: gl.getUniformLocation(prog, 'uView'), model: gl.getUniformLocation(prog, 'uModel'), tex: gl.getUniformLocation(prog, 'uTex'), alpha: gl.getUniformLocation(prog, 'uAlpha') },
      a: { pos: gl.getAttribLocation(prog, 'aPos'), uv: gl.getAttribLocation(prog, 'aUV') } };
  }
  function drawQuads(S, camZ, tt) {
    if (!QD) return;
    var u = QD.u, a = QD.a, i;
    gl.useProgram(QD.prog); gl.uniformMatrix4fv(u.proj, false, P_); gl.uniformMatrix4fv(u.view, false, V_);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, QD.tex); gl.uniform1i(u.tex, 0);
    gl.enableVertexAttribArray(a.pos); gl.enableVertexAttribArray(a.uv);
    for (i = 0; i < PR.length; i++) {
      var o = PR[i], dz = camZ - o.z; if (o.q < 0 || dz < 0.5 || dz > 62) continue;
      modelInto(MM, o.x, o.y, o.z, 0, o.ry + o.sp * tt, o.s, o.s, o.s); gl.uniformMatrix4fv(u.model, false, MM); gl.uniform1f(u.alpha, o.al * (F ? .3 + .7 * F.w[o.st] : 1));
      gl.bindBuffer(gl.ARRAY_BUFFER, QD.quads[o.q]); gl.vertexAttribPointer(a.pos, 3, gl.FLOAT, false, 20, 0); gl.vertexAttribPointer(a.uv, 2, gl.FLOAT, false, 20, 12);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    gl.disableVertexAttribArray(a.pos); gl.disableVertexAttribArray(a.uv);
    gl.useProgram(S.mesh); gl.enableVertexAttribArray(S.a.pos); gl.enableVertexAttribArray(S.a.nor);
  }

  /* ---------- small rotating scales above the hero logo (own tiny canvas) ---------- */
  function scalesMBs() {
    var k, w = MB(), r = MB();
    bx(w, M([0, -1.7, 0], [1.6, .16, .8])); cyl(w, M([0, -.35, 0], [.14, 2.7, .14]), 8); bx(w, M([0, 1.05, 0], [3.4, .09, .12]));
    [-1.6, 1.6].forEach(function (x) {
      cyl(w, M([x, -.45, 0], [1.0, .07, 1.0]), 10);
      for (k = 0; k < 3; k++) { var a = k / 3 * 6.2831853 + .5; bar(w, [x, 1.0, 0], [x + Math.cos(a) * .48, -.42, Math.sin(a) * .48], .025); }
    });
    sph(r, M([0, 1.25, 0], [.34, .34, .34]), 8, 5);
    return [w, r];
  }
  function initLogoScales() {
    var cv = $('#logoScales'); if (!cv) return;
    var g = null; try { if (!/[?&]nogl\b/.test(location.search)) g = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true }); } catch (e) { g = null; }
    if (!g) { root.classList.add('mini-fail'); return; }
    try {
      var cs = function (t, s) { var o = g.createShader(t); g.shaderSource(o, s); g.compileShader(o); if (!g.getShaderParameter(o, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(o)); return o; };
      var p = g.createProgram(); g.attachShader(p, cs(g.VERTEX_SHADER, VS)); g.attachShader(p, cs(g.FRAGMENT_SHADER, FS)); g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p));
      var parts = scalesMBs().map(function (mb) {
        var o = { n: mb.T.length, nl: mb.L.length, p: g.createBuffer(), nb: g.createBuffer(), t: g.createBuffer(), l: g.createBuffer() };
        g.bindBuffer(g.ARRAY_BUFFER, o.p); g.bufferData(g.ARRAY_BUFFER, new Float32Array(mb.P), g.STATIC_DRAW);
        g.bindBuffer(g.ARRAY_BUFFER, o.nb); g.bufferData(g.ARRAY_BUFFER, new Float32Array(mb.N), g.STATIC_DRAW);
        g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, o.t); g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array(mb.T), g.STATIC_DRAW);
        g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, o.l); g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array(mb.L), g.STATIC_DRAW);
        return o;
      });
      var U = {}; ['uProj', 'uView', 'uModel', 'uCol', 'uFog', 'uAlpha', 'uLine'].forEach(function (n) { U[n] = g.getUniformLocation(p, n); });
      var aP = g.getAttribLocation(p, 'aPos'), aN = g.getAttribLocation(p, 'aNor');
      var Pm = new Float32Array(16), Vm = new Float32Array(16), Mm = new Float32Array(16), fog = new Float32Array([.078, .078, .078]), cols = [new Float32Array([.95, .95, .97]), new Float32Array([.99, .2, .24])];
      var render = function (ms) {
        var dpr = Math.min(devicePixelRatio || 1, 2), w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
        if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
        g.viewport(0, 0, w, h); g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
        g.enable(g.BLEND); g.blendFuncSeparate(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA, g.ONE, g.ONE_MINUS_SRC_ALPHA); g.disable(g.DEPTH_TEST);
        perspInto(Pm, .46, w / h, .5, 40); viewInto(Vm, 0, 9 * Math.sin(.14), 9 * Math.cos(.14), .14);
        modelInto(Mm, 0, .1, 0, 0, reduce ? 0 : (ms / 1000) * 6.2831853 / 22, .8, .8, .8); // constant angular speed, ~22 s per turn, linear
        g.useProgram(p); g.uniformMatrix4fv(U.uProj, false, Pm); g.uniformMatrix4fv(U.uView, false, Vm); g.uniformMatrix4fv(U.uModel, false, Mm); g.uniform3fv(U.uFog, fog);
        g.enableVertexAttribArray(aP); g.enableVertexAttribArray(aN);
        for (var k = 0; k < 2; k++) {
          var o = parts[k]; g.uniform3fv(U.uCol, cols[k]); g.uniform1f(U.uAlpha, k ? 3 : 2.4);
          g.bindBuffer(g.ARRAY_BUFFER, o.p); g.vertexAttribPointer(aP, 3, g.FLOAT, false, 0, 0); g.bindBuffer(g.ARRAY_BUFFER, o.nb); g.vertexAttribPointer(aN, 3, g.FLOAT, false, 0, 0);
          g.uniform1f(U.uLine, 0); g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, o.t); g.drawElements(g.TRIANGLES, o.n, g.UNSIGNED_SHORT, 0);
          g.uniform1f(U.uLine, 1); g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, o.l); g.drawElements(g.LINES, o.nl, g.UNSIGNED_SHORT, 0);
        }
      };
      var vis = true, loop = 0;
      var tick = function (ms) { loop = 0; render(ms); if (!reduce && vis && !doc.hidden) loop = requestAnimationFrame(tick); };
      var kick = function () { if (!loop) loop = requestAnimationFrame(tick); };
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) kick(); }).observe(cv);
      doc.addEventListener('visibilitychange', kick); addEventListener('resize', kick);
      if (/[?&]debug\b/.test(location.search)) window.__mini = render; // test hook
      kick();
    } catch (err) { if (window.console) console.warn('Logo scales disabled:', err.message); root.classList.add('mini-fail'); }
  }
  var COL_W = [.95, .93, .92], COL_R = [.87, .07, .11];
  function drawProp(S, gi, x, y, z, sx, sy, sz, col, alpha) {
    var g = S.geos[gi]; modelInto(MM, x, y, z, 0, 0, sx, sy, sz);
    gl.uniformMatrix4fv(S.u.model, false, MM); gl.uniform3fv(S.u.col, col); gl.uniform1f(S.u.alpha, alpha);
    gl.bindBuffer(gl.ARRAY_BUFFER, g.p); gl.vertexAttribPointer(S.a.pos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, g.nb); gl.vertexAttribPointer(S.a.nor, 3, gl.FLOAT, false, 0, 0);
    gl.uniform1f(S.u.line, 0); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g.t); gl.drawElements(gl.TRIANGLES, g.n, gl.UNSIGNED_SHORT, 0);
    gl.uniform1f(S.u.line, 1); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g.l); gl.drawElements(gl.LINES, g.nl, gl.UNSIGNED_SHORT, 0);
  }
  function drawFigures(S, tt) {
    updateFigures(tt);
    var w = F.w, k;
    // props live in the mesh program (already bound): stage + light beam, discussion tables, handshake glow
    if (w[2] > .02) { drawProp(S, 1, F.pf.x, F.pf.y, F.pf.z, 4.5, .19, 1.8, COL_W, 1.1 * w[2]); drawProp(S, 1, F.pf.x, F.pf.y + 4.5, F.pf.z, 2.2, 5.6, 1.7, COL_W, .16 * w[2]); }
    if (w[3] > .02) for (k = 0; k < F.nt; k++) drawProp(S, 1, F.tabs[k * 3], F.tabs[k * 3 + 1], F.tabs[k * 3 + 2], 1.1, .075, .62, COL_R, 1.3 * w[3]);
    if (w[4] > .02) drawProp(S, 0, F.orb.x, F.orb.y, F.orb.z, .26, .26, .26, COL_R, 2 * w[4]);
    // people
    var e = F.ext, a = F.a, u = F.u;
    gl.useProgram(F.prog); gl.uniformMatrix4fv(u.proj, false, P_); gl.uniformMatrix4fv(u.view, false, V_); gl.uniform3fv(u.fog, FOG); gl.uniform1f(u.alpha, 1 - (innerWidth < 760 ? .6 : .45) * w[0]);
    gl.enableVertexAttribArray(a.pos); gl.enableVertexAttribArray(a.nor); gl.enableVertexAttribArray(a.i0); gl.enableVertexAttribArray(a.i1);
    gl.bindBuffer(gl.ARRAY_BUFFER, F.ibuf);
    gl.vertexAttribPointer(a.i0, 4, gl.FLOAT, false, 32, 0); gl.vertexAttribPointer(a.i1, 4, gl.FLOAT, false, 32, 16);
    e.vertexAttribDivisorANGLE(a.i0, 1); e.vertexAttribDivisorANGLE(a.i1, 1);
    var gs = [F.body, F.ring];
    for (k = 0; k < 2; k++) {
      var g = gs[k]; gl.uniform1f(u.ring, k);
      gl.bindBuffer(gl.ARRAY_BUFFER, g.p); gl.vertexAttribPointer(a.pos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, g.n); gl.vertexAttribPointer(a.nor, 3, gl.FLOAT, false, 0, 0);
      e.drawArraysInstancedANGLE(gl.TRIANGLES, 0, g.c, F.N);
    }
    e.vertexAttribDivisorANGLE(a.i0, 0); e.vertexAttribDivisorANGLE(a.i1, 0);
    gl.disableVertexAttribArray(a.pos); gl.disableVertexAttribArray(a.nor); gl.disableVertexAttribArray(a.i0); gl.disableVertexAttribArray(a.i1);
    gl.useProgram(S.mesh);
  }

  function resize() {
    if (!gl) return;
    var dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.5 : 2);
    var w = Math.floor(innerWidth * dpr), h = Math.floor(innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  }

  var FOG = [.078, .078, .078];
  function draw(t) {
    var S = scene, w = canvas.width, h = canvas.height;
    gl.clearColor(FOG[0], FOG[1], FOG[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var camZ = 8 - cur * S.Z * 0.97, camX = Math.sin(cur * 7) * 1.1 + cmx * .8, camY = Math.cos(cur * 5) * .5 + cmy * .5;
    perspInto(P_, innerWidth < 760 ? 1.1 : .95, w / h, .1, 120); viewInto(V_, camX, camY, camZ, PITCH);
    var proj = P_, view = V_;
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
    // particles
    gl.useProgram(S.pts);
    gl.uniformMatrix4fv(S.pu.proj, false, proj); gl.uniformMatrix4fv(S.pu.view, false, view); gl.uniform1f(S.pu.size, (devicePixelRatio > 1.5 ? 1.5 : 1) * (w / 900 + 1.2));
    gl.bindBuffer(gl.ARRAY_BUFFER, S.pb); gl.enableVertexAttribArray(S.pa); gl.vertexAttribPointer(S.pa, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, S.pn); gl.disableVertexAttribArray(S.pa);
    // meshes
    gl.useProgram(S.mesh);
    gl.uniformMatrix4fv(S.u.proj, false, proj); gl.uniformMatrix4fv(S.u.view, false, view); gl.uniform3fv(S.u.fog, FOG);
    gl.enableVertexAttribArray(S.a.pos); gl.enableVertexAttribArray(S.a.nor);
    drawProps(S, camZ, reduce ? 0 : t * .001);
    drawQuads(S, camZ, reduce ? 0 : t * .001);
    if (F) drawFigures(S, reduce ? 0 : t * .001);
    gl.disableVertexAttribArray(S.a.pos); gl.disableVertexAttribArray(S.a.nor);
  }

  var running = false, raf = 0;
  function frame(t) {
    raf = 0;
    if (reduce) { cur = 0; } else {
      cur += (prog - cur) * .07; cmx += (mx - cmx) * .05; cmy += (my - cmy) * .05;
    }
    draw(t);
    if (!reduce && !doc.hidden) raf = requestAnimationFrame(frame);
  }
  function renderOnce() { if (scene && !raf) raf = requestAnimationFrame(frame); }

  if (/[?&]nogl\b/.test(location.search)) gl = null; // test hook: simulate missing WebGL
  if (gl) {
    try {
      initGL(); resize(); root.classList.add('webgl');
      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); root.classList.add('no-webgl'); }, false);
      addEventListener('resize', function () { resize(); layoutFigures(); readScroll(); renderOnce(); });
      addEventListener('load', function () { layoutFigures(); setTimeout(layoutFigures, 800); });
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layoutFigures);
      if (!reduce) {
        addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - .5; my = .5 - e.clientY / innerHeight; }, { passive: true });
        doc.addEventListener('visibilitychange', function () { if (!doc.hidden && !raf) raf = requestAnimationFrame(frame); });
      }
      renderOnce();
    } catch (err) {
      if (window.console) console.warn('WebGL scene disabled:', err.message);
      root.classList.add('no-webgl'); scene = null;
    }
  } else root.classList.add('no-webgl');

  initLogoScales();
  readScroll();
  addEventListener('scroll', function () { readScroll(); if (reduce) renderOnce(); }, { passive: true });
  addEventListener('resize', readScroll);
})();







