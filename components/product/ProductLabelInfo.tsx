type Props = {
  volume: string;
  labelInfo?: {
    barcode?: string;
    countryOfOrigin?: string;
    shelfLife?: string;
  };
};

export default function ProductLabelInfo({ volume, labelInfo }: Props) {
  const rows = [
    { label: 'Zapremina', value: volume },
    labelInfo?.barcode ? { label: 'Barkod', value: labelInfo.barcode } : null,
    labelInfo?.countryOfOrigin ? { label: 'Zemlja porekla', value: labelInfo.countryOfOrigin } : null,
    labelInfo?.shelfLife ? { label: 'Rok trajanja', value: labelInfo.shelfLife } : null,
  ].filter((row): row is { label: string; value: string } => row != null);

  return (
    <dl className="mt-10 flex flex-col gap-3 border-t border-silver-light pt-8">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
          <dt className="shrink-0 font-body font-[600] text-[13px] uppercase tracking-[0.12em] text-ink sm:w-[160px] md:text-[14px]">
            {label}
          </dt>
          <dd className="font-body font-[400] text-[15px] text-ink md:text-[16px]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
