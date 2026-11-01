# zairul.online: how to put it live

## What's in this folder

| Path | Page |
|---|---|
| `/` | Home: scroll-scrubbed spy video, "I'm Rul… Zairul" opening, live previews from your galleries |
| `/workflow/` | Creative workflow, the 8-step AI image process, 4 case studies |
| `/videos/` `/images/` `/audio/` | Your gallery apps, unchanged, with the shared menu on top. Admin still works with `?manage=1` |
| `/magazine/` | Publications with the flip-style PDF reader |
| `/resume/` | Resume page + downloadable PDF |
| `/contact/` | Contact options + "send a brief" form (opens the visitor's email app) |
| `assets/menu.js` | **The shared menu.** Edit the `MENU` list at the top to change the menu on every page |

## 1. Deploy on Vercel (about 5 minutes)

1. Go to vercel.com, then **Add New… → Project**.
2. Choose **Deploy without Git** / drag-and-drop, and drop this whole folder (the one containing `index.html` and `vercel.json`).
   - Framework preset: **Other**. No build command. Output directory: leave empty (root).
3. Click **Deploy**. You'll get a `something.vercel.app` link to check first.
4. In the project, open **Settings → Domains**, add `zairul.online` (and `www.zairul.online`), then follow Vercel's DNS instructions at your domain registrar.

To update later: drag the folder in again (**Deployments → Redeploy** or `vercel --prod` if you use the CLI).

## 2. One Supabase setting (needed for gallery admin sign-in)

Your galleries now live on `zairul.online`, so Supabase must allow sign-in to return there:

1. Supabase dashboard → your project → **Authentication → URL Configuration**.
2. Under **Redirect URLs**, add:
   - `https://zairul.online/**`
   - `https://www.zairul.online/**` (if you use www)
3. Save. Leave the existing `zairul-image-gallery.vercel.app` entry, so the old gallery and its Notion embeds keep working.

Then manage content at:
- Images: `https://zairul.online/images/?manage=1` (sign in here first)
- Videos: `https://zairul.online/videos/?manage=1`
- Audio: `https://zairul.online/audio/?manage=1`

Anything you publish there shows up on the gallery pages **and** on the homepage previews (latest film card, image strip, track artwork, counts) automatically.

## 3. Add your publication PDFs

See `magazine/pdfs/README.txt`. Short version: drop the PDFs into `magazine/pdfs/` with the names listed in `magazine/publications.json`, then redeploy. Cards switch from "Coming soon" to the real cover by themselves.

## 4. Optional swaps

- **Resume PDF:** `resume/zairul-md-ty-resume.pdf` was made from the Notion images. Replace it with your original export for sharper text (keep the same file name).
- **Background music:** replace `assets/theme.mp3` (keep the name). Visitors turn it on/off with the **Sound** button; it starts on the first click on the homepage and keeps playing across pages once switched on.
- **Hero video:** `assets/hero-desktop.mp4` (16:9) and `assets/hero-phone.mp4` (9:16). Keep them short (~15 s) and small (~2 MB) so scrubbing stays smooth.

## Good to know

- Old links like `zairul.online/#ai-video` still work and jump to that section of the homepage.
- Visitors who prefer reduced motion get a calm, stacked version of the homepage automatically.
- The site is plain HTML/CSS/JS, so there's nothing to install or build.
