import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Wrapper personalizado para pruebas que incluye providers necesarios
 */
function AllProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Función de render personalizada que incluye todos los providers
 * Usar esta función en lugar de render de @testing-library/react
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-exportar todo de testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Sobrescribir render con nuestra versión personalizada
export { customRender as render };
