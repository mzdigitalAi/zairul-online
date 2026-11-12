/* zairul.online homepage: scroll engine, portrait film, live gallery data and the chapter widgets. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var SITE = '';
  $('#yr').textContent = new Date().getFullYear();

  // ---------- wordmark: always spans the hero's width ----------
  var wm = $('#wordmark');
  function fitWordmark() {
    var hero = wm.parentNode, pad = parseFloat(getComputedStyle(hero).paddingLeft) || 0;
    wm.style.fontSize = '100px';
    var w = wm.offsetWidth || 1;
    wm.style.fontSize = Math.min(100 * (hero.clientWidth - pad * 2) / w, innerHeight * 0.36).toFixed(1) + 'px';
  }

  // ---------- scroll engine ----------
  var nav = $('#nav'), gal = $('#galleries');
  var chapters = $$('.chapter').map(function (el) { return { el: el, on: false, seen: false }; });
  var navLinks = $$('.work-menu a, .sheet a');
  var sy = 0, vh = innerHeight, maxS = 1, endY = 1, dock = 0, currentId = null;
  function measure() { vh = innerHeight; maxS = Math.max(1, root.scrollHeight - vh); endY = Math.max(1, gal.offsetTop); fitWordmark(); }
  function setVar(el, k, v) { var c = el.__v || (el.__v = {}); if (c[k] !== v) { c[k] = v; el.style.setProperty(k, v); } }

  function frame() {
    sy = window.scrollY;
    var dT = reduce ? 0 : clamp((sy - vh * 0.04) / (vh * 0.52));
    dock += (dT - dock) * 0.16; if (Math.abs(dT - dock) < 0.0015) dock = dT;
    setVar(root, '--d', dock.toFixed(4));
    setVar(root, '--prog', clamp(sy / maxS).toFixed(4));
    setVar(root, '--end', clamp((vh - gal.getBoundingClientRect().top) / (vh * 0.5)).toFixed(3));
    nav.classList.toggle('solid', sy > vh * 0.6);

    var cur = '';
    for (var i = 0; i < chapters.length; i++) {
      var c = chapters[i], r = c.el.getBoundingClientRect();
      var e = reduce ? 1 : easeOut(clamp((vh - r.top) / vh));
      setVar(c.el, '--e', e.toFixed(4));
      setVar(c.el, '--p', clamp(-r.top / Math.max(1, r.height - vh)).toFixed(4));
      if (!c.seen && e > 0.55) { c.seen = true; c.el.classList.add('in'); }
      var on = r.top < vh * 0.6 && r.bottom > vh * 0.4;
      if (on !== c.on) { c.on = on; c.el.classList.toggle('on', on); c.el.dispatchEvent(new CustomEvent('chapter', { detail: on })); }
      if (on) cur = c.el.id;
    }
    if (cur !== currentId) { currentId = cur; navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur); }); }
    scrub();
    requestAnimationFrame(frame);
  }

  // ---------- portrait film: the opening plays by itself, then scroll takes over ----------
  var film = $('#film'), INTRO = 7.4, dur = 10, cur = 0, mode = 'wait';
  function scrub() {
    if (mode === 'intro') {
      if (sy > 30) { film.pause(); cur = film.currentTime; mode = 'scrub'; }
      else if (film.currentTime >= INTRO) { film.pause(); cur = INTRO; mode = 'scrub'; }
      return;
    }
    if (mode !== 'scrub') return;
    var target = INTRO + clamp(sy / endY) * (dur - INTRO - 0.05);
    cur += (target - cur) * 0.12; if (Math.abs(cur - target) < 0.004) cur = target;
    if (!film.seeking && Math.abs(film.currentTime - cur) > 0.02) film.currentTime = cur;
  }
  if (!reduce && film.canPlayType && film.canPlayType('video/mp4') && window.fetch) {
    var src = matchMedia('(max-aspect-ratio: 1/1)').matches ? '/assets/hero-phone.mp4?v=5' : '/assets/hero-desktop.mp4?v=5';
    fetch(src).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) {   // whole clip in memory, so scrubbing never waits on the network
      film.src = URL.createObjectURL(b);
      film.addEventListener('loadedmetadata', function () { dur = film.duration || dur; }, { once: true });
      film.addEventListener('canplay', function () {
        root.classList.add('film');
        if (window.scrollY > 30) { mode = 'scrub'; cur = INTRO; film.currentTime = INTRO; }
        else { mode = 'intro'; var q = film.play(); if (q && q.catch) q.catch(function () { mode = 'scrub'; cur = INTRO; }); }
      }, { once: true });
      film.load();
    }).catch(function () {});
  }

  // ---------- menu ----------
  var work = $('#work'), workBtn = $('#workBtn'), burger = $('#burger'), sheet = $('#sheet');
  function setWork(o) { work.classList.toggle('open', o); workBtn.setAttribute('aria-expanded', o); }
  workBtn.addEventListener('click', function () { setWork(!work.classList.contains('open')); });
  document.addEventListener('click', function (e) { if (!work.contains(e.target)) setWork(false); });
  work.addEventListener('click', function (e) { if (e.target.closest('a')) { setWork(false); document.activeElement && document.activeElement.blur(); } });
  function setSheet(o) { sheet.hidden = !o; burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }
  burger.addEventListener('click', function () { setSheet(sheet.hidden); });
  sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });

  // ---------- live content from the gallery database (same source as the live site) ----------
  var B = 'https://nyqgaipudjvdyhuicqsd.supabase.co', K = 'sb_publishable_fm9R_RaKK0GSPBOOF6eQlA_NF8_8_Bj';
  var H = { apikey: K, Authorization: 'Bearer ' + K };
  function rest(q, extra) { return fetch(B + '/rest/v1/' + q, { headers: Object.assign({}, H, extra || {}) }); }
  function rows(q) { return rest(q).then(function (r) { if (!r.ok) throw r.status; return r.json(); }); }
  function count(t) {
    return rest(t + '?select=id&published=eq.true', { Prefer: 'count=exact', Range: '0-0' })
      .then(function (r) { var m = (r.headers.get('content-range') || '').match(/\/(\d+)/); return m ? +m[1] : null; }).catch(function () { return null; });
  }
  function sign(bucket, paths) {
    return fetch(B + '/storage/v1/object/sign/' + bucket, { method: 'POST', headers: Object.assign({ 'content-type': 'application/json' }, H), body: JSON.stringify({ expiresIn: 3600, paths: paths }) })
      .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .then(function (list) { return list.map(function (x) { return x && x.signedURL ? B + '/storage/v1' + x.signedURL : ''; }); });
  }
  function bg(el, url) { if (el && url) el.style.backgroundImage = 'url("' + String(url).replace(/"/g, '%22') + '")'; }

  Promise.all([count('gallery_videos'), count('gallery_images'), count('gallery_audio')]).then(function (c) {
    var parts = [];
    if (c[0]) parts.push('<b>' + c[0] + '</b> AI films');
    if (c[1]) parts.push('<b>' + c[1] + '</b> AI images');
    if (c[2]) parts.push('<b>' + c[2] + '</b> tracks');
    if (parts.length) $('#stats').innerHTML = parts.join(' · ');
    if (c[0]) { $('#vCount').textContent = c[0] + ' films · Full AI and real footage + AI'; $('#tVideoN').textContent = c[0] + ' films'; }
    if (c[1]) { $('#iCount').textContent = c[1] + ' images · Prompts included'; $('#tVisualN').textContent = c[1] + ' images'; }
    if (c[2]) { $('#aCount').textContent = c[2] + ' tracks · Made in Suno'; $('#tAudioN').textContent = c[2] + ' tracks'; }
  });

  // ---------- 01 AI video ----------
  var films = [], filmIdx = 0, swapT = 0;
  function ytId(u) { var m = /(?:youtu\.be\/|[?&]v=|shorts\/|embed\/|live\/)([\w-]{11})/.exec(u || ''); return m ? m[1] : ''; }
  function bestThumb(f, cb) {
    var id = ytId(f.source_url), low = f.thumbnail_data || (id ? 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg' : '/assets/img/thumb-ai-video.webp');
    if (!id) return cb(low);
    var im = new Image();
    im.onload = function () { cb(im.naturalWidth > 320 ? im.src : low); };
    im.onerror = function () { cb(low); };
    im.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
  }
  function showFilm(i) {
    filmIdx = i; var f = films[i];
    $('#vTitle').textContent = f.title || 'Untitled film';
    $('#vMeta').textContent = [f.category, f.role].filter(Boolean).join(' · ');
    $$('#vStrip button').forEach(function (b, k) { b.setAttribute('aria-pressed', k === i); });
    bestThumb(f, function (url) {
      var a = $('#vStill'), b = $('#vStill2');
      bg(b, url); b.classList.add('show');
      clearTimeout(swapT);
      swapT = setTimeout(function () { bg(a, url); b.classList.remove('show'); }, 950);
      if (i === 0) bg($('#tVideo'), url);
    });
  }
  rows('gallery_videos?select=title,category,role,thumbnail_data,source_url&published=eq.true&order=featured.desc,created_at.desc&limit=4').then(function (v) {
    if (!v.length) return;
    films = v;
    var strip = $('#vStrip');
    v.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'listitem'); b.setAttribute('aria-label', 'Show ' + (f.title || 'film ' + (i + 1))); b.title = f.title || '';
      bg(b, f.thumbnail_data || (ytId(f.source_url) ? 'https://i.ytimg.com/vi/' + ytId(f.source_url) + '/hqdefault.jpg' : ''));
      b.addEventListener('click', function () { showFilm(i); });
      strip.appendChild(b);
    });
    showFilm(0);
  }).catch(function () {});

  var lb = $('#lb'), lbFrame = $('#lbFrame'), lbBack = null;
  function closeLb() { if (lb.open) lb.close(); }
  lb.addEventListener('close', function () { lbFrame.src = 'about:blank'; if (lbBack) lbBack.focus(); });   // a real <dialog>, so the shared menu pauses the music while a film plays
  $('#vPlay').addEventListener('click', function () {
    var f = films[filmIdx], id = f && ytId(f.source_url);
    if (!id) { window.open((f && f.source_url) || SITE + '/videos/', '_blank', 'noopener'); return; }
    lbBack = this; lbFrame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'; lb.showModal(); $('#lbX').focus();
  });
  $('#lbX').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeLb(); setWork(false); setSheet(false); } });

  // ---------- 02 AI visual: drifting wall ----------
  function buildWall(urls) {
    var wall = $('#wall'), cols = 5, per = 4; wall.textContent = '';
    for (var c = 0; c < cols; c++) {
      var col = document.createElement('div'); col.className = 'col';
      for (var pass = 0; pass < 2; pass++) for (var k = 0; k < per; k++) {   // each column holds its set twice, so the drift loops without a seam
        var it = document.createElement('i'); bg(it, urls[(c * per + k) % urls.length]); col.appendChild(it);
      }
      wall.appendChild(col);
    }
  }
  buildWall(['/assets/img/thumb-ai-images.webp']);
  rows('gallery_images?select=title,thumbnail_path&published=eq.true&order=featured.desc,created_at.desc&limit=20').then(function (im) {
    var paths = im.map(function (x) { return x.thumbnail_path; }).filter(Boolean);
    if (!paths.length) return;
    return sign('gallery', paths).then(function (urls) { urls = urls.filter(Boolean); if (urls.length) { buildWall(urls); bg($('#tVisual'), urls[0]); } });
  }).catch(function () {});

  // ---------- 03 AI audio ----------
  (function () {
    var wave = $('#wave'), n = 72, html = '';
    for (var i = 0; i < n; i++) {
      var env = 0.35 + 0.65 * Math.abs(Math.sin(i / n * Math.PI * 2.3 + 0.6)) * (0.55 + 0.45 * Math.sin(i * 1.7));
      html += '<i style="--h:' + Math.round(22 + clamp(env) * 78) + ';--t:' + (0.55 + (i * 37 % 10) / 11).toFixed(2) + 's;--dl:-' + ((i * 53 % 17) / 10).toFixed(2) + 's"></i>';
    }
    wave.innerHTML = html;
  })();
  var player = $('#player'), tracksEl = $('#tracks'), audioCh = $('#ai-audio'), playingBtn = null;
  function stopAudio() { player.pause(); if (playingBtn) playingBtn.setAttribute('aria-pressed', 'false'); playingBtn = null; audioCh.classList.remove('playing'); }
  player.addEventListener('ended', stopAudio);
  audioCh.addEventListener('chapter', function (e) { if (!e.detail) stopAudio(); });
  rows('gallery_audio?select=title,artist,artwork_path,audio_path&published=eq.true&order=featured.desc,sort_order.asc,created_at.desc&limit=8').then(function (au) {
    if (!au.length) return;
    au.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'trk'; b.setAttribute('role', 'listitem'); b.setAttribute('aria-pressed', 'false');
      var art = document.createElement('span'); art.className = 'art';
      var ti = document.createElement('b'); ti.textContent = t.title || 'Untitled track';
      var ar = document.createElement('small'); ar.textContent = t.artist || '';
      b.appendChild(art); b.appendChild(ti); b.appendChild(ar);
      b.setAttribute('aria-label', 'Play ' + (t.title || 'track'));
      t.art = art;
      b.addEventListener('click', function () {
        if (playingBtn === b) return stopAudio();
        stopAudio();
        if (!t.audio_path) { window.open(SITE + '/audio/', '_blank', 'noopener'); return; }
        playingBtn = b; b.setAttribute('aria-pressed', 'true');
        sign('audio-gallery', [t.audio_path]).then(function (u) {
          if (playingBtn !== b || !u[0]) throw 0;
          player.src = u[0];
          return player.play().then(function () { audioCh.classList.add('playing'); $('#aHint').textContent = 'Now playing: ' + (t.title || 'track'); });
        }).catch(function () { if (playingBtn === b) { stopAudio(); $('#aHint').textContent = 'That track could not be played here. Open the full gallery to listen.'; } });
      });
      tracksEl.appendChild(b);
    });
    var withArt = au.filter(function (t) { return t.artwork_path; });
    if (!withArt.length) return;
    return sign('audio-gallery', withArt.map(function (t) { return t.artwork_path; })).then(function (urls) {
      withArt.forEach(function (t, i) { bg(t.art, urls[i]); });
      if (urls[0]) bg($('#tAudio'), urls[0]);
    });
  }).catch(function () {});

  // ---------- 04 UI-UX ----------
  var UX = {
    pl: { label: 'PL Fitness' },                                   // phone: a screen recording of the app
    meca: { label: 'MECA 3D', img: '/ui-ux/img/meca2-hero.jpg' },
    premier: { label: 'PREMIER Database dashboard', img: '/ui-ux/img/premier-dashboard-1.jpg' },
    nibou: { label: 'Nibou homepage concept', img: '/ui-ux/img/nibou-hero.jpg' }
  };
  var uxKeys = Object.keys(UX), uxIdx = 0, uxAuto = 0, uxCh = $('#ui-ux'), uxVid = $('#uxVid'), uxOn = false, uxSwap = 0;
  function uxShow(i) {
    uxIdx = i; var k = uxKeys[i], d = UX[k];
    $$('#uxTabs button').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-k') === k); });
    uxCh.querySelector('.devices').classList.toggle('pl', k === 'pl');
    if (d.img) {
      var a = $('#uxImg'), b = $('#uxImg2');
      $('#uxUrl').textContent = d.label;
      if (a.getAttribute('src') !== d.img) {
        b.src = d.img; b.classList.add('show'); clearTimeout(uxSwap);
        uxSwap = setTimeout(function () { a.src = d.img; a.alt = d.label + ' screen'; b.classList.remove('show'); }, 850);
      }
    }
    if (uxOn) { var q = uxVid.play(); if (q && q.catch) q.catch(function () {}); } else uxVid.pause();
  }
  function uxCycle(o) { clearInterval(uxAuto); if (o && !reduce) uxAuto = setInterval(function () { uxShow((uxIdx + 1) % uxKeys.length); }, 4600); }
  $('#uxTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; uxCycle(false); uxAuto = -1; uxShow(uxKeys.indexOf(b.getAttribute('data-k'))); });
  uxCh.addEventListener('chapter', function (e) { uxOn = e.detail; if (uxAuto !== -1) uxCycle(uxOn); uxShow(uxIdx); });

  // ---------- 05 AI 3D: the viewer loads only when its chapter is near ----------
  var mv = $('#mv');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en, ob) {
      if (!en[0].isIntersecting) return;
      ob.disconnect();
      var s = document.createElement('script'); s.type = 'module'; s.src = '/assets/vendor/model-viewer-3.5.0.min.js';   // the site's own copy; falls back to the public CDN if it is ever missing
      s.onerror = function () { var f = document.createElement('script'); f.type = 'module'; f.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js'; document.head.appendChild(f); };
      document.head.appendChild(s);
      mv.addEventListener('load', function () { mv.parentNode.classList.add('live'); });
      mv.setAttribute('src', '/assets/3d/zairul-bust.glb?v=7');
    }, { rootMargin: '120% 0px' }).observe($('#ai-3d'));
  }
  $('#mvExp').addEventListener('input', function () { mv.setAttribute('exposure', this.value); $('#mvExpV').textContent = (+this.value).toFixed(2); });
  $('#mvSpin').addEventListener('click', function () {
    var o = this.getAttribute('aria-pressed') !== 'true';
    this.setAttribute('aria-pressed', o); this.textContent = o ? 'Turntable on' : 'Turntable off';
    if (o) mv.setAttribute('auto-rotate', ''); else mv.removeAttribute('auto-rotate');
  });
  $('#mvReset').addEventListener('click', function () {
    mv.setAttribute('camera-orbit', '-10deg 84deg auto');
    if (mv.resetTurntableRotation) mv.resetTurntableRotation();
    if (mv.jumpCameraToGoal) mv.jumpCameraToGoal();
  });

  // ---------- 06 editorial: the spread leans toward the pointer ----------
  var mag = $('#mag'), edit = $('#editorial');
  if (!reduce) edit.addEventListener('pointermove', function (e) {
    mag.style.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
    mag.style.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
  });

  // ---------- gallery tiles rise in as they arrive ----------
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('seen'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.tile').forEach(function (t) { io.observe(t); });
  } else $$('.tile').forEach(function (t) { t.classList.add('seen'); });

  // ---------- sound: the homepage's own button drives the shared menu's music player ----------
  var snd = $('#snd'), zmSnd = window.ZM && ZM.nav && ZM.nav.querySelector('.zm-sound');
  if (snd && zmSnd) {
    var sndChanged = 0;
    var sndSync = function () { var on = zmSnd.getAttribute('aria-pressed') === 'true'; snd.setAttribute('aria-pressed', on); snd.setAttribute('aria-label', on ? 'Mute background music' : 'Play background music'); sndChanged = performance.now(); };
    snd.hidden = false; sndSync(); sndChanged = 0;
    new MutationObserver(sndSync).observe(zmSnd, { attributes: true, attributeFilter: ['aria-pressed'] });
    snd.addEventListener('click', function (e) {
      e.stopPropagation();
      // the shared menu starts the music on a visitor's first tap anywhere; if this very tap just did that, do not switch it straight off again
      if (zmSnd.getAttribute('aria-pressed') === 'true' && performance.now() - sndChanged < 700) return;
      zmSnd.click();
    });
  }

  // ---------- links to the old homepage sections still land in the right place ----------
  var OLD = { '#ai-images': '#ai-visual', '#magazine': '#editorial', '#workflow': '#process' };
  if (OLD[location.hash]) { var oldT = $(OLD[location.hash]); if (oldT) addEventListener('load', function () { oldT.scrollIntoView({ behavior: 'instant' }); }); }

  // ---------- start ----------
  addEventListener('resize', measure);
  addEventListener('load', measure);
  measure();
  var ready = function () { measure(); root.classList.add('ready'); };
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(ready); setTimeout(ready, 1500); } else ready();
  requestAnimationFrame(frame);
})();
