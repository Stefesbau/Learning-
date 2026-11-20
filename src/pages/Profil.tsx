import { Lumi } from '../components/Lumi'
import { level, profilSpeichern, serie, useStore } from '../data/store'

export function Profil() {
  const p = useStore((s) => s.profil)!
  const l = level(p.xp)
  return (
    <div className="page">
      <header className="page-head"><h1>Profil</h1></header>
      <section className="card profile">
        <div className="avatar">{p.name.slice(0, 1).toUpperCase()}</div>
        <div><h2>{p.name}</h2><p className="muted">Klasse {p.klasse}</p></div>
      </section>
      <div className="stats">
        <div><strong>{serie(p.lerntage)}</strong><small>Tage · Serie</small></div>
        <div><strong>{p.xp}</strong><small>XP</small></div>
        <div><strong>{l.lvl}</strong><small>Level</small></div>
      </div>
      <div className="bar"><div style={{ width: `${l.prozent}%` }} /></div>
      <p className="muted small">Noch {l.rest} XP bis Level {l.lvl + 1}</p>

      <h3 className="label">Lernen</h3>
      <section className="card">
        <p><strong>Tägliches Ziel</strong></p>
        <div className="segmented">
          {([15, 30, 45] as const).map((m) => <button key={m} className={p.tagesziel === m ? 'on' : ''} onClick={() => profilSpeichern({ tagesziel: m })}>{m} Min</button>)}
        </div>
      </section>

      <h3 className="label">Deine Helferin</h3>
      <section className="card helper">
        <Lumi size={56} />
        <label className="field grow"><span>Name</span><input className="input" value={p.helfer} onChange={(e) => profilSpeichern({ helfer: e.target.value || 'Lumi' })} /></label>
      </section>

      <h3 className="label">Darstellung</h3>
      <section className="card">
        <div className="segmented">
          {(['hell', 'dunkel', 'auto'] as const).map((d) => <button key={d} className={p.design === d ? 'on' : ''} onClick={() => profilSpeichern({ design: d })}>{d[0].toUpperCase() + d.slice(1)}</button>)}
        </div>
      </section>

      <h3 className="label">Konto</h3>
      <section className="card">
        <label className="field"><span>Name</span><input className="input" value={p.name} onChange={(e) => profilSpeichern({ name: e.target.value })} /></label>
        <label className="field"><span>Klasse</span><input className="input" value={p.klasse} onChange={(e) => profilSpeichern({ klasse: e.target.value })} /></label>
        <p className="muted small">Deine Daten liegen im Moment nur auf diesem Gerät. Bald werden sie über ein Konto auf allen Geräten gleich sein.</p>
      </section>
      <p className="muted small center">Nayla · Version 0.1</p>
    </div>
  )
}
