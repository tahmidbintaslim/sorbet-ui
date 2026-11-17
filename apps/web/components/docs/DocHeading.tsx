'use client';
// Section heading with an anchor: the link jumps to the heading and copies its URL.
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import Check from '@mui/icons-material/Check';
import { TOUCH } from '@/lib/touch';

/** Offset that keeps a jumped-to heading clear of the sticky site header. */
export const ANCHOR_OFFSET = 88;

export default function DocHeading({
  id,
  level,
  children,
  label,
  before,
}: {
  id: string;
  level: 2 | 3;
  children: React.ReactNode;
  /** Plain-text title for the link's accessible name (defaults to children when it is a string). */
  label?: string;
  /** Decoration before the title (e.g. a flavor dot). */
  before?: React.ReactNode;
}) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const name = label ?? (typeof children === 'string' ? children : id);

  const copy = () => {
    // The link still navigates to the anchor; copying is a bonus that may be unavailable.
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1500);
      },
      () => undefined,
    );
  };

  return (
    <Typography
      component={level === 2 ? 'h2' : 'h3'}
      id={id}
      data-doc-heading
      sx={{
        scrollMarginTop: ANCHOR_OFFSET,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontWeight: level === 2 ? 800 : 700,
        fontSize: level === 2 ? { xs: 24, md: 28 } : 18,
        letterSpacing: level === 2 ? '-0.02em' : 0,
        lineHeight: 1.3,
        '& .anchor': { opacity: 0 },
        '&:hover .anchor, & .anchor:focus-visible, & .anchor[data-copied="true"]': { opacity: 1 },
        // No hover on touch screens: keep the link visible there.
        [TOUCH]: { '& .anchor': { opacity: 1 } },
      }}
    >
      {before}
      <span>{children}</span>
      <Box
        component="a"
        className="anchor"
        href={`#${id}`}
        onClick={copy}
        aria-label={`Copy link to ${name}`}
        data-copied={copied}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 1,
          color: 'text.secondary',
          transition: 'opacity .15s, background-color .15s',
          '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
          [TOUCH]: { width: 44, height: 44, my: -1 },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        {copied ? <Check sx={{ fontSize: 18 }} /> : <LinkIcon sx={{ fontSize: 18 }} />}
      </Box>
      <Box component="span" role="status" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
        {copied ? 'Link copied' : ''}
      </Box>
    </Typography>
  );
}
