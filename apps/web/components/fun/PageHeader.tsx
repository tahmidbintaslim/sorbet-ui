'use client';
// Page header band for every section: a soft wash in the section's flavor under a
// striped awning valance with a scalloped edge, a doodle that sketches itself, and
// a short handwritten aside. The text stays plain and calm; all decoration is
// aria-hidden, clipped to the band and still under reduced motion.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Container, Link, Typography } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { scoop, type Scoop } from '@/lib/scoops';
import { touchRow } from '@/lib/touch';
import Doodle, { type DoodleName } from './Doodles';
import { scallopMask } from './Decor';

const R = 12; // scallop radius; one awning stripe per scallop
// Room kept free beside the title for the doodle on phones and tablets.
const PHONE_DOODLE = { xs: '84px', sm: '108px', md: 0 } as const;

/** Striped awning valance with a scalloped bottom edge. */
export function Awning({ flavor, r = R }: { flavor: Scoop; r?: number }) {
  return (
    <Box
      aria-hidden
      data-testid="awning"
      sx={{
        height: r + 10,
        background: `repeating-linear-gradient(90deg, ${scoop(flavor, 'candy')} 0 ${r * 2}px, ${scoop(flavor, 'pastel')} ${r * 2}px ${r * 4}px)`,
        ...scallopMask({ top: false, r }),
      }}
    />
  );
}

// Sprinkles scattered on the right of the band (never behind the text).
const SPRINKLES: { left: string; top: string; r: number; c: Scoop; dot?: boolean }[] = [
  { left: '58%', top: '18%', r: -30, c: 'danger' },
  { left: '66%', top: '70%', r: 40, c: 'primary' },
  { left: '72%', top: '26%', r: 70, c: 'warning', dot: true },
  { left: '94%', top: '14%', r: 15, c: 'secondary' },
  { left: '96%', top: '66%', r: -50, c: 'success' },
  { left: '61%', top: '48%', r: 0, c: 'info', dot: true },
];

function Sprinkles() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // A slight drift while the band scrolls away. No loop, no layout.
  const y = useTransform(scrollY, [0, 500], [0, reduce ? 0 : -36]);
  return (
    <motion.div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', y }}>
      {SPRINKLES.map((s, i) => (
        <Box
          key={i}
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.dot ? 9 : 16,
            height: s.dot ? 9 : 6,
            borderRadius: 999,
            bgcolor: scoop(s.c, 'fill'),
            transform: `rotate(${s.r}deg)`,
          }}
        />
      ))}
    </motion.div>
  );
}

export default function PageHeader({
  flavor,
  title,
  aside,
  doodle,
  back,
  badge,
  action,
  size = 'md',
  bleed = false,
  children,
}: {
  flavor: Scoop;
  title: React.ReactNode;
  /** Handwritten note above the title: one to three words, decorative. */
  aside?: string;
  doodle: DoodleName;
  back?: { href: string; label: string };
  /** Shown beside the title (e.g. a sticker). */
  badge?: React.ReactNode;
  /** Shown under the description (e.g. a button). */
  action?: React.ReactNode;
  size?: 'md' | 'lg';
  /** Full-width band with its own container (pages without a sidebar). */
  bleed?: boolean;
  children?: React.ReactNode;
}) {
  const inner = (
    <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 4, py: { xs: 3, md: bleed ? 6 : 4.5 } }}>
      <Box sx={{ flex: 1, minWidth: 0, maxWidth: { md: '58%' } }}>
        {back && (
          <Link
            component={NextLink}
            href={back.href}
            underline="hover"
            sx={{ fontSize: 14, fontWeight: 600, color: scoop(flavor, 'ink'), ...touchRow, display: 'inline-flex', mb: { md: 0.5 } }}
          >
            ← {back.label}
          </Link>
        )}
        {aside && (
          <Typography
            aria-hidden
            component="span"
            sx={{
              display: 'block',
              width: 'fit-content',
              fontFamily: 'var(--font-hand), cursive',
              fontSize: { xs: 24, md: 28 },
              lineHeight: 1,
              color: scoop(flavor, 'ink'),
              rotate: '-3deg',
              transformOrigin: '0 100%',
              mb: 0.5,
              mr: PHONE_DOODLE,
            }}
          >
            {aside}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 1.5, mr: PHONE_DOODLE }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              fontSize: size === 'lg' ? { xs: 40, md: 56 } : { xs: 34, md: 44 },
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </Typography>
          {badge}
        </Box>
        {children && (
          <Typography
            component="div"
            color="text.secondary"
            sx={{ mt: 1.5, fontSize: size === 'lg' ? 18 : 16, textWrap: 'pretty', '& a': { color: scoop(flavor, 'ink'), fontWeight: 600 } }}
          >
            {children}
          </Typography>
        )}
        {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
      </Box>
      <Doodle
        name={doodle}
        flavor={flavor}
        sx={{
          width: { xs: 76, sm: 96, md: bleed ? 168 : 140 },
          // Phones: tucked into the top corner so the text keeps the full width.
          position: { xs: 'absolute', md: 'relative' },
          top: { xs: 16, md: 'auto' },
          right: { xs: 0, md: 'auto' },
          mx: { md: 'auto' },
          transition: 'rotate .5s cubic-bezier(.3,1.8,.5,1), scale .5s cubic-bezier(.3,1.8,.5,1)',
          '.page-header:hover &': { rotate: '6deg', scale: '1.05' },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none', '.page-header:hover &': { rotate: 'none', scale: 'none' } },
        }}
      />
    </Box>
  );
  return (
    <Box
      className="page-header"
      data-testid="page-header"
      data-flavor={flavor}
      sx={{
        position: 'relative',
        // In the docs column the band bleeds to the screen edges on phones.
        ...(!bleed && { mx: { xs: -2, sm: -3, md: 0 }, mb: 3 }),
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: scoop(flavor, 'tint'),
          ...(!bleed && { px: { xs: 2, sm: 3, md: 4 }, borderRadius: { md: '20px 20px 0 0' } }),
        }}
      >
        <Sprinkles />
        {bleed ? <Container maxWidth="lg">{inner}</Container> : inner}
      </Box>
      <Awning flavor={flavor} />
    </Box>
  );
}
