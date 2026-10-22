import { useState } from 'react'
import { useApp } from '../store'
import { today, brl, sum } from '../lib/util'
import { Head, Period, Table } from '../components/ui'
import { notifs } from '../lib/notifs'

export default function Reports() {
  const { data: d } = useApp(); const t = today(); const [per, setPer] = useState({ from: t.slice(0, 8) + '01', to: t.slice(0, 8) + '31' })
  const inP = (x: string) => x >= per.from && x <= per.to, A = d.appts.filter((a) => inP(a.date)), c = (s: string) => A.filter((a) => a.status === s).length, F = d.fin.filter((f) => inP(f.date))
  const rows: [string, string | number][] = [['Consultas no período', A.length], ['Concluídas', c('concluída')], ['Canceladas', c('cancelada')], ['Não compareceram', c('não compareceu')], ['Pacientes cadastrados no período', d.patients.filter((p) => inP(p.created)).length],
    ['Tratamentos pendentes (planejados ou em andamento)', d.treats.filter((x) => x.status !== 'concluído').length], ['Receitas registradas', brl(sum(F.filter((f) => f.type === 'receita')))], ['Despesas registradas', brl(sum(F.filter((f) => f.type === 'despesa')))]]
  const n = notifs(d)
  return (<>
    <Head t="Relatórios" /><Period v={per} set={setPer} />
    <div className="card"><Table heads={['Indicador', 'Valor']} rows={rows} /></div>
    <div className="card"><h3 className="font-bold">Notificações internas</h3>{n.length ? n.map((x, i) => <p key={i} className="text-sm">{x}</p>) : <p className="text-slate-500">Nada pendente.</p>}
      <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">Integração com e-mail e WhatsApp: não configurada. Nenhuma mensagem externa é enviada.</p></div>
  </>)
}
