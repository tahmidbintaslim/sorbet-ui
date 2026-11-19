'use client';
// An in-text link to another page: MUI's Link styling with client-side navigation.
// A client component, so the Next link can be handed to MUI's `component` prop.
import NextLink from 'next/link';
import { Link } from '@mui/material';

export default function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link component={NextLink} href={href} sx={{ fontWeight: 600, textUnderlineOffset: '0.2em' }}>
      {children}
    </Link>
  );
}
