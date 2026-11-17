// Sample data for the Marlowe Tea dashboard. Everything is generated from a fixed
// seed, so the server and the browser render the same numbers, and every total on
// screen is computed from these rows (KPIs, chart, channels and customers add up).

export type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

// Small seeded generator (mulberry32): the same sequence on every run.
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 86_400_000;
/** "Today" in the sample: fixed, so screenshots and tests never drift. */
export const TODAY = Date.UTC(2026, 10, 11);
export const dayLabel = (ms: number) => {
  const d = new Date(ms);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
};
export const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
export const money2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ---------------------------------------------------------------- Daily metrics
export type Day = { date: number; revenue: number; orders: number; sessions: number };

// 180 days: the last 90 are shown, the 90 before them are the comparison period.
export const DAYS: Day[] = (() => {
  const rand = seeded(7);
  // Weekends sell more tea. Sunday first.
  const week = [1.18, 0.9, 0.86, 0.92, 0.98, 1.1, 1.26];
  return Array.from({ length: 180 }, (_, i) => {
    const date = TODAY - (179 - i) * DAY;
    const trend = 1180 + i * 5.2;
    const promo = i > 150 && i < 158 ? 1.35 : 1; // a late-October sale
    const revenue = Math.round(trend * week[new Date(date).getUTCDay()] * promo * (0.88 + rand() * 0.24));
    const orders = Math.max(1, Math.round(revenue / (36 + rand() * 6)));
    const sessions = Math.round(orders / (0.029 + rand() * 0.008 + i * 0.00002));
    return { date, revenue, orders, sessions };
  });
})();

export const RANGES = [
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
] as const;
export type RangeId = (typeof RANGES)[number]['id'];

const sum = (list: number[]) => list.reduce((a, b) => a + b, 0);
const change = (now: number, before: number) => ((now - before) / before) * 100;

/** Everything the overview shows for one range, with the period before it for comparison. */
export function summarize(range: RangeId) {
  const n = RANGES.find((r) => r.id === range)!.days;
  const current = DAYS.slice(-n);
  const previous = DAYS.slice(-2 * n, -n);
  const total = (rows: Day[]) => {
    const revenue = sum(rows.map((d) => d.revenue));
    const orders = sum(rows.map((d) => d.orders));
    const sessions = sum(rows.map((d) => d.sessions));
    return { revenue, orders, aov: revenue / orders, conversion: (orders / sessions) * 100 };
  };
  const now = total(current);
  const before = total(previous);
  // Channel shares shift a little with the range; the last one takes the rounding remainder.
  const shares = range === '7d' ? [0.46, 0.24, 0.16, 0.09] : range === '30d' ? [0.44, 0.25, 0.17, 0.08] : [0.42, 0.26, 0.18, 0.08];
  const names = ['Online store', 'Subscriptions', 'Wholesale', 'Marketplace', 'Pop-up shops'];
  const parts = shares.map((s) => Math.round(now.revenue * s));
  const channels = names.map((name, i) => ({ name, value: i < parts.length ? parts[i] : now.revenue - sum(parts) }));
  return {
    days: n,
    current,
    previous,
    from: dayLabel(current[0].date),
    to: `${dayLabel(current[n - 1].date)}, 2026`,
    channels,
    kpis: [
      { id: 'revenue', label: 'Revenue', value: money(now.revenue), delta: change(now.revenue, before.revenue), unit: '%', spark: current.map((d) => d.revenue) },
      { id: 'orders', label: 'Orders', value: now.orders.toLocaleString('en-US'), delta: change(now.orders, before.orders), unit: '%', spark: current.map((d) => d.orders) },
      { id: 'aov', label: 'Average order', value: money2(now.aov), delta: change(now.aov, before.aov), unit: '%', spark: current.map((d) => d.revenue / d.orders) },
      { id: 'conversion', label: 'Conversion', value: `${now.conversion.toFixed(2)}%`, delta: now.conversion - before.conversion, unit: ' pt', spark: current.map((d) => (d.orders / d.sessions) * 100) },
    ],
  };
}

// ---------------------------------------------------------------- Orders
export type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';
export type Line = { name: string; qty: number; price: number };
export type Order = {
  id: string;
  customer: string;
  email: string;
  date: number;
  channel: string;
  status: OrderStatus;
  lines: Line[];
  total: number;
};

export const STATUS_COLOR = { Paid: 'success', Pending: 'warning', Refunded: 'neutral', Failed: 'danger' } as const;

const PRODUCTS: [string, number][] = [
  ['Jasmine Pearls, 100 g', 18],
  ['Earl Grey Reserve, 250 g', 24],
  ['Sencha Fukamushi, 100 g', 21],
  ['Masala Chai Blend, 250 g', 16],
  ['Glass Teapot, 600 ml', 34],
  ['Matcha Starter Kit', 48],
  ['Oolong Sampler, 6 teas', 29],
  ['Cast-iron Kettle', 72],
];

const PEOPLE = [
  'Ines Castillo', 'Tomas Lindqvist', 'Priya Raman', 'Dara Okonkwo', 'Jun Takeda', 'Mirela Popa',
  'Callum Reyes', 'Noor Haddad', 'Sofia Brandt', 'Elio Marchetti', 'Wren Abara', 'Hana Kovac',
  'Luca Ferrand', 'Amara Diallo', 'Theo Vance', 'Yuki Morimoto',
];
export const emailFor = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`;
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export const ORDERS: Order[] = (() => {
  const rand = seeded(42);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
  const channels = ['Online store', 'Online store', 'Online store', 'Subscriptions', 'Wholesale', 'Marketplace'];
  return Array.from({ length: 48 }, (_, i) => {
    const lines: Line[] = [];
    const count = 1 + Math.floor(rand() * 3);
    while (lines.length < count) {
      const [name, price] = pick(PRODUCTS);
      if (!lines.some((l) => l.name === name)) lines.push({ name, price, qty: 1 + Math.floor(rand() * 2.4) });
    }
    const roll = rand();
    const status: OrderStatus = i < 6 && roll < 0.5 ? 'Pending' : roll < 0.78 ? 'Paid' : roll < 0.88 ? 'Pending' : roll < 0.95 ? 'Refunded' : 'Failed';
    const customer = pick(PEOPLE);
    return {
      id: `MT-${3184 - i}`,
      customer,
      email: emailFor(customer),
      date: TODAY - Math.floor(i / 4) * DAY,
      channel: pick(channels),
      status,
      lines,
      total: sum(lines.map((l) => l.price * l.qty)),
    };
  });
})();

// ---------------------------------------------------------------- Customers
export type Customer = { name: string; email: string; city: string; since: string; tier: 'Member' | 'Regular' | 'New' };
const CITIES = ['Lisbon', 'Malmö', 'Chennai', 'Lagos', 'Osaka', 'Cluj', 'Austin', 'Amman', 'Hamburg', 'Turin', 'Accra', 'Zagreb', 'Lyon', 'Dakar', 'Leeds', 'Kyoto'];
export const CUSTOMERS: Customer[] = PEOPLE.map((name, i) => ({
  name,
  email: emailFor(name),
  city: CITIES[i],
  since: `${MONTHS[(i * 5) % 12]} ${2022 + (i % 4)}`,
  tier: i % 3 === 0 ? 'Member' : i % 3 === 1 ? 'Regular' : 'New',
}));

// ---------------------------------------------------------------- Activity
export const ACTIVITY = [
  { who: 'Priya Raman', what: 'started a monthly subscription', when: '12 min ago', tone: 'success' },
  { who: 'Stock alert', what: 'Matcha Starter Kit is down to 8 units', when: '41 min ago', tone: 'warning' },
  { who: 'Jun Takeda', what: 'left a 5-star review on Sencha Fukamushi', when: '2 h ago', tone: 'info' },
  { who: 'Payout', what: '$4,812.40 sent to your bank account', when: '5 h ago', tone: 'success' },
  { who: 'Callum Reyes', what: 'asked for a refund on a damaged teapot', when: 'Yesterday', tone: 'danger' },
] as const;
