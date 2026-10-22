import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../store'
import { Appt, ApptStatus, PROCS, STATUS, OFF } from '../types'
import { today, addDays, fd, mins, toast } from '../lib/util'
import { Badge, FormModal, Head, Table } from '../components/ui'

type Mode = 'day' | 'week' | 'month'
export default function Agenda() {
  const { data: d, upsert } = useApp(); const [sp] = useSearchParams()
  const [mode, setMode] = useState<Mode>('day'); const [date, setDate] = useState(today()); const [form, setForm] = useState<Partial<Appt> | null>(sp.has('novo') ? { date: today(), dur: 30, status: 'agendada' } : null)
  const [a, b] = mode === 'day' ? [date, date] : mode === 'week' ? (() => { const s = addDays(date, -((new Date(date + 'T12:00').getDay() + 6) % 7)); return [s, addDays(s, 6)] })() : [date.slice(0, 8) + '01', date.slice(0, 8) + '31']
  const list = d.appts.filter((x) => x.date >= a && x.date <= b).sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time))
  const nm = (id: string) => d.patients.find((p) => p.id === id)?.name, pr = (id: string) => d.pros.find((p) => p.id === id)?.name
  const step = (n: number) => setDate(mode === 'day' ? addDays(date, n) : mode === 'week' ? addDays(date, 7 * n) : addDays(date.slice(0, 8) + '15', 30 * n))
  const open = () => d.patients.some((p) => !p.arch) ? setForm({ date, dur: 30, status: 'agendada' }) : toast('Cadastre um paciente primeiro', true)
  const setStatus = (x: Appt, s: ApptStatus) => { upsert('appts', { ...x, status: s }); toast('Status: ' + s) }
  function save(o: Record<string, string>) {
    const dur = +o.dur || 30, c = d.appts.find((x) => x.id !== form?.id && x.prid === o.prid && x.date === o.date && !OFF.includes(x.status) && mins(x.time) < mins(o.time) + dur && mins(o.time) < mins(x.time) + x.dur)
    if (c && !OFF.includes(o.status as ApptStatus)) return `Conflito: ${pr(o.prid)} já tem consulta às ${c.time} nesse dia.`
    upsert('appts', { ...form, ...o, dur }); toast('Consulta salva')
  }
  return (<>
    <Head t="Agenda"><button className="btn" onClick={open}>Agendar consulta</button></Head>
    <div className="card">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select className="inp !mt-0 !w-auto" value={mode} onChange={(e) => setMode(e.target.value as Mode)}><option value="day">Dia</option><option value="week">Semana</option><option value="month">Mês</option></select>
        <button className="btn-o" aria-label="Anterior" onClick={() => step(-1)}>‹</button><input type="date" className="inp !mt-0 !w-auto" value={date} onChange={(e) => setDate(e.target.value || today())} /><button className="btn-o" aria-label="Próximo" onClick={() => step(1)}>›</button>
        <span className="text-sm text-slate-500">{fd(a)} a {fd(b)}</span></div>
      <Table heads={['Data', 'Hora', 'Paciente', 'Profissional', 'Procedimento', 'Status', '']} rows={list.map((x) => [fd(x.date), x.time, nm(x.pid), pr(x.prid), x.proc,
        <select key={x.id} aria-label="Status" className="rounded-lg border px-2 py-1" value={x.status} onChange={(e) => setStatus(x, e.target.value as ApptStatus)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>,
        <span className="flex gap-1" key={x.id + 'a'}><button className="btn-o" onClick={() => setForm(x)}>Editar</button>{!OFF.includes(x.status) && <button className="btn-o" onClick={() => setStatus(x, 'cancelada')}>Cancelar</button>}{OFF.includes(x.status) && <Badge c="r">{x.status}</Badge>}</span>])} />
    </div>
    {form && <FormModal title={form.id ? 'Editar consulta' : 'Agendar consulta'} onClose={() => setForm(null)} values={form} onSave={save}
      fields={[{ k: 'pid', l: 'Paciente', o: d.patients.filter((p) => !p.arch).map((p) => [p.id, p.name]), w: true }, { k: 'prid', l: 'Profissional', o: d.pros.map((p) => [p.id, p.name]), w: true }, { k: 'date', l: 'Data', t: 'date', req: true }, { k: 'time', l: 'Horário', t: 'time', req: true }, { k: 'dur', l: 'Duração (min)', t: 'number' }, { k: 'proc', l: 'Procedimento', o: PROCS }, { k: 'status', l: 'Status', o: STATUS }]} />}
  </>)
}
