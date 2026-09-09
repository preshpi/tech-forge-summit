type UpcomingSpeakerCardProps = {
  badge?: string;
  title?: string;
  prompt?: string;
  revealText?: string;
};

export default function UpcomingSpeakerCard({
  badge = "Coming Soon",
  title = "Upcoming Speaker",
  prompt = "Who’s next?",
  revealText = "To be revealed",
}: UpcomingSpeakerCardProps) {
  return (
    <li className="speaker-card speaker-card--upcoming">
      <div className="speaker-card__media speaker-placeholder__media">
        <span className="speaker-placeholder__question" aria-hidden="true">
          ?
        </span>
        <span className="speaker-badge speaker-badge--upcoming">{badge}</span>
      </div>

      <div className="speaker-card__body">
        <h2 className="speaker-card__name">{title}</h2>
        <p className="speaker-card__role">{prompt}</p>
        <span
          className="speaker-card__rule speaker-card__rule--upcoming"
          aria-hidden="true"
        />
        <p className="speaker-card__session">{revealText}</p>
      </div>
    </li>
  );
}
