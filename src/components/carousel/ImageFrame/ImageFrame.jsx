/**
 * ImageFrame.jsx
 *
 * 3D image with frame, glow, and lazy loading. Used in carousel slots.
 */

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import eventSystem from '../../../utils/EventSystem'
import imageManager from '../../../managers/ImageManager'
import { CAROUSEL_FRAME } from '../../../constants/carousel'
import { getRoundedMask, getGlowTexture } from '../../../utils/frameTextures'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const ImageFrame = ({ imageData, position, visibility, imageSize, onClickRef, introHidden }) => {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------

  const { imagePath } = imageData

  // ---------------------------------------------------------------------------
  // STATE - Texture Loading
  // ---------------------------------------------------------------------------

  // Get preloaded thumbnail from ImageManager
  // All thumbnails are preloaded during app init, so this is instant
  // Use useMemo so texture updates when imagePath changes (when pool reassigns images)
  const texture = useMemo(() => imageManager.getThumbnail(imagePath), [imagePath])

  // Warn if texture not found (shouldn't happen if preloading worked correctly)
  useEffect(() => {
    if (!texture) {
      console.warn('ImageFrame: Thumbnail not preloaded for:', imagePath)
    }
  }, [imagePath, texture])

  // ---------------------------------------------------------------------------
  // EFFECTS - No fade-in animation needed (textures are preloaded)
  // ---------------------------------------------------------------------------
  // useFrame removed - textures display instantly

  // ---------------------------------------------------------------------------
  // MEMOS - Frame Dimensions & Textures
  // ---------------------------------------------------------------------------

  const frame = useMemo(() => ({
    imageW: imageSize,
    imageH: imageSize,
    frameW: imageSize + CAROUSEL_FRAME.borderWidth * 2,
    frameH: imageSize + CAROUSEL_FRAME.borderWidth * 2,
    glowW: imageSize + CAROUSEL_FRAME.glowSpread,
    glowH: imageSize + CAROUSEL_FRAME.glowSpread
  }), [imageSize])

  const roundedMask = useMemo(() => getRoundedMask(), [])
  const glowTexture = useMemo(() => getGlowTexture(), [])

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  // Click emits IMAGE_SELECTED (when not dragging); hover updates cursor.

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClickRef?.current?.isDragging) return
    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_SELECTED, imageData)
  }

  const handlePointerOver = () => { document.body.style.cursor = 'pointer' }
  const handlePointerOut = () => { document.body.style.cursor = 'auto' }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  if (!visibility.visible || introHidden) return null

  const { opacity, darkOverlay } = visibility

  return (
    <Billboard position={[position.x, position.y, position.z]} follow lockX={false} lockY={false} lockZ={false}>
      <group>
        {/* Glow layer - furthest back, creates soft glow effect */}
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[frame.glowW, frame.glowH]} />
          <meshBasicMaterial map={glowTexture} transparent opacity={opacity * CAROUSEL_FRAME.glowOpacity} depthWrite={false} />
        </mesh>

        {/* White border frame - creates rounded frame around image */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[frame.frameW, frame.frameH]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity} alphaMap={roundedMask} depthWrite={false} />
        </mesh>

        {/* Image texture - main content with click/hover handlers */}
        {texture && (
          <mesh position={[0, 0, -0.01]} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
            <planeGeometry args={[frame.imageW, frame.imageH]} />
            <meshBasicMaterial map={texture} transparent opacity={opacity} alphaMap={roundedMask} depthWrite={false} />
          </mesh>
        )}

        {/* Dark overlay - rendered on top for depth effect */}
        {darkOverlay > 0.01 && (
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[frame.frameW, frame.frameH]} />
            <meshBasicMaterial color="#000000" transparent opacity={darkOverlay * opacity} alphaMap={roundedMask} depthWrite={false} />
          </mesh>
        )}
      </group>
    </Billboard>
  )
}

export default ImageFrame
