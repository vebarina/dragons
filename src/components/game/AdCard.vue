<template>
  <Card class="transition-all hover:shadow-md hover:brightness-[0.97]">
    <CardHeader class="pb-2">
      <div class="flex items-start justify-between gap-2">
        <CardTitle
          class="text-base leading-snug"
          :class="!isDecoded ? 'break-all' : ''"
        >
          {{ displayMessage }}
        </CardTitle>
        <Badge v-if="isDecoded" variant="outline" class="shrink-0">
          {{ displayProbability }}
        </Badge>
        <Lock v-else-if="isEncrypted" class="shrink-0 size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </CardHeader>
    <CardContent class="flex items-center justify-between">
      <div class="flex items-center gap-3 text-sm text-muted-foreground">
        <span class="flex items-center gap-1">
          <Coins class="size-3.5" aria-hidden="true" />
          {{ ad.reward }}
        </span>
        <span class="flex items-center gap-1">
          <Clock class="size-3.5" aria-hidden="true" />
          {{ ad.expiresIn }} {{ ad.expiresIn === 1 ? 'turn' : 'turns' }} left
        </span>
      </div>
      <Button
        v-if="isDecoded"
        size="sm"
        :disabled="isSolving"
        :aria-busy="isSolving"
        aria-label="Solve quest"
        @click="$emit('solve', solveAdId)"
      >
        <Loader2 v-if="isSolving" class="size-4 animate-spin" aria-hidden="true" />
        <span v-else>Solve</span>
      </Button>
      <Button
        v-else
        size="sm"
        variant="outline"
        :disabled="isAnimating"
        :aria-busy="isAnimating"
        @click="decode"
      >
        <Loader2 v-if="isAnimating" class="size-4 animate-spin mr-1" aria-hidden="true" />
        {{ isAnimating ? 'Decoding…' : 'Decode' }}
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Coins, Clock, Loader2, Lock } from '@lucide/vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { decodeText } from '@/lib/decrypt'
import type { Ad } from '@/types/messages'

const props = defineProps<{
  ad: Ad
  isSolving: boolean
}>()

defineEmits<{ solve: [adId: string] }>()

const isEncrypted = computed(() => !!props.ad.encrypted)
const solveAdId = props.ad.encrypted ? decodeText(props.ad.adId, props.ad.encrypted) : props.ad.adId
const displayMessage = ref(props.ad.message)
const displayProbability = ref(props.ad.probability)
const isDecoded = ref(!props.ad.encrypted)
const isAnimating = ref(false)

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

async function decode() {
  if (!props.ad.encrypted || isDecoded.value || isAnimating.value) return

  isAnimating.value = true
  const targetMessage = decodeText(props.ad.message, props.ad.encrypted)
  const targetProbability = decodeText(props.ad.probability, props.ad.encrypted)

  await new Promise<void>(resolve => {
    const totalSteps = 24
    const tickMs = 45
    let step = 0

    const timer = setInterval(() => {
      step++
      const lockedCount = Math.floor((step / totalSteps) * targetMessage.length)

      displayMessage.value = targetMessage
        .split('')
        .map((char, i) => {
          if (i < lockedCount) return char
          if (char === ' ') return ' '
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
        .join('')

      if (step >= totalSteps) {
        clearInterval(timer)
        displayMessage.value = targetMessage
        resolve()
      }
    }, tickMs)
  })

  displayProbability.value = targetProbability
  isDecoded.value = true
  isAnimating.value = false
}

</script>
