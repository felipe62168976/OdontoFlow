import { useState } from 'react'
import { useApp } from '../store'
import { Pro } from '../types'
import { toast } from '../lib/util'
import { FormModal, Head, Table } from '../components/ui'

export default function Settings() {
  const { user, data: d, renameClinic, upsert, remove, clear } = useApp(); const [name, setName] = useState(user?.clinic ?? ''); const [form, setForm] = useState<Partial<Pro> | null>(null)
  function exp() { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 1)], { type: 'application/json' })); a.download = 'odontoflow-dados.json'; a.click() }
  return (<>
    <Head t="Configurações" />
    <div className="card"><h3 className="mb-2 font-bold">Clínica</h3><div className="flex gap-2"><input className="inp !mt-0" aria-label="Nome da clínica" value={name} onChange={(e) => setName(e.target.value)} />
      <button className="btn" onClick={() => name.trim() ? (renameClinic(name.trim()), toast('Nome atualizado')) : toast('Informe o nome da clínica', true)}>Salvar</button></div></div>
    <div className="card"><div className="mb-2 flex items-center justify-between"><h3 className="font-bold">Profissionais</h3><button className="btn-o" onClick={() => setForm({})}>Adicionar</button></div>
      <Table heads={['Nome', 'Especialidade', '']} rows={d.pros.map((p) => [p.name, p.esp || '—', <span className="flex gap-1" key={p.id}><button className="btn-o" onClick={() => setForm(p)}>Editar</button>{d.pros.length > 1 && <button className="btn-o" onClick={() => { if (d.appts.some((a) => a.prid === p.id)) return toast('Há consultas vinculadas a este profissional', true); remove('pros', p.id) }}>Excluir</button>}</span>])} /></div>
    <div className="card"><h3 className="font-bold">Seus dados (LGPD)</h3><p className="my-2 text-sm text-slate-500">Os dados ficam apenas neste navegador, vinculados à sua conta. Use dados fictícios em demonstrações.</p>
      <div className="flex flex-wrap gap-2"><button className="btn-o" onClick={exp}>Exportar dados (JSON)</button><button className="btn-o !border-red-300 !text-red-600" onClick={() => { if (confirm('Apagar pacientes, consultas, tratamentos e lançamentos? Não dá para desfazer.')) { clear(); toast('Dados apagados') } }}>Apagar dados da clínica</button></div></div>
    {form && <FormModal title={form.id ? 'Editar profissional' : 'Novo profissional'} values={form} onClose={() => setForm(null)} onSave={(o) => { upsert('pros', { ...form, ...o }); toast('Profissional salvo') }} fields={[{ k: 'name', l: 'Nome', req: true, w: true }, { k: 'esp', l: 'Especialidade', w: true }]} />}
  </>)
}
