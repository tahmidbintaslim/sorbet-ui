import {
  Box,
  CircularProgress,
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { animations, colors, colorScaleForMode, sizing, typography } from '@sorbet-ui/tokens';
import * as React from 'react';

// =============================================================================
// TYPES
// =============================================================================

type SorbetVariant = 'solid' | 'soft' | 'outlined' | 'ghost' | 'plain';
type SorbetColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type SorbetSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DrawerProps extends Omit<MuiDrawerProps, 'variant'> {
  /** Visual style variant */
  variant?: SorbetVariant;
  /** Color scheme (affects header accent) */
  color?: SorbetColor;
  /** Drawer size (width for left/right, height for top/bottom) */
  size?: SorbetSize;
  /** Show loading overlay */
  loading?: boolean;
  /** Disable animations */
  disableAnimation?: boolean;
}

// =============================================================================
// STYLE UTILITIES
// =============================================================================

const sizeConfig = {
  xs: { width: 240, height: 200 },
  sm: { width: 320, height: 280 },
  md: { width: 400, height: 360 },
  lg: { width: 520, height: 480 },
  xl: { width: 680, height: 600 },
};

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

interface StyledProps {
  sorbetVariant: SorbetVariant;
  sorbetColor: SorbetColor;
  sorbetSize: SorbetSize;
  $loading?: boolean;
  $disableAnimation?: boolean;
}

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) =>
    !['sorbetVariant', 'sorbetColor', 'sorbetSize', '$loading', '$disableAnimation'].includes(
      prop as string
    ),
})<StyledProps>(({
  theme,
  sorbetVariant,
  sorbetColor,
  sorbetSize,
  $loading,
  $disableAnimation,
  anchor,
}) => {
  const sizeStyles = sizeConfig[sorbetSize];
  const isDark = theme.palette.mode === 'dark';
  // The color shows as an accent (edge, tint or border); text stays text.primary,
  // so contrast never depends on the chosen color.
  const scale = colorScaleForMode(sorbetColor, isDark);
  const isHorizontal = anchor === 'left' || anchor === 'right';

  const baseStyles = {
    '& .MuiDrawer-paper': {
      width: isHorizontal ? sizeStyles.width : '100%',
      height: isHorizontal ? '100%' : sizeStyles.height,
      transition: $disableAnimation ? 'none' : animations.transitions.slide,
      fontFamily: typography.fontFamily.sans,
      position: 'relative' as const,
      ...($loading && {
        pointerEvents: 'none' as const,
        '& > *:not(.drawer-loading-overlay)': {
          opacity: 0.5,
        },
      }),
    },
  };

  // The inner edge is the one facing the page content.
  const edge =
    anchor === 'right'
      ? 'Left'
      : anchor === 'top'
        ? 'Bottom'
        : anchor === 'bottom'
          ? 'Top'
          : 'Right';
  const edgeStyle = (width: number, color: string) => ({
    [`border${edge}`]: `${width}px solid ${color}`,
  });
  // Neutral (the default) keeps the plain surface; any other color adds its accent.
  const accented = sorbetColor !== 'neutral';
  const accent = (width: number, color: string) => (accented ? edgeStyle(width, color) : {});

  const variantStyles = {
    solid: {
      '& .MuiDrawer-paper': {
        backgroundColor: isDark ? colors.semantic.neutral[900] : theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: sizing.shadows['2xl'],
        ...accent(4, scale.main),
      },
    },
    soft: {
      '& .MuiDrawer-paper': {
        backgroundColor: isDark ? colors.semantic.neutral[800] : colors.semantic.neutral[50],
        ...(accented && { backgroundImage: `linear-gradient(${scale.alpha12}, ${scale.alpha12})` }),
        color: theme.palette.text.primary,
        boxShadow: sizing.shadows.xl,
      },
    },
    outlined: {
      '& .MuiDrawer-paper': {
        backgroundColor: isDark ? colors.semantic.neutral[900] : theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        ...(accented
          ? edgeStyle(2, scale.main)
          : edgeStyle(1, isDark ? colors.semantic.neutral[700] : colors.semantic.neutral[300])),
      },
    },
    ghost: {
      '& .MuiDrawer-paper': {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        color: theme.palette.text.primary,
        backdropFilter: 'blur(8px)',
        boxShadow: sizing.shadows.lg,
        ...accent(2, scale.alpha40),
      },
    },
    plain: {
      '& .MuiDrawer-paper': {
        backgroundColor: isDark ? colors.semantic.neutral[900] : theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        ...accent(1, scale.alpha40),
      },
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[sorbetVariant],
  };
});

const LoadingOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 10,
});

// =============================================================================
// COMPONENT
// =============================================================================

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      variant = 'solid',
      color = 'neutral',
      size = 'md',
      loading = false,
      disableAnimation = false,
      children,
      anchor = 'left',
      slotProps,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...rest
    },
    ref
  ) => {
    // The drawer is always MUI's temporary (modal) drawer. MUI v9 gives its paper
    // role="dialog" and aria-modal; v7 does not. Sorbet sets them in both and puts
    // the drawer's name on that dialog, where assistive tech looks for it.
    const dialogProps = {
      role: 'dialog',
      'aria-modal': true,
      ...(ariaLabel !== undefined && { 'aria-label': ariaLabel }),
      ...(ariaLabelledby !== undefined && { 'aria-labelledby': ariaLabelledby }),
    };
    const externalPaper = slotProps?.paper;
    const paperSlotProps =
      typeof externalPaper === 'function'
        ? (ownerState: Parameters<typeof externalPaper>[0]) => ({
            ...dialogProps,
            ...externalPaper(ownerState),
          })
        : { ...dialogProps, ...externalPaper };

    return (
      <StyledDrawer
        ref={ref}
        sorbetVariant={variant}
        sorbetColor={color}
        sorbetSize={size}
        $loading={loading}
        $disableAnimation={disableAnimation}
        anchor={anchor}
        {...rest}
        slotProps={{ ...slotProps, paper: paperSlotProps as never }}
      >
        {loading && (
          <LoadingOverlay className="drawer-loading-overlay">
            <CircularProgress size={32} />
          </LoadingOverlay>
        )}
        {children}
      </StyledDrawer>
    );
  }
);
Drawer.displayName = 'Drawer';
