/**
 * App.jsx
 *
 * Main application component handling routing, data initialization, and loading states
 * Manages the app lifecycle from initial data load through navigation between pages
 * Displays a loading screen while patient data is being fetched
 */

// #region Imports
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PuffLoader } from 'react-spinners'
import { APP_STATE, ROUTES } from './constants/index.js'
import dataManager from './managers/DataManager.js'
import appStateManager from './managers/AppStateManager.js'
import eventSystem from './utils/EventSystem.js'
import useEventSubscription from './hooks/common/useEventSubscription.js'
import Background from './components/common/Background/Background.jsx'
import IntroPage from './pages/IntroPage/IntroPage.jsx'
import MainPage from './pages/MainPage/MainPage.jsx'
import './App.css'
// #endregion

// ─────────────────────────────────────────────────────────────────────────────

/**
 * App Component
 *
 * Root application component that handles:
 * - Initial data loading from patient data JSON
 * - App state management and routing
 * - Loading screen display during initialization
 * - Event system subscriptions for state changes
 *
 * The app follows this lifecycle:
 * 1. LOADING: Display spinner while fetching patient data (minimum 2 seconds)
 * 2. INTRO: Show landing page with "Get Started" button
 * 3. MAIN: Display carousel with filters after user clicks through
 *
 * @component
 * @returns {React.ReactElement} BrowserRouter with app routes or loading screen
 */
// #region Component
function App() {
  // #region State Management
  // Track current application state (loading, intro, main)
  const [appState, setAppState] = useState(APP_STATE.LOADING)
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Effects - Initialization
  useEffect(() => {
    /**
     * Initialize application by loading patient data and transitioning to intro
     * Waits for both data load and minimum 2 second delay to prevent flash
     */
    const initializeApp = async () => {
      try {
        // Wait for both data loading and minimum 2 second delay
        // This ensures the loading screen is visible long enough to feel intentional
        await Promise.all([
          dataManager.loadData(),
          new Promise(resolve => setTimeout(resolve, 2000))
        ])

        // Transition to intro page once data is loaded
        setAppState(APP_STATE.INTRO)
        appStateManager.setState(APP_STATE.INTRO)
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    // Start initialization on mount
    initializeApp()
  }, [])

  // Subscribe to app state changes
  useEventSubscription(
    eventSystem.constructor.EVENTS.APP_STATE_CHANGED,
    (newState) => setAppState(newState),
    []
  )
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Render - Loading State
  // Show loading screen while data is being fetched
  if (appState === APP_STATE.LOADING) {
    return (
      <div className="app-loading">
        <Background />
        <div className="app-loading-content">
          {/* Animated puff loader from react-spinners */}
          <PuffLoader
            color="var(--color-white)"
            size={120}
            aria-label="Loading"
          />
        </div>
        <p className="app-loading-text">Loading</p>
      </div>
    )
  }
  // #endregion

  // ───────────────────────────────────────────────────────────────────────────

  // #region Render - Main Application
  // Render main app with routing once data is loaded
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
  // #endregion
}
// #endregion

export default App
