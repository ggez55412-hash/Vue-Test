<script setup lang="ts">
defineOptions({ name: 'UiButton' })

type Variant = 'primary' | 'secondary' | 'ghost'
const props = withDefaults(defineProps<{ variant?: Variant; disabled?: boolean }>(), {
  variant: 'primary',
  disabled: false,
})

const base =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition'
const variants: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-200',
  ghost: 'text-gray-700 hover:bg-gray-100',
}
</script>

<template>
  <button :class="[base, variants[props.variant]]" :disabled="props.disabled">
    <slot />
  </button>
</template>
