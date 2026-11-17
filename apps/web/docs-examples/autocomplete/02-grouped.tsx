'use client';
// @example {"title":"Grouped options","description":"groupBy puts options under headings."}
import { Box } from '@mui/material';
import { Autocomplete } from '@sorbet-ui/react';

const frameworks = [
  { label: 'Next.js', value: 'next', group: 'React' },
  { label: 'Remix', value: 'remix', group: 'React' },
  { label: 'Astro', value: 'astro', group: 'Islands' },
  { label: 'SvelteKit', value: 'svelte', group: 'Other' },
  { label: 'Nuxt', value: 'nuxt', group: 'Other' },
];

export default function Grouped() {
  return (
    <Box sx={{ width: '100%', maxWidth: 320 }}>
      <Autocomplete options={frameworks} groupBy={(option) => option.group} label="Framework" placeholder="Search frameworks" fullWidth />
    </Box>
  );
}
