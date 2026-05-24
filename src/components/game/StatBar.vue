<template>
  <div role="status" aria-live="polite" aria-label="Player stats" class="flex items-center gap-4 text-sm">
    <span class="flex items-center gap-1.5" :aria-label="`${lives} lives`">
      <Heart class="size-4 text-red-500" aria-hidden="true" />
      <span>{{ lives }}</span>
    </span>
    <span class="flex items-center gap-1.5" :aria-label="`${gold} gold`">
      <Coins class="size-4 text-yellow-500" aria-hidden="true" />
      <span>{{ gold }}</span>
    </span>
    <span class="flex items-center gap-1.5" :aria-label="`${score} score`">
      <Star class="size-4 text-blue-500" aria-hidden="true" />
      <span>{{ score }}</span>
    </span>
    <span class="text-muted-foreground">Turn {{ turn }}</span>
  </div>
</template>

<script setup lang="ts">
import { Heart, Coins, Star } from '@lucide/vue'

defineProps<{
  lives: number
  gold: number
  score: number
  turn: number
}>()
</script>
