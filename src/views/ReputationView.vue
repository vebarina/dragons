<template>
  <div class="p-4 space-y-4">
    <h2 class="text-lg font-heading">Reputation</h2>

    <Alert v-if="store.error" variant="destructive">
      <AlertCircle class="size-4" aria-hidden="true" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ store.error }}</AlertDescription>
    </Alert>

    <div v-if="store.isLoading" class="space-y-3" aria-busy="true" aria-label="Loading reputation">
      <Skeleton class="h-12 rounded-md" />
      <Skeleton class="h-12 rounded-md" />
      <Skeleton class="h-12 rounded-md" />
    </div>

    <div v-else-if="store.reputation" class="space-y-3">
      <ReputationRow label="People" :value="store.reputation.people" />
      <ReputationRow label="State" :value="store.reputation.state" />
      <ReputationRow label="Underworld" :value="store.reputation.underworld" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { AlertCircle } from '@lucide/vue'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useReputationStore } from '@/stores/reputation'
import ReputationRow from '@/components/game/ReputationRow.vue'

const store = useReputationStore()

onMounted(() => store.fetch())
</script>
