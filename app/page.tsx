import { Hero } from "@/components/hero";
import { Moon } from "@/components/moon";
import { Preloader } from "@/components/preloader";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Statement } from "@/components/statement";

export default function Home() {
  return (
    <>
      <Preloader />
      <SiteHeader />
      <main>
        <Hero />
        <Statement />
        <Moon />
      </main>
      <SiteFooter />
    </>
  );
}
