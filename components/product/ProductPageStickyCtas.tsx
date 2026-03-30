'use client';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

/**
 * Mob (< md): oba CTA fiksirana uz donju ivicu ekrana, uvek vidljiva pri skrolu.
 * md+: isti sadržaj u normalnom toku u sticky koloni.
 */
export default function ProductPageStickyCtas({ children }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[39] border-t border-silver-light bg-[rgba(250,250,248,0.96)] px-6 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(28,28,26,0.06)] backdrop-blur-[8px] md:static md:z-auto md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 md:max-w-none md:gap-0">
        {children}
      </div>
    </div>
  );
}
