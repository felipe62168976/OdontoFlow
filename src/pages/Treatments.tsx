import { useState } from 'react'
import { useApp } from '../store'
import { Treat, PROCS } from '../types'
import { fd, brl, toast } from '../lib/util'
import { Badge, FormModal, Head, Table } from '../components/ui'

export default function Treatments() {
  const { data: d, upsert, remove } = useApp(); const [form, setForm] = useState<Partial<Treat> | null>(null); const [f, setF] = useState('todos')
  const nm = (id: string) => d.patients.find((p) => p.id === id)?.name, pr = (id: string) => d.pros.find((p) => p.id === id)?.name
  const list = d.treats.filter((t) => f === 'todos' || (f === 'pendentes' ? t.status !== 'concluído' : t.status === 'concluído'))
  const open = () => d.patients.some((p) => !p.arch) ? setForm({ status: 'planejado' }) : toast('Cadastre um paciente primeiro', true)
  return (<>
    <Head t="Tratamentos"><select className="inp !mt-0 !w-auto" value={f} onChange={(e) => setF(e.target.value)}><option value="todos">Todos</option><option value="pendentes">Pendentes</option><option value="concluídos">Concluídos</option></select><button className="btn" onClick={open}>Novo tratamento</button></Head>
    <div className="card"><Table heads={['Paciente', 'Procedimento', 'Profissional', 'Previsto', 'Valor', 'Status', '']} rows={list.map((t) => [nm(t.pid), t.proc, pr(t.prid), fd(t.date), t.val ? brl(t.val) : '—', <Badge key={t.id} c={t.status === 'concluído' ? 'g' : t.status === 'planejado' ? 'y' : ''}>{t.status}</Badge>,
      <span className="flex gap-1" key={t.id + 'a'}><button className="btn-o" onClick={() => setForm(t)}>Editar</button><button className="btn-o" onClick={() => { if (confirm('Excluir este tratamento?')) { remove('treats', t.id); toast('Tratamento excluído') } }}>Excluir</button></span>])} /></div>
    {form && <FormModal title={form.id ? 'Editar tratamento' : 'Novo tratamento'} values={form} onClose={() => setForm(null)} onSave={(o) => { upsert('treats', { ...form, ...o, val: +o.val || 0 }); toast('Tratamento salvo') }}
      fields={[{ k: 'pid', l: 'Paciente', o: d.patients.filter((p) => !p.arch).map((p) => [p.id, p.name]), w: true }, { k: 'proc', l: 'Procedimento', o: PROCS }, { k: 'prid', l: 'Profissional', o: d.pros.map((p) => [p.id, p.name]) }, { k: 'date', l: 'Data prevista', t: 'date' }, { k: 'val', l: 'Valor estimado (R$)', t: 'number' }, { k: 'status', l: 'Status', o: ['planejado', 'em andamento', 'concluído'], w: true }, { k: 'obs', l: 'Observações clínicas', t: 'ta', w: true }]} />}
  </>)
}
