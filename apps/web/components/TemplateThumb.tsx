'use client';
// A real template running inside a card, scaled down. It renders at a fixed device
// size (desktop by default) and scales to the box it gets. It mounts when the box
// scrolls near the viewport (each template's code loads then too); until then, and
// while the chunk loads, a skeleton stands in. Inert and hidden from assistive tech:
// the surrounding card provides the link.
import * as React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';
import { Skeleton } from '@sorbet-ui/react';
import { useColorMode } from './ColorMode';
import TemplateStage from './TemplateStage';

// One lazy chunk per template.
const LIVE: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'analytics-dashboard': React.lazy(() => import('@/templates/analytics-dashboard')),
  inbox: React.lazy(() => import('@/templates/inbox')),
  kanban: React.lazy(() => import('@/templates/kanban')),
  storefront: React.lazy(() => import('@/templates/storefront')),
  'saas-landing': React.lazy(() => import('@/templates/saas-landing')),
  settings: React.lazy(() => import('@/templates/settings')),
  'product-launch': React.lazy(() => import('@/templates/product-launch')),
  'developer-tool': React.lazy(() => import('@/templates/developer-tool')),
};

export const DESKTOP = { width: 1280, height: 800 };
export const PHONE = { width: 390, height: 780 };

export default function TemplateThumb({
  slug,
  view = DESKTOP,
  testId,
  sx,
}: {
  slug: string;
  /** The size the template renders at before scaling. */
  view?: { width: number; height: number };
  testId?: string;
  sx?: SxProps<Theme>;
}) {
  const { mode } = useColorMode();
  const box = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState<number | null>(null);
  const [near, setNear] = React.useState(false);
  const Live = LIVE[slug];

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / view.width));
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
  }, [view.width]);

  const phone = view.width < 600;
  const placeholder = (
    <Box sx={{ position: 'absolute', inset: 0, p: phone ? 1.5 : 3, display: 'grid', gap: phone ? 1 : 2, gridTemplateRows: 'auto 1fr 1fr' }}>
      <Skeleton shape="rounded" height={phone ? 14 : 28} width="40%" />
      <Skeleton shape="rounded" height="100%" />
      <Skeleton shape="rounded" height="100%" />
    </Box>
  );

  return (
    <Box
      ref={box}
      aria-hidden
      inert
      data-testid={testId ?? `template-thumb-${slug}`}
      data-live={near && scale !== null ? 'true' : 'false'}
      sx={[
        { position: 'relative', aspectRatio: `${view.width} / ${view.height}`, overflow: 'hidden', bgcolor: 'background.default', pointerEvents: 'none', userSelect: 'none' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {near && scale !== null && Live ? (
        <Box sx={{ width: view.width, height: view.height, transformOrigin: '0 0', transform: `scale(${scale})` }}>
          <React.Suspense fallback={placeholder}>
            <TemplateStage mode={mode} scroll={false} sx={{ width: view.width, height: view.height }}>
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
