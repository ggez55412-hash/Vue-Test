
<!-- src/layouts/MainLayout.vue -->
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ToastHost from '@/components/common/ToastHost.vue'
</script>

<template>
  <div class="min-h-dvh bg-gray-50 text-gray-900">
    <!-- Topbar -->
    <header class="sticky top-0 z-10 bg-white border-b">
      <div class="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="font-bold text-lg text-blue-600">
          Packing & Shipping
        </RouterLink>

        <nav class="flex items-center gap-4">
          <RouterLink class="hover:text-blue-600" to="/dashboard">Dashboard</RouterLink>
          <RouterLink class="hover:text-blue-600" to="/import">Import</RouterLink>
          <RouterLink class="hover:text-blue-600" to="/pallets">Pallets</RouterLink>
          <RouterLink class="hover:text-blue-600" to="/items">Items</RouterLink>
          <RouterLink class="hover:text-blue-600" to="/settings">Settings</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Page Outlet -->
    <main class="mx-auto max-w-7xl px-4 py-6">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-500">
      © {{ new Date().getFullYear() }} Starter Template
    </footer>

    <!-- Toast host (global) -->
    <ToastHost />
  </div>
</template>
