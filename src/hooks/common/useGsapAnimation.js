/**
 * useGsapAnimation.js
 *
 * Custom hook to encapsulate GSAP animation setup, execution, and cleanup
 * Automatically tracks all created tweens and kills them on component unmount
 * Prevents memory leaks from orphaned GSAP animations
 */

import { useRef, useEffect } from 'react'
import gsap from 'gsap'


/**
 * useGsapAnimation
 *
 * Returns animate(target, config) to create GSAP tweens; all tweens killed on unmount.
 */
export const useGsapAnimation = () => {
  // Track all tweens created by this hook
  const tweensRef = useRef([])

  /**
   * Create a GSAP tween and track it for cleanup. target - Element or object, config - GSAP config.
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
