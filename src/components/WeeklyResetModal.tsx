import React from 'react'
import { useApp } from '../context/AppContext'

interface Props {
  onClose: () => void
}

export default function WeeklyResetModal({ onClose }: Props) {
  const { tasks, deleteTask, showToast } = useApp()
  const incomplete = tasks.filter(t => !t.completed && !['squirrel', 'rewards', 'reflection'].includes(t.category))

  const handleKill = async (id: string) => {
    await deleteTask(id)
    showToast('Task killed. No guilt.')
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div className="modal-title">Weekly Reset</div>
          <button onClick={onClose} style={{ fontSize: 20, color: '#888', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16, fontStyle: 'italic' }}>
          "What got done? What's still real? What can I kill?"
        </div>
        {incomplete.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎉</div>
            <div className="empty-state-text">No incomplete tasks! You crushed it.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
            {incomplete.map(task => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                border: '1.5px solid #e8e3d9',
                borderRadius: 8,
                background: '#fafafa',
              }}>
                <div style={{ flex: 1, fontSize: 14 }}>{task.text}</div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleKill(task.id)}
                  title="Delete task"
                >
                  Kill It
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{
          marginTop: 16,
          padding: '12px 14px',
          background: '#f5f0e6',
          borderRadius: 8,
          fontSize: 12,
          color: '#666',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}>
          If a task survived 3 resets without moving, it's not a task—it's a guilt souvenir.
        </div>
        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', marginTop: 16 }}>
          Done Reviewing
        </button>
      </div>
    </div>
  )
}
