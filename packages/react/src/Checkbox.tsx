import {
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  animations,
  colors,
  colorScaleForMode,
  sizing,
  textColorsForMode,
  typography,
} from '@sorbet-ui/tokens';
import * as React from 'react';
import { mergeInputSlotProps, pickAriaNameProps } from './internal/inputSlotProps';

// =============================================================================
// TYPES
// =============================================================================

type SorbetVariant = 'solid' | 'soft' | 'outlined' | 'ghost' | 'plain';
type SorbetColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type SorbetSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'size' | 'color'> {
  /** Visual style variant */
  variant?: SorbetVariant;
  /** Color scheme */
  color?: SorbetColor;
  /** Checkbox size */
  size?: SorbetSize;
  /** Label text */
  label?: React.ReactNode;
  /** Show loading state */
  loading?: boolean;
}

// =============================================================================
// STYLE UTILITIES
// =============================================================================

const getColorScale = (color: SorbetColor, isDark: boolean) => colorScaleForMode(color, isDark);

const sizeConfig = {
  xs: { checkbox: 16, icon: 12, label: typography.fontSize.xs },
  sm: { checkbox: 18, icon: 14, label: typography.fontSize.sm },
  md: { checkbox: 22, icon: 16, label: typography.fontSize.base },
  lg: { checkbox: 26, icon: 20, label: typography.fontSize.lg },
  xl: { checkbox: 32, icon: 24, label: typography.fontSize.xl },
};

// =============================================================================
// CUSTOM CHECKBOX ICONS
// =============================================================================

interface IconProps {
  size: number;
  variant: SorbetVariant;
  colorScale: ReturnType<typeof getColorScale>;
  checked?: boolean;
  indeterminate?: boolean;
}

const CheckboxIcon = ({ size, variant, colorScale, checked, indeterminate }: IconProps) => {
  const baseStyles: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: sizing.radius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: animations.transitions.button,
  };

  const getVariantStyles = (): React.CSSProperties => {
    const isActive = checked || indeterminate;

    switch (variant) {
      case 'solid':
        return {
          backgroundColor: isActive ? colorScale.main : colors.semantic.neutral[200],
          border: 'none',
        };
      case 'soft':
        return {
          backgroundColor: isActive ? colorScale.alpha20 : colors.semantic.neutral[100],
          border: `2px solid ${isActive ? colorScale.main : colors.semantic.neutral[300]}`,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          border: `2px solid ${isActive ? colorScale.main : colors.semantic.neutral[400]}`,
        };
      case 'ghost':
        return {
          backgroundColor: isActive ? colorScale.alpha12 : 'transparent',
          border: `2px solid ${isActive ? colorScale.main : 'transparent'}`,
        };
      case 'plain':
      default:
        return {
          backgroundColor: 'transparent',
          border: `2px solid ${isActive ? colorScale.main : colors.semantic.neutral[400]}`,
        };
    }
  };

  const iconColor = variant === 'solid' && (checked || indeterminate) ? '#fff' : colorScale.main;

  return (
    <Box sx={{ ...baseStyles, ...getVariantStyles() }}>
      {(checked || indeterminate) && (
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {indeterminate ? (
            <line x1="5" y1="12" x2="19" y2="12" />
          ) : (
            <polyline points="20 6 9 17 4 12" />
          )}
        </svg>
      )}
    </Box>
  );
};

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

interface StyledProps {
  sorbetSize: SorbetSize;
}

const StyledCheckbox = styled(MuiCheckbox, {
  shouldForwardProp: (prop) => prop !== 'sorbetSize',
})<StyledProps>(({ theme }) => ({
  padding: sizing.spacing[1],
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${colorScaleForMode('primary', theme.palette.mode === 'dark').main}`,
    outlineOffset: '2px',
    borderRadius: sizing.radius.sm,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}));

const StyledLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'sorbetSize',
})<{ sorbetSize: SorbetSize }>(({ theme, sorbetSize }) => ({
  margin: 0,
  gap: sizing.spacing[2],
  '& .MuiFormControlLabel-label': {
    fontSize: sizeConfig[sorbetSize].label,
    fontFamily: typography.fontFamily.sans,
    color: textColorsForMode(theme.palette.mode === 'dark').primary,
    '&.Mui-disabled': {
      color: textColorsForMode(theme.palette.mode === 'dark').disabled,
    },
  },
}));

// =============================================================================
// COMPONENT
// =============================================================================

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      variant = 'outlined',
      color = 'primary',
      size = 'md',
      label,
      loading = false,
      checked,
      disabled,
      indeterminate,
      onChange,
      defaultChecked,
      inputRef,
      inputProps,
      slotProps,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...rest
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? defaultChecked ?? false);
    const theme = useTheme();
    const colorScale = getColorScale(color, theme.palette.mode === 'dark');
    const sizeStyles = sizeConfig[size];

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    // A native checkbox reports "mixed" through its `indeterminate` DOM property;
    // `aria-checked` is not allowed on it (axe: aria-conditional-attr).
    const nativeInputRef = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
      if (nativeInputRef.current) {
        nativeInputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);
    const handleInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        nativeInputRef.current = node;
        if (typeof inputRef === 'function') inputRef(node);
        else if (inputRef)
          (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [inputRef]
    );

    // aria-label/-labelledby/-describedby must reach the <input>, not the wrapper
    // span, so an unlabeled checkbox can still be named. aria-checked is dropped
    // because MUI sets aria-checked="mixed" when indeterminate.
    const inputSlotProps = mergeInputSlotProps(
      pickAriaNameProps({
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
      }),
      inputProps,
      slotProps?.input as Parameters<typeof mergeInputSlotProps>[2],
      { 'aria-checked': undefined }
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(event.target.checked);
      }
      onChange?.(event, event.target.checked);
    };

    const checkboxElement = (
      <StyledCheckbox
        ref={ref}
        sorbetSize={size}
        checked={checked ?? isChecked}
        indeterminate={indeterminate}
        disabled={disabled || loading}
        onChange={handleChange}
        inputRef={handleInputRef}
        slotProps={{ ...slotProps, input: inputSlotProps as never }}
        aria-busy={loading || undefined}
        icon={
          loading ? (
            <CircularProgress size={sizeStyles.icon} color="inherit" aria-label="Loading" />
          ) : (
            <CheckboxIcon size={sizeStyles.checkbox} variant={variant} colorScale={colorScale} />
          )
        }
        checkedIcon={
          <CheckboxIcon
            size={sizeStyles.checkbox}
            variant={variant}
            colorScale={colorScale}
            checked
          />
        }
        indeterminateIcon={
          <CheckboxIcon
            size={sizeStyles.checkbox}
            variant={variant}
            colorScale={colorScale}
            indeterminate
          />
        }
        {...rest}
      />
    );

    if (label) {
      return (
        <StyledLabel
          sorbetSize={size}
          control={checkboxElement}
          label={label}
          disabled={disabled || loading}
        />
      );
    }

    return checkboxElement;
  }
);
Checkbox.displayName = 'Checkbox';
