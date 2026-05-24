<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="container mx-auto px-4 py-4 max-w-2xl flex-1">
      <GameNav class="mb-4" />
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import GameNav from '@/components/layout/GameNav.vue'
</script>
