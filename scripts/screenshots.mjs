/**
 * scripts/screenshots.mjs
 *
 * Automated screenshot capture using Playwright.
 * 1. Clicks each filter option, waits, screenshots, unclicks
 * 2. Navigates each debug route, waits, screenshots
 *
 * Usage:
 *   1. Start the dev server:  npm run dev
 *   2. Run this script:       node scripts/screenshots.mjs
 *
 * Options:
 *   --base-url=http://localhost:5173   (default)
 *   --output=./screenshots             (default)
 *   --delay=1500                       (ms to wait before each screenshot, default 1500)
 *   --filters-only                     (skip debug routes, references, and intro)
 *   --debug-only                       (skip filter screenshots, references, and intro)
 *   --references-only                  (skip filters, debug routes, and intro)
 *   --intro-only                       (skip filters, debug routes, and references)
 *   --resume                           (skip files that already exist)
 */

import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  })
)

const BASE_URL = args['base-url'] || 'http://localhost:3000'
const OUTPUT_DIR = resolve(args['output'] || './screenshots')
const DELAY = parseInt(args['delay'] || '1500', 10)
const SKIP_FILTERS = args['debug-only'] === true || args['references-only'] === true || args['intro-only'] === true
const SKIP_DEBUG = args['filters-only'] === true || args['references-only'] === true || args['intro-only'] === true
const SKIP_REFERENCES = args['filters-only'] === true || args['debug-only'] === true || args['intro-only'] === true
const SKIP_INTRO = args['filters-only'] === true || args['debug-only'] === true || args['references-only'] === true
const RESUME = args['resume'] === true

// All filter options — group name, button text, filename slug
const FILTER_OPTIONS = [
  // Condition
  { group: 'condition', text: 'Plaque Psoriasis', file: 'plaque-psoriasis' },
  { group: 'condition', text: 'Atopic Dermatitis', file: 'atopic-dermatitis' },
  { group: 'condition', text: 'Seborrheic Dermatitis', file: 'seborrheic-dermatitis' },
  // Formulation
  { group: 'formulation', text: '0.05% Cream', file: '0-05-cream' },
  { group: 'formulation', text: '0.15% Cream', file: '0-15-cream' },
  { group: 'formulation', text: '0.3% Cream', file: '0-3-cream' },
  { group: 'formulation', text: '0.3% Foam', file: '0-3-foam' },
  // Body Area
  { group: 'bodyArea', text: 'Head and neck', file: 'head-and-neck' },
  { group: 'bodyArea', text: 'Torso', file: 'torso' },
  { group: 'bodyArea', text: 'Arms and hands', file: 'arms-and-hands' },
  { group: 'bodyArea', text: 'Glute, legs and feet', file: 'glute-legs-and-feet' },
  { group: 'bodyArea', text: 'Multiple body parts', file: 'multiple-body-parts' },
  // Baseline Severity
  { group: 'severity', text: 'Mild', file: 'mild' },
  { group: 'severity', text: 'Moderate', file: 'moderate' },
  { group: 'severity', text: 'Severe', file: 'severe' },
  // Age
  { group: 'age', text: '2-5', file: 'age-2-5' },
  { group: 'age', text: '6-8', file: 'age-6-8' },
  { group: 'age', text: '9-11', file: 'age-9-11' },
  { group: 'age', text: '12-17', file: 'age-12-17' },
  { group: 'age', text: '18-49', file: 'age-18-49' },
  { group: 'age', text: '50+', file: 'age-50-plus' },
  // Gender
  { group: 'gender', text: 'Male', file: 'male' },
  { group: 'gender', text: 'Female', file: 'female' },
]

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function routeToFilename(route) {
  // "/debug/11-910/axilla/0" → "11-910-axilla-0"
  return route.replace('/debug/', '').replace(/\//g, '-')
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true })
  await mkdir(resolve(OUTPUT_DIR, 'intro'), { recursive: true })
  await mkdir(resolve(OUTPUT_DIR, 'filters'), { recursive: true })
  await mkdir(resolve(OUTPUT_DIR, 'patients'), { recursive: true })
  await mkdir(resolve(OUTPUT_DIR, 'references'), { recursive: true })

  console.log(`Screenshots will be saved to: ${OUTPUT_DIR}`)
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Delay: ${DELAY}ms\n`)

  // Use the system Chrome — Playwright's bundled Chromium lacks WebGL/GPU support
  // needed for the Three.js carousel to render
  const browser = await chromium.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--enable-webgl',
      '--ignore-gpu-blocklist',
    ],
  })
  const VIEWPORT = { width: 1366, height: 1024 }
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  page.setDefaultTimeout(5000)
  page.setDefaultNavigationTimeout(5000)

  // ------------------------------------------------------------------
  // INTRO PAGE SCREENSHOTS
  // ------------------------------------------------------------------

  if (!SKIP_INTRO) {
    console.log('=== INTRO PAGE SCREENSHOTS ===\n')

    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    console.log('  Waiting for intro to load...')
    await page.getByText('Get Started', { exact: false }).first().waitFor({ state: 'visible', timeout: 10000 })
    await wait(DELAY)

    // Each step scrolls ~35% of the viewport height. The final step uses an
    // oversized delta (99999) which the browser clamps to the scroll maximum,
    // guaranteeing the last capture always shows the bottom of the content.
    const INTRO_STEPS = 4
    const STEP_DELTA = Math.floor(VIEWPORT.height * 0.35)
    const scrollable = page.locator('.intro-content-scrollable')

    for (let step = 0; step <= INTRO_STEPS; step++) {
      const filename = `intro-scroll-${step}.jpg`
      const filePath = resolve(OUTPUT_DIR, 'intro', filename)

      if (RESUME && existsSync(filePath)) {
        console.log(`  SKIP ${filename} (exists)`)
      } else {
        await page.screenshot({ path: filePath, type: 'jpeg', quality: 90 })
        const label = step === 0 ? 'top' : step === INTRO_STEPS ? 'bottom' : `~${STEP_DELTA * step}px`
        console.log(`  ${filename} (${label})`)
      }

      // Scroll before the next capture (skip after the last one)
      if (step < INTRO_STEPS) {
        const delta = step === INTRO_STEPS - 1 ? 99999 : STEP_DELTA
        await scrollable.hover()
        await page.mouse.wheel(0, delta)
        await wait(400)
      }
    }
  }

  // ------------------------------------------------------------------
  // FILTER SCREENSHOTS
  // ------------------------------------------------------------------

  if (!SKIP_FILTERS) {
    console.log('=== FILTER SCREENSHOTS ===\n')

    // Load app from root, wait for loading to finish, click through intro
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    console.log('  Waiting for app to load...')
    // Wait for the "Get Started" button to appear (loading complete)
    const getStarted = page.getByText('Get Started', { exact: false }).first()
    await getStarted.waitFor({ state: 'visible', timeout: 5000 })
    await wait(500)
    await getStarted.click()
    // Wait for main view to render
    await wait(3000)

    // Take a baseline screenshot (no filters)
    const baselinePath = resolve(OUTPUT_DIR, 'filters', 'reset-filters.jpg')
    if (!RESUME || !existsSync(baselinePath)) {
      await page.screenshot({ path: baselinePath, type: 'jpeg', quality: 90 })
      console.log('  reset-filters.jpg')
    } else {
      console.log('  SKIP reset-filters.jpg (exists)')
    }

    for (const filter of FILTER_OPTIONS) {
      try {
        const filename = `${filter.file}.jpg`
        const filePath = resolve(OUTPUT_DIR, 'filters', filename)

        if (RESUME && existsSync(filePath)) {
          console.log(`  SKIP ${filename} (exists)`)
          continue
        }

        // Find and click the button by its visible text
        const button = page.getByText(filter.text, { exact: true }).first()
        await button.click()
        await wait(DELAY)

        await page.screenshot({ path: filePath, type: 'jpeg', quality: 90 })
        console.log(`  ${filename}`)

        // Unclick (click again to deselect)
        await button.click()
        await wait(500)
      } catch (err) {
        console.error(`  SKIP ${filter.file}: ${err.message}`)
      }
    }
  }

  // ------------------------------------------------------------------
  // DEBUG ROUTE SCREENSHOTS
  // ------------------------------------------------------------------

  if (!SKIP_DEBUG) {
    console.log('\n=== DEBUG ROUTE SCREENSHOTS ===\n')

    const debugPath = resolve('./public/data/debug.json')
    const allRoutes = JSON.parse(readFileSync(debugPath, 'utf-8'))

    // Filter out image indexes > 2 — splitPatientData selects max 3 timepoints
    const routes = allRoutes.filter(route => {
      const indexMatch = route.match(/\/(\d+)$/)
      return !indexMatch || parseInt(indexMatch[1], 10) <= 2
    })

    for (const route of routes) {
      try {
        const filename = `${routeToFilename(route)}.jpg`
        const filePath = resolve(OUTPUT_DIR, 'patients', filename)

        if (RESUME && existsSync(filePath)) {
          console.log(`  SKIP ${filename} (exists)`)
          continue
        }

        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' })
        await wait(DELAY)

        await page.screenshot({ path: filePath, type: 'jpeg', quality: 90 })
        console.log(`  ${filename}`)
      } catch (err) {
        console.error(`  SKIP ${route}: ${err.message}`)
      }
    }
  }

  // ------------------------------------------------------------------
  // REFERENCES MODAL SCREENSHOT
  // ------------------------------------------------------------------

  if (!SKIP_REFERENCES) {
    console.log('\n=== REFERENCES MODAL SCREENSHOT ===\n')

    const refsPath = resolve(OUTPUT_DIR, 'references', 'references-modal.jpg')
    if (RESUME && existsSync(refsPath)) {
      console.log('  SKIP references-modal.jpg (exists)')
    } else {
      await page.goto(`${BASE_URL}/debug/references`, { waitUntil: 'networkidle' })
      await wait(DELAY)
      await page.screenshot({ path: refsPath, type: 'jpeg', quality: 90 })
      console.log('  references-modal.jpg')
    }
  }

  // ------------------------------------------------------------------
  // DONE
  // ------------------------------------------------------------------

  await browser.close()
  console.log('\nDone!')
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
