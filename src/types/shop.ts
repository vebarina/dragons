export interface ShopItem {
  id: string
  name: string
  cost: number
}

export interface BuyResult {
  shoppingSuccess: boolean
  gold: number
  lives: number
  level: number
  turn: number
  message?: string
}
