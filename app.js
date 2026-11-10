/* Historia de España — aplicación de estudio
   Enrutado por hash, lector de lecciones, progreso local, buscador, cuestionarios,
   tarjetas de repaso (sistema Leitner), glosario, conexiones y modo de estudio diario. */
(function () {
  'use strict';
  const LS = window.LESSONS, MODS = window.MODULES, X = window.X;
  const byId = Object.fromEntries(LS.map(l => [l.id, l]));
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const today = () => { const d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };
  const dayNum = () => Math.floor(Date.now() / 864e5);

  /* ---------- Almacenamiento local ---------- */
  const KEY = 'historia-espana-v1';
  let S = { done: {}, saved: {}, quiz: {}, cards: {}, last: null, days: {} };
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { /* almacenamiento no disponible */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }

  /* ---------- Marcado ligero ---------- */
  function inline(s) {
    return esc(s)
      .replace(/\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g, (m, id, t) => `<a href="#${id}">${t}</a>`)
      .replace(/\[\[([a-z0-9-]+)\]\]/g, (m, id) => `<a href="#${id}">${esc(byId[id] ? byId[id].t : id)}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }
  function md(text) {
    if (!text) return '';
    return String(text).trim().split(/\n\s*\n/).map(b => {
      b = b.trim();
      if (b.startsWith('## ')) return `<h3>${inline(b.slice(3))}</h3>`;
      if (b.startsWith('> ')) return `<blockquote>${b.split('\n').map(x => `<p>${inline(x.replace(/^>\s?/, ''))}</p>`).join('')}</blockquote>`;
      if (/^- /.test(b)) return `<ul>${b.split(/\n(?=- )/).map(x => `<li>${inline(x.replace(/^- /, ''))}</li>`).join('')}</ul>`;
      if (/^\d+\. /.test(b)) return `<ol>${b.split(/\n(?=\d+\. )/).map(x => `<li>${inline(x.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`;
      if (b.startsWith('@viz ')) return vizSlot(b.slice(5).trim());
      return `<p>${inline(b)}</p>`;
    }).join('');
  }
  const plain = t => String(t || '').replace(/\[\[[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/[*#>@]/g, '');
  function vizSlot(spec) { return `<figure class="viz${/^(map|hist)/.test(spec) ? ' bleed' : ''}" data-viz="${esc(spec)}"></figure>`; }

  /* ---------- Barra lateral ---------- */
  const TOOLS = [
    ['cronologia', 'Línea temporal'], ['atlas', 'Atlas y mapas'], ['dinastias', 'Dinastías'], ['instituciones', 'Instituciones'],
    ['constituciones', 'Constituciones'], ['presidentes', 'Presidentes del Gobierno'], ['datos', 'Datos y gráficos'], ['personajes', 'Personajes']
  ];
  const STUDY = [['estudio', 'Estudio diario (20 min)'], ['tarjetas', 'Tarjetas de repaso'], ['glosario', 'Glosario'], ['no-entiendo', 'No entiendo este concepto'], ['conexiones', 'Conexiones históricas'], ['pendientes', 'Pendientes y progreso']];
  let openMod = null;
  function modProgress(n) { const ls = LS.filter(l => l.m === n); return [ls.filter(l => S.done[l.id]).length, ls.length]; }
  function renderSide(route) {
    const cur = byId[route] ? byId[route].m : (route.startsWith('modulo-') ? +route.split('-')[1] : null);
    if (cur) openMod = cur;
    const total = LS.length, done = LS.filter(l => S.done[l.id]).length;
    $('#side').innerHTML = `
      <a class="brand" href="#inicio"><b>Historia de España</b><span>Guía de cultura general</span></a>
      <button class="side-search" type="button" data-search>Buscar en la guía <kbd>/</kbd></button>
      <div style="margin-top:14px;font-size:13px;color:var(--stone)">${done} de ${total} lecciones completadas<div class="bar"><i style="width:${total ? done / total * 100 : 0}%"></i></div></div>
      <h2>Módulos</h2>
      <div>${MODS.map(m => { const [d, t] = modProgress(m.n); const open = openMod === m.n; return `<div class="mod">
        <button type="button" data-mod="${m.n}" aria-expanded="${open}"><span class="n">${m.n}</span><span class="t">${esc(m.t)}</span><span class="p">${d}/${t}</span></button>
        ${open ? `<ol><li><a href="#modulo-${m.n}" class="${route === 'modulo-' + m.n ? 'active' : ''}"><span class="tick">·</span><span>Presentación del módulo</span></a></li>${LS.filter(l => l.m === m.n).map(l => `<li><a href="#${l.id}" class="${route === l.id ? 'active' : ''}"><span class="tick${S.done[l.id] ? ' done' : ''}">${S.done[l.id] ? '✓' : '○'}</span><span>${esc(l.t)}</span></a></li>`).join('')}</ol>` : ''}
      </div>`; }).join('')}</div>
      <h2>Herramientas</h2><ul>${TOOLS.map(([h, t]) => `<li><a class="nav-link${route === h ? ' active' : ''}" href="#${h}">${t}</a></li>`).join('')}</ul>
      <h2>Estudiar</h2><ul>${STUDY.map(([h, t]) => `<li><a class="nav-link${route === h ? ' active' : ''}" href="#${h}">${t}</a></li>`).join('')}</ul>
      <h2>Sobre la obra</h2><ul><li><a class="nav-link${route === 'metodo' ? ' active' : ''}" href="#metodo">Método, fuentes y créditos</a></li></ul>
      <div class="side-foot"><button type="button" data-theme-toggle>Tema claro / oscuro</button></div>`;
  }
  $('#side').addEventListener('click', e => {
    const b = e.target.closest('[data-mod]');
    if (b) { const n = +b.dataset.mod; openMod = openMod === n ? null : n; renderSide(current); return; }
    if (e.target.closest('[data-search]')) openSearch();
    if (e.target.closest('[data-theme-toggle]')) {
      const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem(KEY + '-theme', r.dataset.theme); } catch (er) { }
    }
    if (e.target.closest('a')) closeNav();
  });
  try { const th = localStorage.getItem(KEY + '-theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) { }
  const menuBtn = $('#menuBtn');
  function closeNav() { document.body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', () => { const o = document.body.classList.toggle('nav-open'); menuBtn.setAttribute('aria-expanded', o); });
  document.addEventListener('click', e => { if (document.body.classList.contains('nav-open') && !e.target.closest('#side') && !e.target.closest('#menuBtn')) closeNav(); });
  $('#searchBtnTop').addEventListener('click', openSearch);

  /* ---------- Vistas ---------- */
  const view = $('#view');
  function page(html, wide) { view.innerHTML = `<div class="page${wide ? ' wide' : ''}">${html}</div>`; VIZ.mount(view); }

  function readingTime(l) { const extra = [].concat((l.ppl || []).map(p => p[2]), (l.terms || []).map(t => t[1]), l.sum || [], (l.tl || []).map(t => t[2])); const w = plain([l.ctx, l.body, l.today, l.debate].concat(extra).join(' ')).split(/\s+/).length; return Math.max(5, Math.round(w / 200)); }

  function home() {
    const next = LS.find(l => !S.done[l.id]);
    const last = S.last && byId[S.last];
    page(`
      <section class="hero">
        <div class="eyebrow">Guía de cultura general · ${LS.length} lecciones en ${MODS.length} módulos</div>
        <h1>Historia de España</h1>
        <p class="lead">Cómo se formó el país, por qué su Estado funciona como funciona, de dónde vienen sus tensiones territoriales y cómo ha cambiado su economía y su sociedad. Un recorrido de la prehistoria a noviembre de 2026, pensado para leerse en orden y comprenderse, no para memorizar fechas.</p>
      </section>
      <div class="two">
        <div>
          <ol class="modlist">${MODS.map(m => { const [d, t] = modProgress(m.n); return `<li><span class="n">${m.n}</span><div><a href="#modulo-${m.n}">${esc(m.t)}</a><p>${esc(m.s)} · ${esc(m.per)}</p><div class="bar"><i style="width:${t ? d / t * 100 : 0}%"></i></div></div><span class="pct">${d} / ${t}</span></li>`; }).join('')}</ol>
        </div>
        <aside>
          <div class="aside-block"><h2>${last ? 'Seguir leyendo' : 'Por dónde empezar'}</h2>
            ${last ? `<p><a href="#${last.id}">${esc(last.t)}</a><br><span style="font-size:14px;color:var(--stone)">Módulo ${last.m} · última lección abierta</span></p>` : `<p>El orden recomendado es el de los módulos: primero el territorio, después la historia en orden cronológico y al final los módulos de instituciones, economía y cultura, que se apoyan en todo lo anterior.</p>`}
            ${next ? `<a class="btn primary" href="#${next.id}">${last ? 'Siguiente pendiente' : 'Empezar'}: ${esc(next.t)}</a>` : ''}
          </div>
          <div class="aside-block"><h2>Estudio diario</h2><p>Sesión guiada de unos 20 minutos: repaso de tarjetas, una lección y preguntas de comprobación sobre lo ya leído.</p><a class="btn" href="#estudio">Empezar sesión</a></div>
          <div class="aside-block"><h2>Herramientas de consulta</h2><ul class="tools">
            <li><a href="#cronologia">Línea temporal</a><span>Todos los hechos fechados, por épocas</span></li>
            <li><a href="#atlas">Atlas</a><span>Comunidades, provincias, relieve, ríos y mapas históricos</span></li>
            <li><a href="#dinastias">Dinastías</a><span>Trastámara, Austrias y Borbones</span></li>
            <li><a href="#constituciones">Constituciones</a><span>De Cádiz a 1978, comparadas</span></li>
            <li><a href="#presidentes">Presidentes</a><span>Gobiernos desde la Transición</span></li>
            <li><a href="#glosario">Glosario</a><span>Conceptos históricos, políticos y económicos</span></li>
          </ul></div>
          <div class="aside-block"><h2>Sobre el rigor</h2><p>Cada lección distingue hechos, interpretaciones y debates, y termina con bibliografía. Las cifras de los gráficos proceden de fuentes oficiales citadas al pie. <a href="#metodo">Método y fuentes</a>.</p></div>
        </aside>
      </div>`, true);
  }

  function moduleView(n) {
    const m = MODS.find(x => x.n === n); if (!m) return notFound();
    const ls = LS.filter(l => l.m === n);
    page(`<div class="eyebrow">Módulo ${n} · ${esc(m.per)}</div><h1>${esc(m.t)}</h1><p class="subtitle">${esc(m.s)}</p>
      <div class="intro-text prose"><p>${esc(m.intro)}</p></div>
      <ol class="lessonlist" style="margin-top:32px">${ls.map((l, i) => `<li><span class="k">${n}.${i + 1}</span><div><a href="#${l.id}">${esc(l.t)}</a><p>${esc(l.st)} · ${esc(l.per)} · ${readingTime(l)} min</p></div><span class="tick${S.done[l.id] ? ' done' : ''}">${S.done[l.id] ? '✓' : '○'}</span></li>`).join('')}</ol>
      ${n > 1 ? `<p style="margin-top:28px"><a href="#modulo-${n - 1}">← Módulo ${n - 1}</a></p>` : ''}${n < MODS.length ? `<p><a href="#modulo-${n + 1}">Módulo ${n + 1}: ${esc(MODS[n].t)} →</a></p>` : ''}`);
  }

  function lessonView(id) {
    const l = byId[id]; if (!l) return notFound();
    S.last = id; save();
    const idx = LS.indexOf(l), prev = LS[idx - 1], next = LS[idx + 1];
    const mod = MODS.find(m => m.n === l.m);
    const pos = LS.filter(x => x.m === l.m).indexOf(l) + 1;
    const secs = [];
    const sec = (key, title, html) => { if (!html) return ''; secs.push([key, title]); return `<section class="sec" id="s-${key}"><h2><span class="num">${String(secs.length).padStart(2, '0')}</span>${title}</h2>${html}</section>`; };
    const linkList = ids => (ids || []).filter(i => byId[i]).map(i => `<li><a href="#${i}">${esc(byId[i].t)}</a> <span style="color:var(--stone);font-size:14px">· ${esc(byId[i].per)}</span></li>`).join('');
    const recall = (l.prev || []).filter(i => byId[i]).flatMap(i => (byId[i].terms || []).slice(0, 2).map(t => [t[0], t[1], i]));
    let h = '';
    h += sec('contexto', 'Contexto', `<div class="prose">${md(l.ctx)}</div>`);
    h += sec('relato', 'El relato', `<div class="prose dropcap">${md(l.body)}</div>${(l.viz || []).map(vizSlot).join('')}`);
    h += sec('personajes', 'Protagonistas', l.ppl && l.ppl.length ? `<div class="people">${l.ppl.map(p => `<div class="person"><div><h3>${esc(p[0])}</h3><div class="dates">${esc(p[1])}</div></div><p>${inline(p[2])}</p></div>`).join('')}</div>` : '');
    h += sec('cronologia', 'Cronología', l.tl && l.tl.length ? `<ol class="chron">${l.tl.map(t => `<li><span class="d">${esc(t[1])}</span><span>${inline(t[2])}</span></li>`).join('')}</ol>` : '');
    h += sec('causas', 'Causas y consecuencias', (l.cause || l.cons) ? `<div class="cc"><div><h3>Causas</h3><ul>${(l.cause || []).map(c => `<li>${inline(c)}</li>`).join('')}</ul></div><div><h3>Consecuencias</h3><ul>${(l.cons || []).map(c => `<li>${inline(c)}</li>`).join('')}</ul></div></div>` : '');
    h += sec('conexiones', 'Antes y después', `${l.links ? `<div class="prose"><p>${inline(l.links)}</p></div>` : ''}<div class="links-grid"><div><h3>Viene de</h3><ul>${linkList(l.prev) || '<li>Es un punto de partida.</li>'}</ul></div><div><h3>Conduce a</h3><ul>${linkList(l.next) || '<li>—</li>'}</ul></div></div>${recall.length ? `<div class="callout" style="margin-top:22px"><b>Repaso de conceptos anteriores.</b> ${recall.map(r => `<a href="#${r[2]}">${esc(r[0])}</a>: ${esc(r[1])}`).join(' · ')}</div>` : ''}`);
    h += sec('hoy', 'Por qué importa hoy', l.today ? `<div class="prose">${md(l.today)}</div>` : '');
    h += sec('debate', 'Hechos, interpretaciones y debates', l.debate ? `<div class="debate prose"><div class="eyebrow">Debate historiográfico</div>${md(l.debate)}</div>` : '');
    h += sec('conceptos', 'Conceptos y vocabulario', l.terms && l.terms.length ? `<dl class="terms">${l.terms.map(t => `<div><dt>${esc(t[0])}</dt><dd>${inline(t[1])}</dd></div>`).join('')}</dl>` : '');
    h += sec('resumen', 'Ideas imprescindibles', l.sum ? `<ol class="summary">${l.sum.map(s => `<li><span>${inline(s)}</span></li>`).join('')}</ol>` : '');
    h += sec('comprueba', 'Compruebe lo que ha entendido', `${quizHTML(l)}${l.open && l.open.length ? `<h3 style="font-size:19px;margin:34px 0 6px">Preguntas de desarrollo</h3><p style="font-size:15px;color:var(--stone);margin:0 0 8px">Responda por escrito con sus palabras y compare después con las claves.</p>${l.open.map((o, i) => `<div class="open-q"><p>${esc(o[0])}</p><label class="sr" for="oq-${id}-${i}">Su respuesta</label><textarea id="oq-${id}-${i}" placeholder="Su respuesta…"></textarea><details><summary>Ver claves de respuesta</summary><p style="font-weight:400">${inline(o[1])}</p></details></div>`).join('')}` : ''}`);
    h += sec('fuentes', 'Fuentes y bibliografía', l.src ? `<ul class="sources">${l.src.map(s => `<li>${inline(s)}</li>`).join('')}</ul>` : '');

    view.innerHTML = `<div class="page"><article class="lesson"><div class="lesson-body">
      <div class="eyebrow"><a href="#modulo-${l.m}">Módulo ${l.m} · ${esc(mod.t)}</a> · Lección ${l.m}.${pos}</div>
      <h1>${esc(l.t)}</h1><p class="subtitle">${esc(l.st)}</p>
      <div class="meta"><span>${esc(l.per)}</span><span>${readingTime(l)} min de lectura</span><span>${S.done[id] ? 'Completada' : 'Pendiente'}</span>${S.quiz[id] ? `<span>Test: ${S.quiz[id]}</span>` : ''}</div>
      <div class="why"><div class="eyebrow">Por qué importa para entender España</div><p>${inline(l.why)}</p></div>
      ${h}
      <div class="lesson-actions"><button class="btn ${S.done[id] ? 'on' : 'primary'}" data-act="done">${S.done[id] ? '✓ Completada' : 'Marcar como completada'}</button><button class="btn ${S.saved[id] ? 'on' : 'ghost'}" data-act="save">${S.saved[id] ? 'Guardada en pendientes' : 'Guardar para repasar'}</button></div>
      <nav class="pager" aria-label="Lecciones">${prev ? `<a href="#${prev.id}"><span>← Anterior</span><b>${esc(prev.t)}</b></a>` : '<span></span>'}${next ? `<a class="next" href="#${next.id}"><span>Siguiente →</span><b>${esc(next.t)}</b></a>` : ''}</nav>
      </div>
      <aside class="toc" aria-label="Índice de la lección"><span class="eyebrow">En esta lección</span><ol>${secs.map(s => `<li><a href="#${id}" data-sec="s-${s[0]}">${s[1]}</a></li>`).join('')}</ol>
      <div class="toc-actions"><button class="btn small ${S.done[id] ? 'on' : ''}" data-act="done">${S.done[id] ? '✓ Completada' : 'Marcar completada'}</button><button class="btn small ghost" data-act="save">${S.saved[id] ? 'Quitar de pendientes' : 'Guardar'}</button></div></aside>
      </article></div>`;
    VIZ.mount(view);
    bindQuiz(view, l);
    view.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.act === 'done') { S.done[id] = S.done[id] ? undefined : Date.now(); if (!S.done[id]) delete S.done[id]; else toast('Lección completada'); }
      else { if (S.saved[id]) delete S.saved[id]; else { S.saved[id] = Date.now(); toast('Guardada en pendientes'); } }
      save(); const y = scrollY; lessonView(id); renderSide(id); scrollTo(0, y);
    }));
    view.querySelectorAll('[data-sec]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById(a.dataset.sec).scrollIntoView({ behavior: 'smooth' }); }));
    spy();
  }
  let spyObs;
  function spy() {
    if (spyObs) spyObs.disconnect();
    if (!('IntersectionObserver' in window)) return;
    const links = [...view.querySelectorAll('[data-sec]')];
    spyObs = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.dataset.sec === en.target.id)); }), { rootMargin: '0px 0px -70% 0px' });
    view.querySelectorAll('.sec').forEach(s => spyObs.observe(s));
  }

  /* ---------- Cuestionarios ---------- */
  function quizHTML(l) {
    if (!l.quiz || !l.quiz.length) return '';
    return `<div class="quiz" data-quiz="${l.id}">${l.quiz.map((q, i) => `<div class="q" data-i="${i}"><p>${i + 1}. ${inline(q.q)}</p><div class="opts">${q.o.map((o, j) => `<button type="button" class="opt" data-j="${j}">${inline(o)}</button>`).join('')}</div></div>`).join('')}<p class="score" aria-live="polite"></p></div>`;
  }
  function bindQuiz(root, l, onAnswer) {
    root.querySelectorAll('[data-quiz]').forEach(qz => {
      const lid = qz.dataset.quiz; const L = byId[lid] || l; let right = 0, answered = 0;
      qz.addEventListener('click', e => {
        const b = e.target.closest('.opt'); if (!b || b.disabled) return;
        const qd = b.closest('.q'); const q = (qd.dataset.qref ? qd._q : L.quiz[+qd.dataset.i]);
        const j = +b.dataset.j; const ok = j === q.a;
        qd.querySelectorAll('.opt').forEach((o, k) => { o.disabled = true; if (k === q.a) o.classList.add('right'); else if (k === j) o.classList.add('wrong'); });
        const fb = document.createElement('div'); fb.className = 'fb';
        fb.innerHTML = `<b class="${ok ? 'r' : 'w'}">${ok ? 'Correcto.' : 'No es correcto. La respuesta es: ' + inline(q.o[q.a])}</b>${inline(q.e)}`;
        qd.appendChild(fb);
        answered++; if (ok) right++;
        const total = qz.querySelectorAll('.q').length;
        if (onAnswer) onAnswer(ok);
        if (answered === total) {
          qz.querySelector('.score').textContent = `Resultado: ${right} de ${total}.` + (right === total ? ' Ha entendido los puntos clave.' : ' Repase las explicaciones de las respuestas falladas.');
          if (!onAnswer) { S.quiz[lid] = `${right}/${total}`; save(); }
        }
      });
    });
  }

  /* ---------- Línea temporal ---------- */
  const ERAS = [
    { a: -1.3e6, b: -218, t: 'Prehistoria y pueblos antiguos' }, { a: -218, b: 409, t: 'Hispania romana' }, { a: 409, b: 711, t: 'Reino visigodo' },
    { a: 711, b: 1212, t: 'Al-Ándalus y reinos cristianos' }, { a: 1212, b: 1474, t: 'Baja Edad Media' }, { a: 1474, b: 1516, t: 'Reyes Católicos' },
    { a: 1516, b: 1700, t: 'Austrias' }, { a: 1700, b: 1808, t: 'Borbones e Ilustración' }, { a: 1808, b: 1874, t: 'Revolución liberal' },
    { a: 1874, b: 1923, t: 'Restauración' }, { a: 1923, b: 1939, t: 'Dictadura, República y guerra' }, { a: 1939, b: 1975, t: 'Franquismo' },
    { a: 1975, b: 1982, t: 'Transición' }, { a: 1982, b: 2100, t: 'Democracia' }
  ];
  function allEvents() {
    const ev = []; LS.forEach(l => (l.tl || []).forEach(t => ev.push({ y: t[0], d: t[1], t: t[2], l: l.id, m: l.m })));
    (X.worldEvents || []).forEach(t => ev.push({ y: t[0], d: t[1], t: t[2], l: t[3], m: 10, w: true }));
    const seen = new Set();
    return ev.filter(e => { const k = e.y + '|' + norm(e.t).slice(0, 40); if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.y - b.y);
  }
  function timeline() {
    const ev = allEvents();
    let era = 0, modF = 0, world = true;
    page(`<div class="eyebrow">Herramienta</div><h1>Línea temporal</h1><p class="subtitle">${ev.length} acontecimientos fechados, de Atapuerca a 2026</p>
      <div class="prose intro-text"><p>Elija una época en la barra para ver sus acontecimientos. Los hechos europeos y mundiales aparecen marcados para situar la historia española en su contexto. Cada fila enlaza con la lección donde se explica.</p></div>
      <div class="eras" role="tablist">${ERAS.map((e, i) => `<button class="era" data-e="${i}" role="tab"><b>${e.a < 0 ? (e.a < -10000 ? 'Prehistoria' : Math.abs(e.a) + ' a. C.') : e.a}</b>${e.t}</button>`).join('')}</div>
      <div class="chips" style="margin:12px 0"><button class="chip" data-w="1">Incluir contexto europeo y mundial</button></div>
      <ol class="tl" id="tlList"></ol>`, true);
    const list = $('#tlList');
    function render() {
      const E = ERAS[era];
      const items = ev.filter(e => e.y >= E.a && e.y < E.b && (world || !e.w));
      let lastC = null, h = '';
      items.forEach(e => {
        const c = e.y < -10000 ? 'Prehistoria' : e.y < -1000 ? `${Math.ceil(-e.y / 1000)}.º milenio a. C.` : e.y < 0 ? `Siglo ${roman(Math.ceil(-e.y / 100))} a. C.` : `Siglo ${roman(Math.floor((e.y - 1) / 100) + 1)}`;
        if (c !== lastC) { h += `<li class="tl-cent">${c}</li>`; lastC = c; }
        h += `<li class="tl-item"><span class="d">${esc(e.d)}</span><span>${e.w ? '<span style="color:var(--olive);font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:600">Europa y mundo · </span>' : ''}${inline(e.t)} ${e.l && byId[e.l] ? `<a class="src" href="#${e.l}">→ ${esc(byId[e.l].t)}</a>` : ''}</span></li>`;
      });
      list.innerHTML = h || '<li class="tl-item">Sin acontecimientos en esta época.</li>';
      view.querySelectorAll('.era').forEach(b => b.classList.toggle('on', +b.dataset.e === era));
      view.querySelector('[data-w]').classList.toggle('on', world);
    }
    view.addEventListener('click', e => { const b = e.target.closest('.era'); if (b) { era = +b.dataset.e; render(); } if (e.target.closest('[data-w]')) { world = !world; render(); } });
    render();
  }
  function roman(n) { const r = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, c] of r) while (n >= v) { s += c; n -= v; } return s; }

  /* ---------- Páginas de herramientas ---------- */
  function atlas() {
    page(`<div class="eyebrow">Herramienta</div><h1>Atlas</h1><p class="subtitle">El territorio actual y su evolución histórica</p>
      <div class="prose intro-text"><p>El primer mapa permite explorar comunidades y provincias, activar ríos, relieve y ciudades, y comparar población, superficie y densidad. Los mapas históricos muestran cómo cambió el reparto del poder en la península; están dibujados sobre las provincias actuales, por lo que son una aproximación didáctica.</p></div>
      <figure class="viz" data-viz="map:ccaa"></figure>
      <figure class="viz" data-viz="map:relief"></figure>
      <h2 style="font-size:28px;margin-top:56px">Mapas históricos</h2>
      <figure class="viz" data-viz="hist"></figure>`, true);
  }
  function dynasties() {
    page(`<div class="eyebrow">Herramienta</div><h1>Dinastías</h1><p class="subtitle">Quién reinó, por qué heredó y qué consecuencias tuvo cada sucesión</p>
      <div class="prose intro-text"><p>En las monarquías europeas, la política era también política familiar: matrimonios, herencias y muertes sin descendencia decidieron uniones de reinos y guerras. Estos árboles simplificados muestran solo las ramas necesarias para entender las sucesiones.</p></div>
      ${Object.keys(X.trees).map(k => `<figure class="viz" data-viz="tree:${k}"></figure>`).join('')}`, true);
  }
  function institutions() {
    page(`<div class="eyebrow">Herramienta</div><h1>Instituciones</h1><p class="subtitle">Cómo se organiza el poder en la España actual</p>
      <figure class="viz" data-viz="inst"></figure>
      <figure class="viz" data-viz="steps:ley"></figure>
      <figure class="viz" data-viz="steps:investidura"></figure>
      <figure class="viz" data-viz="steps:censura"></figure>
      <figure class="viz" data-viz="dhondt"></figure>
      <p>Explicación completa en el módulo 11: [[m11-1|Constitución]], [[m11-2|Cortes y Gobierno]], [[m11-3|justicia]], [[m11-4|sistema electoral]] y [[m11-5|organización territorial]].</p>`.replace(/\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g, '<a href="#$1">$2</a>'), true);
  }
  function constitutions() {
    page(`<div class="eyebrow">Herramienta</div><h1>Constituciones</h1><p class="subtitle">Ocho textos en dos siglos: qué decía cada uno sobre el poder, los derechos y el territorio</p>
      <div class="prose intro-text"><p>La inestabilidad constitucional del siglo XIX y comienzos del XX refleja que no hubo consenso sobre lo esencial: quién es soberano, quién vota, qué papel tiene la Iglesia y cómo se organiza el territorio. La de 1978 es la primera elaborada por consenso entre fuerzas políticas opuestas y la más duradera tras la de 1876.</p></div>
      <figure class="viz" data-viz="table:const"></figure>`, true);
  }
  function presidents() { page(`<div class="eyebrow">Herramienta</div><h1>Presidentes del Gobierno</h1><p class="subtitle">De Adolfo Suárez a Pedro Sánchez</p><figure class="viz" data-viz="gov"></figure>`, true); }
  function dataPage() {
    page(`<div class="eyebrow">Herramienta</div><h1>Datos y gráficos</h1><p class="subtitle">Demografía, empleo, crecimiento y comparación europea</p>
      <div class="prose intro-text"><p>Todas las cifras proceden de fuentes oficiales indicadas al pie de cada gráfico. Cuando un dato está redondeado o es provisional, se indica.</p></div>
      ${Object.keys(X.charts).map(k => `<figure class="viz" data-viz="chart:${k}"></figure>`).join('')}
      ${['ccaa', 'europa'].map(k => `<figure class="viz" data-viz="table:${k}"></figure>`).join('')}`, true);
  }
  function people() {
    const map = new Map();
    LS.forEach(l => (l.ppl || []).forEach(p => { const k = norm(p[0]); if (!map.has(k)) map.set(k, { n: p[0], d: p[1], b: p[2], ls: [l.id], m: l.m }); else map.get(k).ls.push(l.id); }));
    const all = [...map.values()].sort((a, b) => norm(a.n).localeCompare(norm(b.n)));
    let mf = 0, q = '';
    page(`<div class="eyebrow">Herramienta</div><h1>Personajes</h1><p class="subtitle">${all.length} fichas biográficas</p>
      <div class="chips" style="margin:10px 0"><button class="chip" data-m="0">Todos</button>${MODS.map(m => `<button class="chip" data-m="${m.n}">${m.n}. ${esc(m.t)}</button>`).join('')}</div>
      <label class="sr" for="pplq">Filtrar personajes</label><input id="pplq" class="field" type="search" placeholder="Filtrar por nombre…">
      <div class="ppl-grid" id="pplGrid" style="margin-top:18px"></div>`, true);
    function render() {
      const items = all.filter(p => (!mf || p.m === mf) && (!q || norm(p.n + ' ' + p.b).includes(q)));
      $('#pplGrid').innerHTML = items.map(p => `<div class="ppl-card"><h3>${esc(p.n)}</h3><div class="dates">${esc(p.d)}</div><p>${inline(p.b)}</p>${p.ls.map(i => `<a href="#${i}">${esc(byId[i].t)}</a>`).join(' · ')}</div>`).join('') || '<p>Sin resultados.</p>';
      view.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('on', +b.dataset.m === mf));
    }
    view.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) { mf = +b.dataset.m; render(); } });
    $('#pplq').addEventListener('input', e => { q = norm(e.target.value); render(); });
    render();
  }
  function glossaryItems() {
    const map = new Map();
    LS.forEach(l => (l.terms || []).forEach(t => { const k = norm(t[0]); if (!map.has(k)) map.set(k, { t: t[0], d: t[1], ls: [l.id] }); else if (!map.get(k).ls.includes(l.id)) map.get(k).ls.push(l.id); }));
    (X.glossary || []).forEach(t => { const k = norm(t[0]); if (!map.has(k)) map.set(k, { t: t[0], d: t[1], ls: t[2] ? [t[2]] : [] }); });
    return [...map.values()].sort((a, b) => norm(a.t).localeCompare(norm(b.t)));
  }
  function glossary() {
    const all = glossaryItems(); let letter = '', q = '';
    const letters = [...new Set(all.map(g => norm(g.t)[0].toUpperCase()))].filter(c => /[A-Z]/.test(c));
    page(`<div class="eyebrow">Estudiar</div><h1>Glosario</h1><p class="subtitle">${all.length} términos históricos, políticos y económicos</p>
      <label class="sr" for="glq">Buscar término</label><input id="glq" class="field" type="search" placeholder="Buscar un término…">
      <div class="letters"><button data-l="" class="on">Todo</button>${letters.map(c => `<button data-l="${c}">${c}</button>`).join('')}</div>
      <dl class="gloss" id="gl"></dl>`);
    function render() {
      const items = all.filter(g => (!letter || norm(g.t)[0].toUpperCase() === letter) && (!q || norm(g.t + ' ' + g.d).includes(q)));
      $('#gl').innerHTML = items.map(g => `<dt>${esc(g.t)}</dt><dd>${inline(g.d)} ${g.ls.filter(i => byId[i]).map(i => `<a href="#${i}">→ ${esc(byId[i].t)}</a>`).join(' ')}</dd>`).join('') || '<dd>Sin resultados.</dd>';
      view.querySelectorAll('[data-l]').forEach(b => b.classList.toggle('on', b.dataset.l === letter));
    }
    view.addEventListener('click', e => { const b = e.target.closest('[data-l]'); if (b) { letter = b.dataset.l; render(); } });
    $('#glq').addEventListener('input', e => { q = norm(e.target.value); letter = ''; render(); });
    render();
  }
  function simple() {
    page(`<div class="eyebrow">Estudiar</div><h1>No entiendo este concepto</h1><p class="subtitle">Explicaciones en lenguaje llano de las ideas que más cuesta entender</p>
      <div class="prose intro-text"><p>Cada entrada tiene tres partes: una explicación sencilla, un ejemplo o comparación cotidiana y dónde se estudia a fondo. Si un concepto no aparece aquí, búsquelo en el <a href="#glosario">glosario</a> o con el buscador.</p></div>
      <label class="sr" for="sq">Filtrar conceptos</label><input id="sq" class="field" type="search" placeholder="Filtrar…" style="margin:12px 0 8px">
      <div id="simpleList"></div>`);
    const render = q => { $('#simpleList').innerHTML = X.simple.filter(s => !q || norm(s.t + s.s).includes(q)).map(s => `<div class="simple" id="c-${norm(s.t).replace(/[^a-z0-9]+/g, '-')}"><h3>${esc(s.t)}</h3><span class="lbl">En pocas palabras</span><p>${inline(s.s)}</p><span class="lbl">Un ejemplo</span><p>${inline(s.e)}</p><span class="lbl">Para profundizar</span><p>${s.l.map(i => `<a href="#${i}">${esc(byId[i] ? byId[i].t : i)}</a>`).join(' · ')}</p></div>`).join(''); };
    $('#sq').addEventListener('input', e => render(norm(e.target.value))); render('');
  }
  function connections() {
    page(`<div class="eyebrow">Estudiar</div><h1>Conexiones históricas</h1><p class="subtitle">Hilos que atraviesan siglos y explican el presente</p>
      <div class="prose intro-text"><p>La historia no se entiende por episodios sueltos. Estos recorridos siguen un mismo problema a lo largo del tiempo: cada paso enlaza con la lección donde se explica.</p></div>
      ${X.threads.map(t => `<div class="thread"><h3>${esc(t.t)}</h3><p>${inline(t.d)}</p><ol>${t.s.map(s => `<li><b>${esc(s[0])}</b> · ${inline(s[1])} ${s[2] && byId[s[2]] ? `<a href="#${s[2]}" style="font-size:14px">→ ${esc(byId[s[2]].t)}</a>` : ''}</li>`).join('')}</ol></div>`).join('')}`);
  }
  function method() {
    page(`<div class="eyebrow">Sobre la obra</div><h1>Método, fuentes y créditos</h1>
      <div class="prose" style="max-width:var(--measure)">${md(X.method)}</div>`);
  }
  function notFound() { page(`<h1>Página no encontrada</h1><p>La dirección no corresponde a ninguna sección. <a href="#inicio">Volver al inicio</a>.</p>`); }

  /* ---------- Tarjetas (Leitner) ---------- */
  const INTERVALS = [0, 1, 3, 7, 14, 30];
  function allCards() {
    const c = [];
    LS.forEach(l => {
      (l.terms || []).forEach((t, i) => c.push({ k: `t:${l.id}:${i}`, kind: 'Concepto', f: t[0], b: t[1], l: l.id, m: l.m }));
      (l.ppl || []).forEach((p, i) => c.push({ k: `p:${l.id}:${i}`, kind: 'Personaje', f: p[0], b: `${p[1]}. ${p[2]}`, l: l.id, m: l.m }));
      (l.tl || []).filter(t => t[3]).forEach((t, i) => c.push({ k: `d:${l.id}:${i}`, kind: 'Fecha clave', f: t[2], b: t[1], l: l.id, m: l.m, q: '¿Cuándo ocurrió?' }));
    });
    return c;
  }
  function due(c) { const s = S.cards[c.k]; return !s || s.due <= dayNum(); }
  function cardsView() {
    const all = allCards(); let mf = 0, kind = '', onlyDone = false, deck = [], i = 0, flipped = false;
    page(`<div class="eyebrow">Estudiar</div><h1>Tarjetas de repaso</h1><p class="subtitle">Conceptos, personajes y fechas clave con repetición espaciada</p>
      <div class="prose intro-text"><p>Lea la cara frontal, intente recordar la respuesta y pulse la tarjeta para comprobarla. Si la sabía, volverá a verla dentro de unos días (1, 3, 7, 14 y 30); si no, volverá hoy. Así se dedica el tiempo a lo que aún no se domina.</p></div>
      <div class="chips" style="margin:10px 0"><button class="chip" data-m="0">Todos los módulos</button>${MODS.map(m => `<button class="chip" data-m="${m.n}">${m.n}</button>`).join('')}</div>
      <div class="chips" style="margin:10px 0"><button class="chip" data-k="">Todo</button><button class="chip" data-k="Concepto">Conceptos</button><button class="chip" data-k="Personaje">Personajes</button><button class="chip" data-k="Fecha clave">Fechas</button><button class="chip" data-d="1">Solo lecciones completadas</button></div>
      <div class="card-stage" id="stage"></div>`);
    function build() { deck = all.filter(c => (!mf || c.m === mf) && (!kind || c.kind === kind) && (!onlyDone || S.done[c.l]) && due(c)); for (let j = deck.length - 1; j > 0; j--) { const r = Math.floor(Math.random() * (j + 1));[deck[j], deck[r]] = [deck[r], deck[j]]; } i = 0; flipped = false; render(); }
    function render() {
      view.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('on', +b.dataset.m === mf));
      view.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('on', b.dataset.k === kind));
      view.querySelector('[data-d]').classList.toggle('on', onlyDone);
      const st = $('#stage');
      if (i >= deck.length) { st.innerHTML = `<div class="flash" style="cursor:default"><div class="kind">Sesión terminada</div><div class="front">No quedan tarjetas pendientes con este filtro.</div><div class="back">Vuelva mañana o cambie el filtro. Tarjetas totales: ${all.length}. Dominadas (caja 4 o más): ${Object.values(S.cards).filter(s => s.box >= 4).length}.</div></div>`; return; }
      const c = deck[i];
      st.innerHTML = `<div class="flash" tabindex="0" role="button" aria-label="Mostrar respuesta"><div class="kind">${c.kind}${c.q ? ' · ' + c.q : ''}</div><div class="front">${inline(c.f)}</div>${flipped ? `<div class="back">${inline(c.b)}<div style="margin-top:10px;font-size:14px"><a href="#${c.l}">Lección: ${esc(byId[c.l].t)}</a></div></div>` : '<div class="back" style="color:var(--stone);border-top-style:dashed">Pulse para ver la respuesta</div>'}</div>
        <div class="card-actions">${flipped ? `<button class="btn" data-a="0">No lo sabía</button><button class="btn primary" data-a="1">Lo sabía</button>` : `<button class="btn" data-a="flip">Ver respuesta</button>`}</div>
        <div class="card-meta">${i + 1} de ${deck.length} pendientes · caja ${(S.cards[c.k] || { box: 0 }).box}</div>`;
    }
    view.addEventListener('click', e => {
      const b = e.target.closest('button, .flash');
      if (!b) return;
      if (b.dataset.m != null) { mf = +b.dataset.m; build(); return; }
      if (b.dataset.k != null) { kind = b.dataset.k; build(); return; }
      if (b.dataset.d) { onlyDone = !onlyDone; build(); return; }
      if (b.classList.contains('flash') || b.dataset.a === 'flip') { if (i < deck.length) { flipped = true; render(); } return; }
      if (b.dataset.a === '0' || b.dataset.a === '1') { grade(deck[i], b.dataset.a === '1'); i++; flipped = false; render(); }
    });
    build();
  }
  function grade(c, ok) { const s = S.cards[c.k] || { box: 0 }; s.box = ok ? Math.min(5, s.box + 1) : 0; s.due = dayNum() + (ok ? INTERVALS[s.box] : 0); S.cards[c.k] = s; S.days[today()] = (S.days[today()] || 0) + 1; save(); }

  /* ---------- Modo de estudio diario ---------- */
  function study() {
    const done = LS.filter(l => S.done[l.id]);
    const nextL = LS.find(l => S.saved[l.id] && !S.done[l.id]) || LS.find(l => !S.done[l.id]) || LS[0];
    const pool = (done.length ? done : [nextL]).flatMap(l => (l.quiz || []).map(q => ({ q, l })));
    const qs = pool.sort(() => Math.random() - .5).slice(0, 5);
    const cards = allCards().filter(c => (done.length ? S.done[c.l] : c.l === (LS[0] || {}).id) && due(c)).sort(() => Math.random() - .5).slice(0, 8);
    let step = 0, ci = 0, flipped = false, t0 = Date.now(), timer;
    const streak = (() => { let n = 0; const d = new Date(); for (; ;) { const k = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); if (S.days[k]) { n++; d.setDate(d.getDate() - 1); } else break; } return n; })();
    page(`<div class="eyebrow">Estudiar</div><h1>Estudio diario</h1><p class="subtitle">Una sesión de 15 a 20 minutos en tres pasos</p>
      <div style="display:flex;gap:24px;align-items:baseline;flex-wrap:wrap"><span class="timer" id="timer">00:00</span><span style="color:var(--stone);font-size:15px">Días seguidos estudiando: ${streak} · Lecciones completadas: ${done.length} de ${LS.length}</span></div>
      <div class="study-steps cur"><div data-st="0"><span class="k">Paso 1 · 4 min</span><b>Repaso</b>${cards.length} tarjetas pendientes</div><div data-st="1"><span class="k">Paso 2 · 12 min</span><b>Lectura</b>${esc(nextL.t)}</div><div data-st="2"><span class="k">Paso 3 · 4 min</span><b>Comprobación</b>${qs.length} preguntas de lecciones leídas</div></div>
      <div id="studyBody"></div>`);
    timer = setInterval(() => { const el = $('#timer'); if (!el) return clearInterval(timer); const s = Math.floor((Date.now() - t0) / 1000); el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000);
    const body = $('#studyBody');
    function render() {
      view.querySelectorAll('[data-st]').forEach(d => d.classList.toggle('on', +d.dataset.st === step));
      if (step === 0) {
        if (ci >= cards.length) { body.innerHTML = `<p>${cards.length ? 'Repaso terminado.' : 'No tiene tarjetas pendientes hoy.'}</p><button class="btn primary" data-go="1">Ir a la lectura</button>`; return; }
        const c = cards[ci];
        body.innerHTML = `<div class="card-stage"><div class="flash"><div class="kind">${c.kind}${c.q ? ' · ' + c.q : ''}</div><div class="front">${inline(c.f)}</div>${flipped ? `<div class="back">${inline(c.b)}</div>` : '<div class="back" style="color:var(--stone);border-top-style:dashed">Pulse para ver la respuesta</div>'}</div>
          <div class="card-actions">${flipped ? '<button class="btn" data-g="0">No lo sabía</button><button class="btn primary" data-g="1">Lo sabía</button>' : '<button class="btn" data-flip="1">Ver respuesta</button>'}<button class="btn ghost" data-go="1">Saltar repaso</button></div><div class="card-meta">${ci + 1} de ${cards.length}</div></div>`;
      } else if (step === 1) {
        body.innerHTML = `<div class="callout"><b>${esc(nextL.t)}</b> · ${esc(nextL.st)}<br>${readingTime(nextL)} minutos de lectura. Lea la lección completa, haga su test final y márquela como completada. Después vuelva aquí para el paso 3.</div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn primary" href="#${nextL.id}">Abrir la lección</a><button class="btn" data-go="2">Ya la he leído: ir al paso 3</button></div>`;
      } else {
        body.innerHTML = qs.length ? `<div class="quiz" data-quiz="study">${qs.map((x, i) => `<div class="q" data-i="${i}" data-qref="1"><p>${i + 1}. ${inline(x.q.q)} <span style="font-weight:400;color:var(--stone);font-size:14px">(${esc(x.l.t)})</span></p><div class="opts">${x.q.o.map((o, j) => `<button type="button" class="opt" data-j="${j}">${inline(o)}</button>`).join('')}</div></div>`).join('')}<p class="score" aria-live="polite"></p></div>` : '<p>Complete alguna lección para recibir preguntas de comprobación.</p>';
        body.querySelectorAll('[data-qref]').forEach((d, i) => d._q = qs[i].q);
        bindQuiz(body, null, () => { S.days[today()] = (S.days[today()] || 0) + 1; save(); });
      }
    }
    body.addEventListener('click', e => {
      if (e.target.closest('.flash') || e.target.closest('[data-flip]')) { flipped = true; render(); return; }
      const g = e.target.closest('[data-g]'); if (g) { grade(cards[ci], g.dataset.g === '1'); ci++; flipped = false; render(); return; }
      const go = e.target.closest('[data-go]'); if (go) { step = +go.dataset.go; render(); }
    });
    render();
  }

  function pending() {
    const saved = LS.filter(l => S.saved[l.id]);
    const quizzes = Object.entries(S.quiz).filter(([id]) => byId[id]);
    page(`<div class="eyebrow">Estudiar</div><h1>Pendientes y progreso</h1>
      <h2 style="font-size:24px;margin-top:28px">Guardadas para repasar</h2>
      ${saved.length ? `<ol class="lessonlist">${saved.map(l => `<li><span class="k">${l.m}</span><div><a href="#${l.id}">${esc(l.t)}</a><p>${esc(l.st)}</p></div><span class="tick${S.done[l.id] ? ' done' : ''}">${S.done[l.id] ? '✓' : '○'}</span></li>`).join('')}</ol>` : '<p style="color:var(--stone)">Todavía no ha guardado ninguna lección. Use el botón «Guardar para repasar» al final de cada lección.</p>'}
      <h2 style="font-size:24px;margin-top:40px">Progreso por módulo</h2>
      <ol class="modlist">${MODS.map(m => { const [d, t] = modProgress(m.n); return `<li><span class="n">${m.n}</span><div><a href="#modulo-${m.n}">${esc(m.t)}</a><div class="bar"><i style="width:${t ? d / t * 100 : 0}%"></i></div></div><span class="pct">${d} / ${t}</span></li>`; }).join('')}</ol>
      <h2 style="font-size:24px;margin-top:40px">Resultados de los tests</h2>
      ${quizzes.length ? `<div class="table-wrap"><table class="data" style="min-width:0"><thead><tr><th>Lección</th><th>Resultado</th></tr></thead><tbody>${quizzes.map(([id, r]) => `<tr><th scope="row"><a href="#${id}">${esc(byId[id].t)}</a></th><td class="num">${r}</td></tr>`).join('')}</tbody></table></div>` : '<p style="color:var(--stone)">Aún no ha hecho ningún test.</p>'}
      <p style="margin-top:40px;font-size:14px;color:var(--stone)">El progreso se guarda solo en este navegador. <button class="btn small ghost" id="resetBtn">Borrar todo el progreso</button> <span id="resetConfirm"></span></p>`);
    $('#resetBtn').addEventListener('click', () => {
      $('#resetConfirm').innerHTML = '¿Seguro? <button class="btn small" id="resetYes">Sí, borrar</button>';
      $('#resetYes').addEventListener('click', () => { S = { done: {}, saved: {}, quiz: {}, cards: {}, last: null, days: {} }; save(); renderSide('pendientes'); pending(); toast('Progreso borrado'); });
    });
  }

  /* ---------- Buscador ---------- */
  let IDX = null;
  function buildIndex() {
    IDX = [];
    LS.forEach(l => {
      IDX.push({ k: 'Lección ' + l.m, t: l.t, s: l.st, x: norm(l.t + ' ' + l.st + ' ' + plain(l.ctx) + ' ' + plain(l.body) + ' ' + plain(l.today) + ' ' + plain(l.debate)), h: l.id, w: 3 });
      (l.ppl || []).forEach(p => IDX.push({ k: 'Personaje', t: p[0], s: p[1] + ' · ' + plain(p[2]).slice(0, 110), x: norm(p[0] + ' ' + p[2]), h: l.id, w: 4 }));
      (l.tl || []).forEach(t => IDX.push({ k: 'Cronología · ' + t[1], t: plain(t[2]).slice(0, 90), s: l.t, x: norm(t[1] + ' ' + t[2]), h: l.id, w: 1 }));
    });
    glossaryItems().forEach(g => IDX.push({ k: 'Concepto', t: g.t, s: plain(g.d).slice(0, 130), x: norm(g.t + ' ' + g.d), h: g.ls[0] || 'glosario', w: 4 }));
    X.simple.forEach(s => IDX.push({ k: 'No entiendo', t: s.t, s: plain(s.s).slice(0, 120), x: norm(s.t + ' ' + s.s), h: 'no-entiendo', w: 2 }));
    [['atlas', 'Atlas y mapas'], ['cronologia', 'Línea temporal'], ['dinastias', 'Árboles dinásticos'], ['constituciones', 'Comparación de constituciones'], ['presidentes', 'Presidentes del Gobierno'], ['instituciones', 'Diagrama de instituciones y simulador D\'Hondt'], ['datos', 'Gráficos de población y economía'], ['tarjetas', 'Tarjetas de repaso']].forEach(([h, t]) => IDX.push({ k: 'Herramienta', t, s: '', x: norm(t), h, w: 2 }));
  }
  let sel = 0;
  function openSearch() { $('#searchDlg').hidden = false; const i = $('#searchInput'); i.value = ''; doSearch(''); setTimeout(() => i.focus(), 10); closeNav(); }
  function closeSearch() { $('#searchDlg').hidden = true; }
  function doSearch(q) {
    if (!IDX) buildIndex();
    const res = $('#searchRes'); const n = norm(q.trim());
    if (n.length < 2) { res.innerHTML = '<div class="search-empty">Escriba al menos dos letras. Ejemplos: «Azaña», «desamortización», «D\'Hondt», «1492», «Nueva Planta».</div>'; return; }
    const words = n.split(/\s+/);
    const hits = IDX.map(it => { if (!words.every(w => it.x.includes(w))) return null; const tn = norm(it.t); let sc = it.w + (tn.includes(n) ? 10 : 0) + (tn.startsWith(n) ? 5 : 0); return { it, sc }; }).filter(Boolean).sort((a, b) => b.sc - a.sc).slice(0, 40);
    const hl = s => { let h = esc(s); words.forEach(w => { if (w.length < 2) return; const re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); h = h.replace(re, '<mark>$1</mark>'); }); return h; };
    sel = 0;
    res.innerHTML = hits.length ? hits.map((h, i) => `<a href="#${h.it.h}" class="${i === 0 ? 'on' : ''}"><span class="k">${esc(h.it.k)}</span><b>${hl(h.it.t)}</b>${h.it.s ? `<span>${esc(h.it.s)}</span>` : ''}</a>`).join('') : `<div class="search-empty">Sin resultados para «${esc(q)}».</div>`;
  }
  $('#searchInput').addEventListener('input', e => doSearch(e.target.value));
  $('#searchInput').addEventListener('keydown', e => {
    const as = [...$('#searchRes').querySelectorAll('a')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(as.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); as.forEach((a, i) => a.classList.toggle('on', i === sel)); as[sel] && as[sel].scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter' && as[sel]) { location.hash = as[sel].getAttribute('href'); closeSearch(); }
  });
  $('#searchDlg').addEventListener('click', e => { if (e.target.id === 'searchDlg' || e.target.closest('a')) closeSearch(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSearch(); closeNav(); }
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  /* ---------- Enrutado ---------- */
  let current = 'inicio';
  const ROUTES = { inicio: home, cronologia: timeline, atlas, dinastias: dynasties, instituciones: institutions, constituciones: constitutions, presidentes: presidents, datos: dataPage, personajes: people, glosario: glossary, 'no-entiendo': simple, conexiones: connections, tarjetas: cardsView, estudio: study, pendientes: pending, metodo: method };
  function route() {
    const h = (location.hash || '#inicio').slice(1) || 'inicio';
    if (h.startsWith('s-')) return; // anclas internas
    current = h;
    if (ROUTES[h]) ROUTES[h]();
    else if (byId[h]) lessonView(h);
    else if (/^modulo-\d+$/.test(h)) moduleView(+h.split('-')[1]);
    else notFound();
    renderSide(h);
    window.scrollTo(0, 0);
    const title = byId[h] ? byId[h].t : null;
    document.title = title ? `${title} · Historia de España` : 'Historia de España';
  }
  window.addEventListener('hashchange', route);
  route();
})();
