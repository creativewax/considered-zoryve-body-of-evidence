/**
 * useGsapAnimation.js
 *
 * Custom hook to encapsulate GSAP animation setup, execution, and cleanup
 * Automatically tracks all created tweens and kills them on component unmount
 * Prevents memory leaks from orphaned GSAP animations
 */

// #region Imports
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useGsapAnimation
 *
 * Provides an animate function that creates GSAP tweens with automatic cleanup.
 * All tweens created through this hook are tracked and killed on component unmount,
 * preventing memory leaks and ensuring clean animation lifecycle management.
 *
 * @returns {Function} animate(target, config) - Function to create GSAP tweens
 *
 * @example
 * // Basic usage
 * const animate = useGsapAnimation()
 *
 * const fadeOut = () => {
 *   animate(containerRef.current, {
 *     opacity: 0,
 *     duration: 0.3,
 *     ease: 'power2.inOut'
 *   })
 * }
 *
 * @example
 * // With onComplete callback
 * const animate = useGsapAnimation()
 *
 * animate(element, {
 *   x: 100,
 *   duration: 0.5,
 *   onComplete: () => console.log('Animation done!')
 * })
 */
export const useGsapAnimation = () => {
  // Track all tweens created by this hook
  const tweensRef = useRef([])

  /**
   * Create a GSAP tween and track it for cleanup
   *
   * @param {*} target - Element or object to animate
   * @param {Object} config - GSAP animation configuration
   * @returns {gsap.core.Tween} The created GSAP tween
   */
  const animate = (target, config) => {
    const tween = gsap.to(target, config)
    tweensRef.current.push(tween)
    return tween
  }

  // Cleanup: kill all tweens on unmount
  useEffect(() => {
    return () => {
      tweensRef.current.forEach(tween => tween.kill())
      tweensRef.current = []
    }
  }, [])

  return animate
}

export default useGsapAnimation
