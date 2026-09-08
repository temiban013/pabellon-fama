/**
 * scripts/images/build-icons.ts
 * Reconstruye los iconos PNG y el favicon.ico del sitio a partir de la copia
 * «antes» del PNG maestro icon-512.png (PF-062 · WS-C).
 *
 * No hay ImageMagick disponible: el favicon.ico se empaqueta a mano en formato
 * ICO (cabecera ICONDIR + ICONDIRENTRY, ver
 * https://en.wikipedia.org/wiki/ICO_(file_format)), incrustando cada entrada
 * como un PNG completo (soportado desde Windows Vista en adelante).
 *
 * Uso: pnpm dlx tsx scripts/images/build-icons.ts
 */

import { existsSync, mkdirSync, copyFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const RAIZ_PROYECTO = process.cwd();
const SCRATCHPAD_ANTES =
  "/tmp/claude-1000/-home-nitaino-Development-pabellon-fama/b0904286-ca31-46aa-ac2d-903b5b42001f/scratchpad/pf062/antes";

/** Fuente maestra: el icon-512.png original (antes de cualquier recompresión). */
const FUENTE_MAESTRA_RELATIVA = "public/icon-512.png";

/** Opciones de codificación PNG: paleta indexada, conserva alpha (iconos maskable). */
const OPCIONES_PNG = {
  palette: true,
  quality: 90,
  compressionLevel: 9,
  effort: 10,
} as const;

interface EntradaIco {
  lado: number;
  datosPng: Buffer;
}

function copiarAntesSiFalta(rutaAbs: string, rutaRelativa: string): void {
  const destino = join(SCRATCHPAD_ANTES, rutaRelativa);
  if (existsSync(destino)) return;
  mkdirSync(dirname(destino), { recursive: true });
  copyFileSync(rutaAbs, destino);
}

/** Empaqueta N imágenes PNG en un único archivo .ico (formato ICONDIR/ICONDIRENTRY). */
function empaquetarIco(entradas: EntradaIco[]): Buffer {
  const TAMANO_CABECERA = 6; // ICONDIR: reserved(2) + type(2) + count(2)
  const TAMANO_ENTRADA = 16; // ICONDIRENTRY

  const cabecera = Buffer.alloc(TAMANO_CABECERA);
  cabecera.writeUInt16LE(0, 0); // reserved, siempre 0
  cabecera.writeUInt16LE(1, 2); // type: 1 = icono
  cabecera.writeUInt16LE(entradas.length, 4); // cantidad de imágenes

  const directorios: Buffer[] = [];
  const payloads: Buffer[] = [];
  let offset = TAMANO_CABECERA + TAMANO_ENTRADA * entradas.length;

  for (const { lado, datosPng } of entradas) {
    const entrada = Buffer.alloc(TAMANO_ENTRADA);
    const ladoCodificado = lado === 256 ? 0 : lado; // 0 significa 256 px en el formato ICO
    entrada.writeUInt8(ladoCodificado, 0); // width
    entrada.writeUInt8(ladoCodificado, 1); // height
    entrada.writeUInt8(0, 2); // colorCount (0 = sin paleta clásica)
    entrada.writeUInt8(0, 3); // reserved
    entrada.writeUInt16LE(1, 4); // planes
    entrada.writeUInt16LE(32, 6); // bitCount (RGBA)
    entrada.writeUInt32LE(datosPng.length, 8); // bytesInRes
    entrada.writeUInt32LE(offset, 12); // imageOffset
    directorios.push(entrada);
    payloads.push(datosPng);
    offset += datosPng.length;
  }

  return Buffer.concat([cabecera, ...directorios, ...payloads]);
}

async function main(): Promise<void> {
  const rutaFuenteAbs = join(RAIZ_PROYECTO, FUENTE_MAESTRA_RELATIVA);
  copiarAntesSiFalta(rutaFuenteAbs, FUENTE_MAESTRA_RELATIVA);
  const rutaMaestra = join(SCRATCHPAD_ANTES, FUENTE_MAESTRA_RELATIVA);

  const reporte: Array<{ ruta: string; antes: number; despues: number }> = [];

  // --- icon-512.png / icon-192.png (maskable, conservan alpha) ---
  for (const lado of [512, 192] as const) {
    const rutaRelativa = `public/icon-${lado}.png`;
    const rutaAbs = join(RAIZ_PROYECTO, rutaRelativa);
    const antesBytes = statSync(rutaAbs).size;
    await sharp(rutaMaestra)
      .resize(lado, lado, { fit: "contain" })
      .png(OPCIONES_PNG)
      .toFile(rutaAbs);
    reporte.push({ ruta: rutaRelativa, antes: antesBytes, despues: statSync(rutaAbs).size });
  }

  // --- favicon-16x16.png / favicon-32x32.png, si existen: regenerar por coherencia ---
  for (const lado of [16, 32] as const) {
    const rutaRelativa = `public/favicon-${lado}x${lado}.png`;
    const rutaAbs = join(RAIZ_PROYECTO, rutaRelativa);
    if (!existsSync(rutaAbs)) continue;
    copiarAntesSiFalta(rutaAbs, rutaRelativa);
    const antesBytes = statSync(rutaAbs).size;
    await sharp(rutaMaestra)
      .resize(lado, lado, { fit: "contain" })
      .png(OPCIONES_PNG)
      .toFile(rutaAbs);
    reporte.push({ ruta: rutaRelativa, antes: antesBytes, despues: statSync(rutaAbs).size });
  }

  // --- favicon.ico: empaquetar PNG de 16/32/48 ---
  const rutaFavicon = join(RAIZ_PROYECTO, "public/favicon.ico");
  copiarAntesSiFalta(rutaFavicon, "public/favicon.ico");
  const antesFaviconBytes = statSync(rutaFavicon).size;

  const entradasIco: EntradaIco[] = [];
  for (const lado of [16, 32, 48]) {
    const datosPng = await sharp(rutaMaestra)
      .resize(lado, lado, { fit: "contain" })
      .png(OPCIONES_PNG)
      .toBuffer();
    entradasIco.push({ lado, datosPng });
  }
  writeFileSync(rutaFavicon, empaquetarIco(entradasIco));
  reporte.push({
    ruta: "public/favicon.ico",
    antes: antesFaviconBytes,
    despues: statSync(rutaFavicon).size,
  });

  console.log("");
  console.log("Icono | Antes (bytes) | Después (bytes) | % ahorro");
  console.log("-".repeat(70));
  for (const r of reporte) {
    const ahorro = r.antes > 0 ? (100 * (1 - r.despues / r.antes)).toFixed(1) : "0.0";
    console.log(`${r.ruta} | ${r.antes} B | ${r.despues} B | ${ahorro}%`);
  }
}

main().catch((error: unknown) => {
  console.error("Error al construir los iconos:", error);
  process.exitCode = 1;
});
