import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { CategoryId, Task } from '../types'
import { CATEGORIES, MATRIX_CATEGORIES, FREE_TIER_LIMIT } from '../data/constants'
import TaskItem from '../components/TaskItem'
import NewsBanner from '../components/NewsBanner'

export default function MatrixView() {
  const { tasks, addTask, updateTask, showToast, isPaid, countAllActiveTasks } = useApp()
  const [newTaskTexts, setNewTaskTexts] = useState<Record<CategoryId, string>>({} as Record<CategoryId, string>)
  const [dragOverCol, setDragOverCol] = useState<CategoryId | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const getColTasks = (cat: CategoryId) =>
    tasks.filter(t => t.category === cat && !t.completed)

  const handleAddTask = async (cat: CategoryId) => {
    const text = newTaskTexts[cat]?.trim()
    if (!text) return
    if (!isPaid() && countAllActiveTasks() >= FREE_TIER_LIMIT) {
      showToast(`Free plan limit: ${FREE_TIER_LIMIT} active tasks.`)
      return
    }
    await addTask(text, cat, null, '')
    setNewTaskTexts(prev => ({ ...prev, [cat]: '' }))
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingId(taskId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', taskId)
  }

  const handleDrop = async (e: React.DragEvent, cat: CategoryId) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId && draggingId === taskId) {
      await updateTask(taskId, { category: cat })
    }
    setDragOverCol(null)
    setDraggingId(null)
  }

  return (
    <div>
      <NewsBanner index={1} />
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Task Matrix</div>
        <div style={{ fontSize: 13, color: '#888' }}>Drag tasks between columns to reprioritize.</div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}
        className="matrix-grid"
      >
        {MATRIX_CATEGORIES.map((catId) => {
          const cat = CATEGORIES[catId]
          const colTasks = getColTasks(catId)
          const isOver = dragOverCol === catId
          return (
            <div
              key={catId}
              onDragOver={e => { e.preventDefault(); setDragOverCol(catId) }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={e => handleDrop(e, catId)}
              style={{
                background: isOver ? '#fffbeb' : '#fafaf8',
                border: `2px solid ${isOver ? '#f5c518' : '#e8e3d9'}`,
                borderRadius: 10,
                padding: 12,
                minHeight: 200,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {cat.name.split('–')[0].trim()}
                    </div>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: cat.points > 0 ? '#15803d' : cat.points < 0 ? '#b91c1c' : '#888',
                    }}>
                      {cat.points > 0 ? '+' : ''}{cat.points} pts each
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    className="input"
                    placeholder="Add task..."
                    style={{ fontSize: 12, padding: '6px 8px' }}
                    value={newTaskTexts[catId] ?? ''}
                    onChange={e => setNewTaskTexts(prev => ({ ...prev, [catId]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAddTask(catId)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddTask(catId)}
                    style={{ flex: '0 0 auto', padding: '6px 10px' }}
                  >+</button>
                </div>
              </div>

              {colTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 8px', color: '#bbb', fontSize: 12 }}>
                  Drop tasks here
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={e => handleDragStart(e, task.id)}
                      style={{ cursor: 'grab' }}
                    >
                      <TaskItem task={task} showCategory={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .matrix-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
