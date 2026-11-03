'use client';

import { styled, TextFieldProps } from '@mui/material';
import {
  LocalizationProvider,
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { animations, colors, colorScaleForMode, sizing, solidActiveShade } from '@sorbet-ui/tokens';
import * as React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

export type DatePickerVariant = 'solid' | 'soft' | 'outlined' | 'ghost' | 'plain';
export type DatePickerColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';
export type DatePickerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface StyledProps {
  $variant: DatePickerVariant;
  $color: DatePickerColor;
  $size: DatePickerSize;
  $fullWidth?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Size Configuration
// ─────────────────────────────────────────────────────────────────────────────

const sizeConfig = {
  xs: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    height: '28px',
    iconSize: 16,
  },
  sm: {
    fontSize: '0.813rem',
    padding: '6px 10px',
    height: '32px',
    iconSize: 18,
  },
  md: {
    fontSize: '0.875rem',
    padding: '8px 12px',
    height: '40px',
    iconSize: 20,
  },
  lg: {
    fontSize: '1rem',
    padding: '10px 14px',
    height: '48px',
    iconSize: 22,
  },
  xl: {
    fontSize: '1.125rem',
    padding: '12px 16px',
    height: '56px',
    iconSize: 24,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Variant Styles
// ─────────────────────────────────────────────────────────────────────────────

// Colors come from the Sorbet token scales for the current mode, so the picker
// follows the theme (and dark mode) like every other input.
const getVariantStyles = (
  variant: DatePickerVariant,
  color: DatePickerColor,
  size: DatePickerSize,
  isDark: boolean
) => {
  const config = sizeConfig[size];
  const scale = colorScaleForMode(color, isDark);
  const text = isDark ? colors.semantic.neutral[100] : colors.semantic.neutral[900];
  const muted = isDark ? colors.semantic.neutral[300] : colors.semantic.neutral[600];
  // Soft/ghost text uses the strong end of the scale so it stays AA on the tint.
  const tintText = isDark ? scale.light : scale.dark;

  const baseStyles = {
    fontSize: config.fontSize,
    '& .MuiPickersInputBase-root': {
      minHeight: config.height,
      fontSize: config.fontSize,
      color: text,
    },
    '& .MuiPickersInputBase-sectionsContainer': {
      padding: config.padding,
    },
    '& .MuiSvgIcon-root': {
      fontSize: config.iconSize,
    },
    '& .MuiInputLabel-root': {
      color: muted,
      '&.Mui-focused': { color: tintText },
    },
  };

  switch (variant) {
    case 'solid':
      return {
        ...baseStyles,
        '& .MuiPickersOutlinedInput-root': {
          backgroundColor: scale.main,
          color: scale.contrastText,
          '& .MuiPickersOutlinedInput-notchedOutline': { borderColor: scale.main },
          '&:hover .MuiPickersOutlinedInput-notchedOutline': { borderColor: solidActiveShade(scale) },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { borderColor: solidActiveShade(scale) },
          '& .MuiSvgIcon-root, & .MuiIconButton-root': { color: scale.contrastText },
          '& input::placeholder': { color: scale.contrastText, opacity: 0.85 },
        },
        // The label sits on the solid fill until it shrinks onto the border,
        // where it gets the page background behind it.
        '& .MuiInputLabel-root': {
          color: scale.contrastText,
          '&.MuiInputLabel-shrink': { color: tintText },
          '&.Mui-focused': { color: tintText },
        },
      };

    case 'soft':
      return {
        ...baseStyles,
        '& .MuiPickersOutlinedInput-root': {
          backgroundColor: scale.alpha12,
          color: text,
          '& .MuiPickersOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&:hover': { backgroundColor: scale.alpha20 },
          '&:hover .MuiPickersOutlinedInput-notchedOutline': { borderColor: scale.main },
          '&.Mui-focused': { backgroundColor: scale.alpha12 },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { borderColor: scale.main },
          '& .MuiSvgIcon-root': { color: tintText },
        },
      };

    case 'outlined':
      return {
        ...baseStyles,
        '& .MuiPickersOutlinedInput-root': {
          '& .MuiPickersOutlinedInput-notchedOutline': { borderColor: scale.main },
          '&:hover .MuiPickersOutlinedInput-notchedOutline': { borderColor: tintText },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { borderColor: scale.main },
        },
      };

    case 'ghost':
      return {
        ...baseStyles,
        '& .MuiPickersOutlinedInput-root': {
          '& .MuiPickersOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&:hover': { backgroundColor: scale.alpha8 },
          '&:hover .MuiPickersOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&.Mui-focused': { backgroundColor: scale.alpha12 },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { borderColor: scale.main },
        },
      };

    case 'plain':
      return {
        ...baseStyles,
        '& .MuiPickersOutlinedInput-root': {
          '& .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
          '&:hover .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { border: 'none', boxShadow: `0 1px 0 0 ${scale.main}` },
        },
      };

    default:
      return baseStyles;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Styled DatePicker Wrapper
// ─────────────────────────────────────────────────────────────────────────────

const DatePickerWrapper = styled('div', {
  shouldForwardProp: (prop) =>
    !['$variant', '$color', '$size', '$fullWidth'].includes(prop as string),
})<StyledProps>(({ theme, $variant, $color, $size, $fullWidth }) => {
  const variantStyles = getVariantStyles(
    $variant,
    $color,
    $size,
    theme.palette.mode === 'dark'
  ) as Record<string, unknown>;
  const inputRootStyles = (variantStyles['& .MuiPickersOutlinedInput-root'] ?? {}) as Record<
    string,
    unknown
  >;

  return {
    width: $fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    ...variantStyles,
    '& .MuiPickersOutlinedInput-root': {
      borderRadius: sizing.radius.md,
      transition: animations.transitions.smooth,
      ...inputRootStyles,
    },
    '& .MuiTextField-root': {
      width: $fullWidth ? '100%' : 'auto',
    },
    '&.Mui-disabled': {
      opacity: 0.5,
      pointerEvents: 'none',
    },
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// DatePicker Props
// ─────────────────────────────────────────────────────────────────────────────

export interface SorbetDatePickerProps extends Omit<MuiDatePickerProps, 'renderInput'> {
  /** Visual variant of the date picker */
  variant?: DatePickerVariant;
  /** Color theme of the date picker */
  color?: DatePickerColor;
  /** Size of the date picker */
  size?: DatePickerSize;
  /** Label for the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Whether input takes full width */
  fullWidth?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Custom input props */
  inputProps?: Partial<TextFieldProps>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DatePicker Component
// ─────────────────────────────────────────────────────────────────────────────

export const DatePicker = React.forwardRef<HTMLDivElement, SorbetDatePickerProps>((props, ref) => {
  const {
    variant = 'outlined',
    color = 'primary',
    size = 'md',
    label,
    placeholder,
    helperText,
    error = false,
    fullWidth = false,
    required = false,
    disabled = false,
    inputProps,
    value,
    onChange,
    ...rest
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePickerWrapper
        ref={ref}
        $variant={variant}
        $color={color}
        $size={size}
        $fullWidth={fullWidth}
        className={disabled ? 'Mui-disabled' : undefined}
      >
        <MuiDatePicker
          value={value}
          onChange={onChange}
          disabled={disabled}
          slotProps={{
            textField: {
              label,
              placeholder,
              helperText,
              error,
              required,
              variant: 'outlined',
              fullWidth,
              ...inputProps,
            },
            popper: {
              sx: (theme) => {
                const scale = colorScaleForMode(color, theme.palette.mode === 'dark');
                const selected = {
                  backgroundColor: scale.main,
                  color: scale.contrastText,
                  '&:hover, &:focus': { backgroundColor: solidActiveShade(scale) },
                };
                return {
                  '& .MuiPaper-root': {
                    borderRadius: sizing.radius.lg,
                    boxShadow: sizing.shadows.lg,
                  },
                  '& .MuiPickersDay-root': {
                    borderRadius: sizing.radius.full,
                    '&:hover': { backgroundColor: scale.alpha12 },
                    '&.Mui-selected': selected,
                  },
                  '& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton': {
                    borderRadius: sizing.radius.md,
                    '&.Mui-selected': selected,
                  },
                };
              },
            },
          }}
          {...rest}
        />
      </DatePickerWrapper>
    </LocalizationProvider>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;

// ─────────────────────────────────────────────────────────────────────────────
// Re-export dayjs for convenience
// ─────────────────────────────────────────────────────────────────────────────

export { dayjs };
export type { Dayjs };
