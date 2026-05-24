<template>
  <div>
    <Alert v-if="store.error" variant="destructive" class="mb-4">
      <AlertCircle class="size-4" aria-hidden="true" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ store.error }}</AlertDescription>
    </Alert>

    <div v-if="store.isLoading" class="grid gap-3 sm:grid-cols-2" aria-busy="true" aria-label="Loading shop">
      <Skeleton v-for="n in 6" :key="n" class="h-20 w-full rounded-lg" />
    </div>

    <div v-else-if="store.items.length === 0" class="text-center text-muted-foreground py-12">
      Shop is empty.
    </div>

    <div v-else class="grid gap-3 sm:grid-cols-2">
      <ShopItemCard
        v-for="item in store.items"
        :key="item.id"
        :item="item"
        :is-buying="store.isBuying === item.id"
        @buy="store.buy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from '@lucide/vue'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useShopStore } from '@/stores/shop'
import ShopItemCard from './ShopItemCard.vue'

const store = useShopStore()
</script>
