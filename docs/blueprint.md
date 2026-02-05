# Architecture Blueprint
## Decoupled, Event-Driven Application Framework

**Version:** 1.0
**Language:** UK English (always)
**Philosophy:** Clean, readable, modular, loosely-coupled code with single responsibility

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Event-Driven Architecture](#event-driven-architecture)
3. [Manager Pattern](#manager-pattern)
4. [Custom Hooks Pattern](#custom-hooks-pattern)
5. [Component Architecture](#component-architecture)
6. [File Organisation](#file-organisation)
7. [Coding Standards](#coding-standards)
8. [Comment Style](#comment-style)
9. [Naming Conventions](#naming-conventions)
10. [Constants & Configuration](#constants--configuration)
11. [State Management](#state-management)
12. [React-Specific Patterns](#react-specific-patterns)
13. [Performance Patterns](#performance-patterns)
14. [Testing Strategy](#testing-strategy)

---

## Core Principles

### 1. Zero Tight Coupling
**Problem:** Components directly calling manager methods creates dependencies that make code brittle and hard to test.

**Solution:** Event-driven architecture where components emit events and managers respond.

```javascript
// ❌ WRONG - Tight coupling
const handleClick = () => {
  appStateManager.setFilter('condition', value)
}

// ❌ WRONG - Event-driven but hardcoded string (typo risk!)
const handleClick = () => {
  eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
    filterType: 'condition',  // What if you typo 'conditon'?
    value: value
  })
}

// ✅ CORRECT - Event-driven, decoupled, using constants
import { FILTER_KEYS } from '../constants/index'

const handleClick = () => {
  eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
    filterType: FILTER_KEYS.CONDITION,  // IDE autocomplete, no typos!
    value: value
  })
}
```

**Benefits:**
- Components don't import or depend on managers
- Easy to add new listeners without changing existing code
- Testable in isolation
- Clear separation of concerns

### 2. Single Responsibility
Every module (component, hook, manager, utility) should have ONE clear purpose.

**Examples:**
- `FilterManager` - ONLY manages filter state
- `AppStateManager` - ONLY manages app lifecycle state (loading/intro/main)
- `ImageManager` - ONLY manages image preloading and caching
- `useCarouselManager` - ONLY manages carousel data and layout initialisation

### 3. Modularisation
Break down functionality into small, focused, reusable units.

**Avoid:**
- Over-engineering: Don't create abstraction layers that hide simple operations
- Wrapper hooks that just call other hooks (e.g., `useRotationSync` wrapping `useManagerSubscription`)
- One-line helpers that obscure what they do

**Prefer:**
- Direct, readable code at call site
- Abstractions that genuinely hide complexity (e.g., `useCameraAnimation` with 75+ lines of logic)

### 4. Clean, Readable Code
Code is read far more often than it's written. Optimise for readability.

**Guidelines:**
- Self-documenting code through clear naming
- Simple functions with clear inputs and outputs
- Avoid deeply nested logic
- Extract complex calculations to named variables
- No magic numbers - use named constants

---

## Event-Driven Architecture

### EventSystem - Central Pub/Sub

**Location:** `/src/utils/EventSystem.js`

**Purpose:** Lightweight publish/subscribe event bus for decoupled component communication.

```javascript
class EventSystem {
  constructor() {
    this.events = {}
  }

  on(eventName, callback) { /* subscribe */ }
  off(eventName, callback) { /* unsubscribe */ }
  emit(eventName, data) { /* publish */ }
  clear(eventName) { /* cleanup */ }

  static EVENTS = {
    // User interaction events (requests from UI)
    FILTER_SELECTED: 'filterSelected',
    FILTERS_RESET_REQUESTED: 'filtersResetRequested',
    SOURCE_CHANGED: 'sourceChanged',
    IMAGE_SELECTED: 'imageSelected',
    IMAGE_DESELECTED: 'imageDeselected',
    NAVIGATION_REQUESTED: 'navigationRequested',

    // Manager state change events (notifications)
    CATEGORY_CHANGED: 'categoryChanged',
    FILTER_CHANGED: 'filterChanged',
    FILTERS_RESET: 'filtersReset',
    IMAGE_CLICKED: 'imageClicked',
    IMAGES_UPDATED: 'imagesUpdated',

    // App lifecycle events
    DATA_LOADED: 'dataLoaded',
    IMAGES_READY: 'imagesReady',
    APP_STATE_CHANGED: 'appStateChanged',
  }
}

// Singleton export
const eventSystem = new EventSystem()
export default eventSystem
```

### Event Naming Convention

**User interaction events (requests):** Present tense or request form
- `filterSelected` - User clicked filter button
- `filtersResetRequested` - User clicked reset button
- `navigationRequested` - User clicked navigation arrow

**Manager state events (notifications):** Past tense
- `filterChanged` - Filter value HAS changed
- `imagesUpdated` - Image list HAS updated
- `appStateChanged` - App state HAS changed

### Event Flow Pattern

```
USER ACTION (click/select)
    ↓
COMPONENT emits event (e.g., FILTER_SELECTED)
    ↓
MANAGER listens to event → updates internal state
    ↓
MANAGER emits state change event (e.g., FILTER_CHANGED)
    ↓
COMPONENTS listen to state change → re-render with new data
```

### Implementation Example

**Component (emitter):**
```javascript
import eventSystem from '../utils/EventSystem'
import { FILTER_KEYS } from '../constants/index'

const FilterButton = ({ value, filterKey }) => {
  const handleClick = () => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: filterKey,  // Use constant, not string literal
      value: value === selected ? null : value
    })
  }

  return <button onClick={handleClick}>{value}</button>
}

// Usage
<FilterButton value="Plaque Psoriasis" filterKey={FILTER_KEYS.CONDITION} />
```

**Manager (listener):**
```javascript
import eventSystem from '../utils/EventSystem'

class FilterManager {
  constructor() {
    this.filters = { condition: null, age: null, /* ... */ }

    // Listen to UI events
    eventSystem.on(
      eventSystem.constructor.EVENTS.FILTER_SELECTED,
      this.handleFilterSelected.bind(this)
    )
  }

  handleFilterSelected({ filterType, value }) {
    if (this.filters[filterType] !== value) {
      this.filters[filterType] = value

      // Emit state change
      eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_CHANGED, {
        filterType,
        value,
        filters: { ...this.filters }
      })

      this.triggerUpdate()
    }
  }
}
```

### Error Handling in Events

Always wrap event handlers in try/catch to prevent one handler from breaking others:

```javascript
emit(eventName, data) {
  if (!this.events[eventName]) return

  this.events[eventName].forEach(callback => {
    try {
      callback(data)
    } catch (error) {
      console.error(`Error in event handler for ${eventName}:`, error)
    }
  })
}
```

---

## Manager Pattern

### What is a Manager?

A **Manager** is a singleton class that owns and manages a specific domain of application state.

**Characteristics:**
- Singleton pattern (one instance for entire app)
- Encapsulates related state and logic
- Provides public API for reading state
- Listens to events and emits state changes
- Never imported directly by UI components (except for hooks)

### Manager Responsibilities

| Manager | Owns | Listens To | Emits |
|---------|------|------------|-------|
| **FilterManager** | Filter state (condition, age, gender, etc.) | FILTER_SELECTED, FILTERS_RESET_REQUESTED | FILTER_CHANGED, FILTERS_RESET, IMAGES_UPDATED |
| **AppStateManager** | App lifecycle state, data source, selected image | SOURCE_CHANGED, IMAGE_SELECTED, IMAGE_DESELECTED | CATEGORY_CHANGED, IMAGE_CLICKED, APP_STATE_CHANGED |
| **RotationStateManager** | Carousel rotation angle, animation state | NAVIGATION_REQUESTED | (notifies subscribers directly) |
| **PoolManager** | Image slot pooling, visible slots | (called from useFrame) | (notifies subscribers directly) |
| **DataManager** | Patient data, JSON loading | (none) | DATA_LOADED |
| **ImageManager** | Texture preloading, image cache | (none) | IMAGES_READY |

### Manager Template

```javascript
/**
 * [ManagerName].js
 *
 * Brief description of purpose and responsibilities
 * Event-driven architecture pattern
 */

import eventSystem from '../utils/EventSystem.js'

// ---------------------------------------------------------------------------
// MANAGER CLASS
// ---------------------------------------------------------------------------

class [ManagerName] {
  // ---------------------------------------------------------------------------
  // INITIALISATION
  // ---------------------------------------------------------------------------

  constructor() {
    // Initialise state
    this.someState = initialValue

    // Set up event listeners
    eventSystem.on(
      eventSystem.constructor.EVENTS.SOME_EVENT,
      this.handleSomeEvent.bind(this)
    )
  }

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handle event description
   * Explain what this handler does and when it's triggered
   */
  handleSomeEvent({ payload }) {
    // Validate and update state
    if (this.someState !== payload) {
      this.someState = payload

      // Emit state change notification
      eventSystem.emit(eventSystem.constructor.EVENTS.STATE_CHANGED, {
        newState: this.someState
      })
    }
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  getSomeState() {
    return this.someState
  }

  // ---------------------------------------------------------------------------
  // SUBSCRIPTION (if using subscription pattern)
  // ---------------------------------------------------------------------------

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.someState) }
      catch (e) { console.error('[ManagerName]:', e) }
    })
  }
}

// ---------------------------------------------------------------------------
// SINGLETON EXPORT
// ---------------------------------------------------------------------------

const managerInstance = new [ManagerName]()
export default managerInstance
```

### Subscription Pattern (Alternative to EventSystem)

Some managers use a direct subscription pattern instead of EventSystem for high-frequency updates (e.g., rotation changes every frame):

```javascript
class RotationStateManager {
  constructor() {
    this.rotation = 0
    this.listeners = new Set()
  }

  setRotation(value) {
    this.rotation = value
    this.notifyListeners()
  }

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.rotation) }
      catch (e) { console.error('RotationStateManager:', e) }
    })
  }
}
```

**When to use EventSystem vs Subscription:**
- **EventSystem:** Cross-cutting concerns, UI interactions, lifecycle events
- **Subscription:** High-frequency updates (animation frames), direct state sync

---

## Custom Hooks Pattern

### Hook Philosophy

Custom hooks extract reusable logic from components. They should:

1. **Have a clear, single purpose**
2. **Be genuinely reusable** (used in 2+ places, or complex enough to warrant extraction)
3. **Hide complexity, not obscure simplicity**
4. **Return values, not just side effects**

### Hook Categories

#### 1. Manager Subscription Hooks

Connect components to manager state with automatic cleanup.

**`useManagerSubscription`** - Generic subscription to any manager:
```javascript
/**
 * Subscribe to a manager's state changes with automatic synchronisation
 * manager - Manager instance with subscribe()
 * selector - Function to extract value from manager
 * dependencies - Optional dependency array
 */
export const useManagerSubscription = (manager, selector, dependencies = []) => {
  const [value, setValue] = useState(() => selector(manager))

  useEffect(() => {
    const update = () => {
      const newValue = selector(manager)
      setValue(newValue)
    }

    update()
    const unsubscribe = manager.subscribe(update)
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, ...dependencies])

  return value
}
```

**Usage:**
```javascript
const rotation = useManagerSubscription(
  rotationStateManager,
  (mgr) => mgr.getRotation()
)
const activeSlots = useManagerSubscription(
  poolManager,
  (mgr) => [...mgr.getActiveSlots()]
)
```

**Important:** Do NOT include `selector` in dependency array - inline functions create new references every render, causing subscription thrashing.

**`useEventSubscription`** - Subscribe to EventSystem events:
```javascript
/**
 * Subscribe to an event with automatic cleanup on unmount
 * eventName - Event to listen to
 * callback - Handler function
 * dependencies - Dependency array for callback
 */
export const useEventSubscription = (eventName, callback, dependencies = []) => {
  useEffect(() => {
    eventSystem.on(eventName, callback)
    return () => eventSystem.off(eventName, callback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, ...dependencies])
}
```

**Usage:**
```javascript
useEventSubscription(
  eventSystem.constructor.EVENTS.FILTER_CHANGED,
  handleFilterChange,
  [handleFilterChange]
)
```

#### 2. Business Logic Hooks

Encapsulate complex component logic.

**`useCarouselManager`** - Handles carousel data, layout, and fade transitions:
```javascript
/**
 * Carousel data, layout, fade transitions
 * containerRef - Ref for fade animations
 * Returns { layoutConfig, imageCount }
 */
export const useCarouselManager = (containerRef) => {
  const [layoutConfig, setLayoutConfig] = useState(null)
  const [imageCount, setImageCount] = useState(0)
  const pendingRef = useRef(null)
  const currentRowsRef = useRef(null)
  const isInitialisedRef = useRef(false)

  const initCarousel = useCallback(() => {
    // Fetch filtered images
    const filters = {
      ...filterManager.getFilters(),
      source: appStateManager.getSource()
    }
    const images = dataManager.getFilteredImages(filters)
    const count = images.length

    // Handle empty state
    if (count === 0) {
      setLayoutConfig(null)
      setImageCount(0)
      rotationStateManager.reset()
      poolManager.reset()
      currentRowsRef.current = null
      return
    }

    const config = getLayoutConfig(count)
    const isInitialLoad = currentRowsRef.current === null

    // Apply fade transition for filter changes (skip on initial load)
    if (!isInitialLoad && containerRef.current) {
      // Fade out → update state → fade in
      pendingRef.current = { config, images, count }

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: CAROUSEL_SETTINGS.transitionFadeDuration,
        ease: 'power2.inOut',
        onComplete: () => {
          const pending = pendingRef.current
          if (!pending) return
          pendingRef.current = null

          setLayoutConfig(pending.config)
          setImageCount(pending.count)
          currentRowsRef.current = pending.config.rows
          rotationStateManager.setColumnAngle(pending.config.columnAngle)
          rotationStateManager.setRotation(0)
          poolManager.initialisePool(pending.config, pending.images, 0)

          gsap.to(containerRef.current, {
            opacity: 1,
            duration: CAROUSEL_SETTINGS.transitionFadeDuration,
            ease: 'power2.inOut'
          })
        }
      })
    } else {
      // Initial load - no animation
      setLayoutConfig(config)
      setImageCount(count)
      currentRowsRef.current = config.rows
      rotationStateManager.setColumnAngle(config.columnAngle)
      rotationStateManager.setRotation(0)
      poolManager.initialisePool(config, images, 0)
    }
  }, [containerRef])

  // Subscribe to data/filter changes
  useEventSubscription(
    eventSystem.constructor.EVENTS.IMAGES_UPDATED,
    initCarousel,
    [initCarousel]
  )

  useEventSubscription(
    eventSystem.constructor.EVENTS.CATEGORY_CHANGED,
    initCarousel,
    [initCarousel]
  )

  // Initialise once on mount
  useEffect(() => {
    if (!isInitialisedRef.current) {
      isInitialisedRef.current = true
      initCarousel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { layoutConfig, imageCount }
}
```

**Why this is a good hook:**
- 73 lines of complex logic extracted from component
- Manages multiple state variables and refs
- Coordinates between multiple managers
- Handles complex fade transition logic
- Genuinely improves component readability

#### 3. Interaction Hooks

Handle user input and interactions.

**`useDragInteraction`** - Carousel drag rotation:
```javascript
/**
 * Provides pointer event handlers for carousel drag
 * gl - WebGL renderer from useThree()
 * clickRef - Ref to track click vs drag
 * Returns { onPointerDown, onPointerMove, onPointerUp }
 */
export const useDragInteraction = (gl, clickRef) => {
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startRotation: 0
  })

  const onPointerDown = useCallback((e) => {
    if (!rotationStateManager.canInteract()) return

    e.stopPropagation()
    rotationStateManager.interruptAnimation()

    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startRotation: rotationStateManager.getRotation()
    }

    clickRef.current.isDragging = false
    gl.domElement.setPointerCapture(e.pointerId)
  }, [gl, clickRef])

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.active) return

    const deltaX = e.clientX - dragRef.current.startX

    if (!dragRef.current.moved && isDragThresholdMet(dragRef.current.startX, e.clientX)) {
      dragRef.current.moved = true
      clickRef.current.isDragging = true
    }

    if (dragRef.current.moved) {
      rotationStateManager.setRotation(
        dragRef.current.startRotation - deltaX * CAROUSEL_SETTINGS.dragSensitivity
      )
    }
  }, [clickRef])

  const onPointerUp = useCallback((e) => {
    if (!dragRef.current.active) return

    gl.domElement.releasePointerCapture(e.pointerId)

    if (dragRef.current.moved) {
      rotationStateManager.snapToNearestColumn()
    }

    dragRef.current.active = false
    setTimeout(() => { clickRef.current.isDragging = false }, 50)
  }, [gl, clickRef])

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp
  }
}
```

### When NOT to Create a Hook

**Bad example - Over-engineered wrapper:**
```javascript
// ❌ DON'T DO THIS - Adds no value
const useRotationSync = () => {
  return useManagerSubscription(
    rotationStateManager,
    (mgr) => mgr.getRotation()
  )
}
```

**Why this is bad:**
- Only saves 2 lines of code
- Hides what manager and selector are being used
- Adds an extra import and file to maintain
- Makes code LESS readable, not more

**Better:**
```javascript
// ✅ DO THIS - Clear and direct
const rotation = useManagerSubscription(
  rotationStateManager,
  (mgr) => mgr.getRotation()
)
```

---

## Component Architecture

### Component Types

#### 1. Page Components
**Location:** `/src/pages/`

Top-level route components that compose the page layout.

**Characteristics:**
- Minimal logic - mostly layout composition
- No direct state management
- Emit events for user interactions
- Subscribe to manager state via hooks

**Example:**
```javascript
/**
 * MainPage.jsx
 *
 * Main application page with carousel, filters, and footer
 */

import MainView from '../../views/MainView/MainView'
import FilterPanel from '../../components/filters/FilterPanel/FilterPanel'
import Footer from '../../components/layout/Footer/Footer'
import ISIPanel from '../../components/layout/ISIPanel/ISIPanel'
import './MainPage.css'

const MainPage = () => {
  return (
    <div className="main-page">
      <FilterPanel />
      <MainView />
      <ISIPanel />
      <Footer />
    </div>
  )
}

export default MainPage
```

#### 2. View Components
**Location:** `/src/views/`

Complex components that manage significant UI sections.

**Characteristics:**
- May use multiple custom hooks
- Coordinate between multiple child components
- Handle complex layout logic
- Connect to managers via hooks

**Example structure:**
```javascript
const MainView = () => {
  const containerRef = useRef(null)
  const { layoutConfig, imageCount } = useCarouselManager(containerRef)

  return (
    <div className="main-view">
      <div className="main-view-content" ref={containerRef}>
        {layoutConfig && imageCount > 0 ? (
          <>
            <Canvas camera={{ /* ... */ }}>
              <Carousel3DScene layoutConfig={layoutConfig} />
            </Canvas>
            <NavigationArrows />
            <Shadow rowCount={layoutConfig.rows} />
          </>
        ) : (
          <div className="main-view-no-images">
            <h2>No Images Found</h2>
            <p>Adjust filters to see patient images</p>
          </div>
        )}
      </div>
      <DetailOverlay />
    </div>
  )
}
```

#### 3. UI Components
**Location:** `/src/components/`

Reusable presentational components.

**Organisation by domain:**
```
/components
  /filters          - Filter-related components
  /carousel         - Carousel-related components (3D scene, frames, navigation)
  /layout           - Layout components (header, footer, panels)
  /common           - Truly shared components (buttons, backgrounds)
  /animations       - Animation components
```

**Characteristics:**
- Focused on presentation
- Receive data via props
- Emit events for user interactions
- Minimal business logic
- Highly reusable

**Example - Event-driven filter component:**
```javascript
/**
 * ConditionFilter.jsx
 *
 * Filter for selecting patient condition (Plaque Psoriasis, Atopic Dermatitis, etc.)
 * Uses constants for all string keys to prevent typos and enable refactoring
 */

import { useState, useCallback } from 'react'
import eventSystem from '../../../utils/EventSystem'
import { FILTER_OPTIONS, FILTER_KEYS } from '../../../constants/index'
import FilterComponent from '../shared/FilterComponent'
import FilterButton from '../shared/FilterButton'
import './ConditionFilter.css'

const ConditionFilter = () => {
  const [selected, setSelected] = useState(null)

  const handleFilterSelect = useCallback((value) => {
    const newValue = value === selected ? null : value
    setSelected(newValue)

    // Use FILTER_KEYS constant - never hardcode 'condition' string
    // Prevents typos: 'conditon', 'condtion', 'conidtion', etc.
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.CONDITION,  // Constant, not 'condition'
      value: newValue
    })
  }, [selected])

  return (
    <FilterComponent title="Condition">
      <div className="condition-filter-buttons">
        {Object.values(FILTER_OPTIONS.CONDITION).map((condition) => (
          <FilterButton
            key={condition}
            value={condition}
            isSelected={selected === condition}
            onClick={() => handleFilterSelect(condition)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default ConditionFilter
```

### Component File Structure

Every component follows this structure:

```javascript
/**
 * ComponentName.jsx
 *
 * Brief description of component purpose and responsibilities
 */

// ---------------------------------------------------------------------------
// IMPORTS
// ---------------------------------------------------------------------------

import { useState, useCallback } from 'react'
import eventSystem from '../../../utils/EventSystem'
import { CONSTANTS } from '../../../constants/index'
import './ComponentName.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const ComponentName = ({ prop1, prop2 }) => {
  // ---------------------------------------------------------------------------
  // HOOKS / STATE
  // ---------------------------------------------------------------------------

  const [state, setState] = useState(initialValue)

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleEvent = useCallback(() => {
    // Handler logic
  }, [dependencies])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  )
}

export default ComponentName
```

### Component Communication Rules

1. **Parent to Child:** Props
2. **Child to Parent:** Events (via EventSystem or callback props for local interactions)
3. **Sibling to Sibling:** Events via EventSystem
4. **Component to Manager:** Events via EventSystem
5. **Manager to Component:** Subscriptions via custom hooks

**Never:**
- Import managers directly in UI components (except in custom hooks)
- Pass manager instances as props
- Create circular dependencies

---

## File Organisation

### Directory Structure

```
/src
  /components          - Reusable UI components
    /carousel          - Carousel-specific components
      /ImageFrame      - Component folder with JSX + CSS
        ImageFrame.jsx
        ImageFrame.css
      /NavigationArrows
      /Shadow
      /DetailOverlay
    /filters           - Filter components
      /shared          - Shared filter components (FilterButton, FilterComponent)
      /ConditionFilter
      /AgeFilter
      /GenderFilter
    /layout            - Layout components (Header, Footer, ISIPanel)
    /common            - Truly shared components (Background, etc.)
    /animations        - Animation components

  /views               - Complex view components
    /MainView          - Main carousel view
    /Carousel3DScene   - R3F 3D scene view

  /pages               - Route/page components
    /IntroPage         - Landing page
    /MainPage          - Main application page

  /hooks               - Custom React hooks
    /carousel          - Carousel-specific hooks
      useCameraAnimation.js
      useCarouselManager.js
      useDragInteraction.js
    /common            - Shared hooks
      useManagerSubscription.js
      useEventSubscription.js
    /filters           - Filter-specific hooks (if needed)

  /managers            - State management singletons
    AppStateManager.js
    FilterManager.js
    DataManager.js
    ImageManager.js
    RotationStateManager.js
    PoolManager.js

  /utils               - Pure utility functions and classes
    EventSystem.js     - Event pub/sub system
    carouselHelpers.js - Pure calculation functions
    frameTextures.js   - Texture generation utilities

  /constants           - Configuration and constants
    index.js           - Main constants (filters, data sources, etc.)
    carousel.js        - Carousel-specific constants
    animations.js      - Animation timing/easing constants

  /assets              - Static assets (if not in /public)

  App.jsx              - Root application component
  App.css              - Global app styles
  main.jsx             - React entry point
  index.css            - Global CSS variables and resets
```

### File Naming Conventions

- **Components:** PascalCase (`FilterButton.jsx`, `MainView.jsx`)
- **Hooks:** camelCase with 'use' prefix (`useCarouselManager.js`, `useEventSubscription.js`)
- **Managers:** PascalCase with 'Manager' suffix (`FilterManager.js`, `AppStateManager.js`)
- **Utils:** camelCase (`carouselHelpers.js`, `frameTextures.js`)
- **Constants:** camelCase (`carousel.js`, `animations.js`)
- **Styles:** Match component name (`FilterButton.css`, `MainView.css`)

### Import Organisation

Order imports by category with blank lines between:

```javascript
// 1. React and third-party libraries
import { useState, useCallback, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

// 2. Local components
import FilterButton from '../shared/FilterButton'
import FilterComponent from '../shared/FilterComponent'

// 3. Hooks
import useCarouselManager from '../../hooks/carousel/useCarouselManager'
import useEventSubscription from '../../hooks/common/useEventSubscription'

// 4. Managers
import filterManager from '../../managers/FilterManager'
import appStateManager from '../../managers/AppStateManager'

// 5. Utils and helpers
import eventSystem from '../../utils/EventSystem'
import { getLayoutConfig } from '../../utils/carouselHelpers'

// 6. Constants
import { FILTER_OPTIONS, FILTER_KEYS } from '../../constants/index'
import { CAROUSEL_SETTINGS } from '../../constants/carousel'

// 7. Styles
import './FilterButton.css'
```

---

## Coding Standards

### General Principles

1. **Prefer readability over cleverness**
2. **Write code for humans first, computers second**
3. **Be explicit, not implicit**
4. **Favour composition over inheritance**
5. **Keep functions small and focused**
6. **Use early returns to reduce nesting**

### Function Length

- **Component render functions:** Keep under 100 lines (extract to sub-components)
- **Hook functions:** Keep under 150 lines (extract sub-hooks if complex)
- **Utility functions:** Keep under 50 lines (extract helper functions)
- **Event handlers:** Keep under 20 lines (extract logic to separate functions)

### Indentation & Formatting

- **Indentation:** 2 spaces (not tabs)
- **Line length:** Soft limit 100 characters, hard limit 120
- **Trailing commas:** Always use in multi-line arrays/objects
- **Semicolons:** Always use (except in JSX)
- **Quotes:** Single quotes for strings, double quotes in JSX

**Example:**
```javascript
const config = {
  rows: 3,
  columns: 10,
  imageSize: 1.2,
  settings: {
    fade: true,
    autoplay: false,
  },
}

const values = [
  'Plaque Psoriasis',
  'Atopic Dermatitis',
  'Seborrheic Dermatitis',
]
```

### Variable Declaration

- **Prefer `const`** - Use by default for all variables
- **Use `let`** - Only when value will be reassigned
- **Never use `var`** - Block scoping issues

```javascript
// ✅ Good
const imageCount = 42
let currentIndex = 0

// ❌ Bad
var imageCount = 42
```

### Object/Array Manipulation

**Prefer immutable operations:**

```javascript
// ✅ Good - Immutable
const newFilters = { ...filters, condition: 'Plaque Psoriasis' }
const newItems = [...items, newItem]

// ❌ Bad - Mutating
filters.condition = 'Plaque Psoriasis'
items.push(newItem)
```

**Exception:** Internal manager state can mutate (encapsulated):
```javascript
class FilterManager {
  setFilter(key, value) {
    this.filters[key] = value  // OK - internal state
    this.notifyListeners()
  }
}
```

### Destructuring

**Use destructuring for clarity:**

```javascript
// ✅ Good
const { imagePath, field, patient } = imageData
const { rows, columns, imageSize } = layoutConfig

// ❌ Bad
const imagePath = imageData.imagePath
const field = imageData.field
```

**But don't over-destructure:**

```javascript
// ❌ Over-destructured - hard to read
const {
  patient: {
    baselineImage,
    week1Image,
    condition,
    age
  }
} = data

// ✅ Better - clear origin
const { patient } = data
const { baselineImage, week1Image, condition, age } = patient
```

### Early Returns

**Reduce nesting with early returns:**

```javascript
// ✅ Good
function handleClick() {
  if (!isEnabled) return
  if (isLoading) return

  doSomething()
  doAnotherThing()
}

// ❌ Bad
function handleClick() {
  if (isEnabled) {
    if (!isLoading) {
      doSomething()
      doAnotherThing()
    }
  }
}
```

### Optional Chaining & Nullish Coalescing

**Use modern JS features:**

```javascript
// ✅ Good
const imagePath = patient?.baselineImage ?? '/default.jpg'
const count = data?.images?.length ?? 0

// ❌ Bad
const imagePath = patient && patient.baselineImage
  ? patient.baselineImage
  : '/default.jpg'
```

### Error Handling

**Fail gracefully with user-friendly messages:**

```javascript
try {
  await imageManager.preloadThumbnails()
} catch (error) {
  console.error('Failed to initialise app:', error)
  // Show user-friendly error UI
}
```

**Manager event handlers - always try/catch:**

```javascript
notifyListeners() {
  this.listeners.forEach(cb => {
    try {
      cb(this.state)
    } catch (e) {
      console.error('FilterManager:', e)
    }
  })
}
```

---

## Comment Style

### Philosophy

**Comments should explain WHY, not WHAT.**

Code should be self-documenting through clear naming. Comments are for:
1. **Non-obvious decisions** - Why this approach over alternatives
2. **Gotchas and edge cases** - Things that might trip up future developers
3. **Complex algorithms** - High-level explanation of what's happening
4. **API contracts** - What parameters mean, what function returns

**Never:**
- State the obvious (`i++  // increment i`)
- Repeat what code says (`const x = 5  // set x to 5`)
- Write essays - keep comments concise

### Comment Blocks

**File header comments:**
```javascript
/**
 * ComponentName.jsx
 *
 * Brief description of purpose and responsibilities
 * One or two sentences maximum
 */
```

**Section dividers (sparse use only):**
```javascript
// ---------------------------------------------------------------------------
// SECTION NAME
// ---------------------------------------------------------------------------
```

**Use sparingly** - only for major sections in long files (100+ lines). Don't over-section.

**Function/method comments (only when needed):**
```javascript
/**
 * Calculate visibility and opacity based on angle from viewer
 * Slots directly in front are fully visible, sides fade out
 *
 * angleFromCentre - Angle in radians from viewer's centre
 * Returns { opacity, darkOverlay, visible }
 */
function calculateVisibility(angleFromCentre) {
  // Implementation
}
```

**Inline comments (rare):**
```javascript
// Skip update if centre column hasn't changed (optimization)
if (this.lastCentreColumn === centreColumn) return

// Wrap column index for infinite scroll
const wrappedColumn = wrapIndex(virtualColumn, totalImageColumns)
```

### What NOT to Comment

```javascript
// ❌ Don't state the obvious
const count = images.length  // Get the length of images array

// ❌ Don't repeat code
setSelected(newValue)  // Set selected to newValue

// ❌ Don't narrate code flow
// First we check if texture exists
if (!texture) {
  // Then we log a warning
  console.warn('Texture not found')
  // Then we return
  return
}
```

### Good Comment Examples

```javascript
// ✅ Explains WHY and edge cases
// Use counter instead of index for accurate progress tracking
// Images load asynchronously, so completion order != array order
let loadedCount = 0
const loadPromises = images.map(img =>
  loadImage(img).then(() => {
    loadedCount++
    progress = (loadedCount / total) * 100
  })
)

// ✅ Explains non-obvious decision
// Debounce dragging flag to allow event order to settle
// Click handlers check isDragging synchronously
setTimeout(() => { clickRef.current.isDragging = false }, 50)

// ✅ Documents gotcha
// IMPORTANT: Don't include selector in deps array
// Inline functions create new references every render
useEffect(() => {
  const unsubscribe = manager.subscribe(update)
  return unsubscribe
}, [manager])  // NOT [manager, selector]
```

### JSX Comments

**Use sparingly** - JSX should be self-explanatory through component names.

When needed, explain purpose, not implementation:

```javascript
{/* Invisible interaction plane for drag capture */}
<mesh onPointerDown={onPointerDown}>
  <planeGeometry args={[50, 30]} />
  <meshBasicMaterial transparent opacity={0} />
</mesh>

{/* Show loading state only when images haven't preloaded */}
{!isReady && <LoadingSpinner />}
```

---

## Naming Conventions

### UK English Always

- `colour` not `color`
- `centre` not `center`
- `initialise` not `initialize`
- `synchronise` not `synchronize`
- `organisation` not `organization`

**Apply everywhere:**
- Variable names: `backgroundColour`, `centreColumn`
- Function names: `initialiseCarousel`, `synchroniseState`
- Comments: "The carousel is centred vertically"
- CSS classes: `.filter-panel-colour`

### Variables

**Use descriptive names:**
```javascript
// ✅ Good
const filteredPatients = getFilteredPatients()
const carouselRotation = rotationStateManager.getRotation()
const isFilterActive = filterManager.hasActiveFilters()

// ❌ Bad
const fp = getFilteredPatients()
const rot = rotationStateManager.getRotation()
const active = filterManager.hasActiveFilters()
```

**Boolean variables - use `is`, `has`, `can`, `should`:**
```javascript
const isLoading = true
const hasActiveFilters = false
const canInteract = rotationStateManager.canInteract()
const shouldFadeIn = !isInitialLoad
```

**Arrays - use plural nouns:**
```javascript
const patients = []
const images = []
const activeSlots = []
```

**Numbers/counts - prefix with `count` or `num` when ambiguous:**
```javascript
const imageCount = 42
const totalColumns = 10
const rows = 3  // Clear from context
```

### Functions

**Use verb-noun pattern:**
```javascript
// ✅ Good
getFilteredImages()
setRotation()
handleFilterSelected()
calculateCylinderPosition()
initialisePoo()

// ❌ Bad
images()
rotation()
filterSelect()
cylinderPos()
pool()
```

**Event handlers - prefix with `handle`:**
```javascript
handleClick()
handleFilterSelected()
handlePointerDown()
handleNavigationRequested()
```

**Getters - prefix with `get`:**
```javascript
getFilters()
getRotation()
getActiveSlots()
```

**Setters - prefix with `set`:**
```javascript
setFilter(key, value)
setRotation(value)
setColumnAngle(angle)
```

**Boolean functions - prefix with `is`, `has`, `can`, `should`:**
```javascript
isReady()
hasActiveFilters()
canInteract()
shouldUpdate()
```

### React Components

**PascalCase for all components:**
```javascript
const FilterButton = () => { }
const MainView = () => { }
const Carousel3DScene = () => { }
```

**Custom hooks - camelCase with `use` prefix:**
```javascript
useCarouselManager()
useManagerSubscription()
useDragInteraction()
```

### CSS Classes

**kebab-case, BEM-style naming:**

```css
/* Component */
.filter-button { }

/* Element */
.filter-button__icon { }

/* Modifier */
.filter-button--selected { }

/* State */
.filter-button.is-disabled { }
```

**Avoid:**
- Generic names: `.button`, `.container`, `.text`
- CamelCase: `.filterButton`
- Underscores: `.filter_button`

### Constants

**SCREAMING_SNAKE_CASE for true constants:**

```javascript
export const CAROUSEL_SETTINGS = {
  DRAG_SENSITIVITY: 0.005,
  POOL_BUFFER: 2,
  SNAP_DURATION: 0.4,
}

export const FILTER_KEYS = {
  CONDITION: 'condition',
  AGE: 'age',
}
```

**PascalCase for constant objects/enums:**

```javascript
export const FilterOptions = {
  Condition: {
    PlaquePsoriasis: 'Plaque Psoriasis',
    AtopicDermatitis: 'Atopic Dermatitis',
  }
}
```

---

## Constants & Configuration

### Centralised Configuration

**ALL configuration values live in `/src/constants/`:**

```
/constants
  index.js          - Main constants (filters, data sources, app states)
  carousel.js       - Carousel-specific config (layout, settings, visibility)
  animations.js     - Animation timing and easing values
```

### No Magic Numbers or String Literals

**Never hardcode values OR string keys in components:**

```javascript
// ❌ Bad - Magic numbers
const imageSize = 1.2
const fadeTime = 0.3
const poolBuffer = 2

// ❌ Bad - Magic strings (typo risk!)
eventSystem.emit(EVENTS.FILTER_SELECTED, {
  filterType: 'condition',  // What if you typo 'conditon' or 'codition'?
  value: value
})

// ✅ Good - Named constants
const imageSize = CAROUSEL_SETTINGS.imageSizeBase
const fadeTime = CAROUSEL_SETTINGS.transitionFadeDuration
const poolBuffer = CAROUSEL_SETTINGS.poolBuffer

// ✅ Good - Constant keys (IDE autocomplete, compile-time safety)
import { FILTER_KEYS } from '../constants/index'

eventSystem.emit(EVENTS.FILTER_SELECTED, {
  filterType: FILTER_KEYS.CONDITION,  // Typo impossible, refactor-safe
  value: value
})
```

**Why constants for string keys:**
- **Typo prevention:** `'condition'` vs `'conditon'` - runtime bug, hard to spot
- **IDE autocomplete:** Type `FILTER_KEYS.` and see all options
- **Refactor safety:** Rename in one place, updates everywhere
- **Type checking:** Can add TypeScript types to constants
- **Discoverability:** New developers can find all valid keys in constants file

### String Literal Rule

**NEVER use string literals for keys, identifiers, or enum-like values.**

**Bad examples (runtime typo risk):**
```javascript
// ❌ Event emission with string literal
eventSystem.emit(EVENTS.FILTER_SELECTED, {
  filterType: 'condition',  // Could typo: 'conditon', 'conidtion'
  value: value
})

// ❌ State lookup with string literal
const filter = filters['condition']  // Typo risk

// ❌ Conditional with string literal
if (imageField === 'baselineImage') { }  // Could typo: 'baselneImage'

// ❌ CSS class with string literal
className={`filter-${type}`}  // If type is 'condition' string literal
```

**Good examples (constants, compile-time safety):**
```javascript
// ✅ Event emission with constant
import { FILTER_KEYS } from '../constants/index'

eventSystem.emit(EVENTS.FILTER_SELECTED, {
  filterType: FILTER_KEYS.CONDITION,  // IDE autocomplete, no typos
  value: value
})

// ✅ State lookup with constant
const filter = filters[FILTER_KEYS.CONDITION]

// ✅ Conditional with constant
import { PATIENT_SCHEMA } from '../constants/index'

if (imageField === PATIENT_SCHEMA.BASELINE_IMAGE) { }

// ✅ CSS class with constant
import { CSS_CLASSES } from '../constants/styles'

className={CSS_CLASSES.FILTER_BUTTON}
```

**Exceptions (acceptable string literals):**
- UI text: `<h1>Welcome</h1>` (user-facing content)
- CSS properties: `color: 'red'` (standard CSS values)
- URLs: `fetch('/api/data')` (external addresses)
- File paths: `import Logo from './logo.svg'`

**Everything else uses constants:**
- Object keys
- Event names
- Filter types
- Enum values
- State identifiers
- Route paths
- Field names

### Constants File Structure

**`/constants/index.js`** - Main application constants:

```javascript
/**
 * index.js
 *
 * Central constants file for the application
 * Single source of truth for configuration values
 */

// Patient data schema
export const PATIENT_SCHEMA = {
  REFERENCE_ID: 'referenceId',
  PAGE_NUMBER: 'pageNumber',
  // ...
}

// Filter options (displayed in UI)
export const FILTER_OPTIONS = {
  CONDITION: {
    PLAQUE_PSORIASIS: 'Plaque Psoriasis',
    ATOPIC_DERMATITIS: 'Atopic Dermatitis',
  },
  // ...
}

// Filter keys (for manager state)
export const FILTER_KEYS = {
  CONDITION: 'condition',
  FORMULATION: 'formulation',
  // ...
}

// Data sources
export const DATA_SOURCE = {
  CLINICAL_TRIAL: 'Clinical Trial',
  PRACTICE_BASED: 'Practice-Based',
}

// Asset paths
export const ASSETS = {
  BACKGROUNDS: {
    CLINICAL_TRIAL: '/UI/bkgd-ct.jpg',
    PRACTICE_BASED: '/UI/bkgd-pb.jpg',
  },
  ICONS: {
    MALE: '/UI/icon-male.svg',
    FEMALE: '/UI/icon-female.svg',
  },
  DATA: {
    PATIENT_DATA: '/data/patient_data.json',
  },
}

// App states
export const APP_STATE = {
  LOADING: 'loading',
  INTRO: 'intro',
  MAIN: 'main',
}

// Routes
export const ROUTES = {
  INTRO: '/',
  MAIN: '/main',
}
```

**`/constants/carousel.js`** - Domain-specific constants:

```javascript
/**
 * carousel.js
 *
 * Carousel layout, settings, and visibility configuration
 */

export const CAROUSEL_LAYOUT = {
  SMALL: {
    minImages: 0,
    rows: 1,
    visibleColumns: 6,
  },
  MEDIUM: {
    minImages: 20,
    rows: 2,
    visibleColumns: 8,
  },
  LARGE: {
    minImages: 40,
    rows: 3,
    visibleColumns: 10,
  },
}

export const CAROUSEL_SETTINGS = {
  imageSizeBase: 1.4,
  imageSizeRowReduction: 0.1,
  cylinderRadius: {
    1: 3.0,
    2: 2.5,
    3: 2.2,
  },
  dragSensitivity: 0.005,
  snapDuration: 0.4,
  transitionFadeDuration: 0.3,
  poolBuffer: 2,
}

export const CAROUSEL_VISIBILITY = {
  fullOpacityAngle: Math.PI * 0.25,
  zeroOpacityAngle: Math.PI * 0.5,
  darkStartAngle: Math.PI * 0.3,
  cutoffAngle: Math.PI * 0.6,
  maxDarkOverlay: 0.7,
}
```

### Using Constants

**Import and use explicitly:**

```javascript
import { FILTER_KEYS, FILTER_OPTIONS } from '../../constants/index'
import { CAROUSEL_SETTINGS } from '../../constants/carousel'

// Use in code
eventSystem.emit(EVENTS.FILTER_SELECTED, {
  filterType: FILTER_KEYS.CONDITION,
  value: FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS
})

const fadeTime = CAROUSEL_SETTINGS.transitionFadeDuration
```

---

## State Management

### State Ownership Rules

1. **UI state** (selected button, open panel, hover state) → Component `useState`
2. **Form state** (input values, validation) → Component `useState` or form library
3. **Derived state** (filtered lists, calculations) → `useMemo` or compute in render
4. **Application state** (filters, data source, app phase) → Managers
5. **Animation state** (rotation, position, tween progress) → Managers or `useFrame`

### When to Use useState

**Local UI state only:**

```javascript
const FilterButton = ({ value, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)  // ✅ Local UI state

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value}
    </button>
  )
}
```

**Not for shared state:**

```javascript
// ❌ Bad - Should be in manager
const FilterPanel = () => {
  const [activeFilters, setActiveFilters] = useState({})

  // This state should live in FilterManager
}

// ✅ Good - Read from manager
const FilterPanel = () => {
  const filters = filterManager.getFilters()
}
```

### When to Use useMemo

**Expensive calculations:**

```javascript
const slots = useMemo(() =>
  activeSlots.map(slot => ({
    ...slot,
    visibility: calculateVisibility(slot.angle),
    position: calculateCylinderPosition(slot.column, slot.row, config)
  })),
  [activeSlots, config]
)
```

**Derived data:**

```javascript
const filteredImages = useMemo(() =>
  images.filter(img => img.condition === selectedCondition),
  [images, selectedCondition]
)
```

**Not for simple operations:**

```javascript
// ❌ Unnecessary - simple calculation
const total = useMemo(() => a + b, [a, b])

// ✅ Just compute it
const total = a + b
```

### When to Use useCallback

**Event handlers passed to child components:**

```javascript
const Parent = () => {
  const handleClick = useCallback((id) => {
    eventSystem.emit(EVENTS.ITEM_SELECTED, { id })
  }, [])

  return <Child onClick={handleClick} />
}
```

**Dependencies in other hooks:**

```javascript
const initCarousel = useCallback(() => {
  // Complex initialisation logic
}, [containerRef])

useEffect(() => {
  initCarousel()
}, [initCarousel])  // Stable reference prevents re-runs
```

**Not for every function:**

```javascript
// ❌ Unnecessary - not passed to child or used in deps
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])

// ✅ Just define it
const handleClick = () => {
  console.log('clicked')
}
```

### Subscription Pattern

**For manager state:**

```javascript
// Manager provides subscribe method
class RotationStateManager {
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  setRotation(value) {
    this.rotation = value
    this.notifyListeners()
  }
}

// Component subscribes via hook
const rotation = useManagerSubscription(
  rotationStateManager,
  (mgr) => mgr.getRotation()
)
```

### Prevent Infinite Loops

**Common pitfall - unstable dependencies:**

```javascript
// ❌ Infinite loop - getThumbnailPath recreated every render
const { layoutConfig } = useCarouselManager(
  containerRef,
  (path) => `/thumbs/${path}`  // New function every render!
)

// ✅ Stable reference
const getThumbnailPath = useCallback(
  (path) => `/thumbs/${path}`,
  []
)
const { layoutConfig } = useCarouselManager(containerRef, getThumbnailPath)

// ✅ Even better - remove parameter entirely if possible
const { layoutConfig } = useCarouselManager(containerRef)
```

**Initialisation guards:**

```javascript
// ✅ Run once on mount
const isInitialisedRef = useRef(false)

useEffect(() => {
  if (!isInitialisedRef.current) {
    isInitialisedRef.current = true
    initialiseApp()
  }
}, [])
```

---

## React-Specific Patterns

### Prop Destructuring

**Destructure in function signature for clarity:**

```javascript
// ✅ Good - Clear what props are expected
const ImageFrame = ({
  imageData,
  position,
  visibility,
  imageSize,
  onClickRef
}) => {
  // ...
}

// ❌ Bad - Have to read body to see what props exist
const ImageFrame = (props) => {
  const { imageData, position, visibility } = props
  // ...
}
```

### Children Pattern

**Use children for flexible composition:**

```javascript
const FilterComponent = ({ title, children }) => {
  return (
    <div className="filter-component">
      <h3>{title}</h3>
      <div className="filter-component__content">
        {children}
      </div>
    </div>
  )
}

// Usage
<FilterComponent title="Condition">
  <FilterButton value="Plaque Psoriasis" />
  <FilterButton value="Atopic Dermatitis" />
</FilterComponent>
```

### Conditional Rendering

**Use early returns for entire component:**

```javascript
const ImageFrame = ({ imageData, visibility }) => {
  if (!visibility.visible) return null

  return (
    <Billboard>
      {/* Complex JSX */}
    </Billboard>
  )
}
```

**Use && for optional elements:**

```javascript
{imageCount > 0 && <Carousel />}
{isLoading && <Spinner />}
{error && <ErrorMessage text={error} />}
```

**Use ternary for either/or:**

```javascript
{isLoading ? <Spinner /> : <Content />}
```

**Avoid complex ternary nesting:**

```javascript
// ❌ Hard to read
{isLoading ? <Spinner /> : hasError ? <Error /> : hasData ? <Content /> : <Empty />}

// ✅ Extract to variable or separate component
const renderContent = () => {
  if (isLoading) return <Spinner />
  if (hasError) return <Error />
  if (hasData) return <Content />
  return <Empty />
}

return <div>{renderContent()}</div>
```

### List Rendering

**Always provide stable keys:**

```javascript
// ✅ Good - Stable unique key
{slots.map(slot => (
  <ImageFrame
    key={slot.slotId}  // "slot-0-0", "slot-1-2", etc.
    imageData={slot.imageData}
  />
))}

// ❌ Bad - Index as key (can cause bugs with reordering)
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ❌ Bad - Non-unique key
{items.map(item => (
  <div key={item.type}>{item.value}</div>
))}
```

### useEffect Rules

**Dependency arrays - be explicit:**

```javascript
// ✅ All dependencies listed
useEffect(() => {
  doSomething(value, config)
}, [value, config])

// ❌ Missing dependencies (ESLint will warn)
useEffect(() => {
  doSomething(value, config)
}, [value])  // Missing config!

// ✅ Intentionally empty - run once on mount
useEffect(() => {
  initialise()
}, [])

// ❌ Don't disable ESLint without good reason
useEffect(() => {
  doSomething(value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])  // Why is value missing? Is this intentional?
```

**Cleanup functions:**

```javascript
// ✅ Always clean up subscriptions
useEffect(() => {
  const unsubscribe = manager.subscribe(callback)
  return unsubscribe  // Cleanup on unmount
}, [])

// ✅ Clean up timers
useEffect(() => {
  const timer = setInterval(update, 100)
  return () => clearInterval(timer)
}, [])

// ✅ Clean up event listeners
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

### Refs

**Use refs for:**
- DOM element references
- Storing mutable values that don't trigger re-renders
- Tracking previous values
- Animation frame IDs
- Flag guards (isInitialised, isDragging)

```javascript
// ✅ DOM reference
const containerRef = useRef(null)
<div ref={containerRef}>

// ✅ Mutable value (doesn't cause re-render)
const dragRef = useRef({ active: false, startX: 0 })
dragRef.current.active = true  // OK - won't re-render

// ✅ Initialisation guard
const isInitialisedRef = useRef(false)
if (!isInitialisedRef.current) {
  isInitialisedRef.current = true
  initialise()
}

// ❌ Don't use ref when you need re-renders
const countRef = useRef(0)
countRef.current++  // Component won't re-render!

// ✅ Use state instead
const [count, setCount] = useState(0)
setCount(count + 1)  // Triggers re-render
```

---

## Performance Patterns

### Image Preloading

**Preload all thumbnails during app initialisation:**

```javascript
// ImageManager - Preload all thumbnails
class ImageManager {
  async preloadThumbnails() {
    const allImagePaths = this.getAllImagePaths()
    const totalImages = allImagePaths.length
    let loadedCount = 0

    // Load in parallel - browser throttles automatically
    const loadPromises = allImagePaths.map(imagePath =>
      this.loadThumbnail(imagePath)
        .then(() => {
          loadedCount++
          this.preloadProgress = (loadedCount / totalImages) * 100
        })
        .catch(error => {
          console.warn(`Failed to load thumbnail: ${imagePath}`, error)
          loadedCount++  // Count failures too for accurate progress
          this.preloadProgress = (loadedCount / totalImages) * 100
        })
    )

    await Promise.all(loadPromises)
    this.isPreloaded = true
    eventSystem.emit(EVENTS.IMAGES_READY)
  }

  getThumbnail(imagePath) {
    return this.thumbnails.get(imagePath) || null
  }
}

// Component - Instant texture lookup
const ImageFrame = ({ imageData }) => {
  const { imagePath } = imageData

  // useMemo ensures texture updates when imagePath changes
  const texture = useMemo(
    () => imageManager.getThumbnail(imagePath),
    [imagePath]
  )

  return (
    <mesh>
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
```

**Key principle:** Load upfront, lookup instantly.

### Object Pooling

**Reuse objects instead of creating/destroying:**

```javascript
class PoolManager {
  initialisePool(layoutConfig, imageData, initialRotation) {
    const { rows, visibleColumns } = layoutConfig
    const totalSlots = visibleColumns + CAROUSEL_SETTINGS.poolBuffer * 2

    // Create pool once
    this.pool = []
    for (let col = 0; col < totalSlots; col++) {
      for (let row = 0; row < rows; row++) {
        this.pool.push({
          slotId: `slot-${col}-${row}`,  // Stable key
          slotColumn: col,
          rowIndex: row,
          virtualColumn: col,
          imageData: null,
          isActive: true
        })
      }
    }

    this.updatePoolAssignments(initialRotation)
  }

  updatePoolAssignments(currentRotation) {
    // Reuse existing slot objects - just reassign imageData
    this.pool.forEach((slot, index) => {
      const slotCol = Math.floor(index / rows)
      const rowIndex = index % rows
      const virtualColumn = startColumn + slotCol

      slot.virtualColumn = virtualColumn
      slot.rowIndex = rowIndex

      const imageIndex = wrapIndex(virtualColumn * rows + rowIndex, this.imageData.length)
      slot.imageData = this.imageData[imageIndex]  // Reassign data
    })

    this.notifyListeners()
  }
}
```

**Component uses stable keys:**

```javascript
{slots.map(slot => (
  <ImageFrame
    key={slot.slotId}  // "slot-0-0" - NEVER changes
    imageData={slot.imageData}  // DOES change - React updates props
    position={slot.position}
  />
))}
```

**Benefits:**
- No component unmount/remount (expensive in R3F)
- React just updates props on existing components
- Stable keys prevent reconciliation issues

### useMemo for Expensive Calculations

**Only memoize genuinely expensive operations:**

```javascript
// ✅ Worth memoizing - loops through all slots, multiple calculations
const slots = useMemo(() =>
  activeSlots.map(slot => {
    const angleFromCentre = getAngleFromCentre(
      slot.virtualColumn,
      rotation,
      layoutConfig.columnAngle
    )
    const visibility = calculateVisibility(angleFromCentre)
    const position = calculateCylinderPosition(
      slot.virtualColumn,
      slot.rowIndex,
      layoutConfig
    )

    return { ...slot, visibility, position }
  }),
  [activeSlots, rotation, layoutConfig]
)

// ❌ Not worth memoizing - simple calculation
const total = useMemo(() => count * 2, [count])

// ✅ Just compute it
const total = count * 2
```

### Subscription Pattern vs Props

**High-frequency updates - use subscriptions:**

```javascript
// ✅ Subscription - component updates only when rotation changes
const rotation = useManagerSubscription(
  rotationStateManager,
  (mgr) => mgr.getRotation()
)

<group rotation={[0, -rotation, 0]}>
  {/* Children don't re-render unless their props change */}
</group>
```

**Low-frequency updates - props are fine:**

```javascript
// ✅ Props - layoutConfig rarely changes
const MainView = () => {
  const { layoutConfig } = useCarouselManager()

  return <Carousel3DScene layoutConfig={layoutConfig} />
}
```

### Avoid Unnecessary Re-renders

**React.memo for expensive components:**

```javascript
// Only re-render if props actually changed
const ExpensiveComponent = React.memo(({ data, config }) => {
  // Complex render logic
})
```

**Custom comparison:**

```javascript
const ImageFrame = React.memo(
  ({ imageData, position, visibility }) => {
    // Render
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return (
      prevProps.imageData === nextProps.imageData &&
      prevProps.position === nextProps.position &&
      prevProps.visibility === nextProps.visibility
    )
  }
)
```

**Don't overuse memo:**

```javascript
// ❌ Unnecessary - simple component
const Button = React.memo(({ label }) => <button>{label}</button>)

// ✅ memo adds overhead - not worth it for simple components
const Button = ({ label }) => <button>{label}</button>
```

---

## Testing Strategy

### Testing Philosophy

**Test behaviour, not implementation.**

Don't test:
- Internal state
- Private methods
- Implementation details

Do test:
- User interactions produce correct events
- Managers respond correctly to events
- State updates trigger correct renders
- Edge cases and error states

### Unit Testing Managers

**Test event handlers and state updates:**

```javascript
describe('FilterManager', () => {
  beforeEach(() => {
    filterManager.reset()
  })

  it('should update filter state when FILTER_SELECTED event is emitted', () => {
    // Emit event
    eventSystem.emit(EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.CONDITION,
      value: FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS
    })

    // Check state updated
    const filters = filterManager.getFilters()
    expect(filters.condition).toBe(FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS)
  })

  it('should emit FILTER_CHANGED when filter value changes', (done) => {
    // Listen for emitted event
    eventSystem.on(EVENTS.FILTER_CHANGED, ({ filterType, value }) => {
      expect(filterType).toBe(FILTER_KEYS.CONDITION)
      expect(value).toBe(FILTER_OPTIONS.CONDITION.ATOPIC_DERMATITIS)
      done()
    })

    // Trigger change
    eventSystem.emit(EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.CONDITION,
      value: FILTER_OPTIONS.CONDITION.ATOPIC_DERMATITIS
    })
  })

  it('should not emit FILTER_CHANGED if value unchanged', () => {
    const spy = jest.fn()
    eventSystem.on(EVENTS.FILTER_CHANGED, spy)

    // Set same value twice
    eventSystem.emit(EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.AGE,
      value: '19-30'
    })
    eventSystem.emit(EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.AGE,
      value: '19-30'
    })

    // Should only emit once
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
```

### Component Testing

**Test event emission:**

```javascript
import { FILTER_KEYS, FILTER_OPTIONS } from '../constants/index'

describe('FilterButton', () => {
  it('should emit FILTER_SELECTED event when clicked', () => {
    const spy = jest.fn()
    eventSystem.on(EVENTS.FILTER_SELECTED, spy)

    const { getByText } = render(
      <FilterButton
        value={FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS}
        filterKey={FILTER_KEYS.CONDITION}
      />
    )

    fireEvent.click(getByText('Plaque Psoriasis'))

    expect(spy).toHaveBeenCalledWith({
      filterType: FILTER_KEYS.CONDITION,  // Use constant in test too!
      value: FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS
    })
  })
})
```

### Integration Testing

**Test event flow from component → manager → component:**

```javascript
describe('Filter integration', () => {
  it('should update carousel when filter changes', async () => {
    const { getByText, findByText } = render(<App />)

    // Click filter button
    fireEvent.click(getByText('Plaque Psoriasis'))

    // Check carousel updated
    await waitFor(() => {
      expect(findByText('Filtered: 42 patients')).toBeInTheDocument()
    })
  })
})
```

---

## Summary Checklist

When building a new feature or reviewing code, ensure:

### Architecture
- [ ] Zero tight coupling - components emit events, don't call managers
- [ ] Event-driven - user interactions trigger events, managers respond
- [ ] Single responsibility - each module has one clear purpose
- [ ] Modular - small, focused, reusable units

### Code Quality
- [ ] UK English everywhere (colour, centre, initialise)
- [ ] Self-documenting code - clear names, minimal comments
- [ ] No magic numbers - use named constants
- [ ] **No magic strings** - use constants for all keys (FILTER_KEYS, event names, etc.)
- [ ] Early returns - reduce nesting
- [ ] Immutable operations - spread operators, not mutations (except in managers)

### React Patterns
- [ ] Custom hooks for complex logic, not simple wrappers
- [ ] useCallback for stable references in deps
- [ ] useMemo for expensive calculations only
- [ ] Stable keys in list rendering
- [ ] Cleanup in useEffect (subscriptions, timers, listeners)

### Performance
- [ ] Preload resources during initialisation
- [ ] Object pooling for reusable entities
- [ ] Subscriptions for high-frequency updates
- [ ] Memoisation only when measurably beneficial

### File Organisation
- [ ] Components in `/components` by domain
- [ ] Managers in `/managers` (singletons)
- [ ] Hooks in `/hooks` by domain
- [ ] Constants in `/constants`
- [ ] Utils are pure functions only

### Testing
- [ ] Test behaviour, not implementation
- [ ] Test event flows
- [ ] Test edge cases and error states
- [ ] Integration tests for critical user flows

---

## Conclusion

This blueprint defines a **clean, decoupled, event-driven architecture** that prioritises:

1. **Maintainability** - Clear structure, single responsibilities, minimal dependencies
2. **Testability** - Event-driven design makes isolation testing trivial
3. **Scalability** - Easy to add new features without breaking existing code
4. **Readability** - Self-documenting code with consistent patterns
5. **Performance** - Strategic optimisations where they matter

Apply these patterns consistently across your codebase for a robust, professional application architecture.

---

**Document Version:** 1.0
**Last Updated:** 2026-02-04
**Author:** Architecture extracted from Zoryve Body of Evidence project
