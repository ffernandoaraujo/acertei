
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

function toEmail(username) {
  return username.trim().toLowerCase().replace(/[^a-z0-9]/g, '') + '@acertou.app'
}

export default function Auth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') || 'login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const email = toEmail(username)
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError('Não foi possível criar a conta. Tente outro nome de usuário.')
      else navigate('/home')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Nome de usuário ou senha incorretos.')
      else navigate('/home')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <motion.div className="auth-card"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <button className="back-link" onClick={() => navigate('/')}>← Voltar</button>
        <div className="auth-logo">⭐ Acertei</div>
        <div className="auth-tabs">
          <button className={'auth-tab ' + (mode === 'login' ? 'active' : '')}
            onClick={() => { setMode('login'); setError('') }}>Entrar</button>
          <button className={'auth-tab ' + (mode === 'signup' ? 'active' : '')}
            onClick={() => { setMode('signup'); setError('') }}>Criar conta</button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nome de usuário</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="ex: helena" required autoFocus />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <div className="password-wrapper">
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres" required minLength={6} />
              <button type="button" className="password-toggle"
                onClick={() => setShowPassword(s => !s)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
        <p className="auth-hint">
          {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            style={{ background: 'none', border: 'none', color: '#6C63FF', fontWeight: 700, cursor: 'pointer' }}>
            {mode === 'login' ? 'Criar agora' : 'Entrar'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
