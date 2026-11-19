import type { Metadata } from 'next';
import { Box, Link, Typography } from '@mui/material';
import { Chip } from '@sorbet-ui/react';
import { pageMeta } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { scoop, type Scoop } from '@/lib/scoops';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import Inline from './Inline';
import { readChangelogs, readPendingChangesets, type Block, type Release } from './parse';

export const metadata: Metadata = pageMeta({
  title: 'Changelog',
  description: 'What changed in each Sorbet UI release, read from the repository CHANGELOG.md at build time.',
  path: '/docs/changelog',
});

// Keep a Changelog categories, each in its own scoop.
const CATEGORY_FLAVOR: Record<string, Scoop> = {
  added: 'success',
  changed: 'primary',
  deprecated: 'secondary',
  fixed: 'warning',
  removed: 'danger',
  security: 'danger',
  'known issues': 'info',
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pkgName = (source: string) => `@sorbet-ui/${source.replace(/^packages\/|\/CHANGELOG\.md$/g, '')}`;
const pkgSlug = (source: string) => slug(pkgName(source));
const releaseId = (r: Release, prefix = '') => `${prefix}v${slug(r.version)}`;

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.kind === 'p' ? (
          <Typography key={i} sx={{ color: 'text.secondary', lineHeight: 1.75, my: 1.5 }}>
            <Inline text={b.text} />
          </Typography>
        ) : (
          <Box component="ul" key={i} sx={{ my: 1.5 }}>
            {b.items.map((item, j) => (
              <li key={j}>
                <Inline text={item} />
              </li>
            ))}
          </Box>
        ),
      )}
    </>
  );
}

function ReleaseEntry({ release, latest, prefix, pkg }: { release: Release; latest: boolean; prefix: string; pkg?: string }) {
  const id = releaseId(release, prefix);
  return (
    <Section id={id} title={pkg ? `${pkg} ${release.version}` : `Version ${release.version}`}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mt: 1 }}>
        {release.unreleased ? (
          <Chip label="Unreleased" variant="soft" color="warning" size="sm" disableAnimation />
        ) : (
          release.date && (
            <Chip
              label={new Date(`${release.date}T00:00:00Z`).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
              variant="soft"
              color="neutral"
              size="sm"
              disableAnimation
            />
          )
        )}
        {latest && <Chip label="Latest" variant="soft" color="success" size="sm" disableAnimation />}
      </Box>

      <Box
        data-testid="release"
        data-version={release.version}
        sx={{
          mt: 2,
          pl: { xs: 2, sm: 3 },
          borderLeft: '3px dashed',
          borderColor: scoop('danger', 'fill'),
        }}
      >
        <Blocks blocks={release.intro} />
        {release.categories.map((c) => {
          const flavor = CATEGORY_FLAVOR[c.title.toLowerCase()] ?? 'secondary';
          return (
            <Box key={c.title} data-category={c.title} sx={{ '& h3': { color: scoop(flavor, 'ink') }, '& li::marker': { color: scoop(flavor, 'ink') } }}>
              <H3 id={`${id}-${slug(c.title)}`}>{c.title}</H3>
              <Blocks blocks={c.blocks} />
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}

export default function Page() {
  const logs = readChangelogs();
  const pending = readPendingChangesets();
  const root = logs.find((l) => l.source === 'CHANGELOG.md');
  const packageLogs = logs.filter((l) => l !== root);

  const toc: TocItem[] = [
    ...(root?.releases ?? []).map((r) => ({ id: releaseId(r), label: r.version, depth: 2 as const })),
    ...(pending.length ? [{ id: 'pending', label: 'Pending changes', depth: 2 as const }] : []),
    ...packageLogs.flatMap((l) => l.releases.map((r) => ({ id: releaseId(r, `${pkgSlug(l.source)}-`), label: `${pkgName(l.source)} ${r.version}`, depth: 2 as const }))),
    { id: 'releases', label: 'How releases work', depth: 2 },
  ];

  return (
    <GuidePage href="/docs/changelog" doodle="jar" aside="fresh batches" toc={toc}>
      {root && <Blocks blocks={root.intro} />}

      {root?.releases.map((r, i) => <ReleaseEntry key={r.version} release={r} latest={i === 0 && !r.unreleased} prefix="" />)}

      {pending.length > 0 && (
        <Section id="pending" title="Pending changes">
          <p>Changesets merged since the last release. They go into the next version.</p>
          <Box component="ul">
            {pending.map((c) => (
              <li key={c.file}>
                {c.packages.length > 0 && <strong>{c.packages.join(', ')}: </strong>}
                <Inline text={c.summary} />
              </li>
            ))}
          </Box>
        </Section>
      )}

      {packageLogs.flatMap((l) =>
        l.releases.map((r) => (
          <ReleaseEntry key={`${l.source}-${r.version}`} release={r} latest={false} prefix={`${pkgSlug(l.source)}-`} pkg={pkgName(l.source)} />
        )),
      )}

      <Section id="releases" title="How releases work">
        <p>
          The maintainer versions the packages with Changesets and publishes them to npm by creating a GitHub release. A merge or push never publishes on its own. Once releases start, each published package also gets its own
          changelog, and this page picks it up.
        </p>
        <p>
          This page is built from the repository&apos;s{' '}
          <Link href={`${SITE.github}/blob/main/CHANGELOG.md`} rel="noopener">
            CHANGELOG.md
          </Link>
          . To follow along, watch the{' '}
          <Link href={`${SITE.github}/releases`} rel="noopener">
            GitHub releases
          </Link>
          .
        </p>
      </Section>
    </GuidePage>
  );
}
