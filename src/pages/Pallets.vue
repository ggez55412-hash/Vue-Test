<script setup lang="ts">
defineOptions({ name: 'PalletsPage' })
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useImportStore } from '@/stores/importStore'
import { fmtNum } from '@/utils/format'
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const stores = useImportStore()
const settings = useSettingsStore()

onMounted(() => {
  settings.hydrate()
  if (!stores.summary || stores.clean.length === 0) stores.rehydrate()
})


type PalletEntry = {
  palletNo: string
  lines: number
  totalQty: number
  totalWeightKg: number
}

const store = useImportStore()
const router = useRouter()
const q = ref('')

const ready = computed(() => !!store.summary && store.clean.length > 0)

const pallets = computed<PalletEntry[]>(() => {
  if (!store.summary) return []
  const arr = Object.entries(store.summary.pallets).map(([palletNo, v]) => ({
    palletNo,
    lines: v.lines,
    totalQty: v.totalQty,
    totalWeightKg: v.totalWeightKg,
  }))
  return arr
    .filter((p) => !q.value || p.palletNo.toLowerCase().includes(q.value.toLowerCase()))
    .sort((a, b) => a.palletNo.localeCompare(b.palletNo))
})

const totals = computed(() => ({
  lines: store.summary?.totalLines ?? 0,
  qty: store.summary?.totalQty ?? 0,
  kg: store.summary?.totalWeightKg ?? 0,
}))

function openPallet(palletNo: string) {
  router.push(`/pallets/${encodeURIComponent(palletNo)}`)
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Pallets</h1>

    <div v-if="!ready" class="rounded border bg-white p-4">
      <p class="text-gray-700">
        ยังไม่มีข้อมูลให้แสดง — โปรดไปที่
        <router-link class="text-blue-600 underline" to="/import">หน้า Import</router-link>
        เพื่ออัปโหลดไฟล์และทำความสะอาดข้อมูลก่อน
      </p>
    </div>

    <div v-else class="space-y-4">
      <!-- Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="rounded border bg-white p-4">
          <p class="text-gray-500">จำนวนแถวทั้งหมด</p>
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
        <input
          v-model="q"
          type="text"
          placeholder="ค้นหา Pallet Number…"
          class="w-full md:w-80 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Pallet cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="p in pallets"
          :key="p.palletNo"
          class="rounded-lg border bg-white p-4 shadow-sm hover:shadow transition cursor-pointer"
          @click="openPallet(p.palletNo)"
        >
          <p class="text-sm text-gray-500">Pallet</p>
          <p class="text-lg font-semibold text-blue-600 break-all">{{ p.palletNo }}</p>

          <div class="mt-3 grid grid-cols-3 gap-2 text-sm">
            <div class="rounded border p-2 text-center">
              <p class="text-gray-500">Lines</p>
              <p class="font-semibold">{{ p.lines }}</p>
            </div>
            <div class="rounded border p-2 text-center">
              <p class="text-gray-500">QTY</p>
              <p class="font-semibold">{{ fmtNum(p.totalQty, 0) }}</p>
            </div>
            <div class="rounded border p-2 text-center">
              <p class="text-gray-500">Weight</p>
              <p class="font-semibold">{{ fmtNum(p.totalWeightKg) }} kg</p>
            </div>
          </div>

          <p class="mt-2 text-xs text-gray-500">คลิกเพื่อดูรายละเอียด</p>
        </div>
      </div>
    </div>
  </div>
</template>
