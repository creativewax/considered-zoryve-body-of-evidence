// PoolManager - manages image slot pooling for carousel

import { getPoolingRange, wrapIndex } from './carouselHelpers'
import { CAROUSEL_SETTINGS } from '../../../constants/carousel'

class PoolManager {
  constructor() {
    this.pool = []
    this.imageData = []
    this.layoutConfig = null
    this.lastCenterColumn = null
    this.listeners = new Set()
  }

  // Initialize pool with layout and images
  initializePool(layoutConfig, imageData, initialRotation = 0) {
    this.layoutConfig = layoutConfig
    this.imageData = imageData
    this.lastCenterColumn = null
    this.pool = []

    const { rows, visibleColumns } = layoutConfig
    const totalSlots = visibleColumns + CAROUSEL_SETTINGS.poolBuffer * 2

    // Create pool slots
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

    // Calculate which virtualColumns will be at rotation 0 (for intro hiding)
    // This needs to happen BEFORE we assign with initialRotation
    const { startColumn: startAtZero, endColumn: endAtZero } = getPoolingRange(0, visibleColumns, layoutConfig.columnAngle)
    this.virtualColumnsAtZero = new Set()
    for (let i = startAtZero; i <= endAtZero; i++) {
      this.virtualColumnsAtZero.add(i)
    }

    this.updatePoolAssignments(initialRotation)
    this.notifyListeners()
  }

  // Get virtualColumns that will be visible at rotation 0
  getVirtualColumnsAtZero() {
    return this.virtualColumnsAtZero || new Set()
  }

  // Update which images are assigned to pool slots
  updatePoolAssignments(currentRotation) {
    if (!this.layoutConfig || this.imageData.length === 0) return

    const { visibleColumns, columnAngle, rows } = this.layoutConfig
    const { startColumn, centerColumn } = getPoolingRange(currentRotation, visibleColumns, columnAngle)

    // Skip if center hasn't changed
    if (this.lastCenterColumn === centerColumn) return
    this.lastCenterColumn = centerColumn

    const totalSlots = visibleColumns + CAROUSEL_SETTINGS.poolBuffer * 2
    const totalImageColumns = Math.ceil(this.imageData.length / rows)

    // Assign images to slots
    this.pool.forEach((slot, index) => {
      const slotCol = Math.floor(index / rows)
      const rowIndex = index % rows
      const virtualColumn = startColumn + slotCol

      slot.virtualColumn = virtualColumn
      slot.rowIndex = rowIndex

      // Wrap column for infinite scroll
      const wrappedColumn = wrapIndex(virtualColumn, totalImageColumns)
      const imageIndex = wrapIndex(wrappedColumn * rows + rowIndex, this.imageData.length)
      slot.imageData = this.imageData[imageIndex]
    })

    this.notifyListeners()
  }

  // Get active slots for rendering
  getActiveSlots() {
    return this.pool.filter(slot => slot.isActive && slot.imageData)
  }

  getLayoutConfig() { return this.layoutConfig }
  getImageCount() { return this.imageData.length }

  // Subscribe to pool changes
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb() } catch (e) { console.error('PoolManager:', e) }
    })
  }

  // Reset all state
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
