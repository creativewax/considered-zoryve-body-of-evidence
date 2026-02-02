import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import RadioOption from './RadioOption.jsx'
import './RadioFilter.css'

const BaselineSeverityFilter = ({ currentSource, selected }) => {
  const severities = [
    FILTER_OPTIONS.BASELINE_SEVERITY.MILD,
    FILTER_OPTIONS.BASELINE_SEVERITY.MODERATE,
    FILTER_OPTIONS.BASELINE_SEVERITY.SEVERE,
  ]

  const handleSelect = (severity) => {
    appStateManager.setFilter('baselineSeverity', severity === selected ? null : severity)
  }

  return (
    <FilterComponent title="Baseline Severity" currentSource={currentSource}>
      <div className="radio-filter">
        {severities.map((severity) => (
          <RadioOption
            key={severity}
            value={severity}
            label={severity}
            isSelected={selected === severity}
            onClick={() => handleSelect(severity)}
          />
        ))}
      </div>
    </FilterComponent>
  )
}

export default BaselineSeverityFilter
