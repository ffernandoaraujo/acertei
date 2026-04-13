function generateAllCombinations(tables) {
  const combinations = []
  for (const table of tables) {
    for (let i = 1; i <= 10; i++) {
      combinations.push({ a: table, b: i, answer: table * i })
    }
  }
  return combinations
}

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getTablesForLevel(level) {
  if (level === 'easy') return [1, 2, 3]
  if (level === 'medium') return [1, 2, 3, 4, 5, 6, 7]
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}

export function generateQuestions({ level, mode, specificTable }) {
  const tables = specificTable ? [specificTable] : getTablesForLevel(level)
  const allCombinations = generateAllCombinations(tables)
  const shuffled = shuffle(allCombinations)
  return mode === 'quick' ? shuffled.slice(0, 10) : shuffled
}
