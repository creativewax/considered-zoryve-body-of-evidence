// RotationStateManager - singleton for carousel rotation state and animations

import { gsap } from 'gsap'
import { calculateSnapTarget } from '../utils/carouselHelpers'
import { CAROUSEL_SETTINGS } from '../constants/carousel'

class RotationStateManager {
  constructor() {
    this.rotation = 0
    this.columnAngle = 0
    this.isAnimating = false
    this.currentTween = null
    this.listeners = new Set()
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getRotation() { return this.rotation }
  getColumnAngle() { return this.columnAngle }
  canInteract() { return !this.isAnimating }

  // ---------------------------------------------------------------------------
  // ROTATION CONTROL
  // ---------------------------------------------------------------------------

  setRotation(value) {
    this.rotation = value
    this.notifyListeners()
  }

  setColumnAngle(value) {
    this.columnAngle = value
    this.rotation = 0
    this.interruptAnimation()
    this.notifyListeners()
  }

  // ---------------------------------------------------------------------------
  // SNAP ANIMATION
  // ---------------------------------------------------------------------------

  snapToNearestColumn() {
    if (this.columnAngle <= 0) return
    const target = calculateSnapTarget(this.rotation, this.columnAngle)
    this.animateTo(target, CAROUSEL_SETTINGS.snapDuration)
  }

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------

  navigateLeft() {
    if (!this.canInteract()) return
    this.interruptAnimation()
    const currentColumn = Math.round(this.rotation / this.columnAngle)
    this.animateTo((currentColumn - 1) * this.columnAngle, CAROUSEL_SETTINGS.snapDuration)
  }

  navigateRight() {
    if (!this.canInteract()) return
    this.interruptAnimation()
    const currentColumn = Math.round(this.rotation / this.columnAngle)
    this.animateTo((currentColumn + 1) * this.columnAngle, CAROUSEL_SETTINGS.snapDuration)
  }

  // ---------------------------------------------------------------------------
  // ANIMATION
  // ---------------------------------------------------------------------------

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

  interruptAnimation() {
    if (this.currentTween) {
      this.currentTween.kill()
      this.currentTween = null
    }
    this.isAnimating = false
  }

  // ---------------------------------------------------------------------------
  // SUBSCRIPTION
  // ---------------------------------------------------------------------------

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.rotation) } catch (e) { console.error('RotationStateManager:', e) }
    })
  }

  // ---------------------------------------------------------------------------
  // RESET
  // ---------------------------------------------------------------------------

  reset() {
    this.interruptAnimation()
    this.rotation = 0
    this.columnAngle = 0
    this.notifyListeners()
  }
}

const rotationStateManager = new RotationStateManager()
export default rotationStateManager
