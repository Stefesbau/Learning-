import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { eintragAnlegen, themaFinden, useStore } from '../data/store'
import { Lumi } from './Lumi'

type Tab = 'datei' | 'link' | 'text'

/** „Material hinzufügen“ – Foto/Datei, Link oder Text. */
export function AddSheet({ onClose }: { onClose: () => void }) {
  const faecher = useStore((s) => s.faecher)
  const helfer = useStore((s) => s.profil?.helfer ?? 'Lumi')
  const nav = useNavigate()
  const [tab, setTab] = useState<Tab>('datei')
  const [ziel, setZiel] = useState<'auto' | 'selbst'>('selbst')
  const [fachId, setFachId] = useState(faecher[0]?.id ?? '')
  const [thema, setThema] = useState('')
  const [titel, setTitel] = useState('')
  const [text, setText] = useState('')
  const [link, setLink] = useState('')
  const [notiz, setNotiz] = useState('')
  const [datei, setDatei] = useState<{ name: string; data: string } | null>(null)

  const fertig =
    (tab === 'text' && text.trim().length > 20) ||
    (tab === 'link' && link.trim().startsWith('http')) ||
    (tab === 'datei' && datei !== null)

  function dateiWaehlen(f: File | undefined) {
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      const data = String(r.result)
      if (!f.type.startsWith('image/')) return setDatei({ name: f.name, data })
      // Fotos verkleinern, damit der Speicher nicht vollläuft
      const img = new Image()
      img.onload = () => {
        const max = 1400
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * k)
        c.height = Math.round(img.height * k)
        c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height)
        setDatei({ name: f.name, data: c.toDataURL('image/jpeg', 0.72) })
      }
      img.src = data
    }
    r.readAsDataURL(f)
  }

  function speichern() {
    // Automatisches Einsortieren macht später die KI. Bis dahin: gewähltes Fach.
    const tId = themaFinden(fachId, thema || 'Allgemein')
    const inhalt = tab === 'text' ? text : tab === 'link' ? link : (datei?.data ?? '')
    const id = eintragAnlegen({
      fachId,
      themenbereichId: tId,
      titel: titel.trim() || (tab === 'datei' ? (datei?.name ?? 'Foto') : tab === 'link' ? 'Link' : text.trim().split('\n')[0].slice(0, 60)),
      art: tab === 'datei' ? 'foto' : tab,
      inhalt,
      notiz: notiz.trim() || undefined,
    })
    onClose()
    nav(`/eintrag/${id}`)
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Material hinzufügen">
        <div className="sheet-head">
          <Lumi size={40} />
          <div>
            <h2>Material hinzufügen</h2>
            <p className="muted">{helfer} liest es und legt es in deine Bibliothek.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen">✕</button>
        </div>

        <div className="segmented">
          {(['datei', 'link', 'text'] as Tab[]).map((t) => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
              {t === 'datei' ? '📷 Foto/Datei' : t === 'link' ? '🔗 Link' : '✏️ Text'}
            </button>
          ))}
        </div>

        {tab === 'datei' && (
          <label className="dropzone">
            <input type="file" accept="image/*,application/pdf" capture="environment" hidden onChange={(e) => dateiWaehlen(e.target.files?.[0])} />
            {datei ? (
              datei.data.startsWith('data:image') ? <img src={datei.data} alt="" className="preview" /> : <strong>📄 {datei.name}</strong>
            ) : (
              <>
                <div className="drop-icon">📷</div>
                <strong>Foto machen oder Datei wählen</strong>
                <span className="muted">Tafelbild, Arbeitsblatt, Heftseite oder PDF</span>
              </>
            )}
          </label>
        )}
        {tab === 'link' && (
          <input className="input" placeholder="https://…" value={link} onChange={(e) => setLink(e.target.value)} />
        )}
        {tab === 'text' && (
          <>
            <textarea className="input" rows={7} placeholder="Zum Beispiel ein Abschnitt aus dem Schulbuch oder deine getippte Mitschrift." value={text} onChange={(e) => setText(e.target.value)} />
            <p className="hint">Mindestens ein paar Sätze, damit {helfer} etwas damit anfangen kann.</p>
          </>
        )}

        <h3 className="label">Wohin damit?</h3>
        <div className="choice-row">
          <button className={ziel === 'auto' ? 'choice on' : 'choice'} onClick={() => setZiel('auto')}>
            <strong>{helfer} sortiert ein</strong><span>Fach und Thema automatisch</span>
          </button>
          <button className={ziel === 'selbst' ? 'choice on' : 'choice'} onClick={() => setZiel('selbst')}>
            <strong>Selbst wählen</strong><span>Du legst das Ziel fest</span>
          </button>
        </div>
        {ziel === 'auto' && <p className="hint">Automatisches Einsortieren kommt mit der KI-Anbindung. Bis dahin bitte Fach wählen:</p>}
        <div className="two-col">
          <label className="field">
            <span>Fach</span>
            <select className="input" value={fachId} onChange={(e) => setFachId(e.target.value)}>
              {faecher.map((f) => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Themenbereich</span>
            <input className="input" placeholder="z. B. Fotosynthese" value={thema} onChange={(e) => setThema(e.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Titel (optional)</span>
          <input className="input" value={titel} onChange={(e) => setTitel(e.target.value)} />
        </label>
        <label className="field">
          <span>Notiz für {helfer} (optional)</span>
          <input className="input" placeholder="z. B. Kommt in der Klausur am Freitag dran" value={notiz} onChange={(e) => setNotiz(e.target.value)} />
        </label>

        <button className="btn primary block" disabled={!fertig} onClick={speichern}>Hochladen</button>
      </div>
    </div>
  )
}
