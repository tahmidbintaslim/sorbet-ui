import {
  AccordionDetails as MuiAccordionDetails,
  AccordionDetailsProps as MuiAccordionDetailsProps,
  Accordion as MuiAccordion,
  AccordionProps as MuiAccordionProps,
  AccordionSummary as MuiAccordionSummary,
  AccordionSummaryProps as MuiAccordionSummaryProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SorbetColor, SorbetSize, SorbetVariant } from '@sorbet-ui/core';
import {
  borderColors,
  colors,
  colorScaleForMode,
  radius,
  textColorsForMode,
  transitions,
  typography,
} from '@sorbet-ui/tokens';
import * as React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type AccordionVariant = SorbetVariant;
export type AccordionColor = SorbetColor;
export type AccordionSize = SorbetSize;

export interface AccordionProps extends Omit<MuiAccordionProps, 'variant' | 'color'> {
  /**
   * Visual style variant.
   * - `solid`: the summary is filled with the color; the panel stays on the surface.
   * - `soft`: the whole item sits on a tint of the color.
   * - `outlined`: a hairline border that takes the color while expanded.
   * - `ghost`: no border; the summary picks up a tint on hover and while expanded.
   * - `plain`: no surface, items separated by a divider line.
   */
  variant?: AccordionVariant;
  /** Color scheme */
  color?: AccordionColor;
  /** Size preset (summary height, padding and type size) */
  size?: AccordionSize;
}

export type AccordionSummaryProps = MuiAccordionSummaryProps;
export type AccordionDetailsProps = MuiAccordionDetailsProps;

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeConfig = {
  xs: { minHeight: 32, paddingX: 10, fontSize: 12, detailsFontSize: 12, iconSize: 14, gap: 4 },
  sm: { minHeight: 40, paddingX: 12, fontSize: 13, detailsFontSize: 13, iconSize: 16, gap: 6 },
  md: { minHeight: 48, paddingX: 16, fontSize: 14, detailsFontSize: 14, iconSize: 18, gap: 8 },
  lg: { minHeight: 56, paddingX: 20, fontSize: 16, detailsFontSize: 15, iconSize: 20, gap: 10 },
  xl: { minHeight: 64, paddingX: 24, fontSize: 18, detailsFontSize: 16, iconSize: 22, gap: 12 },
};

// =============================================================================
// ICON
// =============================================================================

/** Chevron used as the default expand icon. Decorative: the summary carries aria-expanded. */
const ChevronIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

interface StyledProps {
  $variant: AccordionVariant;
  $color: AccordionColor;
  $size: AccordionSize;
}

const StyledAccordion = styled(MuiAccordion, {
  shouldForwardProp: (prop) => !['$variant', '$color', '$size'].includes(prop as string),
})<StyledProps>(({ theme, $variant, $color, $size }) => {
  const isDark = theme.palette.mode === 'dark';
  const scale = colorScaleForMode($color, isDark);
  const neutral = colors.neutral;
  const text = textColorsForMode(isDark);
  const border = isDark ? borderColors.dark : borderColors.light;
  const size = sizeConfig[$size];
  const surface = theme.palette.background.paper;

  // Colored text on tints: `dark` in light mode and `light` in dark mode stay above
  // 4.5:1 on the alpha8/alpha12 tints and the surface (packages/tokens contrast tests).
  const accentText = isDark ? scale.light : scale.dark;
  const hoverTint = isDark ? scale.alpha12 : scale.alpha8;
  const softTint = isDark ? scale.alpha20 : scale.alpha12;
  const cornerRadius = $variant === 'plain' ? 0 : radius.lg;

  const summary = '& > .MuiAccordion-heading > .MuiAccordionSummary-root';

  // Each variant styles the item (root), its summary, and the item while expanded.
  // They are merged into the base rules below, not spread over them.
  type VariantStyle = {
    root: Record<string, unknown>;
    expanded?: Record<string, unknown>;
    summary: Record<string, unknown>;
    icon: string;
  };
  const variantStyles: Record<AccordionVariant, VariantStyle> = {
    solid: {
      root: { backgroundColor: surface, border: `1px solid ${border.default}` },
      summary: {
        backgroundColor: scale.main,
        color: scale.contrastText,
        '&:hover': { backgroundColor: scale.dark },
      },
      icon: scale.contrastText,
    },
    soft: {
      root: {
        backgroundColor: surface,
        backgroundImage: `linear-gradient(${softTint}, ${softTint})`,
        border: 'none',
      },
      summary: { color: accentText },
      icon: accentText,
    },
    outlined: {
      root: { backgroundColor: surface, border: `1px solid ${border.default}` },
      expanded: { borderColor: scale.main },
      summary: {
        color: text.primary,
        '&:hover': { backgroundColor: hoverTint, color: accentText },
        '&.Mui-expanded, &.Mui-expanded:hover': { color: accentText },
      },
      icon: 'inherit',
    },
    ghost: {
      root: { backgroundColor: 'transparent', border: 'none' },
      summary: {
        color: text.primary,
        '&:hover, &.Mui-expanded, &.Mui-expanded:hover': {
          backgroundColor: hoverTint,
          color: accentText,
        },
      },
      icon: 'inherit',
    },
    plain: {
      root: {
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${border.default}`,
      },
      summary: {
        color: text.primary,
        '&:hover, &.Mui-expanded, &.Mui-expanded:hover': { color: accentText },
      },
      icon: 'inherit',
    },
  };
  const v = variantStyles[$variant];
  const gap = $variant === 'plain' ? 0 : size.gap;

  return {
    // MUI draws elevation and a divider line between items; Sorbet variants draw their own.
    boxShadow: 'none',
    color: text.primary,
    fontFamily: typography.fontFamily.sans,
    overflow: 'hidden',
    margin: 0,
    borderRadius: cornerRadius,
    ...v.root,
    '&::before': { display: 'none' },
    '&:first-of-type, &:last-of-type': { borderRadius: cornerRadius },
    '&.Mui-expanded': { margin: 0, ...v.expanded },
    '& + &, &.Mui-expanded + &, & + &.Mui-expanded': { marginTop: gap },
    // MUI greys out a disabled item by opacity, which drops text below 4.5:1. Use a
    // neutral fill that still reads as unavailable.
    '&.Mui-disabled': {
      backgroundColor: isDark ? neutral[800] : neutral[50],
      backgroundImage: 'none',
    },
    [summary]: {
      minHeight: size.minHeight,
      padding: `0 ${size.paddingX}px`,
      fontSize: size.fontSize,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: 1.4,
      transition: transitions.smooth,
      ...v.summary,
      '&.Mui-expanded': { minHeight: size.minHeight },
      '& .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded': {
        margin: `${Math.round(size.minHeight / 4)}px 0`,
      },
      '& .MuiAccordionSummary-expandIconWrapper': {
        color: v.icon,
        fontSize: size.iconSize,
        transition: transitions.smooth,
      },
      '&.Mui-focusVisible': {
        outline: `2px solid ${scale.main}`,
        outlineOffset: -2,
        borderRadius: cornerRadius,
      },
      '&.Mui-disabled': {
        opacity: 1,
        backgroundColor: isDark ? neutral[700] : neutral[100],
        color: isDark ? neutral[200] : neutral[600],
        '& .MuiAccordionSummary-expandIconWrapper': { color: 'inherit' },
      },
    },
    '& .MuiAccordionDetails-root': {
      padding: `${Math.round(size.paddingX / 2)}px ${size.paddingX}px ${size.paddingX}px`,
      fontSize: size.detailsFontSize,
      lineHeight: 1.6,
    },
    // Expanding is a height animation; skip it (and the icon turn) for reduced motion.
    '@media (prefers-reduced-motion: reduce)': {
      '& .MuiCollapse-root': { transitionDuration: '0s !important' },
      [summary]: {
        transition: 'none',
        '& .MuiAccordionSummary-expandIconWrapper': { transition: 'none' },
      },
    },
  };
});

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * A disclosure panel built on MUI's Accordion. The first child is the summary (use
 * `AccordionSummary`), the rest is the panel (use `AccordionDetails`).
 *
 * The summary renders a native `<button>` inside a heading with `aria-expanded`.
 * When the summary has no `id` / `aria-controls`, Accordion generates them, so the
 * button always points at the panel and the panel (`role="region"`) is labelled by
 * the button.
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ variant = 'outlined', color = 'primary', size = 'md', children, ...rest }, ref) => {
    const baseId = React.useId();
    const [summary, ...panel] = React.Children.toArray(children);

    const wiredSummary = React.isValidElement<{ id?: string; 'aria-controls'?: string }>(summary)
      ? React.cloneElement(summary, {
          id: summary.props.id ?? `${baseId}-summary`,
          'aria-controls': summary.props['aria-controls'] ?? `${baseId}-panel`,
        })
      : summary;

    return (
      <StyledAccordion ref={ref} $variant={variant} $color={color} $size={size} {...rest}>
        {wiredSummary}
        {panel}
      </StyledAccordion>
    );
  }
);
Accordion.displayName = 'Accordion';

/**
 * The clickable header of an Accordion. Same props as MUI's AccordionSummary; it adds
 * a chevron as the default `expandIcon` (pass `expandIcon={null}` to hide it).
 */
export const AccordionSummary = React.forwardRef<HTMLDivElement, AccordionSummaryProps>(
  ({ expandIcon = <ChevronIcon />, ...rest }, ref) => (
    <MuiAccordionSummary ref={ref} expandIcon={expandIcon} {...rest} />
  )
);
AccordionSummary.displayName = 'AccordionSummary';

/** The collapsible panel of an Accordion (MUI's AccordionDetails). */
export const AccordionDetails = MuiAccordionDetails;
