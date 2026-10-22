import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../store'
import { Patient } from '../types'
import { today, fd, toast } from '../lib/util'
import { Badge, FormModal, Head, Modal, Table, Field } from '../components/ui'

const FIELDS: Field[] = [{ k: 'name', l: 'Nome completo', req: true, w: true }, { k: 'dob', l: 'Data de nascimento', t: 'date' }, { k: 'phone', l: 'Telefone', req: true }, { k: 'email', l: 'E-mail (opcional)', t: 'email', w: true }, { k: 'obs', l: 'Observações administrativas', t: 'ta', w: true }]
export default function Patients() {
  const { data: d, upsert } = useApp(); const [sp] = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? ''); const [arch, setArch] = useState(false)
  const [form, setForm] = useState<Partial<Patient> | null>(sp.has('novo') ? {} : null); const [view, setView] = useState<Patient | null>(null)
  const list = d.patients.filter((p) => !!p.arch === arch && (p.name + p.phone).toLowerCase().includes(q.toLowerCase()))
  const nm = (id: string) => d.pros.find((p) => p.id === id)?.name
  return (<>
    <Head t="Pacientes"><button className="btn" onClick={() => setForm({})}>Novo paciente</button></Head>
    <div className="card">
      <div className="mb-3 flex gap-2"><input className="inp !mt-0" placeholder="Buscar por nome ou telefone" aria-label="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="inp !mt-0 !w-auto" value={arch ? '1' : '0'} onChange={(e) => setArch(e.target.value === '1')}><option value="0">Ativos</option><option value="1">Arquivados</option></select></div>
      <Table heads={['Nome', 'Telefone', 'Nascimento', '']} rows={list.map((p) => [p.name, p.phone, fd(p.dob), <span className="flex gap-1" key={p.id}>
        <button className="btn-o" onClick={() => setView(p)}>Ver</button><button className="btn-o" onClick={() => setForm(p)}>Editar</button>
        <button className="btn-o" onClick={() => { upsert('patients', { ...p, arch: !p.arch }); toast(p.arch ? 'Paciente restaurado' : 'Paciente arquivado') }}>{p.arch ? 'Restaurar' : 'Arquivar'}</button></span>])} />
    </div>
    {form && <FormModal title={form.id ? 'Editar paciente' : 'Novo paciente'} fields={FIELDS} values={form} onClose={() => setForm(null)}
      onSave={(o) => { upsert('patients', { created: today(), ...form, ...o }); toast('Paciente salvo') }} />}
    {view && <Modal title={view.name} onClose={() => setView(null)}>
      <p className="text-sm">{view.phone} · {view.email || 'sem e-mail'}<br />Nascimento: {fd(view.dob) || '—'} · Cadastro: {fd(view.created)}<br />{view.obs}</p>
      <h4 className="mt-3 font-bold">Consultas</h4><Table heads={['Data', 'Procedimento', 'Status']} rows={d.appts.filter((a) => a.pid === view.id).sort((a, b) => b.date.localeCompare(a.date)).map((a) => [fd(a.date) + ' ' + a.time, a.proc, <Badge key={a.id} c={a.status === 'concluída' || a.status === 'confirmada' ? 'g' : a.status === 'agendada' ? '' : 'r'}>{a.status}</Badge>])} />
      <h4 className="mt-3 font-bold">Tratamentos</h4><Table heads={['Procedimento', 'Profissional', 'Status']} rows={d.treats.filter((t) => t.pid === view.id).map((t) => [t.proc, nm(t.prid), t.status])} />
    </Modal>}
  </>)
}
