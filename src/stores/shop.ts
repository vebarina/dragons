import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getShop, buyItem } from '@/api/shop'
import { useGameStore } from './game'
import type { ShopItem } from '@/types/shop'

export const useShopStore = defineStore('shop', () => {
  const items = ref<ShopItem[]>([])
  const isLoading = ref(false)
  const isBuying = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function fetchItems() {
    const game = useGameStore()
    if (!game.gameId) return
    isLoading.value = true
    error.value = null
    try {
      items.value = await getShop(game.gameId)
    } catch {
      error.value = 'Failed to load shop.'
    } finally {
      isLoading.value = false
    }
  }

  async function buy(itemId: string) {
    const game = useGameStore()
    if (!game.gameId) return
    isBuying.value = itemId
    try {
      const result = await buyItem(game.gameId, itemId)
      game.applyStats(result)
      await fetchItems()
    } catch {
      error.value = 'Failed to buy item.'
    } finally {
      isBuying.value = null
    }
  }

  return { items, isLoading, isBuying, error, fetchItems, buy }
})
