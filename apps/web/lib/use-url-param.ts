'use client';
// State mirrored in the URL query string, so a filtered view can be shared and
// survives a reload. The static HTML always renders the default; the URL value is
// adopted after hydration (no mismatch). Updates use replaceState, so typing or
// picking options doesn't fill the back-button history.
import * as React from 'react';

export function useUrlParam<T extends string>(
  name: string,
  fallback: T,
  allowed?: readonly T[],
): [T, (next: T) => void] {
  const [value, setValue] = React.useState<T>(fallback);

  React.useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get(name);
    if (raw !== null && (!allowed || (allowed as readonly string[]).includes(raw))) setValue(raw as T);
    // Read once on mount (allowed is a module-level constant); later changes come from the setter.
  }, [name]);

  const update = React.useCallback(
    (next: T) => {
      setValue(next);
      const url = new URL(window.location.href);
      if (next === fallback || next === '') url.searchParams.delete(name);
      else url.searchParams.set(name, next);
      window.history.replaceState(window.history.state, '', url);
    },
    [name, fallback],
  );

  return [value, update];
}
