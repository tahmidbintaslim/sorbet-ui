'use client';

import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  Paper,
  styled,
  TextField,
  TextFieldProps,
} from '@mui/material';
import {
  animations,
  colors,
  colorScaleForMode,
  radius,
  shadows,
  sizing,
  solidActiveShade,
  textColorsForMode,
  typography,
} from '@sorbet-ui/tokens';
import * as React from 'react';
import { Chip, ChipProps } from './Chip';

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

export type AutocompleteVariant = 'solid' | 'soft' | 'outlined' | 'ghost' | 'plain';
export type AutocompleteColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';
export type AutocompleteSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface StyledProps {
  $variant: AutocompleteVariant;
  $color: AutocompleteColor;
  $size: AutocompleteSize;
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
    chipSize: 'sm' as const,
  },
  sm: {
    fontSize: '0.813rem',
    padding: '6px 10px',
    height: '32px',
    chipSize: 'sm' as const,
  },
  md: {
    fontSize: '0.875rem',
    padding: '8px 12px',
    height: '40px',
    chipSize: 'sm' as const,
  },
  lg: {
    fontSize: '1rem',
    padding: '10px 14px',
    height: '48px',
    chipSize: 'md' as const,
  },
  xl: {
    fontSize: '1.125rem',
    padding: '12px 16px',
    height: '56px',
    chipSize: 'md' as const,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Variant Styles
// ─────────────────────────────────────────────────────────────────────────────

const getVariantStyles = (
  variant: AutocompleteVariant,
  color: AutocompleteColor,
  size: AutocompleteSize,
  isDark: boolean
) => {
  const config = sizeConfig[size];
  const colorScale = colorScaleForMode(color, isDark);
  const text = textColorsForMode(isDark);
  const neutral = colors.semantic.neutral;

  const baseStyles = {
    fontSize: config.fontSize,
    '& .MuiInputBase-root': {
      minHeight: config.height,
      fontSize: config.fontSize,
    },
    '& .MuiInputBase-input': {
      padding: config.padding,
    },
  };

  switch (variant) {
    case 'solid':
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          backgroundColor: colorScale.main,
          color: colorScale.contrastText,
          '& fieldset': {
            borderColor: colorScale.main,
          },
          '&:hover fieldset': {
            borderColor: solidActiveShade(colorScale),
          },
          '&.Mui-focused fieldset': {
            borderColor: solidActiveShade(colorScale),
          },
          '& .MuiSvgIcon-root': {
            color: colorScale.contrastText,
          },
          '& input::placeholder': {
            color: colorScale.contrastText,
            opacity: 0.85,
          },
          '&.Mui-disabled': {
            backgroundColor: isDark ? neutral[700] : neutral[200],
            color: text.disabled,
            '& fieldset': { borderColor: 'transparent' },
            '& .MuiSvgIcon-root': { color: text.disabled },
          },
        },
        // The label sits on the solid fill, so it takes the fill's text color. Once
        // it shrinks onto the border it gets the fill behind it too, so it stays
        // readable over whatever surface surrounds the field.
        '& .MuiInputLabel-root': {
          color: colorScale.contrastText,
          '&.Mui-focused': {
            color: colorScale.contrastText,
          },
          '&.MuiInputLabel-shrink': {
            backgroundColor: colorScale.main,
            borderRadius: radius.sm,
            padding: '0 6px',
          },
          '&.Mui-disabled': {
            color: text.disabled,
            backgroundColor: 'transparent',
          },
        },
      };

    case 'soft': {
      const softText = isDark ? colorScale.light : colorScale.dark;
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          backgroundColor: isDark ? colorScale.alpha20 : colorScale.alpha12,
          color: softText,
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover': {
            backgroundColor: isDark ? colorScale.alpha30 : colorScale.alpha20,
          },
          '&:hover fieldset': {
            borderColor: colorScale.main,
          },
          '&.Mui-focused': {
            backgroundColor: isDark ? colorScale.alpha20 : colorScale.alpha12,
          },
          '&.Mui-focused fieldset': {
            borderColor: colorScale.main,
          },
          '& .MuiSvgIcon-root': {
            color: softText,
          },
        },
        '& .MuiInputLabel-root': {
          color: softText,
          '&.Mui-focused': {
            color: softText,
          },
        },
      };
    }

    case 'outlined':
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: colorScale.main,
          },
          '&:hover fieldset': {
            borderColor: colorScale.dark,
          },
          '&.Mui-focused fieldset': {
            borderColor: colorScale.main,
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: colorScale.main,
        },
      };

    case 'ghost':
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover': {
            backgroundColor: colorScale.alpha8,
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
          },
          '&.Mui-focused': {
            backgroundColor: colorScale.alpha12,
          },
          '&.Mui-focused fieldset': {
            borderColor: colorScale.main,
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: colorScale.main,
        },
      };

    case 'plain':
      return {
        ...baseStyles,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
            boxShadow: `0 1px 0 0 ${colorScale.main}`,
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: colorScale.main,
        },
      };

    default:
      return baseStyles;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────────────────────────────────────

const StyledAutocomplete = styled(MuiAutocomplete, {
  shouldForwardProp: (prop) =>
    !['$variant', '$color', '$size', '$fullWidth'].includes(prop as string),
})<StyledProps>(({ theme, $variant, $color, $size, $fullWidth }) => {
  const variantStyles = getVariantStyles(
    $variant,
    $color,
    $size,
    theme.palette.mode === 'dark'
  ) as Record<string, unknown>;
  const inputRootStyles = (variantStyles['& .MuiOutlinedInput-root'] ?? {}) as Record<
    string,
    unknown
  >;

  return {
    width: $fullWidth ? '100%' : 'auto',
    fontFamily: typography.fontFamily.sans,
    ...variantStyles,
    '& .MuiOutlinedInput-root': {
      borderRadius: radius.md,
      transition: animations.transitions.input,
      ...inputRootStyles,
    },
    // Disabled fields keep their colors (MUI's disabled palette); fading the whole
    // field with opacity would also fade the label and value below 4.5:1.
    '& .Mui-disabled': {
      cursor: 'not-allowed',
    },
  };
});

const StyledPaper = styled(Paper)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const neutral = colors.semantic.neutral;
  const primary = colorScaleForMode('primary', isDark);
  const text = textColorsForMode(isDark);

  return {
    borderRadius: radius.md,
    boxShadow: shadows.lg,
    marginTop: 4,
    fontFamily: typography.fontFamily.sans,
    '& .MuiAutocomplete-listbox': {
      padding: sizing.spacing[1],
      '& .MuiAutocomplete-option': {
        borderRadius: radius.sm,
        margin: '2px 0',
        '&[aria-selected="true"]': {
          backgroundColor: isDark ? primary.alpha20 : primary.alpha12,
        },
        '&.Mui-focused': {
          backgroundColor: isDark ? neutral[700] : neutral[100],
        },
        '&[aria-selected="true"].Mui-focused': {
          backgroundColor: isDark ? primary.alpha30 : primary.alpha20,
        },
      },
    },
    '& .MuiAutocomplete-noOptions': {
      padding: sizing.spacing[3],
      color: text.secondary,
    },
    '& .MuiAutocomplete-loading': {
      padding: sizing.spacing[3],
      color: text.secondary,
    },
  };
});

const OptionDescription = styled('span')(({ theme }) => ({
  display: 'block',
  fontSize: '0.75rem',
  color: textColorsForMode(theme.palette.mode === 'dark').secondary,
}));

// ─────────────────────────────────────────────────────────────────────────────
// AutocompleteChip Component
// ─────────────────────────────────────────────────────────────────────────────

interface AutocompleteChipProps {
  label: string;
  onDelete?: () => void;
  variant: AutocompleteVariant;
  color: AutocompleteColor;
  size: AutocompleteSize;
  disabled?: boolean;
}

// Tags inside a solid field use the neutral `plain` chip so they stand out from the
// fill; the other field variants use the matching chip variant.
const chipVariantFor: Record<AutocompleteVariant, ChipProps['variant']> = {
  solid: 'plain',
  soft: 'soft',
  outlined: 'outlined',
  ghost: 'outlined',
  plain: 'outlined',
};

const AutocompleteChip = React.forwardRef<HTMLDivElement, AutocompleteChipProps>(
  ({ label, onDelete, variant, color, size, disabled, ...props }, ref) => (
    <Chip
      ref={ref}
      label={label}
      size={sizeConfig[size].chipSize}
      variant={chipVariantFor[variant]}
      color={color}
      onDelete={disabled ? undefined : onDelete}
      disabled={disabled}
      disableAnimation
      {...props}
    />
  )
);

AutocompleteChip.displayName = 'AutocompleteChip';

// ─────────────────────────────────────────────────────────────────────────────
// Autocomplete Props
// ─────────────────────────────────────────────────────────────────────────────

export interface AutocompleteOption {
  label: string;
  value: string | number;
  group?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface SorbetAutocompleteProps<
  T = AutocompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> extends Omit<
  MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'size'
> {
  /** Visual variant of the autocomplete */
  variant?: AutocompleteVariant;
  /** Color theme of the autocomplete */
  color?: AutocompleteColor;
  /** Size of the autocomplete */
  size?: AutocompleteSize;
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
  /** Custom render input function */
  renderInput?: MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>['renderInput'];
}

// ─────────────────────────────────────────────────────────────────────────────
// Autocomplete Component
// ─────────────────────────────────────────────────────────────────────────────

function AutocompleteInner<
  T = AutocompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(
  props: SorbetAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
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
    options,
    multiple,
    freeSolo,
    renderInput: customRenderInput,
    renderValue,
    renderOption,
    getOptionLabel: getOptionLabelProp,
    slots,
    ...restProps
  } = props;
  // MUI v9 removed `PaperComponent`; `slots.paper` exists in v7 and v9. A v7
  // consumer may still pass `PaperComponent`, so it is read untyped and honored.
  const { PaperComponent: legacyPaper, ...rest } = restProps as typeof restProps & {
    PaperComponent?: React.ElementType;
  };

  const getOptionLabel = (option: T): string => {
    if (getOptionLabelProp) {
      return getOptionLabelProp(option);
    }
    if (typeof option === 'string') {
      return option;
    }
    if (typeof option === 'object' && option !== null && 'label' in option) {
      return (option as unknown as AutocompleteOption).label;
    }
    return String(option);
  };

  const defaultRenderInput = (params: any) => (
    <TextField
      {...params}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      required={required}
      variant="outlined"
      {...inputProps}
    />
  );

  // `renderValue` replaces `renderTags` (removed in MUI v9) and exists in v7.3 too.
  // With `multiple`, MUI calls it with the selected values and `getItemProps`.
  const defaultRenderValue = (value: T[], getItemProps: any) =>
    value.map((option: T, index: number) => {
      const { key, ...tagProps } = getItemProps({ index });
      return (
        <AutocompleteChip
          key={key}
          label={getOptionLabel(option)}
          variant={variant}
          color={color}
          size={size}
          disabled={disabled}
          {...tagProps}
        />
      );
    });

  const defaultRenderOption = (
    props: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
    option: T
  ) => {
    const { key, ...otherProps } = props;
    const opt = option as unknown as AutocompleteOption;

    if (typeof option === 'object' && option !== null && 'icon' in option) {
      return (
        <li key={key} {...otherProps}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {opt.icon}
            <span>
              {opt.label}
              {opt.description && (
<OptionDescription>{opt.description}</OptionDescription>
              )}
            </span>
          </span>
        </li>
      );
    }

    return (
      <li key={key} {...otherProps}>
        {getOptionLabel(option)}
      </li>
    );
  };

  return (
    <StyledAutocomplete
      ref={ref}
      options={options}
      multiple={multiple}
      freeSolo={freeSolo}
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      renderInput={customRenderInput || defaultRenderInput}
      renderValue={renderValue || (multiple ? (defaultRenderValue as never) : undefined)}
      renderOption={renderOption || defaultRenderOption}
      slots={{ paper: legacyPaper ?? StyledPaper, ...slots }}
      $variant={variant}
      $color={color}
      $size={size}
      $fullWidth={fullWidth}
      {...(rest as any)}
    />
  );
}

export const Autocomplete = React.forwardRef(AutocompleteInner) as <
  T = AutocompleteOption,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(
  props: SorbetAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  }
) => React.ReactElement;

(Autocomplete as any).displayName = 'Autocomplete';

export default Autocomplete;
