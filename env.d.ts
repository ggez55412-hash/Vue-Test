/// <reference types="vite/client" />

// ให้ TS เข้าใจการ import ไฟล์ .vue
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // ใช้ Record<string, never> แทน {} เพื่อเลี่ยง no-empty-object-type
  // และใช้ unknown แทน any เพื่อเลี่ยง no-explicit-any
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

// (ตัวเลือก) ระบุชนิดตัวแปรแวดล้อมของ Vite
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
