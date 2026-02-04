/**
 * FormulationFilter.jsx
 *
 * Filter component for selecting drug formulation types
 * Displays different formulation options (cream and foam variants) using radio-style selection
 * Allows toggling selection on/off for the formulation filter
 */

// #region Imports
import { FILTER_OPTIONS } from '../../../constants/index.js'
import appStateManager from '../../../managers/AppStateManager.js'
import FilterComponent from '../shared/FilterComponent.jsx'
import RadioOption from '../shared/RadioOption.jsx'
import '../shared/RadioFilter.css'
// #endregion

// #region Component
/**
 * FormulationFilter
 *
 * Renders formulation filter options as radio-style buttons within a FilterComponent container
 * Supports single selection with toggle behavior (click again to deselect)
 * Displays cream and foam formulation variants with different strengths
 *
 * @component
 * @param {string} currentSource - Current data source (CLINICAL_TRIAL or PRACTICE_BASED)
 * @param {string|null} selected - Currently selected formulation or null if none selected
 * @returns {ReactElement} Filter component with formulation radio options
 */
const FormulationFilter = ({ currentSource, selected }) => {
  // Available formulation options (cream and foam variants with different strengths)
  const formulations = [
    FILTER_OPTIONS.FORMULATION.CREAM_005,
    FILTER_OPTIONS.FORMULATION.CREAM_015,
    FILTER_OPTIONS.FORMULATION.CREAM_03,
    FILTER_OPTIONS.FORMULATION.FOAM_03,
  ]

  /**
   * Handle formulation selection
   * Toggle behavior: if clicking the same formulation, deselect it; otherwise select the new formulation
   * @param {string} formulation - Formulation to select/deselect
   */
  const handleSelect = (formulation) => {
    appStateManager.setFilter('formulation', formulation === selected ? null : formulation)
  }

  return (
    <FilterComponent title="Formulation" currentSource={currentSource}>
      <div className="radio-filter">
        {/* Render formulation radio option buttons */}
        {formulations.map((formulation) => (
          <RadioOption
            key={formulation}
            value={formulation}
            label={formulation}
            isSelected={selected === formulation}
            onClick={() => handleSelect(formulation)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}
// #endregion

export default FormulationFilter
