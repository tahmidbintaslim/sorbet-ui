'use client';
// Storefront: "Kiln & Co.", a fictional ceramics shop. A product grid with filters
// and sorting, a quick-view dialog, a cart drawer with a free-shipping meter and a
// three-step checkout. Catalog in ./data.ts, product pictures drawn in ./art.tsx.
// The page responds to the width of its container (container queries), so it works
// full screen, in a panel or in a preview frame.
import * as React from 'react';
import { Box, Collapse, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, RadioGroup, Stack, Typography } from '@mui/material';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import Close from '@mui/icons-material/Close';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Alert, Badge, Button, Checkbox, Chip, Dialog, Drawer, MenuItem, Progress, Radio, Rating, Select, Slider, Snackbar, Stepper, TextField } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import ProductArt, { glazeColor } from './art';
import { CATEGORIES, FREE_SHIPPING, PRODUCTS, SHIPPING, SORTS, money, type Accent, type Category, type Glaze, type Product, type ShippingId, type SortId } from './data';

const CQ = { sm: '@container (min-width: 600px)', md: '@container (min-width: 900px)' } as const;
const TAP = { '@media (pointer: coarse)': { minHeight: 44, minWidth: 44 } } as const;
const MAX_PRICE = 80;

type Line = { key: string; product: Product; glaze: Glaze; qty: number };

function Qty({ value, onChange, label, min = 1, max = 10 }: { value: number; onChange: (n: number) => void; label: string; min?: number; max?: number }) {
  return (
    <Stack direction="row" role="group" aria-label={label} sx={{ alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 999, width: 'fit-content' }}>
      <IconButton size="small" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)} sx={TAP}>
        <Remove fontSize="small" />
      </IconButton>
      <Box component="output" aria-live="polite" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Box>
      <IconButton size="small" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} sx={TAP}>
        <Add fontSize="small" />
      </IconButton>
    </Stack>
  );
}

function Swatches({ product, value, onChange, name }: { product: Product; value: Glaze; onChange: (g: Glaze) => void; name: string }) {
  return (
    <RadioGroup row aria-label="Glaze" name={name} value={value.id} onChange={(e) => onChange(product.glazes.find((g) => g.id === e.target.value)!)} sx={{ gap: 1 }}>
      {product.glazes.map((g) => {
        const on = g.id === value.id;
        return (
          <Box
            key={g.id}
            component="label"
            title={g.name}
            sx={{ position: 'relative', width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 2, borderColor: on ? 'text.primary' : 'transparent', '&:has(input:focus-visible)': { outline: '2px solid', outlineColor: 'text.primary', outlineOffset: 2 } }}
          >
            <Box component="input" type="radio" name={name} value={g.id} checked={on} onChange={() => onChange(g)} aria-label={g.name} sx={{ position: 'absolute', opacity: 0, inset: 0, m: 0, cursor: 'pointer' }} />
            <Box aria-hidden sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: glazeColor(g), boxShadow: 'inset 0 0 0 1px rgba(15,23,42,.15)' }} />
          </Box>
        );
      })}
    </RadioGroup>
  );
}

export default function Storefront({ accent = 'danger' }: { accent?: Accent }) {
  // Filters
  const [cats, setCats] = React.useState<Category[]>([]);
  const [maxPrice, setMaxPrice] = React.useState(MAX_PRICE);
  const [inStock, setInStock] = React.useState(false);
  const [sort, setSort] = React.useState<SortId>('featured');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  // Cart
  const [cart, setCart] = React.useState<Line[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  // Quick view
  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewing, setViewing] = React.useState<{ product: Product; glaze: Glaze; qty: number } | null>(null);
  // Checkout
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({ name: '', email: '', address: '', city: '', postcode: '', card: '', expiry: '', cvc: '' });
  const [touched, setTouched] = React.useState(false);
  const [shipping, setShipping] = React.useState<ShippingId>('standard');
  const [placed, setPlaced] = React.useState<{ id: string; total: number; email: string } | null>(null);
  const [toast, setToast] = React.useState<{ id: number; message: string; open: boolean } | null>(null);
  const notify = (message: string) => setToast((t) => ({ id: (t?.id ?? 0) + 1, message, open: true }));
  const shopRef = React.useRef<HTMLElement>(null);
  const viewTitle = React.useId();
  const checkoutTitle = React.useId();

  const products = React.useMemo(() => {
    const list = PRODUCTS.filter((p) => (cats.length === 0 || cats.includes(p.category)) && p.price <= maxPrice && (!inStock || p.stock > 0));
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [cats, maxPrice, inStock, sort]);
  const filtered = cats.length > 0 || maxPrice < MAX_PRICE || inStock;
  const clearFilters = () => {
    setCats([]);
    setMaxPrice(MAX_PRICE);
    setInStock(false);
  };

  const count = cart.reduce((a, l) => a + l.qty, 0);
  const subtotal = cart.reduce((a, l) => a + l.qty * l.product.price, 0);
  const freeShip = subtotal >= FREE_SHIPPING;
  const shipCost = cart.length === 0 ? 0 : shipping === 'standard' && freeShip ? 0 : SHIPPING[shipping].price;
  const total = subtotal + shipCost;

  const addToCart = (product: Product, glaze: Glaze, qty = 1) => {
    const key = `${product.id}-${glaze.id}`;
    setCart((c) => (c.some((l) => l.key === key) ? c.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l)) : [...c, { key, product, glaze, qty }]));
    notify(`${product.name} (${glaze.name}) added to your bag`);
  };
  const setQty = (key: string, qty: number) => setCart((c) => c.map((l) => (l.key === key ? { ...l, qty } : l)));

  const quickView = (p: Product) => {
    setViewing({ product: p, glaze: p.glazes[0], qty: 1 });
    setViewOpen(true);
  };

  // Checkout validation
  const errors = {
    name: !form.name.trim() && 'Enter your name',
    email: !/^\S+@\S+\.\S+$/.test(form.email) && 'Enter an email like you@example.com',
    address: !form.address.trim() && 'Enter a street address',
    city: !form.city.trim() && 'Enter a city',
    postcode: !/^[A-Za-z0-9 -]{3,10}$/.test(form.postcode.trim()) && 'Enter a postal code',
    card: form.card.replace(/\s/g, '').length !== 16 && 'Card numbers have 16 digits',
    expiry: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry) && 'Use MM/YY',
    cvc: !/^\d{3,4}$/.test(form.cvc) && '3 or 4 digits',
  };
  const stepFields: (keyof typeof errors)[][] = [['name', 'email', 'address', 'city', 'postcode'], ['card', 'expiry', 'cvc'], []];
  const stepOk = stepFields[step].every((f) => !errors[f]);
  const field = (key: keyof typeof form, label: string, extra: Partial<React.ComponentProps<typeof TextField>> = {}) => (
    <TextField
      label={label}
      color={accent}
      fullWidth
      value={form[key]}
      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      error={touched && !!errors[key as keyof typeof errors]}
      helperText={(touched && errors[key as keyof typeof errors]) || ' '}
      {...extra}
    />
  );
  const next = () => {
    if (!stepOk) {
      setTouched(true);
      return;
    }
    setTouched(false);
    if (step < 2) setStep(step + 1);
    else {
      setPlaced({ id: `KC-${1040 + cart.length * 7 + count}`, total, email: form.email });
      setCart([]);
    }
  };
  const startCheckout = () => {
    setCartOpen(false);
    setStep(0);
    setTouched(false);
    setPlaced(null);
    setCheckoutOpen(true);
  };

  const filterPanel = (
    <Stack spacing={2.5}>
      <Box>
        <Typography id="sf-cat" sx={{ fontWeight: 700, fontSize: 14, mb: 0.5 }}>
          Category
        </Typography>
        <Box role="group" aria-labelledby="sf-cat" sx={{ display: 'grid' }}>
          {CATEGORIES.map((c) => (
            <Checkbox
              key={c}
              size="sm"
              color={accent}
              label={`${c} (${PRODUCTS.filter((p) => p.category === c).length})`}
              checked={cats.includes(c)}
              onChange={(e) => setCats((list) => (e.target.checked ? [...list, c] : list.filter((x) => x !== c)))}
            />
          ))}
        </Box>
      </Box>
      <Box>
        <Typography id="sf-price" sx={{ fontWeight: 700, fontSize: 14, mb: 0.5 }}>
          Max price: {money(maxPrice).replace('.00', '')}
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider size="sm" color={accent} min={20} max={MAX_PRICE} step={5} value={maxPrice} onChange={(_, v) => setMaxPrice(v as number)} aria-labelledby="sf-price" getAriaValueText={(v) => `$${v}`} />
        </Box>
      </Box>
      <Checkbox size="sm" color={accent} label="In stock only" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
      {filtered && (
        <Button size="sm" variant="ghost" color="neutral" onClick={clearFilters} sx={{ alignSelf: 'flex-start' }}>
          Clear filters
        </Button>
      )}
    </Stack>
  );

  return (
    <Box sx={{ containerType: 'inline-size', minHeight: '100%', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Header */}
      <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 5, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ px: 2, py: 0.75, textAlign: 'center', fontSize: 13, fontWeight: 600, bgcolor: colorPalette[accent][700], color: '#fff' }}>Free shipping on orders over {money(FREE_SHIPPING).replace('.00', '')}</Box>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 2, px: 2, minHeight: 60, maxWidth: 1200, mx: 'auto', [CQ.md]: { px: 4 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: 1 }}>
            <Box aria-hidden sx={{ width: 28, height: 28 }}>
              <ProductArt shape="vase" glaze={{ id: 'logo', name: '', hue: accent }} size={28} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Kiln &amp; Co.</Typography>
          </Stack>
          <Box component="nav" aria-label="Shop" sx={{ display: 'none', [CQ.sm]: { display: 'flex' }, gap: 0.5 }}>
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={cats.length === 1 && cats[0] === c ? 'soft' : 'ghost'}
                color={cats.length === 1 && cats[0] === c ? accent : 'neutral'}
                onClick={() => {
                  setCats([c]);
                  shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {c}
              </Button>
            ))}
          </Box>
          <IconButton aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`} onClick={() => setCartOpen(true)} sx={TAP}>
            <Badge badgeContent={count} color={accent} invisible={count === 0}>
              <ShoppingBagOutlined />
            </Badge>
          </IconButton>
        </Stack>
      </Box>

      {/* Hero */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, pt: 3, [CQ.md]: { px: 4, pt: 4 } }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', p: 3, display: 'grid', gap: 2, alignItems: 'center', bgcolor: (t) => (t.palette.mode === 'dark' ? colorPalette[accent].alpha12 : colorPalette[accent][50]), [CQ.sm]: { gridTemplateColumns: '1.2fr 1fr', p: 5 } }}>
          <Box>
            <Chip size="sm" variant="soft" color={accent} label="Winter collection" />
            <Typography component="h2" sx={{ mt: 1.5, fontWeight: 800, fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.03em', [CQ.md]: { fontSize: 44 } }}>
              Made by hand for slow mornings
            </Typography>
            <Typography sx={{ mt: 1.5, color: 'text.secondary', maxWidth: 440 }}>Small-batch stoneware from a two-person studio. Every piece is thrown, trimmed and glazed by hand, so no two are quite the same.</Typography>
            <Stack direction="row" sx={{ gap: 1, mt: 2.5, flexWrap: 'wrap' }}>
              <Button color={accent} onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Shop the collection
              </Button>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => {
                  setCats([]);
                  setSort('rating');
                  shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Best sellers
              </Button>
            </Stack>
          </Box>
          <Box aria-hidden sx={{ display: 'none', [CQ.sm]: { display: 'grid' }, gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <ProductArt shape="vase" glaze={PRODUCTS[6].glazes[0]} />
            <Box sx={{ display: 'grid', gap: 1 }}>
              <ProductArt shape="mug" glaze={PRODUCTS[0].glazes[0]} />
              <ProductArt shape="bowl" glaze={PRODUCTS[2].glazes[0]} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Shop */}
      <Box ref={shopRef} component="section" aria-labelledby="sf-shop" sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 4, scrollMarginTop: 100, [CQ.md]: { px: 4 } }}>
        <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2.5 }}>
          <Box>
            <Typography id="sf-shop" component="h2" sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
              {cats.length === 1 ? cats[0] : 'All pieces'}
            </Typography>
            <Typography role="status" sx={{ fontSize: 14, color: 'text.secondary' }}>
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button size="sm" variant="outlined" color="neutral" startIcon={<TuneOutlined />} aria-expanded={filtersOpen} aria-controls="sf-filters" onClick={() => setFiltersOpen((o) => !o)} sx={{ [CQ.md]: { display: 'none' }, ...TAP }}>
              Filters
            </Button>
            <Box sx={{ width: 190 }}>
              <Select size="sm" color={accent} value={sort} onChange={(e) => setSort(e.target.value as SortId)} SelectDisplayProps={{ 'aria-label': 'Sort by' }} fullWidth>
                {SORTS.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ display: 'grid', gap: filtersOpen ? 3 : 0, gridTemplateColumns: 'minmax(0, 1fr)', [CQ.md]: { gap: 3, gridTemplateColumns: '220px minmax(0, 1fr)' } }}>
          <Box component="aside" aria-label="Filters" id="sf-filters">
            <Box sx={{ display: 'none', [CQ.md]: { display: 'block', position: 'sticky', top: 110 } }}>{filterPanel}</Box>
            <Box sx={{ [CQ.md]: { display: 'none' } }}>
              <Collapse in={filtersOpen}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: '16px', bgcolor: 'background.paper' }}>{filterPanel}</Box>
              </Collapse>
            </Box>
          </Box>

          {products.length === 0 ? (
            <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', py: 8, border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: '20px' }}>
              <ShoppingBagOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
              <Typography sx={{ fontWeight: 700 }}>Nothing matches those filters</Typography>
              <Button size="sm" variant="soft" color={accent} onClick={clearFilters}>
                Clear filters
              </Button>
            </Stack>
          ) : (
            <Box component="ul" aria-label="Products" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', [CQ.sm]: { gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2.5 } }}>
              {products.map((p) => {
                const soldOut = p.stock === 0;
                return (
                  <Box component="li" key={p.id} data-testid="product" sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', bgcolor: 'background.paper', border: 1, borderColor: 'divider', '&:hover .qv, &:focus-within .qv': { opacity: 1, transform: 'none' } }}>
                      <ProductArt shape={p.shape} glaze={p.glazes[0]} />
                      <Stack direction="row" sx={{ position: 'absolute', top: 10, left: 10, gap: 0.5 }}>
                        {p.isNew && <Chip size="xs" variant="solid" color={accent} label="New" />}
                        {soldOut ? <Chip size="xs" variant="solid" color="neutral" label="Sold out" /> : p.stock <= 5 && <Chip size="xs" variant="soft" color="warning" label={`Only ${p.stock} left`} />}
                      </Stack>
                      <Button
                        className="qv"
                        size="sm"
                        variant="solid"
                        color="neutral"
                        startIcon={<VisibilityOutlined />}
                        onClick={() => quickView(p)}
                        aria-label={`Quick view: ${p.name}`}
                        sx={{ position: 'absolute', left: 10, right: 10, bottom: 10, opacity: 0, transform: 'translateY(6px)', transition: 'opacity .2s, transform .2s', '@media (hover: none)': { opacity: 1, transform: 'none' }, '@media (prefers-reduced-motion: reduce)': { transition: 'none' } }}
                      >
                        Quick view
                      </Button>
                    </Box>
                    <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 1, mt: 1.25 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography component="h3" sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>
                          {p.name}
                        </Typography>
                        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                          <Rating value={p.rating} precision={0.1} readOnly size="xs" color="warning" aria-label={`Rated ${p.rating} out of 5`} />
                          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>({p.reviews})</Typography>
                        </Stack>
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>${p.price}</Typography>
                    </Stack>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1, gap: 1, flexWrap: 'wrap' }}>
                      <Stack direction="row" spacing={0.5} aria-label={`Glazes: ${p.glazes.map((g) => g.name).join(', ')}`} role="img">
                        {p.glazes.map((g) => (
                          <Box key={g.id} sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: glazeColor(g), boxShadow: 'inset 0 0 0 1px rgba(15,23,42,.15)' }} />
                        ))}
                      </Stack>
                      <Button size="sm" variant="soft" color={accent} disabled={soldOut} onClick={() => addToCart(p, p.glazes[0])} aria-label={soldOut ? `${p.name} is sold out` : `Add ${p.name} to bag`} sx={TAP}>
                        {soldOut ? 'Sold out' : 'Add'}
                      </Button>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 4, display: 'grid', gap: 3, [CQ.sm]: { gridTemplateColumns: 'repeat(3, 1fr)' }, [CQ.md]: { px: 4 } }}>
          {[
            ['Handmade', 'Thrown and glazed in our studio. Small marks and variations are part of each piece.'],
            ['Careful shipping', 'Packed in recycled paper pulp. Anything that arrives broken is replaced.'],
            ['30-day returns', 'Changed your mind? Send it back unused within 30 days.'],
          ].map(([t, d]) => (
            <Box key={t}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{t}</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>{d}</Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ textAlign: 'center', fontSize: 12, color: 'text.secondary', pb: 3 }}>Kiln &amp; Co. is a sample store. Nothing here is for sale.</Typography>
      </Box>

      {/* Quick view */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth aria-labelledby={viewTitle} slotProps={{ transition: { onExited: () => setViewing(null) } }}>
        {viewing && (
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Box sx={{ bgcolor: 'action.hover', p: 3, display: 'grid', placeItems: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: 340 }}>
                  <ProductArt shape={viewing.product.shape} glaze={viewing.glaze} />
                </Box>
              </Box>
              <Box sx={{ p: 3, position: 'relative' }}>
                <IconButton aria-label="Close" onClick={() => setViewOpen(false)} sx={{ position: 'absolute', top: 8, right: 8, ...TAP }}>
                  <Close />
                </IconButton>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>{viewing.product.category}</Typography>
                <Typography id={viewTitle} component="h2" sx={{ fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', pr: 5 }}>
                  {viewing.product.name}
                </Typography>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Rating value={viewing.product.rating} precision={0.1} readOnly size="sm" color="warning" aria-label={`Rated ${viewing.product.rating} out of 5`} />
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{viewing.product.reviews} reviews</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 800, fontSize: 22, mt: 1.5 }}>${viewing.product.price}</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1.5, fontSize: 15 }}>{viewing.product.blurb}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 14, mt: 2.5, mb: 1 }}>
                  Glaze: <Box component="span" sx={{ fontWeight: 500 }}>{viewing.glaze.name}</Box>
                </Typography>
                <Swatches product={viewing.product} value={viewing.glaze} onChange={(g) => setViewing((v) => (v ? { ...v, glaze: g } : v))} name="qv-glaze" />
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
                  <Qty label="Quantity" value={viewing.qty} max={Math.max(1, Math.min(10, viewing.product.stock))} onChange={(q) => setViewing((v) => (v ? { ...v, qty: q } : v))} />
                  <Button
                    color={accent}
                    disabled={viewing.product.stock === 0}
                    startIcon={<ShoppingBagOutlined />}
                    onClick={() => {
                      addToCart(viewing.product, viewing.glaze, viewing.qty);
                      setViewOpen(false);
                    }}
                    sx={{ flex: 1, minWidth: 160 }}
                  >
                    {viewing.product.stock === 0 ? 'Sold out' : `Add to bag · ${money(viewing.product.price * viewing.qty)}`}
                  </Button>
                </Stack>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 2, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <LocalShippingOutlined sx={{ fontSize: 18 }} />
                  {viewing.product.stock > 0 ? `In stock, ships in 2 days` : 'Back in a few weeks'}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* Cart */}
      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} anchor="right" aria-label="Shopping bag">
        <Box sx={{ width: 'min(400px, 92cqw)', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2 }}>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: 20 }}>
              Your bag {count > 0 && `(${count})`}
            </Typography>
            <IconButton aria-label="Close bag" onClick={() => setCartOpen(false)} sx={TAP}>
              <Close />
            </IconButton>
          </Stack>
          <Box sx={{ px: 2.5, pb: 2 }}>
            <Typography sx={{ fontSize: 13, mb: 0.75 }}>{freeShip ? 'You get free standard shipping.' : `Add ${money(FREE_SHIPPING - subtotal)} more for free shipping.`}</Typography>
            <Progress size="sm" color={freeShip ? 'success' : accent} value={Math.min(100, (subtotal / FREE_SHIPPING) * 100)} aria-label="Progress to free shipping" />
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5 }}>
            {cart.length === 0 ? (
              <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', py: 6 }}>
                <ShoppingBagOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Typography sx={{ fontWeight: 700 }}>Your bag is empty</Typography>
                <Button size="sm" variant="soft" color={accent} onClick={() => setCartOpen(false)}>
                  Keep shopping
                </Button>
              </Stack>
            ) : (
              <Box component="ul" aria-label="Items in your bag" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {cart.map((l) => (
                  <Box component="li" key={l.key} sx={{ display: 'flex', gap: 1.5, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ width: 72, flexShrink: 0, borderRadius: '12px', overflow: 'hidden', bgcolor: 'action.hover' }}>
                      <ProductArt shape={l.product.shape} glaze={l.glaze} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{l.product.name}</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{money(l.product.price * l.qty)}</Typography>
                      </Stack>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{l.glaze.name}</Typography>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                        <Qty label={`Quantity of ${l.product.name}`} value={l.qty} onChange={(q) => setQty(l.key, q)} />
                        <IconButton aria-label={`Remove ${l.product.name}`} onClick={() => setCart((c) => c.filter((x) => x.key !== l.key))} sx={TAP}>
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {cart.length > 0 && (
            <Box sx={{ p: 2.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
              {[
                ['Subtotal', money(subtotal)],
                ['Shipping', freeShip ? 'Free' : `From ${money(SHIPPING.standard.price)}`],
              ].map(([k, v]) => (
                <Stack key={k} direction="row" sx={{ justifyContent: 'space-between', fontSize: 14, mb: 0.75 }}>
                  <span>{k}</span>
                  <span>{v}</span>
                </Stack>
              ))}
              <Button fullWidth size="lg" color={accent} onClick={startCheckout} sx={{ mt: 1.5 }}>
                Checkout · {money(subtotal + (freeShip ? 0 : SHIPPING.standard.price))}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Checkout */}
      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth aria-labelledby={checkoutTitle}>
        <DialogTitle id={checkoutTitle} sx={{ pr: 7 }}>
          {placed ? 'Order placed' : 'Checkout'}
          <IconButton aria-label="Close checkout" onClick={() => setCheckoutOpen(false)} sx={{ position: 'absolute', right: 12, top: 12, ...TAP }}>
            <Close />
          </IconButton>
        </DialogTitle>
        {placed ? (
          <>
            <DialogContent>
              <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 2 }}>
                <CheckCircleOutlined sx={{ fontSize: 56, color: (t) => colorPalette.success[t.palette.mode === 'dark' ? 300 : 600] }} />
                <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Thank you, {form.name.split(' ')[0]}!</Typography>
                <Typography color="text.secondary">
                  Order {placed.id} for {money(placed.total)} is confirmed. A receipt is on its way to {placed.email}.
                </Typography>
                <Alert color="info" size="sm">
                  This is a sample store: nothing was charged and nothing will ship.
                </Alert>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button color={accent} onClick={() => setCheckoutOpen(false)}>
                Back to the shop
              </Button>
            </DialogActions>
          </>
        ) : (
          <Box component="form" noValidate sx={{ display: 'contents' }} onSubmit={(e: React.FormEvent) => { e.preventDefault(); next(); }}>
            <DialogContent>
              <Stepper activeStep={step} color={accent} size="sm" alternativeLabel steps={[{ label: 'Shipping' }, { label: 'Payment' }, { label: 'Review' }]} sx={{ mb: 3 }} />
              {step === 0 && (
                <Box sx={{ display: 'grid', gap: 0.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 2 }}>
                  {field('name', 'Full name', { autoComplete: 'name' })}
                  {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
                  <Box sx={{ gridColumn: '1 / -1' }}>{field('address', 'Street address', { autoComplete: 'street-address' })}</Box>
                  {field('city', 'City', { autoComplete: 'address-level2' })}
                  {field('postcode', 'Postal code', { autoComplete: 'postal-code' })}
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography id="sf-ship" sx={{ fontWeight: 700, fontSize: 14, mb: 0.5 }}>
                      Delivery
                    </Typography>
                    <RadioGroup aria-labelledby="sf-ship" value={shipping} onChange={(e) => setShipping(e.target.value as ShippingId)}>
                      {(Object.keys(SHIPPING) as ShippingId[]).map((id) => (
                        <FormControlLabel
                          key={id}
                          value={id}
                          control={<Radio color={accent} size="sm" />}
                          label={`${SHIPPING[id].label}, ${SHIPPING[id].detail} · ${id === 'standard' && freeShip ? 'Free' : money(SHIPPING[id].price)}`}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </Box>
              )}
              {step === 1 && (
                <Box sx={{ display: 'grid', gap: 0.5, gridTemplateColumns: '1fr 1fr', columnGap: 2 }}>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Alert color="info" size="sm" sx={{ mb: 2 }}>
                      Sample checkout: use any 16 digits, nothing is charged.
                    </Alert>
                    {field('card', 'Card number', { autoComplete: 'off', slotProps: { htmlInput: { inputMode: 'numeric', maxLength: 19 } } })}
                  </Box>
                  {field('expiry', 'Expiry (MM/YY)', { autoComplete: 'off', placeholder: '04/29' })}
                  {field('cvc', 'Security code', { autoComplete: 'off', slotProps: { htmlInput: { inputMode: 'numeric', maxLength: 4 } } })}
                </Box>
              )}
              {step === 2 && (
                <Box>
                  <Box component="ul" aria-label="Order summary" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                    {cart.map((l) => (
                      <Box component="li" key={l.key} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1, borderBottom: 1, borderColor: 'divider', fontSize: 14 }}>
                        <span>
                          {l.product.name}, {l.glaze.name} × {l.qty}
                        </span>
                        <span>{money(l.product.price * l.qty)}</span>
                      </Box>
                    ))}
                  </Box>
                  {[
                    ['Subtotal', money(subtotal)],
                    [`Shipping (${SHIPPING[shipping].label})`, shipCost === 0 ? 'Free' : money(shipCost)],
                  ].map(([k, v]) => (
                    <Stack key={k} direction="row" sx={{ justifyContent: 'space-between', fontSize: 14, mt: 1 }}>
                      <span>{k}</span>
                      <span>{v}</span>
                    </Stack>
                  ))}
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1.5, fontWeight: 800, fontSize: 18 }}>
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </Stack>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 2 }}>
                    Ships to {form.name}, {form.address}, {form.city} {form.postcode}. Card ending {form.card.replace(/\s/g, '').slice(-4)}.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
              <Button variant="ghost" color="neutral" onClick={() => (step === 0 ? setCheckoutOpen(false) : setStep(step - 1))}>
                {step === 0 ? 'Cancel' : 'Back'}
              </Button>
              <Button type="submit" color={accent} disabled={cart.length === 0}>
                {step === 2 ? `Place order · ${money(total)}` : 'Continue'}
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      <Snackbar
        key={toast?.id ?? 0}
        open={toast?.open ?? false}
        autoHideDuration={2500}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') setToast((t) => (t ? { ...t, open: false } : t));
        }}
        message={toast?.message ?? ''}
        color="success"
        action={
          <Button size="sm" variant="plain" color="neutral" onClick={() => setCartOpen(true)} sx={{ color: 'inherit' }}>
            View bag
          </Button>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
