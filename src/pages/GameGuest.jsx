
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function GameGuest() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [level, setLevel] = useState('medium')
  const [mode, setMode] = useState('quick')
  const [specificTable, setSpecificTable] = useState(null)
  const [useSpecific, setUseSpecific] = useState(false)

  function start() {
    if (!name.trim()) return
    navigate('/game', {
      state: {
        level: useSpecific ? 'specific' : level,
        mode,
        specificTable: useSpecific ? specificTable : null,
        studentName: name.trim(),
        guest: true,
      }
    })
  }

  return (
    <div className="guest-page">
      <motion.div className="guest-card"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <button className="back-link" onClick={() => navigate('/')}>← Voltar</button>
        <div className="auth-logo">⭐ Acertou</div>

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label>Qual é o seu nome?</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Seu nome aqui" onKeyDown={e => e.key === 'Enter' && start()} autoFocus />
        </div>

        <div className="guest-section">
          <div className="section-toggle">
            <button className={'toggle-btn ' + (!useSpecific ? 'active' : '')} onClick={() => setUseSpecific(false)}>Por nível</button>
            <button className={'toggle-btn ' + (useSpecific ? 'active' : '')} onClick={() => setUseSpecific(true)}>Tabuada específica</button>
          </div>

          {!useSpecific ? (
            <div className="options-grid">
              {[
                { id: 'easy', label: 'Fácil', desc: 'Tabuadas de 1 a 3', emoji: '🌱' },
                { id: 'medium', label: 'Médio', desc: 'Tabuadas de 1 a 7', emoji: '🔥' },
                { id: 'hard', label: 'Difícil', desc: 'Tabuadas de 1 a 10', emoji: '⚡' },
              ].map(opt => (
                <motion.button key={opt.id} className={'option-card ' + (level === opt.id ? 'selected' : '')}
                  onClick={() => setLevel(opt.id)} whileTap={{ scale: 0.97 }}>
                  <span className="option-emoji">{opt.emoji}</span>
                  <span className="option-label">{opt.label}</span>
                  <span className="option-desc">{opt.desc}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="specific-grid">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <motion.button key={n} className={'specific-btn ' + (specificTable === n ? 'selected' : '')}
                  onClick={() => setSpecificTable(n)} whileTap={{ scale: 0.95 }}>{n}</motion.button>
              ))}
            </div>
          )}
        </div>

        <div className="guest-section">
          <div className="options-grid two-col">
            {[
              { id: 'quick', label: 'Rodada rápida', desc: '10 perguntas', emoji: '⚡' },
              { id: 'full', label: 'Rodada completa', desc: 'Todas as contas', emoji: '📚' },
            ].map(opt => (
              <motion.button key={opt.id} className={'option-card ' + (mode === opt.id ? 'selected' : '')}
                onClick={() => setMode(opt.id)} whileTap={{ scale: 0.97 }}>
                <span className="option-emoji">{opt.emoji}</span>
                <span className="option-label">{opt.label}</span>
                <span className="option-desc">{opt.desc}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button className="btn btn-primary btn-large" onClick={start}
          disabled={useSpecific && !specificTable} whileTap={{ scale: 0.97 }}
          style={{ marginTop: 8 }}>
          Jogar agora 🚀
        </motion.button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: '#888' }}>
          Quer salvar seu histórico?{' '}
          <button onClick={() => navigate('/auth?mode=signup')}
            style={{ background: 'none', border: 'none', color: '#6C63FF', fontWeight: 700, cursor: 'pointer' }}>
            Criar conta
          </button>
        </p>
      </motion.div>
    </div>
  )
}
