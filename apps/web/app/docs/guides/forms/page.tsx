import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import CodeBlock from '@/components/CodeBlock';
import ExampleViewer from '@/components/docs/ExampleViewer';
import GuidePage, { H3, Section, type TocItem } from '@/components/docs/GuidePage';
import { Callout, NextLinks } from '../../_shared/parts';
import A from '../../_shared/A';
import { SignUpForm } from '../demos';

export const metadata: Metadata = pageMeta({
  title: 'Forms',
  description: 'Labels, helper text, validation and submission with Sorbet form controls.',
  path: '/docs/guides/forms',
});

const toc: TocItem[] = [
  { id: 'example', label: 'A complete sign-up form', depth: 2 },
  { id: 'signup-example', label: 'Live example', depth: 3 },
  { id: 'labels', label: 'Labels', depth: 2 },
  { id: 'helper-and-error', label: 'Helper and error text', depth: 2 },
  { id: 'select-and-checkbox', label: 'Select and Checkbox', depth: 3 },
  { id: 'required', label: 'Required and optional', depth: 2 },
  { id: 'validate-on-submit', label: 'Validate on submit', depth: 2 },
  { id: 'error-summary', label: 'The error summary', depth: 2 },
  { id: 'checklist', label: 'Checklist', depth: 2 },
  { id: 'next', label: 'Where to go next', depth: 2 },
];

const SOURCE = `'use client';
import * as React from 'react';
import { AlertTitle, Box, FormHelperText, Link, Stack } from '@mui/material';
import { Alert, Button, Checkbox, MenuItem, Select, Switch, TextField } from '@sorbet-ui/react';

type Values = { name: string; email: string; password: string; role: string; news: boolean; terms: boolean };
type Field = 'name' | 'email' | 'password' | 'role' | 'terms';
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { name: '', email: '', password: '', role: '', news: false, terms: false };
const ORDER: Field[] = ['name', 'email', 'password', 'role', 'terms'];
const ID: Record<Field, string> = {
  name: 'signup-name', email: 'signup-email', password: 'signup-password', role: 'signup-role', terms: 'signup-terms',
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Enter your name';
  if (!v.email.trim()) e.email = 'Enter your email address';
  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email)) e.email = 'Enter an email address like sam@example.com';
  if (v.password.length < 8) e.password = 'Use at least 8 characters for your password';
  if (!v.role) e.role = 'Choose your role';
  if (!v.terms) e.terms = 'Agree to the terms to create an account';
  return e;
}

export default function SignUpForm() {
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
    // Once submitted, clear errors as they get fixed; never add new ones early.
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
    setDone(\`Account created for \${values.name.trim()}. (Demo only: nothing was sent.)\`);
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
    <Box component="form" noValidate onSubmit={onSubmit} aria-label="Create your account">
      {list.length > 0 && (
        <Alert ref={summaryRef} tabIndex={-1} color="danger" variant="soft">
          <AlertTitle>{\`Fix \${list.length} field\${list.length === 1 ? '' : 's'} to continue\`}</AlertTitle>
          <ul>
            {list.map((f) => (
              <li key={f}>
                <Link href={\`#\${ID[f]}\`} onClick={goTo(f)} color="inherit">{errors[f]}</Link>
              </li>
            ))}
          </ul>
        </Alert>
      )}
      {done && <Alert color="success" role="status">{done}</Alert>}

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
              'aria-describedby': err('role') ? \`\${ID.role}-error\` : undefined,
            } as React.HTMLAttributes<HTMLDivElement>}
          >
            <MenuItem value="design">Design</MenuItem>
            <MenuItem value="engineering">Engineering</MenuItem>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="other">Something else</MenuItem>
          </Select>
          {errors.role && <FormHelperText id={\`\${ID.role}-error\`} error>{errors.role}</FormHelperText>}
        </Box>
        <Switch label="Email me product news (optional)" checked={values.news} onChange={(_e, v) => set('news', v)} />
        <Box>
          <Checkbox
            id={ID.terms}
            label="I agree to the terms of service"
            checked={values.terms}
            onChange={(_e, v) => set('terms', v)}
            aria-describedby={err('terms') ? \`\${ID.terms}-error\` : undefined}
            slotProps={{ input: { 'aria-required': true, 'aria-invalid': err('terms') } as React.InputHTMLAttributes<HTMLInputElement> }}
          />
          {errors.terms && <FormHelperText id={\`\${ID.terms}-error\`} error>{errors.terms}</FormHelperText>}
        </Box>
        <Button type="submit" size="lg" shape="block">Create account</Button>
      </Stack>
    </Box>
  );
}`;

const LABEL = `// A visible label: always the first choice.
<TextField label="Email" />

// Controls with a label prop render it next to the control.
<Checkbox label="Remember me" />
<Switch label="Dark mode" />

// No room for a visible label (a search box in a toolbar): name it anyway.
<TextField aria-label="Search projects" placeholder="Search" />`;

const HELPER = `<TextField
  id="handle"
  label="Username"
  error={Boolean(error)}
  // The hint, replaced by the error when there is one.
  helperText={error ?? 'Letters, numbers and dashes.'}
/>`;

const REQUIRED = `// MUI's required: an asterisk on the label (hidden from screen readers)
// and the native required attribute on the input.
<TextField label="Email" required />

// Or mark the optional fields instead, and say so once at the top.
<TextField label="Phone (optional)" />`;

const SELECT_HELPER = `<Select
  label="Role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  error={Boolean(roleError)}
  // The combobox is the element screen readers focus: describe it there.
  SelectDisplayProps={{
    'aria-invalid': Boolean(roleError),
    'aria-describedby': roleError ? 'role-error' : undefined,
  } as React.HTMLAttributes<HTMLDivElement>}
>
  …
</Select>
{roleError && <FormHelperText id="role-error" error>{roleError}</FormHelperText>}`;

export default function Page() {
  return (
    <GuidePage href="/docs/guides/forms" toc={toc} doodle="cone" aside="fill it in">
      <p>
        Sorbet&apos;s form controls are MUI form controls, so labels, helper text and error states work the MUI way.
        This guide builds a complete sign-up form and shows the patterns that make forms easy to fill in, including
        with a keyboard or a screen reader.
      </p>

      <Section id="example" title="A complete sign-up form">
        <p>
          Submit it empty to see the error summary, follow a link in it to jump to the field, then fix the fields and
          submit again. Nothing is sent anywhere.
        </p>
        <ExampleViewer id="signup-example" title="Live example" description="TextField, Select, Switch, Checkbox and Button, validated on submit." source={SOURCE} file="SignUpForm.tsx">
          <SignUpForm />
        </ExampleViewer>
      </Section>

      <Section id="labels" title="Labels">
        <p>
          Every control needs a name that is announced when it is focused. Give it a visible label whenever you can: the
          placeholder disappears as soon as someone types, so it is not a label.
        </p>
        <CodeBlock code={LABEL} label="Labels" />
        <p>
          <code>TextField</code>, <code>Select</code>, <code>Checkbox</code> and <code>Switch</code> forward{' '}
          <code>aria-label</code> to the element that takes focus (the input or the combobox), not to a wrapper, so the
          name reaches assistive tech. The <code>Select</code> label is linked to its combobox for you.
        </p>
      </Section>

      <Section id="helper-and-error" title="Helper and error text">
        <p>
          On <code>TextField</code>, <code>helperText</code> renders under the field and, when you pass an{' '}
          <code>id</code>, MUI links it with <code>aria-describedby</code>. <code>error</code> turns the field red and
          sets <code>aria-invalid</code> on the input.
        </p>
        <CodeBlock code={HELPER} label="Helper and error text" />
        <ul>
          <li>Say what to do, not what went wrong: &ldquo;Enter an email address like sam@example.com&rdquo;.</li>
          <li>Keep the hint visible until there is an error, then replace it with the error.</li>
          <li>Never rely on color alone: the message text carries the meaning.</li>
        </ul>
        <H3 id="select-and-checkbox">Select and Checkbox</H3>
        <p>
          <code>Select</code> has a <code>helperText</code> prop for hints, but it is not linked to the combobox. For an
          error that must be announced, render a <code>FormHelperText</code> with an id and point the combobox at it.{' '}
          <code>Checkbox</code> has no helper text of its own: render one the same way and pass{' '}
          <code>aria-describedby</code>, which the Checkbox forwards to its input.
        </p>
        <CodeBlock code={SELECT_HELPER} label="An announced Select error" />
      </Section>

      <Section id="required" title="Required and optional">
        <CodeBlock code={REQUIRED} label="Required fields" />
        <p>
          Pick one convention per form. The example above marks optional fields and sets <code>aria-required</code> on
          the rest, because a <code>Select</code> or <code>Checkbox</code> does not show MUI&apos;s asterisk.
        </p>
      </Section>

      <Section id="validate-on-submit" title="Validate on submit">
        <ul>
          <li>
            <strong>
              Add <code>noValidate</code> to the form
            </strong>{' '}
            so the browser&apos;s own bubbles do not compete with your messages, then check everything in{' '}
            <code>onSubmit</code>.
          </li>
          <li>
            <strong>Do not show errors while someone is still typing</strong> a field for the first time. After a
            failed submit, clear each error as soon as it is fixed.
          </li>
          <li>
            <strong>Keep what they typed.</strong> Never clear a field because it is invalid.
          </li>
          <li>
            <strong>Use the right input type and autocomplete</strong> (<code>type=&quot;email&quot;</code>,{' '}
            <code>autoComplete=&quot;new-password&quot;</code>) so phones show the right keyboard and password
            managers help.
          </li>
          <li>
            <strong>Validate again on the server.</strong> Client checks are for people, not for security.
          </li>
        </ul>
        <Callout title="Using a form library?">
          The same props work with React Hook Form, Formik or a server action: pass the library&apos;s value,{' '}
          <code>onChange</code> and error message into <code>value</code>, <code>onChange</code>, <code>error</code>{' '}
          and <code>helperText</code>.
        </Callout>
      </Section>

      <Section id="error-summary" title="The error summary">
        <p>
          When a submit fails, list every error at the top of the form and move focus there. A screen reader user hears
          how many fields need fixing; everyone gets a link to each one.
        </p>
        <ul>
          <li>
            Render the summary as an <code>Alert</code> with <code>tabIndex=&#123;-1&#125;</code> so it can take focus,
            and focus it after the submit.
          </li>
          <li>Start with the count: &ldquo;Fix 3 fields to continue&rdquo;.</li>
          <li>
            Use the same text as the field&apos;s own error, and make each line a link that focuses that field (the{' '}
            <code>id</code> of the input, or of the combobox for a <code>Select</code>).
          </li>
          <li>Remove the summary once the form submits, and confirm success with a status message.</li>
        </ul>
      </Section>

      <Section id="checklist" title="Checklist">
        <ul>
          <li>Every control has a visible label, or an <code>aria-label</code> when it truly cannot.</li>
          <li>Hints and errors are linked to their control.</li>
          <li>Required or optional is clear before anyone submits.</li>
          <li>Errors appear on submit, say how to fix them, and are summarized with links.</li>
          <li>The whole form works with the keyboard alone, top to bottom.</li>
        </ul>
        <p>
          More on what the components do for you on <A href="/docs/guides/accessibility">Accessibility</A>.
        </p>
      </Section>

      <Section id="next" title="Where to go next">
        <NextLinks
          items={[
            { href: '/docs/components/text-field', title: 'TextField', note: 'Every prop, with examples.' },
            { href: '/docs/guides/accessibility', title: 'Accessibility', note: 'What the components handle for you.' },
          ]}
        />
      </Section>
    </GuidePage>
  );
}
