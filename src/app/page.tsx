import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Audience from "@/components/Audience";
import Speakers from "@/components/Speakers";
import Agenda from "@/components/Agenda";
import Sponsors from "@/components/Sponsors";
import Hosts from "@/components/Hosts";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Stats />
        <Audience />
        <Speakers />
        <Agenda />
        <Hosts />
        <Pricing />
        <Sponsors />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
