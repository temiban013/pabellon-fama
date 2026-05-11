import type { PdfAsset } from '@/lib/data/nominacion-2026';
import { FileText } from 'lucide-react';

interface ComunicadoPrensaProps {
  comunicadoPdf: PdfAsset;
}

export function ComunicadoPrensa({ comunicadoPdf }: ComunicadoPrensaProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-2">Comunicado de Prensa Oficial</h2>
      <p className="text-sm text-orange-600 font-semibold uppercase tracking-wide mb-6">
        Junta de Directores · PFDH
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        La Junta de Directores del Pabellón de la Fama del Deporte Humacaeño anuncia la apertura del período de nominaciones para la Novena (9na) Exaltación a llevarse a cabo el domingo 8 de noviembre de 2026. Comenzando el 22 de mayo de 2026 hasta el 31 de agosto de 2026, los ciudadanos podrán nominar deportistas en las siguientes categorías: atletas, propulsores y cronistas deportivos. Las boletas de nominación estarán disponibles en las oficinas de Walo Radio, Periódico El Oriental, Radio Victoria y en el Centro Cultural Antonia Sáez.
      </p>

      <blockquote className="border-l-4 border-orange-500 pl-6 py-2 my-6 font-serif text-xl text-blue-900 italic">
        Ser exaltado al Pabellón es la más alta distinción y acto de justicia deportiva más noble que puede recibir un deportista humacaeño. Te invitamos a que participes nominando a aquellos deportistas que entiendas cumplen con todos los requisitos para recibir tan alto honor.
      </blockquote>

      <p className="text-gray-700 leading-relaxed mb-8">
        Para más información se pueden comunicar a los siguientes teléfonos: (787) 209-8250, (787) 559-4013 y (787) 438-0585. Además, pueden acceder nuestra página web:{' '}
        <a
          href="https://pfdh.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-700 underline"
        >
          https://pfdh.org
        </a>
        .
      </p>

      {/* Native <a download> for static asset; next/link does not support the download attribute */}
      <a
        href={comunicadoPdf.url}
        download={comunicadoPdf.downloadFileName}
        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold transition-colors"
      >
        <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
        Descargar comunicado (PDF)
      </a>
    </article>
  );
}
