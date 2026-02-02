import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import FilterButton from './FilterButton.jsx'
import './AgeFilter.css'

const AgeFilter = ({ currentSource, selected }) => {
  const ageRanges = [
    FILTER_OPTIONS.AGE_RANGES.RANGE_2_5,
    FILTER_OPTIONS.AGE_RANGES.RANGE_6_18,
    FILTER_OPTIONS.AGE_RANGES.RANGE_19_30,
    FILTER_OPTIONS.AGE_RANGES.RANGE_31_50,
    FILTER_OPTIONS.AGE_RANGES.RANGE_50_PLUS,
  ]

  const handleSelect = (age) => {
    appStateManager.setFilter('age', age === selected ? null : age)
  }

  return (
    <FilterComponent title="Age" currentSource={currentSource}>
      <div className="age-filter">
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

export default AgeFilter
