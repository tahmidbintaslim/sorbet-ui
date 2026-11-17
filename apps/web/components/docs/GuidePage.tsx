// Shell for every written docs page: the flavored header, the body with an
// "On this page" column, then "Edit this page", a help strip and previous/next.
// Pages pass their own sections; headings use <DocHeading> (or the H2 / H3
// helpers below) so the TOC, deep links and the search index line up.
import * as React from 'react';
import { Box, Link, Typography } from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import PageHeader from '@/components/fun/PageHeader';
import type { DoodleName } from '@/components/fun/Doodles';
import DocHeading from './DocHeading';
import DocLinkCard from './DocLinkCard';
import { TocAside, TocDisclosure, type TocItem } from './DocsToc';
import { DOCS_NAV, docNeighbors, docPage } from '@/lib/docs-nav';
import { SITE } from '@/lib/site';

export type { TocItem };

const groupOf = (href: string) => DOCS_NAV.find((g) => g.pages.some((p) => p.href === href));

export default function GuidePage({
  href,
  toc,
  doodle = 'cone',
  aside,
  children,
}: {
  /** The page's route; title, description and flavor come from lib/docs-nav.ts. */
  href: string;
  toc: TocItem[];
  doodle?: DoodleName;
  /** Handwritten note above the title: one to three words. */
  aside?: string;
  children: React.ReactNode;
}) {
  const page = docPage(href);
  if (!page) throw new Error(`${href} is not in lib/docs-nav.ts`);
  const group = groupOf(href)!;
  const { prev, next } = docNeighbors(href);

  return (
    <>
      <PageHeader flavor={group.flavor} doodle={doodle} aside={aside ?? group.title.toLowerCase()} title={page.title}>
        {page.description}
      </PageHeader>

      <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {toc.length > 0 && (
            <Box sx={{ display: { lg: 'none' } }}>
              <TocDisclosure items={toc} />
            </Box>
          )}

          <Box
            data-testid="guide-body"
            sx={{
              maxWidth: 760,
              color: 'text.primary',
              '& > p, & section > p': { color: 'text.secondary', lineHeight: 1.75, my: 2 },
              '& ul, & ol': { color: 'text.secondary', lineHeight: 1.75, pl: 3 },
              '& li': { my: 0.75 },
              '& :not(pre) > code': { fontSize: '0.875em', px: 0.6, py: 0.15, borderRadius: 1, bgcolor: 'action.hover', color: 'text.primary' },
              '& section': { scrollMarginTop: 88, mt: 6 },
              '& section:first-of-type': { mt: 2 },
            }}
          >
            {children}
          </Box>

          <Box sx={{ mt: 8, pt: 3, borderTop: 1, borderColor: 'divider', display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href={`${SITE.github}/edit/main/apps/web/${page.file}`} rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 600, minHeight: 44 }}>
              <EditOutlined sx={{ fontSize: 18 }} aria-hidden />
              Edit this page on GitHub
            </Link>
            <Typography variant="body2" color="text.secondary">
              Stuck?{' '}
              <Link href="/support">
                Get help
              </Link>
            </Typography>
          </Box>

          <Box component="nav" aria-label="Docs pages" sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {prev ? <DocLinkCard href={prev.href} title={prev.title} note="Previous" rel="prev" /> : <span />}
            {next && <DocLinkCard href={next.href} title={next.title} note="Next" rel="next" align="right" />}
          </Box>
        </Box>

        {toc.length > 0 && (
          <Box component="aside" sx={{ display: { xs: 'none', lg: 'block' }, width: 200, flexShrink: 0, alignSelf: 'stretch' }}>
            <TocAside items={toc} />
          </Box>
        )}
      </Box>
    </>
  );
}

/** A top-level section of a guide: an h2 with an anchor, wrapped in a <section>. */
export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <DocHeading id={id} level={2}>
        {title}
      </DocHeading>
      {children}
    </section>
  );
}

/** A sub-heading inside a Section (shows indented in the TOC). */
export function H3({ id, children }: { id: string; children: string }) {
  return (
    <Box sx={{ mt: 4 }}>
      <DocHeading id={id} level={3}>
        {children}
      </DocHeading>
    </Box>
  );
}
