import { NOMINACION_2026 } from "@/lib/data/nominacion-2026";
import { AlertCircle, MapPin, Clock, Phone, Mail } from "lucide-react";

export function InstruccionesEntrega() {
  const { contacto, puntosDistribucion, ceremonia } = NOMINACION_2026;
  const { telefonoPrincipal, telefonosAdicionales, email } = contacto;

  const ceremoniaFechaFormateada = new Intl.DateTimeFormat("es-PR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Puerto_Rico",
  }).format(ceremonia.fecha);

  return (
    <section>
      {/* 1. Section heading */}
      <h2 className="text-3xl font-bold text-blue-900 text-center mb-3">
        Cómo entregar tu nominación
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        Solo se aceptan boletas en persona. La Junta no procesa entregas
        digitales.
      </p>

      {/* 2. Banner: solo-presencial */}
      <div className="bg-amber-50 border-l-4 border-orange-500 rounded-lg p-6 mb-10 max-w-4xl mx-auto">
        <div className="flex">
          <AlertCircle
            className="h-6 w-6 text-orange-600 flex-shrink-0 mr-3 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">
              Entrega presencial únicamente
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Las boletas completadas deben entregarse en persona.{" "}
              <strong>
                No se aceptan boletas por correo electrónico ni formularios en
                línea.
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Column A: Puntos de distribución */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Puntos de distribución de boletas físicas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Recoge una boleta física en cualquiera de estos cuatro lugares.
          </p>
          <ul className="space-y-3">
            {puntosDistribucion.map((punto) => (
              <li key={punto.nombre} className="flex items-start">
                <span
                  className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0 inline-block"
                  aria-hidden="true"
                />
                <span className="text-gray-700">
                  <span className="font-semibold">{punto.nombre}</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ml-2">
                    {punto.tipo}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column B: Sede principal — contacto */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Sede principal del PFDH
          </h3>

          {/* Dirección */}
          <div className="flex items-start mb-4">
            <MapPin
              className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1 mr-3"
              aria-hidden="true"
            />
            <address className="not-italic text-gray-700">
              Centro Cultural Dra. Antonia Sáez
              <br />
              Calle Antonio López #53
              <br />
              Humacao, PR 00791
            </address>
          </div>

          {/* Horario */}
          <div className="flex items-start mb-4">
            <Clock
              className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1 mr-3"
              aria-hidden="true"
            />
            <span className="text-gray-700">
              Lunes a Viernes, 8:00 AM – 4:00 PM
            </span>
          </div>

          {/* Teléfonos */}
          <div className="flex items-start mb-4">
            <Phone
              className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1 mr-3"
              aria-hidden="true"
            />
            <div>
              <a
                href={`tel:${telefonoPrincipal.replace(/-/g, "")}`}
                className="text-blue-900 hover:text-orange-600 transition-colors font-medium"
              >
                {telefonoPrincipal}
              </a>
              <p className="text-sm text-gray-600 mt-1">
                Adicionales:{" "}
                {telefonosAdicionales.map((tel, index) => (
                  <span key={tel}>
                    <a
                      href={`tel:${tel.replace(/-/g, "")}`}
                      className="text-blue-900 hover:text-orange-600 transition-colors font-medium"
                    >
                      {tel}
                    </a>
                    {index < telefonosAdicionales.length - 1 && " · "}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start mb-4">
            <Mail
              className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1 mr-3"
              aria-hidden="true"
            />
            <a
              href={`mailto:${email}`}
              className="text-blue-900 hover:text-orange-600 transition-colors font-medium"
            >
              {email}
            </a>
          </div>

          {/* Cómo llegar */}
          <a
            href="https://maps.google.com/?q=Centro+Cultural+Antonia+Saez+Humacao+PR"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-orange-600 hover:text-orange-700 font-semibold text-sm"
          >
            Ver en Google Maps →
          </a>
        </div>
      </div>

      {/* 4. Conditional sede de ceremonia block */}
      {ceremonia.lugar !== null && (
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Sede de la ceremonia
          </h3>
          <p className="text-gray-700">{ceremonia.lugar}</p>
          <p className="text-sm text-gray-500 mt-1">
            {ceremoniaFechaFormateada}
          </p>
        </div>
      )}
    </section>
  );
}
