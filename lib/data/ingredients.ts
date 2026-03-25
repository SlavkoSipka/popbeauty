export interface Ingredient {
  name: string;
  origin: string;
  benefit: string;
  product: 'uljani' | 'vodeni' | 'oba';
}

export const featuredIngredients: Ingredient[] = [
  {
    name: 'Ulje šipka',
    origin: 'Divlja ruža, Čile',
    benefit: 'Stimuliše obnovu ćelija, bogato vitaminom C',
    product: 'uljani',
  },
  {
    name: 'Skvalan',
    origin: 'Masline, Mediteran',
    benefit: 'Zaključava hidrataciju bez začepljivanja pora',
    product: 'uljani',
  },
  {
    name: 'Hialuronska kiselina',
    origin: 'Biofermentacija',
    benefit: 'Trostruki kompleks za duboku hidrataciju',
    product: 'vodeni',
  },
  {
    name: 'Niacinamid',
    origin: 'Vitamin B3',
    benefit: 'Ujednačava ten i smanjuje pore',
    product: 'vodeni',
  },
  {
    name: 'Ulje smilja',
    origin: 'Helichrysum, Mediteran',
    benefit: 'Antiinflamatorno djelovanje i zacjeljivanje',
    product: 'uljani',
  },
  {
    name: 'Ekstrakt zelenog čaja',
    origin: 'Camellia Sinensis, Japan',
    benefit: 'Moćan antioksidant protiv preranog starenja',
    product: 'vodeni',
  },
];
