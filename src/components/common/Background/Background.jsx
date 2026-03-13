/**
 * Background.jsx
 * Full-screen background component with a static background image.
 */

import { useRef, useEffect } from 'react'
import { ASSETS } from '../../../constants/index.js'
import './Background.css'

const Background = () => {
  const backgroundRef = useRef(null)

  useEffect(() => {
    if (!backgroundRef.current) return
    const bg = document.createElement('div')
    bg.className = 'background-image'
    bg.style.backgroundImage = `url(${ASSETS.BACKGROUND})`
    bg.style.opacity = '1'
    backgroundRef.current.appendChild(bg)
  }, [])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="background" ref={backgroundRef} />
  )
}

export default Background
