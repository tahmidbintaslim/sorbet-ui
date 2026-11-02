'use client';
// Client wrapper so server pages can render a MUI Button as a Next.js link
// (the `component` prop is a function and cannot cross the server boundary).
import NextLink from 'next/link';
import { Button, type ButtonProps } from '@mui/material';

export default function LinkButton(props: Omit<ButtonProps<typeof NextLink>, 'component'>) {
  return <Button component={NextLink} {...props} />;
}
