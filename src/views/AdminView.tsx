import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types'

export default function AdminView() {
  const { isAdmin, user } = useApp()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return
    loadUsers()
  }, [isAdmin])

  const loadUsers = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setUsers(data as UserProfile[])
    setLoading(false)
  }

  const updateSubscription = async (uid: string, subscription: string) => {
    await supabase.from('profiles').update({
      subscription,
      subscription_granted_by: user?.email,
    }).eq('id', uid)
    await loadUsers()
  }

  if (!isAdmin) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔐</div>
        <div className="empty-state-text">Admin access required.</div>
      </div>
    )
  }

  const paidUsers = users.filter(u => u.subscription !== 'free')
  const lifetimeUsers = users.filter(u => u.subscription === 'lifetime')
  const conversionRate = users.length > 0 ? Math.round((paidUsers.length / users.length) * 100) : 0

  const subBadgeStyle = (sub: string) => {
    const colors: Record<string, string> = {
      free: '#6b7280',
      monthly: '#3b82f6',
      yearly: '#f59e0b',
      lifetime: '#22c55e',
    }
    return {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      background: colors[sub] ?? '#888',
      color: 'white',
    }
  }

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>
        Admin Dashboard
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }} className="admin-stats">
        {[
          { label: 'Total Users', value: users.length, icon: '👥' },
          { label: 'Paid Users', value: paidUsers.length, icon: '💳' },
          { label: 'Lifetime', value: lifetimeUsers.length, icon: '♾️' },
          { label: 'Conversion', value: `${conversionRate}%`, icon: '📈' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a' }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#888', marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="empty-state"><div className="empty-state-text">Loading users...</div></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1.5px solid #e8e3d9', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Users ({users.length})
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f0e6' }}>
                  {['Email', 'Plan', 'Created', 'Last Seen', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#888', borderBottom: '1.5px solid #e8e3d9' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #e8e3d9' : 'none' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>{u.email}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={subBadgeStyle(u.subscription)}>{u.subscription}</span>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#888' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#888' }}>
                      {new Date(u.last_seen).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {u.subscription !== 'lifetime' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateSubscription(u.id, 'lifetime')}
                          >
                            Grant Lifetime
                          </button>
                        )}
                        {u.subscription !== 'free' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateSubscription(u.id, 'free')}
                          >
                            Downgrade
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
