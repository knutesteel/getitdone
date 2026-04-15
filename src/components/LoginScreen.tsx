import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError(err.message)
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) setError(err.message)
      else setSuccess('Account created! You are now signed in.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f0e6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, marginBottom: 4 }}>GSD</div>
          <div style={{ fontSize: 16, color: '#555', fontStyle: 'italic' }}>
            Get. Shit. Done.
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
            Points-driven task management that rewards real work.
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: '2px solid #1a1a1a', borderRadius: 8, overflow: 'hidden' }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === m ? '#1a1a1a' : 'transparent',
                  color: mode === m ? '#f5f0e6' : '#1a1a1a',
                  transition: 'all 0.15s',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="input"
                type="password"
                placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Your password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 13,
                color: '#b91c1c',
                marginBottom: 14,
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 13,
                color: '#15803d',
                marginBottom: 14,
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '16px', background: '#f5f0e6', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 8 }}>
              How it works
            </div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
              Complete <strong>Now tasks (+3 pts)</strong>, <strong>Someday tasks (+2 pts)</strong>, and <strong>For Some Reason tasks (+1 pt)</strong>.
              Delete busywork <strong>(-1 pt)</strong> and build your streak.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
