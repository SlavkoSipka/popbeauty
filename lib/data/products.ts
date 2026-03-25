export interface Product {
  slug: string;
  /** Slika za karticu na početnoj */
  image: string;
  name: string;
  tagline: string;
  step: number;
  stepLabel: string;
  type: 'Uljani' | 'Vodeni';
  description: string;
  fullDescription: string;
  volume: string;
  price: string;
  ingredients: {
    name: string;
    latin?: string;
    benefit: string;
  }[];
  howToUse: string;
  benefits: string[];
}

export const products: Product[] = [
  {
    slug: 'uljani-serum',
    image: '/zuti.webp',
    name: 'Uljani serum za lice',
    tagline: 'Botanički uljani kompleks za obnovu i sjaj',
    step: 1,
    stepLabel: 'Korak prvi',
    type: 'Uljani',
    description: 'Liposolubilni aktivni sastojci koji prodiru duboko u kožu, obnavljaju lipidnu barijeru i daju prirodan sjaj.',
    fullDescription: 'Naš uljani serum kombinuje pažljivo odabrane biljne ulje koje rade u sinergiji s prirodnim lipidima vaše kože. Svaka kap sadrži koncentrirane botaničke ekstrakte koji prodiru duboko u epidermis, obnavljajući lipidnu barijeru i pružajući intenzivnu njegu. Formulisan bez sintetičkih mirisa, silikonа i mineralnih ulja — samo čista botanička snaga.',
    volume: '30ml',
    price: '48,00 KM',
    ingredients: [
      { name: 'Ulje šipka', latin: 'Rosa Canina', benefit: 'Bogato vitaminom C i retinolnom kiselinom, stimuliše obnovu ćelija' },
      { name: 'Ulje jojobe', latin: 'Simmondsia Chinensis', benefit: 'Najsličniji prirodnom sebumu kože, reguliše masnoću' },
      { name: 'Skvalan', latin: 'Squalane', benefit: 'Lagani emolijent koji zaključava hidrataciju bez začepljivanja pora' },
      { name: 'Ulje smilja', latin: 'Helichrysum Italicum', benefit: 'Antiinflamatorno, ubrzava zacjeljivanje i smanjuje crvenilo' },
      { name: 'Vitamin E', latin: 'Tocopherol', benefit: 'Antioksidant koji štiti od slobodnih radikala i UV oštećenja' },
      { name: 'Ulje tamjana', latin: 'Boswellia Carterii', benefit: 'Podstiče elastičnost i tonus kože' },
    ],
    howToUse: 'Nanesite 3-4 kapi na čistu kožu lica ujutro i uveče. Lagano umasirajte pokretima prema gore. Nanosi se kao prvi korak u ritualu, prije vodenog seruma. Sačekajte 30 sekundi da se upije prije nanošenja sljedećeg proizvoda.',
    benefits: [
      'Obnavlja lipidnu barijeru',
      'Pruža dubok sjaj bez masnog osjećaja',
      'Smiruje iritacije i crvenilo',
      'Štiti od vanjskih agresora',
      'Poboljšava teksturu kože',
    ],
  },
  {
    slug: 'vodeni-serum',
    image: '/zeleni.webp',
    name: 'Vodeni serum za lice',
    tagline: 'Hidratacijski vodeni kompleks sa hialuronskom kiselinom',
    step: 2,
    stepLabel: 'Korak drugi',
    type: 'Vodeni',
    description: 'Hidrosolubilni aktivni sastojci koji privlače i zadržavaju vlagu, ostavljajući kožu napetom i svježom.',
    fullDescription: 'Vodeni serum je drugi korak u našem ritualu — lagana, brzo-upijajuća formula koja dostavlja intenzivnu hidrataciju u dublje slojeve kože. Trostruki kompleks hialuronske kiseline različitih molekulskih težina osigurava hidrataciju na svakom nivou epidermisa. Obogaćen niacinamidom i botaničkim ekstraktima za vidljivo ujednačen i svjež ten.',
    volume: '30ml',
    price: '42,00 KM',
    ingredients: [
      { name: 'Hialuronska kiselina', latin: 'Sodium Hyaluronate', benefit: 'Trostruki kompleks za hidrataciju na svim nivoima kože' },
      { name: 'Niacinamid', latin: 'Niacinamide (B3)', benefit: 'Ujednačava ten, smanjuje pore i reguliše sebum' },
      { name: 'Aloe vera', latin: 'Aloe Barbadensis', benefit: 'Smiruje, hidrira i pruža trenutni osjećaj svježine' },
      { name: 'Ekstrakt zelenog čaja', latin: 'Camellia Sinensis', benefit: 'Moćan antioksidant koji štiti od preranog starenja' },
      { name: 'Panthenol', latin: 'Provitamin B5', benefit: 'Ubrzava obnovu kože i jača zaštitnu barijeru' },
      { name: 'Ekstrakt kamomile', latin: 'Chamomilla Recutita', benefit: 'Umiruje osjetljivu kožu i smanjuje iritaciju' },
    ],
    howToUse: 'Nanesite 2-3 pumpe na lice i vrat nakon uljnog seruma. Lagano utisnite u kožu dlanovima — ne trljajte. Vodeni serum se nanosi kao drugi korak, kada uljna baza već pripremi kožu za optimalnu apsorpciju hidrosolubilnih aktivnih sastojaka.',
    benefits: [
      'Intenzivna višeslojna hidratacija',
      'Vidljivo ujednačava ten',
      'Smanjuje fine linije od dehidracije',
      'Priprema kožu za dnevnu ili noćnu njegu',
      'Osvježava i revitalizira umoran ten',
    ],
  },
];
