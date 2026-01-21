
import { reactive, toRefs } from 'vue'

type Toast = { id: number; type: 'success'|'error'|'info'; text: string; ttl: number }
const state = reactive({ list: [] as Toast[], seq: 1 })

export function useToast() {
  function push(text: string, type: Toast['type']='info', ttl=3000) {
    const id = state.seq++
    state.list.push({ id, type, text, ttl })
    setTimeout(() => remove(id), ttl)
  }
  function remove(id: number) { state.list = state.list.filter(t => t.id !== id) }
  return { ...toRefs(state), push, remove }
}
