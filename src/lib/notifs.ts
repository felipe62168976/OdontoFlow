import { Data } from '../types'
import { today, addDays, brl } from './util'
export function notifs(d: Data): string[] {
  const t = today(), nm = (id: string) => d.patients.find((p) => p.id === id)?.name ?? '—'
  return [
    ...d.appts.filter((a) => (a.date === t || a.date === addDays(t, 1)) && ['agendada', 'confirmada'].includes(a.status)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).map((a) => `Consulta ${a.date === t ? 'hoje' : 'amanhã'} às ${a.time}: ${nm(a.pid)}`),
    ...d.fin.filter((f) => f.type === 'receita' && f.status === 'pendente').map((f) => `Pagamento pendente: ${f.desc} (${brl(f.val)})`),
  ]
}
