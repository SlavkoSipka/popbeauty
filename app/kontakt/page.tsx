'use client';

import { useState } from 'react';
import { useScrollReveal } from '@/lib/animations';
import Button from '@/components/ui/Button';

export default function KontaktPage() {
  useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <section className="py-[120px] section-padding">
        <div className="mx-auto max-w-[600px] px-6">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6 text-center"
          >
            Javite nam se
          </span>
          <h1
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[300] text-[clamp(36px,5vw,56px)] text-ink text-center mb-6"
          >
            Kontakt
          </h1>
          <p
            data-reveal="true"
            data-reveal-delay="200"
            className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark text-center mb-16"
          >
            Imate pitanje o našim proizvodima, dostavi ili nečem drugom?
            Rado ćemo vam pomoći.
          </p>

          {submitted ? (
            <div data-reveal="true" className="text-center py-16 border border-silver-light">
              <h2 className="font-display font-[300] text-[28px] text-ink mb-4">
                Hvala na poruci
              </h2>
              <p className="font-body font-[300] text-[14px] text-silver-dark">
                Odgovorićemo vam u najkraćem mogućem roku.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} data-reveal="true" data-reveal-delay="300" className="space-y-6">
              <div>
                <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                  Ime
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                  placeholder="Vaše ime"
                />
              </div>
              <div>
                <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
                  placeholder="vaš@email.com"
                />
              </div>
              <div>
                <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
                  Poruka
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Vaša poruka..."
                />
              </div>
              <Button variant="filled" type="submit" fullWidth>
                Pošalji poruku
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
