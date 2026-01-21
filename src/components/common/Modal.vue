
<script setup lang="ts">
  defineOptions({ name: 'CommonModal' })
  defineProps<{ open: boolean; title?: string }>()
 defineEmits<{ (e:'close'): void }>()
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />
      <div class="relative z-10 surface max-w-lg w-full">
        <div class="flex items-center justify-between border-b p-3">
          <h3 class="font-semibold">{{ title }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="$emit('close')">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4"><slot /></div>
      </div>
    </div>
  </teleport>
</template>
