/**
 * ISIPanel.jsx
 * Collapsible panel component for displaying Important Safety Information (ISI)
 * Features smooth expand/collapse animations and responsive height management
 */

import { useState, useEffect, useRef } from 'react'
import { ASSETS } from '../../../constants/index.js'
import { gsap } from 'gsap'
import ISIContent from './ISIContent.jsx'
import './ISIPanel.css'

/**
 * ISIPanel Component
 *
 * A collapsible panel that displays Important Safety Information content.
 * Provides smooth animations for opening/closing with:
 * - Panel height expansion/collapse
 * - Overlay darken effect on the content above
 * - Toggle button rotation
 *
 * Height controlled by CSS variables --isi-panel-collapsed-height and --isi-panel-expanded-height.
 */
const ISIPanel = () => {
  const [isOpen, setIsOpen] = useState(false)

  const panelRef = useRef(null)
  const overlayRef = useRef(null)
  const toggleRef = useRef(null)
  const scrollableRef = useRef(null)
  const timelineRef = useRef(null)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (!panelRef.current || !overlayRef.current) return

    // Get CSS variable values for panel heights
    const collapsedHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--isi-panel-collapsed-height').replace('px', ''))
    const expandedHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--isi-panel-expanded-height').replace('px', ''))

    // Kill any existing GSAP timeline to prevent conflicts
    if (timelineRef.current) timelineRef.current.kill()

    // Create new GSAP timeline for coordinated animations
    const tl = gsap.timeline()
    timelineRef.current = tl

    if (isOpen) {
      // Opening animation sequence
      // Expand panel height smoothly
      tl.to(panelRef.current, {
        height: expandedHeight,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: () => {
          // Update overlay height to match panel position
          if (panelRef.current && overlayRef.current) {
            const rect = panelRef.current.getBoundingClientRect()
            gsap.set(overlayRef.current, { height: rect.top })
          }
        }
      })

      // Fade in overlay at same time as panel expansion
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)

      // Rotate toggle button to indicate open state
      if (toggleRef.current) {
        tl.to(toggleRef.current, {
          rotation: 45,
          duration: 0.3,
          ease: 'power2.out'
        }, 0)
      }
    } else {
      // Closing animation sequence
      // Fade out overlay
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 0)

      // Rotate toggle button back to closed state
      if (toggleRef.current) {
        tl.to(toggleRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, 0)
      }

      // Collapse panel height
      tl.to(panelRef.current, {
        height: collapsedHeight,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: () => {
          // Update overlay height as panel collapses
          if (panelRef.current && overlayRef.current) {
            const rect = panelRef.current.getBoundingClientRect()
            gsap.set(overlayRef.current, { height: rect.top })
          }
        }
      }, 0)
    }

    // Cleanup: kill timeline on unmount or state change
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [isOpen])

  // Initialise overlay height on mount and handle window resize
  useEffect(() => {
    if (panelRef.current && overlayRef.current) {
      const updateOverlayHeight = () => {
        const rect = panelRef.current.getBoundingClientRect()
        gsap.set(overlayRef.current, { height: rect.top })
      }

      // Set initial height
      updateOverlayHeight()
      // Update on window resize
      window.addEventListener('resize', updateOverlayHeight)

      // Cleanup: remove resize listener
      return () => {
        window.removeEventListener('resize', updateOverlayHeight)
      }
    }
  }, [])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="isi-panel-wrapper">
      {/* Overlay darkens the content area above when panel opens */}
      <div
        ref={overlayRef}
        className="isi-overlay"
        style={{ opacity: 0, height: 0 }}
      />
      {/* Main ISI panel */}
      <div
        ref={panelRef}
        className="isi-panel"
        style={{ height: 'var(--isi-panel-collapsed-height)' }}
      >
        {/* Toggle button to expand/collapse panel */}
        <button
          ref={toggleRef}
          className="isi-panel-toggle"
          onClick={togglePanel}
          style={{ transform: 'rotate(0deg)' }}
        >
          <img src={ASSETS.ICONS.PLUS_BUTTON} alt={isOpen ? 'Close' : 'Open'} />
        </button>
        {/* Panel content area */}
        <div className="isi-panel-content">
          {/* Scrollable area for ISI text content */}
          <div
            ref={scrollableRef}
            className="isi-panel-scrollable"
          >
            <ISIContent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ISIPanel
