
<script setup lang="ts">
defineProps<{ icon: string; title?: string }>()
</script>
<template>
  <button class="rounded-full p-2 hover:bg-gray-100 text-gray-700" :title="title">
    <span class="material-icons">{{ icon }}</span>
  </button>
</template>
