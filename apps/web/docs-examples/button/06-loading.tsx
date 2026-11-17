'use client';
// @example {"title":"Loading","description":"A loading button is disabled and sets aria-busy. Press one to see it work."}
import * as React from 'react';
import { Stack } from '@mui/material';
import Save from '@mui/icons-material/SaveOutlined';
import { Button } from '@sorbet-ui/react';

function SaveButton({ position }: { position: 'start' | 'center' | 'end' }) {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const save = () => {
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), 1500);
  };
  return (
    <Button
      variant={position === 'center' ? 'solid' : 'soft'}
      loading={loading}
      loadingPosition={position}
      startIcon={position === 'start' ? <Save /> : undefined}
      onClick={save}
    >
      Save ({position})
    </Button>
  );
}

export default function Loading() {
  return (
    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
      <SaveButton position="start" />
      <SaveButton position="center" />
      <SaveButton position="end" />
    </Stack>
  );
}
