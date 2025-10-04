# 📋 SPRINT 2 - PLAN DE EJECUCIÓN
**Revista #02 - Segunda Exaltación**
**Estrategia:** Orquestador + Sub-sesiones según necesidad

---

## 🎯 Objetivo

Extraer e integrar **todos los exaltados de la Revista #02** aplicando las lecciones aprendidas del Sprint 1.

---

## 📚 Contexto Crítico del Sprint 1

### ✅ Lecciones Aprendidas

1. **OCR Variable**
   - Rev01 no tenía OCR en primeras 5 páginas
   - **VERIFICAR** si Rev02 tiene OCR nativo antes de procesar

2. **Nombres Culturales**
   - "Jumacao" es correcto (cacique indígena de Humacao)
   - **NO CORREGIR** nombres propios históricos/culturales
   - Mantener apodos entre comillas

3. **Offset de Páginas**
   - Rev01: Índice decía pág 10, pero biografías empiezan en PDF pág 14
   - **VALIDAR** offset específico para cada revista

4. **Limpieza Conservadora**
   - Correcciones agresivas causan pérdida de datos
   - **PRIORIZAR** integridad sobre perfección

### 🔧 Scripts Reutilizables

```bash
scripts/extraction/
├── extract-indice.sh              # ✅ Reutilizable
├── optimize-pdf.sh                # ✅ Reutilizable
├── extract-biografias-ocr.sh      # ⚠️ Adaptar números de página
├── parse-indice.js                # ⚠️ Actualizar offset
├── clean-biografias-simple.js     # ✅ Reutilizable
└── generate-typescript.js         # ⚠️ Adaptar número de revista
```

---

## 🗺️ Estrategia de Sesiones

### MODELO: Orquestador + Sub-sesiones Flexibles

```
┌──────────────────────────────────────────────────────┐
│  SESIÓN ORQUESTADOR (nueva sesión)                   │
│  Responsabilidades:                                   │
│  - Planificación inicial y análisis de Rev02         │
│  - Coordinar sub-sesiones según complejidad          │
│  - Mantener visión global del sprint                 │
│  - Integración final y validación                    │
│  - Commit y cierre                                   │
└──────────────────────────────────────────────────────┘
           │
           ├─→ FASE 0: Análisis Inicial (en orquestador)
           │   - Verificar OCR nativo en Rev02
           │   - Contar total de exaltados esperados
           │   - Calcular offset de páginas
           │
           ├─→ SUB-SESIÓN 1: Fase 1 (Extracción índice)
           │   Trigger: Si índice es complejo o sin OCR
           │   Output: rev02-parsed.json
           │
           ├─→ SUB-SESIÓN 2: Fase 2 (Optimización)
           │   Siempre necesaria
           │   Output: PDF optimizado + portada
           │
           ├─→ SUB-SESIÓN 3a: Fase 3 Parte 1 (OCR 1-15)
           │   Trigger: Si > 15 exaltados
           │   Output: biografias-ocr-parte1.json
           │
           ├─→ SUB-SESIÓN 3b: Fase 3 Parte 2 (OCR 16-30)
           │   Trigger: Si contexto de 3a se hace largo
           │   Output: biografias-ocr-parte2.json
           │
           ├─→ SUB-SESIÓN 4: Fase 4 (Fotos históricas)
           │   Opcional
           │   Output: Fotos extraídas
           │
           └─→ FASE 5: Integración (en orquestador)
               - Merge de todos los outputs
               - Generación de TypeScript
               - Validación y build
               - Commit
```

---

## 📝 Fase 0: Análisis Inicial (Orquestador)

### Checklist Pre-Sprint

```bash
# 1. Verificar OCR nativo
cd scripts/extraction
pdftotext -f 1 -l 1 ../../ruta/a/revista-02.pdf test-ocr.txt
cat test-ocr.txt  # ¿Tiene contenido legible?

# 2. Extraer página de índice como imagen
pdftoppm -f 4 -l 4 -jpeg -r 300 revista-02.pdf indice
# Leer imagen y contar exaltados

# 3. Detectar offset
# Comparar número de página en índice vs número real PDF
```

### Decisiones Basadas en Análisis

**Si Rev02 TIENE OCR nativo:**
- ✅ Usar `pdftotext` directamente
- ✅ Simplifica Fase 1 (no necesita transcripción manual)

**Si Rev02 NO TIENE OCR:**
- ⚠️ Seguir proceso de Sprint 1
- ⚠️ Transcripción manual del índice
- ⚠️ OCR con Tesseract para biografías

**Estimación de Sub-sesiones:**
- < 20 exaltados: 3-4 sub-sesiones
- 20-30 exaltados: 4-5 sub-sesiones
- > 30 exaltados: 5-6 sub-sesiones

---

## 🔄 Fases del Sprint

### FASE 1: Extracción y Parseo del Índice

**Responsable:** Sub-sesión o Orquestador (según complejidad)

**Input:**
- PDF de Revista #02
- Scripts de Sprint 1 como referencia

**Proceso:**
1. Verificar si tiene OCR nativo
2. Extraer índice (OCR o manual)
3. Parsear a JSON estructurado
4. Validar conteo de exaltados

**Output:**
- `rev02-parsed.json` con estructura:
  ```json
  {
    "revistaNumero": 2,
    "offset": <calculado>,
    "totalExaltados": <número>,
    "exaltados": [...],
    "categorias": {...}
  }
  ```

**Criterios de Sub-sesión:**
- ✅ Crear sub-sesión si: Sin OCR O > 25 exaltados
- ⚠️ Mantener en orquestador si: Tiene OCR Y < 25 exaltados

---

### FASE 2: Optimización de PDF y Extracción de Portada

**Responsable:** Sub-sesión (siempre)

**Input:**
- PDF original de Rev02
- `scripts/extraction/optimize-pdf.sh`

**Proceso:**
```bash
cd scripts/extraction
./optimize-pdf.sh ../../ruta/a/revista-02.pdf

# Verificar reducción
ls -lh revista-02-optimized.pdf
```

**Output:**
- PDF optimizado (~20MB target)
- Portada extraída (~200KB target)
- Mover a `public/revistas/completas/revista-02.pdf`
- Mover a `public/revistas/portadas/rev02.jpg`

**Tiempo estimado:** 5-10 minutos

---

### FASE 3: Extracción de Biografías con OCR

**Responsable:** Sub-sesión(es) - Dividir si > 20 exaltados

**Input:**
- PDF optimizado
- `rev02-parsed.json` (para saber páginas)

**Estrategia de División:**

**Si ≤ 20 exaltados:**
- 1 sub-sesión completa

**Si > 20 exaltados:**
- Sub-sesión 3a: Biografías 1-15
- Sub-sesión 3b: Biografías 16-30
- Sub-sesión 3c: Biografías 31+ (si aplica)

**Proceso:**
```bash
# Adaptar números de página según rev02-parsed.json
nano extract-biografias-ocr.sh
# Cambiar: -f <inicio> -l <fin>

./extract-biografias-ocr.sh

# Output: biografias-ocr.json
```

**Limpieza:**
```bash
node clean-biografias-simple.js
# Output: biografias-simple-clean.json
```

**Validaciones:**
- ✅ Total biografías = total exaltados esperados
- ✅ Cada biografía tiene contenido (no vacías)
- ✅ Nombres propios preservados

**Tiempo estimado:** 20-40 minutos por sub-sesión

---

### FASE 4: Extracción de Fotos Históricas (OPCIONAL)

**Responsable:** Sub-sesión (si hay tiempo/interés)

**Input:**
- PDF optimizado
- Rango de páginas de `rev02-parsed.json`

**Proceso:**
```bash
# Extraer páginas de fotos históricas
pdftoppm -f <inicio_fotos> -l <fin_fotos> -jpeg -r 300 revista-02.pdf foto-rev02
```

**Output:**
- Imágenes en `public/images/historicas/rev02/`

**Prioridad:** BAJA (puede hacerse en sprint posterior)

---

### FASE 5: Integración, Validación y Deploy

**Responsable:** Orquestador (esta fase SIEMPRE en sesión principal)

**Input:**
- `rev02-parsed.json`
- `biografias-simple-clean.json`
- PDF y portada optimizados

**Proceso:**

1. **Generar TypeScript**
   ```bash
   cd scripts/extraction
   # Adaptar generate-typescript.js para Rev02
   node generate-typescript.js
   # Output: src/data/revistas/rev02/exaltados.ts
   ```

2. **Actualizar Metadata**
   ```typescript
   // src/data/revistas/index.ts
   {
     numero: 2,
     year: <año>,
     titulo: '<título>',
     // ... resto de metadata
   }
   ```

3. **Importar Exaltados**
   ```typescript
   // src/data/exaltados-all.ts
   import { rev02Exaltados } from './revistas/rev02/exaltados';

   export const todosLosExaltados: ExaltadoRevista[] = [
     ...rev01Exaltados,
     ...rev02Exaltados,  // ← NUEVO
   ];
   ```

4. **Build y Validación**
   ```bash
   pnpm build
   # Verificar:
   # - ✓ Compiled successfully
   # - Páginas generadas de Rev02
   # - No errores TypeScript
   ```

5. **Verificar Rutas**
   - `/revistas` muestra Rev01 y Rev02
   - `/revistas/2` muestra exaltados de Rev02
   - `/directorio/[slug]` tiene nuevas páginas

**Criterios de Éxito:**
- ✅ Build exitoso
- ✅ Todas las rutas funcionan
- ✅ Metadata correcta
- ✅ Total exaltados = esperado

---

## 🎯 Mejoras Implementadas en Sprint 2

### 1. Script de Verificación de OCR

**Nuevo archivo:** `scripts/extraction/check-ocr.sh`

```bash
#!/bin/bash
# Verifica si un PDF tiene capa OCR

PDF_FILE=$1

echo "Verificando OCR en: $PDF_FILE"

pdftotext -f 1 -l 1 "$PDF_FILE" test-ocr.txt

if [ -s test-ocr.txt ]; then
    CONTENT=$(cat test-ocr.txt | wc -w)
    if [ $CONTENT -gt 10 ]; then
        echo "✅ PDF TIENE OCR nativo ($CONTENT palabras detectadas)"
        echo "   → Puedes usar pdftotext directamente"
    else
        echo "⚠️  PDF tiene OCR pero poco contenido"
        echo "   → Revisar calidad del OCR"
    fi
else
    echo "❌ PDF NO TIENE OCR"
    echo "   → Necesitas usar Tesseract OCR"
fi

rm -f test-ocr.txt
```

### 2. Diccionario de Nombres Preservados

**Nuevo archivo:** `scripts/extraction/nombres-preservados.json`

```json
{
  "nombres_culturales": [
    "Jumacao",
    "Yuyo",
    "Saso",
    "Menelo",
    "Jayase"
  ],
  "apodos_comunes": [
    "Tato",
    "Cheo",
    "Paco",
    "Kiko"
  ],
  "lugares": [
    "Humacao",
    "Jumacao"
  ]
}
```

**Actualizar:** `clean-biografias-simple.js` para leer este diccionario

### 3. Detección Automática de Offset

**Agregar a:** `parse-indice.js`

```javascript
// Detectar offset automáticamente
function detectOffset(pdfPath, indicePaginaEsperada) {
  // Buscar en PDF la página que dice "Página <indicePaginaEsperada>"
  // Comparar con número real de página PDF
  // Calcular offset = pdfPageReal - indicePage

  return offset;
}
```

---

## 📊 Métricas de Éxito Sprint 2

### Cuantitativas
- [ ] 100% exaltados extraídos
- [ ] PDF optimizado > 40% reducción
- [ ] Build exitoso sin errores
- [ ] < 5 sub-sesiones necesarias
- [ ] Tiempo total < 3 horas

### Cualitativas
- [ ] Scripts mejorados y más automatizados
- [ ] Menos intervención manual que Sprint 1
- [ ] Diccionario de nombres funcionando
- [ ] Documentación actualizada

---

## 🚀 Inicio de Sprint 2

### Checklist Antes de Empezar

1. **Contexto:**
   - [ ] Leer `SPRINT-1-RESUMEN.md` completo
   - [ ] Revisar scripts de Sprint 1
   - [ ] Verificar ubicación de Rev02 PDF

2. **Ambiente:**
   - [ ] Nueva sesión VSCode abierta
   - [ ] Terminal en `Development/pabellon-fama/`
   - [ ] Scripts ejecutables (`chmod +x scripts/extraction/*.sh`)

3. **Primera Acción:**
   ```bash
   # Ejecutar check de OCR
   cd scripts/extraction
   ./check-ocr.sh ../../ruta/a/revista-02.pdf
   ```

4. **Comunicar al Orquestador:**
   - Resultado del check de OCR
   - Estimación de exaltados (si visible en portada/índice)
   - Cualquier característica especial de Rev02

---

## 📝 Notas para la Sesión Orquestador

### Responsabilidades del Orquestador

**NO HACER:**
- ❌ Ejecutar todas las fases en una sola sesión
- ❌ Profundizar en debugging de scripts
- ❌ Perder tiempo en optimizaciones prematuras

**SÍ HACER:**
- ✅ Planificar estrategia de sub-sesiones
- ✅ Decidir cuándo crear sub-sesión vs trabajar directo
- ✅ Mantener visión global del progreso
- ✅ Validar outputs de cada fase
- ✅ Integración final y commit

### Triggers para Crear Sub-sesión

**CREAR sub-sesión si:**
- Fase tiene > 20 elementos a procesar
- Contexto se acerca a 60K tokens
- Tarea es repetitiva/mecánica (OCR batch)
- Debugging puede ser largo

**MANTENER en orquestador si:**
- Fase es rápida (< 10 min)
- Requiere decisiones estratégicas
- Es crítica para siguiente paso (integración)

---

## ✅ Entregables del Sprint 2

Al finalizar, debes tener:

1. **Datos:**
   - `rev02-parsed.json`
   - `biografias-simple-clean.json`
   - `src/data/revistas/rev02/exaltados.ts`

2. **Assets:**
   - `public/revistas/completas/revista-02.pdf`
   - `public/revistas/portadas/rev02.jpg`

3. **UI:**
   - `/revistas` muestra Rev01 y Rev02
   - `/revistas/2` funciona
   - Directorio actualizado

4. **Documentación:**
   - `SPRINT-2-RESUMEN.md`
   - Lecciones aprendidas para Sprint 3

5. **Commit:**
   - Mensaje descriptivo
   - Co-authored con Claude

---

**¡Listo para Sprint 2! 🚀**

**Próximo paso:** Abrir nueva sesión VSCode como Orquestador Sprint 2
