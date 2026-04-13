
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export default function Welcome() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) navigate('/home')
  }, [user, loading])

  return (
    <div className="welcome-page">
      <motion.div className="welcome-card"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="welcome-emoji">⭐</div>
        <h1 className="app-title">Acertei</h1>
        <p className="app-subtitle">O lugar certo para treinar tabuada e arrasar nos números!</p>
        <div className="welcome-actions">
          <motion.button className="btn btn-primary" whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/game-guest')}>
            Jogar agora
          </motion.button>
          <motion.button className="btn btn-secondary" whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/auth?mode=login')}>
            Entrar ou criar conta
          </motion.button>
        </div>
        <p className="welcome-hint">Com conta, seu histórico fica salvo em qualquer dispositivo.</p>
      </motion.div>
    </div>
  )
}
