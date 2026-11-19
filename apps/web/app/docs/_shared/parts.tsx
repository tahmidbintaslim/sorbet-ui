// Small building blocks shared by the customization and guide pages. Server-safe:
// no hooks and no function props, so server pages can render them directly.
import * as React from 'react';
import { AlertTitle, Box } from '@mui/material';
import { Alert } from '@sorbet-ui/react';
import DocLinkCard from '@/components/docs/DocLinkCard';

type Tone = 'info' | 'warning' | 'success' | 'danger';

/** A short aside: a note, a caveat or a tip. */
export function Callout({ tone = 'info', title, children }: { tone?: Tone; title: string; children: React.ReactNode }) {
  return (
    <Alert color={tone} variant="soft" sx={{ my: 3, '& p': { m: 0 }, '& code': { bgcolor: 'transparent', px: 0 } }}>
      <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
      {children}
    </Alert>
  );
}

/**
 * A plain data table. It scrolls sideways inside its own frame on small screens, so the
 * frame is a labelled, focusable region (keyboard users can scroll it).
 */
export function DocTable({
  label,
  head,
  rows,
  mono = [0],
}: {
  label: string;
  head: string[];
  rows: React.ReactNode[][];
  /** Column indexes shown in the monospace font. */
  mono?: number[];
}) {
  return (
    <Box
      role="region"
      aria-label={label}
      tabIndex={0}
      sx={{
        my: 3,
        overflowX: 'auto',
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
    >
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
          '& th, & td': { textAlign: 'left', verticalAlign: 'top', px: 2, py: 1.25, borderBottom: 1, borderColor: 'divider' },
          '& tbody tr:last-of-type td': { borderBottom: 0 },
          '& th': { fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', bgcolor: 'action.hover' },
          '& td': { color: 'text.secondary', lineHeight: 1.6 },
          ...Object.fromEntries(
            mono.map((i) => [`& td:nth-of-type(${i + 1})`, { fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 13, color: 'text.primary', whiteSpace: 'nowrap' }]),
          ),
        }}
      >
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

/** "Where to go next": a grid of link cards to other docs pages. */
export function NextLinks({ items }: { items: { href: string; title: string; note: string }[] }) {
  return (
    // '&&' beats the guide body's list padding.
    <Box component="ul" sx={{ '&&': { listStyle: 'none', p: 0, m: 0, mt: 2 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
      {items.map((i) => (
        <li key={i.href}>
          <DocLinkCard href={i.href} title={i.title} note={i.note} />
        </li>
      ))}
    </Box>
  );
}

/** Numbered steps with a bold lead-in per step. */
export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <Box component="ol" sx={{ pl: 3, '& > li': { my: 1.5, pl: 0.5 }, '& > li::marker': { fontWeight: 700, color: 'text.primary' } }}>
      {children}
    </Box>
  );
}
