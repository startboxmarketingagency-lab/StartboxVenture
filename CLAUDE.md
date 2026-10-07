# StartBox Ventures website: rules

Static site deployed on Vercel (`cleanUrls`, see `vercel.json`). Pages are plain HTML sharing `assets/css/site.css` and `assets/js/site.js`. There is no server code and no paid API: the AI Brand Diagnosis tool was removed for cost and `/brand-diagnosis` redirects to `/business-audit`. Do not add paid API features without approval.

## Non-negotiable content rules

1. **Company location is India.** Every page, schema block, footer and meta tag must give the location as India (schema may add `addressRegion: Gujarat`). Never show a city (no "Vapi") and never imply the company is based anywhere else.
   - India is the company's base, not its market limit. Do not put "India" in page titles, H1s, service names or article titles as a keyword (no "Branding services in India"). Say "based in India, working with businesses in 10+ countries"; schema `areaServed` is `Worldwide`.
   - No city or region landing pages: StartBox is positioned as a global company. Where clients are (founder-confirmed, October 2026): India, United Kingdom, United States, United Arab Emirates, Israel, Canada, Netherlands, Italy, Spain, Japan. These live in `COUNTRIES` in the generator and feed the home page, schema `areaServed` and `llms.txt`. Do not list client cities anywhere; countries are enough (founder decision, October 2026).
2. Never publish StartBox revenue figures, and never publish anything that reveals the founder's age.
3. Never invent proof: no made-up results, testimonials, client names or numbers. Missing proof stays out until there is a real line ("needed X, we did Y, result Z").
4. Clients are described by sector and country only. No client names and no brand-like pseudonyms (the old OrbitX/Velora style pages are retired and redirect to `/work`).
5. Brand names shown: only Meesho, Feesto and AKQA, under "Brands our team has contributed to, with partner agencies", never as "Our clients". All other past brands (including Siemens and Rob Dial) stay private and are not shown anywhere.
6. Approved numbers only: 380+ projects since July 2024, 89+ brands, 10+ countries (founder-approved October 2026). Work page: three client cases plus ten strategy studies, one per client country, each labelled "Strategy study" and ending with "If we were hired"; studies are never presented as client results. Do not use "100% referral" as a stat, and do not claim StartBox has never run ads. Say work has come through referrals and direct outreach. Founder's 640+ projects belong in her bio only.
7. Titles (founder-confirmed October 2026): Ashmita Mishra, "Founder, CEO & Chief Strategy Officer"; Shivani Tripathi, "COO & Chief Technology Officer". Spell out Chief Strategy Officer on the page (CSO alone is ambiguous); schema `jobTitle` uses the full forms; short forms (CEO & CSO, COO & CTO) only where space is tight, such as meta descriptions. Never "Partner", "Director" or "Managing".
8. The Strategist / Builder / Executor labels are internal only. Services use plain names.
9. Retired, never use: "Strategy · Technology · Growth".
10. Everything public is approved by Ashmita or Shivani before it goes out.

## Brand

- Descriptor: Marketing & Digital Consultancy. Tagline: We diagnose before we prescribe.
- Instrument Sans only (600 headings, 400 body, 500 caps labels). Sentence-case headings, at most one gold word per heading.
- Colours: Black #0A0A0A, Ivory #F4F1EA, Gold #C4992A (on dark only), Gold Deep #9C7A1E (gold on light), Charcoal #161616, Stone #A8A49C, Warm Grey #5C5850, Line #262626. No gradients, no gold body text.
- Light and glass (approved by the founder, October 2026): gold may appear as *light* (the live shader backgrounds, soft glow orbs, hover halos, spotlight on cards) and dark glass surfaces may use backdrop blur. Never as a gradient fill on text, logos or buttons, never rainbow or extra colours, and glass text must stay at WCAG AA contrast.
- Logos come only from `assets/brand/` (copied byte-for-byte from StartBox_Brand_Kit). Never retype or redraw the wordmark. Primary logo min width 140 px.
- Voice: direct, specific, plain words. No exclamation marks, hype words or emoji.

## Prices (client-facing)

Discovery call + one-page summary free · Business audit ₹8,000 (48 h, adjusted in first month of a monthly plan) · One-time projects from ₹35,000 to ₹5,00,000+ · Monthly plans (retainers) from ₹35,000 up to ₹2,00,000+/month · StartBox for MSME is priced separately, from ₹15,000, and lives on `/msme`.

## Contact

WhatsApp/phone +91 96964 39231 · team@startboxmarketing.com · LinkedIn: linkedin.com/company/startbox-ventures-marketing-and-consultancy/

## Domain

Canonical URLs, `sitemap.xml`, `robots.txt` and the OG image use `https://www.startboxmarketing.com`. When startboxventures.com goes live, replace the domain everywhere in one pass and keep the old domain redirecting.

## Adding pages

Every new page needs a unique `<title>` and meta description, a canonical link, Open Graph tags, JSON-LD (Organization plus the page type), a breadcrumb, and an entry in `sitemap.xml`. Insights articles live in `insights/<slug>.html` and link to at least one service page and the audit. Articles about current events must cite verifiable sources in a Sources list and must not state a figure that is not in those sources. Only cover events that concern our sector and knowledge (marketing, branding, digital, AI for business, consumer and D2C brands, search and social platforms); skip unrelated news such as stock-market or general tech deals.

## Motion system

- Libraries are self-hosted in `assets/vendor/`: GSAP 3.15 (with ScrollTrigger, SplitText, Flip; free for commercial use since April 2025) and Lenis 1.3 for smooth scrolling. Do not load them from third-party CDNs.
- `assets/js/site.js` adds `.motion` to `<html>` only when the libraries load and the visitor has not asked for reduced motion. Every hidden-before-animate style must be scoped under `.motion` so the page is readable without JavaScript.
- Signature moments: first-visit preloader that draws the open box and drops the gold square (once per session), masked line reveals on headings, the pinned horizontal "Sound familiar?" section, the sticky process counter, scroll-reactive marquee, service rows that fill on hover, magnetic buttons, gold-square cursor on fine pointers, cross-page View Transitions.
- The header is static: fixed at the top, never hides on scroll and does not animate during page transitions (founder decision, October 2026).
- One owner per property: an element is animated either by a GSAP tween or by the `[data-reveal]` CSS transition, never both.
- `assets/js/glow.js` renders the live "liquid gold" WebGL background (`canvas[data-shader]`) in the home hero and every closing call to action. It runs at reduced resolution, pauses off screen, draws one still frame for reduced motion and falls back to a CSS glow without WebGL. Use it instead of background video files.

## Layout

- Premium means space: generous section padding, one idea per section, cards separated rather than packed. Before adding a section to the home page, remove or merge one.
- No bullet marks, dots or squares before section labels or titles.

## Search and AI visibility

- `robots.txt` explicitly allows search and AI answer crawlers (OAI-SearchBot, ChatGPT-User, GPTBot, Claude-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others). `llms.txt` is generated with the site from the same data.
- Founder story page is on hold by the founder's decision (October 2026).
