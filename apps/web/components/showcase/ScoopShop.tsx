'use client';
// Scoop Shop: the small order app shown inside both device frames. One `useShop`
// state feeds both copies, so a click in the browser frame shows up on the phone.
// Stock MUI parts (Button, TextField, surfaces) follow the stage theme; Sorbet
// components get the accent as their `color` prop. All content is fictional.
import * as React from 'react';
import { Box, Button, ButtonBase, InputAdornment, TextField, Typography } from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import Add from '@mui/icons-material/Add';
import CheckCircle from '@mui/icons-material/CheckCircle';
import IcecreamOutlined from '@mui/icons-material/IcecreamOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import Search from '@mui/icons-material/Search';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Avatar, Chip, Progress, Tabs } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import type { Color } from '@/lib/site';
import { touchTarget } from '@/lib/touch';
import { CountUp } from '../motion';
import Burst from '../fun/Burst';
import type { Density } from './stage-theme';

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

type Status = 'new' | 'making' | 'ready' | 'done';
type Item = { flavor: string; c: Color; kind: 'Cone' | 'Cup' | 'Pint'; qty: number; price: number };
export type Order = { id: number; name: string; time: string; pickup: string; status: Status; items: Item[]; note?: string; c: Color };

const item = (flavor: string, c: Color, kind: Item['kind'], qty: number, price: number): Item => ({ flavor, c, kind, qty, price });
const RASP = (k: Item['kind'], q: number, p: number) => item('Raspberry Ripple', 'danger', k, q, p);
const MANGO = (k: Item['kind'], q: number, p: number) => item('Mango Tango', 'warning', k, q, p);
const MINT = (k: Item['kind'], q: number, p: number) => item('Garden Mint', 'success', k, q, p);
const BLUE = (k: Item['kind'], q: number, p: number) => item('Blueberry Sky', 'primary', k, q, p);
const UBE = (k: Item['kind'], q: number, p: number) => item('Ube Swirl', 'secondary', k, q, p);
const SALT = (k: Item['kind'], q: number, p: number) => item('Sea Salt Caramel', 'info', k, q, p);

const ORDERS: Order[] = [
  { id: 1048, name: 'Noor Haddad', time: '2:41 PM', pickup: 'Counter', status: 'new', c: 'secondary', items: [UBE('Cone', 2, 4.5), SALT('Cup', 1, 4)] },
  { id: 1047, name: 'Theo Lindqvist', time: '2:38 PM', pickup: 'Counter', status: 'ready', c: 'danger', items: [RASP('Cone', 2, 4.5), MANGO('Cup', 1, 4), MINT('Pint', 1, 9)], note: 'Extra sprinkles on the cones.' },
  { id: 1046, name: 'Priya Raman', time: '2:35 PM', pickup: 'Delivery', status: 'making', c: 'warning', items: [MANGO('Pint', 2, 9)] },
  { id: 1045, name: 'Jonah Weiss', time: '2:29 PM', pickup: 'Counter', status: 'making', c: 'success', items: [MINT('Cone', 1, 4.5), BLUE('Cone', 1, 4.5)], note: 'One cone in a cup, please.' },
  { id: 1044, name: 'Ines Carvalho', time: '2:22 PM', pickup: 'Delivery', status: 'ready', c: 'primary', items: [BLUE('Pint', 1, 9), RASP('Pint', 1, 9), SALT('Pint', 1, 9)] },
  { id: 1043, name: 'Sam Okoye', time: '2:14 PM', pickup: 'Counter', status: 'new', c: 'info', items: [SALT('Cup', 3, 4)] },
  { id: 1042, name: 'Lena Fischer', time: '2:05 PM', pickup: 'Counter', status: 'done', c: 'danger', items: [RASP('Cup', 2, 4)] },
  { id: 1041, name: 'Kai Tanaka', time: '1:58 PM', pickup: 'Delivery', status: 'done', c: 'secondary', items: [UBE('Pint', 1, 9), MINT('Cup', 2, 4)] },
];

// Walk-ins for the "New order" button.
const WALK_INS: Omit<Order, 'id' | 'time' | 'status'>[] = [
  { name: 'Mila Novak', pickup: 'Counter', c: 'success', items: [MINT('Cone', 2, 4.5)] },
  { name: 'Omar Farouk', pickup: 'Counter', c: 'warning', items: [MANGO('Cup', 1, 4), RASP('Cup', 1, 4)] },
  { name: 'Hana Sato', pickup: 'Delivery', c: 'primary', items: [BLUE('Pint', 2, 9)] },
];

const STOCK: { flavor: string; c: Color; left: number }[] = [
  { flavor: 'Raspberry Ripple', c: 'danger', left: 72 },
  { flavor: 'Mango Tango', c: 'warning', left: 18 },
  { flavor: 'Garden Mint', c: 'success', left: 54 },
  { flavor: 'Blueberry Sky', c: 'primary', left: 86 },
  { flavor: 'Ube Swirl', c: 'secondary', left: 12 },
  { flavor: 'Sea Salt Caramel', c: 'info', left: 63 },
];

// Sales per hour, 10 AM to 3 PM (the shop is mid-afternoon).
const HOURS = ['10', '11', '12', '1', '2', '3'];
const SALES = [96, 148, 262, 318, 224, 132];
const BASE_REVENUE = SALES.reduce((a, b) => a + b, 0) - 31;

const STATUS: Record<Status, { label: string; color: Color; next: string; step: number }> = {
  new: { label: 'New', color: 'info', next: 'Start making', step: 1 },
  making: { label: 'Making', color: 'warning', next: 'Mark ready', step: 2 },
  ready: { label: 'Ready', color: 'success', next: 'Mark done', step: 3 },
  done: { label: 'Done', color: 'neutral', next: 'Reopen', step: 4 },
};
const NEXT: Record<Status, Status> = { new: 'making', making: 'ready', ready: 'done', done: 'ready' };

const total = (o: Order) => o.items.reduce((s, i) => s + i.qty * i.price, 0);
const money = (n: number) => `$${n.toFixed(2)}`;
const summary = (o: Order) => o.items.map((i) => `${i.qty}× ${i.flavor}`).join(', ');
const initials = (name: string) => name.split(' ').map((p) => p[0]).join('');
const firstName = (name: string) => name.split(' ')[0];

// ---------------------------------------------------------------------------
// Shared state
// ---------------------------------------------------------------------------

type View = 'orders' | 'flavors';
type TabId = 'open' | 'done' | 'all';
type Toast = { id: number; text: string; party: boolean };

export function useShop() {
  const [orders, setOrders] = React.useState(ORDERS);
  const [selectedId, setSelectedId] = React.useState(1047);
  const [tab, setTab] = React.useState<TabId>('open');
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState<View>('orders');
  const [stock, setStock] = React.useState(STOCK);
  const [toast, setToast] = React.useState<Toast | null>(null);
  const walkIn = React.useRef(0);

  React.useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const say = (text: string, party = false) => setToast({ id: Date.now(), text, party });

  const advance = (id: number) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    const next = NEXT[o.status];
    setOrders((list) => list.map((x) => (x.id === id ? { ...x, status: next } : x)));
    if (next === 'done') say(`Order #${id} handed to ${firstName(o.name)}. Enjoy!`, true);
    else if (o.status === 'done') say(`Order #${id} reopened`);
    else say(next === 'making' ? `Scooping order #${id}` : `Order #${id} is ready for ${firstName(o.name)}`);
  };

  const addOrder = () => {
    const n = walkIn.current++;
    const base = WALK_INS[n % WALK_INS.length];
    const id = Math.max(...orders.map((o) => o.id)) + 1;
    setOrders((list) => [{ ...base, id, time: 'Just now', status: 'new' }, ...list]);
    setSelectedId(id);
    setTab('open');
    setQuery('');
    setView('orders');
    say(`New order #${id} from ${firstName(base.name)}`);
  };

  const restock = (flavor: string) => {
    setStock((list) => list.map((s) => (s.flavor === flavor ? { ...s, left: 100 } : s)));
    say(`${flavor} restocked`);
  };

  const q = query.trim().toLowerCase();
  const visible = orders.filter(
    (o) =>
      (tab === 'all' || (tab === 'done') === (o.status === 'done')) &&
      (!q || o.name.toLowerCase().includes(q) || String(o.id).includes(q) || o.items.some((i) => i.flavor.toLowerCase().includes(q))),
  );
  const open = orders.filter((o) => o.status !== 'done').length;
  const revenue = Math.round(BASE_REVENUE + orders.filter((o) => o.status === 'done').reduce((s, o) => s + total(o), 0));

  return {
    orders,
    visible,
    selected: orders.find((o) => o.id === selectedId) ?? orders[0],
    select: setSelectedId,
    tab,
    setTab,
    query,
    setQuery,
    view,
    setView,
    stock,
    restock,
    toast,
    advance,
    addOrder,
    counts: { open, done: orders.length - open, all: orders.length },
    revenue,
  };
}
export type Shop = ReturnType<typeof useShop>;

type AppProps = { shop: Shop; flavor: Color; density: Density; compact?: boolean };

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------

const subtle = (t: Theme) => (t.palette.mode === 'dark' ? alpha('#fff', 0.03) : colorPalette.neutral[50]);
const hairline = (t: Theme) => (t.palette.mode === 'dark' ? alpha('#fff', 0.09) : colorPalette.neutral[200]);
const tint = (t: Theme, a = 0.1) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? a + 0.08 : a);
const focusRing = { '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } } as const;
const label = { fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary' } as const;
const truncate = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;
const thinScroll = { overflowY: 'auto', scrollbarWidth: 'thin', overscrollBehavior: 'contain' } as const;

/** A flavor dot: a tiny scoop in the flavor's own color (decorative). */
function Dot({ c, size = 10 }: { c: Color; size?: number }) {
  return <Box aria-hidden component="span" sx={{ flexShrink: 0, width: size, height: size, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', bgcolor: colorPalette[c][400] }} />;
}

function StatusChip({ status, size = 'xs' }: { status: Status; size?: 'xs' | 'sm' }) {
  return <Chip label={STATUS[status].label} color={STATUS[status].color} variant="soft" size={size} disableAnimation />;
}

/** Area chart of today's sales by hour. The numbers are in the caption next to it. */
function SalesChart({ height = 96, axis = true }: { height?: number; axis?: boolean }) {
  const id = React.useId();
  const max = Math.max(...SALES) * 1.1;
  const pts = SALES.map((v, i) => [(i / (SALES.length - 1)) * 100, 100 - (v / max) * 100] as const);
  // Smooth line through the points (horizontal control points).
  const line = pts.reduce((d, [x, y], i) => {
    if (!i) return `M${x} ${y}`;
    const [px, py] = pts[i - 1];
    const mx = (px + x) / 2;
    return `${d} C${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }, '');
  return (
    <Box>
      <Box component="svg" role="img" aria-label="Sales by hour, peaking at 1 PM" viewBox="0 0 100 100" preserveAspectRatio="none" sx={{ display: 'block', width: '100%', height, color: 'primary.main', overflow: 'visible' }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".28" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L100 100 L0 100Z`} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </Box>
      {axis && (
        <Box aria-hidden sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75, fontSize: 11, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
          {HOURS.map((h, i) => (
            <span key={h}>
              {h}
              {i < 2 ? 'a' : 'p'}
            </span>
          ))}
        </Box>
      )}
    </Box>
  );
}

function Revenue({ value, size = 22 }: { value: number; size?: number }) {
  return (
    <Typography component="span" sx={{ fontWeight: 800, fontSize: size, letterSpacing: '-0.03em', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
      <CountUp value={value} format={(n) => `$${n.toLocaleString('en-US')}`} />
    </Typography>
  );
}

function OrderRow({ o, selected, onSelect, dense }: { o: Order; selected: boolean; onSelect: () => void; dense: boolean }) {
  return (
    <Box component="li" sx={{ listStyle: 'none' }}>
      <ButtonBase
        onClick={onSelect}
        aria-current={selected ? 'true' : undefined}
        sx={(t) => ({
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr) auto',
          columnGap: 1.25,
          rowGap: 0.25,
          alignItems: 'center',
          textAlign: 'left',
          px: 1.25,
          py: dense ? 0.75 : 1.25,
          borderRadius: `${t.shape.borderRadius}px`,
          transition: 'background-color .15s',
          bgcolor: selected ? tint(t) : 'transparent',
          boxShadow: selected ? `inset 0 0 0 1px ${alpha(t.palette.primary.main, 0.35)}` : 'none',
          '&:hover': { bgcolor: selected ? tint(t) : subtle(t) },
          ...focusRing,
        })}
      >
        <Box aria-hidden sx={{ gridRow: 'span 2', display: 'flex' }}>
          <Avatar color={o.c} variant="soft" size={dense ? 'sm' : 'md'} disableAnimation>
            {initials(o.name)}
          </Avatar>
        </Box>
        <Typography component="span" sx={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3, ...truncate }}>
          {o.name}
        </Typography>
        <Typography component="span" sx={{ fontSize: 12, color: 'text.secondary', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {o.time}
        </Typography>
        <Typography component="span" sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.3, ...truncate }}>
          {summary(o)}
        </Typography>
        <Box component="span" sx={{ justifySelf: 'end', display: 'flex' }}>
          <StatusChip status={o.status} />
        </Box>
      </ButtonBase>
    </Box>
  );
}

function OrderList({ shop, dense }: { shop: Shop; dense: boolean }) {
  if (!shop.visible.length)
    return (
      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>No orders here</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>Try another tab or a different search.</Typography>
        </Box>
      </Box>
    );
  return (
    <Box component="ul" aria-label="Orders" sx={{ flex: 1, minHeight: 0, m: 0, p: 1, display: 'flex', flexDirection: 'column', gap: 0.25, ...thinScroll }}>
      {shop.visible.map((o) => (
        <OrderRow key={o.id} o={o} dense={dense} selected={o.id === shop.selected.id} onSelect={() => shop.select(o.id)} />
      ))}
    </Box>
  );
}

function OrderTabs({ shop, flavor, fullWidth }: { shop: Shop; flavor: Color; fullWidth?: boolean }) {
  return (
    <Tabs
      aria-label="Order status"
      size="sm"
      variant="outlined"
      color={flavor}
      fullWidth={fullWidth}
      renderPanels={false}
      value={shop.tab}
      onChange={(id) => shop.setTab(id as TabId)}
      tabs={[
        { id: 'open', label: `Open · ${shop.counts.open}` },
        { id: 'done', label: `Done · ${shop.counts.done}` },
        { id: 'all', label: `All · ${shop.counts.all}` },
      ]}
      sx={{ '& .MuiTab-root': touchTarget }}
    />
  );
}

function SearchField({ shop, dense }: { shop: Shop; dense?: boolean }) {
  return (
    <TextField
      size="small"
      fullWidth
      placeholder="Search orders"
      value={shop.query}
      onChange={(e) => shop.setQuery(e.target.value)}
      slotProps={{
        htmlInput: { 'aria-label': 'Search orders', type: 'search' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{ '& .MuiInputBase-root': { fontSize: 14, height: dense ? 34 : 38, bgcolor: 'background.paper', ...touchTarget } }}
    />
  );
}

function ActionButton({ shop, dense, fullWidth = true }: { shop: Shop; dense: boolean; fullWidth?: boolean }) {
  const o = shop.selected;
  return (
    <Button
      fullWidth={fullWidth}
      disableElevation
      size={dense ? 'small' : 'medium'}
      variant={o.status === 'done' ? 'outlined' : 'contained'}
      startIcon={o.status === 'ready' ? <CheckCircle /> : undefined}
      onClick={() => shop.advance(o.id)}
      sx={{ fontWeight: 700, whiteSpace: 'nowrap', ...touchTarget }}
    >
      {STATUS[o.status].next}
    </Button>
  );
}

/** Toast and sprinkles, anchored to the bottom of the app. */
function Toaster({ toast, bottom }: { toast: Toast | null; bottom: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      {toast?.party && !reduce && <Burst key={toast.id} count={22} reach={[50, 130]} sx={{ zIndex: 3 }} />}
      <Box role="status" aria-live="polite" sx={{ position: 'absolute', left: 12, right: 12, bottom, zIndex: 4, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            >
              <Box
                sx={(t) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.75,
                  py: 1,
                  borderRadius: `${Math.min(Number(t.shape.borderRadius) + 4, 22)}px`,
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  bgcolor: t.palette.mode === 'dark' ? colorPalette.neutral[50] : colorPalette.neutral[900],
                  color: t.palette.mode === 'dark' ? colorPalette.neutral[900] : colorPalette.neutral[50],
                  boxShadow: '0 8px 24px -6px rgb(15 23 42 / 0.45)',
                })}
              >
                <CheckCircle sx={(t) => ({ fontSize: 18, color: t.palette.mode === 'dark' ? colorPalette.success[700] : colorPalette.success[400] })} />
                {toast.text}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
}

function StockList({ shop, flavor, dense }: { shop: Shop; flavor: Color; dense: boolean }) {
  return (
    <Box component="ul" sx={{ m: 0, p: 0, display: 'grid', gap: dense ? 1.25 : 1.75 }}>
      {shop.stock.map((s) => {
        const low = s.left < 25;
        return (
          <Box component="li" key={s.flavor} sx={{ listStyle: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, minHeight: 24 }}>
              <Dot c={s.c} />
              <Typography component="span" sx={{ fontSize: 13.5, fontWeight: 600, ...truncate }}>
                {s.flavor}
              </Typography>
              {low && <Chip label="Low" color="danger" variant="soft" size="xs" disableAnimation />}
              <Box sx={{ flex: 1 }} />
              {low ? (
                <Button size="small" onClick={() => shop.restock(s.flavor)} aria-label={`Restock ${s.flavor}`} sx={{ minWidth: 0, py: 0, px: 1, fontSize: 12.5, fontWeight: 700, ...touchTarget }}>
                  Restock
                </Button>
              ) : (
                <Typography component="span" sx={{ fontSize: 12.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {s.left}%
                </Typography>
              )}
            </Box>
            <Progress value={s.left} color={low ? 'danger' : flavor} size="md" variant="soft" aria-label={`${s.flavor} stock`} />
          </Box>
        );
      })}
    </Box>
  );
}

function Panel({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return <Box sx={[(t: Theme) => ({ p: 2, bgcolor: 'background.paper', border: `1px solid ${hairline(t)}`, borderRadius: `${Math.min(Number(t.shape.borderRadius) * 1.25, 24)}px` }), sx ?? {}]}>{children}</Box>;
}

function RevenuePanel({ shop, chart = 110 }: { shop: Shop; chart?: number }) {
  return (
    <Panel>
      <Typography sx={label}>Revenue today</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75, mb: 1.5 }}>
        <Revenue value={shop.revenue} size={28} />
        <Chip label="+12% vs last week" color="success" variant="soft" size="xs" disableAnimation />
      </Box>
      <SalesChart height={chart} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Desktop layout (inside the browser frame). Container queries, not viewport
// queries: the frame is narrower than the window.
// ---------------------------------------------------------------------------

const NARROW = '@container shop (max-width: 719.95px)';
// Visible label that collapses to icon-only in a narrow frame (stays in the a11y tree).
const collapses = { [NARROW]: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' } } as const;

const NAV: { id: View; label: string; Icon: typeof Add }[] = [
  { id: 'orders', label: 'Orders', Icon: ReceiptLongOutlined },
  { id: 'flavors', label: 'Flavors', Icon: IcecreamOutlined },
];

function Brand({ size = 28 }: { size?: number }) {
  return (
    <Box aria-hidden sx={{ flexShrink: 0, width: size, height: size, borderRadius: '32%', display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <IcecreamOutlined sx={{ fontSize: size * 0.64 }} />
    </Box>
  );
}

function Sidebar({ shop, flavor }: { shop: Shop; flavor: Color }) {
  return (
    <Box
      component="nav"
      aria-label="Scoop Shop"
      sx={(t) => ({
        flexShrink: 0,
        width: 184,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        p: 1.5,
        bgcolor: subtle(t),
        borderRight: `1px solid ${hairline(t)}`,
        [NARROW]: { width: 60, px: 1, alignItems: 'center' },
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 0.75, pt: 0.5, pb: 1.75, [NARROW]: { px: 0 } }}>
        <Brand />
        <Typography component="span" sx={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', ...collapses }}>
          Scoop Shop
        </Typography>
      </Box>
      {NAV.map(({ id, label: text, Icon }) => {
        const on = shop.view === id;
        return (
          <ButtonBase
            key={id}
            onClick={() => shop.setView(id)}
            aria-current={on ? 'page' : undefined}
            sx={(t) => ({
              justifyContent: 'flex-start',
              gap: 1.25,
              px: 1.25,
              height: 38,
              width: '100%',
              borderRadius: `${t.shape.borderRadius}px`,
              fontSize: 14,
              fontWeight: on ? 700 : 500,
              color: on ? 'text.primary' : 'text.secondary',
              bgcolor: on ? tint(t, 0.12) : 'transparent',
              '&:hover': { bgcolor: on ? tint(t, 0.12) : alpha(t.palette.text.primary, 0.05) },
              ...focusRing,
              [NARROW]: { width: 40, px: 0, justifyContent: 'center' },
            })}
          >
            <Icon sx={{ fontSize: 20, color: on ? 'primary.main' : 'inherit' }} />
            <Box component="span" sx={collapses}>
              {text}
            </Box>
            {id === 'orders' && (
              <Box sx={{ ml: 'auto', display: 'flex', [NARROW]: { display: 'none' } }}>
                <Chip label={shop.counts.open} color={flavor} variant={on ? 'solid' : 'soft'} size="xs" disableAnimation />
              </Box>
            )}
          </ButtonBase>
        );
      })}
      <Box sx={{ flex: 1 }} />
      <Box sx={(t) => ({ p: 1.5, mb: 1, bgcolor: 'background.paper', border: `1px solid ${hairline(t)}`, borderRadius: `${t.shape.borderRadius}px`, [NARROW]: { display: 'none' } })}>
        <Typography sx={label}>Today</Typography>
        <Box sx={{ mt: 0.5, mb: 1 }}>
          <Revenue value={shop.revenue} size={20} />
        </Box>
        <SalesChart height={34} axis={false} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 0.5, [NARROW]: { px: 0 } }}>
        <Box aria-hidden sx={{ display: 'flex' }}>
          <Avatar color="neutral" variant="soft" size="sm" status="online" disableAnimation>
            RB
          </Avatar>
        </Box>
        <Box sx={{ minWidth: 0, ...collapses }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25, ...truncate }}>Rosa Bianchi</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.25 }}>Shift lead</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function Detail({ shop, flavor, dense }: { shop: Shop; flavor: Color; dense: boolean }) {
  const o = shop.selected;
  const st = STATUS[o.status];
  return (
    <Box
      component="section"
      aria-label="Order details"
      data-testid="order-detail"
      sx={(t) => ({
        flexShrink: 0,
        width: 272,
        display: 'flex',
        flexDirection: 'column',
        gap: dense ? 1.5 : 2,
        p: 2,
        borderLeft: `1px solid ${hairline(t)}`,
        bgcolor: subtle(t),
        ...thinScroll,
        [NARROW]: { width: 236, p: 1.5 },
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={label}>Order #{o.id}</Typography>
        <StatusChip status={o.status} size="sm" />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box aria-hidden sx={{ display: 'flex' }}>
          <Avatar color={o.c} variant="soft" size={dense ? 'md' : 'lg'} disableAnimation>
            {initials(o.name)}
          </Avatar>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em', lineHeight: 1.25, ...truncate }}>{o.name}</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {o.pickup} · {o.time}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Progress value={st.step * 25} color={flavor} size="md" aria-label="Order progress" />
        <Typography sx={{ mt: 0.75, fontSize: 12, color: 'text.secondary' }}>
          Step {st.step} of 4 · {st.label}
        </Typography>
      </Box>
      <Panel sx={{ p: 0 }}>
        <Box component="ul" sx={{ m: 0, px: 1.5, py: dense ? 0.5 : 0.75 }}>
          {o.items.map((i) => (
            <Box component="li" key={i.flavor + i.kind} sx={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 1, py: dense ? 0.5 : 0.75, fontSize: 13.5 }}>
              <Dot c={i.c} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography component="span" sx={{ display: 'block', fontSize: 'inherit', fontWeight: 600, lineHeight: 1.3, ...truncate }}>
                  {i.flavor}
                </Typography>
                <Typography component="span" sx={{ display: 'block', fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>
                  {i.qty} × {i.kind}
                </Typography>
              </Box>
              <Typography component="span" sx={{ fontSize: 'inherit', fontVariantNumeric: 'tabular-nums' }}>
                {money(i.qty * i.price)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={(t) => ({ display: 'flex', justifyContent: 'space-between', px: 1.5, py: 1.25, borderTop: `1px solid ${hairline(t)}`, fontWeight: 700, fontSize: 14 })}>
          <span>Total</span>
          <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {money(total(o))}
          </Box>
        </Box>
      </Panel>
      {o.note && (
        <Typography sx={(t) => ({ px: 1.5, py: 1, fontSize: 13, lineHeight: 1.4, borderRadius: `${t.shape.borderRadius}px`, bgcolor: tint(t, 0.08), borderLeft: `3px solid ${t.palette.primary.main}` })}>{o.note}</Typography>
      )}
      <Box sx={{ mt: 'auto' }}>
        <ActionButton shop={shop} dense={dense} />
      </Box>
    </Box>
  );
}

function DesktopApp({ shop, flavor, density }: AppProps) {
  const dense = density === 'compact';
  return (
    <Box data-testid="scoop-shop" sx={{ containerType: 'inline-size', containerName: 'shop', position: 'relative', height: '100%', display: 'flex', bgcolor: 'background.default', color: 'text.primary', overflow: 'hidden' }}>
      <Sidebar shop={shop} flavor={flavor} />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={(t) => ({ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: dense ? 1.25 : 1.75, borderBottom: `1px solid ${hairline(t)}` })}>
          <Box sx={{ minWidth: 0, mr: 'auto' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{shop.view === 'orders' ? 'Orders' : 'Flavors'}</Typography>
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', ...truncate }}>{shop.view === 'orders' ? `Today · ${shop.counts.open} open` : 'Stock and sales, today'}</Typography>
          </Box>
          {shop.view === 'orders' && (
            <Box sx={{ width: 200, flexShrink: 1, minWidth: 120, [NARROW]: { display: 'none' } }}>
              <SearchField shop={shop} dense={dense} />
            </Box>
          )}
          <Button variant="contained" disableElevation size={dense ? 'small' : 'medium'} startIcon={<Add />} onClick={shop.addOrder} sx={{ flexShrink: 0, fontWeight: 700, whiteSpace: 'nowrap' }}>
            New order
          </Button>
        </Box>
        {shop.view === 'orders' ? (
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ px: 1, pt: 0.5 }}>
                <OrderTabs shop={shop} flavor={flavor} />
              </Box>
              <Box sx={{ display: 'none', px: 1.5, pt: 1.5, [NARROW]: { display: 'block' } }}>
                <SearchField shop={shop} dense />
              </Box>
              <OrderList shop={shop} dense={dense} />
            </Box>
            <Detail shop={shop} flavor={flavor} dense={dense} />
          </Box>
        ) : (
          <Box sx={(t) => ({ flex: 1, minHeight: 0, p: 2, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 2, alignItems: 'start', bgcolor: subtle(t), ...thinScroll })} tabIndex={0} role="group" aria-label="Flavors">
            <RevenuePanel shop={shop} chart={150} />
            <Panel>
              <Typography sx={{ ...label, mb: 1.5 }}>Flavor stock</Typography>
              <StockList shop={shop} flavor={flavor} dense={dense} />
            </Panel>
          </Box>
        )}
      </Box>
      <Toaster toast={shop.toast} bottom={16} />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Phone layout
// ---------------------------------------------------------------------------

function PhoneApp({ shop, flavor, density }: AppProps) {
  const dense = density === 'compact';
  const o = shop.selected;
  return (
    <Box data-testid="scoop-shop" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, pt: 0.5, pb: 1.25 }}>
        <Brand size={32} />
        <Box sx={{ minWidth: 0, mr: 'auto' }}>
          <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{shop.view === 'orders' ? 'Orders' : 'Flavors'}</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{shop.view === 'orders' ? `Today · ${shop.counts.open} open` : 'Stock and sales, today'}</Typography>
        </Box>
        <Button variant="contained" disableElevation size="small" startIcon={<Add />} onClick={shop.addOrder} sx={{ fontWeight: 700, whiteSpace: 'nowrap', ...touchTarget }}>
          New
          <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
            {' '}
            order
          </Box>
        </Button>
      </Box>
      {shop.view === 'orders' ? (
        <>
          <Box sx={{ px: 2 }}>
            <SearchField shop={shop} dense={dense} />
          </Box>
          <Box sx={{ px: 1, pt: 0.5 }}>
            <OrderTabs shop={shop} flavor={flavor} fullWidth />
          </Box>
          <OrderList shop={shop} dense={dense} />
          <Box
            component="section"
            aria-label="Order details"
            data-testid="order-detail"
            sx={(t) => ({ mx: 1, mb: 1, p: 1.5, bgcolor: 'background.paper', border: `1px solid ${hairline(t)}`, borderRadius: `${Math.min(Number(t.shape.borderRadius) * 1.25, 22)}px`, boxShadow: '0 -6px 20px -8px rgb(15 23 42 / 0.18)' })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, ...truncate }}>{o.name}</Typography>
                <Typography sx={{ fontSize: 12.5, color: 'text.secondary', ...truncate }}>
                  #{o.id} · {summary(o)}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>{money(total(o))}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 1.25 }}>
              <StatusChip status={o.status} size="sm" />
              <ActionButton shop={shop} dense />
            </Box>
          </Box>
        </>
      ) : (
        <Box tabIndex={0} role="group" aria-label="Flavors" sx={(t) => ({ flex: 1, minHeight: 0, px: 1.5, py: 1.5, display: 'grid', gap: 1.5, alignContent: 'start', bgcolor: subtle(t), ...thinScroll })}>
          <RevenuePanel shop={shop} chart={84} />
          <Panel>
            <Typography sx={{ ...label, mb: 1.5 }}>Flavor stock</Typography>
            <StockList shop={shop} flavor={flavor} dense={dense} />
          </Panel>
        </Box>
      )}
      <Box component="nav" aria-label="Scoop Shop" sx={(t) => ({ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${hairline(t)}`, bgcolor: 'background.paper', pb: 1.5 })}>
        {NAV.map(({ id, label: text, Icon }) => {
          const on = shop.view === id;
          return (
            <ButtonBase key={id} onClick={() => shop.setView(id)} aria-current={on ? 'page' : undefined} sx={{ flexDirection: 'column', gap: 0.25, pt: 1, pb: 0.5, minHeight: 48, fontSize: 11.5, fontWeight: on ? 700 : 500, color: on ? 'text.primary' : 'text.secondary', ...focusRing }}>
              <Box sx={(t) => ({ display: 'grid', placeItems: 'center', width: 52, height: 26, borderRadius: 999, bgcolor: on ? tint(t, 0.14) : 'transparent', transition: 'background-color .2s' })}>
                <Icon sx={{ fontSize: 20, color: on ? 'primary.main' : 'inherit' }} />
              </Box>
              {text}
            </ButtonBase>
          );
        })}
      </Box>
      <Toaster toast={shop.toast} bottom={shop.view === 'orders' ? 196 : 76} />
    </Box>
  );
}

export default function ScoopShop(props: AppProps) {
  return props.compact ? <PhoneApp {...props} /> : <DesktopApp {...props} />;
}
