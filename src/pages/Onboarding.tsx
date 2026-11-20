import { useState } from 'react'
import { Lumi } from '../components/Lumi'
import { profilSpeichern } from '../data/store'

const SORGEN = [
  { e: '😵‍💫', t: 'Im Unterricht komme ich nicht mit, zuhause erst recht nicht.', a: 'Kenn ich. Dann erklär ich’s dir so oft, bis es klickt.', v: 'Ich erkläre dir denselben Stoff nochmal, so, dass du ihn am besten verstehst. So oft du willst.' },
  { e: '🌙', t: 'Ich lerne alles auf einmal, die Nacht vor der Klausur.', a: 'Nachtschichten? Nicht mit mir.', v: 'Ich verteile den Stoff über die Wochen davor und erinnere dich. Keine Nachtschichten mehr.' },
  { e: '🫠', t: 'Ich lerne was, und zwei Wochen später ist es wieder weg.', a: 'Das passiert allen. Ich hol’s zurück, bevor es weg ist.', v: 'Ich hole jedes Thema im richtigen Abstand zurück, damit es bleibt.' },
]

export function Onboarding() {
  const [schritt, setSchritt] = useState(0)
  const [name, setName] = useState('Nayla')
  const [klasse, setKlasse] = useState('9')
  const [sorge, setSorge] = useState<number | null>(null)

  return (
    <div className="onboarding">
      <div className="progress"><div style={{ width: `${((schritt + 1) / 3) * 100}%` }} /></div>

      {schritt === 0 && (
        <div className="ob-step center">
          <Lumi size={120} />
          <h1>Hi, ich bin Lumi!</h1>
          <p className="lead">Ich bringe Licht in deinen Stoff. Du fotografierst, ich mache daraus Lernzettel, Karteikarten, Quiz und einen Plan bis zur Klausur.</p>
          <button className="btn primary block" onClick={() => setSchritt(1)}>Loslegen</button>
        </div>
      )}

      {schritt === 1 && (
        <div className="ob-step">
          <h1>Wie heißt du?</h1>
          <label className="field"><span>Name</span><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="field"><span>Klasse</span>
            <select className="input" value={klasse} onChange={(e) => setKlasse(e.target.value)}>
              {['5', '6', '7', '8', '9', '10', '11', '12', '13'].map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <button className="btn primary block" disabled={!name.trim()} onClick={() => setSchritt(2)}>Weiter</button>
        </div>
      )}

      {schritt === 2 && (
        <div className="ob-step">
          <div className="lumi-says">
            <Lumi size={44} mood={sorge === null ? 'neutral' : 'happy'} />
            <div className="bubble">{sorge === null ? 'Sag ehrlich, was gerade nervt. Ich richte mich danach.' : SORGEN[sorge].a}</div>
          </div>
          <p className="eyebrow">Bevor wir loslegen</p>
          <h1>Was nervt dich gerade am meisten?</h1>
          {SORGEN.map((s, i) => (
            <button key={i} className={sorge === i ? 'option on' : 'option'} onClick={() => setSorge(i)}>
              <span className="opt-emoji">{s.e}</span>{s.t}
            </button>
          ))}
          <div className="promise">
            <p className="eyebrow">Das Versprechen</p>
            <strong>{sorge === null ? 'Wähl eine Sache, ich sag dir, was ich konkret dagegen tue.' : SORGEN[sorge].v}</strong>
          </div>
          <button className="btn primary block" disabled={sorge === null} onClick={() => profilSpeichern({ name: name.trim(), klasse })}>
            Los geht’s
          </button>
        </div>
      )}
    </div>
  )
}
