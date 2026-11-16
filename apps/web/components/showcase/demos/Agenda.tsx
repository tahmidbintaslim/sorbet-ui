'use client';
// Agenda: pick a day in the week strip, see what the shop has on.
import * as React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { Avatar } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import type { Color } from '@/lib/site';

type Event = { time: string; title: string; who: string; c: Color };
const DAYS: { short: string; long: string; date: number; events: Event[] }[] = [
  { short: 'Mon', long: 'Monday', date: 16, events: [{ time: '8:00', title: 'Dairy delivery', who: 'RB', c: 'info' }] },
  { short: 'Tue', long: 'Tuesday', date: 17, events: [{ time: '10:30', title: 'Taste test: fig and honey', who: 'KT', c: 'secondary' }, { time: '3:00', title: 'Cone supplier call', who: 'RB', c: 'warning' }] },
  { short: 'Wed', long: 'Wednesday', date: 18, events: [{ time: '9:00', title: 'Churn mango, 6 tubs', who: 'JW', c: 'warning' }, { time: '1:00', title: 'School visit, 24 cups', who: 'PR', c: 'success' }, { time: '5:30', title: 'Freezer check', who: 'RB', c: 'info' }] },
  { short: 'Thu', long: 'Thursday', date: 19, events: [] },
  { short: 'Fri', long: 'Friday', date: 20, events: [{ time: '4:00', title: 'Late opening: night market', who: 'NH', c: 'danger' }] },
  { short: 'Sat', long: 'Saturday', date: 21, events: [{ time: '11:00', title: 'Birthday party, box of 12', who: 'IC', c: 'danger' }, { time: '2:00', title: 'New flavor on the board', who: 'KT', c: 'secondary' }] },
  { short: 'Sun', long: 'Sunday', date: 22, events: [] },
];

export default function Agenda() {
  const [day, setDay] = React.useState(2);
  const d = DAYS[day];
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, p: 1.5 }}>
      <Box role="group" aria-label="Day" sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 0.5 }}>
        {DAYS.map((x, i) => {
          const on = i === day;
          return (
            <ButtonBase
              key={x.short}
              onClick={() => setDay(i)}
              aria-pressed={on}
              aria-label={`${x.long} ${x.date}, ${x.events.length} ${x.events.length === 1 ? 'event' : 'events'}`}
              sx={(t) => ({
                flexDirection: 'column',
                gap: 0.25,
                py: 0.75,
                minHeight: 56,
                borderRadius: '14px',
                bgcolor: on ? 'primary.main' : 'background.paper',
                color: on ? 'primary.contrastText' : 'text.primary',
                border: `1px solid ${on ? 'transparent' : t.palette.divider}`,
                transition: 'background-color .15s',
                '&:focus-visible': { outline: '2px solid', outlineColor: 'text.primary', outlineOffset: 2 },
              })}
            >
              <Box component="span" sx={{ fontSize: 11, fontWeight: 600, opacity: on ? 1 : undefined, color: on ? 'inherit' : 'text.secondary' }}>
                {x.short}
              </Box>
              <Box component="span" sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
                {x.date}
              </Box>
              <Box aria-hidden component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: x.events.length ? 'currentColor' : 'transparent', opacity: 0.7 }} />
            </ButtonBase>
          );
        })}
      </Box>
      <Box role="region" aria-live="polite" aria-label={`${d.long} agenda`} sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', px: 0.5, mb: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            {d.long} {d.date}
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>
            {d.events.length} {d.events.length === 1 ? 'event' : 'events'}
          </Typography>
        </Box>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} style={{ margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {d.events.map((e) => (
              <Box
                component="li"
                key={e.title}
                sx={(t) => ({ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 1.25, pl: 1.25, pr: 1, py: 1, borderRadius: '12px', bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}`, borderLeft: `4px solid ${colorPalette[e.c][400]}` })}
              >
                <Typography component="span" sx={{ width: 38, flexShrink: 0, fontSize: 12.5, fontWeight: 600, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {e.time}
                </Typography>
                <Typography component="span" sx={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>
                  {e.title}
                </Typography>
                <Box aria-hidden sx={{ display: 'flex' }}>
                  <Avatar size="xs" variant="soft" color={e.c} disableAnimation>
                    {e.who}
                  </Avatar>
                </Box>
              </Box>
            ))}
            {!d.events.length && (
              <Typography component="li" sx={{ listStyle: 'none', py: 4, textAlign: 'center', fontSize: 13.5, color: 'text.secondary' }}>
                Nothing booked on {d.long}. Scoop away.
              </Typography>
            )}
          </motion.ul>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
