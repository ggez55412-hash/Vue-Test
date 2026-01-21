
<script setup lang="ts">
  defineOptions({ name: 'UiButton' })
type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
const props = withDefaults(defineProps<{ variant?: Variant; size?: Size; icon?: string; disabled?: boolean }>(), {
  variant: 'primary', size: 'md', disabled: false
})

const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition shadow'
const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base'
}
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-[--color-brand-700] disabled:opacity-50',
  success: 'bg-[--color-success] text-white hover:brightness-95 disabled:opacity-50',
  warning: 'bg-[--color-warning] text-white hover:brightness-95 disabled:opacity-50',
  danger:  'bg-[--color-danger]  text-white hover:brightness-95 disabled:opacity-50',
  outline: 'border text-gray-700 hover:bg-gray-50 disabled:opacity-50',
  ghost:   'text-gray-700 hover:bg-gray-100 disabled:opacity-50'
}
</script>

<template>
  <button :class="[base, sizes[props.size], variants[props.variant]]" :disabled="disabled">
    <span v-if="icon" class="material-icons">{{ icon }}</span>
    <slot />
  </button>
</template>
