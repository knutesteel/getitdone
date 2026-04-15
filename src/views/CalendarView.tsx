import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import type { CalendarViewMode } from '../types'
import { CATEGORIES } from '../data/constants'
import NewsBanner from '../components/NewsBanner'

export default function CalendarView() {
  const { tasks } = useApp()
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getTasksForDate = (date: Date) => {
    const d = date.toISOString().split('T')[0]
    return tasks.filter(t => t.due_date === d || (t.completed_at && t.completed_at.startsWith(d)))
  }

  const navigate = (dir: number) => {
    const d = new Date(currentDate)
    if (viewMode === 'month') d.setMonth(d.getMonth() + dir)
    else if (viewMode === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setDate(d.getDate() + dir)
    setCurrentDate(d)
  }

  const formatHeader = () => {
    if (viewMode === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (viewMode === 'week') {
      const start = getWeekStart(currentDate)
      const end = new Date(start); end.setDate(end.getDate() + 6)
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const renderMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []

    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {dayLabels.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#888', padding: '6px 0' }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} />
            const dayTasks = getTasksForDate(date)
            const isToday = date.getTime() === today.getTime()
            return (
              <div
                key={date.toISOString()}
                onClick={() => { setCurrentDate(date); setViewMode('day') }}
                style={{
                  minHeight: 70,
                  padding: '6px 4px',
                  border: `1.5px solid ${isToday ? '#f5c518' : '#e8e3d9'}`,
                  borderRadius: 6,
                  background: isToday ? '#fffbeb' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  fontSize: 12,
                  fontWeight: isToday ? 900 : 500,
                  color: isToday ? '#1a1a1a' : '#444',
                  marginBottom: 4,
                }}>
                  {date.getDate()}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {dayTasks.slice(0, 3).map(t => (
                    <div
                      key={t.id}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: CATEGORIES[t.category].color,
                        flexShrink: 0,
                      }}
                      title={t.text}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <div style={{ fontSize: 9, color: '#888', alignSelf: 'center' }}>+{dayTasks.length - 3}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeek = () => {
    const start = getWeekStart(currentDate)
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(d.getDate() + i); return d
    })

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {days.map(date => {
          const dayTasks = getTasksForDate(date)
          const isToday = date.getTime() === today.getTime()
          return (
            <div key={date.toISOString()} style={{
              border: `2px solid ${isToday ? '#f5c518' : '#e8e3d9'}`,
              borderRadius: 8,
              overflow: 'hidden',
              background: isToday ? '#fffbeb' : 'white',
            }}>
              <div style={{
                padding: '8px 8px 6px',
                background: isToday ? '#f5c518' : '#f5f0e6',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a' }}>{date.getDate()}</div>
              </div>
              <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 60 }}>
                {dayTasks.length === 0 ? (
                  <div style={{ fontSize: 10, color: '#ccc', textAlign: 'center', padding: 8 }}>—</div>
                ) : dayTasks.map(t => (
                  <div key={t.id} style={{
                    fontSize: 10,
                    padding: '3px 6px',
                    borderRadius: 4,
                    background: CATEGORIES[t.category].color,
                    color: t.category === 'rewards' ? '#1a1a1a' : 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {t.text}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDay = () => {
    const dayTasks = getTasksForDate(currentDate)
    const isToday = currentDate.getTime() === today.getTime()
    const grouped: Record<string, typeof dayTasks> = {}
    dayTasks.forEach(t => {
      if (!grouped[t.category]) grouped[t.category] = []
      grouped[t.category].push(t)
    })

    return (
      <div>
        <div style={{
          textAlign: 'center',
          marginBottom: 20,
          padding: '20px',
          background: isToday ? '#fffbeb' : 'white',
          border: `2px solid ${isToday ? '#f5c518' : '#e8e3d9'}`,
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: '#1a1a1a' }}>
            {currentDate.getDate()}
          </div>
          <div style={{ fontSize: 14, color: '#888' }}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
            {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} this day
          </div>
        </div>
        {dayTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">No tasks scheduled for this day.</div>
          </div>
        ) : Object.entries(grouped).map(([catId, catTasks]) => {
          const cat = CATEGORIES[catId as keyof typeof CATEGORIES]
          return (
            <div key={catId} style={{ marginBottom: 16 }}>
              <div className="section-title-sm" style={{ marginBottom: 8 }}>{cat.emoji} {cat.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {catTasks.map(t => (
                  <div key={t.id} style={{
                    padding: '10px 14px',
                    background: 'white',
                    border: '1.5px solid #e8e3d9',
                    borderLeft: `4px solid ${cat.color}`,
                    borderRadius: 8,
                    fontSize: 14,
                    textDecoration: t.completed ? 'line-through' : 'none',
                    color: t.completed ? '#aaa' : '#1a1a1a',
                  }}>
                    {t.text}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <NewsBanner index={4} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>←</button>
          <div style={{ fontSize: 16, fontWeight: 700, minWidth: 200, textAlign: 'center' }}>{formatHeader()}</div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(1)}>→</button>
        </div>
        <div style={{ display: 'flex', gap: 4, border: '2px solid #1a1a1a', borderRadius: 8, overflow: 'hidden' }}>
          {(['month', 'week', 'day'] as CalendarViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === mode ? '#1a1a1a' : 'transparent',
                color: viewMode === mode ? '#f5f0e6' : '#1a1a1a',
                transition: 'all 0.15s',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'month' && renderMonth()}
      {viewMode === 'week' && renderWeek()}
      {viewMode === 'day' && renderDay()}
    </div>
  )
}
