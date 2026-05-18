// ForestWorld — datos del frontend (ES)
// Backend-driven: el catálogo de áreas viene de GET /aois.

// ---------- Fuente de datos ----------
const API_BASE  = '';                // '' = mismo origen (sirve el archivo estático)
const AOIS_PATH = '/aois.json';      // futuro: '/aois' apuntando al backend en Cloud Run

async function fetchAOIs() {
  const r = await fetch(API_BASE + AOIS_PATH, { cache: 'no-store' });
  if (!r.ok) throw new Error(`GET ${AOIS_PATH} → HTTP ${r.status}`);
  return r.json();
}

// ---------- Lookup estático (lo que el backend NO devuelve) ----------
// Solo posición del pin en el locator y un resumen corto por área. Todo
// lo demás (nombre, región, capas, ranking, reporte) viene del backend.
const AOI_STATIC = {
  boca_manu: {
    marker: { left: '58.0%', top: '69.0%', labelOffset: 'right' },
    coordsLabel: '12.28° S · 70.90° O',
    summary: 'Frente mixto cerca del Parque Nacional Manu, sobre el río Madre de Dios.',
  },
  la_pampa: {
    marker: { left: '61.5%', top: '72.5%', labelOffset: 'bottom-right' },
    coordsLabel: '12.87° S · 69.67° O',
    summary: 'Frente minero aluvial al sur del río Inambari.',
  },
  masisea: {
    marker: { left: '48.0%', top: '51.5%', labelOffset: 'right' },
    coordsLabel: '8.28° S · 74.29° O',
    summary: 'Corredor de pastos y agricultura sobre el río Ucayali.',
  },
  chipiar: {
    marker: { left: '48.5%', top: '48.0%', labelOffset: 'top-right' },
    coordsLabel: '8.08° S · 74.25° O',
    summary: 'Frontera agrícola menonita entre Ucayali y Loreto.',
  },
};

// ---------- Etiquetas de pestañas (página de caso) ----------
const TABS = [
  { id: 'satellite',  label: 'Imagen satelital',    short: 'Satélite',  sub: 'Compuesto Sentinel-2' },
  { id: 'mapbiomas',  label: 'Cobertura del suelo', short: 'Cobertura', sub: 'Clasificación MapBiomas / GEE' },
  { id: 'damage',     label: 'Máscara de daño',     short: 'Daño',      sub: 'Máscara de daño observada' },
  { id: 'prediction', label: 'Predicción',          short: 'Predicción', sub: 'Probabilidad de daño futuro' },
];

// ---------- Leyenda MapBiomas (Amazonía Col. 6, traducida) ----------
// Solo las clases que realmente aparecen en los rásters de los 4 AOIs.
// Colores tomados de las exportaciones de GEE (ver metadata.json de cada AOI).
// Orden temático: bosque y agua natural → usos mixtos → drivers de deforestación.
const MAPBIOMAS_CLASSES = [
  { code: 3,  name: 'Formación de bosque',  color: '#1f8d49' },
  { code: 6,  name: 'Bosque inundado',      color: '#026975' },
  { code: 11, name: 'Humedal',              color: '#519799' },
  { code: 21, name: 'Mosaico de usos',      color: '#ffefc3' },
  { code: 15, name: 'Pasto',                color: '#edde8e' },
  { code: 18, name: 'Agricultura',          color: '#e974ed' },
  { code: 30, name: 'Minería',              color: '#9c0027' },
  { code: 25, name: 'Suelo desnudo',        color: '#db4d4f' },
  { code: 24, name: 'Área urbana',          color: '#d4271e' },
  { code: 33, name: 'Río, lago u océano',   color: '#2532e4' },
];

// ---------- Estado del catálogo ----------
const STATUS_META = {
  loaded:    { label: 'Cargado',       tone: 'ok' },
  available: { label: 'Disponible',    tone: 'ok' },
  pending:   { label: 'Próximamente',  tone: 'amber' },
};

// ---------- Helpers de formato (celdas de la tabla) ----------
function formatYearRange(years) {
  if (!years || years.length === 0) return null;
  const sorted = [...years].sort((a, b) => a - b);
  const n = sorted.length;
  const word = n === 1 ? 'año' : 'años';
  if (n === 1) return `1 ${word} · ${sorted[0]}`;
  return `${n} ${word} · ${sorted[0]}–${sorted[n - 1]}`;
}

function _shortPair(p) {
  // "2018_2019" → "2018→19"
  const [a, b] = p.split('_');
  return `${a}→${b.slice(-2)}`;
}

function formatPairRange(pairs) {
  if (!pairs || pairs.length === 0) return null;
  const sorted = [...pairs].sort();
  const n = sorted.length;
  const word = n === 1 ? 'período' : 'períodos';
  if (n === 1) return `1 ${word} · ${_shortPair(sorted[0])}`;
  return `${n} ${word} · ${_shortPair(sorted[0])} a ${_shortPair(sorted[n - 1])}`;
}

function countCases(ranking) {
  if (!ranking) return 0;
  return Object.values(ranking).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0);
}

function formatCasesCount(n) {
  if (!n) return null;
  return `${n} ${n === 1 ? 'caso' : 'casos'}`;
}

// ---------- Driver en español ----------
function driverEs(driver) {
  const map = {
    alluvial_mining:       'Minería aluvial',
    mennonite_agriculture: 'Agricultura menonita',
    mixed_frontier:        'Frontera mixta',
  };
  return map[driver] || driver || '—';
}

// ---------- Fecha en español (DD MMM YYYY) ----------
const _MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function formatSpanishDate(iso) {
  if (!iso) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mm, dd] = m;
  return `${parseInt(dd, 10)} ${_MONTHS_ES[parseInt(mm, 10) - 1]} ${y}`;
}

// ---------- Lat / Lon en español ----------
function formatLatLon(lat, lon) {
  if (lat == null || lon == null) return '—';
  const ns = lat >= 0 ? 'N' : 'S';
  const eo = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(2)}° ${ns} · ${Math.abs(lon).toFixed(2)}° ${eo}`;
}

// ---------- Limpia prefijo "del " en nombres de ANP ----------
function cleanAnpName(name) {
  if (!name) return '';
  return name.replace(/^del\s+/i, '');
}

// ---------- Justificaciones de prioridad (mismo umbral que enrich.py) ----------
function caseJustifications(c) {
  if (!c) return [];
  const lines = [];
  const p = c.priority;

  if (p === 'Alta') {
    if (c.in_anp && c.anp_name) lines.push(`Dentro del ANP ${cleanAnpName(c.anp_name)}`);
    if (c.in_territorio_indigena && c.territorio_name) lines.push(`Dentro del territorio ${c.territorio_name}`);
    if (typeof c.area_ha === 'number' && c.area_ha > 20) lines.push(`Área extensa (${c.area_ha.toFixed(1)} ha)`);
    if (typeof c.dist_rio_m === 'number' && c.dist_rio_m < 500) lines.push(`A ${Math.round(c.dist_rio_m)} m de un río`);
  } else if (p === 'Media') {
    if (typeof c.dist_rio_m === 'number' && c.dist_rio_m < 2000) lines.push(`Cerca de un río (${Math.round(c.dist_rio_m)} m)`);
    if (typeof c.dist_carretera_m === 'number' && c.dist_carretera_m < 1000) lines.push(`Cerca de una carretera (${Math.round(c.dist_carretera_m)} m)`);
    if (typeof c.area_ha === 'number' && c.area_ha > 5 && c.area_ha <= 20) lines.push(`Área moderada (${c.area_ha.toFixed(1)} ha)`);
  }

  if (lines.length === 0) lines.push('Sin factores agravantes detectados');
  return lines;
}

// ---------- Total ha en una lista de casos ----------
function totalHa(cases) {
  if (!cases || cases.length === 0) return 0;
  return cases.reduce((s, c) => s + (typeof c.area_ha === 'number' ? c.area_ha : 0), 0);
}

// ============================================================
// Generación de reporte PDF (jsPDF, formato oficio fiscal)
// ============================================================

const PDF_BRAND = '#1f5c3c';     // forest-2
const PDF_INK   = '#1a221d';     // ink
const PDF_INK_2 = '#3b463f';     // ink-2
const PDF_INK_3 = '#6d7a72';     // ink-3
const PDF_LINE  = '#d3d7cc';     // line-2
const PDF_RED   = '#a83a2c';
const PDF_AMBER = '#a06f1c';

function _today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function _hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function _priorityColor(p) {
  if (p === 'Alta')  return PDF_RED;
  if (p === 'Media') return PDF_AMBER;
  return PDF_INK_3;
}

// Renderiza un párrafo con wrap automático y devuelve la nueva y.
function _drawWrapped(doc, text, x, y, maxWidth, opts = {}) {
  const lineHeight = opts.lineHeight || 5;
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

// Si quedan menos de `need` mm en la página, agrega una nueva.
function _ensureSpace(doc, y, need, marginTop = 20) {
  const pageH = doc.internal.pageSize.getHeight();
  if (y + need > pageH - 20) {
    doc.addPage();
    return marginTop;
  }
  return y;
}

function _drawHeader(doc, aoi, pair) {
  const pageW = doc.internal.pageSize.getWidth();

  // Línea de marca
  doc.setDrawColor(..._hexToRgb(PDF_BRAND));
  doc.setLineWidth(0.6);
  doc.line(20, 18, pageW - 20, 18);

  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(..._hexToRgb(PDF_BRAND));
  doc.text('ForestWorld — Alerta de Riesgo de Deforestación', 20, 28);

  // Sub-bloque de metadatos
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(..._hexToRgb(PDF_INK_2));
  let y = 38;
  doc.text(`Área de interés: ${aoi.name}`, 20, y); y += 5.5;
  doc.text(`Región: ${aoi.region}`, 20, y); y += 5.5;
  doc.text(`Período analizado: ${pair ? pair.replace('_', ' → ') : '—'}`, 20, y); y += 5.5;
  doc.text(`Fecha de emisión: ${_today()}`, 20, y); y += 5.5;
  return y + 2;
}

function _drawSummary(doc, aoi, cases, y) {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setDrawColor(..._hexToRgb(PDF_LINE));
  doc.setLineWidth(0.3);
  doc.line(20, y, pageW - 20, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(..._hexToRgb(PDF_INK));
  doc.text('Resumen', 20, y); y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(..._hexToRgb(PDF_INK_2));
  doc.text(`• Tipo de frontera: ${driverEs(aoi.driver)}`, 20, y); y += 5;
  doc.text(`• Hectáreas en riesgo (total): ${totalHa(cases).toFixed(1)} ha`, 20, y); y += 5;
  doc.text(`• Casos priorizados: ${cases.length}`, 20, y); y += 5;
  if (cases.length > 0) {
    doc.text(`• Responsable principal (caso 1): ${cases[0].stakeholder || '—'}`, 20, y); y += 5;
  }
  return y + 3;
}

function _drawCase(doc, c, idx, y) {
  const pageW = doc.internal.pageSize.getWidth();
  const innerW = pageW - 40;

  y = _ensureSpace(doc, y, 80);

  // Separador
  doc.setDrawColor(..._hexToRgb(PDF_LINE));
  doc.setLineWidth(0.3);
  doc.line(20, y, pageW - 20, y);
  y += 7;

  // Encabezado del caso
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(..._hexToRgb(PDF_INK));
  doc.text(`CASO ${c.rank}`, 20, y);

  // Pill de prioridad (a la derecha)
  const pColor = _priorityColor(c.priority);
  doc.setFontSize(10);
  doc.setTextColor(..._hexToRgb(pColor));
  doc.text(`Prioridad ${c.priority.toUpperCase()}`, pageW - 20, y, { align: 'right' });
  y += 7;

  // "Para: ..."
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(..._hexToRgb(PDF_INK_2));
  doc.text(`Para: ${c.stakeholder || '—'}`, 20, y); y += 6;

  // Sub-titulo "Descripción del caso"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(..._hexToRgb(PDF_INK));
  doc.text('Descripción del caso', 20, y); y += 5.5;

  // Tabla key/value
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(..._hexToRgb(PDF_INK_2));
  const kvs = [
    ['Área en riesgo',                     `${(c.area_ha || 0).toFixed(1)} hectáreas`],
    ['Coordenadas GPS (centroide)',        `Lat ${c.centroid_lat}, Lon ${c.centroid_lon}`],
    ['Plazo sugerido de intervención',     formatSpanishDate(c.suggested_deadline)],
    ['Área Natural Protegida',             c.in_anp && c.anp_name ? c.anp_name : '—'],
    ['Territorio indígena',                c.in_territorio_indigena && c.territorio_name ? c.territorio_name : '—'],
    ['Concesión minera',                   c.concesion_minera
                                              ? `${c.concesion_minera}${c.concesion_titular ? ' — ' + c.concesion_titular : ''}${c.concesion_estado ? ' (' + c.concesion_estado.toLowerCase() + ')' : ''}`
                                              : '—'],
    ['Concesión forestal',                 c.concesion_forestal || '—'],
    ['Driver de deforestación',            driverEs(c.driver)],
    ['Distancia a cuerpo de agua',         typeof c.dist_rio_m === 'number' ? `${Math.round(c.dist_rio_m)} m` : '—'],
    ['Distancia a carretera',              typeof c.dist_carretera_m === 'number' ? `${Math.round(c.dist_carretera_m)} m` : '—'],
  ];
  const keyW = 60;
  for (const [k, v] of kvs) {
    y = _ensureSpace(doc, y, 6);
    doc.setFont('helvetica', 'bold');
    doc.text(k + ':', 20, y);
    doc.setFont('helvetica', 'normal');
    const valueText = doc.splitTextToSize(String(v), innerW - keyW);
    for (let i = 0; i < valueText.length; i++) {
      if (i > 0) y += 5;
      doc.text(valueText[i], 20 + keyW, y);
    }
    y += 5;
  }
  y += 2;

  // Justificación
  const lines = caseJustifications(c);
  const strap = c.priority === 'Alta' ? '¿Por qué es prioridad alta?' :
                c.priority === 'Media' ? '¿Por qué es prioridad media?' :
                'Observaciones';

  y = _ensureSpace(doc, y, 12 + lines.length * 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(..._hexToRgb(PDF_INK));
  doc.text(strap, 20, y); y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(..._hexToRgb(PDF_INK_2));
  for (const line of lines) {
    y = _ensureSpace(doc, y, 5);
    doc.text(`  • ${line}`, 20, y);
    y += 5;
  }
  return y + 4;
}

function _drawMethodology(doc, y) {
  const pageW = doc.internal.pageSize.getWidth();
  const innerW = pageW - 40;
  y = _ensureSpace(doc, y, 50);

  doc.setDrawColor(..._hexToRgb(PDF_LINE));
  doc.setLineWidth(0.3);
  doc.line(20, y, pageW - 20, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(..._hexToRgb(PDF_INK));
  doc.text('Metodología', 20, y); y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(..._hexToRgb(PDF_INK_2));
  const body = (
    'Predicción generada por ForestWorld usando imágenes Sentinel-2 (Microsoft Planetary Computer) procesadas con Prithvi-EO-2.0 (NASA/IBM). ' +
    'Las zonas de riesgo se polygonizan con un umbral de detección de 0.30 y se filtran descartando polígonos menores a 2 hectáreas. ' +
    'A cada polígono se le asigna prioridad (Alta / Media / Baja) cruzándolo con áreas naturales protegidas (SERNANP), territorios indígenas (RAISG), concesiones mineras (INGEMMET) y forestales (SERFOR), además de su cercanía a ríos (HydroSHEDS) y carreteras (OpenStreetMap). El plazo sugerido es de 7 días.'
  );
  y = _drawWrapped(doc, body, 20, y, innerW, { lineHeight: 5 });
  return y;
}

function _drawFooter(doc) {
  const total = doc.internal.getNumberOfPages();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(..._hexToRgb(PDF_INK_3));
    doc.text('ForestWorld · Inteligencia predictiva de riesgo forestal', 20, pageH - 10);
    doc.text(`Página ${i} de ${total}`, pageW - 20, pageH - 10, { align: 'right' });
  }
}

function generateReportPDF(aoi, pair) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('No se pudo cargar el generador de PDF. Revisa la conexión a internet.');
    return;
  }
  const cases = (aoi.ranking && pair && aoi.ranking[pair]) || [];
  const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });

  let y = _drawHeader(doc, aoi, pair);
  y = _drawSummary(doc, aoi, cases, y);

  if (cases.length === 0) {
    y = _ensureSpace(doc, y, 20);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(..._hexToRgb(PDF_INK_3));
    doc.text('Sin casos priorizados para este período.', 20, y);
    y += 8;
  } else {
    for (let i = 0; i < cases.length; i++) {
      y = _drawCase(doc, cases[i], i, y);
    }
  }

  y = _drawMethodology(doc, y);
  _drawFooter(doc);

  const slug = `${aoi.id}_${(pair || 'reporte').replace(/[^a-z0-9_]/gi, '_')}.pdf`;
  doc.save(`forestworld_${slug}`);
}

// ---------- Iconos ----------
const Icon = {
  logo: (p) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" {...p}>
      <circle cx="11" cy="11" r="9.25" stroke="var(--forest-2)" strokeWidth="1.3" />
      <path d="M11 2.5C7.8 5.5 7.8 16.5 11 19.5M11 2.5C14.2 5.5 14.2 16.5 11 19.5" stroke="var(--forest)" strokeWidth="1.1" />
      <path d="M2 10.2h18" stroke="var(--forest)" strokeWidth="1.1" />
      <circle cx="14.8" cy="7.5" r="2" fill="var(--red)" stroke="#fff" strokeWidth="1" />
    </svg>
  ),
  pin: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 12.5C7 12.5 11 8.5 11 5.5C11 3.29 9.21 1.5 7 1.5C4.79 1.5 3 3.29 3 5.5C3 8.5 7 12.5 7 12.5Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="5.5" r="1.4" stroke="currentColor" strokeWidth="1.2"/></svg>),
  arrowRight: (p) => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><path d="M2.5 6H9.5M9.5 6L7 3.5M9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  arrowLeft: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M8 3.5L4.5 7L8 10.5M4.5 7H11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  chevronLeft: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M8.5 3.5L5 7L8.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  chevronRight: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M5.5 3.5L9 7L5.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  chevronDown: (p) => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  download: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 1.75v7M7 8.75L4.5 6.25M7 8.75L9.5 6.25M2.5 11v1.25h9V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  clock: (p) => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1"/><path d="M6 3.5V6L7.75 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
  check: (p) => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  image: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><rect x="1.5" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5.5" r="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 9.5L4.5 7L8 10L10 8.5L12.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>),
  layers: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 1.75L12.5 4.5L7 7.25L1.5 4.5L7 1.75Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M1.5 7.5L7 10.25L12.5 7.5M1.5 10.25L7 13L12.5 10.25" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>),
  alert: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 2L13 12H1L7 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 6V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="10.2" r="0.6" fill="currentColor"/></svg>),
  info: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M7 6V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="4.25" r="0.6" fill="currentColor"/></svg>),
  external: (p) => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><path d="M5.5 3.5H3.5V9.5H8.5V7.5M7 2.5H9.5V5M9.5 2.5L5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  search: (p) => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
};

// ---------- Badge de estado ----------
function StatusBadge({ status, children }) {
  const meta = STATUS_META[status] || STATUS_META.loaded;
  const cls = meta.tone === 'ok' ? 'badge-ok' : meta.tone === 'amber' ? 'badge-pending' : 'badge-gray';
  return <span className={`badge ${cls}`}><span className="dot"></span>{children || meta.label}</span>;
}

Object.assign(window, {
  fetchAOIs,
  AOI_STATIC,
  TABS,
  MAPBIOMAS_CLASSES,
  STATUS_META,
  Icon,
  StatusBadge,
  formatYearRange,
  formatPairRange,
  countCases,
  formatCasesCount,
  driverEs,
  formatSpanishDate,
  formatLatLon,
  cleanAnpName,
  caseJustifications,
  totalHa,
  generateReportPDF,
});
