<template>
  <div>
    <Alert v-if="store.error" variant="destructive" class="mb-4">
      <AlertCircle class="size-4" aria-hidden="true" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ store.error }}</AlertDescription>
    </Alert>

    <SolveResultBanner v-if="store.lastResult" :result="store.lastResult" />

    <div v-if="store.isLoading" class="grid gap-3" aria-busy="true" aria-label="Loading quests">
      <Skeleton v-for="n in 4" :key="n" class="h-24 w-full rounded-lg" />
    </div>

    <div v-else-if="store.ads.length === 0" class="text-center text-muted-foreground py-12">
      No quests available right now.
    </div>

    <div v-else class="grid gap-3">
      <AdCard
        v-for="ad in store.ads"
        :key="ad.adId"
        :ad="ad"
        :is-solving="store.isSolving === ad.adId"
        @solve="solveAd"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from '@lucide/vue'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useMessagesStore } from '@/stores/messages'
import { useRouter } from 'vue-router'
import AdCard from './AdCard.vue'
import SolveResultBanner from './SolveResultBanner.vue'

const store = useMessagesStore()
const router = useRouter()

function solveAd(adId: string) {
  store.solveAd(adId, router)
}
</script>
