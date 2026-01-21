
<script setup lang="ts">
  defineOptions({ name: 'CommonSkeleton' })
defineProps<{ rows?: number }>()
</script>
<template>
  <div class="space-y-2">
    <div v-for="i in (rows||5)" :key="i" class="h-4 bg-gray-200 rounded animate-pulse"></div>
  </div>
</template>
