export interface Testimonial {
  quote: string;
  name: string;
  product?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: 'Nikad nisam vjerovala da će dva proizvoda biti dovoljna. Nakon mjesec dana, koža mi je potpuno transformisana — mirna, sjajna, bez iritacija.',
    name: 'Amina K.',
    product: 'Oba seruma',
  },
  {
    quote: 'Uljani serum je nešto posebno. Upija se za minutu, a koža cijeli dan izgleda kao da sjaji iznutra. Bez masnog filma, bez začepljenih pora.',
    name: 'Maja R.',
    product: 'Uljani serum',
  },
  {
    quote: 'Konačno formulacija koju razumijem. Svaki sastojak ima smisao. Moja osjetljiva koža je prvi put prihvatila serum bez ikakve reakcije.',
    name: 'Lana T.',
    product: 'Vodeni serum',
  },
  {
    quote: 'Ritual od dva koraka je genijalan. Jednostavno, brzo, i rezultati su vidljivi već nakon dvije sedmice. Više mi ne treba ništa drugo.',
    name: 'Sara M.',
    product: 'Oba seruma',
  },
  {
    quote: 'Miris uljnog seruma je subtilan i prirodan — ne sintetički. Osjećam se kao da koristim nešto što je napravljeno samo za mene.',
    name: 'Lejla H.',
    product: 'Uljani serum',
  },
  {
    quote: 'Hidratacija koja traje cijeli dan. Vodeni serum pod šminkom radi savršeno — koža nije suha, šminka se ne raspada.',
    name: 'Nina P.',
    product: 'Vodeni serum',
  },
];
