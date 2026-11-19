import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircleOutlineOutlined';
import { pageMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { scoop, type Scoop } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';
import PageHeader from '@/components/fun/PageHeader';
import DocsSearch from '@/components/docs/DocsSearch';
import FaqAccordion from '@/app/docs/faq/FaqAccordion';
import { FAQ_ITEMS, TOP_FAQ_IDS } from '@/app/docs/faq/faq-data';
import HelpCard, { type HelpIcon } from './HelpCard';

export const metadata: Metadata = pageMeta({
  title: 'Support',
  description: 'Get help with Sorbet UI: search the docs, read the FAQ, report a bug or request a feature on GitHub, and report security problems privately.',
  path: '/support',
});

const GH = SITE.github;

// Issue templates in .github/ISSUE_TEMPLATE; `?template=` opens the right one.
const SUPPORT_LINKS = {
  bug: `${GH}/issues/new?template=bug_report.md`,
  feature: `${GH}/issues/new?template=feature_request.md`,
  question: `${GH}/issues/new?labels=question`,
  security: `${GH}/security/advisories/new`,
  securityPolicy: `${GH}/blob/main/SECURITY.md`,
  issues: `${GH}/issues?q=is%3Aissue`,
};

const CARDS: { href: string; title: string; description: string; flavor: Scoop; icon: HelpIcon; testId: string }[] = [
  { href: '/docs', title: 'Read the docs', description: 'Install, theme and customize, step by step.', flavor: 'success', icon: 'docs', testId: 'help-docs' },
  { href: '/docs/faq', title: 'FAQ', description: 'Short answers about npm, versions, SSR, theming and the license.', flavor: 'info', icon: 'faq', testId: 'help-faq' },
  { href: SUPPORT_LINKS.bug, title: 'Report a bug', description: 'Open the bug report template on GitHub.', flavor: 'danger', icon: 'bug', testId: 'help-bug' },
  { href: SUPPORT_LINKS.feature, title: 'Request a feature', description: 'Suggest a component, prop or improvement.', flavor: 'warning', icon: 'idea', testId: 'help-feature' },
  { href: SUPPORT_LINKS.question, title: 'Ask a question', description: 'Open a GitHub issue with your question.', flavor: 'primary', icon: 'question', testId: 'help-question' },
  { href: SUPPORT_LINKS.securityPolicy, title: 'Security', description: 'Report a vulnerability privately, never in an issue.', flavor: 'secondary', icon: 'security', testId: 'help-security' },
  { href: '/docs/contributing', title: 'Contributing', description: 'Set up the repo and send your first pull request.', flavor: 'success', icon: 'contribute', testId: 'help-contributing' },
  { href: '/docs/changelog', title: 'Changelog', description: 'What changed, and what is coming in 0.1.0.', flavor: 'info', icon: 'changelog', testId: 'help-changelog' },
];

const CHECKLIST: ReactNode[] = [
  <>
    Search{' '}
    <Link key="l" href={SUPPORT_LINKS.issues} rel="noopener">
      existing issues
    </Link>
    , open and closed.
  </>,
  <>
    Check the <Link href="/docs">docs</Link> and the <Link href="/docs/faq">FAQ</Link>.
  </>,
  <>
    Try the latest <code>main</code>. Sorbet UI is not on npm yet, so say which commit you built from.
  </>,
  <>
    See if it happens in{' '}
    <Link href={SITE.storybook} rel="noopener">
      Storybook
    </Link>{' '}
    too.
  </>,
  <>Cut it down to a minimal code example.</>,
  <>Note your versions: React, Material UI, browser and OS.</>,
];

const sectionTitle = (id: string, text: string) => (
  <Typography id={id} component="h2" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 30 }, letterSpacing: '-0.02em', mb: 1 }}>
    {text}
  </Typography>
);

export default function Support() {
  const top = TOP_FAQ_IDS.map((id) => FAQ_ITEMS.find((i) => i.id === id)!).filter(Boolean);
  return (
    <>
      <PageHeader
        bleed
        size="lg"
        flavor={SECTION_FLAVOR.docs}
        doodle="sundae"
        aside="here to help"
        title="Support"
        action={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: 340 } }}>
              <DocsSearch />
            </Box>
            <Typography variant="body2" color="text.secondary">
              or start with the <Link href="/docs/faq">FAQ</Link>
            </Typography>
          </Box>
        }
      >
        Search the docs, read the FAQ, or reach the maintainer on GitHub. Sorbet UI is maintained by one person, so the docs are the fastest way to an answer.
      </PageHeader>

      <Container maxWidth="lg">
        <Box component="section" aria-labelledby="get-help" sx={{ mt: { xs: 4, md: 6 } }}>
          {sectionTitle('get-help', 'Where to go')}
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Everything happens in the docs and on GitHub. There is no chat or email support.
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {CARDS.map((c) => (
              <li key={c.title}>
                <HelpCard {...c} />
              </li>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 5 }, mt: { xs: 6, md: 8 } }}>
          <Box component="section" aria-labelledby="before-you-file">
            {sectionTitle('before-you-file', 'Before you file an issue')}
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              A good report gets fixed faster. Run through this list first.
            </Typography>
            <Box component="ol" data-testid="issue-checklist" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 1.25 }}>
              {CHECKLIST.map((item, i) => (
                <Box component="li" key={i} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', color: 'text.secondary', lineHeight: 1.6 }}>
                  <CheckCircle aria-hidden sx={{ fontSize: 22, mt: '1px', color: scoop('success', 'ink'), flexShrink: 0 }} />
                  <span>{item}</span>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            component="section"
            aria-labelledby="security"
            data-testid="security-callout"
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 5, bgcolor: scoop('secondary', 'tint'), border: '2px dashed', borderColor: scoop('secondary', 'fill'), alignSelf: 'start' }}
          >
            {sectionTitle('security', 'Found a security problem?')}
            <Typography color="text.secondary" sx={{ mb: 1.5 }}>
              Please do not report it in a public issue or pull request. Report it privately through GitHub:
            </Typography>
            <Box component="ol" sx={{ color: 'text.secondary', pl: 3, my: 0, lineHeight: 1.7 }}>
              <li>
                Open the repository&apos;s{' '}
                <Link href={`${GH}/security`} rel="noopener">
                  Security tab
                </Link>
                .
              </li>
              <li>
                Choose{' '}
                <Link href={SUPPORT_LINKS.security} rel="noopener">
                  Report a vulnerability
                </Link>
                .
              </li>
            </Box>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              That creates a private security advisory only you and the maintainer can see. Include the affected package and version or commit, steps to reproduce, and the impact you
              expect. There is no guaranteed response time; you get a reply in the advisory thread. Details are in{' '}
              <Link href={SUPPORT_LINKS.securityPolicy} rel="noopener">
                SECURITY.md
              </Link>
              .
            </Typography>
          </Box>
        </Box>

        <Box component="section" aria-labelledby="top-questions" sx={{ mt: { xs: 6, md: 8 }, maxWidth: 820 }}>
          {sectionTitle('top-questions', 'Top questions')}
          <FaqAccordion items={top} color="success" />
          <Typography sx={{ mt: 2 }}>
            <Link href="/docs/faq" sx={{ fontWeight: 600 }}>
              See all questions
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
}
