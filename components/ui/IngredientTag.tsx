interface IngredientTagProps {
  name: string;
  detail: string;
}

export default function IngredientTag({ name, detail }: IngredientTagProps) {
  return (
    <div className="border border-silver-light p-5 transition-colors duration-200 hover:bg-sage-pale hover:border-sage-mid">
      <h4 className="font-display font-[400] text-[18px] text-ink mb-2">
        {name}
      </h4>
      <p className="font-body font-[300] text-[12px] text-silver-dark leading-[1.6]">
        {detail}
      </p>
    </div>
  );
}
