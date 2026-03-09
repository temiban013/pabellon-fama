// Email templates for the contribucion (data enrichment) form

interface AdminEmailData {
  exaltadoId: string;
  exaltadoNombre: string;
  contribuidorNombre: string;
  contribuidorEmail: string;
  contribuidorTelefono?: string;
  relacionConExaltado: string;
  relacionDetalle?: string;
  tipoContribucion: string;
  tipoLabel: string;
  informacion: string;
  estadisticasEspecificas?: Array<{
    categoria: string;
    dato: string;
    valor: string;
    temporadaOAno?: string;
    equipo?: string;
  }>;
  datosPersonales?: {
    fechaNacimiento?: string;
    lugarNacimiento?: string;
    estatura?: string;
    peso?: string;
    fechaFallecimiento?: string;
    escuelas?: string;
    inicioDeporte?: string;
  };
  fuenteInformacion: string;
  cantidadArchivos?: number;
  refId: string;
  timestamp: string;
}

interface ConfirmationEmailData {
  contribuidorNombre: string;
  exaltadoNombre: string;
  tipoLabel: string;
  refId: string;
}

const relacionLabels: Record<string, string> = {
  familiar: "Familiar",
  "companero-equipo": "Compañero de Equipo",
  entrenador: "Entrenador",
  periodista: "Periodista",
  aficionado: "Aficionado",
  historiador: "Historiador",
  otro: "Otro",
};

export function buildAdminNotificationEmail(data: AdminEmailData): string {
  const relacionLabel =
    relacionLabels[data.relacionConExaltado] || data.relacionConExaltado;

  let estadisticasHtml = "";
  if (data.estadisticasEspecificas && data.estadisticasEspecificas.length > 0) {
    const rows = data.estadisticasEspecificas
      .map(
        (e) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${e.categoria}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${e.dato}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${e.valor}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${e.temporadaOAno || "—"}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${e.equipo || "—"}</td>
        </tr>`
      )
      .join("");

    estadisticasHtml = `
      <div style="margin: 20px 0;">
        <h3 style="color: #1e3a8a; font-size: 16px; margin-bottom: 10px;">📊 Estadísticas Específicas</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Categoría</th>
              <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Dato</th>
              <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Valor</th>
              <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Temporada/Año</th>
              <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #d1d5db;">Equipo</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>`;
  }

  let datosPersonalesHtml = "";
  if (data.datosPersonales) {
    const dp = data.datosPersonales;
    const fields: Array<[string, string | undefined]> = [
      ["Fecha de Nacimiento", dp.fechaNacimiento],
      ["Lugar de Nacimiento", dp.lugarNacimiento],
      ["Estatura", dp.estatura],
      ["Peso", dp.peso],
      ["Fecha de Fallecimiento", dp.fechaFallecimiento],
      ["Escuelas", dp.escuelas],
      ["Inicio en el Deporte", dp.inicioDeporte],
    ];

    const filledFields = fields.filter(([, v]) => v);
    if (filledFields.length > 0) {
      const rows = filledFields
        .map(
          ([label, value]) => `
          <div style="margin: 8px 0; padding: 6px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 180px;">${label}:</span>
            <span style="color: #374151;">${value}</span>
          </div>`
        )
        .join("");

      datosPersonalesHtml = `
        <div style="background: #f9fafb; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #1e3a8a; font-size: 16px;">👤 Datos Personales Contribuidos</h3>
          ${rows}
        </div>`;
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📝 Nueva Contribución de Datos</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Pabellón de la Fama del Deporte Humacaeño</p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; margin-top: 0;">
          Se ha recibido una nueva contribución de datos para un exaltado.
        </p>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Referencia:</strong> ${data.refId}<br>
            <strong>Exaltado:</strong> ${data.exaltadoNombre}<br>
            <strong>Tipo:</strong> <span style="display: inline-block; background: #f59e0b; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">${data.tipoLabel}</span>
          </p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
          <h2 style="margin-top: 0; color: #1e3a8a; font-size: 18px;">📋 Información del Contribuidor</h2>

          <div style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 140px;">Nombre:</span>
            <span style="color: #374151;"><strong>${data.contribuidorNombre}</strong></span>
          </div>

          <div style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 140px;">Email:</span>
            <span style="color: #374151;">
              <a href="mailto:${data.contribuidorEmail}" style="color: #2563eb; text-decoration: none;">${data.contribuidorEmail}</a>
            </span>
          </div>

          <div style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 140px;">Teléfono:</span>
            <span style="color: #374151;">${data.contribuidorTelefono || "No proporcionado"}</span>
          </div>

          <div style="margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 140px;">Relación:</span>
            <span style="color: #374151;">
              <span style="display: inline-block; background: #f59e0b; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">${relacionLabel}</span>
              ${data.relacionDetalle ? `<br><span style="font-size: 13px; color: #6b7280; margin-top: 4px; display: inline-block;">${data.relacionDetalle}</span>` : ""}
            </span>
          </div>

          <div style="margin: 12px 0; padding: 8px 0;">
            <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 140px;">Fecha:</span>
            <span style="color: #374151;">${data.timestamp}</span>
          </div>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af; font-size: 16px;">💬 Información Contribuida</h3>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.informacion}</p>
        </div>

        ${estadisticasHtml}
        ${datosPersonalesHtml}

        <div style="background: #f9fafb; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #1e3a8a; font-size: 16px;">📎 Fuente y Documentación</h3>
          <div style="margin: 8px 0; padding: 6px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 180px;">Fuente de Información:</span>
            <span style="color: #374151;">${data.fuenteInformacion}</span>
          </div>
          ${
            data.cantidadArchivos && data.cantidadArchivos > 0
              ? `<div style="margin: 8px 0; padding: 6px 0;">
                  <span style="font-weight: 600; color: #1e3a8a; display: inline-block; min-width: 180px;">📎 Archivos Adjuntos:</span>
                  <span style="color: #374151;">${data.cantidadArchivos} archivo${data.cantidadArchivos > 1 ? "s" : ""} adjunto${data.cantidadArchivos > 1 ? "s" : ""} a este email</span>
                </div>`
              : ""
          }
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0; font-size: 14px;">
            <strong>💡 Tip:</strong> Puedes responder directamente a este email para contactar a
            <strong>${data.contribuidorNombre}</strong> en <strong>${data.contribuidorEmail}</strong>
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p style="margin: 5px 0;">
          Este email fue generado automáticamente desde el formulario de contribución en
          <strong>pfdh.org</strong>
        </p>
        <p style="margin: 5px 0; color: #9ca3af;">
          Pabellón de la Fama del Deporte Humacaeño<br>
          Centro Cultural Antonia Sáez, Humacao, Puerto Rico
        </p>
      </div>
    </body>
    </html>`;
}

export function buildContributorConfirmationEmail(
  data: ConfirmationEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">✅ Contribución Recibida</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Pabellón de la Fama del Deporte Humacaeño</p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; margin-top: 0;">
          Estimado/a <strong>${data.contribuidorNombre}</strong>,
        </p>

        <p style="font-size: 15px;">
          Gracias por tu valiosa contribución al Pabellón de la Fama del Deporte Humacaeño.
          Hemos recibido exitosamente la información que enviaste.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #166534; font-size: 16px;">📋 Resumen de tu Contribución</h3>
          <div style="margin: 8px 0; padding: 6px 0; border-bottom: 1px solid #dcfce7;">
            <span style="font-weight: 600; color: #166534; display: inline-block; min-width: 140px;">Exaltado:</span>
            <span style="color: #374151;"><strong>${data.exaltadoNombre}</strong></span>
          </div>
          <div style="margin: 8px 0; padding: 6px 0; border-bottom: 1px solid #dcfce7;">
            <span style="font-weight: 600; color: #166534; display: inline-block; min-width: 140px;">Tipo:</span>
            <span style="color: #374151;">${data.tipoLabel}</span>
          </div>
          <div style="margin: 8px 0; padding: 6px 0;">
            <span style="font-weight: 600; color: #166534; display: inline-block; min-width: 140px;">Referencia:</span>
            <span style="color: #374151; font-family: monospace;">${data.refId}</span>
          </div>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e; font-size: 15px;">📌 Próximos Pasos</h3>
          <ol style="margin: 10px 0 0 0; padding-left: 20px; color: #78350f;">
            <li style="margin: 8px 0;">La Junta de Directores revisará tu contribución.</li>
            <li style="margin: 8px 0;">Se verificará la información proporcionada.</li>
            <li style="margin: 8px 0;">Si se aprueba, los datos serán incorporados al perfil del exaltado.</li>
            <li style="margin: 8px 0;">Te notificaremos cuando se actualice el perfil.</li>
          </ol>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
          Si tienes preguntas o información adicional, puedes responder directamente a este correo o
          comunicarte con nosotros a <a href="mailto:informa@pfdh.org" style="color: #2563eb; text-decoration: none;">informa@pfdh.org</a>.
        </p>

        <p style="font-size: 15px; margin-bottom: 0;">
          ¡Gracias por ayudarnos a preservar la historia deportiva de Humacao!
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p style="margin: 5px 0;">
          <strong>Pabellón de la Fama del Deporte Humacaeño</strong>
        </p>
        <p style="margin: 5px 0; color: #9ca3af;">
          Centro Cultural Antonia Sáez, Humacao, Puerto Rico<br>
          <a href="https://pfdh.org" style="color: #2563eb; text-decoration: none;">pfdh.org</a>
        </p>
      </div>
    </body>
    </html>`;
}
