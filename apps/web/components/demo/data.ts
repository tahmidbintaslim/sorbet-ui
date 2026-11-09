// Sample data for the /demo admin app. Everything here is fictional.
export type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';
export type Order = { id: string; customer: string; email: string; amount: number; status: OrderStatus; date: string; items: number };
export type Customer = { id: string; name: string; email: string; plan: 'Free' | 'Pro' | 'Team'; spent: number; status: 'online' | 'away' | 'offline'; joined: string };

const NAMES = [
  'Sam Rivera', 'Priya Nair', 'Leo Martins', 'Mina Park', 'Jonas Weber', 'Ava Chen', 'Omar Haddad', 'Lucia Romero',
  'Noah Kim', 'Ella Brooks', 'Kenji Sato', 'Zara Ali', 'Theo Dubois', 'Ines Costa', 'Ravi Patel', 'Maya Cohen',
];
const STATUS: OrderStatus[] = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Refunded', 'Paid', 'Failed'];

/** "Lucía O'Brien-Diaz" -> "lucia.obrien.diaz@example.com". Always returns a usable address. */
export const emailFor = (name: string) => {
  const local = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
  return `${local || 'customer'}@example.com`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "Oct 28, 2026". Formatted by hand so server and client always agree. */
export const formatDate = (d: Date) => `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;

// Deterministic pseudo-random so server and client render the same numbers.
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// One order per day, newest first, so dates are strictly descending.
const LATEST = new Date(2026, 9, 28); // Oct 28, 2026 (local time, no timezone drift)
export const ORDERS: Order[] = Array.from({ length: 36 }, (_, i) => {
  const customer = NAMES[i % NAMES.length];
  return {
    id: `#${(4821 - i).toString()}`,
    customer,
    email: emailFor(customer),
    amount: Math.round(20 + rand(i + 1) * 480),
    status: STATUS[i % STATUS.length],
    date: formatDate(new Date(LATEST.getFullYear(), LATEST.getMonth(), LATEST.getDate() - i)),
    items: 1 + Math.floor(rand(i + 7) * 5),
  };
});

export const CUSTOMERS: Customer[] = NAMES.map((name, i) => ({
  id: `c${i + 1}`,
  name,
  email: emailFor(name),
  plan: (['Pro', 'Team', 'Free', 'Pro'] as const)[i % 4],
  spent: Math.round(200 + rand(i + 3) * 4800),
  status: (['online', 'away', 'offline'] as const)[i % 3],
  joined: `${['Jan', 'Mar', 'May', 'Jul', 'Sep'][i % 5]} 2026`,
}));

// A gently rising series of `n` bar heights (percent of the chart), deterministic.
const series = (n: number, seed: number, from: number, to: number) =>
  Array.from({ length: n }, (_, i) => Math.round(from + ((to - from) * i) / Math.max(1, n - 1) + (rand(seed + i) - 0.5) * 14));

/** Change versus the previous period of the same length. Percent, except conversion (points). */
type Deltas = { revenue: number; orders: number; customers: number; conversion: number };

export const RANGES: Record<
  'week' | 'month' | 'quarter',
  { label: string; unit: 'day' | 'week'; revenue: number; orders: number; customers: number; conversion: number; deltas: Deltas; bars: number[] }
> = {
  // 7 daily bars.
  week: { label: '7 days', unit: 'day', revenue: 12480, orders: 214, customers: 61, conversion: 3.2, deltas: { revenue: 4.2, orders: 3.1, customers: -2.4, conversion: 0.1 }, bars: series(7, 11, 45, 80) },
  // 30 daily bars.
  month: { label: '30 days', unit: 'day', revenue: 48210, orders: 912, customers: 238, conversion: 3.6, deltas: { revenue: 12.4, orders: 8.1, customers: 5.3, conversion: 0.4 }, bars: series(30, 23, 30, 88) },
  // 13 weekly bars (90 days is just under 13 weeks).
  quarter: { label: '90 days', unit: 'week', revenue: 139900, orders: 2731, customers: 702, conversion: 3.9, deltas: { revenue: 18.9, orders: 15.2, customers: 11.7, conversion: 0.7 }, bars: series(13, 41, 38, 92) },
};
export type RangeId = keyof typeof RANGES;

export const STATUS_COLOR: Record<OrderStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'neutral',
  Failed: 'danger',
};

export const money = (n: number) => `$${n.toLocaleString('en-US')}`;
