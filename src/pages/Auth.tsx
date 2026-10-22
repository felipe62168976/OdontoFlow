import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../store'
import { EMAIL } from '../lib/util'
import { Modal } from '../components/ui'

export default function Auth() {
  const { login, register } = useApp(); const nav = useNavigate(); const [sp] = useSearchParams()
  const [reg, setReg] = useState(sp.has('cadastro')); const [show, setShow] = useState(false); const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(''); const [info, setInfo] = useState('')
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (reg && (!f.name?.trim() || !f.clinic?.trim())) return setErr('Preencha seu nome e o nome da clínica.')
    if (!EMAIL.test(f.email || '')) return setErr('Informe um e-mail válido.')
    if (!f.password) return setErr('Informe a senha.')
    if (reg) {
      if (f.password.length < 6) return setErr('A senha deve ter ao menos 6 caracteres.')
      if (f.password !== f.confirm) return setErr('As senhas não coincidem.')
      if (!f.terms) return setErr('Aceite os termos de uso e a política de privacidade.')
    }
    setBusy(true); setErr('')
    const r = reg ? await register(f.name, f.clinic, f.email, f.password) : await login(f.email, f.password, !!f.remember)
    setBusy(false); if (r) setErr(r); else nav('/app')
  }
  return (
    <div className="mx-auto mt-8 max-w-md px-4">
      <Link to="/" className="mb-4 block text-xl font-bold text-nav">OdontoFlow</Link>
      <div className="card">
        <div className="mb-4 grid grid-cols-2 gap-2"><button className={reg ? 'btn-o' : 'btn'} onClick={() => setReg(false)}>Entrar</button><button className={reg ? 'btn' : 'btn-o'} onClick={() => setReg(true)}>Criar conta</button></div>
        {err && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{err}</p>}
        <form key={String(reg)} onSubmit={submit} noValidate className="grid gap-3 text-sm font-semibold text-slate-500">
          {reg && <><label>Nome completo do responsável<input name="name" className="inp" autoComplete="name" /></label><label>Nome da clínica<input name="clinic" className="inp" /></label></>}
          <label>E-mail<input name="email" type="email" className="inp" autoComplete="email" /></label>
          <label>Senha<input name="password" type={show ? 'text' : 'password'} className="inp" autoComplete={reg ? 'new-password' : 'current-password'} /></label>
          {reg && <label>Confirmar senha<input name="confirm" type="password" className="inp" /></label>}
          <label className="flex items-center gap-2 font-normal"><input type="checkbox" onChange={(e) => setShow(e.target.checked)} /> Mostrar senha</label>
          {reg ? <label className="flex items-center gap-2 font-normal"><input type="checkbox" name="terms" /> Aceito os termos de uso e a política de privacidade</label>
            : <><label className="flex items-center gap-2 font-normal"><input type="checkbox" name="remember" /> Lembrar-me</label><a className="cursor-pointer text-brand" onClick={() => setInfo('Não há recuperação por e-mail nesta versão local, pois os dados ficam só neste navegador. Se esqueceu a senha, crie uma nova conta.')}>Esqueci minha senha</a></>}
          <button className="btn" disabled={busy}>{busy ? 'Aguarde…' : reg ? 'Criar conta' : 'Entrar'}</button>
        </form>
        <p className="mt-3 text-xs text-slate-500">Versão local: conta e dados ficam apenas neste navegador e não substituem um backend seguro.</p>
      </div>
      {info && <Modal title="Esqueci minha senha" onClose={() => setInfo('')}><p>{info}</p></Modal>}
    </div>
  )
}
