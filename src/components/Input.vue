<script setup lang="ts">
defineOptions({ name: 'UiInput' })

defineProps<{ modelValue?: string; placeholder?: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <input
    class="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
  />
</template>
