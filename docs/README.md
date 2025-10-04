# 📚 Documentación de Sprints - Proyecto Pabellón

Este directorio contiene toda la documentación de los sprints de digitalización de revistas del Pabellón de la Fama del Deporte Humacaeño.

---

## 📖 Orden de Lectura

### Para Empezar un Nuevo Sprint

1. **MEMORIA-ORQUESTADOR.md** ← Lee esto PRIMERO
   - Contexto general del proyecto
   - Estrategia de trabajo (Orquestador + Sub-sesiones)
   - Lecciones críticas aprendidas
   - Estado actual del proyecto

2. **SPRINT-N-PLAN.md** (donde N = sprint actual)
   - Plan específico del sprint
   - Checklist de pre-inicio
   - Estrategia de sub-sesiones
   - Mejoras implementadas

3. **SPRINT-N-1-RESUMEN.md** (sprint anterior)
   - Qué funcionó bien
   - Qué mejorar
   - Métricas y resultados

---

## 📁 Archivos en este Directorio

### Documentación de Sprints

- **MEMORIA-ORQUESTADOR.md** - Memoria persistente entre sprints
- **SPRINT-1-RESUMEN.md** - Resumen ejecutivo Sprint 1
- **SPRINT-2-PLAN.md** - Plan detallado Sprint 2
- **COMMIT-SPRINT-1.md** - Instrucciones de commit Sprint 1

### Próximos Sprints

A medida que completemos sprints, se agregarán:
- SPRINT-N-RESUMEN.md
- SPRINT-N+1-PLAN.md
- COMMIT-SPRINT-N.md

---

## 🎯 Estado del Proyecto

### Completado
- ✅ Sprint 0: Infraestructura
- ✅ Sprint 1: Revista #01 (23 exaltados)

### Próximo
- ⏳ Sprint 2: Revista #02

### Pendientes
- 🔜 Sprints 3-8: Revistas #03-#08

---

## 🚀 Quick Start para Orquestador Sprint N

```bash
# 1. Lee la memoria
cat docs/MEMORIA-ORQUESTADOR.md

# 2. Lee el plan del sprint actual
cat docs/SPRINT-N-PLAN.md

# 3. Verifica OCR del PDF
cd scripts/extraction
./check-ocr.sh <ruta-al-pdf>

# 4. Decide estrategia y comienza
```

---

## 📊 Progreso Total

| Sprint | Revista | Año  | Exaltados | Estado      |
|--------|---------|------|-----------|-------------|
| 1      | #01     | 2000 | 23        | ✅ Completado |
| 2      | #02     | ?    | ?         | ⏳ Próximo   |
| 3      | #03     | ?    | ?         | 🔜 Pendiente |
| 4      | #04     | ?    | ?         | 🔜 Pendiente |
| 5      | #05     | ?    | ?         | 🔜 Pendiente |
| 6      | #06     | ?    | ?         | 🔜 Pendiente |
| 7      | #07     | ?    | ?         | 🔜 Pendiente |
| 8      | #08     | ?    | ?         | 🔜 Pendiente |

**Total estimado:** ~200 exaltados en 8 revistas

---

## 🔑 Conceptos Clave

### Orquestador
Sesión principal que:
- Planifica estrategia del sprint
- Coordina sub-sesiones
- Mantiene visión global
- Realiza integración final
- Hace commit

### Sub-sesión
Sesión auxiliar que:
- Ejecuta una fase específica
- Trabajo técnico profundo
- Reporta resultado al orquestador
- Se cierra al completar tarea

### Fase
Unidad de trabajo dentro de un sprint:
- Fase 1: Extracción índice
- Fase 2: Optimización PDF
- Fase 3: OCR biografías
- Fase 4: Fotos históricas (opcional)
- Fase 5: Integración y deploy

---

## 📝 Mantenimiento de Documentación

Al finalizar cada sprint:

1. ✅ Crear `SPRINT-N-RESUMEN.md`
2. ✅ Crear `SPRINT-N+1-PLAN.md`
3. ✅ Actualizar `MEMORIA-ORQUESTADOR.md`
4. ✅ Actualizar esta tabla de progreso

---

## 🤝 Colaboradores

- **Usuario:** Temiban
- **Orquestador:** Claude (Anthropic)
- **Modelo:** Claude Sonnet 4.5

---

**Última actualización:** 4 de octubre de 2025 - Sprint 1 completado
