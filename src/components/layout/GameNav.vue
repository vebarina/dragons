<template>
  <Tabs :model-value="activeTab" class="w-full" @update:model-value="navigate">
    <TabsList class="w-full">
      <TabsTrigger value="messages" class="flex-1">Quests</TabsTrigger>
      <TabsTrigger value="shop" class="flex-1">Shop</TabsTrigger>
      <TabsTrigger value="reputation" class="flex-1">Reputation</TabsTrigger>
    </TabsList>
  </Tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const route = useRoute()
const router = useRouter()

const activeTab = computed(() => {
  if (route.path.includes('shop')) return 'shop'
  if (route.path.includes('reputation')) return 'reputation'
  return 'messages'
})

function navigate(value: string | number) {
  router.push(`/game/${value}`)
}
</script>
