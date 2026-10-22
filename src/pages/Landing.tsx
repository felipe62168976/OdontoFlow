import { Link } from 'react-router-dom'
const F = [['Pacientes', 'Cadastro, busca e histórico de cada paciente.'], ['Agenda', 'Dia, semana e mês, com aviso de conflito de horário.'], ['Tratamentos', 'Planejados, em andamento e concluídos.'], ['Financeiro', 'Receitas, despesas e pendências do período.'], ['Relatórios e avisos', 'Faltas, cancelamentos e pagamentos pendentes.']]
const B = [['Menos faltas', 'Acompanhe cancelamentos e não comparecimentos.'], ['Dados por clínica', 'Cada conta enxerga só os seus registros.'], ['Pensado para a LGPD', 'Coleta mínima de dados e exportação a qualquer momento.']]
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
export default function Landing() {
  return (<div>
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
      <b className="text-xl text-nav">OdontoFlow</b>
      <nav className="hidden gap-5 md:flex"><a className="cursor-pointer" onClick={() => scrollTo(0, 0)}>Início</a><a className="cursor-pointer" onClick={() => go('fn')}>Funcionalidades</a><a className="cursor-pointer" onClick={() => go('sb')}>Sobre</a><a className="cursor-pointer" onClick={() => go('ct')}>Contato</a></nav>
      <div className="flex gap-2"><Link to="/entrar" className="btn-o">Entrar</Link><Link to="/entrar?cadastro=1" className="btn">Começar agora</Link></div>
    </div>
    <section className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-12 md:grid-cols-2">
      <div><h1 className="text-4xl font-bold text-nav">Sua clínica odontológica mais organizada, em um só lugar</h1>
        <p className="my-4 text-lg text-slate-600">Cadastre pacientes, organize a agenda, acompanhe tratamentos e veja o financeiro sem planilhas soltas nem papéis espalhados.</p>
        <Link to="/entrar?cadastro=1" className="btn">Criar conta da minha clínica</Link></div>
      <div aria-hidden className="grid grid-cols-[48px_1fr] gap-3 rounded-2xl bg-nav p-3 shadow-xl"><div className="space-y-2 pt-1">{[0, 1, 2, 3].map((i) => <div key={i} className="h-2.5 rounded bg-white/30" />)}</div>
        <div className="space-y-2 rounded-xl bg-slate-100 p-3"><div className="grid grid-cols-3 gap-2 text-xs text-slate-500">{[['Hoje', '8'], ['Pacientes', '124'], ['Receita', 'R$ 9,4k']].map(([a, b]) => <div key={a} className="rounded-lg bg-white p-2">{a}<b className="block text-lg text-slate-800">{b}</b></div>)}</div>
          <div className="flex h-16 items-end gap-1.5 rounded-lg bg-white p-2">{[40, 65, 50, 85, 60, 75].map((h, i) => <i key={i} className="flex-1 rounded-t bg-brand" style={{ height: h + '%' }} />)}</div></div></div>
    </section>
    <section id="fn" className="mx-auto max-w-5xl px-5 py-8"><h2 className="mb-4 text-2xl font-bold">Funcionalidades</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{F.map(([t, d]) => <div key={t} className="card"><h3 className="font-bold">{t}</h3><p className="text-slate-500">{d}</p></div>)}</div></section>
    <section id="sb" className="mx-auto max-w-5xl px-5 py-8"><h2 className="mb-4 text-2xl font-bold">Benefícios para clínicas e consultórios</h2><div className="grid gap-4 sm:grid-cols-3">{B.map(([t, d]) => <div key={t} className="card"><h3 className="font-bold">{t}</h3><p className="text-slate-500">{d}</p></div>)}</div></section>
    <footer id="ct" className="mt-8 bg-nav px-5 py-8 text-sm text-slate-200"><div className="mx-auto max-w-5xl"><b>OdontoFlow</b> · Gestão odontológica para clínicas e consultórios.<p className="mt-3">Os dados desta versão ficam apenas no seu navegador. · contato@odontoflow.exemplo</p></div></footer>
  </div>)
}
