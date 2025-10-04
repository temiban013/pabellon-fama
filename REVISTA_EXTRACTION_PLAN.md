# 📚 PLAN MAESTRO: Sistema de Extracción y Distribución de Contenido de Revistas PFDH

> **Objetivo:** Digitalizar 8 revistas históricas y distribuir su contenido estructurado a través de todo el sitio web del Pabellón de la Fama del Deporte Humacaeño.

---

## 🎯 VISIÓN GENERAL

Las revistas PFDH contienen la **fuente primaria** de información histórica del proyecto:
- Biografías detalladas de 83 exaltados
- Fotos históricas del deporte humacaeño
- Historia del Pabellón y sus ceremonias
- Mensajes oficiales y documentos históricos
- Colaboradores y patrocinadores

Este contenido NO solo vivirá en un "viewer de revistas", sino que se **extraerá, estructurará y distribuirá** por todas las páginas del sitio:

```
REVISTAS (PDF)
    ↓ [Extracción]
    ↓
DATOS ESTRUCTURADOS
    ↓ [Distribución]
    ↓
┌───────────────┬──────────────┬──────────────┬──────────────┐
│  /directorio  │  /historia   │  /junta      │  /revistas   │
│  Biografías   │  Fotos       │  Mensajes    │  Viewer      │
│  Logros       │  Timeline    │  Discursos   │  Descargas   │
└───────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 📊 INVENTARIO DE REVISTAS

| # | Año | Fecha Ceremonia | Páginas | Exaltados | Índice | Offset | Estado |
|---|-----|----------------|---------|-----------|--------|--------|--------|
| 01 | 2000 | 20 agosto 2000 | 52 | 28 | Pág 4 | 0 | ⏳ Pendiente |
| 02 | 2002 | 3 nov 2002 | 43 | 8 | Pág 4 | 0 | ⏳ Pendiente |
| 03 | 2004 | - | 40 | 8 | Pág 4 | 0 | ⏳ Pendiente |
| 04 | 2006 | - | 36 | 10 | Pág 4 | 0 | ⏳ Pendiente |
| 05 | 2007 | - | 36 | 9 | Pág 3 | 0 | ⏳ Pendiente |
| 06 | 2008 | - | 36 | 5 | Pág 4 | -1 | ⏳ Pendiente |
| 07 | 2009 | - | 36 | 10 | Pág 3 | -2 | ⏳ Pendiente |
| 08 | 2010 | - | 28 | 5 | Pág 3 | 0 | ⏳ Pendiente |
| **TOTAL** | | | **307** | **83** | | | **0/8** |

**Digitalización:** ✅ Completa (150MB, 3h 46min)
**Método:** Google Drive (Rev01) + Adobe Scan (Rev02-08)
**OCR:** Primeras 5 páginas (incluye índices)

---

## 🗂️ CONTENIDO A EXTRAER POR REVISTA

### **1. Exaltados (CRÍTICO - Prioridad 1)**

**Destino:** `/directorio/[id]`

**Datos a extraer:**
```typescript
{
  // Identidad
  nombre: string;
  apodo?: string;
  apellidos: string;

  // Clasificación
  categoria: 'ATLETA' | 'PROPULSOR' | 'DIRIGENTE' | 'COMUNICADOR' | 'PÓSTUMO';
  deportes: string[];
  anoExaltacion: number;

  // Ubicación en revista
  revistaNumero: number;
  paginaInicio: number;
  paginaFin: number;

  // Contenido
  contenido: {
    biografia: string;        // Texto completo de la biografía
    logros: string[];        // Lista de logros principales
    estadisticas?: {         // Datos cuantitativos
      añoInicio?: number;
      añoRetiro?: number;
      especialidad?: string;
      equipos?: string[];
      torneos?: string[];
    };
    reconocimientos?: string[];  // Premios, medallas
    fotos?: string[];           // URLs de fotos del exaltado
    citas?: string[];           // Testimonios o citas
  };
}
```

**Método de extracción:**
1. Índice OCR → Lista de nombres + páginas
2. Manual: Abrir PDF en página exacta
3. Copiar biografía completa (1-2 párrafos clave)
4. Extraer logros principales
5. Identificar estadísticas/números
6. Guardar en `revXX-exaltados.ts`

**Tiempo estimado:** 2 min/exaltado × 83 = ~3 horas

---

### **2. Fotos Históricas (ALTO - Prioridad 2)**

**Destino:** `/historia`, `/galeria`, `/directorio/[id]`

**Ubicación en revistas:**
- Secciones "Fotos Históricas" (típicamente páginas 28-40)
- Fotos dentro de biografías individuales
- Portadas de equipos/eventos

**Datos a extraer:**
```typescript
{
  id: string;
  titulo: string;
  descripcion?: string;
  año?: number;
  categoria: 'equipo' | 'evento' | 'persona' | 'instalacion' | 'ceremonia';
  revistaOrigen: number;
  paginaOrigen: number;
  personasEnFoto?: string[];  // IDs de exaltados
  deporteRelacionado?: string;
  archivoUrl: string;         // /images/historicas/revXX-pYY-foto01.jpg
}
```

**Método de extracción:**
1. Identificar páginas con fotos (del índice)
2. Extraer imágenes del PDF:
   ```bash
   pdfimages -j -f 28 -l 40 revista-01.pdf /tmp/rev01-fotos/
   ```
3. Catalogar cada foto manualmente
4. Procesar/optimizar para web
5. Vincular con exaltados cuando aplique

**Tiempo estimado:** 5 min/foto × ~50 fotos/revista = ~4 horas total

---

### **3. Historia del Pabellón (MEDIO - Prioridad 3)**

**Destino:** `/historia`

**Ubicación:** Típicamente páginas 4-7 en cada revista

**Datos a extraer:**
```typescript
{
  revistaNumero: number;
  seccion: 'historia' | 'origen' | 'mision' | 'vision';
  contenido: string;        // Texto completo
  añoReferenciado?: number;
  fotosRelacionadas?: string[];
}
```

**Agregación:** Combinar información de todas las revistas en timeline histórico

---

### **4. Mensajes Oficiales (MEDIO - Prioridad 3)**

**Destino:** `/historia`, `/junta`

**Tipos de mensajes:**
- Mensaje del Presidente del Pabellón
- Mensaje del Alcalde de Humacao
- Mensaje del Presidente de Honor
- Dedicatorias especiales

**Datos a extraer:**
```typescript
{
  tipo: 'presidente' | 'alcalde' | 'honor' | 'dedicatoria';
  autor: {
    nombre: string;
    cargo: string;
  };
  año: number;
  revistaNumero: number;
  contenido: string;
  citas?: string[];  // Frases destacadas
}
```

---

### **5. Junta Directiva (BAJO - Prioridad 4)**

**Destino:** `/junta`

**Datos a extraer:**
```typescript
{
  año: number;
  revistaNumero: number;
  miembros: Array<{
    nombre: string;
    cargo: string;
    periodo?: string;
  }>;
}
```

**Agregación:** Crear timeline de juntas directivas

---

### **6. Cuadros de Honor (ALTO - Prioridad 2)**

**Destino:** `/historia`, `/directorio`

**Ubicación:** Secciones "Cuadro de Honor [año]"

**Datos a extraer:**
```typescript
{
  año: number;
  categoria: string;
  equipoNombre?: string;
  logro: string;
  deporteRelacionado: string;
  integrantes?: string[];
  revistaNumero: number;
  paginaOrigen: number;
}
```

**Ejemplo:** "Cuadro de Honor 2000 - Equipo Humacao Campeón AA de 1951"

---

### **7. Artículos Deportivos (BAJO - Prioridad 4)**

**Destino:** `/blog` (futuro), `/historia`

**Ejemplos:**
- "Reseña: Humacao Campeón AA de 1951"
- "Opinión: Juegos Centroamericanos"
- "Homenaje: Equipo de béisbol AA de 1951"

**Datos a extraer:**
```typescript
{
  titulo: string;
  autor?: string;
  tipo: 'reseña' | 'opinion' | 'homenaje' | 'historia';
  contenido: string;
  deporteRelacionado?: string;
  añoReferenciado?: number;
  revistaNumero: number;
}
```

---

### **8. Metadata de Ceremonias (MEDIO - Prioridad 3)**

**Destino:** `/historia`, componente Timeline

**Datos a extraer:**
```typescript
{
  exaltacionNumero: number;
  fecha: string;  // YYYY-MM-DD
  lugar?: string;
  maestroCeremonia?: string;
  invocacion?: string;
  programaCompleto?: {
    bienvenida: string;
    himnos: string;
    mensajes: string[];
    develacionSerigrafias: string[];
    interludios: string[];
  };
  asistentesClave?: string[];
}
```

---

## 🔄 ESTRATEGIA DE SPRINTS ITERATIVOS

### **Enfoque: 1 Revista por Sprint**

**Ventajas:**
- ✅ Valor incremental (deploy después de cada sprint)
- ✅ Eficiencia de tokens (15-25K por sesión)
- ✅ Refinamiento continuo de scripts
- ✅ Motivación (ganancias rápidas)
- ✅ Bajo riesgo (validación continua)

---

## 📋 SPRINT 0: Foundation (Setup único)

**Duración:** 1-2 horas
**Objetivo:** Infraestructura reutilizable

### **Tareas:**

#### **0.1 Estructura de Proyecto**
```bash
pabellon-fama/
├── src/
│   ├── lib/
│   │   └── types/
│   │       ├── revista.ts           # Types principales
│   │       ├── exaltado.ts
│   │       ├── foto-historica.ts
│   │       └── mensaje.ts
│   │
│   ├── data/
│   │   ├── revistas/
│   │   │   ├── index.ts             # Metadata de 8 revistas
│   │   │   ├── rev01-exaltados.ts
│   │   │   ├── rev01-fotos.ts
│   │   │   └── rev01-mensajes.ts
│   │   │
│   │   ├── fotos-historicas/
│   │   │   └── index.ts             # Agregado de todas las revistas
│   │   │
│   │   └── cronologia/
│   │       └── ceremonias.ts        # Timeline de exaltaciones
│   │
│   ├── app/
│   │   ├── directorio/
│   │   │   └── [id]/page.tsx        # Perfil de exaltado
│   │   ├── historia/
│   │   │   └── page.tsx             # Timeline + fotos
│   │   ├── junta/
│   │   │   └── page.tsx             # Juntas directivas
│   │   └── revistas/
│   │       ├── page.tsx             # Grid de revistas
│   │       └── [numero]/page.tsx    # Viewer individual
│   │
│   └── components/
│       ├── directorio/
│       │   ├── ExaltadoProfile.tsx
│       │   └── BiografiaSection.tsx
│       ├── historia/
│       │   ├── Timeline.tsx
│       │   ├── FotoHistoricaCard.tsx
│       │   └── GaleriaHistorica.tsx
│       └── revistas/
│           ├── RevistaViewer.tsx
│           ├── RevistaCard.tsx
│           └── RevistaNavigation.tsx
│
├── public/
│   ├── revistas/
│   │   ├── completas/               # PDFs optimizados
│   │   └── portadas/                # JPG covers
│   │
│   └── images/
│       └── historicas/              # Fotos extraídas
│           ├── rev01/
│           ├── rev02/
│           └── ...
│
└── scripts/
    └── extraction/
        ├── extract-indice.sh        # OCR del índice
        ├── parse-indice.js          # Parse → JSON
        ├── optimize-pdf.sh          # Ghostscript optimization
        ├── extract-images.sh        # pdfimages
        ├── validate.js              # Validación contra índice
        └── generate-metadata.js     # Auto-generar metadata
```

#### **0.2 TypeScript Types**
```typescript
// src/lib/types/revista.ts
export interface RevistaMetadata {
  numero: number;
  year: number;
  titulo: string;
  fechaCeremonia: string;
  descripcion: string;
  pdfUrl: string;
  portadaUrl: string;
  totalPaginas: number;
  exaltadosCount: number;
  categorias: {
    deportistas: number;
    propulsores: number;
    postumos: number;
    comunicadores?: number;
  };
  rangoPaginas: {
    biografias: [number, number];
    fotosHistoricas: [number, number];
    mensajes?: [number, number];
  };
}

export interface ExaltadoRevista {
  id: string;
  nombre: string;
  apodo?: string;
  apellidos: string;
  categoria: 'ATLETA' | 'PROPULSOR' | 'DIRIGENTE' | 'COMUNICADOR' | 'PÓSTUMO';
  deportes: string[];
  anoExaltacion: number;
  revistaNumero: number;
  paginaInicio: number;
  paginaFin: number;
  contenido: {
    biografia: string;
    logros: string[];
    estadisticas?: Record<string, any>;
    reconocimientos?: string[];
    fotos?: string[];
    citas?: string[];
  };
}

export interface FotoHistorica {
  id: string;
  titulo: string;
  descripcion?: string;
  año?: number;
  categoria: 'equipo' | 'evento' | 'persona' | 'instalacion' | 'ceremonia';
  revistaOrigen: number;
  paginaOrigen: number;
  personasEnFoto?: string[];
  deporteRelacionado?: string;
  archivoUrl: string;
}

export interface MensajeOficial {
  tipo: 'presidente' | 'alcalde' | 'honor' | 'dedicatoria';
  autor: {
    nombre: string;
    cargo: string;
  };
  año: number;
  revistaNumero: number;
  contenido: string;
  citas?: string[];
}
```

#### **0.3 Scripts Base**
```bash
# scripts/extraction/extract-indice.sh
#!/bin/bash
REVISTA_NUM=$1
INDEX_PAGE=${2:-4}  # Default pág 4, override para Rev05,07,08

pdftotext -f $INDEX_PAGE -l $INDEX_PAGE \
  ~/Downloads/PFDH-Rev${REVISTA_NUM}.pdf \
  ./rev${REVISTA_NUM}-indice.txt

echo "✅ Índice extraído: rev${REVISTA_NUM}-indice.txt"
```

```bash
# scripts/extraction/optimize-pdf.sh
#!/bin/bash
REVISTA_NUM=$1
INPUT=~/Downloads/PFDH-Rev${REVISTA_NUM}.pdf
OUTPUT=../public/revistas/completas/revista-${REVISTA_NUM}.pdf

gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook \
   -dCompatibilityLevel=1.4 -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=$OUTPUT $INPUT

SIZE_BEFORE=$(du -h $INPUT | cut -f1)
SIZE_AFTER=$(du -h $OUTPUT | cut -f1)
echo "✅ Optimizado: $SIZE_BEFORE → $SIZE_AFTER"
```

#### **0.4 Instalación de Dependencias**
```bash
# System tools
sudo apt-get install poppler-utils ghostscript

# Node.js packages
pnpm add react-pdf pdfjs-dist
pnpm add -D @types/react-pdf
```

**Entregables Sprint 0:**
- ✅ Estructura de carpetas completa
- ✅ TypeScript types definidos
- ✅ Scripts de extracción funcionales
- ✅ Dependencias instaladas
- ✅ Componentes base (estructura vacía)

**Commit:** `chore: setup revista extraction infrastructure`

---

## 🥇 SPRINT 1-8: Extracción por Revista

### **Estructura de Sprint por Revista**

**Cada sprint de revista se divide en 5 FASES independientes y separables:**
- Cada fase puede ser una sesión separada si es necesario
- Fases son secuenciales pero pueden pausarse entre ellas
- Permite flexibilidad según tiempo disponible

---

### **FASE 1: Preparación y Análisis**

**Duración:** 20-30 min
**Tokens:** ~5-8K
**Puede pausarse:** ✅ Sí

**Objetivo:** Extraer y parsear el índice de la revista

**Tareas:**
1. Extraer índice con OCR
   ```bash
   cd scripts/extraction
   # Rev01,02,03,04,06 → página 4
   bash extract-indice.sh 01 4

   # Rev05,07,08 → página 3
   bash extract-indice.sh 05 3
   ```

2. Parsear índice → JSON estructurado
   ```bash
   node parse-indice.js 01
   # Output: rev01-parsed.json
   ```

3. Revisar plan de extracción
   ```bash
   cat rev01-parsed.json | jq
   ```

4. Verificar información extraída
   - ✅ Nombres de exaltados correctos
   - ✅ Páginas PDF correctas (con offset aplicado)
   - ✅ Categorías identificadas (Atleta/Propulsor/Póstumo)
   - ✅ Conteo total coincide

**Entregables Fase 1:**
- ✅ `rev01-indice.txt` (texto OCR del índice)
- ✅ `rev01-parsed.json` (estructura parseada)
- ✅ Plan de extracción validado

**Checkpoint:** Commit opcional
```bash
git add scripts/extraction/rev01-*.{txt,json}
git commit -m "chore(rev01): extract and parse index - phase 1"
```

---

### **FASE 2: Optimización de Assets**

**Duración:** 20-30 min
**Tokens:** ~5-8K
**Puede pausarse:** ✅ Sí

**Objetivo:** Preparar PDFs y portadas para web

**Tareas:**
1. Optimizar PDF
   ```bash
   bash optimize-pdf.sh 01
   # Input:  ~/Downloads/PFDH-Rev01.pdf (41MB)
   # Output: public/revistas/completas/revista-01.pdf (~8-10MB)
   ```

2. Extraer y optimizar portada
   ```bash
   gs -sDEVICE=jpeg -dFirstPage=1 -dLastPage=1 -r150 \
      -o public/revistas/portadas/rev01.jpg \
      ~/Downloads/PFDH-Rev01.pdf

   # Optimizar si es muy grande
   convert public/revistas/portadas/rev01.jpg \
           -resize 800x -quality 85 \
           public/revistas/portadas/rev01.jpg
   ```

3. Verificar calidad
   - ✅ PDF optimizado carga rápido
   - ✅ Portada legible y < 200KB
   - ✅ Texto del PDF sigue legible

**Entregables Fase 2:**
- ✅ `/public/revistas/completas/revista-01.pdf` (optimizado)
- ✅ `/public/revistas/portadas/rev01.jpg` (< 200KB)

**Checkpoint:** Commit opcional
```bash
git add public/revistas/
git commit -m "chore(rev01): optimize pdf and extract cover - phase 2"
```

---

### **FASE 3: Extracción de Exaltados (CRÍTICA)**

**Duración:** 60-120 min (depende de # exaltados)
**Tokens:** ~15-25K
**Puede pausarse:** ✅ Sí (guardar progreso parcial)

**Objetivo:** Extraer biografías completas de todos los exaltados

**Preparación:**
1. Abrir `rev01-parsed.json` para ver plan
2. Crear archivo `src/data/revistas/rev01-exaltados.ts` con estructura
3. Abrir PDF en viewer para extracción

**Proceso por Exaltado (2 min cada uno):**

**Template de entrada:**
```typescript
{
  id: 'julio-yuyo-luzunaris-maldonado',  // Auto-generar de nombre
  nombre: 'Julio',
  apodo: 'Yuyo',
  apellidos: 'Luzunaris Maldonado',
  categoria: 'ATLETA',
  deportes: ['Atletismo', 'Fútbol'],    // Leer de biografía
  anoExaltacion: 2003,
  revistaNumero: 1,
  paginaInicio: 10,                      // Del JSON
  paginaFin: 10,
  contenido: {
    biografia: ``,                       // Copiar texto completo
    logros: [],                          // Bullets principales
    estadisticas: {}                     // Números clave
  }
}
```

**Workflow eficiente:**
1. Ver exaltado #1 en JSON: "Julio Yuyo Luzunaris - Pág 10"
2. Abrir PDF en página 10
3. Copiar biografía (Ctrl+C, Ctrl+V)
4. Extraer logros en bullets
5. Identificar estadísticas (años, marcas, títulos)
6. Guardar en array
7. Siguiente exaltado...

**Técnica de progreso incremental:**
```typescript
// Guardar cada 5-10 exaltados
// Así puedes pausar y continuar después

export const rev01Exaltados: ExaltadoRevista[] = [
  // Exaltados 1-10 (sesión 1)
  { id: 'julio-yuyo-luzunaris', ... },
  { id: 'carmen-paciencia-marrero', ... },
  // ... 8 más

  // Exaltados 11-20 (sesión 2 - si pausaste)
  // ...

  // Exaltados 21-28 (sesión 3)
  // ...
];
```

**Entregables Fase 3:**
- ✅ `/src/data/revistas/rev01-exaltados.ts` (28 exaltados completos)

**Checkpoint:** Commit incremental
```bash
# Después de cada grupo de 10
git add src/data/revistas/rev01-exaltados.ts
git commit -m "chore(rev01): extract exaltados 1-10 - phase 3 partial"

# Al completar todos
git commit -m "feat(rev01): extract all 28 exaltados - phase 3 complete"
```

---

### **FASE 4: Contenido Adicional (OPCIONAL)**

**Duración:** 30-60 min
**Tokens:** ~8-12K
**Puede pausarse:** ✅ Sí
**Puede omitirse:** ✅ Sí (dejar para después)

**Objetivo:** Extraer fotos históricas y mensajes oficiales

**4.1 Fotos Históricas (Opcional)**

```bash
# Extraer imágenes de sección "Fotos Históricas"
cd scripts/extraction
bash extract-images.sh 01 33 40

# Output: public/images/historicas/rev01/
```

**Catalogación:**
```typescript
// src/data/revistas/rev01-fotos.ts
export const rev01Fotos: FotoHistorica[] = [
  {
    id: 'rev01-equipo-humacao-1951',
    titulo: 'Equipo Humacao Campeón AA 1951',
    año: 1951,
    categoria: 'equipo',
    revistaOrigen: 1,
    paginaOrigen: 33,
    deporteRelacionado: 'Béisbol',
    archivoUrl: '/images/historicas/rev01/pag33-equipo.jpg'
  },
  // ...
];
```

**Tiempo:** 5 min/foto

**4.2 Mensajes Oficiales (Opcional)**

```typescript
// src/data/revistas/rev01-mensajes.ts
export const rev01Mensajes: MensajeOficial[] = [
  {
    tipo: 'presidente',
    autor: {
      nombre: 'Lic. Francisco Betancourt',
      cargo: 'Presidente del Pabellón'
    },
    año: 2000,
    revistaNumero: 1,
    contenido: `...`,  // Copiar mensaje completo
    citas: [           // Frases destacadas
      'El deporte es la mejor escuela de vida...'
    ]
  }
];
```

**Tiempo:** 10 min/mensaje × 3 mensajes = 30 min

**Entregables Fase 4:**
- ⭕ `/src/data/revistas/rev01-fotos.ts` (opcional)
- ⭕ `/src/data/revistas/rev01-mensajes.ts` (opcional)
- ⭕ `/public/images/historicas/rev01/*.jpg` (opcional)

**Checkpoint:** Commit opcional
```bash
git add src/data/revistas/rev01-{fotos,mensajes}.ts
git add public/images/historicas/rev01/
git commit -m "feat(rev01): add historical photos and messages - phase 4"
```

**Nota:** Esta fase puede hacerse en un "Sprint 1.5" posterior si no hay tiempo.

---

### **FASE 5: Integración y Deploy**

**Duración:** 30-40 min
**Tokens:** ~8-12K
**Puede pausarse:** ❌ No (debe completarse de corrido)

**Objetivo:** Integrar todo y hacer deploy funcional

**5.1 Validación Automática**
```bash
cd scripts/extraction
node validate.js 01

# Verificar:
# ✅ 28/28 exaltados extraídos
# ✅ Todos tienen biografía
# ✅ Todos tienen al menos 1 logro
# ✅ Páginas coinciden con índice
```

**5.2 Generar Metadata**
```typescript
// Agregar a src/data/revistas/index.ts
import { rev01Exaltados } from './rev01-exaltados';

export const revistasMetadata: RevistaMetadata[] = [
  {
    numero: 1,
    year: 2000,
    titulo: 'Primera Exaltación del Pabellón',
    fechaCeremonia: '2000-08-20',
    descripcion: 'Ceremonia inaugural del Pabellón de la Fama del Deporte Humacaeño. Cuadro de Honor 2000.',
    pdfUrl: '/revistas/completas/revista-01.pdf',
    portadaUrl: '/revistas/portadas/rev01.jpg',
    totalPaginas: 52,
    exaltadosCount: rev01Exaltados.length,  // Auto-count
    categorias: {
      deportistas: rev01Exaltados.filter(e => e.categoria === 'ATLETA').length,
      propulsores: rev01Exaltados.filter(e => e.categoria === 'PROPULSOR').length,
      postumos: rev01Exaltados.filter(e => e.categoria === 'PÓSTUMO').length
    },
    rangoPaginas: {
      biografias: [10, 32],
      fotosHistoricas: [33, 40]
    }
  }
];
```

**5.3 Agregar a Directorio Global**
```typescript
// src/lib/data/exaltados-all.ts
import { rev01Exaltados } from '@/data/revistas/rev01-exaltados';
// import { rev02Exaltados } from '@/data/revistas/rev02-exaltados';  // Futuro

export const todosLosExaltados = [
  ...rev01Exaltados,
  // ...rev02Exaltados,  // Agregar en Sprint 2
];

// Helper functions
export function getExaltadoById(id: string) {
  return todosLosExaltados.find(e => e.id === id);
}

export function getExaltadosPorRevista(numero: number) {
  return todosLosExaltados.filter(e => e.revistaNumero === numero);
}

export function getExaltadosPorDeporte(deporte: string) {
  return todosLosExaltados.filter(e => e.deportes.includes(deporte));
}
```

**5.4 Testing Local**
```bash
pnpm dev

# Verificar en navegador:
# 1. http://localhost:3000/revistas
#    ✅ Revista #1 aparece en grid
#    ✅ Portada carga correctamente
#    ✅ Contador: "28 exaltados"

# 2. http://localhost:3000/revistas/1
#    ✅ PDF carga en viewer
#    ✅ Navegación de páginas funciona
#    ✅ Botón descarga funciona

# 3. http://localhost:3000/directorio
#    ✅ 28 exaltados visibles
#    ✅ Filtros funcionan
#    ✅ Búsqueda funciona

# 4. http://localhost:3000/directorio/julio-yuyo-luzunaris-maldonado
#    ✅ Biografía completa visible
#    ✅ Logros listados
#    ✅ Link a revista funciona
#    ✅ "Ver en Revista #1 (pág 10)" → abre PDF en pág 10
```

**5.5 Build Production**
```bash
pnpm build

# Verificar:
# ✅ Build completa sin errores
# ✅ No errores de TypeScript
# ✅ No warnings críticos
```

**5.6 Git Commit y Push**
```bash
git add .
git status  # Revisar cambios

git commit -m "feat(rev01): complete revista #1 extraction

- Add 28 exaltados with full biographies
- Optimize PDF (41MB → 8.5MB)
- Extract cover image
- Add metadata and validation
- Integrate with directorio

Closes #[issue-number]"

git push origin main
```

**5.7 Verificación Post-Deploy**

En producción (Vercel/Netlify):
- [ ] PDF carga en viewer
- [ ] Exaltados visibles en `/directorio`
- [ ] Links bidireccionales funcionan (directorio ↔ revista)
- [ ] Portada en grid de revistas
- [ ] Búsqueda encuentra exaltados de Rev01
- [ ] Performance aceptable (< 3s carga)

**Entregables Fase 5:**
- ✅ Validación completa
- ✅ Metadata integrada
- ✅ Testing pasado
- ✅ Deploy a producción
- ✅ Commit en main branch

---

## 📊 EJEMPLO: SPRINT 1 (Revista #01) DIVIDIDO

### **Opción A: Sprint en 1 Sesión (3-4 horas)**
```
Sesión única:
├─ Fase 1: Preparación (20 min)
├─ Fase 2: Assets (20 min)
├─ Fase 3: Exaltados (120 min)
├─ Fase 4: Extras (30 min) [OPCIONAL]
└─ Fase 5: Deploy (30 min)
Total: 3-4 horas
```

### **Opción B: Sprint en 2 Sesiones (más común)**
```
Sesión 1 (1.5 horas):
├─ Fase 1: Preparación (20 min)
├─ Fase 2: Assets (20 min)
└─ Fase 3: Exaltados 1-15 (60 min)
   └─ COMMIT PARCIAL

Sesión 2 (1.5 horas):
├─ Fase 3: Exaltados 16-28 (60 min)
└─ Fase 5: Deploy (30 min)
Total: 3 horas distribuidas
```

### **Opción C: Sprint en 3 Sesiones (máxima flexibilidad)**
```
Sesión 1 (40 min):
├─ Fase 1: Preparación (20 min)
└─ Fase 2: Assets (20 min)
   └─ COMMIT: Assets listos

Sesión 2 (2 horas):
└─ Fase 3: Exaltados 1-28 (120 min)
   └─ COMMIT: Exaltados completos

Sesión 3 (40 min):
├─ Fase 4: Extras (opcional) (10 min)
└─ Fase 5: Deploy (30 min)
   └─ COMMIT: Sprint completo
```

---

## 🎯 VENTAJAS DEL ENFOQUE POR FASES

| Ventaja | Descripción |
|---------|-------------|
| **Pausable** | Puedes parar entre fases sin perder progreso |
| **Commits incrementales** | Cada fase puede tener su commit |
| **Token-efficient** | Fases pequeñas = sesiones más manejables |
| **Paralelizable** | Fases 1-2 pueden hacerse en batch para varias revistas |
| **Flexible** | Fase 4 (extras) puede omitirse o posponerse |
| **Testeable** | Cada fase tiene criterios claros de completitud |
| **Estimable** | Tiempo por fase es predecible |

---

## 📈 CURVA DE APRENDIZAJE Y OPTIMIZACIÓN

### **Principio Clave: Aprendizaje Incremental**

> "Lo que aprendemos de las primeras revistas, nos ayuda con las siguientes revistas."

**Cada sprint refina el proceso para el siguiente:**

```
Sprint 0 (Setup)
  ↓ Scripts creados
Sprint 1 (Rev01 - Piloto)
  ↓ Aprendizajes:
  │ - Patrones en biografías identificados
  │ - Parser mejorado con casos reales
  │ - Template de exaltado perfeccionado
  │ - Tiempo real medido (2.5 min/exaltado)
  ↓ Scripts v2
Sprint 2 (Rev02)
  ↓ Aprendizajes:
  │ - Variaciones en índices detectadas
  │ - Shortcuts de extracción encontrados
  │ - Automatización de metadata
  │ - Tiempo reducido (1.8 min/exaltado)
  ↓ Scripts v3
Sprint 3-8 (Producción)
  ↓ Proceso optimizado:
  │ - Scripts maduros y confiables
  │ - Workflow eficiente establecido
  │ - Tiempo estable (~1.5 min/exaltado)
  └─ Máxima eficiencia alcanzada
```

### **Mejoras Típicas por Sprint:**

| Sprint | Revista | Tiempo/Exaltado | Scripts Mejorados | Aprendizajes Clave |
|--------|---------|-----------------|-------------------|-------------------|
| S1 | Rev01 | ~2.5 min | v1 (básicos) | Estructura base, patrones iniciales |
| S2 | Rev02 | ~2.0 min | v2 | Offset handling, parsing mejorado |
| S3 | Rev03 | ~1.8 min | v3 | Auto-generación metadata |
| S4 | Rev04 | ~1.5 min | v4 | Workflow optimizado |
| S5-8 | Rev05-08 | ~1.5 min | v5 (stable) | Proceso maduro |

**Reducción total:** ~40% tiempo/exaltado (2.5min → 1.5min)

### **Ejemplos de Optimizaciones Aprendidas:**

**Sprint 1 → Sprint 2:**
```javascript
// V1 (Sprint 1 - manual)
const offset = -2;  // Hardcoded
const pagina = paginaIndice + offset;

// V2 (Sprint 2 - detectado del análisis)
const OFFSET_MAP = {
  '01': 0,
  '02': 0,
  '03': 0,
  '04': 0,
  '05': 0,
  '06': -1,  // Aprendido en Sprint 1
  '07': -2,  // Detectado en análisis previo
  '08': 0
};
```

**Sprint 2 → Sprint 3:**
```typescript
// V1 (Sprint 1-2 - manual)
categorias: {
  deportistas: 9,  // Contado manualmente
  propulsores: 3,
  postumos: 16
}

// V2 (Sprint 3+ - auto-generado)
categorias: {
  deportistas: exaltados.filter(e => e.categoria === 'ATLETA').length,
  propulsores: exaltados.filter(e => e.categoria === 'PROPULSOR').length,
  postumos: exaltados.filter(e => e.categoria === 'PÓSTUMO').length
}
```

**Sprint 3 → Sprint 4:**
```bash
# V1 (Sprint 1-3 - manual por revista)
bash extract-indice.sh 01 4
node parse-indice.js 01
bash optimize-pdf.sh 01

# V2 (Sprint 4+ - batch script)
bash process-revista.sh 04  # Todo en uno
```

### **Patrones Comunes Identificados:**

Después de 2-3 revistas, identificarás:

**En Biografías:**
- Estructura típica: Intro → Logros → Equipos → Reconocimientos
- Palabras clave para deportes: "practicó", "jugó", "competió"
- Indicadores de estadísticas: "marcas", "récord", "promedio"
- Formato de fechas: "1957-1969", "para el año 1962"

**En Índices:**
- Patrones de nombres: "• Nombre...pág" o "-Nombre.....pág"
- Secciones estándar: Atletas, Propulsores, Póstumos
- Cuadros de Honor siempre presentes

**En Estructura:**
- Portadas siempre página 1
- Índices página 3 o 4 (ya documentado)
- Biografías empiezan página 10-20
- Fotos históricas típicamente al final

### **Script Evolution Example:**

**parse-indice.js Evolution:**

```javascript
// Version 1.0 (Sprint 1) - Básico
function parseIndice(text) {
  const regex = /(.+?)\.+(\d+)/g;
  const matches = text.matchAll(regex);
  return Array.from(matches);
}

// Version 2.0 (Sprint 2) - Maneja variaciones
function parseIndice(text) {
  const patterns = [
    /^[\s•●-]+(.+?)\s*[.…]+\s*(\d+)/gm,  // Formato con bullets
    /^(.+?)\s+(\d+)\s*$/gm                // Formato sin puntos
  ];
  // Intenta ambos patrones...
}

// Version 3.0 (Sprint 4) - Auto-detecta categorías
function parseIndice(text, revistaNum) {
  // Detecta automáticamente secciones
  // Aplica offset correcto por revista
  // Valida nombres contra lista conocida
  // Genera warnings para revisión manual
}
```

### **Refinamiento del Workflow:**

**Sprint 1 (Discovery):**
```
1. Abrir PDF
2. Buscar exaltado manualmente
3. Copiar biografía
4. Formatear en TypeScript
5. Repetir 28 veces
Tiempo: ~2.5 min/exaltado
```

**Sprint 4+ (Optimized):**
```
1. JSON ya tiene página exacta
2. Abrir PDF directo en página (1 click)
3. Copiar biografía pre-formateada
4. Paste en template con placeholders
5. Quick edit para ajustar
Tiempo: ~1.5 min/exaltado
```

### **Knowledge Base Building:**

Después de cada sprint, actualizar:

```markdown
# LEARNINGS.md

## Sprint 1 (Rev01):
- Google Drive OCR tiene calidad variable
- Offsets pueden ser 0, -1, o -2
- Biografías promedian 150-200 palabras
- Template de exaltado funciona bien

## Sprint 2 (Rev02):
- Adobe Scan OCR es superior
- Nombres a veces tienen typos en OCR
- Necesitamos validación fuzzy
- Metadata puede auto-generarse

## Sprint 3 (Rev03):
- Parser maneja 90% de casos automáticamente
- 10% requiere ajuste manual
- Workflow optimizado reduce 30% tiempo
```

### **Batch Optimization (Sprints 5+):**

Una vez el proceso esté maduro:

```bash
# Fases 1-2 pueden batched para múltiples revistas
# en una sola sesión de setup

# Sesión de Setup Batch (1 hora):
for i in 05 06 07 08; do
  bash extract-indice.sh $i
  node parse-indice.js $i
  bash optimize-pdf.sh $i
  # Extraer portada
done

# Resultado: 4 revistas listas para Fase 3
# Luego cada revista es solo Fase 3 + Fase 5 (~2h cada)
```

**Beneficio:** Sprints 5-8 pueden ser ~30% más rápidos que Sprint 1

---

## 🎯 DISTRIBUCIÓN DE CONTENIDO POR PÁGINA

### **/directorio/[id] - Perfil de Exaltado**

**Fuentes de datos:**
- `revXX-exaltados.ts`: Biografía completa, logros, estadísticas
- `revXX-fotos.ts`: Fotos del exaltado
- `cuadros-honor.ts`: Equipos/torneos donde participó

**Componentes:**
```tsx
<ExaltadoProfile>
  <HeroSection foto={exaltado.fotos[0]} />

  <BiografiaSection>
    {exaltado.contenido.biografia}

    <EnlaceRevista>
      📖 Ver en Revista Original #{exaltado.revistaNumero}
      (páginas {exaltado.paginaInicio}-{exaltado.paginaFin})
    </EnlaceRevista>
  </BiografiaSection>

  <LogrosSection logros={exaltado.contenido.logros} />

  <EstadisticasSection stats={exaltado.contenido.estadisticas} />

  <FotosGallery fotos={fotosRelacionadas} />

  <CuadrosHonor cuadros={cuadrosConExaltado} />
</ExaltadoProfile>
```

---

### **/historia - Historia del Pabellón**

**Fuentes de datos:**
- `historia-pabellon.ts`: Textos de sección "Historia" de cada revista
- `ceremonias.ts`: Timeline de exaltaciones
- `fotos-historicas/index.ts`: Galería cronológica
- `mensajes-oficiales.ts`: Mensajes de presidentes/alcaldes

**Componentes:**
```tsx
<HistoriaPage>
  <TimelineExaltaciones>
    {ceremonias.map(ceremonia => (
      <TimelineItem
        year={ceremonia.año}
        exaltados={ceremonia.exaltadosCount}
        revistaLink={`/revistas/${ceremonia.numero}`}
      />
    ))}
  </TimelineExaltaciones>

  <HistoriaPabellon>
    {/* Agregado de textos de todas las revistas */}
    {historiaTextos.map(texto => (
      <SeccionHistoria
        contenido={texto.contenido}
        fuente={`Revista #${texto.revistaNumero}`}
      />
    ))}
  </HistoriaPabellon>

  <GaleriaHistorica>
    {fotosHistoricas.map(foto => (
      <FotoCard
        imagen={foto.archivoUrl}
        titulo={foto.titulo}
        año={foto.año}
        fuente={`Revista #${foto.revistaOrigen}, pág ${foto.paginaOrigen}`}
      />
    ))}
  </GaleriaHistorica>
</HistoriaPage>
```

---

### **/junta - Junta Directiva**

**Fuentes de datos:**
- `juntas-directivas.ts`: Miembros por año (de cada revista)
- `mensajes-presidentes.ts`: Mensajes de presidentes

**Componentes:**
```tsx
<JuntaPage>
  <JuntaActual members={juntaActual} />

  <TimelineJuntas>
    {juntasPorAño.map(junta => (
      <JuntaHistorica
        año={junta.año}
        miembros={junta.miembros}
        fuente={`Revista #${junta.revistaNumero}`}
      />
    ))}
  </TimelineJuntas>

  <MensajesPresidentes>
    {mensajes.map(mensaje => (
      <MensajeCard
        autor={mensaje.autor}
        año={mensaje.año}
        contenido={mensaje.contenido}
        citasDestacadas={mensaje.citas}
      />
    ))}
  </MensajesPresidentes>
</JuntaPage>
```

---

### **/revistas - Biblioteca Digital**

**Fuentes de datos:**
- `revistas/index.ts`: Metadata
- PDFs optimizados en `/public/revistas/completas/`
- Portadas en `/public/revistas/portadas/`

**Componentes:**
```tsx
<RevistasPage>
  <RevistasGrid>
    {revistas.map(revista => (
      <RevistaCard
        portada={revista.portadaUrl}
        numero={revista.numero}
        año={revista.year}
        exaltadosCount={revista.exaltadosCount}
        onClickLeer={`/revistas/${revista.numero}`}
        onClickDescargar={revista.pdfUrl}
      />
    ))}
  </RevistasGrid>

  <EstadisticasGenerales>
    Total revistas: 8
    Total exaltados: 83
    Años cubiertos: 2000-2010
  </EstadisticasGenerales>
</RevistasPage>
```

---

## 📊 MÉTRICAS DE PROGRESO

### **Por Sprint:**

| Sprint | Revista | Exaltados | Fotos | Mensajes | PDFs | Status |
|--------|---------|-----------|-------|----------|------|--------|
| S0 | Setup | - | - | - | - | ⏳ |
| S1 | Rev01 | 28 | ~15 | 3 | ✅ | ⏳ |
| S2 | Rev02 | 8 | ~10 | 3 | ✅ | ⏳ |
| S3 | Rev03 | 8 | ~10 | 3 | ✅ | ⏳ |
| S4 | Rev04 | 10 | ~12 | 3 | ✅ | ⏳ |
| S5 | Rev05 | 9 | ~10 | 3 | ✅ | ⏳ |
| S6 | Rev06 | 5 | ~8 | 3 | ✅ | ⏳ |
| S7 | Rev07 | 10 | ~12 | 3 | ✅ | ⏳ |
| S8 | Rev08 | 5 | ~8 | 3 | ✅ | ⏳ |
| **TOTAL** | **8** | **83** | **~85** | **~24** | **8** | **0%** |

### **Por Página del Sitio:**

| Página | Depende de | Status |
|--------|------------|--------|
| `/revistas` | Metadata (Sprint 1+) | ⏳ |
| `/revistas/[numero]` | PDFs optimizados (Sprint 1+) | ⏳ |
| `/directorio` | Exaltados (Sprint 1+) | ⏳ |
| `/directorio/[id]` | Biografías completas (Sprint 1+) | ⏳ |
| `/historia` | Fotos + Timeline (Sprint 2+) | ⏳ |
| `/junta` | Juntas + Mensajes (Sprint 3+) | ⏳ |

---

## 🔄 WORKFLOW DE ACTUALIZACIÓN CONTINUA

A medida que se completan sprints:

```
Sprint 1 (Rev01) completo
  ↓
✅ 28 exaltados en /directorio
✅ 1 revista en /revistas
✅ Viewer funcional
  ↓
Sprint 2 (Rev02) completo
  ↓
✅ 36 exaltados totales (28+8)
✅ 2 revistas en grid
✅ Timeline empieza a tomar forma
  ↓
Sprint 3-8...
  ↓
✅ 83 exaltados completos
✅ 8 revistas digitalizadas
✅ 85+ fotos históricas
✅ Timeline completo 2000-2010
✅ Sitio completamente poblado
```

**Cada sprint agrega valor REAL e INMEDIATO al sitio.**

---

## ✅ CRITERIOS DE COMPLETITUD

### **Por Sprint:**
- [ ] PDF optimizado < 12MB
- [ ] Portada extraída (JPG < 200KB)
- [ ] Índice parseado (JSON)
- [ ] X/X exaltados extraídos y validados
- [ ] Fotos históricas catalogadas (opcional)
- [ ] Mensajes oficiales copiados (opcional)
- [ ] Metadata generada
- [ ] Build pasa sin errores
- [ ] Links bidireccionales funcionan
- [ ] Commit realizado

### **Proyecto Completo:**
- [ ] 8 revistas digitalizadas
- [ ] 83 exaltados en directorio
- [ ] 85+ fotos históricas catalogadas
- [ ] Timeline 2000-2010 completo
- [ ] Juntas directivas documentadas
- [ ] Mensajes oficiales archivados
- [ ] Viewer de revistas funcional
- [ ] Búsqueda global implementada
- [ ] Deploy a producción
- [ ] Documentación completa

---

## 🚀 PRÓXIMOS PASOS

### **Antes de próxima sesión:**
- Nada requerido ✅
- PDFs ya disponibles
- Plan documentado en backlog

### **Próxima sesión:**
**SPRINT 0: Foundation Setup**

1. Crear estructura de carpetas
2. Definir TypeScript types
3. Crear scripts de extracción
4. Instalar dependencias
5. Setup componentes base

**Duración estimada:** 1.5-2 horas
**Output:** Infraestructura lista para Sprint 1

### **Sesión siguiente:**
**SPRINT 1: Revista #01 (Piloto)**

Extracción completa de la primera revista (28 exaltados).

---

## 📝 NOTAS ADICIONALES

### **Decisiones de Diseño:**

**Priorización de contenido:**
1. **Exaltados** (CRÍTICO) - Corazón del directorio
2. **Fotos históricas** (ALTO) - Valor visual
3. **Metadata ceremonias** (MEDIO) - Timeline
4. **Mensajes oficiales** (MEDIO) - Contexto histórico
5. **Juntas directivas** (BAJO) - Documentación
6. **Artículos deportivos** (BAJO) - Contenido adicional

**Flexibilidad:**
- Sprints pueden enfocarse solo en exaltados inicialmente
- Fotos/mensajes pueden agregarse en "Sprint 1.5" posterior
- No todo debe extraerse en primera pasada

**Escalabilidad:**
- Estructura permite agregar Revista #9, #10 en futuro
- Scripts son reutilizables
- Proceso está documentado

---

## 📚 REFERENCIAS

**Herramientas:**
- `pdftotext` (Poppler): Extracción OCR
- `ghostscript`: Optimización PDFs
- `pdfimages`: Extracción de imágenes
- `react-pdf`: Viewer en Next.js

**Documentos relacionados:**
- `/CLAUDE.md` - Instrucciones proyecto
- `/README.md` - Documentación general
- `/scripts/extraction/README.md` - Guía de scripts

---

**Última actualización:** 2025-10-04
**Estado:** 📋 En backlog, listo para implementación
**Próximo milestone:** Sprint 0 - Foundation Setup
