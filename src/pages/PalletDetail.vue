<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useImportStore } from '@/stores/importStore'
import { fmtNum } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useImportStore()

const palletNo = computed(() => String(route.params.palletNo ?? ''))
const ready = computed(() => !!store.summary && store.clean.length > 0)

const items = computed(() => store.clean.filter((r) => r.palletNumber === palletNo.value))

const sortKey = ref<'ident' | 'detail' | 'qty' | 'weight' | 'line'>('ident')
const sortAsc = ref(true)

function lineWeight(weight: number | null, qty: number) {
  return (weight ?? 0) * (qty ?? 0)
}

const sortedItems = computed(() => {
  const arr = [...items.value]
  arr.sort((a, b) => {
    let va: number | string = ''
    let vb: number | string = ''
    switch (sortKey.value) {
      case 'detail':
        va = a.detail
        vb = b.detail
        break
      case 'qty':
        va = a.qty
        vb = b.qty
        break
      case 'weight':
        va = a.weight ?? 0
        vb = b.weight ?? 0
        break
      case 'line':
        va = lineWeight(a.weight, a.qty)
        vb = lineWeight(b.weight, b.qty)
        break
      default:
        va = a.identNumber
        vb = b.identNumber
    }
    if (typeof va === 'string' && typeof vb === 'string') {
      return sortAsc.value ? va.localeCompare(vb) : vb.localeCompare(va)
    }
    const na = Number(va)
    const nb = Number(vb)
    return sortAsc.value ? na - nb : nb - na
  })
  return arr
})

const totals = computed(() => {
  let qty = 0
  let kg = 0
  for (const r of items.value) {
    qty += r.qty
    kg += lineWeight(r.weight, r.qty)
  }
  return { qty, kg, lines: items.value.length }
})

function setSort(key: typeof sortKey.value) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    sortAsc.value = true
  }
}

// ทำ CSV download แบบง่าย
function toCsvValue(v: unknown) {
  const s = String(v ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}
function exportCsv() {
  const header = [
    'IdentNumber',
    'Detail',
    'Type',
    'Weight(kg)',
    'Unit',
    'QTY',
    'LineWeight(kg)',
    'BarCodeNumber',
    'Position',
    'PalletNumber',
  ]
  const body = sortedItems.value.map((r) => [
    r.identNumber,
    r.detail,
    r.type,
    r.weight ?? '',
    r.unit,
    r.qty,
    lineWeight(r.weight, r.qty),
    r.barCodeNumber,
    r.position,
    r.palletNumber,
  ])
  const lines = [header, ...body].map((row) => row.map(toCsvValue).join(',')).join('\n')
  const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pallet_${palletNo.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <button class="rounded border px-3 py-1 text-sm hover:bg-gray-50" @click="router.back()">
        ← Back
      </button>
      <h1 class="text-2xl font-semibold break-all">Pallet: {{ palletNo }}</h1>
    </div>

    <div v-if="!ready" class="rounded border bg-white p-4">
      <p class="text-gray-700">
        ยังไม่มีข้อมูล — โปรดไปที่
        <router-link class="text-blue-600 underline" to="/import">หน้า Import</router-link>
      </p>
    </div>

    <div v-else class="space-y-4">
      <!-- Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="rounded border bg-white p-4">
          <p class="text-gray-500">Lines</p>
          <p class="text-2xl font-bold">{{ totals.lines }}</p>
        </div>
        <div class="rounded border bg-white p-4">
          <p class="text-gray-500">QTY รวม</p>
          <p class="text-2xl font-bold">{{ fmtNum(totals.qty, 0) }}</p>
        </div>
        <div class="rounded border bg-white p-4">
          <p class="text-gray-500">น้ำหนักรวม (kg)</p>
          <p class="text-2xl font-bold">{{ fmtNum(totals.kg) }}</p>
        </div>
      </div>

      <!-- Tools -->
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-600">จัดเรียง:</div>
        <button class="rounded border px-2 py-1 text-sm hover:bg-gray-50" @click="setSort('ident')">
          Ident {{ sortKey === 'ident' ? (sortAsc ? '↑' : '↓') : '' }}
        </button>
        <button
          class="rounded border px-2 py-1 text-sm hover:bg-gray-50"
          @click="setSort('detail')"
        >
          Detail {{ sortKey === 'detail' ? (sortAsc ? '↑' : '↓') : '' }}
        </button>
        <button class="rounded border px-2 py-1 text-sm hover:bg-gray-50" @click="setSort('qty')">
          QTY {{ sortKey === 'qty' ? (sortAsc ? '↑' : '↓') : '' }}
        </button>
        <button
          class="rounded border px-2 py-1 text-sm hover:bg-gray-50"
          @click="setSort('weight')"
        >
          Weight {{ sortKey === 'weight' ? (sortAsc ? '↑' : '↓') : '' }}
        </button>
        <button class="rounded border px-2 py-1 text-sm hover:bg-gray-50" @click="setSort('line')">
          Line weight {{ sortKey === 'line' ? (sortAsc ? '↑' : '↓') : '' }}
        </button>

        <div class="flex-1"></div>
        <button
          class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          @click="exportCsv"
        >
          Export CSV
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-auto rounded border bg-white">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left">Ident</th>
              <th class="px-3 py-2 text-left">Detail</th>
              <th class="px-3 py-2 text-left">Type</th>
              <th class="px-3 py-2 text-right">Weight (kg)</th>
              <th class="px-3 py-2 text-left">Unit</th>
              <th class="px-3 py-2 text-right">QTY</th>
              <th class="px-3 py-2 text-right">Line weight (kg)</th>
              <th class="px-3 py-2 text-left">BarCodeNumber</th>
              <th class="px-3 py-2 text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in sortedItems" :key="i" class="border-t">
              <td class="px-3 py-2 font-mono">{{ r.identNumber }}</td>
              <td class="px-3 py-2">{{ r.detail }}</td>
              <td class="px-3 py-2">{{ r.type }}</td>
              <td class="px-3 py-2 text-right">{{ r.weight == null ? '-' : fmtNum(r.weight) }}</td>
              <td class="px-3 py-2">{{ r.unit || '-' }}</td>
              <td class="px-3 py-2 text-right">{{ fmtNum(r.qty, 0) }}</td>
              <td class="px-3 py-2 text-right">{{ fmtNum((r.weight ?? 0) * r.qty) }}</td>
              <td class="px-3 py-2 font-mono break-all">{{ r.barCodeNumber }}</td>
              <td class="px-3 py-2">{{ r.position }}</td>
            </tr>
            <tr v-if="sortedItems.length === 0" class="border-t">
              <td colspan="9" class="px-3 py-4 text-center text-gray-500">ไม่มีข้อมูลในพาเลทนี้</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
