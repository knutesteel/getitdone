import React from 'react'
import { useApp } from '../context/AppContext'

export default function ScoreboardBar() {
  const { tasks, score, getTodaysScore } = useApp()

  const todayScore = getTodaysScore()
  const today = new Date().toISOString().split('T')[0]
  const weekAgo = Date.now() - 7 * 86400000
  const weekDone = tasks.filter(t => t.completed && t.completed_at && new Date(t.completed_at).getTime() > weekAgo).length

  return (
    <div className="scoreboard-bar">
      <div className="score-item">
        <span className="score-label">Today</span>
        <span className="score-value">{todayScore >= 0 ? '+' : ''}{todayScore}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Total Score</span>
        <span className="score-value">{score?.total_score ?? 0}</span>
      </div>
      <div className="score-item">
        <span className="score-label">This Week</span>
        <span className="score-value">{weekDone}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Streak 🔥</span>
        <span className="score-value">{score?.streak ?? 0}</span>
      </div>
    </div>
  )
}
