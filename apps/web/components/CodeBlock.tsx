'use client';
import * as React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Check from '@mui/icons-material/Check';

const MONO = 'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

// Code surface is dark in both color modes (like most docs sites). Token colors
// are picked to stay above 7:1 on the background so axe passes in both themes.
const CODE_BG = '#0b1220';
const TOKEN = {
  plain: '#e2e8f0',
  comment: '#94a3b8',
  string: '#86efac',
  keyword: '#c4b5fd',
  tag: '#7dd3fc',
} as const;

// Tiny TSX/shell highlighter: comments, strings, keywords and JSX tags. Good
// enough for short docs snippets and avoids shipping a full highlighter.
const RE =
  /(\/\/.*$|^#.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(import|from|export|default|function|return|const|let|type|interface|npm|pnpm|yarn|install|add)\b|(<\/?[A-Za-z][\w.]*)/gm;

function highlight(code: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push(code.slice(last, i));
    const color = m[1] ? TOKEN.comment : m[2] ? TOKEN.string : m[3] ? TOKEN.keyword : TOKEN.tag;
    out.push(
      <span key={i} style={{ color }}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

function useCopy(text: string) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    // Clipboard access can be denied (insecure context, permissions): fail quietly.
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return { copied, copy };
}

function CopyButton({ text, onDark }: { text: string; onDark?: boolean }) {
  const { copied, copy } = useCopy(text);
  return (
    <Tooltip title={copied ? 'Copied' : 'Copy'}>
      <IconButton
        size="small"
        onClick={copy}
        aria-label="Copy code"
        sx={onDark ? { color: '#cbd5e1', '&:hover': { bgcolor: 'rgba(255,255,255,.08)' } } : undefined}
      >
        {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

/** One-line shell command in a pill, with a `$` prompt and a copy button that never overlaps the text. */
export function CommandLine({ command, label = 'Install command' }: { command: string; label?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt: 3,
        pl: 2,
        pr: 0.5,
        py: 0.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 999,
        bgcolor: 'background.paper',
        maxWidth: '100%',
      }}
    >
      <Typography component="span" aria-hidden sx={{ fontFamily: MONO, color: 'text.secondary', fontSize: 14 }}>
        $
      </Typography>
      <Box
        component="code"
        tabIndex={0}
        aria-label={label}
        sx={{
          flex: 1,
          minWidth: 0,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          fontFamily: MONO,
          fontSize: 14,
          py: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {command}
      </Box>
      <CopyButton text={command} />
    </Box>
  );
}

/** Multi-line code panel with an optional file name header and syntax colors. */
export default function CodeBlock({ code, label, title }: { code: string; label?: string; title?: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '12px',
        bgcolor: CODE_BG,
        color: TOKEN.plain,
        my: 2,
        overflow: 'hidden',
        border: 1,
        borderColor: 'rgba(148,163,184,.18)',
      }}
    >
      {title ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 0.5,
            borderBottom: '1px solid rgba(148,163,184,.14)',
            minHeight: 40,
          }}
        >
          <Typography component="span" sx={{ fontFamily: MONO, fontSize: 12, color: TOKEN.comment }}>
            {title}
          </Typography>
          <CopyButton text={code} onDark />
        </Box>
      ) : (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CopyButton text={code} onDark />
        </Box>
      )}
      <Box
        component="pre"
        tabIndex={0}
        aria-label={label ?? 'Code example'}
        sx={{ m: 0, p: 2, pr: title ? 2 : 7, overflowX: 'auto', fontFamily: MONO, fontSize: 13, lineHeight: 1.7 }}
      >
        <code>{highlight(code)}</code>
      </Box>
    </Box>
  );
}
