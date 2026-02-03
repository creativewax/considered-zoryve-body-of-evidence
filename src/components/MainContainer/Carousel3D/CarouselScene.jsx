// CarouselScene - R3F scene with drag interaction and image rendering

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import ImageFrame from './ImageFrame'
import poolManager from './PoolManager'
import rotationStateManager from './RotationStateManager'
import { calculateCylinderPosition, calculateVisibility, getAngleFromCenter, isDragThresholdMet } from './carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../../constants/carousel'

const CarouselScene = ({ layoutConfig }) => {
  const { gl, camera } = useThree()
  
  // Update camera position when layout config changes
  useEffect(() => {
    if (layoutConfig && camera) {
      gsap.to(camera.position, {
        z: layoutConfig.cameraZ,
        duration: CAROUSEL_SETTINGS.transitionFadeDuration,
        ease: 'power2.inOut'
      })
    }
  }, [layoutConfig, camera])
  const dragRef = useRef({ active: false, moved: false, startX: 0, startRotation: 0 })
  const clickRef = useRef({ isDragging: false })

  const [rotation, setRotation] = useState(rotationStateManager.getRotation())
  const [activeSlots, setActiveSlots] = useState([])

  // Subscribe to rotation updates
  useEffect(() => rotationStateManager.subscribe(setRotation), [])

  // Subscribe to pool updates
  useEffect(() => {
    const update = () => setActiveSlots([...poolManager.getActiveSlots()])
    update()
    return poolManager.subscribe(update)
  }, [])

  // Update pool each frame
  useFrame(() => poolManager.updatePoolAssignments(rotationStateManager.getRotation()))

  // Drag start
  const onPointerDown = useCallback((e) => {
    if (!rotationStateManager.canInteract()) return
    e.stopPropagation()
    rotationStateManager.interruptAnimation()
    dragRef.current = { active: true, moved: false, startX: e.clientX, startRotation: rotationStateManager.getRotation() }
    clickRef.current.isDragging = false
    gl.domElement.setPointerCapture(e.pointerId)
  }, [gl])

  // Drag move
  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.active) return

    const deltaX = e.clientX - dragRef.current.startX
    if (!dragRef.current.moved && isDragThresholdMet(dragRef.current.startX, e.clientX)) {
      dragRef.current.moved = true
      clickRef.current.isDragging = true
    }

    if (dragRef.current.moved) {
      rotationStateManager.setRotation(dragRef.current.startRotation - deltaX * CAROUSEL_SETTINGS.dragSensitivity)
    }
  }, [])

  // Drag end
  const onPointerUp = useCallback((e) => {
    if (!dragRef.current.active) return
    gl.domElement.releasePointerCapture(e.pointerId)

    if (dragRef.current.moved) rotationStateManager.snapToNearestColumn()
    dragRef.current.active = false
    setTimeout(() => { clickRef.current.isDragging = false }, 50)
  }, [gl])

  // Calculate visibility for each slot
  const slots = activeSlots.map(slot => ({
    ...slot,
    visibility: calculateVisibility(getAngleFromCenter(slot.virtualColumn, rotation, layoutConfig.columnAngle)),
    position: calculateCylinderPosition(slot.virtualColumn, slot.rowIndex, layoutConfig)
  }))

  return (
    <group>
      <ambientLight intensity={0.8} />

      {/* Interaction plane */}
      <mesh
        position={[0, 0, layoutConfig.cylinderRadius + 1]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Rotating carousel */}
      <group rotation={[0, -rotation, 0]}>
        {slots.map(slot => (
          <ImageFrame
            key={slot.slotId}
            imageData={slot.imageData}
            position={slot.position}
            visibility={slot.visibility}
            imageSize={layoutConfig.imageSize}
            onClickRef={clickRef}
          />
        ))}
      </group>
    </group>
  )
}

export default CarouselScene
