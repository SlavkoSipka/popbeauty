'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/lib/animations';

export default function ONamaPage() {
  useScrollReveal();

  return (
    <main>
      {/* Hero — na mobilnom širok band; na desktopu nizak pojas */}
      <section className="relative">
        <div className="aspect-[5/2] w-full bg-sage-light md:aspect-auto md:h-[5.5rem] lg:h-24" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(28,28,26,0.45)] to-transparent p-6 pb-5 md:items-center md:justify-start md:from-[rgba(28,28,26,0.35)] md:to-transparent md:p-6 md:py-0">
          <div className="mx-auto w-full max-w-[1280px] px-0 md:px-6">
            <h1
              data-reveal="true"
              className="font-display font-[300] text-[clamp(36px,5vw,64px)] text-white md:text-[clamp(26px,3.5vw,36px)]"
            >
              O nama
            </h1>
          </div>
        </div>
      </section>

      {/* Story sections */}
      <section className="py-[120px] section-padding">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Block 1 — Teodora's story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <span
                data-reveal="true"
                className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
              >
                Kako je sve počelo
              </span>
              <h2
                data-reveal="true"
                data-reveal-delay="100"
                className="font-display font-[300] text-[clamp(28px,4vw,40px)] leading-[1.3] text-ink mb-6"
              >
                Jer sam prvo to napravila za sebe.
              </h2>
              <p
                data-reveal="true"
                data-reveal-delay="200"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark mb-4"
              >
                Ja sam Teodora. Dok sam odrastala, moja koža je bila moj najveći neprijatelj — stalne iritacije,
                crvenilo, nesigurnost. Probala sam sve što je tržište nudilo. Ništa nije zaista pomoglo.
              </p>
              <p
                data-reveal="true"
                data-reveal-delay="250"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark mb-4"
              >
                U jednom trenutku sam prestala da tražim savršen proizvod i počela da ga pravim.
                Čitala sam, istraživala, učila o sastojcima — ne da bih postala kozmetičar, nego
                zato što sam želela da pomognem svom licu. To mi je bilo lično.
              </p>
              <p
                data-reveal="true"
                data-reveal-delay="300"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark"
              >
                Odrasla sam u kući gde se veruje da ono što radiš za druge ima smisla tek ako si
                to prvo prošao sam. Moj tata je sveštenik i taj princip me vodio i ovde — prvo sam
                napravila nešto što zaista deluje na mojoj koži, pa tek onda to podelila sa svetom.
              </p>
            </div>
            <div data-reveal="true" data-reveal-delay="100" className="aspect-[4/3] bg-sage-pale" />
          </div>

          {/* Block 2 — Testing & community */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div
              data-reveal="true"
              className="order-2 md:order-1 relative aspect-[4/3] overflow-hidden bg-off-white"
            >
              <Image
                src="/put.webp"
                alt="Teodora — testiranje i razvoj Pop Beauty formula na prijateljicama"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 md:order-2">
              <span
                data-reveal="true"
                className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
              >
                Testirano na prijateljicama
              </span>
              <h2
                data-reveal="true"
                data-reveal-delay="100"
                className="font-display font-[300] text-[clamp(28px,4vw,40px)] leading-[1.3] text-ink mb-6"
              >
                Svaka formula je prošla pravi test.
              </h2>
              <p
                data-reveal="true"
                data-reveal-delay="200"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark mb-4"
              >
                Pre nego što je ijedan proizvod dobio etiketu, prošao je mesece testiranja. Najpre na meni,
                pa na drugaricama — svaka sa drugačijim tipom kože, drugačijim problemima, drugačijim očekivanjima.
                Masna koža, suva koža, osetljiva koža, kombinovana. Svaka povratna informacija je menjala formulu
                dok nije postala nešto što zaista pomaže svima.
              </p>
              <p
                data-reveal="true"
                data-reveal-delay="250"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark"
              >
                Nisam htela da napravim još jedan proizvod koji lepo izgleda na polici.
                Htela sam nešto što ćeš koristiti do poslednje kapi — jer zaista primetiš razliku.
              </p>
            </div>
          </div>

          {/* Block 3 — Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <span
                data-reveal="true"
                className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
              >
                Filozofija
              </span>
              <h2
                data-reveal="true"
                data-reveal-delay="100"
                className="font-display font-[300] text-[clamp(28px,4vw,40px)] leading-[1.3] text-ink mb-6"
              >
                Manje koraka, više brige.
              </h2>
              <p
                data-reveal="true"
                data-reveal-delay="200"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark mb-4"
              >
                Rutina od deset proizvoda nije nega — to je zamor. Pop Beauty postoji jer verujem da
                koži ne treba mnogo. Treba joj ispravno. Dva seruma, šest do sedam pažljivo odabranih
                sastojaka u svakom, i iskrena namera da pomogne.
              </p>
              <p
                data-reveal="true"
                data-reveal-delay="250"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark"
              >
                Svaki sastojak u formuli je tu s razlogom. Nema punjača, nema marketinških trikova,
                nema sastojaka koji zvuče lepo a ne rade ništa. Samo čiste, aktivne supstance
                koje koža prepoznaje i koristi.
              </p>
            </div>
            <div
              data-reveal="true"
              data-reveal-delay="100"
              className="relative aspect-[4/3] overflow-hidden bg-sage-pale"
            >
              <Image
                src="/oba.webp"
                alt="Pop Beauty — uljani i vodeni serum, ritual od dva koraka"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Values */}
          <div className="border-t border-silver-light pt-20">
            <h2
              data-reveal="true"
              className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink-soft text-center mb-16"
            >
              Naše vrednosti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Iskrenost',
                  text: 'Svaki sastojak ima razlog. Objavljujemo kompletne INCI liste jer verujem da zaslužuješ da znaš šta stavljaš na lice.',
                },
                {
                  title: 'Jednostavnost',
                  text: 'Dva proizvoda, jedan ritual. Efektivna nega ne mora da bude komplikovana — i ne treba da te zamara.',
                },
                {
                  title: 'Odgovornost',
                  text: 'Cruelty-free, veganski, bez sintetičkih mirisa. Napravila sam ovo jer verujem da prirodni sastojci mogu više od hemijskih.',
                },
              ].map((v, i) => (
                <div key={v.title} data-reveal="true" data-reveal-delay={String(i * 100)}>
                  <h3 className="font-display font-[400] text-[24px] text-ink mb-4">{v.title}</h3>
                  <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[80px] bg-sage-pale text-center section-padding">
        <div className="mx-auto max-w-[600px] px-6">
          <h2
            data-reveal="true"
            className="font-display font-[300] italic text-[clamp(28px,4vw,40px)] text-ink mb-6"
          >
            Upoznajte naš ritual
          </h2>
          <p
            data-reveal="true"
            data-reveal-delay="100"
            className="font-body font-[300] text-[15px] text-silver-dark mb-8"
          >
            Dva koraka za zdravu, sjajnu kožu — svaki dan.
          </p>
          <div data-reveal="true" data-reveal-delay="200">
            <Link
              href="/ritual"
              className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-[10px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-ink transition-colors duration-200"
            >
              Saznaj više
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
