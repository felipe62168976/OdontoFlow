import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { EMAIL } from '../lib/util'

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', h); return () => removeEventListener('keydown', h) }, [onClose])
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5">
        <h3 className="mb-3 text-lg font-bold">{title}</h3>{children}
      </div>
    </div>
  )
}
export type Field = { k: string; l: string; t?: string; o?: (string | [string, string])[]; req?: boolean; w?: boolean }
export function FormModal({ title, fields, values, onSave, onClose }: { title: string; fields: Field[]; values: Record<string, any>; onSave: (o: Record<string, string>) => string | void; onClose: () => void }) {
  const [err, setErr] = useState('')
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const o = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    for (const f of fields) if (f.req && !String(o[f.k] || '').trim()) return setErr(`Preencha o campo: ${f.l}.`)
    if (o.email && !EMAIL.test(o.email)) return setErr('E-mail inválido.')
    const r = onSave(o); if (r) setErr(r); else onClose()
  }
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        {err && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{err}</p>}
        <div className="grid gap-x-3 sm:grid-cols-2">
          {fields.map((f) => {
            const v = values[f.k] ?? ''
            return (
              <label key={f.k} className={`mb-3 block text-sm font-semibold text-slate-500 ${f.w ? 'sm:col-span-2' : ''}`}>
                {f.l}{f.req ? ' *' : ''}
                {f.o ? <select name={f.k} defaultValue={v} className="inp">{f.o.map((o) => { const [a, b] = Array.isArray(o) ? o : [o, o]; return <option key={a} value={a}>{b}</option> })}</select>
                  : f.t === 'ta' ? <textarea name={f.k} rows={3} defaultValue={v} className="inp" />
                  : <input name={f.k} type={f.t || 'text'} defaultValue={v} step={f.t === 'number' ? '0.01' : undefined} min={f.t === 'number' ? 0 : undefined} className="inp" />}
              </label>
            )
          })}
        </div>
        <div className="flex gap-2"><button className="btn">Salvar</button><button type="button" className="btn-o" onClick={onClose}>Cancelar</button></div>
      </form>
    </Modal>
  )
}
export function Table({ heads, rows }: { heads: string[]; rows: ReactNode[][] }) {
  if (!rows.length) return <p className="py-8 text-center text-slate-500">Nada cadastrado ainda.</p>
  return <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{heads.map((h, i) => <th key={i} className="border-b px-2 py-2 text-left font-semibold text-slate-500">{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="whitespace-nowrap border-b px-2 py-2">{c}</td>)}</tr>)}</tbody></table></div>
}
const BC = { '': 'bg-sky-100 text-sky-700', g: 'bg-green-100 text-green-700', r: 'bg-red-100 text-red-700', y: 'bg-amber-100 text-amber-700' }
export const Badge = ({ c = '', children }: { c?: keyof typeof BC; children: ReactNode }) => <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${BC[c]}`}>{children}</span>
export const Head = ({ t, children }: { t: string; children?: ReactNode }) => <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">{t}</h1><div className="flex gap-2">{children}</div></div>
export const Period = ({ v, set }: { v: { from: string; to: string }; set: (v: { from: string; to: string }) => void }) => (
  <div className="flex gap-2"><input aria-label="De" type="date" className="inp !mt-0 !w-auto" value={v.from} onChange={(e) => set({ ...v, from: e.target.value })} /><input aria-label="Até" type="date" className="inp !mt-0 !w-auto" value={v.to} onChange={(e) => set({ ...v, to: e.target.value })} /></div>
)
export const Kpi = ({ l, v, c = '' }: { l: string; v: ReactNode; c?: string }) => <div className="card"><small className="text-slate-500">{l}</small><div className={`text-2xl font-bold ${c}`}>{v}</div></div>
