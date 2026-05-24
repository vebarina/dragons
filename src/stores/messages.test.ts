import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMessagesStore } from './messages'
import { useGameStore } from './game'

vi.mock('@/api/messages', () => ({
  getMessages: vi.fn(),
  solveMessage: vi.fn(),
}))
vi.mock('@/api/game', () => ({
  startGame: vi.fn(),
  getReputation: vi.fn(),
}))

import { getMessages, solveMessage } from '@/api/messages'
const mockGetMessages = vi.mocked(getMessages)
const mockSolveMessage = vi.mocked(solveMessage)

const MOCK_ADS = [
  { adId: 'ad1', message: 'Quest 1', reward: 50, expiresIn: 3, probability: 'Risky', encrypted: null },
  { adId: 'ad2', message: 'Quest 2', reward: 80, expiresIn: 5, probability: 'Gamble', encrypted: null },
]

const MOCK_SOLVE_RESULT = {
  success: true,
  lives: 3,
  gold: 150,
  score: 50,
  highScore: 50,
  turn: 2,
  message: 'Well done!',
}

const router = { push: vi.fn() }

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  const game = useGameStore()
  game.applyStats({ lives: 3, gold: 100, score: 0, turn: 1 })
  Object.assign(game, { gameId: 'test-id', phase: 'playing' })
})

describe('fetchAds()', () => {
  it('returns early when there is no active game', async () => {
    const game = useGameStore()
    Object.assign(game, { gameId: null })
    const store = useMessagesStore()

    await store.fetchAds()

    expect(mockGetMessages).not.toHaveBeenCalled()
  })

  it('populates ads on success', async () => {
    mockGetMessages.mockResolvedValue(MOCK_ADS)
    const store = useMessagesStore()

    await store.fetchAds()

    expect(store.ads).toEqual(MOCK_ADS)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('sets error on failure', async () => {
    mockGetMessages.mockRejectedValue(new Error('API error'))
    const store = useMessagesStore()

    await store.fetchAds()

    expect(store.error).toBeTruthy()
    expect(store.ads).toEqual([])
  })
})

describe('solveAd()', () => {
  it('applies stats and refreshes ads on success', async () => {
    mockSolveMessage.mockResolvedValue(MOCK_SOLVE_RESULT)
    mockGetMessages.mockResolvedValue(MOCK_ADS)
    const store = useMessagesStore()
    const game = useGameStore()

    await store.solveAd('ad1', router)

    expect(game.gold).toBe(150)
    expect(game.score).toBe(50)
    expect(store.lastResult).toEqual(MOCK_SOLVE_RESULT)
    expect(mockGetMessages).toHaveBeenCalled()
    expect(store.isSolving).toBeNull()
  })

  it('sets error on failure', async () => {
    mockSolveMessage.mockRejectedValue(new Error('API error'))
    const store = useMessagesStore()

    await store.solveAd('ad1', router)

    expect(store.error).toBeTruthy()
    expect(store.isSolving).toBeNull()
  })

  it('navigates to game-over when lives reach 0', async () => {
    mockSolveMessage.mockResolvedValue({ ...MOCK_SOLVE_RESULT, lives: 0 })
    mockGetMessages.mockResolvedValue([])
    const store = useMessagesStore()

    await store.solveAd('ad1', router)

    expect(router.push).toHaveBeenCalledWith('/game-over')
  })
})

describe('clearResult()', () => {
  it('resets lastResult to null', async () => {
    mockSolveMessage.mockResolvedValue(MOCK_SOLVE_RESULT)
    mockGetMessages.mockResolvedValue([])
    const store = useMessagesStore()
    await store.solveAd('ad1', router)

    store.clearResult()

    expect(store.lastResult).toBeNull()
  })
})
