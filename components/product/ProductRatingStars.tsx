const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

export default function ProductRatingStars() {
  return (
    <div className="mb-6 flex items-center gap-2">
      <div className="flex gap-1" role="img" aria-label="Ocena 5 od 5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#A1A797"
            aria-hidden
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </div>
      <span className="font-body font-[400] text-[13px] text-silver-dark">
        (4 recenzije korisnika)
      </span>
    </div>
  );
}
