// App router — un único fetch de /aois.json al montar.

function App() {
  const [payload, setPayload] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [view, setView] = React.useState('selector'); // selector | case
  const [aoiId, setAoiId] = React.useState(null);

  React.useEffect(() => {
    fetchAOIs()
      .then((p) => {
        setPayload(p);
        if (p?.aois?.length && !aoiId) setAoiId(p.aois[0].id);
      })
      .catch((e) => setError(e.message || String(e)));
  }, []);

  const aoi = React.useMemo(() => {
    if (!payload || !aoiId) return null;
    return payload.aois.find((a) => a.id === aoiId) || payload.aois[0];
  }, [payload, aoiId]);

  const openAOI = (id) => {
    if (!payload?.aois?.find((a) => a.id === id)) return;
    setAoiId(id);
    setView('case');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar view={view} onView={(v) => { if (v === 'selector') setView('selector'); }} />
      {!payload && !error && <FullScreenState>Cargando datos…</FullScreenState>}
      {error && (
        <FullScreenState tone="error">
          No se pudieron cargar los datos. Revisa la conexión con el backend.
          <div className="t-xs muted mono" style={{ marginTop: 10 }}>{error}</div>
        </FullScreenState>
      )}
      {payload && view === 'selector' && <SelectorView payload={payload} onOpenAOI={openAOI} />}
      {payload && view === 'case' && aoi && (
        <CasePage aoi={aoi} onBack={() => setView('selector')} />
      )}
    </div>
  );
}

function FullScreenState({ children, tone }) {
  const color = tone === 'error' ? 'var(--red-2)' : 'var(--ink-3)';
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div className="paper" style={{
        padding: '32px 40px', maxWidth: 520, textAlign: 'center',
        color, lineHeight: 1.6,
      }}>{children}</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
