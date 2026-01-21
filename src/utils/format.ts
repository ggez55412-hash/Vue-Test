// src/utils/format.ts
export function fmtNum(n: number | null | undefined, digits = 2): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '-'
  return n.toLocaleString(undefined, { maximumFractionDigits: digits })
}
