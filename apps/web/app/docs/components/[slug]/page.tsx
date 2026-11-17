import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import CodeBlock from '@/components/CodeBlock';
import { CATALOG, getEntry, type CatalogEntry } from '@/lib/catalog';
import Playground from '@/components/Playground';
import PageHeader from '@/components/fun/PageHeader';
import { SECTION_FLAVOR } from '@/lib/sections';
import { scoop } from '@/lib/scoops';
import { EXAMPLES } from '@/lib/docs-examples-meta';
import { EXAMPLE_SOURCE } from '@/lib/docs-examples-source';
import { API } from '@/lib/docs-api';
import { A11Y } from '@/lib/docs-a11y';
import { EXAMPLE_COMPONENTS } from '@/components/docs/examples-registry';
import ExampleViewer from '@/components/docs/ExampleViewer';
import ApiTable from '@/components/docs/ApiTable';
import DocHeading from '@/components/docs/DocHeading';
import DocLinkCard from '@/components/docs/DocLinkCard';
import { TocAside, TocDisclosure, type TocItem } from '@/components/docs/DocsToc';

type Params = Promise<{ slug: string }>;

// Static export: every component page is generated at build time.
export const dynamicParams = false;
export const generateStaticParams = () => CATALOG.map((d) => ({ slug: d.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = (await params).slug;
  const demo = getEntry(slug);
  return pageMeta({ title: demo?.name, description: demo?.description, path: `/docs/components/${slug}` });
}

const FLAVOR = SECTION_FLAVOR.components;
const section = { mt: { xs: 6, md: 8 } } as const;
const lead = { color: 'text.secondary', mt: 1, mb: 3, maxWidth: 640, textWrap: 'pretty' } as const;

export default async function ComponentPage({ params }: { params: Params }) {
  const { slug } = await params;
  const demo = getEntry(slug);
  if (!demo) notFound();

  const examples = EXAMPLES[slug] ?? [];
  const tables = API[slug] ?? [];
  const notes = A11Y[slug] ?? [];
  const related = demo.related.map(getEntry).filter((e): e is CatalogEntry => Boolean(e));
  const at = CATALOG.indexOf(demo);
  const prev = CATALOG[at - 1];
  const next = CATALOG[at + 1];

  const toc: TocItem[] = [
    { id: 'playground', label: 'Playground', depth: 2 },
    { id: 'examples', label: 'Examples', depth: 2 },
    ...examples.map((e) => ({ id: e.id, label: e.title, depth: 3 as const })),
    { id: 'api', label: 'API reference', depth: 2 },
    { id: 'accessibility', label: 'Accessibility', depth: 2 },
    { id: 'related', label: 'Related', depth: 2 },
  ];

  return (
    <>
      <PageHeader flavor={FLAVOR} doodle="popsicle" title={demo.name} back={{ href: '/docs/components', label: 'All components' }}>
        {demo.description}
      </PageHeader>

      <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: { lg: 'none' } }}>
            <TocDisclosure items={toc} />
          </Box>

          <section aria-labelledby="playground">
            <DocHeading id="playground" level={2}>
              Playground
            </DocHeading>
            <Typography sx={lead}>
              Pick a variant, color and size, switch props on, and copy the code. Your picks are kept in the URL.
            </Typography>
            <Playground slug={demo.slug} />
            <CodeBlock code={`import { ${demo.imports.join(', ')} } from '@sorbet-ui/react';`} label="Import statement" />
          </section>

          <Box component="section" aria-labelledby="examples" sx={section}>
            <DocHeading id="examples" level={2}>
              Examples
            </DocHeading>
            <Typography sx={lead}>
              {examples.length} live examples. Each one runs the code shown under it.
            </Typography>
            <Box sx={{ display: 'grid', gap: { xs: 5, md: 6 }, minWidth: 0 }}>
              {examples.map((e, i) => {
                const Example = EXAMPLE_COMPONENTS[slug][e.id];
                return (
                  <ExampleViewer key={e.id} id={e.id} title={e.title} description={e.description} source={EXAMPLE_SOURCE[slug][e.id]} file={`${e.id}.tsx`} index={i}>
                    <Example />
                  </ExampleViewer>
                );
              })}
            </Box>
          </Box>

          <Box component="section" aria-labelledby="api" sx={section}>
            <DocHeading id="api" level={2}>
              API reference
            </DocHeading>
            <Typography sx={lead}>
              Read from the component source, so it matches the version you install.
            </Typography>
            <Box sx={{ display: 'grid', gap: 4, minWidth: 0 }}>
              {tables.map((t) => (
                <Box key={t.name} sx={{ minWidth: 0 }}>
                  <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18, mb: 1.5, fontFamily: 'var(--font-mono), ui-monospace, monospace' }}>
                    {t.name}
                    {t.kind === 'type' && (
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1, fontFamily: 'inherit' }}>
                        type
                      </Typography>
                    )}
                  </Typography>
                  <ApiTable table={t} />
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="section" aria-labelledby="accessibility" sx={section}>
            <DocHeading id="accessibility" level={2}>
              Accessibility
            </DocHeading>
            <Box component="ul" sx={{ mt: 2, mb: 0, pl: 2.5, display: 'grid', gap: 1, maxWidth: 680, color: 'text.secondary', '& li::marker': { color: scoop(FLAVOR, 'ink') } }}>
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </Box>
          </Box>

          <Box component="section" aria-labelledby="related" sx={section}>
            <DocHeading id="related" level={2}>
              Related
            </DocHeading>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              {related.map((r) => (
                <li key={r.slug}>
                  <DocLinkCard href={`/docs/components/${r.slug}`} title={r.name} note={r.description} />
                </li>
              ))}
            </Box>
          </Box>

          <Box component="nav" aria-label="Component pages" sx={{ ...section, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {prev ? <DocLinkCard href={`/docs/components/${prev.slug}`} title={prev.name} note="Previous" rel="prev" /> : <span />}
            {next && <DocLinkCard href={`/docs/components/${next.slug}`} title={next.name} note="Next" rel="next" align="right" />}
          </Box>
        </Box>

        <Box component="aside" sx={{ display: { xs: 'none', lg: 'block' }, width: 200, flexShrink: 0, alignSelf: 'stretch' }}>
          <TocAside items={toc} />
        </Box>
      </Box>
    </>
  );
}
