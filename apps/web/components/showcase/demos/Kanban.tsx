'use client';
// Kanban: drag a ticket to another column, or use its arrow buttons (keyboard and
// screen readers). Cards glide between columns with a shared layout animation.
import * as React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { LayoutGroup, motion } from 'motion/react';
import { Card, Chip } from '@sorbet-ui/react';
import type { Color } from '@/lib/site';
import { TOUCH } from '@/lib/touch';

const COLS = ['Queued', 'Scooping', 'Ready'] as const;
const COL_COLOR: Color[] = ['info', 'warning', 'success'];
type Ticket = { id: string; title: string; tag: string; c: Color; col: number };

const START: Ticket[] = [
  { id: 'a', title: 'Two mango cones', tag: 'Walk-in', c: 'warning', col: 0 },
  { id: 'b', title: 'Pint of ube swirl', tag: 'Delivery', c: 'secondary', col: 0 },
  { id: 'c', title: 'Mint cup, no nuts', tag: 'Walk-in', c: 'success', col: 1 },
  { id: 'd', title: 'Party box of 12', tag: 'Pre-order', c: 'danger', col: 1 },
  { id: 'e', title: 'Sea salt sundae', tag: 'Walk-in', c: 'info', col: 2 },
];

export default function Kanban() {
  const [tickets, setTickets] = React.useState(START);
  const [said, setSaid] = React.useState('');
  const [dragging, setDragging] = React.useState<string | null>(null);

  const move = (id: string, col: number) => {
    const t = tickets.find((x) => x.id === id);
    if (!t || col < 0 || col >= COLS.length || col === t.col) return;
    // Moved tickets go to the end of their new column.
    setTickets((list) => [...list.filter((x) => x.id !== id), { ...t, col }]);
    setSaid(`${t.title} moved to ${COLS[col]}`);
  };

  // Drop: whichever column is under the pointer takes the ticket.
  const drop = (id: string, x: number, y: number) => {
    const el = document.elementsFromPoint(x - window.scrollX, y - window.scrollY).find((e) => (e as HTMLElement).dataset?.col);
    if (el) move(id, Number((el as HTMLElement).dataset.col));
  };

  return (
    <LayoutGroup>
      <Box sx={{ height: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, p: 1.5 }}>
        {COLS.map((name, col) => {
          const mine = tickets.filter((t) => t.col === col);
          return (
            <Box
              key={name}
              role="group"
              aria-label={name}
              data-col={col}
              sx={(t) => ({ display: 'flex', flexDirection: 'column', gap: 1, p: 0.75, borderRadius: '14px', bgcolor: t.palette.mode === 'dark' ? 'rgb(255 255 255 / 0.04)' : 'rgb(15 23 42 / 0.04)', minWidth: 0 })}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, pt: 0.25 }}>
                <Typography component="span" sx={{ fontSize: 12.5, fontWeight: 700 }}>
                  {name}
                </Typography>
                <Chip label={mine.length} size="xs" variant="soft" color={COL_COLOR[col]} disableAnimation />
              </Box>
              {mine.map((t) => (
                <motion.div
                  key={t.id}
                  layoutId={`ticket-${t.id}`}
                  drag
                  dragSnapToOrigin
                  dragElastic={0.9}
                  onDragStart={() => setDragging(t.id)}
                  onDragEnd={(_, info) => {
                    setDragging(null);
                    drop(t.id, info.point.x, info.point.y);
                  }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  style={{ position: 'relative', zIndex: dragging === t.id ? 5 : 1, cursor: dragging === t.id ? 'grabbing' : 'grab', touchAction: 'none' }}
                >
                  <Card variant="outlined" size="xs" disableAnimation data-ticket={t.id} sx={{ p: 1, boxShadow: dragging === t.id ? '0 14px 28px -10px rgb(15 23 42 / 0.4)' : undefined }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{t.title}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.25 }}>{t.tag}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, mx: -0.5, mb: -0.5 }}>
                      {[-1, 1].map((d) => {
                        const to = COLS[t.col + d];
                        return (
                          <IconButton
                            key={d}
                            size="small"
                            disabled={!to}
                            aria-label={to ? `Move ${t.title} to ${to}` : d < 0 ? `${t.title} is in the first column` : `${t.title} is in the last column`}
                            onClick={() => move(t.id, t.col + d)}
                            onPointerDown={(e) => e.stopPropagation()}
                            sx={{ p: 0.25, visibility: to ? 'visible' : 'hidden', [TOUCH]: { minWidth: 44, minHeight: 44 } }}
                          >
                            {d < 0 ? <ChevronLeft sx={{ fontSize: 18 }} /> : <ChevronRight sx={{ fontSize: 18 }} />}
                          </IconButton>
                        );
                      })}
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          );
        })}
      </Box>
      <Box role="status" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}>
        {said}
      </Box>
    </LayoutGroup>
  );
}
