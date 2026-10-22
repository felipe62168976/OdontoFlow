import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './store'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Agenda from './pages/Agenda'
import Treatments from './pages/Treatments'
import Finance from './pages/Finance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  const { user } = useApp()
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/entrar" element={user ? <Navigate to="/app" replace /> : <Auth />} />
      <Route path="/app" element={user ? <Layout /> : <Navigate to="/entrar" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="pacientes" element={<Patients />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="tratamentos" element={<Treatments />} />
        <Route path="financeiro" element={<Finance />} />
        <Route path="relatorios" element={<Reports />} />
        <Route path="config" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
