import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Task } from '../types'
import { CATEGORIES } from '../data/constants'
import EditTaskModal from './EditTaskModal'

interface TaskItemProps {
  task: Task
  showCategory?: boolean
}

export default function TaskItem({ task, showCategory = true }: TaskItemProps) {
  const { toggleTask, deleteTask } = useApp()
  const [editing, setEditing] = useState(false)
  const cat = CATEGORIES[task.category]

  const formatDate = (d: string | null) => {
    if (!d) return null
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <>
      <div className={`task-item ${task.completed ? 'opacity-60' : ''}`} style={{ opacity: task.completed ? 0.6 : 1 }}>
        <button
          className={`task-check ${task.completed ? 'checked' : ''}`}
          onClick={() => toggleTask(task.id)}
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        />
        <div className="task-body">
          <div className={`task-text ${task.completed ? 'done' : ''}`}>{task.text}</div>
          {(showCategory || task.due_date || task.notes) && (
            <div className="task-meta">
              {showCategory && (
                <span className={`task-category-badge cat-${task.category}`}>
                  {cat.emoji} {cat.name.split('–')[0].trim()}
                </span>
              )}
              {task.due_date && <span className="task-date">📅 {formatDate(task.due_date)}</span>}
            </div>
          )}
          {task.notes && <div className="task-notes">"{task.notes}"</div>}
        </div>
        <div className="task-actions">
          <div
            className="points-badge"
            style={{ marginRight: 2 }}
            title={`${cat.points >= 0 ? '+' : ''}${cat.points} points`}
          >
            <span className={`points-badge ${cat.points > 0 ? 'points-pos' : cat.points < 0 ? 'points-neg' : 'points-zero'}`}>
              {cat.points > 0 ? '+' : ''}{cat.points}
            </span>
          </div>
          {!task.completed && (
            <button className="btn-icon" onClick={() => setEditing(true)} title="Edit">✏️</button>
          )}
          <button className="btn-icon" onClick={() => deleteTask(task.id)} title="Delete" style={{ color: '#ef4444' }}>✕</button>
        </div>
      </div>
      {editing && <EditTaskModal task={task} onClose={() => setEditing(false)} />}
    </>
  )
}
