import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [studentName, setStudentName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [level, setLevel] = useState('medium')
  const [mode, setMode] = useState('quick')
  const [specificTable, setSpecificTable] = useState(null)
  const [useSpecific, setUseSpecific] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from('profiles').select('student_name').eq('id', user.id).single()
      if (data?.student_name) setStudentName(data.student_name)
      else setShowOnboarding(true)
    }
    if (user) loadProfile()
  }, [user])

  async function saveName() {
    if (!nameInput.trim()) return
    setSavingName(true)
    await supabase.from('profiles').upsert({ id: user.id, email: user.email, student_name: nameInput.trim() })
    setStudentName(nameInput.trim())
    setShowOnboarding(false)
    setSavingName(false)
  }

  function startGame() {
    navigate('/game', { state: {
      level: useSpecific ? 'specific' : level,
      mode, specificTable: useSpecific ? specificTable : null, studentName
    }})
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (showOnboarding) return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-logo">⭐ Acertou</div>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Qual é o nome do aluno?</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 24 }}>Vamos personalizar a experiência!</p>
        <div className="form-group">
          <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}
            placeholder="Nome do aluno" onKeyDown={(e) => e.key === 'Enter' && saveName()} autoFocus />
        </div>
        <button className="btn btn-primary" onClick={saveName} disabled={savingName}>
          {savingName ? 'Salvando...' : 'Começar!'}
        </button>
      </motion.div>
    </div>
  )

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo">⭐ Acertou</div>
        <div className="home-header-right">
          <span className="student-greeting">Olá, {studentName}!</span>
          <button className="btn-ghost" onClick={() => navigate('/history')}>Histórico</button>
          <button className="btn-ghost" onClick={handleLogout}>Sair</button>
        </div>
      </header>
      <main className="home-main">
        <motion.div className="home-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="home-title">O que vamos treinar hoje?</h2>
          <section className="config-section">
            <div className="section-toggle">
              <button className={`toggle-btn ${!useSpecific ? 'active' : ''}`} onClick={() => setUseSpecific(false)}>Por nível</button>
              <button className={`toggle-btn ${useSpecific ? 'active' : ''}`} onClick={() => setUseSpecific(true)}>Tabuada específica</button>
            </div>
            {!useSpecific ? (
              <div className="options-grid">
                {[
                  { id: 'easy', label: 'Fácil', desc: 'Tabuadas de 1 a 3', emoji: '🌱' },
                  { id: 'medium', label: 'Médio', desc: 'Tabuadas de 1 a 7', emoji: '🔥' },
                  { id: 'hard', label: 'Difícil', desc: 'Tabuadas de 1 a 10', emoji: '⚡' },
                ].map((opt) => (
                  <motion.button key={opt.id} className={`option-card ${level === opt.id ? 'selected' : ''}`}
                    onClick={() => setLevel(opt.id)} whileTap={{ scale: 0.97 }}>
                    <span className="option-emoji">{opt.emoji}</span>
                    <span className="option-label">{opt.label}</span>
                    <span className="option-desc">{opt.desc}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="specific-grid">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <motion.button key={n} className={`specific-btn ${specificTable === n ? 'selected' : ''}`}
                    onClick={() => setSpecificTable(n)} whileTap={{ scale: 0.95 }}>{n}</motion.button>
                ))}
              </div>
            )}
          </section>
          <section className="config-section">
            <h3 className="section-title">Tipo de rodada</h3>
            <div className="options-grid two-col">
              {[
                { id: 'quick', label: 'Rodada rápida', desc: '10 perguntas', emoji: '⚡' },
                { id: 'full', label: 'Rodada completa', desc: 'Todas as contas', emoji: '📚' },
              ].map((opt) => (
                <motion.button key={opt.id} className={`option-card ${mode === opt.id ? 'selected' : ''}`}
                  onClick={() => setMode(opt.id)} whileTap={{ scale: 0.97 }}>
                  <span className="option-emoji">{opt.emoji}</span>
                  <span className="option-label">{opt.label}</span>
                  <span className="option-desc">{opt.desc}</span>
                </motion.button>
              ))}
            </div>
          </section>
          <motion.button className="btn btn-primary btn-large" onClick={startGame}
            disabled={useSpecific && !specificTable} whileTap={{ scale: 0.97 }}>
            Começar rodada 🚀
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
}
