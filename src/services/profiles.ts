import { isDemoMode, supabase } from '../lib/supabase'
import type { Profile } from '../types'

export async function getProfile(userId: string): Promise<Profile | null> {
  if (isDemoMode) {
    const displayName = localStorage.getItem(`taskflow-demo-profile:${userId}`)
    return { id: userId, display_name: displayName, avatar_url: null }
  }
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data as Profile | null
}

export async function upsertProfile(userId: string, displayName: string): Promise<Profile> {
  if (isDemoMode) {
    const value = displayName.trim() || null
    if (value) localStorage.setItem(`taskflow-demo-profile:${userId}`, value)
    else localStorage.removeItem(`taskflow-demo-profile:${userId}`)
    return { id: userId, display_name: value, avatar_url: null }
  }
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, display_name: displayName.trim() || null })
    .select()
    .single()
  if (error) throw error
  return data as Profile
}
