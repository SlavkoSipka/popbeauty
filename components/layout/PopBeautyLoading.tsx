'use client';

/**
 * Pastelno učitavanje u duhu brenda — optimizovano za manje ekrane (puna širina, dovoljna visina).
 */
export default function PopBeautyLoading({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const isCompact = variant === 'compact';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={
        isCompact
          ? 'flex flex-col items-center justify-center py-16 px-6 bg-off-white/50'
          : 'flex flex-col items-center justify-center px-6 py-10 min-h-[min(85dvh,calc(100dvh-5rem))] sm:min-h-[60vh] bg-gradient-to-b from-white via-sage-pale/35 to-off-white'
      }
    >
      <div className="w-full max-w-[280px] mx-auto flex flex-col items-center gap-8 sm:gap-10">
        <p className="font-display font-[300] italic text-[clamp(22px,5vw,28px)] text-ink/85 tracking-wide text-center">
          Pop Beauty
        </p>

        <div className="flex items-end justify-center gap-2 sm:gap-2.5 h-14 w-full max-w-[200px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="popbeauty-load-bar flex-1 max-w-[14px] min-h-[8px] origin-bottom bg-gradient-to-t from-sage-mid/90 to-sage-light/70"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>

        <p className="font-body font-[300] text-[11px] uppercase tracking-[0.22em] text-silver-mid text-center">
          Učitavanje
        </p>
      </div>
    </div>
  );
}
