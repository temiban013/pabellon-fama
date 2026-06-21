# Museo Virtual 360° — Handoff for Next Session

**Goal of next session:** finalize photo→hotspot assignment. (1) Group-by-group dedup review,
(2) rebuild the tour manifest to **per-display** hotspots (~26), (3) calibrate each hotspot's
position with the editor, (4) retest. The user chose: **per-display granularity**, **build editor**
(done), **group-by-group dedup review with images**, **fresh session** for the rebuild.

## Current state (all saved to the repo working tree, NOT yet committed)

- **Panorama**: authentic client 360° in `public/images/museo/tour/panorama.jpg` (2048×1024, true
  2:1 equirectangular) + `panorama-mobile.jpg`. Renders undistorted. Attribution is generic
  ("Recorrido 360° · Pabellón…"), no Google credit.
- **Photos**: 89 optimized in `public/images/museo/tour/fotos/foto-01..89.jpg` (+ `-thumb`).
- **Viewer/components**: `src/components/museo/{VirtualTour,PanoramaViewer,HotspotMarker,TourLightbox,TourFallback}.tsx`
  — working, verified live. Uses Photo Sphere Viewer v5 (`three@0.179.1`, single copy — do NOT
  reintroduce a second three). CSP in `next.config.ts` already allows `blob:` (required by PSV).
- **Manifest**: `src/lib/museo-tour.ts` STILL HAS THE OLD 9 broad hotspots. **This is the main
  thing to rebuild** into the ~26 per-display hotspots below.
- **Editor** (done): dev-only route `src/app/museo/editor/` + `MuseoEditor.tsx`. Gated by env var.
  Run: `NEXT_PUBLIC_MUSEO_EDITOR=1 npm run build && NEXT_PUBLIC_MUSEO_EDITOR=1 npx next start -p 3000`,
  open `http://localhost:3000/museo/editor`. Click panorama → exact yaw/pitch; edit/add/delete
  hotspots; copy the export textarea into the manifest. 404s in production (flag unset).
- **Catalog**: `docs/museo-tour-catalog.md` — full 89-row table (visible text transcribed),
  burst-group breakdown, and the per-display proposal. `docs/foto-map.tsv` = foto-NN → filename → group.
- **Tests**: `tests/unit/{lib/museo-tour,components/TourLightbox,components/TourFallback}.test.ts`,
  `tests/e2e/flows/museo-tour.spec.ts`. All passing (21 unit + 3 e2e). Will need updating after the
  manifest rebuild (the manifest-integrity test + counts).

## Step 1 — Group-by-group dedup review (user wants to see images)

Rule chosen: **keep zooms, drop wides**, BUT keep a wide if it holds an item no zoom captures.
Per-group comparison montages are prebuilt at `/tmp/museo-review/grp_<timestamp>.jpg` (regen with
`bash /tmp/build-review.sh` if gone; needs `/tmp/multiframe-groups.tsv` from `docs/foto-map.tsv`).
Walk the user through each montage (Read the image), confirm keep/drop.

**Pre-analysis already done** (from the catalog) — default drop the wide, EXCEPT keep these 5
content-rich wides (their zoom misses an item):
- `foto-31` (boxeo+halterofilia collage), `foto-37` & `foto-39` (fútbol **medallas**),
  `foto-55` (beisbolistas photo), `foto-59` (Humacao Grises 1960).

**True duplicates to remove regardless:** `foto-79` (raw frame of foto-78), and one of
`foto-67`/`foto-68` (same scene — keep foto-67).

Default drop list (near-duplicate wides), pending user confirmation per group:
foto-12, 14, 16, 18, 21, 23, 25, 33, 35, 41, 43, 45, 49, 51, 53, 57, 64, 69 + (68, 79).
→ ~24 removed, ~65 kept. Record final decisions inline here before editing files.

### FINAL DECISIONS (2026-06-20, confirmed group-by-group with user via montages)

**DROP — 27 photos** (physically deleted, files + -thumb, no renumbering):
foto-12, 13, 14, 16, 19, 21, 23, 25, 33, 35, 37, 41, 43, 45, 46, 49, 51, 53, 55, 57, 59, 60,
61, 65, 67, 70, 78

**KEEP — 62 photos:**
1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 17, 18, 20, 22, 24, 26, 27, 28, 29, 30, 31, 32, 34, 36,
38, 39, 40, 42, 44, 47, 48, 50, 52, 54, 56, 58, 62, 63, 64, 66, 68, 69, 71, 72, 73, 74, 75, 76,
77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89

Notable deviations from the default pre-analysis (decided by looking at the actual montages):
- Group 131202153 ("10.6 vs Whitfield"): kept BOTH foto-18 (full article) and foto-20 (sharp
  headline crop); dropped foto-19.
- Kept foto-37 dropped → user chose foto-38 only; medals preserved via foto-39 (+foto-40 kept).
- Cross-burst duplicates resolved: foto-13 vs foto-26 (same 4×400 relay) → kept foto-26;
  foto-54 vs foto-60 (same "Tremendo Trabuco" team photo) → kept foto-54 (also has Melquiades Silva).
- foto-67/68 (pink Puig-Sierra-Hernández trio) → kept foto-68; foto-78/79 (Propulsores) → kept foto-79.

CATALOG CAVEAT: `docs/museo-tour-catalog.md` text mislabels several frames (e.g. it described
59/60 as "Grises 1960" and 67/68 as "programa 1966"; the montages show otherwise). When writing
alt/caption text in the manifest, trust the montage images for the inspected groups.

After confirmation: delete dropped `foto-NN.jpg` + `-thumb.jpg`, OR simply omit them from the
manifest and the `galeria` list (decide: physically delete vs just unreference — user said
"eliminate", lean toward delete + renumber-free, keeping slugs stable).

## Step 2 — Rebuild manifest to per-display hotspots (~26)

Proposed exhibits (slug · label · fotos) — from `docs/museo-tour-catalog.md`:

1. `entrada-general` — Vista general de entrada — foto-01, 02
2. `exhibit-laboy-antartica` — Vitrina Alfredo "Juny" Laboy (Maratón Antártica 2024) — foto-03
3. `mesa-trofeos-beisbol` — Mesa central — trofeos béisbol + gorra "PR" — foto-04, 05
4. `vitrina-guante-julio-cora` — Guante de Oro Julio S. Cora (1992) — foto-06
5. `mesa-copas-2021-orientales` — Copas 2021 + libro de visitas + Orientales 2012 — foto-07, 08
6. `pared-lateral-beisbol-historico` — Jersey PR firmado + recortes + trofeo Playa 1982 — foto-09, 10
7. `panel-exaltados-beisbol` — Exaltados BÉISBOL — foto-11 (+foto-72?)
8. `vitrina-pista-campo-fotos-historicas` — Pista y Campo: fotos Manuel Rivera — foto-12*,13,14*,15,16*,17,25*,26,28
9. `vitrina-recortes-manuel-rivera` — Recortes Manuel Rivera — foto-18*,19,20,21*,22,23*,24,27
10. `vitrina-boxeo-historico` — Boxeo histórico (Sixto Escobar, Chú Silva) — foto-29,30,31*,32
11. `vitrina-halterofilia-fotos` — Halterofilia (Jossie Marrero, Vargas Castro) — foto-33*,34,35*,36
12. `vitrina-futbol-libros-medallas` — Fútbol: libros L.R. Álvarez + medallas — foto-37*,38,39*,40
13. `vitrina-futbol-equipos-historicos` — Fútbol equipos (Jumacao FC 1961, Saso Tulier) — foto-41*,42,45*,46,47,48,49*,50
14. `vitrina-fundacional-junta-1998` — 1ra Junta de Directores 1998 — foto-43*,44
15. `vitrina-beisbol-guantes-vintage` — Guantes: Conejo López, Toribio Peña — foto-51*,52,55*,56
16. `vitrina-beisbol-fotos-veteranos` — Veteranos (Tremendo Trabuco, Grises 1960) — foto-53*,54,57*,58,59*,60
17. `vitrina-beisbol-documentos-historicos` — Documentos (rosters 1959, programas) — foto-61*,62,63,64*,65,66,67,69*,70
18. `panel-exaltados-pista-campo` — Exaltados PISTA Y CAMPO — foto-73, 74
19. `panel-exaltados-boxeo` — Exaltados BOXEO (guantes Cleto Reyes) — foto-75
20. `panel-exaltados-lucha` — Exaltados LUCHA — foto-76
21. `panel-exaltados-futbol` — Exaltados FÚTBOL — foto-77
22. `panel-exaltados-propulsores` — Exaltados PROPULSORES — foto-78, (85,86,87; 88?,89?)
23. `panel-exaltados-halterofilia` — Exaltados HALTEROFILIA — foto-80, 81
24. `panel-exaltados-baloncesto-natacion` — Exaltados BALONCESTO + NATACIÓN — foto-82
25. `panel-exaltados-tiro-ciclismo` — Exaltados TIRO + CICLISMO — foto-83
26. `panel-exaltados-pasofino-softbol` — Exaltados PASO FINO + SÓFTBOL — foto-84

`*` = wide flagged for likely removal in Step 1 (remove from list if dropped).

**Spatial note for placement:** the `vitrina-*` exhibits are on the CENTER display tables → place
their hotspots at **downward pitch** (~ −35° to −45°) over the tables. The `panel-exaltados-*` and
trophy exhibits are around the PERIMETER at ~horizon pitch, at the labeled cabinet positions
(labels visible in panorama: PROPULSORES, PISTA Y CAMPO, BOXEO, etc.). Use the editor to get exact
yaw/pitch for each.

## Step 3 — Verify on-site / with user (4 uncertain photos)
- `foto-72` — black panel, label out of frame: Béisbol sub-panel or Pista y Campo? 
- `foto-88`, `foto-89` — panels with names not matching a clear disciplina label → Propulsores? Directores?
- `foto-30` — Chú Silva halterofilia photo, captured among boxeo material → boxeo vitrina vs halterofilia?

## Step 4 — Retest
Update `tests/unit/lib/museo-tour.test.ts` (hotspot count/ids, galeria count after dedup). Run
`npx vitest run` + the museo e2e + `npm run build`. Re-verify live (start tour, open hotspots).
Then commit `[MVP-IMPLEMENTATION]`. Remaining per AGENTS.md: real Android Chrome device test.
