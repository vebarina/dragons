import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useReputationStore } from './reputation'
import { useGameStore } from './game'

vi.mock('@/api/game', () => ({
  startGame: vi.fn(),
  getReputation: vi.fn(),
}))

import { getReputation } from '@/api/game'
const mockGetReputation = vi.mocked(getReputation)

const MOCK_REPUTATION = { people: 1.5, state: -0.5, underworld: 2.0 }

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  Object.assign(useGameStore(), { gameId: 'test-id' })
})

describe('fetch()', () => {
  it('returns early when there is no active game', async () => {
    Object.assign(useGameStore(), { gameId: null })
    const store = useReputationStore()

    await store.fetch()

    expect(mockGetReputation).not.toHaveBeenCalled()
  })

  it('sets reputation on success', async () => {
    mockGetReputation.mockResolvedValue(MOCK_REPUTATION)
    const store = useReputationStore()

    await store.fetch()

    expect(store.reputation).toEqual(MOCK_REPUTATION)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('sets error on failure', async () => {
    mockGetReputation.mockRejectedValue(new Error('Server error'))
    const store = useReputationStore()

    await store.fetch()

    expect(store.error).toBeTruthy()
    expect(store.reputation).toBeNull()
    expect(store.isLoading).toBe(false)
  })
})
