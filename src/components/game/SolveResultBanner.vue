<template>
  <Alert
    class="mb-4 border-l-4 shadow-md"
    :class="result.success
      ? 'border-l-emerald-700 [&>svg]:text-emerald-700'
      : 'border-l-destructive text-destructive [&>svg]:text-destructive'"
  >
    <CheckCircle2 v-if="result.success" class="size-4" aria-hidden="true" />
    <XCircle v-else class="size-4" aria-hidden="true" />
    <AlertTitle
      class="font-heading"
      :class="result.success ? 'text-emerald-800' : ''"
    >
      {{ result.success ? 'Quest complete!' : 'Quest failed' }}
    </AlertTitle>
    <AlertDescription :class="result.success ? 'text-emerald-900' : ''">
      {{ result.message }}
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { CheckCircle2, XCircle } from '@lucide/vue'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import type { SolveResult } from '@/types/messages'

defineProps<{ result: SolveResult }>()
</script>
