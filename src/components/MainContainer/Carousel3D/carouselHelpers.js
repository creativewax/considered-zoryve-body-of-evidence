/**
 * Calculate rows and columns based on result count
 */
export const getLayoutConfig = (resultCount) => {
  if (resultCount >= 45) {
    return { rows: 5, maxColumns: 9 }
  } else if (resultCount >= 21) {
    return { rows: 3, maxColumns: 7 }
  } else if (resultCount >= 2) {
    return { rows: 1, maxColumns: 5 }
  }
  return { rows: 1, maxColumns: 1 }
}

/**
 * Calculate rows based on result count (for shadow positioning)
 */
export const getRowCount = (resultCount) => {
  if (resultCount >= 45) return 5
  if (resultCount >= 21) return 3
  if (resultCount >= 2) return 1
  return 1
}

/**
 * Calculate angle for column position on cylinder
 */
export const getColumnAngle = (columnIndex, totalColumns, centerColumn) => {
  const offset = columnIndex - centerColumn
  const angleStep = (Math.PI * 2) / totalColumns
  return offset * angleStep
}

/**
 * Calculate opacity and blur based on angle from center
 */
export const getVisualEffects = (angle, totalColumns) => {
  const normalizedAngle = Math.abs(angle)
  const maxAngle = Math.PI / 2 // 90 degrees
  const immediateNeighborAngle = Math.PI / totalColumns
  
  if (normalizedAngle <= immediateNeighborAngle) {
    // Center and immediate neighbors: full opacity, no blur
    return { opacity: 1, blur: 0 }
  }
  
  // Progressive fade and blur
  const fadeStart = immediateNeighborAngle
  const fadeRange = maxAngle - fadeStart
  const fadeProgress = Math.min(1, (normalizedAngle - fadeStart) / fadeRange)
  
  return {
    opacity: Math.max(0, 1 - fadeProgress),
    blur: fadeProgress * 0.1
  }
}

/**
 * Normalize angle to 0-2π range
 */
export const normalizeAngle = (angle) => {
  const normalized = angle % (Math.PI * 2)
  return normalized < 0 ? normalized + Math.PI * 2 : normalized
}

/**
 * Calculate nearest column angle for snap-to-center
 */
export const getNearestColumnAngle = (currentAngle, totalColumns) => {
  const angleStep = (Math.PI * 2) / totalColumns
  const normalizedAngle = normalizeAngle(currentAngle)
  return Math.round(normalizedAngle / angleStep) * angleStep
}

/**
 * Calculate target angle for navigation
 */
export const getNavigationTargetAngle = (currentAngle, direction, totalColumns) => {
  const angleStep = (Math.PI * 2) / totalColumns
  const normalizedAngle = normalizeAngle(currentAngle)
  const currentColumn = Math.round(normalizedAngle / angleStep)
  const nextColumn = currentColumn + direction
  return nextColumn * angleStep
}
