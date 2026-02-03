import { useMemo } from 'react'
import { ASSETS } from '../../../constants/index.js'
import { getRowCount } from './carouselHelpers.js'
import './Shadow.css'

const Shadow = ({ imageCount }) => {
  const rows = useMemo(() => getRowCount(imageCount), [imageCount])
  
  const offsetY = useMemo(() => {
    if (rows === 5) return 60
    if (rows === 3) return 30
    return 0
  }, [rows])

  return (
    <div 
      className="carousel-shadow"
      style={{ 
        '--shadow-offset-y': `${offsetY}px`,
        '--shadow-image': `url(${ASSETS.ICONS.SHADOW})`
      }}
    />
  )
}

export default Shadow
