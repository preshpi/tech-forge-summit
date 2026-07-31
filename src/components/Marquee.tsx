const words = ["Founders", "Engineers", "Researchers", "Operators", "Investors"];

export default function Marquee() {
  return (
    <div className="font-display leading-[0.92]">
      <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight text-paper">
        NOVA AI Summit
      </h1>
      <div className="mt-1 flex flex-wrap items-center gap-3 sm:gap-4 text-[9vw] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-paper">
        <span>for all the</span>
        <div className="relative overflow-hidden max-w-full">
          <div className="flex gap-4 sm:gap-6 whitespace-nowrap animate-marquee">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="text-signal">
                {w}
                {i < words.length * 2 - 1 && <span className="text-paper/20 ml-4 sm:ml-6">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
