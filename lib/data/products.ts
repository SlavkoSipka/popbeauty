export interface Product {
  slug: string;
  /** Slika za karticu na početnoj */
  image: string;
  name: string;
  tagline: string;
  step: number;
  stepLabel: string;
  type: string;
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
  /** Upozorenje za upotrebu (opciono) */
  warning?: string;
  /** Podaci sa etikete (barkod, poreklo, rok trajanja) */
  labelInfo?: {
    barcode?: string;
    countryOfOrigin?: string;
    shelfLife?: string;
  };
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
  {
    slug: 'dzem',
    image: '/dzem2.webp',
    name: 'Glow Marmelada',
    tagline: 'Marmelada za bronzani ten',
    step: 1,
    stepLabel: 'Korak prvi',
    type: 'Glow Marmelada',
    description: 'Bogata kombinacija prirodnih biljnih ulja i butera za preplanuli izgled tokom sunčanja.',
    fullDescription:
      'Bogata kombinacija prirodnih biljnih ulja i butera neguje kožu i doprinosi postizanju preplanulog izgleda tokom sunčanja. Hrani i omekšava kožu, ostavljajući je glatkom, svilenkastom i blistavom.',
    volume: '50ml',
    price: '1.990,00 RSD',
    ingredients: [
      { name: 'Kokosovo ulje', benefit: '' },
      { name: 'Bademovo ulje', benefit: '' },
      { name: 'Beli vosak', benefit: '' },
      { name: 'Maslinovo ulje', benefit: '' },
      { name: 'Shea buter', benefit: '' },
      { name: 'Macerat nevena', benefit: '' },
      { name: 'Macerat šargarepe', benefit: '' },
      { name: 'Ulje oraha', benefit: '' },
      { name: 'Ulje semenki paradajza', benefit: '' },
      { name: 'Vitamin E', benefit: '' },
      { name: 'Miris', benefit: '' },
      { name: 'Mica (šljokice)', benefit: '' },
    ],
    inci:
      'Cocos Nucifera Oil, Prunus Amygdalus Dulcis Oil, Cera Alba, Olea Europaea Fruit Oil, Butyrospermum Parkii Butter, Helianthus Annuus Seed Oil, Calendula Officinalis Flower Extract, Daucus Carota Sativa Root Extract, Juglans Regia Seed Oil, Solanum Lycopersicum Seed Oil, Tocopherol, Parfum, Mica.',
    howToUse:
      'Naneti ravnomerno na čistu i suvu kožu pre izlaganja suncu. Po potrebi ponoviti nanošenje tokom sunčanja. Proizvod ne sadrži UV filtere i ne pruža zaštitu od sunčevog zračenja.',
    warning:
      'Izbegavati prekomerno izlaganje suncu. Proizvod nije zamena za preparate sa zaštitnim faktorom. Samo za spoljašnju upotrebu.',
    benefits: [
      'Ubrzava potamljivanje',
      'Hrani i omekšava kožu',
      'Prepun zdravih sastojaka za kožu',
    ],
  },
  {
    slug: 'mist',
    image: '/mist2.webp',
    name: 'Glow Mist',
    tagline: 'Hidratantni umirujući mist za lice',
    step: 2,
    stepLabel: 'Korak drugi',
    type: 'Mist',
    description: 'Lagani hidratantni mist koji osvežava, umiruje i održava osećaj hidriranosti bez opterećivanja kože.',
    fullDescription:
      'Lagani hidratantni mist obogaćen aktivnim sastojcima koji pomažu u osvežavanju i umirivanju kože. Idealan za svakodnevnu upotrebu, tokom dana ili kao dodatni korak u nezi kože. Pomaže u održavanju osećaja hidriranosti i komfora, bez opterećivanja kože.',
    volume: '100ml',
    price: '690,00 RSD',
    ingredients: [
      { name: 'Voda', benefit: '' },
      { name: 'Aloja', benefit: '' },
      { name: 'Propanediol', benefit: '' },
      { name: 'Niacinamid', benefit: '' },
      { name: 'Glicerin', benefit: '' },
      { name: 'Ekstrakt zmajevog voća', benefit: '' },
      { name: 'Konzervans', benefit: '' },
      { name: 'Miris', benefit: '' },
    ],
    inci:
      'Aqua, Aloe Barbadensis Leaf Juice, Propanediol, Niacinamide, Glycerin, Hylocereus Undatus Extract, Benzyl Alcohol, Dehydroacetic Acid, Parfum, Sodium Gluconate.',
    howToUse:
      'Raspršiti ravnomerno na lice sa udaljenosti 20–30 cm, na čistu kožu ili preko šminke po potrebi. Ne utrljavati. Može se koristiti više puta dnevno.',
    warning:
      'Samo za spoljašnju upotrebu. Izbegavati kontakt sa očima. U slučaju iritacije, prekinuti upotrebu.',
    labelInfo: {
      countryOfOrigin: 'Srbija',
      shelfLife: '24 meseca od datuma proizvodnje',
    },
    benefits: [
      'Osvežava i umiruje kožu',
      'Lagana hidratacija bez opterećivanja',
      'Idealan za svakodnevnu upotrebu',
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

export interface ProductBundle {
  slug: string;
  name: string;
  image: string;
  slugA: string;
  slugB: string;
  fullDescription: string;
  ingredients: { name: string }[];
  howToUse: string;
}

export const dzemMistSet: ProductBundle = {
  slug: 'dzem-mist',
  name: 'Glow Marmelada + Glow Mist',
  image: '/dzem-mist1.webp',
  slugA: 'dzem',
  slugB: 'mist',
  fullDescription:
    'Paket Glow Marmelada + Glow Mist spaja dva proizvoda za kompletnu negu — marmeladu za bronzani ten i hidratantni mist za osveženje i umirenje kože. U paketu dobijaš oba proizvoda po povoljnijoj ceni.',
  ingredients: [],
  howToUse: '',
};

/** Veliki paket: oba seruma + Glow Marmelada + Glow Mist. */
export interface MultiBundle {
  slug: string;
  name: string;
  image: string;
  slugs: string[];
  fullDescription: string;
  ingredients: { name: string }[];
  howToUse: string;
}

export const popBeautyPaket: MultiBundle = {
  slug: 'pop-beauty-paket',
  name: 'Pop Beauty paket',
  image: '/paket.webp',
  slugs: ['uljani-serum', 'vodeni-serum', 'dzem', 'mist'],
  fullDescription:
    'Pop Beauty paket je kompletan ritual nege za lice — vodeni serum, uljani serum, Glow Marmelada i Glow Mist u jednom setu. Hidratacija, nega, bronzani ten i svakodnevno osveženje kože, uz najveću uštedu.',
  ingredients: [],
  howToUse: '',
};
