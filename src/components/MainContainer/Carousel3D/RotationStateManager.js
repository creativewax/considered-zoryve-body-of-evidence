// RotationStateManager - handles carousel rotation state and animations

import { gsap } from 'gsap'
import { calculateSnapTarget, getPoolingRange } from './carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../../constants/carousel'

class RotationStateManager {
  constructor() {
    this.rotation = 0
    this.columnAngle = 0
    this.isAnimating = false
    this.isIntroPlaying = false
    this.introStartColumns = new Set() // columns hidden during intro
    this.currentTween = null
    this.listeners = new Set()
  }

  // Getters
  getRotation() { return this.rotation }
  getColumnAngle() { return this.columnAngle }
  getIsIntroPlaying() { return this.isIntroPlaying }
  getIntroStartColumns() { return this.introStartColumns }
  canInteract() { return !this.isIntroPlaying }

  // Check if a column should be hidden during intro
  isColumnHiddenDuringIntro(virtualColumn) {
    if (!this.isIntroPlaying) return false
    return !this.introStartColumns.has(virtualColumn)
  }

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
    if (this.columnAngle <= 0 || this.isIntroPlaying) return
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

  // Prepare intro state (set hidden columns) - call before initializing pool
  // Returns the rotation to use for pool initialization
  prepareIntro(visibleColumns) {
    if (!visibleColumns || this.columnAngle <= 0) return 0

    // Calculate which virtualColumns will be visible at rotation 0
    // We need to simulate what the pool will assign at rotation 0
    const { startColumn, endColumn } = getPoolingRange(0, visibleColumns, this.columnAngle)
    
    this.introStartColumns = new Set()
    
    // Store all virtualColumns that will be in the pool at rotation 0
    // These are the columns that should be hidden during intro
    for (let i = startColumn; i <= endColumn; i++) {
      this.introStartColumns.add(i)
    }

    // Set intro playing state immediately so introHidden check works
    this.isIntroPlaying = true
    
    // Return the starting rotation for pool initialization
    // Pool will initialize with this rotation, then we'll animate to 0
    return -CAROUSEL_SETTINGS.introSpinAngle
  }

  // Play intro spin animation - images spin in from hidden
  playIntro(visibleColumns, onComplete) {
    if (!visibleColumns || this.columnAngle <= 0) {
      console.warn('playIntro: visibleColumns or columnAngle not set')
      onComplete?.()
      return
    }

    // If intro wasn't prepared, prepare it now
    if (!this.isIntroPlaying || this.introStartColumns.size === 0) {
      const startRotation = this.prepareIntro(visibleColumns)
      this.rotation = startRotation
      this.notifyListeners()
    }

    this.interruptAnimation()
    this.isIntroPlaying = true

    const target = { rotation: this.rotation }
    this.currentTween = gsap.to(target, {
      rotation: 0,
      duration: CAROUSEL_SETTINGS.introSpinDuration,
      ease: 'power2.out',
      onUpdate: () => {
        this.rotation = target.rotation
        this.notifyListeners()
      },
      onComplete: () => {
        this.isIntroPlaying = false
        this.introStartColumns = new Set()
        this.isAnimating = false
        this.currentTween = null
        this.rotation = 0
        this.notifyListeners()
        onComplete?.()
      }
    })
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
    this.isIntroPlaying = false
    this.introStartColumns = new Set()
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
    this.isIntroPlaying = false
    this.introStartColumns = new Set()
    this.notifyListeners()
  }
}

const rotationStateManager = new RotationStateManager()
export default rotationStateManager
