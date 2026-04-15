import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import type { CategoryId } from '../types'
import { CATEGORIES, BRUTAL_TRUTHS, FREE_TIER_LIMIT } from '../data/constants'
import TaskItem from '../components/TaskItem'
import NewsBanner from '../components/NewsBanner'
import WeeklyResetModal from '../components/WeeklyResetModal'

export default function TodayView() {
  const { tasks, addTask, getTodaysScore, score, showToast, isPaid, countAllActiveTasks } = useApp()
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskCat, setNewTaskCat] = useState<CategoryId>('now')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const todayScore = getTodaysScore()
  const incompleteTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks])
  const completedToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(t => t.completed && t.completed_at?.startsWith(today))
  }, [tasks])
  const topPriority = useMemo(() => tasks.find(t => !t.completed && t.category === 'now') ?? null, [tasks])
  const brutaTruth = useMemo(() => BRUTAL_TRUTHS[Math.floor(Math.random() * BRUTAL_TRUTHS.length)], [])
  const totalCount = incompleteTasks.length + completedToday.length
  const progress = totalCount > 0 ? Math.round((completedToday.length / totalCount) * 100) : 0

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    if (!isPaid() && countAllActiveTasks() >= FREE_TIER_LIMIT) {
      showToast(`Free plan limit: ${FREE_TIER_LIMIT} active tasks. Upgrade for unlimited.`)
      return
    }
    await addTask(newTaskText.trim(), newTaskCat, newTaskDate || null, '')
    setNewTaskText('')
    setNewTaskDate('')
    setShowAddForm(false)
  }

  const thisWeekDone = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000
    return tasks.filter(t => t.completed && t.completed_at && new Date(t.completed_at).getTime() > weekAgo).length
  }, [tasks])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <NewsBanner index={0} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase' }}>
            Today's Battle Plan
          </div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
            {incompleteTasks.length} tasks left • {completedToday.length} crushed today
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowReset(true)}>
            Weekly Reset
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(s => !s)}>
            + Add Task
          </button>
        </div>
      </div>

      {progress > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#888' }}>
              Today's Progress
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#888' }}>{progress}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="card" style={{ borderLeft: '3px solid #f5c518' }}>
          <form onSubmit={handleAddTask}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <input
                className="input"
                placeholder="What needs to get done?"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                autoFocus
                style={{ flex: 1, minWidth: 200 }}
              />
              <select
                className="input"
                value={newTaskCat}
                onChange={e => setNewTaskCat(e.target.value as CategoryId)}
                style={{ width: 'auto', flex: '0 0 auto' }}
              >
                {Object.values(CATEGORIES).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name} ({cat.points > 0 ? '+' : ''}{cat.points} pts)</option>
                ))}
              </select>
              <input
                type="date"
                className="input"
                value={newTaskDate}
                onChange={e => setNewTaskDate(e.target.value)}
                style={{ width: 'auto', flex: '0 0 auto' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Add Task</button>
            </div>
          </form>
        </div>
      )}

      {topPriority && (
        <div className="card card-dark" style={{ borderLeft: '4px solid #f5c518' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#f5c518', marginBottom: 8 }}>
            🐸 Eat the Frog First
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#f5f0e6' }}>{topPriority.text}</div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12, fontStyle: 'italic' }}>
            Five ugly minutes beats zero perfect ones.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              Start Ugly 🔥
            </button>
          </div>
        </div>
      )}

      {incompleteTasks.length > 0 ? (
        <div>
          <div className="section-title-sm" style={{ marginBottom: 10 }}>
            Active Tasks ({incompleteTasks.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {incompleteTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>All clear.</div>
          <div style={{ fontSize: 13, color: '#888' }}>You've handled everything. That's what a winner looks like.</div>
        </div>
      )}

      {completedToday.length > 0 && (
        <div>
          <div className="section-title-sm" style={{ marginBottom: 10 }}>Crushed Today ({completedToday.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {completedToday.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      <div className="card card-dark" style={{ borderLeft: '3px solid #f5c518' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#f5c518', marginBottom: 8 }}>
          Brutal Truth
        </div>
        <div style={{ fontSize: 14, fontStyle: 'italic', color: '#d4d4d4', lineHeight: 1.6 }}>
          "{brutaTruth}"
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Done This Week', value: thisWeekDone, icon: '✅' },
          { label: "Today's Score", value: todayScore >= 0 ? `+${todayScore}` : todayScore, icon: '⚡' },
          { label: 'Current Streak', value: score?.streak ?? 0, icon: '🔥' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#888', marginTop: 4 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {showReset && <WeeklyResetModal onClose={() => setShowReset(false)} />}
    </div>
  )
}
