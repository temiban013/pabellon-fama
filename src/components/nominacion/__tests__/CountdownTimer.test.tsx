/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CountdownTimer } from '../CountdownTimer';

// Shared props: apertura 2026-05-15, cierre 2026-08-31, ceremonia 2026-11-08
const apertura = new Date('2026-05-15T00:00:00.000Z');
const cierre = new Date('2026-08-31T00:00:00.000Z');
const ceremonia = new Date('2026-11-08T00:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe('CountdownTimer', () => {
  it('pre-apertura: muestra "abre en" cuando now < apertura', () => {
    vi.setSystemTime(new Date('2026-04-01T00:00:00.000Z'));
    render(<CountdownTimer apertura={apertura} cierre={cierre} ceremonia={ceremonia} />);
    expect(screen.getByText(/abre en/i)).toBeInTheDocument();
  });

  it('activo: muestra "Cierre" cuando apertura <= now < cierre', () => {
    vi.setSystemTime(new Date('2026-06-15T00:00:00.000Z'));
    render(<CountdownTimer apertura={apertura} cierre={cierre} ceremonia={ceremonia} />);
    expect(screen.getByText(/Cierre/)).toBeInTheDocument();
  });

  it('post-cierre: muestra "Ceremonia" cuando cierre <= now < ceremonia', () => {
    vi.setSystemTime(new Date('2026-09-15T00:00:00.000Z'));
    render(<CountdownTimer apertura={apertura} cierre={cierre} ceremonia={ceremonia} />);
    expect(screen.getByText(/Ceremonia/)).toBeInTheDocument();
  });

  it('post-ceremonia: muestra el mensaje estático "ya se llevó a cabo"', () => {
    vi.setSystemTime(new Date('2026-12-01T00:00:00.000Z'));
    render(<CountdownTimer apertura={apertura} cierre={cierre} ceremonia={ceremonia} />);
    expect(screen.getByText(/ya se llevó a cabo/i)).toBeInTheDocument();
  });

  it('interval cleanup: no lanza errores al desmontar y avanzar el tiempo', () => {
    vi.setSystemTime(new Date('2026-04-01T00:00:00.000Z'));
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(
      <CountdownTimer apertura={apertura} cierre={cierre} ceremonia={ceremonia} />
    );
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    // Advancing time after unmount must not throw
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    clearIntervalSpy.mockRestore();
  });
});
