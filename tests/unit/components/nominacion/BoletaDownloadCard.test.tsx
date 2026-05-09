import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { render, screen } from '../../../setup/test-utils';
import { BoletaDownloadCard } from '@/components/nominacion/BoletaDownloadCard';

// Dates that put the gate into 'activo' so existing assertions about the
// download <a> element (its href / download attrs / classes) still hold.
// Without these props the BoletaDownloadButton would render a disabled
// <button> and the link-based assertions would fail.
const apertura = new Date('2026-05-15T08:00:00-04:00');
const cierre = new Date('2026-08-31T16:00:00-04:00');
const SYSTEM_TIME_IN_ACTIVO = new Date('2026-06-15T12:00:00-04:00');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(SYSTEM_TIME_IN_ACTIVO);
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

describe('BoletaDownloadCard', () => {
  it('renderiza con los props básicos', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    // Verificar que el componente se renderiza sin errores
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renderiza el H2 "Descarga la boleta oficial"', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Descarga la boleta oficial');
    expect(heading).toHaveClass('text-blue-900', 'text-2xl', 'font-bold');
  });

  it('renderiza el enlace de descarga con href y download correcto', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    const link = screen.getByRole('link', {
      name: /descargar boleta oficial/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/documentos/boleta-nominacion-pfdh-v3.pdf');
    expect(link).toHaveAttribute('download', 'boleta-nominacion-pfdh.pdf');
  });

  it('renderiza los 5 elementos de documentos requeridos', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    expect(
      screen.getByText(/Resumé \(trayectoria deportiva del candidato\)/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Semblanza/)).toBeInTheDocument();
    expect(
      screen.getByText(/Certificados: Nacimiento \+ Buena Conducta/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Artículos de prensa/)).toBeInTheDocument();
    expect(screen.getByText(/Otros documentos de apoyo/)).toBeInTheDocument();
  });

  it('renderiza la sección "Documentos requeridos"', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    expect(screen.getByText('Documentos requeridos')).toBeInTheDocument();
  });

  it('renderiza el botón de descarga con icono y texto correcto', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    const button = screen.getByRole('link', {
      name: /descargar boleta oficial/i,
    });

    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'px-6',
      'py-3',
      'rounded-lg',
      'bg-orange-500',
      'hover:bg-orange-600',
      'text-white',
      'font-semibold',
      'transition-colors'
    );
  });

  it('renderiza el sizeLabel cuando se proporciona', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
        sizeLabel="PDF · ~62 KB"
      />
    );

    expect(screen.getByText('PDF · ~62 KB')).toBeInTheDocument();
    expect(screen.getByText('PDF · ~62 KB')).toHaveClass(
      'text-sm',
      'text-gray-500'
    );
  });

  it('no renderiza el sizeLabel cuando no se proporciona', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    // Asegurarse de que no hay ningún elemento con las clases del sizeLabel
    const sizeLabels = screen.queryAllByText(/PDF · ~62 KB/);
    expect(sizeLabels).toHaveLength(0);
  });

  it('renderiza el contenedor con estilos correctos', () => {
    const { container } = render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow-lg',
      'p-8',
      'border-l-4',
      'border-orange-500',
      'max-w-3xl',
      'mx-auto'
    );
  });

  it('renderiza la descripción explicativa', () => {
    render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    expect(
      screen.getByText(
        /La boleta oficial de nominación es el formulario requerido/
      )
    ).toBeInTheDocument();
  });

  it('tiene atributo aria-hidden en los puntos decorativos', () => {
    const { container } = render(
      <BoletaDownloadCard
        pdfUrl="/documentos/boleta-nominacion-pfdh-v3.pdf"
        downloadFileName="boleta-nominacion-pfdh.pdf"
        apertura={apertura}
        cierre={cierre}
      />
    );

    const dots = container.querySelectorAll('[aria-hidden="true"]');
    // Debería haber al menos 5 puntos (uno por cada elemento de lista)
    expect(dots.length).toBeGreaterThanOrEqual(5);
  });
});
