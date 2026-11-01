import rules from "@/lib/phone-rules.json";

type Rule = { l: number[]; p: string; t?: string };
type Country = { code: string; name: string; dial: string };

// Things people commonly get wrong in a few big markets (the rules file only knows lengths and patterns)
const HINTS: Record<string, string> = {
  in: "Mobile numbers start with 6, 7, 8 or 9.",
  us: "Area codes can't start with 0 or 1.",
  ca: "Area codes can't start with 0 or 1.",
  gb: "UK mobile numbers start with 7 (07…); landlines start with 1 or 2.",
  au: "Mobile numbers start with 4 (04…).",
  ae: "Mobile numbers start with 5 (05…).",
  sg: "Singapore numbers start with 3, 6, 8 or 9.",
};

const plural = (n: number) => `${n} digit${n === 1 ? "" : "s"}`;

function describe(lengths: number[]) {
  const ls = [...lengths].sort((a, b) => a - b);
  if (ls.length === 1) return plural(ls[0]);
  const range = ls.every((n, i) => i === 0 || n === ls[i - 1] + 1);
  if (range) return `${ls[0]} to ${ls[ls.length - 1]} digits`;
  return `${ls.slice(0, -1).join(", ")} or ${ls[ls.length - 1]} digits`;
}

/**
 * Checks a phone number against the selected country's rules (lib/phone-rules.json: valid lengths and number
 * pattern per country). Empty is fine (the field is optional). Returns a specific message or null.
 */
export function validatePhone(raw: string, country: Country): string | null {
  const rule = (rules as Record<string, Rule>)[country.code];
  let v = raw.trim();
  if (!v) return null;
  if (!/^\+?[\d\s\-.()]+$/.test(v)) return "Use digits only; spaces, dashes and brackets are fine.";

  const code = country.dial.slice(1);
  const intl = v.startsWith("+") || (v.replace(/\D/g, "").startsWith("00" + code) && v.replace(/\D/g, "").length > 2 + code.length);
  if (intl) {
    const digits = v.replace(/\D/g, "").replace(/^00/, "");
    if (!digits.startsWith(code))
      return `That number starts with another country's code. ${country.name} is ${country.dial}: pick the right country with the flag, or remove the code.`;
    v = digits.slice(code.length);
  }

  let n = v.replace(/\D/g, "");
  if (!n) return "Enter your phone number after the country code.";
  if (!rule) return n.length >= 6 && n.length <= 15 ? null : "Phone numbers have between 6 and 15 digits.";

  // the 0 (or other prefix) you dial at home isn't part of the number: 07911 123456 -> 7911 123456
  if (rule.t && n.startsWith(rule.t) && (!rule.l.includes(n.length) || rule.l.includes(n.length - rule.t.length))) n = n.slice(rule.t.length);

  if (!rule.l.includes(n.length)) {
    const min = Math.min(...rule.l);
    const max = Math.max(...rule.l);
    const need = `${country.name} numbers have ${describe(rule.l)}`;
    if (n.length < min) return `Too short: ${need}, you entered ${n.length}.`;
    if (n.length > max) return `Too long: ${need}, you entered ${n.length}.`;
    return `${need}; ${n.length} isn't one of them.`;
  }
  if (/^(\d)\1+$/.test(n)) return "That number looks made up: every digit is the same.";
  if (!new RegExp(`^(?:${rule.p})$`).test(n)) return `That doesn't look like a valid ${country.name} number. ${HINTS[country.code] ?? "Check the first digits."}`;
  return null;
}
