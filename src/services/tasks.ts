import { isDemoMode, supabase } from '../lib/supabase'
import type { Task, TaskInput, TaskStatus } from '../types'

const demoTasksKey = 'taskflow-demo-tasks'

function readDemoTasks(userId: string): Task[] {
  const stored = localStorage.getItem(demoTasksKey)
  return stored ? (JSON.parse(stored) as Task[]).filter((task) => task.user_id === userId) : []
}

function writeDemoTasks(tasks: Task[]) {
  localStorage.setItem(demoTasksKey, JSON.stringify(tasks))
}

export async function listTasks(userId: string): Promise<Task[]> {
  if (isDemoMode) return readDemoTasks(userId).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Task[]
}

export async function createTask(userId: string, input: TaskInput): Promise<Task> {
  if (isDemoMode) {
    const now = new Date().toISOString()
    const task: Task = { ...input, id: crypto.randomUUID(), user_id: userId, description: input.description || null, due_date: input.due_date || null, created_at: now, updated_at: now }
    writeDemoTasks([task, ...readDemoTasks(userId)])
    return task
  }
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, user_id: userId, due_date: input.due_date || null })
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function updateTask(taskId: string, input: Partial<TaskInput>): Promise<Task> {
  if (isDemoMode) {
    const tasks = JSON.parse(localStorage.getItem(demoTasksKey) || '[]') as Task[]
    const index = tasks.findIndex((task) => task.id === taskId)
    if (index < 0) throw new Error('Task not found')
    const task = { ...tasks[index], ...input, due_date: input.due_date || null, updated_at: new Date().toISOString() }
    tasks[index] = task
    writeDemoTasks(tasks)
    return task
  }
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
  if (isDemoMode) {
    const tasks = JSON.parse(localStorage.getItem(demoTasksKey) || '[]') as Task[]
    writeDemoTasks(tasks.filter((task) => task.id !== taskId))
    return
  }
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  return updateTask(taskId, { status })
}
