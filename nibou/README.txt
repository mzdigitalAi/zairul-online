NIBOU FOOD & BEVERAGE: CONCEPT HOMEPAGE (unofficial)
Designed and built by Zairul MD TY as a design concept.

WHAT IT IS
A static, no-build homepage. The hero opens with the Nibou logo reveal (vector logo drawn in, fruits orbiting it). Scrolling on, the hero walks through the six brands in order:
Dadih, Yourgurt, Freshill, Drinme, Kid's Joy and Bebee. Each scene shows the brand's vector logo (white sticker outline), a vector illustration of its product,
and its own colour, outline word and orbiting bits (fruit, hearts, nata cubes, honeycomb, bees). The product flips to the next brand as you scroll, floats, squashes, tilts with the pointer and
spins with the scroll. The dots are clickable. Below: six brand cards with 3D tilt, a sideways range rail, proof numbers that count up, the halal / HACCP / ISO strip, the two mascots, where to buy, and contact.

FILES   index.html, style.css, fruits.js (vector fruits + hero engine), brands.js (the six vector brand scenes), main.js, assets/ (assets/brands/ = vector logos)
RUN     serve over http (for example: node serve.mjs Nibou-Concept-Homepage 4194) or drag the folder onto https://app.netlify.com/drop
IMAGES AND TEXT
Logos, mascots, trust badges and product photos in assets/ are Nibou's, taken from the public pages of nibou.com/fnb as stand-ins for this concept.
Replace them with files approved by Nibou before any real use. The page says "Unofficial concept" in the top ribbon and the footer.
The words come from nibou.com. Numbers (2,000,000 units, 3 countries, 6 distributors) are quoted from the site as stated there.
Mascot names Bobo and Nini are taken from the image file names.

CONCEPT VISUALS
assets/concept/concept-1..6.jpg are six AI-generated scenes (made in Gemini, Nano Banana) with the real Nibou packshots from nibou.com composited in: Freshill bottles, Drinme Mix Berry pouch, Dadih pudding packs, Yourgurt pack, Kid's Joy pack and Nibou Syrup Rose. Jelly friends has no packaging.
They are not Nibou artwork. Replace them with real campaign photography when available.

SAFETY AND ACCESSIBILITY
Respects reduced motion (no wobble, no scroll-linked motion). If WebGL is missing it shows a CSS jelly. Phones get a smaller, lighter scene.

VECTOR BRANDS AND FRUITS
Brand logos (assets/brands/<brand>-logo.svg, flat, and <brand>-sticker.svg, with white outline) are vector traces of the small logo images on nibou.com. Dadih, Freshill and Drinme were traced earlier for the poster sets; Yourgurt, Kid's Joy and Bebee are new.
They are approximations: replace them with Nibou's official vector files before real use. The six packs in brands.js are simplified illustrations in each brand's style, not exact packaging.
Bebee is Nibou's honey range (Original, Lemongrass, Lemon); its hero scene shows vector squeeze bottles.
All six fruits are drawn in code (fruits.js) as SVG with gradients, so they stay sharp at any size. To use your own vector art instead, replace the matching function in fruits.js with your SVG markup.

Logo: assets/nibou-logo.svg (full colour) and assets/nibou-logo-white.svg are sharp vector traces of the supplied logo, split into layers (ring, NBI, dot, divider, wordmark, tagline). The page's final scroll scene reveals the logo inline from index.html. Unofficial concept: swap in the official vector logo file before real use.

BRAND PAGES (concept/)
The hero button "Explore <brand>" and the six brand cards open each brand's "Unofficial concept" poster-ad page:
  concept/dadih/  concept/yourgurt/  concept/freshill/  concept/drinme/ (plus concept/drinme-board/, the brand identity board)  concept/kidsjoy/  concept/bebee/
Dadih, Freshill and Drinme are the earlier poster pages, copied in (their big PNG/PDF export folders are left out; the pages draw and download the posters themselves).
Yourgurt, Kid's Joy and Bebee are new: three posters each in feed 4:5, story 9:16 and A3 print (3 mm bleed), all vector (concept/shared/vposters.js + brands.js).
Every page has a link back to the homepage. Keep the folder structure when deploying: the new pages load ../../fruits.js, ../../brands.js and ../../assets/.
Kid's Joy page (concept/kidsjoy/): made from the real Kid's Joy Drinking Jelly photos on nibou.com (cropped to hide their baked-in logos) and cutouts of the 12's and 6's packshots. The homepage hero scene for Kid's Joy stays a vector illustration (cups with a richly printed lid); the page content inside is the real product.

MOTION (v2)
Homepage: motion.css + motion.js sit on top of style.css / main.js / fruits.js (no libraries).
  Hero: colour iris wipe from the product on each brand change, slow sunburst behind the product, shock rings, twinkles, pointer glow,
        orbiting pieces burst out from the centre, big outline word comes in letter by letter and drifts with the scroll, description comes in word by word,
        floating sticker logo, a ring on the active dot that fills as you scroll through that brand, logo card floats and catches the light.
  Page: top scroll-progress bar, nav underline + scroll-spy, brand-name marquee that speeds up while scrolling, headings that rise word by word out of a mask,
        cards that tilt up into place, "View concept" chip + light sweep on brand cards, chips and store logos popping in, product rail sliding in (drag to scroll),
        gallery images wiping up, confetti and scroll-linked mascots in the joy band, magnetic buttons.
Brand pages: concept/shared/motion.css + motion.js (all six poster pages): drifting colour glow, title words rising, floating logo, posters tilting up one by one,
        3D pointer tilt with glare on each poster, click (or Enter) to zoom a poster and Esc to close, download buttons that confirm, loading shimmer, top progress bar.
Everything is switched off for visitors who ask for reduced motion, and the pages still show all content without JavaScript.

REAL PRODUCTS ON THE BRAND PAGES (latest)
concept/yourgurt/, concept/kidsjoy/ and concept/bebee/ now use the real product photos from nibou.com (cropped lifestyle shots and packshot cutouts), not illustrations.
Bebee is Bebee Honey (Original / Madu Asli, Lemongrass / Madu Serai, Lemon / Madu Limau, 375ml). The site has one Bebee photo, so its three posters are crops of it.
New page concept/easysantan/: Nibou (NBI) EASY Santan Coconut Powder (50gm x 4's). It is linked from the "Cooking Essentials" chip and from the Easy Santan tile in the range rail.
The hero scenes on the homepage stay vector by request; the Bebee scene now shows honey bottles, and the Bebee brand card uses the real photo (assets/p-bebee.jpg).
The Yourgurt hero scene is now a vector drawing of the real pack: two pudding cups with the square peel-off lid (fruit print, YOURGURT wordmark, Fruity & Tasty, NBI mark, the two kids): a green one upright and an orange one lying on its side.
Hero brand descriptions: larger type (about 19 to 30 px, 17 px on phones, where they now show too). Words rise in one by one out of a blur; the key words are heavier, set in metallic gold (premium black on the light Yourgurt and Bebee backgrounds), pop in a beat later, and a slow shine keeps running through them. No underline. The key words are marked with *asterisks* in the desc text in brands.js; hl next to it is 'gold' or 'black'.

3D (BLENDER)
The hero's fruits, decor pieces (hearts, stars, nata cubes, drops, jelly beads, honeycomb, bee, leaf) and the six product scenes are real 3D models built and rendered in Blender 5.2 (EEVEE). They live in assets/3d/ as WebP (220 files, about 6.1 MB).
Each product scene is a 33-frame turntable from -36 to +36 degrees. fruits.js aims at an angle from the pointer, a slow sway and your scroll, eases toward it with a damped spring, and blends the two nearest frames, so the turn is continuous with no steps. The vector art stays as the instant fallback while the renders load.
The packaging artwork on the models (labels and lids) comes from the same vector art as before. The Blender script is in Transfer-2026-11-09\Nibou-3D-Blender-Source.
Freshill 3D scene: the matching fruit sits in front of each bottle (strawberry, mango, blackcurrant from left), and lychee, soursop, lemon and a rose float around them.

SOUND (sound.js)
An original background score and transition effects, synthesised live with the Web Audio API: no audio files, nothing to license.
The switch sits in the header right after Contact. Sound is off until the visitor turns it on (browsers block autoplay); the choice is remembered, and a returning visitor hears it after their first click or key press.
Score: 104 bpm, marimba and soft flute lead, plucked arpeggio, warm pad, bass, kick, snap and shaker. Light during the logo reveal, then bass and drums drop in for the brands; each brand plays in its own key; calmer below the hero.
Effects: logo shimmer, brand-change whoosh, pop and sparkle, mascot boings and slide-whistles in time with the peek-a-boo, a counter that ticks and lands on a chime, soft bells as section titles rise, gentle notes on button hover.
The sound pauses when the tab is hidden.
