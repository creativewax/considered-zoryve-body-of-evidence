import { FILTER_OPTIONS } from '../../constants/index.js'
import appStateManager from '../../managers/AppStateManager.js'
import FilterComponent from './FilterComponent.jsx'
import RadioOption from './RadioOption.jsx'
import './RadioFilter.css'
import './BodyAreaFilter.css'

const BodyAreaFilter = ({ currentSource, selected }) => {
  const bodyAreas = [
    FILTER_OPTIONS.BODY_AREA.HEAD_NECK,
    FILTER_OPTIONS.BODY_AREA.TORSO,
    FILTER_OPTIONS.BODY_AREA.ARMS_HANDS,
    FILTER_OPTIONS.BODY_AREA.LEGS_FEET,
  ]

  const handleSelect = (bodyArea) => {
    appStateManager.setFilter('bodyArea', bodyArea === selected ? null : bodyArea)
  }

  return (
    <FilterComponent title="Body Area" currentSource={currentSource}>
      <div className="body-area-filter">
        <div className="body-area-filter__background" />
        <div className="radio-filter body-area-filter__options">
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
