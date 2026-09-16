import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isDemoMode, supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function createDemoUser(email: string): User {
  const now = new Date().toISOString()
  return {
    id: 'demo-user',
    aud: 'authenticated',
    role: 'authenticated',
    email: email || 'demo@example.com',
    email_confirmed_at: now,
    phone: '',
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: { provider: 'demo', providers: ['demo'] },
    user_metadata: {},
    identities: [],
    created_at: now,
    updated_at: now,
    is_anonymous: false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [demoUser, setDemoUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      const email = localStorage.getItem('taskflow-demo-user')
      if (email) setDemoUser(createDemoUser(email))
      setLoading(false)
      return
    }
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user || demoUser,
      loading,
      signIn: async (email, password) => {
        if (isDemoMode) {
          setDemoUser(createDemoUser(email))
          localStorage.setItem('taskflow-demo-user', email)
          return
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      },
      signUp: async (email, password) => {
        if (isDemoMode) {
          setDemoUser(createDemoUser(email))
          localStorage.setItem('taskflow-demo-user', email)
          return
        }
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      },
      signOut: async () => {
        if (isDemoMode) {
          setDemoUser(null)
          localStorage.removeItem('taskflow-demo-user')
          return
        }
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      },
    }),
    [demoUser, loading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
