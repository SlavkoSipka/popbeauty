interface ReviewCardProps {
  quote: string;
  name: string;
}

export default function ReviewCard({ quote, name }: ReviewCardProps) {
  return (
    <div className="flex flex-col">
      <div className="w-8 h-[1px] bg-sage-mid mb-6" />
      <blockquote className="font-display font-[300] italic text-[20px] leading-[1.5] text-ink mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <span className="font-body font-[400] text-[11px] uppercase tracking-[0.12em] text-silver-dark">
        {name}
      </span>
    </div>
  );
}
