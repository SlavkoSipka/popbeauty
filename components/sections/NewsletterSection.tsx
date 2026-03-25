'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-[100px] bg-ink section-padding">
      <div className="mx-auto max-w-[600px] px-6 text-center">
        <h2
          data-reveal="true"
          className="font-display font-[300] italic text-[clamp(32px,4vw,42px)] text-white mb-4"
        >
          Ostanite u toku
        </h2>
        <p
          data-reveal="true"
          data-reveal-delay="100"
          className="font-body font-[300] text-[14px] text-silver-mid mb-10"
        >
          Prijavite se za savjete o njezi kože, novosti o proizvodima i ekskluzivne ponude.
        </p>

        {submitted ? (
          <p
            data-reveal="true"
            className="font-body font-[300] text-[14px] text-sage-mid"
          >
            Hvala! Uspješno ste se prijavili.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            data-reveal="true"
            data-reveal-delay="200"
            className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Vaša email adresa"
              required
              className="flex-1 border border-silver-dark bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-white placeholder:text-silver-dark focus:border-silver-mid focus:outline-none transition-colors duration-200"
            />
            <button
              type="submit"
              className="border border-white text-white px-6 py-3 font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-white hover:text-ink transition-colors duration-200"
            >
              Prijavi se
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
