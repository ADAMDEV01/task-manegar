import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data as Profile | null
}

export async function upsertProfile(userId: string, displayName: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, display_name: displayName.trim() || null })
    .select()
    .single()
  if (error) throw error
  return data as Profile
}
