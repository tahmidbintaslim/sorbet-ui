// Server-safe block metadata (names, groups). Components live in /blocks and
// are mapped in components/BlockViewer.tsx.
export const BLOCK_GROUPS = [
  {
    id: 'hero',
    title: 'Hero',
    blocks: [
      { id: 'HeroCentered', name: 'Centered', description: 'Badge, headline, two actions and a row of cards.' },
      { id: 'HeroSplit', name: 'Split with signup', description: 'Copy and email capture beside a report card.' },
      { id: 'HeroCode', name: 'Developer', description: 'Announcement, runtime chips and a code sample.' },
    ],
  },
  {
    id: 'features',
    title: 'Features',
    blocks: [
      { id: 'FeatureGrid', name: 'Icon grid', description: 'Six features with colored soft chips.' },
      { id: 'FeatureTabs', name: 'Tabbed', description: 'Tabs switching between three working panels.' },
    ],
  },
  {
    id: 'cta',
    title: 'Call to action',
    blocks: [
      { id: 'CtaBanner', name: 'Gradient banner', description: 'Headline and two actions on a brand gradient.' },
      { id: 'CtaNewsletter', name: 'Newsletter', description: 'Email form with a success state.' },
    ],
  },
] as const;
