import { CardContent, CardHeader } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders card', () => {
    render(<Card data-testid="card">Test Card</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders card with header and content', () => {
    render(
      <Card>
        <CardHeader title="Test Title" />
        <CardContent>Test Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Card variant={variant} data-testid={`card-${variant}`} />);
      expect(screen.getByTestId(`card-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('accepts custom className and sx props', () => {
    render(<Card sx={{ maxWidth: 400 }} className="custom-class" data-testid="card-with-props" />);
    expect(screen.getByTestId('card-with-props')).toHaveClass('custom-class');
  });

  it('gives the loading spinner an accessible name and marks the card busy', () => {
    render(<Card loading data-testid="card-loading" />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByTestId('card-loading')).toHaveAttribute('aria-busy', 'true');
  });
});
