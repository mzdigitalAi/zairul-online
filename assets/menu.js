/* Shared site menu for zairul.online.
   Every page loads this one file right after <body>. Edit MENU below to change the menu everywhere.
   It also runs the background music (Sound button) and keeps it playing from page to page. */
(function () {
  'use strict';

  var MENU = [
    { key: 'workflow', label: 'Workflow', href: '/workflow/' },
    { key: 'studio',   label: 'Studio',   href: '/studio/' },
    { key: 'videos',   label: 'AI Video', href: '/videos/' },
    { key: 'images',   label: 'AI Images', href: '/images/' },
    { key: 'audio',    label: 'AI Audio', href: '/audio/' },
    { key: 'ui-ux',    label: 'UI-UX',    href: '/ui-ux/' },
    { key: '3d',       label: 'AI 3D',    href: '/3d/' },
    { key: 'cast',     label: 'Cast',     href: '/cast/' },
    { key: 'magazine', label: 'Magazine', href: '/magazine/' },
    { key: 'resume',   label: 'Resume',   href: '/resume/' },
    { key: 'contact',  label: 'Contact',  href: '/contact/' }
  ];
  var MUSIC = '/assets/theme.mp3?v=2';
  var VOLUME = 0.4;

  var path = location.pathname.replace(/index\.html$/, '');
  var page = (path.split('/')[1] || 'home').toLowerCase();
  var isHome = page === 'home' || page === '';
  var isGallery = page === 'images' || page === 'videos' || page === 'audio';

  /* ---------- styles (self-contained so gallery pages need nothing else) ---------- */
  var css = [
    ':root{--zm-h:94px;--zm-red:#e3262b;--zm-gold:#f2b632;--zm-ink:#f2efe9}',
    '.zm-nav,.zm-nav *{box-sizing:border-box}',
    '.zm-nav{position:sticky;top:0;left:0;right:0;z-index:900;height:var(--zm-h);color:var(--zm-ink);font-family:Barlow,"Segoe UI",Arial,sans-serif;background:linear-gradient(to bottom,rgba(8,8,8,.94),rgba(8,8,8,.78));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.08)}',
    '.zm-home .zm-nav{position:fixed;background:linear-gradient(to bottom,rgba(8,8,8,.85),rgba(8,8,8,0));border-color:transparent}',
    '.zm-home .zm-nav.zm-solid{background:rgba(8,8,8,.9);border-color:rgba(255,255,255,.08)}',
    '.zm-row{display:flex;align-items:center;gap:10px;height:56px;padding:0 24px}',
    '.zm-logo{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none;margin-right:auto;min-width:0}',
    '.zm-logo img{width:30px;height:auto;display:block;filter:drop-shadow(0 0 6px rgba(255,255,255,.15))}',
    '.zm-logo b{font:400 19px/1 Anton,Impact,sans-serif;letter-spacing:.04em;white-space:nowrap}',
    '.zm-logo b span{color:var(--zm-gold)}',
    '.zm-pill{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 13px;border-radius:999px;font:700 11px/1 Barlow,"Segoe UI",sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;cursor:pointer;white-space:nowrap;border:1px solid rgba(242,182,50,.45);background:rgba(0,0,0,.35);color:var(--zm-gold);transition:border-color .2s,filter .2s,transform .15s}',
    '.zm-pill:hover{border-color:var(--zm-gold);transform:translateY(-1px)}',
    '.zm-pill.zm-hire{border:0;color:#140d00;background:linear-gradient(90deg,#f6c64a,#f2a12c)}',
    '.zm-pill.zm-hire:hover{filter:brightness(1.08)}',
    '.zm-eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px}',
    '.zm-eq i{display:block;width:2px;height:5px;background:currentColor;border-radius:1px}','.zm-eq i:nth-child(2){height:10px}','.zm-eq i:nth-child(3){height:7px}',
    '.zm-sound[aria-pressed=true] .zm-eq i{animation:zmEq .9s ease-in-out infinite}',
    '.zm-sound[aria-pressed=true] .zm-eq i:nth-child(2){animation-delay:.2s}',
    '.zm-sound[aria-pressed=true] .zm-eq i:nth-child(3){animation-delay:.4s}',
    '@keyframes zmEq{0%,100%{height:3px}50%{height:12px}}',
    '.zm-tabs{display:flex;gap:22px;height:38px;padding:0 24px;margin:0;list-style:none;overflow-x:auto;scrollbar-width:none;-webkit-mask-image:linear-gradient(90deg,#000 92%,transparent);mask-image:linear-gradient(90deg,#000 92%,transparent)}',
    '.zm-tabs::-webkit-scrollbar{display:none}',
    '.zm-tabs li{flex:none}',
    '.zm-tabs a{position:relative;display:flex;align-items:center;height:100%;color:#bdb8b0;text-decoration:none;font:700 11.5px/1 Barlow,"Segoe UI",sans-serif;letter-spacing:.16em;text-transform:uppercase;transition:color .2s}',
    '.zm-tabs a:hover{color:#fff}',
    '.zm-tabs a::after{content:"";position:absolute;left:0;right:0;bottom:6px;height:2px;background:var(--zm-gold);transform:scaleX(0);transform-origin:left;transition:transform .3s}',
    '.zm-tabs a.zm-on{color:#fff}',
    '.zm-tabs a.zm-on::after{transform:scaleX(1)}',
    '.zm-nav a:focus-visible,.zm-nav button:focus-visible{outline:2px solid var(--zm-gold);outline-offset:3px}',
    '.zm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '@media (max-width:640px){.zm-row{padding:0 14px;gap:8px}.zm-tabs{padding:0 14px;gap:18px}.zm-logo b{font-size:16px}.zm-sound .zm-label{display:none}.zm-pill{padding:0 11px}}',
    '@media (max-width:360px){.zm-logo b{display:none}}',
    /* gallery pages: keep their sticky sidebars below the menu */
    '.zm-gallery .sidebar{top:var(--zm-h)!important;height:calc(100dvh - var(--zm-h))!important}',
    '.zm-gallery-audio .sidebar{height:calc(100dvh - 108px - var(--zm-h))!important}',
    '.zm-gallery .shell{min-height:calc(100vh - var(--zm-h))}'
  ].join('\n');

  if (!document.querySelector('link[data-zm-fonts]')) {
    var pre = document.createElement('link'); pre.rel = 'preconnect'; pre.href = 'https://fonts.gstatic.com'; pre.crossOrigin = '';
    var fl = document.createElement('link'); fl.rel = 'stylesheet'; fl.setAttribute('data-zm-fonts', '');
    fl.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=Big+Shoulders+Stencil+Display:wght@800;900&display=swap';
    document.head.appendChild(pre); document.head.appendChild(fl);
  }
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var root = document.documentElement;
  if (isHome) root.classList.add('zm-home');
  if (isGallery) root.classList.add('zm-gallery', 'zm-gallery-' + page);

  /* ---------- markup ---------- */
  var tabs = MENU.map(function (m) {
    return '<li><a href="' + m.href + '" data-zm="' + m.key + '"' + (m.key === page ? ' class="zm-on" aria-current="page"' : '') + '>' + m.label + '</a></li>';
  }).join('');
  var nav = document.createElement('header');
  nav.className = 'zm-nav';
  nav.id = 'zm-nav';
  nav.innerHTML =
    '<div class="zm-row">' +
      '<a class="zm-logo" href="/" aria-label="Zairul MD TY, home"><img src="/assets/logo.png" alt="" width="30" height="38"><b>ZAIRUL <span>MD TY</span></b></a>' +
      '<button class="zm-pill zm-sound" type="button" aria-pressed="false" aria-label="Play background music"><span class="zm-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="zm-label">Sound</span></button>' +
      '<a class="zm-pill zm-hire" href="/contact/">Hire me</a>' +
    '</div>' +
    '<nav aria-label="Main"><ul class="zm-tabs">' + tabs + '</ul></nav>';

  var me = document.currentScript;
  if (me && me.parentNode === document.body) me.insertAdjacentElement('afterend', nav);
  else if (document.body) document.body.insertBefore(nav, document.body.firstChild);
  else document.addEventListener('DOMContentLoaded', function () { document.body.insertBefore(nav, document.body.firstChild); });

  // keep the current tab visible on narrow screens
  requestAnimationFrame(function () {
    var on = nav.querySelector('.zm-on');
    if (on && on.scrollIntoView) { var ul = on.closest('ul'); ul.scrollLeft = on.offsetLeft - 24; }
  });

  if (isHome) {
    var solid = function () { nav.classList.toggle('zm-solid', scrollY > 30 && root.classList.contains('flat')); };
    addEventListener('scroll', solid, { passive: true }); solid();
  }

  /* Home page calls ZM.setActive('videos') etc. while you scroll its panels */
  window.ZM = {
    setActive: function (key) {
      nav.querySelectorAll('.zm-tabs a').forEach(function (a) { a.classList.toggle('zm-on', a.getAttribute('data-zm') === key); });
    },
    nav: nav
  };

  /* ---------- background music ---------- */
  var btn = nav.querySelector('.zm-sound');
  var a = new Audio(MUSIC); a.loop = true; a.preload = 'none';
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  var pref = store.get('zz-sound');           // 'on' | 'off' | null
  var fadeId = 0;
  function fadeTo(vol, ms, done) {
    var from = a.volume, t0 = performance.now(), id = ++fadeId;
    (function step(now) {
      if (id !== fadeId) return;
      var k = Math.min(1, (now - t0) / ms);
      a.volume = Math.max(0, Math.min(1, from + (vol - from) * k));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  function show(on) {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Mute background music' : 'Play background music');
  }
  function play(fadeMs) {
    var t = parseFloat(store.get('zz-sound-t', true) || '0');
    if (t && !a.currentTime) { try { a.currentTime = t; } catch (e) {} }
    a.volume = 0;
    var q = a.play();
    show(true);
    if (q && q.then) q.then(function () { fadeTo(VOLUME, fadeMs || 1500); }).catch(function () { show(false); armFirstGesture(); });
    else fadeTo(VOLUME, fadeMs || 1500);
  }
  function stop() { fadeTo(0, 350, function () { a.pause(); }); show(false); }
  var armed = false;
  function armFirstGesture() {
    if (armed) return; armed = true;
    var go = function (e) {
      if (e && e.target && e.target.closest && e.target.closest('.zm-sound')) return;   // the button handles itself
      ['pointerdown', 'keydown', 'touchend'].forEach(function (n) { removeEventListener(n, go, true); });
      armed = false;
      if (a.paused && store.get('zz-sound') !== 'off' && !ducked) play();
    };
    ['pointerdown', 'keydown', 'touchend'].forEach(function (n) { addEventListener(n, go, true); });
  }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (a.paused || btn.getAttribute('aria-pressed') !== 'true') { store.set('zz-sound', 'on'); ducked = false; play(600); }
    else { store.set('zz-sound', 'off'); stop(); }
  });
  addEventListener('pagehide', function () {
    store.set('zz-sound-t', a.paused ? '0' : String(a.currentTime), true);
  });

  // Home: music starts with the first click/tap unless the visitor muted it before.
  // Other pages: music only continues if the visitor switched it on.
  if (pref === 'on') { play(1200); }
  else if (pref !== 'off' && isHome) { armFirstGesture(); }

  // Step aside when the page plays its own media (audio gallery, video player).
  var ducked = false;
  function duck() { if (!a.paused) { ducked = true; fadeTo(0, 300, function () { a.pause(); }); show(false); } }
  function unduck() { if (ducked && store.get('zz-sound') === 'on') { ducked = false; play(1200); } }
  document.addEventListener('play', function (e) {
    var el = e.target;
    if (el === a || el.muted) return;
    duck();
  }, true);
  document.addEventListener('pause', function (e) { var el = e.target; if (el !== a && !el.muted) setTimeout(function () {
    var playing = [].some.call(document.querySelectorAll('audio,video'), function (m) { return m !== a && !m.muted && !m.paused; });
    if (!playing) unduck();
  }, 400); }, true);
  // video gallery player is an iframe inside a <dialog>: pause while it is open
  if (window.MutationObserver) {
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        var d = m.target;
        if (d.tagName !== 'DIALOG' || !d.querySelector('iframe, #player')) return;
        if (d.open) duck(); else unduck();
      });
    }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['open'] });
  }
})();
