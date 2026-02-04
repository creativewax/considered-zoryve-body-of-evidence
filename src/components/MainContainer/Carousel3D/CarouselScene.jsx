// CarouselScene - R3F scene with drag interaction and image rendering

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import ImageFrame from './ImageFrame'
import poolManager from './PoolManager'
import rotationStateManager from './RotationStateManager'
import { calculateCylinderPosition, calculateVisibility, getAngleFromCenter, isDragThresholdMet, calculateBestFitFOV } from './carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../../constants/carousel'

const CarouselScene = ({ layoutConfig }) => {
  const { gl, camera, size } = useThree()
  const dragRef = useRef({ active: false, moved: false, startX: 0, startRotation: 0 })
  const clickRef = useRef({ isDragging: false })

  const [rotation, setRotation] = useState(rotationStateManager.getRotation())
  const [activeSlots, setActiveSlots] = useState([])

  // ---------------------------------------------------------------------------
  // CAMERA ANIMATION - smooth transition when layout changes or window resizes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!layoutConfig || !camera) return

    // Animate camera Z position
    gsap.to(camera.position, {
      z: layoutConfig.cameraZ,
      duration: CAROUSEL_SETTINGS.transitionFadeDuration,
      ease: 'power2.inOut'
    })

    // Calculate best-fit FOV based on carousel dimensions and viewport
    const aspectRatio = size.width / size.height
    const verticalFOV = calculateBestFitFOV(layoutConfig, aspectRatio)

    // Animate FOV (vertical, calculated from horizontal)
    const targetFOV = { value: camera.fov }
    gsap.to(targetFOV, {
      value: verticalFOV,
      duration: CAROUSEL_SETTINGS.transitionFadeDuration,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.fov = targetFOV.value
        camera.updateProjectionMatrix()
      }
    })
  }, [layoutConfig, camera, size.width, size.height])

  // ---------------------------------------------------------------------------
  // SUBSCRIPTIONS
  // ---------------------------------------------------------------------------

  useEffect(() => rotationStateManager.subscribe(setRotation), [])

  useEffect(() => {
    const update = () => setActiveSlots([...poolManager.getActiveSlots()])
    update()
    return poolManager.subscribe(update)
  }, [])

  // ---------------------------------------------------------------------------
  // FRAME UPDATE - sync pool with current rotation
  // ---------------------------------------------------------------------------

  useFrame(() => poolManager.updatePoolAssignments(rotationStateManager.getRotation()))

  // ---------------------------------------------------------------------------
  // DRAG HANDLERS
  // ---------------------------------------------------------------------------

  const onPointerDown = useCallback((e) => {
    if (!rotationStateManager.canInteract()) return
    e.stopPropagation()
    rotationStateManager.interruptAnimation()
    dragRef.current = { active: true, moved: false, startX: e.clientX, startRotation: rotationStateManager.getRotation() }
    clickRef.current.isDragging = false
    gl.domElement.setPointerCapture(e.pointerId)
  }, [gl])

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

  const onPointerUp = useCallback((e) => {
    if (!dragRef.current.active) return
    gl.domElement.releasePointerCapture(e.pointerId)

    if (dragRef.current.moved) rotationStateManager.snapToNearestColumn()
    dragRef.current.active = false
    setTimeout(() => { clickRef.current.isDragging = false }, 50)
  }, [gl])

  // ---------------------------------------------------------------------------
  // SLOT CALCULATION - compute visibility and position for each slot
  // ---------------------------------------------------------------------------

  const slots = activeSlots.map(slot => ({
    ...slot,
    visibility: calculateVisibility(getAngleFromCenter(slot.virtualColumn, rotation, layoutConfig.columnAngle)),
    position: calculateCylinderPosition(slot.virtualColumn, slot.rowIndex, layoutConfig)
  }))

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <group>
      <ambientLight intensity={0.8} />

      {/* Invisible interaction plane for drag capture */}
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

      {/* Rotating carousel group */}
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
