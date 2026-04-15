import React from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/constants'
import NewsBanner from '../components/NewsBanner'

const REWARDS = [
  { emoji: '☕', name: 'Coffee Break', desc: 'You earned 15 minutes of guilt-free caffeine.' },
  { emoji: '😴', name: 'Power Nap', desc: '20 minutes. Set a timer. You deserve it.' },
  { emoji: '😎', name: 'Smug Satisfaction', desc: 'Walk around knowing you got shit done.' },
]

const REFLECTION_QUOTES = [
  "Productivity is not about doing more. It's about doing what matters.",
  "The secret is not chasing the butterfly. It's planting a garden and letting it come to you.",
  "Done is better than perfect. Perfect is the enemy of done.",
]

export default function WinsView() {
  const { tasks, score } = useApp()

  const completedTasks = tasks
    .filter(t => t.completed && t.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())

  const totalPoints = completedTasks.reduce((sum, t) => sum + CATEGORIES[t.category].points, 0)

  return (
    <div>
      <NewsBanner index={5} />

      <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
        Your Wins
      </div>

      <div style={{
        background: '#1a1a1a',
        border: '3px solid #f5c518',
        borderRadius: 12,
        padding: 32,
        textAlign: 'center',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#888', marginBottom: 8 }}>
          Total Score
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: '#f5c518', lineHeight: 1, marginBottom: 8 }}>
          {score?.total_score ?? totalPoints}
        </div>
        <div style={{ fontSize: 13, color: '#888' }}>
          {completedTasks.length} tasks completed • {score?.streak ?? 0} day streak
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="section-title-sm" style={{ marginBottom: 12 }}>Your Rewards</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {REWARDS.map(r => (
            <div key={r.name} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{r.emoji}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="section-title-sm" style={{ marginBottom: 10 }}>
            Recent Wins ({completedTasks.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
            {completedTasks.slice(0, 30).map(task => {
              const cat = CATEGORIES[task.category]
              const pts = cat.points
              return (
                <div key={task.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  background: 'white',
                  border: '1.5px solid #e8e3d9',
                  borderLeft: `4px solid ${cat.color}`,
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 14 }}>{cat.emoji}</span>
                  <div style={{ flex: 1, fontSize: 13, color: '#555', textDecoration: 'line-through' }}>{task.text}</div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: pts > 0 ? '#15803d' : pts < 0 ? '#b91c1c' : '#888',
                  }}>
                    {pts > 0 ? '+' : ''}{pts}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <div className="section-title-sm" style={{ marginBottom: 12 }}>Reflections</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {REFLECTION_QUOTES.map((q, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              background: 'white',
              borderLeft: '3px solid #f5c518',
              borderRadius: 6,
              fontSize: 14,
              fontStyle: 'italic',
              color: '#444',
              lineHeight: 1.6,
            }}>
              "{q}"
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
