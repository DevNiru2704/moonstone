import { Hero } from "@/components/hero";
import { Moon } from "@/components/moon";
import { Preloader } from "@/components/preloader";
import { Statement } from "@/components/statement";
import { UpcomingEvents } from "@/components/upcoming-events";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <UpcomingEvents />
        <Statement />
        <Moon />
      </main>
    </>
  );
}
