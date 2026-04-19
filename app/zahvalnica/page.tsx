'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useScrollReveal } from '@/lib/animations';
import { buildHashedUserData, pixelTrackWithUserData } from '@/lib/meta-pixel';

type StoredPurchase = {
  orderId: string | null;
  value: number;
  currency: string;
  contentName: string;
  contentIds: string[];
  contents: { id: string; quantity: number }[];
  numItems: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
};

export default function ZahvalnicaPage() {
  useScrollReveal();

  useEffect(() => {
    let raw: string | null = null;
    try { raw = sessionStorage.getItem('popbeauty-purchase'); } catch { return; }
    if (!raw) return;
    try { sessionStorage.removeItem('popbeauty-purchase'); } catch { /* ignore */ }
    let p: StoredPurchase;
    try { p = JSON.parse(raw) as StoredPurchase; } catch { return; }

    void (async () => {
      const userData = await buildHashedUserData({
        email: p.email,
        phone: p.phone,
        firstName: p.firstName,
        lastName: p.lastName,
      });
      pixelTrackWithUserData(
        'Purchase',
        {
          value: p.value,
          currency: p.currency,
          content_name: p.contentName,
          content_ids: p.contentIds,
          contents: p.contents,
          content_type: 'product',
          num_items: p.numItems,
          ...(p.orderId ? { order_id: p.orderId } : {}),
        },
        userData,
      );
    })();
  }, []);

  return (
    <main>
      <section className="py-[80px] md:py-[120px] section-padding min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-[560px] px-6 w-full text-center">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
          >
            Pop Beauty
          </span>
          <div
            data-reveal="true"
            data-reveal-delay="100"
            className="border border-silver-light py-14 md:py-16 px-6"
          >
            <h1 className="font-display font-[300] text-[clamp(28px,4vw,36px)] text-ink mb-5">
              Hvala na porudžbini
            </h1>
            <p className="font-body font-[300] text-[15px] leading-[1.85] text-silver-dark mb-2">
              Primili smo vaše podatke.
            </p>
            <p className="font-body font-[300] text-[15px] leading-[1.85] text-ink mb-8">
              Pozvaćemo vas da potvrdimo porudžbinu u narednih 24 sata.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-[10px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-ink transition-colors duration-200"
            >
              Nazad na početnu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
