
<script setup lang="ts">
type Col = {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
}

const { columns, rows, sortKey, sortAsc } = defineProps<{
  columns: Col[]
  rows: Record<string, unknown>[]
  sortKey?: string
  sortAsc?: boolean
}>()

const emit = defineEmits<{ (e: 'sort', key: string): void }>()

function cellClass(col: Col) {
  return [
    'px-3 py-2',
    col.align === 'right' ? 'text-right' :
    col.align === 'center' ? 'text-center' : 'text-left'
  ]
}

function headerButtonClass(col: Col) {
  return [
    'inline-flex items-center gap-1 hover:underline',
    col.key === sortKey
      ? (sortAsc ? 'text-blue-600' : 'text-blue-600')
      : 'text-gray-700'
  ]
}
</script>

<template>
  <div class="overflow-auto surface">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th v-for="c in columns" :key="c.key" class="px-3 py-2 text-left">
            <button
              v-if="c.sortable"
              :class="headerButtonClass(c)"
              @click="emit('sort', c.key)"
              :title="c.key === sortKey ? (sortAsc ? 'Ascending' : 'Descending') : 'Sortable'"
            >
              <span>{{ c.label }}</span>
              <span class="material-icons text-base">
                <!-- แสดงไอคอนเรียง เมื่อคอลัมน์เป็นคีย์เรียงปัจจุบัน -->
                {{
                  c.key === sortKey
                    ? (sortAsc ? 'arrow_upward' : 'arrow_downward')
                    : 'swap_vert'
                }}
              </span>
            </button>
            <span v-else>{{ c.label }}</span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(r, i) in rows" :key="i" class="border-t">
          <td v-for="c in columns" :key="c.key" :class="cellClass(c)">
            {{ (r as any)[c.key] }}
          </td>
        </tr>

        <tr v-if="rows.length === 0" class="border-t">
          <td :colspan="columns.length" class="px-3 py-6 text-center text-gray-500">
            ไม่พบข้อมูล
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
