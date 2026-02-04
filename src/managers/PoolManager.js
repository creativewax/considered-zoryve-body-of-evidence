// PoolManager - manages image slot pooling for infinite carousel scroll

import { getPoolingRange, wrapIndex } from '../utils/carouselHelpers'
import { CAROUSEL_SETTINGS } from '../constants/carousel'

class PoolManager {
  constructor() {
    this.pool = []
    this.imageData = []
    this.layoutConfig = null
    this.lastCenterColumn = null
    this.listeners = new Set()
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  initializePool(layoutConfig, imageData, initialRotation = 0) {
    this.layoutConfig = layoutConfig
    this.imageData = imageData
    this.lastCenterColumn = null
    this.pool = []

    const { rows, visibleColumns } = layoutConfig
    const totalSlots = visibleColumns + CAROUSEL_SETTINGS.poolBuffer * 2

    // Create pool slots in column-major order
    for (let col = 0; col < totalSlots; col++) {
      for (let row = 0; row < rows; row++) {
        this.pool.push({
          slotId: `slot-${col}-${row}`,
          slotColumn: col,
          rowIndex: row,
          virtualColumn: col,
          imageData: null,
          isActive: true
        })
      }
    }

    this.updatePoolAssignments(initialRotation)
    this.notifyListeners()
  }

  // ---------------------------------------------------------------------------
  // POOL UPDATES
  // ---------------------------------------------------------------------------

  updatePoolAssignments(currentRotation) {
    if (!this.layoutConfig || this.imageData.length === 0) return

    const { visibleColumns, columnAngle, rows } = this.layoutConfig
    const { startColumn, centerColumn } = getPoolingRange(currentRotation, visibleColumns, columnAngle)

    // Skip update if center column hasn't changed
    if (this.lastCenterColumn === centerColumn) return
    this.lastCenterColumn = centerColumn

    const totalSlots = visibleColumns + CAROUSEL_SETTINGS.poolBuffer * 2
    const totalImageColumns = Math.ceil(this.imageData.length / rows)

    // Reassign images to slots based on current view position
    this.pool.forEach((slot, index) => {
      const slotCol = Math.floor(index / rows)
      const rowIndex = index % rows
      const virtualColumn = startColumn + slotCol

      slot.virtualColumn = virtualColumn
      slot.rowIndex = rowIndex

      // Wrap column index for infinite scroll
      const wrappedColumn = wrapIndex(virtualColumn, totalImageColumns)
      const imageIndex = wrapIndex(wrappedColumn * rows + rowIndex, this.imageData.length)
      slot.imageData = this.imageData[imageIndex]
    })

    this.notifyListeners()
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getActiveSlots() {
    return this.pool.filter(slot => slot.isActive && slot.imageData)
  }

  getLayoutConfig() { return this.layoutConfig }
  getImageCount() { return this.imageData.length }

  // ---------------------------------------------------------------------------
  // SUBSCRIPTION
  // ---------------------------------------------------------------------------

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb() } catch (e) { console.error('PoolManager:', e) }
    })
  }

  // ---------------------------------------------------------------------------
  // RESET
  // ---------------------------------------------------------------------------

  reset() {
    this.pool = []
    this.imageData = []
    this.layoutConfig = null
    this.lastCenterColumn = null
    this.notifyListeners()
  }
}

const poolManager = new PoolManager()
export default poolManager
