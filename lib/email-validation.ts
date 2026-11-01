const LOCAL_OK = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com", "iclod.com": "icloud.com", "icloud.con": "icloud.com",
};

/** Returns a message that says what is wrong with the address and how to fix it, or null when it is fine. */
export function validateEmail(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "Please enter your email address.";
  if (/\s/.test(v)) return "Remove the spaces from the email address.";
  const at = v.split("@").length - 1;
  if (at === 0) return "Add an “@”, like name@example.com.";
  if (at > 1) return "Use only one “@” in the email address.";

  const [local, domain] = v.split("@");
  if (!local) return "Add the part before the “@” (your name or username).";
  if (local.length > 64) return "The part before the “@” is too long (64 characters at most).";
  if (local.startsWith(".") || local.endsWith(".") || local.includes(".."))
    return "Before the “@”, a dot can't be first, last, or twice in a row.";
  if (!LOCAL_OK.test(local)) {
    const bad = [...local].find((c) => !LOCAL_OK.test(c));
    return `The character “${bad}” isn't allowed before the “@”.`;
  }

  if (!domain) return "Add the domain after the “@”, like example.com.";
  if (domain.length > 253) return "The domain after the “@” is too long.";
  if (!domain.includes(".")) return "The domain needs an ending after a dot, like example.com.";
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return "The domain has a stray dot; check the part after the “@”.";
  const labels = domain.split(".");
  for (const l of labels) {
    if (!/^[A-Za-z0-9-]+$/.test(l)) {
      const bad = [...l].find((c) => !/[A-Za-z0-9-]/.test(c));
      return `The character “${bad}” isn't allowed in the domain after the “@”.`;
    }
    if (l.startsWith("-") || l.endsWith("-")) return "Parts of the domain can't start or end with a hyphen.";
    if (l.length > 63) return "A part of the domain is too long.";
  }
  const tld = labels[labels.length - 1];
  if (!/^[A-Za-z]{2,}$/.test(tld)) return "The ending after the last dot should be letters, at least two (like .com or .in).";
  const fix = TYPOS[domain.toLowerCase()];
  if (fix) return `Did you mean ${local}@${fix}?`;
  return null;
}
