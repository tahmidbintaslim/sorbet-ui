'use client';
// Templates index: big cards, each with the real template running inside it, scaled
// down. Previews mount when their card scrolls near the viewport (the code for each
// template loads then too) and are inert and hidden from assistive tech: the card's
// title link is the only control.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Stack, Typography } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Button, Chip, Skeleton } from '@sorbet-ui/react';
import { TEMPLATES, TEMPLATE_TYPES, type Template, type TemplateType } from '@/lib/templates';
import { scoop, scoopAt } from '@/lib/scoops';
import { touchTarget } from '@/lib/touch';
import { useColorMode } from './ColorMode';
import TemplateStage from './TemplateStage';

// One lazy chunk per template.
const LIVE: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'analytics-dashboard': React.lazy(() => import('@/templates/analytics-dashboard')),
  inbox: React.lazy(() => import('@/templates/inbox')),
  kanban: React.lazy(() => import('@/templates/kanban')),
  storefront: React.lazy(() => import('@/templates/storefront')),
  'saas-landing': React.lazy(() => import('@/templates/saas-landing')),
};

// The preview renders at a desktop size and is scaled to the card.
const VIEW = { width: 1280, height: 800 };

function LivePreview({ template }: { template: Template }) {
  const { mode } = useColorMode();
  const box = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState<number | null>(null);
  const [near, setNear] = React.useState(false);
  const Live = LIVE[template.slug];

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / VIEW.width));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const placeholder = (
    <Box sx={{ position: 'absolute', inset: 0, p: 3, display: 'grid', gap: 2, gridTemplateRows: 'auto 1fr 1fr' }}>
      <Skeleton shape="rounded" height={28} width="40%" />
      <Skeleton shape="rounded" height="100%" />
      <Skeleton shape="rounded" height="100%" />
    </Box>
  );

  return (
    <Box
      ref={box}
      aria-hidden
      inert
      data-testid={`template-thumb-${template.slug}`}
      data-live={near && scale !== null ? 'true' : 'false'}
      sx={{ position: 'relative', aspectRatio: `${VIEW.width} / ${VIEW.height}`, overflow: 'hidden', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider', pointerEvents: 'none', userSelect: 'none' }}
    >
      {near && scale !== null && Live ? (
        <Box className="thumb" sx={{ width: VIEW.width, height: VIEW.height, transformOrigin: '0 0', transform: `scale(${scale})`, transition: 'transform .6s cubic-bezier(.22,1,.36,1)' }}>
          <React.Suspense fallback={placeholder}>
            <TemplateStage mode={mode} scroll={false} sx={{ width: VIEW.width, height: VIEW.height }}>
              <Live />
            </TemplateStage>
          </React.Suspense>
        </Box>
      ) : (
        placeholder
      )}
    </Box>
  );
}

export default function TemplateCards() {
  const [type, setType] = React.useState<TemplateType | 'All'>('All');
  const shown = TEMPLATES.filter((t) => type === 'All' || t.type === type);
  return (
    <>
      <Stack direction="row" role="group" aria-label="Filter templates by type" sx={{ flexWrap: 'wrap', gap: 1, mt: 3 }}>
        {(['All', ...TEMPLATE_TYPES] as const).map((id) => {
          const count = id === 'All' ? TEMPLATES.length : TEMPLATES.filter((t) => t.type === id).length;
          return (
            <Button key={id} size="sm" color="secondary" variant={type === id ? 'solid' : 'outlined'} aria-pressed={type === id} onClick={() => setType(id)} sx={{ ...touchTarget, borderRadius: 999 }}>
              {id} ({count})
            </Button>
          );
        })}
      </Stack>
      <Typography role="status" variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
        Showing {shown.length} of {TEMPLATES.length} templates. Every preview below is the real template, running live.
      </Typography>
      <Box sx={{ display: 'grid', gap: { xs: 3, md: 4 }, mt: 3, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' } }}>
        {shown.map((t) => {
          const c = scoopAt(TEMPLATES.indexOf(t));
          return (
            <Box
              key={t.slug}
              component="article"
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                transition: 'transform .35s cubic-bezier(.3,1.4,.5,1), box-shadow .25s, border-color .2s',
                '&:hover, &:focus-within': { borderColor: scoop(c, 'fill'), boxShadow: `0 22px 44px -28px ${scoop(c, 'fill')}` },
                '&:hover': { transform: 'translateY(-4px)' },
                '&:hover .go': { transform: 'translateX(4px)' },
                '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' }, '&:hover .go': { transform: 'none' } },
              }}
            >
              <LivePreview template={t} />
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography component="h2" sx={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
                    {/* Stretched link: the whole card is the click target. */}
                    <Box
                      component={NextLink}
                      href={`/templates/${t.slug}`}
                      sx={{ color: 'text.primary', textDecoration: 'none', '&::after': { content: '""', position: 'absolute', inset: 0 }, '&:focus-visible': { outline: 'none' }, '&:focus-visible::after': { outline: '3px solid', outlineColor: scoop(c, 'ink'), outlineOffset: -3, borderRadius: 4 } }}
                    >
                      {t.name}
                    </Box>
                  </Typography>
                  <ArrowForward className="go" aria-hidden sx={{ color: scoop(c, 'ink'), transition: 'transform .25s' }} />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {t.description}
                </Typography>
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 2 }}>
                  <Chip size="sm" variant="soft" color="secondary" label={t.type} />
                  {t.tags.map((tag) => (
                    <Chip key={tag} size="sm" variant="outlined" color="neutral" label={tag} />
                  ))}
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
