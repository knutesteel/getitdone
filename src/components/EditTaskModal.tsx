import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Task, CategoryId } from '../types'
import { CATEGORIES } from '../data/constants'

interface Props {
  task: Task
  onClose: () => void
}

export default function EditTaskModal({ task, onClose }: Props) {
  const { updateTask } = useApp()
  const [text, setText] = useState(task.text)
  const [category, setCategory] = useState<CategoryId>(task.category)
  const [dueDate, setDueDate] = useState(task.due_date ?? '')
  const [notes, setNotes] = useState(task.notes ?? '')

  const handleSave = async () => {
    if (!text.trim()) return
    await updateTask(task.id, {
      text: text.trim(),
      category,
      due_date: dueDate || null,
      notes,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="modal-title">Edit Task</div>
          <button onClick={onClose} style={{ fontSize: 20, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <div className="form-group">
          <label className="form-label">Task</label>
          <input
            className="input"
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="input" value={category} onChange={e => setCategory(e.target.value as CategoryId)}>
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input type="date" className="input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="input textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}
