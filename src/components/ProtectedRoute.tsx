import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="page-loader"><span className="spinner" />Loading your workspace…</div>
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
