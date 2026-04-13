import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { fetchSessions } from '../services/sessions'

export default function History() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try { const data = await fetchSessions(user.id); setSessions(data) }
      catch (e) { console.error(e) }
      setLoading(false)
    }
    if (user) load()
  }, [user])

  const levelLabels = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil', specific: 'Específica' }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <button className="back-link" onClick={() => navigate('/home')}>← Voltar</button>
          <h1 className="history-title">Histórico de estudos</h1>
        </div>
        {loading && <p className="history-empty">Carregando...</p>}
        {!loading && sessions.length === 0 && <p className="history-empty">Nenhuma rodada ainda. Jogue e volte aqui!</p>}
        <div className="history-list">
          {sessions.map((s, i) => (
            <motion.div key={s.id} className="history-card"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="history-card-top">
                <span className="history-student">{s.student_name}</span>
                <span className={`history-score ${s.score_percent >= 70 ? 'good' : 'low'}`}>{s.score_percent}%</span>
              </div>
              <div className="history-card-info">
                <span>{levelLabels[s.difficulty] || s.difficulty}</span><span>·</span>
                <span>{s.round_mode === 'quick' ? 'Rápida' : 'Completa'}</span>
                {s.specific_table && <><span>·</span><span>Tabuada do {s.specific_table}</span></>}
              </div>
              <div className="history-card-bottom">
                <span>✅ {s.correct_answers} acertos · ❌ {s.wrong_answers} erros · {s.total_questions} perguntas</span>
                <span className="history-date">{formatDate(s.created_at)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
