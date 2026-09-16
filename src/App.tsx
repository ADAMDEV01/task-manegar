import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './components/AppShell'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { TasksPage } from './pages/TasksPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return <AuthProvider><Routes><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/signup" element={<AuthPage mode="signup" />} /><Route element={<ProtectedRoute />}><Route path="/app" element={<AppShell><DashboardPage /></AppShell>} /><Route path="/app/tasks" element={<AppShell><TasksPage /></AppShell>} /><Route path="/app/settings" element={<AppShell><SettingsPage /></AppShell>} /></Route><Route path="/" element={<Navigate to="/app" replace />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider>
}
