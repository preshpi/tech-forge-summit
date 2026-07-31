import { gradientFor, initials } from "@/lib/avatar";

export default function SponsorLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center border border-line/60"
        style={{ background: gradientFor(name) }}
      >
        <span className="font-display text-xs font-bold text-paper/70">
          {initials(name)}
        </span>
      </div>
      <span className="font-display text-xl font-semibold text-paper/30 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}
