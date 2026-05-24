import { apiRequest } from './client'
import type { GameState, ReputationResponse } from '@/types/game'

export function startGame(): Promise<GameState> {
  return apiRequest<GameState>('/game/start', { method: 'POST' })
}

export function getReputation(gameId: string): Promise<ReputationResponse> {
  return apiRequest<ReputationResponse>(`/${gameId}/investigate/reputation`, { method: 'POST' })
}
