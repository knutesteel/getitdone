import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/constants'
import NewsBanner from '../components/NewsBanner'

type PointFilter = 'all' | '3' | '2' | '1' | '0' | '-1'

export default function DoneView() {
  const { tasks } = useApp()
  const [filter, setFilter] = useState<PointFilter>('all')

  const completedTasks = useMemo(() => {
    return tasks
      .filter(t => t.completed && t.completed_at)
      .filter(t => {
        if (filter === 'all') return true
        return CATEGORIES[t.category].points === parseInt(filter)
      })
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
  }, [tasks, filter])

  const totalPoints = useMemo(() => {
    return tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + CATEGORIES[t.category].points, 0)
  }, [tasks])

  const groupByDate = (tasks: typeof completedTasks) => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const weekAgo = Date.now() - 7 * 86400000

    const groups: Record<string, typeof completedTasks> = {}
    tasks.forEach(t => {
      const date = t.completed_at!.split('T')[0]
      let label: string
      if (date === today) label = 'Today'
      else if (date === yesterday) label = 'Yesterday'
      else if (new Date(date).getTime() > weekAgo) label = 'This Week'
      else label = 'Earlier'
      if (!groups[label]) groups[label] = []
      groups[label].push(t)
    })
    return groups
  }

  const groups = groupByDate(completedTasks)
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier']

  return (
    <div>
      <NewsBanner index={3} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Completed</div>
          <div style={{ fontSize: 13, color: '#888' }}>
            {tasks.filter(t => t.completed).length} total • {totalPoints >= 0 ? '+' : ''}{totalPoints} pts
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {([['all', 'All'], ['3', '+3'], ['2', '+2'], ['1', '+1'], ['0', '0'], ['-1', '-1']] as [PointFilter, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: '5px 12px',
                border: `2px solid ${filter === val ? '#1a1a1a' : '#e8e3d9'}`,
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                background: filter === val ? '#1a1a1a' : 'transparent',
                color: filter === val ? '#f5f0e6' : '#666',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">Nothing completed yet. Get to work.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groupOrder.filter(g => groups[g]).map(group => (
            <div key={group}>
              <div className="section-title-sm" style={{ marginBottom: 8 }}>{group}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {groups[group].map(task => {
                  const cat = CATEGORIES[task.category]
                  const pts = cat.points
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'white',
                        border: '1.5px solid #e8e3d9',
                        borderLeft: `4px solid ${cat.color}`,
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, textDecoration: 'line-through', color: '#888' }}>
                          {task.text}
                        </div>
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>
                          {cat.emoji} {cat.name}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: pts > 0 ? '#15803d' : pts < 0 ? '#b91c1c' : '#888',
                        flex: '0 0 auto',
                      }}>
                        {pts > 0 ? '+' : ''}{pts} pts
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
