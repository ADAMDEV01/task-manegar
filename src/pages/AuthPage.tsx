import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { isDemoMode } from '../lib/supabase'
import { Logo } from '../components/Logo'

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { user, signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [working, setWorking] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  if (user) return <Navigate to="/app" replace />

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setWorking(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate((location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/app', { replace: true })
      } else {
        await signUp(email, password)
        setMessage(isDemoMode ? 'Demo account created. Your tasks are saved in this browser.' : 'Account created. Check your email to confirm your address, then sign in.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setWorking(false)
    }
  }

  return <div className="auth-page"><div className="auth-decoration"><div className="orb orb-one" /><div className="orb orb-two" /><span className="decor-quote">“A calm mind<br />gets more done.”</span></div><div className="auth-panel"><Logo /><div className="auth-copy"><p className="eyebrow">Your personal workspace</p><h1>{mode === 'login' ? 'Welcome back.' : 'Make space for progress.'}</h1><p>{mode === 'login' ? 'Pick up where you left off.' : 'A simple, thoughtful place for everything you want to accomplish.'}</p></div>{isDemoMode && <div className="notice" role="status">Demo mode is active. Tasks are saved in this browser until Supabase is configured.</div>}<form className="auth-form" onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}<button className="button primary full-width" disabled={working}>{working ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button></form><p className="auth-switch">{mode === 'login' ? 'New to Taskflow?' : 'Already have an account?'} <a href={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? 'Create an account' : 'Sign in'}</a></p></div></div>
}
