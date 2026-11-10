/* Visualizaciones: mapas, gráficos, árboles genealógicos, diagramas y simulador D'Hondt.
   Sin dependencias externas. Los datos están en data/geo.js y data/extras.js. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = n => n.toLocaleString('es-ES');

  // Provincia (código INE) -> comunidad autónoma (código INE)
  const P2C = {};
  const C2P = { '01': ['04', '11', '14', '18', '21', '23', '29', '41'], '02': ['22', '44', '50'], '03': ['33'], '04': ['07'], '05': ['35', '38'], '06': ['39'],
    '07': ['05', '09', '24', '34', '37', '40', '42', '47', '49'], '08': ['02', '13', '16', '19', '45'], '09': ['08', '17', '25', '43'], '10': ['03', '12', '46'],
    '11': ['06', '10'], '12': ['15', '27', '32', '36'], '13': ['28'], '14': ['30'], '15': ['31'], '16': ['01', '20', '48'], '17': ['26'], '18': ['51'], '19': ['52'] };
  Object.entries(C2P).forEach(([c, ps]) => ps.forEach(p => (P2C[p] = c)));

  function svgEl(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }

  /* ---------- Mapa base ---------- */
  function baseMap(opt) {
    const G = window.GEO;
    const svg = svgEl('svg', { viewBox: `200 0 ${G.W - 200} ${G.H - 20}`, role: 'img', 'aria-label': opt.label || 'Mapa de España' });
    svgEl('rect', { x: 0, y: 0, width: G.W, height: G.H, fill: 'var(--map-water)' }, svg);
    G.neighbours.forEach(n => {
      let fill = 'var(--map-neigh)';
      if (opt.neighFill && opt.neighFill[n.name]) fill = opt.neighFill[n.name];
      svgEl('path', { d: n.d, fill, stroke: 'var(--map-line)', 'stroke-width': .5 }, svg);
    });
    const gp = svgEl('g', {}, svg);
    const paths = {};
    G.provinces.forEach(p => {
      if (p.name && /Gibraltar/i.test(p.name)) { svgEl('path', { d: p.d, fill: 'var(--map-neigh)', stroke: 'var(--map-line)', 'stroke-width': .5 }, gp); return; }
      const el = svgEl('path', { d: p.d, class: 'prov', fill: opt.fill ? opt.fill(p.id) : 'var(--map-land)' }, gp);
      el.dataset.id = p.id;
      const t = svgEl('title', {}, el); t.textContent = opt.title ? opt.title(p) : p.name;
      paths[p.id] = el;
    });
    if (opt.provLines !== false) svgEl('path', { d: G.provMesh, fill: 'none', stroke: 'var(--map-line)', 'stroke-width': opt.provLines === 'strong' ? .7 : .35, 'pointer-events': 'none' }, svg);
    if (opt.ccaaLines !== false) svgEl('path', { d: G.ccaaMesh, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 1, 'pointer-events': 'none', opacity: .7 }, svg);
    // recuadro de Canarias
    svgEl('path', { d: G.canaryBox, fill: 'none', stroke: 'var(--rule-strong)', 'stroke-width': 1 }, svg);
    const ov = svgEl('g', { 'pointer-events': 'none' }, svg);
    return { svg, paths, ov };
  }

  function drawOverlays(ov, show) {
    const G = window.GEO;
    ov.innerHTML = '';
    if (show.ranges) {
      G.ranges.forEach(r => {
        svgEl('path', { d: r.d, fill: 'none', stroke: 'var(--map-range)', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .45 }, ov);
        const t = svgEl('text', { x: r.l[0], y: r.l[1] - 6, 'font-size': 10, 'text-anchor': 'middle', fill: 'var(--map-range)', 'font-style': 'italic', 'font-weight': 600, 'paint-order': 'stroke', stroke: 'var(--map-land)', 'stroke-width': 3 }, ov); t.textContent = r.n;
      });
      G.peaks.forEach(p => {
        if (!p.p) return;
        svgEl('path', { d: `M${p.p[0]},${p.p[1] - 5}l4,7h-8z`, fill: 'var(--map-range)' }, ov);
        const t = svgEl('text', { x: p.p[0] + 6, y: p.p[1] + 3, 'font-size': 9, fill: 'var(--ink-2)', 'paint-order': 'stroke', stroke: 'var(--map-land)', 'stroke-width': 3 }, ov); t.textContent = `${p.n} ${fmt(p.h)} m`;
      });
    }
    if (show.rivers) {
      G.rivers.forEach(r => {
        svgEl('path', { d: r.d, fill: 'none', stroke: 'var(--map-river)', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, ov);
        const t = svgEl('text', { x: r.l[0], y: r.l[1] + 12, 'font-size': 10, 'text-anchor': 'middle', fill: 'var(--map-river)', 'font-style': 'italic', 'paint-order': 'stroke', stroke: 'var(--map-land)', 'stroke-width': 3 }, ov); t.textContent = r.n;
      });
    }
    if (show.cities) {
      G.cities.forEach(c => {
        const r = c.t === 'estado' ? 4.5 : Math.max(1.8, Math.sqrt(c.pop) / 9);
        svgEl('circle', { cx: c.x, cy: c.y, r, fill: c.t === 'estado' ? 'var(--accent)' : 'var(--ink)', stroke: 'var(--map-land)', 'stroke-width': 1 }, ov);
        if (c.pop >= 150 || c.t === 'estado' || c.t === 'ca') {
          const t = svgEl('text', { x: c.x + r + 2, y: c.y + 3, 'font-size': c.pop > 500 ? 11 : 9, fill: 'var(--ink)', 'font-weight': c.pop > 500 ? 600 : 400, 'paint-order': 'stroke', stroke: 'var(--map-land)', 'stroke-width': 3 }, ov); t.textContent = c.n;
        }
      });
    }
  }

  /* ---------- Mapa actual interactivo ---------- */
  function mapCurrent(el, mode) {
    const X = window.X;
    const state = { level: 'ccaa', theme: 'none', rivers: mode === 'relief', ranges: mode === 'relief', cities: mode !== 'relief', sel: null };
    el.innerHTML = `
      <div class="viz-head"><h3>${mode === 'relief' ? 'Relieve e hidrografía' : 'Comunidades autónomas y provincias'}</h3>
        <div class="chips" data-r="layers">
          <button class="chip" data-k="rivers">Ríos</button><button class="chip" data-k="ranges">Relieve</button><button class="chip" data-k="cities">Ciudades</button>
        </div></div>
      <div class="chips" data-r="themes" style="margin-bottom:10px">
        <button class="chip" data-t="none">Sin datos</button><button class="chip" data-t="pop">Población</button><button class="chip" data-t="dens">Densidad</button><button class="chip" data-t="area">Superficie</button>
        <span style="width:10px"></span>
        <button class="chip" data-l="ccaa">Por comunidad</button><button class="chip" data-l="prov">Por provincia</button>
      </div>
      <div class="map-wrap"></div>
      <div class="map-legend"></div>
      <div class="map-info" aria-live="polite"><span class="note" style="color:var(--stone)">Pulse sobre el mapa para ver la ficha de cada comunidad o provincia.</span></div>`;
    const wrap = el.querySelector('.map-wrap');
    const info = el.querySelector('.map-info');
    const legend = el.querySelector('.map-legend');

    function val(cId) { const c = X.ccaa[cId]; if (!c) return null; if (state.theme === 'pop') return c.pop; if (state.theme === 'area') return c.area; if (state.theme === 'dens') return c.pop * 1e6 / c.area; return null; }
    const ramp = ['#efe7d6', '#dcc6a6', '#c49a78', '#a46852', '#7a3a33'];
    function color(v, max, log) { if (v == null) return 'var(--map-land)'; const t = log ? Math.log(1 + v) / Math.log(1 + max) : v / max; return ramp[Math.min(4, Math.floor(t * 5))]; }

    function render() {
      const vals = Object.keys(X.ccaa).filter(k => !['18', '19'].includes(k)).map(val).filter(v => v != null);
      const max = Math.max(...vals);
      const log = state.theme === 'dens';
      const m = baseMap({
        label: 'Mapa de comunidades autónomas y provincias',
        fill: id => state.theme === 'none' ? 'var(--map-land)' : color(val(P2C[id]), max, log),
        title: p => `${p.name} (${(X.ccaa[P2C[p.id]] || {}).n || ''})`,
        provLines: state.level === 'prov' ? 'strong' : true
      });
      wrap.innerHTML = ''; wrap.appendChild(m.svg);
      drawOverlays(m.ov, state);
      m.svg.addEventListener('click', e => {
        const id = e.target.dataset && e.target.dataset.id; if (!id) return;
        Object.values(m.paths).forEach(p => p.classList.remove('sel'));
        if (state.level === 'ccaa') (C2P[P2C[id]] || []).forEach(p => m.paths[p] && m.paths[p].classList.add('sel'));
        else m.paths[id].classList.add('sel');
        showInfo(id);
      });
      if (state.theme === 'none') legend.innerHTML = `<span><i style="background:var(--accent);border-radius:50%"></i>Capital del Estado</span><span><i style="background:var(--ink);border-radius:50%"></i>Otras ciudades (tamaño ≈ población)</span><span>Líneas gruesas: límites autonómicos · finas: provinciales</span>`;
      else {
        const unit = state.theme === 'pop' ? 'millones de hab.' : state.theme === 'area' ? 'km²' : 'hab./km² (escala logarítmica)';
        legend.innerHTML = ramp.map((c, i) => `<span><i style="background:${c}"></i>${i === 0 ? 'menor' : i === 4 ? 'mayor' : ''}</span>`).join('') + `<span>${unit} · Ceuta y Melilla fuera de escala</span>`;
      }
      el.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('on', !!state[b.dataset.k]));
      el.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', state.theme === b.dataset.t));
      el.querySelectorAll('[data-l]').forEach(b => b.classList.toggle('on', state.level === b.dataset.l));
    }
    function showInfo(pid) {
      const c = X.ccaa[P2C[pid]]; const pv = X.prov[pid] || {};
      const pn = (window.GEO.provinces.find(p => p.id === pid) || {}).name;
      if (state.level === 'prov') {
        info.innerHTML = `<h4>Provincia de ${esc(pn)}</h4><dl><dt>Capital</dt><dd>${esc(pv.cap || pn)}</dd><dt>Comunidad</dt><dd>${esc(c.n)}</dd>${pv.note ? `<dt>Nota</dt><dd>${esc(pv.note)}</dd>` : ''}</dl>`;
      } else {
        const provs = (C2P[P2C[pid]] || []).map(p => (window.GEO.provinces.find(x => x.id === p) || {}).name).join(', ');
        info.innerHTML = `<h4>${esc(c.n)}</h4><dl>
          <dt>Capital / sede</dt><dd>${esc(c.cap)}</dd>
          <dt>Provincias</dt><dd>${esc(provs)}</dd>
          <dt>Población</dt><dd>≈ ${c.pop.toLocaleString('es-ES', { maximumFractionDigits: 2 })} millones</dd>
          <dt>Superficie</dt><dd>${fmt(c.area)} km²</dd>
          <dt>Densidad</dt><dd>≈ ${fmt(Math.round(c.pop * 1e6 / c.area))} hab./km²</dd>
          <dt>Estatuto</dt><dd>${esc(c.est)}</dd>
          <dt>Lenguas</dt><dd>${esc(c.lang)}</dd></dl>
          <p style="margin:8px 0 0;font-size:15px;color:var(--ink-2)">${esc(c.d)}</p>`;
      }
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k) { state[b.dataset.k] = !state[b.dataset.k]; render(); }
      if (b.dataset.t) { state.theme = b.dataset.t; render(); }
      if (b.dataset.l) { state.level = b.dataset.l; render(); }
    });
    render();
  }

  /* ---------- Mapas históricos (aproximación por provincias) ---------- */
  function mapHist(el, keys) {
    const H = window.X.hist;
    const list = keys ? keys.split(',') : Object.keys(H.maps);
    let cur = list[0];
    el.innerHTML = `<div class="viz-head"><h3>Mapa histórico</h3></div>
      ${list.length > 1 ? `<div class="hist-controls">${list.map(k => `<button class="chip" data-h="${k}">${esc(H.maps[k].short)}</button>`).join('')}</div>` : ''}
      <div class="map-wrap"></div><div class="map-legend"></div><p class="hist-cap" style="font-size:15px;color:var(--ink-2);margin:10px 0 0"></p>`;
    function render() {
      const M = H.maps[cur];
      const m = baseMap({
        label: M.title,
        fill: id => { const k = M.p[id] || M.def; return (H.pal[k] || {}).c || 'var(--map-land)'; },
        title: p => `${p.name}: ${((H.pal[M.p[p.id] || M.def]) || {}).n || ''}`,
        neighFill: M.neigh ? Object.fromEntries(Object.entries(M.neigh).map(([k, v]) => [k, H.pal[v].c])) : null,
        ccaaLines: false
      });
      const wrap = el.querySelector('.map-wrap'); wrap.innerHTML = ''; wrap.appendChild(m.svg);
      const used = new Set(Object.values(M.p).concat([M.def]).concat(Object.values(M.neigh || {})));
      el.querySelector('.map-legend').innerHTML = [...used].filter(k => H.pal[k]).map(k => `<span><i style="background:${H.pal[k].c}"></i>${esc(H.pal[k].n)}</span>`).join('');
      el.querySelector('.hist-cap').innerHTML = `<b>${esc(M.title)}.</b> ${esc(M.cap)} <span style="color:var(--stone)">Representación aproximada a escala provincial: las fronteras reales no coincidían con los límites provinciales actuales.</span>`;
      el.querySelectorAll('[data-h]').forEach(b => b.classList.toggle('on', b.dataset.h === cur));
    }
    el.addEventListener('click', e => { const b = e.target.closest('[data-h]'); if (b) { cur = b.dataset.h; render(); } });
    render();
  }

  /* ---------- Gráficos ---------- */
  function chart(el, key) {
    const C = window.X.charts[key]; if (!C) return;
    el.classList.add('chart');
    const W = 680, H = C.h || 300, m = { l: 52, r: 20, t: 16, b: 38 };
    let s = `<div class="viz-head"><h3>${esc(C.title)}</h3></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(C.title)}">`;
    if (C.type === 'bar-h') {
      const rows = C.rows; const max = C.max || Math.max(...rows.map(r => r[1]));
      const lw = C.lw || 150; const bh = (H - m.t - m.b) / rows.length;
      rows.forEach((r, i) => {
        const y = m.t + i * bh, w = (W - lw - 70) * r[1] / max;
        s += `<text x="${lw - 8}" y="${y + bh / 2 + 4}" text-anchor="end" class="lbl" style="font-weight:400">${esc(r[0])}</text>`;
        s += `<rect x="${lw}" y="${y + bh * .18}" width="${w}" height="${bh * .64}" fill="${r[2] ? 'var(--accent)' : 'var(--rule-strong)'}"/>`;
        s += `<text x="${lw + w + 6}" y="${y + bh / 2 + 4}">${esc(C.f ? C.f(r[1]) : r[1].toLocaleString('es-ES'))}</text>`;
      });
    } else {
      const xs = C.x; const series = C.series;
      const all = series.flatMap(se => se.v.filter(v => v != null));
      let lo = C.min != null ? C.min : Math.min(0, ...all), hi = C.max != null ? C.max : Math.max(...all) * 1.08;
      const isBar = C.type === 'bar';
      const X0 = i => m.l + (isBar ? (i + .5) * (W - m.l - m.r) / xs.length : i * (W - m.l - m.r) / (xs.length - 1));
      const Y = v => m.t + (hi - v) * (H - m.t - m.b) / (hi - lo);
      const ticks = C.ticks || 5;
      for (let k = 0; k <= ticks; k++) { const v = lo + (hi - lo) * k / ticks; s += `<g class="grid"><line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}"/></g><text x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end">${(Math.round(v * 10) / 10).toLocaleString('es-ES')}</text>`; }
      if (lo < 0) s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--ink-2)"/>`;
      const step = Math.ceil(xs.length / (C.xEvery || 10));
      xs.forEach((x, i) => { if (i % step === 0 || i === xs.length - 1) s += `<text x="${X0(i)}" y="${H - m.b + 16}" text-anchor="middle">${esc(x)}</text>`; });
      series.forEach((se, si) => {
        const col = si === 0 ? 'var(--accent)' : si === 1 ? 'var(--olive)' : 'var(--stone)';
        if (isBar) {
          const bw = (W - m.l - m.r) / xs.length * .6;
          se.v.forEach((v, i) => { if (v == null) return; const y0 = Y(Math.max(0, v)), y1 = Y(Math.min(0, v)); s += `<rect x="${X0(i) - bw / 2}" y="${y0}" width="${bw}" height="${Math.max(1, y1 - y0)}" fill="${v < 0 ? 'var(--stone)' : col}"><title>${esc(xs[i])}: ${v.toLocaleString('es-ES')}</title></rect>`; if (C.labels) s += `<text x="${X0(i)}" y="${v >= 0 ? y0 - 4 : y1 + 12}" text-anchor="middle" class="lbl" style="font-weight:600">${v.toLocaleString('es-ES')}</text>`; });
        } else {
          let d = ''; se.v.forEach((v, i) => { if (v == null) return; d += (d ? 'L' : 'M') + X0(i).toFixed(1) + ',' + Y(v).toFixed(1); });
          s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="2"/>`;
          se.v.forEach((v, i) => { if (v == null) return; s += `<circle cx="${X0(i)}" cy="${Y(v)}" r="3" fill="${col}"><title>${esc(xs[i])}: ${v.toLocaleString('es-ES')}</title></circle>`; });
          const li = se.v.length - 1 - [...se.v].reverse().findIndex(v => v != null);
          s += `<text x="${X0(li) - 4}" y="${Y(se.v[li]) - 8}" text-anchor="end" class="lbl">${se.v[li].toLocaleString('es-ES')}</text>`;
          (C.marks || []).forEach(mk => { if (mk.s === si) { const i = xs.indexOf(mk.x); if (i >= 0) s += `<text x="${X0(i)}" y="${Y(se.v[i]) - 9}" text-anchor="middle" class="lbl">${esc(mk.t)}</text>`; } });
        }
      });
      if (C.unit) s += `<text x="${m.l}" y="${m.t - 4}" style="font-size:10px">${esc(C.unit)}</text>`;
    }
    s += `</svg>`;
    if (C.series && C.series.length > 1) s += `<div class="map-legend">${C.series.map((se, i) => `<span><i style="background:${i === 0 ? 'var(--accent)' : i === 1 ? 'var(--olive)' : 'var(--stone)'}"></i>${esc(se.n)}</span>`).join('')}</div>`;
    s += `<figcaption>${C.note}</figcaption>`;
    el.innerHTML = s;
  }

  /* ---------- Árbol genealógico ---------- */
  function tree(el, key) {
    const T = window.X.trees[key];
    const node = n => `<li><div class="node${n.k ? ' king' : ''}"><b>${esc(n.n)}</b>${n.r ? `<small>${esc(n.r)}</small>` : ''}${n.e ? `<em>${esc(n.e)}</em>` : ''}</div>${n.c && n.c.length ? `<ul>${n.c.map(node).join('')}</ul>` : ''}</li>`;
    el.innerHTML = `<div class="viz-head"><h3>${esc(T.title)}</h3></div><div class="tree-wrap"><ul class="tree">${node(T.root)}</ul></div><figcaption>${esc(T.note)} Recuadro con filete de color: reinó. Fechas bajo el nombre: años de reinado o de vida.</figcaption>`;
  }

  /* ---------- Tablas ---------- */
  function table(el, key) {
    const T = window.X.tables[key];
    el.innerHTML = `<div class="viz-head"><h3>${esc(T.title)}</h3></div><div class="table-wrap"><table class="data"><thead><tr>${T.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${T.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td${typeof c === 'number' ? ' class="num"' : ''}>${esc(typeof c === 'number' ? c.toLocaleString('es-ES') : c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><figcaption>${esc(T.note || '')}</figcaption>`;
  }

  /* ---------- Presidentes ---------- */
  function gov(el) {
    const G = window.X.presidents; const a = 1976, b = 2027;
    const pos = y => ((y - a) / (b - a) * 100).toFixed(2) + '%';
    const col = p => ({ UCD: '#6f7f86', PSOE: '#9b3a3a', PP: '#3e5f86' })[p] || 'var(--stone)';
    let s = `<div class="viz-head"><h3>Presidentes del Gobierno desde 1976</h3><div class="map-legend" style="margin:0"><span><i style="background:#6f7f86"></i>UCD</span><span><i style="background:#9b3a3a"></i>PSOE</span><span><i style="background:#3e5f86"></i>PP</span></div></div><div class="gov-bars">`;
    G.forEach(p => { s += `<div class="gov-row"><span>${esc(p.n)}</span><div class="gov-track"><i style="left:${pos(p.a)};width:calc(${pos(p.b)} - ${pos(p.a)});background:${col(p.p)}" title="${esc(p.n)} ${p.ra}"></i></div></div>`; });
    s += `<div class="gov-axis"><i></i><div>${[1980, 1990, 2000, 2010, 2020].map(y => `<span style="left:${pos(y)}">${y}</span>`).join('')}</div></div></div>`;
    s += `<div class="table-wrap"><table class="data"><thead><tr><th>Presidente</th><th>Partido</th><th>Mandato</th><th>Cómo llegó y cómo gobernó</th><th>Medidas y hechos principales</th></tr></thead><tbody>${G.map(p => `<tr><th scope="row">${esc(p.n)}</th><td>${esc(p.p)}</td><td style="white-space:nowrap">${esc(p.ra)}</td><td>${esc(p.how)}</td><td>${esc(p.key)}</td></tr>`).join('')}</tbody></table></div><figcaption>Fuente: La Moncloa (relación histórica de presidentes), Congreso de los Diputados (historia electoral). Los mandatos cuentan desde la toma de posesión. Situación a 10 de noviembre de 2026: elecciones generales convocadas para el 29 de noviembre.</figcaption>`;
    el.innerHTML = s;
  }

  /* ---------- Diagrama institucional ---------- */
  function inst(el) {
    el.innerHTML = `<div class="viz-head"><h3>Arquitectura institucional del Estado (Constitución de 1978)</h3></div>
    <div class="inst">
      <div class="inst-box accent"><span class="k">Soberanía</span><h4>Pueblo español</h4><p>«La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado» (art. 1.2). Vota cada cuatro años como máximo a las Cortes, y también en elecciones autonómicas, municipales y europeas.</p></div>
      <div class="inst-arrow">elige</div>
      <div class="inst-row">
        <div class="inst-box"><span class="k">Poder legislativo</span><h4>Cortes Generales</h4><p><b>Congreso</b>: 350 diputados, circunscripción provincial, sistema proporcional (D'Hondt). Inviste y puede cesar al presidente, aprueba leyes y presupuestos.<br><b>Senado</b>: 208 senadores elegidos en 2024 directamente (sistema mayoritario) más los designados por los parlamentos autonómicos (57 en la XV legislatura). Cámara de segunda lectura y de representación territorial.</p></div>
        <div class="inst-box"><span class="k">Poder ejecutivo</span><h4>Gobierno</h4><p>Presidente investido por el Congreso, vicepresidentes y ministros que él nombra. Dirige la política interior y exterior, la Administración, el ejército y la potestad reglamentaria. Responde políticamente ante el Congreso (moción de censura, cuestión de confianza).</p></div>
        <div class="inst-box"><span class="k">Poder judicial</span><h4>Jueces y tribunales</h4><p>Independientes y sometidos solo a la ley. <b>Tribunal Supremo</b>: órgano superior salvo en garantías constitucionales. <b>CGPJ</b>: órgano de gobierno de los jueces (20 vocales elegidos por las Cortes y su presidente). Fiscalía: promueve la acción de la justicia.</p></div>
      </div>
      <div class="inst-row">
        <div class="inst-box"><span class="k">Jefatura del Estado</span><h4>La Corona</h4><p>Monarquía parlamentaria. El rey arbitra y modera, sanciona leyes, propone candidato a la presidencia tras consultar a los grupos y representa al Estado. Sus actos deben ser refrendados por el Gobierno o los presidentes de las Cámaras.</p></div>
        <div class="inst-box"><span class="k">Garante de la Constitución</span><h4>Tribunal Constitucional</h4><p>12 magistrados (4 a propuesta del Congreso, 4 del Senado, 2 del Gobierno, 2 del CGPJ) por nueve años. Resuelve recursos de inconstitucionalidad, de amparo y conflictos de competencias entre Estado y comunidades.</p></div>
        <div class="inst-box"><span class="k">Órganos de control</span><h4>Defensor del Pueblo y Tribunal de Cuentas</h4><p>Comisionados de las Cortes: el Defensor supervisa a la Administración en defensa de los derechos; el Tribunal de Cuentas fiscaliza las cuentas públicas.</p></div>
      </div>
      <div class="inst-arrow">distribución territorial del poder</div>
      <div class="inst-row">
        <div class="inst-box"><span class="k">17 + 2</span><h4>Comunidades y ciudades autónomas</h4><p>Parlamento, presidente y gobierno propios. Gestionan sanidad, educación, servicios sociales y gran parte del gasto público.</p></div>
        <div class="inst-box"><span class="k">50</span><h4>Provincias</h4><p>Circunscripción electoral y división administrativa. Gobernadas por diputaciones (en el País Vasco, diputaciones forales; en las islas, cabildos y consejos insulares).</p></div>
        <div class="inst-box"><span class="k">≈ 8.130</span><h4>Municipios</h4><p>Ayuntamientos con alcalde y concejales elegidos cada cuatro años. Urbanismo, limpieza, transporte urbano, policía local.</p></div>
      </div>
    </div><figcaption>Fuente: Constitución Española (BOE de 29-12-1978), títulos II a VIII. Composición del Senado según la web oficial del Senado para la XV legislatura.</figcaption>`;
  }

  /* ---------- Simulador D'Hondt ---------- */
  function dhondt(el) {
    const parties = [['Partido A', 120000], ['Partido B', 95000], ['Partido C', 40000], ['Partido D', 22000], ['Partido E', 9000]];
    el.innerHTML = `<div class="dh"><div class="viz-head"><h3>Simulador: reparto de escaños por la ley D'Hondt</h3></div>
      <p style="font-size:15px;margin:0;color:var(--ink-2)">Datos de ejemplo (partidos ficticios). Cambie los votos o los escaños de la provincia y observe cómo se reparten. Se aplica la barrera legal del 3 % de los votos válidos de la circunscripción.</p>
      <div class="dh-grid">${parties.map((p, i) => `<div><label for="dh${i}">${p[0]}: votos</label><input id="dh${i}" type="number" min="0" step="1000" value="${p[1]}"></div>`).join('')}
      <div><label for="dhs">Escaños en juego</label><input id="dhs" type="number" min="1" max="40" value="7"></div><div><label for="dhb">Votos en blanco</label><input id="dhb" type="number" min="0" step="1000" value="5000"></div></div>
      <div class="dh-result"></div></div>`;
    const out = el.querySelector('.dh-result');
    function run() {
      const v = parties.map((p, i) => Math.max(0, +el.querySelector('#dh' + i).value || 0));
      const seats = Math.max(1, Math.min(40, +el.querySelector('#dhs').value || 1));
      const blank = Math.max(0, +el.querySelector('#dhb').value || 0);
      const valid = v.reduce((a, b) => a + b, 0) + blank;
      const ok = v.map(x => x >= valid * 0.03);
      const q = []; v.forEach((x, i) => { if (ok[i]) for (let d = 1; d <= seats; d++) q.push({ i, d, val: x / d }); });
      q.sort((a, b) => b.val - a.val || v[b.i] - v[a.i]);
      const win = new Set(q.slice(0, seats).map(o => o.i + '-' + o.d));
      const got = v.map((x, i) => [...win].filter(k => k.startsWith(i + '-')).length);
      const cols = Math.min(seats, 8);
      let s = `<div class="table-wrap"><table class="data" style="min-width:560px"><thead><tr><th>Partido</th><th>Votos</th><th>% válidos</th>${Array.from({ length: cols }, (_, d) => `<th>÷${d + 1}</th>`).join('')}<th>Escaños</th><th>% escaños</th></tr></thead><tbody>`;
      parties.forEach((p, i) => {
        s += `<tr><th scope="row">${p[0]}${ok[i] ? '' : ' <span style="color:var(--stone);font-weight:400">(bajo el 3 %)</span>'}</th><td class="num">${fmt(v[i])}</td><td class="num">${(v[i] / valid * 100).toLocaleString('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</td>`;
        for (let d = 1; d <= cols; d++) s += `<td class="num${win.has(i + '-' + d) ? ' hit' : ''}">${ok[i] ? fmt(Math.round(v[i] / d)) : '—'}</td>`;
        s += `<td class="num"><b>${got[i]}</b></td><td class="num">${(got[i] / seats * 100).toLocaleString('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</td></tr>`;
      });
      s += `</tbody></table></div><p style="font-size:15px;color:var(--ink-2);margin:6px 0 0">En rojo, los ${seats} cocientes más altos: cada uno es un escaño. Compare la columna de votos con la de escaños: en circunscripciones pequeñas el sistema prima a los partidos grandes y deja sin representación a los pequeños aunque superen la barrera.</p>`;
      out.innerHTML = s;
    }
    el.addEventListener('input', run); run();
  }

  /* ---------- Pasos (procedimientos) ---------- */
  function steps(el, key) {
    const S = window.X.steps[key];
    el.innerHTML = `<div class="viz-head"><h3>${esc(S.title)}</h3></div><ol class="steps">${S.items.map(i => `<li><span>${i}</span></li>`).join('')}</ol>${S.note ? `<figcaption>${esc(S.note)}</figcaption>` : ''}`;
  }

  /* ---------- Montaje ---------- */
  const R = {
    map: (el, a) => mapCurrent(el, a), hist: (el, a) => mapHist(el, a), chart, tree, table, gov, inst, dhondt, steps
  };
  window.VIZ = {
    mount(root) {
      root.querySelectorAll('[data-viz]').forEach(el => {
        if (el.dataset.done) return; el.dataset.done = 1;
        const [k, a] = el.dataset.viz.split(':');
        try { R[k] && R[k](el, a); } catch (err) { el.innerHTML = '<p class="note">No se pudo dibujar esta visualización.</p>'; console.error(err); }
      });
    },
    P2C, C2P
  };
})();
