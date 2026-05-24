<template>
  <section aria-label="Shop">
    <ShopGrid />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useShopStore } from '@/stores/shop'
import ShopGrid from '@/components/game/ShopGrid.vue'

const store = useShopStore()

onMounted(() => store.fetchItems())
</script>
