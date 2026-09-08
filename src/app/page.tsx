// import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Conversations from "@/components/Conversations";
import Community from "@/components/Community";
import FinalCta from "@/components/FinalCta";
// import Sponsors from "@/components/Sponsors";
// import Hosts from "@/components/Hosts";
// import Pricing from "@/components/Pricing";
// import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Stats />
        <About />
        <Conversations />
        <Community />
        <FinalCta />
        {/* <Hosts />
        <Pricing />
        <Sponsors />
        <FAQ /> */}
      </main>
    </>
  );
}
