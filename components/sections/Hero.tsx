import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-start overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/hero slika.png"
          alt=""
          fill
          className="object-cover object-[center_42%] lg:hidden"
          sizes="(max-width: 1023px) 100vw, 0px"
          priority
        />
        <Image
          src="/Gemini_Generated_Image_8bvz9n8bvz9n8bvz.webp"
          alt=""
          fill
          className="hidden lg:block object-cover object-bottom"
          sizes="(min-width: 1024px) 100vw, 0px"
          priority
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-black/10 to-black/20"
      />

      <div className="relative z-20 mx-auto w-full max-w-[1280px] px-6 pt-28 pb-20 md:pt-24 md:pb-20">
        <div className="max-w-[520px]">
          <h1
            data-reveal="true"
            className="font-display font-[500] text-[clamp(36px,5vw,56px)] leading-[1.08] text-white mb-6 [text-shadow:0_0_1px_rgba(0,0,0,0.9),0_0_18px_rgba(0,0,0,0.45),0_2px_10px_rgba(0,0,0,0.5)] [-webkit-text-stroke:0.6px_rgba(255,255,255,0.85)]"
          >
            Koži ne treba mnogo.<br />
            Treba joj ispravno.
          </h1>

          <p
            data-reveal="true"
            data-reveal-delay="100"
            className="font-body font-[400] text-[17px] leading-[1.6] text-white max-w-[420px] mb-10 drop-shadow-[0_1px_20px_rgba(0,0,0,0.5)] md:text-[16px]"
          >
            Čisti botanički sastojci, transparentna formula i pristup u kom svaki sastojak ima razlog. Bez kompromisa, bez praznih obećanja.
          </p>

          <div
            data-reveal="true"
            data-reveal-delay="200"
            className="flex flex-row gap-4"
          >
            <Link
              href="/#proizvodi"
              className="inline-flex min-w-[240px] items-center justify-center border border-[#A1A797] bg-[#A1A797] px-10 py-3.5 font-body font-[400] text-[12px] uppercase tracking-[0.14em] text-[#FBFAED] transition-colors duration-200 ease-in-out hover:bg-transparent hover:text-[#FBFAED] md:min-w-[240px] md:px-10 md:py-3.5 md:text-[12px]"
            >
              Pogledaj proizvode
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 z-20 hidden -translate-x-1/2 md:bottom-20 md:block">
        <div className="scroll-indicator h-10 w-[1px] bg-white/70" />
      </div>
    </section>
  );
}
