'use client';
// SaaS landing page for "Fernway", a fictional roadmap tool: sticky nav with a menu
// drawer, a hero with email capture and a product mock built from components, a
// feature bento with small live illustrations, pricing with a monthly / yearly
// switch, testimonials, an FAQ and a closing call to action. Copy in ./data.ts.
// Sections respond to the width of their container (container queries).
import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForward from '@mui/icons-material/ArrowForward';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import KeyboardOutlined from '@mui/icons-material/KeyboardOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import { motion, MotionConfig, useInView } from 'motion/react';
import { Alert, Avatar, Button, Card, Chip, Drawer, Progress, Rating, Switch, TextField } from '@sorbet-ui/react';
import { colorPalette } from '@sorbet-ui/tokens';
import { FAQ, LOGOS, NAV, PLANS, TESTIMONIALS, type Accent } from './data';

const CQ = { sm: '@container (min-width: 600px)', md: '@container (min-width: 900px)', lg: '@container (min-width: 1100px)' } as const;
const TAP = { '@media (pointer: coarse)': { minHeight: 44, minWidth: 44 } } as const;
const WRAP = { maxWidth: 1160, mx: 'auto', px: 2.5, [CQ.md]: { px: 4 } } as const;
const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');

function SectionTitle({ id, kicker, title, sub, accent }: { id: string; kicker: string; title: string; sub?: string; accent: Accent }) {
  return (
    <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: 5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: (t) => colorPalette[accent][t.palette.mode === 'dark' ? 300 : 700] }}>{kicker}</Typography>
      <Typography id={id} component="h2" sx={{ mt: 1, fontWeight: 800, fontSize: 30, lineHeight: 1.15, letterSpacing: '-0.03em', [CQ.md]: { fontSize: 40 } }}>
        {title}
      </Typography>
      {sub && <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: 17 }}>{sub}</Typography>}
    </Box>
  );
}

/** The hero's product shot, built from components. Decorative, so inert and hidden. */
function ProductMock({ accent }: { accent: Accent }) {
  const rows = [
    { t: 'Plant detail redesign', who: 'AB', c: 'secondary' as Accent, p: 75, s: 'On track' },
    { t: 'Sync across devices', who: 'RH', c: 'warning' as Accent, p: 40, s: 'At risk' },
    { t: 'Home screen widget', who: 'KO', c: 'primary' as Accent, p: 60, s: 'On track' },
    { t: 'Snooze reminders', who: 'LM', c: 'success' as Accent, p: 15, s: 'Planned' },
  ];
  return (
    <Box aria-hidden inert sx={{ borderRadius: '18px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden', boxShadow: `0 40px 80px -40px ${colorPalette[accent][700]}` }}>
      <Stack direction="row" spacing={0.75} sx={{ px: 2, py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
        {[colorPalette.danger[300], colorPalette.warning[300], colorPalette.success[300]].map((c) => (
          <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
        ))}
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', [CQ.sm]: { gridTemplateColumns: '150px 1fr' } }}>
        <Box sx={{ display: 'none', [CQ.sm]: { display: 'block' }, p: 1.5, borderRight: 1, borderColor: 'divider' }}>
          {['Roadmap', 'Updates', 'Ideas', 'Releases'].map((x, i) => (
            <Box key={x} sx={{ px: 1.25, py: 0.75, borderRadius: '8px', fontSize: 13, fontWeight: i === 0 ? 700 : 500, bgcolor: i === 0 ? 'action.selected' : 'transparent', color: i === 0 ? 'text.primary' : 'text.secondary' }}>
              {x}
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Q1 roadmap</Typography>
            <Chip size="xs" variant="soft" color={accent} label="Update ready" />
          </Stack>
          <Box sx={{ display: 'grid', gap: 1 }}>
            {rows.map((r) => (
              <Stack key={r.t} direction="row" spacing={1.5} sx={{ alignItems: 'center', p: 1.25, borderRadius: '10px', border: 1, borderColor: 'divider' }}>
                <Avatar size="xs" variant="soft" color={r.c}>
                  {r.who}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>
                    {r.t}
                  </Typography>
                  <Progress size="xs" color={r.c} value={r.p} aria-label={r.t} sx={{ mt: 0.5 }} />
                </Box>
                <Chip size="xs" variant="soft" color={r.s === 'At risk' ? 'warning' : r.s === 'Planned' ? 'neutral' : 'success'} label={r.s} />
              </Stack>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Bars that grow when scrolled into view. MotionConfig reducedMotion="user" makes the growth instant. */
function MiniChart({ accent }: { accent: Accent }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-40px' });
  const bars = [32, 48, 40, 62, 55, 78, 90];
  return (
    <Box ref={ref} aria-hidden sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 96 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 6 }}
          animate={{ height: seen ? `${h}%` : 6 }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, borderRadius: 6, background: i === bars.length - 1 ? colorPalette[accent][500] : colorPalette[accent][200] }}
        />
      ))}
    </Box>
  );
}

export default function SaasLanding({ accent = 'primary' }: { accent?: Accent }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailState, setEmailState] = React.useState<'idle' | 'error' | 'done'>('idle');
  const [yearly, setYearly] = React.useState(true);
  const [digest, setDigest] = React.useState(true);
  const [faqOpen, setFaqOpen] = React.useState<number | false>(0);
  const root = React.useRef<HTMLDivElement>(null);

  const go = (id: string) => {
    setMenuOpen(false);
    // Scroll the section into view inside whatever scrolls the page (window or a frame).
    requestAnimationFrame(() => root.current?.querySelector(`#fw-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailState(/^\S+@\S+\.\S+$/.test(email) ? 'done' : 'error');
  };
  const ink = (shade: 300 | 700) => (t: { palette: { mode: string } }) => colorPalette[accent][t.palette.mode === 'dark' ? 300 : shade];

  const brand = (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Box aria-hidden sx={{ width: 30, height: 30, borderRadius: '9px', display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${colorPalette[accent][500]}, ${colorPalette.secondary[500]})` }}>
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M3 13c0-6 4-10 10-10-1 5-4 8-10 10Zm0 0 5-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Fernway</Typography>
    </Stack>
  );

  return (
    <MotionConfig reducedMotion="user">
      <Box ref={root} sx={{ containerType: 'inline-size', minHeight: '100%', bgcolor: 'background.default', color: 'text.primary', overflowX: 'clip' }}>
        {/* Nav */}
        <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 5, backdropFilter: 'blur(12px)', bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(15,23,42,.82)' : 'rgba(255,255,255,.85)'), borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" sx={{ ...WRAP, alignItems: 'center', gap: 2, minHeight: 64 }}>
            <Box sx={{ flex: 1 }}>{brand}</Box>
            <Box component="nav" aria-label="Main" sx={{ display: 'none', [CQ.md]: { display: 'flex' }, gap: 0.5 }}>
              {NAV.map((n) => (
                <Button key={n.id} variant="plain" color="neutral" size="sm" onClick={() => go(n.id)}>
                  {n.label}
                </Button>
              ))}
            </Box>
            <Stack direction="row" spacing={1} sx={{ display: 'none', [CQ.sm]: { display: 'flex' } }}>
              <Button variant="plain" color="neutral" size="sm">
                Sign in
              </Button>
              <Button color={accent} size="sm" onClick={() => go('pricing')}>
                Get started
              </Button>
            </Stack>
            <IconButton aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} sx={{ [CQ.md]: { display: 'none' }, ...TAP }}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Box>
        <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} anchor="right" aria-label="Menu">
          <Box sx={{ width: 'min(300px, 86cqw)', p: 2 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              {brand}
              <IconButton aria-label="Close menu" onClick={() => setMenuOpen(false)} sx={TAP}>
                <Close />
              </IconButton>
            </Stack>
            <Box component="nav" aria-label="Menu" sx={{ display: 'grid', gap: 0.5 }}>
              {NAV.map((n) => (
                <Button key={n.id} variant="ghost" color="neutral" onClick={() => go(n.id)} sx={{ justifyContent: 'flex-start', ...TAP }}>
                  {n.label}
                </Button>
              ))}
            </Box>
            <Stack spacing={1} sx={{ mt: 3 }}>
              <Button variant="outlined" color="neutral">
                Sign in
              </Button>
              <Button color={accent} onClick={() => go('pricing')}>
                Get started
              </Button>
            </Stack>
          </Box>
        </Drawer>

        {/* Hero */}
        <Box component="section" aria-labelledby="fw-hero" sx={{ position: 'relative' }}>
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: (t) => `radial-gradient(60% 50% at 20% 0%, ${t.palette.mode === 'dark' ? colorPalette[accent].alpha20 : colorPalette[accent][100]}, transparent 70%), radial-gradient(50% 40% at 90% 10%, ${t.palette.mode === 'dark' ? colorPalette.secondary.alpha20 : colorPalette.secondary[100]}, transparent 70%)` }} />
          <Box sx={{ ...WRAP, position: 'relative', pt: 7, pb: 8, display: 'grid', gap: 6, alignItems: 'center', [CQ.lg]: { gridTemplateColumns: '1fr 1.05fr', pt: 10, pb: 11 } }}>
            <Box>
              <Chip size="sm" variant="soft" color={accent} icon={<AutoAwesomeOutlined />} label="New: updates that write themselves" />
              <Typography id="fw-hero" component="h2" sx={{ mt: 2.5, fontWeight: 850, fontSize: 40, lineHeight: 1.05, letterSpacing: '-0.04em', [CQ.md]: { fontSize: 60 } }}>
                The roadmap your team{' '}
                <Box component="span" sx={{ color: ink(700) }}>
                  actually keeps
                </Box>
              </Typography>
              <Typography sx={{ mt: 2.5, fontSize: 18, color: 'text.secondary', maxWidth: 520 }}>Fernway turns the work you already track into a living roadmap and a weekly update, so nobody has to ask what is shipping.</Typography>
              <Box component="form" noValidate onSubmit={submit} sx={{ mt: 3.5, maxWidth: 480 }}>
                {emailState === 'done' ? (
                  <Alert color="success">You are on the list. Check {email} for a link to your workspace.</Alert>
                ) : (
                  <Stack sx={{ gap: 1.25, [CQ.sm]: { flexDirection: 'row', alignItems: 'flex-start' } }}>
                    <TextField
                      label="Work email"
                      type="email"
                      color={accent}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailState === 'error') setEmailState('idle');
                      }}
                      error={emailState === 'error'}
                      helperText={emailState === 'error' ? 'Enter an email like you@company.com' : 'Free for up to 5 people. No card needed.'}
                      fullWidth
                    />
                    <Button type="submit" color={accent} size="lg" endIcon={<ArrowForward />} sx={{ flexShrink: 0, minHeight: 52 }}>
                      Get started
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>
            <ProductMock accent={accent} />
          </Box>
          <Box sx={{ ...WRAP, pb: 6 }}>
            <Typography sx={{ textAlign: 'center', fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>Trusted by small teams everywhere (sample names)</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 4, rowGap: 1.5 }}>
              {LOGOS.map((l) => (
                <Box component="li" key={l} sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'text.secondary' }}>
                  {l}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Features */}
        <Box component="section" id="fw-features" aria-labelledby="fw-features-title" sx={{ py: 9, scrollMarginTop: 64, bgcolor: 'background.paper', borderBlock: 1, borderColor: 'divider' }}>
          <Box sx={WRAP}>
            <SectionTitle id="fw-features-title" accent={accent} kicker="Features" title="Less status chasing, more shipping" sub="Everything you need to plan in the open, and nothing you need to babysit." />
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr', [CQ.sm]: { gridTemplateColumns: 'repeat(2, 1fr)' }, [CQ.lg]: { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <Card variant="outlined" sx={{ p: 3, [CQ.lg]: { gridColumn: 'span 2' } }}>
                <InsightsOutlined sx={{ color: ink(700) }} />
                <Typography component="h3" sx={{ fontWeight: 800, fontSize: 18, mt: 1 }}>
                  Progress you can see
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2.5 }}>Every roadmap item rolls up the work under it, so the bars move when the work does.</Typography>
                <MiniChart accent={accent} />
              </Card>
              <Card variant="outlined" sx={{ p: 3 }}>
                <AutoAwesomeOutlined sx={{ color: ink(700) }} />
                <Typography component="h3" sx={{ fontWeight: 800, fontSize: 18, mt: 1 }}>
                  Updates that write themselves
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>A weekly summary of what moved, ready for you to review and send.</Typography>
                <Switch color={accent} label="Send the Monday digest" checked={digest} onChange={(e) => setDigest(e.target.checked)} />
                <Typography role="status" sx={{ fontSize: 13, color: 'text.secondary', mt: 1 }}>
                  {digest ? 'Next digest: Monday, 9:00' : 'Digest paused'}
                </Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 3 }}>
                <GroupsOutlined sx={{ color: ink(700) }} />
                <Typography component="h3" sx={{ fontWeight: 800, fontSize: 18, mt: 1 }}>
                  Built for the whole team
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>Comments, mentions and live cursors, with guests at no extra cost.</Typography>
                <Stack direction="row" aria-hidden sx={{ '& > *:not(:first-of-type)': { ml: -1 } }}>
                  {(['secondary', 'primary', 'success', 'warning', 'info'] as Accent[]).map((c, i) => (
                    <Avatar key={c} size="sm" variant="solid" color={c} sx={{ border: 2, borderColor: 'background.paper' }}>
                      {['AB', 'KO', 'LM', 'RH', 'SN'][i]}
                    </Avatar>
                  ))}
                </Stack>
              </Card>
              <Card variant="outlined" sx={{ p: 3 }}>
                <KeyboardOutlined sx={{ color: ink(700) }} />
                <Typography component="h3" sx={{ fontWeight: 800, fontSize: 18, mt: 1 }}>
                  Fast from the keyboard
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>Every action has a shortcut. Press ? anywhere to see them.</Typography>
                <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
                  {['C new item', 'G R roadmap', '/ search'].map((k) => (
                    <Box key={k} component="kbd" sx={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 600, px: 1, py: 0.5, borderRadius: '6px', border: 1, borderColor: 'divider', borderBottomWidth: 2 }}>
                      {k}
                    </Box>
                  ))}
                </Stack>
              </Card>
              <Card variant="outlined" sx={{ p: 3 }}>
                <BoltOutlined sx={{ color: ink(700) }} />
                <Typography component="h3" sx={{ fontWeight: 800, fontSize: 18, mt: 1 }}>
                  Plays well with your tools
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2 }}>Two-way sync with your issue tracker, chat and calendar.</Typography>
                <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
                  {['Issues', 'Chat', 'Calendar', 'Docs'].map((k) => (
                    <Chip key={k} size="sm" variant="outlined" color="neutral" label={k} />
                  ))}
                </Stack>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Pricing */}
        <Box component="section" id="fw-pricing" aria-labelledby="fw-pricing-title" sx={{ py: 9, scrollMarginTop: 64 }}>
          <Box sx={WRAP}>
            <SectionTitle id="fw-pricing-title" accent={accent} kicker="Pricing" title="Simple pricing that grows with you" sub="Per person, per month. Cancel any time." />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <Switch color={accent} label="Bill yearly" checked={yearly} onChange={(e) => setYearly(e.target.checked)} />
              <Chip size="sm" variant="soft" color="success" label="2 months free" />
            </Stack>
            <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: '1fr', alignItems: 'stretch', [CQ.md]: { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              {PLANS.map((p) => {
                const price = yearly ? p.yearly : p.monthly;
                return (
                  <Card
                    key={p.id}
                    variant="outlined"
                    sx={{ p: 3, display: 'flex', flexDirection: 'column', position: 'relative', ...(p.highlight && { borderWidth: 2, borderColor: colorPalette[accent][500], boxShadow: `0 30px 60px -36px ${colorPalette[accent][600]}` }) }}
                  >
                    {p.highlight && <Chip size="xs" variant="solid" color={accent} label="Most popular" sx={{ position: 'absolute', top: 16, right: 16 }} />}
                    <Typography component="h3" sx={{ fontWeight: 800, fontSize: 20 }}>
                      {p.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 0.5, minHeight: 42 }}>{p.blurb}</Typography>
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline', mt: 2 }}>
                      <Typography sx={{ fontWeight: 850, fontSize: 44, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>${price}</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{price === 0 ? 'forever' : `per person / month${yearly ? ', billed yearly' : ''}`}</Typography>
                    </Stack>
                    <Button fullWidth color={p.highlight ? accent : 'neutral'} variant={p.highlight ? 'solid' : 'outlined'} sx={{ mt: 2.5 }} aria-label={`${p.cta}: ${p.name} plan`}>
                      {p.cta}
                    </Button>
                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 3, display: 'grid', gap: 1.25 }}>
                      {p.features.map((f) => (
                        <Box component="li" key={f} sx={{ display: 'flex', gap: 1, fontSize: 14 }}>
                          <Check fontSize="small" sx={{ color: ink(700) }} />
                          {f}
                        </Box>
                      ))}
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Testimonials */}
        <Box component="section" id="fw-customers" aria-labelledby="fw-customers-title" sx={{ py: 9, scrollMarginTop: 64, bgcolor: 'background.paper', borderBlock: 1, borderColor: 'divider' }}>
          <Box sx={WRAP}>
            <SectionTitle id="fw-customers-title" accent={accent} kicker="Customers" title="Teams that stopped writing status reports" />
            <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: '1fr', [CQ.md]: { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              {TESTIMONIALS.map((t) => (
                <Card key={t.name} variant="outlined" component="figure" sx={{ m: 0, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Rating value={5} readOnly size="sm" color="warning" aria-label="Rated 5 out of 5" />
                  <Typography component="blockquote" sx={{ m: 0, mt: 1.5, fontSize: 16, lineHeight: 1.6, flex: 1 }}>
                    “{t.quote}”
                  </Typography>
                  <Stack component="figcaption" direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: 2.5 }}>
                    <Avatar variant="soft" color={t.color}>
                      {initials(t.name)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{t.name}</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>{t.role}</Typography>
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>

        {/* FAQ */}
        <Box component="section" id="fw-faq" aria-labelledby="fw-faq-title" sx={{ py: 9, scrollMarginTop: 64 }}>
          <Box sx={{ ...WRAP, maxWidth: 760 }}>
            <SectionTitle id="fw-faq-title" accent={accent} kicker="FAQ" title="Questions, answered" />
            {FAQ.map((f, i) => (
              <Accordion
                key={f.q}
                disableGutters
                elevation={0}
                expanded={faqOpen === i}
                onChange={(_, open) => setFaqOpen(open ? i : false)}
                sx={{ bgcolor: 'transparent', borderBottom: 1, borderColor: 'divider', '&::before': { display: 'none' } }}
              >
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`fw-faq-${i}`} id={`fw-faq-q-${i}`} sx={{ px: 0 }}>
                  <Typography component="h3" sx={{ fontWeight: 700, fontSize: 16 }}>
                    {f.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id={`fw-faq-${i}`} sx={{ px: 0, pt: 0, pb: 2.5 }}>
                  <Typography sx={{ color: 'text.secondary' }}>{f.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Closing CTA */}
        <Box sx={{ ...WRAP, pb: 9 }}>
          <Box sx={{ borderRadius: '28px', p: 5, textAlign: 'center', color: '#fff', background: `linear-gradient(135deg, ${colorPalette[accent][700]}, ${colorPalette.secondary[700]})`, [CQ.md]: { p: 8 } }}>
            <Typography component="h2" sx={{ fontWeight: 850, fontSize: 30, letterSpacing: '-0.03em', [CQ.md]: { fontSize: 40 } }}>
              Your next Monday update is already written
            </Typography>
            <Typography sx={{ mt: 1.5, opacity: 0.92, fontSize: 17 }}>Set up a workspace in two minutes. Bring your team when you are ready.</Typography>
            <Button size="lg" variant="solid" color="neutral" onClick={() => go('pricing')} sx={{ mt: 3.5, bgcolor: '#fff', color: colorPalette[accent][800], '&:hover': { bgcolor: colorPalette[accent][50] } }}>
              Start for free
            </Button>
          </Box>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ ...WRAP, py: 5, display: 'grid', gap: 4, gridTemplateColumns: '1fr 1fr', [CQ.md]: { gridTemplateColumns: '2fr repeat(3, 1fr)' } }}>
            <Box sx={{ gridColumn: '1 / -1', [CQ.md]: { gridColumn: 'auto' } }}>
              {brand}
              <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 1.5, maxWidth: 280 }}>Fernway is a sample product. Names, quotes and prices on this page are made up.</Typography>
            </Box>
            {[
              ['Product', ['Features', 'Pricing', 'Changelog']],
              ['Company', ['About', 'Careers', 'Contact']],
              ['Legal', ['Privacy', 'Terms']],
            ].map(([title, links]) => (
              <Box key={title as string} component="nav" aria-label={title as string}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 1 }}>{title}</Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 0.75 }}>
                  {(links as string[]).map((l) => (
                    <li key={l}>
                      <Box component="a" href="#" onClick={(e: React.MouseEvent) => e.preventDefault()} sx={{ color: 'text.secondary', fontSize: 14, textDecoration: 'none', '&:hover': { color: 'text.primary', textDecoration: 'underline' } }}>
                        {l}
                      </Box>
                    </li>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </MotionConfig>
  );
}
