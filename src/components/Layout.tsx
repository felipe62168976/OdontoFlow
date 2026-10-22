import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../store'
import { Modal } from './ui'
import { notifs } from '../lib/notifs'

const items = [['/app', 'Visão geral'], ['/app/pacientes', 'Pacientes'], ['/app/agenda', 'Agenda'], ['/app/tratamentos', 'Tratamentos'], ['/app/financeiro', 'Financeiro'], ['/app/relatorios', 'Relatórios'], ['/app/config', 'Configurações']]
export default function Layout() {
  const { user, data, logout } = useApp(); const nav = useNavigate()
  const [open, setOpen] = useState(false); const [bell, setBell] = useState(false); const n = notifs(data)
  return (
    <div className="min-h-screen md:grid md:grid-cols-[230px_1fr]">
      <aside className={`fixed inset-y-0 left-0 z-30 w-56 bg-nav p-3 text-slate-200 transition-transform md:static md:w-auto md:translate-x-0 ${open ? '' : '-translate-x-full'}`}>
        <div className="mb-4 px-3 text-lg font-bold text-white">OdontoFlow</div>
        {items.map(([to, l]) => <NavLink key={to} to={to} end onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/10'}`}>{l}</NavLink>)}
        <button onClick={() => { logout(); nav('/') }} className="mt-4 block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10">Sair</button>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-white px-5 py-3">
          <button className="btn-o md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
          <b>{user?.clinic}</b>
          <input className="inp !mt-0 max-w-xs flex-1" placeholder="Buscar paciente…" aria-label="Buscar paciente" onKeyDown={(e) => e.key === 'Enter' && nav('/app/pacientes?q=' + encodeURIComponent(e.currentTarget.value))} />
          <span className="flex-1" />
          <small className="text-slate-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</small>
          <button className="btn-o" onClick={() => setBell(true)}>Avisos{n.length ? ` (${n.length})` : ''}</button>
          <small>{user?.name.split(' ')[0]}</small>
        </header>
        <main className="grid gap-4 p-5"><Outlet /></main>
      </div>
      {bell && <Modal title="Notificações" onClose={() => setBell(false)}>
        {n.length ? <ul className="list-disc pl-5">{n.map((x, i) => <li key={i}>{x}</li>)}</ul> : <p className="text-slate-500">Nada pendente por aqui.</p>}
        <p className="mt-3 rounded-lg bg-amber-50 p-2 text-sm text-amber-800">Avisos internos. Envio por e-mail ou WhatsApp não está configurado e nenhuma mensagem externa é enviada.</p>
      </Modal>}
    </div>
  )
}
