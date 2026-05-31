export default function BrandStatement() {
  return (
    <section className="pt-[72px] pb-[120px] md:pt-[96px] md:pb-[160px] section-padding">
      <div className="mx-auto max-w-[680px] px-6 text-left">
        <span
          data-reveal="true"
          className="block font-body font-[400] text-[15px] uppercase tracking-[0.2em] text-silver-dark mb-8 md:text-[16px]"
        >
          O nama
        </span>

        <div
          data-reveal="true"
          data-reveal-delay="100"
          className="font-body font-[300] text-[16px] leading-[1.65] text-ink-soft space-y-5 md:text-[17px]"
        >
          <p>
            Zdravo, ja sam <span className="font-[500] text-ink">Teodora</span> — osnivačica Pop Beauty.
          </p>
          <p>
            Ovaj brend nije nastao iz marketinškog plana, već iz ličnog iskustva sa problematičnom kožom.
            Zajedno sa svojim tehnologom krenula sam da stvaram formule kakve sam i sama godinama tražila —
            čiste, transparentne i delotvorne.
          </p>
        </div>

        <a
          data-reveal="true"
          data-reveal-delay="200"
          href="/o-nama"
          className="mt-8 inline-flex items-center justify-center border border-[#A1A797] bg-transparent px-8 py-3 font-body font-[400] text-[12px] uppercase tracking-[0.14em] text-[#A1A797] transition-colors duration-200 ease-in-out hover:bg-[#A1A797] hover:text-[#FBFAED]"
        >
          Pročitaj više
        </a>
      </div>
    </section>
  );
}
