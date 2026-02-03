// Carousel3D Constants & Settings

// -----------------------------------------------------------------------------
// LAYOUT THRESHOLDS - determines rows/columns based on image count
// -----------------------------------------------------------------------------

export const CAROUSEL_LAYOUT = {
  LARGE: { minImages: 45, rows: 5, visibleColumns: 9 },
  MEDIUM: { minImages: 21, rows: 3, visibleColumns: 7 },
  SMALL: { minImages: 2, rows: 1, visibleColumns: 5 }
}

// -----------------------------------------------------------------------------
// CAROUSEL SETTINGS - dimensions, timing, and behavior
// -----------------------------------------------------------------------------

export const CAROUSEL_SETTINGS = {
  // Camera & cylinder per row count
  cylinderRadius: { 1: 2, 3: 2.5, 5: 3.0 },
  cameraZ: { 1: 4.25, 3: 6, 5: 8 },
  fovHorizontal: { 1: 90, 3: 80, 5: 70 }, // Horizontal FOV in degrees (width-based)

  // Image sizing
  rowSpacingMultiplier: 1.25,
  imageSizeBase: 1.0,
  imageSizeRowReduction: 0.05,

  // Interaction
  dragSensitivity: 0.004,
  snapDuration: 0.5,

  // Pooling
  poolBuffer: 2,

  // Transitions
  transitionFadeDuration: 0.5
}

// -----------------------------------------------------------------------------
// VISIBILITY - opacity and dark overlay angles (in radians)
// -----------------------------------------------------------------------------

export const CAROUSEL_VISIBILITY = {
  fullOpacityAngle: Math.PI / 10,    // ~18° - full brightness zone
  darkStartAngle: Math.PI / 6,       // ~30° - dark overlay starts
  zeroOpacityAngle: Math.PI / 2,     // ~90° - fully faded out
  cutoffAngle: Math.PI / 2,          // ~90° - stop rendering
  maxDarkOverlay: 1.0                // max dark overlay opacity
}

// -----------------------------------------------------------------------------
// FRAME STYLING - border, glow, and loading state
// -----------------------------------------------------------------------------

export const CAROUSEL_FRAME = {
  borderWidth: 0.01,
  glowSpread: 0.2,
  cornerRadiusRatio: 0.08,
  glowOpacity: 0.4,
  loadingColor: '#116B95'
}

// -----------------------------------------------------------------------------
// INTERACTION
// -----------------------------------------------------------------------------

export const DRAG_THRESHOLD = 10 // pixels before drag is recognized
