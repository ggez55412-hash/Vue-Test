
// src/utils/csv.ts
export function toCsvValue(v: unknown): string {
  const s = String(v ?? '')
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

export function exportCsv(filename: string, header: string[], rows: unknown[][]) {
  const lines = [header, ...rows].map(r => r.map(toCsvValue).join(',')).join('\n')
  const blob = new Blob([lines], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
