
// src/utils/xlsxExport.ts
import * as XLSX from 'xlsx'

export function aoaToSheet(aoa: (string|number)[][]) {
  return XLSX.utils.aoa_to_sheet(aoa)
}

export function exportWorkbook(filename: string, sheets: Record<string, (string|number)[][]>) {
  const wb = XLSX.utils.book_new()
  for (const [name, aoa] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(wb, aoaToSheet(aoa), name.slice(0, 31)) // Excel sheet name max 31
  }
  XLSX.writeFile(wb, filename)
}
