<template>
  <Card>
    <CardHeader class="pb-2">
      <CardTitle class="text-base">{{ item.name }}</CardTitle>
    </CardHeader>
    <CardContent class="flex items-center justify-between">
      <span class="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Coins class="size-4 text-yellow-500" aria-hidden="true" />
        {{ item.cost }}
      </span>
      <Button
        size="sm"
        :disabled="isBuying || cannotAfford"
        :aria-busy="isBuying"
        :aria-label="`Buy ${item.name}`"
        @click="$emit('buy', item.id)"
      >
        <Loader2 v-if="isBuying" class="size-4 animate-spin" aria-hidden="true" />
        <span v-else-if="cannotAfford">Not enough coins</span>
        <span v-else>Buy</span>
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Coins, Loader2 } from '@lucide/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/game'
import type { ShopItem } from '@/types/shop'

const props = defineProps<{
  item: ShopItem
  isBuying: boolean
}>()

defineEmits<{ buy: [itemId: string] }>()

const game = useGameStore()
const cannotAfford = computed(() => game.gold < props.item.cost)
</script>
