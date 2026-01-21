<script setup lang="ts">
defineOptions({ name: 'UiCard' })
</script>

<template>
  <div class="rounded-lg border bg-white shadow-sm p-4">
    <slot />
  </div>
</template>
