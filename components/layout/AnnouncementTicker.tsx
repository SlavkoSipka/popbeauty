import {
  FREE_SHIPPING_BELGRADE_LABEL,
  FREE_SHIPPING_THRESHOLD_LABEL,
} from '@/lib/shipping';

const marqueeItems = ['Plaćanje pouzećem', 'Ručno pravljeno u Srbiji'];

function TickerDot() {
  return (
    <span
      className="inline-block h-1 w-1 shrink-0 bg-[#FBFAED]/80"
      style={{ borderRadius: '50%' }}
      aria-hidden
    />
  );
}

function MarqueeSegment() {
  return (
    <span className="inline-flex items-center gap-5 px-5 shrink-0">
      {[FREE_SHIPPING_THRESHOLD_LABEL, ...marqueeItems].map((text) => (
        <span key={text} className="inline-flex items-center gap-5">
          <span className="font-body font-[500] text-[10px] uppercase tracking-[0.1em] text-[#FBFAED]/95 whitespace-nowrap md:text-[11px]">
            {text}
          </span>
          <TickerDot />
        </span>
      ))}
    </span>
  );
}

export default function AnnouncementTicker() {
  return (
    <div
      className="border-b border-[#FBFAED]/20 bg-[#A1A797]"
      aria-label="Obaveštenja"
    >
      <div className="flex min-h-8 items-center justify-center border-b border-[#FBFAED]/15 bg-[#959d8a] px-4 py-1.5 md:min-h-9 md:py-2">
        <p className="text-center font-body font-[600] text-[11px] uppercase tracking-[0.14em] text-[#FBFAED] md:text-[12px] md:tracking-[0.16em]">
          {FREE_SHIPPING_BELGRADE_LABEL}
        </p>
      </div>
      <div className="h-7 overflow-hidden md:h-8">
        <div className="announcement-marquee-track flex h-full items-center">
          <MarqueeSegment />
          <span className="announcement-marquee-duplicate" aria-hidden>
            <MarqueeSegment />
          </span>
        </div>
      </div>
    </div>
  );
}
