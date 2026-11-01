// Builds lib/phone-rules.json from libphonenumber-js metadata (run: node scripts/generate-phone-rules.mjs).
// Per country (keys match lib/countries.json): l = valid national number lengths, p = pattern a valid national
// number matches, t = trunk prefix people type before it at home (e.g. the 0 in 07911 123456).
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const meta = require("libphonenumber-js/metadata.min.json");
const countries = JSON.parse(fs.readFileSync("lib/countries.json", "utf8"));

// Stricter than the library where it matters for this audience: India's metadata also allows 8 to 13 digit toll-free and
// short formats, but people filling a contact form give a 10 digit number (mobile 6-9, landline with its STD code 2-5).
const OVERRIDES = { in: { l: [10], p: "[2-9]\\d{9}" } };

const out = {};
for (const { code } of countries) {
  const m = meta.countries[code.toUpperCase()];
  if (!m) continue;
  const rule = { l: m[3], p: m[2] };
  if (m[5]) rule.t = m[5];
  out[code] = { ...rule, ...OVERRIDES[code] };
}
fs.writeFileSync("lib/phone-rules.json", "{\n" + Object.entries(out).map(([k, v]) => ` ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n") + "\n}\n");
console.log(Object.keys(out).length, "countries,", fs.statSync("lib/phone-rules.json").size, "bytes; missing:", countries.filter((c) => !out[c.code]).map((c) => c.code).join(","));
