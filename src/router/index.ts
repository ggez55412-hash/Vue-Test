import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'Dashboard' } },
  { path: '/dashboard', name: 'Dashboard', component: () => import('@/pages/Dashboard.vue') },
  { path: '/packing', name: 'Packing', component: () => import('@/pages/Packing.vue') },
  { path: '/shipping', name: 'Shipping', component: () => import('@/pages/Shipping.vue') },
  { path: '/settings', name: 'Settings', component: () => import('@/pages/Settings.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFound.vue') },
  { path: '/import', name: 'Import', component: () => import('@/pages/Import.vue') },

  { path: '/pallets', name: 'Pallets', component: () => import('@/pages/Pallets.vue') },
  {
    path: '/pallets/:palletNo',
    name: 'PalletDetail',
    component: () => import('@/pages/PalletDetail.vue'),
  },

  { path: '/import', name: 'Import', component: () => import('@/pages/Import.vue') },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
