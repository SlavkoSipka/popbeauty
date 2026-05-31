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
  /** Puna INCI lista */
  inci: string;
  howToUse: string;
  benefits: string[];
}

export const products: Product[] = [
  {
    slug: 'uljani-serum',
    image: '/uljani-serum.png',
    name: 'Uljani serum za lice',
    tagline: 'Botanički uljani kompleks za obnovu i sjaj',
    step: 1,
    stepLabel: 'Korak prvi',
    type: 'Uljani',
    description: 'Liposolubilni aktivni sastojci koji prodiru duboko u kožu, obnavljaju lipidnu barijeru i daju prirodan sjaj.',
    fullDescription: 'Serum za lice namenjen svim tipovima kože. Hrani kožu i blago deluje na postojeće bore. Štiti kožu od spoljašnjih uticaja, neguje je i obnavlja. Upotrebom Beauty seruma umanjuješ crvenilo i upalne procese na koži. Odličan za masažu lica.',
    volume: '20ml',
    price: '2.490,00 RSD',
    ingredients: [
      {
        name: 'Skvalan',
        latin: 'Squalane',
        benefit: 'Lagani emolijent koji oponaša prirodne lipide kože, zaključava vlagu bez začepljivanja pora i ostavlja kožu mekanom.',
      },
      {
        name: 'Kaprilik/kaprik triglicerid',
        latin: 'Caprylic/Capric Triglyceride',
        benefit: 'Lagano ulje izvedeno iz kokosa — odlična baza koja olakšava upijanje aktivnih sastojaka i pruža svilenkast osjećaj.',
      },
      {
        name: 'Ulje koštica grožđa',
        latin: 'Vitis Vinifera Seed Oil',
        benefit: 'Bogato linolnom kiselinom i antioksidantima, potiče regeneraciju kože i pruža sjaj bez masnog efekta.',
      },
      {
        name: 'Jojoba ulje',
        latin: 'Simmondsia Chinensis Oil',
        benefit: 'Strukturno najsličniji prirodnom sebu kože — reguliše masnoću i balansira kožni omotač.',
      },
      {
        name: 'Bakuci ulje',
        latin: 'Psoralea Corylifolia Seed Oil',
        benefit: 'Prirodna alternativa retinolu — stimuliše obnovu ćelija, smanjuje bore i ujednačava pigmentaciju.',
      },
      {
        name: 'Ulje šipka',
        latin: 'Rosa Rubiginosa Seed Oil',
        benefit: 'Bogato omega masnim kiselinama i vitaminom A, obnavlja kožu, smanjuje tragove i daje prirodan sjaj.',
      },
      {
        name: 'Vitamin E',
        latin: 'Tocopheryl Acetate',
        benefit: 'Snažan antioksidant koji štiti ulja od oksidacije i kožu od slobodnih radikala i UV oštećenja.',
      },
    ],
    inci: 'Squalane, Caprylic/Capric Triglyceride, Vitis Vinifera Seed Oil, Simmondsia Chinensis Oil, Psoralea Corylifolia Seed Oil, Rosa Rubiginosa Seed Oil, Tocopheryl Acetate.',
    howToUse: 'Na čistu kožu lica prvo nanesite vodeni serum, a zatim uljani serum kao drugi korak. Nanesite 3–4 kapi uljanog seruma i lagano umasirajte pokretima prema gore. Koristite ujutro i uveče.',
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
    image: '/hijaluronski-serum.png',
    name: 'Vodeni serum za lice',
    tagline: 'Hidratacijski vodeni kompleks sa hialuronskom kiselinom',
    step: 2,
    stepLabel: 'Korak drugi',
    type: 'Vodeni',
    description: 'Hidrosolubilni aktivni sastojci koji privlače i zadržavaju vlagu, ostavljajući kožu napetom i svježom.',
    fullDescription: 'Serum za lice namenjen svim tipovima kože. Hrani kožu i blago deluje na postojeće bore. Štiti kožu od spoljašnjih uticaja, neguje je i obnavlja. Upotrebom Beauty seruma umanjuješ crvenilo i upalne procese na koži. Odličan za masažu lica.',
    volume: '30ml',
    price: '2.390,00 RSD',
    ingredients: [
      {
        name: 'Voda',
        latin: 'Aqua',
        benefit: 'Čista voda kao osnova formule — hidratira i olakšava prodor aktivnih sastojaka u kožu.',
      },
      {
        name: 'Aloja',
        latin: 'Aloe Barbadensis Leaf Juice',
        benefit: 'Umiruje, hidrira i pruža trenutni osjećaj svježine; posebno pogodna za osjetljivu i iritiranu kožu.',
      },
      {
        name: 'Niacinamid',
        latin: 'Niacinamide',
        benefit: 'Vitamin B3 koji ujednačava ten, smanjuje vidljivost pora i reguliše produkciju sebuma.',
      },
      {
        name: 'Glicerin',
        latin: 'Glycerin',
        benefit: 'Humektant koji privlači vlagu iz okoline u kožu i zadržava je — osnova svake hidratacijske formule.',
      },
      {
        name: 'Pantenol',
        latin: 'D-Panthenol',
        benefit: 'Provitamin B5 koji ubrzava obnovu kože, jača zaštitnu barijeru i smiruje nadraženu kožu.',
      },
      {
        name: 'Hialuronska kiselina',
        latin: 'Sodium Hyaluronate',
        benefit: 'Privlači i vezuje višestruku količinu vode u koži — intenzivna hidratacija na svim nivoima epidermisa.',
      },
      {
        name: 'Poliglutaminska kiselina',
        latin: 'Gamma Polyglutamic Acid',
        benefit: 'Napredni humektant koji nadmašuje hialuronsku kiselinu u zadržavanju vlage — vidljiva napetost i sjaj.',
      },
      {
        name: 'Konzervans',
        latin: 'Benzyl Alcohol, Dehydroacetic Acid',
        benefit: 'Siguran konzervansni sistem koji čuva stabilnost i svježinu formule.',
      },
    ],
    inci: 'Aqua, Aloe Barbadensis Leaf Juice, Niacinamide, Glycerin, D-Panthenol, Sodium Hyaluronate, Gamma Polyglutamic Acid, Benzyl Alcohol, Dehydroacetic Acid.',
    howToUse: 'Vodeni serum se nanosi prvi, na čistu kožu lica i vrata — 2–3 pumpe lagano utisnite dlanovima. Zatim, kao drugi korak, nanesite uljani serum. Koristite ujutro i uveče.',
    benefits: [
      'Intenzivna višeslojna hidratacija',
      'Vidljivo ujednačava ten',
      'Smanjuje fine linije od dehidracije',
      'Priprema kožu za dnevnu ili noćnu njegu',
      'Osvježava i revitalizira umoran ten',
    ],
  },
];

export interface SerumSet {
  slug: string;
  name: string;
  image: string;
  uljaniSlug: string;
  vodeniSlug: string;
  fullDescription: string;
  ingredients: { name: string }[];
  howToUse: string;
}

export const serumSet: SerumSet = {
  slug: 'serum-set',
  name: 'Serum set',
  image: '/Serumi.png',
  uljaniSlug: 'uljani-serum',
  vodeniSlug: 'vodeni-serum',
  fullDescription:
    'Kompletan ritual nege za lice — vodeni i uljani serum koji rade zajedno. Vodeni serum hidrira i osvežava kožu, dok je uljani serum hrani, štiti i obnavlja. Zajedno umanjuju crvenilo i upalne procese, deluju na postojeće bore i ostavljaju kožu mekom, glatkom i sjajnom. Namenjen svim tipovima kože.',
  ingredients: [
    { name: 'Skvalan' },
    { name: 'Kaprilik/kaprik triglicerid' },
    { name: 'Ulje koštica grožđa' },
    { name: 'Jojoba ulje' },
    { name: 'Bakuci ulje' },
    { name: 'Ulje šipka' },
    { name: 'Vitamin E' },
    { name: 'Aloja' },
    { name: 'Niacinamid' },
    { name: 'Glicerin' },
    { name: 'Pantenol' },
    { name: 'Hialuronska kiselina' },
    { name: 'Poliglutaminska kiselina' },
  ],
  howToUse:
    'Na čistu kožu lica prvo nanesite vodeni serum — 2–3 pumpe lagano utisnite dlanovima. Zatim, kao drugi korak, nanesite 3–4 kapi uljanog seruma i lagano umasirajte pokretima prema gore. Koristite ujutro i uveče.',
};
