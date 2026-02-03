// RotationStateManager - handles carousel rotation state and animations

import { gsap } from 'gsap'
import { calculateSnapTarget } from './carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../../constants/carousel'

class RotationStateManager {
  constructor() {
    this.rotation = 0
    this.columnAngle = 0
    this.isAnimating = false
    this.currentTween = null
    this.listeners = new Set()
  }

  // Getters
  getRotation() { return this.rotation }
  getColumnAngle() { return this.columnAngle }
  canInteract() { return true }

  // Set rotation and notify listeners
  setRotation(value) {
    this.rotation = value
    this.notifyListeners()
  }

  // Set column angle (resets rotation)
  setColumnAngle(value) {
    this.columnAngle = value
    this.rotation = 0
    this.interruptAnimation()
    this.notifyListeners()
  }

  // Start snap animation to nearest column
  snapToNearestColumn() {
    if (this.columnAngle <= 0) return
    const target = calculateSnapTarget(this.rotation, this.columnAngle)
    this.animateTo(target, CAROUSEL_SETTINGS.snapDuration)
  }

  // Navigate one column left
  navigateLeft() {
    if (!this.canInteract()) return
    this.interruptAnimation()
    const currentColumn = Math.round(this.rotation / this.columnAngle)
    this.animateTo((currentColumn - 1) * this.columnAngle, CAROUSEL_SETTINGS.snapDuration)
  }

  // Navigate one column right
  navigateRight() {
    if (!this.canInteract()) return
    this.interruptAnimation()
    const currentColumn = Math.round(this.rotation / this.columnAngle)
    this.animateTo((currentColumn + 1) * this.columnAngle, CAROUSEL_SETTINGS.snapDuration)
  }

  // Animate to target rotation
  animateTo(targetRotation, duration, onComplete) {
    this.interruptAnimation()
    this.isAnimating = true

    const target = { rotation: this.rotation }
    this.currentTween = gsap.to(target, {
      rotation: targetRotation,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        this.rotation = target.rotation
        this.notifyListeners()
      },
      onComplete: () => {
        this.isAnimating = false
        this.currentTween = null
        this.rotation = targetRotation
        this.notifyListeners()
        onComplete?.()
      }
    })
  }

  // Stop any running animation
  interruptAnimation() {
    if (this.currentTween) {
      this.currentTween.kill()
      this.currentTween = null
    }
    this.isAnimating = false
  }

  // Subscribe to rotation changes
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.rotation) } catch (e) { console.error('RotationStateManager:', e) }
    })
  }

  // Reset all state
  reset() {
    this.interruptAnimation()
    this.rotation = 0
    this.columnAngle = 0
    this.notifyListeners()
  }
}

const rotationStateManager = new RotationStateManager()
export default rotationStateManager
