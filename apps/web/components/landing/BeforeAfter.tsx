'use client';
// The "no rewrite" proof: one dashboard written only with stock @mui/material
// components, rendered twice. The left layer uses MUI's default theme, the right
// layer Sorbet's theme. The JSX is identical; only the ThemeProvider changes.
// Drag the handle (a native range input, so it works with keys and screen readers).
import * as React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useTheme,
} from '@mui/material';
import UnfoldMore from '@mui/icons-material/UnfoldMore';
import { darkTheme, lightTheme } from '@sorbet-ui/theme';
import { animate, useInView, useReducedMotion } from 'motion/react';

// Stock MUI theme in the site's current mode.
const muiDefault = { light: createTheme(), dark: createTheme({ palette: { mode: 'dark' } }) };
const sorbet = { light: lightTheme, dark: darkTheme };

const STATS = [
  { label: 'Revenue', value: '$48,210', delta: '+12%', color: 'success' as const, progress: 72 },
  { label: 'Active users', value: '2,431', delta: '+4%', color: 'success' as const, progress: 54 },
  { label: 'Churn', value: '1.8%', delta: '-0.3%', color: 'error' as const, progress: 18 },
];
const ORDERS = [
  { id: '#1042', customer: 'Northwind Ltd', total: '$1,240', status: 'Paid', color: 'success' as const },
  { id: '#1041', customer: 'Globex Inc', total: '$860', status: 'Pending', color: 'warning' as const },
  { id: '#1040', customer: 'Initech', total: '$2,310', status: 'Refunded', color: 'default' as const },
];

const HIDE_XS = { display: { xs: 'none', sm: 'table-cell' } } as const;

/** Plain Material UI. Nothing here imports Sorbet. Memoized: the slider moves every frame,
 * and the two dashboards behind it never need to re-render for that. */
const Dashboard = React.memo(function Dashboard({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100%' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography component="p" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Acme Analytics
          </Typography>
          <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: theme.palette.primary.main }}>SL</Avatar>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Tabs value={0} aria-label={`${label}: sections`} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="Orders" />
          <Tab label="Customers" />
        </Tabs>
        <Grid container spacing={2}>
          {STATS.map((s) => (
            <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {s.label}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', my: 1 }}>
                    <Typography component="p" sx={{ fontSize: 26, fontWeight: 700 }}>
                      {s.value}
                    </Typography>
                    <Chip size="small" color={s.color} label={s.delta} />
                  </Stack>
                  <LinearProgress variant="determinate" value={s.progress} aria-label={`${s.label} target`} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ my: 2 }}>
          <TextField size="small" label="Search orders" defaultValue="Globex" sx={{ flex: 1 }} />
          <Button variant="outlined">Export</Button>
          <Button variant="contained">New order</Button>
        </Stack>
        <Card>
          <Table size="small" aria-label={`${label} recent orders`}>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                {/* Phones drop the Customer column (in both layers, same JSX) so Total and Status fit. */}
                <TableCell sx={HIDE_XS}>Customer</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ORDERS.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell sx={HIDE_XS}>{o.customer}</TableCell>
                  <TableCell align="right">{o.total}</TableCell>
                  <TableCell>
                    <Chip size="small" color={o.color} label={o.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </Box>
  );
});

export const BEFORE_AFTER_CODE = `import { ThemeProvider } from '@mui/material/styles';
- import { createTheme } from '@mui/material/styles';
- const theme = createTheme();
+ import { lightTheme as theme } from '@sorbet-ui/theme';

export default function Root() {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard /> {/* your existing MUI code, unchanged */}
    </ThemeProvider>
  );
}`;

export default function BeforeAfter() {
  const mode = useTheme().palette.mode;
  const [pos, setPos] = React.useState(50);
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const touched = React.useRef(false);

  // One-time sweep when scrolled into view, so it reads as draggable.
  React.useEffect(() => {
    if (!inView || reduce) return;
    const ctl = animate(50, [50, 80, 20, 50], {
      duration: 2.4,
      ease: 'easeInOut',
      onUpdate: (v) => {
        if (!touched.current) setPos(Math.round(v));
      },
    });
    return () => ctl.stop();
  }, [inView, reduce]);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1.5, px: 0.5 }}>
        <Chip label="Default MUI theme" variant="outlined" />
        <Chip label="Sorbet theme" color="primary" />
      </Stack>
      <Box
        ref={ref}
        data-testid="before-after"
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          height: { xs: 760, sm: 600 },
        }}
      >
        {/* Each layer isolates its stacking context: MUI's floating labels use z-index 1,
            which would otherwise paint the back layer's labels over the front one. */}
        {/* Sorbet theme (back layer, visible right of the handle) */}
        <Box data-ba-layer="sorbet" sx={{ position: 'absolute', inset: 0, zIndex: 0, isolation: 'isolate', overflow: 'hidden' }}>
          <ThemeProvider theme={sorbet[mode]}>
            <Dashboard label="Sorbet theme" />
          </ThemeProvider>
        </Box>
        {/* Default MUI theme (front layer, clipped to the handle) */}
        {/* Hidden from assistive tech: it duplicates the Sorbet layer's content, and it shows
            MUI's stock theme on purpose (including pairs below AA, which is the "before"). */}
        <Box
          aria-hidden
          data-ba-layer="default"
          sx={{ position: 'absolute', inset: 0, zIndex: 1, isolation: 'isolate', overflow: 'hidden' }}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <ThemeProvider theme={muiDefault[mode]}>
            <Dashboard label="Default MUI" />
          </ThemeProvider>
        </Box>
        {/* Divider + handle */}
        <Box
          aria-hidden
          sx={{ position: 'absolute', zIndex: 2, top: 0, bottom: 0, width: 2, ml: '-1px', bgcolor: 'primary.main', pointerEvents: 'none' }}
          style={{ left: `${pos}%` }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%) rotate(90deg)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 3,
            }}
          >
            <UnfoldMore />
          </Box>
        </Box>
        <Box
          component="input"
          type="range"
          min={0}
          max={100}
          value={pos}
          aria-label="Compare the default Material UI theme with the Sorbet theme"
          aria-valuetext={`${pos}% default Material UI`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            touched.current = true;
            setPos(Number(e.target.value));
          }}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            width: '100%',
            height: '100%',
            m: 0,
            opacity: 0,
            cursor: 'ew-resize',
            '&:focus-visible + .ba-focus': { opacity: 1 },
          }}
        />
        <Box
          className="ba-focus"
          aria-hidden
          sx={{ position: 'absolute', zIndex: 3, inset: 0, borderRadius: 4, outline: '3px solid', outlineColor: 'primary.main', outlineOffset: -3, opacity: 0, pointerEvents: 'none' }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, textAlign: 'center' }}>
        Identical @mui/material code on both sides. Only the theme changes. Drag the handle or use the arrow keys.
      </Typography>
    </Box>
  );
}
