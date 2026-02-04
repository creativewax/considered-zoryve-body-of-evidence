// Carousel3D Helper Functions - pure calculation utilities

import {
  CAROUSEL_LAYOUT,
  CAROUSEL_SETTINGS,
  CAROUSEL_VISIBILITY,
  DRAG_THRESHOLD
} from '../../../constants/carousel'

export { DRAG_THRESHOLD }

// -----------------------------------------------------------------------------
// LAYOUT CONFIGURATION
// -----------------------------------------------------------------------------

// Get layout configuration based on image count
export function getLayoutConfig(imageCount) {
  const layout = imageCount >= CAROUSEL_LAYOUT.LARGE.minImages ? CAROUSEL_LAYOUT.LARGE
    : imageCount >= CAROUSEL_LAYOUT.MEDIUM.minImages ? CAROUSEL_LAYOUT.MEDIUM
      : CAROUSEL_LAYOUT.SMALL

  const { rows, visibleColumns } = layout
  const s = CAROUSEL_SETTINGS

  return {
    rows,
    visibleColumns,
    totalColumns: Math.ceil(imageCount / rows),
    imageSize: s.imageSizeBase - (rows - 1) * s.imageSizeRowReduction,
    cylinderRadius: s.cylinderRadius[rows] || 2.0,
    rowSpacing: (s.imageSizeBase - (rows - 1) * s.imageSizeRowReduction) * s.rowSpacingMultiplier,
    columnAngle: Math.PI / visibleColumns, // columns spread across 180 degrees
    poolSize: (visibleColumns + s.poolBuffer * 2) * rows,
    cameraZ: s.cameraZ[rows]
  }
}

// -----------------------------------------------------------------------------
// 3D POSITIONING
// -----------------------------------------------------------------------------

// Calculate 3D position on cylinder surface
export function calculateCylinderPosition(columnIndex, rowIndex, config) {
  const angle = columnIndex * config.columnAngle
  const totalHeight = (config.rows - 1) * config.rowSpacing

  return {
    x: Math.sin(angle) * config.cylinderRadius,
    y: (rowIndex * config.rowSpacing) - (totalHeight / 2),
    z: Math.cos(angle) * config.cylinderRadius
  }
}

// -----------------------------------------------------------------------------
// VISIBILITY & DEPTH
// -----------------------------------------------------------------------------

// Calculate visibility (opacity, darkOverlay) based on angle from center
export function calculateVisibility(angleFromCenter) {
  const absAngle = Math.abs(angleFromCenter)
  const v = CAROUSEL_VISIBILITY

  // Beyond cutoff - don't render
  if (absAngle >= v.cutoffAngle) {
    return { opacity: 0, darkOverlay: 0, visible: false }
  }

  // Full opacity zone - no fading, no darkening
  if (absAngle <= v.fullOpacityAngle) {
    return { opacity: 1, darkOverlay: 0, visible: true }
  }

  // Opacity: fade from 1 to 0 between fullOpacityAngle and zeroOpacityAngle
  let opacity = 1
  if (absAngle > v.fullOpacityAngle) {
    const fadeRange = v.zeroOpacityAngle - v.fullOpacityAngle
    const fadeProgress = Math.min(1, (absAngle - v.fullOpacityAngle) / fadeRange)
    opacity = Math.max(0, 1 - fadeProgress)
  }

  // Dark overlay: starts at darkStartAngle, maxes at zeroOpacityAngle
  let darkOverlay = 0
  if (absAngle > v.darkStartAngle) {
    const darkRange = v.zeroOpacityAngle - v.darkStartAngle
    const darkProgress = Math.min(1, (absAngle - v.darkStartAngle) / darkRange)
    darkOverlay = darkProgress * v.maxDarkOverlay
  }

  return { opacity, darkOverlay, visible: true }
}

// -----------------------------------------------------------------------------
// ROTATION & SNAP
// -----------------------------------------------------------------------------

// Calculate snap target rotation to nearest column
export function calculateSnapTarget(rotation, columnAngle) {
  return Math.round(rotation / columnAngle) * columnAngle
}

// Check if drag movement exceeds threshold
export function isDragThresholdMet(startX, currentX) {
  return Math.abs(currentX - startX) > DRAG_THRESHOLD
}

// -----------------------------------------------------------------------------
// POOLING
// -----------------------------------------------------------------------------

// Get column range for pooling based on current rotation
export function getPoolingRange(rotation, visibleColumns, columnAngle) {
  const centerColumn = Math.round(rotation / columnAngle)
  const buffer = Math.ceil(visibleColumns / 2) + CAROUSEL_SETTINGS.poolBuffer

  return {
    startColumn: centerColumn - buffer,
    endColumn: centerColumn + buffer,
    centerColumn
  }
}

// Wrap index for infinite scroll (handles negative values)
export function wrapIndex(index, total) {
  return ((index % total) + total) % total
}

// -----------------------------------------------------------------------------
// ANGLE UTILITIES
// -----------------------------------------------------------------------------

// Normalize rotation to [-PI, PI] range
export function normalizeRotation(rotation) {
  let r = rotation
  while (r > Math.PI) r -= Math.PI * 2
  while (r < -Math.PI) r += Math.PI * 2
  return r
}

// Get angle from center for a specific column
export function getAngleFromCenter(columnIndex, currentRotation, columnAngle) {
  return normalizeRotation(columnIndex * columnAngle - currentRotation)
}

// -----------------------------------------------------------------------------
// CAMERA UTILITIES
// -----------------------------------------------------------------------------

// Calculate best-fit vertical FOV to ensure carousel fits in viewport
// Takes into account both carousel height (rows) and width (cylinder arc)
export function calculateBestFitFOV(layoutConfig, viewportAspectRatio, padding = 1.75) {
  const { rows, rowSpacing, cylinderRadius, cameraZ } = layoutConfig

  // Calculate carousel height (distance from top row to bottom row + image size)
  const imageSize = CAROUSEL_SETTINGS.imageSizeBase - (rows - 1) * CAROUSEL_SETTINGS.imageSizeRowReduction
  const carouselHeight = (rows - 1) * rowSpacing + imageSize

  // Calculate carousel width (chord of visible arc on cylinder)
  // Visible arc is roughly 120 degrees (±60° from center) for comfortable viewing
  const visibleArcAngle = Math.PI * 0.65 // ~117 degrees
  const carouselWidth = 2 * cylinderRadius * Math.sin(visibleArcAngle / 2)

  // Calculate FOV needed to fit height
  const fovForHeight = 2 * Math.atan((carouselHeight * padding) / (2 * cameraZ))

  // Calculate FOV needed to fit width (convert to vertical FOV via aspect ratio)
  const fovForWidth = 2 * Math.atan((carouselWidth * padding) / (2 * cameraZ * viewportAspectRatio))

  // Use the larger FOV to ensure both dimensions fit
  const bestFitFOV = Math.max(fovForHeight, fovForWidth)

  // Convert to degrees
  return (bestFitFOV * 180) / Math.PI
}
