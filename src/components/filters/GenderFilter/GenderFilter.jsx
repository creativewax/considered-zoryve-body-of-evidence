/**
 * GenderFilter.jsx
 *
 * Filter component for selecting gender
 * Displays gender options with icons as selectable buttons
 * Allows toggling selection on/off for the gender filter
 */

// #region Imports
import { FILTER_OPTIONS, ASSETS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import GenderOption from './GenderOption.jsx'
import './GenderFilter.css'
// #endregion

// #region Component
/**
 * GenderFilter
 *
 * Renders gender filter options with icons within a FilterComponent container
 * Supports single selection with toggle behavior (click again to deselect)
 *
 * @component
 * @param {string} currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {string|null} selected - Currently selected gender or null if none selected
 * @returns {ReactElement} Filter component with gender option buttons
 */
const GenderFilter = ({ currentSource, selected }) => {
  // Available gender options with associated icons
  const genders = [
    { value: FILTER_OPTIONS.GENDER.MALE, icon: ASSETS.ICONS.MALE },
    { value: FILTER_OPTIONS.GENDER.FEMALE, icon: ASSETS.ICONS.FEMALE },
  ]

  /**
   * Handle gender selection
   * Toggle behavior: if clicking the same gender, deselect it; otherwise select the new gender
   * @param {string} gender - Gender to select/deselect
   */
  const handleSelect = (gender) => {
    appStateManager.setFilter('gender', gender === selected ? null : gender)
  }

  return (
    <FilterComponent title="Gender" currentSource={currentSource}>
      <div className="gender-filter">
        {/* Render gender option buttons with icons */}
        {genders.map((gender) => (
          <GenderOption
            key={gender.value}
            value={gender.value}
            label={gender.value}
            icon={gender.icon}
            isSelected={selected === gender.value}
            onClick={() => handleSelect(gender.value)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}
// #endregion

export default GenderFilter
