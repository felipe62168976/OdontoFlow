import { useState } from 'react'
import { useApp } from '../store'
import { Fin } from '../types'
import { today, fd, brl, sum, toast } from '../lib/util'
import { Badge, FormModal, Head, Kpi, Period, Table } from '../components/ui'

export default function Finance() {
  const { data: d, upsert, remove } = useApp(); const t = today()
  const [per, setPer] = useState({ from: t.slice(0, 8) + '01', to: t.slice(0, 8) + '31' }); const [form, setForm] = useState<Partial<Fin> | null>(null)
  const F = d.fin.filter((x) => x.date >= per.from && x.date <= per.to).sort((a, b) => b.date.localeCompare(a.date))
  const rec = sum(F.filter((x) => x.type === 'receita' && x.status === 'pago')), pend = sum(F.filter((x) => x.type === 'receita' && x.status === 'pendente')), exp = sum(F.filter((x) => x.type === 'despesa'))
  return (<>
    <Head t="Financeiro"><button className="btn" onClick={() => setForm({ date: t, status: 'pago', type: 'receita' })}>Novo lançamento</button></Head>
    <Period v={per} set={setPer} />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Kpi l="Receitas recebidas" v={brl(rec)} c="text-green-600" /><Kpi l="A receber" v={brl(pend)} /><Kpi l="Despesas" v={brl(exp)} c="text-red-600" /><Kpi l="Saldo" v={brl(rec - exp)} /></div>
    <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800">Os valores representam os lançamentos registrados no sistema no período selecionado.</p>
    <div className="card"><Table heads={['Data', 'Descrição', 'Tipo', 'Forma', 'Valor', 'Status', '']} rows={F.map((x) => [fd(x.date), x.desc, x.type, x.method || '—', brl(x.val), <Badge key={x.id} c={x.status === 'pago' ? 'g' : 'y'}>{x.status}</Badge>,
      <span className="flex gap-1" key={x.id + 'a'}><button className="btn-o" onClick={() => setForm(x)}>Editar</button><button className="btn-o" onClick={() => { if (confirm('Excluir este lançamento?')) { remove('fin', x.id); toast('Lançamento excluído') } }}>Excluir</button></span>])} /></div>
    {form && <FormModal title={form.id ? 'Editar lançamento' : 'Novo lançamento'} values={form} onClose={() => setForm(null)}
      onSave={(o) => { if (!(+o.val > 0)) return 'Informe um valor maior que zero.'; upsert('fin', { ...form, ...o, val: +o.val }); toast('Lançamento salvo') }}
      fields={[{ k: 'desc', l: 'Descrição', req: true, w: true }, { k: 'type', l: 'Tipo', o: ['receita', 'despesa'] }, { k: 'val', l: 'Valor (R$)', t: 'number', req: true }, { k: 'status', l: 'Status', o: ['pago', 'pendente'] }, { k: 'method', l: 'Forma de pagamento', o: ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Boleto'] }, { k: 'date', l: 'Data', t: 'date', req: true, w: true }]} />}
  </>)
}
