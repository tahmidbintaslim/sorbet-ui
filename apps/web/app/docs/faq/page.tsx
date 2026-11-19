import type { Metadata } from 'next';
import { Link } from '@mui/material';
import { pageMeta, SITE_URL } from '@/lib/seo';
import GuidePage, { Section } from '@/components/docs/GuidePage';
import FaqAccordion from './FaqAccordion';
import { FAQ, FAQ_ITEMS } from './faq-data';
import type { AccordionColor } from '@sorbet-ui/react';

export const metadata: Metadata = pageMeta({
  title: 'FAQ',
  description: 'Short answers to the questions people ask most: npm, Material UI and React versions, server rendering, theming, accessibility and license.',
  path: '/docs/faq',
});

// One flavor per group, so the open question's border and focus ring match it.
const GROUP_COLOR: Record<string, AccordionColor> = {
  'getting-started': 'success',
  compatibility: 'info',
  theming: 'warning',
  accessibility: 'secondary',
  project: 'danger',
};

// FAQPage structured data from the same answers the page shows.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: `${SITE_URL}/docs/faq`,
  mainEntity: FAQ_ITEMS.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
};

export default function Page() {
  return (
    <GuidePage
      href="/docs/faq"
      doodle="emptyCone"
      aside="ask away"
      toc={FAQ.map((g) => ({ id: g.id, label: g.title, depth: 2 as const }))}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <p>
        Pick a question to open it. Each answer links to the page with the details. Not here? <Link href="/support">Get help</Link>.
      </p>
      <Section id="getting-started" title="Getting started">
        <Group id="getting-started" />
      </Section>
      <Section id="compatibility" title="Compatibility">
        <Group id="compatibility" />
      </Section>
      <Section id="theming" title="Theming">
        <Group id="theming" />
      </Section>
      <Section id="accessibility" title="Accessibility">
        <Group id="accessibility" />
      </Section>
      <Section id="project" title="Project">
        <Group id="project" />
      </Section>
    </GuidePage>
  );
}

function Group({ id }: { id: string }) {
  const group = FAQ.find((g) => g.id === id);
  if (!group) throw new Error(`No FAQ group "${id}"`);
  return <FaqAccordion items={group.items} color={GROUP_COLOR[id]} />;
}
