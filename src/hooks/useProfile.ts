import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, upsertProfile } from '../services/profiles'

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: Boolean(userId),
  })
}

export function useUpdateProfile(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (displayName: string) => upsertProfile(userId, displayName),
    onSuccess: (profile) => client.setQueryData(['profile', userId], profile),
  })
}
