
<script setup lang="ts">
import { useToast } from '@/composables/useToast'

// ดึงออกมาเป็น ref ตรง ๆ เพื่อตัดปัญหา type union
const { list, remove } = useToast()
</script>

<template>
  <div class="fixed z-50 right-4 bottom-4 space-y-2">
    <!-- ใช้ list โดยตรง: v-for="t in list" -->
    <div
      v-for="t in list"
      :key="t.id"
      :class="[
        'surface px-4 py-2 shadow-lg flex items-center gap-2 min-w-[260px]',
        t.type === 'success' ? 'border-emerald-300' :
        t.type === 'error'   ? 'border-red-300' :
                               'border-blue-300'
      ]"
    >
      <span
        class="material-icons"
        :class="{
          'text-emerald-600': t.type === 'success',
          'text-red-600':    t.type === 'error',
          'text-blue-600':   t.type === 'info'
        }"
      >
        {{ t.type === 'success' ? 'check_circle'
           : t.type === 'error' ? 'error'
           : 'info' }}
      </span>

      <div class="text-sm flex-1">{{ t.text }}</div>

      <button
        class="text-gray-400 hover:text-gray-600"
        title="Close"
        @click="remove(t.id)"
        aria-label="Close toast"
      >
        <span class="material-icons text-base">close</span>
      </button>
    </div>
  </div>
</template>
