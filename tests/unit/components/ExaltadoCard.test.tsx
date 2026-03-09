import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../setup/test-utils';
import { ExaltadoCard } from '@/components/directorio/ExaltadoCard';
import { type Exaltado } from '@/lib/types';

// Mock next/image properly for testing
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // Return a simple img element for testing
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock de utilidades
vi.mock('@/lib/utils', () => ({
  getInitials: (name: string) => {
    const words = name.split(' ');
    return words.map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },
}));

vi.mock('@/lib/constants/exaltados', () => ({
  getCategoryColor: (category: string) => 'bg-blue-100 text-blue-800',
  getSportEmoji: (sport: string) => {
    const emojis: Record<string, string> = {
      'Béisbol': '⚾',
      'Baloncesto': '🏀',
      'Voleibol': '🏐',
      'Atletismo': '🏃',
    };
    return emojis[sport] || '🏅';
  },
  getCategoryLabel: (category: string) => {
    const labels: Record<string, string> = {
      'atleta': 'Atleta',
      'entrenador': 'Entrenador',
      'equipo': 'Equipo',
    };
    return labels[category] || category;
  },
}));

describe('ExaltadoCard', () => {
  const baseExaltado: Exaltado = {
    id: '1',
    nombre: 'Juan Pérez', // Component uses nombre for initials, not nombreCompleto
    apellidos: 'Pérez',
    nombreCompleto: 'Juan Pérez',
    deporte: ['Béisbol'],
    categoria: 'atleta',
    anoExaltacion: 2020,
    biografia: 'Destacado atleta dominicano con múltiples logros internacionales.',
    logros: ['Logro 1', 'Logro 2'],
    reconocimientos: ['Reconocimiento 1'],
    estado: 'activo',
  };

  describe('Vista Grid', () => {
    it('renderiza correctamente en modo grid', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      // Verificar que el nombre se muestra
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();

      // Verificar que la biografía se muestra
      expect(screen.getByText(/Destacado atleta dominicano/)).toBeInTheDocument();

      // Verificar que el año de exaltación se muestra
      expect(screen.getByText('2020')).toBeInTheDocument();

      // Verificar que el deporte se muestra
      expect(screen.getByText('Béisbol')).toBeInTheDocument();

      // Verificar que el emoji del deporte se muestra
      expect(screen.getByText('⚾')).toBeInTheDocument();
    });

    it('muestra foto cuando está disponible', () => {
      const exaltadoConFoto = {
        ...baseExaltado,
        foto: '/images/juan-perez.jpg',
      };

      render(<ExaltadoCard exaltado={exaltadoConFoto} viewMode="grid" />);

      const img = screen.getByAltText('Foto de Juan Pérez');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/juan-perez.jpg');
    });

    it('muestra iniciales cuando no hay foto disponible', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      // Debería mostrar iniciales (JP para Juan Pérez)
      expect(screen.getByText('JP')).toBeInTheDocument();
    });

    it('muestra múltiples deportes correctamente', () => {
      const exaltadoMultiDeporte = {
        ...baseExaltado,
        deporte: ['Béisbol', 'Baloncesto', 'Voleibol'],
      };

      render(<ExaltadoCard exaltado={exaltadoMultiDeporte} viewMode="grid" />);

      expect(screen.getByText('Béisbol')).toBeInTheDocument();
      expect(screen.getByText('Baloncesto')).toBeInTheDocument();
      expect(screen.getByText('Voleibol')).toBeInTheDocument();
    });

    it('muestra apodo cuando está disponible', () => {
      const exaltadoConApodo = {
        ...baseExaltado,
        nombreCompleto: 'Juan "El Crack" Pérez',
        apodo: 'El Crack',
      };

      render(<ExaltadoCard exaltado={exaltadoConApodo} viewMode="grid" />);

      expect(screen.getByText(/Juan "El Crack" Pérez/)).toBeInTheDocument();
    });

    it('muestra categoría correctamente', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      expect(screen.getByText('Atleta')).toBeInTheDocument();
    });

    it('tiene enlace correcto al perfil del exaltado', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/directorio/1');
    });

    it('aplica clase personalizada cuando se proporciona', () => {
      const { container } = render(
        <ExaltadoCard exaltado={baseExaltado} viewMode="grid" className="custom-class" />
      );

      const card = container.querySelector('a');
      expect(card).toHaveClass('custom-class');
    });

    it('muestra mensaje "Ver detalles" en el footer', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      expect(screen.getByText(/Ver detalles/)).toBeInTheDocument();
    });
  });

  describe('Vista List', () => {
    it('renderiza correctamente en modo list', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="list" />);

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText(/Destacado atleta dominicano/)).toBeInTheDocument();
      expect(screen.getByText('2020')).toBeInTheDocument();
      expect(screen.getByText('Béisbol')).toBeInTheDocument();
    });

    it('muestra foto en avatar circular en modo list', () => {
      const exaltadoConFoto = {
        ...baseExaltado,
        foto: '/images/juan-perez.jpg',
      };

      render(<ExaltadoCard exaltado={exaltadoConFoto} viewMode="list" />);

      const img = screen.getByAltText('Foto de Juan Pérez');
      expect(img).toBeInTheDocument();
    });

    it('muestra iniciales en avatar cuando no hay foto en modo list', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="list" />);

      expect(screen.getByText('JP')).toBeInTheDocument();
    });

    it('tiene layout diferente en modo list (flex con items-center)', () => {
      const { container } = render(
        <ExaltadoCard exaltado={baseExaltado} viewMode="list" />
      );

      const card = container.querySelector('.flex.items-center');
      expect(card).toBeInTheDocument();
    });

    it('trunca el nombre en modo list si es muy largo', () => {
      const exaltadoNombreLargo = {
        ...baseExaltado,
        nombreCompleto: 'Juan Carlos Alberto Pérez González Rodríguez',
      };

      const { container } = render(
        <ExaltadoCard exaltado={exaltadoNombreLargo} viewMode="list" />
      );

      const nameElement = container.querySelector('.truncate');
      expect(nameElement).toBeInTheDocument();
    });
  });

  describe('Manejo de equipos', () => {
    it('muestra icono especial para equipos en lugar de iniciales', () => {
      const equipo: Exaltado = {
        ...baseExaltado,
        id: '100',
        nombre: 'Leones del Escogido',
        nombreCompleto: 'Leones del Escogido',
        categoria: 'equipo',
      };

      render(<ExaltadoCard exaltado={equipo} viewMode="grid" />);

      // Debe mostrar ícono de equipo (⚾) en lugar de iniciales
      expect(screen.getAllByText('⚾')).toHaveLength(2); // Emoji de deporte + ícono de equipo
    });

    it('muestra label "Equipo" para categoría equipo', () => {
      const equipo: Exaltado = {
        ...baseExaltado,
        categoria: 'equipo',
      };

      render(<ExaltadoCard exaltado={equipo} viewMode="grid" />);

      expect(screen.getByText('Equipo')).toBeInTheDocument();
    });
  });

  describe('Manejo de apodo', () => {
    it('muestra nombreCompleto que ya incluye apodo desde DirectorioClient', () => {
      const exaltadoConApodo = {
        ...baseExaltado,
        nombreCompleto: 'Pedro Jaime "El Grande" Martínez',
        apellidos: 'Martínez',
        apodo: 'El Grande',
      };

      render(<ExaltadoCard exaltado={exaltadoConApodo} viewMode="grid" />);

      expect(screen.getByText(/Pedro Jaime "El Grande" Martínez/)).toBeInTheDocument();
    });

    it('maneja apodo cuando el nombre tiene solo una parte', () => {
      const exaltadoNombreSimple = {
        ...baseExaltado,
        nombreCompleto: 'Pelé "El Rey"',
        apodo: 'El Rey',
      };

      render(<ExaltadoCard exaltado={exaltadoNombreSimple} viewMode="grid" />);

      expect(screen.getByText(/Pelé "El Rey"/)).toBeInTheDocument();
    });

    it('no muestra comillas cuando no hay apodo', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      const text = screen.getByText('Juan Pérez');
      expect(text.textContent).not.toContain('"');
    });
  });

  describe('Accesibilidad y UX', () => {
    it('tiene texto alternativo descriptivo para imágenes', () => {
      const exaltadoConFoto = {
        ...baseExaltado,
        foto: '/images/juan-perez.jpg',
      };

      render(<ExaltadoCard exaltado={exaltadoConFoto} viewMode="grid" />);

      const img = screen.getByAltText('Foto de Juan Pérez');
      expect(img).toBeInTheDocument();
    });

    it('el card completo es clickable como enlace', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/directorio/1');
    });

    it('aplica clases de hover correctamente en modo grid', () => {
      const { container } = render(
        <ExaltadoCard exaltado={baseExaltado} viewMode="grid" />
      );

      const card = container.querySelector('a');
      expect(card).toHaveClass('hover:scale-105');
      expect(card).toHaveClass('hover:shadow-pabellon-lg');
    });

    it('aplica clases de hover correctamente en modo list', () => {
      const { container } = render(
        <ExaltadoCard exaltado={baseExaltado} viewMode="list" />
      );

      const card = container.querySelector('a');
      expect(card).toHaveClass('hover:shadow-pabellon-lg');
      expect(card).toHaveClass('hover:scale-[1.02]');
    });
  });

  describe('Biografía', () => {
    it('trunca biografía larga con line-clamp en modo grid', () => {
      const exaltadoBiografiaLarga = {
        ...baseExaltado,
        biografia: 'Texto muy largo '.repeat(50),
      };

      const { container } = render(
        <ExaltadoCard exaltado={exaltadoBiografiaLarga} viewMode="grid" />
      );

      const bioElement = container.querySelector('.line-clamp-3');
      expect(bioElement).toBeInTheDocument();
    });

    it('trunca biografía larga con line-clamp en modo list', () => {
      const exaltadoBiografiaLarga = {
        ...baseExaltado,
        biografia: 'Texto muy largo '.repeat(50),
      };

      const { container } = render(
        <ExaltadoCard exaltado={exaltadoBiografiaLarga} viewMode="list" />
      );

      const bioElement = container.querySelector('.line-clamp-2');
      expect(bioElement).toBeInTheDocument();
    });
  });

  describe('Renderizado condicional', () => {
    it('renderiza todos los elementos esperados en modo grid', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="grid" />);

      // Verificar presencia de elementos clave
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Atleta')).toBeInTheDocument();
      expect(screen.getByText('Béisbol')).toBeInTheDocument();
      expect(screen.getByText('2020')).toBeInTheDocument();
      expect(screen.getByText(/Ver detalles/)).toBeInTheDocument();
    });

    it('renderiza todos los elementos esperados en modo list', () => {
      render(<ExaltadoCard exaltado={baseExaltado} viewMode="list" />);

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Atleta')).toBeInTheDocument();
      expect(screen.getByText('Béisbol')).toBeInTheDocument();
      expect(screen.getByText('2020')).toBeInTheDocument();
    });
  });

  describe('Memoization', () => {
    it('es un componente memoizado', () => {
      // Verificar que el componente exportado sea un componente memo
      // React.memo wraps the component, so we check for the $$typeof symbol
      expect(ExaltadoCard.$$typeof).toBeDefined();
    });
  });
});
