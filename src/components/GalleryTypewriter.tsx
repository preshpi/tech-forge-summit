"use client";

const typewriterDelayMs = 180;
const typewriterStaggerMs = 45;

export default function GalleryTypewriter() {
  const headline = "The room where the future got louder.";
  const words = headline.split(" ");

  return (
    <h1
      aria-label={headline}
      className="max-w-5xl font-display  font-bold leading-[1.08] tracking-tight lg:leading-[1.2] text-[24px] lg:text-[75px]"
    >
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          const wordStartIndex = words
            .slice(0, wordIndex)
            .reduce((total, previousWord) => total + previousWord.length + 1, 0);

          return (
            <span key={`${word}-${wordIndex}`}>
              <span className="whitespace-nowrap">
              {Array.from(word).map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  className="hero-typewriter-character"
                  style={{
                    animationDelay: `${
                      typewriterDelayMs +
                      (wordStartIndex + index) * typewriterStaggerMs
                    }ms`,
                  }}
                >
                  {character}
                </span>
              ))}
              </span>
              {wordIndex < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
