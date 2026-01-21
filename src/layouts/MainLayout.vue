<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-dvh bg-gray-50 text-gray-900">
    <header class="sticky top-0 z-10 bg-white border-b">
      <div class="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="font-bold text-lg text-blue-600">Packing & Shipping</RouterLink>
        <nav class="flex items-center gap-4">
          <RouterLink class="hover:text-blue-600" to="/dashboard">Dashboard</RouterLink>
          <RouterLink class="hover:text-blue-600" to="/packing">Packing</RouterLink>
          <RouterLink class="hover:text-blue-600" to="/shipping">Shipping</RouterLink>
          <RouterLink class="hover:text-blue-600" to="/settings">Settings</RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6">
      <RouterView />
    </main>

    <footer class="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-500">
      © {{ new Date().getFullYear() }} Starter Template
    </footer>
  </div>
</template>
