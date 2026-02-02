import { useState, useEffect, useRef } from 'react'
import { ASSETS } from '../../constants/index.js'
import { gsap } from 'gsap'
import './ISIPanel.css'

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

    // Get CSS variable values
    const collapsedHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--isi-panel-collapsed-height').replace('px', ''))
    const expandedHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--isi-panel-expanded-height').replace('px', ''))

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create new timeline
    const tl = gsap.timeline()
    timelineRef.current = tl

    if (isOpen) {
      // Opening animation
      // Animate panel height
      tl.to(panelRef.current, {
        height: expandedHeight,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: () => {
          // Update overlay height based on panel position
          if (panelRef.current && overlayRef.current) {
            const rect = panelRef.current.getBoundingClientRect()
            gsap.set(overlayRef.current, { height: rect.top })
          }
        }
      })

      // Animate overlay opacity and height
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0) // Start at same time as panel animation

      // Animate button rotation
      if (toggleRef.current) {
        tl.to(toggleRef.current, {
          rotation: 45,
          duration: 0.3,
          ease: 'power2.out'
        }, 0)
      }
    } else {
      // Animate overlay opacity
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, 0)

      // Animate button rotation
      if (toggleRef.current) {
        tl.to(toggleRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, 0)
      }

      // Animate panel height
      tl.to(panelRef.current, {
        height: collapsedHeight,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: () => {
          // Update overlay height based on panel position
          if (panelRef.current && overlayRef.current) {
            const rect = panelRef.current.getBoundingClientRect()
            gsap.set(overlayRef.current, { height: rect.top })
          }
        }
      }, 0)
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [isOpen])

  // Initialize overlay height on mount
  useEffect(() => {
    if (panelRef.current && overlayRef.current) {
      const updateOverlayHeight = () => {
        const rect = panelRef.current.getBoundingClientRect()
        gsap.set(overlayRef.current, { height: rect.top })
      }
      
      updateOverlayHeight()
      window.addEventListener('resize', updateOverlayHeight)
      
      return () => {
        window.removeEventListener('resize', updateOverlayHeight)
      }
    }
  }, [])

  return (
    <div className="isi-panel-wrapper">
      <div
        ref={overlayRef}
        className="isi-overlay"
        style={{ opacity: 0, height: 0 }}
      />
      <div
        ref={panelRef}
        className="isi-panel"
        style={{ height: 'var(--isi-panel-collapsed-height)' }}
      >
        <button
          ref={toggleRef}
          className="isi-panel-toggle"
          onClick={togglePanel}
          style={{ transform: 'rotate(0deg)' }}
        >
          <img src={ASSETS.ICONS.PLUS_BUTTON} alt={isOpen ? 'Close' : 'Open'} />
        </button>
        <div className="isi-panel-content">
          <div
            ref={scrollableRef}
            className="isi-panel-scrollable"
          >
            <p>Important Safety Information content will be populated here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ISIPanel
