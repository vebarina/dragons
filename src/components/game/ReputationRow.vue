<template>
  <div class="flex items-center justify-between rounded-md border px-4 py-3">
    <span class="font-heading text-sm">{{ label }}</span>
    <div class="flex items-center gap-2">
      <span
        class="text-sm font-semibold tabular-nums"
        :class="value > 0 ? 'text-emerald-700' : value < 0 ? 'text-destructive' : 'text-muted-foreground'"
      >
        {{ value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2) }}
      </span>
      <TrendingUp v-if="value > 0" class="size-4 text-emerald-700" aria-hidden="true" />
      <TrendingDown v-else-if="value < 0" class="size-4 text-destructive" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from '@lucide/vue'

defineProps<{ label: string; value: number }>()
</script>
