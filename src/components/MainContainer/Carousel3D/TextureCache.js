// TextureCache - singleton for caching loaded textures

import * as THREE from 'three'

class TextureCache {
  constructor() {
    this.cache = new Map()
    this.loading = new Map()
  }

  // Check if texture is cached
  has(path) {
    return this.cache.has(path)
  }

  // Get cached texture (returns null if not cached)
  get(path) {
    return this.cache.get(path) || null
  }

  // Load texture with caching and deduplication
  getTexture(path, onLoad, onError) {
    // Return cached immediately
    if (this.cache.has(path)) {
      setTimeout(() => onLoad(this.cache.get(path)), 0)
      return
    }

    // Add to pending callbacks if already loading
    if (this.loading.has(path)) {
      this.loading.get(path).push({ onLoad, onError })
      return
    }

    // Start new load
    this.loading.set(path, [{ onLoad, onError }])

    new THREE.TextureLoader().load(
      path,
      (texture) => {
        this.cache.set(path, texture)
        const callbacks = this.loading.get(path) || []
        this.loading.delete(path)
        callbacks.forEach(cb => cb.onLoad(texture))
      },
      undefined,
      (error) => {
        const callbacks = this.loading.get(path) || []
        this.loading.delete(path)
        callbacks.forEach(cb => cb.onError?.(error))
      }
    )
  }

  // Clear all cached textures
  clear() {
    this.cache.forEach(texture => texture.dispose())
    this.cache.clear()
    this.loading.clear()
  }
}

const textureCache = new TextureCache()
export default textureCache
