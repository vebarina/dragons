import { defineStore } from 'pinia'
import { ref } from 'vue'
import { startGame } from '@/api/game'
import type { GamePhase, GameState } from '@/types/game'

export const useGameStore = defineStore('game', () => {
  const gameId = ref<string | null>(null)
  const lives = ref(0)
  const gold = ref(0)
  const score = ref(0)
  const highScore = ref(0)
  const turn = ref(0)
  const level = ref(0)
  const phase = ref<GamePhase>('idle')
  const isStarting = ref(false)
  const error = ref<string | null>(null)

  async function start() {
    isStarting.value = true
    error.value = null
    try {
      const state = await startGame()
      applyGameState(state)
      phase.value = 'playing'
    } catch {
      error.value = 'Failed to start game. Please try again.'
    } finally {
      isStarting.value = false
    }
  }

  function applyStats(partial: Partial<Pick<GameState, 'lives' | 'gold' | 'score' | 'highScore' | 'turn' | 'level'>>) {
    if (partial.lives !== undefined) lives.value = partial.lives
    if (partial.gold !== undefined) gold.value = partial.gold
    if (partial.score !== undefined) score.value = partial.score
    if (partial.highScore !== undefined) highScore.value = partial.highScore
    if (partial.turn !== undefined) turn.value = partial.turn
    if (partial.level !== undefined) level.value = partial.level
  }

  function checkPhase(router: { push: (path: string) => void }) {
    if (lives.value <= 0) {
      phase.value = 'dead'
      router.push('/game-over')
    } else if (score.value >= 1000) {
      phase.value = 'won'
      router.push('/game-over')
    }
  }

  function reset() {
    gameId.value = null
    lives.value = 0
    gold.value = 0
    score.value = 0
    highScore.value = 0
    turn.value = 0
    level.value = 0
    phase.value = 'idle'
    error.value = null
  }

  function applyGameState(state: GameState) {
    gameId.value = state.gameId
    lives.value = state.lives
    gold.value = state.gold
    score.value = state.score
    highScore.value = state.highScore
    turn.value = state.turn
    level.value = state.level
  }

  return { gameId, lives, gold, score, highScore, turn, level, phase, isStarting, error, start, applyStats, checkPhase, reset }
})
