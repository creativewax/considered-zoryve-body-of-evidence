// Frame Textures - cached canvas-generated textures for image frames

import * as THREE from 'three'
import { CAROUSEL_FRAME } from '../../../constants/carousel'

const maskCache = new Map()
const glowCache = new Map()

// -----------------------------------------------------------------------------
// ROUNDED MASK - alpha mask for rounded corners
// -----------------------------------------------------------------------------

export function getRoundedMask(size = 256) {
  const key = `mask-${size}`
  if (maskCache.has(key)) return maskCache.get(key)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const radius = size * CAROUSEL_FRAME.cornerRadiusRatio

  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, radius)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  maskCache.set(key, texture)
  return texture
}

// -----------------------------------------------------------------------------
// GLOW TEXTURE - layered soft glow that hugs the rounded shape
// -----------------------------------------------------------------------------

export function getGlowTexture(size = 200, glowSize = 40) {
  const key = `glow-${size}-${glowSize}`
  if (glowCache.has(key)) return glowCache.get(key)

  const canvas = document.createElement('canvas')
  const totalSize = size + glowSize * 2
  canvas.width = totalSize
  canvas.height = totalSize
  const ctx = canvas.getContext('2d')
  const radius = size * CAROUSEL_FRAME.cornerRadiusRatio

  // Draw layered glow from outside in
  for (let i = glowSize; i > 0; i -= 2) {
    const alpha = (1 - i / glowSize) * 0.3
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.beginPath()
    ctx.roundRect(glowSize - i, glowSize - i, size + i * 2, size + i * 2, radius + i * 0.5)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  glowCache.set(key, texture)
  return texture
}

// -----------------------------------------------------------------------------
// CLEANUP - dispose cached textures (call on unmount if needed)
// -----------------------------------------------------------------------------

export function disposeFrameTextures() {
  maskCache.forEach(texture => texture.dispose())
  glowCache.forEach(texture => texture.dispose())
  maskCache.clear()
  glowCache.clear()
}
