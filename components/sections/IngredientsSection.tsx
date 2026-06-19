export default function IngredientsSection() {
  return (
    <section className="relative overflow-hidden bg-[#A1A797] py-[84px] section-padding">
      {/* Dekorativni vizual — list/grančica */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[280px] text-[#FBFAED]/10 md:-right-4 md:h-[320px] md:w-[320px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>

      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="max-w-[560px]">
          <span
            data-reveal="true"
            className="mb-6 inline-flex items-center gap-2 font-body font-[400] text-[12px] uppercase tracking-[0.18em] text-[#FBFAED]/90"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6" />
            </svg>
            Prirodni sastojci
          </span>

          <h2
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[500] text-[clamp(34px,4.5vw,40px)] leading-[1.15] text-[#FBFAED] mb-6"
          >
            Svaka kap ima razlog
          </h2>
          <p
            data-reveal="true"
            data-reveal-delay="200"
            className="font-body font-[400] text-[16px] leading-[1.7] text-[#FBFAED] max-w-[460px] md:text-[16px]"
          >
            Ne biramo sastojke po trendovima. Svaki aktivni sastojak u našim formulama
            je tu jer ima dokazano djelovanje, čist izvor i specifičnu ulogu u
            zdravlju vaše kože.
          </p>
        </div>
      </div>
    </section>
  );
}
