import { apiRequest } from './client'
import type { Ad, SolveResult } from '@/types/messages'

export function getMessages(gameId: string): Promise<Ad[]> {
  return apiRequest<Ad[]>(`/${gameId}/messages`)
}

export function solveMessage(gameId: string, adId: string): Promise<SolveResult> {
  return apiRequest<SolveResult>(`/${gameId}/solve/${adId}`, { method: 'POST' })
}
