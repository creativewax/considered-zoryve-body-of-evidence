/**
 * useCameraAnimation.js
 *
 * Custom hook to handle smooth camera position and FOV animations
 * Extracted from Carousel3DScene to isolate camera animation logic
 * Animates camera depth (Z) and field of view when layout changes
 */

// #region Imports
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { calculateBestFitFOV } from '../../utils/carouselHelpers.js'
import { CAROUSEL_SETTINGS } from '../../constants/carousel.js'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useCameraAnimation
 *
 * Animates Three.js camera position and FOV when layout configuration changes.
 * Ensures carousel fits properly in viewport after layout updates.
 *
 * @param {Object} layoutConfig - Carousel layout configuration
 * @param {Object} camera - Three.js camera instance from useThree()
 * @param {Object} size - Viewport size from useThree()
 *
 * @example
 * const { camera, size } = useThree()
 * useCameraAnimation(layoutConfig, camera, size)
 */
export const useCameraAnimation = (layoutConfig, camera, size) => {
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
}

export default useCameraAnimation
