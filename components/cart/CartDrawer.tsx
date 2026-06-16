'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, type CartLine } from '@/lib/cart-context';
import { formatRsd, unitPriceRsdForLine } from '@/lib/price';
import { computePricing, type LineDiscount } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';

function discountedUnitPrice(base: number, pct: number): number {
  return Math.round(base * (1 - pct / 100) * 100) / 100;
}

function CartLinePrice({
  line,
  priceMap,
  lineDiscount,
  loaded,
}: {
  line: CartLine;
  priceMap: Map<string, number>;
  lineDiscount: LineDiscount | undefined;
  loaded: boolean;
}) {
  const base = unitPriceRsdForLine(line, loaded ? priceMap : undefined);
  const effectivePct = lineDiscount?.percent ?? 0;

  if (!loaded || effectivePct <= 0) {
    return (
      <div className="mt-1.5 flex flex-col gap-0.5">
        <p className="font-body font-[400] text-[15px] text-ink tabular-nums md:text-[16px]">
          {formatRsd(base)}
        </p>
        {line.quantity > 1 ? (
        <p className="font-body font-[500] text-[13px] text-ink-soft tabular-nums md:text-[14px]">
          × {line.quantity} = {formatRsd(base * line.quantity)}
        </p>
        ) : null}
      </div>
    );
  }

  const discounted = discountedUnitPrice(base, effectivePct);
  const displayPct = Math.round(effectivePct);

  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="font-body font-[400] text-[15px] text-ink tabular-nums md:text-[16px]">
          {formatRsd(discounted)}
        </p>
        <span className="inline-flex items-center border border-sage-dark bg-sage-pale px-1.5 py-0.5 font-body font-[500] text-[10px] text-sage-dark tabular-nums md:text-[11px]">
          −{displayPct}%
        </span>
      </div>
      {line.quantity > 1 ? (
        <p className="font-body font-[500] text-[13px] text-ink-soft tabular-nums md:text-[14px]">
          × {line.quantity} = {formatRsd(discounted * line.quantity)}
        </p>
      ) : null}
    </div>
  );
}

export default function CartDrawer() {
  const {
    items, itemCount, isOpen, closeCart, removeLine, setQuantity,
    referralDiscountPercent,
  } = useCart();
  const {
    priceMap,
    productDiscountMap,
    siteDiscountPercent,
    bundleDiscountPercent,
    loaded,
  } = usePricingData();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  const pricing = useMemo(() => {
    if (!loaded || items.length === 0) return null;
    return computePricing({
      lines: items.map((l) => ({
        slug: l.slug,
        quantity: l.quantity,
        basePriceRsd: priceMap.get(l.slug) ?? 0,
        discountPercent: productDiscountMap.get(l.slug) ?? null,
      })),
      siteDiscountPercent,
      bundleDiscountPercent,
      referralDiscountPercent: referralDiscountPercent ?? 0,
    });
  }, [
    items,
    priceMap,
    productDiscountMap,
    siteDiscountPercent,
    bundleDiscountPercent,
    loaded,
    referralDiscountPercent,
  ]);

  const discountBySlug = useMemo(() => {
    const m = new Map<string, LineDiscount>();
    pricing?.lineDiscounts.forEach((d) => m.set(d.slug, d));
    return m;
  }, [pricing]);

  const siteLineDiscounts = pricing?.lineDiscounts.filter((d) => d.source === 'site') ?? [];
  const showSitePerLine =
    siteLineDiscounts.length > 1 &&
    new Set(siteLineDiscounts.map((d) => Math.round(d.percent))).size > 1;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-[rgba(28,28,26,0.35)] transition-opacity duration-300 md:backdrop-blur-[2px] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
        onClick={closeCart}
      />

      <div
        className={`fixed top-0 right-0 z-[110] flex h-[100dvh] max-h-[100dvh] min-h-0 w-full max-w-md flex-col border-l border-silver-light bg-white shadow-[-8px_0_32px_rgba(28,28,26,0.08)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Korpa"
      >
        <div className="flex shrink-0 justify-end px-4 py-3.5 md:px-6 md:py-5">
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center text-ink hover:opacity-60 md:h-10 md:w-10"
            aria-label="Zatvori korpu"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="1" y1="1" x2="15" y2="15" />
              <line x1="15" y1="1" x2="1" y2="15" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6 md:py-6">
          {itemCount === 0 ? (
            <div className="py-8 text-center">
              <p className="font-body font-[300] text-[14px] text-silver-dark mb-6 md:text-[15px] md:mb-8">
                Korpa je prazna. Dodaj proizvode sa stranica seruma.
              </p>
              <Link
                href="/#proizvodi"
                onClick={closeCart}
                className="inline-flex items-center justify-center border border-ink bg-ink text-white px-4 py-2 font-body font-[400] text-[10px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors duration-200 md:px-6 md:py-[10px] md:text-[11px] md:tracking-[0.14em]"
              >
                Pogledaj proizvode
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5 md:gap-7">
                {items.map((line) => (
                  <li
                    key={line.slug}
                    className="flex gap-4 border-b border-silver-light pb-5 last:border-0 md:gap-5 md:pb-7"
                  >
                    <Link
                      href={`/proizvodi/${line.slug}`}
                      onClick={closeCart}
                      className="relative h-28 w-24 shrink-0 overflow-hidden bg-white md:h-32 md:w-28"
                    >
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-cover object-center scale-[1.04]"
                        sizes="(max-width: 768px) 96px, 112px"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                      <div>
                        <Link
                          href={`/proizvodi/${line.slug}`}
                          onClick={closeCart}
                          className={`font-display text-[18px] text-ink link-underline md:text-[21px] ${line.slug === 'uljani-serum' ? 'font-[500]' : 'font-[400]'}`}
                        >
                          {line.name}
                        </Link>
                        <CartLinePrice
                          line={line}
                          priceMap={priceMap}
                          lineDiscount={discountBySlug.get(line.slug)}
                          loaded={loaded}
                        />
                      </div>
                      <div className="flex items-center border border-silver-light w-fit">
                        <button
                          type="button"
                          aria-label="Smanji količinu"
                          className="flex h-9 w-9 items-center justify-center font-body text-[18px] leading-none text-ink hover:bg-off-white md:h-10 md:w-10 md:text-[16px]"
                          onClick={() => setQuantity(line.slug, line.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center font-body font-[400] text-[14px] md:min-w-[1.75rem] md:text-[15px]">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Povećaj količinu"
                          className="flex h-9 w-9 items-center justify-center font-body text-[18px] leading-none text-ink hover:bg-off-white md:h-10 md:w-10 md:text-[16px]"
                          onClick={() => setQuantity(line.slug, line.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Ukloni"
                      onClick={() => removeLine(line.slug)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center self-start text-ink-soft transition-colors hover:text-ink md:h-9 md:w-9"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <line x1="1" y1="1" x2="15" y2="15" />
                        <line x1="15" y1="1" x2="1" y2="15" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-auto shrink-0 border-t border-silver-light bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(28,28,26,0.06)] md:px-7 md:py-6 md:pb-6 md:shadow-none">
            <div className="mb-4 space-y-2 border-b border-silver-light pb-4 md:mb-6 md:space-y-2.5 md:pb-6">
              {pricing && pricing.discountType && (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-body font-[500] text-[13px] text-ink md:text-[14px]">
                      Bez popusta
                    </span>
                    <span className="font-body font-[500] text-[16px] text-silver-dark tabular-nums line-through md:text-[17px]">
                      {formatRsd(pricing.subtotalRsd)}
                    </span>
                  </div>

                  {pricing.bundleBreakdown.map((b) => (
                    <div key={b.id} className="flex items-baseline justify-between gap-4">
                      <span className="font-body font-[500] text-[13px] text-sage-dark md:text-[14px]">
                        Paket popust −{Math.round(b.percent)}%
                      </span>
                      <span className="font-body font-[500] text-[15px] text-sage-dark tabular-nums md:text-[16px]">
                        −{formatRsd(b.amountRsd)}
                      </span>
                    </div>
                  ))}

                  {showSitePerLine ? (
                    siteLineDiscounts.map((ld) => {
                      const line = items.find((it) => it.slug === ld.slug);
                      const label = line?.name ?? ld.slug;
                      return (
                        <div key={ld.slug} className="flex items-baseline justify-between gap-4">
                          <span className="font-body font-[500] text-[13px] text-sage-dark md:text-[14px]">
                            {label} −{Math.round(ld.percent)}%
                          </span>
                          <span className="font-body font-[500] text-[15px] text-sage-dark tabular-nums md:text-[16px]">
                            −{formatRsd(ld.amountRsd)}
                          </span>
                        </div>
                      );
                    })
                  ) : siteLineDiscounts.length > 0 ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-body font-[500] text-[13px] text-sage-dark md:text-[14px]">
                        Popust −{Math.round(siteLineDiscounts[0].percent)}%
                      </span>
                      <span className="font-body font-[500] text-[15px] text-sage-dark tabular-nums md:text-[16px]">
                        −{formatRsd(round2Sum(siteLineDiscounts))}
                      </span>
                    </div>
                  ) : null}
                </>
              )}
              <div className="flex items-end justify-between gap-3 pt-0.5">
                <span className="font-body font-[600] text-[12px] uppercase tracking-[0.12em] text-ink md:text-[13px] md:tracking-[0.14em]">
                  Ukupno
                </span>
                <span className="font-body font-[500] text-[22px] text-ink tabular-nums leading-none md:text-[26px]">
                  {pricing ? formatRsd(pricing.totalRsd) : formatRsd(0)}
                </span>
              </div>
            </div>
            <Link
              href="/porudzbina"
              onClick={closeCart}
              className="inline-flex w-full items-center justify-center border border-ink bg-ink px-4 py-3 font-body font-[400] text-[11px] uppercase tracking-[0.12em] text-white transition-colors duration-200 ease-in-out hover:bg-transparent hover:text-ink md:px-6 md:py-3.5 md:text-[12px] md:tracking-[0.14em]"
            >
              Nastavi — podaci za dostavu
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function round2Sum(lds: LineDiscount[]): number {
  return Math.round(lds.reduce((s, d) => s + d.amountRsd, 0) * 100) / 100;
}
