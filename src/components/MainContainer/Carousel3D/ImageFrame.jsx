// ImageFrame - 3D image with frame, glow, and lazy loading

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import appStateManager from '../../../managers/AppStateManager'
import { CAROUSEL_FRAME } from '../../../constants/carousel'
import textureCache from './TextureCache'
import { getRoundedMask, getGlowTexture } from './frameTextures'

const ImageFrame = ({ imageData, position, visibility, imageSize, onClickRef }) => {
  const spinnerRef = useRef()
  const { imagePath } = imageData

  // Texture loading state
  const [texture, setTexture] = useState(() => textureCache.get(imagePath))
  const [isLoading, setIsLoading] = useState(!textureCache.has(imagePath))
  const [fadeIn, setFadeIn] = useState(textureCache.has(imagePath) ? 1 : 0)
  const fadeRef = useRef(textureCache.has(imagePath) ? 1 : 0)

  // Load texture via cache
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

    textureCache.getTexture(imagePath, (tex) => {
      setTexture(tex)
      setIsLoading(false)
    }, () => setIsLoading(false))
  }, [imagePath])

  // Animate spinner and fade-in
  useFrame((_, delta) => {
    if (spinnerRef.current && isLoading) {
      spinnerRef.current.rotation.z -= delta * 4
    }
    if (!isLoading && fadeRef.current < 1) {
      fadeRef.current = Math.min(1, fadeRef.current + delta * 4)
      setFadeIn(fadeRef.current)
    }
  })

  // Calculate frame dimensions
  const frame = useMemo(() => ({
    imageW: imageSize,
    imageH: imageSize,
    frameW: imageSize + CAROUSEL_FRAME.borderWidth * 2,
    frameH: imageSize + CAROUSEL_FRAME.borderWidth * 2,
    glowW: imageSize + CAROUSEL_FRAME.glowSpread,
    glowH: imageSize + CAROUSEL_FRAME.glowSpread
  }), [imageSize])

  // Get cached textures
  const roundedMask = useMemo(() => getRoundedMask(), [])
  const glowTexture = useMemo(() => getGlowTexture(), [])

  // Event handlers
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClickRef?.current?.isDragging) return
    appStateManager.setSelectedImage(imageData)
  }

  const handlePointerOver = () => { document.body.style.cursor = 'pointer' }
  const handlePointerOut = () => { document.body.style.cursor = 'auto' }

  // Don't render if not visible
  if (!visibility.visible) return null

  const { opacity, darkOverlay } = visibility

  return (
    <Billboard position={[position.x, position.y, position.z]} follow lockX={false} lockY={false} lockZ={false}>
      <group>
        {/* Glow */}
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[frame.glowW, frame.glowH]} />
          <meshBasicMaterial map={glowTexture} transparent opacity={opacity * CAROUSEL_FRAME.glowOpacity} depthWrite={false} />
        </mesh>

        {/* White border */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[frame.frameW, frame.frameH]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity} alphaMap={roundedMask} alphaTest={0.5} />
        </mesh>

        {/* Loading background */}
        {isLoading && (
          <mesh position={[0, 0, -0.015]}>
            <planeGeometry args={[frame.imageW, frame.imageH]} />
            <meshBasicMaterial color={CAROUSEL_FRAME.loadingColor} transparent opacity={opacity} alphaMap={roundedMask} alphaTest={0.5} />
          </mesh>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <mesh ref={spinnerRef} position={[0, 0, -0.01]}>
            <ringGeometry args={[0.06, 0.09, 16, 1, 0, Math.PI * 1.5]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.9} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Image */}
        {texture && (
          <mesh position={[0, 0, -0.01]} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
            <planeGeometry args={[frame.imageW, frame.imageH]} />
            <meshBasicMaterial map={texture} transparent opacity={opacity * fadeIn} alphaMap={roundedMask} alphaTest={0.5} />
          </mesh>
        )}

        {/* Dark overlay for depth */}
        {darkOverlay > 0.01 && (
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[frame.frameW, frame.frameH]} />
            <meshBasicMaterial color="#000000" transparent opacity={darkOverlay} alphaMap={roundedMask} alphaTest={0.5} />
          </mesh>
        )}
      </group>
    </Billboard>
  )
}

export default ImageFrame
