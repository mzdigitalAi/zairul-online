/* Zairul Art Studio. Vanilla JS, no dependencies. Briefs are kept in this browser only. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var EMBED = /[?&]embed=1/.test(location.search);
  var store = EMBED ? { get: function (k, d) { return d; }, set: function () {} } : { get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  var FIELD_DEF = {
    headline: ['Headline', 'The main line, 2 to 6 words works best', 'text'],
    sub: ['Subheadline', 'One supporting sentence', 'text'],
    price: ['Price or offer', 'RM 8.90, 50% off, Free entry', 'text'],
    dates: ['Date and time', 'Saturday 18 Oct, 7 pm', 'text'],
    address: ['Address or venue', 'Jalan Ampang, Kuala Lumpur', 'text'],
    contact: ['Contact', 'WhatsApp 012-345 6789, website or @handle', 'text'],
    cta: ['Call to action', 'Order now, Register free, Apply today', 'text'],
    brand: ['Brand or business name', 'Shown as a small mark, not a logo design', 'text'],
    points: ['Key points (one per line, up to 4)', 'One short line each', 'area'],
    visual: ['What is in the picture? (optional)', 'e.g. a steaming bowl of laksa on a wooden table', 'area'],
    subject: ['Who is in the photo?', 'e.g. a woman in her late twenties, warm brown skin, wavy hair', 'area'],
    expression: ['Expression', 'e.g. a relaxed half-smile', 'text'],
    pose: ['Pose', 'e.g. sitting on a step, looking just past the camera', 'text'],
    outfit: ['Outfit', 'e.g. a loose cream linen shirt and dark trousers', 'text'],
    hair: ['Hair and makeup', 'e.g. hair down, natural makeup', 'text'],
    location: ['Place or background', 'e.g. a quiet back street with painted shophouses', 'text'],
    light: ['Light (optional)', 'Leave empty to use the photo look', 'text'],
    camera: ['Camera cue (optional)', 'e.g. 85mm lens, eye level', 'text'],
    mood: ['Mood (optional)', 'e.g. calm and confident', 'text'],
    product: ['What is the product?', 'e.g. a matte green pouch of banana chips, front label facing the camera', 'area'],
    surface: ['Surface or backdrop', 'e.g. a pale wooden table', 'text'],
    props: ['Props (optional)', 'e.g. two ripe bananas and a few chips spilling out', 'text'],
    idea: ['What is the video about?', 'e.g. an ASMR unboxing of a boxed model kit, hands only', 'area'],
    length: ['Length', 'e.g. 10 seconds', 'text'],
    scenes: ['Number of scenes (3 to 8)', 'e.g. 5', 'text'],
    backdrop: ['Background', 'e.g. a clean matte black table', 'text'],
    audio: ['Sound', 'e.g. real ASMR sounds only, no music, no voiceover', 'text'],
    itopic: ['Topic or title', 'e.g. Iced palm sugar milk coffee in 5 steps', 'area'],
    isub: ['Subtitle (optional)', 'e.g. Cafe style at home', 'text'],
    isteps: ['Steps, one per line: Label | detail | icon idea', '1. Make the syrup | Simmer palm sugar with pandan until thick | saucepan', 'area'],
    ifacts: ['Key numbers, one per line: Label | value', 'Ideal ratio | 30 ml espresso : 120 ml milk', 'area'],
    ttitle: ['Hook title (3 to 4 words works best)', 'e.g. KOPI SEDAP 5 MINIT', 'text'],
    tsub: ['Sub-hook (optional)', 'e.g. Gula aren memang power!', 'text'],
    tvisual: ['Person and scene', 'e.g. a surprised barista holding a tall iced coffee, warm cafe behind', 'area'],
    texpr: ['Reaction on the face', 'e.g. wide-eyed shock with the mouth open', 'text'],
    tcomp: ['Layout', 'e.g. face on the left, title on the right', 'text'],
    tfont: ['Lettering', 'Bold, Neon, Minimalist, Handwritten, Serif or Gaming', 'text'],
    cstory: ['Story idea', 'e.g. A barista and a customer who forgot their wallet', 'area'],
    cchars: ['Characters, one per line: Name | look', 'Aiman | young barista, short black hair, brown apron and cap', 'area'],
    cpanels: ['Panels, one per line: scene | what they say (optional)', 'Maya orders a latte | Maya: One iced latte, please!', 'area'],
    clayout: ['Layout', 'e.g. a horizontal strip of 4 panels', 'text'],
    sproduct: ['Product and main picture', 'e.g. an ebook cover floating above a steaming coffee cup', 'area'],
    shead: ['Headline', 'e.g. Secrets of Barista-Style Coffee at Home', 'text'],
    sbadge: ['Author and price badge', 'e.g. Ebook by Zairul | Only RM29', 'text'],
    ssub: ['Subheadline', 'One supporting sentence', 'text'],
    sfeats: ['Features, one per line: Label | icon idea (up to 4)', 'Save money | wallet and coin icon', 'area'],
    scta: ['Button text', 'e.g. Get the ebook now', 'text'],
    sedge: ['Edges', 'e.g. solid dark edges with a soft feathered blend', 'text'],
    pscene: ['Scene category (optional)', 'Indoor studio, Outdoor, Family, Faceless, B-roll...', 'text'],
    prefs: ['Images you will attach, in order (optional)', 'e.g. face, outfit, pose', 'text'],
    btitle: ['Book title', 'e.g. Puss and the Little Pond', 'text'],
    bsub: ['Subtitle (optional)', 'e.g. A story about being brave', 'text'],
    bstory: ['Story idea', 'e.g. A shy kitten learns to be brave near water', 'area'],
    bchars: ['Characters, one per line: Name | trait | trait | trait', 'Puss | small fluffy orange kitten | big green eyes | tiny blue collar', 'area'],
    bpages: ['Pages, one per line: scene | narration text', 'Puss plays with a yarn ball | Puss loves his red yarn ball.', 'area'],
    dtopic: ['What is the deck about? (optional)', 'e.g. How our cafe grew from one outlet to five. Leave empty to let your sources decide.', 'area'],
    daud: ['Who will see the deck?', 'e.g. investors, parents, new staff', 'text'],
    dgoal: ['What should they do or decide after?', 'e.g. approve the budget, join the programme', 'text'],
    dslides: ['Length', 'e.g. about 10 slides', 'text'],
    dform: ['Format', 'Presenter deck (big visuals) or reading deck (detailed, sent as a PDF)', 'text'],
    dlang: ['Language of the slides', 'e.g. English or Bahasa Melayu', 'text'],
    dmust: ['Must include, one per line (optional)', 'A one-slide timeline\nA slide on customer feedback', 'area'],
    dnot: ['Leave out, one per line (optional)', 'Competitor names\nPrices that are not final', 'area'],
    dfoot: ['Footer line (optional)', 'e.g. Zairul Art Studio · Confidential', 'text'],
    icar: ['Output', 'One infographic image, or a carousel with one step per slide', 'text'],
    ichar: ['Same character on every slide (optional)', 'e.g. a friendly 3D barista in a brown apron and cap', 'text'],
    attach: ['Images you will attach (optional)', 'e.g. style, product, logo', 'text'],
    iingr: ['Ingredients, one per line (optional, for recipes)', '30 ml espresso', 'area'],
    itime: ['Time, servings or one tip (optional)', 'e.g. 10 minutes · serves 1 · tip: use pure palm sugar', 'text'],
    iimpact: ['Why it matters, one per line: Title | text (up to 3)', 'Savings | Costs a fraction of a cafe cup', 'area'],
    ihero: ['Hero scene (optional)', 'e.g. a tall layered glass of iced coffee on a wooden table', 'text'],
    isource: ['Source (optional)', 'e.g. your own recipe, a report, a website', 'text'],
    ibrand: ['Credit line (optional)', 'e.g. Zairul Art Studio', 'text'],
    angle: ['Angle and framing', 'e.g. slightly above, front of the pack facing the camera', 'text']
  };
  var DEFAULT = { type: 'food', style: 'cinema', moods: ['Warm'], pal: 1, face: 'bold', aspect: '4:5', tool: 0, lang: 'English', textIn: true, real: true, variant: 0, set: { on: false, kind: 'carousel', n: 5, items: [] },
    f: { headline: '', sub: '', price: '', dates: '', address: '', contact: '', cta: '', brand: '', points: '', visual: '', subject: '', expression: '', pose: '', outfit: '', hair: '', location: '', light: '', camera: '', mood: '', product: '', surface: '', props: '', angle: '', idea: '', length: '', scenes: '', backdrop: '', audio: '', itopic: '', isub: '', isteps: '', ifacts: '', btitle: '', bsub: '', bstory: '', bchars: '', bpages: '', cstory: '', cchars: '', cpanels: '', clayout: '', sproduct: '', shead: '', sbadge: '', ssub: '', sfeats: '', scta: '', sedge: '', pscene: '', prefs: '', icar: '', ichar: '', attach: '', dtopic: '', daud: '', dgoal: '', dslides: '', dform: '', dlang: '', dmust: '', dnot: '', dfoot: '', dsize: '', ttitle: '', tsub: '', tvisual: '', texpr: '', tcomp: '', tfont: '', iingr: '', itime: '', iimpact: '', ihero: '', isource: '', ibrand: '' }, look: 0 };
  var S = store.get('pbb_state', null) || JSON.parse(JSON.stringify(DEFAULT));
  S.crew = Object.assign({ scene: 'workshop', n: 3, own: true, inset: false }, S.crew || {}); S.f = Object.assign({}, DEFAULT.f, S.f || {}); S.set = Object.assign({ on: false, kind: 'carousel', n: 5, items: [] }, S.set || {});
  var saved = store.get('pbb_saved', []);
  var tab = 'prompt';

  var isPhoto = function () { return type().mode === 'photo'; };
  var isProduct = function () { return type().sub === 'product'; };
  var isStory = function () { return type().sub === 'story'; };
  var isInfo = function () { return type().sub === 'infoplan'; };
  var sameCard = function (cur, id) { return cur === id || (id === 'book' && cur === 'comic'); };
  var isThumb = function () { return type().sub === 'thumb'; };
  var isComic = function () { return type().sub === 'comic'; };
  var isBook = function () { return type().sub === 'book'; };
  var isSales = function () { return type().sub === 'sales'; };
  var isDeck = function () { return type().sub === 'deck'; };
  var lookList = function () { return isProduct() ? PRODUCT_LOOKS : isStory() ? STORY_LOOKS : isInfo() ? INFO_LOOKS : isThumb() ? THUMB_LOOKS : isBook() ? BOOK_LOOKS : isComic() ? COMIC_LOOKS : isSales() ? SALES_LOOKS : isDeck() ? DECK_LOOKS : PHOTO_LOOKS; };
  var lookObj = function () { var l = lookList(); return l[(S.look || 0) % l.length]; };
  var type = function () { return TYPES.filter(function (t) { return t.id === S.type; })[0]; };
  var style = function () { return STYLES.filter(function (t) { return t.id === S.style; })[0]; };
  var aspect = function () { return ASPECTS.filter(function (t) { return t.id === S.aspect; })[0]; };
  var pal = function () { return PALETTES[S.pal]; };
  var save = function () { store.set('pbb_state', S); };
  var toastT; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 1800); }

  /* ---------- UI building ---------- */
  function chips(host, items, isOn, onClick, cls) {
    host.innerHTML = items.map(function (it, i) { return '<button type="button" class="chip ' + (cls || '') + (isOn(it, i) ? ' on' : '') + '" data-i="' + i + '">' + esc(it.label || it) + '</button>'; }).join('');
    Array.prototype.forEach.call(host.querySelectorAll('.chip'), function (b) { b.addEventListener('click', function () { onClick(items[+b.dataset.i], +b.dataset.i); }); });
  }
  function buildStatic() {
    $('#types').innerHTML = TYPES.filter(function (t) { return !t.hidden; }).map(function (t) { return '<button type="button" class="type' + (t.special ? ' special' : '') + (sameCard(S.type, t.id) ? ' on' : '') + '" data-id="' + t.id + '"><i>' + t.icon + '</i><b>' + esc(t.name) + '</b>' + (t.special ? '<em class="spc">SPECIAL</em>' : '') + '</button>'; }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.type'), function (b) { b.addEventListener('click', function () { S.type = (b.dataset.id === 'book' && S.type === 'comic') ? 'comic' : b.dataset.id; if ((S.type === 'sales' || S.type === 'comic') && S.aspect === '16:9') S.aspect = '4:5'; if (S.type === 'book' && S.aspect === '16:9') S.aspect = '1:1'; if (S.type === 'thumb' && S.aspect !== '16:9' && S.aspect !== '9:16') S.aspect = '16:9'; save(); renderAll(); }); });
    var unlocked = store.get('zas_secret', false); if (!unlocked && style().secret) { S.style = STYLES[0].id; save(); }
    $('#styles').innerHTML = STYLES.filter(function (s) { return !s.secret || unlocked; }).map(function (s) { return '<button type="button" class="style' + (s.secret ? ' secret' : '') + (s.ext ? ' cut' : '') + (S.style === s.id ? ' on' : '') + '" data-id="' + s.id + '" style="--a:' + s.g[0] + ';--b:' + s.g[1] + '"><span><img src="styles/' + s.id + '-s.' + (s.ext || 'jpg') + '" alt="Example poster in the ' + esc(s.name) + ' style" loading="lazy" onerror="this.remove()"></span><b>' + esc(s.name) + '</b>' + (s.tag ? '<small>' + esc(s.tag) + '</small>' : '') + (s.secret ? '<em class="seal">SECRET</em>' : '') + '</button>'; }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.style'), function (b) { b.addEventListener('click', function () { S.style = b.dataset.id; save(); renderAll(); }); });
    $('#pals').innerHTML = PALETTES.map(function (p, i) { return '<button type="button" class="pal' + (S.pal === i ? ' on' : '') + '" data-i="' + i + '" title="' + esc(p.n) + '">' + p.c.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '<b>' + esc(p.n) + '</b></button>'; }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.pal'), function (b) { b.addEventListener('click', function () { S.pal = +b.dataset.i; save(); renderAll(); }); });
  }

  /* ---------- hyper-real 3D crew: scene options and ChatGPT master prompt ---------- */
  function crewO() { var C = S.crew || (S.crew = {}); if (C.scene === undefined) C.scene = 'workshop'; if (C.n === undefined) C.n = 3; if (C.own === undefined) C.own = true; if (C.inset === undefined) C.inset = false; if (C.ref === undefined) C.ref = false; return C; }
  function crewStyleLine() { var C = crewO(), sc = CREW_SCENES[C.scene] || CREW_SCENES.workshop; return 'Scene: ' + sc.setting + '. Light: ' + sc.light + '. Palette: ' + sc.palette + '. Group: ' + CREW_POSES[C.n] + '. Type treatment: ' + sc.type + ', over ' + sc.fade + '.' + (C.inset ? ' Add a small inset of the original photo in the top-right corner with a thick white rounded border.' : ''); }
  function crewMaster() {
    var C = crewO(), sc = CREW_SCENES[C.scene] || CREW_SCENES.workshop, f = S.f, v = function (k, d) { return (f[k] || '').trim() || d; }, a = aspect().id;
    var who = C.n === 1 ? 'one person' : C.n + ' people';
    var subj = C.own ? 'Use the real ' + (C.n === 1 ? 'person' : 'people') + ' in the attached photo(s). Keep each face, skin tone, hair, age and build clearly recognisable (the likeness must stay exact); keep the outfits from the photo(s) unless told otherwise. Apply the stylisation below only to proportions and finish.' : 'Invented adults, not real people. Describe each: [age, skin tone, hair, expression, outfit].';
    var logo = v('brand', 'Your Studio'), kick = v('sub', ''), head = v('headline', 'YOUR HEADLINE'), pill = v('cta', '') || v('dates', '') || v('price', ''), accentWord = v('price', '');
    var tl = ['1. ' + (C.scene === 'solo' ? 'Top-right' : 'Top-left') + ', small: a logo mark reading "' + logo + '".'];
    var n = 2; if (kick) tl.push(n++ + '. A small italic kicker in ' + sc.accentName + ' (' + sc.kick + '): "' + kick.toUpperCase() + '".');
    tl.push(n++ + '. A huge bold italic headline in white (' + (C.scene === 'solo' ? 'rounded heavy, orange ' + sc.accent : C.scene === 'workshop' ? 'condensed' : 'ultra-bold extended, sports-broadcast style') + ') over the bottom third: "' + head.toUpperCase() + '".');
    if (C.scene === 'workshop' && accentWord) tl.push(n++ + '. A heavy ' + sc.accentName + ' (' + sc.accent + ') dry-brush script word, tilted about -6 degrees, overlapping the end of the headline: "' + accentWord + '".');
    if (pill) tl.push(n++ + '. A rounded pill label with a thin ' + sc.accentName + ' outline: "' + pill + '".');
    var out = [
      'Create a ' + a + ' vertical, ultra-realistic 3D-look poster of ' + who + '. ' + sc.n + ' scene.',
      '',
      'STYLE LOOK',
      'Ultra-realistic 3D look: real likeness, but heads and eyes very slightly enlarged (about 10%), expressions slightly exaggerated, smooth skin with a soft subsurface glow, crisp hair strands, glossy micro-highlights, rich saturated cinematic colour, premium animated-film polish, hyper-detailed background. It must pass for a photograph at first glance. NOT a flat cartoon, NOT an illustration, NOT waxy or uncanny.',
      '',
      'SUBJECTS',
      subj,
      '',
      C.ref ? 'STYLE REFERENCE\nThe last attached image is a STYLE REFERENCE only. Copy its rendering finish (the ultra-realistic 3D look), colour grade, headline treatment, light streaks and gradient base. Do NOT copy its people, its background or its words.' : '',
      C.ref ? '' : null,
      'POSE AND COMPOSITION',
      (C.own ? 'Keep the arrangement, pose and gestures from the attached photo' : CREW_POSES[C.n]) + '. The ' + (C.n === 1 ? 'person fills' : 'group fills') + ' about ' + (C.n === 1 ? '75' : '85') + '% of the frame height, heads in the upper half, camera at chest height with a slightly low angle, shallow depth of field. Keep the lower third free for text.',
      '',
      'SETTING',
      sc.setting + '.',
      '',
      'LIGHTING AND MOOD',
      sc.light + '. Confident, playful, premium film-poster grade.',
      '',
      'COLOUR PALETTE',
      sc.palette + '. Accent colour for type: ' + sc.accentName + ' ' + sc.accent + '. Text base: pure white. Put ' + sc.fade + ' for legibility.',
      '',
      'TEXTURES',
      'Visible fabric weave, crisp badges and seams, real skin with natural pores and small imperfections (softened, not airbrushed), flyaway hairs, believable shoes and accessories.',
      '',
      'TYPOGRAPHY (spell every word exactly as written; add nothing else)',
      tl.join('\n'),
      C.scene === 'park' || C.scene === 'costume' ? 'Add thin blue light streaks running horizontally behind the headline.' : ''
    ];
    if (C.inset) out.push('', 'INSET', 'In the top-right corner, a small inset (about 16% of the width) showing the original attached photo, with a thick white border and softly rounded corners.');
    out.push('', 'RULES', 'Natural hands with five fingers each, no extra limbs, no warped signs, no duplicated accessories, no extra text, no watermarks apart from the logo. Keep it photographic with only the subtle 3D polish.');
    return out.filter(function (x) { return x !== null; }).filter(function (x, i, arr) { return !(x === '' && arr[i - 1] === ''); }).join('\n');
  }
  function crewUI(host, s) {
    var C = crewO(), box = document.createElement('div'); box.className = 'crewopts';
    box.innerHTML = '<b>Crew options</b><label class="lab">Scene<div class="chips" id="crewScene"></div></label><label class="lab">People<div class="chips" id="crewN"></div></label><label class="lab toggle"><input type="checkbox" id="crewOwn"' + (C.own ? ' checked' : '') + '><span class="sw"></span><span><b>I will attach photos of the real people</b><small>Adds a likeness-lock line. Switch off to describe invented people.</small></span></label><label class="lab toggle"><input type="checkbox" id="crewRef"' + (C.ref ? ' checked' : '') + '><span class="sw"></span><span><b>Attach a style reference image</b><small>A poster you like in this style, attached after the photo. The prompt tells ChatGPT to copy only its look, not its people.</small></span></label><label class="lab toggle"><input type="checkbox" id="crewInset"' + (C.inset ? ' checked' : '') + '><span class="sw"></span><span><b>Original photo inset</b><small>A small bordered copy of the source photo in the top-right corner.</small></span></label><small class="cnote">The brief fields above feed this style: Brand = logo, Subheadline = kicker, Headline = main line, Call to action or Date = pill label, Price = accent script word (workshop scene).</small>';
    host.appendChild(box);
    chips(box.querySelector('#crewScene'), Object.keys(CREW_SCENES).map(function (k) { return { id: k, label: CREW_SCENES[k].n }; }), function (x) { return C.scene === x.id; }, function (x) { C.scene = x.id; save(); renderAll(); });
    chips(box.querySelector('#crewN'), [1, 2, 3, 4].map(function (k) { return { id: k, label: String(k) }; }), function (x) { return C.n === x.id; }, function (x) { C.n = x.id; save(); renderAll(); });
    box.querySelector('#crewOwn').onchange = function () { C.own = this.checked; save(); renderOutput(); };
    box.querySelector('#crewRef').onchange = function () { C.ref = this.checked; save(); renderOutput(); };
    box.querySelector('#crewInset').onchange = function () { C.inset = this.checked; save(); renderOutput(); };
  }
  function renderStyleDetail() {
    var s = style(), h = $('#styleDetail'); if (!h) return;
    h.innerHTML = '<button type="button" class="sd-img' + (s.ext ? ' cut' : '') + '" style="--a:' + s.g[0] + ';--b:' + s.g[1] + '" id="sdOpen" aria-label="Open the full-size example"><img src="styles/' + s.id + '.' + (s.ext || 'jpg') + '" alt="Large example poster in the ' + esc(s.name) + ' style" onerror="this.parentNode.style.display=\'none\'"></button><div class="sd-txt"><small>Selected style' + (s.tag ? ' · shown on: ' + esc(s.tag) : '') + '</small><h3>' + esc(s.name) + '</h3><p>' + esc(s.t.charAt(0).toUpperCase() + s.t.slice(1)) + '.</p><p class="best"><b>Works well for:</b> ' + esc(s.best || '') + '</p><p class="note">' + (s.ext ? 'This example is a figurine on a transparent background (a cut-out you can place on any poster), made in ChatGPT with an AiVA Zyra style request. Click the picture to see it full size.' : s.id === 'crew' ? 'This example was made from a free stock photo (the small inset in the corner is the original), restyled with the Beach scene. Click the picture to see it full size.' : (s.ex ? 'The example shows this style on the kind of job it suits best: ' + esc(s.ex) + '. Click the picture to see it full size.' : 'This example is a Kopi Pagi coffee poster in this style. Click the picture to see it full size.')) + '</p></div>';
    var o = $('#sdOpen'); if (o) o.onclick = function () { openBox(s); };
    if (s.photoPrompt) {
      var pb = document.createElement('div'); pb.className = 'recipe';
      pb.innerHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn mini hot" id="copyPhotoToy">' + esc(s.photoLabel) + '</button>' + (s.photoPrompt2 ? '<button type="button" class="btn mini" id="copyPhotoToy2">' + esc(s.photoLabel2) + '</button>' : '') + '</div><small>' + esc(s.photoNote) + '</small>';
      if (s.photoPrompt2) pb.querySelector('#copyPhotoToy2').onclick = function () { copy(s.photoPrompt2, 'Prompt copied'); };
      h.appendChild(pb); pb.querySelector('#copyPhotoToy').onclick = function () { copy(s.photoPrompt, 'Prompt copied'); };
    }
    if (s.recipe) {
      var box = document.createElement('div'); box.className = 'recipe';
      box.innerHTML = '<details><summary>Reverse-engineered recipe</summary><dl>' + s.recipe.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl></details><button type="button" class="btn mini hot" id="copyMaster">Copy the ChatGPT recipe prompt</button><small>Built from your brief and the options below. Paste it into a new ChatGPT image chat; if you tick "attach photos", attach them in the same message.</small>';
      h.appendChild(box); var cm = box.querySelector('#copyMaster'); cm.onclick = function () { copy(crewMaster(), 'ChatGPT recipe prompt copied'); };
      if (s.id === 'crew') crewUI(box, s);
    }
  }
  function openBox(s) { var b = $('#lightbox'); b.innerHTML = '<figure><img src="styles/' + s.id + '.' + (s.ext || 'jpg') + '" alt="' + esc(s.name) + ' example poster"><figcaption><b>' + esc(s.name) + '</b> · ' + esc(s.best || '') + '</figcaption></figure><button type="button" class="x" aria-label="Close">×</button>'; b.classList.add('on'); b.onclick = function () { b.classList.remove('on'); }; }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('#lightbox').classList.remove('on'); });
  function renderChips() {
    chips($('#langChips'), ['English', 'Bahasa Melayu', 'Bilingual'], function (x) { return S.lang === x; }, function (x) { S.lang = x; save(); renderAll(); });
    chips($('#textChips'), [{ label: 'Write the text in the image' }, { label: 'Leave space, I add text later' }], function (x, i) { return (i === 0) === S.textIn; }, function (x, i) { S.textIn = i === 0; save(); renderAll(); });
    chips($('#moods'), MOODS, function (x) { return S.moods.indexOf(x) > -1; }, function (x) { var k = S.moods.indexOf(x); if (k > -1) S.moods.splice(k, 1); else if (S.moods.length < 3) S.moods.push(x); else { S.moods.shift(); S.moods.push(x); } save(); renderAll(); });
    chips($('#faces'), [{ label: 'Bold sans', k: 'bold' }, { label: 'Elegant serif', k: 'elegant' }, { label: 'Hand lettered', k: 'hand' }, { label: 'Condensed', k: 'condensed' }, { label: 'Retro rounded', k: 'retro' }], function (x) { return S.face === x.k; }, function (x) { S.face = x.k; save(); renderAll(); });
    chips($('#aspects'), ASPECTS.map(function (a) { return { label: a.label, id: a.id }; }), function (x) { return S.aspect === x.id; }, function (x) { S.aspect = x.id; save(); renderAll(); });
    chips($('#tools'), TOOLS, function (x, i) { return S.tool === i; }, function (x, i) { S.tool = i; save(); renderAll(); });
    chips($('#variants'), [{ label: 'A · Type-led' }, { label: 'B · Image-led' }, { label: 'C · Framed' }], function (x, i) { return S.variant === i; }, function (x, i) { S.variant = i; save(); renderAll(); }, 'small');
    $('#aspectUse').textContent = 'Best for: ' + aspect().use + '.' + (S.tool === 0 && (aspect().id === '4:5' || aspect().id === '1:1.414') ? ' Note: Flow does not offer ' + aspect().id + '. Ask for 3:4 and crop afterwards.' : '');
    $('#real').checked = S.real;
    Array.prototype.forEach.call(document.querySelectorAll('.type'), function (b) { b.classList.toggle('on', sameCard(S.type, b.dataset.id)); });
    Array.prototype.forEach.call(document.querySelectorAll('.style'), function (b) { b.classList.toggle('on', b.dataset.id === S.style); });
    Array.prototype.forEach.call(document.querySelectorAll('.pal'), function (b) { b.classList.toggle('on', +b.dataset.i === S.pal); });
  }
  function renderFields() {
    var host = $('#fields'), t = type(), keys = isPhoto() ? t.fields : t.fields.concat(['brand', 'visual', 'attach']);
    if (host.dataset.type !== S.type) {
      host.dataset.type = S.type;
      host.innerHTML = keys.map(function (k) {
        var d = FIELD_DEF[k]; return '<label class="fld ' + (d[2] === 'area' ? 'wide' : '') + '"><span>' + esc(d[0]) + '</span>' + (d[2] === 'area' ? '<textarea rows="3" data-k="' + k + '" placeholder="' + esc(d[1]) + '"></textarea>' : '<input type="text" data-k="' + k + '" placeholder="' + esc(d[1]) + '">') + '</label>';
      }).join('');
      Array.prototype.forEach.call(host.querySelectorAll('[data-k]'), function (n) { n.value = S.f[n.dataset.k] || ''; n.addEventListener('input', function () { S.f[n.dataset.k] = n.value; save(); renderOutput(); }); });
    } else Array.prototype.forEach.call(host.querySelectorAll('[data-k]'), function (n) { if (document.activeElement !== n) n.value = S.f[n.dataset.k] || ''; });
  }

  /* ---------- prompt engine ---------- */
  function relevant() { return isPhoto() ? type().fields.filter(function (k) { return ['light', 'camera', 'mood', 'expression', 'hair'].indexOf(k) < 0; }).concat(['brand']) : type().fields.concat(['brand']); }
  function textLines() {
    var f = S.f, out = [], t = type();
    var add = function (role, v) { if (v && v.trim()) out.push([role, v.trim()]); };
    add('Headline', f.headline); add('Subheadline', f.sub);
    if (t.fields.indexOf('points') > -1) f.points.split('\n').map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 4).forEach(function (p, i) { add('Point ' + (i + 1), p); });
    add(t.fields.indexOf('price') > -1 ? 'Price or offer' : 'Offer', t.fields.indexOf('price') > -1 ? f.price : ''); add('Date and time', t.fields.indexOf('dates') > -1 ? f.dates : '');
    add('Address', t.fields.indexOf('address') > -1 ? f.address : ''); add('Call to action', t.fields.indexOf('cta') > -1 ? f.cta : ''); add('Contact', f.contact); add('Brand name', f.brand);
    return out;
  }
  function layoutText(v) {
    var t = type(), z = t.zones, has = function (k) { return z.indexOf(k) > -1; };
    if (v === 0) return 'Layout A, type-led: the headline sits in the top third in very large type. The hero visual fills the middle. ' + (has('badge') ? 'A round badge with the price or offer overlaps the hero at the lower right. ' : '') + (has('list') ? 'The key points run as a short stacked list below the hero. ' : '') + (has('info') ? 'Date and place sit in a tidy info band. ' : '') + (has('cta') ? 'A pill-shaped call-to-action button sits at the lower left. ' : '') + 'A slim contact strip runs along the bottom edge.';
    if (v === 1) return 'Layout B, image-led: the hero visual runs full-bleed behind everything, with a soft darkening gradient at the bottom for legibility. The headline sits in the lower left over the gradient, large and left-aligned, with the supporting line under it. ' + (has('badge') ? 'The price or offer sits in a badge at the top right. ' : '') + (has('cta') ? 'The call-to-action button sits under the text. ' : '') + 'Contact details sit small along the bottom edge.';
    return 'Layout C, framed: the hero visual sits inside a clean rounded frame in the upper half with generous margins. The headline sits under the frame, left-aligned, with the supporting line below. ' + (has('badge') ? 'The price or offer sits in a badge that overlaps a corner of the frame. ' : '') + (has('cta') ? 'The call-to-action button sits at the lower left. ' : '') + 'Contact details sit at the bottom right.';
  }
  function palText() { var c = pal().c; return 'Colour palette: dominant ' + c[0] + ', accent ' + c[1] + ', light neutral ' + c[2] + '. Use the accent sparingly for the price badge and button.'; }
  var AVOID = 'Avoid: misspelt or invented words, extra text, gibberish lettering, watermarks, random logos, distorted hands or faces, cluttered backgrounds, low-contrast text, text running off the edges, translated or reworded text, section labels or instructions from the brief printed as visible text, blurred text, hex colour codes, colour names, style words or instructions printed on the picture.';
  function realismText() {
    return S.real ? 'Make it look like it was really made: light that comes from a believable source, natural texture and small real imperfections, honest colour, no plastic gloss or glowing everything. Do not use filler like "ultra realistic" or "8k".' : '';
  }
  function langText() { return S.lang === 'Bahasa Melayu' ? 'All text is in Bahasa Melayu.' : S.lang === 'Bilingual' ? 'Text is bilingual in English and Bahasa Melayu, exactly as written below.' : 'All text is in English.'; }

  function attachText() {
    var v = (S.f.attach || '').split(/,/).map(function (x) { return x.trim(); }).filter(Boolean); if (!v.length) return '';
    var map = [[/style|gaya|contoh|reference|rujukan/, 'a STYLE reference: copy its look, colour and layout feel only, never its people, words or logos'], [/product|produk|asset|barang/, 'the PRODUCT: keep it exactly as shown, do not redesign or restyle it'], [/logo/, 'the BRAND LOGO: place it unchanged and small in a clean corner, never redraw or alter it'], [/person|face|wajah|model/, 'the PERSON: keep the likeness exact']];
    return 'ATTACHED IMAGES (in this order)\n' + v.map(function (r, i) { var h = map.filter(function (m) { return m[0].test(r.toLowerCase()); })[0]; return 'Image ' + (i + 1) + ': ' + (h ? h[1] : r) + '.'; }).join('\n') + '\nDo not copy anything else from the attached images.';
  }
  function bodyParts() {
    var t = type(), st = style(), a = aspect(), f = S.f, tl = textLines();
    var hero = f.visual && f.visual.trim() ? f.visual.trim() : t.hero;
    var mood = S.moods.length ? S.moods.join(', ').toLowerCase() : t.tone;
    var textBlock = S.textIn
      ? (tl.length ? 'Render exactly this text and nothing else. Spell every word precisely as written. ' + tl.map(function (x) { return x[0] + ': "' + x[1] + '"'; }).join('; ') + '. ' + langText() + ' Use ' + TYPEFACES[S.face] + ', with the headline clearly largest, strong contrast, and nothing touching the edges.' : 'No text has been supplied: leave clean areas for text.')
      : 'Do not render any words or letters. Leave clean, uncluttered areas for the headline, the supporting line' + (t.zones.indexOf('badge') > -1 ? ', a price badge' : '') + (t.zones.indexOf('cta') > -1 ? ', a button' : '') + ' and a contact strip, so the type can be added afterwards.';
    return { intro: 'A ' + a.id + ' ' + t.name.toLowerCase() + ' poster' + (f.brand ? ' for ' + f.brand : '') + '. It must communicate ' + t.focus + '.' + (S.concept ? ' Creative concept: ' + S.concept.name.toLowerCase() + ': ' + S.concept.pitch.charAt(0).toLowerCase() + S.concept.pitch.slice(1) : ''), hero: 'Hero visual: ' + hero + '.', style: 'Style: ' + st.name + ': ' + st.t + '. Mood: ' + mood + '.' + (st.id === 'crew' ? ' ' + crewStyleLine() : ''), layout: layoutText(S.variant), text: textBlock, pal: palText(), real: realismText(), avoid: AVOID, att: attachText(), tl: tl };
  }
  function composePrompt() {
    if (isPhoto()) return composePhoto();
    var p = bodyParts(), tool = S.tool, a = aspect();
    if (tool === 1) return [p.intro, '', p.hero, p.style, '', 'LAYOUT\n' + p.layout, '', 'TEXT\n' + p.text, '', 'COLOUR AND TYPE\n' + p.pal, p.real, '', 'Size: ' + a.id.replace('1:1.414', 'portrait A-series') + '.', p.att, p.avoid].filter(function (x) { return x !== ''; }).join('\n');
    if (tool === 3) return ['Poster brief', '- Type: ' + type().name, '- Size: ' + a.id, '- ' + p.hero, '- ' + p.style, '- ' + p.layout, '- ' + p.text, '- ' + p.pal, p.real ? '- ' + p.real : '', p.att ? '- ' + p.att.replace(/\n/g, ' ') : '', '- ' + p.avoid].filter(Boolean).join('\n');
    return [p.intro, p.hero, p.style, p.layout, p.text, p.pal, p.real, 'Aspect ratio ' + a.id.replace('1:1.414', '1:1.414 (A-series portrait)') + '.', p.att, p.avoid].filter(Boolean).join('\n\n');
  }
  function composeJSON() {
    if (isBook()) return composeBookJSON();
    if (isComic()) return composeComicJSON();
    if (isDeck()) return composeDeckJSON();
    if (isSales()) return composeSalesJSON();
    if (isThumb()) return composeThumbJSON();
    if (isInfo()) return composeInfoJSON();
    if (isStory()) { var D = storyData(); return JSON.stringify({ type: 'video storyboard', idea: D.idea, seconds: D.secs, size: aspect().id, look: D.look.n, background: D.back, sound: D.audio, light: D.light, camera: D.cam, mood: D.mood, scenes: D.scenes.map(function (s) { return { scene: s.i, name: s.name, from: s.t0, to: s.t1, camera: s.cam, action: s.mo }; }) }, null, 2); }
    if (isProduct()) return JSON.stringify({ type: 'product photo', size: aspect().id, tool: TOOLS[S.tool], photo_look: lookObj().n, realism_mode: S.real, product: S.f.product, angle: S.f.angle, surface: S.f.surface, props: S.f.props, light: S.f.light || lookObj().light, camera: S.f.camera || lookObj().cam, mood: S.f.mood || S.moods.join(', ') }, null, 2);
    if (isPhoto()) return JSON.stringify({ type: 'portrait or fashion photo', size: aspect().id, tool: TOOLS[S.tool], photo_look: lookObj().n, realism_mode: S.real, subject: S.f.subject, expression: S.f.expression, pose: S.f.pose, outfit: S.f.outfit, hair_and_makeup: S.f.hair, place: S.f.location, light: S.f.light || lookObj().light, camera: S.f.camera || lookObj().cam, mood: S.f.mood || S.moods.join(', ') }, null, 2);
    var p = bodyParts();
    return JSON.stringify({ poster_type: type().name, size: aspect().id, tool: TOOLS[S.tool], style: style().name, mood: S.moods, palette: pal().c, lettering: S.face, language: S.lang, text_in_image: S.textIn, realism_mode: S.real, layout_variant: ['A type-led', 'B image-led', 'C framed'][S.variant], hero_visual: S.f.visual || type().hero, text: p.tl.reduce(function (o, x) { o[x[0]] = x[1]; return o; }, {}), avoid: p.avoid.replace('Avoid: ', '').replace(/\.$/, '').split(', ') }, null, 2);
  }
  function composeText() {
    if (isBook()) return composeBookText();
    if (isComic()) return composeComicText();
    if (isDeck()) return composeDeckText();
    if (isSales()) return composeSalesText();
    if (isThumb()) return composeThumbText();
    if (isInfo()) return composeInfoText();
    if (isStory()) return 'CHECK THE CLIPS\n- Same subject, hands, surface and colours in every clip.\n- Light direction does not jump between scenes.\n- No text, logos or subtitles burnt into the picture.\n- Hands and fingers look natural while moving.\n- Sound matches what happens on screen.\n- Each clip ends on a still moment so the cuts join cleanly.\n\nSTITCHING\nGenerate the scenes in order, use the last frame of each clip as the first frame of the next if your tool allows it, then join them in an editor and add the sound there.';
    if (isProduct()) return 'CHECK THE RESULT\n- Shape: the product has the same shape on every side, no melted or bent edges.\n- Label: any text on the pack is spelt right, or left blank to add later.\n- Shadow: one soft contact shadow, no double shadows or floating look.\n- Material: glass, plastic, metal and paper each look like themselves.\n- Colour: matches the real product under daylight.\n- Edges: clean cut-out edges if you will place it on a poster.\n- Extras: no props you did not ask for.\n\nUSE IT IN A POSTER\nOnce the photo is right, switch to a poster type and use this photo as the hero visual.';
    if (isPhoto()) return 'CHECK THE RESULT\n- Hands: five fingers each, natural size, no fused or extra fingers.\n- Eyes: both eyes look in the same direction and have catch lights.\n- Skin: pores and small imperfections are visible, not airbrushed plastic.\n- Face: slightly asymmetrical, as real faces are.\n- Jewellery and clothing: no duplicated earrings, buttons or straps.\n- Background: no warped signs, doors or railings.\n- Light: one clear direction that matches the shadows.\n\nKEEP IT MODEST\nIf the subject should look like a specific real person, do not ask for that. Describe a type of person instead.';
    var tl = textLines(); if (!tl.length) return 'Nothing to render yet. Fill in the headline and details on the left.\n\n' + wordsHelper();
    var lines = tl.map(function (x) { return x[0].padEnd(16, ' ') + x[1]; });
    var warn = dateIssues(); tl.forEach(function (x) { if (x[1].length > 60) warn.push(x[0] + ' is long (' + x[1].length + ' characters); long text is where image tools make spelling mistakes.'); if (/[^\x00-\x7F]/.test(x[1])) warn.push(x[0] + ' has special characters; check them in the result.'); });
    return 'TEXT THAT MUST APPEAR EXACTLY\n' + lines.join('\n') + '\n\nCHECKLIST AFTER GENERATING\n- Is every word spelt exactly as above?\n- Is the headline the largest element?\n- Is the contact line readable at phone size?\n- Nothing clipped at the edges?' + (warn.length ? '\n\nWATCH OUT\n- ' + warn.join('\n- ') : '') + '\n\n' + wordsHelper();
  }
  function composeFix() {
    if (isBook()) return composeBookFix();
    if (isComic()) return composeComicFix();
    if (isDeck()) return composeDeckFix();
    if (isSales()) return composeSalesFix();
    if (isThumb()) return composeThumbFix();
    if (isInfo()) return ['SPELLING\nKeep the infographic exactly as it is, but correct every word so the step labels and details read exactly as in my brief. Change nothing else.','NUMBERS\nKeep the design the same, but make the key numbers read exactly as I supplied them: ' + (infoData().facts.map(function (x) { return x.label + ' ' + x.value; }).join('; ') || 'the supplied numbers') + '.','LESS TEXT\nKeep the layout, but shorten each step detail to 10 words or fewer and enlarge the step labels.','ICON STYLE\nKeep everything, but redraw all the icons in one consistent style, size and line weight.','STEP ORDER\nKeep the design, but make sure the numbered steps run in order from 1 to ' + (infoData().steps.length || 5) + ' along one clear reading path.','SPACE\nKeep the content, but add more margin and breathing room around every block and keep text away from the edges.'].join('\n\n');
    if (isStory()) return ['CONTINUITY\nKeep this clip exactly as it is, but make the subject, hands, surface and colours match the previous scene.','LIGHT\nKeep everything the same, but use one steady light direction from the left, with no flicker or sudden changes.','HANDS\nKeep the action the same, but make the hands natural, with five fingers each and smooth movement.','SLOWER\nKeep the shot the same, but slow the camera move by half and let the final second rest on a still frame.','NO TEXT\nKeep the clip the same and remove any text, logos, captions or watermarks from the picture.','SOUND ONLY\nDescribe the sound design for this clip second by second so it can be recorded or generated separately.'].join('\n\n');
    if (isProduct()) return ['LABEL\nKeep the photo exactly as it is, but make the packaging label blank and clean so the real label can be added later.','SHADOW\nKeep everything the same, but give the product one soft contact shadow directly beneath it, with no second shadow.','BACKGROUND ONLY\nKeep the product and its light exactly the same and change only the surface to: ' + (S.f.surface || 'a plain white surface') + '.','WHITE CUT-OUT\nKeep the product exactly the same on a pure white seamless background with a faint grounded shadow, ready for a marketplace listing.','LESS AI-LOOK\nKeep the composition, but make the materials look photographed: real texture, believable reflections, small imperfections. Remove plastic gloss and glow.','CLEANER\nRemove every prop except the product and leave plenty of clean space around it for headline text.'].join('\n\n');
    if (isPhoto()) return ['HANDS\nKeep the photo exactly as it is, but correct the hands so each has five natural fingers in a relaxed position.','SKIN\nKeep everything the same, but make the skin look natural: visible pores, small imperfections, no airbrushing or plastic gloss.','EYES\nKeep the photo the same, but make both eyes look at the same point, with natural catch lights and normal-sized pupils.','OUTFIT ONLY\nKeep the person, pose and background exactly the same and change only the outfit to: ' + (S.f.outfit || 'a different outfit') + '.','BACKGROUND ONLY\nKeep the person, pose and light exactly the same and change only the background to: ' + (S.f.location || 'a different place') + '.','TIGHTER CROP\nCrop in to a head-and-shoulders framing, keeping the eyes on the upper third line.'].join('\n\n');
    var tl = textLines(), h = (S.f.headline || 'the headline');
    return ['SPELLING\nKeep the poster exactly as it is, but correct the text so it reads precisely: ' + (tl.length ? tl.map(function (x) { return x[0] + ' "' + x[1] + '"'; }).join('; ') : 'the supplied text') + '. Do not change anything else.',
      'CONTRAST\nKeep everything the same, but increase the contrast behind ' + h + ' so it is easy to read on a phone, with a soft shadow or a solid panel.',
      'CLEANER\nKeep the composition, remove any extra text, small print and decorative clutter, and give every element more breathing room.',
      'LESS AI-LOOK\nKeep the layout, but make the hero look photographed rather than rendered: natural light, believable texture and small imperfections. Remove plastic gloss and glow.',
      'SPACE FOR LOGO\nKeep the poster the same, and leave a clean empty area in the top left, about one tenth of the width, for a logo to be added later.',
      'SQUARE TO STORY\nExtend this poster into a 9:16 vertical version, keeping the headline and contact details inside the central safe area.'].join('\n\n');
  }

  function storyData() {
    var f = S.f, L = lookObj(), v = function (k) { return (f[k] || '').trim(); };
    var n = Math.max(3, Math.min(8, parseInt(v('scenes'), 10) || 5));
    var m = v('length').match(/(\d+(?:\.\d+)?)\s*(min|menit|minute|minit)?/i), secs = m ? parseFloat(m[1]) * (m[2] ? 60 : 1) : 10; if (!(secs >= 3)) secs = 10; secs = Math.min(secs, 120);
    var per = secs / n, tc = function (x) { x = Math.round(x); return ('0' + Math.floor(x / 60)).slice(-2) + ':' + ('0' + (x % 60)).slice(-2); };
    var scenes = []; for (var i = 0; i < n; i++) { var b = BEATS[Math.round(i * (BEATS.length - 1) / (n - 1))]; scenes.push({ i: i + 1, name: b.n, cam: b.cam, mo: b.mo, t0: tc(i * per), t1: tc((i + 1) * per), dur: Math.round(per * 10) / 10 }); }
    return { idea: v('idea') || 'a short product video', n: n, secs: secs, scenes: scenes, back: v('backdrop') || 'a simple, clean surface', audio: v('audio') || 'natural sound only, no music, no voiceover', light: v('light') || L.light, cam: v('camera') || L.cam, mood: v('mood') || (S.moods.join(', ').toLowerCase() || 'calm'), look: L };
  }





  /* ---------- Storybook / Comic: one card, two formats ---------- */
  function renderFormatRow() {
    var host = $('#fmtRow'); if (!host) return; var on = isBook() || isComic(); host.hidden = !on; if (!on) { host.innerHTML = ''; return; }
    chips(host, [{ id: 'book', label: 'Storybook (full pages)' }, { id: 'comic', label: 'Comic (panels)' }], function (x) { return S.type === x.id; }, function (x) {
      if (S.type === x.id) return; var f = S.f, fill = function (to, from) { if (!(f[to] || '').trim() && (f[from] || '').trim()) f[to] = f[from]; };
      if (x.id === 'comic') { fill('cstory', 'bstory'); fill('cchars', 'bchars'); fill('cpanels', 'bpages'); } else { fill('bstory', 'cstory'); fill('bchars', 'cchars'); fill('bpages', 'cpanels'); }
      S.type = x.id; if (x.id === 'book' && S.aspect === '16:9') S.aspect = '1:1'; $('#fields').dataset.type = ''; save(); renderAll(); toast(x.id === 'book' ? 'Storybook format: one full-page picture per page' : 'Comic format: several panels per page');
    });
  }
  /* ---------- storybook ---------- */
  function bookData() {
    var f = S.f, v = function (k) { return (f[k] || '').trim(); }, L = lookObj(), lines = function (k, max) { return v(k).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, max); };
    var chars = lines('bchars', 6).map(function (x) { var p = x.split('|').map(function (y) { return y.trim(); }); return { name: p[0] || '', traits: p.slice(1).filter(Boolean) }; });
    var pages = lines('bpages', 12).map(function (x, i) { var p = x.split('|'); return { n: i + 1, scene: (p[0] || '').trim(), text: p.slice(1).join('|').trim() }; });
    return { title: v('btitle') || 'Your Story Title', sub: v('bsub'), story: v('bstory'), chars: chars, pages: pages, L: L, lang: S.lang === 'Bahasa Melayu' ? 'Bahasa Melayu' : S.lang === 'Bilingual' ? 'English and Bahasa Melayu as written' : 'English' };
  }
  function bookAnchor(c) { return c.name + ' -> [' + c.traits.join(' | ') + ']'; }
  function bookPage(D, pg, total) {
    var present = D.chars.filter(function (c) { return c.name && (pg.scene + ' ' + pg.text).toLowerCase().indexOf(c.name.toLowerCase()) > -1; });
    var lock = 'Design lock: ' + D.L.t + '; palette: ' + D.L.pal + '; lighting: ' + D.L.light + '; texture: ' + D.L.tex + '.';
    return ['PAGE ' + pg.n + ' of ' + total, lock, present.length ? 'Characters in this scene (draw them exactly like the anchors): ' + present.map(bookAnchor).join('; ') + '.' : '', 'Scene: ' + pg.scene + '.', pg.text ? 'Narration text, exactly (' + D.lang + '): "' + pg.text + '", in a soft rounded cream box in the bottom margin, in a large friendly storybook font.' : '', 'Page number "' + pg.n + '" small, bottom right.', 'One full-page illustration with one clear visual focus and a clear text-safe area; not a comic with panels.'].filter(Boolean).join('\n');
  }
  function composeBook() {
    var D = bookData(), a = aspect(), n = D.pages.length || 4;
    var head = 'A children storybook: a cover plus ' + n + ' pages, one full-page illustration per page, aspect ratio ' + a.id + '. Title: "' + D.title + '".' + (D.story ? ' Story: ' + D.story + '.' : '');
    var lock = 'DESIGN LOCK (identical on every page)\n- Style: ' + D.L.t + '\n- Palette: ' + D.L.pal + '\n- Lighting: ' + D.L.light + '\n- Texture: ' + D.L.tex + '\n- Typography: rounded, friendly storybook lettering\n- Layout: generous negative space and a clear text-safe area, with a soft rounded narration box at the bottom';
    var anchors = D.chars.length ? 'CHARACTER ANCHORS (copy into every page)\n' + D.chars.map(function (c) { return '- ' + bookAnchor(c); }).join('\n') : '';
    var how = 'HOW TO USE\n1. Generate the cover first, then each page in the same chat, in order.\n2. If a page drifts, say: "Match page 1 exactly: same characters, palette, lighting and lettering."';
    var firstPresent = D.chars.slice(0, 2).map(bookAnchor).join('; ');
    var cover = ['COVER', 'Design lock: ' + D.L.t + '; palette: ' + D.L.pal + '; lighting: ' + D.L.light + '; texture: ' + D.L.tex + '.', firstPresent ? 'Characters (draw them exactly like the anchors): ' + firstPresent + '.' : '', 'Scene: ' + (D.story || (D.pages[0] && D.pages[0].scene) || 'the main character in the story setting') + ', with open space at the top for the title.', 'Title, exactly: "' + D.title + '"' + (D.sub ? ' and subtitle, exactly: "' + D.sub + '"' : '') + ' in large rounded friendly lettering, integrated into the sky or the top area.', 'One full-page cover illustration, not a comic with panels.'].filter(Boolean).join('\n');
    var pages = D.pages.map(function (pg) { return bookPage(D, pg, n); });
    var rules = 'RULES FOR EVERY PAGE\nPriority order if anything conflicts: continuity, character consistency, text accuracy, readability. Render all quoted text exactly, with zero typos. Never print field names, labels or instructions as visible text. Do not add watermarks or logos.\nAVOID: multi-panel comic layout, unreadable or overlapping text, gibberish text, inconsistent character design, extra limbs, cluttered composition, text outside the picture area.';
    if (S.tool === 3) return ['Storybook brief', '- ' + head, '- ' + lock.replace(/\n/g, '; '), anchors && '- ' + anchors.replace(/\n/g, '; ')].concat(D.pages.map(function (p) { return '- Page ' + p.n + ': ' + p.scene + (p.text ? ' | "' + p.text + '"' : ''); })).filter(Boolean).join('\n');
    return [head, lock, anchors, how, cover].concat(pages).concat([rules]).filter(Boolean).join('\n\n');
  }
  function composeBookJSON() { var D = bookData(); return JSON.stringify({ type: 'storybook', ratio: aspect().id, title: D.title, subtitle: D.sub, style: D.L.n, design_lock: { style: D.L.t, palette: D.L.pal, lighting: D.L.light, texture: D.L.tex }, character_anchors: D.chars.map(bookAnchor), pages: D.pages, language: D.lang, image_generation_prompt: composeBook() }, null, 2); }
  function composeBookText() { var D = bookData(); return 'STORYBOOK CHECK\n- Is each character identical on every page (fur or hair, eyes, clothes, colours)?\n- Is every narration line spelt exactly as written and easy to read in its box?\n- Do the page numbers run in order, small and in the same place?\n- Does each page have one clear focus and room for the text?\n- Do the palette and lighting stay the same from the cover to the last page?\n\nTIP\nGenerate one page at a time in the same chat. If a face drifts, re-send the character anchor line and ask for a redraw of that page only.'; }
  function composeBookFix() { var D = bookData(), names = D.chars.map(function (c) { return c.name; }).join(' and ') || 'the characters'; return ['CHARACTER LOCK\nKeep this page exactly as it is, but redraw ' + names + ' so they match the character anchors and the cover exactly.', 'STYLE MATCH\nKeep the scene, but match the cover exactly: the same palette, lighting, texture and lettering.', 'SPELLING\nKeep the art, but correct the narration so it reads exactly as in my brief. Change nothing else.', 'TEXT BOX\nKeep the scene, but move the narration into a soft rounded cream box at the bottom, with larger text and no overlap with the characters.', 'ONE FOCUS\nKeep the story moment, but simplify the picture to one clear focus with more empty space.', 'REMOVE EXTRAS\nKeep the page, but remove any watermark, logo, label or text that is not in my brief.'].join('\n\n'); }
  function drawBookPreview() {
    var D = bookData(), a = aspect(), n = (D.pages.length || 4) + 1, W = 1000, cols = Math.min(n, 3), rows = Math.ceil(n / cols), gap = 24, tw = (W - gap * (cols + 1)) / cols, th = tw * a.h / a.w, H = Math.round(gap + rows * (th + gap)), c = pal().c, g = '<rect width="' + W + '" height="' + H + '" fill="#fbf6ea"/>';
    for (var i = 0; i < n; i++) { var x = gap + (i % cols) * (tw + gap), y = gap + Math.floor(i / cols) * (th + gap); g += '<rect x="' + x + '" y="' + y + '" width="' + tw + '" height="' + th + '" rx="14" fill="' + c[i % 2] + '" fill-opacity="' + (i === 0 ? .55 : .25) + '" stroke="#14213d" stroke-width="4"/><rect x="' + (x + 16) + '" y="' + (y + th - 62) + '" width="' + (tw - 32) + '" height="44" rx="14" fill="#fff" fill-opacity=".9"/><text x="' + (x + 18) + '" y="' + (y + 42) + '" font-size="30" font-weight="800" fill="#14213d" font-family="Plus Jakarta Sans,sans-serif">' + (i === 0 ? 'Cover' : 'Page ' + i) + '</text>'; }
    var c1 = $('#canvas'); c1.style.aspectRatio = W + '/' + H; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Storybook page plan">' + g + '</svg>';
    $('#layoutNote').textContent = 'Page plan: the cover and each page, with the narration box at the bottom. Generate them in order in one chat.';
  }
  /* ---------- comic page ---------- */
  function comicData() {
    var f = S.f, v = function (k) { return (f[k] || '').trim(); }, L = lookObj(), lines = function (k, max) { return v(k).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, max); };
    var chars = lines('cchars', 6).map(function (x) { var p = x.split('|'); return { name: (p[0] || '').trim(), look: (p[1] || '').trim() }; });
    var panels = lines('cpanels', 8).map(function (x, i) { var p = x.split('|'); return { n: i + 1, scene: (p[0] || '').trim(), say: (p[1] || '').trim() }; });
    return { story: v('cstory'), chars: chars, panels: panels, layout: v('clayout') || 'a horizontal strip of 4 panels', L: L };
  }
  function composeComic() {
    var D = comicData(), a = aspect(), lang = S.lang === 'Bahasa Melayu' ? 'Bahasa Melayu' : S.lang === 'Bilingual' ? 'English and Bahasa Melayu as written' : 'English';
    var head = 'A ' + a.id + ' comic: ' + D.layout + '.' + (D.story ? ' Story: ' + D.story + '.' : '');
    var style = 'Style: ' + D.L.t + '.';
    var chars = D.chars.length ? 'CHARACTERS (draw each one identically in every panel: same face, hair, clothes and colours)\n' + D.chars.map(function (c) { return '- ' + c.name + ': ' + c.look; }).join('\n') : '';
    var pan = 'PANELS (' + (D.panels.length || 4) + ', in reading order)\n' + (D.panels.length ? D.panels.map(function (p) { return 'Panel ' + p.n + ': ' + p.scene + '.' + (p.say ? (function (s) { var m = s.match(/^([^:]{1,30}):\s*(.+)$/); return m ? ' Speech bubble from ' + m[1].trim() + ', containing exactly: "' + m[2].trim() + '" (do not print the speaker name)' : ' Speech bubble, containing exactly: "' + s + '"'; })(p.say) : ' No speech bubble.'); }).join('\n') : '(add your panels on the left)');
    var rules = 'RULES: all lettering in ' + lang + ', in a large, clear, friendly comic font inside round speech bubbles that never cover faces; only the quoted words appear, spelled exactly; clear panel borders with even gutters; consistent characters and a consistent colour palette in every panel; no extra text, logos or watermarks; natural hands with five fingers.';
    if (S.tool === 3) return ['Comic brief', '- ' + head, '- ' + style, chars && '- ' + chars.replace(/\n/g, '; '), '- ' + pan.replace(/\n/g, '; ')].filter(Boolean).join('\n');
    return [head, style, chars, pan, rules].filter(Boolean).join('\n\n');
  }
  function composeComicJSON() { var D = comicData(); return JSON.stringify({ type: 'comic page', ratio: aspect().id, layout: D.layout, style: D.L.n, story: D.story, characters: D.chars, panels: D.panels, language: S.lang, image_generation_prompt: composeComic() }, null, 2); }
  function composeComicText() { var D = comicData(); return 'COMIC CHECK\n- Are the ' + (D.chars.length || 'main') + ' characters identical in every panel (face, hair, clothes, colours)?\n- Is every speech bubble spelt exactly as written and easy to read at phone size?\n- Do the bubbles avoid covering faces?\n- Do the panels read in the right order, with clear borders?\n- Is the joke or the point clear in the last panel?\n\nONE PAGE AT A TIME\nFor a longer story, keep the CHARACTERS block unchanged and generate each page separately, pasting the characters block again, so the faces stay consistent.'; }
  function composeComicFix() { var D = comicData(), names = D.chars.map(function (c) { return c.name; }).join(' and ') || 'the characters'; return ['CHARACTER LOCK\nKeep the page exactly as it is, but redraw ' + names + ' so they look identical in every panel, as described in the characters block.', 'BIGGER LETTERING\nKeep everything, but make all speech-bubble text about 30% larger and the bubbles clearer, without covering any face.', 'SPELLING\nKeep the art, but correct every speech bubble so it reads exactly as in my brief. Change nothing else.', 'REDRAW ONE PANEL\nKeep all panels exactly the same except panel 2: redraw it with a clearer pose and a stronger expression.', 'CLEANER BORDERS\nKeep the art, but give every panel a clear border and an even gap between panels.', 'NO EXTRAS\nKeep the page, but remove any logos, watermarks, sound effects or text that is not in my brief.'].join('\n\n'); }
  function drawComicPreview() {
    var D = comicData(), a = aspect(), W = 1000, H = Math.round(1000 * a.h / a.w), n = Math.max(3, D.panels.length || 4), c = pal().c, g = '<rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    var strip = /strip|horizontal/i.test(D.layout), cols = strip ? n : (n > 4 ? 2 : 1), rows = Math.ceil(n / cols), gap = 20, pw = (W - gap * (cols + 1)) / cols, ph = (H - gap * (rows + 1)) / rows;
    for (var i = 0; i < n; i++) { var x = gap + (i % cols) * (pw + gap), y = gap + Math.floor(i / cols) * (ph + gap); g += '<rect x="' + x + '" y="' + y + '" width="' + pw + '" height="' + ph + '" rx="8" fill="' + c[i % 2] + '" fill-opacity=".25" stroke="#14213d" stroke-width="5"/><text x="' + (x + 14) + '" y="' + (y + 40) + '" font-size="32" font-weight="800" fill="#14213d" font-family="Plus Jakarta Sans,sans-serif">' + (i + 1) + '</text><ellipse cx="' + (x + pw * .62) + '" cy="' + (y + ph * .26) + '" rx="' + Math.min(pw * .26, 70) + '" ry="' + Math.min(ph * .12, 36) + '" fill="#fff" stroke="#14213d" stroke-width="3"/>'; }
    var c1 = $('#canvas'); c1.style.aspectRatio = a.w + '/' + a.h; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Comic panel layout">' + g + '</svg>';
    $('#layoutNote').textContent = 'Panel sketch with speech-bubble spots. This is the layout, not the final art.';
  }

  /* ---------- sales page image ---------- */
  function salesData() {
    var f = S.f, v = function (k) { return (f[k] || '').trim(); }, L = lookObj();
    var feats = v('sfeats').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 4).map(function (x) { var p = x.split('|'); return { label: (p[0] || '').trim(), icon: (p[1] || '').trim() }; });
    return { visual: v('sproduct') || 'the product as a hero image', head: v('shead') || 'YOUR HEADLINE', badge: v('sbadge'), sub: v('ssub'), feats: feats, cta: v('scta'), edge: v('sedge'), L: L };
  }
  function composeSales() {
    var D = salesData(), a = aspect(), head = 'A ' + a.id + ' product sales-page image designed to convert: one clear path from the picture to the button.';
    var style = 'Style: ' + D.L.t + '.';
    var steps = ['1. Main visual at the TOP CENTRE: ' + D.visual + '.', '2. Headline directly UNDER the visual, nowhere else: "' + D.head + '".'], k = 3;
    if (D.badge) steps.push(k++ + '. Under the headline, a prominent badge with exactly: "' + D.badge + '".');
    if (D.sub) steps.push(k++ + '. Under that, the subheadline: "' + D.sub + '".');
    if (D.feats.length) steps.push(k++ + '. Under that, a row of ' + D.feats.length + ' glowing icon cards, each with its label directly under the icon: ' + D.feats.map(function (x) { return '"' + x.label + '"' + (x.icon ? ' (' + x.icon + ')' : ''); }).join(', ') + '. Each icon uses 3 to 4 rich colours and sits on a soft warm glow.');
    if (D.cta) steps.push(k++ + '. At the bottom, one large button with exactly: "' + D.cta + '".');
    var edge = D.edge && !/no special/i.test(D.edge) ? 'EDGES: ' + D.edge + ', on all four sides.' : '';
    var rules = 'RULES: the order above is strict, so nothing may move out of its place. Only the quoted words appear, spelled exactly and in their original language. All text is flat and frontal, high-contrast and easy to read on a phone. Do not print colour names, hex codes, section labels or instructions. No extra claims, bonuses, prices or logos.';
    if (S.tool === 3) return ['Sales page brief', '- ' + head, '- ' + style].concat(steps.map(function (x) { return '- ' + x; })).concat([edge && '- ' + edge]).filter(Boolean).join('\n');
    return [head, style, 'LAYOUT (strict top-to-bottom order)\n' + steps.join('\n'), edge, rules].filter(Boolean).join('\n\n');
  }
  function composeSalesJSON() { var D = salesData(); return JSON.stringify({ type: 'sales page image', ratio: aspect().id, look: D.L.n, main_visual: D.visual, headline: D.head, badge: D.badge, subheadline: D.sub, features: D.feats, button: D.cta, edges: D.edge, order: ['visual', 'headline', 'badge', 'subheadline', 'features', 'button'], image_generation_prompt: composeSales() }, null, 2); }
  function composeSalesText() { return 'SALES PAGE CHECK\n- Does the eye go visual, headline, price badge, features, button, in that order?\n- Is the price exactly as you wrote it (nothing invented, no extra bonuses)?\n- Is every word spelt exactly as written and readable at phone size?\n- Do the icons show the right objects, each with its label under it?\n- Is the button obvious and the bottom edge clean?\n\nBEFORE YOU PUBLISH\nThe image cannot take payments or links. Put it on your page tool and add a real, clickable button over or under it.'; }
  function composeSalesFix() { var D = salesData(); return ['ORDER', 'Keep the design, but fix the order from top to bottom: main visual, headline, price badge, subheadline, feature icons, button. Move nothing else.'].join('\n').replace(/^ORDER\n/, 'ORDER\n') + '\n\n' + ['SPELLING\nKeep the design, but correct the text so it reads exactly: "' + D.head + '"' + (D.badge ? ', "' + D.badge + '"' : '') + (D.cta ? ' and "' + D.cta + '"' : '') + '.', 'BIGGER BUTTON\nKeep everything, but make the button about 40% larger with a stronger glow and clear contrast.', 'ICON COLOURS\nKeep the layout, but redraw each icon with 3 to 4 rich colours and a soft glow, with a clear label under it.', 'CLEAN EDGES\nKeep the design, but make all four edges a solid colour with a soft feathered blend.', 'NO EXTRAS\nKeep the design, but remove any bonus, price, claim, logo or watermark that is not in my brief.'].join('\n\n'); }
  function drawSalesPreview() {
    var D = salesData(), a = aspect(), W = 1000, H = Math.round(1000 * a.h / a.w), c = pal().c, g = '<rect width="' + W + '" height="' + H + '" fill="#14213d"/><circle cx="' + W / 2 + '" cy="' + H * .2 + '" r="' + H * .13 + '" fill="' + c[1] + '" fill-opacity=".8"/>';
    g += '<text x="' + W / 2 + '" y="' + H * .44 + '" font-size="' + Math.round(H * .045) + '" text-anchor="middle" fill="#fff" font-weight="800" font-family="Plus Jakarta Sans,sans-serif">' + esc(D.head.slice(0, 26)) + '</text><rect x="' + W * .3 + '" y="' + H * .47 + '" width="' + W * .4 + '" height="' + H * .05 + '" rx="' + H * .025 + '" fill="' + c[1] + '"/>';
    var n = Math.max(D.feats.length, 3), cw = (W * .86 - 16 * (n - 1)) / n; for (var i = 0; i < n; i++) g += '<rect x="' + (W * .07 + i * (cw + 16)) + '" y="' + H * .58 + '" width="' + cw + '" height="' + H * .17 + '" rx="18" fill="#fff" fill-opacity=".12" stroke="' + c[1] + '" stroke-opacity=".6"/><circle cx="' + (W * .07 + i * (cw + 16) + cw / 2) + '" cy="' + H * .64 + '" r="' + H * .03 + '" fill="' + c[1] + '"/>';
    g += '<rect x="' + W * .25 + '" y="' + H * .84 + '" width="' + W * .5 + '" height="' + H * .07 + '" rx="' + H * .035 + '" fill="' + c[1] + '"/>';
    var c1 = $('#canvas'); c1.style.aspectRatio = a.w + '/' + a.h; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Sales page order">' + g + '</svg>';
    $('#layoutNote').textContent = 'Strict order: visual, headline, price badge, features, button. This is a sketch of the order, not the final picture.';
  }
  /* ---------- video thumbnail ---------- */
  var THUMB_FONTS = { bold: 'a heavy, chunky sans-serif with a thick outline and a drop shadow', neon: 'glowing neon-tube lettering with a bright outer glow', minimalist: 'a clean, thin geometric sans-serif with generous spacing', handwritten: 'bold hand-lettered marker script', serif: 'a strong high-contrast serif display face', gaming: 'a sharp angular gaming display face with a metallic bevel' };
  function thumbData() {
    var f = S.f, v = function (k) { return (f[k] || '').trim(); }, L = lookObj(), fk = (v('tfont') || 'bold').toLowerCase();
    return { title: v('ttitle') || 'YOUR HOOK', sub: v('tsub'), visual: v('tvisual') || 'a person with a strong reaction', expr: v('texpr') || 'wide-eyed shock', comp: v('tcomp') || 'face on the left, title on the right', font: THUMB_FONTS[fk] || THUMB_FONTS.bold, fontName: fk, L: L, vertical: aspect().id === '9:16' };
  }
  function composeThumb() {
    var D = thumbData(), a = aspect(), tool = S.tool;
    var head = 'A ' + a.id + ' ' + (D.vertical ? 'vertical video cover (Shorts, Reels or TikTok)' : 'video thumbnail') + ' that reads in one glance.';
    var subj = 'Subject: ' + D.visual + '. Reaction: ' + D.expr + '. The face is large and sharp, about 40% of the picture height.';
    var look = 'Style: ' + D.L.t + '. High contrast, saturated colour, a clearly separated subject and a simple background.';
    var lay = 'Layout: ' + D.comp + '. ' + (D.vertical ? 'Keep the title and face inside the safe middle area, away from the top and bottom interface zones.' : 'Keep the bottom-right corner clear for the video timestamp.');
    var text = 'TEXT (spell exactly, original language, nothing else)\n- Hook title: "' + D.title + '" in ' + D.font + ', very large, readable at phone-thumbnail size, in at most 4 short lines' + (D.sub ? '\n- Sub-hook: "' + D.sub + '" on a small contrasting banner' : '');
    var rules = 'Rules: do not add any logos, platform icons, play buttons, LIVE badges, timestamps, usernames or watermarks. No extra words. Natural hands with five fingers.';
    if (tool === 3) return ['Thumbnail brief', '- ' + head, '- ' + subj, '- ' + look, '- ' + lay, '- Title: ' + D.title, D.sub && '- Sub-hook: ' + D.sub, '- ' + rules].filter(Boolean).join('\n');
    return [head, subj, look, lay, text, rules].join('\n\n');
  }
  function composeThumbJSON() { var D = thumbData(); return JSON.stringify({ type: 'video thumbnail', ratio: aspect().id, look: D.L.n, subject: D.visual, reaction: D.expr, layout: D.comp, title: D.title, sub_hook: D.sub, lettering: D.fontName, strict_visual_policy: { visible_text_policy: 'design_text_only', forbidden: ['logos', 'platform icons', 'play buttons', 'LIVE badges', 'timestamps', 'watermarks'] }, image_generation_prompt: composeThumb() }, null, 2); }
  function composeThumbText() {
    var D = thumbData(), words = D.title.split(/\s+/).filter(Boolean).length;
    return 'THUMBNAIL CHECK\n- Shrink the picture to about 160 px wide: can you still read the title and see the face? ' + (words > 4 ? '(Your title has ' + words + ' words; try 4 or fewer.)' : '(Title length is fine: ' + words + ' words.)') + '\n- Is the reaction on the face clear and exaggerated enough?\n- Is the title spelt exactly as written, in one language?\n- Is there strong contrast between the subject, the title and the background?\n- No logos, play buttons, LIVE badges or timestamps were invented by the tool?\n- Is the corner for the video timestamp clear?\n\nMAKE 4 VARIATIONS\nSwap the Layout line between the four layouts under Quick swap and generate each one. Pick the one that reads fastest at small size.';
  }
  function composeThumbFix() {
    var D = thumbData();
    return ['REMOVE BADGES\nKeep the thumbnail exactly as it is, but remove any logos, play buttons, LIVE badges, timestamps or watermarks.', 'BIGGER TITLE\nKeep everything, but make the title "' + D.title + '" about 30% larger with a thicker outline, and keep it inside the safe area.', 'MORE CONTRAST\nKeep the layout, but increase the contrast between the subject, the title and the background, and add a soft glow behind the subject.', 'FLIP LAYOUT\nKeep the same subject and style, but swap sides: put the face on the opposite side and the title on the remaining side.', 'SPELLING\nKeep the design, but correct the text so it reads exactly: "' + D.title + '"' + (D.sub ? ' and "' + D.sub + '"' : '') + '.', 'BIGGER REACTION\nKeep everything, but make the facial reaction ' + D.expr + ' stronger and the face larger.'].join('\n\n');
  }
  function drawThumbPreview() {
    var D = thumbData(), a = aspect(), W = 1000, H = Math.round(1000 * a.h / a.w), c = pal().c, left = /left/i.test(D.comp.split(',')[0]) && /face/i.test(D.comp.split(',')[0]), center = /centred|center|middle/i.test(D.comp);
    var g = '<defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="' + W + '" height="' + H + '" fill="url(#tg)"/>';
    var fx = center ? W * .5 : left ? W * .27 : W * .73, fy = H * (center ? .62 : .5), fr = Math.min(W, H) * (center ? .27 : .3);
    g += '<circle cx="' + fx + '" cy="' + fy + '" r="' + fr + '" fill="#fff" fill-opacity=".92"/><ellipse cx="' + (fx - fr * .3) + '" cy="' + (fy - fr * .1) + '" rx="' + fr * .1 + '" ry="' + fr * .16 + '" fill="#14213d"/><ellipse cx="' + (fx + fr * .3) + '" cy="' + (fy - fr * .1) + '" rx="' + fr * .1 + '" ry="' + fr * .16 + '" fill="#14213d"/><ellipse cx="' + fx + '" cy="' + (fy + fr * .38) + '" rx="' + fr * .16 + '" ry="' + fr * .2 + '" fill="#14213d"/>';
    var tx = center ? W * .5 : left ? W * .74 : W * .27, ty = center ? H * .2 : H * .42, size = Math.round(Math.min(W, H) * (D.vertical ? .1 : .12)); var words = D.title.toUpperCase().split(/\s+/).slice(0, 6), lines = [], cur = ''; words.forEach(function (w) { if ((cur + ' ' + w).trim().length > 9 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) lines.push(cur);
    lines.slice(0, 4).forEach(function (l, i) { g += '<text x="' + tx + '" y="' + (ty + i * size * 1.1) + '" font-size="' + size + '" text-anchor="middle" fill="#fff" stroke="#14213d" stroke-width="' + size * .12 + '" paint-order="stroke" font-family="Plus Jakarta Sans,sans-serif" font-weight="900">' + esc(l) + '</text>'; });
    g += '<rect x="' + (W - 190) + '" y="' + (H - 70) + '" width="160" height="44" rx="10" fill="#000" fill-opacity=".25" stroke="#fff" stroke-dasharray="6 6"/><text x="' + (W - 110) + '" y="' + (H - 40) + '" font-size="20" text-anchor="middle" fill="#fff" font-family="JetBrains Mono,monospace">timestamp</text>';
    var c1 = $('#canvas'); c1.style.aspectRatio = a.w + '/' + a.h; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Thumbnail layout">' + g + '</svg>';
    $('#layoutNote').textContent = 'Layout sketch: face, title and the corner kept clear for the video timestamp. Not the final picture.';
  }
  /* ---------- infographic planner ---------- */

  /* ---------- exact data maths (never invented) ---------- */
  function dataStats(facts) {
    var rows = [], unitKey = null, ok = true;
    facts.forEach(function (x) {
      var m = String(x.value).match(/^\s*([A-Za-z$£€]{0,3})\s*(-?\d[\d,]*\.?\d*)\s*([A-Za-z%]{0,8})\s*$/);
      if (!m) return; var num = parseFloat(m[2].replace(/,/g, '')); if (isNaN(num)) return;
      var key = (m[1] + '|' + m[3]).toLowerCase(); if (unitKey === null) unitKey = key; else if (unitKey !== key) ok = false;
      rows.push({ label: x.label, num: num, pre: m[1], post: m[3] });
    });
    if (rows.length < 2 || !ok) return null;
    var pre = rows[0].pre, post = rows[0].post, isPct = post === '%';
    var fmt = function (n) { var r = Math.round(n * 100) / 100, s = Math.abs(r) >= 1000 || r % 1 === 0 ? r.toLocaleString('en-US', { maximumFractionDigits: 2 }) : String(r); return pre + (pre && pre.length > 1 ? ' ' : '') + s + (post ? (post === '%' ? '%' : ' ' + post) : ''); };
    var total = rows.reduce(function (s, r) { return s + r.num; }, 0), sorted = rows.slice().sort(function (x, y) { return y.num - x.num; });
    var out = { rows: sorted.map(function (r) { return { label: r.label, value: fmt(r.num), share: isPct ? null : Math.round(r.num / total * 1000) / 10 + '%' }; }), average: fmt(total / rows.length), highest: sorted[0].label + ' (' + fmt(sorted[0].num) + ')', lowest: sorted[sorted.length - 1].label + ' (' + fmt(sorted[sorted.length - 1].num) + ')', gap: fmt(sorted[0].num - sorted[sorted.length - 1].num) };
    if (!isPct) out.total = fmt(total);
    return out;
  }
  function infoData() {
    var f = S.f, v = function (k) { return (f[k] || '').trim(); }, L = lookObj();
    var steps = v('isteps').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 8).map(function (x, i) { var p = x.replace(/^\d+[.)]\s*/, '').split('|').map(function (y) { return y.trim(); }); return { n: i + 1, label: p[0] || '', detail: p[1] || '', icon: p[2] || '' }; });
    var facts = v('ifacts').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 4).map(function (x) { var p = x.split('|').map(function (y) { return y.trim(); }); return { label: p[0] || '', value: p[1] || '' }; });
    var impact = v('iimpact').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 3).map(function (x) { var p = x.split('|').map(function (y) { return y.trim(); }); return { title: p[0] || '', text: p[1] || '' }; });
    var ingr = v('iingr').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 10);
    return { title: v('itopic') || 'Your topic', sub: v('isub'), steps: steps, facts: facts, impact: impact, ingr: ingr, time: v('itime'), data: dataStats(facts), hero: v('ihero'), source: v('isource'), credit: v('ibrand'), L: L };
  }

  function composeInfoCarousel() {
    var D = infoData(), a = aspect(), L = D.L, f = S.f, ch = (f.ichar || '').trim(), n = D.steps.length, extra = D.impact.length ? 1 : 0, total = n + extra;
    if (!n) return 'Add your steps on the left (one per line: Label | detail | icon idea) and each step becomes one slide.';
    var head = 'A ' + total + '-slide carousel, aspect ratio ' + a.id + ', titled "' + D.title + '"' + (D.sub ? ' (' + D.sub + ')' : '') + '. One step per slide.';
    var lock = 'DESIGN LOCK (identical on every slide)\n- Style: ' + L.t + '\n- Palette: ' + L.pal + '\n- Typography: bold rounded sans-serif for titles and a clean sans-serif for captions, flat and frontal' + (ch ? '\n- Character, drawn identically on every slide: ' + ch : '') + '\n- Layout: small topic header at the top, one large step visual in the middle, a caption box under it, a footer strip at the bottom' + (L.k ? '\n- Audience: children; simple words, friendly shapes, nothing scary' : '');
    var how = 'HOW TO USE\n1. Generate the slides in order in one chat, pasting the design lock with each one.\n2. If a slide drifts, say: "Match slide 1 exactly: same style, palette, character and lettering."';
    var slides = D.steps.map(function (s) {
      return ['SLIDE ' + s.n + ' of ' + total, 'Header (small): "' + D.title + '"; step number "' + s.n + '" in a badge.', 'Main visual: ' + (s.icon ? s.icon : 'the action of this step') + (ch ? ', with the same character performing the step' : '') + '.', 'Caption box, exactly: "' + s.label + '"' + (s.detail ? ' as the title and "' + s.detail + '" below it' : '') + '.', D.credit ? 'Footer, exactly: "' + D.credit + '".' : '', 'Page number "' + s.n + '/' + total + '" small, bottom right' + (s.n < total ? ', and a small swipe cue "Swipe \u2192"' : '') + '.', s.n === n && !extra && D.source ? 'Source line, small, exactly: "Source: ' + D.source + '".' : ''].filter(Boolean).join('\n');
    });
    if (extra) slides.push(['SLIDE ' + total + ' of ' + total + ' (closing)', 'Header (small): "' + D.title + '".', 'Why it matters, as ' + D.impact.length + ' cards, exactly: ' + D.impact.map(function (x) { return '"' + x.title + '": "' + x.text + '"'; }).join('; ') + '.', D.credit ? 'Footer, exactly: "' + D.credit + '".' : '', 'Page number "' + total + '/' + total + '" small, bottom right.', D.source ? 'Source line, small, exactly: "Source: ' + D.source + '".' : ''].filter(Boolean).join('\n'));
    var rules = 'RULES FOR EVERY SLIDE\nOnly the quoted words appear, spelled exactly and in their original language. Text is flat and frontal, never tilted or 3D-extruded. Never print section labels, hex codes or instructions. One clear visual focus per slide with clear space for the caption. Same character, palette and lettering on every slide. No extra facts, no watermarks.';
    return [head, lock, how].concat(slides).concat([rules]).join('\n\n');
  }
  function composeInfo() {
    if (/carousel/i.test(S.f.icar || '')) return composeInfoCarousel();
    var D = infoData(), a = aspect(), L = D.L, tool = S.tool;
    var stepTxt = D.steps.length ? D.steps.map(function (s) { return s.n + '. "' + s.label + '"' + (s.detail ? ': "' + s.detail + '"' : '') + (s.icon ? ' (draw: ' + s.icon + ')' : ''); }).join('\n') : '(add your steps on the left)';
    var factTxt = D.facts.map(function (x) { return '- "' + x.label + '": "' + x.value + '"'; }).join('\n');
    var head = 'A ' + a.id + ' infographic poster titled "' + D.title + '"' + (D.sub ? ' with the subtitle "' + D.sub + '"' : '') + '.';
    var style = 'Style: ' + L.t + '. Palette: ' + L.pal + (S.real && L.n === 'Macro photo' ? ', with true material texture and no plastic gloss' : '') + '.';
    var lay = 'Layout: ' + L.lay + (D.steps.length ? ' (' + D.steps.length + ' steps)' : '') + '. Hierarchy: title first, then numbered step labels, then the short details. ' + (D.hero ? 'Hero visual: ' + D.hero + '.' : 'Give it one hero visual that shows the finished result.');
    var steps = 'STEPS (draw each as a numbered scene or row; spell every word exactly as written)\n' + stepTxt;
    var facts = D.facts.length ? 'KEY NUMBERS (show as round or pill-shaped callout cards, each with a small icon; never change the values)\n' + factTxt : '';
    var kids = L.k ? 'Audience: children. Use simple words, short panels, friendly rounded shapes and warm safe colours. Nothing scary.' : '';
    var impact = D.impact.length ? 'WHY IT MATTERS (a strip of ' + D.impact.length + ' cards near the bottom)\n' + D.impact.map(function (x) { return '- "' + x.title + '": "' + x.text + '"'; }).join('\n') : '';
    var ingrTxt = D.ingr.length ? 'INGREDIENTS (a tidy list panel with small icons)\n' + D.ingr.map(function (x) { return '- "' + x + '"'; }).join('\n') + (D.time ? '\nTime and tip line: "' + D.time + '"' : '') : (D.time ? 'Time and tip line: "' + D.time + '"' : '');
    var dataTxt = D.data ? 'DATA PANEL (these values were computed exactly; show them as sorted horizontal bars' + (D.data.total ? ' plus a donut chart of the shares' : '') + ', and add no other numbers or metrics)\n' + D.data.rows.map(function (r) { return '- "' + r.label + '": "' + r.value + '"' + (r.share ? ' (' + r.share + ' of the total)' : ''); }).join('\n') + (D.data.total ? '\nTotal: "' + D.data.total + '"' : '') + '\nAverage: "' + D.data.average + '"\nHighest: "' + D.data.highest + '"\nLowest: "' + D.data.lowest + '"\nGap between highest and lowest: "' + D.data.gap + '"' : '';
    var foot = [D.source ? 'Source line: "Source: ' + D.source + '"' : '', D.credit ? 'Credit line at the bottom centre: "' + D.credit + '"' : ''].filter(Boolean).join('. ');
    var rules = 'TEXT RULES: only the quoted words may appear in the picture, exactly as written and in their original language (do not translate or reword them). Put text on flat, high-contrast panels with nothing blurred behind it, keep every sentence short (14 words or fewer), leave clear space around each text block, keep numbers consistent and icons in one style. Never print hex codes, colour names, style words, icon names or any instruction. No extra facts, no garbled words, no watermarks. Text is flat and frontal, never tilted, curved or 3D-extruded. Arrows and connectors appear only between real steps of a process, and each icon shows the exact object it names. Brief labels such as STEPS, KEY NUMBERS or WHY IT MATTERS are instructions and must never be printed.';
    if (tool === 3) return ['Infographic brief', '- ' + head, '- ' + style, '- ' + lay, '- Steps: ' + (D.steps.map(function (s) { return s.n + ' ' + s.label; }).join('; ') || 'none yet'), factTxt && '- Key numbers: ' + D.facts.map(function (x) { return x.label + ' = ' + x.value; }).join('; '), foot && '- ' + foot].filter(Boolean).join('\n');
    return [head, style, kids, lay, ingrTxt, steps, facts, dataTxt, impact, foot, rules].filter(Boolean).join('\n\n');
  }
  function composeInfoJSON() {
    var D = infoData();
    return JSON.stringify({ design_specification: { style: D.L.n + ': ' + D.L.t, palette: D.L.pal, ratio: aspect().id }, topic_info: { title: D.title, subtitle: D.sub, source: D.source, hero: D.hero }, branding: { credit: D.credit }, content_structure: { layout_note: D.L.lay, steps: D.steps, ingredients: D.ingr, time_note: D.time, key_numbers: D.facts, computed_data: D.data, why_it_matters: D.impact }, strict_visual_policy: { visible_text_policy: 'design_text_only', forbidden_text: ['hex colour codes', 'rgb values', 'colour names', 'icon names', 'style or material descriptions', 'prompt keywords', 'instructions'], violation_handling: 'remove all forbidden text from the picture' }, negative_prompt: ['blurry text', 'misspelt words', 'extra text', 'cluttered layout', 'watermarks'], image_generation_prompt: composeInfo() }, null, 2);
  }
  function composeInfoText() {
    var D = infoData();
    return 'PLAN IT WITH AI (paste this into any chatbot, then paste its lines into the boxes on the left)\n\nAct as an infographic planner. Topic: ' + (D.title === 'Your topic' ? '[type your topic]' : D.title) + '. Language: ' + S.lang + '.\nReturn only these blocks, in this exact format:\nSUBTITLE: one short line\nSTEPS: 5 lines, each as  Label | detail of at most 18 words | icon idea\nKEY NUMBERS: 2 or 3 lines, each as  Label | value\nWHY IT MATTERS: 3 lines, each as  Title | one short sentence\nINGREDIENTS: only if the topic is a recipe, one per line with the amount\nTIME: time, servings or one tip, one short line\nHERO: one sentence describing the main picture\nSOURCE: where the facts can be checked\n\nRules: use only facts you are confident about. Add (verify) after every number or statistic and say where to check it. Never invent a source or a statistic.\n\n---\nCHECK THE RESULT\n- Is every step label and detail spelt exactly as written?\n- Are the numbers exactly the ones you supplied, and are they true? Check them against the source before posting.\n- Are the step numbers in the right order and the icons in one style?\n- Is there enough space around the text, and is it readable at phone size?';
  }
  function drawInfoPreview() {
    var D = infoData(), a = aspect(), W = 1000, H = Math.round(1000 * a.h / a.w), c = pal().c, n = Math.max(D.steps.length, 3), g = '<defs><linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="' + W + '" height="' + H + '" fill="#f3f7ff"/><rect width="' + W + '" height="' + (H * .17) + '" fill="url(#ig)"/><text x="50" y="' + (H * .1) + '" font-size="46" fill="#fff" font-family="Plus Jakarta Sans,sans-serif" font-weight="800">' + esc(D.title.slice(0, 34)) + '</text>';
    var top = H * .21, gap = (H * .62) / n, rh = Math.min(gap - 14, 120);
    for (var i = 0; i < n; i++) { var s = D.steps[i], y = top + i * gap; g += '<rect x="50" y="' + y + '" width="' + (W - 100) + '" height="' + rh + '" rx="26" fill="#fff" stroke="#cfe0ff" stroke-width="3"/><circle cx="' + (50 + rh / 2) + '" cy="' + (y + rh / 2) + '" r="' + (rh * .33) + '" fill="url(#ig)"/><text x="' + (50 + rh / 2) + '" y="' + (y + rh / 2 + 12) + '" font-size="34" text-anchor="middle" fill="#fff" font-weight="800" font-family="Plus Jakarta Sans,sans-serif">' + (i + 1) + '</text><text x="' + (50 + rh + 20) + '" y="' + (y + rh / 2 + 10) + '" font-size="32" fill="#14213d" font-family="Plus Jakarta Sans,sans-serif" font-weight="700">' + esc(s ? s.label.slice(0, 38) : 'Step ' + (i + 1)) + '</text>'; }
    var fy = H * .87; (D.facts.length ? D.facts : [{ label: 'Key number', value: '' }]).slice(0, 3).forEach(function (x, i, arr) { var w = (W - 100 - (arr.length - 1) * 16) / arr.length; g += '<rect x="' + (50 + i * (w + 16)) + '" y="' + fy + '" width="' + w + '" height="' + (H * .1) + '" rx="22" fill="#14213d"/><text x="' + (50 + i * (w + 16) + 20) + '" y="' + (fy + H * .06) + '" font-size="26" fill="#fff" font-family="Plus Jakarta Sans,sans-serif" font-weight="700">' + esc(x.label.slice(0, 20)) + '</text>'; });
    var c1 = $('#canvas'); c1.style.aspectRatio = a.w + '/' + a.h; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Infographic layout">' + g + '</svg>';
    $('#layoutNote').textContent = 'Layout sketch: title band, numbered steps, key-number cards. The look you pick decides how it is drawn.';
  }
  function composeStory() {
    var D = storyData(), a = aspect();
    var head = 'STORYBOARD: ' + D.idea.toUpperCase() + '\n' + D.secs + ' seconds · ' + D.n + ' scenes · ' + a.id + ' · ' + D.look.n;
    var dir = 'VISUAL DIRECTION\n- Style: ' + D.look.t + '.\n- Light: ' + D.light + '.\n- Background: ' + D.back + '.\n- Camera: ' + D.cam + '.\n- Sound: ' + D.audio + '.\n- Mood: ' + D.mood + '.\n- Continuity: the same subject, colours, hands, surface and light in every scene.';
    var sc = D.scenes.map(function (s) { return 'SCENE ' + ('0' + s.i).slice(-2) + ': ' + s.name.toUpperCase() + '  [' + s.t0 + '-' + s.t1 + ']\nVisual: ' + s.mo + '.\nCamera: ' + s.cam + '.\nSound: ' + D.audio.split(';')[0] + '.'; }).join('\n\n');
    var lock = 'Same subject, same ' + D.back.replace(/^an? /, '') + ', same light and colours as the previous scene.';
    var pr = D.scenes.map(function (s) { return 'SCENE ' + s.i + ' PROMPT\nDuration: ' + s.dur + ' seconds. ' + a.id + ' video, ' + D.look.t + '.\n' + (s.i > 1 ? lock + ' ' : '') + s.name + ': ' + s.mo + '. Video idea: ' + D.idea + '.\nCamera: ' + s.cam + '. Light: ' + D.light + '. Background: ' + D.back + '.\nAudio: ' + D.audio + '.\nNatural movement, real textures, no text on screen, no logos.'; }).join('\n\n');
    if (S.tool === 3) return head + '\n\n' + dir + '\n\n' + sc;
    return head + '\n\n' + dir + '\n\n1. STORYBOARD\n\n' + sc + '\n\n2. VIDEO PROMPT PER SCENE (generate each one separately, in order)\n\n' + pr;
  }
  function drawStoryPreview() {
    var D = storyData(), W = 1000, H = 420, c = pal().c, n = D.n, gap = 14, w = (W - gap * (n + 1)) / n, g = '<defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="' + W + '" height="' + H + '" fill="#0b0b16"/>';
    D.scenes.forEach(function (s, i) { var x = gap + i * (w + gap); g += '<rect x="' + x + '" y="40" width="' + w + '" height="260" rx="14" fill="url(#sg)" fill-opacity="' + (0.35 + 0.65 * i / Math.max(1, n - 1)) + '"/><text x="' + (x + 12) + '" y="78" font-size="26" fill="#fff" font-family="Bricolage Grotesque,sans-serif" font-weight="800">' + ('0' + s.i).slice(-2) + '</text><text x="' + (x + 12) + '" y="332" font-size="' + (n > 6 ? 15 : 19) + '" fill="#fff" font-family="Space Grotesk,sans-serif">' + esc(s.name) + '</text><text x="' + (x + 12) + '" y="360" font-size="16" fill="#b9b3d6" font-family="JetBrains Mono,monospace">' + s.t0 + '-' + s.t1 + '</text>'; });
    g += '<rect x="' + gap + '" y="392" width="' + (W - 2 * gap) + '" height="6" rx="3" fill="#fff" fill-opacity=".15"/>';
    var c1 = $('#canvas'); c1.style.aspectRatio = W + '/' + H; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Storyboard timeline">' + g + '</svg>';
    $('#layoutNote').textContent = 'Timeline of ' + D.n + ' scenes across ' + D.secs + ' seconds. Generate each scene as its own clip, in order, and keep the continuity line.';
  }
  function composeProduct() {
    var f = S.f, L = lookObj(), a = aspect(), v = function (k) { return (f[k] || '').trim(); };
    var s1 = 'A natural-looking ' + a.id + ' product photograph of ' + (v('product') || 'a product') + (v('angle') ? ', ' + v('angle') : '') + '.';
    var set = 'Setting: ' + (v('surface') || 'a simple, believable surface') + (v('props') ? ', with ' + v('props') : ', and no distracting props') + '.';
    var light = 'Light: ' + (v('light') || L.light) + '.', cam = 'Camera: ' + (v('camera') || L.cam) + '.';
    var mood = 'Mood: ' + (v('mood') || (S.moods.join(', ').toLowerCase() || 'clean')) + '. Look: ' + L.t + '.';
    var real = S.real ? 'Make it read as a real photograph: true material texture (paper, plastic, glass, fabric), correct reflections, a soft contact shadow where the product touches the surface, and accurate colour. No plastic gloss, no glow, no filler like "ultra realistic" or "8k".' : '';
    var keep = 'Keep the product shape and packaging simple and unchanged; leave any label area clean so the real label can be added afterwards.';
    var avoid = 'Avoid: misspelt or invented text on the packaging, warped logos, floating objects, double shadows, melted edges, extra items that were not asked for, watermarks.';
    var tool = S.tool;
    if (tool === 1) return [s1, '', 'PRODUCT\n' + keep, '', 'SETTING AND LIGHT\n' + set + ' ' + light, '', 'CAMERA AND LOOK\n' + cam + ' ' + mood, '', real, 'Size: ' + a.id + '.', avoid].join('\n');
    if (tool === 3) return ['Product photo brief', '- ' + s1, '- ' + keep, '- ' + set, '- ' + light, '- ' + cam, '- ' + mood, real && '- ' + real, '- ' + avoid].filter(Boolean).join('\n');
    return [s1, keep, set, light + ' ' + cam, mood, real, 'Aspect ratio ' + a.id + '.', avoid].filter(Boolean).join('\n\n');
  }
  function composePhoto() {
    if (isBook()) return composeBook();
    if (isComic()) return composeComic();
    if (isDeck()) return composeDeck();
    if (isSales()) return composeSales();
    if (isThumb()) return composeThumb();
    if (isInfo()) return composeInfo();
    if (isStory()) return composeStory();
    if (isProduct()) return composeProduct();
    var f = S.f, L = lookObj(), a = aspect(), v = function (k) { return (f[k] || '').trim(); };
    var s1 = (L.cg ? 'A hyper-real ' + a.id + ' cinematic render of ' : 'A natural-looking ' + a.id + ' photograph of ') + (v('subject') || 'a person') + (v('expression') ? ', ' + v('expression') : '') + (v('pose') ? ', ' + v('pose') : '') + '.';
    var s2 = v('outfit') ? 'Wearing ' + v('outfit') + '.' : ''; var s3 = v('hair') ? 'Hair and makeup: ' + v('hair') + '.' : '';
    var place = 'Setting: ' + (v('location') || 'a simple, believable location') + '.';
    var sc = v('pscene').toLowerCase(), scene = '';
    if (/faceless/.test(sc)) scene = 'FACELESS: do not show the face. Show hands, a back view, a silhouette or a crop below the eyes, so the picture works for a creator who stays anonymous.';
    else if (/b-roll.*(no people|tanpa)|no people/.test(sc)) scene = 'B-ROLL, NO PEOPLE: an environment or object shot that supports a video, such as a desk, a cup, a street or tools, with no person in the frame and room to add text.';
    else if (/b-roll/.test(sc)) scene = 'B-ROLL WITH PEOPLE: a candid supporting shot with people small or partly in frame, doing a natural activity, with room to add text.';
    else if (/family|keluarga/.test(sc)) scene = 'FAMILY: a warm family portrait; keep every person recognisable and the poses natural and relaxed.';
    else if (/korea/.test(sc)) scene = 'KOREAN-STYLE EDITORIAL: soft, clean, bright editorial look with pastel tones, gentle skin retouching and relaxed styling.';
    else if (/fun|playful/.test(sc)) scene = 'FUN: playful energy, a candid laugh or jump, bright colour and a lively background.';
    else if (/indoor/.test(sc)) scene = 'INDOOR STUDIO: a controlled indoor set with soft light and a clean backdrop.';
    else if (/outdoor/.test(sc)) scene = 'OUTDOOR: natural outdoor light and a believable location.';
    var refMap = [[/face|wajah/, 'the person face: keep the likeness exact'], [/outfit|baju|clothes/, 'the outfit: copy the clothing only'], [/pose/, 'the pose: copy the body pose only'], [/mood|light|suasana/, 'the mood and lighting only']], refs = v('prefs').split(/,/).map(function (x) { return x.trim(); }).filter(Boolean);
    var refTxt = refs.length ? 'ATTACHED IMAGES (in this order)\n' + refs.map(function (r, i) { var hit = refMap.filter(function (m) { return m[0].test(r.toLowerCase()); })[0]; return 'Image ' + (i + 1) + ': ' + (hit ? hit[1] : r) + '.'; }).join('\n') + '\nDo not copy anything else from the reference images.' : '';
    if (scene) place += ' ' + scene;
    if (refTxt) place += '\n' + refTxt;
    var light = 'Light: ' + (v('light') || L.light) + '.', cam = 'Camera: ' + (v('camera') || L.cam) + '.';
    var mood = 'Mood: ' + (v('mood') || (S.moods.join(', ').toLowerCase() || 'natural')) + '. Look: ' + L.t + '.';
    var real = S.real && L.cg ? 'Keep it believable: true proportions, skin with pores and small asymmetries, natural hands with the right number of fingers, light that comes from a visible source, no plastic smoothing and no cartoon exaggeration. Do not use filler like "ultra realistic" or "8k".' : S.real ? 'Make it read as a real photograph: believable skin with pores, small asymmetries and flyaway hairs, natural hands with the right number of fingers, light that comes from a visible source, no plastic smoothing and no glow. Do not use filler like "ultra realistic" or "8k".' : '';
    var avoid = 'Avoid: extra or fused fingers, uncanny eyes, plastic skin, mannequin stiffness, text, watermarks, logos, warped background details, duplicated jewellery.';
    var tool = S.tool;
    if (tool === 1) return [s1, '', 'SUBJECT AND STYLING\n' + [s2, s3].filter(Boolean).join(' '), '', 'PLACE AND LIGHT\n' + place + ' ' + light, '', 'CAMERA AND LOOK\n' + cam + ' ' + mood, '', real, 'Size: ' + a.id + '.', avoid].filter(function (x, i, arr) { return x !== '' || (arr[i - 1] !== ''); }).join('\n');
    if (tool === 3) return ['Photo brief', '- ' + s1, s2 && '- ' + s2, s3 && '- ' + s3, '- ' + place, '- ' + light, '- ' + cam, '- ' + mood, real && '- ' + real, '- ' + avoid].filter(Boolean).join('\n');
    return [s1, [s2, s3].filter(Boolean).join(' '), place, light + ' ' + cam, mood, real, 'Aspect ratio ' + a.id + '.', avoid].filter(Boolean).join('\n\n');
  }

  /* ---------- NotebookLM slide styles: a YAML prompt for the Slide Deck custom instructions ---------- */
  function yq(s) { return JSON.stringify(String(s)); }
  function yList(arr, ind) { return arr.map(function (x) { return ind + '- ' + yq(x); }).join('\n'); }
  function deckData() {
    var f = S.f, v = function (k) { return (f[k] || '').trim(); }, L = lookObj(), lines = function (k) { return v(k).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 8); };
    var fmt = v('dform') || SWAPS.dform[0];
    return { L: L, topic: v('dtopic'), aud: v('daud'), goal: v('dgoal'), len: v('dslides') || 'about 10 to 12 slides', fmt: fmt, reading: /reading|detailed|pdf/i.test(fmt), lang: v('dlang') || 'English', must: lines('dmust'), not: lines('dnot'), foot: v('dfoot'), compact: /compact/i.test(v('dsize')) };
  }
  function deckTemplates(D) {
    var L = D.L, P = L.pal, bg = P[1][1].toLowerCase(), ac = P[3][1].toLowerCase();
    return [
      ['Cover', 'opening slide', ['Large title on the ' + bg + ' background in the ' + L.n + ' style', 'One short subtitle and the footer line', 'One strong visual that matches the topic']],
      ['Key_message', 'one big idea per slide', ['Title: ' + L.title, 'Body: one supporting visual and at most ' + (D.reading ? '90' : '35') + ' words', 'Layout: ' + L.shape]],
      ['Three_points', 'three parallel ideas', ['Three equal cards, each with an icon, a two-to-four-word heading and one sentence', 'Cards use: ' + L.shape, 'Highlight only the most important card with the ' + ac]],
      ['Data_insight', 'a number or chart that proves a point', ['One chart or one giant number, never both competing', 'A short callout in ' + ac + ' that says what the data means', 'Source and date in the footer']],
      ['Process_or_timeline', 'steps, stages or history', ['A single left-to-right or top-to-bottom path with numbered steps', 'One short label and at most one sentence per step', 'Arrows only where something truly moves from one step to the next']],
      ['Comparison', 'two options, before and after, or old and new', ['Two columns of equal size with matching rows', 'One verdict line at the bottom', 'Same colours for the same things on both sides']],
      ['Summary_and_next_steps', 'closing slide', ['The three things to remember', 'One clear next step for the audience', 'Contact or credit line in the footer']]
    ];
  }
  function composeDeck() {
    var D = deckData(), L = D.L, P = L.pal, o = [];
    var col = function (i) { return '"' + P[i][0] + '"  # ' + P[i][1]; };
    o.push('# NotebookLM slide style: ' + L.n + ' (' + L.cat + ')');
    o.push('# Paste into: Studio > Slide Deck > pencil icon > custom instructions');
    o.push('deck_brief:');
    o.push('  focus: ' + yq(D.topic || 'Use only the sources I uploaded and decide the main storyline from them'));
    if (D.aud) o.push('  audience: ' + yq(D.aud));
    if (D.goal) o.push('  goal_after_viewing: ' + yq(D.goal));
    o.push('  length: ' + yq(D.len));
    o.push('  format: ' + yq(D.fmt));
    o.push('  language: ' + yq(D.lang));
    if (D.must.length) { o.push('  must_include:'); o.push(yList(D.must, '    ')); }
    if (D.not.length) { o.push('  leave_out:'); o.push(yList(D.not, '    ')); }
    if (D.foot) o.push('  footer_line: ' + yq(D.foot));
    o.push('design_system:');
    o.push('  style_name: ' + yq(L.n));
    o.push('  theme: ' + yq(L.t));
    o.push('  typography:');
    o.push('    titles: ' + yq(L.head)); o.push('    subtitles: ' + yq(L.sub)); o.push('    body: ' + yq(L.body));
    o.push('  colours:');
    ['primary', 'background', 'text', 'accent', 'support'].forEach(function (k, i) { o.push('    ' + k + ': ' + col(i)); });
    o.push('  visual_elements:'); o.push(yList(L.vis, '    '));
    o.push('  imagery: ' + yq(L.img));
    var words = D.reading ? 90 : 35;
    if (!D.compact) {
      o.push('slide_templates:');
      deckTemplates(D).forEach(function (t) { o.push('  - type: ' + t[0]); o.push('    usage: ' + yq(t[1])); o.push('    components:'); o.push(yList(t[2], '      ')); });
    } else o.push('slide_types: ' + yq('Cover, key message, three points, data insight, process or timeline, comparison, summary and next steps'));
    var rules = ['Titles: ' + L.title + '.', 'One main idea per slide with at most ' + words + ' words of body text.', 'Keep the same palette, fonts, margins and icon style on every slide.', 'Write all slide text in ' + D.lang + '; keep names and quoted terms in their original language.'];
    if (!D.compact) rules = rules.concat(['Vary the layout between neighbouring slides, but never change the style.', 'Charts: label the axes, start bars at zero and highlight a single insight with the accent colour.', 'Text must stay readable on a phone: no tiny captions, and no text over a busy photo without a solid or darkened panel.', 'Open with a cover, add an agenda only if the deck has more than 8 slides, and end with a summary and one next step.']);
    o.push('content_rules:'); o.push(yList(rules, '  '));
    var guards = ['Use only facts, numbers, names and quotes that appear in my uploaded sources; never invent statistics, dates or claims.', 'Put a short source note in the footer of any slide that shows a number or a claim.', 'No watermarks, no logos that are not in my sources, and no real people unless a source image shows them.'];
    if (!D.compact) guards.push('If the sources do not cover something I asked for, leave a clear placeholder slide note instead of guessing.');
    o.push('guardrails:'); o.push(yList(guards, '  '));
    return o.join('\n');
  }
  function composeDeckJSON() {
    var D = deckData(), L = D.L;
    return JSON.stringify({ type: 'NotebookLM slide deck style', style: L.n, category: L.cat, best_for: L.best, brief: { focus: D.topic, audience: D.aud, goal: D.goal, length: D.len, format: D.fmt, language: D.lang, must_include: D.must, leave_out: D.not, footer: D.foot }, colours: { primary: L.pal[0], background: L.pal[1], text: L.pal[2], accent: L.pal[3], support: L.pal[4] }, typography: { titles: L.head, subtitles: L.sub, body: L.body }, visual_elements: L.vis, imagery: L.img, slide_templates: deckTemplates(D).map(function (t) { return { type: t[0], usage: t[1], components: t[2] }; }), yaml_prompt: composeDeck() }, null, 2);
  }
  function composeDeckText() {
    var y = composeDeck(), n = y.length;
    return 'HOW TO USE IT IN NOTEBOOKLM\n1. Open your notebook and add your sources first (documents, links, notes).\n2. In the Studio panel on the right, find Slide Deck and click the pencil icon to customise it.\n3. Paste the YAML from the Prompt tab into the custom instructions box.\n4. Press Generate and review every slide.\n\nLENGTH CHECK\nThis prompt is ' + n + ' characters. NotebookLM limits how long the custom instruction box can be, and that limit has changed over time, so check yours. If the box cuts or refuses the text, set Prompt size to Compact in the quick swap.\n\nCHECK THE DECK\n- Does every slide have one idea and a title that states the point?\n- Are all numbers, names and quotes really in your sources?\n- Is the palette, font and icon style the same on every slide?\n- Does any slide have tiny text or text over a busy picture?\n- Is there a source note under every chart or claim?\n- Does the last slide give one clear next step?\n\nASK THE NOTEBOOK FIRST (optional)\nBefore you generate, ask the notebook chat: "Write a slide-by-slide outline of my sources for ' + (S.f.daud || 'my audience') + '. For each slide give a one-sentence title that states the point and the source it comes from. Leave out anything the sources do not support." Fix the outline, then generate.';
  }
  function composeDeckFix() {
    var D = deckData();
    return ['LESS TEXT\nAdd to the custom instructions and regenerate: "Cut all body text to ' + (D.reading ? '60' : '25') + ' words or fewer per slide, turn lists into icons or short labels, and enlarge the titles."', 'ACTION TITLES\nAdd and regenerate: "Rewrite every slide title as one full sentence that states the conclusion of that slide, not a topic label."', 'SAME STYLE EVERYWHERE\nAdd and regenerate: "Use exactly the ' + D.L.n + ' palette, fonts, margins and icon style on every slide. Do not introduce new colours or decorative styles."', 'SOURCES\nAdd and regenerate: "Under every number or claim add a small source note taken from my uploaded sources. If a number has no source, remove it."', 'CLEANER CHARTS\nAdd and regenerate: "Show one chart per slide, label the axes, start bars at zero, and highlight one insight in the accent colour. Remove 3D effects and decoration."', 'MORE VISUAL VARIETY\nAdd and regenerate: "Alternate layouts between neighbouring slides (statement, three cards, chart, timeline, comparison) while keeping the same style."', 'SHORTER DECK\nAdd and regenerate: "Reduce the deck to ' + (D.reading ? '10' : '7') + ' slides. Merge related ideas and drop anything that does not serve the goal: ' + (D.goal || 'the audience decision') + '."'].join('\n\n');
  }
  function composeDeckRef() {
    var D = deckData();
    return 'FROM A REFERENCE SLIDE\n\nUse this when you have a slide or deck whose look you like. Attach one to three screenshots of it to a message in Gemini or ChatGPT, then paste everything below the line. You get a new NotebookLM style prompt in the same format as the Prompt tab.\n\n----------------\nStudy the attached slide image(s) and describe only their visual style, never their words, logos, faces or data.\n\nWrite a NotebookLM slide-deck style prompt in YAML, under 3,500 characters, with exactly these top-level keys:\n- design_system: style_name, theme (one sentence), typography (titles, subtitles, body), colours (primary, background, text, accent, support, each as an estimated hex value with a short name), visual_elements (4 short items), imagery (one sentence)\n- slide_templates: 5 to 7 entries, each with type, usage and components (3 short items)\n- content_rules: 5 short rules\n- guardrails: 3 short rules, including: use only facts from the uploaded sources, and add a source note under every number\n\nThen add this deck_brief block exactly as written:\n\n' + composeDeck().split('\ndesign_system:')[0].split('\n').slice(2).join('\n') + '\n\nReturn only the YAML in one code block.';
  }
  function drawDeckPreview() {
    var D = deckData(), L = D.L, P = L.pal, W = 1000, H = 563, g = '', r = Math.min(L.r, 30), bg = P[1][0], fg = P[2][0], pr = P[0][0], ac = P[3][0], su = P[4][0], dk = L.dark;
    g += '<rect width="' + W + '" height="' + H + '" fill="' + bg + '"/>';
    if (L.n === 'Frost glass') g += '<circle cx="860" cy="90" r="150" fill="' + ac + '" fill-opacity=".25"/><circle cx="120" cy="500" r="170" fill="' + pr + '" fill-opacity=".18"/>';
    if (L.n === 'Data newsroom' || L.n === 'Boardroom brief') g += '<rect width="' + W + '" height="14" fill="' + pr + '"/>';
    var title = (D.topic || 'The slide title states the point').replace(/\s+/g, ' '); if (title.length > 60) title = title.slice(0, 58).trim() + '…';
    var words = title.split(' '), l1 = '', l2 = ''; words.forEach(function (w) { if ((l1 + ' ' + w).trim().length <= 28 && !l2) l1 = (l1 + ' ' + w).trim(); else l2 = (l2 + ' ' + w).trim(); });
    var tc = dk ? pr : fg; if (dk && /Midnight|Retro|Blueprint/.test(L.n)) tc = fg;
    g += '<text x="60" y="110" font-size="46" font-weight="800" fill="' + tc + '" font-family="Plus Jakarta Sans,sans-serif">' + esc(l1) + '</text><text x="60" y="164" font-size="46" font-weight="800" fill="' + tc + '" font-family="Plus Jakarta Sans,sans-serif">' + esc(l2) + '</text>';
    g += '<rect x="60" y="190" width="120" height="6" rx="3" fill="' + ac + '"/>';
    var cf = dk ? '#ffffff' : su, cfo = dk ? '.10' : '.28';
    for (var i = 0; i < 3; i++) { var x = 60 + i * 190; g += '<rect x="' + x + '" y="230" width="170" height="210" rx="' + r + '" fill="' + cf + '" fill-opacity="' + cfo + '" stroke="' + pr + '" stroke-opacity=".5"/><circle cx="' + (x + 40) + '" cy="278" r="20" fill="' + (i === 1 ? ac : pr) + '"/><rect x="' + (x + 18) + '" y="322" width="120" height="10" rx="5" fill="' + fg + '" fill-opacity=".75"/><rect x="' + (x + 18) + '" y="346" width="134" height="7" rx="3" fill="' + fg + '" fill-opacity=".35"/><rect x="' + (x + 18) + '" y="364" width="100" height="7" rx="3" fill="' + fg + '" fill-opacity=".35"/>'; }
    var hs = [90, 140, 110, 190]; g += '<rect x="660" y="230" width="280" height="210" rx="' + r + '" fill="' + cf + '" fill-opacity="' + cfo + '" stroke="' + pr + '" stroke-opacity=".5"/>';
    hs.forEach(function (hh, j) { g += '<rect x="' + (690 + j * 58) + '" y="' + (420 - hh) + '" width="38" height="' + hh + '" rx="' + Math.min(r, 8) + '" fill="' + (j === 3 ? ac : pr) + '"/>'; });
    g += '<line x1="60" y1="490" x2="940" y2="490" stroke="' + fg + '" stroke-opacity=".3"/><text x="60" y="522" font-size="18" fill="' + fg + '" fill-opacity=".7" font-family="JetBrains Mono,monospace">' + esc((D.foot || 'Source: your uploaded sources').slice(0, 60)) + '</text><text x="940" y="522" font-size="18" text-anchor="end" fill="' + fg + '" fill-opacity=".7" font-family="JetBrains Mono,monospace">3</text>';
    var c1 = $('#canvas'); c1.style.aspectRatio = '16/9'; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Slide mock-up in the ' + esc(L.n) + ' style">' + g + '</svg>';
    $('#layoutNote').textContent = 'Slide mock-up in the ' + L.n + ' style. NotebookLM designs the real slides from your sources using the prompt on the right.';
  }
  function drawPhotoPreview() {
    if (isBook()) return drawBookPreview();
    if (isComic()) return drawComicPreview();
    if (isDeck()) return drawDeckPreview();
    if (isSales()) return drawSalesPreview();
    if (isThumb()) return drawThumbPreview();
    if (isInfo()) return drawInfoPreview();
    if (isStory()) return drawStoryPreview();
    var a = aspect(), W = 1000, H = Math.round(1000 * a.h / a.w), c = pal().c, L = lookObj();
    var g = '<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient><radialGradient id="vg" cx=".5" cy=".4" r=".8"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>';
    g += '<rect width="' + W + '" height="' + H + '" fill="url(#pg)"/><rect width="' + W + '" height="' + H + '" fill="url(#vg)"/>';
    var hx = W / 3, hy = H / 3; if (isProduct()) { var px = W * .5, pw = W * .26, ph = H * .34, py = H * .58; g += '<ellipse cx="' + px + '" cy="' + (py + ph / 2 + 10) + '" rx="' + (pw * .8) + '" ry="' + (H * .018) + '" fill="#000" fill-opacity=".35"/><rect x="' + (px - pw / 2) + '" y="' + (py - ph / 2) + '" width="' + pw + '" height="' + ph + '" rx="28" fill="#fff" fill-opacity=".92"/><rect x="' + (px - pw / 2 + 18) + '" y="' + (py - ph * .12) + '" width="' + (pw - 36) + '" height="' + (ph * .3) + '" rx="10" fill="' + c[0] + '" fill-opacity=".55"/>'; } else g += '<g fill="#ffffff" fill-opacity=".92"><circle cx="' + (W * .5) + '" cy="' + (H * .36) + '" r="' + (H * .095) + '"/><path d="M' + (W * .16) + ' ' + H + ' C' + (W * .18) + ' ' + (H * .66) + ' ' + (W * .34) + ' ' + (H * .56) + ' ' + (W * .5) + ' ' + (H * .56) + ' C' + (W * .66) + ' ' + (H * .56) + ' ' + (W * .82) + ' ' + (H * .66) + ' ' + (W * .84) + ' ' + H + ' Z"/></g>';
    g += '<g stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-dasharray="10 10"><line x1="' + hx + '" y1="0" x2="' + hx + '" y2="' + H + '"/><line x1="' + hx * 2 + '" y1="0" x2="' + hx * 2 + '" y2="' + H + '"/><line x1="0" y1="' + hy + '" x2="' + W + '" y2="' + hy + '"/><line x1="0" y1="' + hy * 2 + '" x2="' + W + '" y2="' + hy * 2 + '"/></g>';
    g += '<circle cx="' + (W * .5) + '" cy="' + (H * .34) + '" r="10" fill="#ffb02e"/><text x="' + (W * .5 + H * .095 + 24) + '" y="' + (H * .34 + 6) + '" font-size="26" fill="#fff" font-family="JetBrains Mono,monospace">' + (isProduct() ? 'hero point' : 'eye line') + '</text>';
    g += '<rect x="30" y="' + (H - 120) + '" width="' + (W - 60) + '" height="90" rx="24" fill="#05050a" fill-opacity=".62"/><text x="58" y="' + (H - 78) + '" font-size="30" fill="#fff" font-family="Bricolage Grotesque,sans-serif" font-weight="800">' + esc(L.n) + '</text><text x="58" y="' + (H - 46) + '" font-size="22" fill="#d9d4f2" font-family="Space Grotesk,sans-serif">' + esc((S.f.camera || L.cam).slice(0, 56)) + '</text>';
    var c1 = $('#canvas'); c1.style.aspectRatio = a.w + '/' + a.h; c1.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Framing guide for the photo">' + g + '</svg>';
    $('#layoutNote').textContent = '' + (isProduct() ? 'Framing guide: keep the product on a third line with room around it for text. This is not the photo, only a composition guide.' : 'Framing guide: keep the eyes on the upper third line. This is not the photo, only a composition guide.') + '';
  }

  function renderDeckGallery() {
    var L = lookObj(), cur = S.dgrp || L.grp, cats = [{ id: 'ALL', label: 'All (' + DECK_LOOKS.length + ')' }].concat(Object.keys(DECK_GROUPS).map(function (k) { return { id: k, label: DECK_GROUPS[k] + ' (' + DECK_LOOKS.filter(function (l) { return l.grp === k; }).length + ')' }; }));
    chips($('#looks'), cats, function (x) { return cur === x.id; }, function (x) { S.dgrp = x.id; save(); renderAll(); });
    var list = DECK_LOOKS.map(function (l, i) { return { l: l, i: i }; }).filter(function (o) { return cur === 'ALL' || o.l.grp === cur; });
    var g = $('#deckGrid');
    g.innerHTML = list.map(function (o) { return '<button type="button" class="style' + (o.i === ((S.look || 0) % DECK_LOOKS.length) ? ' on' : '') + '" data-i="' + o.i + '" style="--a:' + o.l.pal[0][0] + ';--b:' + o.l.pal[3][0] + '"><span><img src="styles/deck/' + o.l.id + '-s.jpg" alt="Example slide in the ' + esc(o.l.n) + ' style" loading="lazy" onerror="this.remove()"></span><b>' + esc(o.l.n) + '</b></button>'; }).join('');
    Array.prototype.forEach.call(g.querySelectorAll('.style'), function (b) { b.addEventListener('click', function () { S.look = +b.dataset.i; save(); renderAll(); }); });
    var d = $('#deckDetail');
    d.innerHTML = '<a class="sd-img" id="ddOpen" role="button" tabindex="0" style="--a:' + L.pal[0][0] + ';--b:' + L.pal[3][0] + '"><img src="styles/deck/' + L.id + '.jpg" alt="Example slide in the ' + esc(L.n) + ' style" onerror="this.remove()"></a><div class="sd-info"><h3>' + esc(L.n) + '</h3><p>' + esc(L.best) + '</p><div class="sw5">' + L.pal.map(function (p) { return '<i style="background:' + p[0] + '" title="' + esc(p[1] + ' ' + p[0]) + '"></i>'; }).join('') + '</div><small>' + esc(L.pal.map(function (p) { return p[1]; }).join(' · ')) + '</small></div>';
    var op = function () { var b = $('#lightbox'); b.innerHTML = '<figure><img src="styles/deck/' + L.id + '.jpg" alt="' + esc(L.n) + ' example slide"><figcaption><b>' + esc(L.n) + '</b> · ' + esc(L.best) + '</figcaption></figure><button type="button" class="x" aria-label="Close">×</button>'; b.classList.add('on'); b.onclick = function () { b.classList.remove('on'); }; };
    $('#ddOpen').onclick = op; $('#ddOpen').onkeydown = function (e) { if (e.key === 'Enter') op(); };
  }
  function renderPhotoUI() {
    document.body.classList.toggle('photo', isPhoto()); document.body.classList.toggle('deck', isDeck());
    var tb = document.querySelectorAll('#tabs button'); tb[1].textContent = isPhoto() ? (isDeck() ? 'Check the deck' : isBook() ? 'Storybook check' : isComic() ? 'Comic check' : isSales() ? 'Sales page check' : isThumb() ? 'Thumbnail check' : isInfo() ? 'Plan it with AI' : isStory() ? 'Check the clips' : 'Check the result') : 'Text to render';
    $('#h2txt').textContent = isPhoto() ? (isDeck() ? 'What is the deck about?' : isBook() ? 'What is the story?' : isComic() ? 'What happens in the comic?' : isSales() ? 'What are you selling?' : isThumb() ? 'What is the thumbnail about?' : isInfo() ? 'What is the infographic about?' : isStory() ? 'What happens in the video?' : isProduct() ? 'What are we shooting?' : 'Who and where?') : 'What does it say?'; $('#fieldNote').textContent = isPhoto() ? (isDeck() ? 'Upload your sources to NotebookLM yourself. This prompt only tells it how the slides should look and what the deck is for, so it never needs your private documents.' : isBook() ? 'Give the title, the characters once (their look is repeated on every page), and one line per page: scene | narration.' : isComic() ? 'Describe the story, the characters once, and each panel. The characters block is repeated so faces stay consistent.' : isSales() ? 'Fill the product, the headline, the price badge, up to four features and the button. The order on the picture is fixed.' : isThumb() ? 'One short hook, one strong face, one clear layout. Pick a size of 16:9 (YouTube) or 9:16 (Shorts, TikTok) below.' : isInfo() ? 'Give a topic, 3 to 8 steps, up to 4 key numbers and up to 3 why-it-matters cards. Use only facts you can check. The Plan it with AI tab can draft the lines for you.' : isStory() ? 'Describe the idea once. The builder splits it into timed scenes and writes one video prompt per scene.' : isProduct() ? 'Describe the product and its setting. Leave light and camera empty to use the photo look.' : 'Describe a type of person, not a specific real person. Leave light and camera empty to use the photo look.') : 'Every word you type here is placed in the prompt exactly as written, so check the spelling.';
    renderFormatRow();
    var ll = $('#lookLab'); if (ll) ll.textContent = isDeck() ? 'Slide style' : isBook() ? 'Storybook style' : isComic() ? 'Comic style' : isSales() ? 'Sales page look' : isThumb() ? 'Thumbnail style' : isInfo() ? 'Infographic style' : isStory() ? 'Video look' : 'Photo look';
    if (!isPhoto()) return;
    var dg = $('#deckGrid'); if (dg) { dg.hidden = !isDeck(); $('#deckDetail').hidden = !isDeck(); }
    if (isDeck()) renderDeckGallery(); else chips($('#looks'), lookList().map(function (l) { return { label: l.n }; }), function (x, i) { return (S.look || 0) === i; }, function (x, i) { S.look = i; save(); renderAll(); });
    $('#lookNote').textContent = isDeck() ? lookObj().cat + ' style. Best for: ' + lookObj().best + '.' : 'Light: ' + lookObj().light + '. Camera: ' + lookObj().cam + '.';
    var host = $('#swap'); var swKeys = isDeck() ? ['dslides', 'dform', 'dlang', 'dsize'] : isInfo() ? ['itopic', 'icar', 'isteps'] : isBook() ? ['bstory'] : isComic() ? ['clayout'] : isSales() ? ['sedge'] : isThumb() ? ['texpr', 'tcomp', 'tfont'] : (type().id === 'portrait' ? ['subject', 'pose', 'location', 'pscene', 'prefs'] : isInfo() ? ['itopic'] : isStory() ? ['idea', 'backdrop'] : isProduct() ? ['product', 'surface', 'angle', 'light', 'props'] : ['subject', 'pose', 'location']); if (host.dataset.built !== S.type) { host.dataset.built = S.type; host.innerHTML = '<b>Quick swap: ' + (isDeck() ? 'choose the length, format, language and prompt size' : isBook() ? 'try another story idea' : isComic() ? 'try another layout' : isSales() ? 'choose the edge treatment' : isThumb() ? 'change only the reaction, the layout or the lettering' : isInfo() ? 'try another topic' : isStory() ? 'change only the idea or the background' : isProduct() ? 'change only the product, the surface or the props' : 'change only the subject, the pose or the place') + '</b>' + swKeys.map(function (k) { return '<div class="sw-row"><small>' + ({ dslides: 'Length', dform: 'Format', dlang: 'Language', dsize: 'Prompt size', subject: 'Subject', pose: 'Pose', location: 'Place', product: 'Product', surface: 'Surface', props: 'Props', idea: 'Idea', backdrop: 'Background', itopic: 'Topic', texpr: 'Reaction', tcomp: 'Layout', tfont: 'Lettering', angle: 'Angle', light: 'Light', bstory: 'Story', icar: 'Output', isteps: 'Steps preset', clayout: 'Layout', sedge: 'Edges', pscene: 'Scene', prefs: 'Attach' })[k] + '</small><div class="chips" data-k="' + k + '"></div></div>'; }).join(''); }
    Array.prototype.forEach.call(host.querySelectorAll('.chips'), function (h) { var k = h.dataset.k; chips(h, SWAPS[k].map(function (x) { return { label: x.length > 44 ? x.slice(0, 42) + '…' : x, full: x }; }), function (x) { return (S.f[k] || '') === x.full; }, function (x) { S.f[k] = x.full; save(); renderAll(); }); });
  }  /* ---------- set mode: one design anchor, many pieces ---------- */
  var SET_KINDS = [{ id: 'carousel', label: 'Carousel (swipe slides)' }, { id: 'series', label: 'Series of posters' }, { id: 'pack', label: 'Campaign pack (3 sizes)' }];
  var PACK = [{ a: '4:5', n: 'Feed post 4:5' }, { a: '9:16', n: 'Story 9:16' }, { a: '16:9', n: 'Banner 16:9' }];
  var setCount = function () { return S.set.kind === 'pack' ? 3 : S.set.n; };
  function ensureItems() { while (S.set.items.length < 10) S.set.items.push({ h: '', s: '', v: '' }); }
  function roleOf(i) { var n = setCount(), k = S.set.kind; return k === 'pack' ? PACK[i].n : k === 'series' ? 'Poster ' + (i + 1) : i === 0 ? 'Cover slide' : i === n - 1 ? 'Closing slide' : 'Slide ' + (i + 1); }
  function anchorText() {
    var st = style(), c = pal().c;
    return 'DESIGN ANCHOR (identical for every piece in this set)\nStyle: ' + st.name + ': ' + st.t + '.\nColours: dominant ' + c[0] + ', accent ' + c[1] + ', light neutral ' + c[2] + '.\nLettering: ' + TYPEFACES[S.face] + '. Headline always the largest element, same position and size on every piece.\nMood: ' + (S.moods.join(', ').toLowerCase() || type().tone) + '.\nLayout rule: ' + ['type-led, headline in the top third', 'image-led, picture full-bleed with text on a darkened area', 'framed, picture inside a clean frame with text underneath'][S.variant] + '.\nRecurring details: same margins, same background treatment, ' + (S.f.brand ? 'the small brand name "' + S.f.brand + '" in the same corner' : 'no logo') + (S.set.kind === 'carousel' ? ', a small page marker such as "2/' + S.set.n + '" in the same corner' : '') + '.\n' + (S.real ? 'Feel: real light, natural texture, small imperfections, no plastic gloss or glow.\n' : '') + 'Consistency rule: do not change typography, colours, margins or illustration style between pieces. Only the message and the hero picture change.';
  }
  function itemPrompt(i) {
    var n = setCount(), it = S.set.items[i] || {}, sf = S.f, sa = S.aspect, k = S.set.kind;
    var f = Object.assign({}, sf, { headline: it.h || '', sub: it.s || '', visual: it.v || '' });
    if (k === 'carousel' && i !== n - 1) { f.cta = ''; f.contact = ''; f.price = i === 0 ? sf.price : ''; f.dates = i === 0 ? sf.dates : ''; f.address = ''; }
    if (k === 'carousel' && i === 0) f.sub = it.s || sf.sub;
    S.f = f; if (k === 'pack') S.aspect = PACK[i].a;
    var out; try { out = composePrompt(); } finally { S.f = sf; S.aspect = sa; }
    var ctx = 'SET CONTEXT: ' + roleOf(i) + ' (' + (i + 1) + ' of ' + n + ') in a ' + SET_KINDS.filter(function (x) { return x.id === k; })[0].label.toLowerCase() + '.' + (k === 'carousel' ? (i === 0 ? ' This is the cover: make it a strong hook with a small swipe cue.' : i === n - 1 ? ' This is the closing slide: summarise and show the call to action.' : ' This is a content slide: one idea only.') : '') + (k === 'carousel' ? ' Layout zones: header in the top 15%, content in the middle 70%, footer in the bottom 15%; keep all text inside an 8% safe margin. Add a small page number "' + (i + 1) + '/' + n + '" in the footer corner' + (i < n - 1 ? ' and a small swipe cue "Swipe \u2192"' : '') + '.' : '') + ' Follow the design anchor exactly.';
    return ctx + '\n\n' + out;
  }
  function composeSet() {
    var n = setCount(), parts = [anchorText(), 'HOW TO USE THIS SET\n1. Paste the design anchor as the first message in a new chat, or keep the anchor line inside every prompt below.\n2. Generate each piece in the same chat so the tool remembers the look.\n3. If a piece drifts, send: "Match the design anchor exactly: same colours, lettering and margins as piece 1."'];
    for (var i = 0; i < n; i++) parts.push('=== ' + roleOf(i).toUpperCase() + ' (' + (i + 1) + '/' + n + ') ===\n' + itemPrompt(i));
    return parts.join('\n\n');
  }
  function composeSetJSON() { var n = setCount(), o = { set_type: S.set.kind, count: n, size: S.set.kind === 'pack' ? PACK.map(function (p) { return p.a; }) : aspect().id, style: style().name, palette: pal().c, lettering: S.face, mood: S.moods, realism_mode: S.real, pieces: [] }; for (var i = 0; i < n; i++) o.pieces.push({ role: roleOf(i), headline: S.set.items[i].h, support: S.set.items[i].s, picture: S.set.items[i].v }); return JSON.stringify(o, null, 2); }
  var setKey = '';
  function renderSetUI() {
    var on = S.set.on && !isPhoto(); $('#setOn').checked = S.set.on; $('#setBody').hidden = !S.set.on;
    chips($('#setKinds'), SET_KINDS, function (x) { return S.set.kind === x.id; }, function (x) { S.set.kind = x.id; save(); renderAll(); });
    $('#setCountLab').style.display = S.set.kind === 'pack' ? 'none' : '';
    chips($('#setCount'), [2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return { label: String(n), n: n }; }), function (x) { return S.set.n === x.n; }, function (x) { S.set.n = x.n; save(); renderAll(); });
    $('#anchorBox').innerHTML = '<b>Design anchor</b><span>' + esc(style().name) + '</span><span>' + pal().c.map(function (x) { return '<i style="background:' + x + '"></i>'; }).join('') + '</span><span>' + esc({ bold: 'Bold sans', elegant: 'Elegant serif', hand: 'Hand lettered', condensed: 'Condensed', retro: 'Retro rounded' }[S.face]) + '</span><span>' + esc(S.moods.join(', ') || 'No mood') + '</span><small>Change the style, colours, lettering or mood above and the anchor follows.</small>';
    var n = setCount(), key = S.set.kind + n; ensureItems();
    var host = $('#setItems');
    if (setKey !== key) { setKey = key; host.innerHTML = ''; for (var i = 0; i < n; i++) { (function (i) { var d = document.createElement('div'); d.className = 'item'; d.innerHTML = '<em>' + (i + 1) + '</em><div><b>' + esc(roleOf(i)) + '</b><input type="text" data-f="h" placeholder="Headline for this piece"><input type="text" data-f="s" placeholder="Supporting line"><input type="text" data-f="v" placeholder="Picture idea (optional)"></div>'; Array.prototype.forEach.call(d.querySelectorAll('input'), function (inp) { inp.value = S.set.items[i][inp.dataset.f] || ''; inp.addEventListener('input', function () { S.set.items[i][inp.dataset.f] = inp.value; save(); renderOutput(); }); }); host.appendChild(d); })(i); } }
    $('#tabSet').hidden = !on;
    if (!on && tab === 'set') { tab = 'prompt'; Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (x) { x.classList.toggle('on', x.dataset.t === 'prompt'); }); }
    var strip = $('#setStrip'); strip.hidden = !on; if (on) { strip.innerHTML = Array.apply(null, Array(n)).map(function (_, i) { var it = S.set.items[i] || {}; return '<div class="mini" style="aspect-ratio:' + (S.set.kind === 'pack' ? PACK[i].a.replace(':', '/') : aspect().w + '/' + aspect().h) + ';--c0:' + pal().c[0] + ';--c1:' + pal().c[1] + '"><b>' + (i + 1) + '</b><span>' + esc((it.h || roleOf(i)).slice(0, 26)) + '</span></div>'; }).join(''); }
    var cp = $('#setCopies'); cp.hidden = !(on && tab === 'set'); if (!cp.hidden) { cp.innerHTML = '<button class="btn mini hot" data-c="a" type="button">Copy anchor</button>' + Array.apply(null, Array(n)).map(function (_, i) { return '<button class="btn mini" data-c="' + i + '" type="button">Copy ' + (i + 1) + '</button>'; }).join(''); Array.prototype.forEach.call(cp.querySelectorAll('button'), function (b) { b.onclick = function () { copy(b.dataset.c === 'a' ? anchorText() : itemPrompt(+b.dataset.c), b.dataset.c === 'a' ? 'Anchor copied' : 'Piece ' + (+b.dataset.c + 1) + ' copied'); }; }); }
  }
  $('#setOn').onchange = function (e) { S.set.on = e.target.checked; save(); renderAll(); };
  $('#setFill').onclick = function () { var n = setCount(), f = S.f; ensureItems(); S.set.items[0] = { h: f.headline || S.set.items[0].h, s: f.sub || S.set.items[0].s, v: f.visual || S.set.items[0].v }; setKey = ''; save(); renderAll(); toast('Piece 1 filled from your brief'); };  /* ---------- concept cards: three ways to tell the same message ---------- */
  var NOUN = { wedding: 'the couple and the venue', film: 'the key character or the defining scene', promo: 'the product or offer', food: 'the dish', event: 'the atmosphere of the event', launch: 'the product', hiring: 'a friendly team at work', notice: 'a calm symbol of the message', quote: 'a quiet landscape', info: 'simple icons and a diagram', property: 'the property', greeting: 'festive decorations' };
  var ARCH = [
    { id: 'close', name: 'Hero close-up', v: 1, pitch: 'One subject, very close, filling the frame, with the words on the quiet part.', why: 'Stops the scroll and makes the subject the star.', vis: function (n) { return 'an extreme close-up of ' + n + ', filling the frame, with one clear area left empty for the headline'; } },
    { id: 'type', name: 'Big type', v: 0, pitch: 'The headline is the picture; a small image supports it.', why: 'Works when the words matter most and the photo is plain.', vis: function (n) { return 'a small, clean image of ' + n + ' beside oversized headline lettering that fills most of the poster'; } },
    { id: 'people', name: 'In real life', v: 1, pitch: 'A candid moment of a real person using or enjoying it.', why: 'Feels human and trustworthy.', vis: function (n) { return 'a candid, unposed moment of a real person with ' + n + ', natural expression, shot slightly off-centre'; } },
    { id: 'flat', name: 'Flat lay', v: 2, pitch: 'Items arranged from above on a plain surface, inside a clean frame.', why: 'Tidy, easy to read, good for several items.', vis: function (n) { return 'a top-down arrangement of ' + n + ' and a few related props on a plain surface, neatly spaced'; } },
    { id: 'block', name: 'Object on colour', v: 2, pitch: 'One object on a bold colour block with a strong soft shadow.', why: 'Simple, modern and very quick to read.', vis: function (n) { return 'a single, well-lit ' + n + ' placed on a solid colour background with a soft, believable shadow'; } },
    { id: 'place', name: 'Place and mood', v: 1, pitch: 'The setting is the hero; the mood sells the message.', why: 'Best for events, venues and anything about atmosphere.', vis: function (n) { return 'a wide, atmospheric scene that shows where ' + n + ' happens, with people small in the frame'; } },
    { id: 'steps', name: 'Step by step', v: 0, pitch: 'A short sequence or diagram that explains it at a glance.', why: 'Clear for information, notices and how-tos.', vis: function (n) { return 'a simple three-step sequence with clean icons that explains ' + n + ', each step clearly separated'; } },
    { id: 'drawn', name: 'Illustrated scene', v: 2, pitch: 'A drawn scene with personality instead of a photo.', why: 'Friendly, distinctive and forgiving of weak photography.', vis: function (n) { return 'a hand-drawn illustration of ' + n + ' in a small scene with warm detail'; } }
  ];
  var conceptSeed = 0;
  function hashStr(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function pickConcepts() {
    var base = hashStr((S.f.headline || '') + S.type + S.style) + conceptSeed * 7919, order = ARCH.map(function (a, i) { return { a: a, k: (hashStr(a.id) + base) % 1009 }; }).sort(function (x, y) { return x.k - y.k; }).map(function (x) { return x.a; });
    var out = [order[0]]; var vs = [order[0].v];
    for (var i = 1; i < order.length && out.length < 3; i++) { if (vs.indexOf(order[i].v) < 0 || (out.length === 2 && vs.length < 3 && vs.indexOf(order[i].v) < 0)) { out.push(order[i]); vs.push(order[i].v); } }
    for (var j = 1; j < order.length && out.length < 3; j++) if (out.indexOf(order[j]) < 0) out.push(order[j]);
    return out;
  }
  function conceptThumb(v) { var a = '<svg viewBox="0 0 80 100" aria-hidden="true"><rect width="80" height="100" rx="8" fill="rgba(255,255,255,.08)"/>'; if (v === 0) a += '<rect x="8" y="8" width="64" height="16" rx="3" fill="#ffb02e"/><rect x="8" y="30" width="64" height="40" rx="5" fill="#ff2d8a" opacity=".85"/><rect x="8" y="76" width="36" height="8" rx="4" fill="#fff" opacity=".8"/>'; else if (v === 1) a += '<rect width="80" height="100" rx="8" fill="#7c5cff" opacity=".85"/><rect x="8" y="64" width="50" height="10" rx="3" fill="#fff"/><rect x="8" y="80" width="30" height="7" rx="3" fill="#ffb02e"/>'; else a += '<rect x="10" y="10" width="60" height="44" rx="8" fill="#19e3ff" opacity=".8"/><rect x="10" y="62" width="48" height="10" rx="3" fill="#fff"/><rect x="10" y="78" width="34" height="7" rx="3" fill="#ffb02e"/>'; return a + '</svg>'; }
  function renderConcepts() {
    var host = $('#concepts'); if (!host) return; if (!S.conceptsShown) { host.innerHTML = ''; $('#conceptMore').hidden = true; return; }
    $('#conceptMore').hidden = false; var noun = NOUN[S.type] || 'the subject', head = (S.f.headline || '').trim(), cs = pickConcepts();
    host.innerHTML = cs.map(function (c, i) { var vis = (S.f.visual && S.f.visual.trim() && !S.concept) ? c.vis(S.f.visual.trim()) : c.vis(noun); return '<article class="concept' + (S.concept && S.concept.id === c.id ? ' on' : '') + '"><div class="cth">' + conceptThumb(c.v) + '</div><div class="ctx"><small>Concept ' + 'ABC'[i] + '</small><h3>' + esc(c.name) + '</h3><p>' + esc(c.pitch) + '</p><p class="why"><b>Why it works:</b> ' + esc(c.why) + '</p><button type="button" class="btn mini hot" data-cid="' + c.id + '" data-vis="' + esc(vis) + '">' + (S.concept && S.concept.id === c.id ? 'In use' : 'Use this concept') + '</button></div></article>'; }).join('');
    Array.prototype.forEach.call(host.querySelectorAll('[data-cid]'), function (b) { b.onclick = function () { var c = ARCH.filter(function (x) { return x.id === b.dataset.cid; })[0]; S.f.visual = b.dataset.vis; S.variant = c.v; S.concept = { id: c.id, name: c.name, pitch: c.pitch }; $('#fields').dataset.type = ''; save(); renderAll(); toast('Concept applied: ' + c.name); }; });
  }
  $('#conceptGo').onclick = function () { S.conceptsShown = true; S.concept = null; conceptSeed = 0; save(); renderAll(); };
  $('#conceptMore').onclick = function () { conceptSeed++; S.concept = null; renderConcepts(); };  function renderOutput() {
    updateDateWarn();
    var txt = tab === 'prompt' ? composePrompt() : tab === 'text' ? composeText() : tab === 'json' ? (S.set.on && !isPhoto() ? composeSetJSON() : composeJSON()) : tab === 'set' ? composeSet() : tab === 'ref' ? composeRef() : composeFix();
    var o = $('#output'); o.textContent = txt; o.classList.remove('flash'); void o.offsetWidth; o.classList.add('flash');
    $('#wordCount').textContent = txt.split(/\s+/).filter(Boolean).length + ' words';
    // completeness
    var keys = relevant().filter(function (k) { return k !== 'brand'; }), got = keys.filter(function (k) { return S.f[k] && S.f[k].trim(); }).length;
    var pctv = Math.round(got / keys.length * 100); $('#meterLabel').textContent = 'Brief ' + pctv + '% complete'; $('#meterBar').style.width = pctv + '%';
    drawPreview(); afterPreview();
  }

  /* ---------- live layout preview (v3): a finished-looking poster drawn from the brief, in the chosen style, colours and lettering ---------- */
  var RADIUS = { swiss: 0, retro: 26, grunge: 4, clay: 70, paper: 14, neon: 10, editorial: 0, luxury: 2, organic: 40, glass: 34, doodle: 20, letterpress: 4, cinema: 10, sticker: 44, brutal: 0, geometric: 8, premium3d: 20, scrapbook: 6, isodiorama: 30, vinyltoy: 44, patriotic: 6, islamicflat: 10, liquid: 40, embroidery: 6, woodcarve: 6, talkstage: 4, promoburst: 24, packcampaign: 16, specsheet: 6, beautykv: 24, rerender: 8, crew: 14 };
  var SKIN = { swiss: ['geo', 0], retro: ['burst', 0], grunge: ['geo', 1, { grain: 1, tape: 1 }], clay: ['blob', 0], paper: ['land', 0], neon: ['glow', 1, { neon: 1 }], editorial: ['land', 0, { rule: 1 }], luxury: ['star', 1, { frame: 1 }], organic: ['land', 0], glass: ['blob', 1, { glass: 1 }], doodle: ['land', 0], letterpress: ['star', 0, { frame: 1, grain: 1 }], cinema: ['land', 1, { grain: 1 }], sticker: ['burst', 0], brutal: ['geo', 0, { rule: 1 }], geometric: ['star', 1, { frame: 1 }], premium3d: ['blob', 1], scrapbook: ['geo', 0, { tape: 1, grain: 1 }], isodiorama: ['blob', 0], vinyltoy: ['blob', 0], patriotic: ['burst', 0], islamicflat: ['star', 1, { frame: 1 }], liquid: ['blob', 1], embroidery: ['star', 0, { frame: 1, grain: 1 }], woodcarve: ['star', 1, { frame: 1, grain: 1 }], talkstage: ['glow', 1], promoburst: ['burst', 0], packcampaign: ['land', 0], specsheet: ['land', 1], beautykv: ['land', 0], rerender: ['land', 1, { grain: 1 }], crew: ['glow', 1] };
  var PFONT = { bold: ["'Plus Jakarta Sans',sans-serif", 800, .58, -2.2, 0], elegant: ["'Playfair Display',serif", 700, .52, -1, 0], hand: ["'Caveat',cursive", 700, .42, 0, 0], condensed: ["'Anton',sans-serif", 400, .44, .6, 1], retro: ["'Fredoka',sans-serif", 700, .58, -1, 0] };
  function rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return '#' + [0, 1, 2].map(function (i) { return ('0' + Math.round(x[i] + (y[i] - x[i]) * t).toString(16)).slice(-2); }).join(''); }
  function lum(h) { var c = rgb(h); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
  function star8(px, py, rr, attrs) { var d = '', k; for (k = 0; k < 16; k++) { var an = Math.PI * k / 8, q = k % 2 ? rr * .765 : rr; d += (k ? 'L' : 'M') + (px + Math.cos(an) * q).toFixed(1) + ' ' + (py + Math.sin(an) * q).toFixed(1); } return '<path d="' + d + 'Z" ' + attrs + '/>'; }
  function drawPreview() {
    if (isPhoto()) return drawPhotoPreview();
    var a = aspect(), W = 1000, H = Math.round(1000 * a.h / a.w), c = pal().c, t = type(), f = S.f, v = S.variant;
    var sk = SKIN[S.style] || ['land', 0], o = sk[2] || {}, dark = !!sk[1], has = function (k) { return t.zones.indexOf(k) > -1; };
    var c0 = c[0], c1 = c[1], c2 = c[2], wide = W / H > 1.25, u = Math.min(H * (wide ? 1.45 : 1), W * 1.3) / 100, P = Math.round(wide ? u * 9 : W * .07);
    var bgA = dark ? mix(c0, '#000000', lum(c0) > .5 ? .8 : .64) : c2, bgB = dark ? mix(c0, '#000000', .88) : mix(c2, c1, .12);
    var ink = dark ? '#ffffff' : (lum(c0) < .42 ? mix(c0, '#000000', .3) : '#17131c'), acc = c1, onAcc = lum(c1) > .58 ? '#141014' : '#ffffff';
    var F = PFONT[S.face] || PFONT.bold, up = F[4] || /brutal|swiss|specsheet|talkstage|grunge|rerender/.test(S.style), rad = Math.min(RADIUS[S.style] === undefined ? 18 : RADIUS[S.style], 46) * u / 12.5;
    var sans = "'Plus Jakarta Sans',sans-serif", mono = "'JetBrains Mono',monospace";
    var tx = function (x, y, s, size, col, q) { q = q || {}; return '<text x="' + (+x).toFixed(1) + '" y="' + (+y).toFixed(1) + '" font-size="' + (+size).toFixed(1) + '" fill="' + col + '"' + (q.o ? ' fill-opacity="' + q.o + '"' : '') + ' font-family="' + (q.f || sans) + '" font-weight="' + (q.w || 500) + '"' + (q.ls ? ' letter-spacing="' + (+q.ls).toFixed(2) + '"' : '') + (q.a ? ' text-anchor="' + q.a + '"' : '') + (q.i ? ' font-style="italic"' : '') + (q.x || '') + '>' + esc(s) + '</text>'; };
    var R = function (xx, yy, ww, hh, fill, extra) { return '<rect x="' + (+xx).toFixed(1) + '" y="' + (+yy).toFixed(1) + '" width="' + (+ww).toFixed(1) + '" height="' + (+hh).toFixed(1) + '" fill="' + fill + '"' + (extra || '') + '/>'; };
    var C = function (xx, yy, rr, fill, extra) { return '<circle cx="' + (+xx).toFixed(1) + '" cy="' + (+yy).toFixed(1) + '" r="' + (+rr).toFixed(1) + '" fill="' + fill + '"' + (extra || '') + '/>'; };
    /* text metrics */
    var hl = (f.headline || 'Your headline here').slice(0, 48); if (up) hl = hl.toUpperCase();
    var colW = wide && v !== 1 ? W * .5 - P : (v === 2 ? W - P * 3.3 : W - P * 2), fs = u * (v === 0 ? 9.4 : 8.4) * (F[2] < .46 ? 1.28 : 1), hLines, k;
    var wrap = function (s, n) { var w = s.split(' '), L = [], cur = ''; w.forEach(function (x) { if (cur && (cur + ' ' + x).length > n) { L.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x; }); if (cur) L.push(cur); return L; };
    for (k = 0; k < 8; k++) { hLines = wrap(hl, Math.max(5, Math.floor(colW / (fs * F[2])))); var longest = Math.max.apply(null, hLines.map(function (l) { return l.length; })); if (hLines.length <= 3 && longest * fs * F[2] <= colW * 1.04) break; fs *= .88; }
    hLines = hLines.slice(0, 3); var lh = fs * (F[2] < .46 ? 1.04 : 1.03), subFs = Math.max(u * 2.25, Math.min(u * 3, fs * .3)), sub = (f.sub || 'Your supporting line goes here').slice(0, Math.max(16, Math.floor(colW / (subFs * .5))));
    var headH = (hLines.length - 1) * lh + fs + (o.rule ? u * 2.4 : 0) + subFs * 1.7;
    var headG = function (x, y, col) { var s = ''; hLines.forEach(function (l, i) { s += tx(x, y + fs * .84 + i * lh, l, fs, col, { f: F[0], w: F[1], ls: F[3] * fs / 100, i: S.style === 'rerender', x: o.neon ? ' filter="url(#pglow)"' : '' }); }); var yy = y + (hLines.length - 1) * lh + fs; if (o.rule) { s += R(x, yy + u * .8, u * 10, Math.max(2, u * .4), acc); yy += u * 2.4; } return s + tx(x, yy + subFs * 1.2, sub, subFs, col, { o: .84, f: S.face === 'elegant' ? "'Playfair Display',serif" : sans, i: S.face === 'elegant' }); };
    var pts = has('list') ? (f.points || 'First point\nSecond point\nThird point').split('\n').filter(Boolean).slice(0, 4) : [], liH = u * 3.9;
    var listG = function (x, y, col) { return pts.map(function (p, i) { var yy = y + i * liH + liH * .66; return C(x + u * .95, yy - u * .78, u * .95, acc) + '<path d="M' + (x + u * .5).toFixed(1) + ' ' + (yy - u * .78).toFixed(1) + ' l' + (u * .32).toFixed(1) + ' ' + (u * .32).toFixed(1) + ' l' + (u * .58).toFixed(1) + ' -' + (u * .66).toFixed(1) + '" stroke="' + onAcc + '" stroke-width="' + (u * .2).toFixed(1) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + tx(x + u * 2.9, yy, p.slice(0, Math.floor(colW / (u * 1.25))), u * 2.25, col, { w: 600 }); }).join(''); };
    var infoH = u * 8.2, onImg = false;
    var infoG = function (x, y, w, col) { var half = w / 2, lc = dark || onImg ? acc : mix(acc, ink, .4), base = dark || onImg ? '#ffffff' : c0, n = Math.floor((half - u * 3) / (u * 1.28)), lab = function (xx, kk, val) { return tx(xx, y + u * 2.7, kk, u * 1.3, lc, { w: 700, ls: u * .24, f: mono }) + tx(xx, y + u * 5.7, val.slice(0, n), u * 2.2, col, { w: 700 }); }; return R(x, y, w, infoH, base, ' fill-opacity="' + (dark || onImg ? .1 : .06) + '" stroke="' + base + '" stroke-opacity=".24" rx="' + (u * 1.4).toFixed(1) + '"') + '<line x1="' + (x + half) + '" y1="' + (y + u * 1.6) + '" x2="' + (x + half) + '" y2="' + (y + infoH - u * 1.6) + '" stroke="' + col + '" stroke-opacity=".25"/>' + lab(x + u * 2, 'WHEN', f.dates || 'Date and time') + lab(x + half + u * 2, 'WHERE', f.address || 'Venue or address'); };
    var ctaH = u * 6, ctaTxt = (f.cta || 'Call to action').slice(0, 24), ctaW = ctaTxt.length * u * 1.5 + u * 10;
    var ctaG = function (x, y) { var ol = S.style === 'rerender', cc = ol ? '#ffffff' : onAcc; return R(x, y, ctaW, ctaH, ol ? 'none' : acc, ' rx="' + (/swiss|brutal|editorial|luxury|letterpress|specsheet/.test(S.style) ? u * .3 : ctaH / 2).toFixed(1) + '"' + (ol ? ' stroke="' + acc + '" stroke-width="' + (u * .45).toFixed(1) + '"' : '')) + tx(x + u * 3, y + ctaH * .645, ol ? ctaTxt.toUpperCase() : ctaTxt, u * (ol ? 2.1 : 2.45), cc, { w: 800, i: ol, ls: ol ? u * .25 : 0 }) + '<path d="M' + (x + ctaW - u * 4.6).toFixed(1) + ' ' + (y + ctaH / 2).toFixed(1) + ' h' + (u * 2).toFixed(1) + ' m-' + (u * .8).toFixed(1) + ' -' + (u * .8).toFixed(1) + ' l' + (u * .8).toFixed(1) + ' ' + (u * .8).toFixed(1) + ' l-' + (u * .8).toFixed(1) + ' ' + (u * .8).toFixed(1) + '" stroke="' + cc + '" stroke-width="' + (u * .3).toFixed(1) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; };
    var conG = function (x, y, col, anchor) { return tx(x, y, (f.contact || 'Contact details').slice(0, 44), u * 1.7, col, { o: .78, f: mono, a: anchor }); };
    var brandG = function (x, y, col) { return R(x, y - u * 1.3, u * 1.2, u * 1.2, acc) + tx(x + u * 2.2, y, (f.brand || t.name).toUpperCase().slice(0, 28), u * 1.5, col, { w: 700, ls: u * .34 }); };
    var badgeG = function (cx, cy, r) { var p = '', n = 14, i, an, rr, bt = (f.price || 'Offer').slice(0, 11); for (i = 0; i < n * 2; i++) { an = Math.PI * i / n; rr = i % 2 ? r * .87 : r; p += (i ? 'L' : 'M') + (cx + Math.cos(an) * rr).toFixed(1) + ' ' + (cy + Math.sin(an) * rr).toFixed(1); } return '<g transform="rotate(-9 ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"><path d="' + p + 'Z" fill="' + acc + '" stroke="#ffffff" stroke-opacity=".55" stroke-width="' + (u * .3).toFixed(1) + '"/>' + tx(cx, cy + r * .14, bt, Math.min(r * .44, r * 3 / Math.max(4, bt.length)), onAcc, { w: 800, a: 'middle', f: F[0] }) + '</g>'; };
    /* the picture stand-in: a small scene drawn in the palette, different for each family of styles */
    var artG = function (x, y, w, h, r, capTop) {
      var kind = sk[0], s = '<clipPath id="pclip"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r.toFixed(1) + '"/></clipPath><g clip-path="url(#pclip)">', cx = x + w / 2, cy = y + h / 2, m = Math.min(w, h), i;
      if (kind === 'land') {
        var s0 = dark ? mix(c0, '#000000', .55) : mix(c1, c2, .45), s1 = dark ? mix(c1, c0, .35) : mix(c2, '#ffffff', .45), hill = function (yy, amp, fill) { return '<path d="M' + x + ' ' + (y + h * yy).toFixed(1) + ' C' + (x + w * .22).toFixed(1) + ' ' + (y + h * (yy - amp)).toFixed(1) + ' ' + (x + w * .4).toFixed(1) + ' ' + (y + h * (yy + amp * .6)).toFixed(1) + ' ' + (x + w * .6).toFixed(1) + ' ' + (y + h * (yy - amp * .5)).toFixed(1) + ' S' + (x + w * .88).toFixed(1) + ' ' + (y + h * (yy - amp)).toFixed(1) + ' ' + (x + w) + ' ' + (y + h * (yy + amp * .2)).toFixed(1) + ' V' + (y + h) + ' H' + x + 'Z" fill="' + fill + '"/>'; };
        s += '<linearGradient id="psky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + s0 + '"/><stop offset=".78" stop-color="' + s1 + '"/></linearGradient>' + R(x, y, w, h, 'url(#psky)');
        s += C(x + w * .68, y + h * .4, m * .3, dark ? c1 : '#ffffff', ' opacity=".2"') + C(x + w * .68, y + h * .4, m * .16, dark ? mix(c1, '#ffffff', .3) : mix(c1, '#ffffff', .12));
        s += hill(.62, .09, mix(c0, s1, .62)) + hill(.76, .07, mix(c0, s1, .3)) + hill(.9, .05, dark ? mix(c0, '#000000', .5) : mix(c0, '#000000', .08));
      } else if (kind === 'burst') {
        var by0 = y + h * .56, rays = '', n = 18, far = Math.max(w, h);
        for (i = 0; i < n; i += 2) { var a0 = Math.PI * 2 * i / n + .2, a1 = Math.PI * 2 * (i + 1) / n + .2; rays += 'M' + cx.toFixed(0) + ' ' + by0.toFixed(0) + ' L' + (cx + Math.cos(a0) * far).toFixed(0) + ' ' + (by0 + Math.sin(a0) * far).toFixed(0) + ' L' + (cx + Math.cos(a1) * far).toFixed(0) + ' ' + (by0 + Math.sin(a1) * far).toFixed(0) + 'Z'; }
        s += R(x, y, w, h, dark ? mix(c0, '#000000', .3) : c0) + '<path d="' + rays + '" fill="' + c1 + '" opacity=".42"/>' + R(x, y, w, h, 'url(#pdots)', ' opacity=".55"') + C(cx, by0, m * .31, '#ffffff', ' opacity=".28"') + C(cx, by0, m * .235, c1) + C(cx, by0, m * .235, 'url(#psph)') + C(cx - m * .32, y + h * .26, m * .03, '#ffffff') + C(cx + m * .36, y + h * .78, m * .022, '#ffffff') + C(cx + m * .3, y + h * .2, m * .016, '#ffffff');
      } else if (kind === 'geo') {
        s += R(x, y, w, h, dark ? mix(c0, '#000000', .42) : mix(c2, c0, .09)) + C(x + w * .3, y + h * .62, m * .34, dark ? mix(c0, '#ffffff', .12) : c0) + '<path d="M' + (x + w) + ' ' + y + ' h-' + (m * .46).toFixed(1) + ' a' + (m * .46).toFixed(1) + ' ' + (m * .46).toFixed(1) + ' 0 0 0 ' + (m * .46).toFixed(1) + ' ' + (m * .46).toFixed(1) + 'Z" fill="' + c1 + '"/>' + R(x + w * .58, y + h * .7, w * .3, h * .055, dark ? '#ffffff' : '#17131c') + R(x + w * .58, y + h * .8, w * .18, h * .055, c1) + R(x + w * .5, y + h * .1, m * .22, m * .22, 'url(#pdots)');
      } else if (kind === 'blob') {
        s += '<linearGradient id="pblob" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + (dark ? mix(c0, '#000000', .3) : mix(c0, c2, .6)) + '"/><stop offset="1" stop-color="' + (dark ? mix(c1, '#000000', .5) : mix(c1, c2, .5)) + '"/></linearGradient>' + R(x, y, w, h, 'url(#pblob)');
        [[.38, .5, .27, c1], [.7, .34, .16, c0], [.74, .72, .11, mix(c1, '#ffffff', .45)], [.18, .2, .07, mix(c0, '#ffffff', .35)]].forEach(function (b) { s += '<ellipse cx="' + (x + w * b[0]).toFixed(1) + '" cy="' + (y + h * b[1] + m * b[2] * 1.08).toFixed(1) + '" rx="' + (m * b[2] * .8).toFixed(1) + '" ry="' + (m * b[2] * .15).toFixed(1) + '" fill="#000" opacity=".16"/>' + C(x + w * b[0], y + h * b[1], m * b[2], b[3]) + C(x + w * b[0], y + h * b[1], m * b[2], 'url(#psph)'); });
        if (o.glass) s += R(x + w * .1, y + h * .58, w * .52, h * .28, '#ffffff', ' fill-opacity=".14" stroke="#ffffff" stroke-opacity=".5" rx="' + (m * .04).toFixed(1) + '"') + R(x + w * .15, y + h * .64, w * .26, h * .035, '#ffffff', ' opacity=".7" rx="4"') + R(x + w * .15, y + h * .72, w * .38, h * .025, '#ffffff', ' opacity=".35" rx="4"');
      } else if (kind === 'star') {
        var base = dark ? mix(c0, '#000000', .3) : mix(c2, c1, .16), hole = dark ? mix(c0, '#000000', .3) : c2;
        s += R(x, y, w, h, base) + R(x, y, w, h, 'url(#pstar)', ' opacity=".6"') + star8(cx, cy, m * .37, 'fill="' + (dark ? c1 : c0) + '"') + star8(cx, cy, m * .3, 'fill="' + hole + '"') + C(cx, cy, m * .17, c1) + C(cx + m * .055, cy - m * .02, m * .14, hole);
      } else {
        s += '<radialGradient id="pspot" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="' + mix(c0, '#000000', .2) + '"/><stop offset="1" stop-color="#05050a"/></radialGradient>' + R(x, y, w, h, 'url(#pspot)') + '<path d="M' + (cx - m * .07).toFixed(1) + ' ' + y + ' L' + (cx - m * .44).toFixed(1) + ' ' + (y + h) + ' H' + (cx + m * .44).toFixed(1) + ' L' + (cx + m * .07).toFixed(1) + ' ' + y + 'Z" fill="#ffffff" opacity=".07"/>';
        [.34, .25, .16].forEach(function (q, j) { s += '<circle cx="' + cx.toFixed(1) + '" cy="' + (y + h * .5).toFixed(1) + '" r="' + (m * q).toFixed(1) + '" fill="none" stroke="' + (j === 1 ? '#ffffff' : c1) + '" stroke-width="' + (m * .012).toFixed(1) + '" filter="url(#pglow)" opacity="' + (.95 - j * .15) + '"/>'; }); s += C(cx, y + h * .5, m * .09, c1) + C(cx, y + h * .5, m * .09, 'url(#psph)');
      }
      var cap = String(f.visual || t.hero || 'your picture').replace(/\s+/g, ' '), room = Math.floor((w - u * 16) / (u * .9)); cap = cap.length > room ? cap.slice(0, Math.max(10, room - 1)) + '…' : cap;
      var capY = capTop ? y + capTop : y + h - u * 5;
      return s + R(x + u * 1.6, capY, cap.length * u * .9 + u * 11.5, u * 3.2, '#000000', ' fill-opacity=".5" rx="' + (u * 1.6).toFixed(1) + '"') + tx(x + u * 3, capY + u * 2.1, 'PICTURE · ' + cap, u * 1.4, '#ffffff', { o: .92, f: mono }) + '</g>';
    };
    var defs = '<defs><linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + bgA + '"/><stop offset="1" stop-color="' + bgB + '"/></linearGradient><linearGradient id="pscr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".26" stop-color="#000" stop-opacity=".04"/><stop offset=".52" stop-color="#000" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></linearGradient><radialGradient id="psph" cx="34%" cy="30%" r="72%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient><filter id="pglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="' + (u * .7).toFixed(1) + '" result="b"/><feFlood flood-color="' + acc + '"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="pgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/></filter><pattern id="pdots" width="' + (u * 1.9).toFixed(1) + '" height="' + (u * 1.9).toFixed(1) + '" patternUnits="userSpaceOnUse"><circle cx="' + (u * .5).toFixed(1) + '" cy="' + (u * .5).toFixed(1) + '" r="' + (u * .26).toFixed(1) + '" fill="' + (dark ? '#ffffff' : c1) + '" opacity=".4"/></pattern><pattern id="pstar" width="' + (u * 7).toFixed(1) + '" height="' + (u * 7).toFixed(1) + '" patternUnits="userSpaceOnUse">' + star8(u * 3.5, u * 3.5, u * 2.9, 'fill="none" stroke="' + c1 + '" stroke-width="' + (u * .14).toFixed(2) + '"') + '</pattern></defs>';
    var g = R(0, 0, W, H, 'url(#pbg)'), col = ink, y, by, gap = u * 2.6, x0 = P, room;
    if (/retro|sticker|promoburst|patriotic/.test(S.style)) g += R(0, 0, W, H, 'url(#pdots)', ' opacity=".45"');
    if (/geometric|islamicflat|luxury|embroidery|woodcarve/.test(S.style)) g += R(0, 0, W, H, 'url(#pstar)', ' opacity=".14"');
    if (v === 1) {
      onImg = has('hero'); if (onImg) { g += artG(0, 0, W, H, 0, P + u * 4) + R(0, 0, W, H, 'url(#pscr)'); col = '#ffffff'; }
      g += brandG(P, P + u * 1.3, col); by = H - P * .75; g += conG(P, by, col); by -= u * 3.2;
      if (has('cta')) { by -= ctaH; g += ctaG(P, by); by -= gap; }
      if (has('info') && by - infoH - headH > P + u * 8) { by -= infoH; g += infoG(P, by, Math.min(W - P * 2, u * 62), col); by -= gap; }
      if (pts.length && by - pts.length * liH - headH > P + u * 8) { by -= pts.length * liH; g += listG(P, by, col); by -= gap * .5; }
      g += headG(P, by - headH, col); if (has('badge')) g += badgeG(W - P - u * 7.5, P + u * 8, u * 7.5);
    } else if (v === 0) {
      y = P; g += brandG(P, y + u * 1.3, col); y += u * 4.6; g += headG(P, y, col); y += headH + gap * .5;
      by = H - P * .75; g += conG(P, by, col); by -= u * 3.2;
      if (has('cta')) { by -= ctaH; g += ctaG(P, by); by -= gap; }
      if (has('info') && by - infoH > y) { by -= infoH; g += infoG(P, by, colW, col); by -= gap; }
      if (pts.length && by - pts.length * liH > y) { by -= pts.length * liH; g += listG(P, by, col); by -= gap * .6; }
      if (wide) { if (has('hero')) g += artG(W * .54, P, W * .46 - P, H - P * 2, rad); if (has('badge')) g += badgeG(W * .54 + u * 3, P + u * 6, u * 7.5); }
      else { room = by - y; if (has('hero') && room > u * 14) { g += artG(P, y, W - P * 2, room, rad); if (has('badge')) g += badgeG(W - P - u * 5.5, y + u * 3, u * 7.5); } else if (has('badge')) g += badgeG(W - P - u * 7.5, P + u * 8, u * 7.5); }
    } else {
      var m2 = P * .5; x0 = m2 + P * .62; g += R(m2, m2, W - m2 * 2, H - m2 * 2, 'none', ' stroke="' + ink + '" stroke-opacity=".3" stroke-width="' + Math.max(1.5, u * .16).toFixed(1) + '" rx="' + (rad * .9).toFixed(1) + '"');
      y = x0;
      if (wide) { if (has('hero')) g += artG(W * .54, x0, W * .46 - x0, H - x0 * 2, rad * .7); if (has('badge')) g += badgeG(W * .54 + u * 3, x0 + u * 6, u * 7.5); }
      else if (has('hero')) { var hh = Math.round(H * (pts.length || has('info') ? .4 : .47)); g += artG(x0, y, W - x0 * 2, hh, rad * .7); if (has('badge')) g += badgeG(W - x0 - u * 6, y + hh - u * 1.5, u * 7.5); y += hh + gap * 1.1; }
      g += headG(x0, y, col); y += headH + gap * .4;
      by = H - x0 + u * .6; g += brandG(x0, by, col) + (wide ? '' : conG(W - x0, by, col, 'end')); by -= u * 3.6;
      if (has('cta')) { by -= ctaH; g += ctaG(x0, by); by -= gap * .8; }
      if (has('info') && by - y >= infoH) { g += infoG(x0, y, wide ? colW : W - x0 * 2, col); y += infoH + gap * .7; }
      if (pts.length && by - y >= pts.length * liH) g += listG(x0, y, col);
    }
    if (o.frame) g += R(u * 1.5, u * 1.5, W - u * 3, H - u * 3, 'none', ' stroke="' + acc + '" stroke-opacity=".85" stroke-width="' + (u * .24).toFixed(1) + '"') + R(u * 2.4, u * 2.4, W - u * 4.8, H - u * 4.8, 'none', ' stroke="' + acc + '" stroke-opacity=".4" stroke-width="1.5"');
    if (S.style === 'brutal') g += R(u * .5, u * .5, W - u, H - u, 'none', ' stroke="' + ink + '" stroke-width="' + u.toFixed(1) + '"');
    if (o.tape) g += '<rect x="' + (W * .36).toFixed(0) + '" y="' + (-u * 1.2).toFixed(1) + '" width="' + (u * 17).toFixed(0) + '" height="' + (u * 4.2).toFixed(1) + '" fill="#efe2bd" opacity=".85" transform="rotate(-3 ' + (W * .45).toFixed(0) + ' 0)"/><rect x="' + (W - u * 13).toFixed(0) + '" y="' + (H - u * 9).toFixed(0) + '" width="' + (u * 16).toFixed(0) + '" height="' + (u * 4).toFixed(1) + '" fill="#efe2bd" opacity=".8" transform="rotate(-42 ' + (W - u * 5).toFixed(0) + ' ' + (H - u * 7).toFixed(0) + ')"/>';
    if (o.grain) g += '<rect width="' + W + '" height="' + H + '" filter="url(#pgrain)" opacity=".5"/>';
    var c1e = $('#canvas'); c1e.style.aspectRatio = a.w + '/' + a.h; c1e.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Poster mock-up drawn from your brief">' + defs + g + '</svg>';
    $('#layoutNote').textContent = ['Type-led: big headline first, then the picture.', 'Image-led: the picture fills the poster and the words sit on top.', 'Framed: a clean frame with the words underneath.'][v] + ' Drawn live from your words, colours, lettering and style. The scene is a stand-in for your picture.';
  }
  /* fits the mock-up to the stage and fills the caption strip under it */
  function afterPreview() {
    var cv = $('#canvas'), ar = String(cv.style.aspectRatio || '4/5').split('/'), ratio = (+ar[0] || 4) / (+ar[1] || 5), a = aspect(), meta = $('#pvMeta');
    cv.style.width = 'min(100%, ' + Math.round(560 * ratio) + 'px)';
    if (meta) { var poster = !isPhoto(); meta.innerHTML = (poster && a ? '<span class="pm-size"><b>' + esc(a.id) + '</b>' + esc(a.use) + '</span>' : '') + (poster ? '<span class="pm-sw">' + pal().c.map(function (x) { return '<i style="background:' + x + '"></i>'; }).join('') + '</span><span class="pm-style">' + esc(style().name) + '</span>' : '<span class="pm-style">' + esc(type().name) + '</span><span>' + esc((lookObj() || {}).n || 'Sketch') + '</span>'); }
  }

  /* ---------- tabs, save, misc ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (b) { b.addEventListener('click', function () { tab = b.dataset.t; Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (x) { x.classList.toggle('on', x === b); }); renderSetUI(); renderOutput(); }); });
  function copy(t, m) { var done = function () { toast(m || 'Copied'); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fb); else fb(); function fb() { var x = document.createElement('textarea'); x.value = t; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed'); } x.remove(); } }
  $('#copy').onclick = function () { copy($('#output').textContent, 'Copied'); };
  $('#dl').onclick = function () { var t = '# Poster brief: ' + (S.f.headline || type().name) + '\n\n## Prompt\n\n' + composePrompt() + '\n\n## Text to render\n\n' + composeText() + '\n\n## JSON brief\n\n```json\n' + composeJSON() + '\n```\n'; var b = new Blob([t], { type: 'text/markdown' }), u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = 'poster-brief-' + ((S.f.headline || 'poster').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)) + '.md'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 400); };
  $('#real').onchange = function (e) { S.real = e.target.checked; save(); renderOutput(); };

  /* ---------- secret style unlock ---------- */
  function unlockSecret(fromQuick) {
    if (store.get('zas_secret', false)) { toast('Secret style is already unlocked'); return; }
    store.set('zas_secret', true); document.body.classList.add('unlocked'); buildStatic(); renderAll();
    toast('Secret style unlocked: Hyper-real 3D crew'); var st = document.getElementById('styles'); if (st && st.scrollIntoView) st.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  (function () { var n = 0, t = 0, lg = document.querySelector('.logo'); if (!lg) return; lg.style.cursor = 'pointer'; lg.addEventListener('click', function () { var now = Date.now(); n = now - t < 2500 ? n + 1 : 1; t = now; if (n >= 5) { n = 0; unlockSecret(); } }); })();
  /* ---------- Let AI Choose: a built-in smart picker (rules, runs in the browser, sends nothing anywhere) ---------- */
  var AI_BASE = { promo: ['retro', 'sticker', 'brutal', 'grunge', 'cinema', 'premium3d', 'promoburst'], wedding: ['letterpress', 'editorial', 'luxury', 'embroidery', 'islamicflat'], film: ['cinema', 'grunge', 'brutal', 'talkstage'], food: ['retro', 'cinema', 'paper', 'organic', 'neon', 'premium3d', 'promoburst'], event: ['swiss', 'neon', 'grunge', 'doodle', 'scrapbook', 'patriotic', 'talkstage'], launch: ['glass', 'swiss', 'luxury', 'cinema', 'premium3d', 'isodiorama'], hiring: ['swiss', 'glass', 'clay', 'paper'], notice: ['swiss', 'brutal', 'editorial'], quote: ['editorial', 'letterpress', 'geometric'], info: ['clay', 'paper', 'swiss', 'isodiorama'], property: ['luxury', 'editorial', 'organic', 'isodiorama'], greeting: ['patriotic', 'geometric', 'paper', 'letterpress', 'scrapbook'] };
  var AI_WORDS = [
    [/kids|kanak|children|toy|school|sekolah|tadika/i, { clay: 3, sticker: 2 }, 'kids and friendly words'],
    [/luxury|premium|gold|emas|jewel|hotel|fine dining|vip|exclusive|perfume/i, { luxury: 4 }, 'premium words'],
    [/night|malam|gaming|bar\b|neon|club|late|midnight|supper/i, { neon: 4 }, 'night-time words'],
    [/organic|health|sihat|skincare|herbal|farm|fresh|segar|green|natural/i, { organic: 4 }, 'fresh and natural words'],
    [/raya|ramadan|ramadhan|eid|deepavali|cny|merdeka|kemerdekaan|festive|ucapan|selamat|national day|hari kebangsaan|christmas/i, { geometric: 4, paper: 1 }, 'festive words'],
    [/bake|roti|kek|cake|heritage|craft|artisan|handmade|tradisional|traditional/i, { letterpress: 3, paper: 1 }, 'heritage and craft words'],
    [/tech|app\b|fintech|\bai\b|digital|software|startup|cloud|online|website/i, { glass: 3, swiss: 2 }, 'tech words'],
    [/street|gig|band|konsert|concert|youth|skate|streetwear|hip hop/i, { grunge: 4, brutal: 1 }, 'street and youth words'],
    [/fashion|design|bold|statement|exhibition|pameran/i, { brutal: 3, editorial: 2 }, 'fashion and design words'],
    [/workshop|class|kelas|community|komuniti|gotong|volunteer|sukarelawan/i, { doodle: 3, paper: 2 }, 'community words'],
    [/sale|jualan|diskaun|discount|promo|% off|murah|offer|voucher|flash/i, { retro: 2, sticker: 2, brutal: 1 }, 'sale words'],
    [/coffee|kopi|cafe|restaurant|kedai|menu|nasi|burger|makan|lunch|dinner|breakfast|sarapan/i, { cinema: 3, retro: 1, organic: 1 }, 'food and cafe words'],
    [/travel|film|story|trip|cuti|holiday|pelancongan/i, { cinema: 3 }, 'travel and story words'],
    [/magazine|lifestyle|personal brand|blog|podcast/i, { editorial: 3 }, 'lifestyle words']
  ];
  AI_WORDS.push([/ramadan|ramadhan|raya|aidilfitri|aidiladha|eid|masjid|mosque|surau|islam|halal|maulid|sedekah|zakat|hijrah/i, { islamicflat: 6 }, 'Islamic and festive words'], [/liquid|fluid|chrome|iridescent|perfume|wangian|skincare|beauty|music|muzik|abstract|futuristic/i, { liquid: 5 }, 'liquid and beauty words'], [/embroider|sulam|tapestry|songket|tekat|silk|sutera|cheongsam|heritage|warisan|cny/i, { embroidery: 6 }, 'embroidery and heritage words'], [/ukir|carv|carved|wood|kayu|batik|teak|jati|warisan|heritage|tradisional/i, { woodcarve: 5 }, 'carving and craft words'], [/talk|seminar|webinar|speaker|penceramah|conference|keynote|summit|forum|ceramah|bengkel/i, { talkstage: 6 }, 'talk and speaker words'], [/promo|diskaun|discount|sale|jualan|harga|rm ?\d|price|kedai|warung|order|menu|beli|buy/i, { promoburst: 3 }, 'promo words'], [/toy|figure|figurine|mascot|chibi|collectible|avatar|character|blind box|vinyl|funko|pop mart/i, { vinyltoy: 8 }, 'toy and character words'], [/merdeka|kemerdekaan|independence|national day|hari kebangsaan|patriot|bendera|flag|jalur gemilang|31 ogos|17 agustus|sukan|sports day|negaraku|bersatu/i, { patriotic: 7 }, 'national-day words'], [/drink|minuman|coffee|kopi|boba|juice|snack|cosmetic|skincare|perfume|new flavou?r|ice cream|dessert/i, { premium3d: 5 }, 'drink and product words'], [/student|mahasiswa|diary|journal|memories|memory|collage|handmade|diy|scrapbook|birthday|hari jadi/i, { scrapbook: 5 }, 'memory and handmade words'], [/explain|how it works|platform|map|city|miniature|cutaway|system|sistem|smart home|property|tour/i, { isodiorama: 3 }, 'explainer and place words']);
  var AI_MOOD = { Premium: { luxury: 3, editorial: 1 }, Playful: { clay: 2, sticker: 2, doodle: 1 }, Friendly: { clay: 2, doodle: 2, paper: 1 }, Bold: { brutal: 2, retro: 1, grunge: 1 }, Urgent: { brutal: 2, retro: 2 }, Calm: { organic: 2, editorial: 1, paper: 1 }, Serious: { swiss: 3, editorial: 1 }, Warm: { retro: 1, cinema: 1, organic: 1 } };
  var AI_PACK = { swiss: ['Serious', 'Calm', 0, 'bold', false], retro: ['Bold', 'Warm', 1, 'retro', false], grunge: ['Bold', 'Urgent', 5, 'condensed', false], clay: ['Playful', 'Friendly', 4, 'retro', false], paper: ['Friendly', 'Warm', 1, 'hand', false], neon: ['Bold', 'Playful', 4, 'bold', false], editorial: ['Calm', 'Premium', 5, 'elegant', true], luxury: ['Premium', 'Calm', 3, 'elegant', true], organic: ['Calm', 'Friendly', 2, 'elegant', true], glass: ['Serious', 'Premium', 0, 'bold', false], doodle: ['Friendly', 'Playful', 1, 'hand', false], letterpress: ['Warm', 'Calm', 1, 'elegant', false], cinema: ['Warm', 'Premium', 3, 'bold', true], sticker: ['Playful', 'Friendly', 4, 'retro', false], brutal: ['Bold', 'Urgent', 5, 'condensed', false], geometric: ['Warm', 'Premium', 2, 'elegant', false], premium3d: ['Bold', 'Premium', 1, 'retro', false], islamicflat: ['Warm', 'Calm', 2, 'elegant', false], liquid: ['Premium', 'Bold', 4, 'bold', false], embroidery: ['Warm', 'Premium', 1, 'elegant', false], woodcarve: ['Warm', 'Calm', 1, 'elegant', false], talkstage: ['Serious', 'Bold', 5, 'bold', false], promoburst: ['Bold', 'Urgent', 1, 'retro', false], vinyltoy: ['Playful', 'Friendly', 4, 'retro', false], patriotic: ['Bold', 'Warm', 1, 'condensed', false], scrapbook: ['Playful', 'Friendly', 1, 'hand', false], isodiorama: ['Friendly', 'Calm', 0, 'bold', false], beautykv: ['Calm', 'Premium', 2, 'elegant', true], rerender: ['Bold', 'Premium', 3, 'bold', true] };
  AI_WORDS.push([/football|bola ?sepak|futsal|pemain|athlete|atlet|e-?sports|gamer|gaming|streamer|signing|transfer|match ?day|carousel|remake|re-?render|reimagin|cinematic render|game cinematic/i, { rerender: 6 }, 'sport, gaming and re-render words']);
  AI_WORDS.push([/shampoo|syampu|conditioner|perapi|hand ?wash|body ?wash|shower|sabun|soap|lotion|losyen|serum|haircare|hair care|rambut|scalp|toiletr|personal care|penjagaan diri|sunscreen|moisturi[sz]|pelembap|cleanser|pencuci muka|toothpaste|ubat gigi|deodorant|supplement|vitamin/i, { beautykv: 7 }, 'personal-care words']);
  var AI_LOOK_RULES = {
    deck: [[/barber|salon|grooming|gunting/i, 'Barber Noir'], [/hotel|resort|villa|boutique|homestay/i, 'Olive Villa'], [/travel|tour|itinerary|pelancongan|adventure|outdoor|trek/i, 'Trail Pulse'], [/pasta|italian|trattoria|pizza/i, 'Trattoria Rustic'], [/seafood|fish|ikan|ocean|laut|fishery/i, 'Tide Harvest'], [/\btea\b|teh|matcha|artisan food|organic food/i, 'Tea Leaf Atelier'], [/yoga|prenatal|pregnan|mindful movement/i, 'Maternal Yoga'], [/skincare|serum|beauty|cosmetic|kecantikan/i, 'Serum Drop'], [/perfume|fragrance|wangian/i, 'Amber Mist'], [/steak|fine dining|grill|bbq/i, 'Steakhouse Dark'], [/catering|healthy meal|meal prep|salad/i, 'Fresh Plate'], [/real estate|property|listing|hartanah|rumah/i, 'Estate Gold'], [/solar|energy|green building|renewable/i, 'Solar Roof'], [/e-?commerce|shopee|lazada|online store|dropship/i, 'Cart Spark'], [/farm|agri|tani|plantation|ladang/i, 'Harvest Tech'], [/garden|taman|urban green|balcony plants/i, 'Rooftop Garden'], [/kids game|children|kanak|preschool|tadika/i, 'Mango Play'], [/language learning|vocabulary|duolingo|edtech|belajar bahasa/i, 'Word Quest'], [/fitness|gym|workout|senaman/i, 'Cheer Fit'], [/sports|football|futsal|marathon|sukan/i, 'Grain Sport'], [/fandom|k-?pop|idol|fan club/i, 'Idol Scrapbook'], [/streetwear|sneaker|custom print|merch/i, 'Street Label'], [/remote work|digital nomad|freelanc|work from/i, 'Nomad Notes'], [/thesis|dissertation|viva|conference paper/i, 'Thesis Noir'], [/biograph|documentary|memoir|history of/i, 'Reel Memories'], [/vision board|goal setting|mood board|new year goals/i, 'Dream Board'], [/architect|portfolio of buildings|interior design/i, 'Plan Portfolio'], [/museum|art history|gallery|artefact/i, 'Museum Parchment'], [/botany|botanical|herbarium|specimen/i, 'Engraving Scholar'], [/biology|chemistry|lab\b|experiment|science class/i, 'Lab Doodle'], [/nurs|pharmacy|patient education|medicine/i, 'Nurse Journal'], [/mental health|meditation|mindfulness/i, 'Calm Aura'], [/conservation|rainforest|wildlife|ecology/i, 'Canopy Night'], [/launch|kick-?off|sprint|workshop for team/i, 'Launch Pad'], [/security|cyber|hacker|ai research/i, 'Night Cipher'], [/ramadan|raya|eid|masjid|mosque|surau|zakat|sedekah|festive|aidilfitri/i, 'Festive lantern'], [/batik|songket|heritage|warisan|culture|budaya|museum|tourism|pelancongan|craft/i, 'Batik heritage'], [/startup|pitch|investor|funding|fundrais|saas|launch|growth/i, 'Pitch deck bold'], [/ai\b|software|cyber|app\b|api|cloud|tech|data centre|machine/i, 'Midnight neon'], [/game|gaming|retro|pixel|coding|student club/i, 'Retro pixel'], [/engineer|blueprint|factory|manufactur|process|how it works|construction/i, 'Blueprint'], [/health|clinic|nurse|nursing|patient|hospital|medical|wellbeing|kesihatan/i, 'Calm care'], [/eco|green|sustain|farm|agri|climate|environment|alam|tani/i, 'Earth and leaf'], [/class|lesson|school|teach|student|kelas|sekolah|belajar|training|latihan/i, 'Pastel classroom'], [/cafe|kopi|coffee|restaurant|kedai|food|warung|menu|bakery/i, 'Kopitiam warm'], [/luxury|premium|jewel|perfume|watch|hotel|resort/i, 'Noir gold'], [/research|statistic|survey|findings|report|kajian|data|census/i, 'Data newsroom'], [/brand story|trend|interview|magazine|editorial|fashion/i, 'Magazine cover story'], [/workshop|design thinking|portfolio|creative|journal|brainstorm/i, 'Paper journal'], [/cute|kawaii|notes|study|nota|diary/i, 'Kawaii notes'], [/product tour|showcase|ui\b|ux\b|design system|glass/i, 'Frost glass'], [/keynote|minimal|talk|ted\b|architect/i, 'Quiet minimal']],
    book: [[/clay|3d|toy|mainan/i, 'Clay 3D'], [/paper|kertas|craft/i, 'Paper cut-out'], [/crayon|pensel|lukis|draw/i, 'Crayon kids'], [/flat|modern|vector|simple/i, 'Flat vector'], [/night|bedtime|tidur|moon|bulan|bintang|star/i, 'Bedtime glow']],
    comic: [[/manga|jepun|japan|ninja|battle|action/i, 'Manga black and white'], [/webtoon|korea|romance|drama/i, 'Webtoon soft colour'], [/hero|superhero|power|magic|pahlawan/i, 'Chibi action'], [/kids|anak|moral|dongeng|fable/i, 'Kids storybook'], [/joke|lawak|funny|strip|meme/i, 'Flat funny strip'], [/western|detective|noir|villain/i, 'Western comic']],
    sales: [[/neon|tech|app|software|digital|ai\b|crypto/i, 'Neon dark'], [/kids|baby|toy|fun|game/i, 'Bright playful'], [/kopi|coffee|cafe|food|resepi|recipe|bakery|kek/i, 'Warm cafe cream'], [/wellness|skincare|yoga|calm|beauty/i, 'Soft pastel'], [/minimal|clean|course|kelas|corporate|business/i, 'Clean white'], [/premium|luxury|exclusive|ebook|masterclass/i, 'Dark gold premium']],
    thumb: [[/pixar|3d|kids|anak|cartoon|mascot|game|gaming/i, '3D render'], [/horror|mystery|dark|drama|cinematic|film|trailer|misteri/i, 'Cinematic'], [/review|vlog|tutorial|real|tech|unbox|phone|gadget/i, 'Photoreal'], [/comic|komik|funny|lawak|meme/i, 'Comic book'], [/doodle|hand|diy|craft|art/i, 'Classic doodle'], [/minimal|clean|business|bisnes|finance|kewangan/i, 'Modern sketch']],
    portrait: [[/night|malam|street|city/i, 'Night street'], [/beach|sunset|golden|outdoor|pantai|taman|park/i, 'Golden hour'], [/beauty|makeup|skincare|lipstick|close-?up/i, 'Beauty close-up'], [/vintage|retro|film|classic/i, 'Film grain'], [/black and white|monochrome|b&w|bw/i, 'Black and white'], [/fashion|studio|model|corporate|headshot|linkedin/i, 'Soft studio'], [/cafe|window|home|cozy|rumah/i, 'Window light']],
    product: [[/sale|marketplace|shopee|lazada|tokopedia|catalog|katalog|white|clean/i, 'Clean white'], [/luxury|premium|perfume|watch|jam|gold|dark/i, 'Dark premium'], [/food|snack|kopi|coffee|cake|makan|nasi|burger|sambal|chips|drink|minuman/i, 'Food close-up'], [/flat ?lay|bundle|set|hamper|gift/i, 'Flat lay'], [/bag|shoe|kasut|cloth|baju|fashion|tudung/i, 'Lifestyle'], [/hand|hold|size|scale/i, 'In hand'], [/outdoor|garden|nature|herbal/i, 'Outdoor']],
    story: [[/asmr|unbox|macro|satisfying|close-?up/i, 'Macro product'], [/ugc|review|testimonial|honest|vlog|tiktok/i, 'Handheld UGC'], [/kids|fun|playful|colourful|colorful|party/i, 'Bright and playful'], [/night|moody|dark|mystery|horror/i, 'Dark and moody'], [/3d|animation|cartoon|mascot/i, 'Stylised 3D'], [/launch|teaser|trailer|ad\b|cinematic|film/i, 'Cinematic']],
    infoplan: [[/grunge|punk|zine|streetwear|street|gig|band|underground|edgy|skate|konsert/i, 'Grunge zine'], [/composition|komposisi|anatomy|anatomi|parts|bahagian|bahan|ingredient|specs|spesifikasi|inside|dalam|struktur/i, 'Annotated hero'], [/compare|comparison|perbandingan|versus|vs\b|ev\b/i, 'Split-view compare'], [/data|stat|cost|price|harga|finance|kewangan/i, 'Dark data'], [/blueprint|engineer|how it works|machine|system|sistem|build/i, 'Blueprint'], [/recipe|resepi|coffee|kopi|food|cook|masak|drink|minuman/i, 'Hero and ledges'], [/kids|school|sekolah|learn|belajar/i, '3D clay'], [/craft|diy|handmade/i, 'Paper craft'], [/photo|macro|real/i, 'Macro photo'], [/guide|steps|langkah|tips|how to|cara /i, 'Flat editorial']]
  };
  AI_LOOK_RULES.portrait.unshift([/re-?render|remake|reimagin|game cinematic|cinematic render|gaming|gamer|e-?sports|footballer|athlete|atlet|pemain/i, 'Game cinematic']);
  function aiBrief() { var f = S.f, parts = []; Object.keys(f).forEach(function (k) { if (typeof f[k] === 'string' && f[k]) parts.push(f[k]); }); return parts.join(' \n ').toLowerCase(); }
  function aiChoose() {
    var text = aiBrief(), why = [], note = $('#aiNote');
    if (isPhoto()) {
      var kind = isDeck() ? 'deck' : isBook() ? 'book' : isComic() ? 'comic' : isSales() ? 'sales' : isThumb() ? 'thumb' : isInfo() ? 'infoplan' : isStory() ? 'story' : isProduct() ? 'product' : 'portrait', rules = AI_LOOK_RULES[kind], pick = null, hit = '';
      for (var i = 0; i < rules.length && !pick; i++) if (rules[i][0].test(text)) { pick = rules[i][1]; hit = text.match(rules[i][0])[0].trim(); }
      var list = lookList(), def = { portrait: 'Natural daylight', product: 'Lifestyle', story: 'Cinematic', infoplan: 'Isometric diorama', thumb: 'Flat vector', book: 'Soft pastel watercolor', comic: 'Cute slice-of-life', sales: 'Dark gold premium', deck: 'Boardroom brief' }[kind];
      var name = pick || def, idx = list.map(function (l) { return l.n; }).indexOf(name); if (idx < 0) idx = 0;
      S.look = idx; if (!S.moods.length) S.moods = ['Warm']; save(); renderAll();
      note.textContent = 'AI chose the look "' + list[idx].n + '"' + (hit ? ' because your brief mentions "' + hit + '".' : '. Add a few more words to the brief for a sharper pick.');
      toast('AI chose: ' + list[idx].n); return;
    }
    var sc = {}, add = function (id, n, reason) { sc[id] = (sc[id] || 0) + n; if (reason && why.indexOf(reason) < 0) why.push(reason); };
    (AI_BASE[S.type] || ['swiss']).forEach(function (id, i) { add(id, 3 - Math.min(i, 2) * .5, i === 0 ? 'the ' + type().name.toLowerCase() + ' type' : ''); });
    AI_WORDS.forEach(function (w) { if (w[0].test(text)) { Object.keys(w[1]).forEach(function (id) { add(id, w[1][id], w[2]); }); } });
    S.moods.forEach(function (m) { var t = AI_MOOD[m]; if (t) Object.keys(t).forEach(function (id) { add(id, t[id], 'your "' + m.toLowerCase() + '" mood'); }); });
    var best = Object.keys(sc).filter(function (id) { return AI_PACK[id]; }).sort(function (x, y) { return sc[y] - sc[x]; })[0] || 'swiss', pk = AI_PACK[best];
    S.style = best; S.pal = pk[2]; S.face = pk[3]; S.real = pk[4]; if (!S.moods.length) S.moods = [pk[0], pk[1]];
    S.concept = null; save(); buildStatic(); renderAll();
    var st = STYLES.filter(function (s) { return s.id === best; })[0], pn = PALETTES[pk[2]].n;
    note.textContent = 'AI chose "' + st.name + '" with the ' + pn + ' colours and ' + TYPEFACES[pk[3]].split(' ').slice(0, 4).join(' ') + ' lettering' + (why.length ? ', based on ' + why.slice(0, 3).filter(Boolean).join(', ') : '') + '. Not happy? Pick any style yourself, or press the button again after changing the brief.';
    toast('AI chose: ' + st.name);
  }
  $('#aiPick').onclick = aiChoose;


  /* ---------- need the words? a copywriter helper prompt for any chatbot ---------- */
  function wordsHelper() {
    var t = type(), f = S.f;
    return 'NEED THE WORDS? Paste this into any chatbot, then copy its lines into the boxes on the left.\n\nAct as a copywriter and creative partner. I am making a ' + t.name.toLowerCase() + ' poster' + (f.brand ? ' for "' + f.brand + '"' : '') + (f.headline ? ' about "' + f.headline + '"' : '') + '. Language: ' + S.lang + '. Audience: [who will see it].\nFirst give 3 different promo concepts, each with a short name and a one-line idea. Then, for the one you recommend, write: HEADLINE (2 to 6 words), SUBHEADLINE (one sentence), CALL TO ACTION (2 to 4 words), TAGLINE (one short line), 3 to 4 short BENEFIT lines that use only facts I give you, and an Instagram CAPTION (under 60 words) with 5 hashtags.\nRules: do not invent prices, discounts, dates, claims, benefits or contact details; if one is needed, leave a [placeholder]. My facts: [list your real facts here]. Keep every line short enough to read on a phone.';
  }
  /* ---------- copy and adapt a reference image (observe, imitate, modify) ---------- */
  function composeRef() {
    if (isDeck()) return composeDeckRef();
    return 'FROM A REFERENCE: observe, imitate, modify\n\nUse this when you have a poster or photo you like. Attach the reference image to your message in ChatGPT or Gemini, then paste everything below the line.\n\n----------------\nStudy the attached reference image in three steps.\n\n1. OBSERVE. In short bullet points describe its layout (where the headline, the hero visual, the details and the logo sit), its colour palette, its type style and hierarchy, its lighting, its mood and its level of detail. Do not describe or copy the people or any real brand.\n\n2. IMITATE. Keep the same layout, type hierarchy, colour logic, lighting and mood.\n\n3. MODIFY. Replace the content with my brief below and create the new image. Use my words exactly as written. Do not copy the reference\'s words, logos, faces or background scene.\n\nMY BRIEF\n' + composePrompt();
  }
  var WD = { monday: 1, isnin: 1, tuesday: 2, selasa: 2, wednesday: 3, rabu: 3, thursday: 4, khamis: 4, friday: 5, jumaat: 5, saturday: 6, sabtu: 6, sunday: 0, ahad: 0 };
  var WDN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MO = { jan: 0, januari: 0, january: 0, feb: 1, februari: 1, february: 1, mar: 2, mac: 2, march: 2, apr: 3, april: 3, may: 4, mei: 4, jun: 5, june: 5, jul: 6, julai: 6, july: 6, aug: 7, ogos: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9, okt: 9, oktober: 9, october: 9, nov: 10, november: 10, dec: 11, dis: 11, disember: 11, december: 11 };
  function dateIssues() {
    var text = Object.keys(S.f).map(function (k) { return typeof S.f[k] === 'string' ? S.f[k] : ''; }).join('\n'), out = [], seen = {};
    var wds = Object.keys(WD).join('|'), mos = Object.keys(MO).sort(function (x, y) { return y.length - x.length; }).join('|');
    var res = [[new RegExp('\\b(' + wds + ')\\b[,\\s]*(?:the\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?(' + mos + ')\\b\\.?,?\\s*(\\d{4})?', 'gi'), 1, 2, 3, 4], [new RegExp('\\b(' + wds + ')\\b[,\\s]*(' + mos + ')\\b\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b,?\\s*(\\d{4})?', 'gi'), 1, 3, 2, 4]];
    var thisYear = new Date().getFullYear();
    res.forEach(function (r) {
      var m; while ((m = r[0].exec(text))) {
        var wd = WD[m[r[1]].toLowerCase()], day = +m[r[2]], mon = MO[m[r[3]].toLowerCase()], yr = m[r[4]] ? +m[r[4]] : 0, years = yr ? [yr] : [thisYear, thisYear + 1];
        var ok = years.some(function (y) { var dt = new Date(y, mon, day); return dt.getMonth() === mon && dt.getDay() === wd; });
        if (!ok && !seen[m[0]]) { seen[m[0]] = 1; var mname = m[r[3]].charAt(0).toUpperCase() + m[r[3]].slice(1).toLowerCase(); out.push('Date check: "' + m[0].trim() + '" does not match the calendar. ' + years.map(function (y) { var dt = new Date(y, mon, day); return day + ' ' + mname + ' ' + y + ' is a ' + WDN[dt.getDay()]; }).join(', and ') + ', not a ' + WDN[wd] + '. Fix the day or the date before you generate.'); }
      }
    });
    return out;
  }
  function updateDateWarn() { var el = $('#dateWarn'); if (!el) return; var w = dateIssues(); el.hidden = !w.length; el.textContent = w.join(' '); }
  /* ---------- quick start: one line in, a filled brief out ---------- */
  var QUICK = [
    ['deck', /notebooklm|slide deck|slides|presentation|\bdeck\b|pembentangan|slaid/i],
    ['book', /storybook|story book|picture book|buku cerita|cerita kanak|cerita anak|dongeng/i],
    ['comic', /comic|komik|webtoon|manga|\bstrip\b/i],
    ['sales', /landing page|sales page|lynk|link in bio|jual ebook|halaman jualan|sales image/i],
    ['thumb', /thumbnail|thumbnail|youtube|\byt\b|shorts|video cover|tiktok cover|reels cover/i],
    ['story', /storyboard|video|reel|tiktok|asmr|\bdetik\b|\bseconds?\b|\bsaat\b|unboxing/i],
    ['hiring', /hiring|vacanc|jawatan|kerja kosong|recruit|career/i],
    ['event', /event|seminar|workshop|webinar|concert|majlis|konsert|meetup|conference/i],
    ['greeting', /raya|merdeka|kemerdekaan|merdeka|deepavali|christmas|cny|new year|tahun baru|selamat|greeting|ucapan|national day|hari kebangsaan/i],
    ['food', /food|makan|menu|nasi|kopi|coffee|cafe|restaurant|kedai|burger|cake|kek|drink|minuman/i],
    ['property', /property|rumah|house|condo|apartment|sewa|for rent|for sale/i],
    ['quote', /quote|motivation|kata|inspir/i],
    ['infoplan', /infographic|infografik|how to|cara |steps|langkah|guide|tips/i],
    ['product', /product photo|foto produk|packshot|flat lay|clean background|produk photo/i],
    ['portrait', /portrait|potret|fashion|model shoot|headshot/i],
    ['launch', /launch|pelancaran|new product|produk baru/i],
    ['promo', /promo|sale|diskaun|discount|jualan|offer|voucher|% off/i]
  ];
  function quickStart(text) {
    text = (text || '').trim(); if (!text) { toast('Type one line first'); return; }
    if (/^crew$/i.test(text)) { unlockSecret(true); $('#quickIn').value = ''; return; }
    var id = 'promo'; for (var i = 0; i < QUICK.length; i++) { if (QUICK[i][1].test(text)) { id = QUICK[i][0]; break; } }
    var t = TYPES.filter(function (x) { return x.id === id; })[0];
    S.type = id; S.f = Object.assign({}, DEFAULT.f); S.concept = null; S.variant = 0;
    var sm = SAMPLES[id] || {}; Object.keys(sm).forEach(function (k) { if (['headline', 'sub', 'idea', 'product', 'subject'].indexOf(k) < 0) S.f[k] = sm[k]; });
    if (id === 'thumb') S.aspect = '16:9';
    if (id === 'story') { text = text.replace(/^\s*(storyboard|video|reel)\s+/i, '').replace(/\s*\d+\s*(detik|seconds?|saat|s)\b/i, '').trim() || text; S.aspect = '9:16'; }
    if (t.mode === 'photo') { var key = id === 'deck' ? 'dtopic' : id === 'story' ? 'idea' : id === 'product' ? 'product' : 'subject'; S.f[key] = text; }
    else { S.f.headline = text.length > 48 ? text.slice(0, 46).trim() + '…' : text; S.f.visual = text; }
    var dm = text.match(/(\d+)\s*(detik|seconds?|saat|s)\b/i); if (id === 'story' && dm) S.f.length = dm[1] + ' seconds';
    $('#fields').dataset.type = ''; save(); renderAll(); toast('Brief started as: ' + t.name + '. Now adjust the details.');
    var tgt = document.getElementById('fields'); if (tgt && tgt.scrollIntoView) tgt.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  $('#quickGo').onclick = function () { quickStart($('#quickIn').value); };
  $('#quickIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); quickStart(this.value); } });
  $('#sample').onclick = function () { var ids = Object.keys(SAMPLES), id = ids[Math.floor(Math.random() * ids.length)]; S.type = id; if (id === 'thumb') S.aspect = '16:9'; S.f = Object.assign({}, DEFAULT.f, SAMPLES[id]); $('#fields').dataset.type = ''; save(); renderAll(); toast('Sample loaded'); };
  $('#resetAll').onclick = function () { S = JSON.parse(JSON.stringify(DEFAULT)); $('#fields').dataset.type = ''; save(); renderAll(); toast('Cleared'); };
  $('#saveBrief').onclick = function () { saved.unshift({ id: Date.now(), name: S.f.headline || type().name, at: new Date().toISOString().slice(0, 10), s: JSON.parse(JSON.stringify(S)) }); saved = saved.slice(0, 24); store.set('pbb_saved', saved); renderSaved(); toast('Brief saved'); };
  function renderSaved() {
    $('#savedCount').textContent = saved.length ? '(' + saved.length + ')' : '';
    $('#saved').innerHTML = saved.length ? saved.map(function (b) { return '<div class="sv"><div><b>' + esc(b.name) + '</b><small>' + b.at + ' · ' + esc((TYPES.filter(function (t) { return t.id === b.s.type; })[0] || { name: '' }).name) + '</small></div><div><button class="btn mini" data-o="' + b.id + '" type="button">Open</button><button class="btn mini" data-d="' + b.id + '" type="button">Delete</button></div></div>'; }).join('') : '<p class="note">Nothing saved yet. Press Save brief to keep this one.</p>';
    Array.prototype.forEach.call(document.querySelectorAll('[data-o]'), function (x) { x.onclick = function () { var b = saved.filter(function (y) { return String(y.id) === x.dataset.o; })[0]; if (b) { S = JSON.parse(JSON.stringify(b.s)); S.f = Object.assign({}, DEFAULT.f, S.f); $('#fields').dataset.type = ''; save(); renderAll(); window.scrollTo({ top: 0, behavior: 'smooth' }); toast('Brief opened'); } }; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-d]'), function (x) { x.onclick = function () { saved = saved.filter(function (y) { return String(y.id) !== x.dataset.d; }); store.set('pbb_saved', saved); renderSaved(); }; });
  }
  function renderAll() { renderChips(); renderStyleDetail(); renderFields(); renderPhotoUI(); renderSetUI(); renderConcepts(); renderOutput(); }

  /* motion: reveal + pointer glow */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0, rootMargin: '0px 0px -6% 0px' }) : null;
  Array.prototype.forEach.call(document.querySelectorAll('.card'), function (n) { io ? io.observe(n) : n.classList.add('in'); });
  document.addEventListener('pointermove', function (e) { document.documentElement.style.setProperty('--mx', e.clientX + 'px'); document.documentElement.style.setProperty('--my', e.clientY + 'px'); }, { passive: true });

  buildStatic(); renderAll(); renderSaved();
  /* open with ?q=one line (used by the portfolio front page); ?embed=1 never touches saved data */
  var qm = location.search.match(/[?&]q=([^&]+)/);
  if (qm) { var qt = ''; try { qt = decodeURIComponent(qm[1].replace(/\+/g, ' ')); } catch (e) { qt = qm[1]; } if (qt.trim()) { $('#quickIn').value = qt; quickStart(qt); $('#aiPick').click(); if (!EMBED) window.scrollTo(0, 0); } }
  if (EMBED) document.documentElement.setAttribute('data-embed', '1');
})();














