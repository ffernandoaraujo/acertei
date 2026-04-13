
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { generateQuestions } from '../utils/questionEngine'
import { getRandomCorrect, getRandomWrong } from '../utils/messages'

export default function Game() {
  const navigate = useNavigate()
  const location = useLocation()
  const config = location.state
  const [questions] = useState(() => generateQuestions(config))
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [history, setHistory] = useState([])
  const [timer, setTimer] = useState(0)
  const [times, setTimes] = useState([])
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { if (!config) navigate('/home') }, [])

  useEffect(() => {
    setTimer(0)
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [current])

  useEffect(() => {
    if (answered) clearInterval(timerRef.current)
  }, [answered])

  useEffect(() => {
    if (!answered && inputRef.current) inputRef.current.focus()
  }, [current, answered])

  function handleAnswer() {
    if (answered || answer === '') return
    clearInterval(timerRef.current)
    const q = questions[current]
    const isCorrect = parseInt(answer, 10) === q.answer
    setAnswered(true)
    const newCorrect = isCorrect ? correctCount + 1 : correctCount
    const newWrong = isCorrect ? wrongCount : wrongCount + 1
    if (isCorrect) setCorrectCount(newCorrect)
    else setWrongCount(newWrong)

    const msg = isCorrect ? getRandomCorrect() : getRandomWrong(q.answer)
    setFeedback({ correct: isCorrect, message: msg })

    const newTimes = [...times, timer]
    setTimes(newTimes)

    const newHistory = [...history, {
      question: q.a + ' x ' + q.b,
      correct: isCorrect,
      userAnswer: parseInt(answer, 10),
      rightAnswer: q.answer,
      time: timer,
    }]
    setHistory(newHistory)

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        const avgTime = newTimes.reduce((a, b) => a + b, 0) / newTimes.length
        navigate('/result', { state: {
          studentName: config.studentName,
          level: config.level,
          mode: config.mode,
          specificTable: config.specificTable,
          correctAnswers: newCorrect,
          wrongAnswers: newWrong,
          totalQuestions: questions.length,
          guest: config.guest || false,
          avgTime,
        }})
      } else {
        setCurrent(c => c + 1)
        setAnswer('')
        setFeedback(null)
        setAnswered(false)
      }
    }, 2500)
  }

  if (!config || questions.length === 0) return null
  const q = questions[current]
  const progress = (current / questions.length) * 100

  return (
    <div className="game-page">
      <div className="game-layout">
        <div className="game-main">
          <div className="game-header">
            <span className="game-student">{config.studentName}</span>
            <span className="game-timer">⏱ {timer}s</span>
            <span className="game-counter">{current + 1} / {questions.length}</span>
          </div>
          <div className="progress-bar-track">
            <motion.div className="progress-bar-fill" animate={{ width: progress + '%' }} transition={{ duration: 0.3 }} />
          </div>
          <div className="game-score">
            <span className="score-correct">✅ {correctCount}</span>
            <span className="score-wrong">❌ {wrongCount}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={current} className="question-card"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.25 }}>
              <p className="question-text">{q.a} x {q.b} = ?</p>
              <input ref={inputRef} type="number" className="answer-input" value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnswer()}
                disabled={answered} placeholder="?" min={0} max={100} autoFocus />
              <motion.button className="btn btn-primary btn-large" onClick={handleAnswer}
                disabled={answered || answer === ''} whileTap={{ scale: 0.96 }}>
                Confirmar
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {feedback && (
              <motion.div className={'feedback-banner ' + (feedback.correct ? 'feedback-correct' : 'feedback-wrong')}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {history.length > 0 && (
          <div className="game-sidebar">
            <h3 className="sidebar-title">Histórico da rodada</h3>
            <div className="history-trail">
              {[...history].reverse().map((h, i) => (
                <div key={i} className={'trail-item ' + (h.correct ? 'trail-correct' : 'trail-wrong')}>
                  <span className="trail-question">{h.question}</span>
                  <span className="trail-result">
                    {h.correct ? '✅ ' + h.rightAnswer : '❌ ' + h.userAnswer + ' → ' + h.rightAnswer}
                  </span>
                  <span className="trail-time">{h.time}s</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
