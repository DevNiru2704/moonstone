"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CountryPicker, DEFAULT_COUNTRY, type Country } from "@/components/country-picker";
import { validateEmail } from "@/lib/email-validation";
import { u } from "@/lib/lenis";
import { validatePhone } from "@/lib/phone-validation";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";
type Errors = Partial<Record<"first" | "email" | "phone" | "consent", string>>;

const line = "border-b border-white";
const field =
  "peer block size-full resize-none appearance-none rounded-none bg-transparent text-white caret-white outline-none placeholder-transparent";

// Positions are inside the 654 x 441 glass card (Figma Group 33, card at x 686, y 158)
function Field({
  name,
  label,
  star,
  left,
  top,
  width,
  height = 29,
  area,
  type = "text",
  indent = 0,
  required,
  error,
  autoComplete,
  onCheck,
}: {
  name: string;
  label: string;
  star?: boolean;
  left: number;
  top: number;
  width: number;
  height?: number;
  area?: boolean;
  type?: string;
  indent?: number | string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  /** called on blur with the value (to validate early) and on typing with null (to clear the message) */
  onCheck?: (value: string | null) => void;
}) {
  const Tag = area ? "textarea" : "input";
  return (
    <div className="absolute" style={{ left: u(left), top: u(top), width: u(width), height: u(height) }}>
      <Tag
        name={name}
        id={`f-${name}`}
        placeholder=" "
        required={required}
        type={area ? undefined : type}
        autoComplete={autoComplete}
        spellCheck={area ? true : false}
        onBlur={onCheck && ((e) => onCheck(e.currentTarget.value))}
        onInput={onCheck && (() => onCheck(null))}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `e-${name}` : undefined}
        className={`${field} ${line}`}
        style={{ fontSize: u(16), lineHeight: u(19), paddingLeft: typeof indent === "number" ? u(indent) : indent, paddingBottom: u(area ? 0 : 9) }}
      />
      <label
        htmlFor={`f-${name}`}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-white transition-opacity duration-200 peer-[:not(:placeholder-shown)]:opacity-0"
        style={{ fontSize: u(16), lineHeight: u(19), paddingLeft: typeof indent === "number" ? u(indent) : indent }}
      >
        {label}
        {star && <span className="text-crimson">*</span>}
      </label>
      {error && (
        <p id={`e-${name}`} role="alert" className="absolute left-0 text-crimson" style={{ top: u(height + 3), fontSize: u(10) }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Check({ name, top, error, children }: { name: string; top: number; error?: string; children: React.ReactNode }) {
  return (
    <div className="absolute" style={{ left: u(35), top: u(top), width: u(560) }}>
      <label className="flex cursor-pointer items-start" style={{ gap: u(5), fontSize: u(10), lineHeight: u(12) }}>
        <input type="checkbox" name={name} className="peer sr-only" aria-invalid={error ? true : undefined} />
        {/* the 7 x 7 box; a dark dot shows when ticked */}
        <span
          aria-hidden
          className="relative mt-[3px] block shrink-0 bg-[#d9d9d9] peer-checked:after:absolute peer-checked:after:inset-[2px] peer-checked:after:bg-[#121212] peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-white"
          style={{ width: u(7), height: u(7), marginTop: u(2.5) }}
        />
        <span className="text-white">
          {children}
          {/* inline, so it follows the last line of the text instead of overlapping the next checkbox */}
          {error && (
            <span role="alert" className="text-crimson" style={{ marginLeft: u(10) }}>
              {error}
            </span>
          )}
        </span>
      </label>
    </div>
  );
}

const SUBMIT_LABEL: Record<Status, string> = {
  idle: "SEND MESSAGE",
  sending: "SENDING…",
  sent: "THANK YOU, WE’LL BE IN TOUCH",
  error: "SOMETHING WENT WRONG, TRY AGAIN",
  unconfigured: "FORM NOT CONNECTED YET",
};

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);

  // validate on blur, clear the message as soon as the person types again
  const check = (key: "email" | "phone", test: (v: string) => string | null) => (v: string | null) =>
    setErrors((e) => {
      const { [key]: _old, ...rest } = e; // eslint-disable-line @typescript-eslint/no-unused-vars
      const msg = v === null ? null : test(v);
      return msg ? { ...rest, [key]: msg } : rest;
    });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(fd.get("first_name")).trim()) next.first = "Please enter your first name.";
    const emailError = validateEmail(String(fd.get("email")));
    if (emailError) next.email = emailError;
    const phoneError = validatePhone(String(fd.get("phone") ?? ""), country);
    if (phoneError) next.phone = phoneError;
    if (!fd.get("terms")) next.consent = "Please accept to continue.";
    setErrors(next);
    if (Object.keys(next).length) {
      const order = { first: "first_name", phone: "phone", email: "email", consent: "terms" } as const;
      const firstBad = (Object.keys(order) as (keyof typeof order)[]).find((k) => next[k]);
      (form.current!.elements.namedItem(order[firstBad!]) as HTMLElement | null)?.focus();
      return;
    }
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key) {
      setStatus("unconfigured");
      return;
    }
    setStatus("sending");
    const number = String(fd.get("phone") ?? "").trim();
    fd.set("phone", number ? `${country.dial} ${number}` : "");
    fd.set("country", country.name);
    fd.append("access_key", key);
    fd.append("subject", "New message from the Moonstone website");
    fd.append("from_name", "Moonstone website");
    fd.append("name", `${fd.get("first_name")} ${fd.get("last_name") ?? ""}`.trim());
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("sent");
        form.current!.reset();
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      ref={form}
      noValidate
      onSubmit={submit}
      aria-label="Contact form"
      className="glass-rim absolute"
      style={{
        left: u(686),
        top: u(158),
        width: u(654),
        height: u(441),
        borderRadius: u(30),
        background: "rgba(242,242,242,0.2)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <fieldset disabled={status === "sending" || status === "sent"} className="contents">
        <Field name="first_name" label="First Name" star required left={35} top={35} width={284} error={errors.first} autoComplete="given-name" />
        <Field name="last_name" label="Last Name" left={340} top={35} width={279} autoComplete="family-name" />
        <Field name="organization" label="Organization" left={35} top={98} width={584} autoComplete="organization" />
        {/* the dial code sits after the flag; the label and typed number start after it */}
        <Field name="phone" label="Contact" type="tel" left={35} top={161} width={284} indent={`calc(${u(61)} + ${country.dial.length * 0.58}em)`} error={errors.phone} autoComplete="tel-national" onCheck={check("phone", (v) => validatePhone(v, country))} />
        <span aria-hidden className="pointer-events-none absolute text-white" style={{ left: u(88), top: u(161), fontSize: u(16), lineHeight: u(19) }}>
          {country.dial}
        </span>
        <CountryPicker
          value={country}
          onChange={(c) => {
            setCountry(c);
            // the rules belong to the country: re-check a number that was already typed
            const typed = (form.current?.elements.namedItem("phone") as HTMLInputElement | null)?.value ?? "";
            setErrors((e) => {
              const { phone: _old, ...rest } = e; // eslint-disable-line @typescript-eslint/no-unused-vars
              const msg = typed ? validatePhone(typed, c) : null;
              return msg ? { ...rest, phone: msg } : rest;
            });
          }}
        />
        <Field name="email" label="Email" star required type="email" left={340} top={161} width={279} error={errors.email} autoComplete="email" onCheck={check("email", validateEmail)} />
        <Field name="message" label="Message" area left={35} top={224} width={584} height={68} />

        <Check name="terms" top={309} error={errors.consent}>
          By submitting this form, you agree that the information shared will be used within the framework of our{" "}
          <Link href="/terms-of-service" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>
          <span className="text-crimson">*</span>
        </Check>
        <Check name="marketing" top={339}>
          I agree to receive marketing emails and newsletters from Moonstone
        </Check>

        {/* spam trap for Web3Forms: bots tick it, people never see it */}
        <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden className="hidden" />
      </fieldset>

      <button
        type="submit"
        disabled={status === "sending" || status === "sent"}
        aria-live="polite"
        className="absolute cursor-pointer bg-[#121212] text-white transition-colors duration-200 hover:bg-black disabled:cursor-default"
        style={{ left: u(35), top: u(369), width: u(584), height: u(39), borderRadius: u(15), fontSize: u(16) }}
      >
        {SUBMIT_LABEL[status]}
      </button>
    </form>
  );
}
