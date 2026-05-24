import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/WelcomeView.vue'),
      beforeEnter: () => {
        const game = useGameStore()
        if (game.phase === 'won' || game.phase === 'dead') return '/game-over'
      },
    },
    {
      path: '/game',
      component: () => import('@/views/GameView.vue'),
      beforeEnter: () => {
        const game = useGameStore()
        if (game.phase === 'idle') return '/'
        if (game.phase === 'won' || game.phase === 'dead') return '/game-over'
      },
      children: [
        { path: '', redirect: '/game/messages' },
        { path: 'messages', component: () => import('@/views/MessagesView.vue') },
        { path: 'shop', component: () => import('@/views/ShopView.vue') },
        { path: 'reputation', component: () => import('@/views/ReputationView.vue') },
      ],
    },
    {
      path: '/game-over',
      component: () => import('@/views/GameOverView.vue'),
      beforeEnter: () => {
        const game = useGameStore()
        if (game.phase === 'idle') return '/'
        if (game.phase === 'playing') return '/game/messages'
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
