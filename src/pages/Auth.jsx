
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

function toEmail(username) {
  return username.trim().toLowerCase().replace(/[^a-z0-9]/g, '') + '@acertei.app'
}

export default function Auth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') || 'login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    const email = toEmail(username)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { recovery_email: recoveryEmail || null }
        }
      })
      if (error) setError('Nao foi possivel criar a conta. Tente outro nome de usuario.')
      else navigate('/home')
    } else if (mode === 'login') {
      const email = toEmail(username)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Nome de usuario ou senha incorretos.')
      else navigate('/home')
    } else if (mode === 'forgot') {
      const { data, error: listError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('recovery_email', recoveryEmail)
        .single()
      if (listError || !data) {
        setError('E-mail nao encontrado. Verifique o e-mail de recuperacao cadastrado.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: window.location.origin + '/auth?mode=reset'
        })
        if (error) setError('Erro ao enviar e-mail. Tente novamente.')
        else setSuccess('E-mail de recuperacao enviado! Verifique sua caixa de entrada.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <motion.div className="auth-card"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <button className="back-link" onClick={() => navigate('/')}>← Voltar</button>
        <div className="auth-logo">⭐ Acertei</div>

        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button className={'auth-tab ' + (mode === 'login' ? 'active' : '')}
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}>Entrar</button>
            <button className={'auth-tab ' + (mode === 'signup' ? 'active' : '')}
              onClick={() => { setMode('signup'); setError(''); setSuccess('') }}>Criar conta</button>
          </div>
        )}

        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recuperar senha</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: 4 }}>Informe o e-mail de recuperacao cadastrado</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode !== 'forgot' && (
            <div className="form-group">
              <label>Nome de usuario</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="ex: helena" required autoFocus />
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-group">
              <label>E-mail de recuperacao <span style={{ color: '#aaa', fontWeight: 400 }}>(opcional)</span></label>
              <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)}
                placeholder="email dos pais para recuperar senha" />
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="form-group">
              <label>Senha</label>
              <div className="password-wrapper">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="minimo 6 caracteres" required minLength={6} />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPassword(s => !s)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="form-group">
              <label>E-mail de recuperacao</label>
              <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)}
                placeholder="email cadastrado" required autoFocus />
            </div>
          )}

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar e-mail'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="auth-hint">
            <button onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
              style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.85rem', cursor: 'pointer' }}>
              Esqueceu a senha?
            </button>
          </p>
        )}

        {mode === 'forgot' && (
          <p className="auth-hint">
            <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              style={{ background: 'none', border: 'none', color: '#6C63FF', fontWeight: 700, cursor: 'pointer' }}>
              ← Voltar para o login
            </button>
          </p>
        )}

        {mode !== 'forgot' && (
          <p className="auth-hint">
            {mode === 'login' ? 'Nao tem conta? ' : 'Ja tem conta? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{ background: 'none', border: 'none', color: '#6C63FF', fontWeight: 700, cursor: 'pointer' }}>
              {mode === 'login' ? 'Criar agora' : 'Entrar'}
            </button>
          </p>
        )}
      </motion.div>
    </div>
  )
}
