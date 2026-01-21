// src/utils/excel.ts
import * as XLSX from 'xlsx'
import type { RawRow } from '@/types/import'

type Cell = string | number | boolean | null | undefined

/** คืนค่า string (trim) เสมอ */
function s(v: Cell): string {
  return String(v ?? '').trim()
}

/** คืนค่า string (trim) หรือ null ถ้าเป็นค่าว่าง */
function sOrNull(v: Cell): string | null {
  const t = s(v)
  return t === '' ? null : t
}

/** คืนค่าให้ตรงชนิด RawRow.Weight = string | number | null */
function weightValue(v: Cell): string | number | null {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const t = v.trim()
    return t === '' ? null : t
  }
  // ถ้าเป็น boolean หรือชนิดอื่น -> ตัดทิ้งให้เป็น null
  return null
}

/** คืนค่าให้ตรงชนิด RawRow.QTY = string | number */
function qtyValue(v: Cell): string | number {
  if (typeof v === 'number') return v
  if (typeof v === 'string') return v
  if (typeof v === 'boolean') return String(v) // แปลงเป็น "true"/"false" (ยังเป็น string ตามชนิดที่ยอมรับ)
  // อื่น ๆ ให้เป็น string ว่าง
  return ''
}

/** อ่านไฟล์ Excel (.xlsx) แล้วแมปเป็น RawRow[] อย่างเคร่งครัด */
export async function parseExcel(file: File): Promise<RawRow[]> {
  const data = await file.arrayBuffer()
  const wb = XLSX.read(data, { type: 'array' })
  const wsName = wb.SheetNames[0]
  const ws = wb.Sheets[wsName]

  const rows = XLSX.utils.sheet_to_json<Cell[]>(ws, { header: 1, raw: false })
  if (!Array.isArray(rows) || rows.length === 0) return []

  // header (แถวแรก)
  const headerRow = (rows[0] ?? []) as Cell[]
  const H = headerRow.map((h) => s(h))
  const idx = (name: string): number => H.findIndex((h) => h === name)

  const iPosition = idx('Position')
  const iPositionIdent = idx('Position ident')
  const iBarCodeNumber = idx('BarCodeNumber')
  const iPositionDetail = idx('Position Detail')
  const iIdentNumber = idx('IdentNumber')
  const iDetail = idx('Detail')
  const iType = idx('Type')
  const iWeight = idx('Weight')
  const iUnit = idx('Unit')
  const iQTY = idx('QTY')
  const iPallet = idx('Pallet Number')
  const iWork = idx('Work Number')
  const iSeal = idx('Seal Number')
  const iContainer = idx('ContainerNumber')

  const required = [
    ['Position', iPosition],
    ['Position ident', iPositionIdent],
    ['BarCodeNumber', iBarCodeNumber],
    ['Position Detail', iPositionDetail],
    ['IdentNumber', iIdentNumber],
    ['Detail', iDetail],
    ['Type', iType],
    ['Weight', iWeight],
    ['Unit', iUnit],
    ['QTY', iQTY],
    ['Pallet Number', iPallet],
    ['Work Number', iWork],
  ] as const

  const missing = required.filter(([, i]) => i < 0).map(([n]) => n)
  if (missing.length) {
    console.warn('Missing required columns:', missing)
    return []
  }

  const body = rows.slice(1) as Cell[][]
  const list: RawRow[] = []

  for (const r of body) {
    const hasValue = r?.some((v) => v !== undefined && v !== null && String(v).trim() !== '')
    if (!hasValue) continue

    const row: RawRow = {
      Position: s(r[iPosition]),
      'Position ident': s(r[iPositionIdent]),
      BarCodeNumber: s(r[iBarCodeNumber]),
      'Position Detail': s(r[iPositionDetail]),
      IdentNumber: s(r[iIdentNumber]),
      Detail: s(r[iDetail]),
      Type: s(r[iType]),
      Weight: weightValue(r[iWeight]), // ← จัดการชนิดแล้ว (string|number|null)
      Unit: sOrNull(r[iUnit]), // ← string|null (ไม่ปล่อย number/boolean)
      QTY: qtyValue(r[iQTY]), // ← string|number (ไม่ปล่อย boolean)
      'Pallet Number': s(r[iPallet]),
      'Work Number': s(r[iWork]),
      'Seal Number': sOrNull(r[iSeal]), // ← string|null
      ContainerNumber: sOrNull(r[iContainer]), // ← string|null
    }

    list.push(row)
  }

  return list
}
