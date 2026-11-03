// Sample data for the /demo admin app. Everything here is fictional.
export type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';
export type Order = { id: string; customer: string; email: string; amount: number; status: OrderStatus; date: string; items: number };
export type Customer = { id: string; name: string; email: string; plan: 'Free' | 'Pro' | 'Team'; spent: number; status: 'online' | 'away' | 'offline'; joined: string };

const NAMES = [
  'Sam Rivera', 'Priya Nair', 'Leo Martins', 'Mina Park', 'Jonas Weber', 'Ava Chen', 'Omar Haddad', 'Lucia Romero',
  'Noah Kim', 'Ella Brooks', 'Kenji Sato', 'Zara Ali', 'Theo Dubois', 'Ines Costa', 'Ravi Patel', 'Maya Cohen',
];
const STATUS: OrderStatus[] = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Refunded', 'Paid', 'Failed'];

const email = (n: string) => `${n.toLowerCase().replace(' ', '.')}@example.com`;
// Deterministic pseudo-random so server and client render the same numbers.
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export const ORDERS: Order[] = Array.from({ length: 36 }, (_, i) => {
  const customer = NAMES[i % NAMES.length];
  return {
    id: `#${(4821 - i).toString()}`,
    customer,
    email: email(customer),
    amount: Math.round(20 + rand(i + 1) * 480),
    status: STATUS[i % STATUS.length],
    date: `Oct ${String(28 - (i % 28)).padStart(2, '0')}, 2026`,
    items: 1 + Math.floor(rand(i + 7) * 5),
  };
});

export const CUSTOMERS: Customer[] = NAMES.map((name, i) => ({
  id: `c${i + 1}`,
  name,
  email: email(name),
  plan: (['Pro', 'Team', 'Free', 'Pro'] as const)[i % 4],
  spent: Math.round(200 + rand(i + 3) * 4800),
  status: (['online', 'away', 'offline'] as const)[i % 3],
  joined: `${['Jan', 'Mar', 'May', 'Jul', 'Sep'][i % 5]} 2026`,
}));

export const RANGES = {
  week: { label: '7 days', revenue: 12480, orders: 214, customers: 61, conversion: 3.2, bars: [42, 55, 48, 70, 62, 84, 76] },
  month: { label: '30 days', revenue: 48210, orders: 912, customers: 238, conversion: 3.6, bars: [30, 44, 38, 52, 47, 61, 58, 66, 72, 69, 80, 88] },
  quarter: { label: '90 days', revenue: 139900, orders: 2731, customers: 702, conversion: 3.9, bars: [40, 46, 52, 50, 58, 63, 61, 70, 76, 74, 83, 92] },
} as const;
export type RangeId = keyof typeof RANGES;

export const STATUS_COLOR: Record<OrderStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'neutral',
  Failed: 'danger',
};

export const money = (n: number) => `$${n.toLocaleString('en-US')}`;
