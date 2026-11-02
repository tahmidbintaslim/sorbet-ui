import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    alpha12?: string;
    alpha20?: string;
    alpha30?: string;
    alpha40?: string;
  }

  interface TypeBackground {
    alpha: string;
  }
}

// Button's variant overrides must be augmented in the module that owns the
// interface; declaring them in '@mui/material/styles' makes
// '@mui/material' re-export the name twice (TS2308 with skipLibCheck: false).
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    solid: true;
    soft: true;
    outlined: true;
    ghost: true;
    plain: true;
  }
}

declare module '@mui/material/styles' {
  interface TextFieldPropsVariantOverrides {
    solid: true;
    soft: true;
    outlined: true;
    ghost: true;
    plain: true;
  }

  interface CheckboxPropsVariantOverrides {
    solid: true;
    soft: true;
    outlined: true;
    ghost: true;
    plain: true;
  }

  interface RadioPropsVariantOverrides {
    solid: true;
    soft: true;
    outlined: true;
    ghost: true;
    plain: true;
  }

  interface SwitchPropsVariantOverrides {
    solid: true;
    soft: true;
    outlined: true;
    ghost: true;
    plain: true;
  }

  interface SelectPropsVariantOverrides {
    solid: true;
    soft: true;
    outlined: true;
    ghost: true;
    plain: true;
  }
}
