/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { BoletaDownloadButton } from '../BoletaDownloadButton';

// Shared dates: apertura 2026-05-15 08:00 AST, cierre 2026-08-31 16:00 AST
const apertura = new Date('2026-05-15T08:00:00-04:00');
const cierre = new Date('2026-08-31T16:00:00-04:00');

const props = {
  pdfUrl: '/documentos/boleta-nominacion-pfdh-v3.pdf',
  downloadFileName: 'boleta-nominacion-pfdh.pdf',
  apertura,
  cierre,
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe('BoletaDownloadButton', () => {
  it('pre-apertura: renderiza un botón deshabilitado con mensaje de apertura cuando now < apertura', () => {
    vi.setSystemTime(new Date('2026-05-09T12:00:00-04:00'));
    render(<BoletaDownloadButton {...props} />);

    const button = screen.getByRole('button', { name: /descargar boleta oficial/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');

    expect(screen.getByText(/abre el/i)).toBeInTheDocument();
    expect(screen.getByText(/hora de Puerto Rico/i)).toBeInTheDocument();

    // No debe existir un enlace activo de descarga
    expect(
      screen.queryByRole('link', { name: /descargar boleta oficial/i })
    ).not.toBeInTheDocument();
  });

  it('activo: renderiza un enlace <a download> cuando apertura <= now < cierre', () => {
    vi.setSystemTime(new Date('2026-06-15T12:00:00-04:00'));
    render(<BoletaDownloadButton {...props} />);

    const link = screen.getByRole('link', { name: /descargar boleta oficial/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/documentos/boleta-nominacion-pfdh-v3.pdf');
    expect(link).toHaveAttribute('download', 'boleta-nominacion-pfdh.pdf');

    // No debe haber un botón deshabilitado
    expect(
      screen.queryByRole('button', { name: /descargar boleta oficial/i })
    ).not.toBeInTheDocument();
  });

  it('post-cierre: renderiza un botón deshabilitado con mensaje de cierre cuando now >= cierre', () => {
    vi.setSystemTime(new Date('2026-09-15T12:00:00-04:00'));
    render(<BoletaDownloadButton {...props} />);

    const button = screen.getByRole('button', { name: /descargar boleta oficial/i });
    expect(button).toBeDisabled();

    expect(screen.getByText(/cerró el/i)).toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: /descargar boleta oficial/i })
    ).not.toBeInTheDocument();
  });

  it('transición: el botón pasa de deshabilitado a activo cuando el reloj cruza apertura', () => {
    // 2 segundos antes de apertura
    vi.setSystemTime(new Date('2026-05-15T07:59:58-04:00'));
    render(<BoletaDownloadButton {...props} />);

    // Estado inicial: pre-apertura
    expect(
      screen.getByRole('button', { name: /descargar boleta oficial/i })
    ).toBeDisabled();
    expect(
      screen.queryByRole('link', { name: /descargar boleta oficial/i })
    ).not.toBeInTheDocument();

    // Avanza 5 segundos (cruza apertura). El intervalo de 1s dispara setNow,
    // que actualiza el estado y re-renderiza con la nueva rama 'activo'.
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.queryByRole('button', { name: /descargar boleta oficial/i })
    ).not.toBeInTheDocument();
    const link = screen.getByRole('link', { name: /descargar boleta oficial/i });
    expect(link).toHaveAttribute('href', '/documentos/boleta-nominacion-pfdh-v3.pdf');
    expect(link).toHaveAttribute('download', 'boleta-nominacion-pfdh.pdf');
  });

  it('interval cleanup: clearInterval se llama al desmontar y avanzar el tiempo no lanza errores', () => {
    vi.setSystemTime(new Date('2026-05-09T12:00:00-04:00'));
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(<BoletaDownloadButton {...props} />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    clearIntervalSpy.mockRestore();
  });
});
