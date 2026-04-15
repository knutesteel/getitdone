import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { WEIRD_NEWS, SQUIRREL_WARNINGS } from '../data/constants'

export default function NewsBanner({ index = 0 }: { index?: number }) {
  const { setSquirrelWarning } = useApp()

  const story = useMemo(() => {
    const idx = index % WEIRD_NEWS.length
    return WEIRD_NEWS[idx]
  }, [index])

  const handleClick = () => {
    const warning = SQUIRREL_WARNINGS[Math.floor(Math.random() * SQUIRREL_WARNINGS.length)]
    setSquirrelWarning({ ...warning, url: story.url })
  }

  return (
    <div className="news-banner" onClick={handleClick}>
      <span className="news-banner-emoji">{story.emoji}</span>
      <div className="news-banner-text">
        <div className="news-banner-top">{story.top}</div>
        <div className="news-banner-bottom">{story.bottom}</div>
        <div className="news-banner-source">{story.source}</div>
      </div>
      <span className="news-banner-arrow">→</span>
    </div>
  )
}
