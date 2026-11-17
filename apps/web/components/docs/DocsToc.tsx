'use client';
// "On this page": a sticky list beside the content at lg+, and a disclosure under
// the page header on smaller screens. The section being read is highlighted.
import * as React from 'react';
import { Box, Link, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { scoop } from '@/lib/scoops';
import { SECTION_FLAVOR } from '@/lib/sections';
import { TOUCH } from '@/lib/touch';
import { ANCHOR_OFFSET } from './DocHeading';

export type TocItem = { id: string; label: string; depth: 2 | 3 };

const FLAVOR = SECTION_FLAVOR.components;
// A heading counts as "reached" once it is this close to the top of the viewport.
const LINE = ANCHOR_OFFSET + 40;

/** Id of the section being read: the last heading that has crossed the reading line. */
function useActiveSection(items: TocItem[]) {
  const [active, setActive] = React.useState(items[0]?.id);
  React.useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const update = () => {
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= LINE) current = el.id;
      // At the very bottom the last sections may never reach the line: pick the last one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = els[els.length - 1].id;
      setActive(current);
    };
    // The observer fires whenever a heading crosses the reading line, in either direction.
    const io = new IntersectionObserver(update, { rootMargin: `-${LINE}px 0px 0px 0px`, threshold: [0, 1] });
    els.forEach((el) => io.observe(el));
    update();
    return () => io.disconnect();
  }, [items]);
  return [active, setActive] as const;
}

function TocList({ items, active, onPick }: { items: TocItem[]; active?: string; onPick: (id: string) => void }) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, borderLeft: 1, borderColor: 'divider' }}>
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              underline="none"
              aria-current={current ? 'location' : undefined}
              onClick={() => onPick(item.id)}
              sx={{
                display: 'block',
                ml: '-1px',
                pl: item.depth === 3 ? 3 : 1.75,
                pr: 1,
                py: 0.5,
                fontSize: item.depth === 3 ? 13 : 14,
                lineHeight: 1.45,
                borderLeft: '2px solid transparent',
                color: 'text.secondary',
                fontWeight: item.depth === 2 ? 600 : 400,
                transition: 'color .15s, border-color .15s',
                '&:hover': { color: 'text.primary' },
                ...(current && { color: scoop(FLAVOR, 'pill'), borderLeftColor: scoop(FLAVOR, 'fill'), fontWeight: 700 }),
                [TOUCH]: { display: 'flex', alignItems: 'center', minHeight: 44, py: 0 },
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </Box>
  );
}

/** Sticky table of contents for the right column (lg and up). */
export function TocAside({ items }: { items: TocItem[] }) {
  const [active, setActive] = useActiveSection(items);
  return (
    <Box
      component="nav"
      aria-label="On this page"
      data-testid="toc"
      sx={{ position: 'sticky', top: ANCHOR_OFFSET, maxHeight: `calc(100vh - ${ANCHOR_OFFSET + 24}px)`, overflowY: 'auto', pb: 2 }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
        On this page
      </Typography>
      <TocList items={items} active={active} onPick={setActive} />
    </Box>
  );
}

/** Compact "On this page" disclosure for screens without the right column. */
export function TocDisclosure({ items }: { items: TocItem[] }) {
  const ref = React.useRef<HTMLDetailsElement>(null);
  return (
    <Box
      component="details"
      ref={ref}
      data-testid="toc-disclosure"
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        mb: 3,
        '&[open] .chevron': { transform: 'rotate(180deg)' },
      }}
    >
      <Box
        component="summary"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 48,
          px: 2,
          fontWeight: 700,
          cursor: 'pointer',
          listStyle: 'none',
          borderRadius: 3,
          '&::-webkit-details-marker': { display: 'none' },
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        }}
      >
        On this page
        <ExpandMore className="chevron" aria-hidden />
      </Box>
      <Box component="nav" aria-label="On this page" sx={{ px: 2, pb: 2 }}>
        {/* Following a link closes the list, so the section is not hidden behind it. */}
        <TocList items={items} onPick={() => ref.current?.removeAttribute('open')} />
      </Box>
    </Box>
  );
}
