import React, { useState } from 'react'
import { BOOK_CHAPTERS } from '../data/constants'

export default function WhyView() {
  const [activeChapter, setActiveChapter] = useState(BOOK_CHAPTERS[0].id)

  const renderContent = (content: string) => {
    return content.split('\n\n').map((para, i) => {
      const parts = para.split(/(\*\*[^*]+\*\*)/)
      return (
        <p key={i} style={{ marginBottom: 14, lineHeight: 1.7, fontSize: 15, color: '#333' }}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>
            }
            return part
          })}
        </p>
      )
    })
  }

  const chapter = BOOK_CHAPTERS.find(c => c.id === activeChapter)!

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }} className="why-grid">
      <div style={{
        position: 'sticky',
        top: 80,
        background: 'white',
        border: '1.5px solid #e8e3d9',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 16px',
          background: '#1a1a1a',
          color: '#f5f0e6',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        }}>
          Contents
        </div>
        {BOOK_CHAPTERS.map(ch => (
          <button
            key={ch.id}
            onClick={() => setActiveChapter(ch.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              fontSize: 13,
              fontWeight: activeChapter === ch.id ? 700 : 400,
              border: 'none',
              borderLeft: `4px solid ${activeChapter === ch.id ? '#f5c518' : 'transparent'}`,
              borderBottom: '1px solid #e8e3d9',
              background: activeChapter === ch.id ? '#fffbeb' : 'transparent',
              color: '#1a1a1a',
              cursor: 'pointer',
              transition: 'all 0.15s',
              lineHeight: 1.4,
            }}
          >
            {ch.title}
          </button>
        ))}
        <div style={{ padding: '14px 16px', borderTop: '1.5px solid #e8e3d9' }}>
          <a
            href="https://www.amazon.com/Stop-Getting-Distracted-Your-Done/dp/B0FVF9HNYX"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', fontSize: 12, display: 'block', textAlign: 'center', padding: '10px' }}
          >
            📖 Get the Book
          </a>
        </div>
      </div>

      <div>
        <div style={{
          background: '#1a1a1a',
          color: '#f5f0e6',
          borderRadius: 10,
          padding: '24px 28px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#f5c518', marginBottom: 8 }}>
            Get Shit Done
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>
            {chapter.title}
          </div>
        </div>

        <div className="card" style={{ padding: '24px 28px' }}>
          {renderContent(chapter.content)}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
