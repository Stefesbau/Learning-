import { LumiSays } from '../components/Lumi'
import { useStore } from '../data/store'

const BEREICHE = [
  { ico: '📅', t: 'Lernplan', s: 'Klausur eintragen, Lumi plant jeden Tag' },
  { ico: '📝', t: 'Lernzettel', s: 'Verstehen, Wiederholen, Klausur' },
  { ico: '🗂️', t: 'Karteikarten', s: 'Kurze Runden, Wiederholung im Abstand' },
  { ico: '✅', t: 'Quiz', s: '6 Fragen mit Erklärungen' },
  { ico: '📋', t: 'Probeklausur', s: 'Generalprobe mit Uhr und Korrektur' },
  { ico: '🎮', t: 'Schnelle Spiele', s: 'Richtig/Falsch, Verbinden, Memory' },
]

export function Lernen() {
  const helfer = useStore((s) => s.profil?.helfer ?? 'Lumi')
  return (
    <div className="page">
      <header className="page-head"><h1>Lernen</h1></header>
      <section className="card hero dark">
        <p className="eyebrow">Noch nichts geplant</p>
        <h2>Wann ist deine nächste Klausur?</h2>
        <p>Trag sie ein, ich baue dir daraus einen Lernplan für jeden Tag.</p>
        <button className="btn primary block" disabled>Lernplan erstellen · bald</button>
      </section>
      <LumiSays mood="think">Hier entsteht gerade alles, was ich aus deinem Material baue. Sobald die KI angeschlossen ist, geht’s richtig los!</LumiSays>
      <div className="tiles">
        {BEREICHE.map((b) => (
          <div key={b.t} className="tile soon"><span className="tile-ico">{b.ico}</span>{b.t}<small>{b.s}</small></div>
        ))}
        <div className="tile soon wide"><span className="tile-ico">💬</span>Frag {helfer}<small>Erklären, zusammenfassen, abfragen</small></div>
      </div>
    </div>
  )
}
