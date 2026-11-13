/* PL Fitness – vanilla JS single-page app, based on the Figma fitness UI kit */
(function () {
  'use strict';
  const $app = document.getElementById('app');
  // Trainer close-ups for the Workout Today banner. Put each photo in assets/trainers/ and set the real name here.
  // Missing files are skipped automatically.
  const TRAINER_FACES = [
    { file: 't1.jpeg', name: 'Zairul' },
    { file: 't2.jpeg', name: 'Preet', women: true },   // women: true = also shown on the "Workouts for Women" banner
    { file: 't3.jpeg', name: 'MJ' },
    { file: 't4.jpeg', name: 'Sar', women: true }
  ];
  const LS = {
    get(k, d) { try { const v = localStorage.getItem('plf.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('plf.' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const state = {
    user: LS.get('user', null),            // {name,email}
    profile: LS.get('profile', { gender: '', age: 25, height: 170, weight: 70 }),
    plan: LS.get('plan', 'Yearly'),
    premium: LS.get('premium', false),
    done: LS.get('done', {}),              // exercise ids done
    sets: LS.get('sets', {}),              // exercise settings overrides
    tab: 'home'
  };

  /* ---------- backend (Supabase). Falls back to local demo mode when config.js is empty ---------- */
  const CFG = window.PLF_CONFIG || {};
  const sb = (CFG.url && CFG.key && window.supabase) ? window.supabase.createClient(CFG.url, CFG.key) : null;
  let pushTimer = null;
  function pushState() {
    if (!sb || !state.user || !state.user.id) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      sb.from('app_state').upsert({ user_id: state.user.id, profile: state.profile, done: state.done, sets: state.sets, plan: state.plan, updated_at: new Date().toISOString() })
        .then(r => { if (r.error) console.warn('sync failed', r.error.message); });
    }, 600);
  }
  async function pullState() {
    if (!sb || !state.user) return;
    const r = await sb.from('app_state').select('*').eq('user_id', state.user.id).maybeSingle();
    if (r.data) {
      state.profile = r.data.profile || state.profile; state.done = r.data.done || {}; state.sets = r.data.sets || {}; state.plan = r.data.plan || state.plan;
      LS.set('profile', state.profile); LS.set('done', state.done); LS.set('sets', state.sets);
    } else { pushState(); }
  }
  const _set = LS.set; LS.set = (k, v) => { _set(k, v); if (['profile', 'done', 'sets', 'plan'].includes(k)) pushState(); };
  function userFrom(u) { return { id: u.id, email: u.email, name: (u.user_metadata && u.user_metadata.name) || u.email.split('@')[0] }; }

  /* ---------- data ---------- */
  const EX = [
    { id: 'e1', name: 'Elliptical Machine', img: 'medball', dur: '5 min', sets: 1, reps: 0, time: 5, rest: 0 },
    { id: 'e2', name: 'Dumbbell Squat', img: 'squat', dur: '3 sets', sets: 3, reps: 12, time: 0, rest: 45 },
    { id: 'e3', name: 'Barbell Step Ups', img: 'dips', dur: '3 sets', sets: 3, reps: 10, time: 0, rest: 45 },
    { id: 'e4', name: 'Dumbbell Calf Raises', img: 'curl', dur: '4 sets', sets: 4, reps: 15, time: 0, rest: 30 },
    { id: 'e5', name: 'Barbell Front Raise', img: 'press', dur: '3 sets', sets: 3, reps: 10, time: 0, rest: 60 },
    { id: 'e6', name: 'Jumping Rope', img: 'rope', dur: '2 min', sets: 3, reps: 0, time: 2, rest: 30 }
  ];
  const PROGRAMS = [
    { t: '14 Day Weight Lifting', by: 'Aarron Ramsdale', img: 'press' },
    { t: '7 Minutes Body Weight', by: 'Marsal', img: 'dips' },
    { t: 'Strategic Routine Online', by: 'Martina Azraif', img: 'squat' },
    { t: 'Training for Amateur', by: 'Martina Azraif', img: 'curl' }
  ];
  const FEEDS = [
    { t: '5 advantages of gym exercise', c: 'Health', e: '💪', bg: '#2a3318' },
    { t: 'Benefits of yoga with a partner', c: 'Fitness', e: '🧘', bg: '#1d2b44' },
    { t: 'Healthy and nutritious food', c: 'Nutrition', e: '🥗', bg: '#3b3213' }
  ];
  // each day of the week has its own color (used on the plan list and the activity chart)
  const DAYCOL = { MON: '#c6ff3d', TUE: '#4dabff', WED: '#ffd84d', THU: '#ff9f43', FRI: '#ff6fae', SAT: '#b18cff', SUN: '#ff6b5e' };
  const WEEK = [
    { k: 'MON', t: 'Legs and Shoulder', ex: 9, m: 50, lv: 'Low' },
    { k: 'TUE', t: 'Cardio and Core', ex: 6, m: 35, lv: 'Low' },
    { k: 'WED', t: 'Chest and Triceps', ex: 9, m: 50, lv: 'Medium' },
    { k: 'THU', t: 'Mobility and Stretch', ex: 6, m: 30, lv: 'Easy' },
    { k: 'FRI', t: 'Back, Biceps and Abs', ex: 8, m: 45, lv: 'Medium' },
    { k: 'SAT', t: 'Full Body HIIT', ex: 7, m: 40, lv: 'High' },
    { k: 'SUN', t: 'Rest and Recovery', ex: 3, m: 20, lv: 'Easy' }
  ];
  const ex = id => { const b = EX.find(e => e.id === id); return Object.assign({}, b, state.sets[id] || {}); };

  /* ---------- icons ---------- */
  const I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
    workout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/></svg>',
    act: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>'
  };

  /* exercise icons (stroke icons, drawn to match the app's line style) */
  const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    e1: svg('<circle cx="7" cy="16" r="4"/><circle cx="7" cy="16" r="1"/><path d="M7 12l4-8h3M11 4l5 10v6M10 20h8"/><path d="M14 4h4"/>'),                       // elliptical machine
    e2: svg('<circle cx="12" cy="4" r="1.8"/><path d="M12 6v4l-4 2 2 4v4M12 10l4 2-2 4v4"/><path d="M3 8h18M5 6v4M19 6v4"/>'),                                       // dumbbell squat
    e3: svg('<path d="M3 21h5v-5h5v-5h5V6h3"/><circle cx="8" cy="8" r="1.6"/><path d="M8 10v3M5 11h6"/>'),                                                          // step ups
    e4: svg('<path d="M9 21c0-4 1-6 3-8s3-4 3-8"/><path d="M6 21h12M9 8l3-3 3 3"/><path d="M5 14h3M16 14h3"/>'),                                                     // calf raises
    e5: svg('<path d="M2 14h20M5 11v6M8 12v4M16 12v4M19 11v6"/><path d="M12 10V3M9 6l3-3 3 3"/>'),                                                                  // front raise
    e6: svg('<path d="M7 9V3M17 9V3"/><path d="M7 9c-4 0-3 12 5 12s9-12 5-12"/><circle cx="12" cy="9" r="0"/>')                                                      // jump rope
  };

  /* ---------- helpers ---------- */
  function toast(msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; $app.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  }
  function go(route) { location.hash = route; }
  // greeting name: first word of the display name, skipping titles such as "Mister" or "Dr"
  function firstName() {
    const parts = ((state.user && state.user.name) || '').trim().split(/\s+/).filter(Boolean);
    const titles = ['mister', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'miss', 'dr', 'dr.', 'sir', 'madam'];
    while (parts.length > 1 && titles.includes(parts[0].toLowerCase())) parts.shift();
    return parts[0] || 'User';
  }
  // profile photo, or the first letter of the name when no photo has been added
  function avatarHTML(cls) {
    const ph = state.profile && state.profile.photo;
    if (ph) return `<img class="avatar ${cls}" src="${ph}" alt="Your photo">`;
    return `<span class="avatar ph ${cls}" aria-hidden="true">${esc(firstName().charAt(0).toUpperCase())}</span>`;
  }
  // shrink a chosen photo to a 320px square JPEG so it is cheap to store and sync
  function readPhoto(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = 320;
        c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 320, 320);
        URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('bad image')); };
      img.src = url;
    });
  }
  function logoImg(cls) { return `<img class="logo ${cls || ''}" src="assets/logo.png" alt="PL Fitness logo">`; }
  const back = (to) => `<button class="icon-btn back" data-go="${to}" aria-label="Back">‹</button>`;
  function nav() {
    const tabs = [['home', 'Home', I.home, '#home'], ['workout', 'Workout', I.workout, '#workout'], ['act', 'Activities', I.act, '#activities'], ['user', 'Account', I.user, '#profile']];
    return `<nav class="nav">${tabs.map(t => `<button class="${state.tab === t[0] ? 'on' : ''}" data-go="${t[3]}">${t[2]}<span>${t[1]}</span></button>`).join('')}</nav>`;
  }
  function shell(tab, html) { state.tab = tab; return `<div class="screen">${html}</div>${nav()}`; }

  /* ---------- screens ---------- */
  const S = {};

  S.splash = () => {
    setTimeout(() => { if (location.hash === '#splash' || !location.hash) go(state.user ? '#home' : '#onboarding'); }, 1600);
    return `<div class="screen"><div class="center">${logoImg('xl')}<p>Train smart. Live strong.</p></div></div>`;
  };

  /* painted athlete portraits, picked at random on every load; the first onboarding slide always shows the main one (art1) */
  const ART = [1, 2, 3, 4, 5].map(n => 'assets/art/art' + n + '.jpg'), ART_POS = '50% 28%';
  const artSeed = Math.floor(Math.random() * ART.length);
  const artAt = k => ART[(artSeed + k) % ART.length];
  const LINES = ['Push one more rep', 'Earn today', 'Strong is a habit', 'Sweat now, shine later', 'Make it count', 'Pull your weight'];
  const lineAt = k => LINES[(artSeed * 2 + k) % LINES.length];
  const artHero = (k, cls) => `<div class="hero photo art ${cls || ''}"><img src="${artAt(k)}" style="object-position:${ART_POS}" alt="Painted portrait of an athlete training" loading="lazy"><div class="cap"><span class="tag">Motivation</span><h3>${lineAt(k)}</h3></div></div>`;
  const SLIDES = [
    { t: 'Workouts made for you', p: 'Discover training programs for every goal and level.', src: ART[0], pos: ART_POS },
    { t: 'Build your own routine', p: 'Create custom workouts and edit every set, rep and rest.', src: ART[1 + artSeed % 4], pos: ART_POS },
    { t: 'Track every step', p: 'Follow your calories, workout length and heart rate daily.', src: ART[1 + (artSeed + 1) % 4], pos: ART_POS }
  ];
  let slide = 0;
  S.onboarding = () => {
    const s = SLIDES[slide];
    return `<div class="screen"><div class="row between"><div class="row">${logoImg('sm')}<b>PL Fitness</b></div><button class="sub" data-go="#login">Skip</button></div>
    <div class="hero photo mt24"><img src="${s.src}" style="object-position:${s.pos}" alt="Painted portrait of an athlete training with a battle rope"></div>
    <div class="dots mt24">${SLIDES.map((_, i) => `<i class="${i === slide ? 'on' : ''}"></i>`).join('')}</div>
    <h1 class="mt16" style="text-align:center">${s.t}</h1><p class="mt12" style="text-align:center">${s.p}</p>
    <button class="btn mt24" data-act="next-slide">${slide === SLIDES.length - 1 ? 'Get Started' : 'Next'}</button></div>`;
  };

  let authMode = 'login';
  S.login = () => `<div class="screen">
    <div class="center" style="min-height:auto;margin:10px 0 18px">${logoImg()}<h1>${authMode === 'login' ? 'Welcome back' : 'Create account'}</h1><p>${authMode === 'login' ? 'Sign in to continue your training' : 'Join PL Fitness and start today'}</p></div>
    <form id="auth" novalidate>
      ${authMode === 'signup' ? '<label class="field"><span>Full name</span><input name="name" autocomplete="name" placeholder="Your name"></label>' : ''}
      <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" placeholder="you@email.com"></label>
      <label class="field"><span>Password</span><input name="pw" type="password" autocomplete="${authMode === 'login' ? 'current-password' : 'new-password'}" placeholder="At least 6 characters"></label>
      <div class="err" id="err"></div>
      <button class="btn mt8" type="submit">${authMode === 'login' ? 'Log In' : 'Sign Up'}</button>
    </form>
    <p class="mt16" style="text-align:center">${authMode === 'login' ? "Don't have an account?" : 'Already a member?'} <button class="green" data-act="toggle-auth"><b>${authMode === 'login' ? 'Sign Up' : 'Log In'}</b></button></p></div>`;

  let q = 0;
  S.questions = () => {
    const p = state.profile;
    const step = ['<h1>What is your gender?</h1><p class="mt8">This helps us personalise your program.</p>' +
      ['Male', 'Female', 'Other'].map(g => `<button class="opt ${p.gender === g ? 'on' : ''}" data-act="gender" data-v="${g}">${g}<span>${p.gender === g ? '✔' : ''}</span></button>`).join(''),
      '<h1>How old are you?</h1><div class="big"><span id="v">' + p.age + '</span> <small>years</small></div><input type="range" min="12" max="90" value="' + p.age + '" data-range="age">',
      '<h1>How tall are you?</h1><div class="big"><span id="v">' + p.height + '</span> <small>Centimeter</small></div><input type="range" min="120" max="220" value="' + p.height + '" data-range="height">',
      '<h1>What is your weight?</h1><div class="big"><span id="v">' + p.weight + '</span> <small>Kilogram</small></div><input type="range" min="30" max="200" value="' + p.weight + '" data-range="weight">'][q];
    return `<div class="screen"><div class="row between">${q ? '<button class="icon-btn" data-act="q-back">‹</button>' : '<span></span>'}<span class="sub">Question ${q + 1}/4</span></div>
    <div class="steps mt16">${[0, 1, 2, 3].map(i => `<i class="${i <= q ? 'on' : ''}"></i>`).join('')}</div>${step}
    <button class="btn mt24" data-act="q-next">${q === 3 ? 'Start Now' : 'Next'}</button></div>`;
  };

  S.home = () => {
    const done = Object.keys(state.done).length, pct = Math.round(done / EX.length * 100);
    const name = firstName();
    return shell('home', `
    <div class="row between"><div class="row"><button class="avbtn" data-go="#profile" aria-label="Open profile">${avatarHTML('sm')}</button><div><p>Welcome back</p><h2>Hello, ${esc(name)}!</h2></div></div><button class="icon-btn" data-act="notify" aria-label="Notifications">🔔</button></div>
    <div class="banner mt16"><h2>Workout Today</h2><p>Let's achieve your target today</p><button class="btn sm" data-go="#detail">Start Now</button><div class="faces" aria-hidden="true"><img class="f0 on" src="assets/intro2.jpg" alt="" loading="eager">${TRAINER_FACES.map((t, i) => `<img data-name="${t.name}" src="assets/trainers/${t.file}" alt="" loading="eager" onerror="this.remove()">`).join('')}<span class="ftag"></span></div></div>
    ${artHero(0, 'mt16')}
    <div class="row between mt24"><h3>Activity Summary</h3><span class="pill">Today</span></div>
    <div class="grid2 mt12">
      <div class="stat y"><div class="ring" style="--p:${pct}" data-l="${pct}%"></div><p>Progress</p><b>${done}/${EX.length}</b><p>exercises</p></div>
      <div class="stat"><p>Steps</p><b>6,420</b><p>Last 7 days avg 5,980</p></div>
      <div class="stat g"><p>Calories</p><b>445 <small style="font-size:14px">Kcal</small></b><p>Goal 600</p></div>
      <div class="stat b"><p>Heart rate</p><b>78 <small style="font-size:14px">bpm</small></b><p>Resting</p></div>
    </div>
    <div class="row between mt24"><h3>My Feed</h3><button class="green sub" data-go="#feed-0">See all</button></div>
    <div class="chips">${['News Feed', 'Health', 'Nutrition', 'Fitness'].map((c, i) => `<button class="chip ${i ? '' : 'on'}" data-act="chip">${c}</button>`).join('')}</div>
    ${FEEDS.map((f, i) => `<button class="list-item" data-go="#feed-${i}"><div class="thumb art"><img src="${artAt(i + 1)}" alt=""></div><div class="grow"><span class="tag">${f.c}</span><h3 class="mt8" style="font-size:15px">${f.t}</h3></div></button>`).join('')}`);
  };

  S.feed = (i) => {
    const f = FEEDS[+i] || FEEDS[0];
    const others = FEEDS.map((x, k) => [x, k]).filter(x => x[1] !== +i);
    return `<div class="screen">${back('#home')}
      <div class="feed-img art" style="height:210px"><img src="${artAt(+i + 2)}" style="object-position:${ART_POS}" alt="Painted portrait of an athlete training"></div>
      <span class="tag mt16">${f.c}</span><h1 class="mt8">${f.t}</h1>
      <p class="mt12">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel varius dui, vitae porttitor ante. Cras varius condimentum finibus. Mauris eget faucibus augue. Fusce nec consequat urna.</p>
      <p class="mt12">Phasellus mattis, nisl et accumsan lobortis, justo tortor dapibus lorem, in blandit arcu ligula mattis dolor. Fusce nec cursus magna, vitae porttitor diam. Aliquam erat volutpat.</p>
      <h3 class="mt24">Other Feeds</h3>
      ${others.map(([x, k]) => `<button class="list-item" data-go="#feed-${k}"><div class="thumb art"><img src="${artAt(k + 3)}" alt=""></div><div class="grow"><h3 style="font-size:15px">${x.t}</h3><p>Lorem ipsum dolor sit amet, consectetur.</p></div></button>`).join('')}</div>`;
  };

  S.workout = () => shell('workout', `
    <div class="row between"><h1>Discover</h1><button class="icon-btn" data-go="#phases" aria-label="Phases">📅</button></div>
    <label class="search">🔍<input placeholder="Search workouts" id="q"></label>
    <div class="banner mt16"><h2>Workouts for Women</h2><p>Perfect workouts for the female audience. Focus on muscle definition and fat reduction</p><button class="btn sm" data-go="#detail">See Workouts</button><div class="faces" aria-hidden="true"><img class="f0 on" src="assets/curl.png" alt="" style="object-fit:contain">${TRAINER_FACES.filter(t => t.women).map(t => `<img data-name="${t.name}" src="assets/trainers/${t.file}" alt="" loading="eager" onerror="this.remove()">`).join('')}<span class="ftag"></span></div></div>
    ${artHero(1, 'mt16 sm')}
    <div class="row between mt24"><h3>Workout Category</h3></div>
    <div class="chips">${['All', 'Strength', 'Cardio', 'Dance', 'Hypertrophy'].map((c, i) => `<button class="chip ${i ? '' : 'on'}" data-act="chip">${c}</button>`).join('')}</div>
    <div class="row between mt24"><div><h3>Training Program</h3><p>Lorem ipsum dolor sit amet</p></div><button class="btn sm" data-go="#detail" style="background:var(--card);color:var(--green)">Create +</button></div>
    <div id="plist">${PROGRAMS.map(p => `<button class="list-item" data-go="#detail" data-name="${esc(p.t.toLowerCase())}"><div class="thumb"><img src="assets/${p.img}.png" alt=""></div><div class="grow"><h3 style="font-size:15px">${p.t}</h3><p>With ${p.by}</p></div><span class="green">›</span></button>`).join('')}</div>`);

  S.phases = () => `<div class="screen">${back('#workout')}<h1>Workout Phases</h1><p class="mt8">Lose Weight – Balanced · 4 Weeks</p>
    ${[['Resistance', 'Phase 1 · Progress 25%', 25], ['Strength', 'Phase 2', 0], ['Hypertrophy', 'Phase 3', 0]].map(p => `<div class="card mt12"><div class="row between"><h3>${p[0]}</h3><span class="pill">${p[1]}</span></div><div style="height:8px;border-radius:4px;background:var(--card2);margin-top:12px"><div style="width:${p[2]}%;height:100%;border-radius:4px;background:var(--green)"></div></div></div>`).join('')}
    <button class="btn mt24" data-go="#detail">Instant Workout</button></div>`;

  let week = 1;
  S.detail = () => `<div class="screen">${back('#workout')}<div class="row between"><h1>Custom Workout</h1><button class="icon-btn" data-go="#edit-e1">✎</button></div>
    <div class="chips">${[1, 2, 3, 4].map(w => `<button class="chip ${w === week ? 'on' : ''}" data-act="week" data-v="${w}">Week ${w}</button>`).join('')}</div>
    ${artHero(2, 'mt12 sm')}
    ${WEEK.map(d => `<button class="list-item" data-go="#exercises"><div class="thumb daytile" style="--dc:${DAYCOL[d.k]}">${d.k}</div><div class="grow"><h3 style="font-size:15px">${d.t}</h3><p>Level : ${d.lv}</p><p>${d.m} Min · ${d.ex} Exercises</p></div><span style="color:${DAYCOL[d.k]}">›</span></button>`).join('')}</div>`;

  S.exercises = () => `<div class="screen">${back('#detail')}<h1>Legs and Shoulder</h1>
    <div class="grid2 mt16"><div class="stat"><p>Duration</p><b>50-60 Min</b></div><div class="stat"><p>Calories</p><b>445 Kcal</b></div></div>
    <button class="btn mt16" data-go="#exercise-e1">Start Workout</button>
    ${artHero(3, 'mt16 sm')}
    <h3 class="mt24">Exercise List</h3>
    ${EX.map(e0 => { const e = ex(e0.id); return `<button class="list-item" data-go="#exercise-${e.id}"><div class="thumb ic">${ICON[e.id] || ''}<img class="tn" src="assets/thumbs/${e.id}.jpg" alt="" onerror="var v=document.createElement('video');v.className='tn';v.muted=true;v.playsInline=true;v.preload='metadata';v.onerror=function(){v.remove()};v.src='assets/videos/${e.id}.mp4#t=1';this.replaceWith(v)"><span class="play" aria-hidden="true">▶</span></div><div class="grow"><h3 style="font-size:15px">${e.name}</h3><p>${e.time ? e.time + ' min' : e.sets + ' sets × ' + e.reps + ' reps'}</p></div>${state.done[e.id] ? '<span class="green">✔</span>' : '<span class="icon-btn" style="width:34px;height:34px">✎</span>'}</button>`; }).join('')}</div>`;

  let timer = null;
  S.exercise = (id) => {
    const e = ex(id) || EX[0], idx = EX.findIndex(x => x.id === e.id), total = (e.time ? e.time * 60 : 45);
    return `<div class="screen"><div class="row between"><button class="icon-btn" data-act="leave">‹</button><span class="pill">Exercise ${idx + 1}/${EX.length}</span><button class="icon-btn" data-go="#edit-${e.id}">✎</button></div>
      <div class="center" style="min-height:auto;margin-top:14px"><h2>${e.name}</h2>
      <div class="timer" id="ring"><div><span><b id="clock">${fmt(total)}</b><small>${e.time ? 'minutes' : e.sets + ' sets × ' + e.reps + ' reps'}</small></span></div></div>
      <div class="vidbox" id="vidbox"><video id="vid" src="assets/videos/${e.id}.mp4" poster="assets/thumbs/${e.id}.jpg" muted loop playsinline controls preload="metadata" onerror="this.parentNode.classList.add('novid')"></video><div class="fallback">${ICON[e.id] || ''}<p>Tutorial video coming soon</p></div><span class="tag vtag">Tutorial</span></div></div>
      <div class="row mt24"><button class="btn ghost" data-act="timer" id="tbtn">▶ Start</button><button class="btn" data-act="done" data-id="${e.id}">${idx === EX.length - 1 ? 'Finish' : 'Next ›'}</button></div>
      <div class="card mt16"><b>Tips</b><p class="mt8">Keep your core tight, breathe steadily and rest ${e.rest || 30}s between sets.</p></div>
      <button class="btn red mt16" data-act="leave">Leave Workout</button></div>`;
  };
  const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

  S.edit = (id) => {
    const e = ex(id) || EX[0];
    return `<div class="screen" style="opacity:.35">${back('#exercises')}<h1>${e.name}</h1></div>
    <div class="scrim"><div class="drawer"><div class="grab"></div><div class="row between"><h2>Edit Exercise</h2><button class="icon-btn" data-go="#exercises">✕</button></div>
      <p class="mt16">Type of Sets :</p><div class="seg" id="seg"><button class="${e.time ? '' : 'on'}" data-act="stype" data-v="reps">Reps and load</button><button class="${e.time ? 'on' : ''}" data-act="stype" data-v="time">Time</button></div>
      <div class="row between mt16"><p>Number of Sets :</p><div class="stepper"><button data-act="step" data-k="sets" data-d="-1">−</button><b id="s-sets">${e.sets}</b><button data-act="step" data-k="sets" data-d="1">+</button></div></div>
      <div class="row between mt12"><p>${e.time ? 'Minutes :' : 'Repetitions :'}</p><div class="stepper"><button data-act="step" data-k="${e.time ? 'time' : 'reps'}" data-d="-1">−</button><b id="s-main">${e.time || e.reps}</b><button data-act="step" data-k="${e.time ? 'time' : 'reps'}" data-d="1">+</button></div></div>
      <div class="row between mt12"><p>Rest Between Sets :</p><div class="stepper"><button data-act="step" data-k="rest" data-d="-5">−</button><b id="s-rest">${e.rest}s</b><button data-act="step" data-k="rest" data-d="5">+</button></div></div>
      <label class="field"><span>Notes :</span><input id="note" placeholder="Add a note" value="${esc(e.note || '')}"></label>
      <button class="btn mt24" data-act="save-ex" data-id="${e.id}">Save</button></div></div>`;
  };

  let range = 7;
  S.activities = () => {
    const sets = { 0: [40, 70, 55, 90, 60, 100, 75], 1: [30, 50, 80, 60, 90, 70, 100] };
    return shell('act', `<h1>Activities</h1>
    ${artHero(4, 'mt12 sm')}
    <div class="chips">${[['Today', 1], ['7 Days', 7], ['14 Days', 14], ['30 Days', 30]].map(r => `<button class="chip ${range === r[1] ? 'on' : ''}" data-act="range" data-v="${r[1]}">${r[0]}</button>`).join('')}</div>
    <p class="mt12">This data is your activity for several days in 30 days.</p>
    <div class="stat mt16"><p>Workout Length · Last ${range} days</p><b>${range === 1 ? '52' : range * 41} min</b>
      <div class="bars" style="margin-bottom:22px">${[40, 70, 55, 90, 60, 100, 75].map((h, i) => `<div style="height:${h}%;--dc:${DAYCOL[Object.keys(DAYCOL)[i]]}"><i>${Object.keys(DAYCOL)[i]}</i></div>`).join('')}</div></div>
    <div class="stat g mt12"><p>Calories Burn</p><b>${range === 1 ? '445' : (range * 380).toLocaleString()} <small style="font-size:14px">Kcal</small></b></div>
    <div class="stat mt12 hr"><p>Heart Rate</p><b>78 bpm</b>
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><polyline fill="none" stroke="#c6ff3d" stroke-width="3" stroke-linejoin="round" points="0,60 30,55 50,30 70,70 100,40 130,62 160,20 190,66 220,45 250,58 300,35"/></svg></div>`);
  };

  S.profile = () => {
    const u = state.user || { name: 'Guest', email: '' }, p = state.profile;
    const rows = [['👤', 'Personal Information', '#questions'], ['⭐', state.premium ? 'Premium Account ✔' : 'Premium Account', '#premium'], ['ℹ️', 'Information', ''], ['⚙️', 'Setting', '']];
    return shell('user', `<div class="center" style="min-height:auto;gap:6px">
      <label class="avwrap" for="photo" title="Change photo">${avatarHTML('')}<span class="cam" aria-hidden="true">+</span></label>
      <input type="file" id="photo" accept="image/*" hidden>
      <h2 class="mt8">${esc(u.name)}</h2><p>${esc(u.email)}</p>
      <div class="row" style="gap:8px;margin-top:4px"><label for="photo" class="btn sm ghost" style="cursor:pointer">${p.photo ? 'Change photo' : 'Add photo'}</label>${p.photo ? '<button class="btn sm ghost" data-act="rm-photo">Remove</button>' : ''}</div></div>
    <label class="field"><span>Display name</span><div class="row"><input id="dn" value="${esc(u.name)}" maxlength="40" autocomplete="name" style="flex:1"><button class="btn sm" data-act="save-name" style="flex:none">Save</button></div></label>
    <div class="grid2 mt16"><div class="stat"><p>Weight</p><b>${p.weight} kg</b></div><div class="stat"><p>Height</p><b>${p.height} cm</b></div></div>
    ${rows.map(r => `<button class="menu" ${r[2] ? `data-go="${r[2]}"` : 'data-act="soon"'}><span>${r[0]}</span><span class="grow" style="background:none;display:block;width:auto">${r[1]}</span><span style="background:none">›</span></button>`).join('')}
    ${u.guest ? '<button class="menu" data-act="guest-signup" style="color:var(--green)"><span>✚</span><span class="grow" style="background:none;display:block;width:auto">Create your account (keeps your progress)</span><span style="background:none">›</span></button>' : ''}
    <button class="menu" data-act="logout" style="color:var(--red)"><span>↪</span><span class="grow" style="background:none;display:block;width:auto">Log Out</span></button>`);
  };

  S.premium = () => {
    const plans = [['Monthly', '$9.99', '/month', ''], ['Yearly', '$59.99', '/year', 'Best value'], ['Lifetime', '$149', 'once', '']];
    return `<div class="screen">${back('#profile')}<div class="center" style="min-height:auto">${logoImg('sm')}<h1>Go Premium</h1><p>Unlock all programs, custom workouts and advanced stats.</p></div>
    ${plans.map(p => `<button class="price ${state.plan === p[0] ? 'on' : ''}" data-act="plan" data-v="${p[0]}">${p[3] ? `<span class="tag">${p[3]}</span>` : ''}<p>${p[0]}</p><b>${p[1]}</b> <span class="sub">${p[2]}</span></button>`).join('')}
    <button class="btn mt24" data-act="buy">${state.premium ? 'Plan active ✔' : 'Buy and Plan'}</button></div>`;
  };

  /* ---------- photo cropper: drag to move, pinch / slider / wheel to zoom, saves a 320px square JPEG ---------- */
  function openCropper(file) {
    const url = URL.createObjectURL(file), im = new Image();
    im.onerror = () => { URL.revokeObjectURL(url); toast('Could not read that image'); };
    im.onload = () => {
      const S = Math.max(220, Math.min($app.clientWidth - 40, 340)), W = im.naturalWidth, H = im.naturalHeight, base = S / Math.min(W, H);
      let zoom = 1, ox = (S - W * base) / 2, oy = (S - H * base) / 2;
      const m = document.createElement('div'); m.className = 'crop'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Crop photo');
      m.innerHTML = `<div class="crop-card"><div class="row between"><button class="btn sm ghost" data-c="cancel">Cancel</button><h3>Crop photo</h3><button class="btn sm" data-c="save">Save</button></div>
        <div class="crop-stage" id="cstage" style="width:${S}px;height:${S}px"><img alt="" draggable="false"></div>
        <p class="crop-hint">Drag to move. Pinch, scroll or use the slider to zoom.</p>
        <div class="row crop-zoomrow"><span aria-hidden="true">−</span><input type="range" class="crop-zoom" min="1" max="4" step="0.01" value="1" aria-label="Zoom"><span aria-hidden="true">+</span></div>
        <div class="row" style="justify-content:center"><button class="btn sm ghost" data-c="reset">Reset</button></div></div>`;
      $app.appendChild(m);
      const stage = m.querySelector('#cstage'), img = stage.querySelector('img'), zr = m.querySelector('.crop-zoom');
      img.src = url;
      const close = () => { URL.revokeObjectURL(url); m.remove(); document.removeEventListener('keydown', onKey); };
      const onKey = e => { if (e.key === 'Escape') close(); };
      document.addEventListener('keydown', onKey);
      const apply = () => {
        const sc = base * zoom, dw = W * sc, dh = H * sc;
        ox = Math.min(0, Math.max(S - dw, ox)); oy = Math.min(0, Math.max(S - dh, oy));
        img.style.width = dw + 'px'; img.style.height = dh + 'px'; img.style.transform = `translate(${ox}px,${oy}px)`; zr.value = zoom;
      };
      const setZoom = z => {   // zoom around the centre of the crop square
        z = Math.min(4, Math.max(1, z)); const o = base * zoom, cx = (S / 2 - ox) / o, cy = (S / 2 - oy) / o;
        zoom = z; const n = base * zoom; ox = S / 2 - cx * n; oy = S / 2 - cy * n; apply();
      };
      apply();
      const ptr = new Map(); let pinch = 0;
      stage.addEventListener('pointerdown', e => { stage.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); pinch = 0; stage.classList.add('drag'); });
      stage.addEventListener('pointermove', e => {
        if (!ptr.has(e.pointerId)) return; const p = ptr.get(e.pointerId);
        if (ptr.size === 1) { ox += e.clientX - p[0]; oy += e.clientY - p[1]; ptr.set(e.pointerId, [e.clientX, e.clientY]); apply(); return; }
        ptr.set(e.pointerId, [e.clientX, e.clientY]);
        const a = [...ptr.values()], d = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]);
        if (pinch) setZoom(zoom * d / pinch); pinch = d;
      });
      const up = e => { ptr.delete(e.pointerId); pinch = 0; if (!ptr.size) stage.classList.remove('drag'); };
      stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
      stage.addEventListener('wheel', e => { e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08)); }, { passive: false });
      zr.addEventListener('input', () => setZoom(+zr.value));
      m.addEventListener('click', e => {
        const b = e.target.closest('[data-c]'); if (!b) { if (e.target === m) close(); return; }
        if (b.dataset.c === 'cancel') close();
        else if (b.dataset.c === 'reset') { zoom = 1; ox = (S - W * base) / 2; oy = (S - H * base) / 2; apply(); }
        else if (b.dataset.c === 'save') {
          const sc = base * zoom, c = document.createElement('canvas'); c.width = c.height = 320;
          c.getContext('2d').drawImage(im, -ox / sc, -oy / sc, S / sc, S / sc, 0, 0, 320, 320);
          state.profile.photo = c.toDataURL('image/jpeg', 0.88); LS.set('profile', state.profile);
          close(); toast('Photo updated'); render();
        }
      });
      m.querySelector('[data-c="save"]').focus();
    };
    im.src = url;
  }

  /* ---------- router ---------- */
  const PUBLIC = ['splash', 'onboarding', 'login'];
  function render() {
    clearInterval(timer); timer = null;
    const h = (location.hash || '#splash').replace(/^#/, '');
    const [name, arg] = h.split(/-(.+)/);
    const fn = S[name] || S.splash;
    if (!state.user && !PUBLIC.includes(name)) { return go('#login'); }
    $app.innerHTML = fn(arg);
    $app.querySelector('.screen')?.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);

  /* ---------- events ---------- */
  $app.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
    const a = e.target.closest('[data-act]'); if (!a) return;
    const v = a.dataset.v, act = a.dataset.act;
    switch (act) {
      case 'next-slide': if (slide < SLIDES.length - 1) { slide++; render(); } else { slide = 0; go('#login'); } break;
      case 'toggle-auth': authMode = authMode === 'login' ? 'signup' : 'login'; render(); break;
      case 'guest': { const g = state.pendingGuest || { name: 'Athlete', email: '' }; state.user = { name: g.name, email: g.email, guest: true }; LS.set('user', state.user); go('#questions'); break; }
      case 'gender': state.profile.gender = v; render(); break;
      case 'q-back': q--; render(); break;
      case 'q-next':
        if (q === 0 && !state.profile.gender) { toast('Please choose an option'); break; }
        if (q < 3) { q++; render(); } else { LS.set('profile', state.profile); q = 0; go('#home'); } break;
      case 'chip': a.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('on')); a.classList.add('on'); break;
      case 'week': week = +v; render(); break;
      case 'range': range = +v; render(); break;
      case 'rm-photo': delete state.profile.photo; LS.set('profile', state.profile); toast('Photo removed'); render(); break;
      case 'save-name': {
        const v = ($app.querySelector('#dn').value || '').trim().slice(0, 40);
        if (!v) { toast('Enter a name'); break; }
        state.user.name = v; LS.set('user', state.user);
        if (sb) sb.auth.updateUser({ data: { name: v } });
        toast('Name saved'); render(); break;
      }
      case 'notify': toast('No new notifications'); break;
      case 'soon': toast('Coming soon'); break;
      case 'plan': state.plan = v; LS.set('plan', v); render(); break;
      case 'buy': state.premium = true; LS.set('premium', true); toast(state.plan + ' plan activated (demo)'); render(); break;
      case 'guest-signup': authMode = 'signup'; state.user = null; LS.set('user', null); go('#login'); break;
      case 'logout':
        if (sb) sb.auth.signOut();
        state.user = null; LS.set('user', null);
        state.profile = { gender: '', age: 25, height: 170, weight: 70 }; state.done = {}; state.sets = {};
        _set('profile', state.profile); _set('done', {}); _set('sets', {});
        go('#login'); break;
      case 'leave': go('#exercises'); break;
      case 'timer': {
        const btn = $app.querySelector('#tbtn');
        if (timer) { clearInterval(timer); timer = null; btn.textContent = '▶ Start'; break; }
        const clock = $app.querySelector('#clock'), ring = $app.querySelector('#ring');
        let [m, s] = clock.textContent.split(':').map(Number); let left = m * 60 + s; const total = left;
        btn.textContent = '❚❚ Pause';
        timer = setInterval(() => {
          left--; clock.textContent = fmt(Math.max(left, 0)); ring.style.setProperty('--p', ((total - left) / total * 100).toFixed(1));
          if (left <= 0) { clearInterval(timer); timer = null; btn.textContent = '▶ Start'; toast('Exercise complete!'); }
        }, 1000); break;
      }
      case 'done': {
        state.done[a.dataset.id] = true; LS.set('done', state.done);
        const i = EX.findIndex(x => x.id === a.dataset.id);
        if (i < EX.length - 1) go('#exercise-' + EX[i + 1].id); else { toast('Workout finished 🎉'); go('#home'); } break;
      }
      case 'stype': { const id = (location.hash.split(/-(.+)/)[1]); const o = state.sets[id] || {}; if (v === 'time') { o.time = o.time || 5; } else { o.time = 0; o.reps = o.reps || ex(id).reps || 10; } state.sets[id] = o; render(); break; }
      case 'step': {
        const id = location.hash.split(/-(.+)/)[1], cur = ex(id), k = a.dataset.k, o = state.sets[id] = state.sets[id] || {};
        o[k] = Math.max(k === 'rest' ? 0 : 1, (cur[k] || 0) + (+a.dataset.d)); render(); break;
      }
      case 'save-ex': { const o = state.sets[a.dataset.id] = state.sets[a.dataset.id] || {}; o.note = $app.querySelector('#note').value; LS.set('sets', state.sets); toast('Saved'); go('#exercises'); break; }
    }
  });
  $app.addEventListener('input', e => {
    const r = e.target.dataset.range;
    if (r) { state.profile[r] = +e.target.value; $app.querySelector('#v').textContent = e.target.value; }
    if (e.target.id === 'q') {
      const t = e.target.value.toLowerCase();
      $app.querySelectorAll('#plist [data-name]').forEach(el => { el.style.display = el.dataset.name.includes(t) ? '' : 'none'; });
    }
  });
  $app.addEventListener('change', e => {
    if (e.target.id !== 'photo' || !e.target.files || !e.target.files[0]) return;
    const f = e.target.files[0];
    if (!/^image\//.test(f.type)) { toast('Choose an image file'); return; }
    openCropper(f); e.target.value = '';   // choose the crop first; saving stores the cropped square
  });
  $app.addEventListener('submit', e => {
    if (e.target.id !== 'auth') return;
    e.preventDefault();
    const f = new FormData(e.target), email = (f.get('email') || '').trim(), pw = f.get('pw') || '', name = (f.get('name') || '').trim();
    const err = $app.querySelector('#err');
    if (authMode === 'signup' && !name) return err.textContent = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return err.textContent = 'Enter a valid email address.';
    if (pw.length < 6) return err.textContent = 'Password must be at least 6 characters.';
    const display = name || email.split('@')[0].replace(/^./, c => c.toUpperCase());
    if (!sb) {   // demo mode: stored locally only
      state.user = { name: display, email }; LS.set('user', state.user);
      return go(authMode === 'signup' ? '#questions' : '#home');
    }
    const btn = e.target.querySelector('button[type=submit]'); if (btn.disabled) return;
    const label = btn.textContent, busy = on => { btn.disabled = on; btn.classList.toggle('busy', on); btn.setAttribute('aria-busy', on ? 'true' : 'false'); btn.innerHTML = on ? '<i class="spin" aria-hidden="true"></i>' + (authMode === 'signup' ? 'Creating your account…' : 'Signing you in…') : label; };
    busy(true); err.textContent = ''; err.style.color = '';
    const back = location.origin + location.pathname;   // confirmation links come back to this app, not the project's default URL
    const run = authMode === 'signup'
      ? sb.auth.signUp({ email, password: pw, options: { data: { name: display }, emailRedirectTo: back } })
      : sb.auth.signInWithPassword({ email, password: pw });
    run.then(async r => {
      busy(false);
      if (r.error) {
        const m = (r.error.message || '').toLowerCase(), st = r.error.status;
        if (st === 429 || /rate limit|too many/.test(m)) {
          err.innerHTML = 'Too many sign-up emails were sent in the last hour, so we could not send your confirmation email. Please try again in an hour.<br><button type="button" class="green" data-act="guest" style="margin-top:8px"><b>Start now without an account</b></button> (your progress stays on this phone and moves to your account when you sign up later)';
          state.pendingGuest = { name: display, email };
        } else if (/already registered|already exists/.test(m)) {
          authMode = 'login'; render(); const e2 = $app.querySelector('#err'); if (e2) e2.textContent = 'This email already has an account. Log in instead.';
          const em = $app.querySelector('input[name=email]'); if (em) em.value = email;
        } else if (/email not confirmed/.test(m)) {
          err.textContent = 'Please confirm your email first: open the link we sent you, then log in.';
        } else if (/invalid login credentials/.test(m)) {
          err.textContent = 'Wrong email or password.';
        } else err.textContent = r.error.message;
        return;
      }
      if (!r.data.session) { err.style.color = 'var(--green)'; err.textContent = 'Almost there: we sent a confirmation link to ' + email + '. Open it on this device and you will be signed in.'; return; }
      state.user = userFrom(r.data.user); LS.set('user', state.user);
      await pullState();
      go(authMode === 'signup' ? '#questions' : '#home');
    }).catch(() => { busy(false); err.textContent = 'Network error. Try again.'; });
  });

  if (!location.hash) location.hash = '#splash';
  const fromLink = /access_token=|type=signup|error_description=/.test(location.hash);
  if (sb) {
    sb.auth.onAuthStateChange((ev, s) => {
      if (ev === 'SIGNED_IN' && s && (!state.user || state.user.guest || state.user.id !== s.user.id)) {
        state.user = userFrom(s.user); LS.set('user', state.user);
        pullState().then(() => go(fromLink ? '#questions' : '#home'));
      }
    });
    if (/error_description=/.test(location.hash)) { const d = decodeURIComponent((location.hash.match(/error_description=([^&]+)/) || [])[1] || '').replace(/\+/g, ' '); setTimeout(() => { go('#login'); setTimeout(() => { const e3 = $app.querySelector('#err'); if (e3) e3.textContent = d || 'That link has expired. Log in or sign up again.'; }, 50); }, 0); }
    // restore the real session before showing anything that needs a user
    sb.auth.getSession().then(async r => {
      const s = r.data && r.data.session;
      state.user = s ? userFrom(s.user) : (state.user && state.user.guest ? state.user : null); LS.set('user', state.user);
      if (s) await pullState();
      render();
    }).catch(render);
  } else { render(); }
})();

