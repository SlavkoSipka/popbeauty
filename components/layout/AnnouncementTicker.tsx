const items = [
  'Besplatna dostava za sve porudžbine iznad 4000 rsd.',
  'Plaćanje pouzećem',
  'Ručno pravljeno u Srbiji',
];

function TickerDot() {
  return (
    <span
      className="inline-block h-1 w-1 shrink-0 bg-[#FBFAED]/70"
      style={{ borderRadius: '50%' }}
      aria-hidden
    />
  );
}

function TickerSegment() {
  return (
    <span className="inline-flex items-center gap-5 px-5 shrink-0">
      {items.map((text) => (
        <span key={text} className="inline-flex items-center gap-5">
          <span className="font-body font-[500] text-[11px] uppercase tracking-[0.14em] text-[#FBFAED] whitespace-nowrap">
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
      className="h-10 overflow-hidden border-b border-[#FBFAED]/15 bg-[#A1A797]"
      aria-label="Obaveštenja"
    >
      <div className="announcement-marquee-track flex h-full items-center">
        <TickerSegment />
        <span className="announcement-marquee-duplicate" aria-hidden>
          <TickerSegment />
        </span>
      </div>
    </div>
  );
}
