import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Task, BrainDumpItem, UserProfile, UserScore, CompletionPopup, ViewId, CategoryId, SquirrelWarning } from '../types'
import { CATEGORIES, COMPLETION_QUOTES, SQUIRREL_WARNINGS, ADMIN_EMAIL } from '../data/constants'

interface AppContextType {
  user: User | null
  profile: UserProfile | null
  score: UserScore | null
  tasks: Task[]
  brainDumpItems: BrainDumpItem[]
  currentView: ViewId
  setCurrentView: (v: ViewId) => void
  completionPopup: CompletionPopup | null
  setCompletionPopup: (p: CompletionPopup | null) => void
  squirrelWarning: SquirrelWarning & { url: string } | null
  setSquirrelWarning: (w: (SquirrelWarning & { url: string }) | null) => void
  toast: string | null
  showToast: (msg: string) => void
  addTask: (text: string, category: CategoryId, dueDate: string | null, notes: string) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  addBrainDumpItem: (text: string) => Promise<void>
  deleteBrainDumpItem: (id: string) => Promise<void>
  saveBrainDumpToMatrix: (id: string, category: CategoryId, dueDate: string | null) => Promise<void>
  getTodaysScore: () => number
  getTodaysTasks: () => Task[]
  getTopPriority: () => Task | null
  isAdmin: boolean
  isPaid: () => boolean
  countAllActiveTasks: () => number
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refetchScore: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [score, setScore] = useState<UserScore | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [brainDumpItems, setBrainDumpItems] = useState<BrainDumpItem[]>([])
  const [currentView, setCurrentView] = useState<ViewId>('today')
  const [completionPopup, setCompletionPopup] = useState<CompletionPopup | null>(null)
  const [squirrelWarning, setSquirrelWarning] = useState<(SquirrelWarning & { url: string }) | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const isAdmin = user?.email === ADMIN_EMAIL

  const isPaid = useCallback(() => {
    return profile?.subscription !== 'free'
  }, [profile])

  const countAllActiveTasks = useCallback(() => {
    return tasks.filter(t => !t.completed).length + brainDumpItems.length
  }, [tasks, brainDumpItems])

  const fetchTasks = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    if (data) setTasks(data as Task[])
  }, [])

  const fetchBrainDump = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('brain_dump_items')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    if (data) setBrainDumpItems(data as BrainDumpItem[])
  }, [])

  const fetchProfile = useCallback(async (uid: string, email: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle()

    if (data) {
      setProfile(data as UserProfile)
      await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', uid)
    } else {
      const newProfile = { id: uid, email, subscription: 'free' as const, subscription_granted_by: null }
      await supabase.from('profiles').insert(newProfile)
      setProfile({ ...newProfile, created_at: new Date().toISOString(), last_seen: new Date().toISOString() })
    }
  }, [])

  const refetchScore = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('user_scores')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (data) {
      setScore(data as UserScore)
    } else {
      const newScore = { id: user.id, total_score: 0, streak: 0, last_completed_date: null }
      await supabase.from('user_scores').insert(newScore)
      setScore({ ...newScore, updated_at: new Date().toISOString() })
    }
  }, [user])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          await fetchProfile(u.id, u.email ?? '')
          await fetchTasks(u.id)
          await fetchBrainDump(u.id)
          await refetchScore()
        } else {
          setProfile(null)
          setTasks([])
          setBrainDumpItems([])
          setScore(null)
        }
      })()
    })
    return () => subscription.unsubscribe()
  }, [fetchProfile, fetchTasks, fetchBrainDump, refetchScore])

  const getTodaysScore = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks
      .filter(t => t.completed && t.completed_at && t.completed_at.startsWith(today))
      .reduce((sum, t) => sum + CATEGORIES[t.category].points, 0)
  }, [tasks])

  const getTodaysTasks = useCallback(() => {
    return tasks.filter(t => !t.completed)
  }, [tasks])

  const getTopPriority = useCallback(() => {
    return tasks.find(t => !t.completed && t.category === 'now') ?? null
  }, [tasks])

  const addTask = useCallback(async (text: string, category: CategoryId, dueDate: string | null, notes: string) => {
    if (!user) return
    const newTask = {
      user_id: user.id,
      text,
      category,
      due_date: dueDate,
      notes,
      completed: false,
      completed_at: null,
    }
    const { data, error } = await supabase.from('tasks').insert(newTask).select().single()
    if (!error && data) {
      setTasks(prev => [data as Task, ...prev])
    }
  }, [user])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
    if (!error && data) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } as Task : t))
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const toggleTask = useCallback(async (id: string) => {
    if (!user) return
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const wasCompleted = task.completed
    const now = new Date().toISOString()
    const updates: Partial<Task> = {
      completed: !wasCompleted,
      completed_at: !wasCompleted ? now : null,
    }

    await updateTask(id, updates)

    if (!wasCompleted) {
      const points = CATEGORIES[task.category].points
      const quote = COMPLETION_QUOTES[Math.floor(Math.random() * COMPLETION_QUOTES.length)]
      setCompletionPopup({ task: { ...task, ...updates } as Task, points, quote })

      const today = now.split('T')[0]
      const lastDate = score?.last_completed_date
      const newStreak = lastDate === today
        ? (score?.streak ?? 0)
        : lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
          ? (score?.streak ?? 0) + 1
          : 1
      const newTotal = (score?.total_score ?? 0) + points

      const scoreUpdate = { total_score: newTotal, streak: newStreak, last_completed_date: today, updated_at: now }
      await supabase.from('user_scores').upsert({ id: user.id, ...scoreUpdate })
      setScore(prev => prev ? { ...prev, ...scoreUpdate } : { id: user.id, ...scoreUpdate })
    } else {
      const points = CATEGORIES[task.category].points
      const newTotal = Math.max(0, (score?.total_score ?? 0) - points)
      const scoreUpdate = { total_score: newTotal, updated_at: now }
      await supabase.from('user_scores').update(scoreUpdate).eq('id', user.id)
      setScore(prev => prev ? { ...prev, ...scoreUpdate } : null)
    }
  }, [user, tasks, score, updateTask])

  const addBrainDumpItem = useCallback(async (text: string) => {
    if (!user) return
    const { data, error } = await supabase.from('brain_dump_items').insert({ user_id: user.id, text }).select().single()
    if (!error && data) {
      setBrainDumpItems(prev => [data as BrainDumpItem, ...prev])
    }
  }, [user])

  const deleteBrainDumpItem = useCallback(async (id: string) => {
    await supabase.from('brain_dump_items').delete().eq('id', id)
    setBrainDumpItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const saveBrainDumpToMatrix = useCallback(async (id: string, category: CategoryId, dueDate: string | null) => {
    const item = brainDumpItems.find(i => i.id === id)
    if (!item || !user) return
    await addTask(item.text, category, dueDate, '')
    await deleteBrainDumpItem(id)
  }, [brainDumpItems, user, addTask, deleteBrainDumpItem])

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return
    await supabase.from('profiles').update(updates).eq('id', user.id)
    setProfile(prev => prev ? { ...prev, ...updates } : null)
  }, [user])

  return (
    <AppContext.Provider value={{
      user, profile, score, tasks, brainDumpItems,
      currentView, setCurrentView,
      completionPopup, setCompletionPopup,
      squirrelWarning, setSquirrelWarning,
      toast, showToast,
      addTask, updateTask, deleteTask, toggleTask,
      addBrainDumpItem, deleteBrainDumpItem, saveBrainDumpToMatrix,
      getTodaysScore, getTodaysTasks, getTopPriority,
      isAdmin, isPaid, countAllActiveTasks,
      updateProfile, refetchScore,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
