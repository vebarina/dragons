<template>
  <main class="flex min-h-screen items-center justify-center p-8">
    <div class="text-center max-w-md">
      <img src="@/assets/logo.png" alt="Dragons of Mugloar" class="mx-auto mb-4 max-w-lg w-full" />
      <p class="text-muted-foreground mb-8">
        Take on quests, earn gold, and survive long enough to reach 1000 points.
      </p>
      <Alert v-if="game.error" variant="destructive" class="mb-6 text-left">
        <AlertCircle class="size-4" aria-hidden="true" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ game.error }}</AlertDescription>
      </Alert>
      <div class="flex flex-col items-center gap-3">
        <Button v-if="showResume" size="lg" @click="router.push('/game/messages')">
          Continue Game
        </Button>
        <Button
          :variant="showResume ? 'outline' : 'default'"
          size="lg"
          :disabled="isBusy"
          @click="startGame"
        >
          <Loader2 v-if="isBusy" class="size-4 animate-spin mr-2" aria-hidden="true" />
          {{ isBusy ? 'Starting…' : showResume ? 'Abandon & New Game' : 'Start Game' }}
        </Button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertCircle, Loader2 } from '@lucide/vue'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'

const game = useGameStore()
const router = useRouter()
const isNavigating = ref(false)

const isBusy = computed(() => game.isStarting || isNavigating.value)
const showResume = computed(() => game.phase === 'playing' && !isBusy.value)

async function startGame() {
  isNavigating.value = true
  await game.start()
  if (game.phase === 'playing') {
    router.push('/game/messages')
  } else {
    isNavigating.value = false
  }
}
</script>
