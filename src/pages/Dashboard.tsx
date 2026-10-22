import { useNavigate } from 'react-router-dom'
import { useApp } from '../store'
import { STATUS, OFF } from '../types'
import { today, fd, brl, sum } from '../lib/util'
import { Head, Kpi, Table } from '../components/ui'

export default function Dashboard() {
  const { data: d, seed } = useApp(); const nav = useNavigate(); const t = today(), mo = t.slice(0, 7)
  const nm = (id: string) => d.patients.find((p) => p.id === id)?.name, pr = (id: string) => d.pros.find((p) => p.id === id)?.name
  const M = d.appts.filter((a) => a.date.startsWith(mo)), rev = sum(d.fin.filter((f) => f.type === 'receita' && f.status === 'pago' && f.date.startsWith(mo))), ex = sum(d.fin.filter((f) => f.type === 'despesa' && f.date.startsWith(mo)))
  const up = d.appts.filter((a) => a.date >= t && ['agendada', 'confirmada'].includes(a.status)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 6)
  const mx = Math.max(1, ...STATUS.map((s) => M.filter((a) => a.status === s).length)), top = Math.max(rev, ex, 1)
  return (<>
    <Head t="Visão geral"><button className="btn" onClick={() => nav('/app/pacientes?novo=1')}>Novo paciente</button><button className="btn-o" onClick={() => nav('/app/agenda?novo=1')}>Agendar consulta</button></Head>
    {!d.patients.length && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Conta vazia. <a className="cursor-pointer font-semibold underline" onClick={seed}>Carregar dados fictícios de demonstração</a></p>}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Kpi l="Pacientes ativos" v={d.patients.filter((p) => !p.arch).length} /><Kpi l="Consultas hoje" v={d.appts.filter((a) => a.date === t && a.status !== 'cancelada').length} />
      <Kpi l="Concluídas no mês" v={M.filter((a) => a.status === 'concluída').length} /><Kpi l="Canceladas / faltas" v={M.filter((a) => OFF.includes(a.status)).length} /><Kpi l="Receita do mês" v={brl(rev)} />
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card"><h3 className="font-bold">Próximas consultas</h3><Table heads={['Quando', 'Paciente', 'Profissional']} rows={up.map((a) => [fd(a.date) + ' ' + a.time, nm(a.pid), pr(a.prid)])} /></div>
      <div className="card"><h3 className="font-bold">Pacientes recentes</h3><Table heads={['Nome', 'Cadastro']} rows={d.patients.filter((p) => !p.arch).slice(-5).reverse().map((p) => [p.name, fd(p.created)])} /></div>
      <div className="card"><h3 className="mb-2 font-bold">Consultas do mês por status</h3>{STATUS.map((s) => { const c = M.filter((a) => a.status === s).length; return <div key={s} className="my-1.5 grid grid-cols-[110px_1fr_24px] items-center gap-2 text-sm"><span>{s}</span><i className="block h-2.5 rounded bg-brand" style={{ width: (c / mx) * 100 + '%' }} /><b>{c}</b></div> })}</div>
      <div className="card"><h3 className="mb-2 font-bold">Resumo financeiro do mês</h3>
        <p className="text-sm">Receitas recebidas: <b>{brl(rev)}</b></p><i className="mb-2 block h-2.5 rounded bg-green-500" style={{ width: (rev / top) * 100 + '%' }} />
        <p className="text-sm">Despesas: <b>{brl(ex)}</b> · Saldo: <b>{brl(rev - ex)}</b></p><i className="mb-2 block h-2.5 rounded bg-red-500" style={{ width: (ex / top) * 100 + '%' }} />
        <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">Valores dos lançamentos registrados no sistema.</p></div>
    </div></>)
}
