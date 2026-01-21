
// src/stores/settingsStore.ts
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    maxPalletWeightKg: 1000, // เพดานน้ำหนักพาเลทเริ่มต้น
  }),
  actions: {
    setMaxPalletWeightKg(v: number) {
      this.maxPalletWeightKg = Math.max(0, v || 0)
      localStorage.setItem('settings', JSON.stringify({ maxPalletWeightKg: this.maxPalletWeightKg }))
    },
    hydrate() {
      try {
        const raw = localStorage.getItem('settings')
        if (raw) {
          const s = JSON.parse(raw)
          if (typeof s.maxPalletWeightKg === 'number') this.maxPalletWeightKg = s.maxPalletWeightKg
        }
      } catch { /* noop */ }
    }
  }
})
