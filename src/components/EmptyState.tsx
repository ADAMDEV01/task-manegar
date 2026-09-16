export function EmptyState({ filtered, onAdd }: { filtered?: boolean; onAdd: () => void }) {
  return <div className="empty-state"><div className="empty-icon">✦</div><h2>{filtered ? 'No matching tasks' : 'Your list is clear'}</h2><p>{filtered ? 'Try a different search or filter.' : 'Capture the next thing you want to make progress on.'}</p>{!filtered && <button className="button primary" onClick={onAdd}>Create your first task</button>}</div>
}
