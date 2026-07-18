# Diseño · Publicación PF-047: handoff, cleanup, Visitas Distinguidas, playbook de edición
**Fecha:** 2026-07-18 · **Aprobado por Mario** (chat, mismo día — incluye la adición de lessons learned)

## Contexto
El video de la entrevista a Rafael «Rafa» Ocasio está publicado: `https://youtu.be/7mxpxoJmi-g`
(corte v10 aceptado, commit `cad3501` en pabellon-media). Cierre operativo + capitalizar lo aprendido.

## Entregables

### 1. Handoff al arquitecto
`.project/coordination/HANDOFF-2026-07-18-supervisor-arquitecto-PF-047-publicacion.md`:
video publicado, estado v10/commit, pendientes que pasan a su gestión (licencia música ‼️,
lista 8 pabellones y ortografías de Félix, srt corregido, design review rótulo Héctor,
registro pabellon-media en protocol-manager, excepción .gitignore), anuncio de la
actualización de Visitas y del playbook/skill nuevos.

### 2. Cleanup (decidido por Mario vía AskUserQuestion)
- `transfer/`: retirar SOLO lo consolidado, verificando destino antes de borrar.
- `coordination/`: crear `archive/` y mover handoffs/reportes PF-047 ejecutados.
- Kdenlive: borrar `v04_backup0.kdenlive` y `v05.kdenlive.srt` (0 bytes) del árbol —
  ambos preservados en git (`cad3501`); nada necesario para recrear producción se pierde.

### 3. Visitas Distinguidas (pabellon-fama)
`src/data/visitas.ts`, entrada `rafael-ocasio-2026`:
- `youtubeId: "7mxpxoJmi-g"` (el componente ya embebe vía youtube-nocookie, patrón Keishla).
- Caption: conservar el actual + añadir: «De aquella visita nació la entrevista que hoy
  compartimos: una conversación con Quique Torres sobre sus ocho exaltaciones, el softball
  de 1948 y los Grises de Humacao.» (hechos verificados en dossier).
- Validación: `npm run build` OK; pruebas de dispositivo (Android real + Chrome/Firefox
  desktop) las hace Mario antes del deploy (AGENTS.md).
- Clasificación: [RETAINER-MAINT] (contenido <2 hrs); señalado al arquitecto.

### 4. Playbook de edición + lessons learned (adición de Mario)
`pabellon-media/docs/PLAYBOOK-EDICION-VIDEO.md`: proceso completo de producir una edición
(brief → fuentes → transcripción/dossier → paquete gráfico Claude Design/Playwright →
proyecto Kdenlive generado → ciclo de edición GUI+merges → transiciones → publicación
YouTube), con TODAS las lecciones técnicas de PF-047 y un checklist de arranque para la
próxima entrevista. Es el documento que hace el proceso «better-than-before» y más rápido.

### 5. Skill `/video-edicion`
`~/.claude/skills/video-edicion/SKILL.md` (nivel usuario — disponible en cualquier sesión):
al invocarla, carga el playbook y aplica sus protocolos (mtime, nombres canónicos, gates).
La integración en protocol-manager server (config.ts) es acción admin → va en el handoff.

## Fuera de alcance
Deploy del sitio (Mario), render/re-subida del video, corrección de subtítulos, Pasada C.

## Commits
Dos, al final, con autorización explícita de Mario:
- pabellon-media: playbook + metadata YouTube v02 + cleanup de residuos.
- pabellon-fama: visitas.ts + handoff + archive/ + este spec.
