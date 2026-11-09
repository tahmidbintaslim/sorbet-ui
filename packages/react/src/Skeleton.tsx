import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import type { SorbetColor, SorbetSize, SorbetVariant } from '@sorbet-ui/core';
import { colors, colorScaleForMode, radius } from '@sorbet-ui/tokens';
import * as React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type SkeletonVariant = SorbetVariant;
export type SkeletonColor = SorbetColor;
export type SkeletonSize = SorbetSize;
/** The placeholder's shape (MUI's own Skeleton `variant` values). */
export type SkeletonShape = NonNullable<MuiSkeletonProps['variant']>;

export interface SkeletonProps extends Omit<MuiSkeletonProps, 'variant' | 'color'> {
  /**
   * Visual style variant.
   * - `solid`: an opaque fill from the color's light shades.
   * - `soft`: a translucent tint of the color (the default).
   * - `outlined`: a faint tint with a hairline border.
   * - `ghost`: the faintest tint, for placeholders on busy surfaces.
   * - `plain`: a neutral fill whatever the color.
   *
   * MUI's shape values (`'text'`, `'rectangular'`, `'rounded'`, `'circular'`) are still
   * accepted here for drop-in compatibility; they set the shape and keep the soft
   * look. Prefer `shape` for that.
   */
  variant?: SkeletonVariant | SkeletonShape;
  /** Placeholder shape. Defaults to `'text'`. */
  shape?: SkeletonShape;
  /** Color scheme. Defaults to `'neutral'`. */
  color?: SkeletonColor;
  /**
   * Size preset: the line height for `text`, the diameter for `circular`, and the
   * height for `rectangular` / `rounded`. Explicit `width` / `height` win.
   */
  size?: SkeletonSize;
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeConfig = {
  xs: { fontSize: '0.75rem', circle: 24, block: 48 },
  sm: { fontSize: '0.875rem', circle: 32, block: 72 },
  md: { fontSize: '1rem', circle: 40, block: 96 },
  lg: { fontSize: '1.25rem', circle: 48, block: 128 },
  xl: { fontSize: '1.5rem', circle: 64, block: 192 },
};

const SHAPES: readonly string[] = ['text', 'rectangular', 'rounded', 'circular'];

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

interface StyledProps {
  $variant: SkeletonVariant;
  $color: SkeletonColor;
  $size: SkeletonSize;
}

const StyledSkeleton = styled(MuiSkeleton, {
  shouldForwardProp: (prop) => !['$variant', '$color', '$size'].includes(prop as string),
})<StyledProps>(({ theme, $variant, $color, $size }) => {
  const isDark = theme.palette.mode === 'dark';
  const scale = colorScaleForMode($color, isDark);
  const neutral = colors.neutral;
  const size = sizeConfig[$size];

  // A skeleton has no text, so these fills only need to read as a shape; the wave
  // highlight is a translucent sheen of the surface color.
  const variantStyles = {
    solid: { backgroundColor: isDark ? scale[700] : scale[200], border: 'none' },
    soft: { backgroundColor: isDark ? scale.alpha20 : scale.alpha12, border: 'none' },
    outlined: {
      backgroundColor: scale.alpha8,
      border: `1px solid ${isDark ? scale.alpha30 : scale.alpha20}`,
    },
    ghost: { backgroundColor: isDark ? scale.alpha12 : scale.alpha8, border: 'none' },
    plain: { backgroundColor: isDark ? neutral[700] : neutral[200], border: 'none' },
  };

  const sheen = alpha(neutral[50], isDark ? 0.06 : 0.55);

  return {
    ...variantStyles[$variant],
    '&.MuiSkeleton-text': { fontSize: size.fontSize, borderRadius: radius.sm },
    '&.MuiSkeleton-rounded': { borderRadius: radius.lg },
    '&.MuiSkeleton-wave::after': {
      background: `linear-gradient(90deg, transparent, ${sheen}, transparent)`,
    },
    // No pulsing or sweeping for people who asked for less motion.
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      '&::after': { animation: 'none', display: 'none' },
    },
  };
});

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * A placeholder shape shown while content loads, built on MUI's Skeleton.
 *
 * Skeletons are decorative, so each one is `aria-hidden`. Announce the loading state
 * on the region instead: set `aria-busy="true"` on the container while it loads and
 * give it a text alternative (for example a visually hidden "Loading…"). The pulse
 * and wave animations stop under `prefers-reduced-motion: reduce`.
 */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  ({ variant = 'soft', shape, color = 'neutral', size = 'md', width, height, ...rest }, ref) => {
    const isShape = SHAPES.includes(variant);
    const sorbetVariant = (isShape ? 'soft' : variant) as SkeletonVariant;
    const resolvedShape: SkeletonShape = shape ?? (isShape ? (variant as SkeletonShape) : 'text');
    const config = sizeConfig[size];

    const resolvedWidth = width ?? (resolvedShape === 'circular' ? config.circle : undefined);
    const resolvedHeight =
      height ??
      (resolvedShape === 'circular'
        ? config.circle
        : resolvedShape === 'text'
          ? undefined
          : config.block);

    return (
      <StyledSkeleton
        ref={ref}
        aria-hidden="true"
        variant={resolvedShape}
        width={resolvedWidth}
        height={resolvedHeight}
        $variant={sorbetVariant}
        $color={color}
        $size={size}
        {...rest}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';
