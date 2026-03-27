'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import { displayUnitPriceForLine, formatRsd, lineSubtotalRsd } from '@/lib/price';
import { computePricing, type PricingResult } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';
import Button from '@/components/ui/Button';

export default function PorudzbinaPage() {
  useScrollReveal();
  const { items, clearCart } = useCart();
  const { priceMap, siteDiscountPercent, loaded } = usePricingData();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [referralCode, setReferralCode] = useState('');
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
      referralDiscountPercent: 0,
    });
  }, [items, priceMap, siteDiscountPercent, loaded]);

  const totalForApi = pricing?.totalRsd ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: referralCode.trim() || null,
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
      setSubmitted(true);
    } catch {
      setError('Mrežna greška. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="py-[80px] md:py-[120px] section-padding">
        <div className="mx-auto max-w-[960px] px-6">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6 text-center"
          >
            Pop Beauty
          </span>
          <h1
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[300] text-[clamp(32px,5vw,48px)] text-ink text-center mb-4"
          >
            Porudžbina i dostava
          </h1>
          <p
            data-reveal="true"
            data-reveal-delay="200"
            className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark text-center mb-14 max-w-[520px] mx-auto"
          >
            Plaćanje pouzećem. Unesite podatke za slanje — potvrdićemo porudžbinu putem emaila ili telefona.
          </p>

          {empty ? (
            <div
              data-reveal="true"
              data-reveal-delay="300"
              className="text-center py-16 border border-silver-light max-w-[480px] mx-auto"
            >
              <p className="font-body font-[300] text-[15px] text-silver-dark mb-8">
                Korpa je prazna. Dodajte proizvode pre nego što nastavite.
              </p>
              <Link
                href="/#proizvodi"
                className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-[10px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-ink transition-colors duration-200"
              >
                Pogledaj proizvode
              </Link>
            </div>
          ) : submitted ? (
            <div
              data-reveal="true"
              className="text-center py-16 border border-silver-light max-w-[560px] mx-auto"
            >
              <h2 className="font-display font-[300] text-[28px] text-ink mb-4">
                Hvala na porudžbini
              </h2>
              <p className="font-body font-[300] text-[14px] text-silver-dark mb-6">
                Primili smo vaše podatke. Javićemo vam se uskoro radi potvrde i dostave.
              </p>
              <Link
                href="/"
                className="font-body font-[300] text-[13px] text-ink underline underline-offset-4 hover:opacity-70"
              >
                Nazad na početnu
              </Link>
            </div>
          ) : (
            <div
              data-reveal="true"
              data-reveal-delay="300"
              className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-start"
            >
              <form onSubmit={handleSubmit} className="space-y-6 order-2 lg:order-1">
                <div className="border border-silver-light p-5 md:p-6 bg-off-white/40">
                  <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                    Referral kod kreatora{' '}
                    <span className="font-[300] normal-case tracking-normal text-silver-mid">
                      (opciono — daje ti dodatni popust)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="npr. POP-IME1"
                    autoCapitalize="characters"
                    className="w-full border border-silver-light bg-white px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200 uppercase"
                  />
                  <p className="font-body font-[300] text-[11px] text-silver-mid mt-2 leading-relaxed">
                    Imaš kod od influensera? Unesi ga i dobij dodatni popust na porudžbinu.
                  </p>
                </div>

                <h2 className="font-display font-[300] text-[20px] text-ink mb-2 pt-2">
                  Podaci za dostavu
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                      Ime
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                      placeholder="Ime"
                    />
                  </div>
                  <div>
                    <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                      Prezime
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                      placeholder="Prezime"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                    placeholder="vaš@email.com"
                  />
                </div>
                <div>
                  <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                    placeholder="+381 …"
                  />
                </div>
                <div>
                  <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                    Adresa (ulica i broj)
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                    placeholder="Ulica i broj"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                      Grad
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                      className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                      placeholder="Grad"
                    />
                  </div>
                  <div>
                    <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                      Poštanski broj
                    </label>
                    <input
                      type="text"
                      name="postal"
                      required
                      value={postal}
                      onChange={(e) => setPostal(e.target.value)}
                      autoComplete="postal-code"
                      className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                      placeholder="npr. 11000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                    Napomena{' '}
                    <span className="font-[300] normal-case tracking-normal text-silver-mid">
                      (opciono)
                    </span>
                  </label>
                  <textarea
                    name="note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200 resize-none"
                    placeholder="Npr. vreme dostave, dodatne napomene…"
                  />
                </div>
                {error ? (
                  <p className="font-body font-[300] text-[13px] text-red-800" role="alert">
                    {error}
                  </p>
                ) : null}
                <Button variant="filled" type="submit" fullWidth disabled={loading || !loaded}>
                  {loading ? 'Šaljem…' : 'Pošalji porudžbinu'}
                </Button>
              </form>

              <aside className="order-1 lg:order-2 border border-silver-light p-6 lg:sticky lg:top-28">
                <h2 className="font-display font-[300] text-[18px] text-ink mb-6">Pregled korpe</h2>
                <ul className="flex flex-col gap-5 mb-6">
                  {items.map((line) => (
                    <li key={line.slug} className="flex gap-3">
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-sage-pale">
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          className="object-contain object-center p-1"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-body font-[400] text-[14px] text-ink leading-snug">
                          {line.name}
                        </p>
                        <p className="font-body font-[300] text-[12px] text-silver-dark mt-0.5">
                          {loaded
                            ? displayUnitPriceForLine(line, priceMap)
                            : displayUnitPriceForLine(line)}{' '}
                          × {line.quantity}
                        </p>
                      </div>
                      <p className="font-body font-[400] text-[13px] text-ink tabular-nums shrink-0">
                        {loaded
                          ? formatRsd(lineSubtotalRsd(line, priceMap))
                          : formatRsd(lineSubtotalRsd(line))}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Discount breakdown */}
                <div className="border-t border-silver-light pt-4 space-y-2">
                  {pricing && pricing.discountType && (
                    <>
                      <div className="flex justify-between gap-2">
                        <span className="font-body font-[300] text-[12px] text-silver-dark">
                          Bez popusta
                        </span>
                        <span className="font-body font-[300] text-[13px] text-silver-dark tabular-nums line-through">
                          {formatRsd(pricing.subtotalRsd)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="font-body font-[300] text-[12px] text-sage-mid">
                          {pricing.discountType === 'bundle'
                            ? `Paket popust −${pricing.discountPercent}%`
                            : `Popust −${pricing.discountPercent}%`}
                        </span>
                        <span className="font-body font-[300] text-[12px] text-sage-mid tabular-nums">
                          −{formatRsd(pricing.discountAmountRsd)}
                        </span>
                      </div>
                    </>
                  )}
                  {referralCode.trim() && (
                    <p className="font-body font-[300] text-[11px] text-silver-mid italic">
                      Referral popust se obračunava na serveru pri slanju.
                    </p>
                  )}
                  <div className="flex items-end justify-between gap-4 pt-2">
                    <span className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink">
                      Ukupno
                    </span>
                    <span className="font-display font-[400] text-[22px] text-ink tabular-nums leading-none">
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
