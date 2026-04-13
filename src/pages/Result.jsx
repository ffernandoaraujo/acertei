
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { saveSession } from '../services/sessions'
import { getFinalMessage, getStudentTitle } from '../utils/messages'
import confetti from 'canvas-confetti'

function getAvatar(percent) {
  if (percent === 100) return '🏆'
  if (percent >= 90) return '🥇'
  if (percent >= 71) return '🥈'
  if (percent >= 51) return '🥉'
  return '💪'
}

function fireConfetti(percent) {
  if (percent < 50) return
  const count = percent >= 90 ? 300 : percent >= 70 ? 180 : 80
  const colors = ['#6C63FF', '#FF6B9D', '#FFD166', '#06D6A0']
  confetti({ particleCount: count, spread: 90, origin: { y: 0.55 }, colors })
  if (percent >= 90) {
    setTimeout(() => confetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0 }, colors }), 300)
    setTimeout(() => confetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 1 }, colors }), 400)
  }
}

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const data = location.state
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    if (!data) { navigate('/home'); return }
    const percent = Math.round((data.correctAnswers / data.totalQuestions) * 100)
    setTimeout(() => fireConfetti(percent), 400)
    if (!data.guest && user) {
      async function save() {
        try {
          await saveSession({
            userId: user.id, studentName: data.studentName, difficulty: data.level,
            roundMode: data.mode, specificTable: data.specificTable,
            totalQuestions: data.totalQuestions, correctAnswers: data.correctAnswers,
            wrongAnswers: data.wrongAnswers,
            scorePercent: Math.round((data.correctAnswers / data.totalQuestions) * 100),
          })
          setSaved(true)
        } catch (e) { console.error('Erro ao salvar:', e) }
      }
      save()
    }
  }, [])

  if (!data) return null

  const percent = Math.round((data.correctAnswers / data.totalQuestions) * 100)
  const finalMessage = getFinalMessage(percent)
  const title = getStudentTitle(percent)
  const avatar = getAvatar(percent)
  const avgTime = data.avgTime ? data.avgTime.toFixed(1) + 's por pergunta' : null

  const levelLabels = {
    easy: 'Fácil', medium: 'Médio', hard: 'Difícil',
    specific: 'Tabuada do ' + data.specificTable
  }

  function buildShareLink() {
    const base = window.location.origin + '/share?'
    const params = new URLSearchParams({
      name: data.studentName,
      correct: data.correctAnswers,
      total: data.totalQuestions,
      level: data.level,
      mode: data.mode,
    })
    if (data.specificTable) params.set('table', data.specificTable)
    if (data.avgTime) params.set('avg', data.avgTime.toFixed(1))
    return base + params.toString()
  }

  async function handleShare() {
    const link = buildShareLink()
    const text = data.studentName + ' acertou ' + data.correctAnswers + ' de ' + data.totalQuestions + ' na tabuada! ' + link
    if (navigator.share) {
      try { await navigator.share({ text }) } catch (_) {}
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleCopyLink() {
    const link = buildShareLink()
    await navigator.clipboard.writeText(link)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="result-page">
      <motion.div className="result-card"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        <motion.div className="result-avatar"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
          {avatar}
        </motion.div>

        <div className="result-title-badge">{title}</div>
        <h2 className="result-student">{data.studentName}</h2>

        <div className="result-percent">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
            {percent}%
          </motion.span>
        </div>

        <div className="result-stats">
          <div className="stat-item correct">
            <span className="stat-number">{data.correctAnswers}</span>
            <span className="stat-label">Acertos</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item wrong">
            <span className="stat-number">{data.wrongAnswers}</span>
            <span className="stat-label">Erros</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{data.totalQuestions}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        {avgTime && <div className="result-time-badge">⏱ {avgTime}</div>}

        <div className="result-level-badge">
          {levelLabels[data.level]} · {data.mode === 'quick' ? 'Rodada rápida' : 'Rodada completa'}
        </div>

        <p className="result-message">{finalMessage}</p>

        <div className="result-actions">
          <motion.button className="btn btn-primary" whileTap={{ scale: 0.97 }}
            onClick={() => navigate(data.guest ? '/game-guest' : '/home')}>
            Jogar novamente
          </motion.button>
          <motion.button className="btn btn-secondary" whileTap={{ scale: 0.97 }} onClick={handleShare}>
            {copied ? 'Copiado! ✅' : 'Compartilhar resultado'}
          </motion.button>
          <motion.button className="btn btn-ghost-dark" whileTap={{ scale: 0.97 }} onClick={handleCopyLink}>
            {linkCopied ? 'Link copiado! ✅' : 'Copiar link de visualização 🔗'}
          </motion.button>
          {!data.guest && (
            <motion.button className="btn btn-ghost-dark" whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/history')}>
              Ver histórico
            </motion.button>
          )}
          {data.guest && (
            <motion.button className="btn btn-ghost-dark" whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth?mode=signup')}>
              Criar conta para salvar
            </motion.button>
          )}
        </div>

        {saved && <p className="save-confirm">✅ Rodada salva no histórico</p>}
      </motion.div>
    </div>
  )
}
