/* Poster Brief Builder: data. All wording here is original. */
const TYPES = [
  { id: 'promo', name: 'Promotion / Sale', icon: '%', focus: 'a clear offer that people notice in one second',
    fields: ['headline', 'sub', 'price', 'dates', 'contact', 'cta'], zones: ['hero', 'headline', 'badge', 'cta', 'contact'],
    hero: 'a striking hero visual of the product or offer', tone: 'energetic, trustworthy, urgent without shouting' },
  { id: 'food', name: 'Food & Drink', icon: '🍜', focus: 'appetite appeal and an easy order',
    fields: ['headline', 'sub', 'price', 'address', 'contact', 'cta'], zones: ['hero', 'headline', 'badge', 'cta', 'contact'],
    hero: 'the dish or drink as a close, mouth-watering hero shot with steam, gloss and fresh ingredients', tone: 'warm, tasty, inviting' },
  { id: 'event', name: 'Event', icon: '★', focus: 'what, when and where at a glance',
    fields: ['headline', 'sub', 'dates', 'address', 'contact', 'cta'], zones: ['hero', 'headline', 'info', 'cta', 'contact'],
    hero: 'an expressive key visual that captures the mood of the event', tone: 'exciting, welcoming, clear' },
  { id: 'launch', name: 'Product launch', icon: '▲', focus: 'one product, one promise',
    fields: ['headline', 'sub', 'price', 'dates', 'contact', 'cta'], zones: ['hero', 'headline', 'badge', 'cta', 'contact'],
    hero: 'the product as a hero object, beautifully lit, with room around it', tone: 'confident, modern, premium' },
  { id: 'hiring', name: 'Hiring / Recruitment', icon: '☺', focus: 'the role, the benefits and how to apply',
    fields: ['headline', 'sub', 'points', 'dates', 'contact', 'cta'], zones: ['hero', 'headline', 'list', 'cta', 'contact'],
    hero: 'friendly, diverse people at work or a clean abstract team motif', tone: 'friendly, professional, optimistic' },
  { id: 'notice', name: 'Announcement / Notice', icon: '!', focus: 'a message that cannot be misread',
    fields: ['headline', 'sub', 'points', 'dates', 'contact'], zones: ['headline', 'list', 'info', 'contact'],
    hero: 'a calm supporting graphic that does not compete with the message', tone: 'clear, calm, official' },
  { id: 'quote', name: 'Quote / Motivation', icon: '“', focus: 'a single line with room to breathe',
    fields: ['headline', 'sub', 'contact'], zones: ['headline', 'hero', 'contact'],
    hero: 'a quiet atmospheric background that supports the words', tone: 'reflective, inspiring, personal' },
  { id: 'info', name: 'Quick infographic', icon: '▦', focus: 'a simple story told in steps, numbers or comparisons',
    fields: ['headline', 'sub', 'points', 'contact'], zones: ['headline', 'list', 'hero', 'contact'],
    hero: 'clean icons and diagram shapes that explain the points', tone: 'clear, structured, educational' },
  { id: 'property', name: 'Property / Real estate', icon: '⌂', focus: 'the space, the location and the price',
    fields: ['headline', 'sub', 'price', 'address', 'contact', 'cta'], zones: ['hero', 'headline', 'badge', 'info', 'contact'],
    hero: 'a bright, honest photo of the property with natural light', tone: 'trustworthy, aspirational, clean' },
  { id: 'greeting', name: 'Greeting / Festive', icon: '☾', focus: 'warmth and a touch of celebration',
    fields: ['headline', 'sub', 'contact'], zones: ['hero', 'headline', 'contact'],
    hero: 'festive decorations and soft light that fit the occasion', tone: 'warm, respectful, joyful' }
];

const STYLES = [
  { id: 'swiss', best: 'Corporate, tech, talks and events', name: 'Swiss minimal', g: ['#f4f4f4', '#d9d9d9'], t: 'clean grid layout, one huge sans-serif headline, generous white space, a single accent colour, no decoration' },
  { id: 'retro', best: 'Food, fashion, music and sales', name: 'Retro pop', g: ['#ff9f1c', '#e71d36'], t: 'bold 1970s pop look, halftone dots, chunky rounded type, warm sunset colours, flat shapes with thick outlines' },
  { id: 'grunge', best: 'Streetwear, gigs and youth brands', name: 'Grunge street', g: ['#2b2b2b', '#c8ff00'], t: 'torn paper edges, masking tape, spray-paint texture, rough stencil type, high contrast, raw and loud' },
  { id: 'clay', best: 'Kids, apps, snacks and friendly services', name: '3D clay playful', g: ['#ffb3d9', '#8ad6ff'], t: 'soft 3D clay objects with rounded edges, pastel colours, gentle shadows, friendly rounded lettering' },
  { id: 'paper', best: 'Education, crafts, food and community', name: 'Papercraft layers', g: ['#2ec4b6', '#ff9f68'], t: 'layered cut-paper shapes with real depth shadows, tactile paper grain, simple bold silhouettes' },
  { id: 'neon', best: 'Nightlife, cafes, gaming and late opening hours', name: 'Neon night', g: ['#12002f', '#00e5ff'], t: 'dark night scene, glowing neon signage, wet reflections, magenta and cyan light, glowing type' },
  { id: 'editorial', best: 'Lifestyle, magazines and personal brands', name: 'Editorial magazine', g: ['#f1ebe0', '#1b1b1b'], t: 'magazine cover layout, large serif headline, tight typographic grid, a strong photographic hero, small caps details' },
  { id: 'luxury', best: 'Jewellery, hotels, fine dining and premium launches', name: 'Luxury dark gold', g: ['#0b0b0b', '#d4af37'], t: 'black background, gold foil details, thin elegant serif type, wide spacing, restrained and premium' },
  { id: 'organic', best: 'Health, skincare, cafes and farmers markets', name: 'Fresh organic', g: ['#e8f5c8', '#3a7d44'], t: 'natural textures, leaves and soft daylight, earthy greens and creams, a handwritten accent word' },
  { id: 'glass', best: 'Tech, apps, fintech and modern services', name: 'Glass UI modern', g: ['#7c5cff', '#19e3ff'], t: 'frosted glass cards over a smooth gradient mesh, crisp sans-serif type, soft glow and subtle grain' },
  { id: 'doodle', best: 'Workshops, community events and friendly cafes', name: 'Hand-drawn illustration', g: ['#fff3b0', '#ff6b6b'], t: 'ink linework with flat colour fills, playful doodles, imperfect hand lettering, friendly and human' },
  { id: 'letterpress', best: 'Bakeries, craft, heritage and artisan brands', name: 'Vintage letterpress', g: ['#e9dcc3', '#8c2f1b'], t: 'aged cream paper, two-colour ink, slightly uneven print, classic slab and serif type, decorative rules' },
  { id: 'cinema', best: 'Restaurants, films, travel and storytelling', name: 'Cinematic photo', g: ['#0f2027', '#f2994a'], t: 'a filmic photographic still with shallow depth of field, natural light and negative space reserved for text' },
  { id: 'sticker', best: 'Kids, snacks, social media and playful brands', name: 'Kawaii sticker', g: ['#ffe0f0', '#6a5cff'], t: 'cute outlined sticker elements, bright candy colours, white borders, bouncy rounded type' },
  { id: 'brutal', best: 'Fashion, design events and bold statements', name: 'Brutalist type', g: ['#ffffff', '#111111'], t: 'oversized raw type that fills the poster, stark black and white, one clashing colour, hard edges' },
  { id: 'geometric', best: 'Festive greetings, Raya, hotels and cultural events', name: 'Geometric elegance', g: ['#064e3b', '#e6c067'], t: 'interlocking geometric patterns, emerald and gold, symmetrical layout, refined calligraphic and serif type' }
];

const MOODS = ['Bold', 'Calm', 'Playful', 'Premium', 'Warm', 'Urgent', 'Friendly', 'Serious'];
const PALETTES = [
  { n: 'Celcom-ish blue', c: ['#0075c9', '#27d3ff', '#ffffff'] },
  { n: 'Sunset', c: ['#ff4d6d', '#ffa21f', '#fff1d6'] },
  { n: 'Forest', c: ['#1b4332', '#74c69d', '#f1faee'] },
  { n: 'Midnight gold', c: ['#0b0b0b', '#d4af37', '#f5f1e6'] },
  { n: 'Candy', c: ['#ff7ab8', '#6a5cff', '#fff6fb'] },
  { n: 'Mono', c: ['#111111', '#8a8a8a', '#ffffff'] }
];
const TYPEFACES = {
  bold: 'a heavy geometric sans-serif display face',
  elegant: 'an elegant high-contrast serif display face',
  hand: 'a lively hand-lettered brush script paired with a clean sans-serif',
  condensed: 'a tall condensed sans-serif that fits long words',
  retro: 'a chunky retro display face with soft rounded corners'
};
const ASPECTS = [
  { id: '1:1', label: '1:1 Square', w: 1, h: 1, use: 'Instagram feed post' },
  { id: '4:5', label: '4:5 Portrait', w: 4, h: 5, use: 'Instagram and Facebook feed' },
  { id: '9:16', label: '9:16 Story', w: 9, h: 16, use: 'Stories, Reels cover, TikTok, WhatsApp status' },
  { id: '3:4', label: '3:4 Poster', w: 3, h: 4, use: 'Print and general posters' },
  { id: '16:9', label: '16:9 Banner', w: 16, h: 9, use: 'Screens, YouTube, web banners' },
  { id: '1:1.414', label: 'A-series print', w: 1, h: 1.414, use: 'A4, A3 and A2 print (use the highest resolution available)' }
];
const TOOLS = ['Flow / Nano Banana', 'ChatGPT image', 'Seedream 5.0', 'Generic'];
const SAMPLES = {
  food: { headline: 'Nasi Lemak Ayam Berempah', sub: 'Fresh every morning, still piping hot', price: 'RM 8.90', dates: '', address: 'Jalan Ampang, Kuala Lumpur', contact: 'WhatsApp 012-345 6789', cta: 'Order now', brand: 'Kedai Mak Cik', points: '' },
  promo: { headline: 'Raya Mega Sale', sub: 'Up to 50% off selected items', price: 'From RM 29', dates: '1 to 14 April', address: '', contact: 'www.example.com', cta: 'Shop now', brand: 'Your Brand', points: '' },
  event: { headline: 'Creative Meetup KL', sub: 'An evening of design, AI and good coffee', price: '', dates: 'Saturday 18 Oct, 7 pm', address: 'The Hub, Bangsar', contact: '@creativemeetupkl', cta: 'Register free', brand: 'KL Creatives', points: '' },
  hiring: { headline: 'We are hiring', sub: 'Join a team that ships real work', price: '', dates: 'Apply by 30 June', address: '', contact: 'jobs@example.com', cta: 'Apply today', brand: 'Your Company', points: 'Graphic designer\nVideo editor\nSocial media executive' }
};

/* Portrait and fashion photo mode (original wording) */
TYPES.push({ id: 'portrait', name: 'Portrait / fashion photo', icon: '◐', mode: 'photo', focus: 'a believable person in a believable place',
  fields: ['subject', 'expression', 'pose', 'outfit', 'hair', 'location', 'light', 'camera', 'mood', 'pscene', 'prefs'], zones: ['hero'], hero: '', tone: 'natural, confident' });
const PHOTO_LOOKS = [
  { n: 'Natural daylight', light: 'soft open-shade daylight with gentle shadows', cam: 'a 50mm lens at eye level with moderate depth of field', t: 'clean, honest colour with natural skin tones' },
  { n: 'Soft studio', light: 'one large softbox slightly above and to the side, with a white fill card', cam: 'an 85mm portrait lens with shallow depth of field', t: 'smooth and polished, neutral backdrop, true-to-life colour' },
  { n: 'Golden hour', light: 'low warm sun behind the subject with a soft rim and gentle front fill', cam: 'a 70mm lens, subject sharp and background softly blurred', t: 'warm and glowing but natural, slightly lifted shadows' },
  { n: 'Window light', light: 'a single window to one side, shadows falling softly across the face', cam: 'a 35mm lens, close and intimate', t: 'quiet and calm with muted tones' },
  { n: 'Night street', light: 'mixed street lights and shop signs with a little flash on the subject', cam: 'a 35mm lens, slightly wide, handheld feel', t: 'urban and grainy, cool shadows with warm highlights' },
  { n: 'Black and white', light: 'directional light that shapes the face with clear shadows', cam: 'an 85mm lens with tight framing', t: 'black and white with rich mid-tones and fine grain' },
  { n: 'Film grain', light: 'available light, slightly uneven', cam: 'a 50mm lens, a little soft, with a light vignette', t: '35mm film colour, visible grain, faded blacks' },
  { n: 'Beauty close-up', light: 'soft frontal light with a small catch light in the eyes', cam: 'a 100mm portrait lens, very close, eyes in sharp focus', t: 'skin texture left natural, calm background' }
];
const SWAPS = {
  subject: ['a woman in her late twenties with warm brown skin and shoulder-length wavy hair', 'a man in his thirties with a short beard and kind eyes', 'an older woman with silver hair and laugh lines', 'a young man with short curly hair and glasses', 'a woman wearing a plain dusty-pink hijab', 'a boy of about ten with a gap-toothed grin'],
  pose: ['standing relaxed with weight on one leg, hands in pockets', 'sitting on a step, leaning forward with elbows on knees', 'walking toward the camera, mid-stride', 'leaning against a wall, looking off to the side', 'seated at a table with both hands around a cup', 'turning over one shoulder to look back'],
  location: ['a quiet back street with painted shophouses', 'a sunny rooftop with a hazy city skyline', 'a plain studio wall in warm grey', 'a small cafe with wooden tables', 'a beach at low tide in early morning', 'a bright corridor in an old building']
};
SAMPLES.portrait = { subject: 'a woman in her late twenties, warm brown skin, shoulder-length wavy hair', expression: 'a relaxed half-smile', pose: 'sitting on a step with elbows on her knees, looking just past the camera', outfit: 'a loose cream linen shirt and dark trousers', hair: 'hair worn down, natural makeup', location: 'a quiet back street with painted shophouses', light: '', camera: '', mood: 'calm and confident' };
/* Product photo mode (original wording) */
TYPES.push({ id: 'product', name: 'Product photo', icon: '▣', mode: 'photo', sub: 'product', focus: 'a product that looks real, clean and worth buying',
  fields: ['product', 'surface', 'props', 'angle', 'light', 'camera', 'mood'], zones: ['hero'], hero: '', tone: 'clean, trustworthy' });
const PRODUCT_LOOKS = [
  { n: 'Clean white', light: 'large soft light from the front-left with a white bounce card, a soft grounded shadow under the product', cam: 'a 90mm macro-style lens, straight on, whole product in sharp focus', t: 'pure white seamless background, accurate colour, marketplace ready' },
  { n: 'Flat lay', light: 'soft window light from one side, gentle shadows falling away from the objects', cam: 'a 50mm lens shot straight down from above, everything on one plane', t: 'tidy styled arrangement with clear space between items' },
  { n: 'Lifestyle', light: 'natural daylight from a window, believable shadows', cam: 'a 50mm lens at table height, shallow depth of field', t: 'the product in everyday use, warm and honest' },
  { n: 'Dark premium', light: 'one narrow strip light from the side to trace the edges, dark falloff elsewhere', cam: 'an 85mm lens, low angle, tight crop', t: 'moody, rich blacks, a single glint of highlight' },
  { n: 'Colour backdrop', light: 'soft even light with a gentle shadow cast on a coloured paper backdrop', cam: 'a 70mm lens, slightly above, centred', t: 'bold single-colour background chosen to match the brand' },
  { n: 'Food close-up', light: 'soft side light with a small back light to show steam, gloss or crumbs', cam: 'a 100mm macro lens at a 45 degree angle, shallow focus', t: 'appetising, natural colour, a few honest imperfections' },
  { n: 'Outdoor', light: 'open shade daylight with a little warm sun on the background', cam: 'a 50mm lens at eye level with a softly blurred scene', t: 'fresh and natural, product clearly the hero' },
  { n: 'Digital mockup', light: 'soft even studio light with a gentle shadow under the device', cam: 'a 50mm lens, slightly above, the screen square to the camera', t: 'a clean mockup of a digital product (an ebook cover, an app or a course) on a tidy device or stack, readable screen, soft pastel or dark backdrop' },
  { n: 'B-roll detail', light: 'soft directional light that rakes across the surface', cam: 'a 100mm macro lens with a very shallow focus on one small detail', t: 'close detail shots meant as video cut-aways: texture, a hand using the product, steam or droplets, space left for text' },
  { n: 'In hand', light: 'soft daylight, skin and product evenly lit', cam: 'a 50mm lens, close, hand and product in focus', t: 'a human scale cue, natural hand with correct fingers' }
];
/* brand-campaign looks (added 12 Nov 2026), appended so saved choices keep their place */
PRODUCT_LOOKS.push(
  { n: 'Sunlit campaign', light: 'hard direct sunlight from one high side angle, long crisp shadows across the set, light glowing through any glass or liquid', cam: 'a 70mm lens at a three-quarter tabletop angle (or straight down for a flat lay), the pack and its label tack-sharp', t: 'a brand-campaign shot: set, backdrop and props colour-matched to the pack (one main colour, one accent), a few props that show the eating or drinking moment, saturated but believable colour, the label fully readable' },
  { n: 'Warm bar and cafe', light: 'warm practical lights in the background melted into soft bokeh, a warm key light on the pack and a thin rim light tracing the glass', cam: 'an 85mm lens at a low hero angle, or the pack held toward the camera in a natural hand, shallow depth of field around f/2.8', t: 'a moody, lived-in bar or cafe scene with amber tones and deep shadows, the pack bright and readable against the dark background' },
  { n: 'Ingredient world', light: 'soft warm back light filtering through leaves or a window, dappled highlights, a gentle rim light on the pack and a soft fill so the label stays bright', cam: 'an 85mm lens at product eye level, the pack upright and square to the camera, the background melted into soft blur around f/2.8', t: 'the pack standing on a natural pedestal (a wet rock, a marble counter or a wooden board) inside the world of its hero ingredient or scent: the fruit, flower, leaf, oil or place it comes from, real ingredient props gathered at its base, a few floating droplets or petals, the whole scene colour-keyed to the pack, calm and premium, the label fully readable' }
);
Object.assign(SWAPS, {
  product: ['a matte green snack pouch with a window', 'a glass jar of homemade chilli sambal', 'a pair of white running shoes', 'a small bottle of face serum', 'a ceramic coffee mug', 'a boxed batik scarf'],
  surface: ['a pale wooden table', 'a pure white seamless sheet', 'dark slate', 'a sheet of coloured paper in brand colour', 'a marble counter', 'woven rattan matting'],
  props: ['a few scattered ingredients that match the product', 'soft folded linen and a small plant', 'nothing else, only the product', 'a bit of water splash droplets', 'two neutral objects for scale', 'a sprig of leaves and a small shadow card']
});
SAMPLES.product = { product: 'a matte green pouch of banana chips with a clear window, front label facing the camera', surface: 'a pale wooden table', props: 'two ripe bananas and a few chips spilling out', angle: 'slightly above, front of the pack facing the camera', light: '', camera: '', mood: 'fresh and appetising' };


/* Video storyboard mode (original wording; structure inspired by studying a public design GPT's behaviour) */
TYPES.push({ id: 'story', name: 'Video storyboard', icon: '▶', mode: 'photo', sub: 'story', focus: 'a short video told in clear scenes',
  fields: ['idea', 'length', 'scenes', 'backdrop', 'audio', 'camera', 'light', 'mood'], zones: ['hero'], hero: '', tone: 'clear, cinematic' });
const STORY_LOOKS = [
  { n: 'Macro product', light: 'soft studio light with gentle highlights on glossy surfaces', cam: 'extreme close-ups and top-down macro shots', t: 'photorealistic, tactile, satisfying detail' },
  { n: 'Cinematic', light: 'motivated key light with deep soft shadows', cam: 'slow push-ins, low angles and a final hero shot', t: 'filmic colour, shallow depth of field' },
  { n: 'Handheld UGC', light: 'natural window or room light', cam: 'phone-style handheld framing at eye level', t: 'honest, unpolished, trustworthy' },
  { n: 'Bright and playful', light: 'bright even light with saturated colour', cam: 'quick cuts, bouncy moves, centred framing', t: 'cheerful, clean, energetic' },
  { n: 'Dark and moody', light: 'one narrow side light with dark falloff', cam: 'slow orbit and tight crops', t: 'low-key, rich blacks, calm tension' },
  { n: 'Stylised 3D', light: 'clean studio lighting with soft shadows', cam: 'smooth virtual camera moves', t: 'polished 3D look with simple shapes and bold colour' }
];
const BEATS = [
  { n: 'The reveal', cam: 'close-up, slow push-in', mo: 'the first look at the subject, calm and clear' },
  { n: 'The detail', cam: 'extreme macro, slightly above', mo: 'texture and small movement fill the frame' },
  { n: 'The action', cam: 'macro side angle, quick cuts', mo: 'the main action happens, precise and rhythmic' },
  { n: 'The payoff', cam: 'close-up with a slight orbit', mo: 'the key moment lands and the result starts to show' },
  { n: 'The hero finish', cam: 'low-angle hero shot, slow dolly-in', mo: 'the finished subject holds still, then a beat of silence' }
];
Object.assign(SWAPS, {
  idea: ['an ASMR unboxing of a boxed model kit', 'a 10 second launch teaser for a new snack', 'making a cup of kopi from beans to pour', 'a before and after of a tidy desk', 'a recipe in five steps for nasi lemak', 'a sneaker being laced up and walked out'],
  backdrop: ['a clean matte black table', 'a bright kitchen counter', 'a pale wooden desk by a window', 'a plain studio sweep in warm grey', 'an outdoor cafe table', 'a coloured paper backdrop in the brand colour']
});
SAMPLES.story = { idea: 'an ASMR unboxing of a boxed model robot kit, hands only', length: '10 seconds', scenes: '5', backdrop: 'a clean matte black table', audio: 'real ASMR sounds only: box, plastic, clicks; no music and no voiceover', camera: '', light: '', mood: 'satisfying and calm' };

/* extra public styles (original wording) */
STYLES.push({ id: 'premium3d', best: 'Drinks, snacks, cosmetics and product launches', name: '3D premium ad', g: ['#d99a45', '#392116'], t: 'a hyper-polished 3D product advertising render: the hero floats at a slight angle with splashes, droplets and ingredients suspended around it, golden rim light, glossy reflections on a soft gradient background, and a chunky semi-3D embossed headline' });
STYLES.push({ id: 'scrapbook', best: 'Youth brands, social posts, cafes and events with personality', name: 'Scrapbook collage', g: ['#e8c9a0', '#ff6b8b'], t: 'a scrapbook collage on kraft paper with torn paper layers, washi tape, stickers, instant-photo frames, hand-drawn doodles and handwritten notes, slightly messy but still easy to read' });
STYLES.push({ id: 'isodiorama', best: 'Tech, explainers, launches, food and places', name: 'Isometric diorama', g: ['#7ec8ff', '#ffd27e'], t: 'a clean 3D isometric diorama: a miniature cutaway scene of the subject on a floating platform with tiny props, soft shadows, rounded forms and a calm gradient background, with the text on flat panels' });
STYLES.push({ id: 'vinyltoy', best: 'Mascots, kids, snacks, apps, collectible and character-led brands', name: '3D vinyl toy', g: ['#ffb38a', '#9fd8ff'], t: 'a cute 3D isometric designer-toy look: a collectible full-body chibi vinyl figurine with a big round head and tiny body, standing on a small isometric base with a few tiny props that match its job or hobby, smooth glossy plastic, rounded chunky shapes, vivid candy colours, soft studio light with gentle reflections, chunky rounded 3D lettering and a clean pastel backdrop' });
STYLES.push({ id: 'patriotic', best: 'National Day, Merdeka, sports and community campaigns, festive sales', name: 'Patriotic illustrated', g: ['#c8102e', '#0b2a6f'], t: 'a semi-flat, cel-shaded retro print illustration with dry-brush ink splatter, bold high-contrast red and white with navy and yellow accents, cheerful illustrated people, a large waving flag, a landmark skyline in grey halftone, a swooping ribbon banner with the date, and a heavy condensed headline with a script lead-in line' });

/* six extra styles chosen from many public prompt tools (all wording original) */
STYLES.push({ id: 'islamicflat', best: 'Ramadan, Raya, mosque events, halal brands and community', name: 'Modern Islamic flat', g: ['#0f6b5c', '#e6b84a'], t: 'a modern flat illustration with Islamic geometric patterns, crescent and star motifs, a mosque skyline silhouette and hanging lanterns, a deep green, navy and gold palette, clean shapes without outlines and calm elegant lettering' });
STYLES.push({ id: 'liquid', best: 'Beauty, drinks, music, tech and abstract brand launches', name: '3D liquid and fluid', g: ['#7a5cff', '#19e3ff'], t: 'glossy 3D liquid and fluid art: flowing chrome and iridescent liquid ribbons, glass-like droplets, a soft gradient backdrop, dramatic studio reflections and sleek modern lettering' });
STYLES.push({ id: 'embroidery', best: 'Heritage, festive, craft and cultural brands', name: 'Embroidery and tapestry', g: ['#c0392b', '#f1c40f'], t: 'a stitched embroidery and woven tapestry look: visible silk thread and satin stitches, raised texture, a fabric weave backdrop, an ornamental border, rich red, gold and teal threads and lettering formed by stitches' });
STYLES.push({ id: 'woodcarve', best: 'Heritage crafts, restaurants, batik and cultural events', name: 'Wood carving relief', g: ['#8d5a2b', '#e0b57a'], t: 'a hand-carved wooden relief panel: deep carved floral and vine patterns, chisel marks, warm polished teak tones, shallow depth shadows and lettering carved into the wood' });
STYLES.push({ id: 'talkstage', best: 'Talks, seminars, webinars and speaker announcements', name: 'Talk stage', g: ['#b00020', '#0b0b0b'], t: 'a dramatic conference-talk stage look: a dark stage with a single spotlight, a speaker silhouette, a big red circular stage mark, a bold white sans-serif title and a clean speaker details bar' });
STYLES.push({ id: 'promoburst', best: 'Food and drink promos, sales and kedai or warung posters', name: 'Promo burst', g: ['#ff4d2e', '#ffd23f'], t: 'a glossy high-energy promo look: a warm gradient backdrop, a huge product hero with splashes, a bold white-and-yellow headline with a brown outline on a wooden plank, a red starburst badge, benefit pills with check marks and a red call-to-action button' });

STYLES.push({ id: 'packcampaign', best: 'Packaged food and drink, sauces, snacks, jams, honey and coffee launches', name: 'Packaging campaign', g: ['#c8643b', '#1f8a8a'], t: 'a hyper-real brand-campaign product photo: the pack is the hero with its bold illustrated label facing the camera, the set, backdrop and props colour-matched to the pack (one main colour, one accent), hard direct sunlight with long crisp shadows and light glowing through the glass, props that show the eating or drinking moment, and a clean bold sans-serif headline in the open space above' });

STYLES.push({ id: 'specsheet', best: 'Cars, motorbikes, phones, appliances, e-bikes and any product sold on its numbers', name: 'Spec sheet launch', g: ['#1e4fa8', '#c9ced6'], t: 'a premium automotive-style launch poster: small brand and model line in thin spaced capitals at top left, a huge two-line italic condensed headline in brushed chrome metal ending with a small coloured square full stop, a bold italic subline, one plain sentence and an arrow call-to-action button; a frosted glass spec panel at top right with one giant hero number and its label, then three or four rows of thin line icons with a label and value; the hero product low in the frame at a three-quarter front angle, tack-sharp, with motion-blurred foliage on one side for speed and a big sunlit scenic backdrop under a blue sky; a dark gradient band along the bottom with four icon feature columns split by thin dividers; every word in the spec panel spelled exactly and every number checked' });

STYLES.push({ id: 'beautykv', best: 'Shampoo, skincare, soap, hand wash, lotion, perfume, supplements and other pharmacy-shelf products', name: 'Beauty key visual', g: ['#2f6b4f', '#f3c9d0'], t: 'a premium beauty and personal-care key visual built as one centred stack: the brand name small at top centre; a large two-line benefit headline in an elegant high-contrast serif (one word may be italic), its colour picked from the pack; under it one small line in light, widely spaced capitals naming the product; the pack standing upright and facing the camera in the lower middle on a natural pedestal such as a wet rock, a marble counter or a wooden board, its label tack-sharp and fully readable; the pack sits inside the world of its hero ingredient or scent (the fruit, flower, leaf, oil or place it comes from) with real ingredient props gathered at its base, a softly blurred background, warm dappled back light and a few floating droplets or petals, the whole scene colour-keyed to the pack; along the bottom a soft frosted rounded panel with up to four thin line icons and short capital labels split by thin dividers, using only the benefits written in the brief and leaving the panel out if there are none; no certification seals, test badges, percentages or awards unless they are written in the brief' });

/* SECRET style: hidden until unlocked (click the logo 5 times, or type "crew" in the one-line box and press Start) */
STYLES.push({ id: 'crew', secret: true, best: 'Friends, teams, creators and personal brands: a hero poster of real people with attitude', name: 'Hyper-real 3D crew', g: ['#ff8a2b', '#2fe6ff'],
  t: 'an ultra-realistic 3D-look portrait of real people: the likeness is kept, but heads and eyes are very slightly enlarged and expressions slightly exaggerated, skin is smooth with a soft subsurface glow, hair is crisp, highlights are glossy, colour is rich and saturated, and the whole picture has a premium animated-film polish with a hyper-detailed background. It must pass for a photograph at first glance and never look like a flat cartoon' });

const CREW_SCENES = {
  workshop: { n: 'Golden workshop', accent: '#D9FF1A', accentName: 'neon lime-yellow', kick: '#FFD21F',
    setting: 'a warm, dusty industrial workshop: red metal tool chests, a stained concrete pillar with a round vintage enamel sign, a wooden staircase and rusty machinery, a tall window at the upper left',
    light: 'a golden-hour sunbeam through the upper-left window, warm backlight and soft rim light on hair and shoulders, floating dust motes and tiny bokeh glints, deep brown shadows, a gentle vignette, a damp oil-sheened concrete floor with soft reflections',
    palette: 'amber and honey gold, burnt orange, chestnut brown and olive green, with denim blue as the only cool accent',
    type: 'a small italic condensed kicker in warm yellow, a huge bold italic condensed white headline on two tight lines, a heavy neon lime dry-brush script word tilted about -6 degrees overlapping the end of the headline, and a rounded pill label with a black fill and a thin lime outline',
    fade: 'a dark warm vignette at the bottom' },
  park: { n: 'Sunny park', accent: '#2FE6FF', accentName: 'bright cyan', kick: '#2FE6FF',
    setting: 'a lush, hyper-detailed city park in bright midday sun: tall green trees, a stone fountain, a red-roofed gazebo, flower beds, a few blurred people and a cyclist, a soft skyline in the distance',
    light: 'bright, clean, high-sun daylight with soft shadows, a hint of rim light, a blue sky with soft clouds, crisp sparkle on the fountain, strong depth of field',
    palette: 'sky blue, leaf green, warm skin tones and white, with a deep navy base and cyan accents',
    type: 'a small italic kicker line in cyan, a huge ultra-bold extended italic white headline in sports-broadcast style, thin blue light streaks running horizontally behind the headline, and a rounded pill label with a thin cyan outline',
    fade: 'a deep navy gradient fading up from the bottom edge to about 35% of the height' },
  solo: { n: 'Amber hero (solo)', accent: '#FF9A00', accentName: 'bold orange', kick: '#FFFFFF',
    setting: 'a wall of glowing amber agate and onyx stone panels with rich red-orange veining, the person leaning on it',
    light: 'warm key light from the front-left with a strong orange rim light, deep shadow falloff to the bottom, tiny floating sparks',
    palette: 'amber, burnt orange, deep brown and ruby red, with cream as the only light colour',
    type: 'a giant rounded heavy italic orange name in the lower left, a thin white supporting line under it with double chevrons (»), and a small block logo in the top-right corner',
    fade: 'a dark brown gradient at the bottom edge' },
  beach: { n: 'Beach', accent: '#FFE14A', accentName: 'sunny yellow', kick: '#FFE14A',
    setting: 'an outdoor beach on a bright day: soft white sand, turquoise shallow water with small bright waves, a clear blue sky with a few soft clouds, distant palm trees and a wooden boardwalk, a few blurred beachgoers',
    light: 'bright high sun with a warm backlight and a soft rim light on hair, a gentle sea breeze moving the hair, sparkling reflections on the water, strong depth of field',
    palette: 'turquoise, sky blue, white sand and warm skin tones, with a deep teal-navy base and sunny-yellow accents',
    type: 'a small italic kicker in sunny yellow, a huge ultra-bold extended italic white headline in sports-broadcast style, thin turquoise light streaks behind the headline, and a rounded pill label with a thin sunny-yellow outline',
    fade: 'a deep teal-navy gradient fading up from the bottom edge to about 35% of the height' },
  costume: { n: 'Costume hero', accent: '#FFFFFF', accentName: 'white with a blue glow', kick: '#2FE6FF',
    setting: 'a storybook city park with a stone fountain, flower beds, castle spires in the distance, happy bystanders, a child pointing and a fluffy white cat, the side characters in a softer animated-film style',
    light: 'bright sunny daylight, warm highlights, a clear blue sky, saturated colour, strong depth of field',
    palette: 'sky blue, leaf green, flower pinks, with a rich red-and-gold costume as the hero colour, and a deep navy base',
    type: 'a small italic kicker, a huge ultra-bold extended italic white headline on two lines with a blue glow outline, and thin blue light streaks across the lower third',
    fade: 'a deep navy gradient fading up from the bottom edge to about 30% of the height' }
};
const CREW_POSES = {
  1: 'One person, full or three-quarter length, relaxed confident stance (hands in pockets or arms wide), looking straight at the camera',
  2: 'Two people shoulder to shoulder, one pointing at the other, both looking at the camera',
  3: 'Three people in a V-shaped group: one raising a hand with an object (a camera, a key, a cup), one calm in the centre, one pointing or giving a thumbs-up',
  4: 'Four friends sitting close together on a bench, most giving thumbs-up, one pointing at the camera, all smiling or smirking'
};
Object.assign(STYLES.filter(function (s) { return s.id === 'crew'; })[0], {
  recipe: [
    ['Rendering (the key idea)', 'Ultra-realistic 3D look: real likeness, slightly enlarged heads and eyes, slightly exaggerated expressions, smooth skin with a soft glow, crisp hair, glossy highlights, saturated cinematic colour, premium animated-film polish. Looks like a photo at first glance, never a flat cartoon.'],
    ['Subject and focal point', 'One to four real people with clear gestures: thumbs-up, pointing at a friend, holding a camera or a key, arms wide in a costume. Direct eye contact, one exaggerated face (surprise, smug, wide grin).'],
    ['Composition and framing', 'Portrait 4:5 or 3:4. The people fill 60 to 90% of the height. Heads in the upper half, text block over the bottom third on a dark gradient. Optional small inset of the original photo, top right, with a thick white border.'],
    ['Lighting and mood', 'Two families: warm golden workshop (rim light, dust, bokeh) or bright sunny park (clean daylight, fountain sparkle). Always strong depth of field and a rich, happy, confident mood.'],
    ['Colour palette', 'Warm family: amber, burnt orange, brown, olive, lime accent. Sunny family: sky blue, leaf green, white, deep navy, cyan accent. One accent colour per poster.'],
    ['Surface and material textures', 'Fabric weave, tweed, denim, leather, jerseys with crisp badges, stone, wet pavement, leaves with fine veins. Hyper-detailed but slightly polished.'],
    ['Typography', 'Heavy italic sports-style headline (condensed or extended), white, with one accent colour for a kicker or script word. A rounded pill label with a thin accent outline (date, swipe or call to action). A small script logo or block logo in a top corner.']
  ]
});


/* Infographic planner (original structure; idea inspired by studying a public infographic prompt gem) */
TYPES.push({ id: 'infoplan', name: 'Infographic planner', icon: '☷', mode: 'photo', sub: 'infoplan', focus: 'a topic explained in clear steps and key numbers',
  fields: ['itopic', 'isub', 'icar', 'ichar', 'iingr', 'isteps', 'ifacts', 'iimpact', 'itime', 'ihero', 'isource', 'ibrand'], zones: ['hero'], hero: '', tone: 'clear, trustworthy' });
const INFO_LOOKS = [
  { n: 'Isometric diorama', t: 'a clean 3D isometric diorama with a miniature scene for each step, soft shadows and rounded forms', pal: 'colours chosen to match the topic, with one calm background tone', lay: 'a journey path that links the numbered scenes in order' },
  { n: 'Flat editorial', t: 'flat vector editorial illustration with bold shapes, simple consistent icons and generous white space', pal: 'a limited palette of three colours plus off-white', lay: 'a tidy vertical stack of numbered rows, each with an icon on the left' },
  { n: 'Blueprint', t: 'a blueprint-style technical drawing on deep blue with thin white lines, a faint grid and labelled callouts', pal: 'deep blue, white and one bright accent', lay: 'a central diagram with numbered callouts around it' },
  { n: 'Paper craft', t: 'layered paper-cut scenes with soft drop shadows and a tactile paper texture', pal: 'warm paper tones with two accent colours', lay: 'stacked paper layers, one per step, in reading order' },
  { n: '3D clay', t: 'soft 3D clay objects with rounded icons, pastel colours and gentle shadows', pal: 'friendly pastels with one stronger accent', lay: 'a winding path of numbered clay islands' },
  { n: 'Dark data', t: 'a dark dashboard look with glowing charts, thin neon accents, a clean grid and big numerals', pal: 'near-black, white and one neon accent', lay: 'a split view with the steps on one side and big number cards on the other' },
  { n: 'Macro photo', t: 'cinematic macro photography of real miniature props for each step, shallow depth of field and warm light', pal: 'warm natural tones matched to the subject', lay: 'a vertical sequence of photographic panels' },
  { n: 'Hero and ledges', t: 'cinematic macro photography: one oversized hero of the finished result on one side, and each step shown as a miniature diorama vignette on its own wooden ledge, warm moody light and a soft vignette', pal: 'warm, rich tones matched to the subject, with a gold title colour', lay: 'the hero fills the right half; the numbered steps stack on the left as a staircase of ledges, each with its number and short text beside its prop; two round callout cards at the bottom; a large serif title at the top' },
  { n: 'Split-view compare', t: 'a clean futuristic isometric split-view diorama that compares two options side by side, with glowing data bars, tidy icons and a soft gradient background', pal: 'two contrasting accent colours, one per option, on a deep neutral base', lay: 'two halves, one per option, with the numbered comparison rows running across the middle and the total-cost cards at the bottom' },
  { n: 'Grunge zine', t: 'a punk photocopy-zine collage: a black torn-paper background with halftone dots, white paper panels held down with strips of tape, a big condensed black-and-white headline strip, numbered acid neon-green squares and hand-drawn neon-green arrows, and high-contrast black-and-white photocopied cut-out illustrations', pal: 'black, white and one acid neon-green accent', lay: 'a zigzag of taped step panels, each with a neon-green number and an arrow leading to the next panel' },
  { n: 'Annotated hero', t: 'one hero object rendered in rich 3D detail with clean, flat, frontal callout panels joined to its parts by thin leader lines, on a soft studio background', pal: 'a warm or cool neutral base with two accent colours for the callouts', lay: 'the hero in the centre; four labelled callout panels around it, each joined to the correct part by a thin line with a small arrow; title at the top; a short footer note at the bottom' },
  { n: 'Rustic wood', t: 'a warm rustic table scene with wooden boards, linen and natural props, soft window light', pal: 'warm browns, cream and one fresh green', lay: 'a recipe card layout: hero on top, ingredients panel on one side, numbered steps on the other' },
  { n: 'Chalkboard', t: 'white chalk lettering and simple chalk drawings on a dark slate board, with a thin wooden frame', pal: 'slate black, chalk white and one pastel accent', lay: 'a menu-board layout with a ruled ingredients column and numbered steps' },
  { n: 'Watercolor', t: 'soft hand-painted watercolour illustrations with loose washes on warm paper', pal: 'gentle watercolour washes with a warm paper background', lay: 'a cookbook page layout with a painted hero, a short ingredients list and numbered steps' },
  { n: 'Scrapbook', t: 'a scrapbook collage with torn paper, washi tape, stickers and handwritten notes', pal: 'kraft paper, cream and two bright accents', lay: 'collaged cards for the ingredients and each numbered step' },
  { n: 'Dark luxury', t: 'a dark, moody, premium look with dramatic soft studio light, glossy surfaces and a marble or black slate backdrop', pal: 'near-black, warm gold and cream', lay: 'a clean premium layout with the hero large and small elegant text panels' },
  { n: 'Kids paper craft', k: 1, t: 'layered 3D paper-craft scenes on a cream cardboard background, matte finish, friendly smiling shapes and a soft layered shadow', pal: 'soft pastels on cream card with one warm accent', lay: 'a cheerful path of numbered paper panels' },
  { n: 'Kids chibi clay', k: 1, t: 'cute chibi clay characters and objects with rounded shapes, big friendly eyes, soft studio light and a smooth matte finish', pal: 'bright but gentle pastels with one strong accent', lay: 'numbered clay islands connected by a winding path' },
  { n: 'Kids knitted felt', k: 1, t: 'cosy knitted and felt textures with visible stitches and soft rounded forms', pal: 'warm wool colours with one bright accent', lay: 'numbered felt patches stitched along one path' },
  { n: 'Kids storybook', k: 1, t: 'soft pastel storybook illustration with gentle gradients, warm light and friendly characters', pal: 'light pastels with warm highlights', lay: 'a vertical story path of numbered pages' }
];
Object.assign(SWAPS, {
  itopic: ['Iced palm sugar milk coffee in 5 steps', 'How to set up a small online shop in 6 steps', 'EV or petrol: the 5-year cost compared', 'How to compost kitchen waste at home', 'A beginner 4-week running plan', 'How a bill becomes law in Malaysia']
});
SAMPLES.infoplan = { itopic: 'Iced palm sugar milk coffee in 5 steps', isub: 'Cafe style at home', isteps: '1. Make the syrup | Simmer pure palm sugar with a pandan leaf until thick | saucepan and pandan leaf\n2. Pull the espresso | Brew a strong shot with a machine or moka pot | espresso shot\n3. Layer the ice | Pour syrup into the glass and fill with ice | glass with ice\n4. Add the milk | Pour fresh milk slowly down the side of the glass | milk pitcher\n5. Finish with espresso | Pour the shot on top and stir before drinking | layered coffee', ifacts: 'Ideal ratio | 30 ml espresso : 120 ml milk : 20 ml syrup\nTip | Use pure palm sugar for a smoky caramel taste', iimpact: 'Taste | Sweet, bitter and creamy layers in every sip\nSavings | Costs a fraction of a cafe cup\nEasy | Ready in about ten minutes', iingr: '30 ml espresso\n120 ml fresh milk\n20 ml palm sugar syrup\nIce cubes', itime: '10 minutes · serves 1 · tip: use pure palm sugar', ihero: '', isource: 'Home barista notes', ibrand: 'Zairul Art Studio' };



/* Video thumbnail type (idea from studying a public Gemini Canvas thumbnail app; all wording original) */
TYPES.push({ id: 'thumb', name: 'Video thumbnail', icon: '▷', mode: 'photo', sub: 'thumb', focus: 'one glance, one feeling, one big hook',
  fields: ['ttitle', 'tsub', 'tvisual', 'texpr', 'tcomp', 'tfont'], zones: ['hero'], hero: '', tone: 'bold, high-contrast' });
const THUMB_LOOKS = [
  { n: 'Flat vector', t: 'flat vector art with clean solid colours, bold outlines, simple shapes and a few playful pop-art accents' },
  { n: 'Classic doodle', t: 'a hand-drawn doodle look with marker outlines, scribbled arrows and stars, and a lively paper-cut feel' },
  { n: 'Modern sketch', t: 'a clean modern line sketch with confident black outlines and one or two flat accent colours' },
  { n: 'Photoreal', t: 'a sharp, real photograph look with a clean cut-out subject, natural skin, strong rim light and a simple blurred background' },
  { n: 'Cinematic', t: 'a dramatic cinematic still with moody light, deep shadows, teal and orange grading and a strong glow behind the subject' },
  { n: '3D render', t: 'a polished 3D animated-film style render with big expressive eyes, glossy materials and a bright saturated background' },
  { n: 'Comic book', t: 'a comic-book look with halftone dots, thick ink outlines, speed lines and punchy colours' }
];
Object.assign(SWAPS, {
  texpr: ['wide-eyed shock with the mouth open', 'a big excited smile', 'a smug raised-eyebrow look', 'a worried frown', 'laughing out loud', 'a thinking pose with a hand on the chin'],
  tcomp: ['face on the left, title on the right', 'face on the right, title on the left', 'big centred face with the title across the top', 'title across the middle with the face peeking from the bottom'],
  tfont: ['Bold', 'Neon', 'Minimalist', 'Handwritten', 'Serif', 'Gaming']
});
SAMPLES.thumb = { ttitle: 'KOPI SEDAP 5 MINIT', tsub: 'Gula aren memang power!', tvisual: 'a surprised barista holding a tall layered iced palm-sugar coffee, warm cafe behind', texpr: 'wide-eyed shock with the mouth open', tcomp: 'face on the left, title on the right', tfont: 'Bold' };


Object.assign(STYLES.filter(function (s) { return s.id === 'vinyltoy'; })[0], { photoLabel: 'Copy the photo-to-toy prompt', photoNote: 'Attach a photo of a person, pet or object in ChatGPT or Gemini, then paste this. Only use photos of people who agree.', photoPrompt: 'Turn the attached photo into a collectible 3D isometric vinyl toy figure. Keep it clearly recognisable: the same hair, clothes, colours, accessories and expression. Make it a full-body figurine with a big round head, a tiny body and chunky rounded limbs, smooth glossy vinyl plastic with gentle reflections, vivid candy colours and soft studio lighting. Stand it on a small isometric base with two or three tiny props that match the subject job or hobby, on a plain or transparent background so it can be used as a sticker. No text, no logos, no menu boards, no watermark. Afterwards I will tell you what to change.' });


Object.assign(STYLES.filter(function (s) { return s.id === 'vinyltoy'; })[0], { ext: 'png' });


/* Comic page and sales page types, portrait scene categories (ideas from studying public Gemini gems and a Canvas photo app; all wording original) */
TYPES.push({ id: 'comic', hidden: true, name: 'Storybook/Comic', icon: '☰', mode: 'photo', sub: 'comic', focus: 'a short story told panel by panel with characters that never change',
  fields: ['cstory', 'cchars', 'cpanels', 'clayout'], zones: ['hero'], hero: '', tone: 'fun, clear' });
TYPES.push({ id: 'sales', name: 'Sales page image', icon: '$', mode: 'photo', sub: 'sales', focus: 'one product, one clear path from the picture to the button',
  fields: ['sproduct', 'shead', 'sbadge', 'ssub', 'sfeats', 'scta', 'sedge'], zones: ['hero'], hero: '', tone: 'persuasive, premium' });
const COMIC_LOOKS = [
  { n: 'Chibi action', t: 'full-colour chibi action comic art with big expressive eyes, dynamic poses, speed lines, sparkles and glowing effects' },
  { n: 'Cute slice-of-life', t: 'soft, cute slice-of-life comic art with warm colours, round faces, gentle shading and small funny details' },
  { n: 'Manga black and white', t: 'black-and-white manga art with screentone shading, sharp ink lines and dramatic panel angles' },
  { n: 'Webtoon soft colour', t: 'soft-colour vertical webtoon art with clean lines, pastel shading and generous space between panels' },
  { n: 'Western comic', t: 'bold western comic-book art with thick ink outlines, halftone dots and punchy primary colours' },
  { n: 'Flat funny strip', t: 'a simple flat-colour newspaper-style comic strip with clean shapes, minimal backgrounds and clear jokes' },
  { n: 'Kids storybook', t: 'a gentle kids storybook look with watercolour textures, friendly rounded characters and big readable lettering' }
];
const SALES_LOOKS = [
  { n: 'Dark gold premium', t: 'a dark, cinematic premium look: deep black-brown background, warm gold gradient headline with a soft golden light ribbon behind it, glowing gold accents' },
  { n: 'Clean white', t: 'a clean bright white look with generous space, one accent colour, soft shadows and crisp modern type' },
  { n: 'Warm cafe cream', t: 'a warm cream and terracotta cafe look with soft light, natural textures and friendly rounded type' },
  { n: 'Neon dark', t: 'a dark tech look with glowing neon edges, deep navy background and sharp futuristic type' },
  { n: 'Bright playful', t: 'a bright playful look with saturated colours, rounded shapes, sticker-like icons and bouncy type' },
  { n: 'Soft pastel', t: 'a soft pastel look with gentle gradients, rounded cards, airy spacing and calm type' }
];
Object.assign(SWAPS, {
  clayout: ['a horizontal strip of 4 panels', 'a vertical webtoon scroll with 4 panels', 'a traditional full page with 4 to 6 panels in a dynamic grid', 'a single tall page with 3 large stacked panels'],
  sedge: ['solid dark edges with a soft feathered blend so it sits on any page', 'solid white edges with a soft feathered blend', 'no special edge treatment'],
  pscene: ['Indoor studio', 'Outdoor', 'Family', 'Korean-style editorial', 'Faceless (no face shown)', 'Fun and playful', 'B-roll (no people)', 'B-roll (with people)'],
  prefs: ['face', 'face, outfit', 'face, pose', 'face, outfit, mood and lighting, pose']
});
SAMPLES.comic = { cstory: 'A barista and a customer who forgot their wallet', cchars: 'Aiman | young barista, short black hair, brown apron and cap, kind round face\nMaya | customer, shoulder-length hair, yellow raincoat, big worried eyes', cpanels: 'Maya orders an iced palm-sugar latte at the counter, smiling | Maya: One iced gula aren latte, please!\nAiman hands over the cup; Maya pats her pockets and goes pale | Maya: Eh... where is my wallet?\nAiman gives a gentle smile and waves her on | Aiman: This one is on the house today.\nMaya returns next day with a big pastry box for everyone | Maya: Thank you! I brought kuih for the whole shop.', clayout: 'a horizontal strip of 4 panels' };
SAMPLES.sales = { sproduct: 'a sleek ebook cover mockup floating above a steaming artisan coffee cup with golden crema', shead: 'Secrets of Barista-Style Coffee at Home', sbadge: 'Ebook by Zairul | Only RM29', ssub: 'Learn tasty café recipes at home, easily and without an expensive machine.', sfeats: 'Espresso basics | coffee cup icon\nStep-by-step recipes | open book icon\nSave money | wallet and coin icon\nBonus tips | gift box icon', scta: 'Get the ebook now', sedge: 'solid dark edges with a soft feathered blend so it sits on any page' };

Object.assign(SWAPS, {
  surface: ['a pure white seamless sheet', 'a black studio backdrop', 'a neutral grey studio backdrop', 'a solid colour backdrop in the brand colour', 'a soft gradient backdrop', 'a back-lit translucent panel', 'a ring of neon light on a dark set', 'a natural wooden table', 'a dark wooden table', 'a luxury marble podium', 'an elegant black marble slab', 'an industrial concrete surface', 'an exposed brick wall', 'silk or satin fabric with soft folds'],
  angle: ['flat lay, shot straight down', 'knolling: items laid out neatly at right angles', 'front view, straight on', 'low angle, looking up at the product', 'high angle, looking down', 'Dutch angle, slightly tilted', 'close-up with macro detail', 'extreme close-up on one detail', 'focus stacking so everything is sharp', 'symmetrical composition', 'asymmetrical composition with open space', 'geometric minimalism with simple shapes'],
  light: ['soft light', 'natural daylight', 'hard light with sharp shadows', 'dramatic high-contrast lighting', 'high key, bright and airy', 'low key, dark and cinematic', 'backlight', 'rim light tracing the edges', 'golden hour glow', 'blue hour glow', 'neon lighting', 'warm light', 'cool light', 'clean studio lighting']
});


/* Storybook type (idea from studying a public Komik Storybook Builder gem; all wording original) */
TYPES.push({ id: 'book', name: 'Storybook/Comic', icon: '❦', mode: 'photo', sub: 'book', focus: 'a gentle story told page by page with a character who never changes',
  fields: ['btitle', 'bsub', 'bstory', 'bchars', 'bpages'], zones: ['hero'], hero: '', tone: 'warm, gentle' });
const BOOK_LOOKS = [
  { n: 'Soft pastel watercolor', t: 'a soft pastel children book illustration with warm watercolour textures and gentle ink linework', pal: 'warm pastel tones with soft blues, sunny yellows and gentle greens', light: 'warm golden-hour light with a soft diffused glow', tex: 'watercolour paper grain and soft brushstrokes' },
  { n: 'Paper cut-out', t: 'layered paper cut-out scenes with soft drop shadows between the layers', pal: 'bright but gentle craft-paper colours', light: 'soft even light with gentle shadows', tex: 'visible cardstock texture and torn paper edges' },
  { n: 'Clay 3D', t: 'cute handmade clay characters and scenery with rounded shapes, as if photographed in miniature', pal: 'friendly pastels with one stronger accent', light: 'soft studio light with gentle reflections', tex: 'smooth matte clay with tiny fingerprints' },
  { n: 'Flat vector', t: 'a clean flat vector storybook style with simple shapes, bold colour blocks and no outlines', pal: 'a limited cheerful palette of four colours plus cream', light: 'flat, even light with simple soft shadows', tex: 'clean flat colour with a light paper grain' },
  { n: 'Crayon kids', t: 'a childlike crayon and colour-pencil drawing with wobbly lines and bright scribbled colour', pal: 'bright primary colours on cream paper', light: 'bright, simple daylight', tex: 'waxy crayon strokes and paper tooth' },
  { n: 'Bedtime glow', t: 'a calm bedtime storybook look with deep blue night skies, a glowing moon and warm lamp light', pal: 'deep blues and purples with warm golden glows', light: 'soft moonlight and warm lamp glow', tex: 'soft painted gradients with tiny sparkles' }
];
Object.assign(SWAPS, {
  bstory: ['A shy kitten learns to be brave near water', 'A little robot who wants to make a friend', 'A rainy day adventure with a yellow umbrella', 'A baby dragon who is afraid of fire', 'A boy who plants a seed and waits for it to grow']
});
SAMPLES.book = { btitle: 'Puss and the Little Pond', bsub: 'A story about being brave', bstory: 'A shy kitten learns to be brave near water', bchars: 'Puss | small fluffy orange kitten | big curious green eyes | tiny blue collar | pink nose', bpages: 'Puss plays with a red ball of yarn in a sunny garden | Puss loves playing with his red ball of yarn. Then, oops, it rolls toward the pond!\nPuss stands at the edge of the pond, ears flat, staring at the floating yarn ball | The pond looked very big. Puss felt his tummy go wobbly.\nPuss takes a deep breath and touches the water with one tiny paw | He counted to three and put one paw in. Splash! The water was cool.\nPuss holds his yarn ball and smiles proudly | The water was not scary at all. Puss was brave!' };

Object.assign(SWAPS, {
  icar: ['One infographic image', 'Carousel: one step per slide'],
  isteps: ['1. Prepare and stay safe | Gather the tools and protective gear and switch off power or water if needed | toolbox and gloves\n2. Find the problem | Locate where and why it fails before touching anything | magnifying glass\n3. Do the fix | Carry out the repair or task step by step | wrench\n4. Check the result | Test it and confirm there is no fault, leak or risk | check mark\n5. Clean up and record | Tidy the area and note what was done | clipboard', '1. Gather what you need | List and lay out every tool and material first | open toolbox\n2. Start with the basics | Do the first simple step carefully | hand and tool\n3. Work step by step | Follow the order and check each step before the next | numbered path\n4. Finish and check | Confirm the result against the goal | check mark']
});

/* two more poster types, seen in a public poster wizard */
TYPES.push({ id: 'wedding', name: 'Wedding / Invitation', icon: '♡', focus: 'a warm invitation that makes the names, the date and the place unmissable', fields: ['headline', 'sub', 'dates', 'address', 'contact', 'cta'], zones: ['hero', 'headline', 'info', 'cta', 'contact'], hero: 'an elegant floral or minimal key visual with calm space around the names', tone: 'elegant, warm, romantic' });
TYPES.push({ id: 'film', name: 'Film / Show poster', icon: '◉', focus: 'one dramatic image, one title and a short credits block', fields: ['headline', 'sub', 'points', 'dates', 'contact'], zones: ['hero', 'headline', 'list', 'info', 'contact'], hero: 'a cinematic key image of the main character or the defining scene, with room for the title', tone: 'cinematic, dramatic, intriguing' });
SAMPLES.wedding = { headline: 'Aiman & Maya', sub: 'Together with their families, invite you to celebrate their wedding', dates: 'Saturday 14 March 2027, 11 am', address: 'Dewan Seri Mutiara, Shah Alam', contact: 'RSVP: 012-345 6789', cta: 'Kindly reply by 1 March', brand: '', points: '' };
SAMPLES.film = { headline: 'Midnight at the Kopitiam', sub: 'One night. One secret recipe.', points: 'Starring Aiman Hakim\nDirected by Maya Sofea\nMusic by Rahim Z', dates: 'In cinemas 20 March', contact: '#MidnightKopitiam', brand: '' };

/* ---------- NotebookLM slide styles (special section). Studied a public gallery of YAML style prompts; every style, colour and sentence below is original ---------- */
const DECK_LOOKS = [
  { n: 'Boardroom brief', cat: 'Business', best: 'Reports, consulting-style updates, investor and management decks', r: 0, dark: false,
    t: 'a calm, data-dense boardroom look: every slide leads with a conclusion, content sits on a strict grid, and charts do the persuading',
    pal: [['#0B2545', 'Deep navy'], ['#FFFFFF', 'Clean white'], ['#2B2B2B', 'Charcoal'], ['#1F7A8C', 'Teal highlight'], ['#9AA5B1', 'Cool grey for rules and sources']],
    head: 'authoritative bold serif, left-aligned', sub: 'clean bold sans-serif', body: 'compact sans-serif, regular weight, high information density',
    vis: ['thin horizontal rules under the title and above the footer', 'small numbered squares for key insights', 'simple bar, waterfall and line charts in two blues', 'a source line and slide number in every footer'],
    img: 'flat, restrained charts and line icons; no stock-photo clichés and no decorative clip art',
    shape: 'sharp-cornered panels separated by thin rules', title: 'a full-sentence title that states the conclusion of the slide' },
  { n: 'Quiet minimal', cat: 'Minimal', best: 'Keynotes, brand stories, design and architecture talks', r: 0, dark: false,
    t: 'a calm minimal look with huge margins, one idea and one visual per slide, and a single colour used only to highlight',
    pal: [['#1A1A1A', 'Soft black'], ['#FAFAF7', 'Warm white'], ['#2E2E2E', 'Graphite'], ['#E4572E', 'Single vermilion accent'], ['#BDBDB5', 'Pale stone for hairlines']],
    head: 'light geometric sans-serif, large, lots of line spacing', sub: 'light sans-serif in small caps', body: 'light sans-serif, short lines',
    vis: ['very wide margins and open white space', 'hairline dividers instead of boxes', 'one accent-coloured word per title', 'a single large image or a single big number per slide'],
    img: 'one quiet, well-lit photograph or one simple line illustration; never more than one image on a slide',
    shape: 'no boxes; text sits directly on the page', title: 'a short title of five words or fewer' },
  { n: 'Midnight neon', cat: 'Tech', best: 'AI, software, cybersecurity and product demo decks', r: 14, dark: true,
    t: 'a dark futuristic look with glowing cyan and magenta lines on deep navy, built for technology topics',
    pal: [['#00E5FF', 'Electric cyan'], ['#0A0F24', 'Midnight navy'], ['#E8ECFF', 'Ice white'], ['#FF3D9A', 'Neon magenta'], ['#5B6AA8', 'Dusty indigo for secondary lines']],
    head: 'wide futuristic sans-serif, bold, slightly letter-spaced', sub: 'clean geometric sans-serif', body: 'readable sans-serif in ice white',
    vis: ['glowing line icons', 'soft neon gradients behind charts', 'a faint circuit-board grid in the background', 'dark rounded cards with a thin glowing edge'],
    img: 'abstract glowing network and light-trail graphics; screens and interfaces shown as clean flat mock-ups',
    shape: 'dark rounded cards with a faint glowing outline', title: 'a bold title with the key term in cyan' },
  { n: 'Pastel classroom', cat: 'Education', best: 'Lessons, school and training decks, explainers for beginners', r: 28, dark: false,
    t: 'a friendly, bright classroom look with soft pastel colours, big rounded shapes and simple pictures that make a lesson feel easy',
    pal: [['#5B6CFF', 'Friendly blue'], ['#FFF9F0', 'Cream'], ['#33334D', 'Ink blue'], ['#FF8FA3', 'Candy pink'], ['#7BDFC4', 'Mint for success and checks']],
    head: 'rounded friendly sans-serif, bold', sub: 'rounded sans-serif, medium', body: 'rounded sans-serif, large and open',
    vis: ['sticker-like icons', 'wavy dividers between sections', 'speech-bubble callouts for key questions', 'progress dots along the bottom'],
    img: 'cheerful flat illustrations with simple shapes and clear outlines; kids and teachers shown with friendly, neutral faces',
    shape: 'big rounded cards with soft shadows', title: 'a plain, friendly question or statement' },
  { n: 'Paper journal', cat: 'Creative', best: 'Workshops, design thinking, creative portfolios and personal stories', r: 6, dark: false,
    t: 'a handmade scrapbook-journal look with torn paper, tape, pencil marks and sticky notes, as if the ideas were pinned on a desk',
    pal: [['#3B3A36', 'Pencil ink'], ['#F6EEDC', 'Aged paper'], ['#3B3A36', 'Pencil ink'], ['#D1495B', 'Marker red'], ['#2E86AB', 'Highlighter blue']],
    head: 'handwritten marker-style titles', sub: 'tidy typewriter font', body: 'simple typewriter or clean hand-printed font',
    vis: ['torn paper edges and strips of tape', 'pencil underlines and circled keywords', 'sticky notes for short ideas', 'arrows only when a real flow exists'],
    img: 'photos taped on like prints, with hand-drawn doodles around them',
    shape: 'sticky notes and taped photo prints', title: 'a handwritten title with one underlined word' },
  { n: 'Magazine cover story', cat: 'Editorial', best: 'Brand stories, trend reports, interviews and long-form features', r: 0, dark: false,
    t: 'a confident editorial look borrowed from print magazines: oversized type, strong crops, pull quotes and thin column rules',
    pal: [['#111111', 'Print black'], ['#F4F1EA', 'Newsprint cream'], ['#1E1E1E', 'Near black'], ['#B3202A', 'Magazine red'], ['#8C8577', 'Warm grey for captions']],
    head: 'high-contrast display serif, very large', sub: 'small caps sans-serif labels', body: 'clean sans-serif in narrow columns',
    vis: ['oversized pull quotes', 'thin vertical column rules', 'large cropped photographs bleeding off the edge', 'folio numbers and small section labels'],
    img: 'bold editorial photography with dramatic crops; black-and-white is welcome',
    shape: 'open columns separated by hairline rules', title: 'a short, punchy headline with a one-line standfirst under it' },
  { n: 'Earth and leaf', cat: 'Nature', best: 'Sustainability, agriculture, wellness, outdoor and eco brands', r: 30, dark: false,
    t: 'a fresh natural look with leaf green, warm sand and soft organic shapes that feel calm and trustworthy',
    pal: [['#2D6A4F', 'Forest green'], ['#F3F7EF', 'Pale leaf white'], ['#1B4332', 'Deep green text'], ['#E09F3E', 'Harvest amber'], ['#95D5B2', 'Soft sage']],
    head: 'soft, friendly serif', sub: 'humanist sans-serif', body: 'humanist sans-serif, comfortable size',
    vis: ['simple leaf and branch line art', 'organic blob shapes behind images', 'a subtle natural-paper texture', 'photos of plants and landscapes with a gentle green wash'],
    img: 'natural light photography of plants, soil, water and people working outdoors; hand-drawn botanical details',
    shape: 'rounded organic panels with no hard corners', title: 'a calm sentence-case title' },
  { n: 'Calm care', cat: 'Health', best: 'Healthcare, nursing, clinic, wellbeing and patient education', r: 32, dark: false,
    t: 'a gentle, trustworthy health look with soft blues, rounded shapes and large readable numbers, made to lower anxiety',
    pal: [['#2A6F97', 'Care blue'], ['#F2F8FC', 'Clinic white'], ['#1E3A4C', 'Deep slate text'], ['#61A5C2', 'Soft sky'], ['#A9D6E5', 'Pale aqua for backgrounds']],
    head: 'rounded humanist sans-serif, bold', sub: 'rounded sans-serif, medium', body: 'clear rounded sans-serif, large',
    vis: ['gentle cloud-like shapes', 'simple line icons for body, care and safety', 'a soft grid-paper texture', 'large numbers for doses, times and counts'],
    img: 'warm, simple illustrations of people and care moments; no graphic medical imagery',
    shape: 'soft pill-shaped cards', title: 'a clear, reassuring sentence' },
  { n: 'Pitch deck bold', cat: 'Startup', best: 'Startup pitches, fundraising, launches and sales kick-offs', r: 22, dark: false,
    t: 'an energetic pitch-deck look with big gradient blocks, giant numbers and short punchy lines',
    pal: [['#5B21B6', 'Electric violet'], ['#FFFFFF', 'White'], ['#1F1235', 'Deep aubergine'], ['#FF6B35', 'Sunrise orange'], ['#FDE68A', 'Butter yellow for highlights']],
    head: 'heavy geometric sans-serif, very large', sub: 'bold geometric sans-serif', body: 'clean geometric sans-serif',
    vis: ['full-bleed gradient cover and section slides', 'giant numbers for traction and market size', 'rounded stat tiles', 'growth arrows only for genuinely growing numbers'],
    img: 'bold shapes, product screenshots in clean device frames, and simple team photos',
    shape: 'rounded stat tiles with strong colour blocks', title: 'a short claim of eight words or fewer' },
  { n: 'Batik heritage', cat: 'Heritage', best: 'Culture, tourism, craft, museum, community and Malaysian heritage topics', r: 8, dark: false,
    t: 'a warm heritage look inspired by batik and songket: indigo, ochre and terracotta with fine ornamental borders and a respectful, dignified tone',
    pal: [['#1F3A5F', 'Batik indigo'], ['#F7EFE0', 'Warm cotton cream'], ['#2A2A2A', 'Soft black'], ['#C8963E', 'Songket gold'], ['#8C3B2E', 'Terracotta for emphasis']],
    head: 'warm serif with a subtle ornamental feel', sub: 'clean humanist sans-serif', body: 'clean sans-serif, comfortable line length',
    vis: ['batik-inspired floral and vine borders', 'fine gold line ornaments like songket weaving', 'dividers made of small repeating motifs', 'rich photographs of crafts, places and makers'],
    img: 'well-lit documentary photographs of craftspeople, textiles and places; ornamental patterns kept as quiet borders, never behind text',
    shape: 'cards with fine ornamental corner details', title: 'a dignified title in sentence case' },
  { n: 'Festive lantern', cat: 'Festive', best: 'Ramadan, Raya, community, charity and religious-season decks', r: 16, dark: true,
    t: 'a warm festive evening look with deep green, soft gold, hanging lanterns and faint geometric star patterns, kept elegant and respectful',
    pal: [['#E3B04B', 'Lantern gold'], ['#0E3B2E', 'Deep emerald'], ['#FFF8E7', 'Warm ivory'], ['#7BC8A4', 'Mint glow'], ['#1B5E4B', 'Mid green for panels']],
    head: 'elegant serif with a calligraphic feel, in gold', sub: 'clean sans-serif in ivory', body: 'clean sans-serif in ivory',
    vis: ['crescent and star motifs used sparingly', 'faint geometric star patterns as the background', 'hanging lanterns in the top corners', 'thin gold hairline borders'],
    img: 'warm evening-lit scenes, mosque silhouettes, lanterns and shared meals; no faces of real people unless supplied by me',
    shape: 'dark green panels with thin gold borders', title: 'a short gold title with a greeting-style tone' },
  { n: 'Retro pixel', cat: 'Tech', best: 'Gaming, coding, retro-tech, youth and student community decks', r: 0, dark: true,
    t: 'a nostalgic arcade and early-computer look with chunky pixels, scanlines and loading bars',
    pal: [['#7CFFCB', 'Arcade mint'], ['#1B1035', 'Deep purple screen'], ['#F4EEFF', 'Soft white'], ['#FF5DA2', 'Hot pink'], ['#6C5CE7', 'Violet for panels']],
    head: 'pixel font, large', sub: 'pixel font, small', body: 'simple monospace',
    vis: ['pixel icons such as floppy disks, cassettes and hearts', 'a faint scanline texture', 'chunky bordered windows like an old operating system', 'progress bars drawn as loading bars'],
    img: 'pixel-art illustrations and 8-bit icons; photos are reduced to a limited palette',
    shape: 'chunky bordered windows with a title bar', title: 'a short title in pixel type' },
  { n: 'Blueprint', cat: 'Technical', best: 'Engineering, manufacturing, how-it-works and process documentation', r: 0, dark: true,
    t: 'a technical blueprint look: white lines on blueprint blue, dimension marks and numbered callouts, made for explaining how things are built or work',
    pal: [['#FFFFFF', 'Drafting white'], ['#0F3D6E', 'Blueprint blue'], ['#EAF4FF', 'Pale blue-white'], ['#FFD166', 'Marker yellow'], ['#8EC5FF', 'Light blue for grid lines']],
    head: 'technical sans-serif in uppercase, spaced out', sub: 'technical sans-serif, small', body: 'clean sans-serif or monospace',
    vis: ['a fine white grid like drafting paper', 'dimension lines and callouts', 'numbered references for parts and steps', 'isometric line drawings'],
    img: 'clean white line drawings and isometric diagrams; no photographs unless they are technical',
    shape: 'outlined boxes with thin white lines and no fill', title: 'an uppercase technical title with a figure number' },
  { n: 'Noir gold', cat: 'Luxury', best: 'Luxury brands, premium products, hospitality and high-end proposals', r: 0, dark: true,
    t: 'a restrained luxury look: near-black pages, thin gold frames and a lot of empty space, with the product shown like a jewel',
    pal: [['#D4AF37', 'Champagne gold'], ['#0C0A09', 'Warm black'], ['#F5F0E6', 'Soft ivory'], ['#8C6D1F', 'Old brass'], ['#3A332B', 'Dark umber for panels']],
    head: 'elegant condensed serif, gold', sub: 'thin sans-serif in ivory', body: 'thin sans-serif, generous spacing',
    vis: ['thin gold frames', 'large areas of negative space', 'dramatic product photography on black', 'small gold dividers'],
    img: 'low-key studio photography with a single soft highlight; reflections kept subtle',
    shape: 'thin gold outlines, no filled boxes', title: 'a short, spaced-out title in gold' },
  { n: 'Kawaii notes', cat: 'Creative', best: 'Study notes, cute brands, student projects and social-media-style decks', r: 30, dark: false,
    t: 'a cute pastel notebook look with sticker mascots, washi tape and bubbly lettering that makes any topic feel friendly',
    pal: [['#FF6FA5', 'Bubblegum pink'], ['#FFF1F5', 'Blush paper'], ['#5A3E55', 'Plum ink'], ['#8EC9FF', 'Baby blue'], ['#FFE08A', 'Custard yellow']],
    head: 'bubbly rounded display font', sub: 'rounded sans-serif', body: 'rounded sans-serif, large',
    vis: ['sticker mascots such as stars, clouds and hearts', 'washi-tape strips on the corners', 'dotted outlines around notes', 'pastel gradient banners for titles'],
    img: 'cute flat stickers with thick white outlines; photos shown as polaroids',
    shape: 'rounded notebook cards with dotted borders', title: 'a short cheerful title with one sticker beside it' },
  { n: 'Data newsroom', cat: 'Data', best: 'Research findings, statistics, public reports and explainers built on numbers', r: 0, dark: false,
    t: 'a newsroom data-journalism look: one clear chart per slide, big annotated numbers, and every figure traceable to its source',
    pal: [['#D62828', 'Newsroom red'], ['#FFFFFF', 'White'], ['#1D1D1F', 'Ink black'], ['#003049', 'Deep blue for charts'], ['#C9CED6', 'Light grey for gridlines']],
    head: 'bold condensed sans-serif', sub: 'sans-serif, medium', body: 'readable serif or sans-serif, compact',
    vis: ['a thin red bar across the top', 'chart-first slides with one annotated insight', 'big numbers with small captions', 'source and date under every chart'],
    img: 'clean charts and maps only; bars start at zero and use no 3D effects',
    shape: 'open layouts with the chart as the hero and no decorative boxes', title: 'a headline that states the finding, with the number in it' },
  { n: 'Kopitiam warm', cat: 'Small business', best: 'Cafes, restaurants, local shops, food brands and community businesses', r: 14, dark: false,
    t: 'a warm local-cafe look with coffee browns, cream paper, enamel-sign title bars and friendly lettering',
    pal: [['#6F4E37', 'Coffee brown'], ['#FBF3E4', 'Cream'], ['#3B2A20', 'Dark roast text'], ['#E07A1F', 'Warm orange'], ['#A3B18A', 'Pandan green']],
    head: 'friendly slab-serif, bold', sub: 'simple rounded sans-serif', body: 'simple sans-serif, easy to read',
    vis: ['title bars that look like enamel signs', 'a few coffee-bean or ring motifs, never behind text', 'chalkboard-style panels for prices and lists', 'warm food and drink photography'],
    img: 'natural-light food and drink photography with warm tones; hands and tables shown in a real, lived-in way',
    shape: 'rounded panels with a thin sign-style border', title: 'a friendly, plain-spoken title' },
  { n: 'Frost glass', cat: 'Modern', best: 'Product tours, app showcases, premium corporate and design decks', r: 26, dark: false,
    t: 'a light, airy glass look: frosted translucent panels floating over soft blue and violet gradients',
    pal: [['#3A4B9B', 'Deep periwinkle'], ['#EAF0FF', 'Pale gradient blue'], ['#1B1F3B', 'Midnight text'], ['#7A5CFF', 'Soft violet'], ['#FFFFFF', 'Frosted white panels at about 60 percent opacity']],
    head: 'refined thin-to-medium sans-serif, large', sub: 'light sans-serif', body: 'light sans-serif, comfortable size',
    vis: ['frosted translucent panels over soft gradients', 'thin white borders on every panel', 'subtle soft shadows', 'one softly glowing orb on the cover'],
    img: 'soft 3D shapes, clean device mock-ups and airy photography',
    shape: 'frosted glass panels with thin white borders', title: 'a light, large title with generous space around it' }
];
TYPES.push({ id: 'deck', name: 'NotebookLM slides', icon: '▤', special: true, mode: 'photo', sub: 'deck', focus: 'a slide-deck style and brief you paste into the NotebookLM Slide Deck instructions',
  fields: ['dtopic', 'daud', 'dgoal', 'dslides', 'dform', 'dlang', 'dmust', 'dnot', 'dfoot'], zones: ['hero'], hero: '', tone: 'clear, professional' });
Object.assign(SWAPS, {
  dslides: ['About 6 to 8 slides (short briefing)', 'About 10 to 12 slides (standard)', 'About 15 to 20 slides (full report)'],
  dform: ['Presenter deck: big visuals, very little text, built to be spoken over', 'Reading deck: detailed and self-explanatory, built to be sent as a PDF'],
  dlang: ['English', 'Bahasa Melayu', 'Bahasa Indonesia', 'English, keeping Bahasa Melayu terms as they are'],
  dsize: ['Full', 'Compact (shorter, for the length limit)']
});
SAMPLES.deck = { dtopic: 'How a small cafe grew from one outlet to five', daud: 'Investors and the cafe team', dgoal: 'Approve funding for outlet number six', dslides: 'About 10 to 12 slides (standard)', dform: 'Presenter deck: big visuals, very little text, built to be spoken over', dlang: 'English', dmust: 'A one-slide timeline of the five openings\nA slide on what customers say', dnot: 'Prices that are not final', dfoot: 'Zairul Art Studio · Confidential', dsize: 'Full' };

/* ---------- 83 more NotebookLM slide styles, all original (names, palettes and wording written for this studio) ---------- */
const DECK_GROUPS = { B: 'Business & executive', M: 'Minimal & modern', C: 'Creative & playful', E: 'Editorial & magazine', T: 'Tech & innovation', N: 'Nature & wellness' };
(function () {
  var existing = { 'Boardroom brief': 'B', 'Quiet minimal': 'M', 'Midnight neon': 'T', 'Pastel classroom': 'C', 'Paper journal': 'C', 'Magazine cover story': 'E', 'Earth and leaf': 'N', 'Calm care': 'N', 'Pitch deck bold': 'B', 'Batik heritage': 'E', 'Festive lantern': 'C', 'Retro pixel': 'T', 'Blueprint': 'T', 'Noir gold': 'E', 'Kawaii notes': 'C', 'Data newsroom': 'B', 'Kopitiam warm': 'B', 'Frost glass': 'M' };
  DECK_LOOKS.forEach(function (l) { l.grp = existing[l.n] || 'B'; });
  var mk = function (r) {
    var p = r[4].split('|').map(function (x) { var i = x.indexOf(' '); return ['#' + x.slice(0, i), x.slice(i + 1)]; }), f = r[5].split(' | ');
    return { n: r[0], grp: r[1], cat: DECK_GROUPS[r[1]], best: r[2], t: r[3], pal: p, head: f[0], sub: f[1] || f[0], body: f[2] || f[1] || f[0], vis: r[6].split(';'), img: r[7], shape: r[8], title: r[1] === 'B' ? 'a full-sentence title that states the point of the slide' : 'a short, clear title in the lettering of this style', dark: !!r[9], r: r[10] };
  };
  [
    ['Emerald Forum', 'B', 'Corporate strategy, finance and legal briefings', 'a confident corporate look in deep green with sharp crystal-like facets and brushed-silver details', '0F5132 Deep emerald|F4F8F5 Mist white|1B2A24 Dark spruce|A9B7C0 Brushed silver|2E8B63 Mid green', 'bold geometric sans-serif | clean sans-serif | readable sans-serif', 'faceted crystal overlays in the corners;frosted glass cards with thin silver edges;slim silver dividers;a small numbered marker on each key point', 'abstract crystal shapes and clean business photography with a green tone', 'frosted glass cards with silver edges', 0, 14],
    ['Lime Momentum', 'B', 'Sales reviews, growth plans and kick-off meetings', 'a forward-moving corporate look in navy with sharp lime diagonals and chevron markers that point the eye along the page', '0B1F44 Midnight navy|FFFFFF White|1A2433 Ink|B6F000 Lime|4A6FA5 Steel blue', 'strong geometric sans-serif | geometric sans-serif | clean sans-serif', 'bold diagonal bands;chevron bullets;structured 12-column grids;lime used only for the single key figure', 'dynamic cropped photography of people at work and simple growth charts', 'angled panels with straight edges', 0, 2],
    ['Ribbon Navy', 'B', 'Company profiles, annual reviews and investor updates', 'a polished corporate look with navy and bright blue, warm amber accents and a folded ribbon across one corner of every slide', '10285C Navy|F7F9FC Cloud white|1C2A44 Slate|F5A524 Amber|2F80ED Bright blue', 'bold sans-serif | clean sans-serif | clean sans-serif', 'a folded ribbon corner layer on every slide;layered colour blocks behind photos;thin amber underlines;rounded numbered badges', 'confident business photography with blue colour grading', 'blocks with a ribbon corner', 0, 8],
    ['Liquid Black', 'B', 'Executive summaries, premium service and high-stakes pitches', 'a premium dark look: flowing blue liquid and smoke on pure black, with very rounded content containers', '05070D Pure black|0A0F1C Ink black|EAF2FF Cool white|2F7BFF Liquid blue|1B2A4A Deep indigo', 'elegant geometric sans-serif | light sans-serif | light sans-serif', 'flowing liquid and smoke textures;ultra-rounded dark containers;soft blue glow edges;generous empty space', 'abstract flowing blue liquid and smoke; no stock-photo people', 'ultra-rounded dark containers', 1, 36],
    ['Clinic Glow', 'B', 'Clinical results, medical technology and hospital briefings', 'a high-tech clinical look: deep black pages with cool blue light glows, very large type and sharp minimal icons', '05080F Deep black|0B1220 Navy black|F2F6FF Clinical white|3DA5FF Glow blue|7A8CA8 Steel grey', 'neutral grotesque sans-serif, very large | neutral sans-serif | neutral sans-serif', 'soft blue light glows behind key numbers;sharp thin-line medical icons;very large numbers and headings;thin separator lines', 'clean macro-style medical visuals and simple vector anatomy, never graphic', 'open layout with glowing key numbers', 1, 6],
    ['Barber Noir', 'B', 'Grooming, salon, retail and lifestyle brands', 'a sharp monochrome look inspired by high-end barbershops with black, white and steel grey and bold headlines', '0D0D0D Black|F5F5F5 White|1F1F1F Charcoal|8E9AA6 Steel grey|C9CED3 Light steel', 'bold geometric sans-serif | expressive grotesque | clean sans-serif', 'razor, comb and scissor line icons;diagonal barber-pole stripes used sparingly;high-contrast black and white photos;thick rules between sections', 'black-and-white portrait and tool photography with strong contrast', 'sharp rectangles with thick rules', 1, 0],
    ['Trail Pulse', 'B', 'Tourism, travel agencies, outdoor brands and itineraries', 'an adventurous travel look with big landscape photos, map details and a bright energetic accent', '0F4C5C Deep teal|FFFFFF White|1E2B2F Dark slate|FF7A1A Sunrise orange|BFE3E8 Sky mist', 'clean technical sans-serif | clean sans-serif | clean sans-serif', 'full-bleed landscape photos;route lines and map pins;passport-stamp style badges;a bold orange tag on the key fact', 'vivid destination photography with open skies and simple map illustrations', 'photos with overlapping tag labels', 0, 12],
    ['Olive Villa', 'B', 'Boutique hotels, resorts and Mediterranean lifestyle brands', 'an earthy hospitality look with olive, sand and terracotta, stone textures and calm, balanced layouts', '6B705C Olive|F5EFE6 Sand|3A3A32 Warm charcoal|B5654A Terracotta|DDBEA9 Clay', 'clean balanced serif | clean sans-serif | clean sans-serif', 'arched window shapes;natural stone and linen textures;thin line borders;generous white space', 'sunlit architecture and food photography with warm tones', 'arched frames and thin borders', 0, 24],
    ['Estate Gold', 'B', 'Luxury property listings and executive portfolios', 'a prestigious property look with elegant serif headlines, deep navy and champagne gold', '14213D Deep navy|FAF7F0 Ivory|1B1B1B Black|C9A227 Champagne gold|E5DCC5 Stone', 'elegant high-contrast serif | refined sans-serif | refined sans-serif', 'thin gold frames around photos;a monogram-style number badge;wide property photographs;small caps labels for facts', 'architectural interiors and exteriors in golden-hour light', 'gold-framed photos on ivory', 0, 2],
    ['Fresh Plate', 'B', 'Catering, healthy food startups and event menus', 'a fresh, friendly food-service look with bright greens, warm citrus and round shapes that feel clean and appetising', '2D9F5B Fresh green|FFFDF7 Cream white|23362B Deep green text|FF9F1C Citrus orange|CDEFD7 Mint', 'friendly geometric sans-serif | friendly sans-serif | friendly sans-serif', 'rounded plate-shaped frames;leaf and herb line art;citrus-coloured price tags;simple icons for ingredients', 'bright overhead food photography with natural light', 'round plate-shaped frames', 0, 40],
    ['Brick Ledger', 'B', 'Commercial property, investment listings and portfolios', 'an established commercial look with classic serif type, brick red and slate, and tidy ledger-style tables', '7A2E2A Brick red|F6F4EF Paper|222831 Slate black|3E5C76 Slate blue|B8B2A7 Stone grey', 'classic serif | classic serif | clean sans-serif', 'ledger-style tables with fine rules;building photographs with a tidy caption strip;small location pins;numbered facts', 'straight, well-lit photographs of buildings and street views', 'plain tables and photo strips', 0, 0],
    ['Market Lens', 'B', 'Market analysis, consulting and data-led strategy', 'a precise strategy look with deep teal and gold, thin charts and a calm confidence for high-value analysis', '0B3C49 Deep teal|F8FAF9 Off white|16262B Ink|D4A017 Gold|7BA7A5 Sea glass', 'modern geometric sans-serif | geometric sans-serif | geometric sans-serif', 'thin-line charts with a single gold highlight;a labelled insight box on each slide;small compass or lens icons;grid alignment marks', 'minimal charts, maps and abstract data forms', 'clean boxes with thin teal borders', 0, 6],
    ['Solar Roof', 'B', 'Green buildings, clean energy and sustainable property', 'a clean, forward-looking green-building look with fresh white, leaf green and a solar yellow spark', '2F7D4F Leaf green|FFFFFF White|1F2D24 Forest ink|FFC300 Solar yellow|D9F0E1 Pale green', 'light modern sans-serif | clean sans-serif | clean sans-serif', 'thin line drawings of buildings and panels;sun-ray accents;energy-flow arrows only for real flows;leaf-shaped dividers', 'bright architectural photos with greenery and clean line plans', 'light panels with leaf-shaped corners', 0, 18],
    ['Tea Leaf Atelier', 'B', 'Premium tea, organic food and artisan product showcases', 'an organic artisan look with tea greens, warm wood tones and strong, quiet typography', '4F6F52 Tea green|F3EEDD Oat|2B2D26 Dark leaf|A47148 Wood brown|D2DCB6 Pale matcha', 'strong condensed sans-serif | quiet sans-serif | quiet sans-serif', 'leaf and steam line illustrations;wood grain and paper textures;tasting-note cards;circular product stamps', 'slow, close-up photography of leaves, cups and craft hands', 'cards with kraft-paper edges', 0, 16],
    ['Cart Spark', 'B', 'E-commerce strategy, digital growth and agency decks', 'a smart, energetic commerce look with deep blue, electric coral and clean data tiles', '1B2B5E Deep blue|F6F8FF Cool white|1B1F33 Ink|FF5A5F Electric coral|7C93D6 Periwinkle', 'powerful geometric sans-serif | geometric sans-serif | clean sans-serif', 'rounded stat tiles with arrows;shopping-cart and parcel icons;funnel diagrams;one coral highlight per slide', 'clean product shots and simple dashboard mock-ups', 'rounded stat tiles', 0, 20],
    ['Trattoria Rustic', 'B', 'Gourmet pasta, traditional markets and food heritage', 'a rustic Italian-kitchen look with tomato red, flour white and olive green, with hand-lettered warmth', 'B23A2E Tomato red|F9F3E6 Flour white|3B2F26 Espresso brown|6A8D3C Olive green|E9C46A Egg yolk', 'bold hand-cut serif | warm sans-serif | warm sans-serif', 'checked tablecloth borders;wheat and herb line art;handwritten recipe notes;chalkboard panels', 'warm rustic food photography with wooden tables and flour dust', 'rustic cards with checked borders', 0, 10],
    ['Tide Harvest', 'B', 'Sustainable seafood, ocean conservation and fisheries', 'a fresh coastal look with deep ocean blue, foam white and coral, built for sea and seafood topics', '0A3D62 Deep ocean|F2F9FC Sea foam|13293D Navy ink|FF6B6B Coral|79C2D0 Shallow water', 'strong rounded sans-serif | clean sans-serif | clean sans-serif', 'wave-shaped dividers;fish and shell line icons;depth-line charts;bubble accents', 'clean ocean and market photography with cool tones', 'wave-edged panels', 0, 24],
    ['Grayscale Grid', 'M', 'Architecture, engineering and precise professional work', 'an architectural monochrome look built on a strict grid, geometric shapes and high-contrast photography', '1C1C1C Black|F2F2F2 Light grey|2A2A2A Charcoal|8A8A8A Mid grey|D0D0D0 Silver', 'clean geometric sans-serif | geometric sans-serif | geometric sans-serif', 'a visible modular grid;large geometric shapes;high-contrast black-and-white photos;tiny reference numbers', 'monochrome architectural photography', 'flat grid modules with no shadows', 0, 0],
    ['Sage Calm', 'M', 'Wellbeing, slow brands and quiet professional topics', 'a peaceful, organic minimal look with sage green, soft white and large rounded corners', '8FA998 Sage|F6F8F4 Soft white|2E3B33 Moss ink|C7B299 Sand|DCE5DD Pale sage', 'soft rounded sans-serif | rounded sans-serif | rounded sans-serif', 'large rounded containers;single botanical line sprigs;generous margins;soft flat colour with no shadows', 'calm botanical photography and simple leaf illustrations', 'large rounded corners', 0, 40],
    ['Mint Tiers', 'M', 'Clean corporate reports and organised project updates', 'a fresh, organised corporate look framed by stepped corner tiers in mint and dark teal', '2A9D8F Mint teal|F7FCFB Cool white|173A3F Dark teal|7FD1C7 Light mint|E0F4F1 Mist', 'clean modern sans-serif | clean sans-serif | clean sans-serif', 'stepped corner frames in two teals;a thin frame line around content;clear section tabs;simple line icons', 'tidy product and workplace photos in a cool tone', 'stepped corner frames', 0, 6],
    ['Amber Mist', 'M', 'Perfume, beauty and premium lifestyle showcases', 'a luxury fragrance-ad look: warm beige and charcoal with frosted glass and airy negative space', '3B3835 Charcoal|F1EAE0 Warm beige|2B2926 Deep charcoal|C8A27A Amber|DAD2C6 Mist', 'refined light sans-serif | refined sans-serif | refined sans-serif', 'frosted glass panels;thin elegant borders;wide negative space;one hero object per slide', 'high-fashion product and portrait photography with soft light', 'frosted panels with thin borders', 0, 4],
    ['Step Guide', 'M', 'How-to guides, learning paths and step-by-step explainers', 'a clear, friendly learning look with soft geometry that makes steps and data easy to follow', '4C6EF5 Learning blue|F8FAFF Page white|243044 Navy ink|FFB84C Lamp yellow|DCE4FF Light blue', 'soft geometric sans-serif | geometric sans-serif | geometric sans-serif', 'numbered step circles joined by a path;soft rounded cards;a simple progress bar;clear chart colours', 'simple diagrams and friendly flat illustrations', 'soft rounded step cards', 0, 22],
    ['Slow Linen', 'M', 'Slow living, craft, home and mindful lifestyle brands', 'a calm editorial minimal look with linen neutrals, plenty of air and a hushed premium feel', '7D7461 Warm taupe|F4F0E8 Linen|3A362E Umber ink|A39B87 Stone|E3DCCD Oat', 'modern minimal sans-serif | minimal sans-serif | minimal sans-serif', 'very wide margins;a single quiet photo per slide;hairline rules;captions in small type', 'soft natural-light still-life and interior photography', 'no boxes, text on open linen', 0, 0],
    ['Silk Marble', 'M', 'Wedding, spa, jewellery and ultra-premium presentations', 'an ethereal look inspired by white marble and soft silk, pale and pure with a fine sans-serif', '9AA3A8 Marble grey|FBFBFA Marble white|3C4348 Soft slate|D9C7B0 Champagne|E8ECEE Silk', 'light elegant sans-serif | light sans-serif | light sans-serif', 'white marble veining in the background;soft silk folds;thin champagne lines;generous spacing', 'soft, bright, high-key photography', 'floating white panels on marble', 0, 10],
    ['Violet Spotlight', 'C', 'Creative launches, events and bold personal brands', 'a dramatic dark creative look with neon purple glow, elegant script words and heavy block headlines', '12082B Deep violet black|1A0F3C Night violet|F6F0FF Soft white|B455FF Neon purple|FF6AD5 Pink glow', 'elegant script mixed with heavy block capitals | block sans-serif | clean sans-serif', 'a neon purple spotlight glow;script words over block type;thin neon outlines;sparkle accents', 'moody concert-style lighting and bold portraits', 'dark cards with neon outlines', 1, 14],
    ['Rust Doodle', 'C', 'Craft, workshops, artisan brands and handmade stories', 'a warm handcrafted look on a rust-coloured textured background with white hand-drawn doodles', 'B5532F Rust|F3E7D8 Warm paper|3A2A22 Dark brown|FFFFFF Chalk white|E2A275 Clay', 'tall condensed sans-serif | condensed sans-serif | clean sans-serif', 'a textured rust background;white hand-drawn doodle borders;stamped circles;underlined keywords', 'handmade-craft photos and white line doodles', 'doodled outlines around text', 0, 8],
    ['Coquette Collage', 'C', 'Romantic, nostalgic and feminine storytelling', 'a romantic scrapbook look with pastel tones, torn paper, pearl details and little bows', 'F4B6C2 Blush pink|FFF6F2 Cream|5B3A46 Rosewood|C9B6E4 Lilac|FDE2E4 Petal', 'elegant script | soft serif | soft serif', 'torn paper layers;bows and pearl strings;tape strips;lace edges', 'vintage photos and floral cut-outs layered like a scrapbook', 'torn paper cards with bows', 0, 12],
    ['Graph Pastel', 'C', 'Study notes, student work and friendly academic topics', 'a clean notebook look with a graph-paper grid, pastel peach and blue blobs and tidy handwriting accents', '7AA2F7 Soft blue|FFFDF8 Paper white|3B4252 Pencil grey|FFB4A2 Peach|DCE6FB Light grid blue', 'rounded sans-serif | friendly handwriting | clean sans-serif', 'a faint graph-paper grid;organic pastel blobs;highlighter underlines;simple margin notes', 'simple flat illustrations and cut-out photos', 'notebook cards on grid paper', 0, 14],
    ['Bubblegum Chrome', 'C', 'Y2K nostalgia, fashion, music and youth culture', 'a bubblegum-pop early-digital look with iridescent chrome, fluffy clouds and glossy 3D icons', 'FF77C8 Bubblegum|F2F1FF Pale lilac|3C2A5E Plum|7FD8FF Aqua chrome|FFE066 Candy yellow', 'glossy rounded display font | rounded sans-serif | rounded sans-serif', 'iridescent disc shapes;fluffy clouds;glossy 3D heart and star icons;sparkles', 'glossy 3D rendered objects on pastel gradients', 'glossy rounded bubbles', 0, 40],
    ['Art Supply Wave', 'C', 'Creative workshops, kids art classes and youth programmes', 'a youthful workshop look with notebook-grid pages, pink wavy accents and friendly drawn art supplies', 'FF8FB1 Pink wave|FFFCF5 Notebook white|3A3A55 Ink|7BDFF2 Sky|FFD166 Crayon yellow', 'playful rounded font | rounded sans-serif | rounded sans-serif', 'pink wavy borders;pencil, rainbow and star doodles;a notebook grid;tape corners', 'drawn supplies and childlike doodles', 'wavy bordered note cards', 0, 24],
    ['Chalk Class', 'C', 'Primary school lessons, teacher training and kids content', 'a warm classroom look with a cream background, chalkboard content frames and hand-drawn doodles', '2F4F4F Chalkboard green|FFF8E7 Cream|2B2B2B Dark|F4A261 Pencil orange|E9C46A Chalk yellow', 'chalk-style hand lettering | friendly sans-serif | friendly sans-serif', 'chalkboard-style frames;wooden pencil and ruler doodles;gold-star stickers;dotted lines', 'simple doodles of school objects', 'chalkboard frames', 0, 10],
    ['Gingham Stickers', 'C', 'Student projects, hobby blogs and cute educational decks', 'a whimsical sticker-book look with pastel gingham grids, hand-drawn stickers and a soft cute mood', 'FFADC6 Candy pink|FFFFFF White|5A4A5E Soft plum|BDE0FE Baby blue|FFF3B0 Butter', 'bubbly rounded font | rounded sans-serif | rounded sans-serif', 'pastel gingham backgrounds;sticker shapes with white outlines;wobbly hand-drawn borders;tiny stars', 'hand-drawn sticker illustrations', 'sticker cards on gingham', 0, 26],
    ['Gouache Studio', 'C', 'Animation, illustration portfolios and art-school work', 'a painterly portfolio look with lush greens, geometric type and gouache brush textures', '2D6A4F Forest green|F1F7E9 Pale lime white|1B2D22 Deep green ink|B5E48C Lime|FFB703 Marigold', 'modern geometric sans-serif | geometric sans-serif | geometric sans-serif', 'gouache brush textures;layered painted shapes;storyboard-style frames;clean title blocks', 'painterly background art and animation concept frames', 'painted shape cards', 0, 14],
    ['Nurse Journal', 'C', 'Nursing education, patient care and approachable medical topics', 'an empathetic medical look like a hand-drawn nursing journal, with pastel blue, doodles and grid paper', '6BA6D6 Pastel blue|F5FAFF Paper white|2F4B66 Navy ink|FF9AA2 Soft coral|CFE6F7 Pale blue', 'friendly handwriting | handwriting | clean sans-serif', 'faint grid paper;hand-drawn hearts and plus signs;cloud-like containers;washi tape strips', 'soft doodles of care moments', 'cloud-shaped cards', 0, 28],
    ['Pop Pharma', 'C', 'Health campaigns, pharmacy education and high-energy medical decks', 'a vibrant pop-art medical look with vector illustrations, bold purple and hot pink', '5B2A86 Deep purple|FFF6FB Light pink white|2A1B3D Dark plum|FF4DA6 Hot pink|FFD60A Pop yellow', 'bold display sans-serif | bold sans-serif | clean sans-serif', 'halftone dots;bold vector pills and plus signs;thick outlines;starburst callouts', 'flat pop-art vector illustration', 'thick-outlined pop cards', 0, 12],
    ['Garden Sketch', 'C', 'Gardening, cosy lifestyle and community nature projects', 'a cosy hand-drawn garden look with terracotta, sage and cream with sketched plants', 'C8705A Terracotta|FAF3E3 Cream|3D4A36 Garden green|8FAE8B Sage|EBD9B4 Straw', 'friendly rounded handwriting | rounded sans-serif | rounded sans-serif', 'sketched plants and watering cans;seed-packet style labels;dotted garden paths;paper-grain texture', 'pencil and ink garden sketches', 'seed-packet style cards', 0, 16],
    ['Meadow Storybook', 'C', 'Children stories, early learning and picture-book style decks', 'an adorable storybook look with bright sky blue, meadow green and chunky playful type', '4CB5F5 Sky blue|FFFBEA Cloud cream|33414E Ink|7ED957 Meadow green|FFD93D Sunshine', 'chunky playful font | rounded sans-serif | rounded sans-serif', 'cartoon clouds and hills;chubby animal friends;rounded speech bubbles;stars', 'storybook illustrations with bright flat colour', 'rounded cloud cards', 0, 34],
    ['Lab Doodle', 'C', 'Biology, chemistry and science-teaching decks', 'a scientific-doodle look blending modern biology with hand-drawn sketches on a lightly textured page', '3AA38A Lab green|F8F6EE Textured paper|2D3A3A Lab ink|FF8552 Reaction orange|C8E6DD Pale green', 'tactile hand-drawn font | clean sans-serif | clean sans-serif', 'cell and molecule doodles;labelled sketch arrows;test-tube icons;sticky annotations', 'hand-drawn biology and chemistry sketches', 'sketched labelled boxes', 0, 10],
    ['Science Fair', 'C', 'School science projects, STEM clubs and textbook-style explainers', 'a bright, tidy science-project look with hand-drawn headings and condensed neat body text', '2B7FFF Bright blue|FFFFFF White|1E2A44 Navy|FFC145 Gold star|FF6B6B Rocket red', 'neat hand-drawn font | condensed sans-serif | condensed sans-serif', 'graph-paper corners;atom, planet and beaker sketches;numbered experiment steps;star stickers', 'textbook-style diagrams and sketches', 'tidy boxes with sketch borders', 0, 10],
    ['Grain Sport', 'C', 'Sports, fitness events and team motivation', 'an energetic grainy illustration look with massive blocky headlines that celebrates movement', 'E63946 Race red|F8F1E5 Chalk cream|1D1D1D Black|1D3557 Track navy|F4A261 Clay orange', 'massive blocky display font | bold sans-serif | bold sans-serif', 'grainy textured illustration;oversized numbers;motion streaks;torn-edge banners', 'textured illustrations of athletes in motion with faces kept simple', 'torn-edge banners', 0, 0],
    ['Cheer Fit', 'C', 'Beginner fitness, wellness challenges and friendly coaching', 'an ultra-cute cheerful fitness look in a pastel world that makes exercise feel easy', 'FF9EAA Cheer pink|FFF8F3 Peach white|4A3F55 Plum|9AD1D4 Aqua|FFE29A Sunshine', 'modern friendly sans-serif | rounded sans-serif | rounded sans-serif', 'smiling dumbbells, water bottles and trainers;pastel clouds;progress stars;rounded badges', 'cute illustrated characters exercising', 'rounded pastel badges', 0, 30],
    ['Groovy Seventies', 'C', 'Retro events, music, vintage brands and nostalgic stories', 'a warm psychedelic 70s look with flowing curves in orange, mustard and brown on cream', 'D2691E Burnt orange|FBF0DC Cream|4A2C1A Chocolate|E3A72F Mustard|8A9A5B Olive', 'flowing psychedelic serif | warm serif | warm sans-serif', 'concentric rainbow curves;sunburst shapes;retro daisies;wavy dividers', 'retro illustrated shapes and warm film-style photos', 'wavy-edged cards', 0, 34],
    ['Candy Pop Y2K', 'C', 'Youth campaigns, pop culture and playful product launches', 'a joyful kawaii meets Y2K pop-art look with candy colours and bubbly script', 'FF5CA8 Candy pink|FFF0F8 Cotton white|44316B Grape|5CE1E6 Aqua|FFE45E Lemon', 'playful bubbly script | rounded sans-serif | rounded sans-serif', 'sparkle stars;pop-art dots;stickers with thick white outlines;gradient candy banners', 'glossy stickers and pop-art characters', 'sticker-like candy cards', 0, 34],
    ['Moody Fan Night', 'C', 'Fandom nights, social games and fan community events', 'an elegant moody look for fan nights with high-contrast serif titles on deep wine and charcoal', '2B0F1E Deep wine|1A1216 Near black|F4E9EC Rose white|D4A5B8 Dusty rose|6B2D4C Mulberry', 'high-contrast elegant serif | technical mono | clean sans-serif', 'spotlight glows;thin gold-pink outlines;ticket-stub shapes;fan-chant callouts', 'dim concert-style lighting and silhouetted crowds', 'dark cards with thin rose outlines', 1, 10],
    ['Bakery Fandom', 'C', 'Cozy community games, tea-party themes and cute event nights', 'a charming bakery look that turns a social game into a tea party with soft pastels', 'F5A3B7 Frosting pink|FFF7EE Cream|5C4033 Cocoa|A7D8C9 Mint|F9D56E Custard', 'friendly rounded serif | rounded sans-serif | rounded sans-serif', 'cupcake and teacup icons;doily borders;striped bakery awnings;frosting swirl dividers', 'cute drawn pastries and tableware', 'doily-edged cards', 0, 24],
    ['Idol Scrapbook', 'C', 'Fan communities, creative nights and music-fan projects', 'a soft adorable scrapbook look for fandoms with bubbly hand-drawn lettering, sparkles and photo-card frames', 'B49CF2 Soft lavender|FFF9FF Pearl|4B3F72 Deep violet|FF9CCB Pink|A6E3E9 Ice blue', 'bubbly hand-drawn font | rounded sans-serif | rounded sans-serif', 'photo-card frames;holographic sparkle stickers;heart and star confetti;washi tape', 'hand-drawn doodles and photo-card layouts', 'photo-card shaped frames', 0, 18],
    ['Party Monsters', 'C', 'Anniversaries, celebrations and playful team presentations', 'a joyful high-energy celebration look with friendly monsters, confetti and bright geometric type', '7B5CF5 Party violet|FFF8E8 Cake cream|2B2350 Midnight|FF7A59 Orange|35D0BA Teal', 'clean geometric sans-serif, bold | rounded sans-serif | rounded sans-serif', 'friendly furry monster characters;confetti bursts;streamers;bouncy speech bubbles', 'simple cartoon monsters and party objects', 'confetti-trimmed cards', 0, 26],
    ['Mango Play', 'C', 'Children games, learning activities and playful group sessions', 'a fun friendly kids look with chunky letters in sunny mango yellow and fresh green', 'FFB400 Mango yellow|FFFDF0 Cream|3A3226 Brown ink|43B96B Leaf green|FF7B54 Papaya', 'chunky rounded display font | rounded sans-serif | rounded sans-serif', 'mango and fruit stickers;wobbly borders;big friendly numbers;star badges', 'simple fruit and animal cartoons', 'fat rounded cards', 0, 34],
    ['Street Label', 'C', 'Streetwear, custom product brands and creative collectives', 'an urban customisation look with a quirky serif, spray-paint accents and bold blocks of colour', '1F1F1F Asphalt|F2EFE9 Concrete white|141414 Black|FF5E1A Hazard orange|7C7CFF Electric periwinkle', 'quirky high-contrast serif | bold sans-serif | clean sans-serif', 'spray-paint outlines;sticker-bomb corners;tape and stencil lettering;label tags', 'product close-ups and street photography', 'tags and stickers on concrete', 0, 4],
    ['Nomad Notes', 'C', 'Remote work culture, travel-work lifestyle and personal storytelling', 'a cosy creative look for digital nomads with warm sunset colours and playful handwritten notes', 'F28C28 Sunset orange|FFF6EA Sand white|3D2E2A Coffee|2A9D8F Lagoon|F8D8A8 Dune', 'playful rounded font | friendly sans-serif | friendly sans-serif', 'passport stamps and boarding-pass shapes;laptop-and-coffee doodles;polaroid frames;handwritten notes', 'travel snapshots and laptop-by-the-beach vignettes', 'polaroids and boarding-pass cards', 0, 12],
    ['Word Quest', 'C', 'Language learning, edtech apps and interactive lessons', 'a fun, game-like learning look with speech bubbles, bright colours and progress streaks', '58CC02 Quest green|FFFFFF White|2B3A42 Slate|1CB0F6 Sky blue|FFC800 Reward gold', 'friendly rounded sans-serif | rounded sans-serif | rounded sans-serif', 'speech-bubble cards;streak flames and star counters;progress bars;chunky buttons', 'friendly mascot-style characters and flat icons', 'chunky rounded buttons', 0, 28],
    ['Terracotta Journal', 'E', 'Human-centred stories, brand narratives and thoughtful reports', 'a warm editorial look with cream paper, bold terracotta accents and elegant type', 'C8553D Terracotta|F7F0E3 Cream|2F2A26 Warm black|3C6E71 Deep teal|E9D8C0 Sand', 'elegant serif | clean sans-serif | clean sans-serif', 'a terracotta block behind the title;pull quotes;hand-cut paper shapes;small folio numbers', 'candid human photography with a warm grade', 'open columns with terracotta blocks', 0, 0],
    ['Cobalt Swiss', 'E', 'Design studios, manifestos and bold reports', 'a bold Swiss-style look: electric blue against cream with huge type and liquid-like shapes', '1F3FFF Electric cobalt|F6F1E7 Cream|0E0E0E Black|FF7A59 Flame|C8D0FF Pale blue', 'huge brutalist sans-serif | grotesque sans-serif | grotesque sans-serif', 'oversized headlines cropped at the edge;liquid blob shapes;strict grid lines;one-colour photos', 'duotone blue photographs and bold shapes', 'flat colour blocks on a strict grid', 0, 0],
    ['Plan Portfolio', 'E', 'Architecture and design portfolios and project showcases', 'a modern geometric portfolio look inspired by architectural drawings with fine lines and coordinates', '2B2D42 Plan ink|F4F4F0 Drafting paper|1A1B26 Black|EF233C Marker red|8D99AE Graphite', 'clean geometric sans-serif | technical sans-serif | technical sans-serif', 'fine plan lines and coordinates;section and elevation drawings;scale bars;numbered projects', 'architectural drawings and clean building photos', 'open grid with fine lines', 0, 0],
    ['Museum Parchment', 'E', 'Heritage talks, art history and gallery presentations', 'a refined museum look with parchment texture, sage accents and ornamental filigree', '7A8B69 Sage|F0E6D2 Parchment|3B3426 Sepia ink|A66E4E Bronze|D8CFB6 Aged paper', 'classical serif | classical serif | clean serif', 'filigree corner ornaments;gallery-label captions;frames around artworks;fine rules', 'framed artworks and artefact photography', 'framed plaques', 0, 6],
    ['Sunny Collage', 'E', 'Travel diaries, summer campaigns and lifestyle stories', 'a bright sun-drenched look with asymmetric photo grids, breezy handwriting and polaroid overlays', 'FF8C42 Sun orange|FFFBF0 Sun white|2F3E46 Sea ink|2EC4B6 Lagoon|FFE08A Sand yellow', 'breezy handwriting | clean sans-serif | clean sans-serif', 'asymmetric photo grids;polaroid overlays;tape and sun doodles;sticker price tags', 'sunny holiday snapshots with warm light', 'overlapping polaroids', 0, 8],
    ['Dream Board', 'E', 'Vision boards, goals, mood boards and inspirational decks', 'a tactile handmade look with paper textures, torn edges and washi tape, like a vision board on a wall', 'C97B84 Dusty rose|F5EBDD Kraft cream|3E3232 Dark cocoa|8AA29E Sage|E8D3B9 Tan', 'handwritten and serif mix | clean serif | clean serif', 'real paper textures;torn edges;washi tape;pinned cut-outs', 'magazine cut-outs and photos pinned like a board', 'pinned paper scraps', 0, 4],
    ['Thesis Noir', 'E', 'Thesis defences, research portfolios and academic talks', 'an academic look with black-and-white photography, bold red accents and soft warm gradients', 'D00000 Academic red|FAF7F2 Warm white|141414 Black|F4A261 Warm glow|BDB6AA Grey', 'geometric bold sans-serif | clean sans-serif | clean sans-serif', 'a bold red accent word;soft warm aura gradients;black-and-white photos;footnote-style citations', 'high-contrast black-and-white portraits and lab photos', 'open pages with footnotes', 0, 0],
    ['Reel Memories', 'E', 'Biographies, documentaries and storytelling decks', 'a nostalgic film look with tactile paper, film-strip borders and a clean sans-serif', '6B4F3A Film brown|F1E7D3 Aged paper|2B211B Dark sepia|C0392B Slate red|B8A68C Dust', 'clean humanist sans-serif | typewriter | typewriter', 'film-strip borders;sprocket holes;taped photographs;typed captions', 'vintage film stills and archive photographs', 'taped photo prints', 0, 4],
    ['Powder Editorial', 'E', 'Fashion campaigns, beauty brands and feminine storytelling', 'an airy editorial look in powder pink and soft grey with delicate type', 'E8B4BC Powder pink|FDF8F6 Blush white|4A3F42 Mauve grey|C6B7C9 Lilac mist|F3D9DC Petal', 'delicate high-contrast serif | light sans-serif | light sans-serif', 'soft blurred gradients;thin lines;oversized fashion crops;italic captions', 'soft-focus fashion and beauty photography', 'open layout with thin lines', 0, 6],
    ['Steakhouse Dark', 'E', 'Fine dining, steakhouses and premium food brands', 'a dark, sophisticated culinary look with charcoal, burgundy and brass', '1C1412 Charred black|120C0B Smoke|F2E8DC Candle white|9B2226 Burgundy|B08D57 Brass', 'strong high-contrast serif | refined sans-serif | refined sans-serif', 'thin brass rules;wine-label shaped badges;candle-lit photos;menu-style lists', 'moody low-key food photography with warm highlights', 'dark panels with brass lines', 1, 2],
    ['Discovery Cards', 'T', 'Product discovery, UX research and engagement-focused decks', 'a visual-first look built from large rounded cards with vibrant red accents that drive attention', 'E5383B Signal red|FFFFFF White|1F1F29 Ink|F5F5F7 Card grey|9DA3AE Cool grey', 'modern sans-serif | clean sans-serif | clean sans-serif', 'large rounded image cards;red highlight chips;thumbnail grids;bold numbers', 'interface screenshots and lifestyle photos in cards', 'large rounded cards', 0, 28],
    ['Tactical Lime', 'T', 'Security, operations, industrial tech and engineering teams', 'a utilitarian tech look with matte black and vivid lime plus industrial details', '0B0D0C Matte black|141716 Graphite|E8EBE9 Light grey|B6FF3B Lime|3A413D Dark steel', 'technical sans-serif, uppercase | technical sans-serif | monospace', 'corner brackets and crosshairs;hazard-style stripes in lime;grid readouts;stencil labels', 'dark technical photography and line diagrams', 'boxes with corner brackets', 1, 0],
    ['Concrete Mono', 'T', 'Brutalist design, architecture and bold minimal tech', 'a modern brutalist look in pure monochrome inspired by a minimalist gallery', '111111 Black|E8E8E8 Concrete|1A1A1A Near black|FFFFFF White|7A7A7A Mid grey', 'heavy grotesque sans-serif | grotesque sans-serif | grotesque sans-serif', 'raw concrete textures;oversized headings;thick black rules;stark crops', 'stark black-and-white architectural photos', 'hard rectangles with thick rules', 0, 0],
    ['Mesh Aura', 'T', 'Funding pitches, SaaS and polished startup decks', 'a premium pitch look with soft blue mesh gradients and clean sans-serif type', '2563EB Pitch blue|F4F7FF Cloud|0F172A Navy ink|60A5FA Sky|93C5FD Light blue', 'clean modern sans-serif | clean sans-serif | clean sans-serif', 'soft blurred mesh gradients;frosted stat cards;thin outlines;one big number per slide', 'abstract gradients and simple interface frames', 'frosted stat cards', 0, 24],
    ['Launch Pad', 'T', 'Product launches, project kick-offs and team workshops', 'an energetic, professional look for launches with strong type and a lively colour pop', 'FF4F00 Launch orange|F8F7F4 Paper|1D1D24 Ink|2C6BED Rocket blue|FFD6BE Peach', 'elegant bold sans-serif | clean sans-serif | clean sans-serif', 'rocket-trail diagonal accents;countdown numerals;sticky-note style workshop cards;bold section dividers', 'team-in-action photos and bold simple graphics', 'sticky-note cards', 0, 12],
    ['Venture Volt', 'T', 'Innovation hubs, venture capital and futuristic pitches', 'a high-energy futuristic pitch look with electric colour on deep space', '0A0630 Deep space|120A4A Indigo|F2EEFF Starlight|B68CFF Volt violet|00F5D4 Electric mint', 'futuristic wide sans-serif | geometric sans-serif | geometric sans-serif', 'glowing gradient orbs;3D iridescent shapes;neon outlines;orbit lines', 'iridescent 3D abstract shapes', 'dark glass cards with neon edges', 1, 18],
    ['Prism Clean', 'T', 'Software architecture, innovation briefings and high-tech launches', 'an ultra-clean futuristic look: white space with prism-like light refractions', '4F46E5 Prism indigo|FFFFFF White|1E1B4B Deep indigo|22D3EE Cyan|F0ABFC Soft magenta', 'clean modern sans-serif | light sans-serif | light sans-serif', 'prism light beams;thin spectrum lines;clear glass-like panels;lots of white space', 'abstract prism and refraction visuals', 'clear glass panels', 0, 20],
    ['Night Cipher', 'T', 'AI research, cybersecurity and cyberpunk-themed talks', 'a nocturnal high-impact look for AI and security with code-rain textures and warning-light accents', '060B14 Night|0D1624 Blue black|DDEBFF Cool white|00E0A0 Terminal green|FF3366 Alert red', 'sharp futuristic sans-serif | monospace | monospace', 'code-rain textures;terminal windows;scan lines;alert-coloured warnings', 'dark network graphics and terminal mock-ups', 'terminal-style windows', 1, 4],
    ['Landscape Impact', 'N', 'Environmental initiatives, sustainability reports and conservation', 'an immersive nature look with big landscape photos, bold white type and green overlays', '1E6F5C Impact green|F7FAF7 Mist white|17302B Deep forest|F2C14E Sun gold|9BC4A0 Moss', 'modern bold sans-serif | clean sans-serif | clean sans-serif', 'full-bleed landscape photos;green gradient overlays;large statistics;thin white lines', 'sweeping nature and wildlife photography', 'white text over darkened photos', 0, 6],
    ['Leaf Scrapbook', 'N', 'Eco-friendly projects, school green clubs and natural stories', 'a natural scrapbook look with hand-drawn leaves, vines, washi tape and pressed flowers', '5C8D5A Fern|F6F1E3 Kraft cream|34402F Moss ink|D98E73 Clay pink|C7DDB5 Pale leaf', 'handwritten font | rounded serif | rounded serif', 'hand-drawn leaves and vines;washi tape;pressed flowers;paper labels', 'doodled plants and kraft paper textures', 'taped paper labels', 0, 10],
    ['Apothecary Olive', 'N', 'Natural wellness, herbal brands and sustainable products', 'an earthy apothecary look with high-contrast serif type, deep olive and warm paper', '556B2F Olive|F2EBDA Parchment|2D2A1E Dark olive ink|B87333 Copper|CFC9A8 Dried herb', 'high-contrast serif | clean serif | clean sans-serif', 'herb line drawings;apothecary-style labels;thin double borders;seed and pod icons', 'quiet natural still-life photography', 'label-style panels', 0, 2],
    ['Engraving Scholar', 'N', 'Natural science, botany research and vintage academic talks', 'a vintage scientific look inspired by old botanical engravings and field journals', '4A4E3A Field green|EFE6D2 Engraved paper|2E2A22 Sepia ink|9C6B3E Brass brown|C9BFA3 Dust', 'heavy engraved serif | classical serif | classical serif', 'engraving-style plant plates;specimen labels;numbered figures;ink-stamp marks', 'engraved botanical illustrations', 'specimen plate boxes', 0, 0],
    ['Kraft Gallery', 'N', 'Art history, craft stories and handmade culture talks', 'a layered look that blends classical art with handcrafted scrapbook paper', '8C6D4F Kraft brown|F3EAD8 Cream paper|3A2F25 Dark umber|7A9E7E Sage|D9C7A5 Tan', 'classical serif | serif | serif', 'overlapping kraft paper;framed masterpiece cut-outs;pins and string;stamps', 'artwork cut-outs with scrapbook layers', 'overlapping kraft cards', 0, 6],
    ['Orange Bubble', 'N', 'Marketing agencies, creative studios and campaign reviews', 'a high-energy playful agency look with vibrant orange bubbles and warm contrast', 'FF6B1A Bubble orange|FFF7EE Cream|2B1E16 Dark brown|2D9CDB Blue pop|FFD1A9 Peach', 'playful bold sans-serif | friendly sans-serif | friendly sans-serif', 'big circular bubbles;overlapping speech-bubble cards;doodled arrows;playful stickers', 'colourful campaign mock-ups and cut-out portraits', 'bubble-shaped cards', 0, 40],
    ['Canopy Night', 'N', 'Conservation, ecology and deep nature stories', 'a majestic immersive look of deep forest greens, charcoal and moss with bright text over foggy forest photos', '0E3B2E Canopy green|10241C Night forest|F4F7F2 Fog white|7DAA7B Moss|2F3A36 Charcoal', 'geometric sans-serif, bold | geometric sans-serif | geometric sans-serif', 'foggy forest photographs;high-contrast white text;thin moss rules;wildlife silhouettes', 'atmospheric forest photography', 'dark photo panels with white text', 1, 6],
    ['Rooftop Garden', 'N', 'Urban gardening, botanical startups and city greenery', 'a fresh organic look for city plants with leafy greens and friendly type', '3E8E41 Leaf|F7FBF2 Fresh white|1F3A22 Dark leaf|F4A259 Terracotta pot|BCE3B4 Mint', 'modern geometric sans-serif | friendly sans-serif | friendly sans-serif', 'potted plant icons;skyline outlines;leaf corner accents;raised-bed grid diagrams', 'bright photos of plants on balconies and rooftops', 'leaf-cornered cards', 0, 16],
    ['Barn Industry', 'N', 'Modern farming, agribusiness and rural enterprise', 'a robust, contemporary farming look that mixes industrial strength with clean business design', '7A5C2E Soil brown|F4F1E8 Grain white|2A2A22 Charcoal|4D8B31 Crop green|D9B26F Wheat', 'bold wide sans-serif | clean sans-serif | clean sans-serif', 'field-row stripe patterns;machine and silo line icons;heavy numbers;steel-plate labels', 'wide-angle farmland and machinery photography', 'sturdy plated cards', 0, 2],
    ['Harvest Tech', 'N', 'Agricultural innovation, farm data and food-security decks', 'a premium innovation look for modern agriculture with a friendly geometric type and clear data', '2F855A Smart green|FBFDF7 Paper white|1C3326 Deep green|F6AD55 Harvest amber|C6F6D5 Mint', 'friendly geometric sans-serif | geometric sans-serif | geometric sans-serif', 'clean data cards;satellite-style field maps;sensor icons;seasonal timelines', 'aerial farm imagery and clear charts', 'data cards with soft corners', 0, 14],
    ['Calm Aura', 'N', 'Mindfulness, mental health and wellness talks', 'a calm, ethereal look of soft blurred colour glows that lower the pace of the whole deck', '9D8DF1 Calm lilac|F7F5FF White lilac|3B3552 Soft ink|8EE3EF Aqua|FFD6E8 Blush', 'clean airy sans-serif | light sans-serif | light sans-serif', 'blurred aura gradients;soft circles;breathing-space margins;gentle line icons', 'abstract soft colour fields and quiet nature photos', 'soft translucent circles', 0, 40],
    ['Folk Botanica', 'N', 'Folk crafts, botanical illustration and heritage gardens', 'a warm folk-art look with flowing calligraphic type and decorative botanical illustrations', 'B5442C Folk red|F7EBD3 Warm linen|2E2A1F Dark ink|3F7F5A Leaf green|E3B04B Marigold', 'flowing calligraphic serif | warm serif | clean serif', 'folk-art flower motifs;symmetrical border patterns;painted birds;decorative corner flourishes', 'decorative painted flowers and leaves', 'ornamental bordered cards', 0, 8],
    ['Maternal Yoga', 'N', 'Prenatal yoga, gentle movement and conscious-parenting content', 'a gentle maternal look of warm peach, blush and sage with calm, clean type', 'F2B6A0 Soft peach|FFF7F2 Warm white|4A3B36 Cocoa|A9C5A0 Sage|FBE3D8 Blush', 'clean light sans-serif | clean sans-serif | clean sans-serif', 'soft circles for sun and belly shapes;gentle line figures in poses;quiet gradients;lots of space', 'soft line illustrations and calm natural-light photos', 'soft rounded panels', 0, 30],
    ['Serum Drop', 'N', 'Skincare, beauty and premium wellness editorials', 'a serene luxury skincare look with amber glow, cream and lavender and macro liquid textures', 'C98B3C Amber|FBF3E6 Cream|3E3028 Deep brown|C8B6E2 Lavender|EAD3A8 Honey', 'refined high-fashion serif | light sans-serif | light sans-serif', 'frosted glass textures;macro droplets;soft organic shadows;thin gold type lines', 'macro photographs of serum, oils and creams', 'frosted panels with soft shadows', 0, 26]
  ].forEach(function (r) { DECK_LOOKS.push(mk(r)); });
  var slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  DECK_LOOKS.forEach(function (l) { l.id = slug(l.n); });
})();

/* What each style example shows: [short tag, what the example is]. Only the styles in STYLE_EX_READY have a best-fit example image so far;
   the others still show the Kopi Pagi poster until their picture is replaced (add the id to the list when it is). */
const STYLE_EX = {
  swiss: ["Design talk", "a design conference"],
  retro: ["Record fair", "a vinyl record fair"],
  grunge: ["Streetwear drop", "a streetwear drop"],
  clay: ["Kids snack", "a kids' snack brand"],
  paper: ["Book fair", "a community book fair"],
  neon: ["Late-night arcade", "a late-night arcade cafe"],
  editorial: ["Magazine cover", "a lifestyle magazine cover"],
  luxury: ["Jewellery launch", "a jewellery launch"],
  organic: ["Skincare", "a botanical skincare range"],
  glass: ["Finance app", "a money app"],
  doodle: ["Workshop", "a weekend art workshop"],
  letterpress: ["Artisan bakery", "an artisan bakery"],
  cinema: ["Island travel", "an island travel campaign"],
  sticker: ["Mochi snack", "a cute mochi snack"],
  brutal: ["Design week", "a design week"],
  geometric: ["Raya greeting", "a Hari Raya greeting"],
  premium3d: ["Sparkling drink", "a sparkling drink launch"],
  scrapbook: ["Zine market", "a weekend zine market"],
  isodiorama: ["Smart home", "a smart-home product"],
  patriotic: ["Merdeka", "a Merdeka campaign"],
  islamicflat: ["Ramadan", "a Ramadan buffet"],
  liquid: ["Perfume", "a perfume launch"],
  embroidery: ["Songket fair", "a heritage craft fair"],
  woodcarve: ["Heritage restaurant", "a heritage restaurant"],
  talkstage: ["Keynote talk", "a keynote talk"],
  promoburst: ["Kedai promo", "a kedai lunch promo"],
  packcampaign: ["Sambal jar", "a sambal jar launch"],
  specsheet: ["Electric car", "an electric car launch"],
  beautykv: ["Hair care", "a botanical shampoo launch"],
  vinyltoy: ['Mascot figurine', ''],
  crew: ['Crew poster', '']
};
const STYLE_EX_READY = ['swiss', 'retro', 'clay', 'grunge', 'paper', 'editorial', 'neon', 'luxury', 'organic', 'glass', 'doodle', 'letterpress', 'cinema', 'sticker', 'specsheet', 'packcampaign', 'promoburst', 'talkstage', 'woodcarve', 'embroidery', 'liquid', 'islamicflat', 'patriotic', 'isodiorama', 'scrapbook', 'premium3d', 'geometric', 'brutal', 'beautykv'];
STYLES.forEach(function (s) { var e = STYLE_EX[s.id]; if (!e) return; if (STYLE_EX_READY.indexOf(s.id) > -1) { s.tag = e[0]; s.ex = e[1]; } else if (!e[1]) s.tag = e[0]; });
