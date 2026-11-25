# Open questions and known gaps

Things to confirm with the client or finish later.

- **Contact form, second checkbox:** Figma says "I agree to receive marketing emails and newsletters from **Scale360***". This looks like a leftover from another project's template. It is kept exactly as designed for now. Ask the client: should it say **Moonstone** or **Scale360**? (`components/contact-form.tsx`)
- **Contact form delivery:** the form posts to Web3Forms. It needs a public access key in `NEXT_PUBLIC_WEB3FORMS_KEY` (see `.env.example`). Until it is set the button reads "FORM NOT CONNECTED YET".
- **Contact form, country picker:** Figma only draws a flag box and a caret next to the phone field; the dropdown (search, list of 242 countries with flag and dial code, default India) is our design. Data: `lib/countries.json`; flags come from the `flag-icons` package. Confirm the default country with the client.
- **About page team:** six cards (names and roles from the Figma frames), grey placeholder photos. With a mouse the section pins and the cards fly off to the right as you scroll (Figma alternates right/left; asked for right only on desktop). On touch the top card follows the finger and leaves in the swipe direction. Pin length (450 design px per card) and easing (`power2.out`, Figma only says ease-out 0.5 s) are tuned by eye; the last card stays. Captions of the cards below the top one are hidden because the glass is translucent.
- **Menu hover colour:** link hover is crimson, but the menu text uses a difference blend, so over white sections the red shows as teal.
- **How we work, moon constellation:** Figma defines only the 4s transitions (hover/click prototype). It runs automatically here: it wakes when scrolled into view and steps through the three captions every 3s hold + 4s turn, looping. The 3s hold is our choice, and three steps are treated as one full turn of the moon texture so the loop is seamless. Confirm the pacing with the client.
- **No placeholder pages left.** `/services` redirects to the services section on Moonstone*d, `/faq` to the FAQ on Contact.

## Olindo event (Upcoming Events + /events/olindo)
- The three dates disagree: the poster image says 14.10.2026, the Figma copy says "November 14, 2026" (shown on the site), and the District ticket link says nov12-2026. Which is right?
- The listing page "Events & IP" (Figma 185:171385) is not built; VIEW ALL goes to a placeholder /events page.

## Moonstone*d page
- The header text in Figma reads "Builty by multi hatters."; the site shows "Built by multi hatters." (likely typo). Please confirm.
- All four project folders use the same placeholder photo, as in Figma.
- The second paragraph is shown from the start (Figma hides it until hover; the client asked for it to be visible).
- Figma's "Gentle" / "Slow" / "Quick" easing curves are not readable through the API; ease-in-out approximations are used.

## Secret page `/meow` (developer)
- Not in any design: copy, cats (drawn as SVG in `components/cats.tsx`) and layout are ours, in the brand palette on the dark page. Jokes and the two links (`github.com/DevNiru2704`, `devniru.in`) are constants at the top of `components/meow-page.tsx`; the GitHub handle was taken from the repo remote, please confirm.
- Hidden: not in the menu or footer, `noindex`. Found by typing "meow" outside form fields or clicking the footer mascot 5 times within 2 s.
- `/meow` art: the five cats (warrior, witch, tank, healer, druid), the bug slime and the backdrops are original pixel art built from drawing code in `lib/sprites.ts` and `lib/scene.ts` (no copied game art). It is readable, not pro-artist polish; commissioned sprite sheets could replace `catFrame()` later. The pixel font (Silkscreen) is loaded only on this page.
- `/meow` battle: nine original bug-themed monsters (Merge Conflict, Null Pointer, 404 Bat, Memory Leak, Tech Debt, Infinite Loop and the bosses Spaghetti Hydra, Scope Creep, Friday Deploy) in `lib/enemies.ts`; names and jokes are ours. Every fourth fight is a boss.
- `/meow` sound: the battle and boss music and all effects are original synthesized chiptune (`lib/chiptune.ts`, Web Audio, no audio files, no licences), only loaded on this page, starting muted behind the SOUND button. Tuned by numbers only (no speakers here): melodies, volume and the mix may need a listen-and-adjust pass.
- After editing `app/globals.css` restart `next dev`: Turbopack can serve stale global CSS (this once left the damage numbers un-animated, so they never left).

## How we work: four stops and the progress section
- The 4th moon caption ("Local Frequencies. Global Ears.") sits top-right; it is not in Figma, only the first three positions are.
- The progress section below the moon (`components/how-progress.tsx`) has no heading, and its type sizes and spacing are not from Figma. Copy is from the client's screenshots.
- The moon lock is longer (`ORBIT_SCROLL` 3380) to fit the fourth stop.

## About: team photos and bios
- Photos are cropped to the card ratio (374:469) and saved as 748x938 webp in `public/img/team/`. The framing is my choice (e.g. Bidisha is cropped from a landscape shot); send other crops if the client prefers. Originals are in the git-ignored `source-photos/teams/`.
- Figma spells the CEO "Bidishah" (bios and card); the old code had "Bidisha". I followed Figma.
- White bio text on the lighter blue at the bottom of the gradient is low contrast (as in Figma).

## Navbar auto-hide and the pill
- The navbar hides on scroll down and returns on scroll up. With a photo hero it starts 400 design px after the logo flips to the wordmark; other pages from the start. Thresholds are my pick.
- "Let's work together" fades out when the top of a "Let's build something" box reaches it and returns when the footer comes into view or when scrolling back above the box.

## Privacy Policy and Terms of Service
- Sidebar pills use the Figma "category-button" states: Default black outline, Hover white fill, Click crimson fill with white text and no outline. Click stays on, so every section already passed stays red (as in the flow); which section counts as passed follows scroll (not in the prototype, our rule: it crosses 40% of the window height).
- Pills keep the Figma 54px height; only the 20px gap squeezes on short windows. At 900px tall the last pill sits under the fixed "Let's work together" pill, which is not in these Figma frames. Alternative: hide that pill on these two pages.
- "Media Usage" is a bullet in the Figma text; shown as a plain heading like the other sections.
- Effective date "December 06, 2026" is shown as designed; it is a future date. Confirm it.
- Footer label is "Terms of Services" (Figma footer) while the page title is "Terms of Service".
- The navbar shows the wordmark from the start (pages without a photo hero); Figma frames draw the wave logo.
- Privacy intro wraps to two lines here and three in Figma (font metrics), so the sections start about 27px higher than the frame.

## CTA box, footer and the "Let's work together" pill
- The space between the "Let's build something" box and the footer is 60 design px on every page (Figma Privacy / Terms value), set by `CTA_FOOTER_GAP` in `lib/cta.ts`. Home is the exception: Figma's moon section keeps the mountain and ground under the box (1761 design px tall), so the box sits about 358 px above the footer there. Before, About had 278, How we work 61.6, Events and Moonstone*d 59. Please confirm 60 is right for About and Home too.
- The pill fades out when half of the box (171 design px) is on screen and comes back when the footer's top reaches the middle of the window; both points were read from screenshots, so tune them (`components/chrome-behavior.tsx`) if they feel off.

## About: The Ideal / The Intent
- They now react to scroll: the block (the About copy above them too) pins (scroll-locked) for 1000 design px, The Ideal and its text fill in, hand over to The Intent and its text, then the page continues. The 1000 px and the split (about 0.3 / 1.5 / 0.3 / 0.6 of the lock) are our choice; the Figma frames only show the two end states. With reduced motion there is no pin and clicking a title shows its text, as before.
- The page below moves down by the lock (CSS var `--intent-extra`, like `--team-extra` for the deck). The white-to-dark gradient behind the titles keeps Figma's colours down to the titles, spends the lock going to the deep blue, then the dark follows as before.
- The About copy stays on screen while the titles are locked; it turns from black to white part way through the lock because the blue behind it gets darker (our choice, not in Figma). On a window shorter than the pinned box (about 610 design px) the whole block is scaled down to fit.

## FAQ (on the Contact page)
- No Figma frame: the heading ("FREQUENTLY ASKED / QUESTIONS"), 32px questions, 24px light answers and the 160 design px of space above the footer are our choices, built from the Our Services rows. Rows open on hover (and on keyboard focus, which is also what a tap does on touch) and close when the pointer leaves, like Our Services. Long answers shift the rows below while one opens; if that feels jumpy, click-to-open is the alternative.
- The Contact page no longer has the "Let's build something" box (asked for). The soft fade of the dusk into white stays.
- The last answer says "reach out via our contact page", but the FAQ now sits on that page. Keep the wording or change it to "the form above"?
- The em dashes in the supplied copy were replaced by commas or a full stop with the same meaning (vision, difference and workflow answers).
- The team answer spells "Bidishah (Bidisha Mohanta)" as supplied; the spelling question above still applies.
