import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from './game'

vi.mock('@/api/game', () => ({
  startGame: vi.fn(),
  getReputation: vi.fn(),
}))

import { startGame } from '@/api/game'
const mockStartGame = vi.mocked(startGame)

const GAME_STATE = {
  gameId: 'test-id',
  lives: 3,
  gold: 100,
  score: 0,
  highScore: 0,
  turn: 1,
  level: 1,
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('start()', () => {
  it('sets phase to playing and applies state on success', async () => {
    mockStartGame.mockResolvedValue(GAME_STATE)
    const game = useGameStore()

    await game.start()

    expect(game.phase).toBe('playing')
    expect(game.gameId).toBe('test-id')
    expect(game.lives).toBe(3)
    expect(game.gold).toBe(100)
    expect(game.isStarting).toBe(false)
  })

  it('sets error and leaves phase idle on failure', async () => {
    mockStartGame.mockRejectedValue(new Error('Network error'))
    const game = useGameStore()

    await game.start()

    expect(game.phase).toBe('idle')
    expect(game.error).toBeTruthy()
    expect(game.isStarting).toBe(false)
  })
})

describe('applyStats()', () => {
  it('updates only the fields that are provided', () => {
    const game = useGameStore()
    game.applyStats({ lives: 2, gold: 50 })

    expect(game.lives).toBe(2)
    expect(game.gold).toBe(50)
    expect(game.score).toBe(0)
  })

  it('ignores undefined fields', () => {
    const game = useGameStore()
    game.applyStats({ score: 200 })
    game.applyStats({ lives: 1 })

    expect(game.score).toBe(200)
    expect(game.lives).toBe(1)
  })
})

describe('checkPhase()', () => {
  const router = { push: vi.fn() }

  beforeEach(() => router.push.mockClear())

  it('sets phase to dead and navigates when lives reach 0', () => {
    const game = useGameStore()
    game.applyStats({ lives: 0 })
    game.checkPhase(router)

    expect(game.phase).toBe('dead')
    expect(router.push).toHaveBeenCalledWith('/game-over')
  })

  it('sets phase to won and navigates when score reaches 1000', () => {
    const game = useGameStore()
    game.applyStats({ lives: 3, score: 1000 })
    game.checkPhase(router)

    expect(game.phase).toBe('won')
    expect(router.push).toHaveBeenCalledWith('/game-over')
  })

  it('does not change phase while game is in progress', () => {
    const game = useGameStore()
    game.applyStats({ lives: 3, score: 500 })
    game.checkPhase(router)

    expect(game.phase).toBe('idle')
    expect(router.push).not.toHaveBeenCalled()
  })
})

describe('reset()', () => {
  it('clears all state back to defaults', async () => {
    mockStartGame.mockResolvedValue(GAME_STATE)
    const game = useGameStore()
    await game.start()

    game.reset()

    expect(game.gameId).toBeNull()
    expect(game.lives).toBe(0)
    expect(game.score).toBe(0)
    expect(game.phase).toBe('idle')
  })
})
