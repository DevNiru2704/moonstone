# Moonstone

Website for **Moonstone Multimedia LLP**, a creative and marketing agency in Kolkata / Mumbai, and **Moonstone\*d**, its marketing arm and the label side of the house (music, live events and original IPs such as East Hop). The site is built from the Moonstone Figma file with its scroll animations, a pixel-art mascot ("Multi Moo") and a hidden developer page.

> Tagline from the portfolio: *"We believe that when a brand connects with sincerity, growth doesn't need a push. It unfolds with quiet certainty."*

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) with React 19 and TypeScript. **This Next.js has breaking changes against older versions**: read the guide in `node_modules/next/dist/docs/` before changing framework-level code (see `AGENTS.md`).
- Tailwind CSS 4 (design tokens in `app/globals.css`), plus inline styles in design pixels for the Figma layouts.
- [GSAP](https://gsap.com) + ScrollTrigger for animation, [Lenis](https://lenis.darkroom.engineering) for smooth scrolling.
- `flag-icons` and `libphonenumber-js` for the contact form's country picker and phone rules.

## Getting started

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_WEB3FORMS_KEY (see "Contact form")
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack). After editing `app/globals.css`, restart it: it can serve stale global CSS. |
| `npm run build` / `npm start` | Production build and server. Test animations and layout on a production build. |
| `npm run lint` | ESLint (includes the React Compiler rules such as `react-hooks/set-state-in-effect`). |

## Pages

| Route | Status | Notes |
| --- | --- | --- |
| `/` | Built | Preloader, hero, statement, upcoming events, and the moon section with the three cards (Multimedia / Moonstone\*d / Artists, scaled to fit short windows) and the "Let's build something" box. |
| `/about` | Built | Photo-GIF hero, intent text, pinned team-card deck (swipe or scroll, click a card to jump to that person's bio), team bios. |
| `/how-we-work` | Built | Scroll-driven moon with four stops, then a zig-zag crimson progress section. |
| `/events`, `/events/olindo` | Built | Events and IP listing; upcoming-event page for Olindo. |
| `/moonstoned` | Built | Moonstone\*d header, project folder carousel, services list and CTA. |
| `/contact` | Built | Form posting to Web3Forms. |
| `/services`, `/faq` | Placeholder | "Coming soon" (`components/placeholder-page.tsx`). |
| `/privacy-policy`, `/terms-of-service` | Placeholder | Designs exist in Figma; page implementation is in progress. |
| `/meow` | Built, hidden | Developer easter egg: a chiptune RPG battle. Not in the menu or footer, `noindex`. Open it by typing "meow" outside a form field or clicking the footer mascot five times quickly. |

## How the code is organised

```
app/          routes (one folder per page) and global CSS / theme tokens
components/   page sections and site chrome (header, menu, footer, preloader, ...)
lib/          shared data and helpers (team, events, IPs, links, orbit constants, validation, chiptune, sprites)
public/img/   images, SVG logos, mascot, team photos (webp)
scripts/      generate-phone-rules.mjs
docs/         design-system screenshots, open questions, the brand portfolio PDF
```

Things that are not obvious from the file names:

- **1440px design grid.** Figma frames are 1440 wide. Positions and sizes are written in Figma pixels and scaled with `u(n)` (CSS length) and `unit()` (number) from `lib/lenis.ts`, so layouts scale with the viewport width. When Figma says `top: 2099`, write `u(2099)`.
- **Smooth scroll.** `components/smooth-scroll.tsx` starts Lenis and drives GSAP ScrollTrigger. Scroll to an element with `getLenis().scrollTo(...)`, not `scrollIntoView`.
- **Site chrome behaviour** (all in `components/`):
  - `header-logo.tsx`: on pages with a photo hero (an element marked `data-hero`) the logo flips into the wordmark once the hero has passed; other pages show the wordmark from the start.
  - `chrome-behavior.tsx`: the navbar hides on scroll down and returns on scroll up (starting a little after the flip on hero pages), and the "Let's work together" pill fades out while a "Let's build something" box (`data-cta`) is on screen.
  - Hooks used for this: `data-hero`, `data-nav`, `data-open`, `data-pill`, `data-cta`, `data-flip`.
- **Client components and constants.** A server component cannot read values exported from a `"use client"` file (they arrive as client references). Put shared constants in `lib/`.
- **Team data** lives in `lib/team.ts` (name, role, photo, bio); the About deck and bios both read it.
- **Reduced motion** is respected by the newer chrome behaviour and the CTA box; check any new animation the same way.

### Contact form

The form posts to [Web3Forms](https://web3forms.com). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WEB3FORMS_KEY` to your access key. Without it the form shows "FORM NOT CONNECTED YET".

Phone rules live in `lib/phone-rules.json` (valid lengths and number pattern per country, generated by `node scripts/generate-phone-rules.mjs` from libphonenumber-js, with a few stricter overrides such as India). The messages come from `lib/phone-validation.ts`; email checks are in `lib/email-validation.ts`.

## Brand and content

Source of truth for copy and visuals: the Figma file *Moonstone Website* and the Moonstone\*d portfolio, kept here as [`docs/moonstoned-portfolio.pdf`](docs/moonstoned-portfolio.pdf) (compressed from 8.8 MB to 5.4 MB, one long page). Colours, type scale and proportions are in `docs/design-system/`.

What the portfolio describes (context for copy and design decisions):

- **Positioning:** "Built on culture. Streaming the future." Built by "multi-hatters"; Moonstone\*d is the marketing arm of Moonstone Multimedia.
- **Eight services:** brand strategy and positioning, brand identity development, product styling and visuals, digital presence and e-commerce, social media marketing, performance marketing and ads, audience outreach, event and pop-up management.
- **Five showcased projects:** Rare by Rani (furniture, founder-led brand), Zeiss Vision Center by Disha (luxury eyewear retail), Moonstone Multimedia's music side (record label, live recordings, the East Hop IP for Bengali hip hop and R&B), Specsmart (affordable eyewear made aspirational) and Knockout Nights (Kolkata's first MMA showcase, with a tiger-scratch identity).
- **Packages:** ten marketing packages (from Brand Starter to a 360° Retainer) and three stand-alone ones (photography, videography, audio production). Pricing is in the PDF only; it is the client's, so it is not repeated in the site code or here.
- **Palette:** American Red `#B31E32` (the site's `crimson`), Warming Heart `#D4463B`, Toasted Fluff `#FFF8EB`, on near-black. Display italics for emphasis, a clean sans for body copy.
- **Mascot:** Multi Moo, a smiley that wears a hat for every mood ("Join the crew. Pick a hat. Pick a mood.").

## Open questions and known gaps

Client questions, guesses and unchecked areas are kept in [`docs/open-questions.md`](docs/open-questions.md) (contact form wording, event dates, team spelling, animation timings, and so on). Add to it when you make a call the Figma file does not settle.

## Deployment

Any Next.js host works (for example Vercel). Set `NEXT_PUBLIC_WEB3FORMS_KEY` in the host's environment variables before building, since `NEXT_PUBLIC_*` values are read at build time.
