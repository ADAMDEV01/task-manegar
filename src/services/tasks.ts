import { supabase } from '../lib/supabase'
import type { Task, TaskInput, TaskStatus } from '../types'

export async function listTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Task[]
}

export async function createTask(userId: string, input: TaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, user_id: userId, due_date: input.due_date || null })
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function updateTask(taskId: string, input: Partial<TaskInput>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...input, due_date: input.due_date || null })
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  return updateTask(taskId, { status })
}
