/**
 * useDragInteraction.js
 *
 * Custom hook to handle carousel drag interaction with threshold detection
 * Extracted from Carousel3DScene to isolate pointer event logic
 * Manages pointer capture, drag state, and rotation updates
 */

// #region Imports
import { useRef, useCallback } from 'react'
import rotationStateManager from '../../managers/RotationStateManager.js'
import { isDragThresholdMet } from '../../utils/carouselHelpers.js'
import { CAROUSEL_SETTINGS } from '../../constants/carousel.js'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useDragInteraction
 *
 * Provides pointer event handlers for carousel drag interaction.
 * Handles drag threshold detection to differentiate clicks from drags,
 * pointer capture for smooth interaction, and rotation snapping.
 *
 * @param {Object} gl - WebGL renderer from useThree()
 * @param {Object} clickRef - Ref object to track click vs drag state
 * @returns {Object} { onPointerDown, onPointerMove, onPointerUp } - Event handlers
 *
 * @example
 * const clickRef = useRef({ isDragging: false })
 * const { gl } = useThree()
 * const { onPointerDown, onPointerMove, onPointerUp } = useDragInteraction(gl, clickRef)
 *
 * <mesh onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
 */
export const useDragInteraction = (gl, clickRef) => {
  // Drag state reference tracks pointer interaction details
  // - active: Whether a drag is currently in progress
  // - moved: Whether drag threshold has been exceeded
  // - startX: Initial pointer X coordinate
  // - startRotation: Carousel rotation when drag started
  const dragRef = useRef({ active: false, moved: false, startX: 0, startRotation: 0 })

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
  }, [gl, clickRef])

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
  }, [clickRef])

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
  }, [gl, clickRef])

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp
  }
}

export default useDragInteraction
