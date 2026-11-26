/**
 * Crónica de la Novena Exaltación, del Prof. Félix Báez Neris (PF-087).
 *
 * El texto es el del autor, palabra por palabra: «Reseña 9no Exaltacion.docx»
 * (sha256 4e2170da…7291), recibido el 2026-11-26. No se corrige ni se resume.
 * Solo se reparte en bloques; la cita destacada repite una frase del párrafo
 * que la precede.
 */
import type { BloqueNoticia } from "@/data/noticia-bloques";

export const cuerpoCronicaNovena2026: readonly BloqueNoticia[] = [
  { tipo: "parrafo", texto: "El pasado domingo, 8 de noviembre de 2026, la comunidad deportiva de Humacao se dio cita en el acogedor Centro de Bellas Artes Águedo Mojica Marrero para celebrar la 9na Ceremonia de Exaltación del Pabellón de la Fama del Deporte Humacaeño (PFDH), evento que congregó a figuras ilustres del deporte, autoridades, familiares y entusiastas del deporte." },
  { tipo: "parrafo", texto: "La ceremonia, diligentemente conducida por Melvin (Jay) González, maestro de ceremonia, dio inicio con el llamado al público, seguido de un video introductorio preparado por Héctor Ruiz, el cual resaltó la rica historia del PFDH y su museo." },
  { tipo: "parrafo", texto: "Tras la bienvenida oficial, se llevó a cabo la invocación dirigida por el diácono Nelson Tirado, seguida de un sentido minuto de silencio en honor a los deportistas fallecidos desde la última exaltación: Dr. Miguel Ángel Poupart (Michel), Prof. Pedro J. Dávila Poupart, Prof. Milton Rosario, Sr. Miguel Ángel (Papuso) García, Sr. Juan de Dios Ortiz y Sr. Pedro Tolentino." },
  { tipo: "parrafo", texto: "Se continuó con la presentación formal de invitados especiales y personalidades distinguidas, como la Hon. Rosamar Trujillo, alcaldesa de Humacao, y el Hon. Micky López, alcalde de Las Piedras. Ambos reconocieron la importancia del deporte como pilar de la comunidad y extendieron sus felicitaciones a los exaltados y organizadores. También estuvieron presentes representantes del Departamento de Recreación y Deportes, miembros destacados de la prensa deportiva regional y, por supuesto, los familiares de los nuevos exaltados, quienes abarrotaron el Centro de Bellas Artes y demostraron en todo momento un apoyo incondicional." },
  { tipo: "parrafo", texto: "Posteriormente, se realizó el momento simbólico del cambio de mando en la Presidencia Honorífica, donde el Sr. Antonio Maldonado López cedió elegantemente la estatuilla oficial al Sr. William Méndez, quien asume la presidencia honoraria hasta la próxima exaltación." },
  // Foto del cambio de mando en la Presidencia Honorífica. El pie lo dictó
  // Mario (2026-11-26), que tomó la foto, con las palabras del párrafo anterior.
  {
    tipo: "imagen",
    galeriaId: "novena-exaltacion-2026",
    fotoId: "pxl-20261108-180937988",
    pie: "El Sr. William Méndez recibe la estatuilla oficial de manos del Sr. Antonio Maldonado López al asumir la presidencia honoraria del PFDH",
  },
  { tipo: "parrafo", texto: "Se llevó a cabo la develación de la serigrafía conmemorativa, una edición limitada diseñada por el artista Ángel Vega. La develación contó con la participación de los presidentes de honor, Antonio Maldonado y William Méndez; el presidente del PFDH, Quique Torres; y el vicepresidente, Prof. Félix Báez Neris." },
  { tipo: "parrafo", texto: "Los mensajes especiales estuvieron a cargo del entusiasta presidente del PFDH, Sr. Enrique (Quique) Torres Romero, y el nuevo Presidente de Honor, Sr. William Méndez, quienes destacaron los valores del liderazgo y el compromiso con la excelencia deportiva." },
  { tipo: "subtitulo", texto: "Exaltados – Novena Ceremonia" },
  { tipo: "parrafo", texto: "El momento central de la ceremonia fue la lectura de semblanzas y la exaltación formal de cinco grandes figuras que han brindado gloria y ejemplo a la historia deportiva de Humacao y Puerto Rico:" },
  {
    tipo: "exaltados",
    items: [
      {
        exaltadoId: "jose-m-pancho-rodriguez-castillo",
        nombre: "José M. “Pancho” Rodríguez Castillo",
        disciplina: "Boxeo",
        semblanza: "Pilar del boxeo puertorriqueño, Pancho inició su carrera a los nueve años y forjó una historia legendaria en el cuadrilátero: 81 victorias en 97 combates aficionados, campeón nacional en 112 y 119 libras, participante olímpico a los 17 años en Los Ángeles 1984, medallista mundial (plata y bronce), y figura relevante en la formación de jóvenes como maestro y técnico. Su legado trasciende las medallas, sembrando disciplina y liderazgo en futuras generaciones.",
      },
      {
        exaltadoId: "francisco-betancourt-ibern",
        nombre: "Francisco Betancourt Ibern",
        disciplina: "Propulsor, Béisbol, Sóftbol y Fútbol",
        semblanza: "Incansable promotor y organizador deportivo, Betancourt es fundador del equipo “Los Villanos”, gestor clave en el desarrollo del sóftbol y fútbol en Humacao, y en la creación de la Liga Mayor de Fútbol Nacional. Fue pieza fundamental en la fundación del propio PFDH y ha apoyado competencias internacionales. Su liderazgo inspira y fortalece la identidad deportiva humacaeña.",
      },
      {
        exaltadoId: "obed-santana-acosta",
        nombre: "Obed Santana Acosta",
        disciplina: "Lucha Olímpica",
        semblanza: "Figura influyente de la lucha olímpica en Puerto Rico, Santana inició a los 13 años, fue campeón universitario y miembro de la Selección Nacional, alcanzando la excelencia como atleta, entrenador y directivo. Bajo su presidencia, la Federación de Luchas Asociadas de Puerto Rico experimentó una transformación histórica con múltiples medallas panamericanas y logros mundiales, consolidándolo como símbolo de progreso y mentoría.",
      },
      {
        exaltadoId: "jose-escalera",
        nombre: "José Escalera",
        disciplina: "Atletismo y Béisbol",
        semblanza: "Atleta de élite en salto alto y triple salto, Escalera fue proclamado Atleta Más Valioso de LAI 1990, rompió marcas nacionales y obtuvo títulos internacionales en atletismo máster, además de ser un destacado pelotero municipal. Radicado en Humacao, es hoy mentor de la juventud, promotor de valores y ejemplo de constancia y excelencia.",
      },
      {
        exaltadoId: "victor-vitin-hernandez-lopez",
        nombre: "Víctor M. (Vitín) Hernández López “Regalito”",
        disciplina: "Béisbol y Sóftbol",
        semblanza: "Emblema del béisbol y el sóftbol humacaeño, “Regalito” brilló en el béisbol Doble A, manteniendo notables promedios ofensivos y récords durante los años 70. Contribuyó al desarrollo de pequeñas ligas y, como coach, ha apoyado a nuevas generaciones de peloteros, dejando una huella imborrable en la Ciudad Gris.",
      },
    ],
  },
  { tipo: "parrafo", texto: "Uno de los instantes más solemnes y emotivos de la tarde fue, sin duda, el momento de la juramentación. Los cinco homenajeados, de pie y con la mano derecha en alto, pronunciaron el juramento de honor ante el público, comprometiéndose a engrandecer el legado deportivo de Humacao. Acto seguido, la secretaria Miriam Lasanta y el presidente Enrique “Quique” Torres realizaron la declaración oficial, proclamando a los homenajeados, en nombre del PFDH y ante la comunidad, como nuevos miembros exaltados. Este gesto, lleno de simbolismo y orgullo, selló la trascendencia del reconocimiento y marcó el inicio de una nueva etapa para cada uno de los exaltados." },
  { tipo: "cita", texto: "Uno de los instantes más solemnes y emotivos de la tarde fue, sin duda, el momento de la juramentación." },
  {
    tipo: "imagen",
    galeriaId: "novena-exaltacion-2026",
    fotoId: "pxl-20261108-185943981",
    pie: "Los exaltados de la clase de 2026",
  },
  { tipo: "parrafo", texto: "En ese ambiente cargado de emotividad, los exaltados recibieron de manos del Sr. Enrique Torres la estatuilla del PFDH, el máximo reconocimiento que otorga la institución, como símbolo de su trayectoria, excelencia y aporte al deporte humacaeño. Esta distinción fue recibida con profundo orgullo por cada uno de los homenajeados." },
  { tipo: "parrafo", texto: "Con visible emoción y alegría, los exaltados expresaron su más profundo agradecimiento por este honor, que consideran inmenso tanto a nivel personal como familiar. Muchos resaltaron la importancia de ser reconocidos por su pueblo natal, enfatizando que el sacrificio, la pasión y el amor por el deporte siempre estuvieron acompañados del apoyo incondicional de sus seres queridos. Para cada uno, el ingreso al PFDH representa no solo la culminación de un ciclo de logros deportivos, sino también un reconocimiento que esperan inspire a las futuras generaciones. Además, destacaron que este homenaje constituye un merecido tributo al apoyo brindado por sus familias." },
  { tipo: "parrafo", texto: "La ceremonia incluyó también entrega de obsequios por parte de las autoridades—incluyendo a la alcaldesa Rosamar Trujillo y al alcalde Micky López—y entidades, y cerró con el tradicional espacio de camaradería y fotografías. Después, los asistentes se deleitaron de una variedad de cortes fríos y calientes, así como de sabrosos refrigerios." },
  { tipo: "parrafo", texto: "Sin duda, la 9na Ceremonia de Exaltación reafirmó el valor y la herencia de los grandes deportistas de Humacao, dejando claro que la pasión, la dedicación y el amor por el deporte siguen formando parte fundamental de la Ciudad Gris." },
  {
    tipo: "lista",
    introduccion: "Gracias al excelente trabajo de la Junta de Directores integrada por:",
    items: [
      "Sr. Enrique (Quique) Torres, Presidente",
      "Prof. Félix Báez Neris, Vicepresidente",
      "Sra. Miriam Lasanta, Secretaria",
      "Sr. Juan Velázquez, Tesorero",
      "Sr. Arnaldo (Larry) Ortiz, Vocal",
      "Sr. Jorge Orona, Vocal",
      "Sr. Orlando J. López Rivera, Vocal",
      "Sr. Héctor Ruiz, Vocal",
      "Prof. Luis Reinaldo Álvarez Vázquez, Curador del Museo del PFDH",
    ],
    enlace: { texto: "Conoce a la Junta de Directores", href: "/junta" },
  },
  { tipo: "cierre", texto: "¡Que viva el PFDH!" },
];
