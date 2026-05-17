// Views — Selector (Screen 1) and CasePage (Screen 2)

// ---------- Header ----------
function TopBar({ onView, view }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
      <div className="row" style={{ height: 64, padding: '0 28px', gap: 22, overflow: 'hidden' }}>
        <button className="row gap-10" style={{ flexShrink: 0 }} onClick={() => onView('selector')}>
          <Icon.logo />
          <div className="col" style={{ lineHeight: 1.15 }}>
            <span className="fw-600 nowrap" style={{ fontSize: 15 }}>ForestWorld</span>
            <span className="muted t-xs nowrap" style={{ fontSize: 11 }}>Predictive forest-risk intelligence</span>
          </div>
        </button>
        <div className="vr" style={{ height: 28 }}></div>
        <nav className="row gap-2">
          {[
            { id: 'selector', label: 'Map' },
            { id: 'selector', label: 'AOIs' },
            { id: 'backtest', label: 'Backtest', disabled: true },
            { id: 'reports',  label: 'Reports',  disabled: true },
          ].map((n, i) => (
            <button key={i} className={`navlink ${(view === n.id || (i === 1 && view === 'selector')) ? 'active' : ''} ${n.disabled ? 'disabled' : ''}`}
              onClick={() => !n.disabled && onView(n.id)}>
              {n.label}
              {n.disabled && <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--ink-4)' }}>pending</span>}
            </button>
          ))}
        </nav>
        <div className="grow"></div>
        <span className="badge badge-ok" style={{ height: 26 }}>
          <span className="dot"></span>Demo loaded · 4 pilot AOIs
        </span>
        <button className="btn btn-sm"><Icon.download />Export report</button>
      </div>
    </div>
  );
}

// ---------- Locator map (Peru satellite image, AOI markers overlaid) ----------
const MAP_IMG = 'web_assets/maps/peru_locator.png';
const MAP_AR  = 1514 / 1098; // intrinsic image aspect ratio

function statusTone(s) {
  if (s === 'demo')        return { dot: '#34a85a', ring: '#34a85a', label: 'Demo loaded',                tone: 'available' };
  if (s === 'local')       return { dot: '#d49a3e', ring: '#d49a3e', label: 'Local data · not uploaded',  tone: 'pending'   };
  return                          { dot: '#c4ccc3', ring: '#9aa49d', label: 'Placeholder',                tone: 'placeholder' };
}

function LocatorMap({ aois, selectedId, hoveredId, onSelect, onHover, onOpen }) {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: `${MAP_AR}`,
      borderRadius: 14, overflow: 'hidden',
      background: '#0f1c2a',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      <img src={MAP_IMG} alt="Peru locator map"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }} />

      {/* corner caption */}
      <div style={{
        position: 'absolute', left: 14, bottom: 14, zIndex: 4,
        padding: '6px 10px', borderRadius: 6,
        background: 'rgba(8, 18, 28, 0.55)', backdropFilter: 'blur(4px)',
        color: 'rgba(255,255,255,0.85)', fontSize: 10.5,
        fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>Static Peru locator · pilot AOIs</div>

      {/* legend */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 4,
        padding: '8px 10px', borderRadius: 7,
        background: 'rgba(8, 18, 28, 0.62)', backdropFilter: 'blur(6px)',
        color: '#fff', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Marker key</div>
        <div className="col gap-4" style={{ fontSize: 10.5 }}>
          <div className="row gap-6"><LegendDotImg color="#34a85a" pulse /><span>Demo loaded</span></div>
          <div className="row gap-6"><LegendDotImg color="#d49a3e" pulse /><span>Local data not uploaded</span></div>
          <div className="row gap-6"><LegendDotImg color="#c4ccc3" /><span>Placeholder</span></div>
        </div>
      </div>

      {/* AOI markers */}
      {aois.map((a) => {
        const tone = statusTone(a.status);
        const isDemo = a.status === 'demo';
        const isPh   = a.status === 'placeholder';
        const selected = selectedId === a.id;
        const hovered  = hoveredId === a.id;
        const pos = a.marker || { left: '50%', top: '50%', labelOffset: 'right' };

        const tipPos = {
          right:         { left: 22, top: -4 },
          'bottom-right':{ left: 22, top: 14 },
          'top-right':   { left: 22, top: -56 },
          left:          { right: 22, top: -4 },
        }[pos.labelOffset] || { left: 22, top: -4 };

        return (
          <button key={a.id}
            onClick={() => { onSelect(a.id); if (isDemo) onOpen && onOpen(a.id); }}
            onMouseEnter={() => onHover(a.id)}
            onMouseLeave={() => onHover(null)}
            style={{
              position: 'absolute', left: pos.left, top: pos.top,
              transform: 'translate(-50%, -50%)',
              padding: 0, background: 'none', border: 0,
              cursor: isDemo ? 'pointer' : 'default',
              zIndex: selected || hovered ? 20 : 10,
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', width: 18, height: 18 }}>
              {!isPh && <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `1.5px solid ${tone.ring}`,
                animation: 'aoiPing 2.2s ease-out infinite',
                opacity: 0.7,
              }}></span>}
              <span style={{
                position: 'relative', display: 'inline-block', width: 18, height: 18,
                borderRadius: '50%', background: tone.dot,
                border: '2px solid #fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.45)',
                opacity: isPh ? 0.9 : 1,
              }}></span>
              {selected && (
                <span style={{
                  position: 'absolute', inset: -6, borderRadius: '50%',
                  border: '2px solid #fff', opacity: 0.9,
                }}></span>
              )}
            </span>

            {hovered && (
              <div style={{
                position: 'absolute', ...tipPos,
                minWidth: 200, maxWidth: 240,
                background: '#fff', color: 'var(--ink)',
                border: '1px solid var(--line)', borderRadius: 8,
                boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
                padding: 12, textAlign: 'left',
                pointerEvents: 'none',
              }}>
                <div className="row between gap-8" style={{ marginBottom: 4 }}>
                  <span className="fw-600 nowrap" style={{ fontSize: 13 }}>{a.name}</span>
                </div>
                <div className="t-xs muted nowrap">{a.region}</div>
                <div className="t-xs" style={{ marginTop: 8, color: 'var(--ink-2)' }}>
                  <span className="eyebrow" style={{ fontSize: 9, marginRight: 6 }}>Driver</span>
                  <span>{a.driver}</span>
                </div>
                <div className="row gap-6" style={{ marginTop: 8, alignItems: 'center' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: tone.dot, flexShrink: 0 }}></span>
                  <span className="t-xs" style={{ color: 'var(--ink-2)' }}>{tone.label}</span>
                </div>
              </div>
            )}
          </button>
        );
      })}

      <style>{`@keyframes aoiPing { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(3.6);opacity:0} }`}</style>
    </div>
  );
}

function LegendDotImg({ color, pulse }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 12, height: 12, flexShrink: 0 }}>
      {pulse && <span style={{ position: 'absolute', inset: -2, borderRadius: '50%', border: `1.5px solid ${color}`, animation: 'aoiPing 2.2s ease-out infinite', opacity: 0.7 }}></span>}
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, border: '1.5px solid #fff' }}></span>
    </span>
  );
}

// ---------- Screen 1: Selector ----------
function SelectorView({ onOpenAOI }) {
  const [selectedId, setSelectedId] = React.useState('boca_manu');
  const [hoveredId, setHoveredId] = React.useState(null);
  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '40px 48px 28px', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div className="col gap-6" style={{ marginBottom: 4 }}>
            <span className="eyebrow">Pilot AOIs · Peruvian Amazon</span>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
              Choose an AOI to inspect static forest-risk evidence
            </h1>
            <p className="muted-2" style={{ margin: '4px 0 0', maxWidth: 720, fontSize: 14, lineHeight: 1.6 }}>
              Static demo with Sentinel-2, MapBiomas land-cover and damage-mask rasters preloaded for <span className="fw-600 ink">all 4 pilot AOIs</span> across Madre de Dios and Ucayali. Pick one on the map or in the side panel to open its case file.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 48px 56px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 460px', gap: 24, alignItems: 'start' }}>
          {/* Locator */}
          <div className="paper" style={{ padding: 12, position: 'relative', overflow: 'hidden' }}>
            <LocatorMap aois={AOIS} selectedId={selectedId} hoveredId={hoveredId} onSelect={setSelectedId} onHover={setHoveredId} onOpen={onOpenAOI} />
          </div>

          {/* AOI cards column */}
          <div className="col gap-12">
            {AOIS.map((a) => (
              <AOICard key={a.id} aoi={a}
                selected={selectedId === a.id}
                onHover={setHoveredId}
                onSelect={() => setSelectedId(a.id)}
                onOpen={() => onOpenAOI(a.id)}
              />
            ))}
            <div className="card-soft" style={{ padding: 14, marginTop: 4 }}>
              <div className="row gap-8" style={{ marginBottom: 6 }}>
                <Icon.info style={{ color: 'var(--ink-3)' }} />
                <span className="eyebrow">About this prototype</span>
              </div>
              <p className="t-xs muted-2" style={{ margin: 0, lineHeight: 1.55 }}>
                ForestWorld is a static demo frontend. It does not process live satellite data. Predicted-risk, backtest, and action layers are intentionally shown as placeholders until the backend is connected.
              </p>
            </div>
          </div>
        </div>

        {/* Data availability matrix */}
        <div style={{ maxWidth: 1320, margin: '32px auto 0' }}>
          <AvailabilityMatrix />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, pulse }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 14, height: 14, flexShrink: 0 }}>
      {pulse && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid ${color}`, animation: 'ringPulse 2.2s ease-out infinite' }}></span>}
      <span style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: color, border: '1.5px solid #fff', boxShadow: `0 0 0 1px ${color}` }}></span>
    </span>
  );
}

function AOICard({ aoi, selected, onSelect, onOpen, onHover }) {
  const isDemo = aoi.status === 'demo';
  return (
    <div
      className={`paper ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => onHover && onHover(aoi.id)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{
        padding: 18,
        cursor: 'pointer',
        opacity: isDemo ? 1 : 0.92,
        borderColor: selected ? 'var(--forest)' : 'var(--line)',
        boxShadow: selected ? '0 0 0 3px var(--forest-soft)' : 'none',
        transition: 'box-shadow 0.12s, border-color 0.12s',
      }}
    >
      <div className="row between gap-12" style={{ marginBottom: 8 }}>
        <div className="row gap-10">
          <Icon.pin style={{ color: isDemo ? 'var(--red)' : aoi.status === 'local' ? 'var(--river)' : 'var(--ink-4)', flexShrink: 0 }} />
          <div className="col" style={{ lineHeight: 1.2 }}>
            <span className="fw-600 nowrap" style={{ fontSize: 15 }}>{aoi.name}</span>
            <span className="muted t-xs nowrap">{aoi.region}</span>
          </div>
        </div>
        <StatusBadge status={aoi.status === 'demo' ? 'demo' : aoi.status === 'local' ? 'local' : 'placeholder'}>{aoi.statusLabel}</StatusBadge>
      </div>
      <p className="t-sm muted-2" style={{ margin: '8px 0 12px', lineHeight: 1.5 }}>{aoi.summary}</p>

      <div className="row gap-6" style={{ flexWrap: 'wrap', marginBottom: 14 }}>
        <DataChip label="Satellite" status={aoi.layers.sentinel.status} />
        <DataChip label="Land cover" status={aoi.layers.mapbiomas.status} />
        <DataChip label="Damage" status={aoi.layers.damage.status} />
        <DataChip label="Prediction" status={aoi.layers.prediction.status} />
      </div>

      {isDemo ? (
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          Open {aoi.name} case <Icon.arrowRight />
        </button>
      ) : (
        <button className="btn" style={{ width: '100%', justifyContent: 'center', color: 'var(--ink-3)', cursor: 'not-allowed' }} disabled>
          {aoi.status === 'local' ? 'Local data not uploaded' : 'Optional AOI · placeholder'}
        </button>
      )}
    </div>
  );
}

function DataChip({ label, status }) {
  const map = {
    available:    { color: 'var(--forest-2)', bg: 'var(--forest-soft)', border: '#c2deca', text: 'available' },
    not_uploaded: { color: 'var(--ink-3)',    bg: 'var(--bg-2)',         border: 'var(--line-2)', text: 'not uploaded' },
    local:        { color: '#3a6b85',         bg: 'var(--river-soft)',   border: '#c3d4dc', text: 'local' },
    pending:      { color: '#8b6712',         bg: 'var(--amber-soft)',   border: '#e8d6a8', text: 'pending' },
    placeholder:  { color: 'var(--ink-3)',    bg: 'var(--bg-2)',         border: 'var(--line-2)', text: 'placeholder' },
  };
  const s = map[status] || map.placeholder;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10.5, fontFamily: 'JetBrains Mono', letterSpacing: '0.04em',
      padding: '3px 8px', borderRadius: 10,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {label} <span style={{ opacity: 0.7 }}>·</span> {s.text}
    </span>
  );
}

function AvailabilityMatrix() {
  const cols = [
    { id: 'sentinel',   label: 'Satellite' },
    { id: 'mapbiomas',  label: 'Land cover' },
    { id: 'damage',     label: 'Damage mask' },
    { id: 'prediction', label: 'Prediction' },
    { id: 'uploaded',   label: 'Uploaded to prototype' },
  ];
  return (
    <div className="paper" style={{ padding: 22 }}>
      <div className="row between gap-12" style={{ marginBottom: 14 }}>
        <div className="col gap-2">
          <span className="eyebrow">Data availability matrix</span>
          <span className="t-sm muted-2">What is loaded into this prototype, per AOI.</span>
        </div>
        <span className="badge badge-info"><span className="dot"></span>Static demo · 1 AOI uploaded</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 500, color: 'var(--ink-3)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>AOI</th>
              {cols.map((c) => (
                <th key={c.id} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 500, color: 'var(--ink-3)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AOIS.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '14px 12px' }}>
                  <div className="row gap-10">
                    <Icon.pin style={{ color: a.status === 'demo' ? 'var(--red)' : a.status === 'local' ? 'var(--river)' : 'var(--ink-4)' }} />
                    <div className="col">
                      <span className="fw-600 nowrap">{a.name}</span>
                      <span className="muted t-xs nowrap">{a.region}</span>
                    </div>
                  </div>
                </td>
                {cols.map((c) => {
                  if (c.id === 'uploaded') {
                    return (
                      <td key={c.id} style={{ padding: '14px 12px' }}>
                        {a.uploaded
                          ? <StatusBadge status="available">Yes</StatusBadge>
                          : <span className="t-xs muted">No</span>}
                      </td>
                    );
                  }
                  const lyr = a.layers[c.id === 'sentinel' ? 'sentinel' : c.id];
                  return (
                    <td key={c.id} style={{ padding: '14px 12px' }}>
                      <DataChip label="" status={lyr.status} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Screen 2: Boca Manu case page ----------
const CASE_TABS = [
  { id: 'mapbiomas',  label: 'Land-cover map',   state: 'available' },
  { id: 'damage',     label: 'Damage mask',      state: 'available' },
  { id: 'satellite',  label: 'Satellite image',  state: 'available' },
  { id: 'prediction', label: 'Prediction',       state: 'pending' },
  { id: 'backtest',   label: 'Backtest',         state: 'pending' },
];

function CasePage({ aoi, onBack }) {
  const [tab, setTab] = React.useState('mapbiomas');
  const [mbYear, setMbYear] = React.useState(2018);
  const [dmgIdx, setDmgIdx] = React.useState(0);
  const [satYear, setSatYear] = React.useState(2018);

  const dmg = aoi.damageYears[dmgIdx];
  const periodLabel = tab === 'mapbiomas' ? `${mbYear}` :
                      tab === 'damage' ? `${dmg.from} → ${dmg.to}` :
                      tab === 'satellite' ? `${satYear}` :
                      null;

  return (
    <div>
      {/* Sub-header — simplified */}
      <div style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 56px 22px' }}>
          <div className="row gap-10" style={{ marginBottom: 16 }}>
            <button className="btn btn-sm btn-ghost" onClick={onBack}><Icon.arrowLeft />Back to selector</button>
            <span className="muted-2" style={{ opacity: 0.5 }}>/</span>
            <span className="t-sm muted nowrap">Pilot AOIs</span>
            <span className="muted-2" style={{ opacity: 0.5 }}>/</span>
            <span className="t-sm fw-500 nowrap">{aoi.name}</span>
          </div>
          <div className="row between gap-20" style={{ flexWrap: 'wrap' }}>
            <div className="col gap-10" style={{ minWidth: 0 }}>
              <div className="row gap-14" style={{ flexWrap: 'wrap', alignItems: 'baseline' }}>
                <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.1 }}>{aoi.name}</h1>
                <span className="muted-2 t-md nowrap">{aoi.region}</span>
              </div>
              <div className="row gap-12" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="badge badge-ok" style={{ height: 24 }}>
                  <span className="dot"></span>Evidence loaded · Prediction pending
                </span>
                <span className="t-sm muted nowrap">Static demo dataset</span>
                {periodLabel && (
                  <>
                    <span className="muted-2" style={{ opacity: 0.5 }}>·</span>
                    <span className="t-sm muted nowrap">Selected period <span className="mono ink" style={{ fontWeight: 500 }}>{periodLabel}</span></span>
                  </>
                )}
              </div>
            </div>
            <div className="row gap-8" style={{ flexShrink: 0 }}>
              <button className="btn"><Icon.download />Export evidence</button>
              <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Open report · pending</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 70/30 layout */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 56px 64px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 32, alignItems: 'start' }}>
        <div className="col gap-20" style={{ minWidth: 0 }}>
          <CaseTabs tab={tab} onTab={setTab} />
          <EvidenceArea tab={tab} aoi={aoi}
            mbYear={mbYear} setMbYear={setMbYear}
            dmgIdx={dmgIdx} setDmgIdx={setDmgIdx}
            satYear={satYear} setSatYear={setSatYear} />
        </div>
        <CaseBrief aoi={aoi} tab={tab} mbYear={mbYear} dmgIdx={dmgIdx} />
      </div>
    </div>
  );
}

function CaseTabs({ tab, onTab }) {
  const dotColor = (state) => state === 'available' ? 'var(--forest)' : state === 'pending' ? 'var(--amber)' : 'var(--ink-5)';
  return (
    <div className="tabs" style={{ overflowX: 'auto' }}>
      {CASE_TABS.map((t) => (
        <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => onTab(t.id)}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor(t.state), flexShrink: 0 }}></span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function EvidenceArea({ tab, aoi, mbYear, setMbYear, dmgIdx, setDmgIdx, satYear, setSatYear }) {
  if (tab === 'mapbiomas') {
    return (
      <div className="col gap-16">
        <ViewerHeader
          title="Land-cover map"
          subtitle={`MapBiomas / GEE classification · ${mbYear}`}
          control={
            <CompactPeriodPicker
              label="Year"
              value={mbYear}
              options={aoi.mapbiomasYears}
              onChange={setMbYear}
              accent="var(--forest)"
            />
          }
        />
        <ImageStage>
          <img src={aoi.paths.mapbiomas(mbYear)} alt={`MapBiomas land cover · ${mbYear}`}
               style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          <StageCorner position="br"><MapBiomasFloatingLegend /></StageCorner>
          <ScaleCorner />
        </ImageStage>
        <CaptionLine
          left="MapBiomas Amazonía Collection 6 · 30 m raster, resampled for display"
          right={aoi.paths.mapbiomas(mbYear)}
        />
      </div>
    );
  }
  if (tab === 'damage') {
    const t = aoi.damageYears[dmgIdx];
    const stats = aoi.damageStats?.[`${t.from}_${t.to}`];
    return (
      <div className="col gap-16">
        <ViewerHeader
          title="Damage mask"
          subtitle={`Observed / derived damage · ${t.from} → ${t.to}`}
          control={
            <CompactPeriodPicker
              label="Period"
              value={dmgIdx}
              options={aoi.damageYears.map((_, i) => i)}
              renderOption={(i) => `${aoi.damageYears[i].from} → ${aoi.damageYears[i].to}`}
              onChange={setDmgIdx}
              accent="var(--red)"
            />
          }
        />
        <ImageStage>
          <img src={aoi.paths.damage(t.from, t.to)} alt={`Damage mask · ${t.from} → ${t.to}`}
               style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          <StageCorner position="br"><DamageFloatingLegend /></StageCorner>
          <ScaleCorner />
        </ImageStage>
        {stats && <DamageStatsRow stats={stats} />}
        <CaptionLine
          left="Binary mask · 0 = stable / non-damage, 1 = damage. Derived from land-cover transitions."
          right={aoi.paths.damage(t.from, t.to)}
        />
      </div>
    );
  }
  if (tab === 'satellite') {
    return (
      <div className="col gap-16">
        <ViewerHeader
          title="Satellite image"
          subtitle={`Sentinel-2 composite · ${satYear}`}
          control={
            <CompactPeriodPicker
              label="Year"
              value={satYear}
              options={aoi.sentinelYears}
              onChange={setSatYear}
              accent="var(--river)"
            />
          }
        />
        <ImageStage>
          <img src={aoi.paths.sentinel(satYear)} alt={`Sentinel-2 composite · ${satYear}`}
               style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          <ScaleCorner />
        </ImageStage>
        <CaptionLine
          left="Sentinel-2 L2A · 10 m, percentile-stretched RGB composite"
          right={aoi.paths.sentinel(satYear)}
        />
      </div>
    );
  }
  if (tab === 'prediction') {
    return (
      <EmptyState
        tone="pending"
        title="Prediction pending"
        body="Model / backend not connected in this prototype. Once connected, this view will show the predicted damage probability raster for the next 6–12 months over the AOI."
      />
    );
  }
  if (tab === 'backtest') {
    return (
      <div className="col gap-16">
        <EmptyState
          tone="pending"
          title="Backtest pending"
          body="This will compare predicted damage against observed damage for the held-out year. The metrics below will populate when the model is connected."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {BACKTEST_METRICS.map((m) => (
            <div key={m.id} className="card-soft" style={{ padding: 14 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>{m.label}</div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 500, color: 'var(--ink-4)' }}>—</div>
              <div className="t-xs muted" style={{ marginTop: 4, lineHeight: 1.4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function CaptionLine({ left, right }) {
  return (
    <div className="row between gap-12" style={{ fontSize: 11.5, color: 'var(--ink-3)', padding: '0 2px' }}>
      <span>{left}</span>
      <span className="mono dim" style={{ fontSize: 10.5 }}>{right}</span>
    </div>
  );
}

function MapBiomasFloatingLegend() {
  return (
    <div className="col gap-8" style={{ minWidth: 180 }}>
      <div className="row between gap-10" style={{ alignItems: 'baseline' }}>
        <span className="eyebrow">Legend</span>
        <span className="t-xs muted" style={{ fontSize: 10 }}>MapBiomas C6</span>
      </div>
      <div className="col gap-4">
        {MAPBIOMAS_CLASSES.map((c) => (
          <div key={c.code} className="row gap-8" style={{ fontSize: 11 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: c.color, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }}></span>
            <span style={{ color: 'var(--ink-2)' }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DamageFloatingLegend() {
  return (
    <div className="col gap-8" style={{ minWidth: 180 }}>
      <span className="eyebrow">Legend</span>
      <div className="col gap-6" style={{ fontSize: 11.5 }}>
        <div className="row gap-8">
          <span style={{ width: 14, height: 12, borderRadius: 2, background: '#1f5c3c', border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }}></span>
          <span style={{ color: 'var(--ink-2)' }}>Stable / non-damage</span>
        </div>
        <div className="row gap-8">
          <span style={{ width: 14, height: 12, borderRadius: 2, background: '#e23d2c', border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }}></span>
          <span style={{ color: 'var(--ink-2)' }}>Damage</span>
        </div>
      </div>
    </div>
  );
}

function ScaleCorner() {
  return (
    <div style={{
      position: 'absolute', left: 14, bottom: 14,
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid var(--line)', borderRadius: 6,
      padding: '6px 10px',
      fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--ink-3)',
      letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ width: 40, height: 3, background: 'var(--ink-2)', borderRadius: 1 }}></span>
      <span>≈ 1 km</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span>EPSG:32719</span>
    </div>
  );
}

function DamageStatsRow({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      <StatTile label="Estimated hectares"     value={stats.hectares.toFixed(1)}        unit="ha" />
      <StatTile label="Damage pixels"          value={stats.pixels.toLocaleString()}    unit="" />
      <StatTile label="Share of valid pixels"  value={stats.percent.toFixed(2)}         unit="%" />
    </div>
  );
}

function StatTile({ label, value, unit }) {
  return (
    <div className="card-soft" style={{ padding: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <div className="row gap-6" style={{ alignItems: 'baseline' }}>
        <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{value}</span>
        {unit && <span className="mono t-sm muted">{unit}</span>}
      </div>
    </div>
  );
}

// ---------- Case Brief (right column) ----------
function CaseBrief({ aoi, tab, mbYear, dmgIdx }) {
  const dmg = aoi.damageYears[dmgIdx];
  const stats = aoi.damageStats?.[`${dmg.from}_${dmg.to}`];
  return (
    <aside style={{ position: 'sticky', top: 84, alignSelf: 'flex-start' }}>
      <div className="paper" style={{ padding: 24 }}>
        <div className="col gap-2" style={{ marginBottom: 18 }}>
          <span className="eyebrow">Case brief</span>
          <h2 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 600 }}>{aoi.name}</h2>
          <span className="muted t-xs">{aoi.region}</span>
        </div>

        <BriefSection title="Case summary">
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            {aoi.summary}
          </p>
        </BriefSection>

        <BriefSection title="Available evidence">
          <div className="col gap-6">
            <EvidenceLine state="available" items={['Land-cover map', 'Damage mask']} />
            <EvidenceLine state="pending"   items={['Prediction', 'Action report', 'Context layers']} />
          </div>
        </BriefSection>

        <BriefSection title="Key observation">
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Red pixels in the damage mask indicate areas marked as damage for the selected period. These should be interpreted as candidate forest disturbance or land-cover transition zones, depending on the mask definition.
          </p>
        </BriefSection>

        <BriefSection title={`Damage stats · ${dmg.from} → ${dmg.to}`}>
          {stats ? (
            <div className="col gap-4">
              <BriefStat k="Damage pixels"           v={stats.pixels.toLocaleString()} />
              <BriefStat k="Share of valid pixels"   v={`${stats.percent.toFixed(2)} %`} />
              <BriefStat k="Estimated hectares"      v={`${stats.hectares.toFixed(1)} ha`} />
            </div>
          ) : (
            <p className="muted" style={{ margin: 0 }}>Not computed.</p>
          )}
        </BriefSection>

        <BriefSection title="Recommended next step">
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Validate the damage mask against satellite evidence, generate aligned training tiles, and run the baseline prediction / backtest model.
          </p>
        </BriefSection>

        <BriefSection title="Report status" last>
          <div className="row gap-8" style={{ marginBottom: 6, alignItems: 'center' }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: 'var(--amber-soft)', color: 'var(--amber-2)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.clock /></span>
            <span className="fw-500" style={{ color: 'var(--ink)' }}>Prediction report pending</span>
          </div>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Once connected, this panel will summarize likely driver, affected area, jurisdiction, and recommended response.
          </p>
        </BriefSection>
      </div>

      <button className="t-xs muted row gap-6" style={{ marginTop: 14, padding: '6px 4px' }}>
        <Icon.info /> Dataset details
      </button>
    </aside>
  );
}

function BriefSection({ title, children, last }) {
  return (
    <div style={{
      marginBottom: last ? 0 : 16,
      paddingBottom: last ? 0 : 16,
      borderBottom: last ? 'none' : '1px solid var(--line)',
    }}>
      <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--ink-3)' }}>{title}</div>
      <div className="t-sm muted-2">{children}</div>
    </div>
  );
}

function BriefStat({ k, v }) {
  return (
    <div className="row between gap-10">
      <span className="muted">{k}</span>
      <span className="mono ink fw-500">{v}</span>
    </div>
  );
}

function EvidenceLine({ state, items }) {
  const cfg = state === 'available'
    ? { dot: 'var(--forest)', label: 'Available', tint: 'var(--ink)' }
    : { dot: 'var(--amber)',  label: 'Pending',   tint: 'var(--ink-2)' };
  return (
    <div className="row gap-10" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div className="row gap-6" style={{ flexShrink: 0, paddingTop: 4 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot }}></span>
        <span className="eyebrow" style={{ fontSize: 9.5 }}>{cfg.label}</span>
      </div>
      <span className="t-sm" style={{ color: cfg.tint, lineHeight: 1.5 }}>{items.join(' · ')}</span>
    </div>
  );
}

Object.assign(window, { TopBar, SelectorView, CasePage });
