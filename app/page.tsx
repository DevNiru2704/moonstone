import { Hero } from "@/components/hero";
import { Moon } from "@/components/moon";
import { Preloader } from "@/components/preloader";
import { Statement } from "@/components/statement";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <Statement />
        <Moon />
      </main>
    </>
  );
}
