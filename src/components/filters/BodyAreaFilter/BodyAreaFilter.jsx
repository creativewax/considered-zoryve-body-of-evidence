/**
 * BodyAreaFilter.jsx
 *
 * Filter component for selecting body area locations. Radio-style selection, single select with toggle.
 * currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * selected - Currently selected body area or null if none selected
 */

import { FILTER_OPTIONS, FILTER_KEYS } from '../../../constants/index.js'
import eventSystem from '../../../utils/EventSystem.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import RadioOption from '../shared/RadioOption.jsx'
import '../shared/RadioFilter.css'
import './BodyAreaFilter.css'

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const BodyAreaFilter = ({ currentSource, selected }) => {
  const bodyAreas = [
    FILTER_OPTIONS.BODY_AREA.HEAD_NECK,
    FILTER_OPTIONS.BODY_AREA.TORSO,
    FILTER_OPTIONS.BODY_AREA.ARMS_HANDS,
    FILTER_OPTIONS.BODY_AREA.LEGS_FEET,
  ]

  // Handle body area selection; emits FILTER_SELECTED for FilterManager
  const handleSelect = (bodyArea) => {
    eventSystem.emit(eventSystem.constructor.EVENTS.FILTER_SELECTED, {
      filterType: FILTER_KEYS.BODY_AREA,
      value: bodyArea === selected ? null : bodyArea
    })
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <FilterComponent title="Body Area" currentSource={currentSource}>
      <div className="body-area-filter">
        {/* Decorative background element */}
        <div className="body-area-filter-background" />
        {/* Body area radio option buttons */}
        <div className="radio-filter body-area-filter-options">
          {bodyAreas.map((bodyArea) => (
            <RadioOption
              key={bodyArea}
              value={bodyArea}
              label={bodyArea}
              isSelected={selected === bodyArea}
              onClick={() => handleSelect(bodyArea)}
            />
          ))}
        </div>
      </div>
    </FilterComponent>
  )
}

export default BodyAreaFilter
