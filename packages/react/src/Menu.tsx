import { Menu as MuiMenu, MenuProps as MuiMenuProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SorbetColor, SorbetSize, SorbetVariant } from '@sorbet-ui/core';
import { colors, colorScaleForMode, radius, sizing, textColorsForMode, typography } from '@sorbet-ui/tokens';
import * as React from 'react';

// =============================================================================
// TYPES
// =============================================================================

export type MenuVariant = SorbetVariant;
export type MenuColor = SorbetColor;
export type MenuSize = SorbetSize;

/** MUI's own `variant` values, which choose the item that gets focus on open. */
type MuiMenuFocusVariant = NonNullable<MuiMenuProps['variant']>;

export interface MenuProps extends Omit<MuiMenuProps, 'variant' | 'color'> {
  /**
   * Visual style variant.
   * - `solid`: the menu is filled with the color.
   * - `soft`: a tint of the color; items deepen the tint on hover and when selected.
   * - `outlined`: a colored border; items take a light tint on hover.
   * - `ghost`: no border; items take a neutral fill on hover.
   * - `plain`: the theme's surface, a quiet hover and a bold selected item.
   *
   * MUI's own values (`'menu'`, `'selectedMenu'`) are still accepted here for drop-in
   * compatibility; they set which item is focused on open and keep the default look.
   * Prefer `focusVariant` for that.
   */
  variant?: MenuVariant | MuiMenuFocusVariant;
  /** Which item receives focus on open: the selected one (default) or the first. */
  focusVariant?: MuiMenuFocusVariant;
  /** Color scheme */
  color?: MenuColor;
  /** Size preset (item height, padding and type size) */
  size?: MenuSize;
  /** Accessible name for the menu. Applied to the `role="menu"` list. */
  'aria-label'?: string;
  /** Id of the element (usually the trigger button) that names the menu. */
  'aria-labelledby'?: string;
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeConfig = {
  xs: { minHeight: 28, paddingX: 8, fontSize: 12, iconSize: 14, minWidth: 140, radius: radius.sm },
  sm: { minHeight: 32, paddingX: 10, fontSize: 13, iconSize: 16, minWidth: 160, radius: radius.md },
  md: { minHeight: 36, paddingX: 12, fontSize: 14, iconSize: 18, minWidth: 180, radius: radius.md },
  lg: { minHeight: 44, paddingX: 14, fontSize: 15, iconSize: 20, minWidth: 200, radius: radius.lg },
  xl: { minHeight: 52, paddingX: 16, fontSize: 16, iconSize: 22, minWidth: 220, radius: radius.lg },
};

const SORBET_VARIANTS: readonly string[] = ['solid', 'soft', 'outlined', 'ghost', 'plain'];

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

interface StyledProps {
  $variant: MenuVariant;
  $color: MenuColor;
  $size: MenuSize;
}

const StyledMenu = styled(MuiMenu, {
  shouldForwardProp: (prop) => !['$variant', '$color', '$size'].includes(prop as string),
})<StyledProps>(({ theme, $variant, $color, $size }) => {
  const isDark = theme.palette.mode === 'dark';
  const scale = colorScaleForMode($color, isDark);
  const neutral = colors.neutral;
  const text = textColorsForMode(isDark);
  const size = sizeConfig[$size];
  const surface = theme.palette.background.paper;

  // Colored text on tints: `dark` in light mode, `light` in dark mode. Every pair
  // below has a test in packages/tokens/src/contrast.test.ts.
  const accentText = isDark ? scale.light : scale.dark;
  const softTint = isDark ? scale.alpha20 : scale.alpha12;
  const lightTint = isDark ? scale.alpha12 : scale.alpha8;

  const item = '& .MuiMenuItem-root';
  const active = '&:hover, &.Mui-focusVisible, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible';
  const hover = '&:hover, &.Mui-focusVisible';
  const selected = '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible';

  const variantStyles = {
    solid: {
      paper: { backgroundColor: scale.main, color: scale.contrastText, border: 'none' },
      item: {
        [active]: { backgroundColor: scale.dark },
        [selected]: { fontWeight: typography.fontWeight.semibold },
      },
      divider: `${scale.contrastText}40`,
    },
    soft: {
      paper: {
        backgroundColor: surface,
        backgroundImage: `linear-gradient(${softTint}, ${softTint})`,
        color: text.primary,
        border: 'none',
      },
      item: {
        [active]: { backgroundColor: softTint },
        [selected]: { color: accentText, fontWeight: typography.fontWeight.semibold },
      },
      divider: scale.alpha30,
    },
    outlined: {
      paper: { backgroundColor: surface, color: text.primary, border: `1px solid ${scale.main}` },
      item: {
        [active]: { backgroundColor: lightTint },
        [hover]: { color: accentText },
        [selected]: { color: accentText, fontWeight: typography.fontWeight.semibold },
      },
      divider: isDark ? neutral[700] : neutral[200],
    },
    ghost: {
      paper: { backgroundColor: surface, color: text.primary, border: 'none' },
      item: {
        [hover]: { backgroundColor: isDark ? neutral[700] : neutral[100] },
        [selected]: {
          backgroundColor: isDark ? neutral[700] : neutral[100],
          color: accentText,
          fontWeight: typography.fontWeight.semibold,
        },
      },
      divider: isDark ? neutral[700] : neutral[200],
    },
    plain: {
      paper: {
        backgroundColor: surface,
        color: text.primary,
        border: `1px solid ${isDark ? neutral[700] : neutral[200]}`,
      },
      item: {
        [hover]: { backgroundColor: isDark ? neutral[900] : neutral[50] },
        [selected]: {
          backgroundColor: 'transparent',
          color: accentText,
          fontWeight: typography.fontWeight.semibold,
        },
        '&.Mui-selected:hover, &.Mui-selected.Mui-focusVisible': {
          backgroundColor: isDark ? neutral[900] : neutral[50],
        },
      },
      divider: isDark ? neutral[700] : neutral[200],
    },
  }[$variant];

  return {
    '& .MuiMenu-paper': {
      minWidth: size.minWidth,
      borderRadius: size.radius,
      boxShadow: $variant === 'ghost' ? sizing.shadows.lg : sizing.shadows.md,
      fontFamily: typography.fontFamily.sans,
      ...variantStyles.paper,
    },
    '& .MuiMenu-list': {
      padding: 4,
    },
    [item]: {
      minHeight: size.minHeight,
      padding: `0 ${size.paddingX}px`,
      fontSize: size.fontSize,
      fontFamily: typography.fontFamily.sans,
      borderRadius: `calc(${size.radius} - 2px)`,
      color: 'inherit',
      gap: Math.round(size.paddingX * 0.75),
      '& .MuiListItemIcon-root': { minWidth: 0, fontSize: size.iconSize, color: 'inherit' },
      '& .MuiListItemIcon-root svg': { fontSize: size.iconSize },
      '& .MuiListItemText-primary': { fontSize: 'inherit', fontWeight: 'inherit' },
      '&.Mui-focusVisible': {
        outline: `2px solid ${$variant === 'solid' ? scale.contrastText : scale.main}`,
        outlineOffset: -2,
      },
      ...variantStyles.item,
    },
    '& .MuiDivider-root': {
      margin: '4px 0',
      borderColor: variantStyles.divider,
    },
  };
});

// =============================================================================
// COMPONENT
// =============================================================================

type SlotProps = Record<string, unknown> | ((ownerState: never) => Record<string, unknown>);

/** Puts the naming attributes on the list slot, keeping any list slot props the caller set. */
function withListName(list: SlotProps | undefined, name: Record<string, string>): SlotProps {
  if (Object.keys(name).length === 0) return list ?? {};
  if (typeof list === 'function') {
    return (ownerState: never) => ({ ...name, ...list(ownerState) });
  }
  return { ...name, ...list };
}

/**
 * A menu of actions anchored to a trigger, built on MUI's Menu. Use `MenuItem`
 * children. The list has `role="menu"` and each item `role="menuitem"`; arrow keys,
 * Home/End and type-ahead move between items, and Escape closes the menu.
 *
 * Give the menu a name with `aria-labelledby` (the trigger's id) or `aria-label`;
 * both are applied to the list. The trigger should set `aria-haspopup="true"`,
 * `aria-controls` and `aria-expanded`.
 */
export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      variant = 'plain',
      focusVariant,
      color = 'primary',
      size = 'md',
      slotProps,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...rest
    },
    ref
  ) => {
    const isMuiVariant = !SORBET_VARIANTS.includes(variant);
    const sorbetVariant = (isMuiVariant ? 'plain' : variant) as MenuVariant;
    const muiVariant = focusVariant ?? (isMuiVariant ? (variant as MuiMenuFocusVariant) : undefined);

    const name: Record<string, string> = {};
    if (ariaLabel !== undefined) name['aria-label'] = ariaLabel;
    if (ariaLabelledby !== undefined) name['aria-labelledby'] = ariaLabelledby;

    const mergedSlotProps = {
      ...slotProps,
      list: withListName(slotProps?.list as SlotProps | undefined, name),
    } as MuiMenuProps['slotProps'];

    return (
      <StyledMenu
        ref={ref}
        $variant={sorbetVariant}
        $color={color}
        $size={size}
        variant={muiVariant}
        slotProps={mergedSlotProps}
        {...rest}
      />
    );
  }
);
Menu.displayName = 'Menu';
