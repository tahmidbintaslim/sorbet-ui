'use client';
// @example {"title":"Loading","description":"loading shows a spinner while work is in progress; swap the message when it finishes."}
import * as React from 'react';
import { Button, Snackbar } from '@sorbet-ui/react';

export default function Loading() {
  const [state, setState] = React.useState<'idle' | 'working' | 'done'>('idle');
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const start = () => {
    setState('working');
    timer.current = window.setTimeout(() => setState('done'), 2000);
  };
  return (
    <>
      <Button onClick={start} disabled={state === 'working'}>
        Export report
      </Button>
      <Snackbar
        open={state !== 'idle'}
        onClose={(_e, reason) => reason !== 'clickaway' && state === 'done' && setState('idle')}
        autoHideDuration={state === 'done' ? 3000 : null}
        loading={state === 'working'}
        color={state === 'done' ? 'success' : 'neutral'}
        message={state === 'done' ? 'Report exported' : 'Exporting report'}
      />
    </>
  );
}
