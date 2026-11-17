// Sample workspace for the settings template: "Juniper Studio", a fictional design
// studio. People, emails, invoices and amounts are all made up.

export type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type Role = 'Owner' | 'Admin' | 'Member' | 'Viewer';
export type Channel = 'email' | 'push' | 'chat';
export type Digest = 'off' | 'daily' | 'weekly';

export const WORKSPACE = { name: 'Juniper Studio', slug: 'juniper-studio' };

export type Profile = { name: string; email: string; title: string; timezone: string; bio: string };
export const PROFILE: Profile = {
  name: 'Maya Okafor',
  email: 'maya@juniperstudio.example',
  title: 'Founder and creative director',
  timezone: 'Europe/Amsterdam',
  bio: 'Brand identity and packaging for food and drink companies.',
};
export const TIMEZONES = ['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Europe/Amsterdam', 'Asia/Singapore', 'Australia/Sydney'];

export const EVENTS = [
  { id: 'mentions', label: 'Mentions', hint: 'Someone @mentions you' },
  { id: 'comments', label: 'Comments', hint: 'On files you follow' },
  { id: 'assigned', label: 'Assigned to me', hint: 'Tasks and reviews' },
  { id: 'reports', label: 'Weekly report', hint: 'Hours and budgets' },
  { id: 'product', label: 'Product news', hint: 'New features, once a month' },
] as const;
export type EventId = (typeof EVENTS)[number]['id'];
export const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push' },
  { id: 'chat', label: 'Chat' },
];
export type Matrix = Record<EventId, Record<Channel, boolean>>;
export const MATRIX: Matrix = {
  mentions: { email: true, push: true, chat: true },
  comments: { email: false, push: true, chat: false },
  assigned: { email: true, push: true, chat: false },
  reports: { email: true, push: false, chat: false },
  product: { email: false, push: false, chat: false },
};

export const PLANS = [
  { id: 'starter', name: 'Starter', price: 0, seats: 3, blurb: 'For solo work and trying things out' },
  { id: 'studio', name: 'Studio', price: 12, seats: 10, blurb: 'For small teams, billed per seat' },
  { id: 'agency', name: 'Agency', price: 24, seats: 50, blurb: 'Client workspaces and single sign-on' },
] as const;
export type PlanId = (typeof PLANS)[number]['id'];

export const USAGE = [
  { label: 'Seats', used: 7, of: 10, unit: '' },
  { label: 'Storage', used: 6.4, of: 10, unit: ' GB' },
  { label: 'Client portals', used: 4, of: 5, unit: '' },
];

export type Invoice = { id: string; date: string; amount: number; status: 'Paid' | 'Due' };
export const INVOICES: Invoice[] = [
  { id: 'INV-0112', date: 'Nov 1, 2026', amount: 84, status: 'Due' },
  { id: 'INV-0101', date: 'Oct 1, 2026', amount: 84, status: 'Paid' },
  { id: 'INV-0093', date: 'Sep 1, 2026', amount: 72, status: 'Paid' },
  { id: 'INV-0085', date: 'Aug 1, 2026', amount: 72, status: 'Paid' },
];

export type Member = { id: string; name: string; email: string; role: Role; color: Accent; lastActive: string };
export const MEMBERS: Member[] = [
  { id: 'u1', name: 'Maya Okafor', email: 'maya@juniperstudio.example', role: 'Owner', color: 'secondary', lastActive: 'Now' },
  { id: 'u2', name: 'Priya Raman', email: 'priya@juniperstudio.example', role: 'Admin', color: 'primary', lastActive: '2 hours ago' },
  { id: 'u3', name: 'Jun Takeda', email: 'jun@juniperstudio.example', role: 'Member', color: 'success', lastActive: 'Yesterday' },
  { id: 'u4', name: 'Callum Reyes', email: 'callum@juniperstudio.example', role: 'Member', color: 'warning', lastActive: '3 days ago' },
  { id: 'u5', name: 'Dara Okonkwo', email: 'dara@fieldnotes.example', role: 'Viewer', color: 'info', lastActive: 'Last week' },
];
export type Invite = { email: string; role: Role; sent: string };
export const INVITES: Invite[] = [{ email: 'noor@lanternbooks.example', role: 'Viewer', sent: '2 days ago' }];

export const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
