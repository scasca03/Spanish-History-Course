/* Estructura de la obra: módulos y registro de lecciones.
   Cada archivo mNN.js llama a L({...}) con una lección. Campos:
   id, m (módulo), t (título), st (subtítulo), per (periodo), why (por qué importa), ctx (contexto),
   body (texto con marcado ligero), viz (visualizaciones), ppl [nombre, fechas, biografía],
   tl [año numérico, fecha legible, hecho], cause, cons, prev/next [ids], links (texto de conexión),
   today, debate, terms [término, definición], sum, quiz [{q,o,a,e}], open [pregunta, claves], src. */
window.LESSONS = [];
window.L = function (o) { window.LESSONS.push(o); };

window.MODULES = [
  { n: 1, t: 'Geografía de España', s: 'Entender el territorio', per: 'Actualidad',
    intro: 'Antes de la historia, el escenario. La península es un bloque macizo, elevado y compartimentado por montañas, con una meseta interior seca y unas costas más húmedas o más templadas. Ese relieve explica rutas, fronteras, ciudades y desigualdades que reaparecen en todos los módulos siguientes.' },
  { n: 2, t: 'La península antes de España', s: 'De la prehistoria a la Hispania romana', per: 'h. 1,2 millones de años – 476 d. C.',
    intro: 'Durante milenios la península no fue una unidad política. Los primeros humanos, los pueblos íberos y celtas, los colonizadores mediterráneos y, sobre todo, Roma, dejaron capas superpuestas: lengua latina, ciudades, calzadas, derecho y cristianismo.' },
  { n: 3, t: 'Visigodos y al-Ándalus', s: 'Del reino de Toledo a los reinos de taifas', per: '409 – 1492',
    intro: 'El reino visigodo dio por primera vez una monarquía con capital peninsular. Su hundimiento en 711 abrió casi ocho siglos de presencia islámica, cuya sociedad, ciencia y arquitectura marcaron el territorio y la lengua.' },
  { n: 4, t: 'Los reinos cristianos', s: 'La formación de las Coronas', per: '718 – 1504',
    intro: 'Desde los núcleos del norte nacieron reinos distintos, con leyes, lenguas e instituciones propias. Su expansión hacia el sur, sus uniones y separaciones explican por qué la España moderna nació como un conjunto de reinos y no como un Estado unitario.' },
  { n: 5, t: 'Los Austrias y el Imperio', s: 'Siglos XVI y XVII', per: '1516 – 1700',
    intro: 'Una herencia dinástica convirtió a la monarquía hispánica en la primera potencia europea y en un imperio global. La plata americana, las guerras de religión y el coste de defender territorios dispersos explican su apogeo y su declive.' },
  { n: 6, t: 'Los Borbones y el siglo XVIII', s: 'Reformismo e Ilustración', per: '1700 – 1808',
    intro: 'La nueva dinastía ganó una guerra europea y civil, suprimió los fueros de la Corona de Aragón y emprendió reformas para modernizar un país agrario y estamental sin tocar sus fundamentos.' },
  { n: 7, t: 'El siglo XIX', s: 'Revoluciones, guerras y Estado liberal', per: '1808 – 1902',
    intro: 'La invasión napoleónica abrió un siglo de constituciones, pronunciamientos y guerras civiles. De él salieron el Estado liberal centralizado, la pérdida del imperio, la industrialización periférica, el movimiento obrero y los nacionalismos catalán y vasco.' },
  { n: 8, t: 'El siglo XX', s: 'Crisis, dictaduras y democracia', per: '1902 – 1982',
    intro: 'La crisis de la Restauración, la dictadura de Primo de Rivera, la Segunda República, la Guerra Civil, casi cuarenta años de franquismo y la Transición forman el bloque que más directamente explica la política española actual.' },
  { n: 9, t: 'La España democrática', s: 'De 1982 a hoy', per: '1982 – 2026',
    intro: 'Cuatro décadas de democracia: integración en Europa, modernización, crisis económicas, cambio del sistema de partidos, tensión territorial y nuevos problemas como la vivienda o el envejecimiento.' },
  { n: 10, t: 'España y Europa', s: 'Historia comparada e integración', per: 'Siglos XV – XXI',
    intro: 'La historia española solo se entiende dentro de la europea: absolutismo, revoluciones, guerras mundiales, Guerra Fría y construcción europea. Este módulo traza ese marco y explica cómo funciona hoy la Unión Europea.' },
  { n: 11, t: 'Política e instituciones', s: 'Cómo funciona España hoy', per: 'Constitución de 1978',
    intro: 'Monarquía parlamentaria, Cortes, Gobierno, jueces, comunidades autónomas y ayuntamientos. Qué hace cada institución, cómo se eligen y cómo se toman, en la práctica, las decisiones políticas.' },
  { n: 12, t: 'Economía española', s: 'Estructura, Estado y retos', per: 'Siglos XIX – XXI',
    intro: 'De una economía agraria a una economía de servicios integrada en el euro. Cómo se financia el Estado, por qué el paro ha sido tan alto, qué pasó en 2008 y por qué la vivienda y la demografía dominan hoy el debate.' },
  { n: 13, t: 'Cultura y sociedad', s: 'Lenguas, artes y vida social', per: 'De la Edad Media a hoy',
    intro: 'Lenguas, literatura, pintura, música, religión, fiestas, familia y migraciones. La diversidad española vista a través de su historia y no de sus tópicos.' }
];
