/**
 * App.jsx
 *
 * Main application component handling routing, data initialisation, and loading states.
 * Lifecycle: LOADING → INTRO (landing) → MAIN (carousel with filters).
 */

import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PuffLoader } from 'react-spinners'
import { AnimatePresence } from 'framer-motion'
import { APP_STATE, ROUTES } from './constants/index.js'
import dataManager from './managers/DataManager.js'
import imageManager from './managers/ImageManager.js'
import appStateManager from './managers/AppStateManager.js'
import debugManager from './managers/DebugManager.js'
import eventSystem from './utils/EventSystem.js'
import useManagerSubscription from './hooks/common/useManagerSubscription.js'
import useEventSubscription from './hooks/common/useEventSubscription.js'
import Background from './components/common/Background/Background.jsx'
import DraftWatermark from './components/common/DraftWatermark/DraftWatermark.jsx'
import IntroPage from './pages/IntroPage/IntroPage.jsx'
import MainPage from './pages/MainPage/MainPage.jsx'
import ImageViewer from './components/carousel/DetailOverlay/ImageViewer.jsx'
import './App.css'

// ---------------------------------------------------------------------------
// APP COMPONENT
// ---------------------------------------------------------------------------

function App() {
  // ---------------------------------------------------------------------------
  // STATE — appState from manager (single source of truth)
  // ---------------------------------------------------------------------------

  const appState = useManagerSubscription(appStateManager, mgr => mgr.getState())
  const [loadingStage, setLoadingStage] = useState('Loading patient data...')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [imageViewerState, setImageViewerState] = useState(null) // { timepoints, index }

  // ---------------------------------------------------------------------------
  // EFFECTS - INITIALISATION
  // ---------------------------------------------------------------------------

  // Check for debug mode before anything renders
  const isDebug = debugManager.parseUrl()

  useEffect(() => {
    /**
     * Initialise application by loading patient data and preloading thumbnails
     * Shows real-time loading progress for each stage
     *
     * Loading stages:
     * 1. Load patient data JSON
     * 2. Preload ALL thumbnail images
     * 3. Transition to intro page (or main page in debug mode)
     */
    const initialiseApp = async () => {
      try {
        // Stage 1: Load patient data
        setLoadingStage('Loading patient data...')
        setLoadingProgress(0)
        const { data } = await dataManager.loadData()

        // Stage 2: Preload thumbnails with progress tracking
        setLoadingStage('Loading images...')

        // Poll image loading progress every 100ms
        const progressInterval = setInterval(() => {
          const progress = imageManager.getProgress()
          setLoadingProgress(Math.round(progress))
        }, 100)

        // Start thumbnail preloading
        await imageManager.preloadThumbnails()

        // Clear progress polling interval
        clearInterval(progressInterval)
        setLoadingProgress(100)

        // Debug mode: skip intro, go straight to main, then activate debug overlay
        if (isDebug) {
          appStateManager.setState(APP_STATE.MAIN)
          // Give the main page time to mount before activating debug
          setTimeout(() => debugManager.activate(data), 500)
        } else {
          // Normal flow: transition to intro page
          appStateManager.setState(APP_STATE.INTRO)
        }
      } catch (error) {
        console.error('Failed to initialise app:', error)
      }
    }

    // Start initialisation on mount
    initialiseApp()
  }, [])

  // Image viewer events (these are UI-only events, not manager state)
  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGE_VIEWER_OPENED,
    ({ timepoints, index }) => setImageViewerState({ timepoints, index }),
    []
  )
  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGE_VIEWER_CLOSED,
    () => setImageViewerState(null),
    []
  )

  // ---------------------------------------------------------------------------
  // RENDER - LOADING STATE
  // ---------------------------------------------------------------------------

  if (appState === APP_STATE.LOADING) {
    return (
      <div className="app-loading">
        <Background />
        <DraftWatermark />
        <div className="app-loading-content">
          <PuffLoader
            color="var(--colour-white)"
            size={120}
            aria-label="Loading"
          />
        </div>
        <p className="app-loading-text">{loadingStage}</p>
        {loadingProgress > 0 && (
          <p className="app-loading-progress">{loadingProgress}%</p>
        )}
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // RENDER - MAIN APPLICATION
  // ---------------------------------------------------------------------------

  return (
    <BrowserRouter>
      <div className="app">
        <Background />
        <DraftWatermark />

        <Routes>
          <Route path={ROUTES.INTRO} element={<IntroPage />} />
          <Route path={ROUTES.MAIN} element={<MainPage />} />
          <Route path="/debug/*" element={<MainPage />} />
        </Routes>

        <AnimatePresence>
          {imageViewerState && (
            <ImageViewer
              timepoints={imageViewerState.timepoints}
              initialIndex={imageViewerState.index}
            />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
