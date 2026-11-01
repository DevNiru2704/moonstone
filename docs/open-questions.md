# Open questions and known gaps

Things to confirm with the client or finish later.

- **Contact form, second checkbox:** Figma says "I agree to receive marketing emails and newsletters from **Scale360***". This looks like a leftover from another project's template. It is kept exactly as designed for now. Ask the client: should it say **Moonstone** or **Scale360**? (`components/contact-form.tsx`)
- **Contact form delivery:** the form posts to Web3Forms. It needs a public access key in `NEXT_PUBLIC_WEB3FORMS_KEY` (see `.env.example`). Until it is set the button reads "FORM NOT CONNECTED YET".
- **Contact form, country picker:** Figma only draws a flag box and a caret next to the phone field. It is visual only for now (no country list or flags were designed).
- **About page team:** photos and names are the "Full Name / Designation" placeholders from Figma.
- **Menu hover colour:** link hover is crimson, but the menu text uses a difference blend, so over white sections the red shows as teal.
- **Pages still placeholders:** How we work, Services, Privacy Policy, Terms of Service, FAQ.
