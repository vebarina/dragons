import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShopStore } from './shop'
import { useGameStore } from './game'

vi.mock('@/api/shop', () => ({
  getShop: vi.fn(),
  buyItem: vi.fn(),
}))
vi.mock('@/api/game', () => ({
  startGame: vi.fn(),
  getReputation: vi.fn(),
}))

import { getShop, buyItem } from '@/api/shop'
const mockGetShop = vi.mocked(getShop)
const mockBuyItem = vi.mocked(buyItem)

const MOCK_ITEMS = [
  { id: 'item1', name: 'Potion', cost: 50 },
  { id: 'item2', name: 'Sword', cost: 200 },
]

const MOCK_BUY_RESULT = {
  shoppingSuccess: true,
  gold: 50,
  lives: 4,
  level: 1,
  turn: 2,
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  const game = useGameStore()
  game.applyStats({ lives: 3, gold: 100, score: 0, turn: 1 })
  Object.assign(game, { gameId: 'test-id', phase: 'playing' })
})

describe('fetchItems()', () => {
  it('returns early when there is no active game', async () => {
    Object.assign(useGameStore(), { gameId: null })
    const store = useShopStore()

    await store.fetchItems()

    expect(mockGetShop).not.toHaveBeenCalled()
  })

  it('populates items on success', async () => {
    mockGetShop.mockResolvedValue(MOCK_ITEMS)
    const store = useShopStore()

    await store.fetchItems()

    expect(store.items).toEqual(MOCK_ITEMS)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('sets error on failure', async () => {
    mockGetShop.mockRejectedValue(new Error('API error'))
    const store = useShopStore()

    await store.fetchItems()

    expect(store.error).toBeTruthy()
    expect(store.items).toEqual([])
  })
})

describe('buy()', () => {
  it('applies stats and refreshes items on success', async () => {
    mockBuyItem.mockResolvedValue(MOCK_BUY_RESULT)
    mockGetShop.mockResolvedValue(MOCK_ITEMS)
    const store = useShopStore()
    const game = useGameStore()

    await store.buy('item1')

    expect(game.gold).toBe(50)
    expect(game.lives).toBe(4)
    expect(mockGetShop).toHaveBeenCalled()
    expect(store.isBuying).toBeNull()
  })

  it('sets error on failure', async () => {
    mockBuyItem.mockRejectedValue(new Error('API error'))
    const store = useShopStore()

    await store.buy('item1')

    expect(store.error).toBeTruthy()
    expect(store.isBuying).toBeNull()
  })
})
