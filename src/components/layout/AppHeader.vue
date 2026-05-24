<template>
  <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
      <RouterLink to="/" aria-label="Go to home">
        <img src="@/assets/logo.png" alt="Dragons of Mugloar" class="h-12 w-auto" />
      </RouterLink>
      <StatBar
        :lives="game.lives"
        :gold="game.gold"
        :score="game.score"
        :turn="game.turn"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import StatBar from '@/components/game/StatBar.vue'

const game = useGameStore()
</script>
