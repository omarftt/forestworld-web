// ForestWorld data + manifest

const SENTINEL_YEARS  = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
const MAPBIOMAS_YEARS = [2018, 2019, 2020, 2021, 2022];
const DAMAGE_PERIODS  = [
  { from: 2018, to: 2019 },
  { from: 2019, to: 2020 },
  { from: 2020, to: 2021 },
  { from: 2021, to: 2022 },
];

function makePaths(id) {
  const base = `web_assets/${id}`;
  return {
    sentinel:       (y)       => `${base}/sentinel_${y}.png`,
    sentinelThumb:  (y)       => `${base}/sentinel_${y}_thumb.png`,
    mapbiomas:      (y)       => `${base}/mapbiomas_${y}.png`,
    mapbiomasThumb: (y)       => `${base}/mapbiomas_${y}_thumb.png`,
    damage:         (from, to) => `${base}/damage_${from}_${to}.png`,
    damageOverlay:  (from, to) => `${base}/damage_${from}_${to}_overlay.png`,
    damageThumb:    (from, to) => `${base}/damage_${from}_${to}_thumb.png`,
  };
}

const DEMO_LAYERS = {
  sentinel:  { status: 'available', note: '7 composites uploaded (2018–2024)' },
  mapbiomas: { status: 'available', note: '5 years uploaded (2018–2022)' },
  damage:    { status: 'available', note: '4 transitions uploaded (2018→19 to 2021→22)' },
  prediction:{ status: 'pending',   note: 'Model/backend not connected' },
  context:   { status: 'pending',   note: 'Action layer not connected' },
};

const AOIS = [
  {
    id: 'boca_manu',
    name: 'Boca Manu',
    region: 'Madre de Dios, Peru',
    coords: { lat: -12.275, lon: -71.00 },
    coordsLabel: '12.276° S · 70.901° W',
    driver: 'mixed frontier',
    marker: { left: '58.0%', top: '69.0%', labelOffset: 'right' },
    summary: 'Pilot AOI near the Manu National Park buffer and Madre de Dios river. Mixed-driver frontier with mining encroachment and agricultural expansion.',
    status: 'demo',
    statusLabel: 'Demo loaded',
    uploaded: true,
    sentinelYears:  SENTINEL_YEARS,
    mapbiomasYears: MAPBIOMAS_YEARS,
    damageYears:    DAMAGE_PERIODS,
    layers: DEMO_LAYERS,
    paths: makePaths('boca_manu'),
    damageStats: {
      '2018_2019': { pixels: 11013, percent: 0.1201, hectares: 110.13 },
      '2019_2020': { pixels: 38262, percent: 0.4172, hectares: 382.62 },
      '2020_2021': { pixels: 31827, percent: 0.347,  hectares: 318.27 },
      '2021_2022': { pixels: 52596, percent: 0.5735, hectares: 525.96 },
    },
  },
  {
    id: 'la_pampa',
    name: 'La Pampa',
    region: 'Madre de Dios, Peru',
    coords: { lat: -12.866, lon: -69.665 },
    coordsLabel: '12.866° S · 69.665° W',
    driver: 'alluvial mining',
    marker: { left: '61.5%', top: '72.5%', labelOffset: 'bottom-right' },
    summary: 'Alluvial-mining frontier south of the Inambari river — the most-documented illegal-mining hotspot in Madre de Dios.',
    status: 'demo',
    statusLabel: 'Demo loaded',
    uploaded: true,
    sentinelYears:  SENTINEL_YEARS,
    mapbiomasYears: MAPBIOMAS_YEARS,
    damageYears:    DAMAGE_PERIODS,
    layers: DEMO_LAYERS,
    paths: makePaths('la_pampa'),
    damageStats: {
      '2018_2019': { pixels: 603,   percent: 0.0048, hectares: 6.03 },
      '2019_2020': { pixels: 1017,  percent: 0.008,  hectares: 10.17 },
      '2020_2021': { pixels: 13617, percent: 0.1075, hectares: 136.17 },
      '2021_2022': { pixels: 62199, percent: 0.4911, hectares: 621.99 },
    },
  },
  {
    id: 'masisea',
    name: 'Masisea',
    region: 'Ucayali, Peru',
    coords: { lat: -8.282, lon: -74.293 },
    coordsLabel: '8.282° S · 74.293° W',
    driver: 'Mennonite agriculture',
    marker: { left: '48.0%', top: '51.5%', labelOffset: 'right' },
    summary: 'Pasture and mosaic-agriculture corridor along the Ucayali river. Mennonite-driven clearing pattern.',
    status: 'demo',
    statusLabel: 'Demo loaded',
    uploaded: true,
    sentinelYears:  SENTINEL_YEARS,
    mapbiomasYears: MAPBIOMAS_YEARS,
    damageYears:    DAMAGE_PERIODS,
    layers: DEMO_LAYERS,
    paths: makePaths('masisea'),
    damageStats: {
      '2018_2019': { pixels: 9981,  percent: 0.1307, hectares: 99.81 },
      '2019_2020': { pixels: 17538, percent: 0.2297, hectares: 175.38 },
      '2020_2021': { pixels: 36171, percent: 0.4738, hectares: 361.71 },
      '2021_2022': { pixels: 16287, percent: 0.2133, hectares: 162.87 },
    },
  },
  {
    id: 'chipiar',
    name: 'Chipiar / Padre Márquez',
    region: 'Ucayali–Loreto frontier, Peru',
    coords: { lat: -8.075, lon: -74.25 },
    coordsLabel: '8.075° S · 74.250° W',
    driver: 'Mennonite agriculture',
    marker: { left: '48.5%', top: '48.0%', labelOffset: 'top-right' },
    summary: 'Mennonite-agriculture frontier on the Ucayali–Loreto border, with the fastest year-over-year clearing rate in our pilot set.',
    status: 'demo',
    statusLabel: 'Demo loaded',
    uploaded: true,
    sentinelYears:  SENTINEL_YEARS,
    mapbiomasYears: MAPBIOMAS_YEARS,
    damageYears:    DAMAGE_PERIODS,
    layers: DEMO_LAYERS,
    paths: makePaths('chipiar'),
    damageStats: {
      '2018_2019': { pixels: 72960,  percent: 0.795,  hectares: 729.6 },
      '2019_2020': { pixels: 106965, percent: 1.1655, hectares: 1069.65 },
      '2020_2021': { pixels: 125685, percent: 1.3695, hectares: 1256.85 },
      '2021_2022': { pixels: 42138,  percent: 0.4591, hectares: 421.38 },
    },
  },
];

const TABS = [
  { id: 'satellite',  label: 'Satellite image',  short: 'Satellite',  sub: 'Sentinel-2 composite' },
  { id: 'mapbiomas',  label: 'Land-cover map',   short: 'Land cover', sub: 'MapBiomas / GEE classification' },
  { id: 'damage',     label: 'Damage mask',      short: 'Damage',     sub: 'Observed / derived damage mask' },
  { id: 'prediction', label: 'Prediction',       short: 'Prediction', sub: 'Future damage probability' },
  { id: 'backtest',   label: 'Backtest',         short: 'Backtest',   sub: 'Predicted vs observed' },
];

const MAPBIOMAS_CLASSES = [
  { code: 3,  name: 'Forest formation',         color: '#1f8d49' },
  { code: 6,  name: 'Flooded forest',           color: '#007785' },
  { code: 11, name: 'Wetland',                  color: '#45c2a5' },
  { code: 15, name: 'Pasture',                  color: '#edde8e' },
  { code: 21, name: 'Mosaic of uses',           color: '#f5d76e' },
  { code: 24, name: 'Urban area',               color: '#af2a2a' },
  { code: 25, name: 'Other non-vegetated area', color: '#d4ac3a' },
  { code: 33, name: 'River, lake & ocean',      color: '#2c6bd1' },
];

const BACKTEST_METRICS = [
  { id: 'iou',         label: 'IoU',                sub: 'Intersection over union' },
  { id: 'precision',   label: 'Precision @ K ha',   sub: 'Top-K hectares by probability' },
  { id: 'area-error',  label: 'Area error',         sub: '|predicted − observed| (ha)' },
  { id: 'direction',   label: 'Direction match',    sub: 'Change-sign agreement' },
];

const PIPELINE = [
  { step: 1, label: 'Sentinel-2 composite',  status: 'available', note: '7 years loaded (2018–2024)' },
  { step: 2, label: 'MapBiomas land cover',  status: 'available', note: '5 years loaded' },
  { step: 3, label: 'Damage mask',           status: 'available', note: '4 transitions loaded' },
  { step: 4, label: 'Model prediction',      status: 'pending',   note: 'Backend not connected' },
  { step: 5, label: 'Action layer',          status: 'pending',   note: 'Not connected' },
];

const STATUS_META = {
  available:    { label: 'Available',           tone: 'ok' },
  uploaded:     { label: 'Uploaded',            tone: 'ok' },
  not_uploaded: { label: 'Not uploaded',        tone: 'gray' },
  local:        { label: 'Available locally',   tone: 'info' },
  pending:      { label: 'Pending',             tone: 'amber' },
  placeholder:  { label: 'Placeholder',         tone: 'gray' },
  demo:         { label: 'Demo loaded',         tone: 'ok' },
};

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

function StatusBadge({ status, children }) {
  const meta = STATUS_META[status] || STATUS_META.placeholder;
  const cls = meta.tone === 'ok' ? 'badge-ok'
    : meta.tone === 'amber' ? 'badge-pending'
    : meta.tone === 'info' ? 'badge-info'
    : 'badge-gray';
  return <span className={`badge ${cls}`}><span className="dot"></span>{children || meta.label}</span>;
}

Object.assign(window, { AOIS, TABS, MAPBIOMAS_CLASSES, BACKTEST_METRICS, PIPELINE, STATUS_META, Icon, StatusBadge });
