/**
 * Exaltados de la Revista #02 (Año 2002)
 * Segunda Exaltación - 17 de agosto de 2002
 * Total: 9 exaltados (8 individuos + 1 equipo)
 *
 * Categorías:
 * - Atletas: 4
 * - Propulsores: 2
 * - Póstumos: 2
 * - Equipos: 1
 */

import { ExaltadoRevista } from '@/lib/types/revista';

export const rev02Exaltados: ExaltadoRevista[] = [
  {
    id: 'elpidio-mojica-diaz',
    nombre: 'Elpidio',
    apellidos: 'Mojica Díaz',
    categoria: 'ATLETA',
    deportes: ['Tiro'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 16,
    paginaFin: 16,
    contenido: {
      biografia: `Nació el 18 de junio de 1927 en Humacao. Se casó con Luz N. Santiago y procrearon a Joaquín y Wanda. Elpidio se desempeñó como taquígrafo y luego como supervisor de estadísticas en el Negociado de Estadísticas del Departamento del Trabajo. En el 1954 comienza a trabajar en la Guardia Nacional donde ocupó importantes cargos. Finalmente se retira como "Chief Warrant Officer" con cerca de 40 años de servicios. Se desempeñó como ayudante del Director de los Puertos hasta el 1992. En el 1954 obtiene la licencia de tiro 4566 como socio del plan American Gun Club. En el 1962 fue miembro del equipo de tiro con rifle en los IX Juegos Centroamericanos celebrados en Jamaica. En el 1966 fue miembro del equipo de tiro con rifle en los Juegos Centroamericanos celebrados en Puerto Rico. En el 1967 fue miembro del equipo de Tiro en los Juegos Panamericanos en Canadá. En el 1968 fundó el Humacao Shooting Club junto a los señores Hernán Torruellas, Luis Alberto López, Rafael Hernández y Humberto Figueroa. Durante los años 1958-67 y mientras trabajaba en la Guardia Nacional participa de los campeonatos nacionales de la "National Rifle Association". La misma se celebraba anualmente en Camp Perry, Ohio. Fue miembro del Equipo de Tiro con Rifle en la Competencia de Buena Voluntad en la República de El Salvador. Obtiene primer y segundo lugar en tiro pistola, con rifle y escopeta en las competencias celebradas en Costa Rica. De 1965 al 1976 participa en varias competencias de tiro con rifle, como el US Army Rifle Southern Command, All Army Rifle, Winston P. Wilson Rifle and Pistol Matches Camp Robinson entre otros, donde obtuvo una destacada participación obteniendo los primeros lugares. Ha sido merecedor de varios reconocimientos como el del Club Aries, Comité Organizador del Recibimiento de la Antorcha Centroamericana y del Humacao Shooting Club, entre otros.`,
      logros: [
        'Miembro del equipo de tiro en IX Juegos Centroamericanos (Jamaica, 1962)',
        'Miembro del equipo de tiro en X Juegos Centroamericanos (Puerto Rico, 1966)',
        'Miembro del equipo en V Juegos Panamericanos (Canadá, 1967)',
        'Fundador del Humacao Shooting Club (1968)',
        'Participante National Rifle Association Championships (1958-1967)',
        'Primer y segundo lugar en competencias de Costa Rica'
      ],
    }
  },

  {
    id: 'jaime-tolentino',
    nombre: 'Jaime',
    apellidos: 'Tolentino Villarín',
    categoria: 'ATLETA',
    deportes: ['Atletismo'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 17,
    paginaFin: 17,
    contenido: {
      biografia: `Nació en el barrio Buena Vista de Humacao el 28 de febrero de 1930. Representó a las escuelas de Buena Vista y Ana Roqué en competencias juveniles en los eventos de 400, 800 y 1,500 metros lisos. En sus años de escuela superior dominó siempre los eventos de 800 y 1,500 mts. lisos. Representó a Puerto Rico en los Juegos Centroamericanos y del Caribe en Guatemala en el 1950 y obtuvo un honroso cuarto lugar en el evento de los 1,500 mts. Ingresó a la Universidad de Puerto Rico en Río Piedras donde conoció a su mentor Eugenio Guerra. Dominó por espacio de cuatro años las competencias de 800mts, los 1,500 mts y campo traviesa de la Liga Atlética Intercolegial. En el 1952 fue el atleta más destacado de los Gallitos de la UPR en la LAI. Ingresó al Servicio Militar Obligatorio donde participó en Alemania en las carreras de 800, 1,500 y 3,000 mts. Fue seleccionado para integrar el "All Army Track Team" en el año 1956. Tolentino tuvo una brillante carrera de 30 años en el sistema educativo. Comenzó como maestro de educación física en el pueblo de Juncos. Pasó luego a ocupar el puesto de Ayudante Especial del Director de Educación Física de Caguas, trasladándose luego a ocupar el puesto de Ayudante del Director de Educación Física de San Juan. En el 1976 fue nombrado Coordinador de los Centros de Educación y Trabajo de Puerto Rico retirándose en 1985. Jaime Tolentino organizó las primeras Olimpiadas Especiales celebradas en P. R. Luego del retiro del Departamento de Educación se mantuvo activo organizando los días de sus juegos en las escuelas del municipio de Caguas.`,
      logros: [
        'Cuarto lugar en 1,500m en Juegos Centroamericanos (Guatemala, 1950)',
        'Dominó eventos de 800m y 1,500m en LAI por 4 años',
        'Atleta más destacado UPR en LAI (1952)',
        'All Army Track Team (1956)',
        'Organizador de las primeras Olimpiadas Especiales de Puerto Rico',
        '30 años de carrera en el sistema educativo'
      ],
    }
  },

  {
    id: 'miguel-lopez-reyes',
    nombre: 'Miguel A.',
    apellidos: 'López Reyes',
    categoria: 'ATLETA',
    deportes: ['Atletismo', 'Béisbol'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 18,
    paginaFin: 18,
    contenido: {
      biografia: `Nació el 26 de mayo de 1928 en el barrio Río Blanco de Naguabo. la edad de 6 años se traslada al barrio Río Abajo de Humacao. Se destacó en el deporte de béisbol donde ocupó la posición de campo corto en los equipos de Río Abajo, Pasto Viejo, Punta Santiago, Mambiche Blanco, Atomic Gray, New York Chume y en el Varsity Escuela Superior y en las Estrellas Juveniles. Bajo la tutela del Prof. Manuel López de Victoria, participa en las primeras competencias de pista y campo de la Segunda Unidad de Pasto Viejo en el año 1943. En estas justas escolares se aglutinaban las escuelas intermedias de Collores, Buena Vista, Punta Santiago, Mariana y por supuesto la escuela de Segunda Unidad de Pasto Viejo. Miguel fue el atleta más destacado en 1943 y 1944. Se llevó el primer lugar en las competencias de 100 y 200 mts, salto a lo largo y el relevo 4 100 mts. ayudando a la escuela a alzarse con la victoria. En la escuela superior Juan Peña Reyes fue el atleta más destacado en las justas interescolares en los años 1945, 1946 y 1947. Ganó los eventos de 100 y 200 mts, salto a lo largo y el relevo 4 100 mts. Estableció records de 11.1 seg. en los 100 mts y 22.4 seg. en los 200 mts. Ambas marcas se mantuvieron hasta que otro humacaeño Manuel Rivera, las superara en los años cincuenta. En el evento de salto a lo largo Miguel logró la marca de 22 pies y 6 pulgadas. Le correspondió el honor de representar a Puerto Rico en los Juegos Centroamericanos y del Caribe. Participó en los 100 y 200 mts. lisos y en el relevo 4 100 mts compuesto por Licho Santiago, Kelly Correa y Gaspar Vázquez. En las competencias duales entre escuelas superiores de Humacao y Caguas celebradas en el 1947 fue seleccionado como el atleta más sobresaliente al ganar cuatro de los eventos incluyendo el del relevo. La escuela superior de Humacao ganó estas competencias bajo la tutela de Johnny Goyco. En los décimos Juegos Centroamericanos y del Caribe celebrados en Puerto Rico en el año 1966 actuó como juez de pista. Fue premiado con dos medallas como el mejor atleta del año 1947 en los actos de graduación celebrados en el Teatro Oriente.`,
      logros: [
        'Atleta más destacado 1943-1944 en Segunda Unidad Pasto Viejo',
        'Atleta más destacado justas interescolares 1945-1947',
        'Récord de 11.1 seg. en 100 metros',
        'Récord de 22.4 seg. en 200 metros',
        'Salto a lo largo: 22 pies y 6 pulgadas',
        'Representó a Puerto Rico en V Juegos Centroamericanos',
        'Mejor atleta del año 1947',
        'Juez de pista en X Juegos Centroamericanos (Puerto Rico, 1966)'
      ],
    }
  },

  {
    id: 'pedro-jose-pepito-alvarez',
    nombre: 'Pedro José',
    apodo: 'Pepito',
    apellidos: 'Álvarez',
    categoria: 'ATLETA',
    deportes: ['Fútbol'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 19,
    paginaFin: 19,
    contenido: {
      biografia: `Nació en Humacao el 26 de enero de 1944. Es hijo de Don Leonardo Alvarez (Q. E. P. D.) y Doña María del Pilar Vázquez. Pepito, como se le conoce familiarmente, pertenece a una familia de hermanos atletas que militaron en la famosa escuadra de la primera división del fútbol puertorriqueño, el Jumacao Fútbol Club. Esta casado con la Sra. Lucy Santiago y es padre de José y Ricardo. Es egresado del Recinto de Río Piedras de la Universidad de Puerto Rico. Se desempeñó como maestro de educación secundaria en el área de las Ciencias Sociales. Pepito comenzó a jugar al fútbol a la edad de 14 años siendo miembro fundador del Jumacao Fútbol Club. Formó parte de todos los equipos campeones del fútbol local: Jumacao F. C., Riverside F. C. y Satélites F. C. Jugó con el equipo juvenil, Jumacao F. C., subcampeón de Puerto Rico en el 1958 y del Jumacao Junior, campeón de la categoría juvenil de P. R. en 1959. En ese torneo anotó todos los goles logrados por su equipo. De 1962-63 jugó con el YAJU pasando luego al Roosevelt F. C., logrando varios campeonatos nacionales con dicho equipo. Para 1962-63 formó parte del equipo de los Gallitos de la UPR en el campeonato de la Liga Atlética Intercolegial (LAI). En el 1966 participó como defensa central titular de la Selección de P. R. en los Juegos Centroamericanos y del Caribe en San Juan, P. R., en los XI Juegos Centroamericanos y del Caribe en Panamá en 1970 y en los XII Juegos Centroamericanos y del Caribe en Santo Domingo en 1974. Su ascendente trayectoria como defensa, lo convirtió en uno de los mejores defensas centrales de su época. Viajó como miembro de la Selección de P. R. a Guadalupe para participar en un torneo triangular con Martinica y Guadalupe. Participó junto al Rooselvelt F. C. en una serie contra la Universidad Autónoma de Santo Domingo y con la Selección de P. R. a Nueva York para enfrentarse al equipo Amanta del Ecuador. Dirigió junto al profesor Miguel Casull el primer torneo de fútbol del Departamento de Instrucción Pública de las escuelas superiores y fue entrenador del equipo campeón de fútbol juvenil de P. R. en 1967. Se consagra como defensa central en las eliminatorias de la Copa Mundial de Fútbol en 1973 en la seccional de la CONCACAF, ganándose el elogio de la prensa haitiana por su desempeño. Pepito se retira del fútbol en el 1978, pasando a convertirse en tenista del Club de Tenis de Humacao, deporte que practica en sus ratos libres. Disfruta hoy de la jubilación del Departamento de Educación.`,
      logros: [
        'Miembro fundador del Jumacao Fútbol Club',
        'Subcampeón juvenil de Puerto Rico (1958)',
        'Campeón juvenil de Puerto Rico (1959)',
        'Defensa central en X, XI y XII Juegos Centroamericanos (1966, 1970, 1974)',
        'Uno de los mejores defensas centrales de su época',
        'Entrenador del equipo campeón juvenil de P.R. (1967)',
        'Participación en eliminatorias Copa Mundial 1973',
        'Maestro de educación secundaria'
      ],
    }
  },

  {
    id: 'pablo-davila-escribano',
    nombre: 'Pablo',
    apellidos: 'Dávila Escribano',
    categoria: 'PROPULSOR',
    deportes: ['Atletismo', 'Béisbol', 'Levantamiento de Pesas'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 20,
    paginaFin: 20,
    contenido: {
      biografia: `Nació el 31 de diciembre de 1928 en San Lorenzo. Cursó sus estudios en la escuela elemental de Humacao y termina la secundaria en la escuela Ana Roqué. Tuvo una destacada participación en el atletismo durante su vida como estudiante. Se destacó en las carreras de 100 m, 200 m, 400 y 800 m. Participó en la Liga Atlética Policíaca y en competencias de levantamiento de pesas. Participó en varios deportes destacándose en el béisbol al que se dedicó durante su carrera universitaria y en equipos de la Guardia Nacional donde fungió como refuerzo en los campeonatos de Puerto Rico. En el año 1956 se casó con Carmen P. Santos, procreando dos hijos. El 1967 organiza en Humacao las Pequeñas Ligas Internacionales y eventualmente colabora con la organización de la "Boys Baseball Inc." Su amor por el deporte lo conduce a convertirse en secretario del Humacao "Jogger Club". Pablo tuvo una destacada participación en varios de los eventos celebrados en las primeras competencias Interagenciales de 1981. En las competencias Masters de Puerto Rico se destacó en los eventos de 100 m, 200 m, 400 con vallas y salto a lo largo. Representó a Puerto Rico en los Masters Mundiales en 1983 en los eventos de 100 y 800m. Pablo tiene una trayectoria de liderato la cual constituye una digna representación de nuestro pueblo.`,
      logros: [
        'Organizador de las Pequeñas Ligas Internacionales en Humacao (1967)',
        'Colaborador de Boys Baseball Inc.',
        'Secretario del Humacao Jogger Club',
        'Representó a Puerto Rico en Masters Mundiales (1983)',
        'Destacada participación en competencias Masters',
        'Propulsor del deporte en múltiples disciplinas'
      ],
    }
  },

  {
    id: 'jose-manuel-chemane-carradero',
    nombre: 'José Manuel',
    apodo: 'Chemane',
    apellidos: 'Carradero',
    categoria: 'PROPULSOR',
    deportes: ['Béisbol'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 21,
    paginaFin: 21,
    contenido: {
      biografia: `Nació el 12 de diciembre de 1946 en Humacao. Fueron sus padres Don Adrián Carradero y Doña Josefina Muriel, (Q. E. P. D.). Casado con Olga Cotto, tiene un hijo, José, de 11 años. Obtuvo un bachillerato en Administración Comercial en la UPR Recinto de Río Piedras. Durante los últimos años se ha desempeñado como Director de Recreación y Deportes en los pueblos de Yabucoa y Humacao. En el béisbol Doble A tuvo una exitosa carrera por 16 años, siendo pelotero estelar con los equipos de Ponce, Humacao, Río Piedras y Yabucoa. Fue un receptor de enormes facultades defensivas, con brazo potente y certero, que hermanado con su bateo oportuno lo convirtió a fines de los años 60 en uno de los mejores del país. Con el equipo grande participó en tres Series Mundiales, unos Juegos Centroamericanos y del Caribe y unos Juegos Panamericanos. En el 1970 fue parte del equipo que logró medalla de bronce en la Serie Mundial en Colombia. En el 1980 y en las postrimerías de su carrera fue dirigente-jugador de Yabucoa, ganando ese año su primer campeonato nacional. Con Juncos ganó otros dos títulos en el 1983 y 1985, con Yabucoa volvió a ganar en las temporadas de 1994, 95 y 96, igualando la marca de todos los tiempos con tres campeonatos nacionales corridos. En el 1998 dirigió a Cidra y llevó a los Bravos al título nacional, siendo su séptimo de un total de 21 torneos celebrados, para ser el mejor dirigente en la historia del Béisbol Doble A. En el 1985 fue nombrado Dirigente Nacional, cargo que aún ocupa. Chemane ha llevado al equipo nacional a ganar medalla de plata en los Juegos Centroamericanos y del Caribe en México en el 1990, Bronce en Ponce, Bronce en los Panamericanos de Indianápolis en el 1987, Plata en los Panamericanos en el 1991 en La Habana y Bronce en los Panamericanos de Mar del Plata en el 1995. Además, ganó la medalla de bronce en los Juegos Olímpicos de Seúl, Corea del Sur, cuando el béisbol se jugó como deporte de exhibición. En el 1990, fue escogido como el mejor Dirigente del Mundo por la Federación Internacional de Béisbol (IBA). En el 1991 fue exaltado al Recinto de los Inmortales del Béisbol Aficionado de Puerto Rico. Pertenece también al Salón de la Fama del Deporte Puertorriqueño.`,
      logros: [
        '16 años como receptor estelar en béisbol Doble A',
        'Medalla de bronce Serie Mundial (Colombia, 1970)',
        '7 campeonatos nacionales como dirigente',
        'Mejor dirigente en la historia del Béisbol Doble A',
        'Dirigente Nacional desde 1985',
        'Medalla de bronce en Juegos Olímpicos (Seúl, 1988)',
        'Mejor Dirigente del Mundo por IBA (1990)',
        'Exaltado al Recinto de los Inmortales del Béisbol Aficionado (1991)',
        'Miembro del Salón de la Fama del Deporte Puertorriqueño',
        'Múltiples medallas en Juegos Centroamericanos y Panamericanos'
      ],
    }
  },

  {
    id: 'gladys-diaz',
    nombre: 'Gladys',
    apellidos: 'Díaz Carrillo',
    categoria: 'PÓSTUMO',
    deportes: ['Softbol', 'Atletismo'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 22,
    paginaFin: 22,
    contenido: {
      biografia: `Nació en Humacao el 21 de abril de 1924. Sus padres fueron José Díaz y Celia Carrillo. Sus hermanos son Warren, Cápiru y José. Cursó sus estudios elementales e intermedia en las escuelas públicas de Humacao. Luego se traslada a Santurce donde estudió en la escuela Superior La Inmaculada. Obtiene un bachillerato en la Universidad de Puerto Rico con especialidad en Educación Física y un grado en Trabajo Social. Se desempeñó como profesora de educación física en la Universidad de Puerto Rico. Además se desempeñó como trabajadora social en la ciudad de Nueva York. Tuvo una destacada participación como atleta en varios deportes. Su mentor, el profesor Julio Francis Edwards, la guió en su trayectoria deportiva. Se destacó principalmente en los deportes de atletismo y softbol durante la década del 40. Formó parte de un poderoso equipo de atletas femeninas que representó dignamente a la ciudad de Humacao en competencias de atletismo tanto a nivel nacional como internacional. Destacamos la participación en las competencias insulares de 1940, donde junto a Angela Wilkes, María Carrillo, María Mercedes Pérez y Eufemia del Valle ganaron cinco de los seis eventos celebrados. Todas estas atletas fueron seleccionadas para participar en los Juegos Centroamericanos en el 1942 a celebrarse en Costa Rica. Los mismos se suspendieron por motivo de la Segunda Guerra Mundial. Gladys se destacó en el deporte de pista campo en los eventos de la jabalina y disco. Fue campeona nacional en lanzamiento de disco y jabalina en 1941. Jugó sóftbol donde destacó como lanzadora y fuerte bateadora. En el 1946 formó parte del equipo nacional de softbol femenino que ganó medalla de oro en los Juegos Centroamericanos y del Caribe celebrados en Barranquilla, Colombia y también participó en los eventos de disco y jabalina. Además se destacaron en dicho equipo las humacaeñas Carmen Paciencia y Alicia Reyes. Luego de la jubilación regresa a su pueblo natal para la década del ochenta hasta su fallecimiento.`,
      logros: [
        'Campeona nacional de disco y jabalina (1941)',
        'Medalla de oro en softbol - Juegos Centroamericanos (Barranquilla, 1946)',
        'Ganadora de 5 de 6 eventos en competencias insulares (1940)',
        'Profesora de educación física en la UPR',
        'Trabajadora social en Nueva York',
        'Pionera del deporte femenino en Humacao'
      ],
    }
  },

  {
    id: 'catalino-santos',
    nombre: 'Catalino',
    apodo: 'Catino',
    apellidos: 'Santos Cruz',
    categoria: 'PÓSTUMO',
    deportes: ['Paso Fino', 'Béisbol', 'Atletismo'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 23,
    paginaFin: 23,
    contenido: {
      biografia: `Nació el 19 de septiembre de 1931 y murió el 12 de septiembre de 1988. Se graduó de agrónomo en el 1954 en el Colegio de Agricultura y Artes Mecánicas de Mayagúez. Cursó estudios en bienes raíces, profesión a la cual se dedicó con gran éxito. Su pasión por el deporte de Paso Fino lo llevó a especializarse en la crianza científica de caballos. Su sapiencia y dedicación le produjo grandes éxitos en este deporte. Debemos destacar los logros que le dió a Puerto Rico con sus ejemplares en las diversas modalidades de este deporte. Los nombres de estos caballos son Himalaya (dos veces campeón de potrancas de P. R. en 1967 y 1968), Llanero (dos veces campeón de andaduras y condiciones, 1967 y 1968), Inmortal (sub-campeón como debutante en 1970), Onasis (campeón como debutante en 1973) y Doña Ramonita la cual fue campeona debutante en 1978. Catino se distinguió como miembro fundador de la Asociación de Dueños de Criadores de Caballos de Paso Fino y de la Asociación de Dueños de Caballos de Paso Fino la cual presidió de 1976 al 1977. Se desempeñó como juez de Paso Fino en Estados Unidos, República Dominicana y en su patria. En los años 40 y 50 participó en el deporte de pista y campo y en béisbol. Jugó en el Varsity del Colegio de Mayagúez y se desempeñó como dirigente-jugador con el potente equipo Clase A de los "Kelly Tires". De este equipo firmaron en un solo año ocho jugadores para el béisbol doble A. En el 1960 fue el dirigente del equipo doble A de Humacao el cual logró el subcampeonato de Puerto Rico frente a los Maceteros de Vega Alta. En 1967 fue presidente fundador de las Pequeñas Ligas de Humacao. Organizó en 1973 la división Big League de Puerto Rico.`,
      logros: [
        'Criador científico de caballos Paso Fino',
        'Múltiples campeones nacionales de Paso Fino (1967-1978)',
        'Miembro fundador Asociación de Dueños de Caballos de Paso Fino',
        'Presidente de la Asociación (1976-1977)',
        'Juez internacional de Paso Fino',
        'Subcampeón béisbol Doble A como dirigente (1960)',
        'Presidente fundador Pequeñas Ligas de Humacao (1967)',
        'Organizador división Big League de Puerto Rico (1973)'
      ],
    }
  },

  {
    id: 'equipo-1951',
    nombre: 'Equipo Humacao Doble A',
    apellidos: '(1951)',
    categoria: 'EQUIPO',
    deportes: ['Béisbol'],
    anoExaltacion: 2002,
    revistaNumero: 2,
    paginaInicio: 24,
    paginaFin: 25,
    contenido: {
      biografia: `Histórico equipo de béisbol que conquistó el campeonato nacional y mundial amateur en 1951. Los Grises de Humacao, bajo una destacada actuación colectiva, lograron lo que sería el único título de la franquicia hasta 2021 una sequía de 70 años que subraya la magnitud de esta hazaña. El equipo viajó a México donde representaron a Puerto Rico en el Campeonato Mundial Amateur de Béisbol. Con una combinación de talento local, disciplina y determinación, Los Grises derrotaron a los mejores equipos del continente para coronarse campeones mundiales. Este equipo legendario incluyó a figuras que más tarde serían inmortalizadas individualmente en el Pabellón de la Fama: Melquíades Silva Anderson en los jardines, Carlos (Memelo) López Sánchez en el campo interno, y Osvaldo Gil Bosch como receptor. La química del equipo, junto con el liderazgo técnico y administrativo, creó una época dorada del béisbol humacaeño que perdura en la memoria colectiva del pueblo. El campeonato de 1951 no fue solo una victoria deportiva, sino un momento de orgullo y unidad para Humacao. Las calles se llenaron de celebración cuando Los Grises regresaron con el trofeo que los consagraba como los mejores del mundo. Esta hazaña quedó grabada como uno de los momentos más gloriosos en la historia deportiva del municipio.`,
      logros: [
        'Campeones Nacionales de Puerto Rico (1951)',
        'Campeones Mundiales Amateur en México (1951)',
        'Único campeonato de Los Grises hasta 2021 (70 años)',
        'Representación destacada de Puerto Rico a nivel internacional',
        'Legado duradero en la historia del béisbol humacaeño'
      ],
      reconocimientos: [
        'Considerado el equipo más glorioso en la historia de Humacao',
        'Primera y única vez campeones mundiales hasta 2021',
        'Tres de sus jugadores clave fueron exaltados individualmente al Pabellón'
      ]
    }
  },
];
