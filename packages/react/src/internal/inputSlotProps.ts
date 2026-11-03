/**
 * Helpers for components that wrap a native `<input>` inside MUI's SwitchBase
 * (Checkbox, Radio, Switch). MUI puts unknown props such as `aria-label` on the
 * wrapper `<span>`, which leaves the input itself unnamed. These helpers move the
 * naming attributes onto the input slot so a control without a visible label can
 * still be named.
 */

export interface AriaNameProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/** Picks the defined naming attributes out of a props object. */
export function pickAriaNameProps(props: AriaNameProps): AriaNameProps {
  const picked: AriaNameProps = {};
  if (props['aria-label'] !== undefined) picked['aria-label'] = props['aria-label'];
  if (props['aria-labelledby'] !== undefined) picked['aria-labelledby'] = props['aria-labelledby'];
  if (props['aria-describedby'] !== undefined)
    picked['aria-describedby'] = props['aria-describedby'];
  return picked;
}

type SlotProps<O> = Record<string, unknown> | ((ownerState: O) => Record<string, unknown>);

/**
 * Builds `slotProps.input`: the naming attributes first, then the consumer's
 * `inputProps` and `slotProps.input` (which win), then `overrides` (which always win).
 */
export function mergeInputSlotProps<O>(
  aria: AriaNameProps,
  inputProps: object | undefined,
  slotInput: SlotProps<O> | undefined,
  overrides: Record<string, unknown> = {}
): SlotProps<O> {
  if (typeof slotInput === 'function') {
    return (ownerState: O) => ({ ...aria, ...inputProps, ...slotInput(ownerState), ...overrides });
  }
  return { ...aria, ...inputProps, ...slotInput, ...overrides };
}
