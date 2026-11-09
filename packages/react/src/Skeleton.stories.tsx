import { Box, Stack, Typography } from '@mui/material';
import { srOnly } from '@sorbet-ui/core';
import * as React from 'react';
import { Meta, StoryObj } from 'storybook/react';
import { expect } from 'storybook/test';
import { Button } from './Button';
import { Card } from './Card';
import { Skeleton, SkeletonColor, SkeletonShape, SkeletonVariant } from './Skeleton';

// =============================================================================
// SAMPLE DATA
// =============================================================================

const VARIANTS: SkeletonVariant[] = ['solid', 'soft', 'outlined', 'ghost', 'plain'];
const COLORS: SkeletonColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
];
const SHAPES: SkeletonShape[] = ['text', 'rectangular', 'rounded', 'circular'];

const Caption = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="caption"
    color="text.secondary"
    sx={{ mb: 1, display: 'block', textTransform: 'capitalize' }}
  >
    {children}
  </Typography>
);

/** A card placeholder: avatar, two lines and a media block. */
const CardSkeleton = (props: { variant?: SkeletonVariant; color?: SkeletonColor }) => (
  <Box sx={{ width: 260 }}>
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
      <Skeleton {...props} shape="circular" size="md" />
      <Box sx={{ flex: 1 }}>
        <Skeleton {...props} width="70%" />
        <Skeleton {...props} width="40%" size="sm" />
      </Box>
    </Stack>
    <Skeleton {...props} shape="rounded" size="lg" />
  </Box>
);

// =============================================================================
// META
// =============================================================================

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    width: 240,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: VARIANTS,
      description: 'Visual style variant',
    },
    shape: {
      control: { type: 'select' },
      options: SHAPES,
      description: 'Placeholder shape',
    },
    color: {
      control: { type: 'select' },
      options: COLORS,
      description: 'Color scheme',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Skeleton size',
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', false],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// VARIANT STORIES
// =============================================================================

export const Solid: Story = { args: { variant: 'solid', shape: 'rounded' } };
export const Soft: Story = { args: { variant: 'soft', shape: 'rounded' } };
export const Outlined: Story = { args: { variant: 'outlined', shape: 'rounded' } };
export const Ghost: Story = { args: { variant: 'ghost', shape: 'rounded' } };
export const Plain: Story = { args: { variant: 'plain', shape: 'rounded' } };

export const Shapes: Story = {
  render: () => (
    <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-end', flexWrap: 'wrap' }} useFlexGap>
      {SHAPES.map((shape) => (
        <Box key={shape} sx={{ width: shape === 'circular' ? 'auto' : 160 }}>
          <Caption>{shape}</Caption>
          <Skeleton shape={shape} />
        </Box>
      ))}
    </Stack>
  ),
};

// =============================================================================
// COLOR STORIES
// =============================================================================

export const VariantColorMatrix: Story = {
  name: 'Variant × Color Matrix',
  render: () => (
    <Stack spacing={3}>
      {VARIANTS.map((variant) => (
        <Box key={variant}>
          <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {variant}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
              gap: 2,
            }}
          >
            {COLORS.map((color) => (
              <Box key={color}>
                <Caption>{color}</Caption>
                <Skeleton variant={variant} color={color} shape="rounded" size="xs" />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Stack>
  ),
};

// =============================================================================
// SIZE STORIES
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <Stack spacing={3}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Stack key={size} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ width: 24 }}>
            {size.toUpperCase()}
          </Typography>
          <Skeleton shape="circular" size={size} />
          <Skeleton size={size} width={200} />
        </Stack>
      ))}
    </Stack>
  ),
};

// =============================================================================
// FEATURE STORIES
// =============================================================================

export const Animations: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 260 }}>
      <Caption>Pulse (default)</Caption>
      <Skeleton shape="rounded" size="sm" />
      <Caption>Wave</Caption>
      <Skeleton shape="rounded" size="sm" animation="wave" />
      <Caption>None</Caption>
      <Skeleton shape="rounded" size="sm" animation={false} />
      <Typography variant="body2" color="text.secondary">
        Both animations stop when the OS asks for reduced motion.
      </Typography>
    </Stack>
  ),
};

/** MUI's shape values still work in `variant`, so existing Skeletons drop in unchanged. */
export const MuiCompatibility: Story = {
  name: 'MUI variant values',
  render: () => (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={120} height={60} />
      <Skeleton variant="rounded" width={120} height={60} />
      <Skeleton variant="text" width={120} sx={{ fontSize: '1rem' }} />
    </Stack>
  ),
};

/**
 * The recommended pattern: skeletons are aria-hidden, and the region that is loading
 * sets aria-busy and carries a text alternative.
 */
export const LoadingCard: Story = {
  render: function LoadingCardDemo() {
    const [loading, setLoading] = React.useState(true);
    return (
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Card variant="outlined" sx={{ p: 2, width: 300 }} aria-busy={loading} aria-live="polite">
          {loading ? (
            <>
              <span style={srOnly}>Loading profile…</span>
              <CardSkeleton />
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 700 }}>Maya Chen</Typography>
              <Typography variant="body2" color="text.secondary">
                Product designer
              </Typography>
            </>
          )}
        </Card>
        <Button size="sm" variant="outlined" onClick={() => setLoading((l) => !l)}>
          {loading ? 'Finish loading' : 'Reload'}
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const skeletons = canvasElement.querySelectorAll('.MuiSkeleton-root');
    await expect(skeletons.length).toBeGreaterThan(0);
    skeletons.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
    await expect(canvasElement.querySelector('[aria-busy="true"]')).toHaveTextContent(
      'Loading profile…'
    );
  },
};

// =============================================================================
// DARK MODE
// =============================================================================

export const DarkMode: Story = {
  // Rendered with darkTheme (see .storybook/preview.tsx), on the page and on paper.
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <Stack spacing={3}>
      {(['default', 'paper'] as const).map((surface) => (
        <Box key={surface} sx={{ p: 2, borderRadius: 2, bgcolor: `background.${surface}` }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            On the {surface === 'default' ? 'page' : 'paper'}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 3 }}>
            {VARIANTS.map((variant) => (
              <Box key={variant}>
                <Caption>{variant}</Caption>
                <CardSkeleton variant={variant} />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Stack>
  ),
};
