'use client';
// A help-center card: a flavored sticker icon, a title and one line, the whole card
// one link. Icons are picked by name here so server pages pass only strings.
import NextLink from 'next/link';
import { Box, Typography } from '@mui/material';
import MenuBook from '@mui/icons-material/MenuBookOutlined';
import HelpOutline from '@mui/icons-material/HelpOutlineOutlined';
import BugReport from '@mui/icons-material/BugReportOutlined';
import Lightbulb from '@mui/icons-material/LightbulbOutlined';
import Forum from '@mui/icons-material/ForumOutlined';
import Shield from '@mui/icons-material/ShieldOutlined';
import Handshake from '@mui/icons-material/HandshakeOutlined';
import History from '@mui/icons-material/History';
import NorthEast from '@mui/icons-material/NorthEast';
import { scoop, type Scoop } from '@/lib/scoops';

const ICONS = {
  docs: MenuBook,
  faq: HelpOutline,
  bug: BugReport,
  idea: Lightbulb,
  question: Forum,
  security: Shield,
  contribute: Handshake,
  changelog: History,
};
export type HelpIcon = keyof typeof ICONS;

export default function HelpCard({
  href,
  title,
  description,
  flavor,
  icon,
  testId,
}: {
  href: string;
  title: string;
  description: string;
  flavor: Scoop;
  icon: HelpIcon;
  testId?: string;
}) {
  const Icon = ICONS[icon];
  const external = !href.startsWith('/');
  return (
    <Box
      component={external ? 'a' : NextLink}
      href={href}
      rel={external ? 'noopener' : undefined}
      data-testid={testId}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100%',
        p: 2.5,
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary',
        textDecoration: 'none',
        transition: 'border-color .2s, transform .3s cubic-bezier(.3,1.8,.5,1), box-shadow .2s',
        '&:hover, &:focus-visible': {
          borderColor: scoop(flavor, 'fill'),
          transform: 'translateY(-3px) rotate(-.5deg)',
          boxShadow: `0 10px 24px -14px ${scoop(flavor, 'glow')}`,
        },
        '&:hover .help-icon': { rotate: '-8deg', scale: '1.08' },
        '&:focus-visible': { outline: '2px solid', outlineColor: scoop(flavor, 'ink'), outlineOffset: 2 },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover, &:focus-visible': { transform: 'none' },
          '&:hover .help-icon': { rotate: 'none', scale: 'none' },
        },
      }}
    >
      <Box
        className="help-icon"
        aria-hidden
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 48,
          height: 48,
          borderRadius: '50% 50% 46% 54% / 58% 56% 44% 42%',
          bgcolor: scoop(flavor, 'pastel'),
          color: scoop(flavor, 'ink'),
          border: '2px dashed',
          borderColor: scoop(flavor, 'fill'),
          transition: 'rotate .35s cubic-bezier(.3,1.8,.5,1), scale .35s cubic-bezier(.3,1.8,.5,1)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
      </Box>
      <Typography component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 800, fontSize: 17, mt: 0.5 }}>
        {title}
        {external && <NorthEast aria-hidden sx={{ fontSize: 15, color: 'text.secondary' }} />}
      </Typography>
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
        {description}
      </Typography>
    </Box>
  );
}
