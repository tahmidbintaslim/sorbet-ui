'use client';
// @example {"title":"Icon only","description":"Square and circle shapes hold a single icon. Give each one an aria-label."}
import { Stack } from '@mui/material';
import Edit from '@mui/icons-material/EditOutlined';
import Favorite from '@mui/icons-material/FavoriteBorder';
import Delete from '@mui/icons-material/DeleteOutlined';
import { Button } from '@sorbet-ui/react';

export default function IconOnly() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Button shape="square" variant="soft" aria-label="Edit">
        <Edit fontSize="small" />
      </Button>
      <Button shape="circle" variant="outlined" color="secondary" aria-label="Add to favorites">
        <Favorite fontSize="small" />
      </Button>
      <Button shape="circle" color="danger" aria-label="Delete">
        <Delete fontSize="small" />
      </Button>
    </Stack>
  );
}
