
export const correctMessages = [
  'Boa!',
  'Mandou bem!',
  'Acerto crítico!',
  'Combo ligado!',
  'Você está voando!',
  'Excelente!',
  'Isso aí!',
  'Show de bola!',
  'Perfeito!',
  'Na mosca!',
]

export const wrongMessages = (answer) => [
  'Foi por pouco! A resposta certa era ' + answer + '.',
  'Quase! A resposta correta é ' + answer + '.',
  'Não dessa vez. Era ' + answer + '.',
  'Ops! A certa é ' + answer + '. Bora de novo!',
]

export function getRandomCorrect() {
  return correctMessages[Math.floor(Math.random() * correctMessages.length)]
}

export function getRandomWrong(answer) {
  const msgs = wrongMessages(answer)
  return msgs[Math.floor(Math.random() * msgs.length)]
}

export function getFinalMessage(percent) {
  if (percent >= 90) {
    const msgs = ['Nível lenda desbloqueado!', 'Hoje você jogou em modo campeão!']
    return msgs[Math.floor(Math.random() * msgs.length)]
  }
  if (percent >= 71) {
    const msgs = ['Você foi muito bem!', 'Quase nível chefão. Continue assim!']
    return msgs[Math.floor(Math.random() * msgs.length)]
  }
  if (percent >= 51) {
    const msgs = ['Você está pegando o ritmo!', 'Já entrou no jogo. Bora melhorar!']
    return msgs[Math.floor(Math.random() * msgs.length)]
  }
  return ['Você começou. Isso já conta!', 'Treino desbloqueado. Bora de novo!'][Math.floor(Math.random() * 2)]
}

export function getStudentTitle(percent) {
  if (percent >= 90) return 'Mestre do Combo'
  if (percent >= 71) return 'Ninja dos Números'
  if (percent >= 51) return 'Guardião da Multiplicação'
  return 'Explorador da Tabuada'
}
