export default function BrandStatement() {
  const values = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Lokalni sastojci',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      label: 'Transparentna formula',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      ),
      label: 'Cruelty-free',
    },
  ];

  return (
    <section className="pt-[72px] pb-[120px] md:pt-[96px] md:pb-[160px] section-padding">
      <div className="mx-auto max-w-[700px] px-6 text-center">
        <span
          data-reveal="true"
          className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-8"
        >
          Naša filozofija
        </span>

        <p
          data-reveal="true"
          data-reveal-delay="100"
          className="font-display font-[300] italic text-[clamp(28px,4vw,44px)] leading-[1.4] text-ink mb-12"
        >
          Verujemo da koža ne treba mnogo — treba joj pravo. Dva proizvoda, šest aktivnih sastojaka, nula kompromisa.
        </p>

        <div
          data-reveal="true"
          data-reveal-delay="200"
          className="w-[60px] h-[1px] bg-silver-light mx-auto mb-12"
        />

        <div
          data-reveal="true"
          data-reveal-delay="300"
          className="flex flex-wrap justify-center gap-12"
        >
          {values.map((v) => (
            <div key={v.label} className="flex items-center gap-3 text-sage-dark">
              {v.icon}
              <span className="font-body font-[300] text-[12px] uppercase tracking-[0.1em] text-silver-dark">
                {v.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
