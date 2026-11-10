# Historia de España — guía de cultura general

Aplicación web de estudio, sin servidor. Abra `index.html` en un navegador (o use `historia-de-espana.html`, versión de un solo archivo).

## Estructura
- `index.html` — estructura de la página.
- `styles.css` — diseño (tema claro y oscuro, adaptable a móvil).
- `app.js` — navegación, lector de lecciones, progreso local, buscador, cuestionarios, tarjetas (Leitner), glosario, conexiones y modo de estudio diario.
- `viz.js` — mapas (actual e históricos), gráficos, árboles dinásticos, diagrama institucional, tablas y simulador D'Hondt.
- `data/modules.js` — módulos; `data/mNN.js` — lecciones de cada módulo; `data/extras.js` — datos de territorio, mapas históricos, gráficos, árboles, constituciones, presidentes, glosario, conexiones y método; `data/geo.js` — cartografía.
- `tools/` — scripts de construcción y comprobación (build.py, check.js, lint.js).

## Dependencias externas
Ninguna librería de JavaScript. Solo las tipografías Lora y Source Sans 3 desde Google Fonts (con tipografías de respaldo del sistema).
La cartografía se generó con es-atlas (IGN, licencia MIT), world-atlas (Natural Earth, dominio público), d3-geo y d3-composite-projections; el resultado está incrustado en `data/geo.js`.

## Añadir o corregir una lección
Cada lección es una llamada `L({...})` en su archivo de módulo. Campos: id, m, t, st, per, why, ctx, body, viz, ppl, tl, cause, cons, prev, next, links, today, debate, terms, sum, quiz, open, src. El cuerpo admite `## subtítulo`, listas con `- `, `**negrita**`, `*cursiva*` y enlaces internos `[[m8-3|texto]]`.

Contenido actualizado a 10 de noviembre de 2026.
