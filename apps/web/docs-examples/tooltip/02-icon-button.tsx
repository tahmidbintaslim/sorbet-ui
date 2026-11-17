'use client';
// @example {"title":"Naming an icon button","description":"Without describeChild, the title becomes the accessible name of an icon-only control."}
import { Stack } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Share from '@mui/icons-material/ShareOutlined';
import Delete from '@mui/icons-material/DeleteOutlined';
import { Button, Tooltip } from '@sorbet-ui/react';

export default function IconButton() {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Copy link">
        <Button shape="square" variant="ghost" color="neutral">
          <ContentCopy fontSize="small" />
        </Button>
      </Tooltip>
      <Tooltip title="Share">
        <Button shape="square" variant="ghost" color="neutral">
          <Share fontSize="small" />
        </Button>
      </Tooltip>
      <Tooltip title="Delete" color="danger">
        <Button shape="square" variant="ghost" color="danger">
          <Delete fontSize="small" />
        </Button>
      </Tooltip>
    </Stack>
  );
}
