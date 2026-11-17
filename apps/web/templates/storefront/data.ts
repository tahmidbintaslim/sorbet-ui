// Sample catalog for "Kiln & Co.", a fictional ceramics studio. Products, prices and
// reviews are made up. Product pictures are drawn in ./art.tsx from `shape` + `glaze`.

export type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type Category = 'Mugs' | 'Bowls' | 'Plates' | 'Vases';
export type Shape = 'mug' | 'cup' | 'bowl' | 'deep-bowl' | 'plate' | 'vase' | 'bud-vase';
/** Glazes map to token hues, so every swatch is a design-system color. */
export type Glaze = { id: string; name: string; hue: Accent | 'neutral' };

export type Product = {
  id: string;
  name: string;
  category: Category;
  shape: Shape;
  price: number;
  rating: number;
  reviews: number;
  stock: number;
  glazes: Glaze[];
  blurb: string;
  isNew?: boolean;
};

export const CATEGORIES: Category[] = ['Mugs', 'Bowls', 'Plates', 'Vases'];

const G = {
  sea: { id: 'sea', name: 'Sea glass', hue: 'info' },
  sky: { id: 'sky', name: 'Morning sky', hue: 'primary' },
  moss: { id: 'moss', name: 'Moss', hue: 'success' },
  honey: { id: 'honey', name: 'Honey', hue: 'warning' },
  clay: { id: 'clay', name: 'Red clay', hue: 'danger' },
  plum: { id: 'plum', name: 'Plum', hue: 'secondary' },
  chalk: { id: 'chalk', name: 'Chalk', hue: 'neutral' },
} satisfies Record<string, Glaze>;

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Morning mug', category: 'Mugs', shape: 'mug', price: 28, rating: 4.8, reviews: 214, stock: 18, glazes: [G.sky, G.honey, G.chalk], blurb: 'A 12 oz mug with a thumb rest on the handle. Holds heat well and fits under most espresso machines.' },
  { id: 'p2', name: 'Pour-over cup', category: 'Mugs', shape: 'cup', price: 22, rating: 4.6, reviews: 98, stock: 4, glazes: [G.moss, G.chalk], blurb: 'A handle-less 8 oz cup, unglazed at the foot so it sits warm in the hand.' },
  { id: 'p3', name: 'Everyday bowl', category: 'Bowls', shape: 'bowl', price: 34, rating: 4.9, reviews: 302, stock: 25, glazes: [G.sea, G.clay, G.chalk], blurb: 'Wide and shallow, for salads, noodles and anything with a sauce.', isNew: true },
  { id: 'p4', name: 'Ramen bowl', category: 'Bowls', shape: 'deep-bowl', price: 46, rating: 4.7, reviews: 76, stock: 0, glazes: [G.plum, G.sea], blurb: 'Deep enough for a full bowl of broth, with a rim that keeps chopsticks from rolling off.' },
  { id: 'p5', name: 'Side plate', category: 'Plates', shape: 'plate', price: 24, rating: 4.5, reviews: 121, stock: 40, glazes: [G.honey, G.moss, G.sky], blurb: 'An 8 inch plate for toast, cake or small plates. Stacks flat.' },
  { id: 'p6', name: 'Dinner plate', category: 'Plates', shape: 'plate', price: 38, rating: 4.8, reviews: 189, stock: 12, glazes: [G.chalk, G.sea], blurb: 'A 10.5 inch plate with a low rim. Oven, microwave and dishwasher safe.' },
  { id: 'p7', name: 'Tall vase', category: 'Vases', shape: 'vase', price: 64, rating: 4.9, reviews: 54, stock: 6, glazes: [G.clay, G.plum, G.honey], blurb: 'Thrown in one piece, 11 inches tall. Watertight, with a narrow neck for a few long stems.', isNew: true },
  { id: 'p8', name: 'Bud vase', category: 'Vases', shape: 'bud-vase', price: 26, rating: 4.4, reviews: 67, stock: 30, glazes: [G.sky, G.moss, G.clay], blurb: 'Small enough for a windowsill. Looks best in threes.' },
  { id: 'p9', name: 'Latte mug', category: 'Mugs', shape: 'mug', price: 32, rating: 4.7, reviews: 143, stock: 9, glazes: [G.plum, G.sea], blurb: 'A wider 14 oz mug for milky coffee and soup on cold days.', isNew: true },
  { id: 'p10', name: 'Serving bowl', category: 'Bowls', shape: 'deep-bowl', price: 72, rating: 4.6, reviews: 38, stock: 3, glazes: [G.honey, G.chalk], blurb: 'Big enough for a salad for six. Each one is signed on the base.' },
];

export const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
] as const;
export type SortId = (typeof SORTS)[number]['id'];

export const FREE_SHIPPING = 75;
export const SHIPPING = { standard: { label: 'Standard', detail: '3 to 5 business days', price: 6 }, express: { label: 'Express', detail: 'Next business day', price: 14 } } as const;
export type ShippingId = keyof typeof SHIPPING;

export const money = (n: number) => `$${n.toFixed(2)}`;
