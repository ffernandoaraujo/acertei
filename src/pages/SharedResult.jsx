
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

function getAvatar(percent) {
  if (percent === 100) return '🏆'
  if (percent >= 90) return '🥇'
  if (percent >= 71) return '🥈'
  if (percent >= 51) return '🥉'
  return '💪'
}

function getTitle(percent) {
  if (percent >= 90) return 'Mestre do Combo'
  if (percent >= 71) return 'Ninja dos Números'
  if (percent >= 51) return 'Guardião da Multiplicação'
  return 'Explorador da Tabuada'
}

function getMessage(percent) {
  if (percent === 100) return 'Perfeito absoluto! 🌟'
  if (percent >= 90) return 'Nível lenda desbloqueado!'
  if (percent >= 71) return 'Você foi muito bem!'
  if (percent >= 51) return 'Você está pegando o ritmo!'
  return 'Você começou. Isso já conta!'
}

export default function SharedResult() {
  const [params] = useSearchParams()
  const name = params.get('name') || 'Aluno'
  const correct = parseInt(params.get('correct') || '0')
  const total = parseInt(params.get('total') || '10')
  const level = params.get('level') || 'medium'
  const mode = params.get('mode') || 'quick'
  const specificTable = params.get('table')
  const avgTime = params.get('avg')

  const percent = Math.round((correct / total) * 100)
  const avatar = getAvatar(percent)
  const title = getTitle(percent)
  const message = getMessage(percent)

  const levelLabels = {
    easy: 'Fácil', medium: 'Médio', hard: 'Difícil',
    specific: 'Tabuada do ' + specificTable
  }

  return (
    <div className="result-page">
      <motion.div className="result-card"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

        <div className="shared-badge">Resultado compartilhado ⭐ Acertei</div>

        <motion.div className="result-avatar"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
          {avatar}
        </motion.div>

        <div className="result-title-badge">{title}</div>
        <h2 className="result-student">{name}</h2>

        <div className="result-percent">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
            {percent}%
          </motion.span>
        </div>

        <div className="result-stats">
          <div className="stat-item correct">
            <span className="stat-number">{correct}</span>
            <span className="stat-label">Acertos</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item wrong">
            <span className="stat-number">{total - correct}</span>
            <span className="stat-label">Erros</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        {avgTime && (
          <div className="result-time-badge">⏱ {parseFloat(avgTime).toFixed(1)}s por pergunta</div>
        )}

        <div className="result-level-badge">
          {levelLabels[level]} · {mode === 'quick' ? 'Rodada rápida' : 'Rodada completa'}
        </div>

        <p className="result-message">{message}</p>

        <div className="shared-cta">
          <p>Quer treinar também?</p>
          <a href="/" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 8 }}>
            Jogar agora 🚀
          </a>
        </div>

      </motion.div>
    </div>
  )
}
