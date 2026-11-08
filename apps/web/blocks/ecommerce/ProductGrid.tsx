'use client';
// @block {"name":"Product grid","description":"Four product cards with gradient placeholders, ratings and add-to-cart buttons."}
import * as React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Card, Chip, Rating } from '@sorbet-ui/react';

const products = [
  { id: 'mug', name: 'Acme Ceramic Mug', category: 'Kitchen', price: 24, rating: 4.5, reviews: 128, gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', badge: 'New' },
  { id: 'tote', name: 'Everyday Canvas Tote', category: 'Bags', price: 38, rating: 4, reviews: 86, gradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)' },
  { id: 'lamp', name: 'Orbit Desk Lamp', category: 'Home office', price: 89, rating: 5, reviews: 41, gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', badge: 'Bestseller' },
  { id: 'notebook', name: 'Dot Grid Notebook', category: 'Stationery', price: 16, rating: 3.5, reviews: 212, gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
];

export default function ProductGrid() {
  const [added, setAdded] = React.useState<Record<string, boolean>>({});
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, mb: 4 }}>
          <Box>
            <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.03em' }}>
              New this season
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Small things from the Acme shop that make the day better.
            </Typography>
          </Box>
          <Button variant="link" href="#">
            Shop all products
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box aria-hidden sx={{ position: 'relative', aspectRatio: '4 / 3', background: p.gradient }}>
                  {p.badge && (
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      <Chip size="sm" variant="solid" color="neutral" label={p.badge} />
                    </Box>
                  )}
                </Box>
                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {p.category}
                  </Typography>
                  <Typography component="h3" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {p.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
                    <Rating value={p.rating} precision={0.5} readOnly size="sm" aria-label={`Rated ${p.rating} out of 5`} />
                    <Typography variant="caption" color="text.secondary">
                      ({p.reviews})
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontWeight: 800, fontSize: 20, mt: 1.5, mb: 2 }}>${p.price.toFixed(2)}</Typography>
                  <Button
                    fullWidth
                    variant={added[p.id] ? 'soft' : 'solid'}
                    color={added[p.id] ? 'success' : 'primary'}
                    startIcon={added[p.id] ? <CheckIcon /> : <AddShoppingCartIcon />}
                    onClick={() => setAdded((a) => ({ ...a, [p.id]: !a[p.id] }))}
                    aria-label={added[p.id] ? `Remove ${p.name} from cart` : `Add ${p.name} to cart`}
                    sx={{ mt: 'auto' }}
                  >
                    {added[p.id] ? 'Added' : 'Add to cart'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
