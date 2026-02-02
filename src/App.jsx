import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PuffLoader } from 'react-spinners'
import { APP_STATE, ROUTES } from './constants/index.js'
import dataManager from './managers/DataManager.js'
import appStateManager from './managers/AppStateManager.js'
import eventSystem from './utils/EventSystem.js'
import Background from './components/Background/Background.jsx'
import IntroPage from './pages/IntroPage.jsx'
import MainPage from './pages/MainPage.jsx'
import './App.css'

function App() {
  const [appState, setAppState] = useState(APP_STATE.LOADING)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for both data loading and minimum 2 second delay
        await Promise.all([
          dataManager.loadData(),
          new Promise(resolve => setTimeout(resolve, 2000))
        ])
        setAppState(APP_STATE.INTRO)
        appStateManager.setState(APP_STATE.INTRO)
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    initializeApp()

    const handleStateChange = (newState) => {
      setAppState(newState)
    }

    eventSystem.on(eventSystem.constructor.EVENTS.APP_STATE_CHANGED, handleStateChange)

    return () => {
      eventSystem.off(eventSystem.constructor.EVENTS.APP_STATE_CHANGED, handleStateChange)
    }
  }, [])

  if (appState === APP_STATE.LOADING) {
    return (
      <div className="app-loading">
        <Background />
        <div className="app-loading-content">
          <PuffLoader 
            color="var(--color-white)" 
            size={60}
            aria-label="Loading"
          />
        </div>
        <p className="app-loading-text">Loading</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Background />
        <Routes>
          <Route path={ROUTES.INTRO} element={<IntroPage />} />
          <Route path={ROUTES.MAIN} element={<MainPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
