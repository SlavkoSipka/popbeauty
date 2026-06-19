'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import {
  expandCartToPricingLines,
  getBundleFallbackPriceRsd,
  getBundleLinePrice,
  isBundleSlug,
} from '@/lib/bundles';
import { displayUnitPriceForLine, formatRsd, lineSubtotalRsd, parsePriceStringToRsd } from '@/lib/price';
import { SHIPPING_CARRIER, shippingForProductsTotalRsd } from '@/lib/shipping';
import { computePricing, type PricingResult } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';
import { pixelTrack } from '@/lib/meta-pixel';
import Button from '@/components/ui/Button';

export default function PorudzbinaPage() {
  useScrollReveal();
  const router = useRouter();
  const {
    items, clearCart,
    referralCode, referralDiscountPercent,
    setReferral, clearReferral,
  } = useCart();
  const {
    priceMap,
    productDiscountMap,
    siteDiscountPercent,
    bundleDiscountPercent,
    loaded,
  } = usePricingData();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState(referralCode ?? '');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeChecking, setCodeChecking] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const [note, setNote] = useState('');

  const empty = items.length === 0;

  const pricingOpts = useMemo(
    () => ({
      getBasePrice: (slug: string) => priceMap.get(slug) ?? 0,
      getDiscountPercent: (slug: string) => productDiscountMap.get(slug) ?? null,
    }),
    [priceMap, productDiscountMap],
  );

  const pricing: PricingResult | null = useMemo(() => {
    if (!loaded || items.length === 0) return null;
    return computePricing({
      lines: expandCartToPricingLines(items, pricingOpts),
      siteDiscountPercent,
      bundleDiscountPercent,
      referralDiscountPercent: referralDiscountPercent ?? 0,
      autoDetectBundles: false,
    });
  }, [
    items,
    pricingOpts,
    siteDiscountPercent,
    bundleDiscountPercent,
    loaded,
    referralDiscountPercent,
  ]);

  function checkoutLineUnitLabel(line: (typeof items)[number]): string {
    if (isBundleSlug(line.slug)) {
      if (loaded) {
        const bundlePrice = getBundleLinePrice(line.slug, 1, {
          ...pricingOpts,
          siteDiscountPercent,
          bundleDiscountPercent,
        });
        if (bundlePrice) return formatRsd(bundlePrice.unitPriceRsd);
      }
      const fallback =
        parsePriceStringToRsd(line.price) ?? getBundleFallbackPriceRsd(line.slug);
      return formatRsd(fallback);
    }
    return loaded
      ? displayUnitPriceForLine(line, priceMap)
      : displayUnitPriceForLine(line);
  }

  function checkoutLineSubtotal(line: (typeof items)[number]): string {
    if (isBundleSlug(line.slug)) {
      if (loaded) {
        const bundlePrice = getBundleLinePrice(line.slug, line.quantity, {
          ...pricingOpts,
          siteDiscountPercent,
          bundleDiscountPercent,
        });
        if (bundlePrice) return formatRsd(bundlePrice.afterDiscountRsd);
      }
      const fallback =
        (parsePriceStringToRsd(line.price) ?? getBundleFallbackPriceRsd(line.slug)) *
        line.quantity;
      return formatRsd(fallback);
    }
    return loaded
      ? formatRsd(lineSubtotalRsd(line, priceMap))
      : formatRsd(lineSubtotalRsd(line));
  }

  const productsTotal = pricing?.totalRsd ?? 0;
  const shippingRsd = shippingForProductsTotalRsd(productsTotal);
  const freeShipping = shippingRsd === 0;
  const totalForApi = productsTotal + shippingRsd;

  const initiateFiredRef = useRef(false);
  useEffect(() => {
    if (initiateFiredRef.current) return;
    if (empty || !pricing) return;
    initiateFiredRef.current = true;
    pixelTrack('InitiateCheckout', {
      content_ids: items.map((l) => l.slug),
      contents: items.map((l) => ({ id: l.slug, quantity: l.quantity })),
      content_type: 'product',
      num_items: items.reduce((s, l) => s + l.quantity, 0),
      value: totalForApi,
      currency: 'RSD',
    });
  }, [empty, pricing, items]);

  async function applyCode() {
    const raw = codeInput.trim();
    setCodeError(null);
    if (!raw) { clearReferral(); return; }
    setCodeChecking(true);
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
    finally { setCodeChecking(false); }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: referralCode ?? null,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postal: postal.trim(),
          note: note.trim() || null,
          lineItems: items.map((line) => ({
            slug: line.slug,
            quantity: line.quantity,
          })),
          totalRsd: totalForApi,
        }),
      });

      const data = (await res.json()) as { error?: string; orderId?: string };

      if (!res.ok) {
        setError(data.error ?? 'Slanje nije uspelo.');
        return;
      }

      try {
        sessionStorage.setItem(
          'popbeauty-purchase',
          JSON.stringify({
            orderId: data.orderId ?? null,
            value: totalForApi,
            currency: 'RSD',
            contentName: items.map((l) => l.name).join(' + '),
            contentIds: items.map((l) => l.slug),
            contents: items.map((l) => ({ id: l.slug, quantity: l.quantity })),
            numItems: items.reduce((s, l) => s + l.quantity, 0),
            email: email.trim(),
            phone: phone.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }),
        );
      } catch { /* sessionStorage može biti blokiran */ }

      clearCart();
      router.push('/zahvalnica');
    } catch {
      setError('Mrežna greška. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const fieldInputClass =
    'w-full border-2 border-ink/25 bg-white px-4 py-3 font-body font-[400] text-[15px] text-ink placeholder:text-silver-dark focus:border-sage-dark focus:outline-none transition-colors duration-200 md:px-5 md:py-3.5 md:text-[16px]';
  const fieldLabelClass =
    'block font-body font-[500] text-[13px] text-ink mb-1.5 md:mb-2 md:text-[14px]';

  return (
    <main>
      <section className="py-10 max-md:pt-16 md:py-[84px] section-padding">
        <div className="mx-auto max-w-[960px] px-4 md:px-6">
          <h1 className="sr-only">Porudžbina i dostava</h1>
          {empty ? (
            <div
              data-reveal="true"
              data-reveal-delay="300"
              className="text-center py-12 border border-silver-light max-w-[480px] mx-auto md:py-16"
            >
              <p className="font-body font-[300] text-[14px] text-silver-dark mb-6 md:mb-8 md:text-[15px]">
                Korpa je prazna. Dodajte proizvode pre nego što nastavite.
              </p>
              <Link
                href="/#proizvodi"
                className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-[10px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-ink transition-colors duration-200"
              >
                Pogledaj proizvode
              </Link>
            </div>
          ) : (
            <div
              data-reveal="true"
              data-reveal-delay="300"
              className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-12 items-start"
            >
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-7 order-2 lg:order-1">
                <div>
                  <h2 className="font-display font-[400] text-[22px] text-ink mb-1 md:text-[26px]">
                    Podaci za dostavu
                  </h2>
                  <p className="font-body font-[400] text-[14px] text-ink-soft md:text-[15px]">
                    {freeShipping
                      ? `Besplatna poštarina za ovu porudžbinu (${SHIPPING_CARRIER}).`
                      : `Poštarina ${formatRsd(shippingRsd)} (${SHIPPING_CARRIER}) sabira se sa iznosom porudžbine.`}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                  <div>
                    <label className={fieldLabelClass} htmlFor="checkout-firstName">
                      Ime
                    </label>
                    <input
                      id="checkout-firstName"
                      type="text"
                      name="firstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className={fieldInputClass}
                      placeholder="Ime"
                    />
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="checkout-lastName">
                      Prezime
                    </label>
                    <input
                      id="checkout-lastName"
                      type="text"
                      name="lastName"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className={fieldInputClass}
                      placeholder="Prezime"
                    />
                  </div>
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor="checkout-email">
                    Email
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className={fieldInputClass}
                    placeholder="vaš@email.com"
                  />
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor="checkout-phone">
                    Telefon
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className={fieldInputClass}
                    placeholder="+381 …"
                  />
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor="checkout-address">
                    Adresa (ulica i broj)
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    name="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    className={fieldInputClass}
                    placeholder="Ulica i broj"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                  <div>
                    <label className={fieldLabelClass} htmlFor="checkout-city">
                      Grad
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      name="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                      className={fieldInputClass}
                      placeholder="Grad"
                    />
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="checkout-postal">
                      Poštanski broj
                    </label>
                    <input
                      id="checkout-postal"
                      type="text"
                      name="postal"
                      required
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      autoComplete="postal-code"
                      className={fieldInputClass}
                      placeholder="npr. 11000"
                    />
                  </div>
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor="checkout-note">
                    Napomena{' '}
                    <span className="font-[400] text-silver-dark">
                      (opciono)
                    </span>
                  </label>
                  <textarea
                    id="checkout-note"
                    name="note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={`${fieldInputClass} resize-none md:min-h-[5.5rem]`}
                    placeholder="Npr. vreme dostave, dodatne napomene…"
                  />
                </div>

                {/* Promo kod (= kreatorov referral) — ispod napomene */}
                <div className="border-2 border-ink/15 p-4 md:p-6 bg-off-white">
                  <label className={fieldLabelClass}>
                    Promo kod
                  </label>
                  <div className="flex gap-2 md:gap-3">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => { setCodeInput(e.target.value); setCodeError(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void applyCode(); } }}
                      placeholder="Unesi kod"
                      autoCapitalize="characters"
                      className="min-w-0 flex-1 border-2 border-ink/25 bg-white px-4 py-3 font-body font-[400] text-[15px] text-ink placeholder:text-silver-dark focus:border-sage-dark focus:outline-none transition-colors duration-200 uppercase md:px-5 md:py-3.5 md:text-[16px]"
                    />
                    <button
                      type="button"
                      onClick={() => void applyCode()}
                      disabled={codeChecking}
                      className="shrink-0 border-2 border-ink bg-ink px-4 py-3 font-body font-[500] text-[12px] uppercase tracking-[0.08em] text-white hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50 md:px-5 md:py-3.5 md:text-[13px]"
                    >
                      {codeChecking ? '…' : 'Proveri'}
                    </button>
                  </div>
                  {codeError ? (
                    <p className="font-body font-[400] text-[13px] text-red-800 mt-2" role="alert">
                      {codeError}
                    </p>
                  ) : null}
                  {referralCode && referralDiscountPercent != null && !codeError ? (
                    <p className="font-body font-[400] text-[13px] text-sage-dark mt-2 leading-relaxed">
                      {referralDiscountPercent === 0 ? (
                        siteDiscountPercent > 0 || bundleDiscountPercent > 0 ? (
                          <>
                            Kod <span className="font-mono text-ink">{referralCode}</span> — trenutno nema dodatnog
                            popusta preko koda jer su u toku akcije na sajtu
                            {siteDiscountPercent > 0 && bundleDiscountPercent > 0 ? (
                              <>
                                {' '}
                                ({Math.round(siteDiscountPercent)}% na pojedinačne proizvode, {Math.round(bundleDiscountPercent)}% na paket
                                kada su oba seruma u korpi).
                              </>
                            ) : siteDiscountPercent > 0 ? (
                              <> ({Math.round(siteDiscountPercent)}% na pojedinačne proizvode).</>
                            ) : (
                              <>
                                {' '}
                                ({Math.round(bundleDiscountPercent)}% na paket kada su oba seruma u korpi).
                              </>
                            )}{' '}
                            Kada ove akcije završe, kreatorov kod će ponovo važiti za tvoj popust.
                          </>
                        ) : (
                          <>
                            Kod <span className="font-mono text-ink">{referralCode}</span> — trenutno nema aktivnog
                            popusta preko ovog koda.
                          </>
                        )
                      ) : (
                        <>
                          Kod <span className="font-mono text-ink">{referralCode}</span> — popust{' '}
                          {Math.round(referralDiscountPercent)}%
                        </>
                      )}
                    </p>
                  ) : null}
                  {!referralCode && !codeError ? (
                    <p className="font-body font-[400] text-[13px] text-ink-soft mt-2 leading-relaxed">
                      Imaš promo kod? Unesi ga i dobij popust na porudžbinu.
                    </p>
                  ) : null}
                  {referralCode ? (
                    <button
                      type="button"
                      onClick={() => { clearReferral(); setCodeInput(''); setCodeError(null); }}
                      className="font-body font-[300] text-[10px] text-silver-mid underline underline-offset-2 mt-1.5 hover:text-ink"
                    >
                      Ukloni kod
                    </button>
                  ) : null}
                </div>

                {error ? (
                  <p className="font-body font-[500] text-[14px] text-red-800 md:text-[15px]" role="alert">
                    {error}
                  </p>
                ) : null}
                <Button
                  variant="filled"
                  type="submit"
                  fullWidth
                  disabled={loading || !loaded}
                  className="py-3.5 text-[13px] tracking-[0.1em] md:py-4 md:text-[14px] md:tracking-[0.12em]"
                >
                  {loading ? 'Šaljem…' : 'Pošalji porudžbinu'}
                </Button>
              </form>

              <aside className="order-1 lg:order-2 border-2 border-ink/15 p-4 md:p-5 lg:sticky lg:top-28 bg-off-white">
                <h2 className="font-display font-[400] text-[18px] text-ink mb-4 md:mb-5 md:text-[20px]">
                  Pregled korpe
                </h2>
                <ul className="flex flex-col gap-3 mb-4 md:mb-5 md:gap-4">
                  {items.map((line) => (
                    <li key={line.slug} className="flex gap-2">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-sage-pale">
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          className="object-contain object-center p-0.5"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body font-[500] text-[14px] text-ink leading-snug md:text-[15px]">
                          {line.name}
                        </p>
                        <p className="font-body font-[400] text-[12px] text-ink-soft mt-0.5 md:text-[13px]">
                          {checkoutLineUnitLabel(line)} × {line.quantity}
                        </p>
                      </div>
                      <p className="font-body font-[500] text-[13px] text-ink tabular-nums shrink-0 md:text-[14px]">
                        {checkoutLineSubtotal(line)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t-2 border-ink/10 pt-3 space-y-2 md:space-y-2.5 md:pt-4">
                  {pricing && pricing.discountType && (
                    <>
                      <div className="flex justify-between gap-2">
                        <span className="font-body font-[400] text-[13px] text-ink-soft md:text-[14px]">
                          Bez popusta
                        </span>
                        <span className="font-body font-[400] text-[13px] text-ink-soft tabular-nums line-through md:text-[14px]">
                          {formatRsd(pricing.subtotalRsd)}
                        </span>
                      </div>
                      {pricing.discountType === 'site' &&
                      pricing.lineDiscounts.length > 1 &&
                      new Set(pricing.lineDiscounts.map((ld) => Math.round(ld.percent))).size > 1 ? (
                        pricing.lineDiscounts.map((ld) => {
                          const line = items.find((it) => it.slug === ld.slug);
                          const label = line?.name ?? ld.slug;
                          return (
                            <div key={ld.slug} className="flex justify-between gap-2">
                              <span className="font-body font-[500] text-[13px] text-sage-dark md:text-[14px]">
                                {label} −{Math.round(ld.percent)}%
                              </span>
                              <span className="font-body font-[500] text-[13px] text-sage-dark tabular-nums md:text-[14px]">
                                −{formatRsd(ld.amountRsd)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex justify-between gap-2">
                          <span className="font-body font-[500] text-[13px] text-sage-dark md:text-[14px]">
                            {pricing.discountType === 'bundle'
                              ? `Paket popust −${Math.round(pricing.discountPercent)}%`
                              : `Popust −${Math.round(pricing.discountPercent)}%`}
                          </span>
                          <span className="font-body font-[500] text-[13px] text-sage-dark tabular-nums md:text-[14px]">
                            −{formatRsd(pricing.discountAmountRsd)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {pricing && pricing.referralDiscountPercent > 0 && (
                    <div className="flex justify-between gap-2">
                      <span className="font-body font-[500] text-[13px] text-sage-dark md:text-[14px]">
                        Promo kod −{Math.round(pricing.referralDiscountPercent)}%
                      </span>
                      <span className="font-body font-[500] text-[13px] text-sage-dark tabular-nums md:text-[14px]">
                        −{formatRsd(pricing.referralDiscountRsd)}
                      </span>
                    </div>
                  )}
                  {pricing ? (
                    <div className="flex justify-between gap-2">
                      <span className="font-body font-[400] text-[13px] text-ink-soft md:text-[14px]">
                        Proizvodi
                      </span>
                      <span className="font-body font-[500] text-[14px] text-ink tabular-nums md:text-[15px]">
                        {formatRsd(productsTotal)}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-2">
                    <span className="font-body font-[500] text-[13px] text-ink md:text-[14px]">
                      Poštarina ({SHIPPING_CARRIER})
                    </span>
                    {freeShipping ? (
                      <span className="font-body font-[600] text-[14px] text-sage-dark tabular-nums md:text-[15px]">
                        Besplatno
                      </span>
                    ) : (
                      <span className="font-body font-[500] text-[14px] text-ink tabular-nums md:text-[15px]">
                        {formatRsd(shippingRsd)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-2 pt-2 border-t-2 border-ink/10 md:pt-3">
                    <span className="font-body font-[600] text-[13px] uppercase tracking-[0.08em] text-ink md:text-[14px]">
                      Ukupno
                    </span>
                    <span className="font-body font-[600] text-[20px] text-ink tabular-nums leading-none md:text-[22px]">
                      {pricing ? formatRsd(totalForApi) : '…'}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
