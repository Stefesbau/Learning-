type Mood = 'happy' | 'neutral' | 'think' | 'wow'

/** Lumi – die Helferin: ein kleiner leuchtender Stern. */
export function Lumi({ size = 64, mood = 'happy', glow = true }: { size?: number; mood?: Mood; glow?: boolean }) {
  const mouth =
    mood === 'happy' ? <path d="M43 55 Q50 61 57 55" stroke="#1f2a5c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    : mood === 'wow' ? <ellipse cx="50" cy="57" rx="3.2" ry="4" fill="#1f2a5c" />
    : mood === 'think' ? <path d="M45 57 L55 55" stroke="#1f2a5c" strokeWidth="2.6" strokeLinecap="round" />
    : <path d="M45 56 L55 56" stroke="#1f2a5c" strokeWidth="2.6" strokeLinecap="round" />
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={glow ? 'lumi lumi-glow' : 'lumi'} aria-label="Lumi">
      <defs>
        <radialGradient id="lumiG" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff6c4" />
          <stop offset="0.55" stopColor="#ffc83d" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      <path
        d="M50 8 C56 28 62 32 82 37 C65 47 62 54 67 76 C55 64 45 64 33 76 C38 54 35 47 18 37 C38 32 44 28 50 8 Z"
        fill="url(#lumiG)" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"
      />
      <circle cx="43" cy="46" r="3.6" fill="#1f2a5c" />
      <circle cx="57" cy="46" r="3.6" fill="#1f2a5c" />
      <circle cx="44.2" cy="44.8" r="1.1" fill="#fff" />
      <circle cx="58.2" cy="44.8" r="1.1" fill="#fff" />
      <circle cx="37" cy="53" r="3" fill="#ff9e7a" opacity="0.55" />
      <circle cx="63" cy="53" r="3" fill="#ff9e7a" opacity="0.55" />
      {mouth}
    </svg>
  )
}

/** Sprechblase von Lumi */
export function LumiSays({ children, mood = 'happy', size = 44 }: { children: React.ReactNode; mood?: Mood; size?: number }) {
  return (
    <div className="lumi-says">
      <Lumi size={size} mood={mood} />
      <div className="bubble">{children}</div>
    </div>
  )
}
