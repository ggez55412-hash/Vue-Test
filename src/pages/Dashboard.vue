<script setup lang="ts">
defineOptions({ name: 'DashboardPage' })
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-2xl font-semibold">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded border bg-white p-4 shadow-sm">
        <p class="text-gray-500">Pending Orders</p>
        <p class="text-3xl font-bold text-blue-600">0</p>
      </div>
      <div class="rounded border bg-white p-4 shadow-sm">
        <p class="text-gray-500">Packing</p>
        <p class="text-3xl font-bold text-yellow-600">0</p>
      </div>
      <div class="rounded border bg-white p-4 shadow-sm">
        <p class="text-gray-500">Shipped</p>
        <p class="text-3xl font-bold text-green-600">0</p>
      </div>
    </div>
  </section>
</template>
