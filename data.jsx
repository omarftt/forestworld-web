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

// ---------- Leyenda MapBiomas (nombres traducidos) ----------
const MAPBIOMAS_CLASSES = [
  { code: 3,  name: 'Formación de bosque',     color: '#1f8d49' },
  { code: 6,  name: 'Bosque inundado',         color: '#007785' },
  { code: 11, name: 'Humedal',                 color: '#45c2a5' },
  { code: 15, name: 'Pasto',                   color: '#edde8e' },
  { code: 21, name: 'Mosaico de usos',         color: '#f5d76e' },
  { code: 24, name: 'Área urbana',             color: '#af2a2a' },
  { code: 25, name: 'Suelo desnudo',           color: '#d4ac3a' },
  { code: 33, name: 'Río, lago u océano',      color: '#2c6bd1' },
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
});
