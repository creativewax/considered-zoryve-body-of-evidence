/**
 * AgeFilter.jsx
 *
 * Filter component for selecting age ranges
 * Displays multiple age range options as selectable buttons
 * Allows toggling selection on/off for the age filter
 */

// #region Imports
import { FILTER_OPTIONS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import FilterButton from '../shared/FilterButton.jsx'
import './AgeFilter.css'
// #endregion

// #region Component
/**
 * AgeFilter
 *
 * Renders age range filter options as selectable buttons within a FilterComponent container
 * Supports single selection with toggle behavior (click again to deselect)
 *
 * @component
 * @param {string} currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {string|null} selected - Currently selected age range or null if none selected
 * @returns {ReactElement} Filter component with age range buttons
 */
const AgeFilter = ({ currentSource, selected }) => {
  // Available age ranges for filtering
  const ageRanges = [
    FILTER_OPTIONS.AGE_RANGES.RANGE_2_5,
    FILTER_OPTIONS.AGE_RANGES.RANGE_6_18,
    FILTER_OPTIONS.AGE_RANGES.RANGE_19_30,
    FILTER_OPTIONS.AGE_RANGES.RANGE_31_50,
    FILTER_OPTIONS.AGE_RANGES.RANGE_50_PLUS,
  ]

  /**
   * Handle age range selection
   * Toggle behavior: if clicking the same range, deselect it; otherwise select the new range
   * @param {string} age - Age range to select/deselect
   */
  const handleSelect = (age) => {
    appStateManager.setFilter('age', age === selected ? null : age)
  }

  return (
    <FilterComponent title="Age" currentSource={currentSource}>
      <div className="age-filter">
        {/* Render age range buttons */}
        {ageRanges.map((age) => (
          <FilterButton
            key={age}
            value={age}
            label={age}
            isSelected={selected === age}
            onClick={() => handleSelect(age)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}
// #endregion

export default AgeFilter
