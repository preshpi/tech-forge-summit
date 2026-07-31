export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      {/* warm key light, upper right — stands in for a stage spotlight */}
      <div className="absolute -top-24 right-[-10%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(198,255,61,0.16),transparent_70%)]" />
      {/* cool fill light, left */}
      <div className="absolute top-1/3 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(185,140,255,0.12),transparent_70%)]" />

      {/* abstract crowd — rows of soft dots receding into the dark, evokes an
          auditorium without depicting real people */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1600 900"
        aria-hidden="true"
      >
        {Array.from({ length: 7 }).map((_, row) => {
          const y = 620 + row * 34;
          const scale = 1 - row * 0.045;
          const count = 34;
          return (
            <g key={row} opacity={0.5 - row * 0.05}>
              {Array.from({ length: count }).map((_, i) => {
                const x = 40 + i * (1520 / count) + (row % 2 === 0 ? 10 : -10);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={9 * scale}
                    fill="#f2f2f0"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* vignette so the headline stays legible over the crowd */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,12,0.2)_0%,rgba(10,10,12,0.55)_45%,rgba(10,10,12,0.95)_78%,#0a0a0c_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,0.55)_0%,transparent_35%,transparent_65%,rgba(10,10,12,0.4)_100%)]" />
    </div>
  );
}
