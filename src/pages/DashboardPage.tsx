import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask, useUpdateTaskStatus } from '../hooks/useTasks'
import { TaskCard } from '../components/TaskCard'
import { TaskForm } from '../components/TaskForm'
import { EmptyState } from '../components/EmptyState'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: tasks = [], isLoading, error, refetch } = useTasks(user?.id)
  const create = useCreateTask(user!.id)
  const update = useUpdateTask(user!.id)
  const updateStatus = useUpdateTaskStatus(user!.id)
  const remove = useDeleteTask(user!.id)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | TaskStatus>('all')
  const [priority, setPriority] = useState<'all' | TaskPriority>('all')
  const [sort, setSort] = useState<'created' | 'due' | 'priority'>('created')
  const [search, setSearch] = useState('')
  const visibleTasks = useMemo(() => {
    const priorityRank: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }
    return tasks
      .filter((task) => (filter === 'all' || task.status === filter) && (priority === 'all' || task.priority === priority) && `${task.title} ${task.description || ''}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sort === 'priority' ? priorityRank[a.priority] - priorityRank[b.priority] : sort === 'due' ? (a.due_date || '9999-12-31').localeCompare(b.due_date || '9999-12-31') : b.created_at.localeCompare(a.created_at))
  }, [tasks, filter, priority, search, sort])
  const active = tasks.filter((task) => task.status !== 'done').length
  const completed = tasks.filter((task) => task.status === 'done').length
  const inProgress = tasks.filter((task) => task.status === 'in_progress').length
  const highPriority = tasks.filter((task) => task.priority === 'high' && task.status !== 'done').length

  async function save(input: TaskInput) {
    if (editing) await update.mutateAsync({ taskId: editing.id, input })
    else await create.mutateAsync(input)
    setFormOpen(false)
    setEditing(null)
  }

  function editTask(task: Task) { setEditing(task); setFormOpen(true) }
  async function deleteTask(task: Task) { if (window.confirm(`Delete “${task.title}”?`)) await remove.mutateAsync(task.id) }

  return <div className="dashboard"><section className="welcome-row"><div><p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p><h1>Good to see you<span className="accent">.</span></h1><p className="muted">One step at a time. You’ve got this.</p></div><button className="button primary" onClick={() => { setEditing(null); setFormOpen(true) }}>+ New task</button></section><section className="stats-grid" aria-label="Task summary"><div className="stat-card"><span className="stat-label">Active tasks</span><strong>{active}</strong><span className="stat-note">things in motion</span></div><div className="stat-card"><span className="stat-label">In progress</span><strong>{inProgress}</strong><span className="stat-note">currently focused</span></div><div className="stat-card"><span className="stat-label">Completed</span><strong>{completed}</strong><span className="stat-note">small wins count</span></div><div className="stat-card"><span className="stat-label">High priority</span><strong>{highPriority}</strong><span className="stat-note">needs attention</span></div></section><section className="tasks-section"><div className="section-heading"><div><h2>Your tasks</h2><span className="task-count">{tasks.length} total</span></div><Link to="/app/tasks" className="text-link">View all →</Link></div><div className="toolbar"><div className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" aria-label="Search tasks" /></div><div className="filter-tabs" role="tablist" aria-label="Filter tasks">{(['all', 'todo', 'in_progress', 'done'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item === 'all' ? 'All' : item === 'todo' ? 'To do' : item === 'in_progress' ? 'In progress' : 'Done'}</button>)}</div></div><div className="toolbar secondary-toolbar"><label className="toolbar-field">Priority<select value={priority} onChange={(e) => setPriority(e.target.value as 'all' | TaskPriority)}><option value="all">All priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label className="toolbar-field">Sort by<select value={sort} onChange={(e) => setSort(e.target.value as 'created' | 'due' | 'priority')}><option value="created">Newest</option><option value="due">Due date</option><option value="priority">Priority</option></select></label></div>{isLoading ? <div className="loading-list"><span className="spinner" />Loading tasks…</div> : error ? <div className="error-panel">Couldn’t load your tasks. Check your Supabase connection and try again.<button className="button secondary" onClick={() => refetch()}>Try again</button></div> : visibleTasks.length === 0 ? <EmptyState filtered={tasks.length > 0} onAdd={() => setFormOpen(true)} /> : <div className="task-list">{visibleTasks.slice(0, 5).map((task) => <TaskCard key={task.id} task={task} onStatusChange={(status) => updateStatus.mutate({ taskId: task.id, status })} onEdit={() => editTask(task)} onDelete={() => deleteTask(task)} />)}</div>}</section>{formOpen && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-label={editing ? 'Edit task' : 'New task'}><TaskForm task={editing} onSubmit={save} onCancel={() => { setFormOpen(false); setEditing(null) }} isSaving={create.isPending || update.isPending} /></div></div>}</div>
}
