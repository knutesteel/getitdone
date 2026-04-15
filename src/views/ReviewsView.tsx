import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import type { Review } from '../types'

const SAMPLE_REVIEWS: Omit<Review, 'id' | 'user_id' | 'created_at'>[] = [
  { title: 'Finally, a system that actually works', rating: 5, content: 'I\'ve tried every productivity book out there. This one cuts through the fluff and gives you a real system. The point scoring is brilliant—it makes you honest about what you\'re actually doing.', author_name: 'Sarah M.', upvotes: 24, downvotes: 2 },
  { title: 'Brutal honesty, zero excuses', rating: 5, content: 'The "Why Is This On My List?" category alone is worth the price. I deleted 40% of my tasks and felt instantly better. The squirrel tracking is genius—I didn\'t realize how distracted I was.', author_name: 'Marcus T.', upvotes: 18, downvotes: 1 },
  { title: 'Not for the sensitive', rating: 4, content: 'This book will call you out. If you\'re easily offended by bluntness, look elsewhere. If you want real results, buckle up. Changed how I prioritize everything.', author_name: 'Jennifer K.', upvotes: 15, downvotes: 3 },
  { title: 'The frog analogy finally clicked', rating: 5, content: 'I\'ve heard "eat the frog" a hundred times. This book finally explained WHY it works, not just what it means. The point system reinforces the habit beautifully.', author_name: 'David R.', upvotes: 12, downvotes: 0 },
  { title: 'Solid system, needs digital companion', rating: 4, content: 'The methodology is solid but the worksheet can be tedious. That\'s why this app is a perfect companion—everything in one place with automatic scoring.', author_name: 'Alex P.', upvotes: 9, downvotes: 2 },
]

export default function ReviewsView() {
  const { user, showToast } = useApp()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({})

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (data && data.length > 0) {
      setReviews(data as Review[])
    } else {
      await seedReviews()
    }
    if (user) {
      const { data: votes } = await supabase.from('review_votes').select('review_id, vote_type').eq('user_id', user.id)
      if (votes) {
        const map: Record<string, 'up' | 'down'> = {}
        votes.forEach(v => { map[v.review_id] = v.vote_type })
        setUserVotes(map)
      }
    }
    setLoading(false)
  }

  const seedReviews = async () => {
    const toInsert = SAMPLE_REVIEWS.map(r => ({ ...r, user_id: null }))
    const { data } = await supabase.from('reviews').insert(toInsert).select()
    if (data) setReviews(data as Review[])
  }

  const handleVote = async (reviewId: string, voteType: 'up' | 'down') => {
    if (!user) { showToast('Sign in to vote'); return }
    const existing = userVotes[reviewId]
    const review = reviews.find(r => r.id === reviewId)
    if (!review) return

    if (existing === voteType) {
      await supabase.from('review_votes').delete().eq('user_id', user.id).eq('review_id', reviewId)
      const update = voteType === 'up'
        ? { upvotes: review.upvotes - 1 }
        : { downvotes: review.downvotes - 1 }
      await supabase.from('reviews').update(update).eq('id', reviewId)
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...update } : r))
      setUserVotes(prev => { const n = { ...prev }; delete n[reviewId]; return n })
    } else {
      if (existing) {
        await supabase.from('review_votes').update({ vote_type: voteType }).eq('user_id', user.id).eq('review_id', reviewId)
      } else {
        await supabase.from('review_votes').insert({ user_id: user.id, review_id: reviewId, vote_type: voteType })
      }
      const update = existing === 'up'
        ? { upvotes: review.upvotes - 1, downvotes: review.downvotes + 1 }
        : existing === 'down'
          ? { upvotes: review.upvotes + 1, downvotes: review.downvotes - 1 }
          : voteType === 'up'
            ? { upvotes: review.upvotes + 1 }
            : { downvotes: review.downvotes + 1 }
      await supabase.from('reviews').update(update).eq('id', reviewId)
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...update } : r))
      setUserVotes(prev => ({ ...prev, [reviewId]: voteType }))
    }
  }

  const sorted = [...reviews].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Book Reviews</div>
          <div style={{ fontSize: 13, color: '#888' }}>Real talk from real readers. Vote for the best.</div>
        </div>
        <a
          href="https://www.amazon.com/Stop-Getting-Distracted-Your-Done/dp/B0FVF9HNYX"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          ⭐ Leave a Review on Amazon
        </a>
      </div>

      <div style={{
        background: '#1a1a1a',
        color: '#f5f0e6',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 24 }}>🏆</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f5c518' }}>Weekly Contest</div>
          <div style={{ fontSize: 12, color: '#888' }}>
            Best review each week wins. Vote for your favorites. Leave one on Amazon for +5 bonus points.
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><div className="empty-state-text">Loading reviews...</div></div>
      ) : sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">No reviews yet. Be the first!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sorted.map((review, idx) => (
            <div key={review.id} className="card" style={{ borderLeft: idx === 0 ? '4px solid #f5c518' : undefined }}>
              {idx === 0 && (
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#f5c518', marginBottom: 8 }}>
                  🏆 Top Rated
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{review.title}</span>
                    <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 8 }}>"{review.content}"</div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    — {review.author_name} • {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '0 0 auto' }}>
                  <button
                    onClick={() => handleVote(review.id, 'up')}
                    style={{
                      padding: '6px 10px',
                      border: `2px solid ${userVotes[review.id] === 'up' ? '#22c55e' : '#e8e3d9'}`,
                      borderRadius: 6,
                      background: userVotes[review.id] === 'up' ? '#dcfce7' : 'transparent',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      color: userVotes[review.id] === 'up' ? '#15803d' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s',
                    }}
                  >
                    👍 {review.upvotes}
                  </button>
                  <button
                    onClick={() => handleVote(review.id, 'down')}
                    style={{
                      padding: '6px 10px',
                      border: `2px solid ${userVotes[review.id] === 'down' ? '#ef4444' : '#e8e3d9'}`,
                      borderRadius: 6,
                      background: userVotes[review.id] === 'down' ? '#fee2e2' : 'transparent',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      color: userVotes[review.id] === 'down' ? '#b91c1c' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s',
                    }}
                  >
                    👎 {review.downvotes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
