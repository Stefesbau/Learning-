import { Link } from 'react-router-dom'
import { Lumi } from '../components/Lumi'
import { level, serie, useStore } from '../data/store'

const tageszeit = () => {
  const h = new Date().getHours()
  return h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend'
}

export function Start({ onAdd }: { onAdd: () => void }) {
  const profil = useStore((s) => s.profil)!
  const eintraege = useStore((s) => s.eintraege)
  const faecher = useStore((s) => s.faecher)
  const klausuren = useStore((s) => s.klausuren)
  const fach = (id: string) => faecher.find((f) => f.id === id)
  const datum = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
  const naechste = [...klausuren].filter((k) => k.datum >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.datum.localeCompare(b.datum))

  return (
    <div className="page">
      <header className="start-head">
        <div>
          <p className="muted">{datum}</p>
          <h1>{tageszeit()}, {profil.name}</h1>
        </div>
        <div className="chips">
          <span className="chip" title="Tage in Folge">🔥 {serie(profil.lerntage)}</span>
          <span className="chip" title="Level">⭐ {level(profil.xp).lvl}</span>
        </div>
      </header>

      <section className="card hero">
        <p className="eyebrow">Dein Plan heute</p>
        <div className="hero-row">
          <Lumi size={64} />
          <div>
            {eintraege.length === 0 ? (
              <>
                <h2>Lade dein erstes Material hoch</h2>
                <p className="muted">Ein Foto vom Tafelbild oder ein Arbeitsblatt reicht. {profil.helfer} macht daraus Stoff zum Lernen.</p>
              </>
            ) : (
              <>
                <h2>Schön, dass du da bist!</h2>
                <p className="muted">Lege eine Klausur an, dann plant {profil.helfer} jeden Tag eine kleine Einheit für dich.</p>
              </>
            )}
          </div>
        </div>
        {eintraege.length === 0
          ? <button className="btn primary block" onClick={onAdd}>Material hinzufügen →</button>
          : <Link className="btn primary block" to="/lernen">Zum Lernen →</Link>}
      </section>

      <div className="tiles">
        <Link to="/lernen" className="tile"><span className="tile-ico">📝</span>Lernzettel</Link>
        <Link to="/lernen" className="tile"><span className="tile-ico">🗂️</span>Karteikarten</Link>
        <Link to="/lernen" className="tile"><span className="tile-ico">✅</span>Quiz</Link>
        <Link to="/lernen" className="tile"><span className="tile-ico">📅</span>Klausurplan</Link>
        <Link to="/lernen" className="tile wide accent"><Lumi size={36} glow={false} /><span><strong>Frag {profil.helfer}</strong><small>Erklären, abfragen, üben</small></span></Link>
      </div>

      <section>
        <div className="section-head"><h3>Zuletzt hinzugefügt</h3><Link to="/bibliothek">Alle</Link></div>
        {eintraege.length === 0 && <p className="empty">Noch nichts da. Tipp auf ＋ unten.</p>}
        {eintraege.slice(0, 4).map((e) => (
          <Link key={e.id} to={`/eintrag/${e.id}`} className="row">
            <span className="row-ico" style={{ background: fach(e.fachId)?.farbe }}>{fach(e.fachId)?.emoji}</span>
            <span className="row-main"><strong>{e.titel}</strong><small>{fach(e.fachId)?.name} · {new Date(e.erstellt).toLocaleDateString('de-DE')}</small></span>
            <span className="row-chev">›</span>
          </Link>
        ))}
      </section>

      <section>
        <div className="section-head"><h3>Bald fällig</h3><Link to="/kalender">Kalender</Link></div>
        {naechste.length === 0 && <p className="empty">Nichts fällig in den nächsten Wochen.</p>}
        {naechste.slice(0, 3).map((k) => (
          <div key={k.id} className="row">
            <span className="row-ico" style={{ background: fach(k.fachId)?.farbe }}>{fach(k.fachId)?.emoji}</span>
            <span className="row-main"><strong>{k.art}: {fach(k.fachId)?.name}</strong><small>{new Date(k.datum).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' })}</small></span>
          </div>
        ))}
      </section>
    </div>
  )
}
