/**
 * animations.js
 *
 * Framer Motion animation constants and presets
 * Provides reusable animation configs for fade, slide, scale, and interactive animations
 * Used throughout the app for consistent animation behavior
 */

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION STATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Animation state definitions for Framer Motion
 * Each animation has 'initial' and 'animate' states defining start and end values
 */
export const ANIMATIONS = {
  // Common hover/tap interactions
  HOVER_SCALE: { scale: 1.02 },
  TAP_SCALE: { scale: 0.98 },
  
  // Fade animations
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  
  FADE_OUT: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
  },
  
  // Slide animations
  SLIDE_UP: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  
  SLIDE_DOWN: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  
  SLIDE_LEFT: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  
  SLIDE_RIGHT: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  
  // Scale animations
  SCALE_IN: {
    initial: { scale: 0 },
    animate: { scale: 1 },
  },
  
  // Combined animations
  FADE_SLIDE_UP: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITION PRESETS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Framer Motion transition configurations
 * Controls duration, easing, and spring physics for animations
 */
export const TRANSITIONS = {
  // Standard transitions
  FAST: { duration: 0.2 },
  NORMAL: { duration: 0.3 },
  SLOW: { duration: 0.6 },
  
  // Easing presets
  EASE_IN_OUT: { ease: [0.25, 0.1, 0.25, 1] },
  EASE_OUT: { ease: 'easeOut' },
  EASE_IN: { ease: 'easeIn' },
  EASE_IN_OUT_SMOOTH: { ease: 'easeInOut' },
  
  // Spring animations
  SPRING: {
    type: "spring",
    stiffness: 500,
    damping: 30,
  },
  
  // Combined transitions
  SLOW_EASE: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1],
  },
  
  NORMAL_EASE: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1],
  },
  
  FADE_SLOW: {
    duration: 0.6,
    ease: 'power2.inOut',
  },
  
  FADE_NORMAL: {
    duration: 0.4,
    ease: 'power2.inOut',
  },
  
  FADE_FAST: {
    duration: 0.3,
    ease: 'power2.inOut',
  },
  
  // With delays
  DELAYED: (delay = 0.3) => ({
    delay,
    duration: 0.6,
  }),
  
  DELAYED_NORMAL: (delay = 0.3) => ({
    delay,
    duration: 0.3,
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION PROPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pre-configured animation prop bundles for common use cases
 * Combine animation states with transitions for easy component usage
 * Can be spread directly onto motion components: {...ANIMATION_PROPS.INTERACTIVE}
 */
export const ANIMATION_PROPS = {
  // Interactive button/clickable
  INTERACTIVE: {
    whileHover: ANIMATIONS.HOVER_SCALE,
    whileTap: ANIMATIONS.TAP_SCALE,
  },
  
  // Fade in on mount
  FADE_IN_MOUNT: {
    ...ANIMATIONS.FADE_IN,
    transition: TRANSITIONS.NORMAL,
  },
  
  // Slide up on mount
  SLIDE_UP_MOUNT: {
    ...ANIMATIONS.SLIDE_UP,
    transition: TRANSITIONS.NORMAL,
  },
  
  // Scale in (for checkmarks, etc)
  SCALE_IN_SPRING: {
    ...ANIMATIONS.SCALE_IN,
    transition: TRANSITIONS.SPRING,
  },
}
