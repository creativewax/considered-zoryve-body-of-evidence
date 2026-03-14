/**
 * BodyAreaSelector.jsx
 *
 * Shows the patient's body area as a small button. For multi-body-area patients,
 * displays a button per body area — clicking jumps to that patient's detail overlay.
 */

import { PATIENT_SCHEMA } from '../../../constants/index.js'
import dataManager from '../../../managers/DataManager.js'
import eventSystem from '../../../utils/EventSystem.js'
import './BodyAreaSelector.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const BodyAreaSelector = ({ patient }) => {
  const isMulti = patient[PATIENT_SCHEMA.MULTI_BODY_AREA] === true
  const currentBodyArea = patient[PATIENT_SCHEMA.BODY_AREA]

  // Single body area — one disabled button
  if (!isMulti) {
    return (
      <div className="body-area-selector-single">
        <button className="body-area-button" disabled>
          {currentBodyArea}
        </button>
      </div>
    )
  }

  // Multi body area — find all sibling entries, sorted alphabetically
  const relatedPatients = dataManager.getRelatedPatients(patient[PATIENT_SCHEMA.PATIENT_ID])

  const handleClick = (targetPatient) => {
    const imageData = dataManager.getFirstValidImage(targetPatient)
    if (imageData) {
      eventSystem.emit(eventSystem.constructor.EVENTS.IMAGE_SELECTED, imageData)
    }
  }

  return (
    <div className="body-area-selector-multi">
      {relatedPatients.map((p) => {
        const bodyArea = p[PATIENT_SCHEMA.BODY_AREA]
        const isCurrent = bodyArea === currentBodyArea

        return (
          <button
            key={bodyArea}
            className={`body-area-button ${isCurrent ? 'body-area-button-active' : ''}`}
            disabled={isCurrent}
            onClick={() => handleClick(p)}
          >
            {bodyArea}
          </button>
        )
      })}
    </div>
  )
}

export default BodyAreaSelector
