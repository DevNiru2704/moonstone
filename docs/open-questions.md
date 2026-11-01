# Open questions and known gaps

Things to confirm with the client or finish later.

- **Contact form, second checkbox:** Figma says "I agree to receive marketing emails and newsletters from **Scale360***". This looks like a leftover from another project's template. It is kept exactly as designed for now. Ask the client: should it say **Moonstone** or **Scale360**? (`components/contact-form.tsx`)
- **Contact form delivery:** the form posts to Web3Forms. It needs a public access key in `NEXT_PUBLIC_WEB3FORMS_KEY` (see `.env.example`). Until it is set the button reads "FORM NOT CONNECTED YET".
- **Contact form, country picker:** Figma only draws a flag box and a caret next to the phone field; the dropdown (search, list of 242 countries with flag and dial code, default India) is our design. Data: `lib/countries.json`; flags come from the `flag-icons` package. Confirm the default country with the client.
- **About page team:** photos and names are the "Full Name / Designation" placeholders from Figma.
- **Menu hover colour:** link hover is crimson, but the menu text uses a difference blend, so over white sections the red shows as teal.
- **How we work, moon constellation:** Figma defines only the 4s transitions (hover/click prototype). It runs automatically here: it wakes when scrolled into view and steps through the three captions every 3s hold + 4s turn, looping. The 3s hold is our choice, and three steps are treated as one full turn of the moon texture so the loop is seamless. Confirm the pacing with the client.
- **Pages still placeholders:** Services, Privacy Policy, Terms of Service, FAQ.
