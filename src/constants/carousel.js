// Carousel3D Constants & Settings

export const CAROUSEL_LAYOUT = {
  LARGE: { minImages: 45, rows: 5, visibleColumns: 9 },
  MEDIUM: { minImages: 21, rows: 3, visibleColumns: 7 },
  SMALL: { minImages: 2, rows: 1, visibleColumns: 5 }
}

export const CAROUSEL_SETTINGS = {
  cylinderRadius: { 1: 1.9, 3: 2.5, 5: 3.0 },
  cameraZ: { 1: 6.35, 3: 8.75, 5: 10.25 },
  rowSpacingMultiplier: 1.25,
  imageSizeBase: 1.0,
  imageSizeRowReduction: 0.05,
  dragSensitivity: 0.004,
  snapDuration: 0.5,
  poolBuffer: 2,
  transitionFadeDuration: 0.5,
  introSpinDuration: 0.8,
  introSpinAngle: Math.PI * 2
}

export const CAROUSEL_VISIBILITY = {
  fullOpacityAngle: Math.PI / 10,
  darkStartAngle: Math.PI / 6,
  cutoffAngle: Math.PI / 2,
  maxDarkOverlay: 0.5
}

export const CAROUSEL_FRAME = {
  borderWidth: 0.01,
  glowSpread: 0.2,
  cornerRadiusRatio: 0.08,
  glowOpacity: 0.4,
  loadingColor: '#116B95'
}

export const DRAG_THRESHOLD = 10
