import { useState } from 'react'
import { uid, setState, useStore, type Klausur } from '../data/store'

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function Kalender() {
  const klausuren = useStore((s) => s.klausuren)
  const faecher = useStore((s) => s.faecher)
  const [monat, setMonat] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [tag, setTag] = useState(iso(new Date()))
  const [neu, setNeu] = useState(false)
  const [fachId, setFachId] = useState(faecher[0]?.id ?? '')
  const [art, setArt] = useState<Klausur['art']>('Klausur')

  const start = new Date(monat)
  const versatz = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - versatz)
  const tage = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d })
  const amTag = klausuren.filter((k) => k.datum === tag)
  const fach = (id: string) => faecher.find((f) => f.id === id)

  return (
    <div className="page">
      <header className="page-head"><h1>Kalender</h1></header>
      <section className="card">
        <div className="cal-head">
          <button className="icon-btn" onClick={() => setMonat(new Date(monat.getFullYear(), monat.getMonth() - 1, 1))}>‹</button>
          <strong>{monat.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</strong>
          <button className="icon-btn" onClick={() => setMonat(new Date(monat.getFullYear(), monat.getMonth() + 1, 1))}>›</button>
        </div>
        <div className="cal-grid">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((w) => <span key={w} className="cal-wd">{w}</span>)}
          {tage.map((d) => {
            const k = iso(d)
            const hat = klausuren.some((x) => x.datum === k)
            return (
              <button key={k} className={['cal-day', d.getMonth() !== monat.getMonth() ? 'out' : '', k === iso(new Date()) ? 'today' : '', k === tag ? 'sel' : ''].join(' ')} onClick={() => setTag(k)}>
                {d.getDate()}{hat && <i className="dot" />}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <div className="section-head"><h3>{new Date(tag).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</h3><button className="link" onClick={() => setNeu(!neu)}>＋ Termin</button></div>
        {neu && (
          <div className="card">
            <div className="two-col">
              <label className="field"><span>Fach</span><select className="input" value={fachId} onChange={(e) => setFachId(e.target.value)}>{faecher.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label>
              <label className="field"><span>Art</span><select className="input" value={art} onChange={(e) => setArt(e.target.value as Klausur['art'])}>{['Klausur', 'Test', 'Vokabeltest', 'Mündliche Prüfung'].map((a) => <option key={a}>{a}</option>)}</select></label>
            </div>
            <button className="btn primary block" onClick={() => { setState((s) => ({ ...s, klausuren: [...s.klausuren, { id: uid(), fachId, art, datum: tag, themen: [] }] })); setNeu(false) }}>Eintragen</button>
          </div>
        )}
        {amTag.length === 0 && !neu && <p className="empty">An diesem Tag steht nichts an.</p>}
        {amTag.map((k) => (
          <div key={k.id} className="row">
            <span className="row-ico" style={{ background: fach(k.fachId)?.farbe }}>{fach(k.fachId)?.emoji}</span>
            <span className="row-main"><strong>{k.art}: {fach(k.fachId)?.name}</strong><small>Lernplan folgt mit der KI-Anbindung</small></span>
            <button className="icon-btn" aria-label="Löschen" onClick={() => setState((s) => ({ ...s, klausuren: s.klausuren.filter((x) => x.id !== k.id) }))}>🗑</button>
          </div>
        ))}
      </section>
    </div>
  )
}
