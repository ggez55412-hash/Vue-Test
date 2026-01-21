
<script setup lang="ts">
  defineOptions({ name: 'UiBadge' })
defineProps<{ color?: 'gray'|'blue'|'green'|'amber'|'red' }>()
</script>
<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      color==='blue'  ? 'bg-blue-50  text-blue-700  border border-blue-200'  :
      color==='green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
      color==='amber' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
      color==='red'   ? 'bg-red-50   text-red-700   border border-red-200' :
                        'bg-gray-50  text-gray-700  border border-gray-200'
    ]"
  ><slot /></span>
</template>
