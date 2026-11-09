'use client';
// Live GitHub star count. Fetched in the browser (the site is a static export),
// cached for the session, and the number is simply hidden if the API fails or
// is rate limited — never a made-up fallback.
import * as React from 'react';
import { Box, Button } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import GitHub from '@mui/icons-material/GitHub';
import StarRounded from '@mui/icons-material/StarRounded';
import { SITE } from '@/lib/site';

const KEY = 'sorbet-gh-stars';
const API = 'https://api.github.com/repos/tahmidbintaslim/sorbet-ui';

// Shared across header and footer so a first visit makes one request, not two.
let pending: Promise<number | null> | null = null;

function loadStars(): Promise<number | null> {
  try {
    const cached = window.sessionStorage.getItem(KEY);
    if (cached) return Promise.resolve(Number(cached));
  } catch {
    /* storage unavailable */
  }
  pending ??= fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { stargazers_count?: number } | null) => {
      const n = typeof d?.stargazers_count === 'number' ? d.stargazers_count : null;
      if (n !== null) {
        try {
          window.sessionStorage.setItem(KEY, String(n));
        } catch {
          /* ignore */
        }
      }
      return n;
    })
    .catch(() => {
      pending = null; // allow a retry on the next mount
      return null;
    });
  return pending;
}

export function useGitHubStars(): number | null {
  const [stars, setStars] = React.useState<number | null>(null);
  React.useEffect(() => {
    let live = true;
    loadStars().then((n) => live && setStars(n));
    return () => {
      live = false;
    };
  }, []);
  return stars;
}

export const formatStars = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/** Compact "Star" button with the live count; used in the header and footer. */
export default function GitHubStars({ size = 'small' }: { size?: 'small' | 'medium' }) {
  const stars = useGitHubStars();
  const reduce = useReducedMotion();
  return (
    <Button
      component="a"
      href={SITE.github}
      rel="noopener"
      variant="outlined"
      size={size}
      color="inherit"
      aria-label={stars ? `Star Sorbet UI on GitHub, ${stars} stars` : 'Star Sorbet UI on GitHub'}
      startIcon={<GitHub fontSize="small" />}
      sx={{ borderColor: 'divider', borderRadius: 2, fontWeight: 600, gap: 0.25 }}
    >
      Star
      <AnimatePresence>
        {!!stars && (
          <Box
            component={motion.span}
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.75, pl: 0.75, borderLeft: 1, borderColor: 'divider' }}
          >
            <StarRounded sx={{ fontSize: 16, color: 'warning.main', mr: 0.25 }} />
            {formatStars(stars)}
          </Box>
        )}
      </AnimatePresence>
    </Button>
  );
}
