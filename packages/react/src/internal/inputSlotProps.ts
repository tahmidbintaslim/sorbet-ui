import type * as React from 'react';

/**
 * Helpers for components that wrap a native `<input>` inside MUI's SwitchBase
 * (Checkbox, Radio, Switch). MUI puts unknown props such as `aria-label` on the
 * wrapper `<span>`, which leaves the input itself unnamed. These helpers move the
 * naming attributes onto the input slot so a control without a visible label can
 * still be named.
 *
 * Only `slotProps.input` is used, which exists in both MUI v7 and v9. MUI v9
 * removed `inputProps` / `inputRef`; a v7 consumer may still pass `inputProps`,
 * so it is read untyped (see `takeLegacyInputProps`) and merged in.
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

/**
 * Splits MUI v7's deprecated `inputProps` off the rest props. It is not part of
 * the v9 types, so it is read without typing it; under v9 it is always undefined.
 */
export function takeLegacyInputProps<T extends object>(
  rest: T
): [legacyInputProps: Record<string, unknown> | undefined, rest: T] {
  const { inputProps, ...others } = rest as T & { inputProps?: Record<string, unknown> };
  return [inputProps, others as T];
}

type SlotProps<O> = Record<string, unknown> | ((ownerState: O) => Record<string, unknown>);

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
}

/** Combines refs; returns undefined when none is set. */
function forkRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> | undefined {
  const defined = refs.filter(Boolean);
  if (defined.length === 0) return undefined;
  return (node: T | null) => {
    defined.forEach((ref) => assignRef(ref, node));
  };
}

/**
 * Builds `slotProps.input`: the naming attributes first, then the consumer's
 * legacy `inputProps` and `slotProps.input` (which win), then `overrides` (which
 * always win). `inputRef` is forked with any `ref` the consumer put on
 * `slotProps.input`, so both receive the native `<input>`.
 */
export function mergeInputSlotProps<O>(
  aria: AriaNameProps,
  legacyInputProps: object | undefined,
  slotInput: SlotProps<O> | undefined,
  overrides: Record<string, unknown> = {},
  inputRef?: React.Ref<HTMLInputElement>
): SlotProps<O> {
  const build = (resolved: Record<string, unknown> | undefined) => {
    const merged: Record<string, unknown> = {
      ...aria,
      ...legacyInputProps,
      ...resolved,
      ...overrides,
    };
    const ref = forkRefs<HTMLInputElement>(
      (legacyInputProps as { ref?: React.Ref<HTMLInputElement> } | undefined)?.ref,
      resolved?.ref as React.Ref<HTMLInputElement> | undefined,
      inputRef
    );
    if (ref) merged.ref = ref;
    return merged;
  };
  if (typeof slotInput === 'function') {
    return (ownerState: O) => build(slotInput(ownerState));
  }
  return build(slotInput);
}
