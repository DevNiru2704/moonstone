import { u } from "@/lib/lenis";

/** Stand-in for pages that are not designed yet; the navbar and footer come from the root layout. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main
      className="flex flex-col justify-end bg-white text-black"
      style={{ minHeight: "100svh", padding: `${u(180)} ${u(60)} ${u(140)}` }}
    >
      <h1 style={{ fontSize: u(120), lineHeight: 1 }}>{title}</h1>
      <p style={{ fontSize: u(24), marginTop: u(24) }}>Coming soon.</p>
    </main>
  );
}
