import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getReputation } from '@/api/game'
import { useGameStore } from './game'
import type { ReputationResponse } from '@/types/game'

export const useReputationStore = defineStore('reputation', () => {
  const reputation = ref<ReputationResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    const game = useGameStore()
    if (!game.gameId) return
    isLoading.value = true
    error.value = null
    try {
      reputation.value = await getReputation(game.gameId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load reputation'
    } finally {
      isLoading.value = false
    }
  }

  return { reputation, isLoading, error, fetch }
})
