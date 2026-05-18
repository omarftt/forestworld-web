// Vistas — SelectorView (pantalla 1) + CasePage (pantalla 2)

// ---------- Topbar ----------
function TopBar({ onView, view }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
      <div className="row" style={{ height: 64, padding: '0 28px', gap: 22, overflow: 'hidden' }}>
        <button className="row gap-10" style={{ flexShrink: 0 }} onClick={() => onView('selector')}>
          <Icon.logo />
          <div className="col" style={{ lineHeight: 1.15 }}>
            <span className="fw-600 nowrap" style={{ fontSize: 15 }}>ForestWorld</span>
            <span className="muted t-xs nowrap" style={{ fontSize: 11 }}>Inteligencia predictiva de riesgo forestal</span>
          </div>
        </button>
        <div className="vr" style={{ height: 28 }}></div>
        <nav className="row gap-2">
          {[
            { id: 'selector', label: 'Mapa' },
            { id: 'selector', label: 'Áreas' },
          ].map((n, i) => (
            <button key={i} className={`navlink ${(view === n.id || (i === 1 && view === 'selector')) ? 'active' : ''}`}
              onClick={() => onView(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="grow"></div>
      </div>
    </div>
  );
}

// ---------- Mapa localizador ----------
const MAP_IMG = 'web_assets/maps/peru_locator.png';
const MAP_AR  = 1514 / 1098;

function LocatorMap({ aois, selectedId, hoveredId, onSelect, onHover, onOpen }) {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: `${MAP_AR}`,
      borderRadius: 14, overflow: 'hidden',
      background: '#0f1c2a',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      <img src={MAP_IMG} alt="Mapa localizador de Perú"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }} />

      <div style={{
        position: 'absolute', left: 14, bottom: 14, zIndex: 4,
        padding: '6px 10px', borderRadius: 6,
        background: 'rgba(8, 18, 28, 0.55)', backdropFilter: 'blur(4px)',
        color: 'rgba(255,255,255,0.85)', fontSize: 10.5,
        fontFamily: 'JetBrains Mono', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>Áreas de interés activas</div>

      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 4,
        padding: '8px 10px', borderRadius: 7,
        background: 'rgba(8, 18, 28, 0.62)', backdropFilter: 'blur(6px)',
        color: '#fff', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Leyenda</div>
        <div className="col gap-4" style={{ fontSize: 10.5 }}>
          <div className="row gap-6"><LegendDotImg color="#34a85a" pulse /><span>Cargado</span></div>
        </div>
      </div>

      {aois.map((a) => {
        const m = (AOI_STATIC[a.id] || {}).marker;
        const pos = m || { left: '50%', top: '50%', labelOffset: 'right' };
        const tone = { dot: '#34a85a', ring: '#34a85a', label: 'Cargado' };
        const selected = selectedId === a.id;
        const hovered  = hoveredId === a.id;

        const tipPos = {
          right:          { left: 22, top: -4 },
          'bottom-right': { left: 22, top: 14 },
          'top-right':    { left: 22, top: -56 },
          left:           { right: 22, top: -4 },
        }[pos.labelOffset] || { left: 22, top: -4 };

        return (
          <button key={a.id}
            onClick={() => { onSelect(a.id); onOpen && onOpen(a.id); }}
            onMouseEnter={() => onHover(a.id)}
            onMouseLeave={() => onHover(null)}
            style={{
              position: 'absolute', left: pos.left, top: pos.top,
              transform: 'translate(-50%, -50%)',
              padding: 0, background: 'none', border: 0,
              cursor: 'pointer',
              zIndex: selected || hovered ? 20 : 10,
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', width: 18, height: 18 }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `1.5px solid ${tone.ring}`,
                animation: 'aoiPing 2.2s ease-out infinite',
                opacity: 0.7,
              }}></span>
              <span style={{
                position: 'relative', display: 'inline-block', width: 18, height: 18,
                borderRadius: '50%', background: tone.dot,
                border: '2px solid #fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.45)',
              }}></span>
              {selected && (
                <span style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid #fff', opacity: 0.9 }}></span>
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
                  <span className="eyebrow" style={{ fontSize: 9, marginRight: 6 }}>Tipo</span>
                  <span>{driverEs(a.driver)}</span>
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

// ---------- Pantalla 1: selector ----------
function SelectorView({ payload, onOpenAOI }) {
  const aois = payload?.aois || [];
  const [selectedId, setSelectedId] = React.useState(aois[0]?.id || null);
  const [hoveredId, setHoveredId] = React.useState(null);

  return (
    <div>
      <div style={{ padding: '40px 48px 28px', background: 'var(--paper)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div className="col gap-6" style={{ marginBottom: 4 }}>
            <span className="eyebrow">Áreas de interés · Amazonía peruana</span>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
              Selecciona un área para revisar el riesgo forestal
            </h1>
            <p className="muted-2" style={{ margin: '4px 0 0', maxWidth: 720, fontSize: 14, lineHeight: 1.6 }}>
              Datos satelitales, mapas de cobertura del suelo, máscaras de daño y casos priorizados para cuatro áreas en Madre de Dios y Ucayali.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 48px 56px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 460px', gap: 24, alignItems: 'start' }}>
          <div className="paper" style={{ padding: 12, position: 'relative', overflow: 'hidden' }}>
            <LocatorMap aois={aois} selectedId={selectedId} hoveredId={hoveredId} onSelect={setSelectedId} onHover={setHoveredId} onOpen={onOpenAOI} />
          </div>

          <div className="col gap-12">
            {aois.map((a) => (
              <AOICard key={a.id} aoi={a}
                selected={selectedId === a.id}
                onHover={setHoveredId}
                onSelect={() => setSelectedId(a.id)}
                onOpen={() => onOpenAOI(a.id)}
              />
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1320, margin: '32px auto 0' }}>
          <AvailabilityMatrix aois={aois} />
        </div>
      </div>
    </div>
  );
}

// ---------- Tarjeta de área (simplificada) ----------
function AOICard({ aoi, selected, onSelect, onOpen, onHover }) {
  const summary = (AOI_STATIC[aoi.id] || {}).summary || '';
  return (
    <div
      className={`paper ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => onHover && onHover(aoi.id)}
      onMouseLeave={() => onHover && onHover(null)}
      style={{
        padding: 18,
        cursor: 'pointer',
        borderColor: selected ? 'var(--forest)' : 'var(--line)',
        boxShadow: selected ? '0 0 0 3px var(--forest-soft)' : 'none',
        transition: 'box-shadow 0.12s, border-color 0.12s',
      }}
    >
      <div className="row between gap-12" style={{ marginBottom: 8 }}>
        <div className="row gap-10">
          <Icon.pin style={{ color: 'var(--red)', flexShrink: 0 }} />
          <div className="col" style={{ lineHeight: 1.2 }}>
            <span className="fw-600 nowrap" style={{ fontSize: 15 }}>{aoi.name}</span>
            <span className="muted t-xs nowrap">{aoi.region}</span>
          </div>
        </div>
        <StatusBadge status="loaded" />
      </div>

      {summary && <p className="t-sm muted-2" style={{ margin: '8px 0 14px', lineHeight: 1.5 }}>{summary}</p>}

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); onOpen(); }}>
        Abrir {aoi.name} <Icon.arrowRight />
      </button>
    </div>
  );
}

// ---------- Matriz de disponibilidad de datos ----------
function AvailabilityMatrix({ aois }) {
  const cols = [
    { id: 'satellite',  label: 'Satélite',          getter: (a) => formatYearRange(a.satellite) },
    { id: 'land_cover', label: 'Cobertura del suelo', getter: (a) => formatYearRange(a.land_cover) },
    { id: 'damage',     label: 'Daño',              getter: (a) => formatPairRange(a.damage) },
    { id: 'prediction', label: 'Predicción',        getter: (a) => formatPairRange(a.prediction) },
    { id: 'cases',      label: 'Casos priorizados', getter: (a) => formatCasesCount(countCases(a.ranking)) },
  ];

  return (
    <div className="paper" style={{ padding: 22 }}>
      <div className="col gap-2" style={{ marginBottom: 14 }}>
        <span className="eyebrow">Datos disponibles por área</span>
        <span className="t-sm muted-2">Cobertura por capa, por área de interés.</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 500, color: 'var(--ink-3)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Área</th>
              {cols.map((c) => (
                <th key={c.id} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 500, color: 'var(--ink-3)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aois.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '14px 12px' }}>
                  <div className="row gap-10">
                    <Icon.pin style={{ color: 'var(--red)' }} />
                    <div className="col">
                      <span className="fw-600 nowrap">{a.name}</span>
                      <span className="muted t-xs nowrap">{a.region}</span>
                    </div>
                  </div>
                </td>
                {cols.map((c) => {
                  const v = c.getter(a);
                  return (
                    <td key={c.id} style={{ padding: '12px 12px' }}>
                      {v ? <CellChip>{v}</CellChip> : <span className="dim mono" style={{ fontSize: 12 }}>—</span>}
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

function CellChip({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '5px 10px', borderRadius: 6,
      background: 'var(--paper-2)', border: '1px solid var(--line)',
      fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--ink-2)',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ---------- Pantalla 2: caso ----------
const CASE_TABS = [
  { id: 'mapbiomas',  label: 'Cobertura del suelo' },
  { id: 'damage',     label: 'Máscara de daño' },
  { id: 'satellite',  label: 'Imagen satelital' },
  { id: 'prediction', label: 'Predicción' },
];

function pathFor(aoiId) {
  return {
    satellite: (y)         => `web_assets/${aoiId}/sentinel_${y}.png`,
    mapbiomas: (y)         => `web_assets/${aoiId}/mapbiomas_${y}.png`,
    damage:    (pair)      => `web_assets/${aoiId}/damage_${pair}.png`,
  };
}

function CasePage({ aoi, onBack }) {
  const [tab, setTab] = React.useState('mapbiomas');
  const [mbYear, setMbYear]   = React.useState((aoi.land_cover || [])[0]);
  const [satYear, setSatYear] = React.useState((aoi.satellite || [])[0]);
  const [dmgIdx, setDmgIdx]   = React.useState(0);
  const [briefCollapsed, setBriefCollapsed] = React.useState(false);

  const dmgPair = (aoi.damage || [])[dmgIdx];
  const periodLabel =
      tab === 'mapbiomas'  ? `${mbYear}` :
      tab === 'damage'     ? (dmgPair ? dmgPair.replace('_', '→') : '—') :
      tab === 'satellite'  ? `${satYear}` :
      null;

  // El período activo para el panel "Resumen del caso".
  // Si el usuario está en la pestaña de daño, usamos ese par; si no, el último
  // par disponible (o el primero de ranking si solo hay uno).
  const briefPair = (
    tab === 'damage' && dmgPair ? dmgPair :
    (aoi.damage && aoi.damage[aoi.damage.length - 1]) ||
    Object.keys(aoi.ranking || {})[0] ||
    null
  );

  return (
    <div>
      <div style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 56px 22px' }}>
          <div className="row gap-10" style={{ marginBottom: 16 }}>
            <button className="btn btn-sm btn-ghost" onClick={onBack}><Icon.arrowLeft />Volver al selector</button>
            <span className="muted-2" style={{ opacity: 0.5 }}>/</span>
            <span className="t-sm muted nowrap">Áreas</span>
            <span className="muted-2" style={{ opacity: 0.5 }}>/</span>
            <span className="t-sm fw-500 nowrap">{aoi.name}</span>
          </div>
          <div className="row between gap-20" style={{ flexWrap: 'wrap' }}>
            <div className="col" style={{ minWidth: 0, gap: 6 }}>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.1 }}>{aoi.name}</h1>
              <span className="muted-2 t-md">{aoi.region}</span>
              {periodLabel && (
                <span className="t-sm muted nowrap" style={{ marginTop: 6 }}>
                  Período seleccionado <span className="mono ink" style={{ fontWeight: 500 }}>{periodLabel}</span>
                </span>
              )}
            </div>
            <div className="row gap-8" style={{ flexShrink: 0 }}>
              <button className="btn btn-primary"><Icon.download />Exportar Reporte PDF</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '32px 56px 64px',
        display: 'grid',
        gridTemplateColumns: briefCollapsed ? 'minmax(0, 1fr) 36px' : 'minmax(0, 1fr) 380px',
        gap: 32, alignItems: 'start',
        transition: 'grid-template-columns 0.18s ease',
      }}>
        <div className="col gap-20" style={{ minWidth: 0 }}>
          <CaseTabs tab={tab} onTab={setTab} />
          <EvidenceArea
            tab={tab} aoi={aoi}
            mbYear={mbYear} setMbYear={setMbYear}
            dmgIdx={dmgIdx} setDmgIdx={setDmgIdx}
            satYear={satYear} setSatYear={setSatYear}
          />
        </div>
        {briefCollapsed
          ? <CollapsedBriefRail onExpand={() => setBriefCollapsed(false)} />
          : <CaseBrief aoi={aoi} pair={briefPair} onCollapse={() => setBriefCollapsed(true)} />
        }
      </div>
    </div>
  );
}

function CaseTabs({ tab, onTab }) {
  return (
    <div className="tabs" style={{ overflowX: 'auto' }}>
      {CASE_TABS.map((t) => (
        <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => onTab(t.id)}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--forest)', flexShrink: 0 }}></span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ---------- Área de evidencia (las pestañas) ----------
function EvidenceArea({ tab, aoi, mbYear, setMbYear, dmgIdx, setDmgIdx, satYear, setSatYear }) {
  const paths = pathFor(aoi.id);

  if (tab === 'mapbiomas') {
    const years = aoi.land_cover || [];
    return (
      <div className="col gap-16">
        <ViewerHeader
          title="Cobertura del suelo"
          subtitle={`Clasificación MapBiomas / GEE · ${mbYear}`}
          control={
            <CompactPeriodPicker
              label="Año"
              value={mbYear}
              options={years}
              onChange={setMbYear}
              accent="var(--forest)"
            />
          }
        />
        <ImageStage>
          <img src={paths.mapbiomas(mbYear)} alt={`Cobertura del suelo · ${mbYear}`}
               style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          <StageCorner position="br"><MapBiomasFloatingLegend /></StageCorner>
          <ScaleCorner />
        </ImageStage>
        <CaptionLine left="MapBiomas Amazonía Colección 6 · 30 m, remuestreado para visualización" />
      </div>
    );
  }

  if (tab === 'damage') {
    const pairs = aoi.damage || [];
    const pair = pairs[dmgIdx];
    return (
      <div className="col gap-16">
        <ViewerHeader
          title="Máscara de daño"
          subtitle={pair ? `Daño observado · ${pair.replace('_', ' → ')}` : 'Daño observado'}
          control={
            <CompactPeriodPicker
              label="Período"
              value={dmgIdx}
              options={pairs.map((_, i) => i)}
              renderOption={(i) => pairs[i] ? pairs[i].replace('_', ' → ') : '—'}
              onChange={setDmgIdx}
              accent="var(--red)"
            />
          }
        />
        <ImageStage>
          {pair && (
            <img src={paths.damage(pair)} alt={`Máscara de daño · ${pair}`}
                 style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          )}
          <StageCorner position="br"><DamageFloatingLegend /></StageCorner>
          <ScaleCorner />
        </ImageStage>
        <CaptionLine left="Máscara binaria · 0 = estable, 1 = daño. Derivada de transiciones de cobertura." />
      </div>
    );
  }

  if (tab === 'satellite') {
    const years = aoi.satellite || [];
    return (
      <div className="col gap-16">
        <ViewerHeader
          title="Imagen satelital"
          subtitle={`Compuesto Sentinel-2 · ${satYear}`}
          control={
            <CompactPeriodPicker
              label="Año"
              value={satYear}
              options={years}
              onChange={setSatYear}
              accent="var(--river)"
            />
          }
        />
        <ImageStage>
          <img src={paths.satellite(satYear)} alt={`Compuesto Sentinel-2 · ${satYear}`}
               style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          <ScaleCorner />
        </ImageStage>
        <CaptionLine left="Sentinel-2 L2A · 10 m, compuesto RGB con estiramiento por percentil" />
      </div>
    );
  }

  if (tab === 'prediction') {
    return (
      <EmptyState
        tone="pending"
        title="Predicción próximamente"
        body="Cuando el modelo esté conectado, esta vista mostrará el ráster de probabilidad de daño para los próximos 6 a 12 meses sobre el área seleccionada."
      />
    );
  }

  return null;
}

function CaptionLine({ left, right }) {
  return (
    <div className="row between gap-12" style={{ fontSize: 11.5, color: 'var(--ink-3)', padding: '0 2px' }}>
      <span>{left}</span>
      {right && <span className="mono dim" style={{ fontSize: 10.5 }}>{right}</span>}
    </div>
  );
}

function MapBiomasFloatingLegend() {
  return (
    <div className="col gap-8" style={{ minWidth: 180 }}>
      <div className="row between gap-10" style={{ alignItems: 'baseline' }}>
        <span className="eyebrow">Leyenda</span>
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
    <div className="col gap-8" style={{ minWidth: 160 }}>
      <span className="eyebrow">Leyenda</span>
      <div className="col gap-4" style={{ fontSize: 11 }}>
        <div className="row gap-8"><span style={{ width: 12, height: 12, borderRadius: 2, background: '#1f4d2e' }}></span>Estable</div>
        <div className="row gap-8"><span style={{ width: 12, height: 12, borderRadius: 2, background: '#ff2a2a' }}></span>Daño</div>
        <div className="row gap-8"><span style={{ width: 12, height: 12, borderRadius: 2, background: '#fff', border: '1px solid var(--line-2)' }}></span>Sin dato</div>
      </div>
    </div>
  );
}

function ScaleCorner() {
  return (
    <div style={{ position: 'absolute', left: 14, bottom: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: 'rgba(255,255,255,0.92)', border: '1px solid var(--line)', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 10.5, color: 'var(--ink-3)' }}>
      <span>Escala</span>
      <span style={{ width: 36, height: 2, background: 'var(--ink-3)' }}></span>
      <span>~3 km</span>
    </div>
  );
}

// ============================================================
// Resumen del caso (panel derecho)
// ============================================================

function CollapsedBriefRail({ onExpand }) {
  return (
    <button onClick={onExpand}
      title="Mostrar resumen del caso"
      style={{
        position: 'sticky', top: 84, alignSelf: 'flex-start',
        height: 200, width: 36,
        background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', cursor: 'pointer',
        color: 'var(--ink-3)',
      }}>
      <Icon.chevronLeft />
      <span style={{
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontFamily: 'JetBrains Mono', fontSize: 10.5, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--ink-2)',
      }}>Resumen del caso</span>
      <span></span>
    </button>
  );
}

function CaseBrief({ aoi, pair, onCollapse }) {
  const cases = (aoi.ranking && pair && aoi.ranking[pair]) || [];
  const totalArea = totalHa(cases);
  const reportText = (aoi.report || '').trim();

  return (
    <aside style={{ position: 'sticky', top: 84, alignSelf: 'flex-start' }}>
      <div className="paper" style={{ padding: 22 }}>
        {/* Encabezado */}
        <div className="row between gap-10" style={{ alignItems: 'flex-start', marginBottom: 14 }}>
          <div className="col gap-2">
            <span className="eyebrow">Resumen del caso</span>
            <h2 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 600 }}>{aoi.name}</h2>
            <span className="muted t-xs">{aoi.region}</span>
          </div>
          <button onClick={onCollapse} title="Ocultar resumen"
            className="icon-btn" style={{ flexShrink: 0 }}>
            <Icon.chevronRight />
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <BriefQuickStats driver={aoi.driver} totalArea={totalArea} nCases={cases.length} pair={pair} />

        {/* Reporte (futuro: LLM). Si está vacío, usamos el template basado en ranking. */}
        {reportText
          ? <ReportProse text={reportText} />
          : <RankedCasesList cases={cases} />
        }
      </div>
    </aside>
  );
}

function BriefQuickStats({ driver, totalArea, nCases, pair }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 8, marginBottom: 18,
    }}>
      <StatCell k="Tipo de frontera" v={driverEs(driver)} />
      <StatCell k="Período" v={pair ? pair.replace('_', ' → ') : '—'} />
      <StatCell k="Hectáreas en riesgo" v={`${totalArea.toFixed(1)} ha`} />
      <StatCell k="Casos priorizados" v={`${nCases}`} />
    </div>
  );
}

function StatCell({ k, v }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: 'var(--paper-2)', border: '1px solid var(--line)',
      borderRadius: 8,
    }}>
      <div className="t-xs muted" style={{ marginBottom: 4 }}>{k}</div>
      <div className="fw-600" style={{ fontSize: 13, color: 'var(--ink)' }}>{v}</div>
    </div>
  );
}

function ReportProse({ text }) {
  const paragraphs = text.split(/\n\s*\n/);
  return (
    <div className="t-sm" style={{ color: 'var(--ink-2)', lineHeight: 1.65 }}>
      {paragraphs.map((p, i) => <p key={i} style={{ margin: i === 0 ? 0 : '10px 0 0' }}>{p}</p>)}
    </div>
  );
}

function RankedCasesList({ cases }) {
  if (!cases || cases.length === 0) {
    return (
      <div className="t-sm muted" style={{ padding: '14px 4px' }}>
        Sin casos priorizados para este período.
      </div>
    );
  }
  return (
    <div className="col gap-10">
      <span className="eyebrow" style={{ marginTop: 2 }}>Casos priorizados</span>
      {cases.map((c, idx) => <RankedCaseCard key={idx} c={c} />)}
    </div>
  );
}

function priorityTone(p) {
  if (p === 'Alta')  return { bg: 'var(--red-soft)',   color: 'var(--red-2)',   border: '#e9c4bd' };
  if (p === 'Media') return { bg: 'var(--amber-soft)', color: 'var(--amber-2)', border: '#e8d6a8' };
  return                    { bg: 'var(--bg-2)',       color: 'var(--ink-3)',   border: 'var(--line-2)' };
}

function RankedCaseCard({ c }) {
  const tone = priorityTone(c.priority);
  const lines = caseJustifications(c);
  const [open, setOpen] = React.useState(false);
  const headerStrap = c.priority === 'Alta' ? 'Por qué es prioridad alta:' :
                      c.priority === 'Media' ? 'Por qué es prioridad media:' :
                      'Observaciones:';

  const hasDetails = c.concesion_minera || c.concesion_titular || c.concesion_forestal || c.dist_carretera_m != null;

  return (
    <div className="paper" style={{ padding: 14, borderColor: 'var(--line)' }}>
      {/* Top: rank badge + priority pill + area */}
      <div className="row between gap-10" style={{ alignItems: 'center', marginBottom: 10 }}>
        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <span style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--ink)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 12,
          }}>{c.rank}</span>
          <span style={{
            padding: '3px 8px', borderRadius: 11,
            background: tone.bg, color: tone.color,
            border: `1px solid ${tone.border}`,
            fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>{c.priority}</span>
        </div>
        <span className="mono" style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>
          {(c.area_ha || 0).toFixed(1)} ha
        </span>
      </div>

      {/* Justification bullets */}
      <div className="t-xs" style={{ color: 'var(--ink-2)', marginBottom: 10 }}>
        <div className="muted" style={{ marginBottom: 4, fontSize: 11 }}>{headerStrap}</div>
        <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.55 }}>
          {lines.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </div>

      {/* Key facts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 10, rowGap: 4, fontSize: 12 }}>
        <span className="muted">Responsable</span>
        <span style={{ color: 'var(--ink)' }}>{c.stakeholder || '—'}</span>
        <span className="muted">Plazo sugerido</span>
        <span style={{ color: 'var(--ink)' }}>{formatSpanishDate(c.suggested_deadline)}</span>
        <span className="muted">Ubicación</span>
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{formatLatLon(c.centroid_lat, c.centroid_lon)}</span>
      </div>

      {/* Collapsible details */}
      {hasDetails && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
          <button onClick={() => setOpen(!open)}
            className="row gap-6"
            style={{
              fontSize: 11, color: 'var(--ink-3)',
              padding: 0, background: 'transparent', border: 0, cursor: 'pointer',
            }}>
            <Icon.info />
            <span>Detalles</span>
            <span style={{
              display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.12s',
            }}><Icon.chevronDown /></span>
          </button>
          {open && (
            <div className="t-xs" style={{ marginTop: 8, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {c.concesion_minera && (
                <div><span className="muted">Concesión minera:</span> {c.concesion_minera}
                  {c.concesion_titular && <> — {c.concesion_titular}</>}
                  {c.concesion_estado && <> ({c.concesion_estado.toLowerCase()})</>}
                </div>
              )}
              {c.concesion_forestal && (
                <div><span className="muted">Concesión forestal:</span> {c.concesion_forestal}</div>
              )}
              {c.dist_carretera_m != null && (
                <div><span className="muted">Distancia a carretera:</span> {Math.round(c.dist_carretera_m)} m</div>
              )}
              {c.dist_rio_m != null && c.priority !== 'Alta' && (
                <div><span className="muted">Distancia a río:</span> {Math.round(c.dist_rio_m)} m</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
