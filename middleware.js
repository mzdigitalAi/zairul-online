/*
  Art Studio login (Vercel Routing Middleware, runs on the server before any file is sent).
  The username and password are NOT in this file. Set them in Vercel:
    Project > Settings > Environment Variables
      STUDIO_USER = the login name (an email works)
      STUDIO_PASS = the password
  then redeploy. Until both are set the studio stays open, and /art-studio/__auth/ reports "configured": false.
  Changing STUDIO_PASS signs everyone out.
*/
export const config = { matcher: ['/art-studio', '/art-studio/:path*'] };

const COOKIE = 'zas_session';
const DAYS = 30;
const enc = new TextEncoder();

function b64url(buf) {
  let s = '';
  const b = new Uint8Array(buf);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function hmac(keyText, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(keyText), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}
function same(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function readCookie(req, name) {
  const h = req.headers.get('cookie') || '';
  const m = h.split(/;\s*/).find((c) => c.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : '';
}
async function validSession(req, user, pass) {
  const v = readCookie(req, COOKIE);
  const dot = v.indexOf('.');
  if (dot < 1) return false;
  const exp = Number(v.slice(0, dot));
  if (!exp || exp < Date.now() / 1000) return false;
  return same(v.slice(dot + 1), await hmac(user + '\n' + pass, 'zas|' + exp));
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function safeNext(n) {
  return typeof n === 'string' && /^\/art-studio(\/|$)/.test(n) && !/^\/art-studio\/(login|logout|__auth)/.test(n) && !n.includes('//') ? n : '/art-studio/';
}
const NOSTORE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'X-Frame-Options': 'SAMEORIGIN' };

function page(next, msg, status) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sign in · Zairul AI Art Studio</title><meta name="robots" content="noindex"><meta name="theme-color" content="#0b0806">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
<style>
:root{color-scheme:dark;--ink:#fbf4e8;--mut:#cdbda7;--dim:#93826d;--amb:#ffb648;--line:rgba(255,226,180,.16)}
*{box-sizing:border-box;margin:0}
body{min-height:100vh;display:grid;place-items:center;padding:24px 16px;font:400 16px/1.5 'Plus Jakarta Sans',system-ui,sans-serif;color:var(--ink);
background:radial-gradient(90% 70% at 80% -10%,#4a2a12 0%,#1a110a 45%,#0b0806 100%)}
.card{width:min(420px,100%);padding:36px 30px 30px;border-radius:28px;border:1px solid var(--line);background:linear-gradient(160deg,rgba(255,236,206,.08),rgba(255,236,206,.02)),rgba(22,15,10,.72);
box-shadow:inset 0 1px 0 rgba(255,236,206,.2),0 40px 80px -30px #000;backdrop-filter:blur(20px)}
.mark{width:30px;height:30px;border-radius:50%;background:conic-gradient(from 210deg,#ffe2a8,#e8642a,#7a3410,#ffb648,#ffe2a8);position:relative;margin-bottom:22px}
.mark::after{content:"";position:absolute;inset:8px;border-radius:50%;background:#150e09}
small{font:700 11px/1 'Plus Jakarta Sans',sans-serif;letter-spacing:.28em;text-transform:uppercase;color:var(--amb)}
h1{font:500 34px/1.05 Fraunces,Georgia,serif;margin:10px 0 8px}h1 i{font-weight:400;color:#ffc87a}
p{color:var(--mut);font-size:14.5px;margin-bottom:22px}
label{display:block;font-size:13px;font-weight:600;color:var(--mut);margin:14px 0 6px}
input[type=text],input[type=password]{width:100%;min-height:48px;padding:0 14px;border-radius:14px;border:1px solid rgba(255,226,180,.28);background:rgba(8,5,3,.6);color:var(--ink);font:inherit}
input:focus{outline:2px solid var(--amb);border-color:var(--amb)}
.keep{display:flex;align-items:center;gap:10px;margin:16px 0 20px;font-size:14px;color:var(--mut)}.keep input{width:18px;height:18px;accent-color:#ffb648}
button{width:100%;min-height:50px;border:0;border-radius:99px;cursor:pointer;font:800 15px 'Plus Jakarta Sans',sans-serif;color:#221203;background:linear-gradient(120deg,#ffe2a8,#ffb648 45%,#f08a35);box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 14px 30px -12px rgba(255,150,50,.8)}
.err{margin:0 0 16px;padding:10px 14px;border-radius:12px;background:rgba(192,57,43,.18);border:1px solid rgba(255,120,100,.45);color:#ffd2c8;font-size:14px}
.ok{margin:0 0 16px;padding:10px 14px;border-radius:12px;background:rgba(255,182,72,.12);border:1px solid rgba(255,182,72,.4);color:#ffe2a8;font-size:14px}
.foot{margin-top:18px;text-align:center;font-size:12.5px;color:var(--dim)}.foot a{color:var(--mut)}
</style></head><body>
<form class="card" method="post" action="/art-studio/login/" autocomplete="on">
<div class="mark" aria-hidden="true"></div>
<small>AI Art Studio</small>
<h1>Members <i>only</i></h1>
<p>This studio is for authorised people. Sign in to continue.</p>
${msg ? msg : ''}
<input type="hidden" name="next" value="${esc(next)}">
<label for="u">Username</label><input id="u" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus>
<label for="p">Password</label><input id="p" name="password" type="password" autocomplete="current-password" required>
<label class="keep"><input type="checkbox" name="keep" value="1" checked> Keep me signed in on this device for ${DAYS} days</label>
<button type="submit">Sign in</button>
<div class="foot"><a href="/">Back to zairul.online</a></div>
</form></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...NOSTORE } });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const USER = (process.env.STUDIO_USER || '').trim().toLowerCase();
  const PASS = process.env.STUDIO_PASS || '';
  const configured = !!(USER && PASS);

  if (path === '/art-studio/__auth') {
    const signedIn = configured ? await validSession(request, USER, PASS) : false;
    return new Response(JSON.stringify({ configured, signedIn }), { headers: { 'Content-Type': 'application/json', ...NOSTORE } });
  }
  if (!configured) return; // login not switched on yet: serve the studio as before

  if (path === '/art-studio/logout') {
    return new Response(null, { status: 303, headers: { Location: '/art-studio/login/?out=1', 'Set-Cookie': `${COOKIE}=; Path=/art-studio; Max-Age=0; HttpOnly; Secure; SameSite=Lax`, ...NOSTORE } });
  }
  if (path === '/art-studio/login') {
    if (request.method === 'POST') {
      let form;
      try { form = await request.formData(); } catch (e) { form = new FormData(); }
      const u = String(form.get('username') || '').trim().toLowerCase();
      const p = String(form.get('password') || '');
      const next = safeNext(String(form.get('next') || ''));
      const key = USER + '\n' + PASS;
      const okUser = same(await hmac(key, 'u|' + u), await hmac(key, 'u|' + USER));
      const okPass = same(await hmac(key, 'p|' + p), await hmac(key, 'p|' + PASS));
      if (!(okUser && okPass)) {
        await new Promise((r) => setTimeout(r, 900));
        return page(next, '<div class="err" role="alert">That username and password do not match. Try again.</div>', 401);
      }
      const keep = form.get('keep') === '1';
      const exp = Math.floor(Date.now() / 1000) + (keep ? DAYS * 86400 : 12 * 3600);
      const val = exp + '.' + (await hmac(key, 'zas|' + exp));
      return new Response(null, { status: 303, headers: { Location: next, 'Set-Cookie': `${COOKIE}=${encodeURIComponent(val)}; Path=/art-studio; ${keep ? 'Max-Age=' + DAYS * 86400 + '; ' : ''}HttpOnly; Secure; SameSite=Lax`, ...NOSTORE } });
    }
    if (await validSession(request, USER, PASS)) return new Response(null, { status: 303, headers: { Location: safeNext(url.searchParams.get('next') || ''), ...NOSTORE } });
    return page(safeNext(url.searchParams.get('next') || ''), url.searchParams.get('out') ? '<div class="ok" role="status">You are signed out.</div>' : '', 200);
  }
  if (await validSession(request, USER, PASS)) return; // signed in: serve the file
  const isPage = request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html');
  if (isPage) return page(safeNext(url.pathname + url.search), '', 401);
  return new Response('Sign in at /art-studio/login/', { status: 401, headers: { 'Content-Type': 'text/plain', ...NOSTORE } });
}
