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
 *   --filters-only                     (skip debug routes)
 *   --debug-only                       (skip filter screenshots)
 */

import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import { readFileSync } from 'fs'

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
const SKIP_FILTERS = args['debug-only'] === true
const SKIP_DEBUG = args['filters-only'] === true

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
  { group: 'bodyArea', text: 'Legs and feet', file: 'legs-and-feet' },
  { group: 'bodyArea', text: 'Multiple body parts', file: 'multiple-body-parts' },
  // Baseline Severity
  { group: 'severity', text: 'Mild', file: 'mild' },
  { group: 'severity', text: 'Moderate', file: 'moderate' },
  { group: 'severity', text: 'Severe', file: 'severe' },
  // Age
  { group: 'age', text: '2-5', file: 'age-2-5' },
  { group: 'age', text: '6-18', file: 'age-6-18' },
  { group: 'age', text: '19-30', file: 'age-19-30' },
  { group: 'age', text: '31-50', file: 'age-31-50' },
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
  await mkdir(resolve(OUTPUT_DIR, 'filters'), { recursive: true })
  await mkdir(resolve(OUTPUT_DIR, 'patients'), { recursive: true })

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
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

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
    await getStarted.waitFor({ state: 'visible', timeout: 30000 })
    await wait(500)
    await getStarted.click()
    // Wait for main view to render
    await wait(3000)

    // Take a baseline screenshot (no filters)
    await page.screenshot({ path: resolve(OUTPUT_DIR, 'filters', 'reset-filters.png') })
    console.log('  reset-filters.png')

    for (const filter of FILTER_OPTIONS) {
      try {
        // Find and click the button by its visible text
        const button = page.getByText(filter.text, { exact: true }).first()
        await button.click()
        await wait(DELAY)

        // Screenshot
        const filename = `${filter.file}.png`
        await page.screenshot({ path: resolve(OUTPUT_DIR, 'filters', filename) })
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
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' })
        await wait(DELAY)

        const filename = `${routeToFilename(route)}.png`
        await page.screenshot({ path: resolve(OUTPUT_DIR, 'patients', filename) })
        console.log(`  ${filename}`)
      } catch (err) {
        console.error(`  SKIP ${route}: ${err.message}`)
      }
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
