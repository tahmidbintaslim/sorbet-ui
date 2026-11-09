'use client';
import * as React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Check from '@mui/icons-material/Check';
import ErrorOutline from '@mui/icons-material/ErrorOutlineOutlined';
import { touchTarget } from '@/lib/touch';

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

type CopyState = 'idle' | 'copied' | 'failed';

function useCopy(text: string) {
  const [state, setState] = React.useState<CopyState>('idle');
  const timer = React.useRef<number | undefined>(undefined);
  // Never set state after the block unmounts (e.g. navigating away right after copying).
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    window.clearTimeout(timer.current);
    let next: CopyState;
    try {
      // Clipboard access can be missing (insecure context) or denied (permissions).
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      next = 'copied';
    } catch {
      next = 'failed';
    }
    setState(next);
    // A failure stays up longer so there is time to read it.
    timer.current = window.setTimeout(() => setState('idle'), next === 'failed' ? 5000 : 1500);
  };
  return { state, copy };
}

const FAILED = 'Copy failed. Select the code and copy it manually.';
// Visually hidden but announced. Pixel strings: in sx, width: 1 would mean 100%.
const SR_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  p: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

function CopyButton({ text, onDark }: { text: string; onDark?: boolean }) {
  const { state, copy } = useCopy(text);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
      {/* Announces the result; the failure is also shown as text, not only in a tooltip. */}
      <Typography
        component="span"
        role="status"
        sx={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.4,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          // Its own background so it stays readable where it overlaps the code.
          color: onDark ? '#fecaca' : 'text.primary',
          bgcolor: onDark ? '#450a0a' : 'background.paper',
          ...(state !== 'failed' && SR_ONLY),
        }}
      >
        {state === 'failed' ? FAILED : state === 'copied' ? 'Copied' : ''}
      </Typography>
      <Tooltip title={state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}>
        <IconButton
          size="small"
          onClick={copy}
          aria-label="Copy code"
          data-copy-state={state}
          sx={[touchTarget, onDark ? { color: '#cbd5e1', '&:hover': { bgcolor: 'rgba(255,255,255,.08)' } } : {}]}
        >
          {state === 'copied' ? (
            <Check fontSize="small" />
          ) : state === 'failed' ? (
            <ErrorOutline fontSize="small" sx={{ color: onDark ? '#fca5a5' : 'error.main' }} />
          ) : (
            <ContentCopy fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/** One-line shell command in a pill, with a `$` prompt and a copy button that never overlaps the text. */
export function CommandLine({ command, label = 'Install command', mt = 3 }: { command: string; label?: string; mt?: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt,
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
