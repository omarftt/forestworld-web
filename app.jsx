// App router

function App() {
  const [view, setView] = React.useState('selector'); // selector | case
  const [aoiId, setAoiId] = React.useState('boca_manu');
  const aoi = AOIS.find((a) => a.id === aoiId) || AOIS[0];

  const openAOI = (id) => {
    const a = AOIS.find((x) => x.id === id);
    if (!a) return;
    if (a.status !== 'demo') return; // only Boca Manu is openable
    setAoiId(id);
    setView('case');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar view={view} onView={(v) => { if (v === 'selector') setView('selector'); }} />
      {view === 'selector' && <SelectorView onOpenAOI={openAOI} />}
      {view === 'case' && <CasePage aoi={aoi} onBack={() => setView('selector')} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
