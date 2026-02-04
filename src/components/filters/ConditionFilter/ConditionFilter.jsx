/**
 * ConditionFilter.jsx
 *
 * Filter component for selecting dermatological conditions
 * Displays three condition types with color-coded styling
 * Allows toggling selection on/off for the condition filter
 */

// #region Imports
import { FILTER_OPTIONS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import ConditionOption from './ConditionOption.jsx'
import './ConditionFilter.css'
// #endregion

// #region Component
/**
 * ConditionFilter
 *
 * Renders condition filter options with color-coded styling within a FilterComponent container
 * Supports single selection with toggle behavior (click again to deselect)
 * Uses condensed layout for more compact display
 *
 * @component
 * @param {string} currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {string|null} selected - Currently selected condition or null if none selected
 * @returns {ReactElement} Filter component with condition option buttons
 */
const ConditionFilter = ({ currentSource, selected }) => {
  // Available conditions with associated color-coding classes
  const conditions = [
    { value: FILTER_OPTIONS.CONDITION.PLAQUE_PSORIASIS, colorClass: 'condition-button-plaque-psoriasis' },
    { value: FILTER_OPTIONS.CONDITION.ATOPIC_DERMATITIS, colorClass: 'condition-button-atopic-dermatitis' },
    { value: FILTER_OPTIONS.CONDITION.SEBORRHEIC_DERMATITIS, colorClass: 'condition-button-seborrheic-dermatitis' },
  ]

  /**
   * Handle condition selection
   * Toggle behavior: if clicking the same condition, deselect it; otherwise select the new condition
   * @param {string} condition - Condition to select/deselect
   */
  const handleSelect = (condition) => {
    appStateManager.setFilter('condition', condition === selected ? null : condition)
  }

  return (
    <FilterComponent title="Condition" currentSource={currentSource} condensed>
      <div className="condition-filter">
        {/* Render color-coded condition option buttons */}
        {conditions.map((condition) => (
          <ConditionOption
            key={condition.value}
            value={condition.value}
            label={condition.value}
            colorClass={condition.colorClass}
            isSelected={selected === condition.value}
            onClick={() => handleSelect(condition.value)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}
// #endregion

export default ConditionFilter
