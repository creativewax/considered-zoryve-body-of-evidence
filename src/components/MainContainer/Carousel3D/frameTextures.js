// Frame Textures - cached textures for image frame rendering

import * as THREE from 'three'
import { CAROUSEL_FRAME } from '../../../constants/carousel'

const maskCache = new Map()
const glowCache = new Map()

// Create rounded rectangle alpha mask
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

// Create glow texture that hugs the rounded rectangle
export function getGlowTexture(size = 200, glowSize = 40) {
  const key = `glow-${size}-${glowSize}`
  if (glowCache.has(key)) return glowCache.get(key)

  const canvas = document.createElement('canvas')
  const totalSize = size + glowSize * 2
  canvas.width = totalSize
  canvas.height = totalSize
  const ctx = canvas.getContext('2d')
  const radius = size * CAROUSEL_FRAME.cornerRadiusRatio

  // Draw layered glow
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
