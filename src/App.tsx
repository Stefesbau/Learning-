import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AddSheet } from './components/AddSheet'
import { BottomNav } from './components/BottomNav'
import { useStore } from './data/store'
import { Bibliothek, FachSeite } from './pages/Bibliothek'
import { EintragSeite } from './pages/Eintrag'
import { Kalender } from './pages/Kalender'
import { Lernen } from './pages/Lernen'
import { Onboarding } from './pages/Onboarding'
import { Profil } from './pages/Profil'
import { Start } from './pages/Start'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function useDesign() {
  const design = useStore((s) => s.profil?.design ?? 'auto')
  useEffect(() => {
    const dunkel = design === 'dunkel' || (design === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.dataset.theme = dunkel ? 'dark' : 'light'
  }, [design])
}

export default function App() {
  const profil = useStore((s) => s.profil)
  const [add, setAdd] = useState(false)
  useDesign()

  if (!profil) return <Onboarding />

  return (
    <HashRouter>
      <ScrollTop />
      <main className="app">
        <Routes>
          <Route path="/" element={<Start onAdd={() => setAdd(true)} />} />
          <Route path="/bibliothek" element={<Bibliothek onAdd={() => setAdd(true)} />} />
          <Route path="/fach/:id" element={<FachSeite />} />
          <Route path="/eintrag/:id" element={<EintragSeite />} />
          <Route path="/lernen" element={<Lernen />} />
          <Route path="/kalender" element={<Kalender />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </main>
      <BottomNav onAdd={() => setAdd(true)} />
      {add && <AddSheet onClose={() => setAdd(false)} />}
    </HashRouter>
  )
}
