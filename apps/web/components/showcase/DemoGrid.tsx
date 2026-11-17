'use client';
// "Built with Sorbet": nine working mini-demos. Each one is its own chunk, loaded and
// mounted when its card scrolls near, so the landing page stays light.
import * as React from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useInView } from 'motion/react';
import { Skeleton } from '@sorbet-ui/react';
import { DARK, scoop, type Scoop } from '@/lib/scoops';
import { touchRow } from '@/lib/touch';
import { Stagger, StaggerItem } from '../motion';

function Loading() {
  return (
    <Box aria-busy="true" sx={{ height: '100%', display: 'grid', alignContent: 'center', gap: 1.5, p: 3 }}>
      <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
        Loading demo
      </Box>
      <Skeleton shape="rounded" height={28} width="55%" />
      <Skeleton shape="rounded" height={72} />
      <Skeleton shape="rounded" height={72} />
    </Box>
  );
}

const DEMOS: { id: string; title: string; blurb: string; href: string; link: string; c: Scoop; Demo: React.ComponentType }[] = [
  { id: 'kanban', title: 'Kanban', blurb: 'Drag a ticket, or use its arrows.', href: '/docs/components/card', link: 'Card', c: 'warning', Demo: dynamic(() => import('./demos/Kanban'), { ssr: false, loading: Loading }) },
  { id: 'stats', title: 'Stats', blurb: 'Switch the range; the number counts.', href: '/docs/components/tabs', link: 'Tabs', c: 'success', Demo: dynamic(() => import('./demos/Stats'), { ssr: false, loading: Loading }) },
  { id: 'command', title: 'Command menu', blurb: 'Type, arrow down, press Enter.', href: '/docs/components/text-field', link: 'TextField', c: 'secondary', Demo: dynamic(() => import('./demos/Command'), { ssr: false, loading: Loading }) },
  { id: 'filters', title: 'Filters and table', blurb: 'Chips narrow the rows.', href: '/docs/components/table', link: 'Table', c: 'primary', Demo: dynamic(() => import('./demos/Filters'), { ssr: false, loading: Loading }) },
  { id: 'agenda', title: 'Agenda', blurb: 'Pick a day to see what is on.', href: '/docs/components/avatar', link: 'Avatar', c: 'danger', Demo: dynamic(() => import('./demos/Agenda'), { ssr: false, loading: Loading }) },
  { id: 'sundae', title: 'Build a sundae', blurb: 'Three steps; finished ones go back.', href: '/docs/components/stepper', link: 'Stepper', c: 'warning', Demo: dynamic(() => import('./demos/Sundae'), { ssr: false, loading: Loading }) },
  { id: 'faq', title: 'Shop FAQ', blurb: 'One answer open at a time.', href: '/docs/components/accordion', link: 'Accordion', c: 'info', Demo: dynamic(() => import('./demos/Faq'), { ssr: false, loading: Loading }) },
  { id: 'order-menu', title: 'Order actions', blurb: 'Open the menu, pick an action.', href: '/docs/components/menu', link: 'Menu', c: 'secondary', Demo: dynamic(() => import('./demos/OrderMenu'), { ssr: false, loading: Loading }) },
  { id: 'form', title: 'Sign-up form', blurb: 'Submit it empty, then fix it.', href: '/docs/components/checkbox', link: 'Checkbox', c: 'info', Demo: dynamic(() => import('./demos/SignUp'), { ssr: false, loading: Loading }) },
];

function DemoCard({ d }: { d: (typeof DEMOS)[number] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: '300px 0px' });
  return (
    <Box
      component="article"
      aria-labelledby={`demo-${d.id}`}
      data-testid={`demo-${d.id}`}
      sx={(t) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '24px',
        bgcolor: 'background.paper',
        border: `1px solid ${t.palette.divider}`,
        boxShadow: '0 1px 2px rgb(15 23 42 / 0.04), 0 20px 40px -28px rgb(15 23 42 / 0.3)',
      })}
    >
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          height: 340,
          m: 0.75,
          borderRadius: '18px',
          overflow: 'hidden',
          background: `radial-gradient(120% 90% at 50% 0%, ${scoop(d.c, 'pastel')}, ${scoop(d.c, 'tint')})`,
          [DARK]: { background: `radial-gradient(120% 90% at 50% 0%, ${scoop(d.c, 'tint')}, transparent)` },
        }}
      >
        {near ? <d.Demo /> : <Loading />}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.25, pt: 1, pb: 1.75 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography id={`demo-${d.id}`} component="h3" sx={{ fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>
            {d.title}
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{d.blurb}</Typography>
        </Box>
        <Box
          component={NextLink}
          href={d.href}
          aria-label={`${d.link} docs`}
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: 'none',
            bgcolor: scoop(d.c, 'pastel'),
            color: scoop(d.c, 'pill'),
            '&:hover svg': { translate: '3px 0' },
            '& svg': { transition: 'translate .2s', '@media (prefers-reduced-motion: reduce)': { transition: 'none' } },
            '&:focus-visible': { outline: '3px solid', outlineColor: 'text.primary', outlineOffset: 2 },
            ...touchRow,
          }}
        >
          {d.link}
          <ArrowForward sx={{ fontSize: 16 }} />
        </Box>
      </Box>
    </Box>
  );
}

export default function DemoGrid() {
  return (
    <Stagger as="ul" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 318px), 1fr))', gap: 24, margin: 0, padding: 0, listStyle: 'none' }}>
      {DEMOS.map((d) => (
        <StaggerItem as="li" key={d.id} style={{ minWidth: 0 }}>
          <DemoCard d={d} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
