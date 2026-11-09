// Touch-target helpers. Below md (900px) or on any coarse pointer, interactive
// controls get at least a 44px hit area (WCAG 2.5.5 / Apple HIG). Desktop with a
// mouse keeps the denser sizes.
export const TOUCH = '@media (max-width: 899.95px), (pointer: coarse)';

/** min 44x44 on touch layouts. */
export const touchTarget = { [TOUCH]: { minHeight: 44, minWidth: 44 } } as const;

/** min 44px tall on touch layouts, laid out so the label stays centered. */
export const touchRow = {
  [TOUCH]: { minHeight: 44, display: 'flex', alignItems: 'center' },
} as const;
