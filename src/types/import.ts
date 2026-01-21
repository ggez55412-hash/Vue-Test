// src/types/import.ts

export type ItemType = 'MHL' | 'EP' | 'PD'

/**
 * รูปแบบแถว "ดิบ" ที่อ่านจาก Excel (หัวตารางเป็นชื่อคอลัมน์เดิมจากไฟล์)
 */
export interface RawRow {
  Position: string
  'Position ident': string
  BarCodeNumber: string
  'Position Detail': string
  IdentNumber: string
  Detail: string
  Type: ItemType | string
  Weight?: string | number | null
  Unit?: string | null
  QTY: string | number
  'Pallet Number': string
  'Work Number': string
  'Seal Number'?: string | null
  ContainerNumber?: string | null
}

/**
 * รูปแบบข้อมูลที่ "ทำความสะอาดแล้ว" สำหรับใช้งานในระบบ
 */
export interface CleanItem {
  position: string
  positionIdent: string
  barCodeNumber: string
  positionDetail: string
  identNumber: string
  detail: string
  type: ItemType
  weight: number | null // หน่วย kg
  unit: 'kg' | '' // normalize เหลือ 'kg' หรือ ''
  qty: number
  palletNumber: string
  workNumber: string
  sealNumber?: string
  containerNumber?: string
}

export interface ImportSummary {
  pallets: Record<string, { lines: number; totalQty: number; totalWeightKg: number }>
  totalLines: number
  totalQty: number
  totalWeightKg: number
  types: Record<string, number>
}

export interface ImportErrors {
  invalidNumbers: number // weight/qty แปลงตัวเลขไม่ได้
  emptyUnitWithWeight: number // weight มีค่าแต่ unit ว่าง
  unitVariants: Record<string, number>
  duplicateIdent: Record<string, number>
}
