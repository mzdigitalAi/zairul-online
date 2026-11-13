ZAIRUL ART STUDIO  -  by Zairul MD TY (formerly Poster Brief Builder; theme: frosted sky glass)

OPEN IT
  Double-click index.html (Edge or Chrome). Fonts load from Google Fonts when online; everything else is local.
  Or from the parent folder:  node serve.mjs Poster-Brief-Builder 4176   then open http://localhost:4176/

WHAT IT DOES
  1. Pick the poster type (10 types).   2. Type the exact words.   3. Pick style (16), mood, colours, lettering, realism mode.
  4. Pick size and image tool.  You get: a ready-to-paste prompt (Flow/Nano Banana, ChatGPT image, Seedream, generic),
  the list of text that must appear exactly, a JSON brief, six fix-up prompts, and a live layout preview in three layouts.
  Briefs are saved in this browser only (localStorage). Nothing is sent anywhere.

STYLE EXAMPLES
  styles\ holds one real example poster per style, all made from the same Kopi Pagi coffee brief so the styles compare fairly.

PORTRAIT / FASHION PHOTO MODE
  Pick "Portrait / fashion photo" as the type. Describe a type of person, pose, outfit, place, light and camera cue; choose a photo look (8);
  use the Quick swap chips to change only the subject, pose or place. Output: prompt, a check-the-result list, JSON, and fix-up prompts (hands, skin, eyes, outfit only, background only).

SET MODE (carousel, series, campaign pack)
  Step 5 "Make it a set": turn it on, choose carousel, series of posters or a 3-size campaign pack, and enter a headline, support line and picture idea per piece.
  The design anchor (style, colours, lettering, mood, layout rule) is built from your choices and added to every piece, so the set stays consistent.
  The "The set" tab shows the anchor plus one prompt per piece; Copy buttons copy the anchor or a single piece. The JSON tab exports the whole set.

CONCEPT CARDS
  Under the content step, press "Suggest 3 concepts" for three ways to tell the same message (for example hero close-up, big type, flat lay). Shuffle gives three more.
  "Use this concept" fills the picture idea and picks a layout; the concept name and pitch are added to the prompt.

NOTES
  All wording, styles and layouts in this tool were written for this project. Edit data.js to change types, styles, palettes, sizes.

PRODUCT PHOTO TYPE
A second photo mode for product shots: product, surface, props and angle, 8 looks (clean white, flat lay, lifestyle, dark premium, colour backdrop, food close-up, outdoor, in hand), quick swaps, a product framing guide, a check list and product fix-up prompts (label, shadow, white cut-out). Use the finished photo as the hero visual of a poster.

QUICK START
A one-line box at the top. Type a short idea (for example 'Promo Hari Kemerdekaan' or 'Storyboard ASMR unboxing 10 seconds'); the builder guesses the type, fills the brief and you adjust the details.

VIDEO STORYBOARD TYPE
One idea becomes timed scenes (reveal, detail, action, payoff, hero finish), a visual direction block, a continuity line that is repeated in every scene prompt, one video prompt per scene, a clip check list, stitching advice and fix-up prompts. 6 looks, 3 to 8 scenes, 3 to 120 seconds.


SECRET STYLE
A 17th style, 'Hyper-real 3D crew', is hidden. Unlock it by clicking the ZAIRUL ART STUDIO logo 5 times quickly, or by typing the word crew in the one-line box and pressing Start. It stays unlocked in that browser. Example image: styles\crew.jpg (made with ChatGPT from the same Kopi Pagi brief, fictional characters; photoreal with a subtle caricature touch, not a cartoon).


SECRET STYLE RECIPE
Once unlocked, the Crew caricature photo style shows a 'Reverse-engineered recipe' (subject, composition, caricature level, light, colour, textures, typography) and a button that copies a full ChatGPT image prompt for the look. The style also adds its composition, light and type treatment to every prompt you build with it.

HYPER-REAL 3D CREW (update)
This secret style is an ultra-realistic 3D look: real likeness kept, slightly enlarged heads and eyes, slightly exaggerated expressions, glossy polish, never a flat cartoon. After unlocking, pick a scene (Golden workshop, Sunny park, Amber hero solo, Costume hero), the number of people (1 to 4), whether you will attach real photos (adds a likeness-lock line) and an optional inset of the original photo. The copy button builds a ready ChatGPT image prompt from your brief: Brand = logo, Subheadline = kicker, Headline = main line, Call to action or Date = pill label, Price = accent script word (workshop scene).


BEACH SCENE AND STYLE REFERENCE
The Hyper-real 3D crew style now has a Beach scene (turquoise water, white sand, palms, sunny-yellow accent over a deep teal base) and an 'Attach a style reference image' switch: the prompt then tells ChatGPT that the last attached image is a style reference only, so it copies the look and not the people. Order of attachments in ChatGPT: first the photo(s) of the real people, then the style reference. Use photos only of people who agree to it.

NOTE ON THE CREW EXAMPLE
styles\crew.jpg is a restyled version of a free stock photo (small original inset top right), made with ChatGPT using the Beach scene prompt. If the stock photo's licence asks for a credit, add the photographer's name here and on the site.

INFOGRAPHIC PLANNER
A new type for step-by-step and number-driven infographics. Enter a topic, 3 to 8 steps (one per line: Label | detail | icon idea), up to 4 key numbers (Label | value), an optional hero scene, source and credit line. Pick one of 7 looks (Isometric diorama, Flat editorial, Blueprint, Paper craft, 3D clay, Dark data, Macro photo). Tabs: Prompt, Plan it with AI (a helper prompt for any chatbot that drafts the lines in the right format and marks every number to verify, plus a result check list), JSON brief, Fix-up prompts. The old 'Infographic poster' type is now called Quick infographic. Always check numbers against a real source before posting.

LET AI CHOOSE
A button in 'How should it look?', above Realism mode. It reads the whole brief (type, every text field, mood) and picks the style, mood, colours, lettering and realism setting for posters, or the best look for the photo, product, video and infographic types. It then tells you why. It is a built-in rule-based picker: it runs in the browser and sends nothing anywhere. Your own choices stay editable.

INFOGRAPHIC PLANNER UPDATE (from studying three more infographic gems)
- Clean-text rules: infographic prompts now say only the quoted words may appear, text goes on flat high-contrast panels, sentences stay at 14 words or fewer, and hex codes, colour names, style words and instructions must never be printed on the picture. The shared Avoid line of every poster prompt got the same protection. The JSON brief adds strict_visual_policy and negative_prompt,.
- Why it matters cards: up to 3 'Title | text' lines become a card strip near the bottom.
- 4 kids looks: Kids paper craft, Kids chibi clay, Kids knitted felt, Kids storybook. They add a child-friendly line (simple words, short panels, nothing scary).

ADDED AFTER STUDYING RMP AND WMP (two more public gems)
- Date check: if a field contains a weekday with a date (English or Malay, for example 'Friday 14 November 2026' or 'Jumaat, 14 Nov'), the studio checks the calendar and shows an orange warning if the weekday is wrong. The same warning appears in Text to render.
- From a reference tab (all types): an observe, imitate, modify prompt. Attach a poster or photo you like, paste the prompt, and it rebuilds that layout and mood with your own brief.
- Recipe fields in the Infographic planner: ingredients (one per line) and a time, servings or tip line, plus 5 new looks: Rustic wood, Chalkboard, Watercolor, Scrapbook, Dark luxury.

NEED THE WORDS? (after studying a public PosterPrompter GPT)
The 'Text to render' tab of every poster type now ends with a copywriter helper prompt for any chatbot: three promo concepts, then a headline, subheadline, call to action and tagline, with a strict rule never to invent prices, discounts, dates, claims or contact details.

NEW POSTER STYLES (19 public styles now)
3D premium ad, Scrapbook collage and Isometric diorama, each with a Kopi Pagi example picture (made with ChatGPT and Google Flow). Let AI Choose knows about them too.

PATRIOTIC STYLE AND PAKGURUH-INSPIRED INFOGRAPHIC LOOKS
- New poster style: Patriotic illustrated (20 public styles now), a semi-flat retro print look with ink splatter, a big flag, a skyline, a ribbon date banner and a heavy headline with a script lead-in. Let AI Choose picks it for Merdeka, National Day and similar words.
- Infographic planner looks: Hero and ledges (one oversized hero plus a staircase of step vignettes on wooden ledges, two round callout cards, a gold serif title) and Split-view compare (two options side by side). Recipe and drink topics now pick Hero and ledges; comparison topics pick Split-view compare.
- Prompt rules learned from tests: keep text in its original language (image tools tried to translate Malay into English), and Flow offers no 4:5 (use 3:4).

VIDEO THUMBNAIL TYPE (after studying a public Pro Thumbnail Generator app)
A new type for YouTube thumbnails (16:9) and Shorts, Reels and TikTok covers (9:16). Fields: hook title, sub-hook, person and scene, reaction, layout and lettering (Bold, Neon, Minimalist, Handwritten, Serif, Gaming). 7 looks: Flat vector, Classic doodle, Modern sketch, Photoreal, Cinematic, 3D render, Comic book. The prompt forbids invented logos, play buttons, LIVE badges and timestamps (the studied app added some by itself). The Thumbnail check tab has a shrink-to-160px test and explains how to make 4 variations by swapping the layout. Quick start recognises thumbnail, YouTube, Shorts and similar words.

3D VINYL TOY STYLE (after studying a public 3D isometric toy GPT)
New poster style (21 public styles now): a collectible designer-toy look with a big round head, glossy vinyl plastic, candy colours and a small isometric base, with an example made in Google Flow. Picking it adds a 'Copy the photo-to-toy prompt' button: attach a photo of a person, pet or object and it turns it into a recognisable vinyl toy figure. Let AI Choose picks it for toy, mascot, chibi, collectible and avatar words.

VINYL TOY UPDATE: the example picture now comes from ChatGPT. After testing the real AiVA Zyra GPT: with no extra instruction it gives a cute Pixar-like 3D character scene (it also invented a menu with prices, so check any text it adds); when asked for a full figurine on an isometric base it returns a transparent-background collectible figure. The photo-to-toy prompt now asks for a full-body figurine on a small isometric base with matching props and a plain or transparent background, no text.

The 3D vinyl toy example is now the AiVA Zyra figurine alone on a transparent background (styles\vinyltoy.png and vinyltoy-s.png). Styles can now have a PNG example: the picture sits on the style's colour gradient so the transparency shows.

IMAGE TOOLS: the Midjourney option was replaced by Seedream 5.0. It uses the full natural-language prompt (Seedream follows long, detailed text and quoted on-picture words well), so there are no command-line parameters in its output.

ADDED AFTER STUDYING FOUR MORE INFOGRAPHIC GEMS
- Exact data maths: in the Infographic planner, key numbers with the same unit (for example Cawangan A | RM12,000) are now totalled and compared automatically: sorted values, share of total, average, highest, lowest and gap. The prompt shows them as bars and a donut and forbids any other invented numbers or metrics. The JSON brief includes computed_data.
- Brief labels are never printed: every poster prompt now forbids section labels or instructions from the brief appearing as visible text. Infographic prompts also say text is flat and frontal (never tilted or 3D), arrows appear only between real steps, and each icon shows the exact object it names.
- Carousel sets: each slide prompt now adds layout zones (header 15%, content 70%, footer 15%), an 8% safe margin, a page number such as 1/5 and a Swipe cue on every slide except the last.
- New infographic look: Annotated hero (one detailed hero with flat callout panels joined to its parts by thin leader lines). Let AI Choose picks it for composition, ingredients, parts and specs topics.

New infographic look: Grunge zine (black torn paper and halftone, taped white panels, acid neon-green numbers and arrows), from studying a public GAYA 11 | GRUNGE gem. Let AI Choose picks it for grunge, punk, zine, street, gig and band words.

ADDED AFTER STUDYING FIVE MORE GEMINI TOOLS (comic, landing page, infographic and photo generators)
- Comic page type: story, characters (repeated so faces stay identical), up to 8 panels with exact speech-bubble text (the speaker name is never printed), 4 layouts and 7 looks. Comic check and fix-up prompts included.
- Sales page image type: a strict top-to-bottom order (main visual, headline, price badge, subheadline, 4 icon cards, button), edge treatment, 6 looks, and a rule against invented bonuses, prices or claims. Tested in Flow: the order and every word came out exactly right.
- Portrait upgrades: scene categories (Indoor studio, Outdoor, Family, Korean-style editorial, Faceless, Fun, B-roll with and without people) and an 'Images you will attach' line that gives each attached image a role (face, outfit, pose, mood and lighting).
- Aspect ratio switches to 4:5 automatically when you choose Sales page or Comic after a 16:9 type.

PRODUCT PHOTO UPGRADE (after studying a public Generator AI Product and Mockup app)
The quick swaps for Product photo now offer 14 surfaces and backdrops, 12 angles and compositions (flat lay, knolling, low angle, Dutch angle, macro, focus stacking, symmetrical and more) and 14 lighting styles, and there are two new looks: Digital mockup (ebook, app or course on a device) and B-roll detail (close-up cut-aways for video). The studied app also adds its own watermark; this studio never adds one.

STORYBOOK TYPE (after studying a public Komik Storybook Builder gem)
A new type for children storybooks: title, subtitle, story idea, characters (Name | trait | trait | trait, repeated as a compact anchor on every page they appear in) and one line per page (scene | narration). The output has a Design Lock (style, palette, lighting, texture, lettering, layout), a cover prompt and one self-contained prompt per page with the narration in a bottom box and a small page number, plus a priority rule (continuity, character consistency, text accuracy, readability). 6 looks: Soft pastel watercolor, Paper cut-out, Clay 3D, Flat vector, Crayon kids, Bedtime glow. No watermark is added. Quick start recognises storybook, buku cerita and dongeng.

STORYBOOK/COMIC (merged)
The Storybook and Comic page types are now one card, 'Storybook/Comic', with a format switch at the top of step 2: Storybook (full pages, narration boxes, one picture per page) or Comic (several panels per page with speech bubbles). Switching keeps your story, characters and pages: they are copied across if the other format is still empty.

CAROUSEL AND SOP OUTPUT FOR THE INFOGRAPHIC PLANNER (after studying a Universal SOP 3D Simulator gem and a Universal Reparation Guidance gem)
- New Output choice: 'Carousel: one step per slide'. Each step becomes its own slide prompt with a design lock, a small topic header, a step-number badge, the caption in a box, your credit line in every footer, a page number such as 2/5, a Swipe cue on every slide but the last, and the source line on the last slide only. A closing slide is added when you fill the why-it-matters cards.
- Optional 'Same character on every slide' field, repeated on every slide so the figure never changes.
- Steps preset: a generic SOP skeleton (prepare and stay safe, find the problem, do the fix, check the result, clean up and record) and a short how-to skeleton. Edit them to your own facts and always check safety steps against a real source before publishing.

The 'Need the words?' helper (Text to render tab) now also asks for 3 to 4 benefit lines from your real facts and an Instagram caption with 5 hashtags, and says not to invent prices, claims or benefits (idea from a public Universal Content Generator GPT, which invented a promo price and benefit claims).


--- LATEST: six more styles, two poster types, attached images ---
New styles (each with an example picture, all wording original):
  Modern Islamic flat, 3D liquid and fluid, Embroidery and tapestry,
  Wood carving relief, Talk stage, Promo burst.
  "Let AI choose" now knows them (Ramadan or masjid words pick Islamic flat,
  talk or seminar words pick Talk stage, ukir or batik words pick Wood carving, and so on).
New poster types: Wedding / Invitation and Film / Show poster.
New field on every poster type: "Images you will attach". Write them in order,
e.g. "style reference, product, logo". The prompt then tells the image tool what
each picture is for (copy the look only, keep the product exact, keep the logo unchanged).
Not taken on purpose: glass dark-mode, papercraft diorama, sketchbook and papyrus
styles (already covered by Glass UI, Papercraft layers, Hand-drawn and Wood carving),
and no price, contact or benefit text is ever invented.


--- LATEST: NotebookLM slides (special section) ---
A new card in "What are you making?" marked SPECIAL: NotebookLM slides.
It writes a YAML style prompt that you paste into NotebookLM:
  Studio > Slide Deck > pencil icon > custom instructions > paste > Generate.
You upload your own sources in NotebookLM; the prompt only describes the look and the purpose of the deck.
- 18 slide styles, all original (Boardroom brief, Quiet minimal, Midnight neon, Pastel classroom,
  Paper journal, Magazine cover story, Earth and leaf, Calm care, Pitch deck bold, Batik heritage,
  Festive lantern, Retro pixel, Blueprint, Noir gold, Kawaii notes, Data newsroom, Kopitiam warm, Frost glass).
- Each prompt has: deck brief (focus, audience, goal, length, format, language, must include, leave out, footer),
  design system (typography, 5 named colours, visual elements, imagery), slide templates, content rules and guardrails
  (only facts from your sources, a source note under every number, no invented statistics).
- Quick swaps: length, presenter or reading format, language, and Full or Compact prompt size
  (Compact is about half the length, for NotebookLM's input limit, which you should check on your account).
- Let AI Choose picks the slide style from your words (investor and growth words pick Pitch deck bold, batik or heritage
  words pick Batik heritage, and so on). Typing "slide deck ..." in the one-line start also opens this type.
- Tabs: Prompt (the YAML), Check the deck (how to use it, a length check, a review list and an outline prompt for the
  notebook chat), JSON brief, Fix-up prompts (add to the instructions and regenerate), From a reference
  (attach a screenshot of a slide you like and get a new YAML style written in the same format).
Idea source: a public gallery of NotebookLM YAML slide styles, studied for its format only.
No style names, colours or sentences were copied.


--- LATEST: 101 NotebookLM slide styles with example pictures ---
NotebookLM slides now has 101 original slide styles in 6 groups:
  Business & executive (21), Minimal & modern (9), Creative & playful (31),
  Editorial & magazine (13), Tech & innovation (11), Nature & wellness (16).
Pick a group, then click a style card; the big example slide, the colour dots and the "best for" line show on the left,
and the YAML prompt on the right updates at once. Every style has its own example slide picture (styles/deck/).
Let AI Choose knows about the new styles (for example hotel words pick Olive Villa, skincare words pick Serum Drop).
How these were made: the themes of a public NotebookLM style gallery were studied, then every style was written fresh
in this studio's own wording, with its own name and its own colours. No YAML text, no style names and no preview images
were copied. The example slides were generated in Google Flow from this studio's own style descriptions.
The sample slide shows invented numbers only to demonstrate the look; your real deck uses only your sources.


--- LATEST: dark liquid glass theme, glowing title, banner picture ---
- The whole site now uses a dark liquid glass look: a true-black canvas with soft red, blue and violet glows behind
  tinted, frosted glass panels, thin bright edge highlights, capsule buttons and red accents (selected items turn red on
  lighter glass). Layout, shapes, positions and all pictures are unchanged; only colours and materials changed.
- The title is now "ZAIRUL AI ART STUDIO" with a pulsing neon glow and a moving red-pink shine (page title and footer match).
- A 21:9 banner picture sits in the top capsule beside the title, faded on all four sides so it blends into the glass.
  It is hidden on screens narrower than 980 px. The clean 21:9 picture (watermark removed) is img/banner-21x9.jpg.
  To change the picture, replace that file with any 21:9 image.
- The old light theme is kept out of the code; if you ever want it back, ask for "the light theme".

--- Header picture updated ---
img/banner-21x9.jpg is now an AI-made panoramic picture of Zairul beside an orange supercar (made in ChatGPT from the earlier banner photo). Replace the file with any 21:9 image to change it.


--- LATEST: "Golden hour" redesign and best-fit style examples (13 Nov 2026) ---
LOOK: a new dark, warm "golden hour atelier" theme sits on top of the old stylesheet (luxe.css + luxe.js; styles.css is unchanged,
so removing those two lines from index.html brings the old look back). New cinematic hero (img\hero-golden.jpg), serif display
type (Fraunces), glass top bar, gold chips and a stats strip that counts up.
LIVE PREVIEW: the old grey wireframe is replaced by a real poster drawn from the brief: your headline, sub-line, price badge,
button, contact, list and when/where, in the chosen colours, lettering and style (frames, tape, grain, neon, glass and so on),
hung on a spot-lit studio wall. Three layouts (type-led, image-led, framed) plus a wide banner layout. The picture area is a
stand-in scene, labelled with what the real picture will be. Size, palette and style chips sit under it.
STYLE EXAMPLES: 28 of the poster styles no longer share one Kopi Pagi coffee brief. Each example now shows the style on the
kind of job it suits best (for example Spec sheet launch = an electric car launch, Kawaii sticker = a mochi snack, Luxury dark
gold = a jewellery house, Patriotic = a Merdeka poster). Each tile carries a small tag naming that job. All brands are invented.
Made with Google Gemini from this studio's own style descriptions. 3D vinyl toy and the hidden crew style keep their examples.
To change one: replace styles\<id>.jpg (900x1200) and styles\<id>-s.jpg (360x480) and edit its line in STYLE_EX in data.js.

--- LATEST: Beauty key visual style and Ingredient world look (13 Nov 2026) ---
New poster style "Beauty key visual" (31 styles now), studied from four personal-care shelf posters. One centred stack: brand
small at the top, a big two-line serif benefit headline coloured from the pack, a small spaced-capitals product line, the pack
upright on a natural pedestal inside the world of its hero ingredient (fruit, flower, leaf, oil or place), and a frosted strip
of up to four line icons with short labels at the bottom. The prompt uses only the benefits you type and forbids invented
certification seals, test badges, percentages and awards. Example: an invented shampoo brand (MELUR), made with Google Gemini.
Let AI Choose picks it for shampoo, soap, hand wash, lotion, serum, sunscreen, toothpaste, supplement and similar words.
New Product look "Ingredient world": the same scene idea for Product photo mode, without text.

--- LATEST: Cinematic re-render style, photo-to-render buttons and Game cinematic look (13 Nov 2026) ---
New poster style "Cinematic re-render" (32 styles now), studied from six carousel covers. Two layers:
RENDER: halfway between a photograph and a big-budget game cinematic. True proportions, pores, stubble and fabric weave sharper
than a camera gives, a long portrait lens with very shallow focus, a soft key light plus a strong rim-light halo from behind,
dust and debris floating at several depths in a light haze, a muted grey background with one saturated colour on the subject.
OVERLAY: headline bottom left in heavy wide italic white capitals with one word in thin italic highlighter yellow, the call to
action in a yellow outlined pill, and your brand as a small white script signature in a top corner. Nothing else.
The live preview shows this style with an italic capital headline and an outlined pill.
Two buttons under the style: "Copy the photo-to-render prompt" (attach your own photo, pet, product or drawing and get it back in
this look) and "Copy the before-and-after version" (adds the original as a small inset with a hand-drawn arrow).
Only use photos of people who agree and characters that are yours: do not re-render celebrities or other companies' characters.
Example: an invented footballer for an invented club (RFC), made with Google Gemini. No real club, league or sponsor marks.
Let AI Choose picks it for football, futsal, athlete, e-sports, gaming, signing, match day, carousel and re-render words.
New Portrait look "Game cinematic": the same render look for Portrait / fashion photo mode, without text.

--- LATEST: login, light glass theme, reference uploads (13 Nov 2026) ---
LOGIN: /middleware.js (repo root) is a Vercel Routing Middleware that guards everything under /art-studio/ on the server.
The username and password are NOT in any file. Set them in Vercel > Project > Settings > Environment Variables:
  STUDIO_USER (the login name, e.g. an email)   STUDIO_PASS (the password)
then redeploy. Until both exist the studio stays open; https://zairul.online/art-studio/__auth/ shows {"configured":true} once on.
Sign-in page: /art-studio/login/ . Log out: the button in the top bar, or /art-studio/logout/ . Changing STUDIO_PASS signs everyone out.
A session lasts 30 days with "Keep me signed in", otherwise 12 hours.
THEME: the "Light glass" switch in the top bar swaps to a frosted white glassmorphism theme (remembered in this browser).
Rules live at the end of luxe.css under html[data-theme="light"].
REFERENCES: "Upload reference images" under the prompt. Up to 6, kept in this browser (resized to 720 px). Each gets a job
(main subject, product, face, outfit, pose, style and mood, layout, background, logo). The prompt and JSON brief get a numbered
list, the first main subject / product / face / background fills the picture area of the live preview, and "Download numbered"
saves copies named 1-, 2-, ... so they are easy to attach in the same order.
STATS: the hero numbers no longer shrink behind their labels.

UPDATE (13 Nov 2026): Cinematic re-render now adds a light animated-film caricature (heads and eyes very slightly enlarged, bigger expressions, faces still recognisable) and a background blurred into glowing bokeh lights. The photo-to-render prompts were updated the same way. New example picture.
Look target: exactly between ultra-realistic and a 3D cartoon render, never Pixar/Disney/toy-like.
