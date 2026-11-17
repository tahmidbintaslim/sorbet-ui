'use client';
// @example {"title":"With an action","description":"action places a button at the end of the alert."}
import * as React from 'react';
import { Box } from '@mui/material';
import { Alert, Button } from '@sorbet-ui/react';

export default function WithAction() {
  const [retries, setRetries] = React.useState(0);
  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Alert
        color="danger"
        action={
          <Button size="sm" variant="plain" color="danger" onClick={() => setRetries((n) => n + 1)}>
            Retry
          </Button>
        }
      >
        Upload failed.{retries > 0 ? ` Retried ${retries} time${retries === 1 ? '' : 's'}.` : ''}
      </Alert>
    </Box>
  );
}
