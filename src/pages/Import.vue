<!-- src/pages/Import.vue -->
<script setup lang="ts">
defineOptions({ name: 'ImportPage' })
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { parseExcel } from '@/utils/excel'
import { useImportStore } from '@/stores/importStore'
import type { RawRow } from '@/types/import'

const file = ref<File | null>(null)
const rows = ref<RawRow[]>([])
const store = useImportStore()
const router = useRouter()

const hasRows = computed(() => rows.value.length > 0)
const previewRows = computed(() => rows.value.slice(0, 20))

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  file.value = input.files[0]
  rows.value = await parseExcel(file.value)
  store.setRaw(rows.value)
}

function onClean() {
  store.cleanAndValidate()
}

function useThisData() {
  if (!store.clean.length) return
  router.push('/pallets')
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Import Excel</h1>

    <div class="rounded border bg-white p-4 space-y-4">
      <input type="file" accept=".xlsx" @change="onFileChange" />
      <p class="text-sm text-gray-600">รองรับไฟล์ .xlsx — แถวแรกต้องเป็นหัวตาราง</p>
    </div>

    <div v-if="hasRows" class="rounded border bg-white p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Preview (20 แถวแรก)</h2>
        <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" @click="onClean">
          Clean & Validate
        </button>
      </div>

      <div class="overflow-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-2 py-1 text-left">Position</th>
              <th class="px-2 py-1 text-left">BarCodeNumber</th>
              <th class="px-2 py-1 text-left">IdentNumber</th>
              <th class="px-2 py-1 text-left">Detail</th>
              <th class="px-2 py-1 text-left">Type</th>
              <th class="px-2 py-1 text-right">Weight</th>
              <th class="px-2 py-1 text-left">Unit</th>
              <th class="px-2 py-1 text-right">QTY</th>
              <th class="px-2 py-1 text-left">Pallet</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in previewRows" :key="i" class="border-t">
              <td class="px-2 py-1">{{ r.Position }}</td>
              <td class="px-2 py-1">{{ r.BarCodeNumber }}</td>
              <td class="px-2 py-1">{{ r.IdentNumber }}</td>
              <td class="px-2 py-1">{{ r.Detail }}</td>
              <td class="px-2 py-1">{{ r.Type }}</td>
              <td class="px-2 py-1 text-right">{{ r.Weight }}</td>
              <td class="px-2 py-1">{{ r.Unit }}</td>
              <td class="px-2 py-1 text-right">{{ r.QTY }}</td>
              <td class="px-2 py-1">{{ r['Pallet Number'] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="store.summary" class="rounded border bg-white p-4 space-y-3">
      <h2 class="text-lg font-semibold">ผลลัพธ์หลัง Clean & Validate</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div class="rounded border p-3">
          <p class="text-gray-500">จำนวนแถวทั้งหมด</p>
          <p class="text-2xl font-bold">{{ store.summary.totalLines }}</p>
        </div>
        <div class="rounded border p-3">
          <p class="text-gray-500">QTY รวม</p>
          <p class="text-2xl font-bold">{{ store.summary.totalQty }}</p>
        </div>
        <div class="rounded border p-3">
          <p class="text-gray-500">น้ำหนักรวม (kg)</p>
          <p class="text-2xl font-bold">{{ store.summary.totalWeightKg.toFixed(2) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded border p-3">
          <p class="font-semibold mb-2">ปัญหาข้อมูล</p>
          <ul class="list-disc list-inside text-sm">
            <li>ตัวเลขผิดรูปแบบ: {{ store.errors?.invalidNumbers ?? 0 }}</li>
            <li>Weight มีค่าแต่ Unit ว่าง: {{ store.errors?.emptyUnitWithWeight ?? 0 }}</li>
            <li>
              รูปแบบ Unit ที่พบ:
              {{ Object.keys(store.errors?.unitVariants ?? {}).join(', ') || '-' }}
            </li>
            <li>IdentNumber ซ้ำ: {{ Object.keys(store.errors?.duplicateIdent ?? {}).length }}</li>
          </ul>
        </div>
        <div class="rounded border p-3">
          <p class="font-semibold mb-2">Pallet Summary (ตัวอย่าง 5 รายการ)</p>
          <ul class="text-sm space-y-1">
            <li
              v-for="(v, k, i) in Object.fromEntries(
                Object.entries(store.summary.pallets).slice(0, 5),
              )"
              :key="`${k}-${i}`"
            >
              <span class="mr-1 text-gray-500">{{ i + 1 }}.</span>
              <span class="font-medium">{{ k }}</span>
              — lines: {{ v.lines }}, qty: {{ v.totalQty }}, weight:
              {{ v.totalWeightKg.toFixed(2) }} kg
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-3">
        <button
          class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          @click="useThisData"
        >
          ใช้ข้อมูลนี้ต่อ → ไปหน้าพาเลท
        </button>
      </div>
    </div>
  </div>
</template>
