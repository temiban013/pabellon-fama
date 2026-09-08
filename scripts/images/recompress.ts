/**
 * scripts/images/recompress.ts
 * Recompresión in situ de imágenes sobredimensionadas del sitio (PF-062 · WS-C).
 *
 * Uso: pnpm dlx tsx scripts/images/recompress.ts   (ejecutar desde la raíz del repo)
 *
 * Antes de tocar cada archivo se copia el original a SCRATCHPAD_ANTES/<ruta-relativa>
 * si esa copia todavía no existe. Así el script es re-ejecutable: la primera corrida
 * guarda el original real; corridas posteriores no lo pisan.
 */

import { existsSync, mkdirSync, copyFileSync, renameSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

/** Raíz del proyecto (se espera ejecutar el script desde ahí). */
const RAIZ_PROYECTO = process.cwd();

/** Carpeta de originales «antes» de recomprimir (ver cabecera del handoff PF-062 WS-C). */
const SCRATCHPAD_ANTES =
  "/tmp/claude-1000/-home-nitaino-Development-pabellon-fama/b0904286-ca31-46aa-ac2d-903b5b42001f/scratchpad/pf062/antes";

interface Entrada {
  /** Ruta relativa a la raíz del proyecto (siempre dentro de public/). */
  ruta: string;
  /** Lado máximo (ancho y alto) en px para el resize, o null para no redimensionar. */
  ladoMax: number | null;
}

const ENTRADAS: Entrada[] = [
  // --- Exaltados: documentos históricos con rostros pequeños, 2000 px ---
  { ruta: "public/images/exaltados/equipo-1951.jpg", ladoMax: 2000 },
  { ruta: "public/images/exaltados/equipo-1960.jpg", ladoMax: 2000 },
  { ruta: "public/images/exaltados/equipo-juvenil-futbol.jpg", ladoMax: 2000 },
  // --- Exaltados: retratos individuales >250 KB, 1600 px ---
  { ruta: "public/images/exaltados/juan-de-dios-ortiz.jpg", ladoMax: 1600 },
  { ruta: "public/images/exaltados/ismael-rivera-tirado.jpg", ladoMax: 1600 },
  { ruta: "public/images/exaltados/lourdes-vega-gonzalez.jpg", ladoMax: 1600 },
  { ruta: "public/images/exaltados/fernando-maldonado-lopez.jpg", ladoMax: 1600 },
  { ruta: "public/images/exaltados/luis-r-alvarez-vazquez.jpg", ladoMax: 1600 },
  { ruta: "public/images/exaltados/miguel-papuso-garcia-cruz.jpg", ladoMax: 1600 },
  // --- Portadas de revista, 1600 px ---
  { ruta: "public/revistas/portadas/rev02.jpg", ladoMax: 1600 },
  { ruta: "public/revistas/portadas/rev04.jpg", ladoMax: 1600 },
  // --- Historia: 19 páginas escaneadas, 1600 px ---
  { ruta: "public/images/historia/rev1-1.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev1-2.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev1-3.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev1-4.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev1-5.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev2-1.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev2-2.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev2-3.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev2-4.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev3-1.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev3-2.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev5.1.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev5-2.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev6-1.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev6-2.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev6-3.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev6-4.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev8-1.jpeg", ladoMax: 1600 },
  { ruta: "public/images/historia/rev8-2.jpeg", ladoMax: 1600 },
  // --- Junta: 8 retratos, 1600 px ---
  { ruta: "public/images/junta/arnaldo-ortiz.jpg", ladoMax: 1600 },
  { ruta: "public/images/junta/enrique-torres.jpg", ladoMax: 1600 },
  { ruta: "public/images/junta/felix-baez.jpg", ladoMax: 1600 },
  { ruta: "public/images/junta/jorge-orona.jpg", ladoMax: 1600 },
  { ruta: "public/images/junta/juan-velazquez.jpg", ladoMax: 1600 },
  { ruta: "public/images/junta/luis-alvarez.jpg", ladoMax: 1600 },
  { ruta: "public/images/junta/miriam-lasanta.jpg", ladoMax: 1600 },
  { ruta: "public/images/junta/orlando-lopez.jpg", ladoMax: 1600 },
  // --- Museo: archivo con extensión .jpg que en realidad es PNG; solo recodificar ---
  { ruta: "public/images/museo/fachada-museo.jpg", ladoMax: null },
];

interface Resultado {
  ruta: string;
  antesBytes: number;
  antesWH: string;
  despuesBytes: number;
  despuesWH: string;
  saltado: boolean;
}

/** Copia el original al scratchpad de «antes» si esa copia no existe todavía. */
function copiarAntesSiFalta(rutaAbs: string, rutaRelativa: string): void {
  const destino = join(SCRATCHPAD_ANTES, rutaRelativa);
  if (existsSync(destino)) return;
  mkdirSync(dirname(destino), { recursive: true });
  copyFileSync(rutaAbs, destino);
}

/**
 * Criterio de idempotencia: si el archivo actual ya es un JPEG progresivo y
 * (cuando aplica un límite de tamaño) su lado más largo ya es <= ladoMax,
 * se considera ya optimizado y se salta el reprocesamiento.
 */
async function yaEstaOptimizada(rutaAbs: string, ladoMax: number | null): Promise<boolean> {
  const meta = await sharp(rutaAbs).metadata();
  if (meta.format !== "jpeg") return false;
  if (meta.isProgressive !== true) return false;
  if (ladoMax === null) return true;
  const ladoLargo = Math.max(meta.width ?? 0, meta.height ?? 0);
  return ladoLargo <= ladoMax;
}

async function procesar(entrada: Entrada): Promise<Resultado> {
  const rutaAbs = join(RAIZ_PROYECTO, entrada.ruta);
  const antesStat = statSync(rutaAbs);
  const antesMeta = await sharp(rutaAbs).metadata();
  const antesWH = `${antesMeta.width ?? "?"}x${antesMeta.height ?? "?"}`;

  // La copia del original se hace ANTES de cualquier escritura, y es idempotente.
  copiarAntesSiFalta(rutaAbs, entrada.ruta);

  if (await yaEstaOptimizada(rutaAbs, entrada.ladoMax)) {
    return {
      ruta: entrada.ruta,
      antesBytes: antesStat.size,
      antesWH,
      despuesBytes: antesStat.size,
      despuesWH: antesWH,
      saltado: true,
    };
  }

  const rutaTmp = `${rutaAbs}.tmp`;
  let pipeline = sharp(rutaAbs).rotate();
  if (entrada.ladoMax !== null) {
    pipeline = pipeline.resize({
      width: entrada.ladoMax,
      height: entrada.ladoMax,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(rutaTmp);
  renameSync(rutaTmp, rutaAbs);

  const despuesStat = statSync(rutaAbs);
  const despuesMeta = await sharp(rutaAbs).metadata();
  const despuesWH = `${despuesMeta.width ?? "?"}x${despuesMeta.height ?? "?"}`;

  return {
    ruta: entrada.ruta,
    antesBytes: antesStat.size,
    antesWH,
    despuesBytes: despuesStat.size,
    despuesWH,
    saltado: false,
  };
}

async function main(): Promise<void> {
  const resultados: Resultado[] = [];
  for (const entrada of ENTRADAS) {
    resultados.push(await procesar(entrada));
  }

  console.log("");
  console.log("Ruta | Antes (bytes · WxH) | Después (bytes · WxH) | % ahorro | Estado");
  console.log("-".repeat(100));

  let totalAntes = 0;
  let totalDespues = 0;
  for (const r of resultados) {
    const ahorro =
      r.antesBytes > 0 ? (100 * (1 - r.despuesBytes / r.antesBytes)).toFixed(1) : "0.0";
    const estado = r.saltado ? "sin cambios (ya óptima)" : "recomprimida";
    console.log(
      `${r.ruta} | ${r.antesBytes} B · ${r.antesWH} | ${r.despuesBytes} B · ${r.despuesWH} | ${ahorro}% | ${estado}`
    );
    totalAntes += r.antesBytes;
    totalDespues += r.despuesBytes;
  }

  const ahorroTotal = totalAntes > 0 ? (100 * (1 - totalDespues / totalAntes)).toFixed(1) : "0.0";
  console.log("-".repeat(100));
  console.log(`TOTAL: ${totalAntes} B -> ${totalDespues} B (${ahorroTotal}% de ahorro)`);
}

main().catch((error: unknown) => {
  console.error("Error al recomprimir imágenes:", error);
  process.exitCode = 1;
});
