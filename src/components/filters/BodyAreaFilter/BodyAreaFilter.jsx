/**
 * BodyAreaFilter.jsx
 *
 * Filter component for selecting body area locations
 * Displays four body area options using radio-style selection
 * Includes decorative background element for visual enhancement
 */

// #region Imports
import { FILTER_OPTIONS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import RadioOption from '../shared/RadioOption.jsx'
import '../shared/RadioFilter.css'
import './BodyAreaFilter.css'
// #endregion

// #region Component
/**
 * BodyAreaFilter
 *
 * Renders body area filter options as radio-style buttons within a FilterComponent container
 * Supports single selection with toggle behavior (click again to deselect)
 * Includes decorative background element
 *
 * @component
 * @param {string} currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {string|null} selected - Currently selected body area or null if none selected
 * @returns {ReactElement} Filter component with body area radio options
 */
const BodyAreaFilter = ({ currentSource, selected }) => {
  // Available body area options for filtering
  const bodyAreas = [
    FILTER_OPTIONS.BODY_AREA.HEAD_NECK,
    FILTER_OPTIONS.BODY_AREA.TORSO,
    FILTER_OPTIONS.BODY_AREA.ARMS_HANDS,
    FILTER_OPTIONS.BODY_AREA.LEGS_FEET,
  ]

  /**
   * Handle body area selection
   * Toggle behavior: if clicking the same area, deselect it; otherwise select the new area
   * @param {string} bodyArea - Body area to select/deselect
   */
  const handleSelect = (bodyArea) => {
    appStateManager.setFilter('bodyArea', bodyArea === selected ? null : bodyArea)
  }

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
// #endregion

export default BodyAreaFilter
