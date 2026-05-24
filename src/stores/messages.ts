import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMessages, solveMessage } from '@/api/messages'
import { useGameStore } from './game'
import type { Ad, SolveResult } from '@/types/messages'

export const useMessagesStore = defineStore('messages', () => {
  const ads = ref<Ad[]>([])
  const isLoading = ref(false)
  const isSolving = ref<string | null>(null)
  const lastResult = ref<SolveResult | null>(null)
  const error = ref<string | null>(null)

  async function fetchAds() {
    const game = useGameStore()
    if (!game.gameId) return
    isLoading.value = true
    error.value = null
    try {
      ads.value = await getMessages(game.gameId)
    } catch {
      error.value = 'Failed to load quests.'
    } finally {
      isLoading.value = false
    }
  }

  async function solveAd(adId: string, router: { push: (path: string) => void }) {
    const game = useGameStore()
    if (!game.gameId) return
    isSolving.value = adId
    lastResult.value = null
    try {
      const result = await solveMessage(game.gameId, adId)
      lastResult.value = result
      game.applyStats(result)
      game.checkPhase(router)
      if (game.phase === 'playing') await fetchAds()
    } catch {
      error.value = 'Failed to solve quest.'
    } finally {
      isSolving.value = null
    }
  }

  function clearResult() {
    lastResult.value = null
  }

  return { ads, isLoading, isSolving, lastResult, error, fetchAds, solveAd, clearResult }
})
