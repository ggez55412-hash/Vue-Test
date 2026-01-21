
<script setup lang="ts">
  defineOptions({ name: 'ItemsPage' })
import { computed, ref, onMounted } from 'vue'
import { useImportStore } from '@/stores/importStore'
import Button from '@/components/ui/Button.vue'
import { exportCsv } from '@/utils/csv'
import { fmtNum } from '@/utils/format'

const store = useImportStore()
const q = ref(''); const type = ref<'ALL'|'MHL'|'EP'|'PD'>('ALL')

onMounted(() => { if (!store.summary || store.clean.length===0) store.rehydrate() })

type Row = { ident: string; detail: string; type: string; qty: number; kg: number; palletCount: number }

const items = computed<Row[]>(() => {
  const map = new Map<string, { detail: string; type: string; qty: number; kg: number; pallets: Set<string> }>()
  for (const r of store.clean) {
    const it = map.get(r.identNumber) ?? { detail: r.detail, type: r.type, qty: 0, kg: 0, pallets: new Set<string>() }
    it.qty += r.qty; it.kg += (r.weight ?? 0)*r.qty; it.pallets.add(r.palletNumber)
    map.set(r.identNumber, it)
  }
  let arr = Array.from(map, ([ident,v]) => ({ ident, detail:v.detail, type:v.type, qty:v.qty, kg:v.kg, palletCount:v.pallets.size }))
  if (type.value!=='ALL') arr = arr.filter(x=>x.type===type.value)
  if (q.value) { const s=q.value.toLowerCase(); arr=arr.filter(x=>x.ident.toLowerCase().includes(s)||x.detail.toLowerCase().includes(s)) }
  return arr.sort((a,b)=>a.ident.localeCompare(b.ident))
})

function exportItemsSummary() {
  const header = ['IdentNumber','Detail','Type','TotalQTY','TotalWeight(kg)','PalletCount']
  const rows = items.value.map(r => [r.ident, r.detail, r.type, r.qty, r.kg, r.palletCount])
  exportCsv('items_summary.csv', header, rows)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-semibold">Items Summary</h1>
      <Button icon="file_download" variant="success" @click="exportItemsSummary">Export</Button>
      <div class="flex-1"></div>
      <select v-model="type" class="rounded-md border px-2 py-1">
        <option value="ALL">ALL</option><option value="MHL">MHL</option><option value="EP">EP</option><option value="PD">PD</option>
      </select>
      <input v-model="q" class="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="ค้นหา Ident/Detail…" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="surface p-4"><p class="text-gray-500">จำนวนรายการ</p><p class="text-2xl font-bold">{{ items.length }}</p></div>
      <div class="surface p-4"><p class="text-gray-500">QTY รวม</p><p class="text-2xl font-bold">{{ fmtNum(items.reduce((s,r)=>s+r.qty,0),0) }}</p></div>
      <div class="surface p-4"><p class="text-gray-500">น้ำหนักรวม (kg)</p><p class="text-2xl font-bold">{{ fmtNum(items.reduce((s,r)=>s+r.kg,0)) }}</p></div>
    </div>

    <div class="overflow-auto surface">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left">Ident</th>
            <th class="px-3 py-2 text-left">Detail</th>
            <th class="px-3 py-2 text-left">Type</th>
            <th class="px-3 py-2 text-right">TotalQTY</th>
            <th class="px-3 py-2 text-right">TotalWeight(kg)</th>
            <th class="px-3 py-2 text-right">PalletCount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r,i) in items" :key="i" class="border-t">
            <td class="px-3 py-2 font-mono">{{ r.ident }}</td>
            <td class="px-3 py-2">{{ r.detail }}</td>
            <td class="px-3 py-2">{{ r.type }}</td>
            <td class="px-3 py-2 text-right">{{ fmtNum(r.qty,0) }}</td>
            <td class="px-3 py-2 text-right">{{ fmtNum(r.kg) }}</td>
            <td class="px-3 py-2 text-right">{{ r.palletCount }}</td>
          </tr>
          <tr v-if="items.length===0" class="border-t"><td colspan="6" class="px-3 py-6 text-center text-gray-500">ไม่พบข้อมูล</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
``
