'use client';
// Live examples for the guide pages. Client components, rendered by the server
// pages as children of ExampleViewer (no functions cross the boundary).
import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertTitle, Box, FormHelperText, Link, Stack, ThemeProvider, Typography } from '@mui/material';
import { createTheme, type Theme } from '@mui/material/styles';
import { Alert, Breadcrumbs, Button, Checkbox, MenuItem, Select, Switch, TextField } from '@sorbet-ui/react';

// ---------------------------------------------------------------------------
// Forms: a sign-up form validated on submit, with an error summary.
// ---------------------------------------------------------------------------

type Values = { name: string; email: string; password: string; role: string; news: boolean; terms: boolean };
type Field = 'name' | 'email' | 'password' | 'role' | 'terms';
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: '', email: '', password: '', role: '', news: false, terms: false };
const ORDER: Field[] = ['name', 'email', 'password', 'role', 'terms'];
const ID: Record<Field, string> = {
  name: 'signup-name',
  email: 'signup-email',
  password: 'signup-password',
  role: 'signup-role',
  terms: 'signup-terms',
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Enter your name';
  if (!v.email.trim()) e.email = 'Enter your email address';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter an email address like sam@example.com';
  if (v.password.length < 8) e.password = 'Use at least 8 characters for your password';
  if (!v.role) e.role = 'Choose your role';
  if (!v.terms) e.terms = 'Agree to the terms to create an account';
  return e;
}

export function SignUpForm() {
  const [values, setValues] = React.useState<Values>(EMPTY);
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [done, setDone] = React.useState<string | null>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const [focusSummary, setFocusSummary] = React.useState(0);

  // After a failed submit, move focus to the summary so it is read out first.
  React.useEffect(() => {
    if (focusSummary) summaryRef.current?.focus();
  }, [focusSummary]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Once the form was submitted, fix errors as the person types; never add new ones early.
    if (submitted) setErrors((prev) => (key in prev ? { ...prev, [key]: validate(next)[key as Field] } : prev));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setSubmitted(true);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setDone(null);
      setFocusSummary((n) => n + 1);
      return;
    }
    setDone(`Account created for ${values.name.trim()}. (Demo only: nothing was sent.)`);
    setValues(EMPTY);
    setSubmitted(false);
  };

  const list = ORDER.filter((f) => errors[f]);
  const goTo = (f: Field) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(ID[f])?.focus();
  };
  const err = (f: Field) => Boolean(errors[f]);

  return (
    <Box component="form" noValidate onSubmit={onSubmit} aria-labelledby="signup-title" data-testid="signup-form" sx={{ width: '100%', maxWidth: 440 }}>
      <Typography id="signup-title" component="p" sx={{ fontWeight: 800, fontSize: 18 }}>
        Create your account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        All fields are required unless marked optional.
      </Typography>

      {list.length > 0 && (
        <Alert ref={summaryRef} tabIndex={-1} color="danger" variant="soft" data-testid="error-summary" sx={{ mb: 2, '&:focus-visible': { outline: '2px solid', outlineColor: 'danger.main', outlineOffset: 2 } }}>
          <AlertTitle>
            {list.length === 1 ? 'Fix 1 field to continue' : `Fix ${list.length} fields to continue`}
          </AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {list.map((f) => (
              <li key={f}>
                <Link href={`#${ID[f]}`} onClick={goTo(f)} color="inherit" sx={{ fontWeight: 600 }}>
                  {errors[f]}
                </Link>
              </li>
            ))}
          </Box>
        </Alert>
      )}

      {done && (
        <Alert color="success" variant="soft" role="status" data-testid="signup-success" sx={{ mb: 2 }}>
          {done}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <TextField
          id={ID.name}
          label="Full name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          error={err('name')}
          helperText={errors.name}
          slotProps={{ htmlInput: { 'aria-required': true } }}
          fullWidth
        />
        <TextField
          id={ID.email}
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          error={err('email')}
          helperText={errors.email ?? 'We only use it to sign you in.'}
          slotProps={{ htmlInput: { 'aria-required': true } }}
          fullWidth
        />
        <TextField
          id={ID.password}
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => set('password', e.target.value)}
          error={err('password')}
          helperText={errors.password ?? 'At least 8 characters.'}
          slotProps={{ htmlInput: { 'aria-required': true } }}
          fullWidth
        />
        <Box>
          <Select
            label="Role"
            value={values.role}
            onChange={(e) => set('role', e.target.value)}
            error={err('role')}
            SelectDisplayProps={{
              id: ID.role,
              'aria-required': true,
              'aria-invalid': err('role'),
              'aria-describedby': err('role') ? `${ID.role}-error` : undefined,
            } as React.HTMLAttributes<HTMLDivElement>}
          >
            <MenuItem value="design">Design</MenuItem>
            <MenuItem value="engineering">Engineering</MenuItem>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="other">Something else</MenuItem>
          </Select>
          {errors.role && (
            <FormHelperText id={`${ID.role}-error`} error sx={{ mx: 1.75 }}>
              {errors.role}
            </FormHelperText>
          )}
        </Box>
        <Switch label="Email me product news (optional)" checked={values.news} onChange={(_e, v) => set('news', v)} />
        <Box>
          <Checkbox
            id={ID.terms}
            label="I agree to the terms of service"
            checked={values.terms}
            onChange={(_e, v) => set('terms', v)}
            aria-describedby={err('terms') ? `${ID.terms}-error` : undefined}
            slotProps={{ input: { 'aria-required': true, 'aria-invalid': err('terms') } as React.InputHTMLAttributes<HTMLInputElement> }}
          />
          {errors.terms && (
            <FormHelperText id={`${ID.terms}-error`} error sx={{ mt: 0 }}>
              {errors.terms}
            </FormHelperText>
          )}
        </Box>
        <Button type="submit" size="lg" shape="block">
          Create account
        </Button>
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Routing: Sorbet components rendering Next.js links.
// ---------------------------------------------------------------------------

// Every MUI Link (and so every Sorbet Breadcrumbs link) renders a Next link.
const withRouterLinks = (outer: Theme) =>
  createTheme(outer, {
    components: {
      MuiLink: { defaultProps: { component: NextLink } },
      MuiButtonBase: { defaultProps: { LinkComponent: NextLink } },
    },
  });

const NAV = [
  { href: '/docs/guides/forms', label: 'Forms' },
  { href: '/docs/guides/routing', label: 'Routing' },
  { href: '/docs/guides/ai', label: 'AI and MCP' },
];

export function RoutingDemo() {
  const pathname = usePathname();
  return (
    <ThemeProvider theme={withRouterLinks}>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 520, alignItems: 'flex-start' }} data-testid="routing-demo">
        <Breadcrumbs
          items={[
            { id: 'docs', label: 'Docs', href: '/docs' },
            { id: 'guides', label: 'Guides', href: '/docs/guides/forms' },
            { id: 'routing', label: 'Routing and links' },
          ]}
        />
        <Box component="nav" aria-label="Guides (example)">
          <Stack component="ul" direction="row" useFlexGap sx={{ listStyle: 'none', p: 0, m: 0, gap: 1, flexWrap: 'wrap' }}>
            {NAV.map((n) => {
              const current = pathname === n.href || pathname === `${n.href}/`;
              return (
                <li key={n.href}>
                  <Button href={n.href} size="sm" variant={current ? 'soft' : 'plain'} color={current ? 'primary' : 'neutral'} aria-current={current ? 'page' : undefined}>
                    {n.label}
                  </Button>
                </li>
              );
            })}
          </Stack>
        </Box>
        <Button component={NextLink} href="/docs/guides/forms" variant="outlined" data-testid="routing-button">
          Read the forms guide
        </Button>
      </Stack>
    </ThemeProvider>
  );
}
