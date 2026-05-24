export type GamePhase = 'idle' | 'playing' | 'won' | 'dead'

export interface GameState {
  gameId: string
  lives: number
  gold: number
  level: number
  score: number
  highScore: number
  turn: number
}

export interface ReputationResponse {
  people: number
  state: number
  underworld: number
}
