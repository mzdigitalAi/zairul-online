/* Nibou homepage sound: an original, upbeat background score plus effects for the animation transitions.
   Everything is synthesised live with the Web Audio API (no audio files, nothing to license).
   Browsers only allow sound after a click, so it starts off; the switch in the header turns it on and remembers the choice.

   The score: 104 bpm, I-vi-IV-V in a sunny major key. Marimba + soft flute lead, plucked arpeggio, warm pad,
   bouncy bass, kick, finger-snap and shaker. It changes with the page:
     - logo reveal: light (pad, lead, arpeggio, shaker), then a "drop" as you scroll into the brands (bass and drums come in);
     - each brand plays in its own key, switching on the next bar with a whoosh, a pop and a sparkle;
     - below the hero it settles into a slightly calmer mix.
   Effects: logo shimmer, brand whoosh, mascot boings and slide-whistles in time with the peek-a-boo,
   a ticking counter that slows with the 2,000,000 and lands on a chime, soft bells as section titles rise,
   and gentle mallet notes on hovering buttons. */
(function () {
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext, btn = document.getElementById('snd'), lbl = btn && btn.querySelector('.snd-lb');
  if (!btn) return;
  if (!AC) { btn.hidden = true; return; }
  var KEY = 'nibou-sound';
  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { } }

  var ctx = null, master, music, sfx, verbIn, noise, L = {}, on = false, timer = 0, step = 0, next = 0, key = 0, keyNext = 0;
  var state = { fin: true, inTrack: true }, BPM = 104, S16 = 60 / BPM / 4;
  var KEYS = [0, 2, -3, 5, 4, -2];   /* each brand's key, in semitones from C: Dadih C, Yourgurt D, Freshill A, Drinme F, Kid's Joy E, Bebee B-flat */

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function gain(v, to) { var g = ctx.createGain(); g.gain.value = v; if (to) g.connect(to); return g; }
  function out(dest, send) { var g = gain(1, dest); if (send) g.connect(gain(send, verbIn)); return g; }
  function impulse(sec, decay) { var n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate); for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay); } return b; }

  function build(context) {
    ctx = context;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = .006; comp.release.value = .22; comp.connect(ctx.destination);
    master = gain(0, comp);
    var verb = ctx.createConvolver(); verb.buffer = impulse(2.6, 2.4); verb.connect(gain(.3, master)); verbIn = gain(1, verb);
    music = gain(.3, master); sfx = gain(.9, master);   /* music at 50 % of the original mix; effects unchanged */
    ['lead', 'arp', 'pad', 'bass', 'kick', 'snap', 'shk'].forEach(function (k) { L[k] = gain(0, music); });
    var n = ctx.sampleRate * 2; noise = ctx.createBuffer(1, n, ctx.sampleRate); var d = noise.getChannelData(0); for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }

  /* ---------- instruments ---------- */
  function mallet(m, t, vel, dest, send, len) {
    len = len || .5; var f = mtof(m), o = out(dest, send), a = ctx.createOscillator(), b = ctx.createOscillator(), ga = gain(0, o), gb = gain(0, o);
    a.type = 'sine'; a.frequency.value = f; b.type = 'sine'; b.frequency.value = f * 3.98;
    ga.gain.setValueAtTime(0, t); ga.gain.linearRampToValueAtTime(vel, t + .004); ga.gain.exponentialRampToValueAtTime(.0001, t + len);
    gb.gain.setValueAtTime(0, t); gb.gain.linearRampToValueAtTime(vel * .4, t + .002); gb.gain.exponentialRampToValueAtTime(.0001, t + .09);
    a.connect(ga); b.connect(gb); a.start(t); b.start(t); a.stop(t + len + .05); b.stop(t + .12);
  }
  function lead(m, t, vel, len) {
    var f = mtof(m), o = out(L.lead, .35), osc = ctx.createOscillator(), oct = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = gain(0, o);
    osc.type = 'triangle'; osc.frequency.value = f; oct.type = 'sine'; oct.frequency.value = f * 2;
    lp.type = 'lowpass'; lp.frequency.value = 3600; lp.connect(g); osc.connect(lp); oct.connect(gain(.16, lp));
    var vib = ctx.createOscillator(), vg = gain(0, null); vib.frequency.value = 5.2; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * .006, t + .18); vib.connect(vg); vg.connect(osc.frequency);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + .012); g.gain.setTargetAtTime(vel * .55, t + .05, .12); g.gain.setTargetAtTime(0, t + len, .07);
    [osc, oct, vib].forEach(function (x) { x.start(t); x.stop(t + len + .5); });
  }
  function bass(m, t, len) {
    var o = out(L.bass, 0), a = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = gain(0, o), s = ctx.createOscillator(), g2 = gain(0, o);
    a.type = 'triangle'; a.frequency.value = mtof(m); lp.type = 'lowpass'; lp.frequency.value = 900; a.connect(lp); lp.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.4, t + .008); g.gain.setTargetAtTime(.0001, t + .03, len * .45);
    s.type = 'sine'; s.frequency.value = mtof(m - 12); s.connect(g2); g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(.3, t + .01); g2.gain.setTargetAtTime(.0001, t + .04, len * .5);
    a.start(t); s.start(t); a.stop(t + len + .4); s.stop(t + len + .4);
  }
  function pad(notes, t, len) {
    var o = out(L.pad, .5), lp = ctx.createBiquadFilter(), g = gain(0, o); lp.type = 'lowpass'; lp.Q.value = .7;
    lp.frequency.setValueAtTime(700, t); lp.frequency.linearRampToValueAtTime(1300, t + len * .5); lp.frequency.linearRampToValueAtTime(800, t + len); lp.connect(g);
    notes.forEach(function (m) { [-7, 7].forEach(function (c) { var x = ctx.createOscillator(); x.type = 'sawtooth'; x.frequency.value = mtof(m); x.detune.value = c; x.connect(lp); x.start(t); x.stop(t + len + 1.2); }); });
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.04, t + .35); g.gain.setValueAtTime(.04, t + len - .1); g.gain.linearRampToValueAtTime(0, t + len + 1);
  }
  function nz(t, dur, type, f, q, v, dest, send, f2) {
    var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = gain(0, out(dest, send)); s.buffer = noise;
    fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur); fl.Q.value = q;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0008, t + dur); s.connect(fl); fl.connect(g); s.start(t, Math.random() * 1.5); s.stop(t + dur + .02);
  }
  function kick(t, v) { var o = ctx.createOscillator(), g = gain(0, L.kick); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(46, t + .13); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g); o.start(t); o.stop(t + .32); }
  function snap(t) { nz(t, .14, 'bandpass', 1900, .9, .2, L.snap, .25); nz(t, .03, 'highpass', 4000, .5, .12, L.snap, 0); }
  function shaker(t, v) { nz(t, .045, 'highpass', 7200, .7, v, L.shk, 0); }

  /* ---------- the score (original): 8 bars, I-vi-IV-V then IV-V-vi-V; [three pad notes, bass root] ---------- */
  var CH = [[60, 64, 67, 48], [57, 60, 64, 45], [57, 60, 65, 41], [55, 59, 62, 43], [57, 60, 65, 41], [55, 59, 62, 43], [57, 60, 64, 45], [55, 59, 62, 43]];
  var MEL = [[76, 0, 79, 81, 0, 79, 76, 0], [72, 0, 76, 0, 74, 72, 69, 0], [69, 72, 0, 77, 76, 0, 72, 0], [74, 76, 0, 79, 0, 74, 71, 0],
    [77, 0, 76, 72, 0, 69, 72, 74], [71, 0, 74, 0, 79, 77, 76, 74], [76, 0, 81, 0, 79, 76, 72, 0], [74, 0, 79, 0, 0, 0, 71, 74]];
  function tick(s, t) {
    var bar = Math.floor(s / 16) % 8, i = s % 16, ch = CH[bar];
    if (i === 0) { key = keyNext; pad(ch.slice(0, 3).map(function (m) { return m + key; }), t, S16 * 16); }
    var k = key;
    if (i % 2 === 0) { var m = MEL[bar][i / 2]; if (m) { lead(m + k, t, .15, S16 * 1.7); mallet(m + k, t, .09, L.lead, .3, .45); } }
    if (i % 4 === 2) mallet(ch[(i >> 2) % 3] + k, t, .07, L.arp, .2, .3);
    if (i === 0 || i === 8) bass(ch[3] + k, t, S16 * 3); else if (i === 6) bass(ch[3] + 7 + k, t, S16 * 2); else if (i === 11) bass(ch[3] + k, t, S16 * 2); else if (i === 14) bass(ch[3] + 12 + k, t, S16 * 2);
    if (i === 0 || i === 8 || (i === 11 && bar % 2)) kick(t, i === 11 ? .32 : .5);
    if (i === 4 || i === 12) snap(t);
    shaker(t, i % 4 === 2 ? .07 : .035);
  }
  function pump() {
    if (next < ctx.currentTime - .05) next = ctx.currentTime + .05;   /* after the tab was hidden: skip ahead, don't burst */
    while (next < ctx.currentTime + .14) { tick(step, next + (step % 2 ? S16 * .14 : 0)); next += S16; step++; }
  }
  function startSeq() { if (timer) return; step = 0; next = ctx.currentTime + .1; timer = setInterval(pump, 25); pump(); }
  function stopSeq() { clearInterval(timer); timer = 0; }

  /* layers per part of the page */
  var EN = { logo: { kick: 0, snap: 0, shk: .55, bass: 0, pad: 1, lead: .9, arp: .75 }, brands: { kick: 1, snap: 1, shk: 1, bass: 1, pad: .85, lead: 1, arp: 1 }, page: { kick: .7, snap: .75, shk: .8, bass: .85, pad: .9, lead: .85, arp: .8 } };
  function energy() { return !state.inTrack ? 'page' : state.fin ? 'logo' : 'brands'; }
  function setEnergy(now) { if (!ctx) return; var x = EN[energy()]; for (var k in x) { if (now) L[k].gain.value = x[k]; else L[k].gain.setTargetAtTime(x[k], ctx.currentTime, .45); } }

  /* ---------- effects ---------- */
  function whoosh(t, dur, up, v) {
    var s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = gain(0, null), o = out(sfx, .35); s.buffer = noise; bp.type = 'bandpass'; bp.Q.value = 1.3;
    bp.frequency.setValueAtTime(up ? 320 : 2600, t); bp.frequency.exponentialRampToValueAtTime(up ? 2900 : 300, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + dur * .55); g.gain.exponentialRampToValueAtTime(.0008, t + dur); s.connect(bp); bp.connect(g);
    if (ctx.createStereoPanner) { var p = ctx.createStereoPanner(); p.pan.setValueAtTime(up ? -.7 : .7, t); p.pan.linearRampToValueAtTime(up ? .7 : -.7, t + dur); g.connect(p); p.connect(o); } else g.connect(o);
    s.start(t, Math.random()); s.stop(t + dur + .05);
  }
  function bell(m, t, v, len) {
    var f = mtof(m), o = out(sfx, .55);
    [[1, 1], [2.76, .32], [5.4, .1]].forEach(function (p) { var x = ctx.createOscillator(), g = gain(0, o); x.type = 'sine'; x.frequency.value = f * p[0]; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * p[1], t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + len / Math.sqrt(p[0])); x.connect(g); x.start(t); x.stop(t + len + .05); });
  }
  function sparkle(t, base, n, gapS, v) { var P = [0, 4, 7, 12, 16, 19, 24, 28]; for (var i = 0; i < n; i++) bell(base + P[i % P.length], t + i * gapS, v * (1 - i * .06), 1.4); }
  function pop(t, f, v) { var x = ctx.createOscillator(), g = gain(0, out(sfx, .15)); x.type = 'sine'; x.frequency.setValueAtTime(f, t); x.frequency.exponentialRampToValueAtTime(f * 2.3, t + .07); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0005, t + .13); x.connect(g); x.start(t); x.stop(t + .16); }
  function boing(t, f, v) {
    var x = ctx.createOscillator(), g = gain(0, out(sfx, .2)), lfo = ctx.createOscillator(), lg = gain(0, null);
    x.type = 'triangle'; x.frequency.setValueAtTime(f * .6, t); x.frequency.exponentialRampToValueAtTime(f * 1.5, t + .09); x.frequency.exponentialRampToValueAtTime(f, t + .5);
    lfo.frequency.value = 16; lg.gain.setValueAtTime(f * .12, t); lg.gain.exponentialRampToValueAtTime(1, t + .5); lfo.connect(lg); lg.connect(x.frequency);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0005, t + .55); x.connect(g);
    [x, lfo].forEach(function (n) { n.start(t); n.stop(t + .6); });
  }
  function slide(t, f0, f1, dur, v) {
    var x = ctx.createOscillator(), g = gain(0, out(sfx, .3)), lfo = ctx.createOscillator(), lg = gain(f0 * .02, null);
    x.type = 'sine'; x.frequency.setValueAtTime(f0, t); x.frequency.exponentialRampToValueAtTime(f1, t + dur); lfo.frequency.value = 6; lfo.connect(lg); lg.connect(x.frequency);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + dur * .2); g.gain.setValueAtTime(v, t + dur * .8); g.gain.linearRampToValueAtTime(0, t + dur); x.connect(g);
    [x, lfo].forEach(function (n) { n.start(t); n.stop(t + dur + .05); });
  }
  function click(t, v) { var x = ctx.createOscillator(), g = gain(0, sfx); x.type = 'sine'; x.frequency.value = 2400; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0005, t + .018); x.connect(g); x.start(t); x.stop(t + .03); }
  function drop(t) { var x = ctx.createOscillator(), g = gain(0, out(sfx, .2)); x.type = 'sine'; x.frequency.setValueAtTime(110, t); x.frequency.exponentialRampToValueAtTime(40, t + .35); g.gain.setValueAtTime(.55, t); g.gain.exponentialRampToValueAtTime(.001, t + .5); x.connect(g); x.start(t); x.stop(t + .55); whoosh(t - .35, .45, true, .3); }

  var PENTA = [0, 2, 4, 7, 9];
  function note(base, n) { return base + key + PENTA[n % 5] + 12 * Math.floor(n / 5); }
  var lastFx = {};
  function ok(name, gapMs) { var now = performance.now(); if (lastFx[name] && now - lastFx[name] < gapMs) return false; lastFx[name] = now; return true; }

  /* ---------- page events ---------- */
  document.addEventListener('brandchange', function (e) {
    var i = e.detail && e.detail.i; if (typeof i === 'number') keyNext = KEYS[i] || 0;
    if (!on || !ok('brand', 220)) return; var t = ctx.currentTime;
    whoosh(t, .5, true, .3); pop(t + .27, 520, .16); sparkle(t + .3, 72 + (KEYS[i] || 0), 3, .06, .05);
  });
  document.addEventListener('heroscroll', function (e) {
    var fin = !!(e.detail && e.detail.fin); if (fin === state.fin) return; state.fin = fin;
    if (fin) keyNext = 0;
    if (!on) return; setEnergy(); var t = ctx.currentTime;
    if (fin && ok('logo', 800)) { whoosh(t, .7, false, .18); sparkle(t + .12, 79, 6, .07, .07); }
    if (!fin && ok('drop', 800)) drop(t + .05);
  });
  var trk = document.getElementById('track');
  if (trk && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { state.inTrack = es[0].isIntersecting; if (on) setEnergy(); }, { threshold: 0 }).observe(trk);

  /* mascots: sounds in time with the 12 s peek-a-boo loop (Bobo pops at 6 %, Nini at 36 %, both rise slowly from 62 % to 74 % and sink at 90 %) */
  var pk = [], heroEl = document.getElementById('hero');
  function peekCycle() {
    pk.forEach(clearTimeout); pk = []; var C = 12000;
    function at(f, fn) { pk.push(setTimeout(function () { if (on && heroEl && heroEl.classList.contains('fin') && state.inTrack && !document.hidden) fn(ctx.currentTime); }, f * C)); }
    at(.06, function (t) { boing(t, 330, .2); });
    at(.36, function (t) { boing(t, 440, .2); });
    at(.62, function (t) { slide(t, 300, 640, 1.4, .07); });
    at(.90, function (t) { slide(t, 560, 260, .7, .05); });
  }
  document.addEventListener('animationstart', function (e) { if (e.animationName === 'peekBoy') peekCycle(); });
  document.addEventListener('animationiteration', function (e) { if (e.animationName === 'peekBoy') peekCycle(); });

  /* the 2,000,000 counter: ticks that slow down with the number (it eases as 1 - 2^-10t over 2.8 s), then a chime */
  var feat = document.querySelector('.feat');
  if (feat && 'MutationObserver' in window) {
    var was = '';
    new MutationObserver(function () {
      var c = feat.className; if (c === was) return; var counting = /\bcounting\b/.test(c) && !/\bcounting\b/.test(was), counted = /\bcounted\b/.test(c) && !/\bcounted\b/.test(was); was = c;
      if (!on) return; var t = ctx.currentTime;
      if (counting) for (var k = 1; k < 34; k++) { var tt = -Math.log(1 - k / 34) / Math.LN2 / 10 * 2.8; if (tt < 2.75) click(t + tt, .05); }
      if (counted) { bell(84 + key, t, .1, 2.2); sparkle(t + .1, 84 + key, 4, .05, .05); }
    }).observe(feat, { attributes: true, attributeFilter: ['class'] });
  }
  /* section titles: a soft bell as each one rises in */
  if ('MutationObserver' in window) {
    var heads = [].slice.call(document.querySelectorAll('main h2')), seenH = new WeakSet(), hn = 0;
    var mo = new MutationObserver(function (ms) { ms.forEach(function (m) { var h = m.target; if (seenH.has(h) || !h.classList.contains('in')) return; seenH.add(h); if (on && ok('head', 300)) { var t = ctx.currentTime; bell(note(72, hn++ % 7), t, .05, 1.6); bell(note(72, (hn + 2) % 7), t + .09, .035, 1.6); } }); });
    heads.forEach(function (h) { mo.observe(h, { attributes: true, attributeFilter: ['class'] }); });
  }
  /* buttons, brand dots and cards: a soft mallet note on hover, a pop on press */
  var hov = null, hn2 = 0;
  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest && e.target.closest('.btn,.dot,.nav nav a,.bcard,.store,.cats .lk'); if (el === hov) return; hov = el;
    if (!el || !on || el === btn || !ok('hover', 70)) return; mallet(note(79, hn2++ % 6), ctx.currentTime, .045, sfx, .25, .35);
  });
  document.addEventListener('pointerdown', function (e) { var el = e.target.closest && e.target.closest('.btn,.dot,.bcard,.tile'); if (el && on && el !== btn) pop(ctx.currentTime, 600, .12); });

  /* ---------- the switch ---------- */
  function setUI(v, waiting) {
    btn.setAttribute('aria-checked', v ? 'true' : 'false'); btn.classList.toggle('on', v); btn.classList.toggle('wait', !!waiting);
    if (lbl) lbl.textContent = waiting ? 'Tap for sound' : v ? 'Sound on' : 'Sound off'; btn.title = v ? 'Turn sound off' : 'Turn sound on';
  }
  function turnOn() {
    if (!ctx) build(new AC({ latencyHint: 'interactive' }));
    if (ctx.resume) ctx.resume();
    on = true; setUI(true); save('on'); setEnergy(true);
    master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.setTargetAtTime(.9, ctx.currentTime, .45);
    startSeq(); var t = ctx.currentTime + .03; mallet(72, t, .2, sfx, .3, .4); mallet(79, t + .09, .2, sfx, .3, .5); sparkle(t + .18, 84, 3, .05, .05);
  }
  function turnOff() {
    on = false; setUI(false); save('off'); if (!ctx) return; var t = ctx.currentTime;
    mallet(79, t, .12, sfx, .2, .3); mallet(72, t + .08, .12, sfx, .2, .4);
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.setTargetAtTime(0, t + .15, .25);
    setTimeout(function () { if (!on) { stopSeq(); if (ctx.suspend) ctx.suspend(); } }, 1500);
  }
  btn.addEventListener('click', function () { if (on) turnOff(); else turnOn(); });
  document.addEventListener('visibilitychange', function () { if (!ctx) return; if (document.hidden) { if (ctx.suspend) ctx.suspend(); } else if (on && ctx.resume) ctx.resume(); });

  /* remembered "on": browsers need a click or key press first, so wait for one */
  var pref = load();
  if (pref === 'on') {
    setUI(true, true);
    var arm = function (e) { if (btn.contains(e.target)) return; ['pointerdown', 'keydown', 'touchend'].forEach(function (n) { document.removeEventListener(n, arm, true); }); if (!on) turnOn(); };
    ['pointerdown', 'keydown', 'touchend'].forEach(function (n) { document.addEventListener(n, arm, true); });
  } else {
    setUI(false); if (pref === null) btn.classList.add('hint');
    btn.addEventListener('click', function () { btn.classList.remove('hint'); }, { once: true });
  }

  /* for testing: render a few seconds of the score offline and report the levels */
  window.NibouSound = {
    state: function () { return { on: on, running: !!ctx && ctx.state, energy: energy(), key: key, step: step }; },
    renderTest: function (sec, part) {
      var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext, live = { ctx: ctx, master: master, music: music, sfx: sfx, verbIn: verbIn, noise: noise, L: L, key: key, keyNext: keyNext };
      var off = new OAC(2, Math.ceil(44100 * sec), 44100); L = {}; build(off); master.gain.value = .9;
      var s0 = state.fin, s1 = state.inTrack; state.fin = part === 'logo'; state.inTrack = part !== 'page'; setEnergy(true); key = keyNext = 0;
      var t = 0, s = 0; while (t < sec - .2) { tick(s, t + (s % 2 ? S16 * .14 : 0)); t += S16; s++; }
      whoosh(1, .5, true, .3); boing(2, 330, .2); sparkle(2.5, 79, 6, .07, .07);
      state.fin = s0; state.inTrack = s1;
      return off.startRendering().then(function (buf) {
        var d = buf.getChannelData(0), peak = 0, sum = 0; for (var i = 0; i < d.length; i++) { var a = Math.abs(d[i]); if (a > peak) peak = a; sum += d[i] * d[i]; }
        ctx = live.ctx; master = live.master; music = live.music; sfx = live.sfx; verbIn = live.verbIn; noise = live.noise; L = live.L; key = live.key; keyNext = live.keyNext;
        return { seconds: sec, notes: s, peak: +peak.toFixed(3), rmsDb: +(10 * Math.log10(sum / d.length)).toFixed(1) };
      });
    }
  };
})();
