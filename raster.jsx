// Evidence viewer — large image stage with title/subtitle above and floating legend.

function ViewerHeader({ title, subtitle, control }) {
  return (
    <div className="row between gap-16" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div className="col gap-2" style={{ minWidth: 0 }}>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: '-0.008em' }}>{title}</h2>
        <span className="t-sm muted-2">{subtitle}</span>
      </div>
      {control}
    </div>
  );
}

function ImageStage({ children, height = 560 }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      background: 'var(--paper-2)',
      border: '1px solid var(--line)',
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </div>
  );
}

function StageCorner({ children, position = 'br' }) {
  const pos = {
    br: { right: 14, bottom: 14 },
    bl: { left: 14, bottom: 14 },
    tr: { right: 14, top: 14 },
    tl: { left: 14, top: 14 },
  }[position];
  return (
    <div style={{
      position: 'absolute', ...pos,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(2px)',
      border: '1px solid var(--line)',
      borderRadius: 8,
      padding: 12,
      boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      maxWidth: 280,
    }}>
      {children}
    </div>
  );
}

// Compact selector with a single visible label and a small popover for other choices
function CompactPeriodPicker({ label, value, options, onChange, accent = 'var(--forest)', renderOption }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const display = renderOption ? renderOption(value) : String(value);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="row gap-10" onClick={() => setOpen((o) => !o)}
        style={{
          height: 36, padding: '0 6px 0 14px', borderRadius: 8,
          border: '1px solid var(--line-2)', background: 'var(--paper)',
          fontSize: 13, color: 'var(--ink)',
        }}>
        <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{label}</span>
        <span className="mono fw-600" style={{ fontSize: 14, color: accent }}>{display}</span>
        <span style={{
          display: 'inline-flex', width: 24, height: 24, marginLeft: 4,
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink-3)',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      {open && (
        <div className="paper" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 20,
          padding: 6, minWidth: 200,
          boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
        }}>
          {options.map((opt) => {
            const isCurrent = renderOption ? renderOption(opt) === display : opt === value;
            return (
              <button key={String(opt)} onClick={() => { onChange(opt); setOpen(false); }}
                className="row between gap-10"
                style={{
                  width: '100%',
                  padding: '8px 10px', borderRadius: 6, fontSize: 13,
                  background: isCurrent ? 'var(--bg-2)' : 'transparent',
                  color: isCurrent ? 'var(--ink)' : 'var(--ink-2)',
                  fontWeight: isCurrent ? 600 : 400,
                  textAlign: 'left',
                }}>
                <span className="mono">{renderOption ? renderOption(opt) : String(opt)}</span>
                {isCurrent && <span style={{ color: accent }}><Icon.check /></span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, body, tone = 'gray', meta }) {
  const accent = tone === 'pending' ? 'var(--amber-2)' : tone === 'local' ? 'var(--river)' : 'var(--ink-3)';
  const accentBg = tone === 'pending' ? 'var(--amber-soft)' : tone === 'local' ? 'var(--river-soft)' : 'var(--bg-2)';
  return (
    <div style={{
      height: 560,
      background: 'var(--paper-2)',
      border: '1px dashed var(--line-2)',
      borderRadius: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 40, textAlign: 'center', gap: 18,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: accentBg, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {tone === 'pending' ? <Icon.clock /> : <Icon.image />}
      </div>
      <div className="col gap-6" style={{ maxWidth: 460 }}>
        <div className="t-lg fw-600" style={{ color: 'var(--ink)' }}>{title}</div>
        <div className="t-sm muted-2" style={{ lineHeight: 1.6 }}>{body}</div>
      </div>
      {meta && <div className="t-xs muted mono">{meta}</div>}
    </div>
  );
}

Object.assign(window, { ViewerHeader, ImageStage, StageCorner, CompactPeriodPicker, EmptyState });
