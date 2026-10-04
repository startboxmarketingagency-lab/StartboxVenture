# StartBox Ventures website: rules

Static site deployed on Vercel (`cleanUrls`, see `vercel.json`). Pages are plain HTML sharing `assets/css/site.css` and `assets/js/site.js`. `api/brand-diagnosis.js` is the only server code.

## Non-negotiable content rules

1. **Company location is India.** Every page, schema block, footer and meta tag must give the location as India (schema may add `addressRegion: Gujarat`). Never show a city (no "Vapi") and never imply the company is based anywhere else.
2. Never publish StartBox revenue figures, and never publish anything that reveals the founder's age.
3. Never invent proof: no made-up results, testimonials, client names or numbers. Missing proof stays out until there is a real line ("needed X, we did Y, result Z").
4. Clients are described by sector and country only. No client names and no brand-like pseudonyms (the old OrbitX/Velora style pages are retired and redirect to `/work`).
5. Past brands (Meesho, Siemens, Shopsy, Pentagram, AKQA, Clay, Rob Dial, Feesto) appear only under "Brands our team has contributed to, with partner agencies", never as "Our clients".
6. Approved numbers only: 380+ projects since July 2024, 89+ brands, 100% of clients through referral. Founder's 640+ projects belong in her bio only.
7. Titles: Ashmita Mishra, Founder & CEO; Shivani Tripathi, Chief Technology Officer. Never "Partner", "Director" or "Managing".
8. The Strategist / Builder / Executor labels are internal only. Services use plain names.
9. Retired, never use: "Strategy · Technology · Growth".
10. Everything public is approved by Ashmita or Shivani before it goes out.

## Brand

- Descriptor: Marketing & Digital Consultancy. Tagline: We diagnose before we prescribe.
- Instrument Sans only (600 headings, 400 body, 500 caps labels). Sentence-case headings, at most one gold word per heading.
- Colours: Black #0A0A0A, Ivory #F4F1EA, Gold #C4992A (on dark only), Gold Deep #9C7A1E (gold on light), Charcoal #161616, Stone #A8A49C, Warm Grey #5C5850, Line #262626. No gradients, no gold body text.
- Logos come only from `assets/brand/` (copied byte-for-byte from StartBox_Brand_Kit). Never retype or redraw the wordmark. Primary logo min width 140 px.
- Voice: direct, specific, plain words. No exclamation marks, hype words or emoji.

## Prices (client-facing)

Discovery call + one-page summary free · Business audit ₹8,000 (48 h, adjusted in first month of a monthly plan) · One-time projects from ₹35,000 to ₹5,00,000+ · Monthly plans from ₹35,000/month · StartBox for MSME from ₹15,000.

## Contact

WhatsApp/phone +91 96964 39231 · team@startboxmarketing.com · LinkedIn: linkedin.com/company/startbox-ventures-marketing-and-consultancy/

## Domain

Canonical URLs, `sitemap.xml`, `robots.txt` and the OG image use `https://www.startboxmarketing.com`. When startboxventures.com goes live, replace the domain everywhere in one pass and keep the old domain redirecting.

## Adding pages

Every new page needs a unique `<title>` and meta description, a canonical link, Open Graph tags, JSON-LD (Organization plus the page type), a breadcrumb, and an entry in `sitemap.xml`. Insights articles live in `insights/<slug>.html` and link to at least one service page and the audit.
