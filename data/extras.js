/* Datos de apoyo: territorio, mapas históricos, gráficos, árboles, tablas, presidentes,
   procedimientos, explicaciones sencillas, conexiones, glosario adicional y método. */
window.X = {};

/* Comunidades autónomas. Población en millones (≈, INE, Estadística Continua de Población, 2025, redondeada).
   Superficie en km² (INE / IGN). Estatuto: año de aprobación del primer estatuto. */
X.ccaa = {
  '01': { n: 'Andalucía', cap: 'Sevilla', pop: 8.63, area: 87597, est: '1981 (reformado en 2007)', lang: 'Castellano', d: 'La comunidad más poblada. Vía del artículo 151 tras el referéndum de 1980. Economía de servicios, turismo y agroalimentación; paro históricamente por encima de la media.' },
  '02': { n: 'Aragón', cap: 'Zaragoza', pop: 1.36, area: 47720, est: '1982', lang: 'Castellano; el aragonés y el catalán de la Franja están reconocidos como lenguas propias', d: 'Núcleo de la antigua Corona de Aragón. Zaragoza concentra más de la mitad de la población; gran parte del territorio sufre despoblación.' },
  '03': { n: 'Principado de Asturias', cap: 'Oviedo', pop: 1.01, area: 10604, est: '1981', lang: 'Castellano; el asturiano (bable) está protegido', d: 'Cuna del primer reino cristiano. Minería del carbón y siderurgia marcaron su historia contemporánea; hoy, población envejecida.' },
  '04': { n: 'Illes Balears', cap: 'Palma', pop: 1.23, area: 4992, est: '1983', lang: 'Catalán y castellano (cooficiales)', d: 'Archipiélago conquistado por la Corona de Aragón en el siglo XIII. Economía muy especializada en el turismo.' },
  '05': { n: 'Canarias', cap: 'Santa Cruz de Tenerife y Las Palmas de Gran Canaria (capitalidad compartida)', pop: 2.26, area: 7447, est: '1982', lang: 'Castellano', d: 'Archipiélago atlántico conquistado por Castilla entre 1402 y 1496. Región ultraperiférica de la UE con régimen fiscal propio.' },
  '06': { n: 'Cantabria', cap: 'Santander', pop: 0.59, area: 5321, est: '1981', lang: 'Castellano', d: 'Salida al mar de Castilla durante siglos. Industria y servicios en la costa; valles ganaderos en el interior.' },
  '07': { n: 'Castilla y León', cap: 'Valladolid (sede de las instituciones)', pop: 2.39, area: 94226, est: '1983', lang: 'Castellano; el leonés y el gallego tienen protección en zonas concretas', d: 'La comunidad más extensa de España y una de las regiones más extensas de la UE. Meseta norte, cuenca del Duero, fuerte despoblación rural.' },
  '08': { n: 'Castilla-La Mancha', cap: 'Toledo', pop: 2.10, area: 79409, est: '1982', lang: 'Castellano', d: 'Meseta sur. Agricultura (vid, cereal, olivo) y crecimiento reciente ligado a la cercanía de Madrid.' },
  '09': { n: 'Cataluña', cap: 'Barcelona', pop: 8.12, area: 32091, est: '1979 (reformado en 2006)', lang: 'Catalán, castellano y occitano (aranés)', d: 'Primera región industrial de España desde el siglo XIX. Nacionalismo político desde finales del XIX; proceso independentista de 2012–2017.' },
  '10': { n: 'Comunitat Valenciana', cap: 'Valencia', pop: 5.32, area: 23255, est: '1982 (reformado en 2006)', lang: 'Valenciano y castellano (cooficiales)', d: 'Antiguo reino de la Corona de Aragón. Agricultura de regadío, industria (cerámica, calzado, juguete), turismo y puerto de Valencia.' },
  '11': { n: 'Extremadura', cap: 'Mérida', pop: 1.05, area: 41634, est: '1983', lang: 'Castellano', d: 'Antigua Lusitania romana (capital Emerita Augusta). Baja densidad y renta inferior a la media; dehesa y regadíos del Guadiana.' },
  '12': { n: 'Galicia', cap: 'Santiago de Compostela', pop: 2.71, area: 29575, est: '1981', lang: 'Gallego y castellano (cooficiales)', d: 'Una de las tres «nacionalidades históricas» que plebiscitaron estatuto durante la II República. Pesca, naval, automoción, textil.' },
  '13': { n: 'Comunidad de Madrid', cap: 'Madrid', pop: 7.06, area: 8028, est: '1983', lang: 'Castellano', d: 'Capital desde 1561. Mayor PIB autonómico junto a Cataluña y el más alto por habitante entre las regiones grandes; concentra sedes empresariales y administración del Estado.' },
  '14': { n: 'Región de Murcia', cap: 'Murcia', pop: 1.57, area: 11314, est: '1982', lang: 'Castellano', d: 'Antiguo reino incorporado a Castilla en el siglo XIII. Agricultura intensiva de exportación dependiente del agua (trasvase Tajo-Segura).' },
  '15': { n: 'Comunidad Foral de Navarra', cap: 'Pamplona', pop: 0.68, area: 10391, est: 'Ley Orgánica de Amejoramiento del Fuero (1982)', lang: 'Castellano; euskera cooficial en la zona vascófona', d: 'Antiguo reino, unido a Castilla en 1515 conservando sus instituciones. Régimen foral: recauda sus impuestos mediante el Convenio Económico.' },
  '16': { n: 'País Vasco / Euskadi', cap: 'Vitoria-Gasteiz (sede de las instituciones)', pop: 2.23, area: 7234, est: '1979', lang: 'Euskera y castellano (cooficiales)', d: 'Tres territorios históricos con diputaciones forales que recaudan los impuestos (Concierto Económico). Industria pesada desde el siglo XIX; nacionalismo vasco desde 1895.' },
  '17': { n: 'La Rioja', cap: 'Logroño', pop: 0.33, area: 5045, est: '1982', lang: 'Castellano', d: 'La comunidad peninsular menos poblada. Vino con denominación de origen calificada; en San Millán de la Cogolla se conservan glosas de los siglos X–XI.' },
  '18': { n: 'Ciudad Autónoma de Ceuta', cap: 'Ceuta', pop: 0.083, area: 19, est: '1995', lang: 'Castellano', d: 'Portuguesa desde 1415, vinculada a la monarquía hispánica desde 1640 y cedida formalmente por Portugal en 1668. Frontera exterior de la UE en África.' },
  '19': { n: 'Ciudad Autónoma de Melilla', cap: 'Melilla', pop: 0.086, area: 12, est: '1995', lang: 'Castellano', d: 'Ocupada por Castilla en 1497. Frontera exterior de la UE en África.' }
};
X.prov = {
  '01': { cap: 'Vitoria-Gasteiz', note: 'Territorio histórico de Álava/Araba, con diputación foral.' }, '07': { cap: 'Palma', note: 'Provincia uniprovincial; cada isla tiene su Consejo Insular.' },
  '15': { cap: 'A Coruña' }, '20': { cap: 'Donostia / San Sebastián', note: 'Territorio histórico de Gipuzkoa, con diputación foral.' }, '26': { cap: 'Logroño' },
  '31': { cap: 'Pamplona / Iruña' }, '33': { cap: 'Oviedo' }, '35': { cap: 'Las Palmas de Gran Canaria', note: 'Creada en 1927 al dividirse la provincia de Canarias. Cada isla tiene su cabildo.' },
  '38': { cap: 'Santa Cruz de Tenerife', note: 'Creada en 1927 al dividirse la provincia de Canarias. Cada isla tiene su cabildo.' }, '39': { cap: 'Santander', note: 'Llamada provincia de Santander hasta 1982.' },
  '48': { cap: 'Bilbao', note: 'Territorio histórico de Bizkaia, con diputación foral.' }, '28': { cap: 'Madrid', note: 'Capital del Estado.' }, '51': { cap: 'Ceuta' }, '52': { cap: 'Melilla' }
};

/* ---------- Mapas históricos (asignación aproximada por provincia actual) ---------- */
X.hist = {
  pal: {
    tar: { n: 'Hispania Tarraconense', c: '#c9a27e' }, bae: { n: 'Hispania Bética', c: '#9fae84' }, lus: { n: 'Lusitania', c: '#d4c493' }, maur: { n: 'Mauretania Tingitana (África)', c: '#d9d1c2' },
    out: { n: 'Fuera del dominio representado', c: '#e7e1d5' },
    and: { n: 'Al-Ándalus', c: '#8fa892' }, leo: { n: 'Reino de León', c: '#b07a6a' }, cas: { n: 'Castilla', c: '#a6585d' }, nav: { n: 'Reino de Navarra (Pamplona)', c: '#7f8f6a' },
    cat: { n: 'Condados catalanes', c: '#d9b77f' }, fr: { n: 'Frontera disputada o territorio dividido', c: '#ddd3c2' }, por: { n: 'Reino de Portugal', c: '#7d93a3' },
    leocas: { n: 'León y Castilla (Alfonso VII)', c: '#a6585d' }, ara: { n: 'Corona de Aragón', c: '#cf9f4c' }, naz: { n: 'Reino nazarí de Granada', c: '#6f9a8a' },
    ccas: { n: 'Corona de Castilla (León y Castilla, unidos en 1230)', c: '#a6585d' },
    fcas: { n: 'Corona de Castilla', c: '#b98b84' }, fara: { n: 'Antigua Corona de Aragón: fueros abolidos (1707–1716)', c: '#d2b06b' }, foral: { n: 'Provincias vascas y Navarra: conservan fueros', c: '#7f8f6a' },
    rep: { n: 'Zona republicana', c: '#b97a6e' }, nac: { n: 'Zona sublevada («nacional»)', c: '#7d8da0' }, div: { n: 'Provincia dividida por el frente', c: '#ddd3c2' }
  },
  maps: {
    romana: { short: 'Hispania romana', title: 'Hispania en la división de Augusto (h. 27–13 a. C.)', def: 'tar',
      p: { '11': 'bae', '14': 'bae', '18': 'bae', '21': 'bae', '23': 'bae', '29': 'bae', '41': 'bae', '06': 'lus', '10': 'lus', '37': 'lus', '05': 'lus', '51': 'maur', '52': 'maur', '35': 'out', '38': 'out' },
      neigh: { Portugal: 'lus', Morocco: 'maur' },
      cap: 'Augusto dividió Hispania en tres provincias: Tarraconense (capital Tarraco), Bética (Corduba) y Lusitania (Emerita Augusta). El norte del actual Portugal pertenecía a la Tarraconense. Diocleciano (h. 297) creó después la Gallaecia y la Cartaginense, y en el siglo IV se añadió la Baleárica.' },
    a1000: { short: 'Año 1000', title: 'La península hacia el año 1000', def: 'and',
      p: { '15': 'leo', '27': 'leo', '32': 'leo', '36': 'leo', '33': 'leo', '24': 'leo', '34': 'leo', '47': 'leo', '49': 'leo', '39': 'cas', '09': 'cas', '01': 'cas', '48': 'cas', '31': 'nav', '26': 'nav', '20': 'nav', '08': 'cat', '17': 'cat', '37': 'fr', '05': 'fr', '40': 'fr', '42': 'fr', '22': 'fr', '43': 'fr', '35': 'out', '38': 'out' },
      neigh: { Portugal: 'fr' },
      cap: 'El califato de Córdoba, en tiempos de Almanzor, dominaba dos tercios de la península y el norte de Marruecos. La frontera cristiana seguía aproximadamente el Duero; al sur, una franja poco poblada servía de tierra de nadie. Castilla era un condado del reino de León con creciente autonomía; los condados catalanes acababan de desligarse de hecho del rey franco.' },
    a1150: { short: 'Hacia 1150', title: 'La península hacia 1150', def: 'and',
      p: { '15': 'leocas', '27': 'leocas', '32': 'leocas', '36': 'leocas', '33': 'leocas', '24': 'leocas', '34': 'leocas', '47': 'leocas', '49': 'leocas', '39': 'leocas', '09': 'leocas', '48': 'leocas', '26': 'leocas', '37': 'leocas', '05': 'leocas', '40': 'leocas', '42': 'leocas', '28': 'leocas', '45': 'leocas', '19': 'leocas', '31': 'nav', '20': 'nav', '01': 'nav', '22': 'ara', '50': 'ara', '08': 'ara', '17': 'ara', '25': 'ara', '43': 'ara', '44': 'fr', '16': 'fr', '13': 'fr', '10': 'fr', '35': 'out', '38': 'out' },
      neigh: { Portugal: 'por' },
      cap: 'Toledo (1085) y Zaragoza (1118) habían caído; Lisboa (1147), Tortosa (1148) y Lérida (1149) acababan de conquistarse. La unión de Aragón y el condado de Barcelona (1137) creó la Corona de Aragón. Portugal era reino independiente desde 1143, aunque su sur seguía siendo andalusí. Al-Ándalus vivía la transición del poder almorávide al almohade.' },
    a1270: { short: 'Hacia 1270', title: 'La península hacia 1270', def: 'ccas',
      p: { '31': 'nav', '22': 'ara', '50': 'ara', '44': 'ara', '08': 'ara', '17': 'ara', '25': 'ara', '43': 'ara', '12': 'ara', '46': 'ara', '07': 'ara', '18': 'naz', '29': 'naz', '04': 'naz', '35': 'out', '38': 'out', '51': 'out', '52': 'out' },
      neigh: { Portugal: 'por' },
      cap: 'Tras las Navas de Tolosa (1212), Fernando III conquistó el valle del Guadalquivir (Córdoba 1236, Sevilla 1248) y Jaime I, Mallorca (1229–1231) y Valencia (1238). Solo quedaba el reino nazarí de Granada, vasallo de Castilla. Alicante era entonces castellana: pasó a la Corona de Aragón en 1296–1304. Algeciras, Gibraltar y Tarifa, en la actual provincia de Cádiz, siguieron en manos musulmanas algún tiempo más.' },
    a1492: { short: '1492', title: 'La península en 1492', def: 'ccas',
      p: { '31': 'nav', '22': 'ara', '50': 'ara', '44': 'ara', '08': 'ara', '17': 'ara', '25': 'ara', '43': 'ara', '12': 'ara', '46': 'ara', '03': 'ara', '07': 'ara', '51': 'por', '52': 'out' },
      neigh: { Portugal: 'por' },
      cap: 'Con la toma de Granada (2 de enero de 1492) desaparece el último reino islámico. Castilla y Aragón comparten monarcas pero mantienen leyes, Cortes, monedas y fronteras aduaneras propias. Navarra será conquistada en 1512 e incorporada a Castilla en 1515. Ceuta es portuguesa desde 1415; Melilla se ocupará en 1497. La conquista de Canarias termina en 1496.' },
    np1716: { short: 'Nueva Planta', title: 'La monarquía de Felipe V tras los Decretos de Nueva Planta (1707–1716)', def: 'fcas',
      p: { '22': 'fara', '50': 'fara', '44': 'fara', '08': 'fara', '17': 'fara', '25': 'fara', '43': 'fara', '12': 'fara', '46': 'fara', '03': 'fara', '07': 'fara', '31': 'foral', '01': 'foral', '20': 'foral', '48': 'foral' },
      cap: 'Los reinos de la Corona de Aragón, que habían apoyado mayoritariamente al archiduque Carlos, perdieron sus instituciones de gobierno y su sistema fiscal propios y se rigieron por el modelo castellano (en Cataluña, Mallorca y Aragón se conservó buena parte del derecho civil y penal privado). Navarra y las provincias vascas, fieles a Felipe V, mantuvieron sus fueros. Menorca fue británica casi todo el siglo XVIII y Gibraltar lo es desde 1704.' },
    gc1936: { short: 'Julio 1936', title: 'Guerra Civil: finales de julio de 1936', def: 'rep',
      p: { '15': 'nac', '27': 'nac', '32': 'nac', '36': 'nac', '24': 'nac', '49': 'nac', '37': 'nac', '47': 'nac', '34': 'nac', '09': 'nac', '42': 'nac', '40': 'nac', '05': 'nac', '10': 'nac', '31': 'nac', '01': 'nac', '26': 'nac', '50': 'nac', '41': 'nac', '11': 'nac', '21': 'nac', '35': 'nac', '38': 'nac', '51': 'nac', '52': 'nac', '22': 'div', '44': 'div', '14': 'div', '18': 'div', '07': 'div' },
      cap: 'El golpe triunfó en Galicia, Castilla la Vieja, Navarra, Álava, parte de Aragón, Cáceres, el oeste de Andalucía, Canarias, Baleares (salvo Menorca) y el Protectorado de Marruecos. Fracasó en Madrid, Barcelona, Valencia, el País Vasco costero, Asturias (salvo Oviedo), Cantabria y la mitad este y sur. La ciudad de Oviedo y el Alcázar de Toledo resistieron como enclaves sublevados.' },
    gc1937: { short: 'Octubre 1937', title: 'Guerra Civil: octubre de 1937, tras la caída del Norte', def: 'rep',
      p: { '15': 'nac', '27': 'nac', '32': 'nac', '36': 'nac', '24': 'nac', '49': 'nac', '37': 'nac', '47': 'nac', '34': 'nac', '09': 'nac', '42': 'nac', '40': 'nac', '05': 'nac', '10': 'nac', '31': 'nac', '01': 'nac', '26': 'nac', '50': 'nac', '41': 'nac', '11': 'nac', '21': 'nac', '35': 'nac', '38': 'nac', '51': 'nac', '52': 'nac', '20': 'nac', '48': 'nac', '39': 'nac', '33': 'nac', '29': 'nac', '06': 'div', '22': 'div', '44': 'div', '14': 'div', '18': 'div', '45': 'div', '28': 'div', '19': 'div', '07': 'div' },
      cap: 'Los sublevados unieron sus zonas por Extremadura (Badajoz, agosto de 1936), fracasaron ante Madrid (noviembre de 1936; Jarama y Guadalajara, 1937), tomaron Málaga (febrero de 1937) y conquistaron toda la franja cantábrica: Bilbao (junio), Santander (agosto) y Asturias (octubre de 1937).' },
    gc1938: { short: 'Julio 1938', title: 'Guerra Civil: julio de 1938, la República partida en dos', def: 'rep',
      p: { '15': 'nac', '27': 'nac', '32': 'nac', '36': 'nac', '24': 'nac', '49': 'nac', '37': 'nac', '47': 'nac', '34': 'nac', '09': 'nac', '42': 'nac', '40': 'nac', '05': 'nac', '10': 'nac', '31': 'nac', '01': 'nac', '26': 'nac', '50': 'nac', '41': 'nac', '11': 'nac', '21': 'nac', '35': 'nac', '38': 'nac', '51': 'nac', '52': 'nac', '20': 'nac', '48': 'nac', '39': 'nac', '33': 'nac', '29': 'nac', '06': 'nac', '22': 'nac', '44': 'nac', '25': 'div', '12': 'div', '14': 'div', '18': 'div', '45': 'div', '28': 'div', '19': 'div', '07': 'div' },
      cap: 'Tras recuperar Teruel (febrero de 1938), la ofensiva de Aragón llegó al Mediterráneo en Vinaròs (15 de abril de 1938) y separó Cataluña del resto de la zona republicana. El 25 de julio comenzó la batalla del Ebro, la más larga de la guerra.' },
    gc1939: { short: 'Febrero 1939', title: 'Guerra Civil: febrero de 1939, tras la caída de Cataluña', def: 'nac',
      p: { '28': 'div', '19': 'div', '16': 'rep', '13': 'rep', '02': 'rep', '23': 'rep', '04': 'rep', '30': 'rep', '03': 'rep', '46': 'rep', '12': 'div', '45': 'div', '14': 'div', '18': 'div' },
      cap: 'Barcelona cayó el 26 de enero de 1939 y unas 450.000 personas cruzaron a Francia. La República conservaba la zona centro-sur. El golpe del coronel Casado (5 de marzo) contra el Gobierno de Negrín precipitó el final; las tropas de Franco entraron en Madrid el 28 de marzo y el 1 de abril se dio por terminada la guerra.' }
  }
};

/* ---------- Gráficos (fuentes al pie) ---------- */
X.charts = {
  poblacion: { title: 'Población de España, 1900–2026 (millones de habitantes)', type: 'line', h: 290, unit: 'millones',
    x: ['1900', '1910', '1920', '1930', '1940', '1950', '1960', '1970', '1981', '1991', '2001', '2011', '2021', '2026'],
    series: [{ n: 'Población', v: [18.6, 20.0, 21.4, 23.7, 26.0, 28.1, 30.6, 34.0, 37.7, 38.9, 40.8, 46.8, 47.4, 49.8] }], min: 0, max: 55, xEvery: 14,
    note: 'Fuente: INE, censos de población 1900–2021 (cifras redondeadas a centenas de miles) y Estadística Continua de Población a 1 de julio de 2026 (49.801.559 habitantes, dato provisional). Obsérvese el salto 2001–2011, debido a la inmigración, y el estancamiento de los años noventa.' },
  paro: { title: 'Tasa de paro, media anual (% de la población activa)', type: 'line', h: 290, unit: '%',
    x: ['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    series: [{ n: 'Tasa de paro', v: [8.2, 11.3, 17.9, 19.9, 21.4, 24.8, 26.1, 24.4, 22.1, 19.6, 17.2, 15.3, 14.1, 15.5, 14.8, 12.9, 12.2, 11.3] }], min: 0, max: 30, xEvery: 9,
    note: 'Fuente: INE, Encuesta de Población Activa (medias anuales redondeadas a un decimal; el INE revisa periódicamente la serie, por lo que pueden variar en décimas). Datos trimestrales posteriores: 9,93 % en el cuarto trimestre de 2025 y 10,18 % en el tercer trimestre de 2026, con un récord de unos 22,8 millones de ocupados.' },
  pib: { title: 'Crecimiento real del PIB (% anual)', type: 'bar', h: 270, labels: true, unit: '%',
    x: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'], series: [{ n: 'PIB', v: [2.0, -10.9, 6.7, 6.4, 2.5, 3.5, 2.8] }], min: -12, max: 9, xEvery: 7,
    note: 'Fuente: INE, Contabilidad Nacional Trimestral (nota de prensa del cuarto trimestre de 2025, 26-3-2026). PIB nominal de 2025: 1.687.152 millones de euros. La caída de 2020 refleja el confinamiento por la pandemia.' },
  deuda: { title: 'Deuda pública en 2024 (% del PIB)', type: 'bar-h', h: 250, lw: 120, max: 140, f: v => v.toLocaleString('es-ES') + ' %',
    rows: [['Italia', 135.3], ['Francia', 113.0], ['España', 101.8, true], ['Portugal', 94.9], ['Zona euro', 87.4], ['UE-27', 81.0], ['Alemania', 62.5]],
    note: 'Fuente: Eurostat, notificación del procedimiento de déficit excesivo (abril de 2025), deuda bruta consolidada de las administraciones públicas. Para España, el Banco de España situó la ratio en el 100,8 % al cierre de 2025. El Tratado de Maastricht fija una referencia del 60 %.' },
  smi: { title: 'Salario mínimo interprofesional (euros al mes, 14 pagas)', type: 'bar', h: 270, labels: true, unit: 'euros',
    x: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'], series: [{ n: 'SMI', v: [736, 900, 950, 965, 1000, 1080, 1134, 1184, 1221] }], min: 0, max: 1400, xEvery: 9,
    note: 'Fuente: reales decretos anuales del SMI publicados en el BOE (2018: 735,90 €, redondeado; 2021: importe vigente desde septiembre; 2026: Real Decreto 126/2026, 17.094 € anuales).' },
  ccaapop: { title: 'Población por comunidad autónoma (millones, ≈ 2025)', type: 'bar-h', h: 470, lw: 160, f: v => v.toLocaleString('es-ES', { maximumFractionDigits: 2 }),
    rows: [['Andalucía', 8.63], ['Cataluña', 8.12], ['Madrid', 7.06, true], ['C. Valenciana', 5.32], ['Galicia', 2.71], ['Castilla y León', 2.39], ['Canarias', 2.26], ['País Vasco', 2.23], ['Castilla-La Mancha', 2.10], ['Murcia', 1.57], ['Aragón', 1.36], ['Illes Balears', 1.23], ['Extremadura', 1.05], ['Asturias', 1.01], ['Navarra', 0.68], ['Cantabria', 0.59], ['La Rioja', 0.33]],
    note: 'Fuente: INE, Estadística Continua de Población (cifras redondeadas). Cuatro comunidades (Andalucía, Cataluña, Madrid y Comunitat Valenciana) reúnen casi el 60 % de la población.' }
};

/* ---------- Árboles dinásticos ---------- */
X.trees = {
  austrias: { title: 'De los Reyes Católicos a los Austrias', note: 'Simplificado. Solo se muestran las ramas que explican la sucesión.',
    root: { n: 'Isabel I de Castilla y Fernando II de Aragón', r: 'Isabel: 1474–1504 · Fernando: 1479–1516', k: 1, e: 'Matrimonio en 1469',
      c: [{ n: 'Juana I «la Loca»', r: 'reina titular 1504–1555', k: 1, e: 'casada con Felipe I «el Hermoso», hijo del emperador Maximiliano',
        c: [{ n: 'Carlos I', r: '1516–1556', k: 1, e: 'emperador Carlos V desde 1519', c: [
          { n: 'Felipe II', r: '1556–1598', k: 1, e: 'rey de Portugal desde 1580', c: [{ n: 'Felipe III', r: '1598–1621', k: 1, c: [
            { n: 'Felipe IV', r: '1621–1665', k: 1, c: [
              { n: 'María Teresa', r: '1638–1683', e: 'casada con Luis XIV de Francia; abuela de Felipe V' },
              { n: 'Carlos II', r: '1665–1700', k: 1, e: 'muere sin descendencia' }] },
            { n: 'Ana de Austria', r: '1601–1666', e: 'casada con Luis XIII; madre de Luis XIV' }] }] },
          { n: 'Fernando I (emperador)', r: 'hermano de Carlos I', e: 'rama austríaca de los Habsburgo' }] }] }] } },
  borbones: { title: 'Los Borbones en España (1700–hoy)', note: 'Simplificado. Entre 1868 y 1874 reinó Amadeo I de Saboya (1871–1873) y hubo una república; entre 1931 y 1975 no hubo monarquía.',
    root: { n: 'Felipe V', r: '1700–1746 (salvo 1724)', k: 1, e: 'nieto de Luis XIV y bisnieto de Felipe IV',
      c: [{ n: 'Luis I', r: '1724', k: 1, e: 'muere a los siete meses de reinado' }, { n: 'Fernando VI', r: '1746–1759', k: 1, e: 'sin descendencia' },
        { n: 'Carlos III', r: '1759–1788', k: 1, e: 'antes rey de Nápoles', c: [{ n: 'Carlos IV', r: '1788–1808', k: 1, c: [
          { n: 'Fernando VII', r: '1808 y 1814–1833', k: 1, c: [{ n: 'Isabel II', r: '1833–1868', k: 1, e: 'regencias hasta 1843', c: [{ n: 'Alfonso XII', r: '1874–1885', k: 1, c: [{ n: 'Alfonso XIII', r: '1886–1931', k: 1, e: 'rey desde su nacimiento', c: [{ n: 'Juan de Borbón', r: '1913–1993', e: 'conde de Barcelona; no reinó', c: [{ n: 'Juan Carlos I', r: '1975–2014', k: 1, e: 'abdicó en 2014', c: [{ n: 'Felipe VI', r: '2014–', k: 1, c: [{ n: 'Leonor', r: 'n. 2005', e: 'princesa de Asturias, heredera' }] }] }] }] }] }] }] },
          { n: 'Carlos María Isidro', r: '1788–1855', e: 'pretendiente carlista desde 1833' }] }] }] } },
  trastamara: { title: 'Los Trastámara y la unión de Castilla y Aragón', note: 'Simplificado. La dinastía llega a Castilla tras la guerra civil de 1366–1369 y a Aragón por el Compromiso de Caspe (1412).',
    root: { n: 'Juan I de Castilla', r: '1379–1390', k: 1,
      c: [{ n: 'Enrique III', r: '1390–1406', k: 1, c: [{ n: 'Juan II de Castilla', r: '1406–1454', k: 1, c: [{ n: 'Enrique IV', r: '1454–1474', k: 1, e: 'su hija Juana fue apartada tras la guerra de 1475–1479' }, { n: 'Isabel I', r: '1474–1504', k: 1, e: 'casa con Fernando de Aragón (1469)' }] }] },
        { n: 'Fernando I de Aragón «de Antequera»', r: 'Aragón 1412–1416', k: 1, e: 'elegido en Caspe', c: [{ n: 'Alfonso V el Magnánimo', r: '1416–1458', k: 1, e: 'conquista Nápoles' }, { n: 'Juan II de Aragón', r: '1458–1479', k: 1, c: [{ n: 'Fernando II', r: '1479–1516', k: 1, e: 'el Católico' }] }] }] } }
};

/* ---------- Tablas ---------- */
X.tables = {
  const: { title: 'Las constituciones españolas comparadas',
    head: ['Texto', 'Origen y contexto', 'Soberanía', 'Sufragio', 'Cortes', 'Religión', 'Derechos', 'Territorio', 'Vigencia'],
    rows: [
      ['Constitución de 1812 («La Pepa»)', 'Cortes de Cádiz durante la guerra contra Napoleón', 'Nacional', 'Universal masculino indirecto (en cuatro grados)', 'Unicameral', 'Católica, única y prohibición de cualquier otra', 'Igualdad ante la ley, libertad de imprenta política, fin de señoríos jurisdiccionales', 'Uniforme: provincias y ayuntamientos; incluía América', '1812–1814, 1820–1823, 1836–1837'],
      ['Constitución de 1837', 'Progresistas tras el motín de La Granja; pacto con moderados', 'Nacional en el preámbulo, pero el rey tiene veto y disolución', 'Censitario directo (minoría de varones con renta)', 'Bicameral: Congreso y Senado', 'El Estado mantiene el culto católico', 'Declaración de derechos breve; juicio por jurados en imprenta', 'Centralista', '1837–1845'],
      ['Constitución de 1845', 'Moderados de Narváez', 'Compartida entre el rey y las Cortes', 'Censitario muy restringido', 'Bicameral; Senado de designación regia y vitalicio', 'Católica oficial; Concordato de 1851', 'Derechos remitidos a leyes restrictivas', 'Centralista', '1845–1868 (salvo bienio 1854–1856)'],
      ['Constitución de 1869', 'Revolución de 1868 («La Gloriosa»)', 'Nacional', 'Universal masculino (25 años)', 'Bicameral, ambas electivas', 'Libertad de cultos; el Estado sostiene el católico', 'Amplia: reunión, asociación, enseñanza', 'Centralista; en 1873 se proyectó una república federal', '1869–1873'],
      ['Constitución de 1876', 'Restauración de Alfonso XII; obra de Cánovas', 'Compartida rey–Cortes', 'Censitario; universal masculino desde la ley de 1890', 'Bicameral; Senado mixto (miembros natos, vitalicios y electos)', 'Católica oficial; tolerancia privada de otros cultos', 'Reconocidos pero regulados y suspendibles por leyes', 'Centralista', '1876–1923 (suspendida por Primo de Rivera)'],
      ['Constitución de 1931', 'Segunda República', 'Popular: «los poderes de todos sus órganos emanan del pueblo»', 'Universal de hombres y mujeres (23 años)', 'Unicameral', 'Estado laico; límites a las órdenes religiosas', 'Amplia, con derechos sociales, divorcio e igualdad', '«Estado integral» compatible con autonomías regionales', '1931–1939'],
      ['Leyes Fundamentales del franquismo', 'Siete leyes (1938–1967); no fue una constitución', 'En el jefe del Estado; sin soberanía popular', 'Sin elecciones libres; Cortes orgánicas, «tercio familiar» desde 1967', 'Cortes consultivas de procuradores', 'Confesionalidad católica; Concordato de 1953', 'Fuero de los Españoles (1945) sin garantías reales', 'Centralista; lenguas no castellanas reprimidas', '1938–1977'],
      ['Constitución de 1978', 'Consenso de la Transición; referéndum del 6-12-1978', 'Nacional: reside en el pueblo español', 'Universal desde los 18 años', 'Bicameral: Congreso y Senado', 'Aconfesional con cooperación con la Iglesia católica y otras confesiones', 'Extensa, protegida por el Tribunal Constitucional (recurso de amparo)', 'Estado de las autonomías; reconoce nacionalidades y regiones', 'Desde el 29-12-1978']
    ], note: 'Elaboración propia a partir de los textos constitucionales (Congreso de los Diputados, «Constituciones españolas 1812–1978») y de M. Artola, Constitucionalismo en la historia (Crítica, 2005). Se omiten el Estatuto de Bayona (1808), el Estatuto Real (1834, carta otorgada) y la constitución «non nata» de 1856.' },
  ccaa: { title: 'Comunidades y ciudades autónomas', head: ['Comunidad', 'Capital o sede', 'Provincias', 'Población (≈ millones)', 'Superficie (km²)', 'Primer estatuto'],
    rows: Object.values(X.ccaa).map(c => [c.n, c.cap, null, c.pop, c.area, c.est]),
    note: 'Fuentes: INE (población 2025, redondeada; superficie) y BOE (estatutos de autonomía).' },
  europa: { title: 'España y sus grandes vecinos europeos', head: ['País', 'Población (≈ millones, 2025)', 'Forma de Estado', 'Entrada en la CEE/UE', 'Euro', 'Deuda pública 2024 (% PIB)', 'Escaños en el Parlamento Europeo 2024–2029', 'PIB por habitante en PPA 2025 (UE = 100)'],
    rows: [
      ['España', 49.1, 'Monarquía parlamentaria; Estado autonómico', '1986', '1999 (monedas y billetes, 2002)', 101.8, 61, 'Hasta un 10 % por debajo de la media'],
      ['Francia', 68.6, 'República semipresidencial; Estado unitario', '1957 (fundador)', '1999', 113.0, 81, 'Hasta un 10 % por debajo de la media'],
      ['Alemania', 83.6, 'República federal parlamentaria', '1957 (fundador)', '1999', 62.5, 96, 'Por encima de la media'],
      ['Italia', 58.9, 'República parlamentaria; Estado regional', '1957 (fundador)', '1999', 135.3, 76, 'Hasta un 10 % por debajo de la media'],
      ['Portugal', 10.7, 'República semipresidencial; unitaria con dos regiones autónomas', '1986', '1999', 94.9, 21, 'Entre un 10 % y un 20 % por debajo']
    ], note: 'Fuentes: Eurostat (población a 1-1-2025, redondeada; deuda, notificación de abril de 2025; estimación preliminar de PIB por habitante en paridad de poder adquisitivo para 2025, publicada en diciembre de 2025, que agrupa a los países por tramos) y Parlamento Europeo (reparto de escaños de 2024).' }
};
(function () { const n = { '01': 8, '02': 3, '03': 1, '04': 1, '05': 2, '06': 1, '07': 9, '08': 5, '09': 4, '10': 3, '11': 2, '12': 4, '13': 1, '14': 1, '15': 1, '16': 3, '17': 1, '18': '—', '19': '—' }; X.tables.ccaa.rows.forEach((r, i) => { r[2] = n[String(i + 1).padStart(2, '0')]; }); })();

/* ---------- Presidentes del Gobierno ---------- */
X.presidents = [
  { n: 'Adolfo Suárez', p: 'UCD', a: 1976.5, b: 1981.16, ra: '1976–1981', how: 'Nombrado por el rey en julio de 1976; ganó las elecciones de 1977 y 1979 al frente de la UCD.', key: 'Ley para la Reforma Política (1976), legalización del PCE (1977), Pactos de la Moncloa (1977), Constitución (1978), primeros estatutos de autonomía. Dimitió en enero de 1981.' },
  { n: 'Leopoldo Calvo-Sotelo', p: 'UCD', a: 1981.16, b: 1982.92, ra: '1981–1982', how: 'Su votación de investidura se interrumpió por el golpe del 23-F; investido el 25 de febrero de 1981.', key: 'Ingreso en la OTAN (1982), ley del divorcio (1981), LOAPA. La UCD se descompuso y perdió las elecciones de 1982.' },
  { n: 'Felipe González', p: 'PSOE', a: 1982.92, b: 1996.35, ra: '1982–1996', how: 'Cuatro victorias electorales: tres mayorías absolutas (1982, 1986, 1989) y una mayoría relativa con apoyo de CiU (1993).', key: 'Reconversión industrial, ingreso en la CEE (1986), referéndum de la OTAN (1986), universalización de la sanidad (1986) y la educación, huelga general de 1988, Barcelona y Sevilla 1992, Maastricht. Final marcado por la corrupción y el caso GAL.' },
  { n: 'José María Aznar', p: 'PP', a: 1996.35, b: 2004.3, ra: '1996–2004', how: 'Mayoría relativa en 1996 con apoyo de CiU, PNV y CC; mayoría absoluta en 2000.', key: 'Cumplimiento de los criterios de Maastricht y entrada en el euro, privatizaciones, fin del servicio militar obligatorio (2001), auge inmobiliario, apoyo a la invasión de Irak (2003), atentados del 11-M (2004).' },
  { n: 'José Luis Rodríguez Zapatero', p: 'PSOE', a: 2004.3, b: 2011.97, ra: '2004–2011', how: 'Ganó en 2004 y 2008 en minoría, con apoyos parlamentarios variables.', key: 'Retirada de Irak, matrimonio entre personas del mismo sexo (2005), ley de dependencia (2006), Estatut de Cataluña (2006), ley de memoria histórica (2007), crisis de 2008, reforma del art. 135 de la Constitución (2011). ETA anunció el cese definitivo en 2011.' },
  { n: 'Mariano Rajoy', p: 'PP', a: 2011.97, b: 2018.42, ra: '2011–2018', how: 'Mayoría absoluta en 2011; tras un año de bloqueo, investido en 2016 con abstención del PSOE.', key: 'Reforma laboral (2012), rescate bancario europeo (2012), austeridad, abdicación de Juan Carlos I (2014), aplicación del art. 155 en Cataluña (2017). Primer presidente desalojado por una moción de censura (2018).' },
  { n: 'Pedro Sánchez', p: 'PSOE', a: 2018.42, b: 2026.86, ra: '2018–', how: 'Llegó por moción de censura (2018); gobiernos de coalición con Unidas Podemos (2020) y Sumar (2023) apoyados por partidos nacionalistas.', key: 'Subidas del salario mínimo, pandemia y estados de alarma (2020–2021), fondos europeos Next Generation, reforma laboral (2021), indultos (2021) y ley de amnistía (2024) a los condenados por el procés. El 5 de octubre de 2026 convocó elecciones anticipadas para el 29 de noviembre.' }
];

/* ---------- Procedimientos ---------- */
X.steps = {
  ley: { title: 'Cómo se aprueba una ley ordinaria', items: [
    '<b>Iniciativa.</b> El Gobierno presenta un <i>proyecto de ley</i> aprobado en Consejo de Ministros; o los grupos parlamentarios, el Senado, los parlamentos autonómicos o 500.000 ciudadanos presentan una <i>proposición de ley</i>.',
    '<b>Toma en consideración</b> (solo proposiciones): el Pleno del Congreso decide si la tramita.',
    '<b>Enmiendas.</b> Los grupos pueden presentar enmiendas a la totalidad (devolverla al Gobierno o proponer un texto alternativo) o al articulado.',
    '<b>Ponencia y comisión.</b> Un grupo reducido de diputados redacta un informe y la comisión correspondiente debate y vota el texto.',
    '<b>Pleno del Congreso.</b> Aprueba el texto por mayoría simple (más síes que noes). Las leyes orgánicas exigen mayoría absoluta (176) en una votación final sobre el conjunto.',
    '<b>Senado.</b> Dispone de dos meses: puede aprobarlo, introducir enmiendas (por mayoría simple) o vetarlo (por mayoría absoluta).',
    '<b>Vuelta al Congreso.</b> Acepta o rechaza las enmiendas del Senado por mayoría simple; levanta el veto por mayoría absoluta o, pasados dos meses, por mayoría simple.',
    '<b>Sanción, promulgación y publicación.</b> El rey sanciona la ley en quince días y se publica en el BOE. Entra en vigor cuando la propia ley indique (por defecto, a los veinte días).'
  ], note: 'Constitución, arts. 81 y 87–91; Reglamento del Congreso de los Diputados.' },
  investidura: { title: 'Cómo se elige al presidente del Gobierno (art. 99)', items: [
    'Tras las elecciones se constituyen las Cortes y se eligen las Mesas del Congreso y del Senado.',
    'El rey consulta a los representantes de los grupos con representación parlamentaria.',
    'El rey propone un candidato a través de la presidencia del Congreso.',
    'El candidato expone su programa en el Pleno y solicita la confianza de la Cámara.',
    '<b>Primera votación:</b> necesita mayoría absoluta (176 de 350).',
    '<b>Segunda votación,</b> 48 horas después: basta la mayoría simple (más síes que noes).',
    'Si fracasa, pueden proponerse nuevos candidatos. Si a los dos meses de la primera votación nadie ha sido investido, las Cortes se disuelven automáticamente y se convocan nuevas elecciones (ocurrió en 2016 y en 2019).'
  ], note: 'Constitución, art. 99.' },
  censura: { title: 'Moción de censura y cuestión de confianza', items: [
    '<b>Moción de censura (art. 113):</b> la presenta al menos una décima parte de los diputados (35) y debe incluir un candidato alternativo. Es «constructiva»: no basta con derribar al Gobierno, hay que proponer otro.',
    'No puede votarse hasta cinco días después de presentarse; en los dos primeros pueden presentarse mociones alternativas.',
    'Para prosperar necesita mayoría absoluta (176). Si triunfa, el candidato queda investido presidente automáticamente.',
    'Se han votado seis mociones desde 1978 (1980, 1987, 2017, 2018, 2020 y 2023). Solo prosperó la de 2018, que llevó a Pedro Sánchez a la presidencia.',
    '<b>Cuestión de confianza (art. 112):</b> el presidente, tras deliberar el Consejo de Ministros, pide el apoyo del Congreso a su programa o a una declaración de política general. Basta la mayoría simple; si la pierde, debe dimitir. Solo se ha usado dos veces (Suárez, 1980; González, 1990) y ambas se superaron.'
  ], note: 'Constitución, arts. 112–114. Historial: Congreso de los Diputados.' }
};

/* ---------- «No entiendo este concepto» ---------- */
X.simple = [
  { t: 'Antiguo Régimen', s: 'El sistema político, social y económico de Europa antes de las revoluciones liberales: un rey con poder absoluto, una sociedad dividida en estamentos con derechos distintos según el nacimiento y una economía agraria donde la tierra apenas se compraba y vendía.', e: 'Un campesino del siglo XVIII pagaba diezmo a la Iglesia y rentas al señor, no podía ser juzgado igual que un noble y no tenía ninguna vía para votar. Eso es lo que las constituciones del XIX quisieron cambiar.', l: ['m6-3', 'm7-2'] },
  { t: 'Unión dinástica', s: 'Dos o más reinos comparten un mismo rey, pero cada uno conserva sus leyes, sus instituciones, su moneda y sus fronteras. No es un Estado único: es una misma persona que lleva varias coronas.', e: 'Fernando el Católico necesitaba que las Cortes de Aragón aprobaran impuestos en Aragón y las de Castilla en Castilla. Un castellano era extranjero a efectos legales en Valencia.', l: ['m4-5', 'm5-1'] },
  { t: 'Fueros', s: 'Conjunto de leyes, privilegios e instituciones propios de un territorio o una ciudad, reconocidos por el rey. En la España moderna, cada reino tenía los suyos; los vascos y navarros los conservaron hasta el siglo XIX y parte de ellos, en forma fiscal, hasta hoy.', e: 'El Concierto Económico vasco y el Convenio navarro, por los que esas comunidades recaudan casi todos sus impuestos, son la herencia actual de los fueros.', l: ['m6-1', 'm11-5'] },
  { t: 'Valido', s: 'Persona de máxima confianza del rey a la que este delegaba el gobierno en el siglo XVII, sin que ocupara un cargo institucional definido. No era un primer ministro moderno: su poder dependía solo del favor real.', e: 'El conde-duque de Olivares gobernó en nombre de Felipe IV durante más de veinte años y cayó en 1643 cuando el rey le retiró su confianza.', l: ['m5-5'] },
  { t: 'Liberalismo', s: 'Doctrina que defiende que el poder procede de la nación y no de Dios ni del rey, que debe estar limitado por una constitución y dividido en poderes, y que los individuos tienen derechos (propiedad, libertad de expresión) iguales ante la ley.', e: 'La Constitución de Cádiz de 1812 es el primer texto liberal español. El liberalismo del XIX, sin embargo, solía reservar el voto a los propietarios: no era todavía democrático.', l: ['m7-2', 'm7-4'] },
  { t: 'Pronunciamiento', s: 'Forma de cambiar el Gobierno en el siglo XIX: un militar se «pronuncia», es decir, se declara en rebeldía con sus tropas y espera que otras guarniciones se sumen. No buscaba una batalla, sino demostrar que el Gobierno ya no tenía apoyos.', e: 'Riego en 1820, Espartero, O\'Donnell en 1854, Prim en 1868 o Martínez Campos en 1874. El golpe de 1936 se concibió como un pronunciamiento y, al fracasar en parte, derivó en guerra.', l: ['m7-4', 'm8-5'] },
  { t: 'Desamortización', s: 'Expropiación por el Estado de tierras «amortizadas» (que no se podían vender, porque pertenecían a la Iglesia, los municipios o instituciones) para subastarlas a particulares. Buscaba dinero para la Hacienda y crear un mercado de tierras.', e: 'Con la desamortización de Mendizábal (1836) muchos conventos pasaron a manos privadas; las tierras acabaron sobre todo en manos de quienes ya tenían dinero, no de los jornaleros.', l: ['m7-4', 'm12-1'] },
  { t: 'Carlismo', s: 'Movimiento que defendía los derechos al trono de Carlos María Isidro (hermano de Fernando VII) y de sus descendientes, y con ellos una monarquía tradicional, católica y respetuosa con los fueros, frente al liberalismo.', e: 'Su lema era «Dios, Patria, Rey» (después añadió «Fueros»). Provocó tres guerras civiles en el siglo XIX y sus milicias, los requetés, combatieron con los sublevados en 1936.', l: ['m7-4', 'm7-6'] },
  { t: 'Turnismo y caciquismo', s: 'En la Restauración (1876–1923), los dos grandes partidos, conservador y liberal, se alternaban en el poder por acuerdo. El Gobierno se nombraba primero y las elecciones se organizaban después para darle mayoría, gracias a los caciques, notables locales que controlaban votos a cambio de favores.', e: 'El «encasillado» era la lista, preparada en el Ministerio de la Gobernación, de qué candidato debía ganar en cada distrito. Las elecciones confirmaban, no decidían.', l: ['m7-6'] },
  { t: 'Sufragio censitario y universal', s: 'Censitario: solo votan quienes pagan una cantidad mínima de impuestos o tienen ciertas rentas o estudios. Universal: votan todos los adultos (al principio, solo los varones).', e: 'Con la ley de 1846 votaba alrededor del 1 % de la población. Los varones mayores de 25 años votaron en 1869 y desde 1890; las mujeres, por primera vez, en 1933.', l: ['m7-4', 'm8-3'] },
  { t: 'Nacionalismo periférico', s: 'Movimientos políticos nacidos a finales del siglo XIX en Cataluña, el País Vasco y, después, Galicia, que defienden que su territorio es una nación con derecho a autogobierno (o a la independencia), frente al nacionalismo español centralista.', e: 'Prat de la Riba y la Lliga en Cataluña; Sabino Arana y el PNV en el País Vasco. Hoy siguen siendo decisivos en el Congreso.', l: ['m7-7', 'm11-5'] },
  { t: 'Anarquismo y socialismo', s: 'Dos ramas del movimiento obrero. El socialismo quería conquistar el Estado (con partidos y elecciones, o con una revolución) para transformar la sociedad. El anarquismo rechazaba el Estado y la política parlamentaria y defendía la acción directa sindical.', e: 'En España el socialismo se organizó en el PSOE (1879) y la UGT (1888), con fuerza en Madrid, Asturias y Vizcaya. El anarquismo, en la CNT (1910), con fuerza en Cataluña y Andalucía.', l: ['m7-7', 'm8-1'] },
  { t: 'Autarquía', s: 'Política económica que pretende que el país se abastezca a sí mismo, comerciando lo menos posible con el exterior y con el Estado controlando precios, producción y divisas.', e: 'En los años cuarenta el racionamiento duró hasta 1952 y prosperó el estraperlo (mercado negro). La renta por habitante no recuperó el nivel de 1935 hasta comienzos de los cincuenta.', l: ['m8-7', 'm12-1'] },
  { t: 'Nacionalcatolicismo', s: 'Alianza entre el régimen de Franco y la Iglesia católica: el Estado se declaraba católico y entregaba a la Iglesia un papel central en la educación y la moral pública; la Iglesia legitimaba la dictadura como defensa de la fe.', e: 'El Concordato de 1953 y los obispos sentados en las Cortes franquistas. Desde los años sesenta, tras el Concilio Vaticano II, parte del clero se distanció del régimen.', l: ['m8-7', 'm13-4'] },
  { t: 'Reforma frente a ruptura', s: 'Los dos caminos debatidos en 1975–1977 para pasar de la dictadura a la democracia. Ruptura: romper con las instituciones franquistas mediante un Gobierno provisional. Reforma: usar las propias leyes franquistas para cambiarlas desde dentro.', e: 'Se impuso una vía mixta: la Ley para la Reforma Política (1976) la aprobaron las Cortes franquistas, pero después hubo negociación con la oposición. Se le llama «ruptura pactada».', l: ['m8-9'] },
  { t: 'Estado autonómico', s: 'Modelo territorial de la Constitución de 1978: España no es un Estado federal ni centralizado; está dividida en comunidades autónomas con parlamento y gobierno propios que gestionan amplias competencias, bajo una sola soberanía y una sola Constitución.', e: 'Su sanidad la gestiona la comunidad donde vive; la defensa y las pensiones, el Estado; la recogida de basuras, su ayuntamiento.', l: ['m8-9', 'm11-5'] },
  { t: 'Moción de censura constructiva', s: 'Mecanismo para derribar al Gobierno que obliga a proponer a la vez un nuevo presidente. Se copió de la Ley Fundamental alemana para evitar que una mayoría negativa tumbara gobiernos sin alternativa.', e: 'En 2018 la moción contra Rajoy presentaba como candidato a Pedro Sánchez; al aprobarse, este pasó a ser presidente sin nuevas elecciones.', l: ['m11-2', 'm9-5'] },
  { t: "Ley D'Hondt", s: 'Fórmula matemática para repartir los escaños de cada provincia en proporción a los votos. Se dividen los votos de cada partido entre 1, 2, 3… y los escaños se asignan a los cocientes más altos.', e: 'Con circunscripciones pequeñas (Soria elige 2 diputados), el resultado se aleja mucho de la proporcionalidad: favorece a los partidos grandes y a los concentrados territorialmente. Pruébelo en el simulador.', l: ['m11-4'] },
  { t: 'Déficit y deuda pública', s: 'El déficit es lo que el Estado gasta de más en un año respecto a lo que ingresa. La deuda es la suma acumulada de todos los déficits pasados que aún no se han devuelto. El déficit es el agujero de este año; la deuda, el saldo del préstamo.', e: 'Una familia que gasta 2.000 € más de lo que gana en un año tiene un déficit de 2.000 €; si lleva diez años así, su deuda será de unos 20.000 €.', l: ['m12-3'] },
  { t: 'Prima de riesgo', s: 'Diferencia entre el interés que pagan los bonos de un Estado a diez años y los de Alemania, considerados el activo más seguro de la zona euro. Mide la desconfianza de los inversores.', e: 'En julio de 2012 superó los 600 puntos básicos: España pagaba más de un 6 % más que Alemania por endeudarse, lo que amenazaba con un rescate total.', l: ['m9-4', 'm12-5'] },
  { t: 'Burbuja inmobiliaria', s: 'Subida de precios de la vivienda muy por encima de lo que justifican los ingresos de la población, alimentada por crédito barato y por la expectativa de que los precios seguirán subiendo. Cuando esa expectativa se rompe, los precios caen y quienes se endeudaron quedan atrapados.', e: 'Entre 1997 y 2007 se construyeron en España más viviendas al año que en Alemania, Francia e Italia juntas en algunos ejercicios. El estallido de 2008 llevó a la crisis bancaria de las cajas de ahorro.', l: ['m9-3', 'm12-5'] },
  { t: 'Productividad', s: 'Cuánto se produce por cada hora trabajada o por cada trabajador. Es lo que, a largo plazo, permite subir salarios sin generar inflación.', e: 'España crea mucho empleo en épocas de expansión, pero en sectores de baja productividad (construcción, hostelería), por lo que los salarios reales crecen poco.', l: ['m12-4'] },
  { t: 'Inflación', s: 'Subida generalizada y sostenida de los precios. Si los salarios no suben al mismo ritmo, se pierde poder adquisitivo.', e: 'En 2022, por la guerra de Ucrania y el encarecimiento de la energía, el IPC llegó a superar el 10 % interanual en julio.', l: ['m12-3'] },
  { t: 'Romanización', s: 'Proceso, de varios siglos, por el que los pueblos de Hispania adoptaron la lengua latina, el derecho, las ciudades, la religión y las costumbres de Roma. No fue un acto de un día ni algo impuesto por igual en todas partes.', e: 'El castellano, el catalán, el gallego y el portugués descienden del latín hablado en Hispania; el euskera es la única lengua peninsular que sobrevivió a la romanización.', l: ['m2-4'] },
  { t: 'Taifa', s: 'Del árabe <i>tā\'ifa</i>, «bando» o «facción». Cada uno de los reinos independientes en que se dividió al-Ándalus tras la desintegración del califato de Córdoba (1031).', e: 'Las taifas de Sevilla, Toledo o Zaragoza eran ricas pero militarmente débiles y pagaban parias (tributos) a los reyes cristianos para evitar sus ataques.', l: ['m3-3'] },
  { t: 'Reconquista', s: 'Término con el que la historiografía del siglo XIX describió la expansión de los reinos cristianos sobre al-Ándalus (722–1492) como una empresa unitaria de recuperación de la España visigoda. Hoy se discute porque presupone una continuidad y una conciencia nacional que no existían.', e: 'Muchos historiadores prefieren hablar de «expansión de los reinos cristianos» o «conquista feudal», aunque el término sigue siendo de uso común.', l: ['m4-1', 'm4-3'] },
  { t: 'Leyenda negra', s: 'Imagen negativa de España como país intolerante, cruel y atrasado, difundida desde el siglo XVI por los rivales de la monarquía hispánica (Países Bajos, Inglaterra) en plena guerra de religión. Se discute cuánto tenía de propaganda y cuánto de crítica fundada.', e: 'La obra de fray Bartolomé de las Casas sobre la destrucción de las Indias fue traducida y usada como propaganda antiespañola en Europa.', l: ['m5-4'] },
  { t: 'Ilustración', s: 'Movimiento intelectual del siglo XVIII que confiaba en la razón, la ciencia y la educación para mejorar la sociedad, y criticaba la superstición y los privilegios. En España fue más moderada que en Francia y se apoyó en la Corona.', e: 'Jovellanos, Campomanes o Feijoo; las Sociedades Económicas de Amigos del País; la expulsión de los jesuitas en 1767.', l: ['m6-2'] },
  { t: 'Concierto económico', s: 'Acuerdo por el que las diputaciones forales vascas (y, mediante el Convenio, Navarra) recaudan casi todos los impuestos en su territorio y pagan al Estado un «cupo» por los servicios que este presta allí (defensa, exteriores…).', e: 'Un trabajador de Bilbao paga su IRPF a la Hacienda Foral de Bizkaia, no a la Agencia Tributaria estatal.', l: ['m11-5', 'm12-3'] }
];

/* ---------- Conexiones históricas ---------- */
X.threads = [
  { t: 'La cuestión territorial: de los reinos al Estado autonómico', d: 'Por qué España tiene comunidades con lenguas, derecho civil o sistemas fiscales propios y por qué la organización territorial sigue siendo motivo de conflicto.', s: [
    ['711–1492', 'Los reinos cristianos nacen separados, con leyes, lenguas e instituciones distintas.', 'm4-3'], ['1469–1516', 'Los Reyes Católicos unen las coronas, no los reinos: cada uno mantiene sus fueros.', 'm4-5'],
    ['1640', 'Revueltas de Cataluña y Portugal contra la Unión de Armas de Olivares; Portugal se separa definitivamente.', 'm5-5'], ['1707–1716', 'Decretos de Nueva Planta: la Corona de Aragón pierde sus instituciones; navarros y vascos las conservan.', 'm6-1'],
    ['1833–1876', 'Provincias de Javier de Burgos, Estado liberal centralista; fin de los fueros vascos tras la última guerra carlista y nacimiento del Concierto (1878).', 'm7-4'], ['1890–1906', 'Nacen los nacionalismos catalán y vasco.', 'm7-7'],
    ['1932–1936', 'Estatutos de autonomía de Cataluña y País Vasco durante la República.', 'm8-3'], ['1939–1975', 'Centralismo franquista y represión de las lenguas regionales.', 'm8-7'],
    ['1978–1983', 'Constitución y «café para todos»: diecisiete comunidades.', 'm8-9'], ['2006–2017', 'Nuevo Estatut, sentencia del TC (2010) y proceso independentista.', 'm9-4'], ['Hoy', 'Financiación autonómica, amnistía y negociaciones con partidos nacionalistas.', 'm11-5']] },
  { t: 'El Ejército y la política', d: 'Por qué el militarismo fue un problema crónico hasta los años ochenta y por qué hoy no lo es.', s: [
    ['1808–1814', 'La guerra contra Napoleón crea un ejército de oficiales salidos de la guerra, protagonistas políticos desde entonces.', 'm7-1'], ['1820', 'Pronunciamiento de Riego: primera vez que un militar impone un régimen.', 'm7-2'],
    ['1833–1874', 'Los generales Espartero, Narváez, O\'Donnell, Prim y Serrano encabezan partidos y gobiernos.', 'm7-4'], ['1874–1923', 'Cánovas aparta a los militares del gobierno, pero el Ejército conserva poder (Ley de Jurisdicciones, 1906; Juntas de Defensa, 1917).', 'm8-1'],
    ['1923', 'Golpe de Primo de Rivera con apoyo del rey.', 'm8-2'], ['1932–1936', 'Sanjurjada y golpe del 18 de julio de 1936.', 'm8-5'], ['1939–1975', 'Dictadura de un general; el Ejército, garante del régimen.', 'm8-7'],
    ['1981', 'Fracaso del 23-F.', 'm8-9'], ['1982–hoy', 'Reforma militar, OTAN, fin del servicio obligatorio (2001), control civil pleno.', 'm9-1']] },
  { t: 'Iglesia y Estado', d: 'De la monarquía católica al Estado aconfesional, pasando por la desamortización, el laicismo republicano y el nacionalcatolicismo.', s: [
    ['589', 'Conversión de Recaredo al catolicismo en el III Concilio de Toledo.', 'm3-1'], ['1478–1492', 'Inquisición y expulsión de los judíos: la unidad religiosa como política de Estado.', 'm4-5'],
    ['1545–1563', 'La monarquía hispánica, brazo de la Contrarreforma.', 'm5-4'], ['1767', 'Carlos III expulsa a los jesuitas.', 'm6-2'], ['1836', 'Desamortización de Mendizábal.', 'm7-4'],
    ['1851', 'Concordato: el catolicismo, religión del Estado.', 'm7-4'], ['1931', 'Constitución laica; quema de conventos; ley de congregaciones.', 'm8-3'], ['1936', 'Violencia anticlerical en zona republicana y apoyo de la jerarquía a los sublevados.', 'm8-6'],
    ['1953', 'Concordato con el Vaticano.', 'm8-7'], ['1978', 'Estado aconfesional con cooperación (art. 16).', 'm11-1'], ['Hoy', 'Secularización acelerada.', 'm13-4']] },
  { t: 'La tierra y el campo', d: 'Cómo la propiedad de la tierra explica conflictos sociales desde la Edad Media hasta el éxodo rural.', s: [
    ['Siglos XI–XIII', 'Repoblación: pequeña propiedad en el norte, grandes dominios de órdenes militares y nobles en el sur.', 'm4-2'], ['1766', 'Motín de Esquilache y reformas agrarias ilustradas que no llegan a aplicarse.', 'm6-2'],
    ['1836–1855', 'Desamortizaciones de Mendizábal y Madoz.', 'm7-4'], ['1870–1930', 'Jornaleros andaluces y anarquismo agrario.', 'm7-7'], ['1932', 'Ley de Reforma Agraria de la República.', 'm8-3'],
    ['1950–1975', 'Éxodo rural: millones de personas dejan el campo.', 'm8-8'], ['1986–hoy', 'Política Agraria Común y «España vaciada».', 'm12-2']] },
  { t: 'España y Europa: de la hegemonía al aislamiento y a la integración', d: 'La relación con Europa como espejo de la historia española.', s: [
    ['1519–1648', 'Hegemonía de los Austrias.', 'm5-1'], ['1648–1713', 'Westfalia, los Pirineos y Utrecht: pérdida de la posición.', 'm5-5'], ['1808', 'Invasión napoleónica.', 'm7-1'],
    ['1898', 'El «Desastre» y la conciencia de atraso respecto a Europa.', 'm7-7'], ['1914–1918', 'Neutralidad en la Gran Guerra.', 'm8-1'], ['1936–1939', 'La guerra española como antesala de la mundial.', 'm8-5'],
    ['1946–1953', 'Aislamiento y acuerdos con EE. UU.', 'm8-7'], ['1986', 'Ingreso en la CEE.', 'm9-1'], ['1999–2002', 'Euro.', 'm10-3'], ['Hoy', 'Fondos Next Generation y papel de España en la UE.', 'm10-4']] },
  { t: 'La monarquía: de la autoridad absoluta a la función simbólica', d: 'Cómo cambió el papel del rey en cinco siglos.', s: [
    ['1479–1700', 'Monarquía compuesta de los Austrias.', 'm5-1'], ['1700–1808', 'Absolutismo ilustrado borbónico.', 'm6-2'], ['1812', 'Monarquía constitucional de Cádiz.', 'm7-2'],
    ['1868–1874', 'Destronamiento de Isabel II, Amadeo I y República.', 'm7-5'], ['1875', 'Restauración.', 'm7-6'], ['1931', 'Exilio de Alfonso XIII.', 'm8-3'],
    ['1947–1969', 'Ley de Sucesión y designación de Juan Carlos.', 'm8-8'], ['1978', 'Monarquía parlamentaria.', 'm11-1'], ['2014', 'Abdicación de Juan Carlos I.', 'm9-4']] },
  { t: 'Las lenguas de España', d: 'Del latín a la cooficialidad.', s: [
    ['Siglos I a. C.–V', 'Romanización y latinización; el euskera sobrevive.', 'm2-4'], ['Siglos X–XIII', 'Nacen los romances: castellano, catalán, gallego-portugués, astur-leonés, navarro-aragonés.', 'm13-1'],
    ['1492', 'Gramática de Nebrija.', 'm4-5'], ['1716', 'Nueva Planta: el castellano como lengua de la administración en la Corona de Aragón.', 'm6-1'],
    ['1833–1900', 'Renaixença catalana, Rexurdimento gallego, renacimiento del euskera.', 'm7-7'], ['1939–1975', 'Restricción del uso público de las otras lenguas.', 'm8-7'], ['1978', 'Cooficialidad (art. 3).', 'm13-1']] },
  { t: 'Economía: crisis y modernizaciones', d: 'Ciclos de apertura y cierre que explican la economía actual.', s: [
    ['1545–1640', 'Plata americana, inflación y bancarrotas.', 'm5-2'], ['1830–1900', 'Industrialización periférica en Cataluña y el País Vasco; ferrocarril.', 'm7-7'], ['1891', 'Arancel proteccionista.', 'm12-1'],
    ['1939–1959', 'Autarquía.', 'm8-7'], ['1959–1973', 'Plan de Estabilización y desarrollismo.', 'm8-8'], ['1977', 'Pactos de la Moncloa.', 'm8-9'], ['1986–2007', 'Integración europea y boom inmobiliario.', 'm9-2'],
    ['2008–2014', 'Gran Recesión.', 'm9-3'], ['2020–hoy', 'Pandemia, fondos europeos, inflación y crisis de vivienda.', 'm12-5']] }
];

/* ---------- Glosario adicional ---------- */
X.glossary = [
  ['Absolutismo', 'Forma de monarquía en la que el rey concentra todos los poderes sin límites constitucionales, aunque sometido en teoría a la ley divina y a las leyes fundamentales del reino.', 'm10-1'],
  ['Arancel', 'Impuesto que grava los productos importados. Se usa para recaudar o para proteger la producción nacional.', 'm12-1'],
  ['BOE', 'Boletín Oficial del Estado. Diario oficial donde se publican leyes, decretos y disposiciones; una norma no entra en vigor sin publicarse.', 'm11-2'],
  ['Cabildo insular', 'Órgano de gobierno de cada isla en Canarias, equivalente a una diputación provincial.', 'm11-5'],
  ['Circunscripción', 'Territorio en el que se eligen un número determinado de representantes. En las elecciones al Congreso es la provincia.', 'm11-4'],
  ['Cortes', 'Nombre histórico de las asambleas representativas de los reinos medievales y, desde 1812, del Parlamento español (Congreso y Senado).', 'm11-2'],
  ['Decreto-ley', 'Norma con rango de ley que el Gobierno puede dictar en caso de «extraordinaria y urgente necesidad». El Congreso debe convalidarla en treinta días o queda derogada.', 'm11-2'],
  ['Diputación provincial', 'Órgano de gobierno de la provincia, elegido indirectamente a partir de los concejales. Presta asistencia a los municipios pequeños.', 'm11-5'],
  ['Estamento', 'Grupo social definido por nacimiento y con derechos propios en el Antiguo Régimen: nobleza, clero y estado llano.', 'm6-3'],
  ['Grupo parlamentario', 'Agrupación de diputados o senadores de un mismo partido o coalición, con derechos de intervención y recursos propios.', 'm11-2'],
  ['IPC', 'Índice de Precios de Consumo. Mide la evolución del precio de una cesta de bienes y servicios representativa del gasto de los hogares; publicado por el INE.', 'm12-3'],
  ['IRPF', 'Impuesto sobre la Renta de las Personas Físicas. Grava los ingresos anuales de los individuos de forma progresiva; su recaudación se reparte entre el Estado y las comunidades.', 'm12-3'],
  ['IVA', 'Impuesto sobre el Valor Añadido. Grava el consumo; el tipo general en España es del 21 %.', 'm12-3'],
  ['Ley orgánica', 'Ley que regula derechos fundamentales, estatutos de autonomía y régimen electoral, entre otras materias, y exige mayoría absoluta del Congreso.', 'm11-2'],
  ['Mayoría absoluta', 'Más de la mitad de los miembros de la cámara: 176 de 350 diputados.', 'm11-2'],
  ['Mayoría simple', 'Más votos a favor que en contra entre los presentes.', 'm11-2'],
  ['Mudéjar', 'Musulmán que vivía en territorio cristiano conservando su religión; también, el arte que mezcla tradiciones islámicas y cristianas.', 'm4-2'],
  ['Mozárabe', 'Cristiano que vivía en al-Ándalus bajo dominio musulmán.', 'm3-4'],
  ['Morisco', 'Musulmán convertido (a menudo a la fuerza) al cristianismo tras 1502 en Castilla y 1526 en Aragón; expulsados entre 1609 y 1614.', 'm5-5'],
  ['PIB', 'Producto Interior Bruto: valor de todos los bienes y servicios finales producidos en un país en un año.', 'm12-3'],
  ['Presupuestos Generales del Estado', 'Ley anual que fija los ingresos previstos y los gastos autorizados del sector público estatal. Si no se aprueban, se prorrogan los del año anterior.', 'm11-2'],
  ['Prorrogatio', 'Prórroga automática de los presupuestos del año anterior cuando no se aprueban unos nuevos antes del 1 de enero (art. 134.4 de la Constitución).', 'm11-2'],
  ['Real Academia de la Historia', 'Institución fundada en 1738 dedicada al estudio de la historia de España; publica el Diccionario Biográfico Español.', 'metodo'],
  ['Señorío', 'Territorio en el que un noble, una orden militar o un eclesiástico ejercía en nombre del rey funciones de gobierno y justicia, y cobraba rentas.', 'm4-2'],
  ['Visigodo', 'Pueblo germánico que se estableció en la península en el siglo V y fundó un reino con capital en Toledo.', 'm3-1']
];

/* ---------- Contexto europeo y mundial para la línea temporal ---------- */
X.worldEvents = [
  [476, '476', 'Depuesto Rómulo Augústulo: fin del Imperio romano de Occidente.', 'm2-4'], [800, '800', 'Carlomagno coronado emperador en Roma.', 'm10-1'],
  [1453, '1453', 'Los otomanos toman Constantinopla.', 'm10-1'], [1517, '1517', 'Lutero difunde sus 95 tesis: comienza la Reforma protestante.', 'm5-4'],
  [1618, '1618', 'Defenestración de Praga: comienza la guerra de los Treinta Años.', 'm5-5'], [1648, '1648', 'Paz de Westfalia: nace el sistema europeo de Estados soberanos.', 'm10-1'],
  [1688, '1688', 'Revolución Gloriosa en Inglaterra: monarquía parlamentaria.', 'm10-1'], [1776, '1776', 'Declaración de Independencia de Estados Unidos.', 'm6-3'],
  [1789, '1789', 'Revolución francesa.', 'm10-1'], [1815, '1815', 'Congreso de Viena y derrota definitiva de Napoleón en Waterloo.', 'm10-1'],
  [1848, '1848', 'Revoluciones liberales y democráticas en buena parte de Europa.', 'm10-1'], [1871, '1871', 'Unificación de Alemania; Roma, capital de Italia.', 'm10-1'],
  [1914, '1914', 'Comienza la Primera Guerra Mundial.', 'm10-2'], [1917, '1917', 'Revolución rusa.', 'm10-2'], [1919, '1919', 'Tratado de Versalles.', 'm10-2'],
  [1922, '1922', 'Mussolini llega al poder en Italia.', 'm10-2'], [1929, '1929', 'Crac de Wall Street y Gran Depresión.', 'm10-2'], [1933, '1933', 'Hitler, canciller de Alemania.', 'm10-2'],
  [1939, '1939', 'Alemania invade Polonia: comienza la Segunda Guerra Mundial.', 'm10-2'], [1945, '1945', 'Fin de la Segunda Guerra Mundial; nace la ONU.', 'm10-2'],
  [1947, '1947', 'Plan Marshall, del que España queda excluida.', 'm10-3'], [1949, '1949', 'Fundación de la OTAN.', 'm10-3'], [1951, '1951', 'Tratado de París: Comunidad Europea del Carbón y del Acero.', 'm10-3'],
  [1957, '1957', 'Tratados de Roma: nace la Comunidad Económica Europea.', 'm10-3'], [1968, '1968', 'Mayo francés y Primavera de Praga.', 'm10-3'],
  [1974, '1974', 'Revolución de los Claveles en Portugal; caída de la dictadura de los coroneles en Grecia.', 'm8-9'], [1989, '1989', 'Caída del Muro de Berlín.', 'm10-3'],
  [1992, '1992', 'Tratado de Maastricht: nace la Unión Europea.', 'm10-3'], [2001, '2001', 'Atentados del 11 de septiembre en Estados Unidos.', 'm9-2'],
  [2004, '2004', 'Gran ampliación de la UE hacia el este (diez nuevos Estados).', 'm10-3'], [2008, '2008', 'Quiebra de Lehman Brothers: crisis financiera global.', 'm9-3'],
  [2020, '2020', 'Pandemia de COVID-19; el Reino Unido abandona la UE (31 de enero).', 'm10-3'], [2022, '2022', 'Rusia invade Ucrania.', 'm10-4']
];

/* ---------- Método ---------- */
X.method = `
## Para quién está escrita esta guía

Para una persona adulta, curiosa y sin formación histórica especializada que quiere entender España: cómo se formó, cómo funciona y por qué discute lo que discute. Cada lección responde a una pregunta: por qué importa esto para comprender el país de hoy.

## Cómo está organizada

Trece módulos: uno de geografía, ocho de historia en orden cronológico y cuatro temáticos (Europa, instituciones, economía, cultura y sociedad) que se apoyan en los anteriores. Todas las lecciones siguen la misma estructura: contexto, relato, protagonistas, cronología, causas y consecuencias, conexiones con lo anterior y lo posterior, relevancia actual, debates historiográficos, vocabulario, resumen, preguntas y fuentes.

## Criterios de rigor

- Se distinguen tres niveles: **hechos documentados** (fechas, leyes, resultados electorales), **interpretaciones** (por qué ocurrió algo) y **controversias** (cuando historiadores reconocidos sostienen tesis distintas). Los debates aparecen en un apartado propio de cada lección.
- No se atribuyen citas textuales salvo cuando proceden de documentos de autoría segura (constituciones, leyes, discursos registrados).
- Las cifras de mapas, tablas y gráficos proceden de fuentes oficiales citadas al pie (INE, Banco de España, Eurostat, BOE, Congreso, Senado, Parlamento Europeo). Cuando un dato está redondeado, es provisional o es una estimación, se indica.
- En la historia reciente se describen los hechos y las posiciones de los actores sin presentar como hechos las opiniones de ninguno de ellos. La información política está actualizada a **10 de noviembre de 2026**: elecciones generales convocadas para el 29 de noviembre de 2026.
- Las cifras de víctimas de guerras y represiones se dan como rangos o con su fuente, porque son objeto de investigación en curso.

## Mapas

La cartografía de base procede del Instituto Geográfico Nacional (Equipamiento Geográfico de Referencia Nacional, a través del paquete libre es-atlas) y de Natural Earth (a través de world-atlas). Los cursos de los ríos y los ejes de las cordilleras se han trazado de forma esquemática a partir de coordenadas reales de nacimientos, ciudades ribereñas, desembocaduras y cumbres. Los mapas históricos colorean las provincias actuales según el poder que las dominaba: son una aproximación didáctica, y en cada uno se explica qué simplifican.

## Obras generales de referencia

- Josep Fontana y Ramón Villares (dirs.), *Historia de España*, 12 vols., Crítica / Marcial Pons, 2007–2015.
- Real Academia de la Historia, *Diccionario Biográfico Español* (edición electrónica: dbe.rah.es).
- Raymond Carr, *España 1808–1975*, Ariel, 1969 (ed. revisada, 2009).
- Juan Pablo Fusi y Jordi Palafox, *España 1808–1996. El desafío de la modernidad*, Espasa, 1997.
- José Álvarez Junco y Adrian Shubert (eds.), *Nueva historia de la España contemporánea (1808–2018)*, Galaxia Gutenberg, 2018.
- J. H. Elliott, *La España imperial 1469–1716*, Vicens Vives, 1965.
- Gabriel Tortella y Clara Eugenia Núñez, *El desarrollo de la España contemporánea. Historia económica de los siglos XIX y XX*, Alianza, 3.ª ed. 2011.
- Santos Juliá, *Un siglo de España. Política y sociedad*, Marcial Pons, 1999.

## Fuentes institucionales

Biblioteca Nacional de España, Archivo Histórico Nacional y Archivo General de Simancas (PARES, Portal de Archivos Españoles), Congreso de los Diputados, Senado, Boletín Oficial del Estado, Instituto Nacional de Estadística, Banco de España, Eurostat, Comisión Europea, Parlamento Europeo, Instituto Cervantes, Ministerio del Interior (resultados electorales), La Moncloa.

## Aspectos técnicos

Aplicación web sin servidor ni dependencias externas, salvo las tipografías Lora y Source Sans 3 de Google Fonts. Archivos: \`index.html\` (estructura), \`styles.css\` (diseño), \`app.js\` (navegación, progreso, buscador, cuestionarios, tarjetas, modo de estudio), \`viz.js\` (mapas, gráficos, árboles, diagramas, simulador), \`data/\` (contenido de cada módulo, cartografía y datos). El progreso se guarda solo en el navegador de quien estudia (almacenamiento local).
`;
