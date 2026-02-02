import { FILTER_OPTIONS, ASSETS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import GenderOption from './GenderOption.jsx'
import './GenderFilter.css'

const GenderFilter = ({ currentSource, selected }) => {
  const genders = [
    { value: FILTER_OPTIONS.GENDER.MALE, icon: ASSETS.ICONS.MALE },
    { value: FILTER_OPTIONS.GENDER.FEMALE, icon: ASSETS.ICONS.FEMALE },
  ]

  const handleSelect = (gender) => {
    appStateManager.setFilter('gender', gender === selected ? null : gender)
  }

  return (
    <FilterComponent title="Gender" currentSource={currentSource}>
      <div className="gender-filter">
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

export default GenderFilter
