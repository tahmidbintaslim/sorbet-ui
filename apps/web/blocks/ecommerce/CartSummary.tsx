'use client';
// @block {"name":"Cart summary","description":"Cart line items with quantity controls, subtotal, tax, total and checkout."}
import * as React from 'react';
import { Box, Container, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockIcon from '@mui/icons-material/LockOutlined';
import { Alert, Button, Card } from '@sorbet-ui/react';

type Item = { id: string; name: string; variant: string; price: number; qty: number; gradient: string };

const initial: Item[] = [
  { id: 'mug', name: 'Acme Ceramic Mug', variant: 'Sand, 350 ml', price: 24, qty: 2, gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
  { id: 'lamp', name: 'Orbit Desk Lamp', variant: 'Matte black', price: 89, qty: 1, gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { id: 'notebook', name: 'Dot Grid Notebook', variant: 'A5, 3-pack', price: 16, qty: 3, gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
];

const TAX_RATE = 0.08;
const money = (n: number) => `$${n.toFixed(2)}`;

export default function CartSummary() {
  const [items, setItems] = React.useState(initial);
  const setQty = (id: string, qty: number) =>
    setItems((list) => (qty <= 0 ? list.filter((i) => i.id !== id) : list.map((i) => (i.id === id ? { ...i, qty } : i))));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 6;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.03em', mb: 3 }}>
          Your cart
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
              {items.length === 0 ? (
                <Alert color="info">Your cart is empty.</Alert>
              ) : (
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {items.map((item, i) => (
                    <Box component="li" key={item.id}>
                      {i > 0 && <Divider sx={{ my: 2 }} />}
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box aria-hidden sx={{ width: 72, height: 72, borderRadius: 2, flexShrink: 0, background: item.gradient }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography component="h3" sx={{ fontWeight: 700 }}>
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.variant}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{money(item.price * item.qty)}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              role="group"
                              aria-label={`Quantity for ${item.name}`}
                              sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}
                            >
                              <IconButton size="small" aria-label={`Decrease quantity of ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography aria-live="polite" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>
                                {item.qty}
                              </Typography>
                              <IconButton size="small" aria-label={`Increase quantity of ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)}>
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                            <IconButton size="small" aria-label={`Remove ${item.name} from cart`} onClick={() => setQty(item.id, 0)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              )}
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography component="h3" sx={{ fontWeight: 700, fontSize: 18 }}>
                Order summary
              </Typography>
              <Box component="dl" sx={{ m: 0, mt: 2 }}>
                {[
                  ['Subtotal', money(subtotal)],
                  ['Shipping', shipping === 0 ? 'Free' : money(shipping)],
                  [`Tax (${TAX_RATE * 100}%)`, money(tax)],
                ].map(([k, v]) => (
                  <Stack key={k} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
                    <Typography component="dt" color="text.secondary">
                      {k}
                    </Typography>
                    <Typography component="dd" sx={{ m: 0 }}>
                      {v}
                    </Typography>
                  </Stack>
                ))}
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
                  <Typography component="dt" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography component="dd" sx={{ m: 0, fontWeight: 800, fontSize: 20 }}>
                    {money(total)}
                  </Typography>
                </Stack>
              </Box>
              <Button size="lg" fullWidth startIcon={<LockIcon />} disabled={items.length === 0} sx={{ mt: 3 }}>
                Checkout
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
                Free shipping on orders over $100. Returns within 30 days.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
