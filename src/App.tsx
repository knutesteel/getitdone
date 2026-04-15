import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import LoginScreen from './components/LoginScreen'
import NavBar from './components/NavBar'
import ScoreboardBar from './components/ScoreboardBar'
import CompletionPopup from './components/CompletionPopup'
import SquirrelWarningModal from './components/SquirrelWarningModal'
import Toast from './components/Toast'
import TodayView from './views/TodayView'
import MatrixView from './views/MatrixView'
import BrainDumpView from './views/BrainDumpView'
import DoneView from './views/DoneView'
import CalendarView from './views/CalendarView'
import WinsView from './views/WinsView'
import ReviewsView from './views/ReviewsView'
import WhyView from './views/WhyView'
import NewsView from './views/NewsView'
import AdminView from './views/AdminView'

function AppShell() {
  const { user, currentView } = useApp()

  if (!user) return <LoginScreen />

  return (
    <div className="app-shell">
      <NavBar />
      <ScoreboardBar />
      <main className="main-content">
        {currentView === 'why' && <WhyView />}
        {currentView === 'news' && <NewsView />}
        {currentView === 'today' && <TodayView />}
        {currentView === 'matrix' && <MatrixView />}
        {currentView === 'braindump' && <BrainDumpView />}
        {currentView === 'done' && <DoneView />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'wins' && <WinsView />}
        {currentView === 'reviews' && <ReviewsView />}
        {currentView === 'admin' && <AdminView />}
      </main>
      <CompletionPopup />
      <SquirrelWarningModal />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
