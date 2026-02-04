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

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import ImageFrame from '../../components/carousel/ImageFrame/ImageFrame'
import poolManager from '../../managers/PoolManager'
import rotationStateManager from '../../managers/RotationStateManager'
import { calculateCylinderPosition, calculateVisibility, getAngleFromCenter } from '../../utils/carouselHelpers'
import useRotationSync from '../../hooks/carousel/useRotationSync.js'
import useCameraAnimation from '../../hooks/carousel/useCameraAnimation.js'
import useDragInteraction from '../../hooks/carousel/useDragInteraction.js'
import useManagerSubscription from '../../hooks/common/useManagerSubscription.js'

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

  // Click reference tracks click intent separate from drag state
  // Used to differentiate between clicks and drags on image elements
  const clickRef = useRef({ isDragging: false })

  // Use custom hooks for state management and interactions
  const rotation = useRotationSync()
  const activeSlots = useManagerSubscription(poolManager, (mgr) => [...mgr.getActiveSlots()])
  const { onPointerDown, onPointerMove, onPointerUp } = useDragInteraction(gl, clickRef)

  // Camera animation handled by custom hook
  useCameraAnimation(layoutConfig, camera, size)

  // -----------------------------------------------------------------------
  // FRAME RENDERING LOOP
  // -----------------------------------------------------------------------

  /**
   * Update pool assignments on every frame
   * Synchronizes object pool with current carousel rotation to ensure
   * correct images are assigned to visible carousel slots
   */
  useFrame(() => poolManager.updatePoolAssignments(rotationStateManager.getRotation()))


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
