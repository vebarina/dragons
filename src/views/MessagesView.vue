<template>
  <section aria-label="Available quests">
    <AdList />
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useMessagesStore } from '@/stores/messages'
import AdList from '@/components/game/AdList.vue'

const store = useMessagesStore()

onMounted(() => store.fetchAds())
onUnmounted(() => store.clearResult())
</script>
