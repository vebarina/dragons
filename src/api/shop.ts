import { apiRequest } from './client'
import type { ShopItem, BuyResult } from '@/types/shop'

export function getShop(gameId: string): Promise<ShopItem[]> {
  return apiRequest<ShopItem[]>(`/${gameId}/shop`)
}

export function buyItem(gameId: string, itemId: string): Promise<BuyResult> {
  return apiRequest<BuyResult>(`/${gameId}/shop/buy/${itemId}`, { method: 'POST' })
}
