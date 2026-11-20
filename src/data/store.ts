import { useSyncExternalStore } from 'react'

/*
 * Datenhaltung – vorerst lokal im Browser (localStorage).
 * Wird in einem späteren Schritt durch Supabase ersetzt, damit
 * die Daten auf iPhone und PC gleich sind. Die Typen bleiben gleich.
 */

export type Fach = { id: string; name: string; emoji: string; farbe: string }
export type Themenbereich = { id: string; fachId: string; name: string }
export type Eintrag = {
  id: string
  fachId: string
  themenbereichId: string
  titel: string
  art: 'text' | 'foto' | 'link'
  inhalt: string
  notiz?: string
  erstellt: string
}
export type Klausur = {
  id: string
  fachId: string
  art: 'Klausur' | 'Test' | 'Vokabeltest' | 'Mündliche Prüfung'
  datum: string // YYYY-MM-DD
  themen: string[]
}
export type Profil = {
  name: string
  klasse: string
  helfer: string
  tagesziel: 15 | 30 | 45
  design: 'hell' | 'dunkel' | 'auto'
  xp: number
  lerntage: string[] // YYYY-MM-DD, an denen gelernt wurde
}

export type State = {
  version: 1
  profil: Profil | null
  faecher: Fach[]
  themen: Themenbereich[]
  eintraege: Eintrag[]
  klausuren: Klausur[]
}

export const START_FAECHER: Fach[] = [
  { id: 'bio', name: 'Biologie', emoji: '🧬', farbe: '#2bb39a' },
  { id: 'che', name: 'Chemie', emoji: '⚗️', farbe: '#3fae4f' },
  { id: 'deu', name: 'Deutsch', emoji: '📖', farbe: '#f2a516' },
  { id: 'eng', name: 'Englisch', emoji: '🇬🇧', farbe: '#ef6c35' },
  { id: 'erd', name: 'Erdkunde', emoji: '🌍', farbe: '#1fa3c9' },
  { id: 'ges', name: 'Geschichte', emoji: '🏛️', farbe: '#d99a1e' },
  { id: 'kun', name: 'Kunst', emoji: '🎨', farbe: '#e0538f' },
  { id: 'mat', name: 'Mathematik', emoji: '📐', farbe: '#3b7be0' },
  { id: 'mus', name: 'Musik', emoji: '🎵', farbe: '#a55be0' },
  { id: 'phy', name: 'Physik', emoji: '⚛️', farbe: '#6a5ce0' },
  { id: 'pol', name: 'Politik', emoji: '⚖️', farbe: '#d64545' },
]

const KEY = 'nayla-state-v1'

function initial(): State {
  return { version: 1, profil: null, faecher: START_FAECHER, themen: [], eintraege: [], klausuren: [] }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw) }
  } catch {
    /* leer */
  }
  return initial()
}

let state: State = load()
const listeners = new Set<() => void>()

export function getState() {
  return state
}

export function setState(update: (s: State) => State) {
  state = update(state)
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* Speicher voll oder gesperrt */
  }
  listeners.forEach((l) => l())
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => select(state),
  )
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
export const isoLokal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const heute = () => isoLokal(new Date())

// ---------- Aktionen ----------

export function profilSpeichern(p: Partial<Profil>) {
  setState((s) => ({
    ...s,
    profil: {
      name: '',
      klasse: '',
      helfer: 'Lumi',
      tagesziel: 30,
      design: 'auto',
      xp: 0,
      lerntage: [],
      ...s.profil,
      ...p,
    },
  }))
}

export function themaFinden(fachId: string, name: string): string {
  const s = getState()
  const vorhanden = s.themen.find((t) => t.fachId === fachId && t.name.toLowerCase() === name.trim().toLowerCase())
  if (vorhanden) return vorhanden.id
  const id = uid()
  setState((st) => ({ ...st, themen: [...st.themen, { id, fachId, name: name.trim() || 'Allgemein' }] }))
  return id
}

export function eintragAnlegen(e: Omit<Eintrag, 'id' | 'erstellt'>): string {
  const id = uid()
  setState((s) => ({ ...s, eintraege: [{ ...e, id, erstellt: new Date().toISOString() }, ...s.eintraege] }))
  xpGeben(5)
  return id
}

export function eintragLoeschen(id: string) {
  setState((s) => ({ ...s, eintraege: s.eintraege.filter((e) => e.id !== id) }))
}

export function fachAnlegen(name: string, emoji = '📘') {
  const id = uid()
  setState((s) => ({ ...s, faecher: [...s.faecher, { id, name, emoji, farbe: '#5b6bb5' }] }))
  return id
}

export function xpGeben(n: number) {
  setState((s) => {
    if (!s.profil) return s
    const tage = s.profil.lerntage.includes(heute()) ? s.profil.lerntage : [...s.profil.lerntage, heute()]
    return { ...s, profil: { ...s.profil, xp: s.profil.xp + n, lerntage: tage } }
  })
}

// ---------- Berechnungen ----------

export function serie(lerntage: string[]): number {
  const set = new Set(lerntage)
  let n = 0
  const d = new Date()
  if (!set.has(isoLokal(d))) d.setDate(d.getDate() - 1)
  while (set.has(isoLokal(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function level(xp: number) {
  const lvl = Math.floor(xp / 100) + 1
  return { lvl, rest: 100 - (xp % 100), prozent: xp % 100 }
}
