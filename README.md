# frenchbulldogrescue-za

Conversion-first static site for French Bulldog Rescue South Africa.

## Goal
Get the first qualified French Bulldog surrender enquiry quickly, safely, and with high trust.

## Stack
- Static HTML/CSS (Cloudflare Pages-ready)
- GitHub repo auto-deploy to Cloudflare Pages

## Routes
- `/` Home + trust + fast pathways
- `/surrender-a-french-bulldog-south-africa/` Primary surrender conversion page
- `/robots.txt`
- `/sitemap.xml`

## Deploy (Cloudflare Pages)
1. Push this repo to GitHub (`frenchbulldogrescue-za`).
2. In Cloudflare Pages, connect GitHub repo.
3. Build command: *(none)*
4. Output directory: `public`
5. Set production branch: `main`

## Next implementation
- Connect real surrender form endpoint (Turnstile + email/webhook)
- Add analytics + conversion tracking
- Add province-specific surrender landing pages
