// TextureCache - singleton for throttled texture loading with caching

import * as THREE from 'three'

const MAX_CONCURRENT_LOADS = 3 // prevent UI lockup by limiting parallel loads

class TextureCache {
  constructor() {
    this.cache = new Map()     // path -> texture
    this.pending = new Map()   // path -> callbacks[]
    this.queue = []            // queued load requests
    this.activeLoads = 0       // current number of loading textures
    this.loader = new THREE.TextureLoader()
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  has(path) {
    return this.cache.has(path)
  }

  get(path) {
    return this.cache.get(path) || null
  }

  load(path, onLoad, onError) {
    // Return cached immediately
    if (this.cache.has(path)) {
      setTimeout(() => onLoad(this.cache.get(path)), 0)
      return
    }

    // Add to pending callbacks if already loading
    if (this.pending.has(path)) {
      this.pending.get(path).push({ onLoad, onError })
      return
    }

    // Queue the load request
    this.pending.set(path, [{ onLoad, onError }])
    this.queue.push(path)
    this.processQueue()
  }

  clear() {
    this.cache.forEach(texture => texture.dispose())
    this.cache.clear()
    this.pending.clear()
    this.queue = []
  }

  // ---------------------------------------------------------------------------
  // INTERNAL - throttled queue processing
  // ---------------------------------------------------------------------------

  processQueue() {
    while (this.activeLoads < MAX_CONCURRENT_LOADS && this.queue.length > 0) {
      const path = this.queue.shift()
      this.loadTexture(path)
    }
  }

  loadTexture(path) {
    this.activeLoads++

    this.loader.load(
      path,
      (texture) => {
        this.cache.set(path, texture)
        this.resolveCallbacks(path, texture, true)
      },
      undefined,
      (error) => {
        console.warn('TextureCache: failed to load', path, error)
        this.resolveCallbacks(path, null, false)
      }
    )
  }

  resolveCallbacks(path, texture, success) {
    const callbacks = this.pending.get(path) || []
    this.pending.delete(path)
    this.activeLoads--

    // Notify all waiting callbacks
    callbacks.forEach(cb => {
      try {
        success ? cb.onLoad(texture) : cb.onError?.()
      } catch (e) {
        console.error('TextureCache callback error:', e)
      }
    })

    // Process next items in queue
    this.processQueue()
  }
}

const textureCache = new TextureCache()
export default textureCache
