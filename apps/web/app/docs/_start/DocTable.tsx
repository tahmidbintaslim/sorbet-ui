// A plain data table for guides. Scrolls inside its own focusable region on
// narrow screens, so the page itself never scrolls sideways.
import * as React from 'react';
import { Box } from '@mui/material';

const cell = { px: 2, py: 1.5, textAlign: 'left', verticalAlign: 'top', borderBottom: 1, borderColor: 'divider' } as const;

export default function DocTable({
  label,
  head,
  rows,
  minWidth = 640,
  testId,
}: {
  /** Accessible name of the scroll region and caption of the table. */
  label: string;
  head: string[];
  rows: React.ReactNode[][];
  minWidth?: number;
  testId?: string;
}) {
  return (
    <Box
      role="region"
      aria-label={label}
      tabIndex={0}
      data-testid={testId}
      sx={{
        position: 'relative',
        my: 3,
        overflowX: 'auto',
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
    >
      <Box component="table" sx={{ width: '100%', minWidth, borderCollapse: 'collapse', fontSize: 14, lineHeight: 1.6 }}>
        <Box component="caption" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          {label}
        </Box>
        <Box component="thead" sx={{ bgcolor: 'action.hover' }}>
          <tr>
            {head.map((h) => (
              <Box component="th" scope="col" key={h} sx={{ ...cell, py: 1.25, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {h}
              </Box>
            ))}
          </tr>
        </Box>
        <tbody>
          {rows.map((row, r) => (
            <Box component="tr" key={r} sx={r === rows.length - 1 ? { '& > *': { borderBottom: 0 } } : undefined}>
              {row.map((c, i) =>
                i === 0 ? (
                  <Box component="th" scope="row" key={i} sx={{ ...cell, fontWeight: 600, whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {c}
                  </Box>
                ) : (
                  <Box component="td" key={i} sx={{ ...cell, color: 'text.secondary' }}>
                    {c}
                  </Box>
                ),
              )}
            </Box>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}
