/**
 * Exaltados de la Revista #04 (Año 2006)
 * Cuarta Exaltación - 5 de noviembre de 2006
 * Total: 10 exaltados (9 individuos + 1 equipo)
 *
 * Categorías:
 * - Atletas: 8
 * - Propulsores: 1
 * - Equipos: 1
 *
 * NOTA: Biografías extraídas del PDF - pueden contener errores menores
 * que serán corregidos en revisiones futuras
 */

import { ExaltadoRevista } from '@/lib/types/revista';

export const rev04Exaltados: ExaltadoRevista[] = [
  {
    id: 'juan-ramon-garcia',
    foto: '/images/exaltados/juan-ramon-garcia.jpg',
    nombre: 'Juan Ramón',
    apellidos: 'García',
    categoria: 'ATLETA',
    deportes: ['Atletismo'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 14,
    paginaFin: 14,
    contenido: {
      biografia: `Nació el 17 de mayo de 1922 en el barrio Antón Ruiz, hijo de Juan y Paula. En 1946 contrajo matrimonio con Gloria López y procrearon tres hijos: Juan Ramón Jr., Vilma y Carlos (Q.E.P.D). Completó se educación elemental, intermedia y superior en las escuelas públicas de Humacao y su juventud y vida deportiva transcurrieron en la Central Pasto Viejo.

El deportista Juan Pérez, mejor conocido por Quisó, descubre en la escuela superior las habilidades de Juan Ramón como corredor de distancias cortas y comienza a darle prácticas después de la escuela. Luego el instructor Julio Francis Edwards continúa entrenándolo en los eventos de: 100 metros, 110 metros con vallas y 200 metros.

En estos eventos de pista y campo participó a nivel a local y regional, siendo el mejor a nivel local. Su entusiasmo, dedicación y disciplina lo mantuvieron como el campeón indiscutible en sus eventos y el mejor atleta de Escuela Superior de 1938 al 1942.

También obtuvo reconocimiento en el equipo de pelota de la Escuela Superior como jardinero central y campo corto alterno. Además formó parte del equipo de softbol de la Región de Humacao.

Luego de su Escuela Superior fue reclutado por el Ejército de los Estados Unido donde sirvió dos años y medio como Sargento de las Fuerzas Armadas y fue licenciado honorablemente.

Laboró en el Gobierno Federal por veintiocho años y medio, estableció un negocio de vaquería y actualmente disfruta de su retiro en el pueblo que lo vio nacer.`,
      logros: [
        'Campeón indiscutible de atletismo en Escuela Superior (1938-1942)',
        'Eventos: 100m, 110m con vallas, 200m',
        'Sargento del Ejército de Estados Unidos',
        'Laboró 28.5 años en Gobierno Federal'
      ],
    }
  },

  {
    id: 'ivan-carradero-muriel',
    foto: '/images/exaltados/ivan-carradero-muriel.jpg',
    nombre: 'Iván',
    apellidos: 'Carradero Muriel',
    categoria: 'ATLETA',
    deportes: ['Béisbol'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 15,
    paginaFin: 15,
    contenido: {
      biografia: `Nació el 7 de abril de 1994 en la ciudad de Humacao. Su padre es el Sr. Adrián Carradero y su madre la Sra. Josefina Muriel. Sus hermanos son Luz, Nilda, José, Héctor y Adalberto. Sus hijos son Iván Manuel, José Iván, Millielymar, Iván Jr. y Arnaldo Iván.

los 12 años comenzó a desarrollar sus habilidades como lanzador en el parque Jacinto Hernández de Humacao junto a Néstor Morales, Rubén "El Conejo" López, Reinaldo Álvarez, José Ortiz y Pedro Montañez. fines de la década del '60' participó en los Torneos Interurbanos de la Corporación de Renovación Urbana y Vivienda (CRUV). Para entonces jugaba en el campo además de lanzar ocasionalmente.

los quince años firmó con el Equipo Clase A de Naguabo. Al año siguiente jugó con el equipo Clase A de Humacao cuyo apoderado Melquíades Silva Anderson, lo motivó a que se convirtiera en lanzador. En 1961, en un juego de exhibición, lanzó un juego sin hits ni carreras contra Naguabo. Los Azucareros de Yabucoa le dieron el primer contrato en el Béisbol Doble A.

En 1962, tuvo 9 victorias y 5 derrotas, efectividad de 2.30 y abanicó a 113 en 125 entradas y se convirtió en lanzador regular de los Azucareros. Se integró a la Selección Nacional para los IX Juegos Centroamericanos del Caribe celebrados en Jamaica y en donde Puerto Rico obtuvo medalla de plata.

Participa en una serie de Béisbol en Colombia. Juncos ganó el torneo e Iván, como refuerzo, fue el jugador más valioso como bateador y lanzador al ganar dos juegos, entre ellos el decisivo.

En 1967, Iván regresó al equipo de su Patria Chica y con su hermano Chemane como receptor, tuvo marca de 8-0, con efectividad de 1.96. Bateó para.379 con 2 dobles, 3 triples e impulsó 10 carreras. "El Estelar Iván Carradero" se retiró con un envidiable historial de 52 victorias y 25 derrotas, efectividad de 3.15 y 449 bateadores ponchados.

El 24 de noviembre de 1991 fue exaltado al Recinto de los Inmortales del Béisbol Puertorriqueño junto a su hermano Chemane.`,
      logros: [
        'Record: 52 victorias, 25 derrotas, efectividad 3.15',
        '449 bateadores ponchados',
        'Medalla de plata en IX Juegos Centroamericanos (Jamaica, 1962)',
        'Juego sin hits ni carreras vs Naguabo (1961)',
        'Exaltado al Recinto de Inmortales del Béisbol Puertorriqueño (1991)'
      ],
    }
  },

  {
    id: 'ruben-conejo-lopez',
    foto: '/images/exaltados/ruben-conejo-lopez.jpg',
    nombre: 'Rubén',
    apodo: 'Conejo',
    apellidos: 'López',
    categoria: 'ATLETA',
    deportes: ['Béisbol'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 16,
    paginaFin: 16,
    contenido: {
      biografia: `Nació en la Cuidad Gris el 14 de marzo de 1941. Rubén es hijo de Jorge y Leonarda y tiene un hermano y tres hermanas. Actualmente se desempeña como Director Regional del DRD.

Desde temprana edad, Rubén dio muestras inequívocas de su talento peloteril. Fue el mascota del equipo campeón de Humacao en el año 1951. En el 1959 dio inicio a una carrera de 16 años en el Béisbol Superior que lo hizo ser reconocido en el país como uno de los mejores de su época. En la Doble A, participó mayormente con los Grises Orientales de Humacao y con los Cardenales de Río Piedras. También vistió el uniforme de Yabucoa y de los Mulos del Valenciano de Juncos. Jugador versátil que podía desempeñarse de forma sobresaliente en cualquier posición del cuadro incluyendo el campo corto de Humacao en la década del '60' y compartía con Néstor Morales y Gino Guerra en la parte gruesa de la ofensiva de los Grises Orientales. Con los Cardenales de Río Piedras tuvo actuaciones bien destacadas que con justicia le merecieron ser considerado una indiscutible estrella de este béisbol. Fildeador de manos seguras, buen brazo y de gran astucia beisbolera, con una enorme habilidad para jugar sin la bola y colocarse en el terreno para compensar su falta de velocidad. Bateador agresivo de buenos promedios, de líneas fuertes y siempre oportunas, que al paso de los años y con unas libras adicionales desarrolló gran poder en sus brazos, que escaseaban en el comienzo de su larga y productiva carrera.

Su irrefutable liderato y reconocida sapiencia del juego-que más tarde lo convirtieron en exitoso dirigente-fueron atributos adicionales que lo convirtieron en un excelente jugador que los fanáticos disfrutaban verlo desempeñarse en el terreno de juego. Una vez se cantaba "béisbol" y hasta el final del juego, nunca dio ni pidió tregua, lo daba todo por el equipo y de varias formas ayudaba al triunfo de su equipo. Por todas estas credenciales, siempre fue respetado y admirado por sus compañeros de equipo y por sus adversarios. Todos esos atributos los llevaron a los Equipos Nacionales de Béisbol y de Sóftbol por varios años. Rubén participó en los Juegos Centroamericanos y del Caribe de 1966, celebrados en San Juan. Rubén "Conejo" López fue exaltado al Recinto de Inmortales del Béisbol Aficionado por ser uno de los más destacados peloteros de este Béisbol Regionalista y Apasionado.`,
      logros: [
        'Carrera de 16 años en Béisbol Superior (1959-1975)',
        'Mascota equipo campeón Humacao 1951',
        'Juegos Centroamericanos y del Caribe 1966 (San Juan)',
        'Exaltado al Recinto de Inmortales del Béisbol Aficionado',
        'Director Regional del DRD'
      ],
    }
  },

  {
    id: 'angel-pipa-sierra-ruffat',
    foto: '/images/exaltados/angel-pipa-sierra-ruffat.jpg',
    nombre: 'Ángel',
    apodo: 'Pipá',
    apellidos: 'Sierra Ruffat',
    categoria: 'ATLETA',
    deportes: ['Béisbol'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 17,
    paginaFin: 17,
    contenido: {
      biografia: `Nació en Humacao el 23 de septiembre de 1950 producto de la unión entre Ignacio Sierra y Felicita Ruffat. Cariñosamente apodado "Pipá", participó en las Ligas Pequeñas de Humacao y representó a Puerto Rico en el Torneo Mundial de Little League celebrado en los E. U. Fue en calidad de refuerzo del equipo Campeón de P. R. y resultó ser uno de los jugadores mas destacados en ese torneo.

Pipá jugó en la ligas juveniles en Humacao con equipos organizados por Monge y Melquíades Silva Anderson. En la Liga Babe Ruth, categoría juvenil, fue parte del equipo de Puerto Nuevo, Campeón de P. R. y dirigido por el gran deportista Jerry Rodríguez. Vio acción con el equipo Malta Corona de Humacao en la categoría Clase A.

Todo joven pelotero humacaeño sueña ponerse el uniforme de los Grises Orientales y Pipá comenzó a jugar Doble A con Humacao en 1968 a los 18 años. El novato bateó para.288, con 26 indiscutibles en 90 turnos con 14 carreras anotadas, 3 empujadas y 4 bases robadas. Ese año en la Serie Semi Final bateó para.285. Al siguiente año, Pipá comenzó a demostrar su calidad ofensiva al promediar para.345, con 29 sencillos, 6 dobles y 3 triples, 27 carreras anotadas y 11 impulsadas. Esta actuación lo llevó por primera vez al Juego de Estrellas de la Doble A. Continuó validando su clase poleteril y volvió al Todos Estrellas en 1956, 1971 y 1977.

Pipá logró sus mejores campañas ofensivas en 1981 con un promedio de.417 y en 1983 repitió su excelencia en el manejo del bate al conectar para.420. Participó en 8 Series Semi Finales y su labor ofensiva por año es la siguiente: 1968-.285; 1969-.286; 1970-.271; 1973-.348; 1974-.471; 1975-.286; 1976-.423 y 1978-.555. Vio acción en las Series Finales de 1974 conectando para.375 y de 1978 con un robusto promedio de 428. Pipá se crecía en la post temporada y su ofensiva era superior a su gran bateo. Su última temporada con los Grises fue en 1986 y conecto38 indiscutibles en 57 oportunidades para un promedio de.316. Pipá evidenció consistencia incuestionable como pelotero y lealtad incondicional a los Grises y a Humacao, su Patria Chica. En sus 15 temporadas con la Federación de Béisbol Aficionado, Pipá sólo vistió la franela de la Ciudad Gris.

Según la Federación de Béisbol Aficionado, en sus 15 temporadas Pipá tuvo 1166 turnos al bate, conectó 378 indiscutibles (286 sencillos, 63 dobles, 17 triples y 12 cuadrangulares), anotó 204 carreras y empujó 194, recibió 193 bases por bolas, se robó 26 bases y tuvo promedio de.324

Luego de su retiro, Pipá fue entrenador de equipos de Pequeñas Ligas y del equipo Doble A de Humacao cuando el Lic. Francisco Betancourt era apoderado. En su retiro del deporte reconoció a Cristo como su Salvador y actualmente practica la religión en su comunidad.

En el 1995 fue exaltado al Recinto de los Inmortales del Béisbol Aficionado de P. por su grandes ejecutorias en el béisbol aficinado.`,
      logros: [
        'Promedio carrera: .324 en 15 temporadas',
        '1166 turnos, 378 hits, 204 carreras, 194 impulsadas',
        'Mejores promedios: .420 (1983), .417 (1981)',
        'Juego de Estrellas: 1956, 1971, 1977',
        'Torneo Mundial Little League (EE.UU.)',
        'Exaltado al Recinto de Inmortales del Béisbol Aficionado (1995)'
      ],
    }
  },

  {
    id: 'luis-fernando-rivera',
    foto: '/images/exaltados/luis-fernando-rivera.jpg',
    nombre: 'Luis Fernando',
    apellidos: 'Rivera',
    categoria: 'ATLETA',
    deportes: ['Boxeo'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 18,
    paginaFin: 18,
    contenido: {
      biografia: `Nació en Humacao el 11 de octubre de 1957, producto de la unión entre sus padres Fernando y Angelina. Es el segundo de cuatro hijos, 2 mujeres y 2 varones.

Desde pequeño Fernando comienza a sentir interés por el boxeo teniendo como figura inspiradora al gran campeón boricua Carlos Ortiz. la temprana edad de 8 años comienza a recibir las primeras enseñanzas de boxeo del experimentado y dedicado propulsor Ismael García, para algunos el Padre del Boxeo Humacaeño. Bajo la tutela de Ismael hizo su vida de boxeador aficionado y profesional.

En su fructífera carrera como boxeador aficionado conquistó el Campeonato de Puerto Rico en siete (7) ocasiones. Representó a Puerto Rico en varias competencias internacionales logrando extraordinarios triunfos como: Campeón de la Copa Venezolana y de Los Golden Gloves en Miami, Florida, Medalla de Bronce en Los Juegos Centroamericanos y del Caribe de 1974 celebrados en 1974 en Venezuela y en 1975 fue finalista en el Campeonato de Norte América celebrado en los Estados Unidos.

En el profesionalismo, tuvo veinticinco (25) combates con un saldo de dieciocho (18) peleas ganadas, cinco (5) perdidas y dos (2) empates. Aunque nunca tuvo la oportunidad de pelear por un título mundial, se enfrentó a boxeadores que tenían clasificaciones mundialistas.`,
      logros: [
        'Campeón de Puerto Rico en 7 ocasiones (aficionado)',
        'Campeón Copa Venezolana',
        'Campeón Golden Gloves en Miami, Florida',
        'Medalla de Bronce Juegos Centroamericanos 1974 (Venezuela)',
        'Finalista Campeonato Norte América 1975 (EE.UU.)',
        'Record profesional: 25 combates (18-5-2)'
      ],
    }
  },

  {
    id: 'alfredo-del-valle-baltes',
    foto: '/images/exaltados/alfredo-del-valle-baltes.jpg',
    nombre: 'Alfredo',
    apellidos: 'del Valle Baltes',
    categoria: 'ATLETA',
    deportes: ['Fútbol'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 19,
    paginaFin: 19,
    contenido: {
      biografia: `Nació en Ponce el 23 de enero de 1944 y se crió en Humacao. Estudió en las Escuelas Muñoz Rivera y Ponce de León. A los 14 años se integra a la Selección Juvenil del Jumacao Fútbol Club, conquistando el Sub-Campeonato Nacional en 1959. Con 15 años ingresa al equipo de Primera División del Jumacao F.C., coronándose Campeones Nacionales en 1961. Formó parte del combinado Yabucoa-Humacao, mejor conocido como el YAJU.

Con la decadencia del fútbol en la zona, pasa a jugar del Añasco F.C. y del Guayama F.C. hasta su retiro de la competencia en 1974.

En el fútbol se consideró como uno de los mejores porteros de la historia futbolística de la isla. Como jugador participó en 3 Juegos Centroamericanos y del Caribe: Jamaica (1962); Puerto Rico (1966) y Panamá (1970) y en la eliminatoria del Campeonato Mundial de Fútbol, Haití vs P.R. (1972).

Colaboró con la Federación Puertorriqueña de Fútbol, la Federación de Esgrima y con el Atletismo Juvenil en eventos y Congresos locales e internacionales (México, Jamaica, Guatemala, España, Cuba, Barbados, Bahamas) en calidad de entrenador asistente, Presidente del Colegio de Entrenadores de Fútbol, delegado técnico, representante, comité de apelaciones, vice-presidente y Director Ejecutivo. Participó como atleta de la Universidad de Puerto Rico. Fue un destacado volibolista en la Universidad de P.R. y en los equipos de Río Piedras, Guaynabo y ABX. Fue seleccionado como jugador de la Preselección Nacional de Volibol y árbitro de la Asociación Nacional de Oficiales de Volibol.

Fue Coordinador Técnico para los VIII Juegos Panamericanos (COPAN) en los deportes de Gimnasia, Tenis, Tiro y Tiro con Arco y fue delegado de estas disciplinas en Campeonatos Nacionales, Centro-americanos, de Las Américas y Campeonatos Mundiales. Fue co-fundador y Director Ejecutivo de la Federación Puertorriqueña de Patinaje sobre Ruedas y Presidente del Comité Rink Jockey.

Freddy colaboró en la preparación de varias propuestas relacionadas con el deporte en Puerto Rico, fungió como reportero y fue delegado en el Campeonato Mundial de Deportes en Sillas de Ruedas en Inglaterra (1985).

Su expriencia de trabajo inluye a la Compañía de Parques Nacionales, Secretario Auxiliar del Departamento de Recreación y Deportes, Director General de los VIII Juegos Panamericanos sobre Sillas de Ruedas, Director Ejecutivo de la Asociación de Atletismo Juvenil e Infantil de P.R. (AAJI) y Coordinador Técnico del Comité Organizador de la COPAN.`,
      logros: [
        'Uno de los mejores porteros en historia del fútbol de PR',
        '3 Juegos Centroamericanos: Jamaica 1962, PR 1966, Panamá 1970',
        'Campeonato Mundial Fútbol: Haití vs PR (1972)',
        'Campeón Nacional con Jumacao FC (1961)',
        'Sub-campeón Nacional Juvenil (1959)',
        'Coordinador Técnico VIII Juegos Panamericanos (COPAN)',
        'Director Ejecutivo Federación de Patinaje sobre Ruedas'
      ],
    }
  },

  {
    id: 'clotilde-villegas-pinero',
    foto: '/images/exaltados/clotilde-villegas-pinero.jpg',
    nombre: 'Clotilde',
    apellidos: 'Villegas Piñero',
    categoria: 'ATLETA',
    deportes: ['Atletismo'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 20,
    paginaFin: 20,
    contenido: {
      biografia: `Nació en Humacao el 3 de junio 1925. Se destacó en atletismo durante la década del cuarenta. Fue una digna representante de las escuelas públicas de Humacao durante los años de 1940 al 1946 a nivel local, regional y nacional. Su calidad de atleta era tal que se alzaba con los primeros lugares en las competencias.

Su maestro y entrenador lo fue el renombrado Manuel López de Victoria. El 17 de mayo de 1946, participa en las eliminatorias olímpicas en el parque Sixto Escobar, en los 80 metros con vallas, consagrándose como la mejor de Puerto Rico en ese evento, al derrotar atletas de la talla de Nydia Martínez de San Juan y de la humacaeña Ángela Wilkes, con tiempo de 14 segundos y quedando a sólo 9 décimas del récord centroamericano.

Este triunfo le ganó un lugar en la Selección Nacional para ser una de las atletas que nos representaría en los Juegos Centroamericanos y del Caribe que se celebraron en Barranquilla, Colombia en 1946. Lamentablemente se enfermó y no pudo competir por lo cual perdimos, probablemente, una medalla en esos juegos.`,
      logros: [
        'Campeona 80m con vallas Puerto Rico (1946)',
        'Tiempo: 14 segundos (9 décimas del récord centroamericano)',
        'Selección Nacional para Juegos Centroamericanos Barranquilla 1946',
        'Destacada atleta nivel local, regional y nacional (1940-1946)'
      ],
    }
  },

  {
    id: 'luis-curbelo-rivera',
    foto: '/images/exaltados/luis-curbelo-rivera.jpg',
    nombre: 'Luis',
    apellidos: 'Curbelo Rivera',
    categoria: 'ATLETA',
    deportes: ['Béisbol'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 21,
    paginaFin: 21,
    contenido: {
      biografia: `Luis Curbelo Rivera nació en Arecibo en el 1917 y completó la escuela intermedia y superior en Humacao. En la escuela superior participó en pista y campo y en béisbol.

Fue el pelotero más joven en jugar con el equipo de Humacao. Para ese tiempo no había una liga organizada y varios pueblos como Humacao y Yabucoa tenían equipos que jugaban entre sí y contrataban peloteros como Griffin Tirado, Cefo Conde, Gerardo Rodríguez, Juan Güilbe, Rafaelito Ortiz, Gacho Torres y los locales como Juan A. Bibiloni, el Negro Martínez y Jacinto "Jayasé" Hernández.

Estos juegos se veían de pie y a pleno sol. Luego, en 1938 se fundó la Liga Semi-Profesional de Puerto Rico. Se construyó el parque de béisbol con gradas bajo techo, diseñado por el Ingeniero Miguel J. Nolla y siendo alcalde Joaquín Márquez.

De 1938 a 1943 Curbelo defendió el campo corto del equipo Three Stars de Humacao con grandes destrezas defensivas, buen brazo y efectivo primer bate. Con Dick Sey formaban una gran combinación de campo corto y segunda base.

En el 1939, fue proclamado el mejor campo corto de Puerto Rico y el equipo fue vendido a Arecibo convirtiéndose en equipo profesional. A Curbelo se le ofreció pertenecer al mismo pero rechazó la oferta. El equipo semi-pro dio origen a los Grises de Humacao en el Béisbol Doble A.

De Luis Curbelo dice Fernando Díaz Pedrozo en la Revista Deportes en Grande (Tomo 36) publicada en Carolina, Puerto Rico: "Luis Curbelo fue un jugador del cuadro excepcionalmente talentoso y rápido. De inmediato se le cotizó como un prospecto de gran valía. En el equipo había dos buenos jugadores del cuadro. Aun así consiguió tiempo de juego y bateó para.291 en la temporada del 1939, pero fue su fildeo el que lo llevó a que se quedara en la posición de campo corto. Sus manos seguras lo convirtieron en el mejor defensor de esa posición por tres años consecutivos".

Los Cangrejeros de Santurce estuvieron a punto de firmarlo, pero una lesión en una pierna le tronchó su futuro en el béisbol rentado.

En la revista Puerto Rico Ilustrado de 1939 dice el periodista Frank López, que: "Luis Curbelo fue un buen fildeador al igual que robador de bases, se estafó 14 bases en la temporada del 1939, el campeón estafador de bases obtuvo 18".

Falleció a los 43 años luego de una brillante hoja de servicio público con el Cuerpo de Bomberos de Puerto Rico.`,
      logros: [
        'Mejor campo corto de Puerto Rico (1939)',
        'Promedio .291 en temporada 1939',
        'Campeón estafador de bases: 14 robadas (1939)',
        'Defensor destacado posición campo corto (3 años consecutivos)',
        'Pionero del béisbol en Humacao (década 1930-1940)'
      ],
    }
  },

  {
    id: 'manuel-mediavilla',
    foto: '/images/exaltados/manuel-mediavilla.jpg',
    nombre: 'Manuel',
    apellidos: 'Mediavilla',
    categoria: 'PROPULSOR',
    deportes: ['Baloncesto', 'Voleibol', 'Handball'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 22,
    paginaFin: 22,
    contenido: {
      biografia: `Manuel Mediavilla vino a Humacao como maestro de carpintería y dibujo mecánico, trabajando en el sótano de la Escuela Superior de Humacao (hoy la Escuela Juan Peña Reyes) enseñando el octavo grado.

Entre la escuela superior y el parque escolar había un solar que Mediavilla, con la ayuda de comerciantes y estudiantes, convirtió en una cancha para baloncesto y voleibol. Fue donde primero se jugaron ambos deportes en Humacao con Mediavilla como instructor. Además, este visionario, marcó en las paredes de la Escuela Ponce de León las canchas para jugar handball.

En baloncesto formó el equipo de Humacao High con Tingo Vázquez, los hermanos Márquez de Naguabo, Agustito Rodríguez, Wachi Ortiz de Yabucoa y René Pérez. La primera competencia grande de este equipo fue en un torneo de la YMCA. En voleibol, y luego del horario de clases, practicaban jugadores de ambos sexos de entre los cuales se destacó Gladys Díaz que luego representó a Puerto Rico en el softball y ganó medalla. En handball jugaron los más pequeños enseñados por Mediavilla. El boxeo se practicaba en un solar propiedad de Mediavilla y donde más tarde fabricó su casa.

Para la década del 30, en Humacao no había profesor de educación física ni adiestradores pero Mediavilla siempre estaba dispuesto y disponible. Por las tardes llevaba a los estudiantes con más habilidades a practicar pista y campo. Formó un equipo en esta disciplina que logró una segunda posición detrás de la Central High de Santurce.

Los gastos para esas instalaciones, equipos, materiales y viajes eran donados por el propio Mediavilla y por sus amistades y comerciantes.`,
      logros: [
        'Pionero del baloncesto y voleibol en Humacao',
        'Creó primeras canchas deportivas en Humacao',
        'Introdujo handball en escuelas',
        'Formó equipo Humacao High (baloncesto)',
        'Equipo atletismo: 2da posición detrás de Central High Santurce',
        'Financió instalaciones y equipos con recursos propios'
      ],
    }
  },

  // EQUIPO - Equipo Doble A 1960
  {
    id: 'equipo-1960',
    foto: '/images/exaltados/equipo-1960.jpg',
    nombre: 'Equipo Humacao Doble A',
    apellidos: '(1960)',
    categoria: 'EQUIPO',
    deportes: ['Béisbol'],
    anoExaltacion: 2006,
    revistaNumero: 4,
    paginaInicio: 23,
    paginaFin: 25,
    contenido: {
      biografia: `Humacao se proclama campeón de la Sección Este del béisbol superior, luego de vencer al potente equipo de Río Piedras, en la serie semifinal y a los siempre temidos Mulos del Valenciano. Esta serie se fue al máximo de siete juegos.

Con esta victoria Humacao se gana el derecho a representar la Sección Este en el Carnaval de Campeones. Los otros dos contendientes fueron el equipo de los Leones de Ponce y los Maceteros de Vega Alta.

El carnaval de campeones comienza el domingo, 9 de julio de 1960, cuando los Grises de Humacao, visitan a los Maceteros de Vega Alta. En estos dos primeros encuentros Vega Alta vence por partida doble a los Grises, en el juego de la mañana 6 carreras por 5, resultando derrotado John Martínes y en el juego de la tarde 6 carreras por 4, perdiendo el partido el novato Milton Rosario. Por Vega Alta fueron los lanzadores ganadores Edwin Marrero, que en el juego de la mañana sustituyó en la quinta entrada al lanzador Félix Maisonet, y en el juego de la tarde el lanzador ganador fue Félix Maisonet, quién había sido explotado en el juego de la mañana. Éste sustituyó al lanzador inicial de Vega Alta, Joselito Cruz, en la tercera entrada y eliminó a trece bateadores grises de forma consecutiva para acreditarse la victoria.

En los próximos dos juegos de la serie los Leones de Ponce visitaron a los Maceteros de Vega Alta y estos los derrotaron por partida doble colocando la serie a su favor con 4 victorias y cero derrotas.

Los próximos dos juegos de los Grises, son en el Parque Jacinto Hernández en Humacao, en donde reciben la visita de los Leones de Ponce en doble choque. Humacao derrota a Ponce por partida doble y se coloca con dos victorias y dos derrotas, mientras Vega Alta tenía cuatro victorias sin derrotas. En estos partidos no tenemos los resultados de los juegos, pero las victorias se las acreditaron John Martínez y Milton Rosario.

Los próximos dos partidos son en el Paquito Montaner de Ponce donde los Leones reciben la visita de Vega Alta y estos los derrotan nuevamente por partida doble, poniendo su récord en seis victorias y cero derrotas, prácticamente asegurando el campeonato de Puerto Rico. En ese momento ya los Leones estaban elminados y Vega Alta era prácticamente el campeón.

Los Grises lo más que podían alcanzar era un empate si lograban vencer en los cuatro partidos restantes, dos contra los Leones y dos contra los Maceteros de Vega Alta. Vega Alta visita a Humacao para dos importantes desafíos. En el juego de la mañana se escenifica uno de los partidos más emocionantes que se hayan celebrado en la historia del Jacinto Hernández. Jugándose la novena entrada con la anotación 1 0 a favor de Humacao, dos out y el bateador Fabián Cardona en la caja de bateo con la cuenta en tres bolas y dos strikes. Al lanzamiento de Milton Rosario, Fabián Cardona conectó un cuadrangular para empatar el partido a una carrera. Jugándose la parte baja de la décima entrada el dirigente de Humacao Catalín Santos, trajo de emergente al novato Jorgito Salgado y éste bateó de cuadrangular para Humacao acreditarse la victoria dos carreras por una. Éste fue el primer hit que conectaba el novato Salgado en su carrera con los Grises. La victoria se la acreditó el novato Milton Rosario, que lanzó todo el partido y al cual le conectaron sólo tres indiscutibles.

En el juego de la tarde, Humacao vuelve a imponerse sobre Vega Alta, cuatro carreras por una, con otra joya monticular del estelar John Martínez, que permitió solamente dos incogibles a la fuerte artillería de los Maceteros, quienes solamente conectaron cinco indiscutibles en el doble partido.

Estando Vega Alta con seis victorias y dos derrotas y los Grises con cuatro victorias y dos derrotas, le restaba a Humacao dos juegos con los Leones, en su guarida. De salir derrotados los de Humacao, le daría la victoria a Vega Alta y el Campeonato de Puerto Rico.

En el Montaner, debido a la lluvia no se puede jugar por la mañana y se asigna un doble partido comenzando a la una de la tarde siendo el primer juego a siete entradas. En este partido el estelar sepia humacaeño John Martínez, pintó de blanco a los Leones ocho carreras por cero. En el segundo partido pautado para nueve entradas inició lanzando Milton Rosario, lo releva en la séptima entrada John Martínez y al finalizar las nueve entradas el árbitro Freddie Vicenty, suspendió el juego por oscuridada ya que no estaba autorizado para ordenar que se encendieran las luces del estadio. Este partido quedó empatado a tres carreras.

Se asignó para jugarse el miércoles 24 de agosto. El lanzador ganador John Martínez se impuso tres carreras por dos, permitiéndole solamente tres incogibles. Con ésta victoria Humacao logró lo que parecía imposible, empatar la serie con Vega Alta, ambos equipos finalizaron la serie con seis victorias y dos derrotas.

La serie de desempate para decidir el Campeonato de Puerto Rico, se asignó para dar comienzo el domingo, 28 de agosto de 1960, en el parque Ildefonso Morales en Caguas. Esta serie fue pactada para siete juegos, lo que muchos criticaron, por ser una serie tan larga. Lo más justo hubiera sido una serie de tres a ganar dos, ya que era para decidir un empate.

Se inicia la serie y la responsabilidad en el montículo se le delega al novato Milton Rosario, el cual realizó una excelente labor en las series post-temporada. En este primer partido Humacao se anota la victoria, cuando Milton Rosario, propina una blanqueada con marcador de cuatro carreras por cero. Ésta fue la primera blanqueada que le propinaban a Vega Alta en su historia.

En el segundo juego Humacao vuelve a imponerse esta vez seis carreras por cuatro. La victoria se le acreditó a John Martínez, su número 18 de la temporada. Fue la primera vez que un lanzador logra 18 victorias en una temporada en el béisbol Doble A.

El tercer partido de la serie, inició por Humacao el derecho Miguel García, ganando el equipo de Vega Alta trece carreras por cuatro. La victoria correspondió a Josecito Cruz.

El cuarto juego de la serie lo gano Humacao, acreditándose la victoria Milton Rosario, para la tercera victoria de Humacao, la segunda de Rosario en esta serie.

El quinto partido y el que pudo dar el campeonato a los Grises se le asigna al estelar John Martínez, pero este no puede lograr la victoria ganando Vega Alta y poniendo la serie tres juegos por dos a favor de los Grises de Humacao.

Los amigos que tiene más de sesenta años y que seguían el béisbol Doble A, deben saber que durante el desarrollo de esta serie, fue que ocurrieron aquellas tristemente recordadas inundaciones que dejaron más de cien personas muertas en la ciudad de Humacao, muchas de ellas familiares cercanos y amigos de muchos de los peloteros. Estas inundaciones ocurrieron el 6 de septiembre de 1960. Pese a esa tragedia los juegos se continuaron y no se dió la oportunidad de que la gente, los jugadores y fanáticos se repusieran de la misma.

Con la serie 3 2, a favor de Humacao se asigna el sexto partido nuevamente a John Martínez, pero no tuvo suerte y tuvo que abandonar el partido en la misma primera entrada. La victoria se la acreditó el equipo de Vega Alta, con marcador de seis carreras por una (6 1) empatando la serie a tres partidos por equipo, faltando solamente el partido final, para decidir el campeonato de Puerto Rico.

El dirigente seleccionó a su lanzador estrella John Martínez para el juego decisivo. Comienza el partido y al llegar a la primera parte de la tercera entrada, con marcador en cero, el equipo de Humacao se derrumbó, el lanzador concedió dos bases por bolas, un pelotazo, le conectaron dos incogibles y el equipo cometió la friolera de cinco (5) errores en esa entrada, bueno para que Vega Alta, anotara siete (7) carreras, que al final pesaron muchísimo. En la cuarta entrada Vega Alta le anota la octava carrera y en la quinta entrada la número nueve que resultó ser la carrera de la victoria y del campeonato.

Con el marcador 9 0, el dirigente sustituye a Martínez por Miguel García, quien completó la quinta entrada, la sexta y la séptima sin permitir carreras realizando un excelente relevo. Humacao anota cuatro carreras en la sexta entrada y cuatro en la séptima para poner el marcador 9 8. En la octava entrada Milton Rosario sustituye a Miguel García y lanza la octava y novena entrada en cero. Finaliza el partido y Vega Alta se proclama campeón de Puerto Rico por primera vez.

Esta temporada fue inolvidable, por lo reñida y por las tantas emociones, que le brindaron a la fanaticada de los Grises y a todos aquellos que le siguieron como fanáticos.

Este equipo lo integraron entre otros, los hermanos Rafael y Esteban Ocasio, el novato Néstor Morales, Kiwi Ramos, Ismael (Torito) Rivera, Efraín Rivera, Julio Salomón Cora, Pablo Colón, Jorgito Salgado, Rafael O´Neill, William Vázquez, Rubén (Conejo) López, Pipo López, Félix Merced, Andrés (Cheo Cagüita) Felipe López, Charlie Rivera, Luis Pabellón, José M. Cordero, Andrés Denton, Francisco Ríos, Miguel García, Evaristo Berríos, William García, Milton Rosario, John Martínez, y sus ayudantes Yuyo Cora y Efraín Rivera. El anotador oficial fue Roberto Castro, el mascota Nathanael, el encargado de la propiedad fue Chago, responsable de traer los peloteros del Área Metropolitana. No podemos olvidar ni pasar por alto a Julia, con su batea de morcillas y cuchifritos. los fanáticos Quique Torres y su hermano, al "Nene bigotú", con aquella famosa frase lanzada cuando un jugador estaba colocado para fildear un "fly", gritaba que se escuchaba en todo el parque "Se le cayó". En las transmisiones estuvo Rafi Linardo, Luis Andrés Gándara y observando cómo se aprende a narrar Néstor Sánchez.

Esa temporada y esa serie final no podrá ser nunca olvidada por nuestros fanáticos.`,
      logros: [
        'Campeón Sección Este del béisbol superior',
        'Serie memorable vs Vega Alta (6-2 record)',
        'John Martínez: 18 victorias (récord temporada Doble A)',
        'Milton Rosario: múltiples victorias clave',
        'Primera blanqueada en historia de Vega Alta',
        'Temporada histórica 1960'
      ],
    }
  },
];
