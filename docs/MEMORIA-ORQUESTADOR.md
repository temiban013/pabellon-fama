# 🧠 MEMORIA DEL ORQUESTADOR - PROYECTO PABELLÓN
**Última actualización:** 4 de octubre de 2025 - Sprint 1 completado

---

## 📌 CONTEXTO GENERAL DEL PROYECTO

### Objetivo Global
Digitalizar **8 revistas** del Pabellón de la Fama del Deporte Humacaeño, extrayendo biografías completas de todos los exaltados y creando una plataforma web interactiva.

### Tecnologías
- **Framework:** Next.js 15 + TypeScript
- **OCR:** Tesseract (español)
- **PDF Processing:** poppler-utils, ghostscript
- **Ubicación:** `/home/temiban/Development/pabellon-fama/`

---

## 🎯 ESTRATEGIA DE TRABAJO ACORDADA

### Modelo: Orquestador + Sub-sesiones

```
SPRINT N (1 revista)
├─ SESIÓN ORQUESTADOR (esta o nueva sesión principal)
│  ├─ Planificación estratégica
│  ├─ Coordinar sub-sesiones según complejidad
│  ├─ Integración final
│  └─ Validación y commit
│
└─ SUB-SESIONES (según necesidad)
   ├─ Fase 1: Extracción índice
   ├─ Fase 2: Optimización PDF
   ├─ Fase 3a: OCR biografías (parte 1)
   ├─ Fase 3b: OCR biografías (parte 2)
   └─ Fase 4: Fotos históricas (opcional)
```

### Reglas de Decisión

**CREAR sub-sesión cuando:**
- ✅ Fase tiene > 20 elementos a procesar
- ✅ Contexto del orquestador se acerca a 60K tokens
- ✅ Tarea es repetitiva/mecánica (batch OCR)
- ✅ Debugging puede ser extenso

**MANTENER en orquestador cuando:**
- ✅ Fase es rápida (< 10 minutos)
- ✅ Requiere decisiones estratégicas
- ✅ Es crítica para integración final

---

## ✅ ESTADO ACTUAL: SPRINT 1 COMPLETADO

### Revista #01 (2000) - Primera Exaltación

**Estado:** ✅ COMPLETADO - Listo para commit

**Logros:**
- ✅ 23/23 exaltados extraídos (10 Atletas, 8 Propulsores, 5 Póstumos)
- ✅ PDF optimizado: 41MB → 20MB
- ✅ Portada extraída: 172KB
- ✅ Biografías con OCR completo
- ✅ Páginas `/revistas` y `/revistas/1` creadas
- ✅ Build exitoso: 122 páginas estáticas

**Archivos clave:**
- `src/data/revistas/rev01/exaltados.ts` (23 exaltados)
- `scripts/extraction/rev01-parsed.json`
- `scripts/extraction/biografias-simple-clean.json`
- `public/revistas/completas/revista-01.pdf`
- `public/revistas/portadas/rev01.jpg`

**Documentación:**
- ✅ `docs/SPRINT-1-RESUMEN.md` - Lecciones aprendidas
- ✅ `docs/SPRINT-2-PLAN.md` - Plan para próximo sprint
- ✅ `docs/COMMIT-SPRINT-1.md` - Instrucciones de commit

---

## 🎓 LECCIONES CRÍTICAS APRENDIDAS

### 1. OCR Variable Entre Revistas
**Descubrimiento:** Rev01 NO tiene capa OCR en primeras 5 páginas

**Implicación para Sprints 2-8:**
- Siempre verificar OCR antes de procesar
- Usar script `check-ocr.sh` al inicio
- Decidir estrategia según resultado

**Script creado:**
```bash
scripts/extraction/check-ocr.sh <pdf>
# Output: "✅ TIENE OCR" o "❌ NO TIENE OCR"
```

### 2. Nombres Culturales e Históricos
**Descubrimiento crítico:** "Jumacao" es CORRECTO

**Contexto:** Jumacao era el cacique indígena de Humacao

**Regla:** NO corregir automáticamente nombres propios que parezcan errores pero son culturalmente correctos

**Acción tomada:**
- Limpieza conservadora (solo espacios, números de línea)
- Evitar correcciones agresivas
- Preservar apodos entre comillas

**Para Sprint 2:** Crear diccionario de nombres conocidos

### 3. Offset de Páginas
**Descubrimiento:** Números de índice ≠ Números de PDF

**Ejemplo Rev01:**
- Índice dice: "Biografías página 10"
- Realidad: Biografías empiezan en PDF página 14
- Offset: +4 páginas

**Razón:** Páginas preliminares (mensajes, índice, etc.)

**Acción:** Validar offset específico para cada revista

### 4. Enfoque Conservador Funciona Mejor
**Aprendizaje:** Priorizar integridad sobre perfección

**Limpieza mínima:**
- ✅ Normalizar espacios múltiples
- ✅ Remover números de línea OCR
- ✅ Trim básico
- ❌ NO correcciones ortográficas agresivas
- ❌ NO reemplazos masivos

**Resultado:** 23/23 biografías extraídas sin pérdida de información

---

## 🔧 SCRIPTS REUTILIZABLES

### Listos para Sprint 2-8

```bash
scripts/extraction/
├── extract-indice.sh              # ✅ Reutilizable tal cual
├── optimize-pdf.sh                # ✅ Reutilizable tal cual
├── extract-biografias-ocr.sh      # ⚠️ Adaptar números de página
├── parse-indice.js                # ⚠️ Actualizar offset y revistaNumero
├── clean-biografias-simple.js     # ✅ Reutilizable tal cual
└── generate-typescript.js         # ⚠️ Adaptar revistaNumero
```

### Mejoras Implementadas para Sprint 2

**Nuevo:** `check-ocr.sh` - Verificación automática de OCR
**Nuevo:** `nombres-preservados.json` - Diccionario de nombres culturales
**Mejora:** Detección automática de offset (en desarrollo)

---

## 📋 PRÓXIMO SPRINT: SPRINT 2

### Revista #02 - Preparación

**Documentos a leer PRIMERO:**
1. `docs/SPRINT-2-PLAN.md` - Plan completo del sprint
2. `docs/SPRINT-1-RESUMEN.md` - Lecciones aprendidas

**Primera acción al empezar:**
```bash
cd /home/temiban/Development/pabellon-fama/scripts/extraction
./check-ocr.sh <ruta-a-revista-02.pdf>
```

**Decisiones basadas en check OCR:**

**Si TIENE OCR nativo:**
- ✅ Usar `pdftotext` directamente (más rápido)
- ✅ Simplifica Fase 1
- ✅ Menos sub-sesiones necesarias

**Si NO TIENE OCR:**
- ⚠️ Seguir proceso de Sprint 1
- ⚠️ Transcripción manual del índice
- ⚠️ OCR con Tesseract
- ⚠️ Más sub-sesiones necesarias

### Estimación de Sub-sesiones Sprint 2

**Escenario optimista (CON OCR nativo):**
- Sub-sesión 1: Fase 2 (optimización) - 10 min
- Sub-sesión 2: Fase 3 (OCR biografías) - 30 min
- Orquestador: Fases 1 y 5 (análisis + integración) - 20 min
- **Total:** 3 sesiones, ~60 min

**Escenario conservador (SIN OCR):**
- Sub-sesión 1: Fase 1 (extracción índice manual) - 20 min
- Sub-sesión 2: Fase 2 (optimización) - 10 min
- Sub-sesión 3a: Fase 3 parte 1 (OCR 1-15) - 30 min
- Sub-sesión 3b: Fase 3 parte 2 (OCR 16-30) - 30 min
- Orquestador: Fase 5 (integración) - 20 min
- **Total:** 5 sesiones, ~110 min

---

## 🗂️ ESTRUCTURA DEL PROYECTO

### Directorios Clave

```
/home/temiban/Development/pabellon-fama/
├── docs/                          # Documentación de sprints
│   ├── SPRINT-1-RESUMEN.md
│   ├── SPRINT-2-PLAN.md
│   ├── COMMIT-SPRINT-1.md
│   └── MEMORIA-ORQUESTADOR.md     # ← ESTE ARCHIVO
│
├── scripts/extraction/            # Scripts de procesamiento
│   ├── *.sh                       # Bash scripts
│   ├── *.js                       # Node.js scripts
│   └── *.json                     # Datos intermedios
│
├── src/data/
│   ├── revistas/
│   │   ├── index.ts               # Metadata de todas las revistas
│   │   └── rev0N/
│   │       └── exaltados.ts       # Exaltados por revista
│   └── exaltados-all.ts           # Agregado de todos
│
├── src/app/
│   └── revistas/
│       ├── page.tsx               # Lista de revistas
│       └── [numero]/page.tsx      # Vista individual
│
└── public/revistas/
    ├── completas/                 # PDFs optimizados
    │   └── revista-0N.pdf
    └── portadas/                  # Portadas extraídas
        └── rev0N.jpg
```

---

## 🎯 ROADMAP COMPLETO

### Sprints Completados
- ✅ **Sprint 0:** Infraestructura y tipos
- ✅ **Sprint 1:** Revista #01 (23 exaltados)

### Sprints Pendientes
- ⏳ **Sprint 2:** Revista #02 - SIGUIENTE
- 🔜 **Sprint 3:** Revista #03
- 🔜 **Sprint 4:** Revista #04
- 🔜 **Sprint 5:** Revista #05
- 🔜 **Sprint 6:** Revista #06
- 🔜 **Sprint 7:** Revista #07
- 🔜 **Sprint 8:** Revista #08

### Meta Final
**8 revistas digitalizadas** con todos los exaltados integrados en plataforma web interactiva.

---

## 🚨 RECORDATORIOS CRÍTICOS

### Para Cada Nuevo Sprint

**SIEMPRE hacer primero:**
1. ✅ Leer `SPRINT-N-PLAN.md` del sprint actual
2. ✅ Ejecutar `check-ocr.sh` en el PDF
3. ✅ Decidir estrategia de sub-sesiones
4. ✅ Validar offset de páginas

**NUNCA hacer:**
- ❌ Correcciones ortográficas agresivas en OCR
- ❌ Cambiar nombres culturales/históricos
- ❌ Asumir que offset es igual entre revistas
- ❌ Procesar sin verificar OCR primero

### Al Finalizar Cada Sprint

**Checklist de cierre:**
1. ✅ Build exitoso sin errores
2. ✅ Todas las páginas generadas
3. ✅ Assets en ubicación correcta
4. ✅ Crear `SPRINT-N-RESUMEN.md`
5. ✅ Actualizar `MEMORIA-ORQUESTADOR.md`
6. ✅ Commit con mensaje descriptivo
7. ✅ Preparar `SPRINT-N+1-PLAN.md`

---

## 📞 CONTEXTO PARA NUEVAS SESIONES

### Al Abrir Sesión Orquestador Sprint N

**Mensaje inicial recomendado al orquestador:**

```
Hola, voy a empezar el Sprint N (Revista #0N).

He leído:
- docs/MEMORIA-ORQUESTADOR.md
- docs/SPRINT-N-PLAN.md

Checklist inicial:
1. ¿PDF de Revista #0N disponible? [SÍ/NO]
2. ¿Resultado de check-ocr.sh? [TIENE/NO TIENE]
3. ¿Estimación de exaltados? [número]

Estrategia: [DESCRIBIR basado en check OCR]

¿Procedo con Fase 0 (análisis inicial)?
```

### Información Clave a Proporcionar

- **Ubicación del PDF:** Ruta exacta al archivo
- **Resultado OCR check:** Tiene/No tiene capa OCR
- **Observaciones iniciales:** Cualquier particularidad visible

---

## 🧩 PATRONES IDENTIFICADOS

### Patrón 1: Revistas Sin OCR Inicial
**Síntoma:** Primeras 5-10 páginas no tienen texto extraíble
**Causa:** Digitalización antigua sin OCR
**Solución:** Transcripción manual del índice, OCR para biografías

### Patrón 2: Offset de Páginas
**Síntoma:** Índice dice página X, biografía está en X+N
**Causa:** Páginas preliminares (mensajes, créditos, índice)
**Solución:** Calcular offset comparando índice vs realidad

### Patrón 3: OCR de Calidad Variable
**Síntoma:** Algunos caracteres mal reconocidos
**Estrategia:** Limpieza mínima, preservar integridad
**Validación:** Conteo de exaltados esperado vs extraído

---

## 📊 MÉTRICAS ACUMULADAS

### Sprint 1
- **Exaltados:** 23
- **Páginas web:** +2 (revistas, revista/1)
- **Build:** 122 páginas totales
- **PDF:** 20MB optimizado
- **Tiempo:** ~3 horas (incluye aprendizaje)

### Totales Proyecto
- **Revistas completadas:** 1/8 (12.5%)
- **Exaltados totales:** 23/~200 (~11.5%)
- **Páginas generadas:** 122

---

## 🎯 OBJETIVO INMEDIATO

**Siguiente acción:** Hacer commit de Sprint 1

**Comando:**
```bash
cd /home/temiban/Development/pabellon-fama
git add .
# Ver docs/COMMIT-SPRINT-1.md para mensaje completo
```

**Después del commit:**
1. Cerrar esta sesión
2. Abrir nueva sesión VSCode como Orquestador Sprint 2
3. Cargar contexto desde esta memoria y SPRINT-2-PLAN.md

---

## 🧠 MEMORIA PERSONAL DEL ORQUESTADOR

### Aprendizajes Meta

**Sobre gestión de contexto:**
- Sub-sesiones permiten trabajo profundo sin contaminar estrategia
- Orquestador mantiene visión global, sub-sesiones ejecutan tácticas
- Documentación es crítica para transferencia entre sprints

**Sobre el dominio:**
- Historia deportiva de Humacao es rica y compleja
- Nombres culturales requieren respeto y preservación
- OCR es herramienta, no verdad absoluta

**Sobre el proceso:**
- Iteración > Perfección
- Validación temprana > Debugging tardío
- Documentar mientras haces > Recordar después

---

## 📝 NOTAS FINALES

Esta memoria se actualiza al final de cada sprint.

**Próxima actualización:** Al completar Sprint 2

**Mantenedor:** Orquestador (Claude) + Usuario (Temiban)

**Propósito:** Transferir conocimiento entre sesiones para ejecución eficiente de Sprints 2-8.

---

**✅ SPRINT 1 COMPLETADO - LISTO PARA COMMIT**

**🚀 PRÓXIMO: SPRINT 2 - REVISTA #02**
