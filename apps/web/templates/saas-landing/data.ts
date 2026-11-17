// Copy for "Fernway", a fictional roadmap tool. Every company, person, quote and
// number here is sample content.

export type Accent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export const NAV = [
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'customers', label: 'Customers' },
  { id: 'faq', label: 'FAQ' },
] as const;

export const LOGOS = ['Harbor Coffee', 'Lantern Books', 'Oster Bakery', 'Fieldnotes', 'Pollen', 'Kiln & Co.'];

export type Plan = { id: string; name: string; blurb: string; monthly: number; yearly: number; cta: string; features: string[]; highlight?: boolean };
export const PLANS: Plan[] = [
  { id: 'free', name: 'Starter', blurb: 'For side projects and very small teams.', monthly: 0, yearly: 0, cta: 'Start for free', features: ['Up to 5 people', '2 roadmaps', 'Weekly email updates', 'Community support'] },
  { id: 'team', name: 'Team', blurb: 'For product teams that ship every week.', monthly: 12, yearly: 10, cta: 'Start a 14-day trial', highlight: true, features: ['Unlimited people', 'Unlimited roadmaps', 'Auto-written status updates', 'Slack and email digests', 'Priority support'] },
  { id: 'business', name: 'Business', blurb: 'For companies with many teams and stricter needs.', monthly: 24, yearly: 20, cta: 'Talk to us', features: ['Everything in Team', 'Single sign-on', 'Audit log', 'Custom roles', 'Uptime commitment'] },
];

export const TESTIMONIALS = [
  { name: 'Priya Raman', role: 'Producer, Juniper Studio', quote: 'Our Monday update used to take an hour of chasing people. Now it writes itself and we just read it over coffee.', color: 'secondary' as Accent },
  { name: 'Tomas Lindqvist', role: 'Head of product, Harbor Coffee', quote: 'The roadmap finally matches what the team is actually doing, because it is built from the work itself.', color: 'primary' as Accent },
  { name: 'Lucía Marín', role: 'Engineer, Pollen', quote: 'I stopped getting “is this done yet?” messages. Everyone can see it, and nobody has to ask.', color: 'success' as Accent },
];

export const FAQ = [
  { q: 'Is there really a free plan?', a: 'Yes. Starter is free for up to five people with two roadmaps, with no time limit and no card required.' },
  { q: 'Where do the automatic updates come from?', a: 'From the work you already track: cards that move, issues that close and dates that change. You review each update before it goes out.' },
  { q: 'Can I switch plans later?', a: 'Any time. Upgrades apply right away; downgrades take effect at the end of the billing period.' },
  { q: 'Do you offer discounts for nonprofits and schools?', a: 'Yes, half price on Team and Business. Write to us from your organization address.' },
  { q: 'How do I get my data out?', a: 'Export every roadmap as CSV or JSON from settings, whenever you like, on every plan.' },
];
