/**
 * ImageManager.js
 *
 * Manages image preloading and texture caching for the carousel.
 * Preloads all thumbnail images during app initialisation to eliminate loading lag.
 * Provides fast lookup for thumbnail textures.
 */

import * as THREE from 'three'
import eventSystem from '../utils/EventSystem.js'
import dataManager from './DataManager.js'
import { DATA_SOURCE, ASSETS } from '../constants/index.js'

// ---------------------------------------------------------------------------
// IMAGE MANAGER CLASS
// ---------------------------------------------------------------------------

/**
 * Centralised image management with preloading and caching.
 * Preloads all thumbnail images during app initialisation to provide
 * instant image display in the carousel without loading lag.
 *
 * Responsibilities:
 * - Preload all patient thumbnails during app loading screen
 * - Cache thumbnail textures in GPU memory
 * - Provide fast thumbnail lookup by image path
 * - Track preloading progress
 *
 * Memory footprint: ~500 thumbnails @ 512x512 RGBA = ~500MB GPU memory (safe for modern devices)
 */
class ImageManager {
  // ---------------------------------------------------------------------------
  // INITIALISATION
  // ---------------------------------------------------------------------------

  constructor() {
    this.thumbnails = new Map()
    this.loader = new THREE.TextureLoader()
    this.isPreloaded = false
    this.preloadProgress = 0
  }

  // ---------------------------------------------------------------------------
  // THUMBNAIL PATH HELPERS
  // ---------------------------------------------------------------------------
  // Convert image path to thumbnail path (inserts '_thumb' before extension).

  getThumbnailPath(imagePath) {
    const dot = imagePath.lastIndexOf('.')
    return dot === -1 ? imagePath : `${imagePath.substring(0, dot)}_thumb${imagePath.substring(dot)}`
  }

  // ---------------------------------------------------------------------------
  // PRELOADING
  // ---------------------------------------------------------------------------

  /**
   * Preload all thumbnail images for all patients across both data sources.
   * Runs during the app loading screen. Loads thumbnails in parallel.
   */
  async preloadThumbnails() {
    if (!dataManager.isLoaded) {
      console.warn('ImageManager: DataManager not loaded yet, waiting...')
      return
    }

    const allImagePaths = this.getAllImagePaths()
    const totalImages = allImagePaths.length

    console.log(`ImageManager: Preloading ${totalImages} thumbnails...`)

    let loadedCount = 0

    const loadPromises = allImagePaths.map((imagePath) =>
      this.loadThumbnail(imagePath)
        .then(() => {
          loadedCount++
          this.preloadProgress = (loadedCount / totalImages) * 100
        })
        .catch(error => {
          console.warn(`Failed to load thumbnail: ${imagePath}`, error)
          loadedCount++
          this.preloadProgress = (loadedCount / totalImages) * 100
        })
    )

    await Promise.all(loadPromises)

    this.isPreloaded = true
    this.preloadProgress = 100

    console.log(`ImageManager: Preloaded ${this.thumbnails.size} thumbnails`)

    eventSystem.emit(eventSystem.constructor.EVENTS.IMAGES_READY)
  }

  /** Get all image paths from all patients in both data sources. */
  getAllImagePaths() {
    const imagePaths = new Set()

    const sources = [
      { source: DATA_SOURCE.CLINICAL_TRIAL },
      { source: DATA_SOURCE.PRACTICE_BASED }
    ]

    sources.forEach(({ source }) => {
      const patients = dataManager.getPatientsBySource(source)
      const imageFields = dataManager.getImageFields(source)

      patients.forEach(patient => {
        imageFields.forEach(field => {
          if (patient[field] && patient[field].trim() !== '') {
            const imagePath = `${ASSETS.PATIENTS_PATH}${patient[field]}`
            imagePaths.add(imagePath)
          }
        })
      })
    })

    return Array.from(imagePaths)
  }

  /** Load a single thumbnail texture. Returns a Promise that resolves with the loaded texture. */
  loadThumbnail(imagePath) {
    return new Promise((resolve, reject) => {
      const thumbnailPath = this.getThumbnailPath(imagePath)

      this.loader.load(
        thumbnailPath,
        (texture) => {
          this.thumbnails.set(imagePath, texture)
          resolve(texture)
        },
        undefined,
        (error) => {
          console.warn(`Failed to load thumbnail: ${thumbnailPath}`, error)
          reject(error)
        }
      )
    })
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  getThumbnail(imagePath) {
    return this.thumbnails.get(imagePath) || null
  }

  hasThumbnail(imagePath) {
    return this.thumbnails.has(imagePath)
  }

  getProgress() {
    return this.preloadProgress
  }

  isReady() {
    return this.isPreloaded
  }

  /** Clear all cached textures and free GPU memory. */
  clear() {
    this.thumbnails.forEach(texture => texture.dispose())
    this.thumbnails.clear()
    this.isPreloaded = false
    this.preloadProgress = 0
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

const imageManager = new ImageManager()

export default imageManager
