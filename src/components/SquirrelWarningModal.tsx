import React from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/constants'

export default function SquirrelWarningModal() {
  const { squirrelWarning, setSquirrelWarning, toggleTask, tasks, score, showToast } = useApp()
  if (!squirrelWarning) return null

  const handleProceed = async () => {
    const todayTasks = tasks.filter(t => !t.completed)
    if (todayTasks.length > 0) {
      showToast('-1 point! Stay focused next time.')
    }
    window.open(squirrelWarning.url, '_blank', 'noopener,noreferrer')
    setSquirrelWarning(null)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{squirrelWarning.emoji}</div>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: '#ef4444',
          marginBottom: 6,
        }}>
          -1 POINT WARNING
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
          {squirrelWarning.title}
        </div>
        <div style={{ fontSize: 14, color: '#555', marginBottom: 20, lineHeight: 1.5 }}>
          {squirrelWarning.message}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-success"
            onClick={() => setSquirrelWarning(null)}
            style={{ flex: 1 }}
          >
            Back to Work
          </button>
          <button
            className="btn btn-danger"
            onClick={handleProceed}
            style={{ flex: 1 }}
          >
            Worth It (-1 pt)
          </button>
        </div>
      </div>
    </div>
  )
}
