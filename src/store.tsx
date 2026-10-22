import { createContext, useContext, useState, ReactNode } from 'react'
import { Data, User, PROCS } from './types'
import { read, write, uid, sha, today, addDays, toast } from './lib/util'

const EMPTY: Data = { patients: [], pros: [], appts: [], treats: [], fin: [] }
type Ctx = {
  user: User | null; data: Data
  login: (email: string, pw: string, remember: boolean) => Promise<string | null>
  register: (name: string, clinic: string, email: string, pw: string) => Promise<string | null>
  logout: () => void; renameClinic: (n: string) => void
  upsert: (k: keyof Data, item: { id?: string } & Record<string, any>) => void
  remove: (k: keyof Data, id: string) => void
  clear: () => void; seed: () => void
}
const C = createContext<Ctx>(null!)
export const useApp = () => useContext(C)
const loadData = (id: string): Data => ({ ...EMPTY, ...read<Partial<Data>>('of_d_' + id, {}) })

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const s = read<{ id: string } | null>('of_s', null, sessionStorage) ?? read<{ id: string } | null>('of_s', null)
    return s ? read<User[]>('of_u', []).find((u) => u.id === s.id) ?? null : null
  })
  const [data, setData] = useState<Data>(() => (user ? loadData(user.id) : EMPTY))
  const persist = (n: Data) => { if (user) write('of_d_' + user.id, n); setData(n) }
  const start = (u: User, remember: boolean) => {
    (remember ? localStorage : sessionStorage).setItem('of_s', JSON.stringify({ id: u.id })); setUser(u); setData(loadData(u.id))
  }
  const value: Ctx = {
    user, data,
    async register(name, clinic, email, pw) {
      const us = read<User[]>('of_u', []); email = email.trim().toLowerCase()
      if (us.some((u) => u.email === email)) return 'Este e-mail já tem cadastro. Use a aba Entrar.'
      const u: User = { id: uid(), name: name.trim(), clinic: clinic.trim(), email, hash: await sha(pw) }
      if (!write('of_u', [...us, u])) return 'Falha ao salvar a conta.'
      write('of_d_' + u.id, { ...EMPTY, pros: [{ id: uid(), name: u.name, esp: 'Responsável' }] }); start(u, false); return null
    },
    async login(email, pw, remember) {
      const h = await sha(pw), u = read<User[]>('of_u', []).find((x) => x.email === email.trim().toLowerCase() && x.hash === h)
      if (!u) return 'E-mail ou senha incorretos.'
      start(u, remember); return null
    },
    logout() { localStorage.removeItem('of_s'); sessionStorage.removeItem('of_s'); setUser(null); setData(EMPTY) },
    renameClinic(n) { if (!user) return; const u = { ...user, clinic: n }; write('of_u', read<User[]>('of_u', []).map((x) => (x.id === u.id ? u : x))); setUser(u) },
    upsert(k, item) {
      const list = data[k] as any[], it = { ...item, id: item.id ?? uid() }
      persist({ ...data, [k]: list.some((x) => x.id === it.id) ? list.map((x) => (x.id === it.id ? it : x)) : [...list, it] })
    },
    remove(k, id) { persist({ ...data, [k]: (data[k] as any[]).filter((x) => x.id !== id) }) },
    clear() { persist({ ...EMPTY, pros: data.pros }) },
    seed() {
      const t = today(), pr = data.pros[0]?.id ?? '', P = ['Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Diego Rocha'].map((n, i) => ({ id: uid(), name: n + ' (fictício)', phone: '(49) 99999-000' + i, dob: `199${i}-05-1${i}`, email: '', obs: '', created: t }))
      const st = ['confirmada', 'agendada', 'concluída', 'cancelada'] as const
      persist({ ...data, patients: [...data.patients, ...P],
        appts: [...data.appts, ...P.map((p, i) => ({ id: uid(), pid: p.id, prid: pr, date: i < 2 ? t : addDays(t, -i), time: `${9 + i}:00`.padStart(5, '0'), dur: 30, proc: PROCS[i], status: st[i] }))],
        treats: [...data.treats, { id: uid(), pid: P[0].id, prid: pr, proc: 'Canal', date: addDays(t, 7), val: 900, status: 'planejado', obs: '' }],
        fin: [...data.fin, { id: uid(), desc: 'Limpeza (fictício)', type: 'receita', val: 200, status: 'pago', method: 'Pix', date: t }, { id: uid(), desc: 'Canal (fictício)', type: 'receita', val: 900, status: 'pendente', method: 'Boleto', date: t }, { id: uid(), desc: 'Material odontológico', type: 'despesa', val: 350, status: 'pago', method: 'Pix', date: t }] })
      toast('Dados fictícios carregados')
    },
  }
  return <C.Provider value={value}>{children}</C.Provider>
}
