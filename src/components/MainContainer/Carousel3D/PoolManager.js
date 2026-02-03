/**
 * PoolManager - Manages image/data pooling for the carousel
 */
class PoolManager {
  constructor() {
    this.pool = []
    this.activeItems = new Map()
  }

  /**
   * Initialize pool with image data
   */
  initializePool(imageDataArray, poolSize) {
    this.pool = []
    this.activeItems.clear()

    // Create pool of image holders
    for (let i = 0; i < poolSize; i++) {
      this.pool.push({
        id: i,
        imageData: null,
        index: -1,
        isActive: false
      })
    }
  }

  /**
   * Get available item from pool
   */
  getAvailableItem() {
    return this.pool.find(item => !item.isActive)
  }

  /**
   * Activate item with image data
   */
  activateItem(item, imageData, index) {
    item.imageData = imageData
    item.index = index
    item.isActive = true
    this.activeItems.set(item.id, item)
    return item
  }

  /**
   * Deactivate item and return to pool
   */
  deactivateItem(item) {
    item.imageData = null
    item.index = -1
    item.isActive = false
    this.activeItems.delete(item.id)
  }

  /**
   * Get all active items
   */
  getActiveItems() {
    return Array.from(this.activeItems.values())
  }

  /**
   * Get item by index
   */
  getItemByIndex(index) {
    return this.pool.find(item => item.index === index && item.isActive)
  }
}

const poolManager = new PoolManager()
export default poolManager
