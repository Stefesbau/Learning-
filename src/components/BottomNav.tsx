import { NavLink } from 'react-router-dom'

const Icon = ({ d }: { d: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  start: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  bib: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11',
  kal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  profil: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
}

export function BottomNav({ onAdd }: { onAdd: () => void }) {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end><Icon d={ICONS.start} /><span>Start</span></NavLink>
      <NavLink to="/bibliothek"><Icon d={ICONS.bib} /><span>Bibliothek</span></NavLink>
      <button className="add-btn" onClick={onAdd} aria-label="Material hinzufügen">
        <svg width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <NavLink to="/kalender"><Icon d={ICONS.kal} /><span>Kalender</span></NavLink>
      <NavLink to="/profil"><Icon d={ICONS.profil} /><span>Profil</span></NavLink>
    </nav>
  )
}
