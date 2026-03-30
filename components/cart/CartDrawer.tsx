'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { displayUnitPriceForLine, formatRsd, lineSubtotalRsd } from '@/lib/price';
import { computePricing } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';

export default function CartDrawer() {
  const {
    items, itemCount, isOpen, closeCart, removeLine, setQuantity,
    setReferral, clearReferral, referralCode, referralDiscountPercent,
  } = useCart();
  const { priceMap, siteDiscountPercent, bundleDiscountPercent, loaded } = usePricingData();

  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => { setCodeInput(referralCode ?? ''); }, [referralCode]);

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
      })),
      siteDiscountPercent,
      bundleDiscountPercent,
      referralDiscountPercent: referralDiscountPercent ?? 0,
    });
  }, [items, priceMap, siteDiscountPercent, bundleDiscountPercent, loaded, referralDiscountPercent]);

  async function applyCode() {
    const raw = codeInput.trim();
    setCodeError(null);
    if (!raw) { clearReferral(); return; }
    setChecking(true);
    try {
      const res = await fetch(`/api/referral-lookup?code=${encodeURIComponent(raw)}`);
      const data = (await res.json()) as
        | { found: true; discountPercent: number }
        | { found: false };
      if (!res.ok) { setCodeError('Greška. Pokušaj ponovo.'); return; }
      if (data.found) {
        const norm = raw.toUpperCase().replace(/\s+/g, '');
        setReferral(norm, data.discountPercent);
        setCodeInput(norm);
      } else {
        setCodeError('Kod nije pronađen.');
        clearReferral();
      }
    } catch { setCodeError('Mrežna greška.'); }
    finally { setChecking(false); }
  }

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
        <div className="flex shrink-0 items-center justify-between border-b border-silver-light px-4 py-3.5 md:px-6 md:py-5">
          <h2 className="font-display font-[300] text-[18px] text-ink md:text-[22px]">Korpa</h2>
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
            <>
              <p className="font-body font-[300] text-[11px] text-silver-mid mb-4 md:mb-6 md:text-[12px]">
                {itemCount}{' '}
                {itemCount === 1 ? 'stavka' : itemCount < 5 ? 'stavke' : 'stavki'}
              </p>
              <ul className="flex flex-col gap-4 md:gap-6">
                {items.map((line) => (
                  <li
                    key={line.slug}
                    className="flex gap-3 border-b border-silver-light pb-4 last:border-0 md:gap-4 md:pb-6"
                  >
                    <Link
                      href={`/proizvodi/${line.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-16 shrink-0 overflow-hidden bg-sage-pale md:h-24 md:w-[4.5rem]"
                    >
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-contain object-center p-1"
                        sizes="(max-width: 768px) 64px, 72px"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div>
                        <Link
                          href={`/proizvodi/${line.slug}`}
                          onClick={closeCart}
                          className="font-display font-[400] text-[15px] text-ink link-underline md:text-[17px]"
                        >
                          {line.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <p className="font-body font-[300] text-[13px] text-silver-dark">
                            {loaded
                              ? displayUnitPriceForLine(line, priceMap)
                              : displayUnitPriceForLine(line)}
                            {line.quantity > 1 ? (
                              <span className="text-silver-mid"> × {line.quantity}</span>
                            ) : null}
                          </p>
                          {line.quantity > 1 ? (
                            <p className="font-body font-[400] text-[13px] text-ink tabular-nums">
                              {loaded
                                ? formatRsd(lineSubtotalRsd(line, priceMap))
                                : formatRsd(lineSubtotalRsd(line))}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <div className="flex items-center border border-silver-light">
                          <button
                            type="button"
                            aria-label="Smanji količinu"
                            className="flex h-8 w-8 items-center justify-center font-body text-[16px] leading-none text-ink hover:bg-off-white md:h-auto md:w-auto md:px-2.5 md:py-1 md:text-[14px]"
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="min-w-[1.35rem] text-center font-body font-[400] text-[12px] md:min-w-[1.75rem] md:text-[13px]">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Povećaj količinu"
                            className="flex h-8 w-8 items-center justify-center font-body text-[16px] leading-none text-ink hover:bg-off-white md:h-auto md:w-auto md:px-2.5 md:py-1 md:text-[14px]"
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="font-body font-[300] text-[10px] text-silver-mid underline underline-offset-2 hover:text-ink md:text-[11px]"
                          onClick={() => removeLine(line.slug)}
                        >
                          Ukloni
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-auto shrink-0 border-t border-silver-light bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(28,28,26,0.06)] md:px-7 md:py-6 md:pb-6 md:shadow-none">
            {/* Promo kod (= kreatorov referral kod) */}
            <div className="mb-4 border-b border-silver-light pb-4 md:mb-6 md:pb-6">
              <label className="block font-body font-[400] text-[10px] uppercase tracking-[0.12em] text-ink mb-1.5 md:text-[11px] md:tracking-[0.14em] md:mb-2">
                Promo kod
              </label>
              <div className="flex gap-2 md:gap-2.5">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value); setCodeError(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void applyCode(); } }}
                  placeholder="Unesi kod"
                  autoCapitalize="characters"
                  className="min-w-0 flex-1 border border-silver-light bg-white px-3 py-2.5 font-body font-[300] text-[13px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none uppercase md:px-3.5 md:py-3 md:text-[14px]"
                />
                <button
                  type="button"
                  onClick={() => void applyCode()}
                  disabled={checking}
                  className="shrink-0 border border-ink bg-transparent px-3 py-2.5 font-body font-[400] text-[10px] uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-50 md:px-4 md:text-[11px] md:tracking-[0.1em]"
                >
                  {checking ? '…' : 'Primeni'}
                </button>
              </div>
              {codeError ? (
                <p className="font-body font-[300] text-[12px] text-red-800 mt-2" role="alert">
                  {codeError}
                </p>
              ) : null}
              {referralCode && referralDiscountPercent != null && !codeError ? (
                <p className="font-body font-[300] text-[12px] text-sage-mid mt-2">
                  Kod <span className="font-mono text-ink">{referralCode}</span> — popust{' '}
                  {referralDiscountPercent}%
                </p>
              ) : null}
              {referralCode ? (
                <button
                  type="button"
                  onClick={() => { clearReferral(); setCodeInput(''); setCodeError(null); }}
                  className="font-body font-[300] text-[11px] text-silver-mid underline underline-offset-2 mt-1.5 hover:text-ink"
                >
                  Ukloni kod
                </button>
              ) : null}
            </div>

            {/* Cena */}
            <div className="mb-4 space-y-2 border-b border-silver-light pb-4 md:mb-6 md:space-y-2.5 md:pb-6">
              {pricing && pricing.discountType && (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-body font-[300] text-[12px] text-silver-dark md:text-[13px]">
                      Bez popusta
                    </span>
                    <span className="font-body font-[300] text-[15px] text-silver-dark tabular-nums line-through md:text-[16px]">
                      {formatRsd(pricing.subtotalRsd)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-body font-[300] text-[12px] text-sage-mid md:text-[13px]">
                      {pricing.discountType === 'bundle'
                        ? `Paket popust −${pricing.discountPercent}%`
                        : `Popust −${pricing.discountPercent}%`}
                    </span>
                    <span className="font-body font-[300] text-[14px] text-sage-mid tabular-nums md:text-[15px]">
                      −{formatRsd(pricing.discountAmountRsd)}
                    </span>
                  </div>
                </>
              )}
              {pricing && pricing.referralDiscountPercent > 0 && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-body font-[300] text-[12px] text-sage-dark md:text-[13px]">
                    Promo kod −{pricing.referralDiscountPercent}%
                  </span>
                  <span className="font-body font-[300] text-[14px] text-sage-dark tabular-nums md:text-[15px]">
                    −{formatRsd(pricing.referralDiscountRsd)}
                  </span>
                </div>
              )}
              <div className="flex items-end justify-between gap-3 pt-0.5">
                <span className="font-body font-[400] text-[11px] uppercase tracking-[0.12em] text-ink md:text-[12px] md:tracking-[0.14em]">
                  Ukupno
                </span>
                <span className="font-body font-[500] text-[22px] text-ink tabular-nums leading-none md:text-[26px]">
                  {pricing ? formatRsd(pricing.totalRsd) : formatRsd(0)}
                </span>
              </div>
            </div>
            {pricing?.isBundle && (
              <p className="font-body font-[300] text-[11px] text-sage-mid mb-2.5 leading-relaxed md:mb-3.5 md:text-[12px]">
                Paketna cena za oba seruma — ušteda {formatRsd(pricing.discountAmountRsd)}.
              </p>
            )}
            <p className="font-body font-[300] text-[11px] text-silver-mid mb-4 leading-relaxed md:mb-5 md:text-[12px]">
              Plaćanje pouzećem. Dostava se dogovara nakon slanja porudžbine.
            </p>
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
