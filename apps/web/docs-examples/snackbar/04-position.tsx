'use client';
// @example {"title":"Position","description":"anchorOrigin (from MUI) picks the edge and the corner."}
import * as React from 'react';
import { Box } from '@mui/material';
import { Button, Snackbar } from '@sorbet-ui/react';

type Origin = { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };

const ORIGINS: Origin[] = [
  { vertical: 'top', horizontal: 'left' },
  { vertical: 'top', horizontal: 'center' },
  { vertical: 'top', horizontal: 'right' },
  { vertical: 'bottom', horizontal: 'left' },
  { vertical: 'bottom', horizontal: 'center' },
  { vertical: 'bottom', horizontal: 'right' },
];

export default function Position() {
  const [origin, setOrigin] = React.useState<Origin>(ORIGINS[4]);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 1 }}>
        {ORIGINS.map((o) => (
          <Button
            key={`${o.vertical}-${o.horizontal}`}
            size="sm"
            variant="soft"
            onClick={() => {
              setOrigin(o);
              setOpen(true);
            }}
          >
            {o.vertical} {o.horizontal}
          </Button>
        ))}
      </Box>
      <Snackbar
        key={`${origin.vertical}-${origin.horizontal}`}
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
        anchorOrigin={origin}
        message={`Shown at ${origin.vertical} ${origin.horizontal}`}
      />
    </>
  );
}
