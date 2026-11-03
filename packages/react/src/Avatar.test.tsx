import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders avatar with initials', () => {
    render(<Avatar data-testid="avatar">JD</Avatar>);
    expect(screen.getByTestId('avatar')).toHaveTextContent('JD');
  });

  it('renders avatar with alt text', () => {
    const { container } = render(
      <Avatar alt="John Doe" data-testid="avatar">
        JD
      </Avatar>
    );
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['solid', 'soft', 'outlined', 'ghost', 'plain'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(
        <Avatar variant={variant} data-testid={`avatar-${variant}`}>
          {variant[0].toUpperCase()}
        </Avatar>
      );
      expect(screen.getByTestId(`avatar-${variant}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('accepts custom sx props', () => {
    render(
      <Avatar variant="solid" sx={{ width: 64, height: 64 }} data-testid="avatar-custom">
        AB
      </Avatar>
    );
    expect(screen.getByTestId('avatar-custom')).toBeInTheDocument();
  });

  it('gives the loading spinner an accessible name and marks the avatar busy', () => {
    const { container } = render(<Avatar loading>JD</Avatar>);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
  });

  it('uses the darker shade for outlined initials in light mode', () => {
    render(
      <Avatar variant="outlined" color="danger" data-testid="avatar-outlined">
        DA
      </Avatar>
    );
    // danger `dark` (#be123c), not `main` (#e11d48), which is below 4.5:1 on the tint
    expect(screen.getByTestId('avatar-outlined')).toHaveStyle({ color: 'rgb(190, 18, 60)' });
  });
});
