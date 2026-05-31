type Item = {
  label: string;
  icon: React.ReactNode;
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#A1A797',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const items: Item[] = [
  {
    label: 'Jednostavna i brza isporuka',
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M1 3h13v13H1z" />
        <path d="M14 8h4l3 3v5h-7" />
        <circle cx="6" cy="18.5" r="1.8" />
        <circle cx="17.5" cy="18.5" r="1.8" />
      </svg>
    ),
  },
  {
    label: 'Plati prilikom preuzimanja',
    icon: (
      <svg {...iconProps} aria-hidden>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
  {
    label: 'Besplatna dostava za sve porudžbine iznad 4.000 RSD',
    icon: (
      <svg {...iconProps} aria-hidden>
        <path d="M20 12v9H4v-9" />
        <path d="M2 7h20v5H2z" />
        <path d="M12 22V7" />
        <path d="M12 7S10.5 2 8 2.5 6.5 7 12 7zM12 7s1.5-5 4-4.5S17.5 7 12 7z" />
      </svg>
    ),
  },
];

export default function ProductDeliveryInfo() {
  return (
    <div
      data-reveal="true"
      data-reveal-delay="450"
      className="mt-8 flex flex-col gap-4 md:mt-0"
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="shrink-0">{item.icon}</span>
          <span className="font-body font-[400] text-[14px] text-ink md:text-[15px]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
