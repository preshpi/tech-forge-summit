import SponsorLogo from "./SponsorLogo";

const sponsors = [
  "Lumen AI", "Quantum Solutions", "Neural Dynamics", "Insight Analytics",
  "TechSphere", "FutureTech Labs", "BioTech Innovations", "AI Frontier",
  "Smart Systems", "Cloud Intelligence",
];

export default function Sponsors() {
  return (
    <section className="border-y border-line py-16 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-paper/40 text-center">
          Backed by teams building the stack
        </p>
      </div>
      <div className="flex gap-16 whitespace-nowrap animate-marquee-reverse">
        {[...sponsors, ...sponsors].map((s, i) => (
          <SponsorLogo key={i} name={s} />
        ))}
      </div>
    </section>
  );
}
