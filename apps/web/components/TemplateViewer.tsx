'use client';
// Preview / Code for one template. The server page passes the rendered template as
// children and its real source files as a prop (from scripts/gen-templates.mjs), so
// the page ships only its own template. The preview runs in a device frame whose
// width springs between desktop, tablet and phone; the template re-flows by itself
// because it responds to its container, not the viewport.
import * as React from 'react';
import NextLink from 'next/link';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import DesktopWindowsOutlined from '@mui/icons-material/DesktopWindowsOutlined';
import TabletMacOutlined from '@mui/icons-material/TabletMacOutlined';
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { motion } from 'motion/react';
import CodeBlock from './CodeBlock';
import TemplateStage, { type StageMode } from './TemplateStage';
import { useColorMode } from './ColorMode';
import { touchTarget } from '@/lib/touch';
import type { TemplateFile } from '@/lib/templates-source';

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: 1280, icon: <DesktopWindowsOutlined fontSize="small" /> },
  { id: 'tablet', label: 'Tablet', width: 768, icon: <TabletMacOutlined fontSize="small" /> },
  { id: 'phone', label: 'Phone', width: 390, icon: <PhoneIphoneOutlined fontSize="small" /> },
] as const;
type Device = (typeof DEVICES)[number]['id'];

const groupSx = { bgcolor: 'background.paper', '& .MuiToggleButton-root': { ...touchTarget, px: 1.5, gap: 0.75, fontWeight: 600 } } as const;

export default function TemplateViewer({
  slug,
  name,
  files,
  layout,
  children,
}: {
  slug: string;
  name: string;
  files: TemplateFile[];
  layout: 'app' | 'page';
  children: React.ReactNode;
}) {
  const site = useColorMode();
  const [view, setView] = React.useState<'preview' | 'code'>('preview');
  const [device, setDevice] = React.useState<Device>('desktop');
  // The preview follows the site theme until the visitor picks one for it.
  const [picked, setPicked] = React.useState<StageMode | null>(null);
  const mode = picked ?? site.mode;
  const [file, setFile] = React.useState(files[0].file);
  const current = files.find((f) => f.file === file) ?? files[0];

  // Room available for the frame: the frame is never wider than this.
  const track = React.useRef<HTMLDivElement>(null);
  const [room, setRoom] = React.useState<number | null>(null);
  React.useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setRoom(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const want = DEVICES.find((d) => d.id === device)!.width;
  const width = room === null ? null : Math.min(room, want);

  return (
    <Box data-testid="template-viewer">
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
        <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, v) => v && setView(v)} aria-label={`${name} view`} sx={groupSx}>
          <ToggleButton value="preview">Preview</ToggleButton>
          <ToggleButton value="code">Code</ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          {view === 'preview' && (
            <>
              {/* The width switch needs room to show a difference: hidden on phones. */}
              <ToggleButtonGroup size="small" exclusive value={device} onChange={(_, v) => v && setDevice(v)} aria-label="Preview width" sx={{ ...groupSx, display: { xs: 'none', md: 'inline-flex' } }}>
                {DEVICES.map((d) => (
                  <ToggleButton key={d.id} value={d.id} aria-label={`${d.label}, ${d.width} pixels wide`}>
                    {d.icon}
                    {d.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <ToggleButtonGroup size="small" exclusive value={mode} onChange={(_, v) => v && setPicked(v)} aria-label="Preview theme" sx={groupSx}>
                <ToggleButton value="light" aria-label="Light preview">
                  <Tooltip title="Light preview">
                    <LightModeOutlined fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="dark" aria-label="Dark preview">
                  <Tooltip title="Dark preview">
                    <DarkModeOutlined fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </>
          )}
          <Box
            component={NextLink}
            href={`/templates/${slug}/preview`}
            sx={{ ...touchTarget, display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.75, minHeight: 38, borderRadius: 999, border: 1, borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary', fontSize: 14, fontWeight: 600, textDecoration: 'none', '&:hover': { borderColor: 'text.primary' } }}
          >
            Open full screen
            <OpenInNew sx={{ fontSize: 16 }} />
          </Box>
        </Stack>
      </Stack>

      {/* Both views stay mounted, so the preview keeps its state while you read the code. */}
      <Box ref={track} hidden={view !== 'preview'} sx={{ display: view === 'preview' ? 'flex' : 'none', justifyContent: 'center' }}>
        <motion.div
          data-testid="template-frame"
          data-device={device}
          initial={false}
          animate={width === null ? undefined : { width }}
          transition={{ type: 'spring', stiffness: 210, damping: 26 }}
          style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
        >
          <Box sx={{ borderRadius: device === 'phone' ? '28px' : '14px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden', boxShadow: '0 24px 60px -32px rgba(15,23,42,.45)', transition: 'border-radius .3s' }}>
            {/* Browser bar */}
            <Stack direction="row" spacing={1.5} aria-hidden sx={{ alignItems: 'center', px: 2, height: 40, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={0.75}>
                {['#f87171', '#fbbf24', '#34d399'].map((c) => (
                  <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
                ))}
              </Stack>
              <Typography noWrap sx={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 12, color: 'text.secondary', bgcolor: 'action.hover', borderRadius: 999, px: 2, py: 0.25, maxWidth: 360, mx: 'auto !important' }}>
                {slug}.example.com
              </Typography>
              <Box sx={{ width: 42 }} />
            </Stack>
            <TemplateStage
              mode={mode}
              scroll={layout === 'page'}
              role="region"
              aria-label={`${name} live preview`}
              data-testid="template-preview"
              sx={{ height: { xs: 640, md: device === 'phone' ? 760 : 780 } }}
            >
              {children}
            </TemplateStage>
          </Box>
        </motion.div>
      </Box>

      {view === 'code' && (
        <Box>
          <Stack direction="row" role="group" aria-label="Template files" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
            {files.map((f) => {
              const on = f.file === current.file;
              return (
                <Box
                  key={f.file}
                  component="button"
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFile(f.file)}
                  sx={{
                    ...touchTarget,
                    font: 'inherit',
                    fontFamily: 'var(--font-mono), ui-monospace, monospace',
                    fontSize: 13,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    border: 1,
                    cursor: 'pointer',
                    borderColor: on ? 'text.primary' : 'divider',
                    bgcolor: on ? 'text.primary' : 'background.paper',
                    color: on ? 'background.paper' : 'text.primary',
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2 },
                  }}
                >
                  {f.file}
                </Box>
              );
            })}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {files.length} {files.length === 1 ? 'file' : 'files'} in <code>templates/{slug}/</code>. Copy them into one folder of your app and render the default export of <code>index.tsx</code>.
          </Typography>
          <Box sx={{ '& pre': { maxHeight: 640, overflowY: 'auto' } }}>
            <CodeBlock key={current.file} code={current.source} title={`templates/${slug}/${current.file}`} label={`${name} source: ${current.file}`} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
