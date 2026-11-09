'use client';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { TOUCH } from '@/lib/touch';
import CodeBlock from './CodeBlock';
import { getDemo } from './demos';
import { getEntry } from '@/lib/catalog';
import { COLORS, SIZES, VARIANTS, type Color, type Size, type Variant } from '@/lib/site';
import { useUrlParam } from '@/lib/use-url-param';

// Live preview with variant/color/size pickers and matching source.
export default function Playground({ slug }: { slug: string }) {
  const demo = getDemo(slug);
  const entry = getEntry(slug);
  // Picks live in the URL (?variant=&color=&size=) so a configured example can be shared.
  const [variant, setVariant] = useUrlParam<Variant>('variant', 'solid', VARIANTS);
  const [color, setColor] = useUrlParam<Color>('color', 'primary', COLORS);
  const [size, setSize] = useUrlParam<Size>('size', 'md', SIZES);
  if (!demo || !entry) return null;

  const pick = <T extends string>(
    label: string,
    value: T,
    options: readonly T[],
    set: (v: T) => void,
  ) => (
    <FormControl size="small" sx={{ minWidth: 130, [TOUCH]: { '& .MuiSelect-select': { py: '10.5px' }, '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': { transform: 'translate(14px, 11px) scale(1)' } } }}>
      <InputLabel id={`pg-${label}`}>{label}</InputLabel>
      <Select
        labelId={`pg-${label}`}
        label={label}
        value={value}
        onChange={(e) => set(e.target.value as T)}
        data-testid={`pg-${label.toLowerCase()}`}
      >
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box>
      <Box
        data-testid="preview"
       
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 2, sm: 4 },
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {demo.render({ variant, color, size })}
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 2 }}>
        {pick('Variant', variant, VARIANTS, setVariant)}
        {pick('Color', color, COLORS, setColor)}
        {pick('Size', size, SIZES, setSize)}
      </Stack>
      <CodeBlock code={demo.code({ variant, color, size })} label={`${entry.name} source`} />
    </Box>
  );
}
