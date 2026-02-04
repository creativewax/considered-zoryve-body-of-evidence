/**
 * App.jsx
 *
 * Main application component handling routing, data initialisation, and loading states.
 * Lifecycle: LOADING → INTRO (landing) → MAIN (carousel with filters).
 */

import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PuffLoader } from 'react-spinners'
import { APP_STATE, ROUTES } from './constants/index.js'
import dataManager from './managers/DataManager.js'
import imageManager from './managers/ImageManager.js'
import appStateManager from './managers/AppStateManager.js'
import eventSystem from './utils/EventSystem.js'
import useEventSubscription from './hooks/common/useEventSubscription.js'
import Background from './components/common/Background/Background.jsx'
import IntroPage from './pages/IntroPage/IntroPage.jsx'
import MainPage from './pages/MainPage/MainPage.jsx'
import './App.css'

// ---------------------------------------------------------------------------
// APP COMPONENT
// ---------------------------------------------------------------------------

function App() {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [appState, setAppState] = useState(APP_STATE.LOADING)
  const [loadingStage, setLoadingStage] = useState('Loading patient data...')
  const [loadingProgress, setLoadingProgress] = useState(0)

  // ---------------------------------------------------------------------------
  // EFFECTS - INITIALISATION
  // ---------------------------------------------------------------------------

  useEffect(() => {
    /**
     * Initialise application by loading patient data and preloading thumbnails
     * Shows real-time loading progress for each stage
     *
     * Loading stages:
     * 1. Load patient data JSON
     * 2. Preload ALL thumbnail images
     * 3. Transition to intro page
     */
    const initialiseApp = async () => {
      try {
        // Stage 1: Load patient data
        setLoadingStage('Loading patient data...')
        setLoadingProgress(0)
        await dataManager.loadData()

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

        // Transition to intro page once everything is loaded
        setAppState(APP_STATE.INTRO)
        appStateManager.setState(APP_STATE.INTRO)
      } catch (error) {
        console.error('Failed to initialise app:', error)
      }
    }

    // Start initialisation on mount
    initialiseApp()
  }, [])

  // Subscribe to app state changes
  useEventSubscription(
    eventSystem.constructor.EVENTS.APP_STATE_CHANGED,
    (newState) => setAppState(newState),
    []
  )

  // ---------------------------------------------------------------------------
  // RENDER - LOADING STATE
  // ---------------------------------------------------------------------------

  if (appState === APP_STATE.LOADING) {
    return (
      <div className="app-loading">
        <Background />
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
        {/* Background gradient/image displayed on all pages */}
        <Background />

        {/* Route configuration */}
        <Routes>
          {/* Landing page with "Get Started" button */}
          <Route path={ROUTES.INTRO} element={<IntroPage />} />

          {/* Main carousel view with filters */}
          <Route path={ROUTES.MAIN} element={<MainPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
