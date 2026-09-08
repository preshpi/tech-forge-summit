export default function Conversations() {
  return (
    <><section
        className="topics section"
        id="programme"
        aria-labelledby="topics-heading"
      >
        <div className="container">
          <div className="topics__head js-reveal">
            <div>
              <p className="section-label">This Year’s Conversations</p>
              <h2 className="heading-lg" id="topics-heading">
                Real conversations. Real impact.
              </h2>
            </div>
            <a className="link-arrow" href="#programme">
              Explore all topics
              <span className="link-arrow__glyph" aria-hidden="true">→</span>
            </a>
          </div>

          <div className="topics__grid js-stagger js-stagger--topics">
            <article className="topic topic--blue">
              <div className="topic__copy">
                <span className="topic__num">01</span>
                <h3 className="topic__title">AI &amp; Engineering</h3>
                <p className="topic__hook">Become a better agentic engineer.</p>
              </div>
              <svg
                className="topic__art"
                viewBox="0 0 160 160"
                aria-hidden="true"
              >
                <path
                  fill="#1e4fd8"
                  d="M80 6 92 58 144 70 92 82 80 134 68 82 16 70 68 58Z"
                />
                <circle cx="80" cy="70" r="14" fill="#8fb0ff" />
                <path
                  fill="#5b86f0"
                  fillOpacity={0.55}
                  d="M118 18 124 42 148 48 124 54 118 78 112 54 88 48 112 42Z"
                />
              </svg>
            </article>

            <article className="topic topic--pink">
              <div className="topic__copy">
                <span className="topic__num">02</span>
                <h3 className="topic__title">Product &amp; Design</h3>
                <p className="topic__hook">Build products people actually need.</p>
              </div>
              <svg
                className="topic__art"
                viewBox="0 0 160 160"
                aria-hidden="true"
              >
                <path
                  fill="#e83a5c"
                  d="M28 118 80 22l52 96H28Z"
                />
                <path fill="#ff7a93" d="M58 106h44L80 62Z" />
                <rect x="72" y="106" width="16" height="32" rx="4" fill="#c42245" />
                <path
                  fill="#e83a5c"
                  d="M112 28c8-18 28-18 36 0-8 4-14 10-18 18-4-8-10-14-18-18Z"
                  fillOpacity={0.7}
                />
              </svg>
            </article>

            <article className="topic topic--yellow">
              <div className="topic__copy">
                <span className="topic__num">03</span>
                <h3 className="topic__title">Career &amp; Growth</h3>
                <p className="topic__hook">Build a tech career that lasts.</p>
              </div>
              <svg
                className="topic__art"
                viewBox="0 0 160 160"
                aria-hidden="true"
              >
                <rect x="16" y="108" width="40" height="34" rx="6" fill="#f5c518" />
                <rect x="56" y="76" width="40" height="66" rx="6" fill="#ffe07a" />
                <rect x="96" y="42" width="40" height="100" rx="6" fill="#f5c518" />
                <path
                  d="M28 96h16M68 64h16M108 30h16"
                  stroke="#0b1220"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeOpacity={0.15}
                />
              </svg>
            </article>

            <article className="topic topic--navy">
              <div className="topic__copy">
                <span className="topic__num">04</span>
                <h3 className="topic__title">Building Companies</h3>
                <p className="topic__hook">Turn ideas into real businesses.</p>
              </div>
              <svg
                className="topic__art"
                viewBox="0 0 160 160"
                aria-hidden="true"
              >
                <rect x="22" y="62" width="52" height="52" rx="8" fill="#1e4fd8" />
                <rect x="62" y="28" width="52" height="52" rx="8" fill="#5b86f0" />
                <rect x="78" y="78" width="52" height="52" rx="8" fill="#153bb0" />
                <rect x="40" y="78" width="18" height="18" rx="3" fill="#8fb0ff" fillOpacity={0.7} />
              </svg>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}