import { supabase } from '../lib/supabase'

export async function saveSession({ userId, studentName, difficulty, roundMode, specificTable, totalQuestions, correctAnswers, wrongAnswers, scorePercent }) {
  const { error } = await supabase.from('study_sessions').insert({
    user_id: userId, student_name: studentName, difficulty, round_mode: roundMode,
    specific_table: specificTable || null, total_questions: totalQuestions,
    correct_answers: correctAnswers, wrong_answers: wrongAnswers, score_percent: scorePercent,
  })
  if (error) throw error
}

export async function fetchSessions(userId) {
  const { data, error } = await supabase
    .from('study_sessions').select('*').eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(50)
  if (error) throw error
  return data
}
