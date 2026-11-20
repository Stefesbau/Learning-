import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fachAnlegen, useStore } from '../data/store'

export function Bibliothek({ onAdd }: { onAdd: () => void }) {
  const faecher = useStore((s) => s.faecher)
  const themen = useStore((s) => s.themen)
  const eintraege = useStore((s) => s.eintraege)
  const [q, setQ] = useState('')
  const treffer = q.trim().length > 1
    ? eintraege.filter((e) => (e.titel + ' ' + (e.art === 'text' ? e.inhalt : '')).toLowerCase().includes(q.toLowerCase()))
    : []

  return (
    <div className="page">
      <header className="page-head">
        <div><h1>Bibliothek</h1><p className="muted">{faecher.length} Fächer · {eintraege.length} Einträge</p></div>
        <button className="btn primary small" onClick={onAdd}>＋ Neu</button>
      </header>
      <input className="input search" placeholder="🔍 In allem Material suchen" value={q} onChange={(e) => setQ(e.target.value)} />

      {q.trim().length > 1 ? (
        <section>
          {treffer.length === 0 && <p className="empty">Nichts gefunden.</p>}
          {treffer.map((e) => (
            <Link key={e.id} to={`/eintrag/${e.id}`} className="row"><span className="row-main"><strong>{e.titel}</strong><small>{faecher.find((f) => f.id === e.fachId)?.name}</small></span><span className="row-chev">›</span></Link>
          ))}
        </section>
      ) : (
        <div className="fach-grid">
          {faecher.map((f) => {
            const n = eintraege.filter((e) => e.fachId === f.id).length
            const t = themen.filter((x) => x.fachId === f.id).length
            return (
              <Link key={f.id} to={`/fach/${f.id}`} className="fach-card" style={{ ['--fach' as string]: f.farbe }}>
                <span className="fach-emoji">{f.emoji}</span>
                <strong>{f.name}</strong>
                <small>{t} Themenbereiche · {n} Einträge</small>
              </Link>
            )
          })}
          <button className="fach-card add" onClick={() => { const n = prompt('Name des neuen Fachs?'); if (n?.trim()) fachAnlegen(n.trim()) }}>
            <span className="fach-emoji">＋</span><strong>Fach hinzufügen</strong>
          </button>
        </div>
      )}
    </div>
  )
}

export function FachSeite() {
  const { id } = useParams()
  const fach = useStore((s) => s.faecher.find((f) => f.id === id))
  const themen = useStore((s) => s.themen.filter((t) => t.fachId === id))
  const eintraege = useStore((s) => s.eintraege.filter((e) => e.fachId === id))
  if (!fach) return <div className="page"><p>Fach nicht gefunden.</p></div>
  return (
    <div className="page">
      <Link to="/bibliothek" className="back">‹ Bibliothek</Link>
      <header className="page-head"><h1>{fach.emoji} {fach.name}</h1></header>
      {themen.length === 0 && <p className="empty">Noch kein Material in {fach.name}.</p>}
      {themen.map((t) => (
        <section key={t.id}>
          <h3>{t.name}</h3>
          {eintraege.filter((e) => e.themenbereichId === t.id).map((e) => (
            <Link key={e.id} to={`/eintrag/${e.id}`} className="row">
              <span className="row-ico" style={{ background: fach.farbe }}>{e.art === 'foto' ? '📷' : e.art === 'link' ? '🔗' : '📝'}</span>
              <span className="row-main"><strong>{e.titel}</strong><small>{new Date(e.erstellt).toLocaleDateString('de-DE')}</small></span>
              <span className="row-chev">›</span>
            </Link>
          ))}
        </section>
      ))}
    </div>
  )
}
