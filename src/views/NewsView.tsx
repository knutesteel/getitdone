import React from 'react'
import { useApp } from '../context/AppContext'
import { WEIRD_NEWS, SQUIRREL_WARNINGS } from '../data/constants'

export default function NewsView() {
  const { setSquirrelWarning } = useApp()

  const handleStoryClick = (url: string) => {
    const warning = SQUIRREL_WARNINGS[Math.floor(Math.random() * SQUIRREL_WARNINGS.length)]
    setSquirrelWarning({ ...warning, url })
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
          Weird News
        </div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
          Curated distractions. Each click costs -1 point. You've been warned.
        </div>
      </div>

      <div style={{
        background: '#1a1a1a',
        color: '#f5f0e6',
        borderRadius: 10,
        padding: '14px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontSize: 24 }}>🐿️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f5c518' }}>Squirrel Warning Active</div>
          <div style={{ fontSize: 12, color: '#888' }}>
            Clicking any story triggers a -1 point warning. Choose wisely.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {WEIRD_NEWS.map((story, i) => (
          <div
            key={i}
            onClick={() => handleStoryClick(story.url)}
            style={{
              background: '#1a1a1a',
              borderRadius: 10,
              padding: '16px 18px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              border: '2px solid transparent',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#f5c518'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
            }}
          >
            <span style={{ fontSize: 28, flex: '0 0 auto' }}>{story.emoji}</span>
            <div>
              <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
                {story.top}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f5c518', lineHeight: 1.4, marginBottom: 6 }}>
                {story.bottom}
              </div>
              <div style={{ fontSize: 10, color: '#555' }}>{story.source}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
