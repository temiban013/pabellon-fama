import { BoletaDownloadButton } from './BoletaDownloadButton';

interface BoletaDownloadCardProps {
  pdfUrl: string;
  downloadFileName: string;
  apertura: Date;
  cierre: Date;
  sizeLabel?: string;
}

export function BoletaDownloadCard({
  pdfUrl,
  downloadFileName,
  apertura,
  cierre,
  sizeLabel,
}: BoletaDownloadCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-500 max-w-3xl mx-auto">
      <h2 className="text-blue-900 text-2xl font-bold mb-4">
        Descarga la boleta oficial
      </h2>

      <p className="text-gray-700 mb-6">
        La boleta oficial de nominación es el formulario requerido para nominar
        a un candidato para ser exaltado en el Pabellón de la Fama del Deporte
        Humacaeño.
      </p>

      <div className="mb-8">
        <p className="text-gray-700 font-semibold mb-3">Documentos requeridos</p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span
              className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="text-gray-700">
              Resumé (trayectoria deportiva del candidato)
            </span>
          </li>
          <li className="flex items-start">
            <span
              className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="text-gray-700">Semblanza</span>
          </li>
          <li className="flex items-start">
            <span
              className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="text-gray-700">
              Certificados: Nacimiento + Buena Conducta
            </span>
          </li>
          <li className="flex items-start">
            <span
              className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="text-gray-700">Artículos de prensa</span>
          </li>
          <li className="flex items-start">
            <span
              className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0 inline-block"
              aria-hidden="true"
            />
            <span className="text-gray-700">Otros documentos de apoyo</span>
          </li>
        </ul>
      </div>

      {/*
        BoletaDownloadButton is a Client Component that auto-disables outside
        the apertura → cierre window. The download attribute strips the internal
        `-v3` suffix from the saved filename. See BoletaDownloadButton.tsx.
      */}
      <BoletaDownloadButton
        pdfUrl={pdfUrl}
        downloadFileName={downloadFileName}
        apertura={apertura}
        cierre={cierre}
      />

      {sizeLabel && (
        <p className="text-sm text-gray-500 mt-2">{sizeLabel}</p>
      )}
    </div>
  );
}
