import type { Task, TaskStatus } from '../types'

const statusLabels: Record<TaskStatus, string> = { todo: 'To do', in_progress: 'In progress', done: 'Done' }

interface Props {
  task: Task
  onStatusChange: (status: TaskStatus) => void
  onEdit: () => void
  onDelete: () => void
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: Props) {
  const overdue = task.due_date && task.status !== 'done' && new Date(`${task.due_date}T23:59:59`) < new Date()
  return (
    <article className={`task-card ${task.status === 'done' ? 'is-done' : ''}`}>
      <div className="task-card-top">
        <button className={`check-button ${task.status === 'done' ? 'checked' : ''}`} onClick={() => onStatusChange(task.status === 'done' ? 'todo' : 'done')} aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}>{task.status === 'done' ? '✓' : ''}</button>
        <div className="task-card-content"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div>
        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
      </div>
      <div className="task-card-bottom">
        <select className="status-select" aria-label={`Status for ${task.title}`} value={task.status} onChange={(e) => onStatusChange(e.target.value as TaskStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        {task.due_date && <span className={`due-date ${overdue ? 'overdue' : ''}`}>◷ {overdue ? 'Overdue · ' : ''}{new Date(`${task.due_date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
        <div className="task-actions"><button onClick={onEdit} aria-label={`Edit ${task.title}`}>Edit</button><button onClick={onDelete} aria-label={`Delete ${task.title}`}>Delete</button></div>
      </div>
    </article>
  )
}
