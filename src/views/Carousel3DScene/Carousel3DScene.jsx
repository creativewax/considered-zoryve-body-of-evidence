// Carousel3DScene - R3F scene with drag interaction and image rendering
// -----------------------------------------------------------------------
// This component manages a 3D cylindrical carousel using Three.js with:
// - Drag-based rotation interaction with threshold detection
// - Smooth camera animation and FOV transitions
// - Object pooling for performance optimization
// - State synchronization across managers
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------

import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import ImageFrame from '../../components/carousel/ImageFrame/ImageFrame'
import poolManager from '../../managers/PoolManager'
import rotationStateManager from '../../managers/RotationStateManager'
import { calculateCylinderPosition, calculateVisibility, getAngleFromCenter, isDragThresholdMet, calculateBestFitFOV } from '../../utils/carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../constants/carousel'

// -----------------------------------------------------------------------
// COMPONENT DEFINITION
// -----------------------------------------------------------------------

/**
 * Carousel3DScene - Three.js scene component for cylindrical carousel
 * layoutConfig - Configuration object containing:
 *   - cameraZ: Camera depth position
 *   - columnAngle: Degrees between each carousel column
 *   - cylinderRadius: Radius of the carousel cylinder
 *   - imageSize: Dimensions of individual images
 */
const Carousel3DScene = ({ layoutConfig }) => {
  // -----------------------------------------------------------------------
  // HOOKS / STATE MANAGEMENT
  // -----------------------------------------------------------------------

  const { gl, camera, size } = useThree()

  // Drag state reference tracks pointer interaction details
  // - active: Whether a drag is currently in progress
  // - moved: Whether drag threshold has been exceeded
  // - startX: Initial pointer X coordinate
  // - startRotation: Carousel rotation when drag started
  const dragRef = useRef({ active: false, moved: false, startX: 0, startRotation: 0 })

  // Click reference tracks click intent separate from drag state
  // Used to differentiate between clicks and drags on image elements
  const clickRef = useRef({ isDragging: false })

  // Rotation state synchronized with rotation state manager
  const [rotation, setRotation] = useState(rotationStateManager.getRotation())

  // Active slots currently being rendered (managed by pool manager)
  const [activeSlots, setActiveSlots] = useState([])

  // -----------------------------------------------------------------------
  // EFFECTS
  // -----------------------------------------------------------------------

  /**
   * CAMERA ANIMATION - smooth transition when layout changes or window resizes
   * Animates both camera depth (Z position) and field of view (FOV) to ensure
   * carousel fits properly in viewport after layout changes
   */
  useEffect(() => {
    if (!layoutConfig || !camera) return

    // Animate camera Z position to new layout depth
    gsap.to(camera.position, {
      z: layoutConfig.cameraZ,
      duration: CAROUSEL_SETTINGS.transitionFadeDuration,
      ease: 'power2.inOut'
    })

    // Calculate best-fit FOV based on carousel dimensions and viewport
    // Uses aspect ratio to convert horizontal FOV to vertical FOV
    const aspectRatio = size.width / size.height
    const verticalFOV = calculateBestFitFOV(layoutConfig, aspectRatio)

    // Animate FOV with GSAP to ensure smooth transition
    // Uses a separate target object to avoid directly modifying camera.fov
    // which would skip the updateProjectionMatrix call
    const targetFOV = { value: camera.fov }
    gsap.to(targetFOV, {
      value: verticalFOV,
      duration: CAROUSEL_SETTINGS.transitionFadeDuration,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.fov = targetFOV.value
        // updateProjectionMatrix is required after manual FOV changes
        camera.updateProjectionMatrix()
      }
    })
  }, [layoutConfig, camera, size.width, size.height])

  /**
   * ROTATION STATE SUBSCRIPTION - subscribe to rotation changes
   * Keeps component in sync with global rotation state when changed by
   * other components or managers
   */
  useEffect(() => rotationStateManager.subscribe(setRotation), [])

  /**
   * POOL MANAGER SUBSCRIPTION - subscribe to active slots changes
   * Keeps component in sync with object pool assignments
   * Creates a copy of active slots array to trigger re-render on updates
   */
  useEffect(() => {
    const update = () => setActiveSlots([...poolManager.getActiveSlots()])
    update()
    return poolManager.subscribe(update)
  }, [])

  /**
   * FRAME RENDERING LOOP - update pool assignments on every frame
   * Synchronizes object pool with current carousel rotation to ensure
   * correct images are assigned to visible carousel slots
   */
  useFrame(() => poolManager.updatePoolAssignments(rotationStateManager.getRotation()))

  // -----------------------------------------------------------------------
  // EVENT HANDLERS
  // -----------------------------------------------------------------------

  /**
   * onPointerDown - Initialize drag interaction
   * Captures pointer, stores initial position and rotation, and prepares
   * drag state for potential carousel rotation
   */
  const onPointerDown = useCallback((e) => {
    // Check if rotation state manager allows interaction (e.g., not animating)
    if (!rotationStateManager.canInteract()) return

    e.stopPropagation()

    // Interrupt any ongoing rotation animation to allow immediate user control
    rotationStateManager.interruptAnimation()

    // Initialize drag reference with current pointer position and carousel rotation
    // This serves as the baseline for calculating rotation delta on pointer move
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startRotation: rotationStateManager.getRotation()
    }

    // Reset dragging flag (used to differentiate drag from click)
    clickRef.current.isDragging = false

    // Capture pointer to ensure move events are received even outside viewport
    gl.domElement.setPointerCapture(e.pointerId)
  }, [gl])

  /**
   * onPointerMove - Handle carousel rotation during drag
   * Updates carousel rotation based on pointer movement, with threshold
   * detection to distinguish intentional drags from accidental movements
   */
  const onPointerMove = useCallback((e) => {
    // Only process if pointer is actively down on carousel
    if (!dragRef.current.active) return

    // Calculate horizontal movement from starting position
    const deltaX = e.clientX - dragRef.current.startX

    // Detect if user has intentionally dragged past threshold
    // This prevents small accidental movements from triggering rotation
    if (!dragRef.current.moved && isDragThresholdMet(dragRef.current.startX, e.clientX)) {
      dragRef.current.moved = true
      clickRef.current.isDragging = true
    }

    // Only update rotation if drag threshold has been met
    // Converts pixel delta to rotation delta using sensitivity multiplier
    if (dragRef.current.moved) {
      rotationStateManager.setRotation(
        dragRef.current.startRotation - deltaX * CAROUSEL_SETTINGS.dragSensitivity
      )
    }
  }, [])

  /**
   * onPointerUp - Finalize drag interaction
   * Releases pointer capture and snaps carousel to nearest column if drag
   * threshold was exceeded. Includes small delay to debounce drag state
   */
  const onPointerUp = useCallback((e) => {
    // Only process if pointer was actively down
    if (!dragRef.current.active) return

    // Release captured pointer
    gl.domElement.releasePointerCapture(e.pointerId)

    // If user dragged past threshold, snap to nearest carousel column
    // This provides nice alignment after manual rotation
    if (dragRef.current.moved) {
      rotationStateManager.snapToNearestColumn()
    }

    // Clear active state immediately
    dragRef.current.active = false

    // Debounce dragging flag with 50ms delay to allow event order to settle
    // This ensures click handlers see the correct isDragging state
    setTimeout(() => { clickRef.current.isDragging = false }, 50)
  }, [gl])

  // -----------------------------------------------------------------------
  // SLOT CALCULATION - compute visibility and position for each slot
  // -----------------------------------------------------------------------

  /**
   * Calculate visibility and 3D position for each active carousel slot
   * Maps active slots from pool manager to enrich with computed values
   * - visibility: Based on angle from viewer center (opacity/scale)
   * - position: 3D coordinates on cylindrical carousel surface
   */
  const slots = activeSlots.map(slot => {
    // Calculate angle from center viewer position to this slot's column
    const angleFromCenter = getAngleFromCenter(slot.virtualColumn, rotation, layoutConfig.columnAngle)

    // Calculate visibility multiplier based on angle
    // Slots directly in front are fully visible, sides fade out
    const visibility = calculateVisibility(angleFromCenter)

    // Calculate 3D position on carousel cylinder surface
    // Accounts for column angular position and row vertical position
    const position = calculateCylinderPosition(slot.virtualColumn, slot.rowIndex, layoutConfig)

    return {
      ...slot,
      visibility,
      position
    }
  })

  // -----------------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------------

  return (
    <group>
      {/* Ambient light provides base illumination for carousel images */}
      <ambientLight intensity={0.8} />

      {/* Invisible interaction plane positioned in front of carousel
          - Receives all pointer events (down, move, up, leave, cancel)
          - Acts as event boundary to capture drag interactions
          - Positioned slightly forward (Z) to avoid z-fighting with images
          - Transparent with no depth write to avoid interfering with renders */}
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

      {/* Rotating carousel group
          - Rotates around Y-axis to follow current carousel rotation state
          - Negated rotation value: positive cursor movement rotates carousel left
          - Contains all image frame instances at calculated positions */}
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

export default Carousel3DScene
