'use client';
// @example {"title":"Image","description":"Pass src and alt. If the image fails to load, the children show instead."}
import { Stack } from '@mui/material';
import { Avatar } from '@sorbet-ui/react';

// A small inline illustration, so the example has no network request.
const PORTRAIT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23fecdd3'/%3E%3Ccircle cx='40' cy='32' r='14' fill='%23be123c'/%3E%3Cpath d='M12 80a28 28 0 0 1 56 0z' fill='%23be123c'/%3E%3C/svg%3E";

export default function Image() {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Avatar src={PORTRAIT} alt="Ada Lovelace" size="lg" />
      <Avatar src="/missing-photo.png" alt="Grace Hopper" size="lg" color="info">
        GH
      </Avatar>
    </Stack>
  );
}
