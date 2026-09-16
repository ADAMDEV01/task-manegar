import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, listTasks, updateTask, updateTaskStatus } from '../services/tasks'
import type { TaskInput, TaskStatus } from '../types'

export const taskKeys = {
  all: ['tasks'] as const,
  list: (userId: string) => ['tasks', userId] as const,
}

export function useTasks(userId?: string) {
  return useQuery({
    queryKey: taskKeys.list(userId || 'anonymous'),
    queryFn: () => listTasks(userId!),
    enabled: Boolean(userId),
  })
}

export function useCreateTask(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: TaskInput) => createTask(userId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }),
  })
}

export function useUpdateTask(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, input }: { taskId: string; input: Partial<TaskInput> }) =>
      updateTask(taskId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }),
  })
}

export function useUpdateTaskStatus(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }),
  })
}

export function useDeleteTask(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }),
  })
}
