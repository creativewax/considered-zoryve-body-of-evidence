/**
 * PracticeBasedDisclaimer.jsx
 *
 * Disclaimer text for Practice-Based patient overlays.
 * Positioned to the left, aligned with the left edge of the overlay.
 */

import './PracticeBasedDisclaimer.css'

const PracticeBasedDisclaimer = () => {
  return (
    <div className="practice-based-disclaimer">
      <p>
        Severity rating was determined by the treating healthcare provider. Itch scores were provided by the patient to the healthcare provider via an in-person survey at the time of visit. These are real-world patients and may have other factors influencing treatment results. Individual results may vary.<br /><br />
        Actual patient treated with ZORYVE. Not a clinical trial patient.
      </p>
    </div>
  )
}

export default PracticeBasedDisclaimer
