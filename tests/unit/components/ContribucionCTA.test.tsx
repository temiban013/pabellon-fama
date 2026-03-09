import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../setup/test-utils';
import { ContribucionCTA } from '@/components/contribucion/ContribucionCTA';

// Mock next/link for testing
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

describe('ContribucionCTA', () => {
  it('renders the exaltado name in the heading', () => {
    render(<ContribucionCTA exaltadoId="test-id" nombreExaltado="Juan Pérez" />);
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
  });

  it('links to the correct contribuir page', () => {
    render(<ContribucionCTA exaltadoId="test-id" nombreExaltado="Juan Pérez" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/contribuir/test-id');
  });

  it('displays Spanish text', () => {
    render(<ContribucionCTA exaltadoId="test-id" nombreExaltado="Test" />);
    // The link text uses Unicode escapes in the component source
    const link = screen.getByRole('link');
    expect(link.textContent).toContain('Compartir');
    expect(screen.getByText(/Junta de Directores/)).toBeInTheDocument();
  });
});
