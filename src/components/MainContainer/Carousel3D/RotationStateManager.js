/**
 * RotationStateManager - Singleton for managing carousel rotation state
 */
class RotationStateManager {
  constructor() {
    this.rotation = 0 // Global rotation in radians
    this.listeners = new Set()
  }

  /**
   * Get current rotation
   */
  getRotation() {
    return this.rotation
  }

  /**
   * Set rotation
   */
  setRotation(rotation) {
    this.rotation = rotation
    this.notifyListeners()
  }

  /**
   * Add rotation delta
   */
  addRotation(delta) {
    this.rotation += delta
    this.notifyListeners()
  }

  /**
   * Subscribe to rotation changes
   */
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  /**
   * Notify all listeners
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.rotation))
  }
}

const rotationStateManager = new RotationStateManager()
export default rotationStateManager
