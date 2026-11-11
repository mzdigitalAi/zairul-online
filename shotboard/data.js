/* Shotboard data: prompt library + shot arcs. Edit freely. k = which kinds of shot the item suits. */
const K = { wide: 'wide', med: 'medium', ins: 'insert', cls: 'close', act: 'action', clx: 'climax', hero: 'hero', tag: 'tag' };
const LIB = [
  /* ---- CAMERA ---- */
  { c: 'Camera', n: 'Slow dolly-in', t: 'slow dolly-in, smooth and steady, gradually closing the distance', k: ['wide', 'medium', 'close', 'hero'] },
  { c: 'Camera', n: 'Crane up reveal', t: 'crane shot rising up and back to reveal the full scale of the scene', k: ['wide', 'tag'] },
  { c: 'Camera', n: 'Orbit 180°', t: 'smooth 180-degree orbit around the subject, background sliding past', k: ['medium', 'climax', 'hero'] },
  { c: 'Camera', n: 'Handheld follow', t: 'handheld camera following close behind the subject with natural micro-shake', k: ['medium', 'action'] },
  { c: 'Camera', n: 'Whip pan', t: 'fast whip pan with directional motion blur settling on the subject', k: ['action', 'medium'] },
  { c: 'Camera', n: 'Side tracking', t: 'lateral tracking shot moving in parallel with the subject at walking pace', k: ['wide', 'medium', 'action'] },
  { c: 'Camera', n: 'FPV drone dive', t: 'FPV drone swooping through the environment, fast, fluid and acrobatic', k: ['wide', 'action'] },
  { c: 'Camera', n: 'Locked-off static', t: 'locked-off static tripod shot, perfectly stable, symmetrical framing', k: ['wide', 'insert', 'tag'] },
  { c: 'Camera', n: 'Rack focus', t: 'rack focus shifting from the foreground object to the subject behind', k: ['insert', 'close'] },
  { c: 'Camera', n: 'Dolly zoom', t: 'dolly zoom (vertigo effect), background stretching while the subject stays fixed', k: ['climax', 'close'] },
  { c: 'Camera', n: 'Low-angle tilt-up', t: 'low-angle camera tilting up to make the subject look monumental', k: ['hero', 'climax'] },
  { c: 'Camera', n: 'Push-in on face', t: 'slow push-in on the face, eyes holding the frame', k: ['close', 'climax'] },
  { c: 'Camera', n: 'Pull-back reveal', t: 'slow pull-back dolly revealing the surroundings and context', k: ['tag', 'wide'] },
  { c: 'Camera', n: 'Macro glide', t: 'macro lens gliding across the surface in extreme close-up', k: ['insert'] },
  { c: 'Camera', n: 'Top-down overhead', t: 'overhead top-down shot, graphic composition, slow rotation', k: ['insert', 'wide', 'tag'] },
  /* ---- LENS ---- */
  { c: 'Lens', n: '14mm ultra-wide', t: '14mm ultra-wide lens, dramatic perspective, deep depth of field', k: ['wide', 'action'] },
  { c: 'Lens', n: '24mm wide', t: '24mm wide lens, immersive environmental framing', k: ['wide', 'medium', 'action'] },
  { c: 'Lens', n: '35mm cinema', t: '35mm cinema lens, natural perspective, gentle depth', k: ['wide', 'medium', 'action', 'tag'] },
  { c: 'Lens', n: '50mm natural', t: '50mm lens, natural human-eye perspective', k: ['medium', 'tag'] },
  { c: 'Lens', n: '85mm portrait', t: '85mm portrait lens, shallow depth of field, creamy bokeh', k: ['medium', 'close', 'hero'] },
  { c: 'Lens', n: 'Anamorphic 40mm', t: 'anamorphic 40mm lens, horizontal flares, oval bokeh, widescreen feel', k: ['wide', 'medium', 'hero', 'climax'] },
  { c: 'Lens', n: '100mm macro', t: '100mm macro lens, razor-thin focus plane, fine texture detail', k: ['insert', 'close'] },
  { c: 'Lens', n: '135mm telephoto', t: '135mm telephoto compression, flattened layered background', k: ['close', 'hero', 'climax'] },
  /* ---- LIGHT ---- */
  { c: 'Light', n: 'Golden-hour backlight', t: 'golden-hour backlight with warm rim light and gentle haze', m: ['warm', 'epic', 'dreamy'] },
  { c: 'Light', n: 'Neon rim light', t: 'neon rim lighting in magenta and cyan, wet reflective surfaces', m: ['neon', 'edgy'] },
  { c: 'Light', n: 'Soft window light', t: 'soft directional window light, gentle falloff, natural shadows', m: ['calm', 'warm', 'dreamy'] },
  { c: 'Light', n: 'Hard noon sun', t: 'hard overhead sun, crisp shadows, high contrast, bright colours', m: ['bold', 'epic'] },
  { c: 'Light', n: 'Overcast diffuse', t: 'overcast diffused skylight, low contrast, soft muted tones', m: ['calm', 'moody'] },
  { c: 'Light', n: 'Volumetric god rays', t: 'volumetric light shafts cutting through haze and dust', m: ['epic', 'moody', 'dreamy'] },
  { c: 'Light', n: 'Practical lights', t: 'motivated practical lights in frame, lamps and signs glowing, pools of warm light', m: ['moody', 'neon', 'warm'] },
  { c: 'Light', n: 'Moonlit blue', t: 'cool moonlit blue night, deep shadows, silver highlights', m: ['moody', 'calm'] },
  { c: 'Light', n: 'Studio softbox', t: 'clean studio softbox lighting, glossy highlights, seamless backdrop', m: ['bold', 'calm'] },
  { c: 'Light', n: 'Firelight glow', t: 'flickering firelight, warm orange glow on faces, dark surroundings', m: ['moody', 'epic', 'warm'] },
  /* ---- LOOK ---- */
  { c: 'Look', n: 'Kodak Portra film', t: 'shot on Kodak Portra 400 film, fine grain, natural skin tones', m: ['warm', 'calm', 'dreamy'] },
  { c: 'Look', n: 'Teal and orange', t: 'cinematic teal-and-orange grade, rich contrast, blockbuster polish', m: ['epic', 'bold'] },
  { c: 'Look', n: 'Bleach bypass', t: 'bleach-bypass look, desaturated, gritty, high contrast', m: ['moody', 'edgy'] },
  { c: 'Look', n: 'Pastel symmetry', t: 'pastel palette, perfect symmetry, storybook production design', m: ['calm', 'dreamy', 'bold'] },
  { c: 'Look', n: 'Noir contrast', t: 'black-and-white noir, deep blacks, hard shadows, smoke', m: ['moody', 'edgy'] },
  { c: 'Look', n: 'Hyperreal commercial', t: 'hyperreal commercial finish, crisp detail, glossy highlights, saturated colour', m: ['bold', 'neon'] },
  { c: 'Look', n: '16mm documentary', t: '16mm documentary texture, handheld, authentic grain', m: ['calm', 'moody', 'warm'] },
  { c: 'Look', n: 'Dreamy halation', t: 'soft halation glow around highlights, gentle diffusion, ethereal mood', m: ['dreamy', 'warm', 'neon'] },
  { c: 'Look', n: 'Cyber glossy', t: 'glossy futuristic look, chrome reflections, holographic accents', m: ['neon', 'edgy', 'bold'] },
  { c: 'Look', n: 'Epic IMAX', t: 'epic large-format IMAX look, grand scale, rich dynamic range', m: ['epic'] },
  /* ---- MOTION ---- */
  { c: 'Motion', n: 'Slow motion', t: 'slow motion at 120fps, every detail suspended in time', k: ['action', 'climax', 'hero'] },
  { c: 'Motion', n: 'Speed ramp', t: 'speed ramp from real-time into slow motion on impact', k: ['action', 'climax'] },
  { c: 'Motion', n: 'Cloth and hair', t: 'natural cloth and hair movement responding to the wind', k: ['medium', 'hero', 'close'] },
  { c: 'Motion', n: 'Floating dust', t: 'tiny dust particles drifting through the light', k: ['wide', 'insert', 'close'] },
  { c: 'Motion', n: 'Water splash', t: 'realistic water splashes with believable physics and droplets', k: ['action', 'climax'] },
  { c: 'Motion', n: 'Smoke and mist', t: 'low smoke and mist rolling across the ground', k: ['wide', 'tag', 'hero'] },
  { c: 'Motion', n: 'Rain', t: 'steady rain, ripples in puddles, droplets catching the light', k: ['wide', 'close', 'tag'] },
  { c: 'Motion', n: 'Sparks and embers', t: 'sparks and embers rising and fading, physically plausible', k: ['action', 'climax', 'hero'] },
  /* ---- CONTINUITY ---- */
  { c: 'Continuity', n: 'Same character', t: 'same character, identical face, hairstyle and wardrobe as the previous shot' },
  { c: 'Continuity', n: 'Same location', t: 'same location and lighting direction as the previous shot' },
  { c: 'Continuity', n: 'Match cut', t: 'composition and subject position match the previous shot for a seamless match cut' },
  { c: 'Continuity', n: 'Eyeline match', t: 'subject looks toward the same screen direction as in the previous shot' },
  { c: 'Continuity', n: 'Colour palette lock', t: 'strictly consistent colour palette across all shots' },
  { c: 'Continuity', n: 'Same time of day', t: 'same time of day and weather as the previous shot' },
  /* ---- NEGATIVE ---- */
  { c: 'Avoid', n: 'No text', t: 'no text, no captions, no logos on screen' },
  { c: 'Avoid', n: 'No watermark', t: 'no watermark, no UI overlays' },
  { c: 'Avoid', n: 'Clean hands', t: 'anatomically correct hands and fingers, no extra limbs' },
  { c: 'Avoid', n: 'No morphing', t: 'no morphing, no warping, stable faces and objects' },
  { c: 'Avoid', n: 'No flicker', t: 'no flicker, no jitter, stable lighting' },
  { c: 'Avoid', n: 'No jump cuts', t: 'single continuous shot, no jump cuts' }
];

const GENRES = {
  'Cinematic story': [
    ['Establishing', 'wide', 'Wide establishing shot of the world: {i}'],
    ['Subject intro', 'medium', 'Introduce the main subject in the scene: {i}'],
    ['Telling detail', 'insert', 'Close insert on a telling detail that hints at: {i}'],
    ['Reaction', 'close', 'Close-up of the subject reacting as events unfold: {i}'],
    ['Rising action', 'action', 'The action builds, movement through the frame: {i}'],
    ['Climax', 'climax', 'The decisive moment at peak energy: {i}'],
    ['Hero frame', 'hero', 'Hero frame, the visual payoff of: {i}'],
    ['Final beat', 'tag', 'A quiet closing beat lingering on the aftermath of: {i}']
  ],
  'Product ad': [
    ['Teaser', 'insert', 'Extreme close teaser of the product surface, partly hidden: {i}'],
    ['Reveal', 'hero', 'The product revealed in full, hero lighting: {i}'],
    ['Detail', 'insert', 'Macro detail of the key feature: {i}'],
    ['In use', 'action', 'The product in use by a real person: {i}'],
    ['Lifestyle', 'wide', 'Lifestyle context, the product inside the world it belongs to: {i}'],
    ['Reaction', 'close', 'Close-up of the delighted reaction: {i}'],
    ['Climax', 'climax', 'High-energy showcase of what makes it special: {i}'],
    ['Packshot', 'tag', 'Clean packshot with space for the tagline: {i}']
  ],
  'Trailer': [
    ['Cold open', 'wide', 'Cold open on the world before everything changes: {i}'],
    ['Hero intro', 'medium', 'Meet the hero, framed with intent: {i}'],
    ['The threat', 'insert', 'A glimpse of the threat or challenge: {i}'],
    ['Stakes', 'close', 'Close-up on the face that carries the stakes: {i}'],
    ['Escalation', 'action', 'Escalation, fast cuts and motion: {i}'],
    ['Spectacle', 'climax', 'Biggest spectacle moment of the trailer: {i}'],
    ['Hero shot', 'hero', 'Iconic hero shot for the poster frame: {i}'],
    ['Title card', 'tag', 'Empty, atmospheric frame ready for the title: {i}']
  ],
  'Music video': [
    ['Intro mood', 'wide', 'Atmospheric opening that sets the mood: {i}'],
    ['Performer', 'medium', 'The performer, centred and confident: {i}'],
    ['Visual metaphor', 'insert', 'A striking visual metaphor for the lyric: {i}'],
    ['Emotion', 'close', 'Intimate close-up of emotion: {i}'],
    ['Drop', 'action', 'Energy lifts on the beat drop, big movement: {i}'],
    ['Chorus hero', 'climax', 'Chorus hero moment, maximum visual impact: {i}'],
    ['Surreal', 'hero', 'Surreal heightened image that defies reality: {i}'],
    ['Outro', 'tag', 'Fade-out frame holding the final note: {i}']
  ],
  'Documentary': [
    ['Place', 'wide', 'Establishing the place and its atmosphere: {i}'],
    ['Subject', 'medium', 'The subject at work in their natural environment: {i}'],
    ['Hands', 'insert', 'Hands and tools, the craft in close detail: {i}'],
    ['Portrait', 'close', 'Honest close portrait, thoughtful expression: {i}'],
    ['Process', 'action', 'The process in motion, observed not directed: {i}'],
    ['Turning point', 'climax', 'The moment the story turns: {i}'],
    ['Context', 'hero', 'Wide context frame that explains the bigger picture: {i}'],
    ['Reflection', 'tag', 'Quiet reflective closing image: {i}']
  ],
  'Explainer': [
    ['Hook', 'hero', 'A bold hook image that states the idea at a glance: {i}'],
    ['Problem', 'medium', 'Show the problem in a simple human moment: {i}'],
    ['Detail', 'insert', 'Zoom in on the key detail that matters: {i}'],
    ['Solution', 'action', 'The solution in action, clear and easy to follow: {i}'],
    ['Result', 'wide', 'The result shown in the real world: {i}'],
    ['Proof', 'close', 'Close-up proof, a person confirming it works: {i}'],
    ['Recap', 'climax', 'Visual recap of the three key points: {i}'],
    ['Call to action', 'tag', 'Clean closing frame for the call to action: {i}']
  ]
};

const MOODS = ['warm', 'neon', 'moody', 'epic', 'calm', 'dreamy', 'bold', 'edgy'];
const TRANSITIONS = ['Match cut on shape', 'Cut on motion', 'Whip-pan transition', 'Hard cut on the beat', 'Flare dissolve through light', 'Object wipe through frame', 'Sound-led J-cut', 'Smash cut'];
const AUDIO = { warm: 'warm acoustic ambience, soft room tone', neon: 'pulsing synth bass, city hum', moody: 'low drone, distant rumble', epic: 'swelling orchestral strings, deep percussion', calm: 'gentle ambience, soft breeze', dreamy: 'airy pads, shimmering textures', bold: 'punchy percussive beat', edgy: 'distorted bass hits, tense pulses' };
const SAMPLES = [
  'A lone astronaut finds a glowing garden inside an abandoned ship',
  'Street-food chef flips noodles in a neon night market in Kuala Lumpur',
  'A sneaker launch: the shoe floats through a pastel desert',
  'Grandmother teaches her granddaughter a secret recipe at sunrise'
];

/* ---------- realism: no AI slop ---------- */
const SLOP_WORDS = ['ultra realistic', 'hyper realistic', 'hyperrealistic', 'photorealistic', '16k', '8k', '4k', 'masterpiece', 'highly detailed', 'hyper detailed', 'ultra detailed', 'intricate details', 'stunning', 'breathtaking', 'award winning', 'trending on artstation', 'artstation', 'unreal engine', 'octane render', 'best quality', 'perfect skin', 'perfect', 'flawless', 'beautiful', 'amazing', 'epic', 'dramatic lighting', 'glowing', 'cinematic'];
const SLOP_FIX = [
  ['ultra realistic, 8k, masterpiece', 'shot on a 35mm lens at f/2.8, Kodak Portra 400'],
  ['highly detailed, intricate', 'visible pores, fabric weave, scuffed paint, dust'],
  ['dramatic lighting', 'lit only by a bare bulb and a window to the left'],
  ['perfect skin, flawless', 'natural skin texture, flyaway hairs, no retouching'],
  ['cinematic', '35mm anamorphic still, shallow depth of field, fine grain'],
  ['glowing, epic, stunning', 'one motivated light source, restrained colour'],
  ['trending on artstation', 'candid, unposed, slightly off-centre framing']
];
const REAL_CLAUSES = {
  light: ['lit by one motivated real light source (a window, bulb or screen) with natural falloff', 'available light only, slightly blown highlights and honest shadows', 'soft overcast daylight, low contrast'],
  skin: ['natural skin texture with visible pores and fine lines, no retouching', 'flyaway hairs and uneven skin tone'],
  wear: ['small real-world imperfections: scuffs, dust, fingerprints, uneven wear', 'handwritten labels, tape and everyday clutter in the background'],
  comp: ['candid, unposed and slightly off-centre', 'imperfect framing, subject not perfectly centred'],
  colour: ['restrained natural colour with fine film grain, no oversaturated glow', 'muted palette, lifted blacks, subtle halation']
};
const REAL_AVOID = 'no plastic skin, no perfectly symmetrical faces, no neon glow, no extra fingers';
LIB.push(
  { c: 'Realism', n: 'Motivated light', t: REAL_CLAUSES.light[0] },
  { c: 'Realism', n: 'Available light', t: REAL_CLAUSES.light[1] },
  { c: 'Realism', n: 'Real skin', t: REAL_CLAUSES.skin[0] },
  { c: 'Realism', n: 'Flyaway hairs', t: REAL_CLAUSES.skin[1] },
  { c: 'Realism', n: 'Honest wear', t: REAL_CLAUSES.wear[0] },
  { c: 'Realism', n: 'Lived-in clutter', t: REAL_CLAUSES.wear[1] },
  { c: 'Realism', n: 'Candid framing', t: REAL_CLAUSES.comp[0] },
  { c: 'Realism', n: 'Restrained colour', t: REAL_CLAUSES.colour[0] },
  { c: 'Realism', n: 'Film grain', t: 'fine 35mm film grain, slight halation around highlights, no digital sharpening' },
  { c: 'Realism', n: 'Lens honesty', t: 'a real lens: slight vignette, soft corners, small flare from a visible light source' }
);
const PRINCIPLES = [
  ['Name the camera, not the quality', 'Words like "8k" and "masterpiece" describe a score, not a photo. Say the lens, aperture and film stock a real photographer would use.'],
  ['Light from a real source', 'Point to the bulb, window, screen or flame that makes the light. Motivated light has direction and falloff; "dramatic lighting" does not.'],
  ['Keep the flaws', 'Pores, flyaway hairs, scuffs, dust, a chipped rim. Perfection is the tell. Ask for imperfection by name.'],
  ['Unposed and off-centre', 'Real photos are caught, not staged. Say candid, mid-action, slightly off-centre, a little cropped.'],
  ['Restraint in colour and effects', 'No neon glow on everything. Pick a muted palette, one accent, and let the grain show.'],
  ['Specific world details', 'Handwritten labels, tape, signage, steam, a half-eaten meal. Small true details beat a big epic backdrop.'],
  ['Physics and scale cues', 'Reflections, shadows, steam and dust must agree with the light. Add a person or object for scale.'],
  ['One subject, one action', 'Crowded prompts give mush. Describe one thing doing one thing, then let the camera frame it.']
];
const PAIRS = [
  { title: 'Portrait: night-market chef', slop: 'assets/real/portrait-slop.jpg', real: 'assets/real/portrait-real.jpg',
    slopPrompt: 'Ultra realistic 8k masterpiece, hyper detailed cinematic portrait of a street food chef at a night market, stunning, perfect skin, dramatic lighting, trending on artstation, highly detailed, glowing',
    realPrompt: 'Candid photo of a street food chef in his 40s at a Kuala Lumpur night market, shot on a 35mm lens at f/2, lit only by a bare hanging bulb and the wok flame, slightly blown highlights, visible skin pores and beads of sweat, a flyaway grey hair, slightly off-centre composition, steam in the air, cluttered stall out of focus behind him, fine film grain, Kodak Portra 400 colour, no retouching',
    tells: ['The real chef is caught mid-task, cropped and off-centre. The slop chef is posed dead-centre like a poster.', 'One bare bulb and the wok flame explain the light. The slop version glows from nowhere.', 'Soot on the T-shirt, a worn cap, a real stall sign. The slop version has clean, glossy, generic detail.'] },
  { title: 'Product: ceramic coffee cup', slop: 'assets/real/product-slop.jpg', real: 'assets/real/product-real.jpg',
    slopPrompt: 'Ultra realistic 8k masterpiece, hyper detailed cinematic product photo of a ceramic coffee cup on a wooden table, stunning, perfect, dramatic lighting, glowing, trending on artstation, highly detailed',
    realPrompt: 'Product photo of a handmade ceramic coffee cup on a worn wooden café table, soft morning window light from the left, honest shadows, small glaze imperfections and a tiny chip on the rim, a few coffee drips on the saucer, shot on an 85mm macro lens at f/4 with shallow depth of field, natural muted colours, slightly off-centre, no staged props',
    tells: ['Speckled glaze and coffee drips on the saucer show real use. The slop cup is flawless and staged.', 'Soft window light from one side, with honest shadows. The slop shot has dramatic rim light and theatrical steam.', 'Worn tabletop grain and a quiet, muted palette. The slop version looks like a stock render.'] },
  { title: 'Film still: astronaut in a garden', slop: 'assets/real/film-slop.jpg', real: 'assets/real/film-real.jpg',
    slopPrompt: 'Ultra realistic 8k masterpiece, hyper detailed cinematic shot of an astronaut in a glowing garden inside an abandoned spaceship, epic, stunning, volumetric lighting, dramatic, trending on artstation, highly detailed',
    realPrompt: 'Film still, 35mm anamorphic lens. An astronaut in a scuffed, worn suit kneels in a small overgrown hydroponic garden inside an abandoned ship, lit by flickering practical fluorescent tubes and green grow-light spill, dust on the helmet visor, tape and handwritten labels on the pipes, muted desaturated colours, shallow depth of field, fine film grain, restrained composition, slightly off-centre',
    tells: ['Practical fluorescent tubes and grow-light spill. The slop version fills the room with neon bioluminescence and god rays.', 'One subject, one believable action (kneeling, working). The slop version is a hero pose in a cathedral set.', 'Tape, labels, dust and muted colour make the place feel used. The slop version is all glow and no history.'] }
];