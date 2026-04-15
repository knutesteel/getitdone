export type CategoryId = 'now' | 'someday' | 'forSomeReason' | 'whyOnList' | 'squirrel' | 'rewards' | 'reflection'

export interface Category {
  id: CategoryId
  name: string
  points: number
  emoji: string
  color: string
}

export interface Task {
  id: string
  user_id: string
  text: string
  category: CategoryId
  due_date: string | null
  notes: string
  completed: boolean
  completed_at: string | null
  created_at: string
}

export interface BrainDumpItem {
  id: string
  user_id: string
  text: string
  created_at: string
}

export interface Review {
  id: string
  user_id: string | null
  title: string
  rating: number
  content: string
  author_name: string
  upvotes: number
  downvotes: number
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  subscription: 'free' | 'monthly' | 'yearly' | 'lifetime'
  subscription_granted_by: string | null
  created_at: string
  last_seen: string
}

export interface UserScore {
  id: string
  total_score: number
  streak: number
  last_completed_date: string | null
  updated_at: string
}

export type ViewId = 'why' | 'news' | 'today' | 'matrix' | 'braindump' | 'done' | 'calendar' | 'wins' | 'reviews' | 'admin'
export type CalendarViewMode = 'month' | 'week' | 'day'

export interface WeirdNewsStory {
  emoji: string
  top: string
  bottom: string
  source: string
  url: string
}

export interface SquirrelWarning {
  emoji: string
  title: string
  message: string
  url: string
}

export interface CompletionPopup {
  task: Task
  points: number
  quote: string
}
