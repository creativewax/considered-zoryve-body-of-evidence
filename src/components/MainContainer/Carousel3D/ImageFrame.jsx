// ImageFrame - 3D image with frame, glow, and lazy loading

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import appStateManager from '../../../managers/AppStateManager'
import { CAROUSEL_FRAME } from '../../../constants/carousel'
import textureCache from './TextureCache'
import { getRoundedMask, getGlowTexture } from './frameTextures'

const ImageFrame = ({ imageData, position, visibility, imageSize, onClickRef, introHidden }) => {
  const spinnerRef = useRef()
  const { imagePath } = imageData

  // ---------------------------------------------------------------------------
  // TEXTURE LOADING STATE
  // ---------------------------------------------------------------------------

  const [texture, setTexture] = useState(() => textureCache.get(imagePath))
  const [isLoading, setIsLoading] = useState(!textureCache.has(imagePath))
  const [fadeIn, setFadeIn] = useState(textureCache.has(imagePath) ? 1 : 0)
  const fadeRef = useRef(textureCache.has(imagePath) ? 1 : 0)

  useEffect(() => {
    if (textureCache.has(imagePath)) {
      setTexture(textureCache.get(imagePath))
      setIsLoading(false)
      fadeRef.current = 1
      setFadeIn(1)
      return
    }

    setIsLoading(true)
    fadeRef.current = 0
    setFadeIn(0)

    textureCache.load(imagePath, (tex) => {
      setTexture(tex)
      setIsLoading(false)
    }, () => setIsLoading(false))
  }, [imagePath])

  // ---------------------------------------------------------------------------
  // ANIMATION - spinner rotation + image fade-in
  // ---------------------------------------------------------------------------

  useFrame((_, delta) => {
    if (spinnerRef.current) spinnerRef.current.rotation.z -= delta * 3
    if (!isLoading && fadeRef.current < 1) {
      fadeRef.current = Math.min(1, fadeRef.current + delta * 4)
      setFadeIn(fadeRef.current)
    }
  })

  // ---------------------------------------------------------------------------
  // FRAME DIMENSIONS & CACHED TEXTURES
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
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClickRef?.current?.isDragging) return
    appStateManager.setSelectedImage(imageData)
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
        {/* Glow - furthest back */}
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[frame.glowW, frame.glowH]} />
          <meshBasicMaterial map={glowTexture} transparent opacity={opacity * CAROUSEL_FRAME.glowOpacity} depthWrite={false} />
        </mesh>

        {/* White border frame */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[frame.frameW, frame.frameH]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity} alphaMap={roundedMask} depthWrite={false} />
        </mesh>

        {/* Loading state: blue background + spinner */}
        {isLoading && (
          <>
            <mesh position={[0, 0, -0.015]}>
              <planeGeometry args={[frame.imageW, frame.imageH]} />
              <meshBasicMaterial color={CAROUSEL_FRAME.loadingColor} transparent opacity={opacity} alphaMap={roundedMask} depthWrite={false} />
            </mesh>
            <mesh ref={spinnerRef} position={[0, 0, -0.01]}>
              <ringGeometry args={[0.03, 0.045, 24, 1, 0, Math.PI * 1.5]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.8} side={THREE.DoubleSide} />
            </mesh>
          </>
        )}

        {/* Image texture */}
        {texture && (
          <mesh position={[0, 0, -0.01]} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
            <planeGeometry args={[frame.imageW, frame.imageH]} />
            <meshBasicMaterial map={texture} transparent opacity={opacity * fadeIn} alphaMap={roundedMask} depthWrite={false} />
          </mesh>
        )}

        {/* Dark overlay for depth - rendered on top */}
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
