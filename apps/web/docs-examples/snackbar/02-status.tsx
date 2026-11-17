'use client';
// @example {"title":"Status colors","description":"Pair a color with an icon so the status does not rely on color alone."}
import * as React from 'react';
import { Stack } from '@mui/material';
import Check from '@mui/icons-material/CheckCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Info from '@mui/icons-material/InfoOutlined';
import { Button, Snackbar } from '@sorbet-ui/react';

const TOASTS = {
  success: { label: 'Success', message: 'Project published', icon: <Check fontSize="small" /> },
  danger: { label: 'Error', message: 'Could not reach the server', icon: <ErrorIcon fontSize="small" /> },
  info: { label: 'Info', message: 'A new build has started', icon: <Info fontSize="small" /> },
} as const;

type Kind = keyof typeof TOASTS;

export default function Status() {
  const [kind, setKind] = React.useState<Kind>('success');
  const [open, setOpen] = React.useState(false);
  const show = (next: Kind) => {
    setKind(next);
    setOpen(true);
  };
  return (
    <>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {(Object.keys(TOASTS) as Kind[]).map((k) => (
          <Button key={k} variant="soft" color={k} onClick={() => show(k)}>
            {TOASTS[k].label}
          </Button>
        ))}
      </Stack>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={4000}
        color={kind}
        startIcon={TOASTS[kind].icon}
        message={TOASTS[kind].message}
      />
    </>
  );
}
