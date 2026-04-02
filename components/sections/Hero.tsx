import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-start relative">
      <div className="mx-auto max-w-[1280px] px-6 w-full pt-8 md:pt-12 pb-0 md:pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* Left — Text */}
          <div className="order-2 md:order-1">
            <div data-reveal="true">
              <Badge>Prirodna formulacija</Badge>
            </div>

            <h1
              data-reveal="true"
              data-reveal-delay="100"
              className="font-display font-[300] text-[clamp(48px,6vw,88px)] leading-[1.05] text-ink mt-6 mb-6"
            >
              <em className="italic">Čisto.</em><br />
              Efektivno.<br />
              Prirodno.
            </h1>

            <p
              data-reveal="true"
              data-reveal-delay="200"
              className="font-body font-[300] text-[16px] leading-[1.8] text-silver-dark max-w-[380px] mb-10"
            >
              Dva seruma. Jedan ritual. Sve što vašoj koži zaista treba — čisti botanički sastojci bez kompromisa.
            </p>

            <div
              data-reveal="true"
              data-reveal-delay="300"
              className="flex flex-row gap-4"
            >
              <Button variant="filled" href="/#proizvodi">
                Istraži serume
              </Button>
              <Button variant="outlined" href="/ritual">
                Saznaj više
              </Button>
            </div>
          </div>

          {/* Right — Visual */}
          <div className="order-1 md:order-2 relative" data-reveal="true" data-reveal-delay="200">
            <div className="relative aspect-[3/4] w-full overflow-visible rounded-2xl bg-sage-pale shadow-[0_12px_48px_-16px_rgba(28,28,26,0.1)]">
              <div className="absolute inset-4 z-0 md:inset-5">
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-sage-pale">
                  <Image
                    src="/obaNaKamenu.webp"
                    alt="Pop Beauty — dva seruma u prirodnom okruženju"
                    fill
                    className="object-contain object-center drop-shadow-[0_6px_28px_rgba(28,28,26,0.14)]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                  {/* Desktop: full 11-gradient vignette */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
                    style={{
                      background: `
                        radial-gradient(ellipse 52% 38% at 3% 10%, rgba(250, 250, 248, 0.52), transparent 72%),
                        radial-gradient(ellipse 48% 44% at 97% 6%, rgba(232, 237, 229, 0.5), transparent 74%),
                        radial-gradient(ellipse 56% 42% at 96% 95%, rgba(250, 250, 248, 0.48), transparent 76%),
                        radial-gradient(ellipse 50% 40% at 4% 94%, rgba(209, 218, 201, 0.42), transparent 72%),
                        radial-gradient(ellipse 34% 30% at 20% 4%, rgba(250, 250, 248, 0.28), transparent 64%),
                        radial-gradient(ellipse 30% 36% at 84% 14%, rgba(250, 250, 248, 0.22), transparent 60%),
                        radial-gradient(ellipse 42% 34% at 52% 100%, rgba(232, 237, 229, 0.4), transparent 70%),
                        radial-gradient(ellipse 28% 32% at 0% 44%, rgba(250, 250, 248, 0.3), transparent 62%),
                        radial-gradient(ellipse 26% 28% at 100% 58%, rgba(250, 250, 248, 0.24), transparent 58%),
                        radial-gradient(ellipse 22% 26% at 38% 8%, rgba(232, 237, 229, 0.2), transparent 55%),
                        radial-gradient(ellipse 24% 22% at 72% 88%, rgba(250, 250, 248, 0.26), transparent 58%)
                      `,
                    }}
                  />
                  {/* Mobile: simplified 4-gradient vignette for GPU performance */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[1] md:hidden"
                    style={{
                      background: `
                        radial-gradient(ellipse 55% 40% at 2% 8%, rgba(250, 250, 248, 0.5), transparent 70%),
                        radial-gradient(ellipse 50% 42% at 98% 5%, rgba(232, 237, 229, 0.45), transparent 70%),
                        radial-gradient(ellipse 55% 40% at 97% 95%, rgba(250, 250, 248, 0.45), transparent 70%),
                        radial-gradient(ellipse 50% 38% at 3% 92%, rgba(209, 218, 201, 0.4), transparent 70%)
                      `,
                    }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[2] rounded-lg ring-1 ring-inset ring-white/20 shadow-[inset_0_0_32px_rgba(250,250,248,0.1)]"
                  />
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 z-20 h-20 w-20 bg-sage-light shadow-[0_4px_16px_rgba(28,28,26,0.1)] ring-1 ring-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden md:block md:bottom-32">
        <div className="scroll-indicator w-[1px] h-10 bg-silver-mid" />
      </div>
    </section>
  );
}
