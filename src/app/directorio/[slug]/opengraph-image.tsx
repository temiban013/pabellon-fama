import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { todosLosExaltados } from "@/data/exaltados-all";
import {
  TAMANO_IMAGEN_SOCIAL,
  nombreCompletoExaltado,
} from "@/lib/directorio/seo";

/**
 * Imagen para compartir de cada perfil (`/directorio/<id>`): 1200×630, con la
 * foto del exaltado, su nombre, el año de exaltación y el nombre del Pabellón.
 *
 * Todas salen con el mismo tamaño y formato aunque la foto original sea
 * pequeña, para que WhatsApp y las redes muestren la vista previa grande en
 * todos los perfiles. Se generan al compilar, una por exaltado.
 */
export const alt =
  "Perfil de exaltado del Pabellón de la Fama del Deporte Humacaeño";
export const size = TAMANO_IMAGEN_SOCIAL;
export const contentType = "image/jpeg";

const ANCHO_FOTO = 420;
const ALTO_FOTO = 520;

export function generateStaticParams() {
  return todosLosExaltados.map((exaltado) => ({ slug: exaltado.id }));
}

async function comoDataUrl(ruta: string, ancho: number, alto: number) {
  try {
    const datos = await sharp(join(process.cwd(), "public", ruta))
      .rotate()
      .resize(ancho, alto, { fit: "cover", position: "top" })
      .jpeg({ quality: 88 })
      .toBuffer();
    return `data:image/jpeg;base64,${datos.toString("base64")}`;
  } catch {
    return undefined;
  }
}

function tamanoNombre(nombre: string): number {
  if (nombre.length <= 20) return 68;
  if (nombre.length <= 32) return 58;
  return 48;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exaltado = todosLosExaltados.find((e) => e.id === slug);

  const nombre = exaltado
    ? nombreCompletoExaltado(exaltado).replace(/"([^"]*)"/g, "“$1”")
    : "Directorio de Exaltados";
  const etiqueta = exaltado ? `EXALTACIÓN ${exaltado.anoExaltacion}` : "";
  const deportes = exaltado ? exaltado.deportes.join(" · ") : "";
  const foto = exaltado?.foto
    ? await comoDataUrl(exaltado.foto, ANCHO_FOTO, ALTO_FOTO)
    : undefined;
  const logo = `data:image/png;base64,${await readFile(
    join(process.cwd(), "public/images/pabellon-logo.png"),
    "base64",
  )}`;

  const imagen = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "linear-gradient(135deg, #166534, #15803d)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            alignItems: "center",
            padding: "0 64px",
          }}
        >
          {foto && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
              src={foto}
              width={ANCHO_FOTO}
              height={ALTO_FOTO}
              style={{
                borderRadius: 20,
                border: "8px solid #ffffff",
                marginRight: 56,
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {etiqueta && (
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  letterSpacing: 4,
                  color: "#fbbf24",
                }}
              >
                {etiqueta}
              </div>
            )}
            <div
              style={{
                display: "flex",
                fontSize: tamanoNombre(nombre),
                lineHeight: 1.15,
                marginTop: 18,
              }}
            >
              {nombre}
            </div>
            <div
              style={{
                display: "flex",
                width: 120,
                height: 6,
                backgroundColor: "#f59e0b",
                marginTop: 28,
              }}
            />
            {deportes && (
              <div
                style={{
                  display: "flex",
                  fontSize: 32,
                  color: "#fffbeb",
                  marginTop: 24,
                }}
              >
                {deportes}
              </div>
            )}
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 44 }}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                src={logo}
                width={54}
                height={72}
                style={{ marginRight: 18 }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 24,
                  color: "#fffbeb",
                }}
              >
                <div style={{ display: "flex" }}>Pabellón de la Fama</div>
                <div style={{ display: "flex" }}>del Deporte Humacaeño</div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 20,
            backgroundColor: "#f59e0b",
          }}
        />
      </div>
    ),
    size,
  );

  // ImageResponse produce PNG; se entrega en JPEG, mucho más liviano para una
  // imagen con foto.
  const jpeg = await sharp(Buffer.from(await imagen.arrayBuffer()))
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": contentType },
  });
}
