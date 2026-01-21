// src/stores/importStore.ts
import { defineStore } from 'pinia'
import type { RawRow, CleanItem, ImportErrors, ImportSummary, ItemType } from '@/types/import'

/** แปลงค่าใด ๆ ให้เป็น number หรือ null (ไม่ใช้ any) */
function toNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const s = v.trim()
    if (s === '') return null
    const n = Number(s.replace(/,/g, ''))
    return Number.isFinite(n) ? n : null
  }
  return null
}

/** normalize หน่วยน้ำหนักให้เหลือ 'kg' หรือ '' */
function normalizeUnit(u: unknown): 'kg' | '' {
  if (u === null || u === undefined) return ''
  const s = String(u).trim().toLowerCase()
  if (s === '' || s === '&nbsp;') return ''
  if (s === 'kg' || s === 'kg.') return 'kg'
  // ถ้าเป็นรูปแบบอื่น ๆ เก็บเป็น '' ไปก่อน แล้วให้ไปดูจาก error report (unitVariants)
  return '' // จะเก็บตัวแปรรูปแบบใน unitVariants แทน
}

/** normalize ประเภทสินค้าให้เป็น 3 กลุ่มหลัก */
function normalizeType(t: unknown): ItemType {
  const s = String(t ?? '')
    .trim()
    .toUpperCase()
  if (s === 'MHL' || s === 'EP' || s === 'PD') return s as ItemType
  return 'EP'
}

export const useImportStore = defineStore('import', {
  state: () => ({
    raw: [] as RawRow[],
    clean: [] as CleanItem[],
    errors: null as ImportErrors | null,
    summary: null as ImportSummary | null,
  }),

  actions: {
    setRaw(rows: RawRow[]) {
      this.raw = rows
      this.clean = []
      this.errors = null
      this.summary = null
    },

    cleanAndValidate() {
      const unitBucket: Record<string, number> = {}
      const dupBucket: Record<string, number> = {}
      let invalidNumbers = 0
      let emptyUnitWithWeight = 0

      const clean: CleanItem[] = this.raw.map((r) => {
        const weight = toNumber(r.Weight)
        const qty = toNumber(r.QTY)
        const unitNormalized = normalizeUnit(r.Unit)
        const type = normalizeType(r.Type)

        if (qty === null) invalidNumbers++
        if (weight !== null && unitNormalized === '') emptyUnitWithWeight++

        // เก็บสถิติ unit variants (เก็บค่าจริงที่อ่านมา เพื่อให้ report ได้ว่าเจอรูปแบบอะไรบ้าง)
        const unitRaw = String(r.Unit ?? '')
          .trim()
          .toLowerCase()
        if (unitRaw !== '') {
          unitBucket[unitRaw] = (unitBucket[unitRaw] ?? 0) + 1
        }

        const ident = String(r.IdentNumber ?? '').trim()
        if (ident) dupBucket[ident] = (dupBucket[ident] ?? 0) + 1

        const item: CleanItem = {
          position: String(r.Position ?? '').trim(),
          positionIdent: String(r['Position ident'] ?? '').trim(),
          barCodeNumber: String(r.BarCodeNumber ?? '').trim(),
          positionDetail: String(r['Position Detail'] ?? '').trim(),
          identNumber: ident,
          detail: String(r.Detail ?? '').trim(),
          type,
          weight,
          unit: unitNormalized, // 'kg' | ''
          qty: qty ?? 0,
          palletNumber: String(r['Pallet Number'] ?? '').trim(),
          workNumber: String(r['Work Number'] ?? '').trim(),
          sealNumber: r['Seal Number'] == null ? undefined : String(r['Seal Number']).trim(),
          containerNumber: r.ContainerNumber == null ? undefined : String(r.ContainerNumber).trim(),
        }

        return item
      })

      // รวมสรุป
      const pallets: ImportSummary['pallets'] = {}
      const types: ImportSummary['types'] = {}
      let totalLines = 0
      let totalQty = 0
      let totalWeightKg = 0

      for (const row of clean) {
        totalLines += 1
        totalQty += row.qty
        const lineWeight = (row.weight ?? 0) * (row.qty ?? 0)
        totalWeightKg += lineWeight

        const palletNo = row.palletNumber || 'UNKNOWN'
        if (!pallets[palletNo]) pallets[palletNo] = { lines: 0, totalQty: 0, totalWeightKg: 0 }
        pallets[palletNo].lines += 1
        pallets[palletNo].totalQty += row.qty
        pallets[palletNo].totalWeightKg += lineWeight

        types[row.type] = (types[row.type] ?? 0) + 1
      }

      // Ident ที่ซ้ำ (มากกว่า 1)
      const duplicateIdent: Record<string, number> = {}
      Object.entries(dupBucket).forEach(([k, v]) => {
        if (v > 1) duplicateIdent[k] = v
      })

      this.clean = clean
      this.errors = {
        invalidNumbers,
        emptyUnitWithWeight,
        unitVariants: unitBucket,
        duplicateIdent,
      }
      this.summary = {
        pallets,
        totalLines,
        totalQty,
        totalWeightKg,
        types,
      }
        localStorage.setItem('import.clean', JSON.stringify(this.clean))
        localStorage.setItem('import.summary', JSON.stringify(this.summary))

      },

rehydrate() {
  try {
    const rawClean = localStorage.getItem('import.clean')
    const rawSum = localStorage.getItem('import.summary')
    if (rawClean) this.clean = JSON.parse(rawClean)
    if (rawSum) this.summary = JSON.parse(rawSum)
  } catch { /* noop */ }
}

   },
 }
)
