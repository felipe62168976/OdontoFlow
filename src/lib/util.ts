export const uid = () => Math.random().toString(36).slice(2, 10)
export const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10)
export const today = () => iso(new Date())
export const addDays = (s: string, n: number) => { const d = new Date(s + 'T12:00'); d.setDate(d.getDate() + n); return iso(d) }
export const fd = (s?: string) => (s ? s.split('-').reverse().join('/') : '')
export const brl = (v: number) => (+v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
export const sum = (a: { val: number }[]) => a.reduce((s, x) => s + +x.val, 0)
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function read<T>(k: string, d: T, s: Storage = localStorage): T { try { const v = s.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
export function toast(t: string, err = false) {
  const e = document.createElement('div'); e.setAttribute('role', 'status')
  e.className = `fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl px-4 py-2 text-white ${err ? 'bg-red-600' : 'bg-nav'}`
  e.textContent = t; document.body.append(e); setTimeout(() => e.remove(), 3200)
}
export function write(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch { toast('Não foi possível salvar neste navegador', true); return false } }
export async function sha(p: string) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('of:' + p)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('') } catch { return btoa(p) }
}
