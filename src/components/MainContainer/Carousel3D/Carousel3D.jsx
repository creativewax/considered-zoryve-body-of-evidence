import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import ImageFrame from './ImageFrame.jsx'
import rotationStateManager from './RotationStateManager.js'
import poolManager from './PoolManager.js'

/**
 * Calculate rows and columns based on result count
 */
const getLayoutConfig = (resultCount) => {
  if (resultCount >= 45) {
    return { rows: 5, maxColumns: 9 }
  } else if (resultCount >= 21) {
    return { rows: 3, maxColumns: 7 }
  } else if (resultCount >= 2) {
    return { rows: 1, maxColumns: 5 }
  }
  return { rows: 1, maxColumns: 1 }
}

/**
 * Calculate angle for column position
 */
const getColumnAngle = (columnIndex, totalColumns, centerColumn) => {
  const offset = columnIndex - centerColumn
  const angleStep = (Math.PI * 2) / totalColumns
  return offset * angleStep
}

/**
 * Calculate opacity and blur based on angle from center
 */
const getVisualEffects = (angle, totalColumns) => {
  const normalizedAngle = Math.abs(angle)
  const maxAngle = Math.PI / 2 // 90 degrees
  const immediateNeighborAngle = Math.PI / totalColumns
  
  if (normalizedAngle <= immediateNeighborAngle) {
    // Center and immediate neighbors: full opacity, no blur
    return { opacity: 1, blur: 0 }
  }
  
  // Progressive fade and blur
  const fadeStart = immediateNeighborAngle
  const fadeRange = maxAngle - fadeStart
  const fadeProgress = Math.min(1, (normalizedAngle - fadeStart) / fadeRange)
  
  return {
    opacity: Math.max(0, 1 - fadeProgress),
    blur: fadeProgress * 0.1
  }
}

const CarouselScene = ({ images, onImageClick }) => {
  const groupRef = useRef()
  const containerRef = useRef()
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 })
  const [snapTween, setSnapTween] = useState(null)
  const dragThreshold = 5 // pixels

  const layoutConfig = useMemo(() => getLayoutConfig(images.length), [images.length])
  const { rows, maxColumns } = layoutConfig

  // Calculate total columns needed
  const totalColumns = Math.min(maxColumns, Math.ceil(images.length / rows))
  const centerColumn = Math.floor(totalColumns / 2)

  // Subscribe to rotation changes
  useEffect(() => {
    const unsubscribe = rotationStateManager.subscribe((newRotation) => {
      setRotation(newRotation)
    })
    return unsubscribe
  }, [])

  // Initialize pool
  useEffect(() => {
    const poolSize = rows * maxColumns * 2
    poolManager.initializePool(images, poolSize)
  }, [images, rows, maxColumns])

  // Handle mouse/touch events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handlePointerDown = (e) => {
      setIsDragging(false)
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0
      setDragStart({
        x: clientX,
        rotation: rotation
      })
      
      if (snapTween) {
        snapTween.kill()
        setSnapTween(null)
      }
    }

    const handlePointerMove = (e) => {
      if (dragStart.x === 0) return

      const clientX = e.clientX || e.touches?.[0]?.clientX || 0
      const deltaX = clientX - dragStart.x

      if (Math.abs(deltaX) > dragThreshold) {
        setIsDragging(true)
        
        const rotationDelta = (deltaX / window.innerWidth) * Math.PI * 0.5
        const newRotation = dragStart.rotation + rotationDelta
        
        rotationStateManager.setRotation(newRotation)
      }
    }

    const handlePointerUp = () => {
      if (isDragging) {
        const angleStep = (Math.PI * 2) / totalColumns
        const currentAngle = rotation % (Math.PI * 2)
        const normalizedAngle = currentAngle < 0 ? currentAngle + Math.PI * 2 : currentAngle
        const nearestColumnAngle = Math.round(normalizedAngle / angleStep) * angleStep
        
        const tween = gsap.to({ rotation }, {
          rotation: nearestColumnAngle,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: function() {
            rotationStateManager.setRotation(this.targets()[0].rotation)
          },
          onComplete: () => {
            setSnapTween(null)
          }
        })
        
        setSnapTween(tween)
      }
      
      setIsDragging(false)
      setDragStart({ x: 0, rotation: 0 })
    }

    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('pointercancel', handlePointerUp)

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [rotation, dragStart, isDragging, snapTween, totalColumns])

  // Update group rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation
    }
  })

  // Navigate to next/previous column
  const navigateColumn = (direction) => {
    const angleStep = (Math.PI * 2) / totalColumns
    const currentAngle = rotation % (Math.PI * 2)
    const normalizedAngle = currentAngle < 0 ? currentAngle + Math.PI * 2 : currentAngle
    const currentColumn = Math.round(normalizedAngle / angleStep)
    const nextColumn = currentColumn + direction
    const targetAngle = nextColumn * angleStep
    
    if (snapTween) snapTween.kill()
    
    const tween = gsap.to({ rotation }, {
      rotation: targetAngle,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: function() {
        rotationStateManager.setRotation(this.targets()[0].rotation)
      }
    })
    
    setSnapTween(tween)
  }

  // Expose navigation functions
  useEffect(() => {
    window.carouselNavigate = { next: () => navigateColumn(1), prev: () => navigateColumn(-1) }
    return () => { delete window.carouselNavigate }
  }, [totalColumns, rotation])

  // Render images in cylinder layout
  const renderImages = () => {
    const imageElements = []
    const radius = 5
    const imageSize = 1
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < totalColumns; col++) {
        const imageIndex = row * totalColumns + col
        if (imageIndex >= images.length) break

        const imageData = images[imageIndex]
        const columnAngle = getColumnAngle(col, totalColumns, centerColumn)
        
        const x = Math.sin(columnAngle) * radius
        const z = Math.cos(columnAngle) * radius
        const y = (row - (rows - 1) / 2) * 1.2
        
        const distanceFromCenter = Math.abs(columnAngle)
        const scale = 1 - (distanceFromCenter / (Math.PI / 2)) * 0.5
        
        const relativeAngle = columnAngle - rotation
        const effects = getVisualEffects(relativeAngle, totalColumns)
        
        imageElements.push(
          <ImageFrame
            key={`${imageIndex}-${row}-${col}`}
            imageData={imageData}
            position={[x, y, z]}
            rotation={[0, columnAngle + Math.PI / 2, 0]}
            scale={scale}
            opacity={effects.opacity}
            blur={effects.blur}
            onClick={() => onImageClick(imageData)}
          />
        )
      }
    }
    
    return imageElements
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <group ref={groupRef}>
          {renderImages()}
        </group>
      </Canvas>
    </div>
  )
}

const Carousel3D = ({ images, onImageClick, onNavigateNext, onNavigatePrev }) => {
  if (!images || images.length === 0) {
    return null
  }

  return <CarouselScene images={images} onImageClick={onImageClick} />
}

export default Carousel3D
