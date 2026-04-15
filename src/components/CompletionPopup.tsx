import React from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/constants'

export default function CompletionPopup() {
  const { completionPopup, setCompletionPopup } = useApp()
  if (!completionPopup) return null

  const { task, points, quote } = completionPopup
  const cat = CATEGORIES[task.category]

  return (
    <div className="modal-overlay" onClick={() => setCompletionPopup(null)}>
      <div className="modal-box" style={{ textAlign: 'center', maxWidth: 360 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{cat.emoji}</div>
        <div style={{
          fontSize: 36,
          fontWeight: 900,
          color: points > 0 ? '#22c55e' : points < 0 ? '#ef4444' : '#f5c518',
          marginBottom: 8,
          lineHeight: 1,
        }}>
          {points > 0 ? '+' : ''}{points} {points === 0 ? '' : 'pts'}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{task.text}</div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{cat.name}</div>
        <div style={{
          background: '#f5f0e6',
          borderLeft: '3px solid #f5c518',
          padding: '10px 14px',
          borderRadius: 6,
          fontSize: 13,
          fontStyle: 'italic',
          marginBottom: 16,
        }}>
          "{quote}"
        </div>
        <button className="btn btn-primary" onClick={() => setCompletionPopup(null)} style={{ width: '100%' }}>
          Hell Yeah 🤘
        </button>
      </div>
    </div>
  )
}
