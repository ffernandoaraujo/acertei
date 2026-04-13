
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Welcome from './pages/Welcome'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Game from './pages/Game'
import GameGuest from './pages/GameGuest'
import Result from './pages/Result'
import History from './pages/History'
import SharedResult from './pages/SharedResult'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Carregando...</div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/game-guest" element={<GameGuest />} />
        <Route path="/game" element={<Game />} />
        <Route path="/result" element={<Result />} />
        <Route path="/share" element={<SharedResult />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
