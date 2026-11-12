/* Motion layer for the brand poster pages (pairs with motion.css). No libraries.
   Works on any of the six pages: it watches #grid, so posters that are drawn after the images load get picked up too. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  var root = document.documentElement, grid = document.getElementById('grid');
  root.classList.add('pm');

  /* progress bar */
  var bar = document.createElement('div'); bar.className = 'pprog'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  function prog() { var h = root.scrollHeight - innerHeight; bar.style.setProperty('--sp', h > 0 ? Math.min(1, scrollY / h) : 0); }
  addEventListener('scroll', prog, { passive: true }); prog();

  /* title: words rise out of a mask */
  var h1 = document.querySelector('header h1');
  if (h1 && !h1.children.length) {
    var txt = h1.textContent.trim(); h1.setAttribute('aria-label', txt); h1.textContent = '';
    txt.split(/\s+/).forEach(function (w, i) { var o = document.createElement('span'), n = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true'); n.className = 'wi'; n.style.setProperty('--i', i); n.textContent = w; o.appendChild(n); h1.appendChild(o); h1.appendChild(document.createTextNode(' ')); });
    h1.classList.add('psplit');
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('ready'); }); });
  setTimeout(function () { root.classList.add('ready'); }, 500);   /* fallback if the tab was not painting yet */
  /* safety net: anything still hidden after a few seconds is simply shown */
  setTimeout(function sweep() { [].forEach.call(document.querySelectorAll('figure:not(.in), .fmt:not(.in)'), function (n) { if (n.getBoundingClientRect().top < innerHeight) n.classList.add('in'); }); setTimeout(sweep, 1500); }, 2500);

  /* posters and section titles arrive as they scroll into view */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .08, rootMargin: '0px 0px -5% 0px' }) : null;
  function watch(n) { if (io) io.observe(n); else n.classList.add('in'); }

  /* zoom view */
  var lb = null;
  function closeLB() { if (!lb) return; var box = lb, cv = box.querySelector('canvas'), from = box._from; lb = null; box.classList.remove('on'); var r = from.getBoundingClientRect(), r2 = cv.getBoundingClientRect(); var a = cv.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + (r.left + r.width / 2 - r2.left - r2.width / 2) + 'px,' + (r.top + r.height / 2 - r2.top - r2.height / 2) + 'px) scale(' + (r.width / r2.width) + ')', opacity: .6 }], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }); a.onfinish = function () { box.remove(); }; }
  function openLB(src, title) {
    if (lb) return; var sc = Math.min(innerWidth * .92 / src.width, innerHeight * .84 / src.height), w = Math.round(src.width * sc), h = Math.round(src.height * sc), dpr = Math.min(2, window.devicePixelRatio || 1);
    var box = document.createElement('div'), cv = document.createElement('canvas'), cap = document.createElement('p'); box.className = 'plb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', title + ', enlarged');
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + 'px'; cv.style.height = h + 'px'; var x = cv.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, cv.width, cv.height);
    cap.textContent = title + '  ·  click or press Esc to close'; box.appendChild(cv); box.appendChild(cap); document.body.appendChild(box); box._from = src; lb = box;
    var r = src.getBoundingClientRect(), r2 = cv.getBoundingClientRect();
    cv.animate([{ transform: 'translate(' + (r.left + r.width / 2 - r2.left - r2.width / 2) + 'px,' + (r.top + r.height / 2 - r2.top - r2.height / 2) + 'px) scale(' + (r.width / r2.width) + ')' }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
    requestAnimationFrame(function () { box.classList.add('on'); }); box.addEventListener('click', closeLB);
  }
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLB(); });
  addEventListener('scroll', function () { if (lb) closeLB(); }, { passive: true });

  function adopt(fig) {
    if (fig._pm) return; var cv = fig.querySelector('canvas'); if (!cv) return; fig._pm = 1;
    var kids = fig.parentNode ? [].slice.call(fig.parentNode.children).filter(function (n) { return n.tagName === 'FIGURE'; }) : [fig];
    fig.style.setProperty('--i', kids.indexOf(fig) % 3);
    var pv = document.createElement('div'), gl = document.createElement('i'), zm = document.createElement('span'), name = (fig.querySelector('figcaption b') || {}).textContent || 'Poster';
    pv.className = 'pv'; pv.tabIndex = 0; pv.setAttribute('role', 'button'); pv.setAttribute('aria-label', 'Enlarge ' + name); gl.className = 'gl'; zm.className = 'zm'; zm.textContent = 'Click to zoom';
    cv.parentNode.insertBefore(pv, cv); pv.appendChild(cv); pv.appendChild(gl); pv.appendChild(zm);
    pv.addEventListener('click', function () { openLB(cv, name); });
    pv.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(cv, name); } });
    if (fine) {
      var big = cv.width > 1300;   /* the A3 canvases are huge: lift only, no 3D tilt */
      pv.addEventListener('pointermove', function (e) { var r = pv.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; pv.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); pv.style.setProperty('--gy', (py * 100).toFixed(1) + '%'); pv.style.transform = big ? 'translateY(-6px)' : 'perspective(900px) rotateX(' + ((.5 - py) * 9).toFixed(2) + 'deg) rotateY(' + ((px - .5) * 11).toFixed(2) + 'deg) translateY(-6px) scale(1.02)'; });
      pv.addEventListener('pointerleave', function () { pv.style.transform = ''; });
    }
    watch(fig);
  }
  function scan(node) { if (node.nodeType !== 1) return; if (node.tagName === 'FIGURE') adopt(node); else { [].forEach.call(node.querySelectorAll ? node.querySelectorAll('figure') : [], adopt); } if (node.classList && node.classList.contains('fmt')) watch(node); [].forEach.call(node.querySelectorAll ? node.querySelectorAll('.fmt') : [], watch); }
  if (grid) {
    scan(grid);
    if ('MutationObserver' in window) new MutationObserver(function (ms) { ms.forEach(function (m) { [].forEach.call(m.addedNodes, scan); }); }).observe(grid, { childList: true, subtree: true });
    /* download buttons confirm with a little pop */
    grid.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('figcaption .btn'); if (!b || b._busy) return; b._busy = 1; var old = b.textContent; b.textContent = 'Saved ✓'; b.classList.add('ok'); setTimeout(function () { b.textContent = old; b.classList.remove('ok'); b._busy = 0; }, 1500); });
  }
})();
