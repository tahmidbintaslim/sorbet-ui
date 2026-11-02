'use client';
import * as React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Check from '@mui/icons-material/Check';

// Monospace code block with a copy button. Clipboard access can be denied
// (insecure context, permissions), so failures are swallowed quietly.
export default function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'action.hover',
        my: 2,
      }}
    >
      <Box
        component="pre"
        tabIndex={0}
        aria-label={label ?? 'Code example'}
        sx={{
          m: 0,
          p: 2,
          pr: 6,
          overflowX: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <code>{code}</code>
      </Box>
      <Tooltip title={copied ? 'Copied' : 'Copy'}>
        <IconButton
          size="small"
          onClick={copy}
          aria-label="Copy code"
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
