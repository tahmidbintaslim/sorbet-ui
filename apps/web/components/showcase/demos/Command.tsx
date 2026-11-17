'use client';
// Command menu: type to filter, arrow keys to move, Enter to run. A combobox with a
// listbox, so the active option is announced while focus stays in the field.
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutlineOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import PersonAddAlt from '@mui/icons-material/PersonAddAlt';
import PrintOutlined from '@mui/icons-material/PrintOutlined';
import Search from '@mui/icons-material/Search';
import { TextField } from '@sorbet-ui/react';

const COMMANDS = [
  { id: 'new', label: 'New order', hint: 'N', Icon: AddCircleOutline },
  { id: 'restock', label: 'Restock a flavor', hint: 'R', Icon: Inventory2Outlined },
  { id: 'print', label: 'Print today’s report', hint: 'P', Icon: PrintOutlined },
  { id: 'invite', label: 'Invite a teammate', hint: 'I', Icon: PersonAddAlt },
  { id: 'dark', label: 'Switch the till to dark', hint: 'D', Icon: DarkModeOutlined },
];

export default function Command() {
  const id = React.useId();
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const [ran, setRan] = React.useState('');
  const q = query.trim().toLowerCase();
  const list = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  const at = Math.min(active, Math.max(list.length - 1, 0));

  const run = (label: string) => {
    setRan(label);
    setQuery('');
    setActive(0);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (list.length) setActive((at + (e.key === 'ArrowDown' ? 1 : list.length - 1)) % list.length);
    } else if (e.key === 'Enter' && list[at]) {
      e.preventDefault();
      run(list[at].label);
    } else if (e.key === 'Escape') setQuery('');
  };

  return (
    <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
      <Box sx={(t) => ({ width: '100%', maxWidth: 330, borderRadius: '20px', overflow: 'hidden', bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}`, boxShadow: '0 1px 2px rgb(15 23 42 / 0.05), 0 18px 36px -18px rgb(15 23 42 / 0.25)' })}>
        <Box sx={{ p: 1.25 }}>
          <TextField
            fullWidth
            size="sm"
            variant="soft"
            color="neutral"
            placeholder="Type a command"
            startIcon={<Search sx={{ fontSize: 18 }} />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            slotProps={{
              htmlInput: {
                role: 'combobox',
                'aria-label': 'Command',
                'aria-expanded': true,
                'aria-controls': `${id}-list`,
                'aria-autocomplete': 'list',
                'aria-activedescendant': list[at] ? `${id}-${list[at].id}` : undefined,
                autoComplete: 'off',
              },
            }}
            sx={{ '& .MuiInputBase-root': { minHeight: 40 }, '& input': { fontSize: 14 } }}
          />
        </Box>
        <Box component="ul" role="listbox" id={`${id}-list`} aria-label="Commands" sx={(t) => ({ m: 0, p: 0.75, height: 176, overflowY: 'auto', borderTop: `1px solid ${t.palette.divider}` })}>
          {list.map((c, i) => (
            <Box
              component="li"
              role="option"
              key={c.id}
              id={`${id}-${c.id}`}
              aria-selected={i === at}
              onClick={() => run(c.label)}
              onMouseMove={() => setActive(i)}
              sx={(t) => ({
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.25,
                minHeight: 34,
                borderRadius: '10px',
                fontSize: 13.5,
                cursor: 'pointer',
                '&[aria-selected="true"]': { bgcolor: t.palette.mode === 'dark' ? 'rgb(255 255 255 / 0.08)' : 'rgb(15 23 42 / 0.06)', fontWeight: 600 },
                '@media (pointer: coarse)': { minHeight: 44 },
              })}
            >
              <c.Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box component="span" sx={{ flex: 1 }}>
                {c.label}
              </Box>
              <Box component="kbd" aria-hidden sx={(t) => ({ px: 0.75, borderRadius: '6px', border: `1px solid ${t.palette.divider}`, fontFamily: 'inherit', fontSize: 11, color: 'text.secondary' })}>
                {c.hint}
              </Box>
            </Box>
          ))}
          {!list.length && (
            <Typography component="li" role="presentation" sx={{ listStyle: 'none', p: 2, fontSize: 13.5, color: 'text.secondary', textAlign: 'center' }}>
              No command matches “{query}”
            </Typography>
          )}
        </Box>
        <Typography role="status" sx={(t) => ({ px: 1.75, py: 1, minHeight: 36, fontSize: 12.5, color: 'text.secondary', borderTop: `1px solid ${t.palette.divider}` })}>
          {ran ? `Ran: ${ran}` : '↑ ↓ to move, Enter to run'}
        </Typography>
      </Box>
    </Box>
  );
}
