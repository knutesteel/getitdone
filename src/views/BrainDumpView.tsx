import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { CategoryId, BrainDumpItem } from '../types'
import { CATEGORIES, FREE_TIER_LIMIT } from '../data/constants'
import NewsBanner from '../components/NewsBanner'

interface ExpandedItem {
  item: BrainDumpItem
  category: CategoryId
  dueDate: string
}

export default function BrainDumpView() {
  const { brainDumpItems, addBrainDumpItem, deleteBrainDumpItem, saveBrainDumpToMatrix, showToast, isPaid, countAllActiveTasks } = useApp()
  const [dumpText, setDumpText] = useState('')
  const [expanded, setExpanded] = useState<ExpandedItem | null>(null)

  const handleDump = async () => {
    const lines = dumpText.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) return
    for (const line of lines) {
      await addBrainDumpItem(line)
    }
    setDumpText('')
    showToast(`${lines.length} item${lines.length > 1 ? 's' : ''} captured!`)
  }

  const handleSaveToMatrix = async () => {
    if (!expanded) return
    if (!isPaid() && countAllActiveTasks() >= FREE_TIER_LIMIT) {
      showToast(`Free plan limit: ${FREE_TIER_LIMIT} active tasks.`)
      return
    }
    await saveBrainDumpToMatrix(expanded.item.id, expanded.category, expanded.dueDate || null)
    setExpanded(null)
    showToast('Moved to matrix!')
  }

  const openItem = (item: BrainDumpItem) => {
    setExpanded({ item, category: 'now', dueDate: '' })
  }

  return (
    <div>
      <NewsBanner index={2} />
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Brain Dump</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
          Dump it. Get it out of your head. No filter. Just dump it all here.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <textarea
          className="input textarea"
          style={{ minHeight: 140, fontSize: 15, lineHeight: 1.6, marginBottom: 10 }}
          placeholder={"Everything. Right now. No filter. Just dump it all here.\n\nOne thing per line. Hit capture when done."}
          value={dumpText}
          onChange={e => setDumpText(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setDumpText('')}>Clear</button>
          <button className="btn btn-primary" onClick={handleDump}>
            Capture {dumpText.split('\n').filter(l => l.trim()).length > 0
              ? `(${dumpText.split('\n').filter(l => l.trim()).length})`
              : ''}
          </button>
        </div>
      </div>

      {brainDumpItems.length > 0 ? (
        <>
          <div className="section-title-sm" style={{ marginBottom: 10 }}>
            Captured Items ({brainDumpItems.length}) — Click to categorize
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 10,
          }}>
            {brainDumpItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  border: '1.5px solid #e8e3d9',
                  borderRadius: 8,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onClick={() => openItem(item)}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#f5c518'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#e8e3d9'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                <button
                  onClick={e => { e.stopPropagation(); deleteBrainDumpItem(item.id) }}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: 'none',
                    border: 'none',
                    color: '#ccc',
                    cursor: 'pointer',
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >✕</button>
                <div style={{ fontSize: 13, lineHeight: 1.5, paddingRight: 16 }}>{item.text}</div>
                <div style={{ fontSize: 10, color: '#aaa', marginTop: 6 }}>Click to categorize</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🧠</div>
          <div className="empty-state-text">Your brain is clean. For now. Dump something.</div>
        </div>
      )}

      {expanded && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setExpanded(null)}>
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="modal-title">Categorize Item</div>
              <button onClick={() => setExpanded(null)} style={{ fontSize: 20, color: '#888', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{
              padding: '12px 14px',
              background: '#f5f0e6',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 16,
              lineHeight: 1.4,
            }}>
              {expanded.item.text}
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="input"
                value={expanded.category}
                onChange={e => setExpanded(prev => prev ? { ...prev, category: e.target.value as CategoryId } : null)}
              >
                {Object.values(CATEGORIES).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date (optional)</label>
              <input
                type="date"
                className="input"
                value={expanded.dueDate}
                onChange={e => setExpanded(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-danger btn-sm" onClick={() => { deleteBrainDumpItem(expanded.item.id); setExpanded(null) }}>
                Delete
              </button>
              <button className="btn btn-primary" onClick={handleSaveToMatrix} style={{ flex: 1 }}>
                Move to Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
