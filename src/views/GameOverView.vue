<template>
  <main class="flex min-h-screen items-center justify-center p-8">
    <div class="text-center max-w-md">
      <h1 class="text-4xl font-bold tracking-tight mb-2 font-heading">
        {{ game.phase === 'won' ? 'Victory!' : 'Game Over' }}
      </h1>
      <p class="text-muted-foreground mb-2">
        {{ game.phase === 'won'
          ? 'You reached 1000 points and became Mugloar\'s most notorious dragon trainer!'
          : 'Your dragon has fallen. Better luck next time.' }}
      </p>

      <div class="flex justify-center gap-6 my-6 text-sm">
        <span class="flex items-center gap-1.5">
          <Star class="size-4 text-blue-500" aria-hidden="true" />
          Score: <strong>{{ game.score }}</strong>
        </span>
        <span class="flex items-center gap-1.5">
          <Trophy class="size-4 text-yellow-500" aria-hidden="true" />
          High Score: <strong>{{ game.highScore }}</strong>
        </span>
        <span class="flex items-center gap-1.5">
          <RefreshCw class="size-4" aria-hidden="true" />
          Turns: <strong>{{ game.turn }}</strong>
        </span>
      </div>

      <Button size="lg" @click="playAgain">Play Again</Button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Star, Trophy, RefreshCw } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'

const game = useGameStore()
const router = useRouter()

async function playAgain() {
  await game.start()
  if (game.phase === 'playing') router.push('/game/messages')
}
</script>
