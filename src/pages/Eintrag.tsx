import { Link, useNavigate, useParams } from 'react-router-dom'
import { LumiSays } from '../components/Lumi'
import { eintragLoeschen, useStore } from '../data/store'

export function EintragSeite() {
  const { id } = useParams()
  const nav = useNavigate()
  const e = useStore((s) => s.eintraege.find((x) => x.id === id))
  const fach = useStore((s) => s.faecher.find((f) => f.id === e?.fachId))
  const thema = useStore((s) => s.themen.find((t) => t.id === e?.themenbereichId))
  const helfer = useStore((s) => s.profil?.helfer ?? 'Lumi')
  if (!e) return <div className="page"><p>Eintrag nicht gefunden.</p></div>

  return (
    <div className="page">
      <Link to={`/fach/${e.fachId}`} className="back">‹ {fach?.name} › {thema?.name}</Link>
      <header className="page-head">
        <div><p className="eyebrow">{e.art === 'foto' ? 'Foto' : e.art === 'link' ? 'Link' : 'Text'}</p><h1>{e.titel}</h1></div>
      </header>

      <section className="card paper">
        <p className="muted small">Abschrift · {new Date(e.erstellt).toLocaleString('de-DE')}</p>
        {e.art === 'foto' && (e.inhalt.startsWith('data:image') ? <img src={e.inhalt} alt={e.titel} className="photo" /> : <a href={e.inhalt} download={e.titel}>📄 Datei öffnen</a>)}
        {e.art === 'link' && <a href={e.inhalt} target="_blank" rel="noreferrer">{e.inhalt}</a>}
        {e.art === 'text' && <div className="abschrift">{e.inhalt.split('\n').map((z, i) => <p key={i}>{z}</p>)}</div>}
        {e.notiz && <p className="note">📌 {e.notiz}</p>}
      </section>

      <LumiSays mood="happy">Ich hab das gelesen. Was willst du damit lernen?</LumiSays>
      <div className="action-list">
        {['📝 Lernzettel erstellen', '🗂️ Karteikarten erstellen', '✅ Quiz erstellen'].map((t) => (
          <button key={t} className="action soon" disabled>{t}<small>kommt mit der KI-Anbindung</small></button>
        ))}
      </div>

      <section className="card">
        <h3>Frag {helfer} zu diesem Material</h3>
        <p className="muted">Frag mich alles dazu. Ich erkläre dir jede Zeile.</p>
        <div className="pill-row">
          {['Erklär mir das Schritt für Schritt', 'Fass das zusammen', 'Frag mich dazu ab'].map((t) => <button key={t} className="pill" disabled>{t}</button>)}
        </div>
      </section>

      <button className="btn danger ghost" onClick={() => { if (confirm('Diesen Eintrag löschen?')) { eintragLoeschen(e.id); nav('/bibliothek') } }}>Eintrag löschen</button>
    </div>
  )
}
