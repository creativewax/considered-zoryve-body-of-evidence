import { useMemo } from 'react'
import { ASSETS } from '../../../constants/index.js'
import './Shadow.css'

/**
 * Calculate rows based on result count
 */
const getRowCount = (resultCount) => {
  if (resultCount >= 45) return 5
  if (resultCount >= 21) return 3
  if (resultCount >= 2) return 1
  return 1
}

const Shadow = ({ imageCount }) => {
  const rows = useMemo(() => getRowCount(imageCount), [imageCount])
  
  // Calculate vertical offset based on row count
  // More rows = shadow moves down
  const offsetY = useMemo(() => {
    if (rows === 5) return 60 // px
    if (rows === 3) return 30 // px
    return 0 // px
  }, [rows])

  return (
    <div 
      className="carousel-shadow"
      style={{ 
        transform: `translateX(-50%) translateY(${offsetY}px)`,
        backgroundImage: `url(${ASSETS.ICONS.SHADOW})`
      }}
    />
  )
}

export default Shadow
