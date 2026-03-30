'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import { displayUnitPriceForLine, formatRsd, lineSubtotalRsd } from '@/lib/price';
import { computePricing, type PricingResult } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';
import Button from '@/components/ui/Button';

export default function PorudzbinaPage() {
  useScrollReveal();
  const router = useRouter();
  const {
    items, clearCart,
    referralCode, referralDiscountPercent,
    setReferral, clearReferral,
  } = useCart();
  const { priceMap, siteDiscountPercent, bundleDiscountPercent, loaded } = usePricingData();

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

  const pricing: PricingResult | null = useMemo(() => {
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

  const totalForApi = pricing?.totalRsd ?? 0;

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

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Slanje nije uspelo.');
        return;
      }

      clearCart();
      router.push('/zahvalnica');
    } catch {
      setError('Mrežna greška. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const fieldInputClass =
    'w-full border border-silver-light bg-transparent px-3 py-2 font-body font-[300] text-[13px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200 md:px-4 md:py-3 md:text-[14px]';
  const fieldLabelClass =
    'block font-body font-[400] text-[10px] uppercase tracking-[0.12em] text-ink mb-1 md:mb-2 md:text-[11px] md:tracking-[0.14em]';

  return (
    <main>
      <section className="py-10 max-md:pt-16 md:py-[120px] section-padding">
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
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 order-2 lg:order-1">
                <h2 className="font-display font-[300] text-[17px] text-ink mb-1.5 pt-1 md:mb-2 md:pt-2 md:text-[20px]">
                  Podaci za dostavu
                </h2>
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
                    <span className="font-[300] normal-case tracking-normal text-silver-mid">
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
                <div className="border border-silver-light p-4 md:p-6 bg-off-white/40">
                  <label className={fieldLabelClass}>
                    Promo kod
                  </label>
                  <div className="flex gap-1.5 md:gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => { setCodeInput(e.target.value); setCodeError(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void applyCode(); } }}
                      placeholder="Unesi kod"
                      autoCapitalize="characters"
                      className="min-w-0 flex-1 border border-silver-light bg-white px-3 py-2 font-body font-[300] text-[13px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200 uppercase md:px-4 md:py-3 md:text-[14px]"
                    />
                    <button
                      type="button"
                      onClick={() => void applyCode()}
                      disabled={codeChecking}
                      className="shrink-0 border border-ink bg-transparent px-3 py-2 font-body font-[400] text-[10px] uppercase tracking-[0.1em] text-ink hover:bg-ink hover:text-white transition-colors disabled:opacity-50 md:px-4 md:py-3 md:text-[11px] md:tracking-[0.12em]"
                    >
                      {codeChecking ? '…' : 'Proveri'}
                    </button>
                  </div>
                  {codeError ? (
                    <p className="font-body font-[300] text-[11px] text-red-800 mt-2" role="alert">
                      {codeError}
                    </p>
                  ) : null}
                  {referralCode && referralDiscountPercent != null && !codeError ? (
                    <p className="font-body font-[300] text-[11px] text-sage-mid mt-2">
                      Kod <span className="font-mono text-ink">{referralCode}</span> — popust{' '}
                      {referralDiscountPercent}%
                    </p>
                  ) : null}
                  {!referralCode && !codeError ? (
                    <p className="font-body font-[300] text-[11px] text-silver-mid mt-2 leading-relaxed">
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
                  <p className="font-body font-[300] text-[12px] text-red-800 md:text-[13px]" role="alert">
                    {error}
                  </p>
                ) : null}
                <Button
                  variant="filled"
                  type="submit"
                  fullWidth
                  disabled={loading || !loaded}
                  className="py-2 text-[10px] tracking-[0.12em] md:py-[10px] md:text-[11px] md:tracking-[0.14em]"
                >
                  {loading ? 'Šaljem…' : 'Pošalji porudžbinu'}
                </Button>
              </form>

              <aside className="order-1 lg:order-2 border border-silver-light p-3 md:p-4 lg:sticky lg:top-28">
                <h2 className="font-display font-[300] text-[14px] text-ink mb-3 md:mb-4 md:text-[15px]">
                  Pregled korpe
                </h2>
                <ul className="flex flex-col gap-2 mb-3 md:mb-4 md:gap-3">
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
                        <p className="font-body font-[400] text-[12px] text-ink leading-snug md:text-[13px]">
                          {line.name}
                        </p>
                        <p className="font-body font-[300] text-[10px] text-silver-dark mt-0.5 md:text-[11px]">
                          {loaded
                            ? displayUnitPriceForLine(line, priceMap)
                            : displayUnitPriceForLine(line)}{' '}
                          × {line.quantity}
                        </p>
                      </div>
                      <p className="font-body font-[400] text-[11px] text-ink tabular-nums shrink-0 md:text-[12px]">
                        {loaded
                          ? formatRsd(lineSubtotalRsd(line, priceMap))
                          : formatRsd(lineSubtotalRsd(line))}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-silver-light pt-2 space-y-1 md:space-y-1.5 md:pt-3">
                  {pricing && pricing.discountType && (
                    <>
                      <div className="flex justify-between gap-2">
                        <span className="font-body font-[300] text-[10px] text-silver-dark md:text-[11px]">
                          Bez popusta
                        </span>
                        <span className="font-body font-[300] text-[11px] text-silver-dark tabular-nums line-through md:text-[12px]">
                          {formatRsd(pricing.subtotalRsd)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="font-body font-[300] text-[10px] text-sage-mid md:text-[11px]">
                          {pricing.discountType === 'bundle'
                            ? `Paket popust −${pricing.discountPercent}%`
                            : `Popust −${pricing.discountPercent}%`}
                        </span>
                        <span className="font-body font-[300] text-[10px] text-sage-mid tabular-nums md:text-[11px]">
                          −{formatRsd(pricing.discountAmountRsd)}
                        </span>
                      </div>
                    </>
                  )}
                  {pricing && pricing.referralDiscountPercent > 0 && (
                    <div className="flex justify-between gap-2">
                      <span className="font-body font-[300] text-[10px] text-sage-dark md:text-[11px]">
                        Promo kod −{pricing.referralDiscountPercent}%
                      </span>
                      <span className="font-body font-[300] text-[10px] text-sage-dark tabular-nums md:text-[11px]">
                        −{formatRsd(pricing.referralDiscountRsd)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-end justify-between gap-2 pt-1 md:pt-1.5">
                    <span className="font-body font-[400] text-[9px] uppercase tracking-[0.12em] text-ink md:text-[10px] md:tracking-[0.14em]">
                      Ukupno
                    </span>
                    <span className="font-body font-[500] text-[16px] text-ink tabular-nums leading-none md:text-[18px]">
                      {pricing ? formatRsd(pricing.totalRsd) : '…'}
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
