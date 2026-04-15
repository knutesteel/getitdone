import React from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import type { ViewId } from '../types'

const TABS: { id: ViewId; label: string }[] = [
  { id: 'why', label: '📖 Why' },
  { id: 'news', label: '📰 News' },
  { id: 'today', label: 'Today' },
  { id: 'matrix', label: 'Matrix' },
  { id: 'braindump', label: 'Brain Dump' },
  { id: 'done', label: 'Done' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'wins', label: 'Wins' },
  { id: 'reviews', label: 'Reviews' },
]

export default function NavBar() {
  const { currentView, setCurrentView, user, isAdmin } = useApp()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const tabs = isAdmin ? [...TABS, { id: 'admin' as ViewId, label: '🔐 Admin' }] : TABS

  return (
    <nav className="nav-bar">
      <div className="nav-logo">GSD</div>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${currentView === tab.id ? 'active' : ''}`}
          onClick={() => setCurrentView(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      <div className="nav-right">
        <span className="nav-user-email">{user?.email}</span>
        <button className="nav-logout-btn" onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  )
}
