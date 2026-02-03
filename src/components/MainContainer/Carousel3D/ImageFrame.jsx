import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const ImageFrame = ({ imageData, position, rotation, scale = 1, opacity, blur, onClick }) => {
  const groupRef = useRef()
  const imageMeshRef = useRef()
  
  let texture = null
  try {
    texture = useTexture(imageData.imagePath)
  } catch (error) {
    console.warn('Failed to load texture:', imageData.imagePath)
  }

  useFrame(() => {
    if (imageMeshRef.current && imageMeshRef.current.material) {
      imageMeshRef.current.material.opacity = opacity
      imageMeshRef.current.material.needsUpdate = true
    }
    
    if (groupRef.current) {
      groupRef.current.scale.set(scale, scale, scale)
    }
  })

  if (!texture) return null

  const frameWidth = 1.08
  const frameThickness = 0.04
  const glowSize = 1.16

  return (
    <group 
      ref={groupRef}
      position={position} 
      rotation={rotation}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      {/* Glow effect - outer white glow */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[glowSize, glowSize]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity * 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Frame - white border */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[frameWidth, frameWidth]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner cutout - creates the border effect */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Image plane */}
      <mesh ref={imageMeshRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default ImageFrame
