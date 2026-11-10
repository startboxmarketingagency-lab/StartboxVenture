# StartBox Ventures website: rules

Static site deployed on Vercel (`cleanUrls`, see `vercel.json`). Pages are plain HTML sharing `assets/css/site.css` and `assets/js/site.js`. There is no server code and no paid API: the AI Brand Diagnosis tool was removed for cost and `/brand-diagnosis` redirects to `/how-we-work#diagnosis`. Do not add paid API features without approval.

The HTML files are the source. Earlier rules mentioned a Python generator; it was never committed to this repo and is not available, so edit the HTML directly and keep shared blocks (header, footer, Organization schema, product cards) identical across pages.

## Non-negotiable content rules

1. **Company location is India.** Every page, schema block, footer and meta tag must give the location as India (schema may add `addressRegion: Gujarat`). Never show a city (no "Vapi") and never imply the company is based anywhere else.
   - India is the company's base, not its market limit. Do not put "India" in page titles, H1s, service names or article titles as a keyword (no "Branding services in India"). Say "based in India, working with businesses in 10+ countries"; schema `areaServed` is `Worldwide`.
   - Exception (founder decision, October 2026): `/msme` names the states it serves, Gujarat and Maharashtra (visible copy, meta description and its Service schema `areaServed`). No other page names a state or city, and `llms.txt` says "based in India" only.
   - No city or region landing pages: StartBox is positioned as a global company. Where clients are (founder-confirmed, October 2026): India, United Kingdom, United States, United Arab Emirates, Israel, Canada, Netherlands, Italy, Spain, Japan. They appear in schema `areaServed` (every page), `llms.txt`, `/about`, `/work` and `/meet`. Do not list client cities anywhere; countries are enough (founder decision, October 2026).
2. Never publish StartBox revenue figures, and never publish anything that reveals the founder's age.
3. Never invent proof: no made-up results, testimonials, client names or numbers. Missing proof stays out until there is a real line ("needed X, we did Y, result Z").
4. Clients are described by sector and country only. No client names and no brand-like pseudonyms (the old OrbitX/Velora style pages are retired and redirect to `/work`).
5. Brands and agencies shown (founder decision, October 2026), as official logo files from `assets/brand/partners/` in their original colours (never redrawn or recoloured; Tata CLiQ uses its own light-background colourway, black with the red dot), always on the cream `.brands` band. Public pages (home directly under the hero, `/work`, `/about`) show two groups: "Brands our team has contributed to, with partner agencies": Meesho, Tata CLiQ, Siemens, Festo; and "Agencies we have worked with": AKQA, Pentagram. Never label any of them "Our clients". The hidden business-card page `/meet` may also show Philip Morris International and Rob Dial. Festo is spelled Festo (never "Feesto"); Rob Dial on `/meet` stays a plain word. No other past brands are shown anywhere.
6. Approved numbers only: 380+ projects since July 2024, 89+ brands, 10+ countries (founder-approved October 2026). On the home page they sit in a row inside the brands band. Work page: three client cases plus ten strategy studies, one per client country, each labelled "Strategy study" and ending with "If we were hired"; studies are never presented as client results. Do not use "100% referral" as a stat, and do not claim StartBox has never run ads. Say work has come through referrals and direct outreach. Founder's 640+ projects belong in her bio only.
7. Titles (founder-confirmed October 2026): Ashmita Mishra, "Founder, CEO & Chief Strategy Officer"; Shivani Tripathi, "COO & Chief Technology Officer". Spell out Chief Strategy Officer on the page (CSO alone is ambiguous); schema `jobTitle` uses the full forms; short forms (CEO & CSO, COO & CTO) only where space is tight, such as meta descriptions. Never "Partner", "Director" or "Managing".
8. The Strategist / Builder / Executor labels are internal only. Services use plain names.
9. Retired, never use: "Strategy · Technology · Growth".
10. Everything public is approved by Ashmita or Shivani before it goes out.

## Brand

- Descriptor: Marketing & Digital Consultancy. Tagline: We diagnose before we prescribe.
- Type (founder decision, November 2026): Instrument Sans for text and UI, condensed (wdth 75, weight 700, capitals) for display; Instrument Serif italic as the contrasting voice inside display headlines (the amber phrase). Display headlines run large (hero up to 148 px), line height about 0.86, slight negative tracking. Body stays Instrument Sans 400.
- Colours (brand palette v2, founder decision November 2026; black stays the majority, amber is the main light colour): Black #1A1A1F, Cream #F0D9B5 (light text and light surfaces, replaces ivory), Amber #F4A62A (main accent, on dark only), Amber Deep #8A5308 (amber on light), Indigo #2D2B55, Violet #6A5ACD, Lilac #A678B9. Supporting tones: Charcoal #222126, Stone #B0A088, Warm Grey #655D54, Line #2C2A3A. CSS keeps the old variable names (`--ivory` holds cream, `--gold` holds amber). Black leads every page; violet and indigo are accents and depth only, never text on black and never large flat fills; lilac only for small labels. No gradients on text, logos or buttons, no amber body text.
- Dummy photos (`.ph`, labelled "Dummy photo") are for preview review only and never go live; never publish an AI-made or stock image as a team member, client or result.
- Light and glass (approved by the founder, October 2026): gold may appear as *light* (the live shader backgrounds, soft glow orbs, hover halos, spotlight on cards) and dark glass surfaces may use backdrop blur. Violet and indigo may appear only as faint light and depth (the moving background, the AI chapter, the iceberg's water), never as a page or band fill. Never as a gradient fill on text, logos or buttons, never rainbow or colours outside the palette, and glass text must stay at WCAG AA contrast.
- Home hero (founder decision, November 2026): the chaos-to-alignment sequence (`assets/js/align.js`). H1 "Your business looks different everywhere." over a clearly labelled sample business ("Kaveri Foods", captioned "Illustration · a sample business") shown on six platforms in clashing fonts and colours; on scroll Penny's labelled cursor drops four diagnosis pins, then every platform straightens into one grid and one voice in StartBox's own palette while the headline changes to "One business. One story. Everywhere." The 28 October line "We're the marketing brain for growing businesses: we diagnose what's broken, plan the fix, and get it done." is the lead under the headline. Colour carries meaning here: clashing colours mean chaos, black/cream/amber mean fixed.
- Material: a fine animated film grain over every page (`body::before`), and real founder photos as tilted polaroids. No glow orbs, aurora ribbons or light trails.
- Homepage order (Ashmita, 28 October 2026, replaces the earlier order): hero (chaos to alignment), brands band (cream, angled top edge, with the numbers row), free diagnosis, the five products, how we work (diagnose, plan, execute), StartBox for MSME on the amber band with black text, closing call to action. The AI chapter, recent work and insights are off the home page; `/work`, `/insights` and `assets/js/ai3d.js` stay. If the AI chapter returns anywhere, show AI as useful plumbing, never hype (no brains, robots or neural-net clichés).
- Look and feel (founder reference, October 2026): a dark page whose only coloured blocks are the cream brands band and the amber MSME band, the living background on every page, the chaos-to-alignment hero on the home page and one soft amber aura at the top centre of every other hero and inside the closing call-to-action card, centred hero text with a calm type scale, thin hairline dividers, soft rounded surfaces (18 px cards, pill buttons). The reference used orange; StartBox uses its own gold.
- Logo colourway (November 2026): "VENTURES" stays a warm neutral (Stone on dark, Warm Grey on cream), not lilac.
- Logos come only from `assets/brand/` (StartBox_Brand_Kit shapes, recoloured to palette v2 in November 2026 by colour swap only). Never retype or redraw the wordmark. Primary logo min width 140 px.
- Voice: direct, specific, plain words. No exclamation marks, hype words or emoji.

## Products and prices (Ashmita, 28 October 2026; replaces the earlier price list)

There is no paid audit and no "Second Opinion" product. Never show an audit price anywhere. `/business-audit` redirects to `/how-we-work#diagnosis`, and the five old `/services/*` pages redirect to the product anchors on `/services` (their HTML files were deleted on 28 October 2026; keep the redirects).

Every engagement starts with a free diagnosis: we show you your two biggest problems in the first call (30–40 minutes, with a one-page note afterwards). How we work is three steps: Diagnose (free), Plan (scope and price agreed in writing), Execute.

Five products, each card showing who it's for, its line, the starting price and the CTA "Book a free diagnosis" (all buttons say "Book a free diagnosis", founder decision November 2026) (WhatsApp, prefilled with the product name). Anchors on `/services` are in brackets.

1. Digital Presence Setup, the flagship and always the visually largest card (`#digital-presence`). For existing businesses that look scattered online. "We set up your business online so customers find you, trust you, and buy, without you wasting money on random fixes." From ₹45,000. Outcome: one consistent story, colour, font, price and positioning on every platform, so customers, Google and AI tools describe the business the same way.
2. Go-to-market Strategy (`#go-to-market`). For founders with an idea, not launched yet. "You have the idea. We give you the step-by-step plan to launch it and start selling." From ₹55,000.
3. Personal Branding (`#personal-branding`). For B2B founders, founders becoming coaches or speakers, and coaches. "Your name should open doors before your pitch does. We build the personal brand that makes people trust you first." From ₹40,000.
4. Campaign Manager (`#campaign-manager`). For one sale, offer or launch. "One campaign, planned and managed end to end." From ₹40,000.
5. Marketing Partner, always shown last, framed "For clients who've worked with us" (`#marketing-partner`). "Every marketing decision runs through us before money is spent." On request.

StartBox for MSME is separate, in a plainer tone, on `/msme` and the home gold band: "We help businesses grow online by telling them exactly what to fix, and then fixing it." Services: Monthly handling, Website, Copywriting, Content strategy, Video editing, Videography. CTA "Get a quote" (WhatsApp) shown with "from ₹15,000".

Organization schema `priceRange` is "₹15,000+" on every page.

## Contact

WhatsApp/phone +91 96964 39231 · team@startboxventures.in · LinkedIn: linkedin.com/company/startbox-ventures-marketing-and-consultancy/

## Domain

Canonical URLs, `sitemap.xml`, `robots.txt` and the OG image use `https://startboxventures.in` (no www: the live site redirects www to the bare domain, October 2026). When startboxventures.com goes live, replace the domain everywhere in one pass and keep the old domain redirecting.

The old domain startboxmarketing.com has been dropped (founder decision, October 2026). Never link to it or use an @startboxmarketing.com address; the business email is team@startboxventures.in.

## Business-card page

`/meet` is the landing page behind the QR code on visiting cards. It is never linked from any page, is left out of `sitemap.xml` and `llms.txt`, and is `noindex` (meta tag plus `X-Robots-Tag` in `vercel.json`). It has its own minimal header and footer and offers `assets/startbox-ventures.vcf` so visitors can save the contact. Its URL is printed on cards, so never rename or remove it; if the domain changes, the old domain must keep redirecting `/meet`.

## Collaboration intake page

`/collaborate` is the unlisted intake form we send to people who propose a collaboration. It is never linked from any page, is left out of `sitemap.xml` and `llms.txt`, and is `noindex` (meta tag plus `X-Robots-Tag` in `vercel.json`). It has the same minimal header and footer as `/meet`. Answers are emailed to team@startboxventures.in through FormSubmit (free, no account, no server code); nothing is stored on the site. The link is sent only when Ashmita or Shivani says so. Never rename or remove the URL once it has been shared.

## Contact buttons

Every page has two fixed buttons at the bottom right: Email (`mailto:`) directly above WhatsApp.

## Adding pages

Every new page needs a unique `<title>` and meta description, a canonical link, Open Graph tags, JSON-LD (Organization plus the page type), a breadcrumb, and an entry in `sitemap.xml`. Insights articles live in `insights/<slug>.html` and link to at least one product on `/services` and to the free diagnosis (`/contact`). Articles about current events must cite verifiable sources in a Sources list and must not state a figure that is not in those sources. Only cover events that concern our sector and knowledge (marketing, branding, digital, AI for business, consumer and D2C brands, search and social platforms); skip unrelated news such as stock-market or general tech deals.

## Motion system

- Libraries are self-hosted in `assets/vendor/`: GSAP 3.15 (with ScrollTrigger, SplitText, Flip; free for commercial use since April 2025) and Lenis 1.3 for smooth scrolling; Three.js 0.169 in `assets/vendor/three/` (MIT, with its LICENSE) for the home page's 3D only: the diagnosis objects (and the AI chapter if it returns). Do not load them from third-party CDNs.
- AI chapter (`assets/js/ai3d.js`, ES module; not on any page since 28 October 2026, kept for reuse): site.js pins `.ai-stage` for 320% of the viewport and writes scroll progress to `window.__ai.p`; ai3d.js loads Three.js only when the section is near, renders only while visible, caps pixel ratio, draws one still final frame for reduced motion, and adds `.no-gl` (a CSS glow) when WebGL is unavailable. Beat text is real HTML, so the story reads without the 3D.
- `assets/js/objects3d.js` (lens, iceberg, funnel) is retired from the home page (founder decision, November 2026: stock metaphors read as AI-made); keep the file only for reference.
- Living background (`assets/js/field.js`, founder decision November 2026): every page has one fixed low-resolution WebGL canvas with a single soft warm light drifting slowly over near-black, plus the film grain. `html` is always black underneath, so the page never turns pale if WebGL fails.
- Penny appears only as the labelled cursor ("Penny · AI host") in the hero sequence; she is never the hero object and there are no per-section Penny lines.
- `assets/js/site.js` adds `.motion` to `<html>` only when the libraries load and the visitor has not asked for reduced motion. Every hidden-before-animate style must be scoped under `.motion` so the page is readable without JavaScript.
- Every stylesheet and script link carries a content-hash `?v=` and must be bumped whenever the file changes (assets are cached for 7 days; a stale stylesheet breaks the layout for returning visitors).
- Signature moments: first-visit preloader that draws the open box and drops the gold square (once per session), masked line reveals on headings, the pinned horizontal "Sound familiar?" section, the sticky process counter, scroll-reactive marquee, service rows that fill on hover, cross-page View Transitions, the hero leaving on a slant as the brands band's angled edge flattens, and the header switching to light glass over the brands band. Motion stays calm: fade up, never bounce. The gold-square cursor and magnetic buttons are retired (founder decision, October 2026).
- The header is static: fixed at the top, never hides on scroll and does not animate during page transitions (founder decision, October 2026).
- One owner per property: an element is animated either by a GSAP tween or by the `[data-reveal]` CSS transition, never both.
- `assets/js/glow.js` renders the live gold "aura" WebGL background (`canvas[data-shader]`) in every hero and inside every closing call-to-action card. It runs at reduced resolution, pauses off screen, draws one still frame for reduced motion and falls back to a CSS glow without WebGL. Use it instead of background video files. The design reference notes live in Ashmita's private skill human-grade-web-design; read it before any design work.

## Layout

- Premium means space: generous section padding, one idea per section, cards separated rather than packed. Before adding a section to the home page, remove or merge one.
- No bullet marks, dots or squares before section labels or titles.

## Search and AI visibility

- `robots.txt` explicitly allows search and AI answer crawlers (OAI-SearchBot, ChatGPT-User, GPTBot, Claude-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others). `llms.txt` is generated with the site from the same data.
- Founder story page is on hold by the founder's decision (October 2026).
