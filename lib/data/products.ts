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
    image: '/zuti.webp',
    name: 'Uljani serum za lice',
    tagline: 'Botanički uljani kompleks za obnovu i sjaj',
    step: 1,
    stepLabel: 'Korak prvi',
    type: 'Uljani',
    description: 'Liposolubilni aktivni sastojci koji prodiru duboko u kožu, obnavljaju lipidnu barijeru i daju prirodan sjaj.',
    fullDescription: 'Naš uljani serum kombinuje pažljivo odabrana biljna ulja koja rade u sinergiji s prirodnim lipidima vaše kože. Svaka kap sadrži koncentrirane botaničke ekstrakte koji prodiru duboko u epidermis, obnavljajući lipidnu barijeru i pružajući intenzivnu njegu. Formulisan bez sintetičkih mirisa, silikona i mineralnih ulja — samo čista botanička snaga.',
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
    howToUse: 'Nanesite 3–4 kapi na čistu kožu lica ujutro i uveče. Lagano umasirajte pokretima prema gore. Nanosi se kao prvi korak u ritualu, prije vodenog seruma. Sačekajte 30 sekundi da se upije prije nanošenja sljedećeg proizvoda.',
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
    fullDescription: 'Vodeni serum je drugi korak u našem ritualu — lagana, brzo-upijajuća formula koja dostavlja intenzivnu hidrataciju u dublje slojeve kože. Hialuronska kiselina i poliglutaminska kiselina zajedno grade višeslojnu hidratacijsku mrežu, dok niacinamid ujednačava ten i smanjuje pore. Obogaćen alojom i pantenolom za vidljivo svjež i umiren ten.',
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
    howToUse: 'Nanesite 2–3 pumpe na lice i vrat nakon uljnog seruma. Lagano utisnite u kožu dlanovima — ne trljajte. Vodeni serum se nanosi kao drugi korak, kada uljna baza već pripremi kožu za optimalnu apsorpciju hidrosolubilnih aktivnih sastojaka.',
    benefits: [
      'Intenzivna višeslojna hidratacija',
      'Vidljivo ujednačava ten',
      'Smanjuje fine linije od dehidracije',
      'Priprema kožu za dnevnu ili noćnu njegu',
      'Osvježava i revitalizira umoran ten',
    ],
  },
];
