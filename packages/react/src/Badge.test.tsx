import { Avatar } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders badge with content', () => {
    render(
      <Badge badgeContent={5} data-testid="badge">
        <Avatar>JD</Avatar>
      </Badge>
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders badge with children', () => {
    render(
      <Badge badgeContent={3} data-testid="badge">
        <Avatar>Test</Avatar>
      </Badge>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Badge variant={variant} badgeContent={1} data-testid={`badge-${variant}`}>
          <Avatar>AB</Avatar>
        </Badge>
      );
      expect(screen.getByTestId(`badge-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders zero badge content', () => {
    render(
      <Badge badgeContent={0} showZero data-testid="badge-zero">
        <Avatar>JD</Avatar>
      </Badge>
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('gives the loading spinner an accessible name', () => {
    render(
      <Badge loading badgeContent={4}>
        <Avatar>JD</Avatar>
      </Badge>
    );
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
  });
});
