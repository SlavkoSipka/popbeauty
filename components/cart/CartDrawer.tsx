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
  const { priceMap, siteDiscountPercent, loaded } = usePricingData();

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
      referralDiscountPercent: referralDiscountPercent ?? 0,
    });
  }, [items, priceMap, siteDiscountPercent, loaded, referralDiscountPercent]);

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
        className={`fixed top-0 right-0 z-[110] flex h-full w-full max-w-md flex-col border-l border-silver-light bg-white shadow-[-8px_0_32px_rgba(28,28,26,0.08)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Korpa"
      >
        <div className="flex items-center justify-between border-b border-silver-light px-6 py-5">
          <h2 className="font-display font-[300] text-[22px] text-ink">Korpa</h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center text-ink hover:opacity-60"
            aria-label="Zatvori korpu"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="1" y1="1" x2="15" y2="15" />
              <line x1="15" y1="1" x2="1" y2="15" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {itemCount === 0 ? (
            <div className="py-8 text-center">
              <p className="font-body font-[300] text-[15px] text-silver-dark mb-8">
                Korpa je prazna. Dodaj proizvode sa stranica seruma.
              </p>
              <Link
                href="/#proizvodi"
                onClick={closeCart}
                className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-[10px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-ink transition-colors duration-200"
              >
                Pogledaj proizvode
              </Link>
            </div>
          ) : (
            <>
              <p className="font-body font-[300] text-[12px] text-silver-mid mb-6">
                {itemCount}{' '}
                {itemCount === 1 ? 'stavka' : itemCount < 5 ? 'stavke' : 'stavki'}
              </p>
              <ul className="flex flex-col gap-6">
                {items.map((line) => (
                  <li
                    key={line.slug}
                    className="flex gap-4 border-b border-silver-light pb-6 last:border-0"
                  >
                    <Link
                      href={`/proizvodi/${line.slug}`}
                      onClick={closeCart}
                      className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-sage-pale"
                    >
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        className="object-contain object-center p-1"
                        sizes="72px"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div>
                        <Link
                          href={`/proizvodi/${line.slug}`}
                          onClick={closeCart}
                          className="font-display font-[400] text-[17px] text-ink link-underline"
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
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 border border-silver-light">
                          <button
                            type="button"
                            aria-label="Smanji količinu"
                            className="px-2.5 py-1 font-body text-[14px] text-ink hover:bg-off-white"
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="min-w-[1.75rem] text-center font-body font-[400] text-[13px]">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Povećaj količinu"
                            className="px-2.5 py-1 font-body text-[14px] text-ink hover:bg-off-white"
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="font-body font-[300] text-[11px] text-silver-mid underline underline-offset-2 hover:text-ink"
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
          <div className="border-t border-silver-light px-6 py-5">
            {/* Promo kod (= kreatorov referral kod) */}
            <div className="mb-5 border-b border-silver-light pb-5">
              <label className="block font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-ink mb-1.5">
                Promo kod
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value); setCodeError(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void applyCode(); } }}
                  placeholder="Unesi kod"
                  autoCapitalize="characters"
                  className="min-w-0 flex-1 border border-silver-light bg-white px-3 py-2.5 font-body font-[300] text-[13px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={() => void applyCode()}
                  disabled={checking}
                  className="shrink-0 border border-ink bg-transparent px-3 py-2 font-body font-[400] text-[10px] uppercase tracking-[0.1em] text-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-50"
                >
                  {checking ? '…' : 'Primeni'}
                </button>
              </div>
              {codeError ? (
                <p className="font-body font-[300] text-[11px] text-red-800 mt-1.5" role="alert">
                  {codeError}
                </p>
              ) : null}
              {referralCode && referralDiscountPercent != null && !codeError ? (
                <p className="font-body font-[300] text-[11px] text-sage-mid mt-1.5">
                  Kod <span className="font-mono text-ink">{referralCode}</span> — popust{' '}
                  {referralDiscountPercent}%
                </p>
              ) : null}
              {referralCode ? (
                <button
                  type="button"
                  onClick={() => { clearReferral(); setCodeInput(''); setCodeError(null); }}
                  className="font-body font-[300] text-[10px] text-silver-mid underline underline-offset-2 mt-1 hover:text-ink"
                >
                  Ukloni kod
                </button>
              ) : null}
            </div>

            {/* Cena */}
            <div className="mb-5 space-y-2 border-b border-silver-light pb-5">
              {pricing && pricing.discountType && (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-body font-[300] text-[11px] text-silver-dark">
                      Bez popusta
                    </span>
                    <span className="font-body font-[300] text-[14px] text-silver-dark tabular-nums line-through">
                      {formatRsd(pricing.subtotalRsd)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-body font-[300] text-[11px] text-sage-mid">
                      {pricing.discountType === 'bundle'
                        ? `Paket popust −${pricing.discountPercent}%`
                        : `Popust −${pricing.discountPercent}%`}
                    </span>
                    <span className="font-body font-[300] text-[13px] text-sage-mid tabular-nums">
                      −{formatRsd(pricing.discountAmountRsd)}
                    </span>
                  </div>
                </>
              )}
              {pricing && pricing.referralDiscountPercent > 0 && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-body font-[300] text-[11px] text-sage-dark">
                    Promo kod −{pricing.referralDiscountPercent}%
                  </span>
                  <span className="font-body font-[300] text-[13px] text-sage-dark tabular-nums">
                    −{formatRsd(pricing.referralDiscountRsd)}
                  </span>
                </div>
              )}
              <div className="flex items-end justify-between gap-4">
                <span className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink">
                  Ukupno
                </span>
                <span className="font-display font-[400] text-[22px] text-ink tabular-nums leading-none">
                  {pricing ? formatRsd(pricing.totalRsd) : formatRsd(0)}
                </span>
              </div>
            </div>
            {pricing?.isBundle && (
              <p className="font-body font-[300] text-[11px] text-sage-mid mb-3 leading-relaxed">
                Paketna cena za oba seruma — ušteda {formatRsd(pricing.discountAmountRsd)}.
              </p>
            )}
            <p className="font-body font-[300] text-[11px] text-silver-mid mb-4 leading-relaxed">
              Plaćanje pouzećem. Dostava se dogovara nakon slanja porudžbine.
            </p>
            <Link
              href="/porudzbina"
              onClick={closeCart}
              className="inline-flex w-full items-center justify-center border border-ink bg-ink px-6 py-[12px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-white transition-colors duration-200 ease-in-out hover:bg-transparent hover:text-ink"
            >
              Nastavi — podaci za dostavu
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
