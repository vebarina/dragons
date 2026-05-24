export type Probability =
  | 'Piece of cake'
  | 'Walk in the park'
  | 'Quite likely'
  | 'Hmmm....'
  | 'Risky'
  | 'Suicide mission'
  | 'Playing with fire'
  | 'Gamble'
  | 'Rather detrimental'
  | (string & {})

export interface Ad {
  adId: string
  message: string
  reward: number
  expiresIn: number
  probability: Probability
  encrypted: number | null
}

export interface SolveResult {
  success: boolean
  lives: number
  gold: number
  score: number
  highScore: number
  turn: number
  message: string
}
