'use client';
// @example {"title":"Deletable","description":"onDelete adds a remove button. Backspace or Delete on a focused chip also removes it."}
import * as React from 'react';
import { Stack } from '@mui/material';
import { Button, Chip } from '@sorbet-ui/react';

const ALL = ['design', 'frontend', 'accessibility', 'performance'];

export default function Deletable() {
  const [tags, setTags] = React.useState(ALL);
  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', minHeight: 32 }}>
        {tags.map((tag) => (
          <Chip key={tag} variant="soft" label={tag} onDelete={() => setTags((list) => list.filter((t) => t !== tag))} />
        ))}
      </Stack>
      <Button size="sm" variant="plain" onClick={() => setTags(ALL)} disabled={tags.length === ALL.length}>
        Reset tags
      </Button>
    </Stack>
  );
}
