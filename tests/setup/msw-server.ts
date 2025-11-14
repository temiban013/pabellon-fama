import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

/**
 * Servidor MSW para interceptar y mockear peticiones HTTP durante las pruebas
 */
export const server = setupServer(...handlers);
